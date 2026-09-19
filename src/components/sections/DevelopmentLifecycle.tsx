"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import { Eyebrow, SourceFootnote } from "@/components/ui";
import type { LifecycleStage } from "@/lib/data/business";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import { ProductsSitePlate } from "./ProductsSitePlate";
import styles from "./DevelopmentLifecycle.module.css";

type DevelopmentLifecycleProps = {
  stages: readonly LifecycleStage[];
  source: string;
};

/* Per-photograph crop emphasis. Values tune object-position so the main
 * subject stays in frame while the quiet area carries the overlay text.
 */
const STAGE_POSITIONS: Record<string, string> = {
  "01": "50% 42%",
  "02": "50% 38%",
  "03": "50% 40%",
  "04": "50% 62%",
  "05": "50% 35%",
  "06": "50% 34%",
  "07": "50% 40%",
  "08": "50% 45%",
};

const CUT_SIDES = [styles.cutLeft, styles.cutRight] as const;
const SWEEP_DIRECTIONS = [styles.sweepLeft, styles.sweepRight, styles.sweepTop, styles.sweepBottom] as const;

// Ease-out: responds immediately on click (no slow-start "did that even
// register?" phase), decelerating smoothly only into the landing.
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/* A deliberately slow, eased jump — not the browser's native smooth scroll,
 * which finishes in well under a second regardless of distance and blows
 * straight past the scroll-scrubbed sweep/develop/text-reveal animations
 * before they can be seen. This is a one-shot rAF loop triggered only by a
 * click (never a continuous scroll listener), so it doesn't carry the same
 * risk as scroll-position-tracking JS — it just interpolates a known start
 * and end value over a fixed duration, then stops.
 *
 * Two things fight this kind of manual animation unless neutralised first:
 * 1. The site's global `html { scroll-behavior: smooth }` (reset.css) makes
 *    the browser *also* smooth-animate each `scrollTo` call on top of our
 *    own easing — fixed below with an explicit `behavior: "instant"`.
 * 2. `html { scroll-snap-type: y proximity }` (also reset.css, added for
 *    manual-scroll landings) tries to pull the page back toward the snap
 *    point we're leaving during the animation's slow, near-stationary
 *    opening frames — that's what produced "stalls, then rushes" on every
 *    jump. Snap is disabled for the duration and restored once we land
 *    (which is itself a valid snap point, so nothing visibly corrects).   */
function calmScrollTo(targetY: number) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const root = document.documentElement;
  const previousSnapType = root.style.scrollSnapType;

  const restoreSnap = () => {
    root.style.scrollSnapType = previousSnapType;
  };

  root.style.scrollSnapType = "none";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || distance === 0) {
    window.scrollTo({ top: targetY, behavior: "instant" });
    requestAnimationFrame(restoreSnap);
    return;
  }

  const duration = Math.min(2600, Math.max(1400, Math.abs(distance) * 0.4));
  const startTime = performance.now();

  function step(now: number) {
    const t = Math.min(1, (now - startTime) / duration);
    window.scrollTo({ top: startY + distance * easeOutCubic(t), behavior: "instant" });
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      restoreSnap();
    }
  }

  requestAnimationFrame(step);
}

type StageRowProps = {
  stage: LifecycleStage;
  order: number;
  priority: boolean;
  onDwell: (order: number) => void;
  sweetSpotRef: (el: HTMLSpanElement | null) => void;
};

function StageRow({ stage, order, priority, onDwell, sweetSpotRef }: StageRowProps) {
  // Fires once and stays true forever — drives the permanent sweep/text reveal.
  const { ref: revealRef, inView: revealed } = useInView<HTMLElement>({ threshold: 0.6 });
  // Fires every time this stage becomes (or stops being) the dominant one on
  // screen — used only to tell the parent which nav number to highlight, so
  // it must be able to flip back off as the user scrolls away.
  const { ref: dwellRef, inView: dwelling } = useInView<HTMLElement>({ threshold: 0.6, once: false });

  const setArticleRef = useCallback(
    (el: HTMLElement | null) => {
      revealRef.current = el;
      dwellRef.current = el;
    },
    [revealRef, dwellRef],
  );

  useEffect(() => {
    if (dwelling) onDwell(order);
  }, [dwelling, order, onDwell]);

  const position = STAGE_POSITIONS[stage.index] ?? "center";
  const cutSide = CUT_SIDES[order % 2];
  const sweepDirection = SWEEP_DIRECTIONS[order % SWEEP_DIRECTIONS.length];

  return (
    <div className={styles.stageTrack}>
      {/* Unambiguous, non-sticky target sitting exactly where this stage's
       * arrival is complete and its recede hasn't yet begun — image at its
       * sharpest, text fully revealed. Doubles as the scroll-snap point and
       * as the destination the fixed stage nav scrolls to on click, so
       * "landing on the perfect moment" never depends on manual scrolling. */}
      <span ref={sweetSpotRef} className={styles.snapMarker} aria-hidden="true" />
      <article ref={setArticleRef} className={cx(styles.stage, revealed && styles.isActive)}>
        {/* .stageInner carries the entrance-slide + recede/dim animation,   */}
        {/* kept separate from .stage (the sticky positioning box) so the   */}
        {/* two concerns — "where this pins" vs "how it arrives/departs" —  */}
        {/* never fight each other.                                         */}
        <div className={styles.stageInner}>
          <figure className={styles.figure}>
            <Image
              src={stage.image.src}
              alt={stage.image.alt}
              fill
              sizes="100vw"
              className={styles.image}
              style={{ "--stage-crop": position } as CSSProperties}
              priority={priority}
              unoptimized
            />
          </figure>

          <div className={styles.photoScrim} aria-hidden="true" />

          <div className={cx(styles.textPanel, cutSide)}>
            <div className={cx(styles.sweep, sweepDirection)} aria-hidden="true" />
            <div className={styles.textPanelInner}>
              <div className={styles.meta} aria-hidden="true">
                <span className={styles.rule} />
                <span className={styles.eyebrow}>Stage {stage.index}</span>
              </div>
              <h3 className={styles.title}>{stage.title}</h3>
              <p className={styles.body}>{stage.body}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

type StageNavProps = {
  stages: readonly LifecycleStage[];
  activeIndex: number;
  visible: boolean;
  onSelect: (index: number) => void;
};

function StageNav({ stages, activeIndex, visible, onSelect }: StageNavProps) {
  return (
    <nav
      className={cx(styles.stageNav, visible && styles.stageNavVisible)}
      aria-label="Jump to a development lifecycle stage"
    >
      <span className={styles.stageNavTrack} aria-hidden="true" />
      <ol className={styles.stageNavList}>
        {stages.map((stage, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={stage.index}>
              <button
                type="button"
                className={cx(styles.stageNavItem, isActive && styles.stageNavItemActive)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Jump to stage ${stage.index}, ${stage.title}`}
                onClick={() => onSelect(index)}
              >
                <span className={styles.stageNavDot} aria-hidden="true" />
                <span className={styles.stageNavNumber}>{stage.index}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function DevelopmentLifecycle({ stages, source }: DevelopmentLifecycleProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sweetSpotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const { ref: listRef, inView: listInView } = useInView<HTMLDivElement>({
    threshold: 0,
    rootMargin: "-8% 0px -8% 0px",
    once: false,
  });

  const handleDwell = useCallback((order: number) => setActiveIndex(order), []);

  const handleSelect = useCallback((index: number) => {
    const el = sweetSpotRefs.current[index];
    if (!el) return;
    calmScrollTo(el.getBoundingClientRect().top + window.scrollY);
  }, []);

  return (
    <section className={styles.section}>
      <div ref={listRef} className={styles.list}>
        {stages.map((stage, index) => (
          <StageRow
            key={stage.index}
            stage={stage}
            order={index}
            priority={index === 0}
            onDwell={handleDwell}
            sweetSpotRef={(el) => {
              sweetSpotRefs.current[index] = el;
            }}
          />
        ))}
      </div>

      <StageNav stages={stages} activeIndex={activeIndex} visible={listInView} onSelect={handleSelect} />

      <Container>
        <Reveal>
          <header className={styles.mapHeading}>
            <span className={styles.goldRule} aria-hidden="true" />
            <Eyebrow className={styles.mapEyebrow}>Logistics and Industrial Infrastructure</Eyebrow>
            <h2 className={styles.mapTitle}>A peak into the final product</h2>
            <p className={styles.mapBody}>
              Strategically located, spec-forward facilities near highways, ports, railways and
              airports — serving retail, e-commerce, 3PL and manufacturing.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <div className={styles.plate}>
            <ProductsSitePlate />
          </div>
        </Reveal>

        {source ? (
          <Reveal>
            <SourceFootnote>{source}</SourceFootnote>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
