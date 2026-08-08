import { Container } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { editorialStatement } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./EditorialStatement.module.css";

export function EditorialStatement() {
  return (
    <section className={styles.section} id="statement" aria-labelledby="editorial-statement-title">
      <Container>
        <Reveal>
          <span className={styles.numeral} aria-hidden="true">
            01
          </span>
          <Eyebrow className={styles.eyebrow}>{editorialStatement.eyebrow}</Eyebrow>
          <Heading variant="section" id="editorial-statement-title" className={styles.heading}>
            {editorialStatement.heading}
          </Heading>
          <p className={styles.statement}>{editorialStatement.statement}</p>
        </Reveal>
      </Container>
    </section>
  );
}
