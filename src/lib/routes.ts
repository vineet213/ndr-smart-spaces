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
  "/en",
  "/en/about-us",
  "/en/business/logistics-and-industrial-infrastructure",
  "/en/business/ndr-asset-management",
  "/en/business/ndr-asset-management/development-lifecycle",
  "/en/business/ndr-asset-management/asset-performance-management",
  "/en/business/residential-plotting",
  "/en/investor-centre",
  "/en/investor-centre/announcements",
  "/en/investor-centre/corporate-governance",
  "/en/investor-centre/summary-of-business",
  "/en/esg",
  "/en/media",
  "/en/contact",
  "/en/privacy-policy",
  "/en/terms",
  "/en/disclaimer",
  "/en/sitemap",
];

/**
 * Section anchors that may be targeted by `#anchor` deep links, keyed by base
 * route. Only routes with linkable sections need an entry.
 */
export const routeAnchors: Readonly<Record<string, readonly string[]>> = {
  "/en/business/logistics-and-industrial-infrastructure": ["register"],
  "/en/esg": ["framework", "environmental", "certifications"],
  "/en/media": ["press-archive"],
  "/en/contact": ["directory", "business-enquiry"],
  "/en/investor-centre": [],
  "/en/about-us": ["story"],
};

/**
 * Normalise an internal href to the canonical exported form. Elements that
 * must stay untouched are left as-is:
 *
 *   /en/about-us         → /en/about-us/
 *   /en/contact#enquiry  → /en/contact/#enquiry
 *   #in-page-anchor      → #in-page-anchor      (fragment-only)
 *   mailto:… / tel:…     → unchanged
 *   https://…            → unchanged            (external)
 *   /en                  → /en/
 */
export function canonicalHref(href: string): string {
  if (!href.startsWith("/")) return href;
  if (href.startsWith("//")) return href;
  const [path, fragment] = href.split("#");
  if (path === "") return href;
  const canonicalPath = path.endsWith("/") ? path : `${path}/`;
  return fragment === undefined ? canonicalPath : `${canonicalPath}#${fragment}`;
}
