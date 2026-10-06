import type { Metadata } from "next";
import { Container, Section } from "@/components/layout";
import { CompanyMetrics, Footer, MarqueeClients, PageMasthead } from "@/components/sections";
import { vertical02AssetManagement } from "@/lib/data/business";
import { Reveal } from "@/components/sections/Reveal";
import styles from "./asset-performance-management.module.css";

export const metadata: Metadata = {
  title: "Asset Performance Management",
  description: "NDR Asset Management — operating and maintaining assets for long-term performance.",
};

export default function AssetPerformanceManagementPage() {
  const { intro, functions, metrics } = vertical02AssetManagement;

  return (
    <>
      <PageMasthead
        id="subpage-title"
        title={{ before: "Asset ", accent: "Performance", after: " Management" }}
        subtext={intro.mastheadSubtext}
      />

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
                    <p className={styles.functionNote}>{fn.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <Reveal>
        <CompanyMetrics data={metrics} id="asset-performance-metrics" />
      </Reveal>

      <MarqueeClients />

      <Footer />
    </>
  );
}
