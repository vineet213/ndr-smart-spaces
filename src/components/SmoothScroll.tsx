"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Only users who ask for reduced motion keep native scrolling. Touch
    // devices get Lenis too (syncTouch), so phones scroll with the same eased
    // momentum as the desktop wheel.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lenis = new Lenis(
      coarse
        ? {
            // Mimic native touch scrolling while keeping Lenis's position in
            // sync, so the rAF-driven reels and sticky sections see one
            // continuous, interpolated scroll value.
            syncTouch: true,
            syncTouchLerp: 0.12,
            touchInertiaExponent: 1.7,
            touchMultiplier: 1.1,
            // Let inner scroll containers (menu, portfolio lists, ESG cards) scroll natively.
            allowNestedScroll: true,
          }
        : undefined,
    );
    setLenisInstance(lenis);

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    // iOS Safari resizes the visual viewport as the address bar collapses and
    // on rotation; make Lenis re-measure so its scroll limit stays correct.
    const viewport = window.visualViewport;
    let resizeTimer: number | undefined;
    const onViewportResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => lenis.resize(), 120);
    };
    viewport?.addEventListener("resize", onViewportResize);
    window.addEventListener("orientationchange", onViewportResize);

    return () => {
      window.clearTimeout(resizeTimer);
      viewport?.removeEventListener("resize", onViewportResize);
      window.removeEventListener("orientationchange", onViewportResize);
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}
