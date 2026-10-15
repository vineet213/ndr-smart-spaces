import type { MetadataRoute } from "next";
import { siteRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes.map((route) => ({ url: absoluteUrl(route) }));
}
