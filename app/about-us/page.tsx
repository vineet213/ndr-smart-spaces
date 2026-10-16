import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/AboutHero";
import { CompanyMetrics } from "@/components/sections/CompanyMetrics";
import { OurStory } from "@/components/sections/OurStory";
import { AboutTimeline } from "@/components/sections/AboutTimeline";
import { VisionMissionValues } from "@/components/sections/VisionMissionValues";
import { OurCode } from "@/components/sections/OurCode";
import { Leadership } from "@/components/sections/Leadership";
import { Footer } from "@/components/sections/Footer";
import { aboutStats } from "@/lib/data/about";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The infrastructure development platform of the NDR Group, established in 1954, and a leading developer of logistics and industrial spaces in India. The story, leadership and track record of NDR Smart Spaces.",
};

export default function AboutUsPage() {
  return (
    <>
      <AboutHero />
      <CompanyMetrics data={aboutStats} id="about-stats" />
      <OurStory />
      <AboutTimeline />
      <VisionMissionValues />
      <OurCode />
      <Leadership />
      <Footer />
    </>
  );
}
