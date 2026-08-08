import { Container } from "@/components/layout";
import { Eyebrow, SourceFootnote } from "@/components/ui";
import { leadMetrics } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./MetricsBand.module.css";

export function MetricsBand() {
  return (
    <section className={styles.section} id="capital-strength" aria-labelledby="metrics-band-title">
      <Container>
        <Reveal>
          <span className={styles.numeral} aria-hidden="true">
            02
          </span>
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
                <SourceFootnote className={styles.footnote}>
                  {metric.period} · {metric.source} · {metric.entity === "ndr-invit" ? "NDR InvIT Trust" : metric.entity === "ndr-group" ? "NDR Group" : "NDR Smart Spaces"}
                </SourceFootnote>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
