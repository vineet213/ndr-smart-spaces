"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Lenis only smooths wheel input. On touch devices (and for users who ask
    // for reduced motion) it does nothing but burn a requestAnimationFrame
    // loop on every page, so leave native scrolling alone there.
    const skip = window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)");
    if (skip.matches) return;

    const lenis = new Lenis();
    setLenisInstance(lenis);

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}
