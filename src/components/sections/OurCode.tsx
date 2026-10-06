"use client";

import { useEffect, useRef, useState } from "react";
import { Stack } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { ourCode, type OurCodeValue } from "@/lib/data/about";
import { getLenisInstance } from "@/lib/lenis";
import { cx } from "../ui/cx";
import { DrawnGrid } from "./DrawnGrid";
import styles from "./OurCode.module.css";

const markProps = {
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* pathLength=1 normalizes every shape's dash math to the 0–1 range, no      */
/* matter its real length, so the CSS draw-in (stroke-dasharray/dashoffset)  */
/* works identically across every icon without hand-measuring each path.    */
const drawn = { pathLength: 1 } as const;

function CodeMark({ index }: { index: string }) {
  switch (index) {
    case "01":
      // Infrastructure that enables — a warehouse, with growth breaking free of it.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...drawn} d="M8 46 H36 V30 L22 18 L8 30 Z" />
          <path {...drawn} d="M16 46 V36 H28 V46" />
          <path {...drawn} d="M32 34 L48 18 M40 18 H48 V26" />
        </svg>
      );
    case "02":
      // Enabling the last mile — a route resolving to a clear destination pin.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...drawn} d="M8 44 Q 24 44 30 30 T 44 15" />
          <path
            {...drawn}
            d="M44 6 C 49.5 6 53 9.9 53 14.5 C 53 20.5 44 29 44 29 C 44 29 35 20.5 35 14.5 C 35 9.9 38.5 6 44 6 Z"
          />
          <circle {...drawn} cx="44" cy="14.5" r="2.5" />
        </svg>
      );
    case "03":
      // Efficiency at scale — accelerating bars.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...drawn} d="M10 44 H46" />
          <path {...drawn} d="M16 44 V34 M26 44 V26 M36 44 V18 M46 44 V11" />
          <path {...drawn} d="M38 12 L46 11 L45 19" />
        </svg>
      );
    case "04":
      // Design that delivers — a drafting compass, precision engineered ahead of time.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...drawn} d="M28 11 L14 45 M28 11 L42 45" />
          <circle {...drawn} cx="28" cy="10" r="2.5" />
          <path {...drawn} d="M17.5 38 A 13 13 0 0 1 38.5 38" />
        </svg>
      );
    case "05":
      // Agility with accountability — a stopwatch, moving fast without losing the mark.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <circle {...drawn} cx="27" cy="31" r="15" />
          <path {...drawn} d="M23 10 H31 M27 10 V5" />
          <path {...drawn} d="M40 12 L44 16" />
          <path {...drawn} d="M20 31 L25 36 L35 24" />
        </svg>
      );
    case "06":
      // People build the organization — three figures of rising height, the
      // organization literally built up from its people.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <circle {...drawn} cx="12" cy="21" r="4" />
          <path {...drawn} d="M5 45 C5 33 19 33 19 45" />
          <circle {...drawn} cx="28" cy="13" r="4.5" />
          <path {...drawn} d="M17 45 C17 27 39 27 39 45" />
          <circle {...drawn} cx="44" cy="21" r="4" />
          <path {...drawn} d="M37 45 C37 33 51 33 51 45" />
        </svg>
      );
    case "07":
      // Customer-led approach — the customer at the centre, the business orbiting around them.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <circle {...drawn} cx="28" cy="29" r="7" />
          <path {...drawn} d="M28 10 A 19 19 0 1 1 10.4 22.5" />
          <circle {...drawn} cx="10.4" cy="22.5" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

/* The Ledger Reel ---------------------------------------------------------- */
/* One continuous scrub value (`continuousIndex`, 0 → values.length - 1)      */
/* drives everything: each panel's horizontal position, its icon's draw-in,   */
/* its title's wipe reveal, and the ledger marker below. The mapping from      */
/* raw scroll to that value isn't linear — it holds on each integer (a value  */
/* sitting still, fully readable) then eases swiftly to the next, so the      */
/* "continuous" motion still has the breathing room the pacing pass earlier   */
/* established, rather than drifting at a constant rate the whole time.       */
const RISE = 0.85;
const HOLD = 0.85;
const STEP = RISE + HOLD;

function transitionStart(i: number): number {
  return i === 0 ? 0 : HOLD + (i - 1) * STEP;
}

function easeInOutQuint(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return c < 0.5 ? 16 * c * c * c * c * c : 1 - Math.pow(-2 * c + 2, 5) / 2;
}

function continuousIndexAt(t: number, count: number): number {
  let index = 0;
  for (let i = 1; i < count; i++) {
    const start = transitionStart(i);
    if (t < start) break;
    const local = Math.min(Math.max((t - start) / RISE, 0), 1);
    index = i - 1 + easeInOutQuint(local);
  }
  return index;
}

function CodeReel({ values }: { values: readonly OurCodeValue[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalUnits = transitionStart(values.length - 1) + RISE + HOLD;

  const goToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;
    const target = i * STEP + HOLD / 2;
    const raw = Math.min(Math.max(target / totalUnits, 0), 1);
    const targetY = window.scrollY + rect.top + raw * scrollable;

    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(targetY);
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMode = () => setPinEnabled(mqDesktop.matches && !mqMotion.matches);
    updateMode();
    mqDesktop.addEventListener("change", updateMode);
    mqMotion.addEventListener("change", updateMode);
    return () => {
      mqDesktop.removeEventListener("change", updateMode);
      mqMotion.removeEventListener("change", updateMode);
    };
  }, []);

  useEffect(() => {
    if (!pinEnabled) return;
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;

    /* Sampled every animation frame rather than driven by the native       */
    /* `scroll` event — under a smooth-scroll library (Lenis) the document's */
    /* real scroll position is itself interpolated across frames, so a      */
    /* listener gated on the native event can read a position that's a      */
    /* frame behind what's on screen. Reading real geometry every rAF tick  */
    /* instead stays frame-perfect regardless of what is driving the scroll. */
    const update = () => {
      const rect = track.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Cheap bail while the track is nowhere near the viewport.
      if (rect.bottom > -viewportH && rect.top < viewportH * 2) {
        const scrollable = rect.height - viewportH;
        const raw = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
        const continuousIndex = continuousIndexAt(raw * totalUnits, values.length);

        panelRefs.current.forEach((panel, i) => {
          if (!panel) return;
          const offset = i - continuousIndex;
          const linear = Math.min(Math.max(1 - Math.abs(offset), 0), 1);
          /* Smoothstep, not linear — a true fade curve (slow-fast-slow) rather */
          /* than a constant-rate crossfade, which is what read as a "flip".   */
          const center = linear * linear * (3 - 2 * linear);
          panel.style.setProperty("--offset", String(offset));
          panel.style.setProperty("--center", String(center));
        });

        frameRef.current?.style.setProperty(
          "--reel-progress",
          String(continuousIndex / (values.length - 1)),
        );

        const nextActive = Math.min(values.length - 1, Math.max(0, Math.round(continuousIndex)));
        setActiveIndex((prev) => (prev === nextActive ? prev : nextActive));
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [pinEnabled, totalUnits, values.length]);

  return (
    <div
      ref={trackRef}
      className={styles.track}
      style={pinEnabled ? { height: `${(totalUnits + 1) * 100}vh` } : undefined}
    >
      <div ref={frameRef} className={cx(styles.sticky, pinEnabled && styles.stickyPinned)}>
        {pinEnabled ? <DrawnGrid className={styles.grid} /> : null}

        <Eyebrow as="span" tone="dark" className={styles.sectionHeading}>
          The Code
        </Eyebrow>

        {values.map((value, i) => (
          <article
            key={value.index}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={cx(styles.panel, pinEnabled && styles.panelPinned)}
            aria-hidden={pinEnabled && i !== activeIndex}
          >
            <div className={styles.panelMeta}>
              <span className={styles.panelMark} aria-hidden="true">
                <CodeMark index={value.index} />
              </span>
            </div>
            <span className={styles.panelDivider} aria-hidden="true" />
            <Stack gap="md" className={styles.panelText}>
              <Heading variant="section" as="h3" tone="dark" className={styles.panelTitle}>
                {value.title}
              </Heading>
              <p className={styles.panelTagline}>{value.tagline}</p>
              <p className={styles.panelBody}>{value.body}</p>
            </Stack>
          </article>
        ))}

        {pinEnabled ? (
          <div className={styles.ledger}>
            <div className={styles.ledgerBar} aria-hidden="true">
              <span className={styles.ledgerFill} />
            </div>
            <div className={styles.ledgerRow}>
              <span className={styles.ledgerCounter} aria-hidden="true">
                <span className={styles.ledgerCounterActive}>
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className={styles.ledgerCounterSep}>/</span>
                <span className={styles.ledgerCounterTotal}>
                  {String(values.length).padStart(2, "0")}
                </span>
              </span>
              <ol className={styles.ledgerTicks}>
                {values.map((value, i) => (
                  <li key={value.index}>
                    <button
                      type="button"
                      className={cx(
                        styles.ledgerTick,
                        i === activeIndex && styles.ledgerTickActive,
                      )}
                      onClick={() => goToIndex(i)}
                      aria-label={`Go to ${value.title}`}
                      aria-current={i === activeIndex ? "true" : undefined}
                    >
                      {value.index}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function OurCode() {
  return (
    <section className={styles.section} aria-label={ourCode.heading}>
      <CodeReel values={ourCode.values} />
    </section>
  );
}
