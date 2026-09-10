import type { Metadata } from "next";
import { Container, Section } from "@/components/layout";
import { DevelopmentLifecycle, Footer } from "@/components/sections";
import { vertical02DevelopmentLifecycle } from "@/lib/data/business";
import styles from "./development-lifecycle.module.css";

export const metadata: Metadata = {
  title: "Development Lifecycle",
  description: "NDR Asset Management — the development lifecycle from origination to handover.",
};

export default function DevelopmentLifecyclePage() {
  const { intro, stages, source } = vertical02DevelopmentLifecycle;

  return (
    <>
      <Section tone="charcoal" ariaLabelledby="subpage-title" className={styles.masthead}>
        <span className={styles.ruleTop} aria-hidden="true" />

        <Container className={styles.hero}>
          <h1 id="subpage-title" className={styles.title}>
            Development Lifecycle
          </h1>
        </Container>

        <span className={styles.rule} aria-hidden="true" />
      </Section>

      <Section tone="dim" className={styles.bodySection}>
        <DevelopmentLifecycle intro={intro} stages={stages} source={source} />
      </Section>

      <Footer />
    </>
  );
}
