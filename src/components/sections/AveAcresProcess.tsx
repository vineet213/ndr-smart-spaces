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
  fill: "currentColor",
  stroke: "none",
} as const;

/**
 * Simple, solid pictograms — one instantly-readable symbol per stage rather
 * than abstract line art. Each drops into the same fill="currentColor"
 * treatment the surrounding .glyphWrap scroll-tint states already recolor,
 * so no other styling changes are needed.
 */
function StageMark({ index }: { index: string }) {
  switch (index) {
    // 01 — Identify Land: a location pin marking a plot.
    case "01":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M28 50C28 50 14 33.8 14 22C14 13.163 20.163 7 28 7C35.837 7 42 13.163 42 22C42 33.8 28 50 28 50ZM28 29C31.866 29 35 25.866 35 22C35 18.134 31.866 15 28 15C24.134 15 21 18.134 21 22C21 25.866 24.134 29 28 29Z"
          />
        </svg>
      );
    // 02 — Plan the Project: a T-square, the architect's planning tool.
    case "02":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <rect x="9" y="10" width="38" height="7" rx="1" />
          <rect x="24" y="17" width="8" height="33" rx="1" />
          <rect x="20" y="24" width="16" height="3" />
          <rect x="20" y="33" width="16" height="3" />
          <rect x="20" y="42" width="16" height="3" />
        </svg>
      );
    // 03 — Develop and Deliver: a building rising under a tower crane.
    case "03":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <path d="M9 49V30H33V49H9Z" />
          <path d="M9 30L21 19L33 30H9Z" />
          <rect x="43" y="8" width="4" height="41" />
          <rect x="21" y="9" width="26" height="4" />
          <rect x="45" y="4" width="8" height="6" />
          <rect x="26" y="13" width="3" height="11" />
          <rect x="23" y="23" width="9" height="3" />
        </svg>
      );
    // 04 — Create a Community: a row of houses, a neighbourhood.
    case "04":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <path d="M8 48V34L16 26L24 34V48H8Z" opacity="0.55" />
          <path d="M32 48V36L40 28L48 36V48H32Z" opacity="0.55" />
          <path d="M19 50V33L29 23L39 33V50H19Z" />
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
