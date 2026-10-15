"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Lenis smooths the mouse wheel only. Touch devices keep the browser's own
    // scrolling: it runs off the main thread and has the exact momentum and
    // rubber-banding people expect from their phone, which no JS imitation
    // matches. Reduced-motion users keep native scrolling too.
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
