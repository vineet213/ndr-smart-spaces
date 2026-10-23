import { Container } from "@/components/layout";
import { whyFirsts } from "@/lib/data/whyNdrPage";
import { Reveal, type RevealDelay } from "./Reveal";
import { SheetHeader } from "./SheetHeader";
import styles from "./WhyFirsts.module.css";

/**
 * "A record of firsts", set as a dimension line: the rule wipes in like a
 * drawn dimension, with a tick and a year at each milestone.
 */
export function WhyFirsts() {
  const { firsts } = whyFirsts;

  return (
    <section className={styles.section} aria-labelledby="firsts-title">
      <Container>
        <SheetHeader
          sheet="03"
          of="06"
          eyebrow={whyFirsts.eyebrow}
          heading={whyFirsts.heading}
          headingId="firsts-title"
          lede={whyFirsts.lede}
          tone="dark"
        />

        <div className={styles.drawing}>
          <Reveal variant="wipe" className={styles.dimension}>
            <span className={styles.arrowStart} aria-hidden="true" />
            <span className={styles.line} aria-hidden="true" />
            <span className={styles.arrowEnd} aria-hidden="true" />
          </Reveal>

          <ol className={styles.firsts}>
            {firsts.map((first, index) => (
              <li key={first.year} className={styles.first}>
                <Reveal delay={Math.min(index + 1, 5) as RevealDelay}>
                  <span className={styles.tick} aria-hidden="true" />
                  <span className={styles.year}>{first.year}</span>
                  <p className={styles.title}>{first.title}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
