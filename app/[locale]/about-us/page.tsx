import type { Metadata } from "next";
import {
  AboutHero,
  CompanyMetrics,
  OurStory,
  AboutTimeline,
  VisionMissionValues,
  OurCode,
  Leadership,
  Footer,
} from "@/components/sections";
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
