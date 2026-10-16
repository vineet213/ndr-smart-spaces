"use client";

import { useEffect, useRef, useState } from "react";
import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { aboutTimeline } from "@/lib/data/about";
import { Reveal } from "./Reveal";
import { MotifSvg, WavePaths, motifFor } from "./TimelineArt";
import styles from "./AboutTimeline.module.css";
import { cx } from "../ui/cx";

/* The gold line is drawn by scroll position, not in steps: every frame the   */
/* tip is placed at a fixed point down the viewport, and a milestone lights   */
/* up the moment the tip passes its node. The line therefore always ends      */
/* exactly where the reader is looking, and a quick scroll can't skip ahead   */
/* of it or leave it behind.                                                  */
const FOCUS = 0.58;

export function AboutTimeline() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const nodes = Array.from(list.querySelectorAll<HTMLElement>("[data-node]"));
    if (nodes.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let current = -2;

    const update = () => {
      frame = 0;
      const listTop = list.getBoundingClientRect().top;
      const centres = nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return box.top + box.height / 2 - listTop;
      });
      const end = centres[centres.length - 1];
      const focus = reduceMotion ? end : window.innerHeight * FOCUS - listTop;
      const tip = Math.min(Math.max(focus, 0), end);
      list.style.setProperty("--tip", `${tip}px`);

      let next = -1;
      for (let index = 0; index < centres.length; index += 1) {
        if (centres[index] <= tip + 1) next = index;
      }
      if (next !== current) {
        current = next;
        setActive(next);
      }
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className={styles.section} aria-labelledby="timeline-title">
      <Container>
        <Stack gap="6xl">
          <Reveal>
            <Stack gap="xl">
              <Eyebrow tone="dark">{aboutTimeline.eyebrow}</Eyebrow>
              <Heading variant="section" tone="dark" id="timeline-title">
                {aboutTimeline.heading}
              </Heading>
            </Stack>
          </Reveal>

          <div ref={listRef} className={styles.list}>
            <div className={styles.art} aria-hidden="true">
              <span className={styles.artGrid} />
              <svg
                className={cx(styles.waves, styles.wavesDim)}
                viewBox="0 0 1000 2000"
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                focusable="false"
              >
                <WavePaths />
              </svg>
              <svg
                className={cx(styles.waves, styles.wavesLit)}
                viewBox="0 0 1000 2000"
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                focusable="false"
              >
                <WavePaths />
              </svg>
            </div>
            <span className={styles.progress} aria-hidden="true" />
            <ol className={styles.items}>
              {aboutTimeline.nodes.map((node, index) => (
                <li
                  key={index}
                  className={cx(
                    styles.item,
                    index <= active && styles.isActive,
                    index === active && styles.isCurrent,
                  )}
                >
                  <span className={styles.motif} aria-hidden="true">
                    <MotifSvg name={motifFor(index)} className={styles.motifBase} />
                    <MotifSvg name={motifFor(index)} className={styles.motifDraw} />
                  </span>
                  <span className={styles.year} aria-hidden="true">
                    {node.year}
                  </span>
                  <span className={styles.node} data-node aria-hidden="true" />
                  <div className={styles.entry}>
                    <span className={styles.srYear}>{node.year}: </span>
                    <h3 className={styles.title}>{node.title}</h3>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
