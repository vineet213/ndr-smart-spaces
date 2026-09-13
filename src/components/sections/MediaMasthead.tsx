import { Container, Section } from "@/components/layout";
import { mediaMasthead } from "@/lib/data/media";
import styles from "./MediaMasthead.module.css";

export function MediaMasthead() {
  return (
    <Section tone="charcoal" ariaLabelledby="media-masthead-title" className={styles.section}>
      <span className={styles.ruleTop} aria-hidden="true" />

      <Container className={styles.content}>
        <div className={styles.hero} id="media-hero">
          <h1 id="media-masthead-title" className={styles.title}>
            {mediaMasthead.title.before}
            <span className={styles.titleAccent}>{mediaMasthead.title.accent}</span>
            {mediaMasthead.title.after}
          </h1>
          <p className={styles.statement}>{mediaMasthead.statement}</p>
        </div>
      </Container>

      <span className={styles.rule} aria-hidden="true" />
    </Section>
  );
}
