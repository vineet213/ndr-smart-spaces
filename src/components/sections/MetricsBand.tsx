import { Container } from "@/components/layout";
import { Eyebrow } from "@/components/ui";
import { leadMetrics, type EntityRef } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./MetricsBand.module.css";

const entityName: Record<EntityRef, string> = {
  "ndr-smart-spaces": "NDR Smart Spaces",
  "ndr-invit": "NDR InvIT Trust",
  "ndr-group": "NDR Group",
};

export function MetricsBand() {
  return (
    <section className={styles.section} id="capital-strength" aria-labelledby="metrics-band-title">
      <Container>
        <Reveal>
          <div className={styles.docHeader}>
            <span className={styles.numeral} aria-hidden="true">
              02
            </span>
            <span className={styles.ref}>REF 02 · FINANCIAL SUMMARY</span>
          </div>
          <Eyebrow className={styles.eyebrow}>Capital strength</Eyebrow>
          <h2 id="metrics-band-title" className={styles.heading}>
            What the platform holds.
          </h2>
        </Reveal>

        <div className={styles.grid}>
          {leadMetrics.map((metric, index) => (
            <Reveal key={metric.id} delay={(index % 2) as 0 | 1}>
              <article className={styles.entry}>
                <p className={styles.value}>{metric.value}</p>
                <h3 className={styles.label}>{metric.stat}</h3>
                <div className={styles.report}>
                  <span className={styles.period}>{metric.period}</span>
                  <span className={styles.origin}>
                    {metric.source} · {entityName[metric.entity]}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
