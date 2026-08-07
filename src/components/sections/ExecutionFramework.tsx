import { Container, Section } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import { execution } from "@/lib/data/business";
import { ChapterHeader } from "./ChapterHeader";
import { DrawnGrid } from "./DrawnGrid";
import { LinearChain } from "./LinearChain";
import { Reveal } from "./Reveal";
import styles from "./ExecutionFramework.module.css";

export function ExecutionFramework() {
  return (
    <Section id="execution" ariaLabelledby="execution-title" className={styles.section}>
      <DrawnGrid />
      <Container className={styles.content}>
        <Reveal>
          <ChapterHeader
            numeral="05"
            eyebrow="Execution"
            heading="How projects are delivered."
            headingId="execution-title"
            lede="The delivery method, in six stages — process, not history."
          />

          <LinearChain nodes={execution.chain} tone="light" className={styles.chain} />

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
        </Reveal>
      </Container>
    </Section>
  );
}
