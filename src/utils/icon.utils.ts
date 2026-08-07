import { createElement } from 'lucide';

export type LucideIconNode = Parameters<typeof createElement>[0];

export function createIconElement(iconDef: LucideIconNode, extraClass = ''): SVGElement {
  try {
    const iconEl = createElement(iconDef);
    if (extraClass) {
      iconEl.classList.add(...extraClass.split(' ').filter(Boolean));
    }
    return iconEl;
  } catch (error) {
    console.warn('[ArcadeMania] Error al renderizar icono:', error);
    return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  }
}
