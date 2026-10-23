import { Container } from "@/components/layout";
import { hrStats, type HrStat } from "@/lib/data/careers";
import { Counter } from "./Counter";
import styles from "./CultureStatsLine.module.css";

/* A confirmed figure counts up; an unconfirmed one is an open blank. */
function Figure({ stat }: { stat: HrStat }) {
  if (stat.value === null) {
    return (
      <span className={styles.blank} role="img" aria-label={`${stat.label}: to be confirmed`} />
    );
  }
  return <Counter value={stat.value} suffix={stat.suffix} className={styles.figure} />;
}

/**
 * HR at a glance, written as one sentence: strength, growth and average
 * years of working set large inside it.
 */
export function CultureStatsLine() {
  const { strength, growth, tenure } = hrStats;

  return (
    <section className={styles.section} id="hr-stats" aria-label="HR at a glance">
      <Container>
        <p className={styles.sentence}>
          We are <Figure stat={strength} /> people. Last year the team grew by{" "}
          <Figure stat={growth} />
          {growth.value === null ? "%" : null}, and on average our people have worked with NDR for{" "}
          <Figure stat={tenure} /> years.
        </p>
      </Container>
    </section>
  );
}
