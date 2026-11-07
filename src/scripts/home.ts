/**
 * Home page motion: pinned hero fade, staggered parallax columns, card caption
 * measuring and the grid/list view switch. Runs through motion.ts `onPage`, so
 * everything here is reverted before the next navigation.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, prefersReducedMotion } from './motion';

const VIEW_KEY = 'home:view';
/** Breakpoints (px) where the grid gains a column, as in the reference. */
const COLUMN_BREAKPOINTS = [640, 800, 1024, 1380, 1744, 2104];
/** Top spacer per column so the columns start staggered. */
const STAGGER = ['5%', '0', '10%', '5%', '0', '5%', '10%', '5%'];
const PARALLAX_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

type View = 'grid' | 'list';

function columnCount(cards: number): number {
  const byWidth = 1 + COLUMN_BREAKPOINTS.filter((min) => window.innerWidth >= min).length;
  return Math.max(1, Math.min(byWidth, cards));
}

/**
 * Column order used by the reference: even columns first, then odd ones, so
 * consecutive cards land in alternating columns.
 */
function columnOrder(count: number): number[] {
  const indexes = Array.from({ length: count }, (_, index) => index);
  return [...indexes.filter((index) => index % 2 === 0), ...indexes.filter((index) => index % 2 === 1)];
}

function buildColumns(grid: HTMLElement, cards: HTMLElement[], count: number): HTMLElement[] {
  const columns = Array.from({ length: count }, (_, index) => {
    const column = document.createElement('div');
    column.className = 'grid-col';
    const spacer = document.createElement('div');
    spacer.style.paddingTop = STAGGER[index % STAGGER.length];
    spacer.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('div');
    inner.className = 'grid-col-inner';
    column.append(spacer, inner);
    return column;
  });

  const order = columnOrder(count);
  cards.forEach((card, index) => {
    columns[order[index % count]].querySelector('.grid-col-inner')!.append(card);
  });

  grid.style.setProperty('--cols', String(count));
  grid.replaceChildren(...columns);
  return columns;
}

/** Each column is pulled towards the centre while it scrolls into view. */
function createParallax(columns: HTMLElement[]): gsap.Context {
  return gsap.context(() => {
    columns.forEach((column) => {
      gsap.from(column, {
        x: () => {
          const { left, width } = column.getBoundingClientRect();
          return ((window.innerWidth / 2 - (left + width / 2)) / window.innerWidth) * width * -1.5;
        },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: column,
          start: 'top bottom',
          // The reference settles at 'top top-=100%' across many rows; with a
          // single row of projects that never happens on screen, so settle
          // while the cards are still in view.
          end: 'top 30%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const inner = column.querySelector<HTMLElement>('.grid-col-inner')!;
      gsap.to(inner, {
        y: () => Math.max(0, column.offsetHeight - inner.offsetHeight - inner.offsetTop),
        ease: 'none',
        scrollTrigger: {
          trigger: column,
          start: 'top center',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
  });
}

/** The CSS hover reserves the caption's real height for the image clip. */
function measureCaptions(cards: HTMLElement[]): ResizeObserver {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const card = (entry.target as HTMLElement).closest<HTMLElement>('[data-card]');
      card?.style.setProperty('--caption-h', `${Math.ceil(entry.borderBoxSize[0].blockSize)}px`);
    }
  });
  cards.forEach((card) => {
    const caption = card.querySelector('[data-caption]');
    if (caption) observer.observe(caption);
  });
  return observer;
}

function readView(): View {
  try {
    return sessionStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid';
  } catch {
    return 'grid';
  }
}

function saveView(view: View): void {
  try {
    sessionStorage.setItem(VIEW_KEY, view);
  } catch {
    // The chosen view is a convenience; ignore unavailable storage.
  }
}

onPage('[data-page="home"]', () => {
  const page = document.querySelector<HTMLElement>('[data-page="home"]')!;
  const grid = page.querySelector<HTMLElement>('[data-grid]')!;
  const views = {
    grid: page.querySelector<HTMLElement>('[data-view="grid"]')!,
    list: page.querySelector<HTMLElement>('[data-view="list"]')!,
  };
  const toggle = document.querySelector<HTMLButtonElement>('[data-view-toggle]');
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card]'));
  const reduced = prefersReducedMotion();
  const cleanups: Array<() => void> = [];

  // Columns, rebuilt whenever the column count changes.
  let count = 0;
  let parallax: gsap.Context | null = null;
  const parallaxMedia = gsap.matchMedia();
  const layout = () => {
    const next = columnCount(cards.length);
    if (next === count) return;
    count = next;
    parallax?.revert();
    const columns = buildColumns(grid, cards, count);
    parallax = null;
    parallaxMedia.revert();
    parallaxMedia.add(PARALLAX_QUERY, () => {
      parallax = createParallax(columns);
      return () => parallax?.revert();
    });
    ScrollTrigger.refresh();
  };
  layout();
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layout, 150);
  };
  window.addEventListener('resize', onResize);
  cleanups.push(() => {
    window.removeEventListener('resize', onResize);
    window.clearTimeout(resizeTimer);
    parallaxMedia.revert();
  });

  const captions = measureCaptions(cards);
  cleanups.push(() => captions.disconnect());

  // Hero: pinned while the grid scrolls over it, fading out.
  if (!reduced) {
    const hero = page.querySelector<HTMLElement>('[data-hero]')!;
    const title = page.querySelector<HTMLElement>('[data-hero-title]')!;
    gsap.fromTo(title, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.25, ease: 'power3.out' });
    gsap.fromTo(views.grid, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
    gsap.to(hero, {
      opacity: 0,
      ease: 'power3.out',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', pin: true, pinSpacing: false, scrub: true },
    });
  }

  // Grid/list switch in the persisted header.
  if (toggle) {
    const apply = (view: View, animate: boolean) => {
      const shown = views[view];
      const hidden = views[view === 'grid' ? 'list' : 'grid'];
      toggle.setAttribute('aria-pressed', String(view === 'list'));
      // Labels come from the header in the page's language.
      const label = view === 'list' ? toggle.dataset.labelGrid : toggle.dataset.labelList;
      if (label) toggle.setAttribute('aria-label', label);

      const swap = () => {
        hidden.hidden = true;
        shown.hidden = false;
        ScrollTrigger.refresh();
        if (!animate) return;
        const items = view === 'list' ? shown.querySelectorAll('[data-row]') : [shown];
        gsap.fromTo(items, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
      };

      if (animate && !hidden.hidden) gsap.to(hidden, { opacity: 0, duration: 0.3, ease: 'power3.in', onComplete: () => { gsap.set(hidden, { clearProps: 'opacity' }); swap(); } });
      else swap();
    };

    let view = readView();
    apply(view, false);
    toggle.hidden = false;
    const onToggle = () => {
      view = view === 'grid' ? 'list' : 'grid';
      saveView(view);
      apply(view, !reduced);
    };
    toggle.addEventListener('click', onToggle);
    cleanups.push(() => {
      toggle.removeEventListener('click', onToggle);
      toggle.hidden = true;
    });
  }

  return () => cleanups.forEach((cleanup) => cleanup());
});
