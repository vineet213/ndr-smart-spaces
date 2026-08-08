"use client";

import { Container, Section } from "@/components/layout";
import { Button, Icon, SourceFootnote } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { businessChapters, capitalDeployment } from "@/lib/data/business";
import { ChapterOpener } from "./ChapterOpener";
import { LinearChain } from "./LinearChain";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./CapitalDeployment.module.css";

export function CapitalDeployment() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Section tone="dark" id="capital" ariaLabelledby="capital-title" className={styles.section}>
      <Container className={styles.content}>
        <Reveal>
          <ChapterOpener chapter={businessChapters[3]} headingId="capital-title" tone="dark" />

          <div ref={ref} className={cx(styles.stage, inView && styles.drawn)}>
            <p className={styles.rofo}>{capitalDeployment.rofo}</p>

            <LinearChain nodes={capitalDeployment.chain} tone="dark" className={styles.chain} />

            <div className={styles.evidence}>
              <span className={styles.evidenceText}>{capitalDeployment.evidence}</span>
              <SourceFootnote tone="dark">{capitalDeployment.evidenceSource}</SourceFootnote>
            </div>

            <div className={styles.cta}>
              <Button
                tone="dark"
                href={capitalDeployment.cta.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {capitalDeployment.cta.label}
                <Icon name="arrow-up-right" size="sm" />
              </Button>
            </div>

            <SourceFootnote tone="dark" className={styles.source}>
              {capitalDeployment.source}
            </SourceFootnote>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
