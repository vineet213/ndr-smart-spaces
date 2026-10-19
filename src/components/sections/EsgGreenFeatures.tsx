"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container } from "@/components/layout";
import { Heading } from "@/components/ui";
import { useSnapZone } from "@/hooks/useSnapZone";
import { getLenisInstance } from "@/lib/lenis";
import { esgGreenFeatures } from "@/lib/data/esg";
import type { EsgGreenFeature } from "@/lib/data/esg";
import { cx } from "../ui/cx";
import { EsgBand } from "./EsgBand";
import { EsgParkDrawing } from "./EsgParkDrawing";
import { Reveal, type RevealDelay } from "./Reveal";
import { SnapStop } from "./SnapStop";
import styles from "./EsgGreenFeatures.module.css";

/* Short labels for the progress rail under the drawing, in feature order. */
const RAIL_LABELS = ["Solar", "Water", "EV", "Green cover", "Waste", "Construction"] as const;

type FeatureCardProps = {
  feature: EsgGreenFeature;
  order: number;
  total: number;
  active: boolean;
};

function FeatureCard({ feature, order, total, active }: FeatureCardProps) {
  return (
    <article
      className={cx(styles.card, active && styles.cardActive)}
      aria-hidden={!active}
      inert={!active}
      aria-roledescription="slide"
      aria-label={`${order + 1} of ${total}`}
    >
      <figure className={styles.photo}>
        {feature.image ? (
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            fill
            sizes="(min-width: 1024px) 26rem, 100vw"
            className={styles.photoImage}
          />
        ) : null}
      </figure>
      <div className={styles.cardText}>
        <span className={styles.index} aria-hidden="true">
          {feature.index}
          <span className={styles.indexTotal}> / {String(total).padStart(2, "0")}</span>
        </span>
        <Heading variant="sub" as="h3" tone="dark" className={styles.title}>
          {feature.title}
        </Heading>
      </div>
    </article>
  );
}

export function EsgGreenFeatures() {
  const features = esgGreenFeatures.features;
  const total = features.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(true);
  const [active, setActive] = useState(0);

  /* Phones and reduced-motion visitors get the story layout (the lit park as */
  /* a header plate, then one card per feature) instead of the pinned stage.  */
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const wide = window.matchMedia("(min-width: 768px)");
    const update = () => setPinned(motion.matches && wide.matches);
    update();
    motion.addEventListener("change", update);
    wide.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      wide.removeEventListener("change", update);
    };
  }, []);

  /* The active feature follows the scroll. Track and stage sizes are measured */
  /* once and on resize; each frame does one read and, at most, one state     */
  /* change, so scrolling never forces layout.                                 */
  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    let frame = 0;
    let current = -1;
    let travel = 1;
    let stick = 0;

    const measure = () => {
      stick = parseFloat(getComputedStyle(stage).top) || 0;
      travel = Math.max(track.offsetHeight - stage.offsetHeight, 1);
    };

    const update = () => {
      frame = 0;
      const progress = Math.min(
        Math.max((stick - track.getBoundingClientRect().top) / travel, 0),
        1,
      );
      const next = Math.min(total - 1, Math.floor(progress * total));
      if (next !== current) {
        current = next;
        setActive(next);
      }
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    measure();
    update();
    const resizeObserver = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resizeObserver.observe(track);
    resizeObserver.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [pinned, total]);

  // Touch: one swipe per feature, only while the stage is pinned.
  useSnapZone(trackRef, pinned, stageRef);

  // Rail: jump to the middle of a feature's slice of the track.
  const goTo = (index: number) => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    const stick = parseFloat(getComputedStyle(stage).top) || 0;
    const travel = track.offsetHeight - stage.offsetHeight;
    const target =
      track.getBoundingClientRect().top + window.scrollY - stick + travel * ((index + 0.5) / total);
    const lenis = getLenisInstance();
    if (lenis) lenis.scrollTo(target);
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="in-practice" aria-labelledby="esg-in-practice-title">
      <EsgBand
        id="esg-in-practice-title"
        heading={esgGreenFeatures.heading}
        lede={esgGreenFeatures.lede}
        image={esgGreenFeatures.image}
      />
      <Container className={styles.content}>
        {pinned ? (
          <div
            ref={trackRef}
            className={styles.track}
            style={{ "--steps": total } as CSSProperties}
          >
            {/* Touch snap stops: one at the middle of each feature's slice. */}
            {features.map((feature, index) => (
              <SnapStop
                key={feature.index}
                top={`calc((100% - var(--stage-h)) * ${(index + 0.5) / total} - var(--stick))`}
              />
            ))}
            <div ref={stageRef} className={styles.stage}>
              <div className={styles.drawingCol}>
                <EsgParkDrawing active={active} />
                <ol className={styles.rail}>
                  {features.map((feature, index) => (
                    <li key={feature.index}>
                      <button
                        type="button"
                        className={cx(
                          styles.railStop,
                          index <= active && styles.railStopLit,
                          index === active && styles.railStopActive,
                        )}
                        onClick={() => goTo(index)}
                        aria-label={`Go to ${feature.title}`}
                        aria-current={index === active ? "step" : undefined}
                      >
                        <span className={styles.railDot} aria-hidden="true" />
                        <span className={styles.railLabel}>
                          {RAIL_LABELS[index] ?? feature.index}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              <div className={styles.cards} aria-live="polite">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={feature.index}
                    feature={feature}
                    order={index}
                    total={total}
                    active={index === active}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.story}>
            <Reveal>
              <div className={styles.storyPlate}>
                <EsgParkDrawing active={total - 1} />
                <p className={styles.storyCaption}>{total} measures, built into every park</p>
              </div>
            </Reveal>
            <ol className={styles.storyList}>
              {features.map((feature, index) => (
                <li key={feature.index}>
                  <Reveal delay={(index % 2) as RevealDelay}>
                    <article className={styles.storyCard}>
                      <Reveal variant="unmask">
                        <figure className={styles.storyPhoto}>
                          {feature.image ? (
                            <Image
                              src={feature.image.src}
                              alt={feature.image.alt}
                              fill
                              sizes="(max-width: 767px) 100vw, 60vw"
                              className={styles.photoImage}
                            />
                          ) : null}
                          <figcaption className={styles.storyHead}>
                            <span className={styles.storyIndex}>
                              {feature.index}
                              <span className={styles.indexTotal}>
                                {" "}
                                / {String(total).padStart(2, "0")}
                              </span>
                            </span>{" "}
                            <span className={styles.storyLabel}>{RAIL_LABELS[index] ?? ""}</span>
                          </figcaption>
                        </figure>
                      </Reveal>
                      <div className={styles.storyText}>
                        <Heading variant="sub" as="h3" className={styles.storyTitle}>
                          {feature.title}
                        </Heading>
                        <p className={styles.storyBody}>{feature.body}</p>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Container>
    </section>
  );
}
