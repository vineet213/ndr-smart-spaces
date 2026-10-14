import { useEffect, useRef } from "react";

import { getLenisInstance } from "@/lib/lenis";

const MIN_SWIPE_PX = 48;
const TOLERANCE_PX = 12;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * "One swipe, one stage" for touch devices running Lenis's syncTouch.
 *
 * The page follows the finger freely while it is down; on release, a swipe
 * that starts inside the section's stage range is replaced by a single eased
 * glide to the next (or previous) stage position, instead of whatever the
 * momentum would have carried it to. Swipes that start outside the range,
 * and swipes past the first/last stage, scroll normally so the section never
 * traps the page. Desktop wheel scrolling and reduced-motion users are
 * untouched (Lenis is not created for the latter).
 *
 * `getTargets` returns the stages' absolute scrollY positions, ascending; it
 * is called on every touchstart so it always reflects current layout.
 */
export function useStageSnap(getTargets: () => number[], enabled = true): void {
  const getTargetsRef = useRef(getTargets);

  useEffect(() => {
    getTargetsRef.current = getTargets;
  });

  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    let startY = 0;
    let startScroll = 0;
    let targets: number[] = [];
    let tracking = false;

    const onStart = (event: TouchEvent) => {
      const lenis = getLenisInstance();
      tracking = false;
      if (!lenis || lenis.isStopped || lenis.isLocked || event.touches.length !== 1) return;

      targets = getTargetsRef.current();
      if (targets.length === 0) return;

      startScroll = window.scrollY;
      const h = window.innerHeight;
      if (startScroll < targets[0] - h || startScroll > targets[targets.length - 1] + h) return;

      startY = event.touches[0].clientY;
      tracking = true;
    };

    const onEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;

      const lenis = getLenisInstance();
      if (!lenis) return;

      const fingerDelta = event.changedTouches[0].clientY - startY;
      if (Math.abs(fingerDelta) < MIN_SWIPE_PX) return;

      // Finger moving up scrolls the page down.
      const down = fingerDelta < 0;
      const target = down
        ? targets.find((t) => t > startScroll + TOLERANCE_PX)
        : [...targets].reverse().find((t) => t < startScroll - TOLERANCE_PX);
      if (target === undefined) return;

      // After Lenis's own touchend handling, so this replaces its inertia.
      window.setTimeout(() => {
        lenis.scrollTo(target, {
          duration: 0.85,
          easing: easeOutCubic,
          lock: true,
          force: true,
        });
      }, 0);
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [enabled]);
}
