"use client";

import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./EsgFramework.module.css";

const unit = { pathLength: 1 } as const;

/* One faint line mark per pillar, in the corner of its card: leaf, people, */
/* balance scales, safety cone. It draws itself in when the card scrolls in. */
const MARKS = {
  E: (
    <>
      <path {...unit} d="M10 54 C10 26 28 10 54 10 C54 36 38 54 10 54 Z" />
      <path {...unit} d="M10 54 L40 24" />
      <path {...unit} d="M24 40 H34 M30 34 V26" />
    </>
  ),
  S: (
    <>
      <circle {...unit} cx="22" cy="22" r="7" />
      <circle {...unit} cx="44" cy="24" r="5.5" />
      <path {...unit} d="M8 52 C8 40 14 33 22 33 C30 33 36 40 36 52" />
      <path {...unit} d="M36 37 C38 35 41 34 44 34 C51 34 56 40 56 50" />
    </>
  ),
  G: (
    <>
      <path {...unit} d="M32 8 V54 M20 54 H44 M12 18 H52" />
      <path {...unit} d="M12 18 L4 36 H20 Z M52 18 L44 36 H60 Z" />
      <circle {...unit} cx="32" cy="12" r="3" />
    </>
  ),
  H: (
    <>
      <path {...unit} d="M26 10 H38 L50 50 H14 Z" />
      <path {...unit} d="M21.5 26 H42.5 M17.5 38 H46.5" />
      <path {...unit} d="M6 50 H58 V56 H6 Z" />
    </>
  ),
} as const;

export function PillarMark({ pillarKey }: { pillarKey: keyof typeof MARKS }) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.3 });

  return (
    <span ref={ref} className={cx(styles.mark, inView && styles.markDrawn)} aria-hidden="true">
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {MARKS[pillarKey]}
      </svg>
    </span>
  );
}
