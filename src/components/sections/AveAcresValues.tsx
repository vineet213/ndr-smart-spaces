"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { vertical03Values } from "@/lib/data/business";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import styles from "./AveAcresValues.module.css";

const markProps = {
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function ValueMark({ index }: { index: string }) {
  switch (index) {
    case "01":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <circle cx="28" cy="28" r="9" />
          <path d="M28 10 V46 M10 28 H46" />
          <path d="M19 19 L23 23 M37 19 L33 23 M19 37 L23 33 M37 37 L33 33" />
        </svg>
      );
    case "02":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path d="M12 24 H26 V38 H12 Z" />
          <path d="M30 22 H44 V34 H30 Z" />
          <path d="M18 40 H40 V46 H18 Z" />
        </svg>
      );
    case "03":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path d="M14 14 H42 V42 H14 Z" />
          <path d="M14 28 H42 M28 14 V42" />
        </svg>
      );
    case "04":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path d="M10 46 H46" />
          <path d="M14 42 L38 16" />
          <path d="M30 16 H38 V24" />
        </svg>
      );
    case "05":
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path d="M28 12 V46" />
          <path d="M28 22 C 18 19, 14 28, 28 29 Z" />
          <path d="M28 22 C 38 19, 42 28, 28 29 Z" />
        </svg>
      );
    default:
      return null;
  }
}

export function AveAcresValues() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const pointerTypeRef = useRef<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className={styles.section} aria-labelledby="what-defines-title">
      <Container>
        <Reveal>
          <header className={styles.header}>
            <span className={styles.goldRule} aria-hidden="true" />
            <Eyebrow tone="dark">{vertical03Values.eyebrow}</Eyebrow>
            <Heading variant="section" tone="dark" id="what-defines-title">
              {vertical03Values.heading}
            </Heading>
          </header>
        </Reveal>

        <div ref={ref} className={cx(styles.field, inView && styles.drawn)}>
          <svg
            className={styles.trajectory}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path className={styles.trajectoryPath} pathLength={1} d="M 9 70 Q 48 12 90 8" />
            <path
              className={styles.trajectoryTip}
              pathLength={1}
              d="M 90 8 L 81 12 M 90 8 L 84 18"
            />
          </svg>

          <span className={styles.baseline} aria-hidden="true" />

          <ol className={styles.system} aria-labelledby="what-defines-title">
            {vertical03Values.values.map((value, index) => (
              <li
                key={value.index}
                tabIndex={0}
                className={cx(styles.value, activeIndex === index && styles.valueActive)}
                style={{ "--n": index } as CSSProperties}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex((active) => (active === index ? null : active))}
                onFocus={() => {
                  if (pointerTypeRef.current !== "touch") setActiveIndex(index);
                }}
                onBlur={(event) => {
                  const next = event.relatedTarget as Node | null;
                  if (!event.currentTarget.contains(next)) {
                    setActiveIndex((active) => (active === index ? null : active));
                  }
                }}
                onPointerDown={(event) => {
                  pointerTypeRef.current = event.pointerType;
                }}
              >
                <span className={styles.number}>{value.index}</span>
                <span className={styles.mark} aria-hidden="true">
                  <ValueMark index={value.index} />
                </span>
                <span className={styles.diamond} aria-hidden="true" />
                <h3 className={styles.title}>{value.title}</h3>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
