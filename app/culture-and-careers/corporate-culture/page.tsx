import type { Metadata } from "next";
import { CultureHero } from "@/components/sections/CultureHero";
import { CultureStatsLine } from "@/components/sections/CultureStatsLine";
import { CultureRing } from "@/components/sections/CultureRing";
import { CultureLearning } from "@/components/sections/CultureLearning";
import { CultureClosing } from "@/components/sections/CultureClosing";
import { Footer } from "@/components/sections/Footer";
import { PageMasthead } from "@/components/sections/PageMasthead";
import { cultureMasthead } from "@/lib/data/careers";

export const metadata: Metadata = {
  title: "Corporate Culture",
  description:
    "Life and work at NDR Smart Spaces: the people behind 46 logistics parks, how we hire and grow teams, and learning and development on live projects.",
};

export default function CorporateCulturePage() {
  return (
    <>
      <PageMasthead
        id="culture-masthead-title"
        title={cultureMasthead.title}
        subtext={cultureMasthead.statement}
      />
      <CultureHero />
      <CultureStatsLine />
      <CultureRing />
      <CultureLearning />
      <CultureClosing />
      <Footer />
    </>
  );
}
