import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Footer } from "@/components/sections/Footer";
import { LegalSitemap } from "@/components/sections/LegalSitemap";

export const metadata: Metadata = pageMetadata({
  path: "/sitemap",
  title: "Website Sitemap",
  description:
    "Every page on the NDR Smart Spaces website, from the warehousing portfolio and business verticals to investor, ESG and media pages.",
});

export default function SitemapPage() {
  return (
    <>
      <LegalSitemap />
      <Footer />
    </>
  );
}
