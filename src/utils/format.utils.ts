export function formatCurrencyUsd(amount?: number): string {
  if (amount === undefined || Number.isNaN(amount)) {
    return 'Costo no registrado';
  }
  try {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `US$ ${amount.toFixed(0)}`;
  }
}

export function formatConditionRating(rating?: number): string {
  if (rating === undefined || Number.isNaN(rating)) {
    return 'Sin evaluar';
  }
  const clamped = Math.min(5, Math.max(0, rating));
  return `${clamped.toFixed(1)} / 5.0`;
}

export function formatUnitsProduced(units?: number): string {
  if (units === undefined || Number.isNaN(units)) {
    return 'Cantidad desconocida';
  }
  return new Intl.NumberFormat('es-CL').format(units);
}
