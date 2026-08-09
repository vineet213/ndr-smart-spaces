import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { esgSocial, ESG_STATUS_LABELS, ESG_STATUS_TONES } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal, type RevealDelay } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./EsgSocial.module.css";

export function EsgSocial() {
  return (
    <section className={styles.section} id="social" aria-labelledby="esg-social-title">
      <Container>
        <Reveal>
          <EsgDocHeader numeral="04" code="REF 04 · SOCIAL" />
          <Eyebrow className={styles.eyebrow}>{esgSocial.eyebrow}</Eyebrow>
          <Heading variant="section" id="esg-social-title" className={styles.heading}>
            {esgSocial.heading}
          </Heading>
          <Lede className={styles.lede}>{esgSocial.lede}</Lede>
        </Reveal>

        <ol className={styles.rows}>
          {esgSocial.rows.map((row, index) => (
            <Reveal key={row.ref} as="li" delay={(index % 3) as RevealDelay} className={styles.row}>
              <span className={styles.rowRef}>{row.ref}</span>
              <div className={styles.rowBody}>
                <h3 className={styles.rowLabel}>{row.label}</h3>
                <p className={styles.rowNote}>{row.note}</p>
                <SourceFootnote className={styles.rowSource}>{row.source}</SourceFootnote>
              </div>
              <span
                className={cx(
                  styles.status,
                  ESG_STATUS_TONES[row.status] === "active"
                    ? styles.statusActive
                    : styles.statusPending,
                )}
              >
                <span className={styles.statusGlyph} aria-hidden="true">
                  {ESG_STATUS_TONES[row.status] === "active" ? "●" : "—"}
                </span>
                {ESG_STATUS_LABELS[row.status]}
              </span>
            </Reveal>
          ))}
        </ol>

        <p className={styles.note}>{esgSocial.note}</p>
      </Container>
    </section>
  );
}
