import { Container, Section } from "@/components/layout";
import { portfolioMasthead } from "@/lib/data/portfolio";
import styles from "./PortfolioMasthead.module.css";

export function PortfolioMasthead() {
  return (
    <Section tone="charcoal" ariaLabelledby="portfolio-masthead-title" className={styles.section}>
      <span className={styles.ruleTop} aria-hidden="true" />

      <Container className={styles.content}>
        <div className={styles.hero} id="portfolio-hero">
          <p className={styles.eyebrow}>{portfolioMasthead.eyebrow}</p>

          <h1 id="portfolio-masthead-title" className={styles.title}>
            {portfolioMasthead.title}
          </h1>
        </div>
      </Container>

      <span className={styles.rule} aria-hidden="true" />
    </Section>
  );
}
