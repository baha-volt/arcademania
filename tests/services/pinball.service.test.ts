import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PinballService } from '../../src/services/pinball.service';
import { RarityTier, type PinballMachine } from '../../src/models';

const makeMachine = (overrides: Partial<PinballMachine> = {}): PinballMachine => ({
  id: 1,
  modelName: 'Theater of Magic',
  manufacturer: 'Bally',
  rarityTier: RarityTier.LEYENDA,
  releaseYear: 1994,
  isFullyFunctional: true,
  hasMultiball: true,
  ...overrides,
});

describe('PinballService.getAllPinballs', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna un array vacío cuando el servidor responde 204', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 204, ok: true, json: vi.fn() }),
    );
    const result = await PinballService.getAllPinballs(0);
    expect(result).toEqual([]);
  });

  it('retorna máquinas tipadas cuando el servidor responde 200 con datos', async () => {
    const raw = [
      {
        id: 1,
        modelName: 'Theater of Magic',
        manufacturer: 'Bally',
        rarityTier: 'Leyenda',
        releaseYear: 1994,
        isFullyFunctional: true,
        hasMultiball: true,
      },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 200, ok: true, json: vi.fn().mockResolvedValue(raw) }),
    );
    const result = await PinballService.getAllPinballs(0);
    expect(result).toHaveLength(1);
    expect(result[0].modelName).toBe('Theater of Magic');
    expect(result[0].rarityTier).toBe(RarityTier.LEYENDA);
  });

  it('aplica rareza ESTANDAR como respaldo cuando el valor no es válido', async () => {
    const raw = [
      { id: 2, modelName: 'Mystery Machine', manufacturer: 'Stern', rarityTier: 'INVALIDO', releaseYear: 2005, isFullyFunctional: false, hasMultiball: false },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 200, ok: true, json: vi.fn().mockResolvedValue(raw) }),
    );
    const result = await PinballService.getAllPinballs(0);
    expect(result[0].rarityTier).toBe(RarityTier.ESTANDAR);
  });

  it('lanza un Error cuando response.ok es false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 500, ok: false, statusText: 'Internal Server Error' }),
    );
    await expect(PinballService.getAllPinballs(0)).rejects.toThrow('Error HTTP');
  });

  it('lanza un Error cuando la respuesta no es un array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 200, ok: true, json: vi.fn().mockResolvedValue({ error: 'mal' }) }),
    );
    await expect(PinballService.getAllPinballs(0)).rejects.toThrow('formato válido');
  });
});

describe('PinballService.getFeaturedPinball', () => {
  it('retorna null cuando no hay máquinas', () => {
    expect(PinballService.getFeaturedPinball([])).toBeNull();
  });

  it('prefiere una máquina con rareza LEYENDA', () => {
    const machines: PinballMachine[] = [
      makeMachine({ id: 1, rarityTier: RarityTier.ESTANDAR }),
      makeMachine({ id: 2, rarityTier: RarityTier.LEYENDA }),
    ];
    expect(PinballService.getFeaturedPinball(machines)?.id).toBe(2);
  });

  it('retorna la primera máquina si ninguna es LEYENDA', () => {
    const machines: PinballMachine[] = [
      makeMachine({ id: 5, rarityTier: RarityTier.ESTANDAR }),
      makeMachine({ id: 6, rarityTier: RarityTier.DE_COLECCION }),
    ];
    expect(PinballService.getFeaturedPinball(machines)?.id).toBe(5);
  });
});

describe('PinballService.getGridPinballs', () => {
  it('retorna todas las máquinas cuando solo hay una', () => {
    const machines = [makeMachine({ id: 1 })];
    expect(PinballService.getGridPinballs(machines)).toHaveLength(1);
  });

  it('excluye la máquina destacada de la grilla', () => {
    const machines: PinballMachine[] = [
      makeMachine({ id: 1, rarityTier: RarityTier.LEYENDA }),
      makeMachine({ id: 2, rarityTier: RarityTier.ESTANDAR }),
      makeMachine({ id: 3, rarityTier: RarityTier.DE_COLECCION }),
    ];
    const grid = PinballService.getGridPinballs(machines);
    expect(grid).toHaveLength(2);
    expect(grid.find((m) => m.id === 1)).toBeUndefined();
  });
});

describe('PinballService.deletePinball', () => {
  it('resuelve sin error cuando el servidor responde 204', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 204 }),
    );
    await expect(PinballService.deletePinball(1)).resolves.toBeUndefined();
  });

  it('lanza un Error cuando response.ok es false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' }),
    );
    await expect(PinballService.deletePinball(999)).rejects.toThrow('No fue posible eliminar');
  });
});
