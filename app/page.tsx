import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { CompanyOverview } from "@/components/sections/CompanyOverview";
import { PortfolioPresence } from "@/components/sections/PortfolioPresence";
import { CompanyMetrics } from "@/components/sections/CompanyMetrics";
import { Esg } from "@/components/sections/Esg";
import { LatestUpdates } from "@/components/sections/LatestUpdates";
import { MarqueeClients } from "@/components/sections/MarqueeClients";
import { ContactCta } from "@/components/sections/ContactCta";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Hero />
      <CompanyOverview />
      <PortfolioPresence />
      <CompanyMetrics />
      <MarqueeClients />
      <Esg />
      <LatestUpdates />
      <ContactCta />
      <Footer />
    </>
  );
}
