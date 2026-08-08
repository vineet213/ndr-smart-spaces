import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { resilience } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./ResilienceIndex.module.css";

export function ResilienceIndex() {
  return (
    <section className={styles.section} aria-labelledby="resilience-title">
      <Container>
        <Reveal>
          <Eyebrow>{resilience.eyebrow}</Eyebrow>
          <Heading variant="section" id="resilience-title" className={styles.heading}>
            {resilience.heading}
          </Heading>
          <Lede className={styles.lede}>{resilience.lede}</Lede>
        </Reveal>

        <ol className={styles.list}>
          {resilience.rows.map((row, index) => (
            <Reveal key={row.label} as="li" delay={(index % 3) as 0 | 1 | 2} className={styles.row}>
              <div className={styles.rowInner}>
                <h3 className={styles.label}>{row.label}</h3>
                <p className={styles.note}>{row.note}</p>
                <SourceFootnote className={styles.source}>{row.source}</SourceFootnote>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
