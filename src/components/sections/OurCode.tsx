"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Stack } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { ourCode, type OurCodeValue } from "@/lib/data/about";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
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
    case "02":
      // Infrastructure that drives growth — a warehouse, with growth breaking free of it.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...drawn} d="M8 46 H36 V30 L22 18 L8 30 Z" />
          <path {...drawn} d="M16 46 V36 H28 V46" />
          <path {...drawn} d="M32 34 L48 18 M40 18 H48 V26" />
        </svg>
      );
    case "03":
      // Closer to every opportunity — a route resolving to a clear destination pin.
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
    case "01":
      // Built smarter, scaled further — accelerating bars.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...drawn} d="M10 44 H46" />
          <path {...drawn} d="M16 44 V34 M26 44 V26 M36 44 V18 M46 44 V11" />
          <path {...drawn} d="M38 12 L46 11 L45 19" />
        </svg>
      );
    case "04":
      // Design that delivers — a truss-framed building elevation under a dimension
      // line, with a lighter second bay extending it: strong structure, flexible layout.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path {...drawn} d="M5 49 H51" />
          <path {...drawn} d="M9 49 V31 L20 20 L31 31 V49" />
          <path {...drawn} d="M9 31 H31 M20 20 V31 M14.5 31 L20 25.5 L25.5 31" />
          <path {...drawn} opacity={0.55} d="M31 31 L42 20 L53 31 V49" />
          <path {...drawn} opacity={0.55} d="M31 31 H53 M42 20 V31" />
          <path {...drawn} d="M9 10 H53 M9 7 V13 M53 7 V13" />
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

/* The Code, index + detail --------------------------------------------------- */
/* All seven values stay visible as a numbered list, so the whole "code" can be   */
/* taken in at a glance; the detail beside it follows the active one. The active  */
/* list item carries its own timer line: it fills over SLIDE_MS and its           */
/* animation-end advances to the next value, so the line and the timing can       */
/* never drift apart. There is no hover or focus pausing (the pointer is on a     */
/* full-width band most of the time); it holds only for the pause button, an      */
/* expanded paragraph, the section being off screen or a hidden tab.              */

/* The very first slide only holds for a second, so it is obvious from the first   */
/* moment that the section moves; every slide after that gets SLIDE_MS.            */
const INTRO_MS = 1000;
const SLIDE_MS = 2500;

function PlayPause({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      {playing ? (
        <path
          d="M6.5 4.5 V15.5 M13.5 4.5 V15.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M6.5 4.5 L15 10 L6.5 15.5 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function CodeSlideshow({ values }: { values: readonly OurCodeValue[] }) {
  const count = values.length;
  const { ref: bandRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.25,
    rootMargin: "0px",
    once: false,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [canExpand, setCanExpand] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /* "Read more" only appears when the paragraph is actually cut off. */
  useEffect(() => {
    const measure = () => {
      const body = bodyRefs.current[activeIndex];
      if (!body || expanded) return;
      setCanExpand(body.scrollHeight > body.clientHeight + 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex, expanded]);

  /* Autoplay is off entirely for reduced-motion users; for everyone else the  */
  /* timer line runs unless something is asking it to hold.                     */
  const autoplay = !reduceMotion && !userPaused;
  const running = autoplay && inView && pageVisible && !expanded;

  const slideMs = activeIndex === 0 && !introDone ? INTRO_MS : SLIDE_MS;

  const goTo = (index: number) => {
    if (activeIndex === 0) setIntroDone(true);
    setActiveIndex(((index % count) + count) % count);
    setExpanded(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  return (
    <div
      ref={bandRef}
      className={styles.band}
      role="group"
      aria-roledescription="carousel"
      aria-label="Our Code"
      onKeyDown={onKeyDown}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <Eyebrow as="span" tone="dark" className={styles.sectionHeading}>
            Our Code
          </Eyebrow>

          {reduceMotion ? null : (
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => setUserPaused((paused) => !paused)}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
            >
              <PlayPause playing={!userPaused} />
            </button>
          )}
        </div>

        <div className={styles.layout}>
          <ol className={styles.index}>
            {values.map((value, i) => {
              const active = i === activeIndex;
              return (
                <li key={value.index}>
                  <button
                    type="button"
                    className={cx(styles.indexItem, active && styles.indexItemActive)}
                    onClick={() => goTo(i)}
                    aria-label={`${value.index}: ${value.title}`}
                    aria-current={active ? "true" : undefined}
                  >
                    <span className={styles.indexNumber} aria-hidden="true">
                      {value.index}
                    </span>
                    <span className={styles.indexTitle} aria-hidden="true">
                      {value.title}
                    </span>
                    {active ? (
                      autoplay ? (
                        <span
                          key={activeIndex}
                          className={cx(styles.timer, !running && styles.timerHeld)}
                          style={{ animationDuration: `${slideMs}ms` }}
                          onAnimationEnd={() => goTo(activeIndex + 1)}
                          aria-hidden="true"
                        />
                      ) : (
                        <span className={styles.timerStatic} aria-hidden="true" />
                      )
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className={styles.stage} aria-live={running ? "off" : "polite"}>
            {values.map((value, i) => {
              const active = i === activeIndex;
              return (
                <article
                  key={value.index}
                  className={cx(styles.panel, active && styles.panelActive)}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={!active}
                  inert={!active}
                >
                  <div className={styles.panelMeta}>
                    <span className={styles.panelRing} aria-hidden="true" />
                    <span className={styles.panelMark} aria-hidden="true">
                      <CodeMark index={value.index} />
                    </span>
                  </div>
                  <Stack gap="md" className={styles.panelText}>
                    <Heading variant="section" as="h3" tone="dark" className={styles.panelTitle}>
                      {value.title}
                    </Heading>
                    <p className={styles.panelTagline}>{value.tagline}</p>
                    <p
                      ref={(el) => {
                        bodyRefs.current[i] = el;
                      }}
                      className={cx(styles.panelBody, active && expanded && styles.panelBodyOpen)}
                    >
                      {value.body}
                    </p>
                    <button
                      type="button"
                      className={cx(
                        styles.readMore,
                        active && !canExpand && !expanded && styles.readMoreHidden,
                      )}
                      tabIndex={active && !canExpand && !expanded ? -1 : undefined}
                      aria-expanded={active && expanded}
                      onClick={() => setExpanded((open) => !open)}
                    >
                      {active && expanded ? "Show less" : "Read more"}
                    </button>
                  </Stack>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OurCode() {
  return (
    <section className={styles.section} aria-label={ourCode.heading}>
      <CodeSlideshow values={ourCode.values} />
    </section>
  );
}
