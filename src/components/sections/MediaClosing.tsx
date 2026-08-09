import { Container } from "@/components/layout";
import { Body, Button, Eyebrow, Heading, TextLink } from "@/components/ui";
import { mediaClosing } from "@/lib/data/media";
import { MediaDocHeader } from "./MediaDocHeader";
import { Reveal } from "./Reveal";
import styles from "./MediaClosing.module.css";

export function MediaClosing() {
  return (
    <section className={styles.section} aria-labelledby="media-closing-title">
      <Container>
        <Reveal>
          <MediaDocHeader numeral="06" code="REF 06 · CLOSING" tone="dark" />
          <span className={styles.goldRule} aria-hidden="true" />
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {mediaClosing.eyebrow}
          </Eyebrow>
          <Heading variant="section" tone="dark" id="media-closing-title" className={styles.title}>
            {mediaClosing.line}
          </Heading>
          <Body tone="dark" className={styles.body}>
            {mediaClosing.body}
          </Body>
          <div className={styles.ctas}>
            <Button href={mediaClosing.primaryCta.href} tone="dark">
              {mediaClosing.primaryCta.label}
            </Button>
            <Button variant="secondary" tone="dark" href={mediaClosing.secondaryCta.href}>
              {mediaClosing.secondaryCta.label}
            </Button>
            <TextLink
              tone="dark"
              href={mediaClosing.tertiaryLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tertiary}
            >
              {mediaClosing.tertiaryLink.label}
            </TextLink>
          </div>
          <div className={styles.colophon}>
            <span className={styles.colophonRef}>{mediaClosing.publicationRef}</span>
            <span className={styles.colophonEdition}>{mediaClosing.edition}</span>
          </div>
          <div className={styles.meta}>
            <TextLink tone="dark" href={mediaClosing.enquiry.href} className={styles.metaLink}>
              {mediaClosing.enquiry.label}
            </TextLink>
            <span className={styles.disclaimer}>{mediaClosing.provenanceNote}</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
