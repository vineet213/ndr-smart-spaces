import { Container } from "@/components/layout";
import { Eyebrow } from "@/components/ui";
import { mediaStatement } from "@/lib/data/media";
import { MediaDocHeader } from "./MediaDocHeader";
import { Reveal } from "./Reveal";
import styles from "./MediaStatement.module.css";

export function MediaStatement() {
  return (
    <section className={styles.section} id="statement" aria-labelledby="media-statement-title">
      <Container>
        <Reveal>
          <MediaDocHeader numeral="01" code="REF 01 · STATEMENT" />
          <div className={styles.body}>
            <Eyebrow className={styles.eyebrow}>{mediaStatement.eyebrow}</Eyebrow>
            <h2 id="media-statement-title" className={styles.heading}>
              {mediaStatement.heading}
            </h2>
            <p className={styles.statement}>{mediaStatement.statement}</p>
            <p className={styles.signatory}>{mediaStatement.signatory}</p>
          </div>
          <div className={styles.reference}>
            <span className={styles.referenceRef}>{mediaStatement.reference}</span>
            <span className={styles.referenceRecorded}>{mediaStatement.recorded}</span>
          </div>
          <p className={styles.provenance}>{mediaStatement.provenance}</p>
        </Reveal>
      </Container>
    </section>
  );
}
