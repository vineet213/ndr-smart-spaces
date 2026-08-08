import { Container } from "@/components/layout";
import { Body, Button, Eyebrow, Heading, TextLink } from "@/components/ui";
import { portfolioClosing } from "@/lib/data/portfolio";
import { Reveal } from "./Reveal";
import styles from "./PortfolioClosing.module.css";

function RegisterMark({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M5 5h6M5 5v6" stroke="currentColor" strokeWidth="1" />
      <path d="M21 5h-6M21 5v6" stroke="currentColor" strokeWidth="1" />
      <path d="M5 21h6M5 21v-6" stroke="currentColor" strokeWidth="1" />
      <path d="M21 21h-6M21 21v-6" stroke="currentColor" strokeWidth="1" />
      <rect x="10.5" y="10.5" width="5" height="5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function PortfolioClosing() {
  return (
    <section className={styles.section} aria-labelledby="portfolio-closing-title">
      <Container>
        <Reveal>
          <RegisterMark className={styles.mark} />
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {portfolioClosing.eyebrow}
          </Eyebrow>
          <Heading
            variant="section"
            tone="dark"
            id="portfolio-closing-title"
            className={styles.title}
          >
            {portfolioClosing.line}
          </Heading>
          <Body tone="dark" className={styles.body}>
            {portfolioClosing.body}
          </Body>
          <div className={styles.ctas}>
            <Button href={portfolioClosing.primaryCta.href} tone="dark">
              {portfolioClosing.primaryCta.label}
            </Button>
            <Button
              variant="secondary"
              tone="dark"
              href={portfolioClosing.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {portfolioClosing.secondaryCta.label}
            </Button>
            <TextLink
              tone="dark"
              href={portfolioClosing.tertiaryLink.href}
              className={styles.tertiary}
            >
              {portfolioClosing.tertiaryLink.label}
            </TextLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
