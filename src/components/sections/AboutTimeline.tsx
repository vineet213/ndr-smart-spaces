"use client";

import { useEffect, useRef, useState } from "react";
import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { aboutTimeline } from "@/lib/data/about";
import { Reveal } from "./Reveal";
import { MotifSvg, motifFor } from "./TimelineArt";
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
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const headRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const nodes = Array.from(list.querySelectorAll<HTMLElement>("[data-node]"));
    if (nodes.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let current = -2;
    let centres: number[] = [];
    let listHeight = 1;

    /* Layout reads happen only here, on mount and when the list resizes. */
    const measure = () => {
      const listTop = list.getBoundingClientRect().top;
      centres = nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return box.top + box.height / 2 - listTop;
      });
      listHeight = Math.max(list.offsetHeight, 1);
    };

    /* Per frame: one read, then a transform on each of the two moving parts.  */
    /* Nothing is written on the list itself, so the milestones are never     */
    /* re-styled while scrolling.                                             */
    const update = () => {
      frame = 0;
      const listTop = list.getBoundingClientRect().top;
      const end = centres[centres.length - 1] ?? 0;
      const focus = reduceMotion ? end : window.innerHeight * FOCUS - listTop;
      const tip = Math.min(Math.max(focus, 0), end);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${(tip / listHeight).toFixed(4)})`;
      }
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(0, ${tip.toFixed(1)}px, 0)`;
      }

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

    // Listen to scroll only while the timeline is on or near the screen.
    let listening = false;
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", schedule, { passive: true });
        schedule();
      } else {
        window.removeEventListener("scroll", schedule);
      }
    };

    measure();
    update();
    const resizeObserver = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resizeObserver.observe(list);
    const intersection = new IntersectionObserver(([entry]) => listen(entry.isIntersecting), {
      rootMargin: "200px 0px",
    });
    intersection.observe(list);
    return () => {
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("scroll", schedule);
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
            </div>
            <span ref={progressRef} className={styles.progress} aria-hidden="true" />
            <span ref={headRef} className={styles.progressHead} aria-hidden="true" />
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
