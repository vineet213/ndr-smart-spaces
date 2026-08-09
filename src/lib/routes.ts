/**
 * Route registry — the single source of truth for every production route and
 * the section anchors that may be deep-linked. Consumed by the navigation
 * validator so a broken or duplicated route fails loud in development.
 */

export const siteRoutes: readonly string[] = [
  "/en",
  "/en/about-us",
  "/en/business",
  "/en/portfolio",
  "/en/investor-centre",
  "/en/investor-centre/investment-highlights",
  "/en/investor-centre/annual-reports",
  "/en/investor-centre/corporate-governance",
  "/en/investor-centre/announcements",
  "/en/investor-centre/downloads",
  "/en/investor-centre/financial-results",
  "/en/investor-centre/reports-disclosures",
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
  "/en/business": [
    "verticals",
    "grade-a-warehousing",
    "ndr-asset-management",
    "capabilities",
    "structure",
    "capital",
    "execution",
  ],
  "/en/portfolio": ["register"],
  "/en/esg": [
    "framework",
    "environmental",
    "social",
    "governance",
    "dashboard",
    "impact-map",
    "certifications",
    "disclosures",
  ],
  "/en/media": ["featured-publication", "press-archive", "media-kit", "press-contact"],
  "/en/contact": ["directory", "business-enquiry", "location", "routing"],
  "/en/investor-centre": ["statement", "capital-strength", "capital-cycle", "safe-harbour"],
  "/en/about-us": ["story", "business-model-title"],
};
