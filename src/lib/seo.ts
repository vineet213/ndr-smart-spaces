/**
 * Search-engine facts about the site: the public origin, the display name of
 * every route (for breadcrumbs) and the Organization record. Everything here
 * comes from data already in the repo; nothing is invented.
 */

import { corporateSettings } from "@/lib/data/generated/corporateSettings";
import { footer } from "@/lib/data/homepage";
import { correspondenceForm } from "@/lib/data/contact";
import { aumStates } from "@/lib/data/portfolio";

export const SITE_URL = "https://ndrsmartspaces.com";

/** Portfolio totals from the AUM ledger, so the description never drifts from the map. */
export const portfolioTotals = {
  sites: aumStates.reduce((sum, state) => sum + state.parcelCount, 0),
  msf:
    Math.round(aumStates.reduce((sum, state) => sum + (state.totalLeasableAreaMsf ?? 0), 0) * 100) /
    100,
  states: aumStates.length,
};

/**
 * The site-wide description (meta, social cards, Organization record). It names
 * the category plainly, so search engines and AI assistants can tell what NDR does.
 */
export const SITE_DESCRIPTION = `NDR Smart Spaces develops and manages Grade A warehousing and industrial & logistics parks across India: ${portfolioTotals.sites} sites and ${portfolioTotals.msf} million sq ft in ${portfolioTotals.states} states.`;

/** Absolute URL for a site path; always ends in "/" like the exported pages. */
export function absoluteUrl(path: string): string {
  const clean = path === "/" ? "" : path.replace(/^\/+|\/+$/g, "");
  return clean === "" ? `${SITE_URL}/` : `${SITE_URL}/${clean}/`;
}

/** Breadcrumb names: each page's own title (see its metadata), keyed by route. */
export const routeNames: Readonly<Record<string, string>> = {
  "/": "Home",
  "/about-us": "About Us",
  "/why-ndr": "Why NDR",
  "/culture-and-careers/corporate-culture": "Corporate Culture",
  "/culture-and-careers/careers-and-opportunities": "Careers & Opportunities",
  "/business/logistics-and-industrial-infrastructure": "Logistics and Industrial Infrastructure",
  "/business/ndr-asset-management": "Project Management and Maintenance: NDR Asset Management",
  "/business/ndr-asset-management/development-lifecycle": "Development Lifecycle",
  "/business/ndr-asset-management/asset-performance-management": "Asset Performance Management",
  "/business/residential-plotting": "Residential Plotting",
  "/investor-centre/corporate-governance": "Corporate Governance",
  "/esg": "ESG & Sustainability",
  "/media": "Media",
  "/contact": "Contact",
  "/privacy-policy": "Privacy Policy",
  "/terms": "Terms & Conditions",
  "/disclaimer": "Disclaimer",
  "/sitemap": "Website Sitemap",
};

/**
 * BreadcrumbList for a pathname, or null for the home page and for routes
 * that are not real pages. Only ancestors that are real pages are included
 * (there is no /business/ or /investor-centre/ page to link to).
 */
export function breadcrumbJsonLd(pathname: string) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  if (path === "/" || routeNames[path] === undefined) return null;

  const parts = path.split("/").filter(Boolean);
  const trail: string[] = ["/"];
  for (let i = 1; i <= parts.length; i += 1) {
    const route = `/${parts.slice(0, i).join("/")}`;
    if (routeNames[route] !== undefined) trail.push(route);
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((route, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: routeNames[route],
      item: absoluteUrl(route),
    })),
  };
}

/** "Bazulla Road, T. Nagar, Chennai, Tamil Nadu 600017" -> structured address, from the footer record. */
function postalAddress(line: string) {
  const match = /^(.*),\s*([^,]+),\s*([^,]+?)\s+(\d{6})$/.exec(line.trim());
  if (!match) return undefined;
  const [, street, locality, region, postalCode] = match;
  return {
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: locality,
    addressRegion: region,
    postalCode,
    addressCountry: "IN",
  };
}

export function organizationJsonLd() {
  const address = postalAddress(footer.contact.address);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: corporateSettings.companyName,
    legalName: corporateSettings.legalEntity,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icons/icon-512.png`,
    description: SITE_DESCRIPTION,
    email: correspondenceForm.route.General,
    identifier: { "@type": "PropertyValue", propertyID: "CIN", value: corporateSettings.cin },
    ...(address ? { address } : {}),
    parentOrganization: { "@type": "Organization", name: "NDR Group", foundingDate: "1954" },
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
      "Grade A warehousing",
      "Industrial and logistics parks",
      "Built-to-suit warehouses",
      "Warehouse leasing",
      "Logistics infrastructure development",
    ],
  };
}

/** WebSite record: tells search engines the site's name and that it belongs to the Organization. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: "NDR Smart Spaces",
    alternateName: corporateSettings.legalEntity,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
