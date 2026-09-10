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

const trackStyle = {
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function StageMark({ index }: { index: string }) {
  switch (index) {
    case "01":
      return (
        <svg {...trackStyle} aria-hidden="true" focusable="false">
          <path d="M12 36 L10 25 L18 14 L32 10 L44 16 L48 30 L42 42 L26 45 Z" />
          <path d="M17 40 C 24 34, 33 42, 40 37" />
          <path d="M28 21 V33 M21 27 H35" />
          <path d="M47 8 V16 M43 12 H51" />
        </svg>
      );
    case "02":
      return (
        <svg {...trackStyle} aria-hidden="true" focusable="false">
          <path d="M11 18 H45 V50 H11 Z" />
          <path d="M24 18 V50 M37 18 V50" />
          <path d="M11 35 H45" />
          <path d="M11 50 L45 27" />
        </svg>
      );
    case "03":
      return (
        <svg {...trackStyle} aria-hidden="true" focusable="false">
          <path d="M26 9 V50" />
          <path d="M26 14 H45 M26 22 H48" />
          <path d="M30 14 L39 22" />
          <path d="M13 14 H26 M15 22 H26" />
          <path d="M31 50 H44 M31 50 L38 35 M44 50 L38 35" />
        </svg>
      );
    case "04":
      return (
        <svg {...trackStyle} aria-hidden="true" focusable="false">
          <path d="M11 46 V36 L17 30 L23 36 V46 Z" />
          <path d="M27 46 V39 L33 34 L39 39 V46 Z" />
          <path d="M18 50 C 25 44, 31 47, 37 41" />
          <path d="M46 40 V47 M43 41 L46 38 L49 41" />
          <path d="M46 40 C 41 34.5, 42.5 29.5, 46 27 C 49.5 29.5, 51 34.5, 46 40 Z" />
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
