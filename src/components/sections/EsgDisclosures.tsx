import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { esgDisclosures, ESG_STATUS_LABELS, ESG_STATUS_TONES } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal, type RevealDelay } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./EsgDisclosures.module.css";

export function EsgDisclosures() {
  return (
    <section className={styles.section} id="disclosures" aria-labelledby="esg-disclosures-title">
      <Container>
        <Reveal>
          <EsgDocHeader numeral="09" code="REF 09 · DISCLOSURES" />
          <Eyebrow className={styles.eyebrow}>{esgDisclosures.eyebrow}</Eyebrow>
          <Heading variant="section" id="esg-disclosures-title" className={styles.heading}>
            {esgDisclosures.heading}
          </Heading>
          <Lede className={styles.lede}>{esgDisclosures.lede}</Lede>
        </Reveal>

        <div className={styles.groups}>
          {esgDisclosures.groups.map((group, groupIndex) => (
            <Reveal
              key={group.category}
              delay={(groupIndex % 3) as RevealDelay}
              className={styles.group}
            >
              <p className={styles.category}>{group.category}</p>
              <div className={styles.head} aria-hidden="true">
                <span>Ref</span>
                <span>Document</span>
                <span>As on</span>
                <span>Status</span>
              </div>
              <ol className={styles.documents}>
                {group.documents.map((document) => (
                  <li key={document.ref} className={styles.document}>
                    <span className={styles.docRef}>{document.ref}</span>
                    <div className={styles.docBody}>
                      <span className={styles.docTitle}>{document.title}</span>
                      {document.edition ? (
                        <span className={styles.docEdition}>{document.edition}</span>
                      ) : null}
                      {document.note ? (
                        <span className={styles.docNote}>{document.note}</span>
                      ) : null}
                    </div>
                    <span className={styles.docAsOn}>{document.asOn}</span>
                    <span
                      className={cx(
                        styles.status,
                        ESG_STATUS_TONES[document.status] === "active"
                          ? styles.statusActive
                          : styles.statusPending,
                      )}
                    >
                      <span className={styles.statusGlyph} aria-hidden="true">
                        {ESG_STATUS_TONES[document.status] === "active" ? "●" : "—"}
                      </span>
                      {ESG_STATUS_LABELS[document.status]}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>

        <SourceFootnote className={styles.note}>{esgDisclosures.note}</SourceFootnote>
      </Container>
    </section>
  );
}
