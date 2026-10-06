"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/lenis";

export function SmoothScroll() {
  useEffect(() => {
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
