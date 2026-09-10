import {
  Hero,
  CompanyOverview,
  PortfolioPresence,
  CompanyMetrics,
  CustomerReviews,
  Esg,
  LatestUpdates,
  ContactCta,
  Footer,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CompanyOverview />
      <PortfolioPresence />
      <CompanyMetrics />
      <CustomerReviews />
      <Esg />
      <LatestUpdates />
      <ContactCta />
      <Footer />
    </>
  );
}
