import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede } from "@/components/ui";
import { formatPlateRange, portfolioAssets, portfolioMasthead } from "@/lib/data/portfolio";
import { Reveal } from "./Reveal";
import styles from "./PortfolioMasthead.module.css";

export function PortfolioMasthead() {
  const plateRange = formatPlateRange(portfolioAssets.map((asset) => asset.plate));
  const edition = [plateRange, "Catalogue", portfolioMasthead.editionPeriod]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className={styles.section} aria-labelledby="portfolio-masthead-title">
      <Container className={styles.container}>
        <Reveal>
          <Eyebrow className={styles.eyebrow}>{portfolioMasthead.eyebrow}</Eyebrow>
          <span className={styles.ruleTop} aria-hidden="true" />
          <Heading variant="hero" id="portfolio-masthead-title" className={styles.title}>
            {portfolioMasthead.title}
          </Heading>
          <span className={styles.ruleBottom} aria-hidden="true" />
          <Lede className={styles.lede}>{portfolioMasthead.lede}</Lede>
          <p className={styles.edition}>{edition}</p>
        </Reveal>
      </Container>
    </section>
  );
}
