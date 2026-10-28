import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, pageMetadata, SITE_DESCRIPTION, websiteJsonLd } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { CompanyOverview } from "@/components/sections/CompanyOverview";
import { PortfolioPresence } from "@/components/sections/PortfolioPresence";
import { CompanyMetrics } from "@/components/sections/CompanyMetrics";
import { Esg } from "@/components/sections/Esg";
import { LatestUpdates } from "@/components/sections/LatestUpdates";
import { MarqueeClients } from "@/components/sections/MarqueeClients";
import { ContactCta } from "@/components/sections/ContactCta";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "NDR Smart Spaces | Warehousing & Logistics Parks in India",
  description: SITE_DESCRIPTION,
  absoluteTitle: true,
});

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
