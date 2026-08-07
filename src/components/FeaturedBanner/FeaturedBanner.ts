import type { PinballMachine } from '../../models';
import { createIconElement } from '../../utils/icon.utils';
import { formatCurrencyUsd, formatConditionRating } from '../../utils/format.utils';
import { Zap, Star, Factory, Calendar } from 'lucide';

export function createFeaturedBannerElement(machine: PinballMachine): HTMLElement {
  const section = document.createElement('section');
  section.className =
    'w-full mb-6 rounded-2xl overflow-hidden bg-[--color-arcade-surface] border border-[--color-arcade-gold]/40 shadow-2xl relative group';

  const img = document.createElement('img');
  img.src = machine.imageUrl ?? '/images/pinball-placeholder.svg';
  img.alt = machine.modelName;
  img.className =
    'absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-50';
  img.onerror = () => {
    img.src = '/images/pinball-placeholder.svg';
  };

  const overlay = document.createElement('div');
  overlay.className =
    'absolute inset-0 bg-gradient-to-r from-[--color-arcade-base]/95 via-[--color-arcade-base]/70 to-transparent';

  const content = document.createElement('div');
  content.className =
    'relative z-10 flex flex-col gap-3 p-6 md:p-8 min-h-[280px] md:min-h-[320px] justify-end max-w-2xl';

  const badge = document.createElement('span');
  badge.className =
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[--color-arcade-gold]/15 text-[--color-arcade-gold] border border-[--color-arcade-gold]/50 w-fit';
  badge.appendChild(createIconElement(Zap, 'w-3 h-3'));
  badge.appendChild(document.createTextNode('Leyenda de la Colección'));
  content.appendChild(badge);

  const title = document.createElement('h2');
  title.className =
    'font-display text-2xl md:text-4xl font-black text-[--color-arcade-cream] leading-tight tracking-tight';
  title.textContent = machine.modelName;
  content.appendChild(title);

  const sub = document.createElement('p');
  sub.className = 'text-sm font-semibold text-[--color-arcade-muted]';
  sub.textContent = `${machine.manufacturer} · ${machine.releaseYear}`;
  content.appendChild(sub);

  if (machine.historicalSummary) {
    const summary = document.createElement('p');
    summary.className =
      'text-xs text-[--color-arcade-muted]/80 leading-relaxed line-clamp-2 max-w-lg';
    summary.textContent = machine.historicalSummary;
    content.appendChild(summary);
  }

  const chips = document.createElement('div');
  chips.className = 'flex flex-wrap gap-2 pt-1';

  const addChip = (icon: typeof Star, text: string): void => {
    const chip = document.createElement('div');
    chip.className =
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold bg-[--color-arcade-surface-alt] border border-[--color-arcade-line] text-[--color-arcade-cream]';
    chip.appendChild(createIconElement(icon, 'w-3.5 h-3.5 text-[--color-arcade-gold]'));
    chip.appendChild(document.createTextNode(text));
    chips.appendChild(chip);
  };

  addChip(Star, `Condición ${formatConditionRating(machine.conditionRating)}`);
  addChip(Factory, machine.manufacturer);
  addChip(Calendar, `Año ${machine.releaseYear}`);
  if (machine.restorationCostUsd !== undefined) {
    addChip(Zap, `Restauración ${formatCurrencyUsd(machine.restorationCostUsd)}`);
  }

  content.appendChild(chips);
  section.appendChild(img);
  section.appendChild(overlay);
  section.appendChild(content);

  return section;
}
