"use client";

import { Container, Section } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { businessChapters, execution } from "@/lib/data/business";
import { ChapterOpener } from "./ChapterOpener";
import { DrawnGrid } from "./DrawnGrid";
import { LinearChain } from "./LinearChain";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./ExecutionFramework.module.css";

export function ExecutionFramework() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Section id="execution" ariaLabelledby="execution-title" className={styles.section}>
      <DrawnGrid />
      <Container className={styles.content}>
        <Reveal>
          <ChapterOpener chapter={businessChapters[4]} headingId="execution-title" />

          <LinearChain nodes={execution.chain} tone="light" className={styles.chain} />

          <div ref={ref} className={cx(styles.stage, inView && styles.drawn)}>
            <div className={styles.evidencePlate}>
              <p className={styles.evidenceLabel}>{execution.evidenceLabel}</p>
              <ul className={styles.evidenceList}>
                {execution.evidence.map((item) => (
                  <li key={item.claim} className={styles.evidenceRow}>
                    <span className={styles.evidenceClaim}>{item.claim}</span>
                    <SourceFootnote className={styles.evidenceSource}>{item.source}</SourceFootnote>
                  </li>
                ))}
              </ul>
            </div>

            <SourceFootnote className={styles.source}>{execution.source}</SourceFootnote>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
