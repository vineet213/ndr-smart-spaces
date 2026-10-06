import { aboutHero } from "@/lib/data/about";
import { PageMasthead } from "./PageMasthead";

export function AboutHero() {
  return (
    <PageMasthead
      id="about-hero-title"
      title={{ before: aboutHero.headline, accent: aboutHero.headlineAccent }}
      subtext={aboutHero.lede}
    />
  );
}
