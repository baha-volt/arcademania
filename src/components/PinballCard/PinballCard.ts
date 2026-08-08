import type { PinballMachine } from '../../models';
import { RarityTier } from '../../models';
import { createIconElement } from '../../utils/icon.utils';
import { formatCurrencyUsd, formatConditionRating, formatUnitsProduced } from '../../utils/format.utils';
import { Trash2, CheckCircle, XCircle, Gamepad2, Star } from 'lucide';

interface RarityConfig {
  badgeClass: string;
  sealColor: string;
  label: string;
}

function getRarityConfig(tier: RarityTier): RarityConfig {
  const map: Record<RarityTier, RarityConfig> = {
    [RarityTier.LEYENDA]: {
      badgeClass: 'text-[--color-arcade-gold] border-[--color-arcade-gold]',
      sealColor: 'text-[--color-arcade-gold-bright]',
      label: 'Leyenda',
    },
    [RarityTier.EDICION_LIMITADA]: {
      badgeClass: 'text-[--color-arcade-violet] border-[--color-arcade-violet]',
      sealColor: 'text-[--color-arcade-violet]',
      label: 'Ed. Limitada',
    },
    [RarityTier.DE_COLECCION]: {
      badgeClass: 'text-[--color-arcade-teal] border-[--color-arcade-teal]',
      sealColor: 'text-[--color-arcade-teal]',
      label: 'De Colección',
    },
    [RarityTier.ESTANDAR]: {
      badgeClass: 'text-[--color-arcade-steel] border-[--color-arcade-steel]',
      sealColor: 'text-[--color-arcade-steel]',
      label: 'Estándar',
    },
  };
  return map[tier] ?? map[RarityTier.ESTANDAR];
}

export function createPinballCardElement(
  machine: PinballMachine,
  onDelete?: (id: number) => void,
): HTMLElement {
  const config = getRarityConfig(machine.rarityTier);

  const article = document.createElement('article');
  article.className =
    'relative flex flex-col bg-[--color-arcade-surface] border border-[--color-arcade-line] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-[--color-arcade-gold]/40 transition-all duration-200 group';

  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'relative h-40 overflow-hidden bg-[--color-arcade-base] shrink-0';

  const img = document.createElement('img');
  img.src = machine.imageUrl ?? '/images/pinball-placeholder.svg';
  img.alt = machine.modelName;
  img.className =
    'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300';
  // onerror must be assigned before src to ensure the handler is ready when the browser fires the event
  img.onerror = () => {
    img.src = '/images/pinball-placeholder.svg';
  };

  const seal = document.createElement('span');
  seal.className = `rarity-seal absolute top-3 right-3 text-[9px] font-bold uppercase px-2 py-0.5 ${config.sealColor}`;
  seal.textContent = config.label;

  imgWrapper.appendChild(img);
  imgWrapper.appendChild(seal);
  article.appendChild(imgWrapper);

  const body = document.createElement('div');
  body.className = 'flex flex-col gap-3 p-4 flex-1';

  const header = document.createElement('header');

  const modelName = document.createElement('h3');
  modelName.className =
    'font-display text-sm font-bold text-[--color-arcade-cream] leading-tight line-clamp-2';
  modelName.textContent = machine.modelName;

  const manufacturer = document.createElement('p');
  manufacturer.className = 'text-xs text-[--color-arcade-muted] mt-0.5 font-medium';
  manufacturer.textContent = `${machine.manufacturer} · ${machine.releaseYear}`;

  header.appendChild(modelName);
  header.appendChild(manufacturer);
  body.appendChild(header);

  const divider = document.createElement('hr');
  divider.className = 'border-[--color-arcade-line]';
  body.appendChild(divider);

  const metrics = document.createElement('dl');
  metrics.className = 'grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]';

  const addMetric = (label: string, value: string): void => {
    const dt = document.createElement('dt');
    dt.className = 'text-[--color-arcade-muted] font-medium';
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.className = 'text-[--color-arcade-cream] font-data tabular-nums';
    dd.textContent = value;
    metrics.appendChild(dt);
    metrics.appendChild(dd);
  };

  addMetric('Condición', formatConditionRating(machine.conditionRating));
  addMetric('Restauración', formatCurrencyUsd(machine.restorationCostUsd));
  addMetric('Unidades', formatUnitsProduced(machine.unitsProduced));

  body.appendChild(metrics);

  const badges = document.createElement('div');
  badges.className = 'flex flex-wrap gap-2 mt-auto';

  const addBadge = (icon: typeof CheckCircle, text: string, active: boolean): void => {
    const span = document.createElement('span');
    span.className = `inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
      active
        ? 'text-[--color-arcade-teal] border-[--color-arcade-teal]/50 bg-[--color-arcade-teal]/10'
        : 'text-[--color-arcade-steel] border-[--color-arcade-line]'
    }`;
    span.appendChild(createIconElement(icon, 'w-3 h-3'));
    span.appendChild(document.createTextNode(text));
    badges.appendChild(span);
  };

  addBadge(
    machine.isFullyFunctional ? CheckCircle : XCircle,
    machine.isFullyFunctional ? 'Funcional' : 'En restauración',
    machine.isFullyFunctional,
  );
  addBadge(
    machine.hasMultiball ? Star : Gamepad2,
    machine.hasMultiball ? 'Multiball' : 'Single ball',
    machine.hasMultiball,
  );

  body.appendChild(badges);

  if (onDelete !== undefined) {
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className =
      'mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold text-[--color-arcade-danger] border border-[--color-arcade-danger]/30 hover:bg-[--color-arcade-danger]/10 transition-colors cursor-pointer';
    deleteBtn.appendChild(createIconElement(Trash2, 'w-3.5 h-3.5'));
    deleteBtn.appendChild(document.createTextNode('Quitar de la colección'));
    deleteBtn.addEventListener('click', () => {
      onDelete(machine.id);
    });
    body.appendChild(deleteBtn);
  }

  article.appendChild(body);
  return article;
}
