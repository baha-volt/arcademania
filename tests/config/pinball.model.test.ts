import { describe, it, expect } from 'vitest';
import { RarityTier } from '../../src/models/pinball.model';

describe('RarityTier enum', () => {
  it('tiene el valor LEYENDA correcto', () => {
    expect(RarityTier.LEYENDA).toBe('Leyenda');
  });

  it('tiene el valor EDICION_LIMITADA correcto', () => {
    expect(RarityTier.EDICION_LIMITADA).toBe('Edición Limitada');
  });

  it('tiene el valor DE_COLECCION correcto', () => {
    expect(RarityTier.DE_COLECCION).toBe('De Colección');
  });

  it('tiene el valor ESTANDAR correcto', () => {
    expect(RarityTier.ESTANDAR).toBe('Estándar');
  });

  it('tiene exactamente 4 niveles de rareza', () => {
    expect(Object.keys(RarityTier)).toHaveLength(4);
  });
});
