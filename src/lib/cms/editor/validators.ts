/**
 * Editor validation — field rules from the collection schemas plus the custom
 * rules each Phase 1.1 editor imposes (navigation/footer route checks, the
 * documents/media publication gate). Runs before every mutation in the engine;
 * a failed validation rejects the save with a structured issue list.
 */

import { routeAnchors, siteRoutes } from "../../routes";
import { MAP_VIEWBOX } from "../../data/portfolio";
import { JsonValue } from "../types";
import { ValidationIssue } from "../validation";
import { CollectionEditorSchema, FieldSchema } from "./schemas";
import { ReferenceLookup } from "./lookup";

export type RecordWithData = {
  id?: string;
  status: string;
  data: JsonValue;
  filePresent?: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^(https?:\/\/|mailto:|tel:)/;
const INTERNAL_ANCHOR = /^([^#]*)#(.+)$/;

export function validateFields(schema: CollectionEditorSchema, data: JsonValue): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const walk = (fields: readonly FieldSchema[], value: JsonValue, path: string) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return;
    const object = value as Record<string, JsonValue>;
    for (const field of fields) {
      const fieldValue = object[field.key];
      const fullPath = path ? `${path}.${field.key}` : field.key;
      if (field.required && isEmpty(fieldValue)) {
        issues.push({
          rule: "required-completeness",
          collection: schema.key,
          recordId: fullPath,
          severity: "error",
          message: `"${field.label}" is required (${fullPath}).`,
        });
        if (field.kind !== "object" && field.kind !== "list") continue;
      }
      if (fieldValue === undefined || fieldValue === null) continue;
      switch (field.kind) {
        case "text":
        case "textarea":
        case "email":
        case "url":
        case "select": {
          const text = String(fieldValue);
          if (field.minLength !== undefined && text.length < field.minLength) {
            issues.push({
              rule: "required-completeness",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" is shorter than ${field.minLength} characters.`,
            });
          }
          if (field.maxLength !== undefined && text.length > field.maxLength) {
            issues.push({
              rule: "required-completeness",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" exceeds ${field.maxLength} characters.`,
            });
          }
          if (field.pattern && !new RegExp(field.pattern).test(text)) {
            issues.push({
              rule: "required-completeness",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" does not match the required format (${field.pattern}).`,
            });
          }
          if (field.kind === "email" && text && !EMAIL_PATTERN.test(text)) {
            issues.push({
              rule: "required-completeness",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" is not a valid email address.`,
            });
          }
          if (field.kind === "url" && text && !URL_PATTERN.test(text)) {
            issues.push({
              rule: "required-completeness",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" is not a valid URL (expected https://, mailto:, or tel:).`,
            });
          }
          if (field.kind === "select" && field.options && !field.options.includes(text)) {
            issues.push({
              rule: "required-completeness",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" has unknown option "${text}".`,
            });
          }
          break;
        }
        case "number": {
          const number = Number(fieldValue);
          if (!Number.isFinite(number)) {
            issues.push({
              rule: "numeric",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" must be a number.`,
            });
          } else if (field.min !== undefined && number < field.min) {
            issues.push({
              rule: "numeric",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" must be ≥ ${field.min}.`,
            });
          } else if (field.max !== undefined && number > field.max) {
            issues.push({
              rule: "numeric",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" must be ≤ ${field.max}.`,
            });
          }
          break;
        }
        case "file": {
          if (field.required && (typeof fieldValue !== "string" || fieldValue.length === 0)) {
            issues.push({
              rule: "required-completeness",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" needs an uploaded file.`,
            });
          }
          break;
        }
        case "object":
          if (field.fields) walk(field.fields, fieldValue ?? {}, fullPath);
          break;
        case "map": {
          if (typeof fieldValue !== "object" || fieldValue === null || Array.isArray(fieldValue)) {
            issues.push({
              rule: "required-completeness",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" must be a set of key/value pairs.`,
            });
            break;
          }
          for (const [key, entry] of Object.entries(fieldValue as Record<string, JsonValue>)) {
            if (!key.trim() || typeof entry !== "string" || !entry.trim()) {
              issues.push({
                rule: "required-completeness",
                collection: schema.key,
                recordId: fullPath,
                severity: "error",
                message: `"${field.label}" contains an empty pair.`,
              });
            }
          }
          break;
        }
        case "list": {
          if (!Array.isArray(fieldValue)) {
            issues.push({
              rule: "required-completeness",
              collection: schema.key,
              recordId: fullPath,
              severity: "error",
              message: `"${field.label}" must be a list.`,
            });
            break;
          }
          fieldValue.forEach((item, index) => {
            if (field.itemFields) walk(field.itemFields, item, `${fullPath}[${index}]`);
          });
          break;
        }
        case "boolean":
          break;
      }
    }
  };
  walk(schema.fields, data, "record");
  return issues;
}

function isEmpty(value: JsonValue | undefined): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

function isExternalHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/.test(href);
}

export type LinkEntry = { label: string; href: string; external?: boolean };

export function validateLinks(
  entries: readonly LinkEntry[],
  surface: string,
  issues: ValidationIssue[],
): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (!entry.label.trim() || !entry.href.trim()) {
      issues.push({
        rule: "required-completeness",
        collection: "navigation",
        recordId: surface,
        severity: "error",
        message: `"${surface}" contains a link with an empty label or destination.`,
      });
      continue;
    }
    if (seen.has(entry.href)) {
      issues.push({
        rule: "duplicate-references",
        collection: "navigation",
        recordId: surface,
        severity: "error",
        message: `"${surface}" links to "${entry.href}" more than once.`,
      });
    }
    seen.add(entry.href);
    if (isExternalHref(entry.href)) continue;
    if (entry.href.startsWith("#")) {
      issues.push({
        rule: "broken-routes",
        collection: "navigation",
        recordId: surface,
        severity: "error",
        message: `"${surface}" uses a bare anchor "${entry.href}" — anchors must ride on a route.`,
      });
      continue;
    }
    const [path] = entry.href.split("#");
    if (!siteRoutes.includes(path)) {
      issues.push({
        rule: "broken-routes",
        collection: "navigation",
        recordId: surface,
        severity: "error",
        message: `"${surface}" links to unknown route "${path}".`,
      });
    }
    const anchorMatch = INTERNAL_ANCHOR.exec(entry.href);
    if (anchorMatch) {
      const allowed = routeAnchors[anchorMatch[1]];
      if (!allowed || !allowed.includes(anchorMatch[2])) {
        issues.push({
          rule: "broken-routes",
          collection: "navigation",
          recordId: surface,
          severity: "error",
          message: `"${surface}" links to anchor "#${anchorMatch[2]}" which does not exist on "${anchorMatch[1]}".`,
        });
      }
    }
  }
}

export function validateNavigationData(data: JsonValue): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!data || typeof data !== "object") {
    issues.push({
      rule: "required-completeness",
      collection: "navigation",
      severity: "error",
      message: "Navigation content is missing.",
    });
    return issues;
  }
  const nav = data as Record<string, JsonValue>;
  const navItems = (nav.navItems as { label: string; href: string }[] | undefined) ?? [];
  const mobileItems = (nav.mobileNavItems as { label: string; href: string }[] | undefined) ?? [];
  const seen = new Set<string>();
  for (const item of navItems) {
    if (typeof item !== "object" || item === null) continue;
    const entry = item as { label: string; href: string };
    if (seen.has(entry.href)) {
      issues.push({
        rule: "duplicate-references",
        collection: "navigation",
        recordId: entry.href,
        severity: "error",
        message: `Nav links to "${entry.href}" more than once.`,
      });
    }
    seen.add(entry.href);
    validateLinks([entry], "nav", issues);
    const columns = (item as { columns?: { heading: string; links: LinkEntry[] }[] }).columns;
    if (columns) {
      for (const column of columns) {
        if (!column.heading.trim()) {
          issues.push({
            rule: "required-completeness",
            collection: "navigation",
            recordId: entry.href,
            severity: "error",
            message: `Menu "${entry.label}" has a column without a heading.`,
          });
        }
        validateLinks(column.links ?? [], `${entry.label} column`, issues);
        for (const link of column.links ?? []) {
          if (link.href === entry.href) {
            issues.push({
              rule: "circular-references",
              collection: "navigation",
              recordId: entry.href,
              severity: "error",
              message: `Menu "${entry.label}" contains a column link that points back to the menu itself.`,
            });
          }
        }
      }
    }
  }
  validateLinks(mobileItems as LinkEntry[], "mobile-nav", issues);
  return issues;
}

export function validateFooterData(data: JsonValue): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!data || typeof data !== "object") {
    issues.push({
      rule: "required-completeness",
      collection: "navigation",
      severity: "error",
      message: "Footer content is missing.",
    });
    return issues;
  }
  const footer = data as Record<string, JsonValue>;
  if (!String(footer.descriptor ?? "").trim()) {
    issues.push({
      rule: "required-completeness",
      collection: "navigation",
      recordId: "footer.descriptor",
      severity: "error",
      message: "Footer descriptor is required.",
    });
  }
  if (!String(footer.copyright ?? "").trim()) {
    issues.push({
      rule: "required-completeness",
      collection: "navigation",
      recordId: "footer.copyright",
      severity: "error",
      message: "Footer copyright line is required.",
    });
  }
  const groups = (footer.groups as { heading: string; links: LinkEntry[] }[] | undefined) ?? [];
  if (groups.length === 0) {
    issues.push({
      rule: "required-completeness",
      collection: "navigation",
      recordId: "footer.groups",
      severity: "error",
      message: "Footer needs at least one link group.",
    });
  }
  groups.forEach((group, index) => {
    if (!group.heading.trim()) {
      issues.push({
        rule: "required-completeness",
        collection: "navigation",
        recordId: `footer.groups[${index}]`,
        severity: "error",
        message: "Footer group heading is required.",
      });
    }
    validateLinks(group.links ?? [], `footer group "${group.heading}"`, issues);
  });
  validateLinks((footer.legal as LinkEntry[] | undefined) ?? [], "footer.legal", issues);
  validateLinks((footer.ecosystem as LinkEntry[] | undefined) ?? [], "footer.ecosystem", issues);
  validateLinks((footer.socialLinks as LinkEntry[] | undefined) ?? [], "footer.social", issues);
  const contact = footer.contact as
    { heading?: string; address?: string; emails?: LinkEntry[] } | undefined;
  if (contact) {
    if (!contact.heading?.trim() || !contact.address?.trim()) {
      issues.push({
        rule: "required-completeness",
        collection: "navigation",
        recordId: "footer.contact",
        severity: "error",
        message: "Footer contact heading and address are required.",
      });
    }
    validateLinks(
      (contact.emails as LinkEntry[] | undefined) ?? [],
      "footer.contact.emails",
      issues,
    );
  }
  return issues;
}

export function validateDocumentGate(record: RecordWithData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const data = (record.data ?? {}) as Record<string, JsonValue>;
  if (record.status === "published") {
    const hasFile = record.filePresent === true || typeof data.fileId === "string";
    if (!hasFile && !String(data.href ?? "").trim()) {
      issues.push({
        rule: "unpublished-linked-content",
        collection: "documents",
        recordId: String(data.ref ?? ""),
        severity: "error",
        message: "A published document needs an uploaded file or an external href.",
      });
    }
    if (!String(data.ref ?? "").trim()) {
      issues.push({
        rule: "invalid-publication-references",
        collection: "documents",
        severity: "error",
        message: "A published document needs a registry reference.",
      });
    }
    if (!String(data.asOn ?? "").trim()) {
      issues.push({
        rule: "missing-reporting-period",
        collection: "documents",
        recordId: String(data.ref ?? ""),
        severity: "error",
        message: "A published document needs its reporting period (asOn).",
      });
    }
  }
  if (record.status === "external" && !String(data.href ?? "").trim()) {
    issues.push({
      rule: "unpublished-linked-content",
      collection: "documents",
      recordId: String(data.ref ?? ""),
      severity: "error",
      message: "An external document needs an href.",
    });
  }
  return issues;
}

export function validateMediaGate(record: RecordWithData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const data = (record.data ?? {}) as Record<string, JsonValue>;
  if (
    record.status === "published" &&
    record.filePresent !== true &&
    typeof data.fileId !== "string"
  ) {
    issues.push({
      rule: "unpublished-linked-content",
      collection: "media",
      recordId: String(data.name ?? ""),
      severity: "error",
      message: "A published media asset needs an uploaded file.",
    });
  }
  if (data.kind === "image" && !String(data.alt ?? "").trim()) {
    issues.push({
      rule: "required-completeness",
      collection: "media",
      recordId: String(data.name ?? ""),
      severity: "error",
      message: "Image alt text is required.",
    });
  }
  return issues;
}

function asText(data: JsonValue, key: string): string {
  return String((data as Record<string, JsonValue>)[key] ?? "");
}

function asOptionalText(data: JsonValue, key: string): string {
  const value = (data as Record<string, JsonValue>)[key];
  return typeof value === "string" && value.trim().length > 0 ? value : "";
}

function pushIssue(
  issues: ValidationIssue[],
  collection: string,
  rule: string,
  recordId: string,
  message: string,
  severity: "error" | "warning" = "error",
): void {
  issues.push({ rule, collection, recordId, severity, message });
}

function assertUniqueValue(
  lookup: Map<string, string>,
  value: string,
  selfId: string | undefined,
  collection: string,
  rule: string,
  recordId: string,
  what: string,
  issues: ValidationIssue[],
): void {
  if (!value.trim()) return;
  const owner = lookup.get(value);
  if (owner !== undefined && owner !== selfId) {
    pushIssue(
      issues,
      collection,
      rule,
      recordId,
      `"${what}" "${value}" is already used by record "${owner}".`,
    );
  }
}

/** Validate a route/anchor/external reference against the route registry. */
export function validateRouteReference(
  href: string,
  surface: string,
  collection: string,
  recordId: string,
  issues: ValidationIssue[],
): void {
  if (!href.trim()) {
    pushIssue(
      issues,
      collection,
      "required-completeness",
      recordId,
      `"${surface}" needs a destination.`,
    );
    return;
  }
  if (isExternalHref(href)) return;
  if (href.startsWith("#")) {
    pushIssue(
      issues,
      collection,
      "broken-routes",
      recordId,
      `"${surface}" uses a bare anchor "${href}" — anchors must ride on a route.`,
    );
    return;
  }
  const [path] = href.split("#");
  if (!siteRoutes.includes(path)) {
    pushIssue(
      issues,
      collection,
      "broken-routes",
      recordId,
      `"${surface}" links to unknown route "${path}".`,
    );
    return;
  }
  const anchorMatch = INTERNAL_ANCHOR.exec(href);
  if (anchorMatch) {
    const allowed = routeAnchors[anchorMatch[1]];
    if (!allowed || !allowed.includes(anchorMatch[2])) {
      pushIssue(
        issues,
        collection,
        "broken-routes",
        recordId,
        `"${surface}" links to anchor "#${anchorMatch[2]}" which does not exist on "${anchorMatch[1]}".`,
      );
    }
  }
}

function resolveMediaList(
  issues: ValidationIssue[],
  lookup: ReferenceLookup,
  collection: string,
  recordId: string,
  items: JsonValue,
  surface: string,
): void {
  if (!Array.isArray(items)) return;
  items.forEach((item, index) => {
    const mediaId = (item as Record<string, JsonValue> | null | undefined)?.mediaId;
    if (typeof mediaId !== "string" || !mediaId.trim()) {
      pushIssue(
        issues,
        collection,
        "required-completeness",
        recordId,
        `${surface}[${index}] needs a media id.`,
      );
      return;
    }
    if (!lookup.media.has(mediaId)) {
      pushIssue(
        issues,
        collection,
        "unpublished-linked-content",
        recordId,
        `${surface}[${index}] references media "${mediaId}" which is not a published asset.`,
      );
    }
  });
}

function resolveDocumentRefs(
  issues: ValidationIssue[],
  lookup: ReferenceLookup,
  collection: string,
  recordId: string,
  items: JsonValue,
  surface: string,
): void {
  if (!Array.isArray(items)) return;
  items.forEach((item, index) => {
    const ref = (item as Record<string, JsonValue> | null | undefined)?.ref;
    if (typeof ref !== "string" || !ref.trim()) {
      pushIssue(
        issues,
        collection,
        "required-completeness",
        recordId,
        `${surface}[${index}] needs a document reference.`,
      );
      return;
    }
    if (!lookup.documents.has(ref)) {
      pushIssue(
        issues,
        collection,
        "unpublished-linked-content",
        recordId,
        `${surface}[${index}] references document "${ref}" which is not a published document.`,
      );
    }
  });
}

function validateCoordinates(
  issues: ValidationIssue[],
  collection: string,
  recordId: string,
  data: Record<string, JsonValue>,
): void {
  const lat = Number(data.lat);
  const lon = Number(data.lon);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    pushIssue(
      issues,
      collection,
      "coordinates",
      recordId,
      `Latitude must be between -90 and 90 (got ${String(data.lat)}).`,
    );
  }
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
    pushIssue(
      issues,
      collection,
      "coordinates",
      recordId,
      `Longitude must be between -180 and 180 (got ${String(data.lon)}).`,
    );
  }
  for (const surface of ["homepageOffset", "portfolioOffset", "contactOffset"]) {
    const offset = data[surface];
    if (!offset || typeof offset !== "object" || Array.isArray(offset)) continue;
    const x = Number((offset as Record<string, JsonValue>).x);
    const y = Number((offset as Record<string, JsonValue>).y);
    if (x < 0 || x > MAP_VIEWBOX.width || y < 0 || y > MAP_VIEWBOX.height) {
      pushIssue(
        issues,
        collection,
        "coordinates",
        recordId,
        `${surface} is outside the map viewbox (x=${x}, y=${y}).`,
      );
    }
  }
}

export function validateMetricsData(
  record: RecordWithData,
  lookup: ReferenceLookup,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const data = (record.data ?? {}) as Record<string, JsonValue>;
  const key = asText(data, "key");
  assertUniqueValue(
    lookup.metrics,
    key,
    record.id,
    "metrics",
    "duplicate-references",
    key,
    "metric key",
    issues,
  );
  const usages = data.usages as { target?: string; label?: string }[] | undefined;
  usages?.forEach((usage, index) => {
    if (!usage.label?.trim() || !usage.target?.trim()) {
      pushIssue(
        issues,
        "metrics",
        "required-completeness",
        key,
        `Metric usage ${index} needs both a target and a label.`,
      );
      return;
    }
    validateRouteReference(
      usage.target,
      `usage "${usage.label}" of metric "${key}"`,
      "metrics",
      key,
      issues,
    );
  });
  return issues;
}

export function validateLocationsData(
  record: RecordWithData,
  lookup: ReferenceLookup,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const data = (record.data ?? {}) as Record<string, JsonValue>;
  const recordId = record.id ?? "locations";
  validateCoordinates(issues, "locations", recordId, data);
  if (record.status === "published") {
    const visible = data.visible as Record<string, JsonValue> | undefined;
    const anyVisible =
      visible !== undefined &&
      visible !== null &&
      Object.values(visible).some((value) => Boolean(value));
    if (!anyVisible) {
      pushIssue(
        issues,
        "locations",
        "unpublished-linked-content",
        recordId,
        "A published location must be visible on at least one surface (homepage / portfolio / contact).",
      );
    }
  }
  resolveMediaList(issues, lookup, "locations", recordId, data.media, "media");
  resolveDocumentRefs(issues, lookup, "locations", recordId, data.documents, "documents");
  return issues;
}

export function validatePortfolioAssetsData(
  record: RecordWithData,
  lookup: ReferenceLookup,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const data = (record.data ?? {}) as Record<string, JsonValue>;
  const recordId = record.id ?? "portfolio-assets";
  const plate = asText(data, "plate");
  assertUniqueValue(
    lookup.plates,
    plate,
    record.id,
    "portfolio-assets",
    "duplicate-references",
    recordId,
    "plate",
    issues,
  );
  const locationId = asOptionalText(data, "locationId");
  if (locationId) {
    const location = lookup.locations.get(locationId);
    if (!location) {
      pushIssue(
        issues,
        "portfolio-assets",
        "references",
        recordId,
        `Asset references location "${locationId}" which is not a published location.`,
      );
    } else {
      const assetZone = asText(data, "zone");
      const locationZone = asText(location.data, "zone");
      if (assetZone && locationZone && assetZone !== locationZone) {
        pushIssue(
          issues,
          "portfolio-assets",
          "references",
          recordId,
          `Asset zone "${assetZone}" conflicts with location "${locationId}" zone "${locationZone}".`,
          "warning",
        );
      }
    }
  }
  const imageMedia = asOptionalText(data, "imageMedia");
  if (imageMedia) {
    const media = lookup.media.get(imageMedia);
    if (!media) {
      pushIssue(
        issues,
        "portfolio-assets",
        "unpublished-linked-content",
        recordId,
        `Asset image "${imageMedia}" is not a published media asset.`,
      );
    } else if (asText(media.data, "kind") !== "image") {
      pushIssue(
        issues,
        "portfolio-assets",
        "unpublished-linked-content",
        recordId,
        `Asset image "${imageMedia}" is media of kind "${asText(media.data, "kind")}" — expected an image.`,
        "warning",
      );
    }
  }
  const route = data.route as { href?: string } | undefined;
  if (route?.href)
    validateRouteReference(
      route.href,
      `asset "${recordId}" route`,
      "portfolio-assets",
      recordId,
      issues,
    );
  return issues;
}

export function validateBusinessVerticalsData(
  record: RecordWithData,
  lookup: ReferenceLookup,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const data = (record.data ?? {}) as Record<string, JsonValue>;
  const recordId = record.id ?? "business-verticals";
  const index = asText(data, "index");
  assertUniqueValue(
    lookup.verticalIndexes,
    index,
    record.id,
    "business-verticals",
    "duplicate-references",
    recordId,
    "vertical index",
    issues,
  );
  const metrics = data.metrics as { metricKey?: string }[] | undefined;
  metrics?.forEach((item, i) => {
    if (!item.metricKey?.trim()) {
      pushIssue(
        issues,
        "business-verticals",
        "required-completeness",
        recordId,
        `Metric reference ${i} needs a metric key.`,
      );
      return;
    }
    if (!lookup.publishedMetricKeys.has(item.metricKey)) {
      pushIssue(
        issues,
        "business-verticals",
        "unpublished-linked-content",
        recordId,
        `Vertical references metric "${item.metricKey}" which is not a published metric.`,
      );
    }
  });
  const imageMedia = asOptionalText(data, "imageMedia");
  if (imageMedia && !lookup.media.has(imageMedia)) {
    pushIssue(
      issues,
      "business-verticals",
      "unpublished-linked-content",
      recordId,
      `Vertical image "${imageMedia}" is not a published media asset.`,
    );
  }
  const route = data.route as { href?: string } | undefined;
  if (route?.href)
    validateRouteReference(
      route.href,
      `vertical "${recordId}" route`,
      "business-verticals",
      recordId,
      issues,
    );
  return issues;
}

export function validateEsgInitiativesData(
  record: RecordWithData,
  lookup: ReferenceLookup,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const data = (record.data ?? {}) as Record<string, JsonValue>;
  const recordId = record.id ?? "esg-initiatives";
  const code = asText(data, "code");
  assertUniqueValue(
    lookup.initiativeCodes,
    code,
    record.id,
    "esg-initiatives",
    "duplicate-references",
    recordId,
    "initiative code",
    issues,
  );
  const locationId = asOptionalText(data, "locationId");
  if (locationId && !lookup.locations.has(locationId)) {
    pushIssue(
      issues,
      "esg-initiatives",
      "references",
      recordId,
      `Initiative references location "${locationId}" which is not a published location.`,
    );
  }
  validateCoordinates(issues, "esg-initiatives", recordId, data);
  resolveMediaList(issues, lookup, "esg-initiatives", recordId, data.media, "media");
  resolveDocumentRefs(issues, lookup, "esg-initiatives", recordId, data.documents, "documents");
  return issues;
}

export function validateGovernanceRecordsData(
  record: RecordWithData,
  lookup: ReferenceLookup,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const data = (record.data ?? {}) as Record<string, JsonValue>;
  const recordId = record.id ?? "governance-records";
  const documentRef = asOptionalText(data, "documentRef");
  if (documentRef && !lookup.documents.has(documentRef)) {
    pushIssue(
      issues,
      "governance-records",
      "unpublished-linked-content",
      recordId,
      `Governance record references document "${documentRef}" which is not a published document.`,
    );
  }
  const photoMedia = asOptionalText(data, "photoMedia");
  if (photoMedia && !lookup.media.has(photoMedia)) {
    pushIssue(
      issues,
      "governance-records",
      "unpublished-linked-content",
      recordId,
      `Governance record photo "${photoMedia}" is not a published media asset.`,
    );
  }
  return issues;
}

export function validateContactDirectoryData(
  record: RecordWithData,
  lookup: ReferenceLookup,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const data = (record.data ?? {}) as Record<string, JsonValue>;
  const recordId = record.id ?? "contact-directory";
  const key = asText(data, "key");
  assertUniqueValue(
    lookup.directoryKeys,
    key,
    record.id,
    "contact-directory",
    "duplicate-references",
    recordId,
    "directory key",
    issues,
  );
  const email = data.email as { href?: string } | undefined;
  if (email?.href && !/^mailto:/.test(email.href)) {
    pushIssue(
      issues,
      "contact-directory",
      "required-completeness",
      recordId,
      "Directory email href must be a mailto: link.",
    );
  }
  const locationId = asOptionalText(data, "locationId");
  if (locationId && !lookup.locations.has(locationId)) {
    pushIssue(
      issues,
      "contact-directory",
      "references",
      recordId,
      `Directory entry references location "${locationId}" which is not a published location.`,
    );
  }
  return issues;
}

export function validateForEditor(
  schema: CollectionEditorSchema,
  record: RecordWithData,
  lookup: ReferenceLookup,
): ValidationIssue[] {
  const issues = validateFields(schema, record.data);
  if (schema.key === "navigation") issues.push(...validateNavigationData(record.data));
  if (schema.key === "footer") issues.push(...validateFooterData(record.data));
  if (schema.key === "documents") issues.push(...validateDocumentGate(record));
  if (schema.key === "media") issues.push(...validateMediaGate(record));
  if (schema.key === "metrics") issues.push(...validateMetricsData(record, lookup));
  if (schema.key === "locations") issues.push(...validateLocationsData(record, lookup));
  if (schema.key === "portfolio-assets")
    issues.push(...validatePortfolioAssetsData(record, lookup));
  if (schema.key === "business-verticals")
    issues.push(...validateBusinessVerticalsData(record, lookup));
  if (schema.key === "esg-initiatives") issues.push(...validateEsgInitiativesData(record, lookup));
  if (schema.key === "governance-records")
    issues.push(...validateGovernanceRecordsData(record, lookup));
  if (schema.key === "contact-directory")
    issues.push(...validateContactDirectoryData(record, lookup));
  return issues;
}
