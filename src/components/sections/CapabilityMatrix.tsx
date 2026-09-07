"use client";

import { Container, Section } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { capabilityMatrix, type Chapter } from "@/lib/data/business";
import { ChapterOpener } from "./ChapterOpener";
import { DrawnGrid } from "./DrawnGrid";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./CapabilityMatrix.module.css";

/**
 * Unrendered Business V1 chapter. Not part of the shipped manual's chapter of
 * record (see `businessChapters`) and must not be revived on the page. Retains
 * its own frozen chapter marker so the frozen capability matrix stays coherent
 * in isolation.
 */
const CAPABILITIES_CHAPTER = {
  index: "02",
  label: "Capabilities & Services",
  id: "capabilities",
  title: "What NDR can deliver.",
  plate: "PL. 201",
  code: "OP.02",
} as const satisfies Chapter;

export function CapabilityMatrix() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Section id="capabilities" ariaLabelledby="capabilities-title" className={styles.section}>
      <DrawnGrid />
      <Container className={styles.content}>
        <Reveal>
          <ChapterOpener chapter={CAPABILITIES_CHAPTER} headingId="capabilities-title" />

          <div ref={ref} className={cx(styles.stage, inView && styles.drawn)}>
            <div className={styles.footprint}>
              <p className={styles.footprintLabel}>{capabilityMatrix.footprint.label}</p>
              <p className={styles.footprintLine}>
                {capabilityMatrix.footprint.line}
                <span className={styles.footprintNote}> — {capabilityMatrix.footprint.note}</span>
              </p>
              <SourceFootnote className={styles.footprintSource}>
                {capabilityMatrix.footprint.source}
              </SourceFootnote>
            </div>

            <table className={styles.matrix}>
              <thead>
                <tr>
                  {capabilityMatrix.headers.map((header) => (
                    <th key={header} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {capabilityMatrix.rows.map((row) => (
                  <tr key={row.capability}>
                    <td>
                      <span className={styles.phase}>{row.phase}</span>
                      <span className={styles.capability}>{row.capability}</span>
                    </td>
                    <td className={styles.scope}>{row.scope}</td>
                    <td className={styles.evidence}>{row.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <SourceFootnote className={styles.source}>{capabilityMatrix.source}</SourceFootnote>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
