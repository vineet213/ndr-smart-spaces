import { Container, Section } from "@/components/layout";
import { Eyebrow } from "@/components/ui";
import { whyOverview } from "@/lib/data/whyNdrPage";
import { DrawnGrid } from "./DrawnGrid";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./WhyNdrOverview.module.css";

/* Why NDR overview: the same heading-left, copy-right overview as the       */
/* vertical pages, then the five reasons as a ruled list that rises in one   */
/* row after another as it scrolls into view.                                */
export function WhyNdrOverview() {
  const { heading, lead, rest, reasons } = whyOverview;

  return (
    <Section tone="dim" className={styles.section}>
      <div className={styles.wrap}>
        <DrawnGrid />
        <Container className={styles.content}>
          <Reveal>
            <div className={styles.grid}>
              <div className={styles.head}>
                <Eyebrow>Overview</Eyebrow>
                <h2 id="why-overview-title" className={styles.heading}>
                  {heading}
                </h2>
              </div>
              <div className={styles.body}>
                <p className={styles.lead}>{lead}</p>
                <p className={styles.rest}>{rest}</p>
              </div>
            </div>
          </Reveal>

          <ol className={styles.reasons} aria-labelledby="why-overview-title">
            {reasons.map((reason, i) => (
              <Reveal as="li" key={reason.index} delay={Math.min(i, 5) as RevealDelay}>
                <div className={styles.reason}>
                  <span className={styles.index} aria-hidden="true">
                    {reason.index}
                  </span>
                  <div>
                    <h3 className={styles.title}>{reason.title}</h3>
                    <p className={styles.line}>{reason.line}</p>
                  </div>
                  <div>
                    <p className={styles.text}>{reason.body}</p>
                    <p className={styles.proof}>{reason.proof}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </div>
    </Section>
  );
}
