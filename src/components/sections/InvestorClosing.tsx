import { Container } from "@/components/layout";
import { Body, Button, Eyebrow, Heading, TextLink } from "@/components/ui";
import { investorClosing, safeHarbourDisclaimer } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./InvestorClosing.module.css";

export function InvestorClosing() {
  return (
    <section className={styles.section} aria-labelledby="investor-closing-title">
      <Container>
        <Reveal>
          <div className={styles.docHeader}>
            <span className={styles.numeral} aria-hidden="true">
              07
            </span>
            <span className={styles.ref}>REF 07 · CLOSING</span>
          </div>
          <span className={styles.goldRule} aria-hidden="true" />
          <Eyebrow tone="dark" className={styles.eyebrow}>
            Investor Centre · Financial Statement
          </Eyebrow>
          <Heading
            variant="section"
            tone="dark"
            id="investor-closing-title"
            className={styles.title}
          >
            {investorClosing.line}
          </Heading>
          <Body tone="dark" className={styles.body}>
            {investorClosing.body}
          </Body>
          <div className={styles.ctas}>
            <Button href={investorClosing.primaryCta.href} tone="dark">
              {investorClosing.primaryCta.label}
            </Button>
            <Button variant="secondary" tone="dark" href={investorClosing.secondaryCta.href}>
              {investorClosing.secondaryCta.label}
            </Button>
            <TextLink
              tone="dark"
              href={investorClosing.tertiaryLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tertiary}
            >
              {investorClosing.tertiaryLink.label}
            </TextLink>
          </div>
          <div className={styles.meta}>
            <TextLink tone="dark" href={investorClosing.enquiry.href} className={styles.metaLink}>
              {investorClosing.enquiry.label}
            </TextLink>
            <span className={styles.disclaimer}>
              <TextLink tone="dark" href="#safe-harbour" className={styles.metaLink}>
                {safeHarbourDisclaimer}
              </TextLink>
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
