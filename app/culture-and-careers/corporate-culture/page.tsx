import type { Metadata } from "next";
import { PageMasthead } from "@/components/sections/PageMasthead";
import { CultureOverview } from "@/components/sections/CultureOverview";
import { CultureStats } from "@/components/sections/CultureStats";
import { CycleSection } from "@/components/sections/CycleSection";
import { LearningDevelopment } from "@/components/sections/LearningDevelopment";
import { MediaPlaceholder } from "@/components/sections/MediaPlaceholder";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Footer } from "@/components/sections/Footer";
import { cultureClosing, cultureCycle, cultureMasthead } from "@/lib/data/careers";

export const metadata: Metadata = {
  title: "Corporate Culture",
  description:
    "Life and work at NDR Smart Spaces: the people behind 46 logistics parks, how we hire and grow teams, and learning and development on live projects.",
};

export default function CorporateCulturePage() {
  return (
    <>
      <PageMasthead
        id="culture-masthead"
        title={cultureMasthead.title}
        subtext={cultureMasthead.subtext}
      />
      <CultureOverview />
      <CultureStats />
      <CycleSection
        id="culture-cycle"
        sheet="02"
        of="03"
        eyebrow={cultureCycle.eyebrow}
        heading={cultureCycle.heading}
        lede={cultureCycle.lede}
        nodes={cultureCycle.nodes}
        medallion={cultureCycle.medallion}
      />
      <LearningDevelopment />
      {/* CONFIRM WITH CLIENT: closing video or image. */}
      <MediaPlaceholder note="Video / closing image to be inserted" />
      <ClosingCta data={cultureClosing} />
      <Footer />
    </>
  );
}
