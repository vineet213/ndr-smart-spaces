import { Container, Section } from "@/components/layout";
import { contactMasthead } from "@/lib/data/contact";
import styles from "./ContactMasthead.module.css";

export function ContactMasthead() {
  return (
    <Section tone="charcoal" ariaLabelledby="contact-masthead-title" className={styles.section}>
      <span className={styles.ruleTop} aria-hidden="true" />

      <Container className={styles.folio} aria-label="Publication folio">
        <span className={styles.folioRegistry}>{contactMasthead.registry}</span>
        <span className={styles.folioRun}>{contactMasthead.publication}</span>
      </Container>

      <Container className={styles.content}>
        <div className={styles.hero} id="contact-hero">
          <span className={styles.watermark} aria-hidden="true">
            {contactMasthead.watermark}
          </span>

          <p className={styles.publication}>
            <span className={styles.publicationName}>{contactMasthead.publication}</span>
          </p>

          <h1 id="contact-masthead-title" className={styles.title}>
            {contactMasthead.title.before}
            <span className={styles.titleAccent}>{contactMasthead.title.accent}</span>
            {contactMasthead.title.after}
          </h1>
          <p className={styles.statement}>{contactMasthead.statement}</p>
        </div>
      </Container>

      <span className={styles.rule} aria-hidden="true" />
    </Section>
  );
}
