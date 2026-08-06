"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading, Lede } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { aboutTimeline } from "@/lib/data/about";
import type { TimelineNode } from "@/lib/data/about";
import { Reveal } from "./Reveal";
import styles from "./AboutTimeline.module.css";
import { cx } from "../ui/cx";

const TOTAL = aboutTimeline.nodes.length;

type TimelineItemProps = {
  node: TimelineNode;
  index: number;
  onActivate: (index: number) => void;
};

function TimelineItem({ node, index, onActivate }: TimelineItemProps) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.2 });

  useEffect(() => {
    if (inView) onActivate(index);
  }, [inView, index, onActivate]);

  return (
    <li ref={ref} className={cx(styles.item, inView && styles.isActive)}>
      <span className={styles.year} aria-hidden="true">
        {node.year}
      </span>
      <span className={styles.node} aria-hidden="true" />
      <div className={styles.entry}>
        <h3 className={styles.title}>{node.title}</h3>
        <p className={styles.caption}>{node.caption}</p>
        <p className={styles.detail}>{node.detail}</p>
      </div>
    </li>
  );
}

export function AboutTimeline() {
  const [activeCount, setActiveCount] = useState(0);
  const activated = useRef<Set<number>>(new Set());

  const handleActivate = useCallback((index: number) => {
    if (activated.current.has(index)) return;
    activated.current.add(index);
    setActiveCount((count) => count + 1);
  }, []);

  return (
    <section className={styles.section} aria-labelledby="timeline-title">
      <Container>
        <Stack gap="6xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow>{aboutTimeline.eyebrow}</Eyebrow>
              <Heading variant="section" id="timeline-title">
                {aboutTimeline.heading}
              </Heading>
              <Lede className={styles.lede}>{aboutTimeline.lede}</Lede>
            </Stack>
          </Reveal>

          <ol
            className={styles.list}
            style={{ "--timeline-progress": activeCount / TOTAL } as CSSProperties}
          >
            {aboutTimeline.nodes.map((node, index) => (
              <TimelineItem key={node.year} node={node} index={index} onActivate={handleActivate} />
            ))}
          </ol>
        </Stack>
      </Container>
    </section>
  );
}
