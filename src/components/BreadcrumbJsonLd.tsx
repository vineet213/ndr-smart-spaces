"use client";

import { usePathname } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

/** Emits BreadcrumbList structured data for the current page. Renders nothing visible. */
export function BreadcrumbJsonLd() {
  const data = breadcrumbJsonLd(usePathname() ?? "/");
  return data ? <JsonLd data={data} /> : null;
}
