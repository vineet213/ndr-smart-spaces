import { useEffect } from "react";

import { getLenisInstance } from "@/lib/lenis";

/**
 * Locks page scroll while `active` (mobile menu, CSS-fullscreen map).
 *
 * `overflow: hidden` on <body> alone is ignored by iOS Safari, so the body is
 * also pinned with `position: fixed` and the scroll offset restored on release.
 * Lenis (desktop wheel smoothing) is paused for the duration as well.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const { body, documentElement } = document;
    const scrollY = window.scrollY;
    const saved = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      behavior: documentElement.style.scrollBehavior,
    };
    const lenis = getLenisInstance();
    lenis?.stop();

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `${-scrollY}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = saved.overflow;
      body.style.position = saved.position;
      body.style.top = saved.top;
      body.style.width = saved.width;
      // Restore instantly: the page's smooth scroll-behavior would otherwise animate the jump.
      documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      documentElement.style.scrollBehavior = saved.behavior;
      lenis?.start();
    };
  }, [active]);
}
