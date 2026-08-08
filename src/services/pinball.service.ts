import { type PinballMachine, type NewPinballMachinePayload, RarityTier } from '../models';
import { APP_CONFIG } from '../config/app.config';

interface RawPinballMachine {
  id?: unknown;
  modelName?: unknown;
  manufacturer?: unknown;
  rarityTier?: unknown;
  imageUrl?: unknown;
  historicalSummary?: unknown;
  releaseYear?: unknown;
  unitsProduced?: unknown;
  restorationCostUsd?: unknown;
  conditionRating?: unknown;
  isFullyFunctional?: unknown;
  hasMultiball?: unknown;
}

const RARITY_VALUES: string[] = Object.values(RarityTier);

function isRarityTier(value: unknown): value is RarityTier {
  return typeof value === 'string' && RARITY_VALUES.includes(value);
}

function toOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : undefined;
}

// Maps raw API response to a typed PinballMachine, using unknown instead of any for strict type safety
function mapToPinballMachine(raw: RawPinballMachine): PinballMachine {
  return {
    id: toOptionalNumber(raw.id) ?? 0,
    modelName:
      typeof raw.modelName === 'string' && raw.modelName.trim() !== ''
        ? raw.modelName
        : 'Modelo sin identificar',
    manufacturer:
      typeof raw.manufacturer === 'string' && raw.manufacturer.trim() !== ''
        ? raw.manufacturer
        : 'Fabricante desconocido',
    rarityTier: isRarityTier(raw.rarityTier) ? raw.rarityTier : RarityTier.ESTANDAR,
    imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : undefined,
    historicalSummary:
      typeof raw.historicalSummary === 'string' ? raw.historicalSummary : undefined,
    releaseYear: toOptionalNumber(raw.releaseYear) ?? new Date().getFullYear(),
    unitsProduced: toOptionalNumber(raw.unitsProduced),
    restorationCostUsd: toOptionalNumber(raw.restorationCostUsd),
    conditionRating: toOptionalNumber(raw.conditionRating),
    isFullyFunctional: Boolean(raw.isFullyFunctional),
    hasMultiball: Boolean(raw.hasMultiball),
  };
}

export class PinballService {
  private static readonly BASE_URL = APP_CONFIG.PINBALLS_API_URL;

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


  static async getAllPinballs(
    delayMs: number = APP_CONFIG.SIMULATED_NETWORK_DELAY_MS,
  ): Promise<PinballMachine[]> {
    if (delayMs > 0) {
      await this.delay(delayMs);
    }

    const response = await fetch(this.BASE_URL);

    // 204 means the collection is empty (no body), must be handled before calling response.json()
    if (response.status === 204) {
      return [];
    }

    if (!response.ok) {
      throw new Error(
        `Error HTTP al obtener las máquinas: status ${response.status} (${response.statusText})`,
      );
    }

    const rawData: unknown = await response.json();

    if (!Array.isArray(rawData)) {
      throw new Error(
        'La respuesta del catálogo no tiene un formato válido (se esperaba un array).',
      );
    }

    return rawData.map((item) => mapToPinballMachine(item as RawPinballMachine));
  }


  static async createPinball(payload: NewPinballMachinePayload): Promise<PinballMachine> {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `No fue posible registrar la máquina: status ${response.status} (${response.statusText})`,
      );
    }

    const created: unknown = await response.json();
    return mapToPinballMachine(created as RawPinballMachine);
  }


  static async deletePinball(id: number): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error(
        `No fue posible eliminar la máquina: status ${response.status} (${response.statusText})`,
      );
    }
  }


  static getFeaturedPinball(machines: PinballMachine[]): PinballMachine | null {
    if (machines.length === 0) return null;
    return machines.find((m) => m.rarityTier === RarityTier.LEYENDA) || machines[0];
  }


  static getGridPinballs(machines: PinballMachine[]): PinballMachine[] {
    if (machines.length <= 1) return machines;
    const featured = this.getFeaturedPinball(machines);
    return machines.filter((m) => m.id !== featured?.id);
  }
}
