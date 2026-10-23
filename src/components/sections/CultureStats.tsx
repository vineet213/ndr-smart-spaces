import { Container } from "@/components/layout";
import { hrStats } from "@/lib/data/careers";
import { Counter } from "./Counter";
import { Reveal, type RevealDelay } from "./Reveal";
import { SheetHeader } from "./SheetHeader";
import styles from "./CultureStats.module.css";

/**
 * HR at a glance: strength, growth and average years of working, on the dark
 * metrics band. A figure the client has not yet confirmed shows a dash.
 */
export function CultureStats() {
  return (
    <section className={styles.band} id="hr-stats" aria-labelledby="hr-stats-title">
      <Container className={styles.inner}>
        <SheetHeader
          sheet="01"
          of="03"
          eyebrow={hrStats.eyebrow}
          heading={hrStats.heading}
          headingId="hr-stats-title"
          tone="dark"
        />

        <dl className={styles.grid}>
          {hrStats.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={(index + 1) as RevealDelay} className={styles.block}>
              <dt className={styles.label}>{stat.label}</dt>
              <dd className={styles.figure}>
                {stat.value === null ? (
                  <span className={styles.pending} aria-label="To be announced">
                    —
                  </span>
                ) : (
                  <Counter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className={styles.value}
                  />
                )}
              </dd>
              <dd className={styles.note}>{stat.note}</dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
