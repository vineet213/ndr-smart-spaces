import { Container } from "@/components/layout";
import { Eyebrow } from "@/components/ui";
import { editorialStatement } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./EditorialStatement.module.css";

export function EditorialStatement() {
  return (
    <section className={styles.section} id="statement" aria-labelledby="editorial-statement-title">
      <Container>
        <Reveal>
          <div className={styles.docHeader}>
            <span className={styles.numeral} aria-hidden="true">
              01
            </span>
            <span className={styles.ref}>REF 01 · EDITORIAL</span>
          </div>
          <div className={styles.body}>
            <Eyebrow className={styles.eyebrow}>{editorialStatement.eyebrow}</Eyebrow>
            <h2 id="editorial-statement-title" className={styles.heading}>
              {editorialStatement.heading}
            </h2>
            <p className={styles.statement}>{editorialStatement.statement}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
