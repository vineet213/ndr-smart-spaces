import type { Metadata } from "next";
import { PageMasthead } from "@/components/sections/PageMasthead";
import { CareersOpenings } from "@/components/sections/CareersOpenings";
import { Footer } from "@/components/sections/Footer";
import { careersMasthead } from "@/lib/data/careers";

export const metadata: Metadata = {
  title: "Careers & Opportunities",
  description:
    "Open roles at NDR Smart Spaces across development, park operations and the corporate office, and how to apply.",
};

export default function CareersAndOpportunitiesPage() {
  return (
    <>
      <PageMasthead
        id="careers-masthead"
        title={careersMasthead.title}
        subtext={careersMasthead.subtext}
      />
      <CareersOpenings />
      <Footer />
    </>
  );
}
