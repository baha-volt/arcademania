import { describe, it, expect, vi } from 'vitest';
import { createPinballCardElement } from '../../src/components/PinballCard/PinballCard';
import { createErrorStateElement, createEmptyStateElement } from '../../src/components/StateViews/StateViews';
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

describe('createPinballCardElement', () => {
  it('retorna un HTMLElement', () => {
    const card = createPinballCardElement(makeMachine());
    expect(card).toBeInstanceOf(HTMLElement);
  });

  it('muestra el nombre del modelo en el DOM', () => {
    const card = createPinballCardElement(makeMachine({ modelName: 'Twilight Zone' }));
    expect(card.textContent).toContain('Twilight Zone');
  });

  it('muestra fabricante y año', () => {
    const card = createPinballCardElement(makeMachine({ manufacturer: 'Williams', releaseYear: 1993 }));
    expect(card.textContent).toContain('Williams');
    expect(card.textContent).toContain('1993');
  });

  it('usa el placeholder cuando imageUrl es undefined', () => {
    const card = createPinballCardElement(makeMachine({ imageUrl: undefined }));
    const img = card.querySelector('img');
    expect(img?.src).toContain('pinball-placeholder.svg');
  });

  it('muestra el botón de eliminar cuando se pasa onDelete', () => {
    const card = createPinballCardElement(makeMachine(), vi.fn());
    expect(card.querySelector('button')).not.toBeNull();
  });

  it('NO muestra el botón de eliminar cuando no se pasa onDelete', () => {
    const card = createPinballCardElement(makeMachine());
    expect(card.querySelector('button')).toBeNull();
  });

  it('invoca onDelete con el id correcto al hacer click', () => {
    const onDelete = vi.fn();
    const card = createPinballCardElement(makeMachine({ id: 42 }), onDelete);
    const btn = card.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(onDelete).toHaveBeenCalledWith(42);
  });
});

describe('createErrorStateElement', () => {
  it('retorna un HTMLElement', () => {
    const el = createErrorStateElement('Error de red', vi.fn());
    expect(el).toBeInstanceOf(HTMLElement);
  });

  it('muestra el mensaje de error recibido', () => {
    const el = createErrorStateElement('HTTP 500 Internal Server Error', vi.fn());
    expect(el.textContent).toContain('HTTP 500 Internal Server Error');
  });

  it('invoca el callback onRetry al hacer click en Reintentar', () => {
    const onRetry = vi.fn();
    const el = createErrorStateElement('Error', onRetry);
    const btn = el.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('createEmptyStateElement', () => {
  it('retorna un HTMLElement', () => {
    const el = createEmptyStateElement();
    expect(el).toBeInstanceOf(HTMLElement);
  });

  it('contiene texto alusivo a la colección vacía', () => {
    const el = createEmptyStateElement();
    expect(el.textContent?.toLowerCase()).toContain('vacía');
  });
});
