import {
  Hero,
  AudienceStrip,
  PortfolioPresence,
  CompanyOverview,
  BusinessHighlights,
  FeaturedProjects,
  MarqueeClients,
  Esg,
  LatestUpdates,
  ContactCta,
  Footer,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AudienceStrip />
      <PortfolioPresence />
      <CompanyOverview />
      <BusinessHighlights />
      <FeaturedProjects />
      <MarqueeClients />
      <Esg />
      <LatestUpdates />
      <ContactCta />
      <Footer />
    </>
  );
}
