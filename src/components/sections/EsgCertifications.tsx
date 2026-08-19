import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { esgCertifications, ESG_STATUS_LABELS, ESG_STATUS_TONES } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./EsgCertifications.module.css";

export function EsgCertifications() {
  return (
    <section
      className={styles.section}
      id="certifications"
      aria-labelledby="esg-certifications-title"
    >
      <Container>
        <Reveal>
          <EsgDocHeader numeral="04" code="REF 04 · CERTIFICATIONS" />
          <Eyebrow className={styles.eyebrow}>{esgCertifications.eyebrow}</Eyebrow>
          <Heading variant="section" id="esg-certifications-title" className={styles.heading}>
            {esgCertifications.heading}
          </Heading>
          <Lede className={styles.lede}>{esgCertifications.lede}</Lede>
        </Reveal>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Ref</th>
                <th scope="col">Standard</th>
                <th scope="col">Scope</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {esgCertifications.certifications.map((certification) => (
                <tr key={certification.ref}>
                  <td className={styles.refCell}>{certification.ref}</td>
                  <td className={styles.standardCell}>
                    <span className={styles.standard}>{certification.standard}</span>
                    {certification.validFrom ? (
                      <span className={styles.validFrom}>{certification.validFrom}</span>
                    ) : null}
                  </td>
                  <td className={styles.scopeCell}>
                    <span className={styles.scope}>{certification.scope}</span>
                    {certification.note ? (
                      <span className={styles.scopeNote}>{certification.note}</span>
                    ) : null}
                  </td>
                  <td className={styles.statusCell}>
                    <span
                      className={cx(
                        styles.status,
                        ESG_STATUS_TONES[certification.status] === "active"
                          ? styles.statusActive
                          : styles.statusPending,
                      )}
                    >
                      <span className={styles.statusGlyph} aria-hidden="true">
                        {ESG_STATUS_TONES[certification.status] === "active" ? "●" : "—"}
                      </span>
                      {ESG_STATUS_LABELS[certification.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SourceFootnote className={styles.note}>{esgCertifications.note}</SourceFootnote>
      </Container>
    </section>
  );
}
