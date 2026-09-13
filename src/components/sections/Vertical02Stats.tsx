import { vertical02Metrics } from "@/lib/data/business";
import { Counter } from "./Counter";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./Vertical02Stats.module.css";

/**
 * Vertical 02 — key figures, rendered as a premium institutional band: three
 * equal blocks with the figure dominant and centred, the label beneath, and
 * a count-up reveal.
 */
export function Vertical02Stats() {
  return (
    <div className={styles.band}>
      <ol className={styles.grid} aria-label="Vertical 02 key figures">
        {vertical02Metrics.map((metric, index) => (
          <li key={metric.label} className={styles.block}>
            <Reveal delay={(index + 1) as RevealDelay} className={styles.cell}>
              <Counter
                className={styles.value}
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                format={metric.format}
              />
              <span className={styles.label}>{metric.context}</span>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
