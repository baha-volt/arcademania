function createSkelBlock(extraClass: string): HTMLDivElement {
  const div = document.createElement('div');
  div.className = `animate-pulse bg-[--color-arcade-line] rounded ${extraClass}`;
  return div;
}

function createCardSkeleton(): HTMLElement {
  const article = document.createElement('article');
  article.className =
    'flex flex-col bg-[--color-arcade-surface] border border-[--color-arcade-line] rounded-2xl overflow-hidden';

  article.appendChild(createSkelBlock('h-40 w-full rounded-none'));

  const body = document.createElement('div');
  body.className = 'flex flex-col gap-3 p-4';
  body.appendChild(createSkelBlock('h-4 w-3/4'));
  body.appendChild(createSkelBlock('h-3 w-1/2'));
  body.appendChild(createSkelBlock('h-px w-full'));

  const metrics = document.createElement('div');
  metrics.className = 'grid grid-cols-2 gap-2';
  for (let i = 0; i < 6; i++) {
    metrics.appendChild(createSkelBlock('h-3 w-full'));
  }
  body.appendChild(metrics);

  const badges = document.createElement('div');
  badges.className = 'flex gap-2';
  badges.appendChild(createSkelBlock('h-5 w-20 rounded-full'));
  badges.appendChild(createSkelBlock('h-5 w-24 rounded-full'));
  body.appendChild(badges);

  article.appendChild(body);
  return article;
}

function createBannerSkeleton(): HTMLElement {
  const section = document.createElement('section');
  section.className =
    'w-full mb-6 rounded-2xl overflow-hidden bg-[--color-arcade-surface] border border-[--color-arcade-line] p-6 md:p-8 min-h-[280px] md:min-h-[320px] flex flex-col gap-4 justify-end';

  section.appendChild(createSkelBlock('h-5 w-40 rounded-full'));
  section.appendChild(createSkelBlock('h-8 w-2/3'));
  section.appendChild(createSkelBlock('h-4 w-1/3'));
  section.appendChild(createSkelBlock('h-3 w-full max-w-lg'));

  const chips = document.createElement('div');
  chips.className = 'flex gap-2 pt-1';
  for (let i = 0; i < 4; i++) {
    chips.appendChild(createSkelBlock('h-6 w-24 rounded-lg'));
  }
  section.appendChild(chips);
  return section;
}

export function createLoadingSkeletonElement(cardCount = 6): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.appendChild(createBannerSkeleton());

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
  for (let i = 0; i < cardCount; i++) {
    grid.appendChild(createCardSkeleton());
  }
  wrapper.appendChild(grid);
  return wrapper;
}
