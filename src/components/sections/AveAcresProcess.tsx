"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { vertical03DevelopmentProcess, type DevelopmentProcessStage } from "@/lib/data/business";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import styles from "./AveAcresProcess.module.css";

const PROGRESS_START = 0.9;
const PROGRESS_END = 0.3;

const glyphStyle = {
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * Hand-drawn, technical line-art pictograms — one per stage, in the same
 * restrained stroke treatment as the "What Defines Our Developments" marks
 * (AveAcresValues) so the two icon systems read as one language. Each drops
 * into the same stroke="currentColor" treatment the surrounding .glyphWrap
 * scroll-tint states already recolor, so no other styling changes are needed.
 */
function StageMark({ index }: { index: string }) {
  switch (index) {
    // 01 — Identify Land: a site marker over a surveyed plot.
    case "01":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <path d="M28 8C21.1 8 16 13.5 16 20c0 8.5 12 23 12 23s12-14.5 12-23c0-6.5-5.1-12-12-12Z" />
          <circle cx="28" cy="20" r="4.5" />
          <path d="M9 50h38" />
          <path d="M14 50v-5M42 50v-5" />
        </svg>
      );
    // 02 — Plan the Project: a hard hat over rolled architectural plans.
    case "02":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <path d="M12 33C12 21 19 12 28 12c9 0 16 9 16 21" />
          <path d="M8 35c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4" />
          <path d="M8 35h40" />
          <path d="M28 12V8" />
          <rect x="6" y="39" width="15" height="4" rx="1" />
          <path d="M6 43h15" />
          <path d="M33 41 47 31M33 47 47 37" />
        </svg>
      );
    // 03 — Develop and Deliver: a building rising under a tower crane.
    case "03":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <path d="M10 49V29h22v20" />
          <path d="M10 29 21 19l11 10" />
          <path d="M44 6v43" />
          <path d="M20 8h28" />
          <path d="M44 8v-4M40 4h8" />
          <path d="M27 13v10" />
        </svg>
      );
    // 04 — Create a Community: a row of homes, a neighbourhood.
    case "04":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <path d="M8 48V34l8-8 8 8v14H8Z" opacity="0.55" />
          <path d="M32 48V36l8-8 8 8v12H32Z" opacity="0.55" />
          <path d="M19 48V32l10-10 10 10v16H19Z" />
          <path d="M25 48v-9h6v9" />
        </svg>
      );
    default:
      return null;
  }
}

export function AveAcresProcess() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [progress, setProgress] = useState(0);
  const pointerTypeRef = useRef<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * PROGRESS_START;
      const end = viewport * PROGRESS_END;
      setProgress(Math.min(1, Math.max(0, (start - rect.top) / (start - end))));
    };
    const onScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);

  const stages = vertical03DevelopmentProcess.stages;
  const current = Math.min(stages.length - 1, Math.floor(progress * stages.length));

  return (
    <section className={styles.section} aria-labelledby="from-land-to-community-title">
      <Container>
        <Reveal>
          <header className={styles.header}>
            <span className={styles.goldRule} aria-hidden="true" />
            <Eyebrow>{vertical03DevelopmentProcess.eyebrow}</Eyebrow>
            <Heading variant="section" id="from-land-to-community-title">
              {vertical03DevelopmentProcess.heading}
            </Heading>
          </header>
        </Reveal>

        <div
          ref={ref}
          className={cx(styles.track, inView && styles.drawn)}
          style={{ "--pj": progress } as CSSProperties}
        >
          <span className={styles.spine} aria-hidden="true" />
          <ol className={styles.list} aria-labelledby="from-land-to-community-title">
            {stages.map((stage, index) => {
              const stateClass =
                index < current
                  ? styles.nodeDone
                  : index === current
                    ? styles.nodeCurrent
                    : styles.nodeFuture;
              return (
                <li
                  key={stage.index}
                  tabIndex={0}
                  className={cx(
                    styles.node,
                    stateClass,
                    activeIndex === index && styles.nodeActive,
                  )}
                  style={{ "--n": index } as CSSProperties}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() =>
                    setActiveIndex((active) => (active === index ? null : active))
                  }
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
                  <span className={styles.mark} aria-hidden="true" />
                  <div className={styles.nodeInner}>
                    <span className={styles.glyphWrap}>
                      <StageMark index={stage.index} />
                    </span>
                    <span className={styles.index}>{stage.index}</span>
                    <h3 className={styles.title}>{stage.title}</h3>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
