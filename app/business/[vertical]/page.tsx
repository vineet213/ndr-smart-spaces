import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { VerticalPage } from "@/components/sections/VerticalPage";
import { divisions } from "@/lib/data/business";
import { pageMetadata, portfolioTotals, snippet } from "@/lib/seo";

function slugFromHref(href: string): string | null {
  if (!href.startsWith("/business/")) return null;
  const slug = href.slice("/business/".length).split("#")[0];
  return slug.length > 0 ? slug : null;
}

function divisionForSlug(slug: string) {
  return divisions.find((division) => slugFromHref(division.route.href) === slug);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return divisions
    .map((division) => slugFromHref(division.route.href))
    .filter((slug): slug is string => slug !== null)
    .map((slug) => ({ vertical: slug }));
}

type Params = Promise<{ vertical: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { vertical } = await params;
  const division = divisionForSlug(vertical);
  if (!division) {
    return { title: "Business", description: "The operating manual of NDR Smart Spaces." };
  }
  const search = SEARCH[vertical];
  return pageMetadata({
    path: `/business/${vertical}`,
    title: search?.title ?? division.title,
    description: search?.description ?? snippet(division.writeup),
  });
}

/** Search titles and snippets in the words people type; the pages keep their own copy. */
const SEARCH: Readonly<Record<string, { title: string; description: string }>> = {
  "logistics-and-industrial-infrastructure": {
    title: "Warehouses & Logistics Parks in India",
    description: `Grade A warehouses and industrial & logistics parks across India, including built-to-suit facilities: ${portfolioTotals.sites} sites in ${portfolioTotals.states} states. Explore the portfolio map.`,
  },
  "ndr-asset-management": {
    title: "Warehouse Project Management & Maintenance",
    description:
      "NDR Asset Management builds and manages industrial and logistics assets for clients, from the first plan to handover, then operates and maintains them.",
  },
  "residential-plotting": {
    title: "Residential Plots by Ave Acres",
    description:
      "Planned residential plot communities in industrial growth corridors, close to places of work, developed through Ave Acres, NDR Smart Spaces' plotting arm.",
  },
};

export default async function BusinessVerticalPage({ params }: { params: Params }) {
  const { vertical } = await params;
  const division = divisionForSlug(vertical);
  if (!division) notFound();

  return (
    <>
      <VerticalPage division={division} />
      <Footer />
    </>
  );
}
