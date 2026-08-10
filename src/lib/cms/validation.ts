/**
 * CMS foundation — consolidated validation layer (§13).
 *
 * Aggregates the four existing dev-only validators (navigation, contact, esg,
 * media) into a single structured report and adds the CMS rule set from the
 * blueprint — including the nine approved checks: duplicate metrics, duplicate
 * locations, invalid coordinates, missing reporting periods, inconsistent
 * units, broken document references, unpublished linked content, invalid
 * publication references, and required field completeness.
 *
 * The same rules run inside the admin before publish (blocking) and in
 * development / CI (fail loud).
 */

import { validateNavigation } from "../navigationValidation";
import {
  validateOfficeKeys,
  validateOfficeContactDetails,
  validateMapCoordinates as validateContactCoordinates,
  validateRoutingKeys,
  validateRoutingContact,
} from "../data/contactValidation";
import {
  validateComposition,
  validateMapCoordinates as validateEsgCoordinates,
  validateMapUniqueness as validateEsgMapUniqueness,
  validateTrendSeries,
  validateGoals,
  validateEnvironmentMetrics,
} from "../data/esgValidation";
import {
  validateArchiveReferences,
  validateArchiveCategories,
  validateArchiveDraftMarkers,
  validateFeaturedReference,
  validateKitReferences,
  validateContactReferences as validatePressContactReferences,
} from "../data/mediaValidation";
import {
  investorMetrics,
  reportsDisclosures,
  financialResults,
  annualReports,
  announcements,
  downloads,
} from "../data/investor";
import { geoLocations, portfolioAssets, MAP_VIEWBOX } from "../data/portfolio";
import { esgDashboard, esgEnvironment } from "../data/esg";
import { mediaFeatured, pressArchive } from "../data/media";
import { footer, mapLocations } from "../data/homepage";
import { navItems, headerCta } from "../data/navigation";

export type ValidationIssue = {
  rule: string;
  collection: string;
  recordId?: string;
  severity: "error" | "warning";
  message: string;
};

export type ValidationReport = {
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  valid: boolean;
};

function reportFromMessages(
  rule: string,
  collection: string,
  messages: string[],
): ValidationIssue[] {
  return messages.map((message) => ({ rule, collection, severity: "error", message }));
}

const PLATE_PATTERN = /^\d{2}$/;
const YEAR_PATTERN = /^\d{4}$/;
const PRESS_REF_PATTERN = /^[A-Z]+-\d+$/;

function validateInvestorMetrics(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  const pairs = new Set<string>();
  for (const metric of investorMetrics) {
    if (ids.has(metric.id)) {
      issues.push({
        rule: "duplicate-metrics",
        collection: "metrics",
        recordId: metric.id,
        severity: "error",
        message: `Investor metric repeats id "${metric.id}".`,
      });
    }
    ids.add(metric.id);
    const pair = `${metric.stat}·${metric.value}·${metric.period}`;
    if (pairs.has(pair)) {
      issues.push({
        rule: "duplicate-metrics",
        collection: "metrics",
        recordId: metric.id,
        severity: "error",
        message: `Investor metric duplicates stat+value+period: "${metric.stat}" / "${metric.value}".`,
      });
    }
    pairs.add(pair);
    if (!metric.value.trim() || !metric.source.trim() || !metric.period.trim()) {
      issues.push({
        rule: "required-completeness",
        collection: "metrics",
        recordId: metric.id,
        severity: "error",
        message: `Investor metric "${metric.id}" is missing value, source, or period.`,
      });
    }
  }
  return issues;
}

function validatePortfolioLocations(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  for (const location of geoLocations) {
    if (location.lat < -90 || location.lat > 90 || location.lon < -180 || location.lon > 180) {
      issues.push({
        rule: "coordinates",
        collection: "locations",
        recordId: location.id,
        severity: "error",
        message: `Portfolio location "${location.id}" has invalid coordinates (${location.lat}, ${location.lon}).`,
      });
    }
    if (
      location.x < 0 ||
      location.x > MAP_VIEWBOX.width ||
      location.y < 0 ||
      location.y > MAP_VIEWBOX.height
    ) {
      issues.push({
        rule: "coordinates",
        collection: "locations",
        recordId: location.id,
        severity: "error",
        message: `Portfolio location "${location.id}" projects outside the viewbox (x=${location.x}, y=${location.y}).`,
      });
    }
    const key = `${location.name}·${location.zone}`;
    if (seen.has(key)) {
      issues.push({
        rule: "duplicate-locations",
        collection: "locations",
        recordId: location.id,
        severity: "error",
        message: `Duplicate portfolio location "${key}".`,
      });
    }
    seen.add(key);
  }
  return issues;
}

function validatePortfolioAssets(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const plates = new Set<string>();
  const locationIds = new Set(geoLocations.map((location) => location.id));
  for (const asset of portfolioAssets) {
    if (plates.has(asset.plate)) {
      issues.push({
        rule: "duplicate-references",
        collection: "portfolio-assets",
        recordId: asset.id,
        severity: "error",
        message: `Portfolio asset repeats plate "${asset.plate}".`,
      });
    }
    plates.add(asset.plate);
    if (!PLATE_PATTERN.test(asset.plate)) {
      issues.push({
        rule: "invalid-publication-references",
        collection: "portfolio-assets",
        recordId: asset.id,
        severity: "error",
        message: `Portfolio asset "${asset.id}" has a non-registry plate "${asset.plate}" (expected NN).`,
      });
    }
    if (asset.sizeSqFt !== undefined && (!Number.isFinite(asset.sizeSqFt) || asset.sizeSqFt <= 0)) {
      issues.push({
        rule: "numeric",
        collection: "portfolio-assets",
        recordId: asset.id,
        severity: "error",
        message: `Portfolio asset "${asset.id}" has a non-positive sizeSqFt.`,
      });
    }
    if (asset.completedYear !== undefined && !YEAR_PATTERN.test(asset.completedYear)) {
      issues.push({
        rule: "numeric",
        collection: "portfolio-assets",
        recordId: asset.id,
        severity: "error",
        message: `Portfolio asset "${asset.id}" has a non-4-digit completedYear "${asset.completedYear}".`,
      });
    }
    if (asset.locationId && !locationIds.has(asset.locationId)) {
      issues.push({
        rule: "references",
        collection: "portfolio-assets",
        recordId: asset.id,
        severity: "error",
        message: `Portfolio asset "${asset.id}" references unknown location "${asset.locationId}".`,
      });
    }
  }
  return issues;
}

function validateFilings(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const refs = new Set<string>();
  const configs = [reportsDisclosures, financialResults, annualReports, announcements, downloads];
  for (const config of configs) {
    const categories = new Set(config.categories);
    for (const filing of config.filings) {
      if (refs.has(filing.ref)) {
        issues.push({
          rule: "duplicate-references",
          collection: "documents",
          recordId: filing.ref,
          severity: "error",
          message: `Filing repeats reference "${filing.ref}".`,
        });
      }
      refs.add(filing.ref);
      if (!categories.has(filing.category)) {
        issues.push({
          rule: "references",
          collection: "documents",
          recordId: filing.ref,
          severity: "error",
          message: `Filing "${filing.ref}" has unknown category "${filing.category}".`,
        });
      }
      if (filing.status === "published" || filing.status === "external") {
        if (!filing.href) {
          issues.push({
            rule: "unpublished-linked-content",
            collection: "documents",
            recordId: filing.ref,
            severity: "error",
            message: `Filing "${filing.ref}" is ${filing.status} but has no href — the document cannot resolve.`,
          });
        }
        if (filing.status === "published" && !filing.asOn.trim()) {
          issues.push({
            rule: "missing-reporting-period",
            collection: "documents",
            recordId: filing.ref,
            severity: "error",
            message: `Published filing "${filing.ref}" is missing its reporting period (asOn).`,
          });
        }
      }
      if (!filing.ref.match(PRESS_REF_PATTERN) && !filing.ref.match(/^[A-Z0-9]+(-\d+)?$/)) {
        issues.push({
          rule: "invalid-publication-references",
          collection: "documents",
          recordId: filing.ref,
          severity: "warning",
          message: `Filing reference "${filing.ref}" does not match a registry-style code.`,
        });
      }
    }
  }
  return issues;
}

function validatePressEntries(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const entry of pressArchive.entries) {
    if (!PRESS_REF_PATTERN.test(entry.ref)) {
      issues.push({
        rule: "invalid-publication-references",
        collection: "media",
        recordId: entry.id,
        severity: "error",
        message: `Press entry "${entry.id}" has non-registry reference "${entry.ref}".`,
      });
    }
    if (entry.status === "published") {
      if (!entry.href) {
        issues.push({
          rule: "broken-document-references",
          collection: "media",
          recordId: entry.id,
          severity: "error",
          message: `Published press entry "${entry.ref}" has no href.`,
        });
      }
      if (entry.date.includes("*")) {
        issues.push({
          rule: "draft-status-consistency",
          collection: "media",
          recordId: entry.id,
          severity: "error",
          message: `Published press entry "${entry.ref}" still carries the * draft marker in its date.`,
        });
      }
    }
  }
  return issues;
}

function validateUnitConsistency(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const unitsByCode = new Map<string, string>();
  const registers: { label: string; id: string; code: string; unit: string }[] = [
    ...esgDashboard.trends.map((trend) => ({
      label: "trend",
      id: trend.id,
      code: trend.code,
      unit: trend.unit,
    })),
    ...esgDashboard.goals.map((goal) => ({
      label: "goal",
      id: goal.id,
      code: goal.code,
      unit: goal.unit,
    })),
    ...esgDashboard.composition.map((composition) => ({
      label: "composition",
      id: composition.id,
      code: composition.code,
      unit: composition.unit,
    })),
  ];
  for (const item of registers) {
    const existing = unitsByCode.get(item.code);
    if (existing !== undefined && existing !== item.unit) {
      issues.push({
        rule: "inconsistent-units",
        collection: "metrics",
        recordId: item.id,
        severity: "error",
        message: `ESG "${item.label}" "${item.id}" uses unit "${item.unit}" but code "${item.code}" is elsewhere "${existing}".`,
      });
    }
    unitsByCode.set(item.code, item.unit);
  }
  for (const metric of esgEnvironment.metrics) {
    if (metric.unit === "%" && Number(metric.value) > 100) {
      issues.push({
        rule: "numeric",
        collection: "metrics",
        recordId: metric.id,
        severity: "error",
        message: `Environment metric "${metric.id}" exceeds 100% (${metric.value}).`,
      });
    }
  }
  return issues;
}

function validateUnpublishedLinkedContent(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const entry = pressArchive.entries.find((candidate) => candidate.ref === mediaFeatured.ref);
  if (entry && entry.status === "draft") {
    issues.push({
      rule: "unpublished-linked-content",
      collection: "media",
      recordId: mediaFeatured.ref,
      severity: "warning",
      message: `Featured publication "${mediaFeatured.ref}" is still draft — it will not render publicly.`,
    });
  }
  return issues;
}

function validateNavigationCompleteness(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const item of navItems) {
    if (!item.label.trim() || !item.href.trim()) {
      issues.push({
        rule: "required-completeness",
        collection: "navigation",
        recordId: item.label || item.href,
        severity: "error",
        message: "A nav item is missing its label or href.",
      });
    }
  }
  if (!headerCta.enquiry.label.trim() || !headerCta.enquiry.href.trim()) {
    issues.push({
      rule: "required-completeness",
      collection: "navigation",
      recordId: "headerCta",
      severity: "error",
      message: "The header CTA is missing its label or href.",
    });
  }
  const footerComplete =
    footer.descriptor.trim().length > 0 && footer.groups.length > 0 && footer.legal.length > 0;
  if (!footerComplete) {
    issues.push({
      rule: "required-completeness",
      collection: "navigation",
      recordId: "footer",
      severity: "error",
      message: "The footer is missing its descriptor, link groups, or legal links.",
    });
  }
  return issues;
}

function validateHomepageLocationDuplication(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const portfolioNames = new Set(geoLocations.map((location) => location.name));
  for (const location of mapLocations) {
    if (portfolioNames.has(location.name)) {
      issues.push({
        rule: "locations-merge",
        collection: "locations",
        recordId: location.name,
        severity: "warning",
        message: `Homepage map location "${location.name}" duplicates a portfolio location — the CMS migrates it to the shared Locations collection (§6.1).`,
      });
    }
  }
  return issues;
}

const EXISTING_RULES: { rule: string; collection: string; run: () => string[] }[] = [
  { rule: "navigation", collection: "navigation", run: validateNavigation },
  { rule: "office-keys", collection: "contact-directory", run: validateOfficeKeys },
  { rule: "office-contact", collection: "contact-directory", run: validateOfficeContactDetails },
  { rule: "routing-keys", collection: "contact-directory", run: validateRoutingKeys },
  { rule: "routing-contact", collection: "contact-directory", run: validateRoutingContact },
  { rule: "press-contact", collection: "contact-directory", run: validatePressContactReferences },
  { rule: "contact-map", collection: "locations", run: validateContactCoordinates },
  { rule: "composition", collection: "metrics", run: validateComposition },
  { rule: "trend-series", collection: "metrics", run: validateTrendSeries },
  { rule: "goals", collection: "metrics", run: validateGoals },
  { rule: "environment-metrics", collection: "metrics", run: validateEnvironmentMetrics },
  { rule: "esg-map", collection: "esg-initiatives", run: validateEsgCoordinates },
  { rule: "esg-map-uniqueness", collection: "esg-initiatives", run: validateEsgMapUniqueness },
  { rule: "archive-references", collection: "media", run: validateArchiveReferences },
  { rule: "archive-categories", collection: "media", run: validateArchiveCategories },
  { rule: "archive-draft-markers", collection: "media", run: validateArchiveDraftMarkers },
  { rule: "featured-reference", collection: "media", run: validateFeaturedReference },
  { rule: "kit-references", collection: "media", run: validateKitReferences },
];

/** Run every rule (existing + CMS) and return a structured report. */
export function validateAll(): ValidationReport {
  const issues: ValidationIssue[] = [];

  for (const rule of EXISTING_RULES) {
    issues.push(...reportFromMessages(rule.rule, rule.collection, rule.run()));
  }

  issues.push(...validateInvestorMetrics());
  issues.push(...validatePortfolioLocations());
  issues.push(...validatePortfolioAssets());
  issues.push(...validateFilings());
  issues.push(...validatePressEntries());
  issues.push(...validateUnitConsistency());
  issues.push(...validateUnpublishedLinkedContent());
  issues.push(...validateNavigationCompleteness());
  issues.push(...validateHomepageLocationDuplication());

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  return { issues, errors, warnings, valid: errors.length === 0 };
}

/** Fail-loud runner for development and CI. */
export function runValidation(): boolean {
  const report = validateAll();
  if (report.issues.length === 0) {
    console.log("[cms-validation] all rules passed.");
    return true;
  }
  for (const issue of report.issues) {
    const tag = issue.severity === "error" ? "ERROR" : "WARN ";
    const where = issue.recordId
      ? ` · ${issue.collection}:${issue.recordId}`
      : ` · ${issue.collection}`;
    console.error(`[cms-validation] ${tag} ${issue.rule}${where} — ${issue.message}`);
  }
  return report.valid;
}
