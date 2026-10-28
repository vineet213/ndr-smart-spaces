import { aboutHero } from "@/lib/data/about";
import { correspondenceForm } from "@/lib/data/contact";
import { invitRelationship } from "@/lib/data/investor";
import { aumStates, formatMsf } from "@/lib/data/portfolio";
import { siteRoutes } from "@/lib/routes";
import { absoluteUrl, routeNames, SITE_DESCRIPTION } from "@/lib/seo";

export const dynamic = "force-static";

/** Legal pages say nothing about the business, so they stay out of the summary. */
const SKIP = new Set(["/privacy-policy", "/terms", "/disclaimer", "/sitemap"]);

/**
 * /llms.txt: a plain-text summary of the company for AI assistants (llmstxt.org).
 * Built from the same data as the pages, so it never says more than the site does.
 */
export function GET() {
  const pages = siteRoutes
    .filter((route) => !SKIP.has(route))
    .map((route) => `- [${routeNames[route] ?? route}](${absoluteUrl(route)})`);

  const states = aumStates.map(
    (state) =>
      `- ${state.stateName}: ${state.parcelCount} ${state.parcelCount === 1 ? "site" : "sites"}` +
      (state.totalLeasableAreaMsf !== null ? `, ${formatMsf(Math.round(state.totalLeasableAreaMsf * 100) / 100)}` : ""),
  );

  const text = [
    "# NDR Smart Spaces",
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    aboutHero.lede,
    "",
    invitRelationship.body[0],
    "",
    "## Portfolio by state",
    "",
    ...states,
    "",
    "## Pages",
    "",
    ...pages,
    "",
    "## Contact",
    "",
    `- Enquiries: ${correspondenceForm.route.General}`,
    `- [Contact page](${absoluteUrl("/contact")})`,
    `- NDR InvIT (separate listed trust): ${invitRelationship.external.href}`,
    "",
  ].join("\n");

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
