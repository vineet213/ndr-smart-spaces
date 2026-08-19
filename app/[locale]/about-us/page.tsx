import type { Metadata } from "next";
import {
  AboutHero,
  OurStory,
  AboutTimeline,
  VisionMissionValues,
  Leadership,
  ClosingCta,
  Footer,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "From a rice mill in 1954 to India's institutional-grade infrastructure platform — the story, leadership and record of NDR Smart Spaces.",
};

export default function AboutUsPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <AboutTimeline />
      <VisionMissionValues />
      <Leadership />
      <ClosingCta />
      <Footer />
    </>
  );
}
