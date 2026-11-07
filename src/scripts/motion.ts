/**
 * Global motion shell: GSAP plugins, the ScrollSmoother lifecycle, the
 * curtain page transition and the home scroll restoration.
 *
 * Astro's ClientRouter swaps the page body on navigation, so everything that
 * belongs to a page is created on `astro:page-load` and torn down on
 * `astro:before-swap`. Page scripts hook in through `onPage()` instead of
 * listening to the lifecycle themselves.
 */
import { swapFunctions } from 'astro:transitions/client';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
ScrollTrigger.config({ ignoreMobileResize: true });

const HOME_PATH = '/';
const HOME_SCROLL_KEY = 'motion:home-scroll';
const CURTAIN = { duration: 0.25, ease: 'power3.inOut' } as const;
const SMOOTH_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

type Cleanup = () => void;
type PageSetup = () => void | Cleanup;

interface Registration {
  selector: string;
  setup: PageSetup;
}

const registrations: Registration[] = [];
const cleanups: Cleanup[] = [];
let pageContext: gsap.Context | null = null;
let smoothMedia: gsap.MatchMedia | null = null;
let pageReady = false;

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Runs `setup` on every page load where `selector` matches an element.
 * Tweens and ScrollTriggers created inside are reverted automatically before
 * the next navigation; return a function for any other cleanup.
 */
export function onPage(selector: string, setup: PageSetup): void {
  const registration = { selector, setup };
  registrations.push(registration);
  if (pageReady) runRegistration(registration);
}

function runRegistration({ selector, setup }: Registration): void {
  if (!pageContext || !document.querySelector(selector)) return;
  pageContext.add(() => {
    const cleanup = setup();
    if (typeof cleanup === 'function') cleanups.push(cleanup);
  });
}

function currentScroll(): number {
  return ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
}

function readHomeScroll(): number {
  try {
    return Number(sessionStorage.getItem(HOME_SCROLL_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveHomeScroll(value: number): void {
  try {
    sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(value)));
  } catch {
    // Storage can be unavailable (private mode); restoring is a convenience.
  }
}

/** Home comes back where the visitor left it; every other page starts at the top. */
function restoreScroll(): void {
  const target = window.location.pathname === HOME_PATH ? readHomeScroll() : 0;
  const smoother = ScrollSmoother.get();
  if (!smoother) {
    window.scrollTo({ top: target, behavior: 'instant' });
    return;
  }

  // A new smoother fixes its wrapper, so the body is only one viewport tall
  // until its first (deferred) refresh sizes it. Scrolling before that is
  // clamped to 0, so restore once that refresh has run.
  const restoreAfterRefresh = () => {
    ScrollTrigger.removeEventListener('refresh', restoreAfterRefresh);
    smoother.scrollTop(target);
  };
  ScrollTrigger.addEventListener('refresh', restoreAfterRefresh);
  cleanups.push(() => ScrollTrigger.removeEventListener('refresh', restoreAfterRefresh));
}

function setUpPage(): void {
  pageContext = gsap.context(() => {});
  smoothMedia = gsap.matchMedia();
  smoothMedia.add(SMOOTH_QUERY, () => {
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
    });
  });

  pageReady = true;
  registrations.forEach(runRegistration);
  restoreScroll();
  ScrollTrigger.refresh();
}

function tearDownPage(): void {
  pageReady = false;
  cleanups.splice(0).forEach((cleanup) => cleanup());
  pageContext?.revert();
  smoothMedia?.revert();
  ScrollSmoother.get()?.kill();
  pageContext = null;
  smoothMedia = null;
}

/** Covers the screen with a frozen copy of the outgoing page. */
function coverWithSnapshot(): void {
  const curtain = document.getElementById('curtain');
  const content = document.getElementById('smooth-content');
  if (!curtain || !content || prefersReducedMotion()) return;

  const snapshot = content.cloneNode(true) as HTMLElement;
  snapshot.removeAttribute('id');
  snapshot.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
  snapshot.setAttribute('aria-hidden', 'true');
  snapshot.inert = true;
  snapshot.style.transform = `translate3d(0, ${-currentScroll()}px, 0)`;

  curtain.replaceChildren(snapshot);
  gsap.set(curtain, { height: '100%', autoAlpha: 1 });
}

/** Collapses the curtain upwards to reveal the incoming page. */
function revealPage(): void {
  const curtain = document.getElementById('curtain');
  if (!curtain || curtain.childElementCount === 0) return;

  gsap.to(curtain, {
    ...CURTAIN,
    height: 0,
    onComplete: () => {
      curtain.replaceChildren();
      gsap.set(curtain, { autoAlpha: 0 });
    },
  });
}

/**
 * Swaps the page content but keeps the same <body> element.
 *
 * ScrollSmoother caches `document.body` the first time it is created and sizes
 * it to make the page scrollable. Astro's default swap replaces the <body>
 * element, which leaves GSAP sizing a detached node (the new page then cannot
 * scroll past one viewport). Running Astro's own body swap on two wrappers
 * inside the live body keeps its persist and media handling intact.
 */
function swapBodyContents(newBody: HTMLElement): void {
  const body = document.body;
  const outgoing = document.createElement('div');
  const incoming = document.createElement('div');
  outgoing.append(...body.childNodes);
  incoming.append(...newBody.childNodes);
  body.append(outgoing);

  swapFunctions.swapBodyElement(incoming, outgoing);
  body.replaceChildren(...incoming.childNodes);

  for (const { name } of [...body.attributes]) body.removeAttribute(name);
  for (const { name, value } of newBody.attributes) body.setAttribute(name, value);
}

document.addEventListener('astro:before-preparation', (event) => {
  if (event.from.pathname === HOME_PATH) saveHomeScroll(currentScroll());
});

document.addEventListener('astro:before-swap', (event) => {
  coverWithSnapshot();
  tearDownPage();

  // Same steps as Astro's default swap, except for the body (see above).
  event.swap = () => {
    swapFunctions.deselectScripts(event.newDocument);
    swapFunctions.swapRootAttributes(event.newDocument);
    swapFunctions.swapHeadElements(event.newDocument);
    const restoreFocus = swapFunctions.saveFocus();
    swapBodyContents(event.newDocument.body);
    restoreFocus();
  };
});

document.addEventListener('astro:page-load', () => {
  setUpPage();
  revealPage();
});
