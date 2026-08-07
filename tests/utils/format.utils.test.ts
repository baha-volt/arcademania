import { describe, it, expect } from 'vitest';
import {
  formatCurrencyUsd,
  formatConditionRating,
  formatUnitsProduced,
} from '../../src/utils/format.utils';

describe('formatCurrencyUsd', () => {
  it('formatea un número válido en dólares', () => {
    const result = formatCurrencyUsd(3500);
    expect(result).toContain('3.500');
  });

  it('devuelve texto de respaldo cuando el valor es undefined', () => {
    expect(formatCurrencyUsd(undefined)).toBe('Costo no registrado');
  });

  it('devuelve texto de respaldo cuando el valor es NaN', () => {
    expect(formatCurrencyUsd(NaN)).toBe('Costo no registrado');
  });

  it('formatea cero correctamente', () => {
    const result = formatCurrencyUsd(0);
    expect(result).toContain('0');
  });
});

describe('formatConditionRating', () => {
  it('formatea un rating válido con una decimal', () => {
    expect(formatConditionRating(4.2)).toBe('4.2 / 5.0');
  });

  it('clampea valores por encima de 5', () => {
    expect(formatConditionRating(8)).toBe('5.0 / 5.0');
  });

  it('clampea valores por debajo de 0', () => {
    expect(formatConditionRating(-1)).toBe('0.0 / 5.0');
  });

  it('devuelve texto de respaldo cuando el valor es undefined', () => {
    expect(formatConditionRating(undefined)).toBe('Sin evaluar');
  });

  it('devuelve texto de respaldo cuando el valor es NaN', () => {
    expect(formatConditionRating(NaN)).toBe('Sin evaluar');
  });
});

describe('formatUnitsProduced', () => {
  it('formatea con separador de miles', () => {
    const result = formatUnitsProduced(10450);
    expect(result).toContain('10');
    expect(result).toContain('450');
  });

  it('devuelve texto de respaldo cuando el valor es undefined', () => {
    expect(formatUnitsProduced(undefined)).toBe('Cantidad desconocida');
  });

  it('devuelve texto de respaldo cuando el valor es NaN', () => {
    expect(formatUnitsProduced(NaN)).toBe('Cantidad desconocida');
  });

  it('formatea correctamente el valor 1', () => {
    const result = formatUnitsProduced(1);
    expect(result).toBe('1');
  });
});
