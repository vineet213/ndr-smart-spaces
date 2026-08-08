import { Container, Section } from "@/components/layout";
import { businessMasthead } from "@/lib/data/business";
import styles from "./BusinessMasthead.module.css";

export function BusinessMasthead() {
  return (
    <Section tone="charcoal" ariaLabelledby="business-masthead-title" className={styles.section}>
      <Container className={styles.folio}>
        <span>NDR Smart Spaces · Business</span>
        <span>{businessMasthead.folio}</span>
        <span>{businessMasthead.controlCaption}</span>
      </Container>

      <Container className={styles.content}>
        <div className={styles.hero} id="business-hero">
          <span className={styles.watermark} aria-hidden="true">
            OP
          </span>

          <h1 id="business-masthead-title" className={styles.title}>
            {businessMasthead.headline.before}
            <span className={styles.titleAccent}>{businessMasthead.headline.accent}</span>
            {businessMasthead.headline.after}
          </h1>
          <p className={styles.statement}>{businessMasthead.statement}</p>
        </div>
      </Container>

      <span className={styles.rule} aria-hidden="true" />
    </Section>
  );
}
