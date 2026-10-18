"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import type { LifecycleStage } from "@/lib/data/business";
import { useInView } from "@/hooks/useInView";
import { useSnapZone } from "@/hooks/useSnapZone";
import { getLenisInstance } from "@/lib/lenis";
import { Icon } from "../ui/Icon";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import { SnapStop } from "./SnapStop";
import { FinalProductVideo } from "./FinalProductVideo";
import styles from "./DevelopmentLifecycle.module.css";

type DevelopmentLifecycleProps = {
  stages: readonly LifecycleStage[];
  source: string;
};

/* Per-photograph crop emphasis. Values tune object-position so the main
 * subject stays in frame while the quiet area carries the overlay text.
 */
const STAGE_POSITIONS: Record<string, string> = {
  "01": "50% 62%",
  "02": "50% 38%",
  "03": "50% 40%",
  "04": "50% 62%",
  "05": "50% 35%",
  "06": "50% 34%",
  "07": "50% 40%",
  "08": "50% 45%",
  "09": "50% 50%",
};

/* Scroll choreography. Each stage owns one equal slice of the track. The
 * first part of a slice holds the stage still; the last TRANSITION of it
 * plays the change to the next stage, scrubbed by scroll position, so a fast
 * scroll plays every change quickly (never skips one) and scrolling back
 * plays them in reverse. */
const TRANSITION = 0.55;
const HOLD_MIDDLE = (1 - TRANSITION) / 2;
/* Extra smoothing on top of Lenis's wheel smoothing: share of the remaining
 * distance covered per 60 fps frame (lower is softer). */
const FOLLOW = 0.2;
/* Speed limit, in stages per second, so even a hard fling gives every change
 * a few frames on screen instead of jumping past it. */
const MAX_SPEED = 6;
/* Desktop: after the wheel rests this long inside a change, glide to a stage. */
const SETTLE_DELAY_MS = 140;
/* A change nudged past this point completes in the direction of travel. */
const SETTLE_COMMIT = 0.08;

/* The glass blade's two diagonal cuts, as polygon points in %. */
const BLADE_LEFT = [0, 0, 49, 0, 35, 100, 0, 100];
const BLADE_RIGHT = [51, 0, 100, 0, 100, 100, 65, 100];

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function bladePolygon(from: number[], to: number[], t: number) {
  const points: string[] = [];
  for (let i = 0; i < from.length; i += 2) {
    const x = from[i] + (to[i] - from[i]) * t;
    const y = from[i + 1] + (to[i + 1] - from[i + 1]) * t;
    points.push(`${x.toFixed(3)}% ${y}%`);
  }
  return `polygon(${points.join(", ")})`;
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
      <span
        className={styles.stageNavFill}
        style={{ "--fill": activeIndex / Math.max(stages.length - 1, 1) } as CSSProperties}
        aria-hidden="true"
      />
      <ol className={styles.stageNavList}>
        {stages.map((stage, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={stage.index}>
              <button
                type="button"
                className={cx(
                  styles.stageNavItem,
                  index < activeIndex && styles.stageNavItemPast,
                  isActive && styles.stageNavItemActive,
                )}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Go to stage ${stage.index}, ${stage.title}`}
                onClick={() => onSelect(index)}
              >
                <span className={styles.stageNavDot} aria-hidden="true" />
                <span className={styles.stageNavNumber}>{stage.index}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Phones/tablets: the vertical number rail doesn't fit, so a compact
       * prev / counter / next stepper keeps every stage one tap away. */}
      <div className={styles.stageStepper}>
        <button
          type="button"
          className={cx(styles.stepperButton, styles.stepperPrev)}
          aria-label="Previous stage"
          disabled={activeIndex === 0}
          onClick={() => onSelect(activeIndex - 1)}
        >
          <Icon name="chevron-down" />
        </button>
        <span className={styles.stepperCount} aria-live="polite">
          {stages[activeIndex]?.index} / {String(stages.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          className={cx(styles.stepperButton, styles.stepperNext)}
          aria-label="Next stage"
          disabled={activeIndex === stages.length - 1}
          onClick={() => onSelect(activeIndex + 1)}
        >
          <Icon name="chevron-down" />
        </button>
      </div>
    </nav>
  );
}

export function DevelopmentLifecycle({ stages, source }: DevelopmentLifecycleProps) {
  const total = stages.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bladeRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const { ref: listRef, inView: listInView } = useInView<HTMLDivElement>({
    threshold: 0,
    rootMargin: "-8% 0px -8% 0px",
    once: false,
  });

  // The stage index belongs to the pinned stack only: hide it as soon as the
  // "final product" heading below comes into view.
  const { ref: headingRef, inView: headingInView } = useInView<HTMLElement>({
    threshold: 0,
    once: false,
  });

  const setTrackRef = useCallback(
    (el: HTMLDivElement | null) => {
      trackRef.current = el;
      listRef.current = el;
    },
    [listRef],
  );

  /* Scroll position (in stages, 0…total) for a document scroll offset, and back. */
  const geometry = useCallback(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return null;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(track.offsetHeight - stage.offsetHeight, 1);
    return {
      toStages: (y: number) => clamp01((y - top) / travel) * total,
      toY: (s: number) => top + (s / total) * travel,
    };
  }, [total]);

  /* Paints one frame of the choreography for a position `s` (in stages). Only
   * custom properties and one clip-path are written, and only when changed. */
  const paint = useRef<(s: number) => void>(() => {});
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const written = new Map<HTMLElement, Record<string, string>>();
    const write = (el: HTMLElement | null, prop: string, value: string) => {
      if (!el) return;
      const cache = written.get(el) ?? {};
      if (cache[prop] === value) return;
      cache[prop] = value;
      written.set(el, cache);
      el.style.setProperty(prop, value);
    };
    let lastActive = -1;

    paint.current = (s: number) => {
      const i = Math.min(total - 1, Math.floor(s));
      let r = 0;
      if (i < total - 1) {
        r = easeInOutCubic(clamp01((s - (i + 1 - TRANSITION)) / TRANSITION));
        if (reduced.matches) r = r < 0.5 ? 0 : 1;
      }

      slideRefs.current.forEach((slide, j) => {
        const reveal = j <= i ? 1 : j === i + 1 ? r : 0;
        const cover = j < i ? 1 : j === i ? r : 0;
        write(slide, "--in", reveal.toFixed(4));
        write(slide, "--out", cover.toFixed(4));
        write(slide, "--edge", Math.sin(Math.PI * reveal).toFixed(4));
        // Off-screen layers (not yet revealed, or fully covered) skip painting.
        write(slide, "visibility", reveal > 0 && cover < 1 ? "visible" : "hidden");
      });

      captionRefs.current.forEach((caption, j) => {
        const v = j === i ? 1 - clamp01(r / 0.3) : j === i + 1 ? clamp01((r - 0.62) / 0.38) : 0;
        write(caption, "--v", v.toFixed(4));
        write(caption, "visibility", v > 0 ? "visible" : "hidden");
      });

      const blade = bladeRef.current;
      const from = i % 2 === 0 ? BLADE_LEFT : BLADE_RIGHT;
      const to = (i + 1) % 2 === 0 ? BLADE_LEFT : BLADE_RIGHT;
      write(blade, "--blade", bladePolygon(from, to, r));
      write(blade, "--sx", r.toFixed(4));
      write(blade, "--so", (Math.sin(Math.PI * r) * 0.9).toFixed(4));

      const nextActive = r >= 0.5 ? i + 1 : i;
      if (nextActive !== lastActive) {
        lastActive = nextActive;
        setActive(nextActive);
      }
    };
  }, [total]);

  /* Scroll loop: the painted position follows the scroll position with a
   * light ease, so even a stepped wheel or a jump reads as one fluid motion.
   * On desktop, a wheel that comes to rest mid-change glides on to a stage. */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    let geo = geometry();
    let target = geo ? geo.toStages(window.scrollY) : 0;
    let shown = target;
    let frame = 0;
    let lastTime = 0;
    let settleTimer = 0;
    let lastY = window.scrollY;
    let direction = 1;

    const tick = (time: number) => {
      frame = 0;
      const dt = lastTime ? Math.min(time - lastTime, 64) : 16.7;
      lastTime = time;
      if (reduced.matches) {
        shown = target;
      } else {
        let step = (target - shown) * (1 - Math.pow(1 - FOLLOW, dt / 16.7));
        // Inside the section, cap the speed; once scrolled out (target at
        // either end), catch up freely so the stage never lags the page.
        if (target > 0 && target < total) {
          const limit = (MAX_SPEED * dt) / 1000;
          step = Math.max(-limit, Math.min(limit, step));
        }
        shown += step;
        if (Math.abs(target - shown) < 0.0005) shown = target;
      }
      paint.current(shown);
      if (shown !== target) {
        frame = requestAnimationFrame(tick);
      } else {
        lastTime = 0;
      }
    };

    const settle = () => {
      settleTimer = 0;
      if (!geo || coarse.matches) return;
      const s = geo.toStages(window.scrollY);
      const i = Math.floor(s);
      if (i >= total - 1) return;
      const start = i + 1 - TRANSITION;
      const f = (s - start) / TRANSITION;
      // Already still (with a pixel of rounding either way): nothing to do.
      if (f <= 0.01 || f >= 0.99) return;
      const forward = direction > 0 ? f > SETTLE_COMMIT : f > 1 - SETTLE_COMMIT;
      const destination = forward ? i + 1 : start;
      const y = geo.toY(destination);
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(y, { duration: 0.7, easing: easeOutCubic });
      } else {
        window.scrollTo({ top: y, behavior: reduced.matches ? "instant" : "smooth" });
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? 1 : -1;
      lastY = y;
      if (!geo) geo = geometry();
      if (geo) target = geo.toStages(y);
      if (!frame) frame = requestAnimationFrame(tick);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_DELAY_MS);
    };

    const onResize = () => {
      geo = geometry();
      onScroll();
    };

    paint.current(shown);
    const resizeObserver = new ResizeObserver(onResize);
    if (trackRef.current) resizeObserver.observe(trackRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settleTimer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [geometry, total]);

  // Touch: native one-swipe-per-stage snapping while the stage is pinned.
  useSnapZone(trackRef, true, stageRef);

  // Rail / stepper: glide to the still middle of the chosen stage. Every change
  // on the way plays (quickly), exactly as it would when scrolling there.
  const goTo = useCallback(
    (index: number) => {
      const geo = geometry();
      if (!geo || index < 0 || index >= total) return;
      const y = geo.toY(index + HOLD_MIDDLE);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo({ top: y, behavior: "instant" });
        return;
      }
      const lenis = getLenisInstance();
      if (lenis) {
        const steps = Math.abs(index - active);
        lenis.scrollTo(y, {
          duration: Math.min(2.4, 0.9 + steps * 0.22),
          easing: easeInOutCubic,
        });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [geometry, total, active],
  );

  return (
    <section className={styles.section}>
      <div ref={setTrackRef} className={styles.track} style={{ "--steps": total } as CSSProperties}>
        {/* Touch snap stops: the still middle of each stage's slice. */}
        {stages.map((stage, index) => (
          <SnapStop
            key={stage.index}
            top={`calc((100% - 100svh) * ${(index + HOLD_MIDDLE) / total})`}
          />
        ))}

        <div
          ref={stageRef}
          className={styles.stage}
          aria-roledescription="carousel"
          aria-label="Development lifecycle"
        >
          {stages.map((stage, index) => (
            <figure
              key={stage.index}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className={styles.slide}
              aria-hidden={index !== active}
            >
              <div className={styles.photo}>
                <Image
                  src={stage.image.src}
                  alt={stage.image.alt}
                  fill
                  sizes="100vw"
                  // All photos load up front: a fast scroll must never wipe in
                  // one that is still downloading.
                  loading="eager"
                  className={styles.image}
                  style={
                    { "--stage-crop": STAGE_POSITIONS[stage.index] ?? "center" } as CSSProperties
                  }
                />
              </div>
              <span className={styles.shade} aria-hidden="true" />
              <span className={styles.edge} aria-hidden="true" />
            </figure>
          ))}

          <div className={styles.photoScrim} aria-hidden="true" />

          <div ref={bladeRef} className={styles.blade}>
            <span className={styles.sheen} aria-hidden="true" />
            <div aria-live="polite">
              {stages.map((stage, index) => (
                <div
                  key={stage.index}
                  ref={(el) => {
                    captionRefs.current[index] = el;
                  }}
                  className={cx(
                    styles.caption,
                    index % 2 === 0 ? styles.captionLeft : styles.captionRight,
                  )}
                  aria-hidden={index !== active}
                >
                  <div className={styles.meta} aria-hidden="true">
                    <span className={styles.rule} />
                    <span className={styles.eyebrow}>
                      Stage {stage.index}
                      <span className={styles.eyebrowTotal}>
                        {" "}
                        / {String(total).padStart(2, "0")}
                      </span>
                    </span>
                  </div>
                  <h3 className={styles.title}>{stage.title}</h3>
                  <p className={styles.body}>{stage.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <StageNav
        stages={stages}
        activeIndex={active}
        visible={listInView && !headingInView}
        onSelect={goTo}
      />

      <div className={styles.finale}>
        <Container>
          <Reveal>
            <header ref={headingRef} className={styles.mapHeading}>
              <div className={styles.mapHeadingTitle}>
                <span className={styles.rule} aria-hidden="true" />
                <h2 className={styles.mapTitle}>A peak into the final product</h2>
              </div>
              <p className={styles.mapBody}>
                Strategically located, spec-forward facilities near highways, ports, railways and
                airports, serving retail, e-commerce, 3PL and manufacturing.
              </p>
            </header>
          </Reveal>
          <Reveal>
            <div className={styles.plate}>
              <FinalProductVideo />
            </div>
          </Reveal>
        </Container>
      </div>

      {source ? (
        <Container className={styles.footnote}>
          <Reveal>
            <SourceFootnote>{source}</SourceFootnote>
          </Reveal>
        </Container>
      ) : null}
    </section>
  );
}
