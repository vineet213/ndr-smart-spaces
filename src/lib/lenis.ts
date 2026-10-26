import type Lenis from "lenis";

/**
 * Module-level handle to the single Lenis instance created by
 * `SmoothScroll`. Lets other components hand their programmatic scrolls
 * to Lenis's own engine instead of calling `window.scrollTo` directly,
 * which would otherwise fight Lenis's continuous rAF-driven scroll loop.
 */
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenisInstance(): Lenis | null {
  return instance;
}

/** Jumps (no animation) to a page position, keeping Lenis and the window in step. */
export function jumpTo(top: number) {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  // The site's smooth scroll-behavior would otherwise animate this jump.
  root.style.scrollBehavior = "auto";
  instance?.scrollTo(top, { immediate: true, force: true });
  window.scrollTo({ top, left: 0, behavior: "instant" });
  root.style.scrollBehavior = previous;
}

/**
 * Jumps to the element with this id, honouring its scroll-margin-top so it
 * clears the fixed header. Returns false when there is no such element.
 */
export function jumpToSection(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  jumpTo(target.getBoundingClientRect().top + window.scrollY - margin);
  return true;
}
