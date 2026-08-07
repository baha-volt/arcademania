import { createIconElement } from '../../utils/icon.utils';
import { AlertTriangle, RefreshCcw, PackageSearch } from 'lucide';

export function createErrorStateElement(
  errorMessage: string,
  onRetry: () => void,
): HTMLElement {
  const section = document.createElement('section');
  section.className =
    'flex flex-col items-center justify-center gap-4 py-20 px-6 text-center';

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'p-4 rounded-full bg-[--color-arcade-danger]/10 border border-[--color-arcade-danger]/30';
  iconWrapper.appendChild(createIconElement(AlertTriangle, 'w-8 h-8 text-[--color-arcade-danger]'));

  const title = document.createElement('h2');
  title.className = 'font-display text-lg font-bold text-[--color-arcade-cream]';
  title.textContent = 'No se pudo cargar la colección';

  const desc = document.createElement('p');
  desc.className = 'text-sm text-[--color-arcade-muted] max-w-md';
  desc.textContent = 'Hubo un problema al conectarse con el servidor. Verifica tu conexión e inténtalo de nuevo.';

  const detail = document.createElement('p');
  detail.className =
    'font-data text-xs text-[--color-arcade-danger]/70 bg-[--color-arcade-danger]/10 border border-[--color-arcade-danger]/20 rounded-lg px-4 py-2 max-w-sm';
  detail.textContent = errorMessage;

  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.className =
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[--color-arcade-gold] text-[--color-arcade-base] hover:bg-[--color-arcade-gold-bright] transition-colors cursor-pointer shadow-lg';
  retryBtn.appendChild(createIconElement(RefreshCcw, 'w-4 h-4'));
  retryBtn.appendChild(document.createTextNode('Reintentar'));
  retryBtn.addEventListener('click', onRetry);

  section.appendChild(iconWrapper);
  section.appendChild(title);
  section.appendChild(desc);
  section.appendChild(detail);
  section.appendChild(retryBtn);

  return section;
}

export function createEmptyStateElement(): HTMLElement {
  const section = document.createElement('section');
  section.className =
    'flex flex-col items-center justify-center gap-4 py-20 px-6 text-center';

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'p-4 rounded-full bg-[--color-arcade-surface-alt] border border-[--color-arcade-line]';
  iconWrapper.appendChild(createIconElement(PackageSearch, 'w-8 h-8 text-[--color-arcade-muted]'));

  const title = document.createElement('h2');
  title.className = 'font-display text-lg font-bold text-[--color-arcade-cream]';
  title.textContent = 'La colección está vacía';

  const desc = document.createElement('p');
  desc.className = 'text-sm text-[--color-arcade-muted] max-w-sm';
  desc.textContent =
    'Todavía no hay máquinas registradas. Usa el formulario para agregar la primera pieza de la colección.';

  section.appendChild(iconWrapper);
  section.appendChild(title);
  section.appendChild(desc);

  return section;
}
