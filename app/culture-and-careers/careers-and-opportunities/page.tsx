import type { Metadata } from "next";
import { CareersBoard } from "@/components/sections/CareersBoard";
import { Footer } from "@/components/sections/Footer";
import { PageMasthead } from "@/components/sections/PageMasthead";
import { careersHero } from "@/lib/data/careers";

export const metadata: Metadata = {
  title: "Careers & Opportunities",
  description:
    "Open roles at NDR Smart Spaces across development, park operations and the corporate office, and how to apply.",
};

export default function CareersAndOpportunitiesPage() {
  return (
    <>
      <PageMasthead
        id="careers-masthead-title"
        title={careersHero.title}
        subtext={careersHero.lede}
      />
      <CareersBoard />
      <Footer />
    </>
  );
}
