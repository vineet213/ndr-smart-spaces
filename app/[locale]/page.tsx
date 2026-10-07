import { Hero } from "@/components/sections/Hero";
import { CompanyOverview } from "@/components/sections/CompanyOverview";
import { PortfolioPresence } from "@/components/sections/PortfolioPresence";
import { CompanyMetrics } from "@/components/sections/CompanyMetrics";
import { Esg } from "@/components/sections/Esg";
import { LatestUpdates } from "@/components/sections/LatestUpdates";
import { ContactCta } from "@/components/sections/ContactCta";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CompanyOverview />
      <PortfolioPresence />
      <CompanyMetrics />
      <Esg />
      <LatestUpdates />
      <ContactCta />
      <Footer />
    </>
  );
}
