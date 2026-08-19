import { Container } from "@/components/layout";
import { Body, Button, Eyebrow, Heading, TextLink } from "@/components/ui";
import { esgClosing } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal } from "./Reveal";
import styles from "./EsgClosing.module.css";

export function EsgClosing() {
  return (
    <section className={styles.section} aria-labelledby="esg-closing-title">
      <Container>
        <Reveal>
          <EsgDocHeader numeral="05" code="REF 05 · CLOSING" tone="dark" />
          <span className={styles.goldRule} aria-hidden="true" />
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {esgClosing.eyebrow}
          </Eyebrow>
          <Heading variant="section" tone="dark" id="esg-closing-title" className={styles.title}>
            {esgClosing.line}
          </Heading>
          <Body tone="dark" className={styles.body}>
            {esgClosing.body}
          </Body>
          <div className={styles.ctas}>
            <Button href={esgClosing.primaryCta.href} tone="dark">
              {esgClosing.primaryCta.label}
            </Button>
            <Button variant="secondary" tone="dark" href={esgClosing.secondaryCta.href}>
              {esgClosing.secondaryCta.label}
            </Button>
            <TextLink
              tone="dark"
              href={esgClosing.tertiaryLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tertiary}
            >
              {esgClosing.tertiaryLink.label}
            </TextLink>
          </div>
          <div className={styles.meta}>
            <TextLink tone="dark" href={esgClosing.enquiry.href} className={styles.metaLink}>
              {esgClosing.enquiry.label}
            </TextLink>
            <span className={styles.disclaimer}>{esgClosing.provenanceNote}</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
