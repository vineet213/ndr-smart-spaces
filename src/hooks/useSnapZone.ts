import { useEffect, type RefObject } from "react";

/* Sections that are currently pinned. While at least one is, <html> carries
 * `snap-zone` and (on touch) the browser's own scroll-snap takes over, so a
 * swipe lands on the next stage with native momentum. Ref-counted so several
 * sections can coexist. */
const activeZones = new Set<object>();

function syncRootClass() {
  document.documentElement.classList.toggle("snap-zone", activeZones.size > 0);
}

/**
 * Turns on native scroll-snapping for touch devices while `trackRef`'s pinned
 * frame is on screen, and off everywhere else, so the page never snaps (or
 * traps the scroll) outside these sections.
 *
 * The zone is "on" strictly between the pin and unpin points: the track's top
 * has passed the frame's resting position and its bottom has not yet reached
 * the frame's bottom. `frameRef` is the sticky frame (for its `top` and height);
 * without it the frame is assumed to fill the viewport from the very top.
 */
export function useSnapZone(
  trackRef: RefObject<HTMLElement | null>,
  enabled = true,
  frameRef?: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const token = {};
    let frame = 0;
    let active = false;

    const check = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const sticky = frameRef?.current;
      const frameTop = sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0;
      const frameHeight = sticky ? sticky.offsetHeight : window.innerHeight;
      const on = rect.top < frameTop - 1 && rect.bottom > frameTop + frameHeight + 1;
      if (on === active) return;
      active = on;
      if (on) activeZones.add(token);
      else activeZones.delete(token);
      syncRootClass();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      activeZones.delete(token);
      syncRootClass();
    };
  }, [trackRef, frameRef, enabled]);
}
