import { Container, Section } from "@/components/layout";
import { Eyebrow, Heading, Lede } from "@/components/ui";
import { businessMasthead, verticalsChapter } from "@/lib/data/business";
import { Reveal } from "./Reveal";
import styles from "./SummaryOfBusiness.module.css";

export function SummaryOfBusiness() {
  return (
    <Section tone="light" ariaLabelledby="summary-of-business-overview-title">
      <Container>
        <Reveal>
          <header className={styles.overview}>
            <span className={styles.goldRule} aria-hidden="true" />
            <Eyebrow>Investor summary</Eyebrow>
            <Heading variant="section" id="summary-of-business-overview-title">
              {verticalsChapter.title}
            </Heading>
            <Lede className={styles.lede}>{businessMasthead.statement}</Lede>
          </header>
        </Reveal>
      </Container>

      <Section as="div" tone="charcoal" className={styles.pending}>
        <Container>
          <p className={styles.pendingLabel}>CONTENT TO BE UPLOADED</p>
        </Container>
      </Section>
    </Section>
  );
}