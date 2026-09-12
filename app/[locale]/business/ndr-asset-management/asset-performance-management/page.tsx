import type { Metadata } from "next";
import { Container, Grid, GridItem, Section, Stack } from "@/components/layout";
import { CompanyMetrics, EnquiryForm, Footer, MarqueeClients } from "@/components/sections";
import { Eyebrow, Heading, SourceFootnote } from "@/components/ui";
import { vertical02AssetManagement } from "@/lib/data/business";
import { Reveal } from "@/components/sections/Reveal";
import styles from "./asset-performance-management.module.css";

export const metadata: Metadata = {
  title: "Asset Performance Management",
  description: "NDR Asset Management — operating and maintaining assets for long-term performance.",
};

export default function AssetPerformanceManagementPage() {
  const { intro, functions, placeholderNote, metrics, cta } = vertical02AssetManagement;

  return (
    <>
      <Section tone="charcoal" ariaLabelledby="subpage-title" className={styles.masthead}>
        <span className={styles.ruleTop} aria-hidden="true" />

        <Container className={styles.hero}>
          <h1 id="subpage-title" className={styles.title}>
            Asset Performance Management
          </h1>
          <p className={styles.overviewNote}>{intro.description}</p>
        </Container>

        <span className={styles.rule} aria-hidden="true" />
      </Section>

      <Section tone="dim" className={styles.bodySection}>
        <Container className={styles.content}>
          <Reveal>
            <header className={styles.intro}>
              <h2 className={styles.introHeading}>{intro.heading}</h2>
            </header>
          </Reveal>

          <Reveal>
            <ul className={styles.functionGrid} aria-label="Asset performance functions">
              {functions.map((fn) => (
                <li key={fn.index} className={styles.functionCell} tabIndex={0}>
                  <span className={styles.functionCurtain} aria-hidden="true" />
                  <div className={styles.functionContent}>
                    <span className={styles.functionIndex}>{fn.index}</span>
                    <h3 className={styles.functionTitle}>{fn.title}</h3>
                    <p className={styles.functionNote}>{placeholderNote}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <SourceFootnote>
              Source: Client IA response · Post-Demerger business note
            </SourceFootnote>
          </Reveal>
        </Container>
      </Section>

      <MarqueeClients />

      <Section tone="light" className={styles.statsSection}>
        <Container>
          <Reveal>
            <CompanyMetrics data={metrics} id="asset-performance-metrics" bare />
          </Reveal>
        </Container>
      </Section>

      <Section tone="light" className={styles.ctaSection}>
        <Container>
          <Grid>
            <GridItem span={8} className={styles.ctaInfo}>
              <Stack gap="5xl">
                <Reveal>
                  <Stack gap="xl">
                    <Eyebrow>{cta.eyebrow}</Eyebrow>
                    <Heading variant="section" id="apm-cta-title">
                      {cta.heading}
                    </Heading>
                    <p className={styles.ctaBody}>{cta.body}</p>
                    <p className={styles.ctaNote}>{cta.note}</p>
                  </Stack>
                </Reveal>
              </Stack>
            </GridItem>
            <GridItem span={4} className={styles.ctaCardColumn}>
              <Reveal delay={1}>
                <div className={styles.ctaCard}>
                  <EnquiryForm />
                </div>
              </Reveal>
            </GridItem>
          </Grid>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
