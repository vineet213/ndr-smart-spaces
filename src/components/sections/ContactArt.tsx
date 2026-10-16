"use client";

import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./ContactCta.module.css";

const unit = { pathLength: 1 } as const;

/* A faint gold elevation drawing of a warehouse park (two bays, loading docks, */
/* a truck and a dimension line) that plots itself in when the section arrives. */
export function ContactArt() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className={cx(styles.art, inView && styles.artDrawn)} aria-hidden="true">
      <svg
        viewBox="0 0 600 300"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <path {...unit} d="M40 70 H560 M40 64 V76 M560 64 V76" />
        <path {...unit} d="M40 280 V150 L190 95 L340 150 V280" />
        <path {...unit} d="M40 150 H340 M190 95 V150 M115 150 L190 120 L265 150" />
        <path {...unit} d="M70 280 V222 H110 V280 M130 280 V222 H170 V280" />
        <path {...unit} d="M210 280 V222 H250 V280 M270 280 V222 H310 V280" />
        <path {...unit} d="M340 280 V170 L450 130 L560 170 V280 M340 170 H560" />
        <path {...unit} d="M392 276 V240 H468 V276 M468 252 H498 L514 266 V276" />
        <circle {...unit} cx="414" cy="278" r="8" />
        <circle {...unit} cx="494" cy="278" r="8" />
        <path {...unit} d="M10 288 H590" />
      </svg>
    </div>
  );
}
