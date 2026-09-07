import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, VerticalPage } from "@/components/sections";
import { divisions } from "@/lib/data/business";

function slugFromHref(href: string): string | null {
  if (!href.startsWith("/en/business/")) return null;
  const slug = href.slice("/en/business/".length).split("#")[0];
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
    .map((slug) => ({ locale: "en", vertical: slug }));
}

type Params = Promise<{ locale: string; vertical: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { vertical } = await params;
  const division = divisionForSlug(vertical);
  if (!division) {
    return { title: "Business", description: "The operating manual of NDR Smart Spaces." };
  }
  return { title: division.title, description: division.writeup };
}

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
