import type { MetadataRoute } from "next";
import { warehouses } from "@/lib/data/warehouses";
import { siteRoutes, warehouseHref } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Warehouse pages without a summary and a photo are noindex, so they stay out.
  const warehouseRoutes = warehouses.filter((w) => w.indexable).map((w) => warehouseHref(w.id));
  return [...siteRoutes, ...warehouseRoutes].map((route) => ({ url: absoluteUrl(route) }));
}
