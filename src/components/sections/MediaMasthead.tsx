import { Container, Section } from "@/components/layout";
import { mediaMasthead, MEDIA_PUBLICATION } from "@/lib/data/media";
import styles from "./MediaMasthead.module.css";

export function MediaMasthead() {
  return (
    <Section tone="charcoal" ariaLabelledby="media-masthead-title" className={styles.section}>
      <span className={styles.ruleTop} aria-hidden="true" />

      <Container className={styles.folio} aria-label="Publication folio">
        <span className={styles.folioRegistry}>{mediaMasthead.registry}</span>
        <span className={styles.folioRun}>
          {mediaMasthead.publication} · {MEDIA_PUBLICATION.ref}
        </span>
        <span className={styles.folioEdition}>{mediaMasthead.controlCaption}</span>
      </Container>

      <Container className={styles.content}>
        <div className={styles.hero} id="media-hero">
          <span className={styles.watermark} aria-hidden="true">
            {mediaMasthead.watermark}
          </span>

          <p className={styles.publication}>
            <span className={styles.publicationName}>{mediaMasthead.publication}</span>
            <span className={styles.publicationRef}>{MEDIA_PUBLICATION.ref}</span>
          </p>

          <h1 id="media-masthead-title" className={styles.title}>
            {mediaMasthead.title.before}
            <span className={styles.titleAccent}>{mediaMasthead.title.accent}</span>
            {mediaMasthead.title.after}
          </h1>
          <p className={styles.statement}>{mediaMasthead.statement}</p>
          <p className={styles.meta}>
            <span>{mediaMasthead.asOn}</span>
            <span aria-hidden="true">·</span>
            <span className={styles.metaEdition}>{mediaMasthead.edition}</span>
          </p>
        </div>
      </Container>

      <span className={styles.rule} aria-hidden="true" />
    </Section>
  );
}
