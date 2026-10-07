import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { LegalSitemap } from "@/components/sections/LegalSitemap";

export const metadata: Metadata = {
  title: "Website Sitemap",
  description: "Every route on the NDR Smart Spaces website, grouped by publication.",
};

export default function SitemapPage() {
  return (
    <>
      <LegalSitemap />
      <Footer />
    </>
  );
}
