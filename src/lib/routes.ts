/**
 * Route registry — the single source of truth for every production route and
 * the section anchors that may be deep-linked. Consumed by the navigation
 * validator so a broken or duplicated route fails loud in development.
 *
 * The static export uses `trailingSlash: true` (next.config.ts), so every
 * route emits as `<route>/index.html` and the canonical public URL ends in
 * `/`. `canonicalHref` normalises internal links to that canonical form so a
 * strict static host can never 404 a link that omits the slash.
 */

export const siteRoutes: readonly string[] = [
  "/",
  "/about-us",
  "/why-ndr",
  "/culture-and-careers/corporate-culture",
  "/culture-and-careers/careers-and-opportunities",
  "/business/logistics-and-industrial-infrastructure",
  "/business/ndr-asset-management",
  "/business/ndr-asset-management/development-lifecycle",
  "/business/ndr-asset-management/asset-performance-management",
  "/business/residential-plotting",
  "/investor-centre/corporate-governance",
  "/esg",
  "/media",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/sitemap",
];

/**
 * Section anchors that may be targeted by `#anchor` deep links, keyed by base
 * route. Only routes with linkable sections need an entry.
 */
export const routeAnchors: Readonly<Record<string, readonly string[]>> = {
  "/business/logistics-and-industrial-infrastructure": ["register"],
  "/esg": ["framework", "environmental", "certifications"],
  "/media": ["press-archive"],
  "/contact": ["directory", "business-enquiry"],
  "/about-us": ["story"],
  "/why-ndr": ["bays", "anatomy"],
  "/culture-and-careers/corporate-culture": ["hr-stats", "learning"],
  "/culture-and-careers/careers-and-opportunities": ["openings"],
};

/**
 * Normalise an internal href to the canonical exported form. Elements that
 * must stay untouched are left as-is:
 *
 *   /about-us            → /about-us/
 *   /contact#enquiry     → /contact/#enquiry
 *   #in-page-anchor      → #in-page-anchor      (fragment-only)
 *   mailto:… / tel:…     → unchanged
 *   https://…            → unchanged            (external)
 *   /                    → /
 */
export function canonicalHref(href: string): string {
  if (!href.startsWith("/")) return href;
  if (href.startsWith("//")) return href;
  const [path, fragment] = href.split("#");
  if (path === "") return href;
  const canonicalPath = path.endsWith("/") ? path : `${path}/`;
  return fragment === undefined ? canonicalPath : `${canonicalPath}#${fragment}`;
}
