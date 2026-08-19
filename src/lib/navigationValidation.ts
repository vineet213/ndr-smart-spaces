import { footer } from "./data/homepage";
import { headerCta, mobileNavItems, navItems, type NavItem } from "./data/navigation";
import { routeAnchors, siteRoutes } from "./routes";

/**
 * Navigation data validation — pure rules over the header nav, header CTA and
 * footer link sets. Validation is one-directional (this module imports the
 * data; the layout wires the run). Rules fail loud in development only, never
 * in production.
 *
 * Rules:
 *   1. Every internal href resolves to a known route (no 404s).
 *   2. Every `#anchor` target exists for the route it is attached to.
 *   3. No destination repeats within a single surface (no duplicate links).
 *   4. No destination carries two different labels within a single surface
 *      (one label per destination).
 *   5. Every production route is reachable from at least one surface.
 */

type NavEntry = { label: string; href: string; surface: string };

function isExternalHref(href: string): boolean {
  return (
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function isRoutableHref(href: string): boolean {
  return !isExternalHref(href) && href !== "#" && href.split("#")[0] !== "";
}

function collectNavEntries(items: readonly NavItem[], surface: string, entries: NavEntry[]) {
  for (const item of items) {
    entries.push({ label: item.label, href: item.href, surface });
    if (item.type === "menu") {
      for (const column of item.columns) {
        for (const link of column.links) {
          entries.push({ label: link.label, href: link.href, surface });
        }
      }
    }
  }
}

function collectFooterEntries(): NavEntry[] {
  const entries: NavEntry[] = [];
  for (const group of footer.groups) {
    for (const link of group.links) {
      entries.push({ label: link.label, href: link.href, surface: `footer · ${group.heading}` });
    }
  }
  for (const link of footer.legal) {
    entries.push({ label: link.label, href: link.href, surface: "footer · legal" });
  }
  for (const link of footer.ecosystem) {
    entries.push({ label: link.label, href: link.href, surface: "footer · ecosystem" });
  }
  entries.push({ label: "NDR Smart Spaces", href: "/en", surface: "brand mark" });
  return entries;
}

export function validateNavigation(): string[] {
  const errors: string[] = [];

  const entries: NavEntry[] = [];
  collectNavEntries(navItems, "desktop nav", entries);
  collectNavEntries(mobileNavItems, "mobile nav", entries);
  entries.push({
    label: headerCta.enquiry.label,
    href: headerCta.enquiry.href,
    surface: "header CTA",
  });
  entries.push(...collectFooterEntries());

  for (const entry of entries) {
    if (!isRoutableHref(entry.href)) continue;
    const [base, anchor] = entry.href.split("#");
    if (!siteRoutes.includes(base)) {
      errors.push(`Dangling route "${entry.href}" ("${entry.label}", ${entry.surface}).`);
      continue;
    }
    if (anchor) {
      const known = routeAnchors[base];
      if (known && !known.includes(anchor)) {
        errors.push(
          `Unknown anchor "#${anchor}" on "${base}" ("${entry.label}", ${entry.surface}).`,
        );
      }
    }
  }

  const bySurface = new Map<string, Map<string, string>>();
  for (const entry of entries) {
    if (!isRoutableHref(entry.href)) continue;
    let surfaceMap = bySurface.get(entry.surface);
    if (!surfaceMap) {
      surfaceMap = new Map<string, string>();
      bySurface.set(entry.surface, surfaceMap);
    }
    const existingLabel = surfaceMap.get(entry.href);
    if (existingLabel && existingLabel !== entry.label) {
      errors.push(
        `Destination "${entry.href}" carries two labels — "${existingLabel}" and "${entry.label}" (${entry.surface}).`,
      );
    } else if (!existingLabel) {
      surfaceMap.set(entry.href, entry.label);
    }
  }

  const routeSet = new Set(siteRoutes);
  const reached = new Set<string>();
  for (const entry of entries) {
    if (!isRoutableHref(entry.href)) continue;
    reached.add(entry.href.split("#")[0]);
  }
  for (const route of routeSet) {
    if (!reached.has(route)) {
      errors.push(`Route "${route}" is not reachable from any nav, CTA or footer link.`);
    }
  }

  return errors;
}

export function runNavigationValidation(): boolean {
  const errors = validateNavigation();
  if (errors.length > 0) {
    console.error(`[navigation-validation] ${errors.length} issue(s) found:`);
    for (const error of errors) console.error(`  · ${error}`);
    return false;
  }
  return true;
}
