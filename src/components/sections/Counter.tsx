"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  format?: boolean;
  className?: string;
};

const formatter = new Intl.NumberFormat("en-IN");

export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 800,
  format = false,
  className,
}: CounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const start = performance.now();

    const tick = (now: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(value);
        return;
      }

      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  const rendered = format ? formatter.format(display) : display;

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
