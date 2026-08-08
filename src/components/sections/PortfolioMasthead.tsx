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
          <div className={styles.cover}>
            <span className={styles.reference} aria-hidden="true">
              PL.001
            </span>
            <Eyebrow className={styles.eyebrow}>{portfolioMasthead.eyebrow}</Eyebrow>
            <span className={styles.ruleTop} aria-hidden="true" />
            <Heading variant="hero" id="portfolio-masthead-title" className={styles.title}>
              {portfolioMasthead.title}
            </Heading>
            <span className={styles.ruleBottom} aria-hidden="true" />
            <Lede className={styles.lede}>{portfolioMasthead.lede}</Lede>
            <p className={styles.edition}>{edition}</p>
            <span className={styles.watermark} aria-hidden="true">
              PLATE
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
