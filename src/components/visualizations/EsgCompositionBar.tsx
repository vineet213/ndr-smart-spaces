"use client";

import type { EsgComposition } from "@/lib/data/esg";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./EsgCompositionBar.module.css";

const SEGMENT_COLORS = [
  "var(--color-maroon-print)",
  "var(--color-gold)",
  "var(--color-maroon-bright)",
  "var(--color-stone)",
  "var(--color-gold-light)",
] as const;

const colorAt = (index: number) => SEGMENT_COLORS[index % SEGMENT_COLORS.length];

const fmt = (value: number) => String(Math.round(value * 100) / 100);

type EsgCompositionBarProps = {
  composition: EsgComposition;
  className?: string;
};

export function EsgCompositionBar({ composition, className }: EsgCompositionBarProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className={cx(styles.root, inView && styles.drawn, className)}>
      <div className={styles.head}>
        <span className={styles.code}>{composition.code}</span>
        <span className={styles.title}>{composition.title}</span>
        <span className={styles.unit}>{composition.unit}</span>
      </div>

      <div className={styles.bar}>
        {composition.parts.map((part, index) => (
          <span
            key={part.label}
            className={styles.segment}
            style={{ width: `${part.value}%`, backgroundColor: colorAt(index) }}
          />
        ))}
      </div>

      <ol className={styles.legend}>
        {composition.parts.map((part, index) => (
          <li key={part.label} className={styles.entry}>
            <span
              className={styles.swatch}
              style={{ backgroundColor: colorAt(index) }}
              aria-hidden="true"
            />
            <span className={styles.entryLabel}>{part.label}</span>
            <span className={styles.entryValue}>{fmt(part.value)}%</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
