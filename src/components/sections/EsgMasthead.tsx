import { Container, Section } from "@/components/layout";
import { esgMasthead } from "@/lib/data/esg";
import styles from "./EsgMasthead.module.css";

export function EsgMasthead() {
  return (
    <Section tone="charcoal" ariaLabelledby="esg-masthead-title" className={styles.section}>
      <Container className={styles.folio}>
        <span>{esgMasthead.registry}</span>
        <span>{esgMasthead.section}</span>
        <span>{esgMasthead.controlCaption}</span>
      </Container>

      <Container className={styles.content}>
        <div className={styles.hero} id="esg-hero">
          <span className={styles.watermark} aria-hidden="true">
            {esgMasthead.watermark}
          </span>

          <h1 id="esg-masthead-title" className={styles.title}>
            {esgMasthead.title.before}
            <span className={styles.titleAccent}>{esgMasthead.title.accent}</span>
            {esgMasthead.title.after}
          </h1>
          <p className={styles.statement}>{esgMasthead.statement}</p>
          <p className={styles.meta}>
            <span>{esgMasthead.asOn}</span>
            <span aria-hidden="true">·</span>
            <span>{esgMasthead.edition}</span>
          </p>
        </div>
      </Container>

      <span className={styles.rule} aria-hidden="true" />
    </Section>
  );
}
