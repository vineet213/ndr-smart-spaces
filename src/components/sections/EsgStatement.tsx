import { Container } from "@/components/layout";
import { Eyebrow } from "@/components/ui";
import { esgStatement } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal } from "./Reveal";
import styles from "./EsgStatement.module.css";

export function EsgStatement() {
  return (
    <section className={styles.section} id="statement" aria-labelledby="esg-statement-title">
      <Container>
        <Reveal>
          <EsgDocHeader numeral="01" code="REF 01 · STATEMENT" />
          <div className={styles.body}>
            <Eyebrow className={styles.eyebrow}>{esgStatement.eyebrow}</Eyebrow>
            <h2 id="esg-statement-title" className={styles.heading}>
              {esgStatement.heading}
            </h2>
            <p className={styles.statement}>{esgStatement.statement}</p>
            <p className={styles.signatory}>{esgStatement.signatory}</p>
          </div>
          <p className={styles.provenance}>{esgStatement.provenance}</p>
        </Reveal>
      </Container>
    </section>
  );
}
