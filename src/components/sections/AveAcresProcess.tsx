"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout";
import { Heading } from "@/components/ui";
import { vertical03DevelopmentProcess } from "@/lib/data/business";
import { Reveal, type RevealDelay } from "./Reveal";
import { SketchReveal, phases } from "./SketchReveal";
import styles from "./AveAcresProcess.module.css";

const ARTWORK_LABEL =
  "Masterplan of a residential community: a landscaped park with a central garden, play areas, pavilions and a sports field, beside tree-lined roads and plots";

const glyphStyle = {
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* Technical line-art pictograms, one per stage. */
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

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* "From Land to Community". The masterplan is drawn onto a white page as   */
/* the reader scrolls (ink lines grow along their paths, then the hatching  */
/* fills in), painted into full colour with broad brush sweeps, and finally */
/* opened out to fill the screen. On desktop the visitor can paint the      */
/* colour in with the cursor while the drawing is still pencil. Everything  */
/* follows scroll position, so it plays backwards when scrolling up.        */
export function AveAcresProcess() {
  const stages = vertical03DevelopmentProcess.stages;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(0);
  const [motion, setMotion] = useState(true);
  const [brush, setBrush] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      setMotion(!reduced.matches);
      setBrush(!reduced.matches && hover.matches);
    };
    update();
    reduced.addEventListener("change", update);
    hover.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      hover.removeEventListener("change", update);
    };
  }, []);

  // Scroll position through the track, 0-1, read by the renderer each frame.
  useEffect(() => {
    if (!motion) return;
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const travel = Math.max(track.offsetHeight - window.innerHeight, 1);
      targetRef.current = Math.min(Math.max(-track.getBoundingClientRect().top / travel, 0), 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [motion]);

  // The finished painting opens out from its framed box to fill the screen.
  const onFrame = useCallback((p: number) => {
    const box = boxRef.current;
    const stage = stageRef.current;
    if (!box || !stage) return;
    const ph = phases(p);
    const e = easeInOut(ph.expand);
    const scale = Math.max(
      stage.clientWidth / box.offsetWidth,
      stage.clientHeight / box.offsetHeight,
    );
    box.style.transform = `scale(${1 + (scale - 1) * e})`;
    box.style.borderRadius = `${(1 - e) * 0.75}rem`;
    box.style.setProperty("--lift", String(ph.full * (1 - e)));
  }, []);

  return (
    <section className={styles.section} aria-labelledby="from-land-to-community-title">
      <Container>
        <Reveal>
          <header className={styles.header}>
            <span className={styles.goldRule} aria-hidden="true" />
            <Heading variant="section" id="from-land-to-community-title">
              {vertical03DevelopmentProcess.heading}
            </Heading>
          </header>
        </Reveal>
      </Container>

      {motion ? (
        <div ref={trackRef} className={styles.track}>
          <div ref={stageRef} className={styles.stage}>
            <div ref={boxRef} className={styles.box}>
              <SketchReveal
                targetRef={targetRef}
                onFrame={onFrame}
                brush={brush}
                label={ARTWORK_LABEL}
              />
            </div>
          </div>
        </div>
      ) : (
        <Container>
          <div className={styles.staticBox}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/residential/land-photo.jpg"
              alt={ARTWORK_LABEL}
              className={styles.fallback}
            />
          </div>
        </Container>
      )}

      <Container>
        <ol className={styles.stages}>
          {stages.map((stage, index) => (
            <li key={stage.index}>
              <Reveal delay={index as RevealDelay}>
                <div className={styles.stageItem}>
                  <span className={styles.stageMark} aria-hidden="true">
                    <StageMark index={stage.index} />
                  </span>
                  <span className={styles.stageIndex}>{stage.index}</span>
                  <h3 className={styles.stageTitle}>{stage.title}</h3>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
