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
    "From a rice mill in 1954 to India's institutional-grade infrastructure platform — the story, leadership and record of NDR Smart Spaces.",
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
