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
