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
 * The page follows the finger while it is down; on release the swipe is
 * replaced by a single eased glide to the next (or previous) stage position.
 *
 * - A new swipe interrupts a glide in progress and continues from the stage
 *   that glide was heading to, so quick repeated swipes step one stage each
 *   instead of being ignored or skipping stages.
 * - A drag too short to count as a swipe snaps back to the stage it started
 *   from, so the page never rests between stages.
 * - Touches that begin outside the section's stage range, and swipes past the
 *   first/last stage, scroll normally so the section never traps the page.
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
    let lastY = 0;
    let startScroll = 0;
    let targets: number[] = [];
    let tracking = false;
    // Index of the stage a glide is currently heading to (null when idle).
    let gliding: number | null = null;

    const onStart = (event: TouchEvent) => {
      const lenis = getLenisInstance();
      tracking = false;
      if (!lenis || lenis.isStopped || event.touches.length !== 1) return;

      targets = getTargetsRef.current();
      if (targets.length === 0) return;

      startScroll = window.scrollY;
      const h = window.innerHeight;
      const inRange =
        startScroll >= targets[0] - h && startScroll <= targets[targets.length - 1] + h;
      if (!inRange && gliding === null) return;

      startY = lastY = event.touches[0].clientY;
      tracking = true;
    };

    const onMove = (event: TouchEvent) => {
      if (tracking && event.touches[0]) lastY = event.touches[0].clientY;
    };

    const onEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;

      const lenis = getLenisInstance();
      if (!lenis) return;

      const endY = event.changedTouches[0]?.clientY ?? lastY;
      const fingerDelta = endY - startY;
      // Finger moving up scrolls the page down.
      const down = fingerDelta < 0;
      const isSwipe = Math.abs(fingerDelta) >= MIN_SWIPE_PX;
      const last = targets.length - 1;

      // Consume the in-flight glide: it is either replaced below or abandoned.
      const heading = gliding;
      gliding = null;

      let index: number;
      if (heading !== null) {
        index = isSwipe ? heading + (down ? 1 : -1) : heading;
      } else if (isSwipe) {
        const found = down
          ? targets.findIndex((t) => t > startScroll + TOLERANCE_PX)
          : targets.findLastIndex((t) => t < startScroll - TOLERANCE_PX);
        if (found === -1) return;
        index = found;
      } else {
        // Too short to be a swipe: settle back onto the nearest stage.
        index = targets.reduce(
          (best, t, i) =>
            Math.abs(t - startScroll) < Math.abs(targets[best] - startScroll) ? i : best,
          0,
        );
        if (Math.abs(targets[index] - window.scrollY) <= TOLERANCE_PX) return;
      }

      if (index < 0 || index > last) return;

      const target = targets[index];
      gliding = index;

      // After Lenis's own touchend handling, so this replaces its inertia.
      window.setTimeout(() => {
        const distance = Math.abs(target - window.scrollY);
        lenis.scrollTo(target, {
          duration: Math.min(1.4, Math.max(0.75, distance / 1400)),
          easing: easeOutCubic,
          force: true,
          onComplete: () => {
            if (gliding === index) gliding = null;
          },
        });
      }, 0);
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [enabled]);
}
