"use client";

import type { CSSProperties } from "react";
import { Container } from "@/components/layout";
import { Heading } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { vertical03Values } from "@/lib/data/business";
import { cx } from "../ui/cx";
import styles from "./AveAcresValues.module.css";

const markProps = {
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* pathLength=1 on every stroke lets the CSS draw each mark in. */
const unit = { pathLength: 1 } as const;

function ValueMark({ index }: { index: string }) {
  switch (index) {
    case "01":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <circle {...unit} cx="28" cy="28" r="9" />
          <path {...unit} d="M28 10 V46 M10 28 H46" />
          <path {...unit} d="M19 19 L23 23 M37 19 L33 23 M19 37 L23 33 M37 37 L33 33" />
        </svg>
      );
    case "02":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...unit} d="M12 24 H26 V38 H12 Z" />
          <path {...unit} d="M30 22 H44 V34 H30 Z" />
          <path {...unit} d="M18 40 H40 V46 H18 Z" />
        </svg>
      );
    case "03":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...unit} d="M9 39 H47" />
          <path {...unit} d="M15 39 V45 M41 39 V45" />
          <path {...unit} d="M9 45 H21 M35 45 H47" />
          <path {...unit} d="M17 39 V27 L28 19 L39 27 V39" />
        </svg>
      );
    case "04":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...unit} d="M10 46 H46" />
          <path {...unit} d="M14 42 L38 16" />
          <path {...unit} d="M30 16 H38 V24" />
        </svg>
      );
    case "05":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...unit} d="M39 15 A14 14 0 1 1 15.8 22.5" />
          <path {...unit} d="M15.8 22.5 L11 19 M15.8 22.5 L19.5 17.8" />
          <path {...unit} d="M28 22c-4.5-2-8 2-1 8 7-6 3.5-10-1-8Z" />
        </svg>
      );
    default:
      return null;
  }
}

/* "What Defines Our Developments": five tall columns divided by hairlines.  */
/* On arrival the dividers draw down and each column's mark draws itself in, */
/* one after another; hovering a column fills it with a warm glow.           */
export function AveAcresValues() {
  const { ref, inView } = useInView<HTMLOListElement>({ threshold: 0.3 });

  return (
    <section className={styles.section} aria-labelledby="what-defines-title">
      <Container>
        <header className={cx(styles.header, inView && styles.drawn)}>
          <span className={styles.goldRule} aria-hidden="true" />
          <Heading variant="section" tone="dark" id="what-defines-title">
            {vertical03Values.heading}
          </Heading>
        </header>

        <ol
          ref={ref}
          className={cx(styles.columns, inView && styles.drawn)}
          aria-labelledby="what-defines-title"
        >
          {vertical03Values.values.map((value, index) => (
            <li
              key={value.index}
              className={styles.column}
              style={{ "--n": index } as CSSProperties}
            >
              <span className={styles.number} aria-hidden="true">
                {value.index}
              </span>
              <span className={styles.mark} aria-hidden="true">
                <ValueMark index={value.index} />
              </span>
              <h3 className={styles.title}>{value.title}</h3>
              <span className={styles.underline} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
