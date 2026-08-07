export enum RarityTier {
  LEYENDA = 'Leyenda',
  EDICION_LIMITADA = 'Edición Limitada',
  DE_COLECCION = 'De Colección',
  ESTANDAR = 'Estándar',
}

export interface PinballMachine {
  id: number;
  modelName: string;
  manufacturer: string;
  rarityTier: RarityTier;
  imageUrl?: string;
  historicalSummary?: string;
  releaseYear: number;
  unitsProduced?: number;
  restorationCostUsd?: number;
  conditionRating?: number; // Escala de 1.0 a 5.0
  isFullyFunctional: boolean;
  hasMultiball: boolean;
}

export type NewPinballMachinePayload = Omit<PinballMachine, 'id'>;
