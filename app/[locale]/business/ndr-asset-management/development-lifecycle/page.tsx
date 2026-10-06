import type { Metadata } from "next";
import { Section } from "@/components/layout";
import { DevelopmentLifecycle, Footer, PageMasthead } from "@/components/sections";
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
      <PageMasthead
        id="subpage-title"
        title={{ before: "Development ", accent: "Lifecycle" }}
        subtext={intro.mastheadSubtext}
      />

      <Section tone="dim" className={styles.bodySection}>
        <DevelopmentLifecycle stages={stages} source={source} />
      </Section>

      <Footer />
    </>
  );
}
