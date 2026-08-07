import { Container, Section } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import { capabilityMatrix } from "@/lib/data/business";
import { ChapterHeader } from "./ChapterHeader";
import { DrawnGrid } from "./DrawnGrid";
import { Reveal } from "./Reveal";
import styles from "./CapabilityMatrix.module.css";

export function CapabilityMatrix() {
  return (
    <Section id="capabilities" ariaLabelledby="capabilities-title" className={styles.section}>
      <DrawnGrid />
      <Container className={styles.content}>
        <Reveal>
          <ChapterHeader
            numeral="02"
            eyebrow="Capabilities & Services"
            heading="What NDR can deliver."
            headingId="capabilities-title"
            lede="Standing capability across the divisions — each capability tied to a phase, with one sourced evidence figure."
          />

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
        </Reveal>
      </Container>
    </Section>
  );
}
