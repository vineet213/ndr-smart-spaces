/**
 * Reference lookup — the cross-collection resolution layer for Phase 1.2.
 *
 * Shared data collections reference each other: assets link to locations,
 * initiatives link to locations, verticals link to metrics, offices link to
 * locations, and locations/initiatives link to media and documents. The engine
 * builds one snapshot per mutation and passes it to the validators so every
 * reference is resolved against the same published set (nothing points at a
 * draft, an archived record, or an id that does not exist).
 */

import { ContentStore, StoredRecord } from "./contentStore";
import { JsonValue } from "../types";

export type ReferenceLookup = {
  /** Published/external locations by record id. */
  locations: Map<string, StoredRecord>;
  /** Published/external media by record id. */
  media: Map<string, StoredRecord>;
  /** Published/external documents by registry reference. */
  documents: Map<string, StoredRecord>;
  /** Metric keys across all metrics records, mapped to their record id. */
  metrics: Map<string, string>;
  /** Keys of published/external metrics — the only resolvable references. */
  publishedMetricKeys: Set<string>;
  /** Asset plates across all portfolio-assets records, mapped to record id. */
  plates: Map<string, string>;
  /** Vertical indexes across all business-verticals records, mapped to id. */
  verticalIndexes: Map<string, string>;
  /** Initiative codes across all esg-initiatives records, mapped to id. */
  initiativeCodes: Map<string, string>;
  /** Directory keys across all contact-directory records, mapped to id. */
  directoryKeys: Map<string, string>;
};

function asText(data: JsonValue, key: string): string {
  return String((data as Record<string, JsonValue>)[key] ?? "");
}

function isPublic(record: StoredRecord): boolean {
  return record.status === "published" || record.status === "external";
}

function indexValue(map: Map<string, string>, records: StoredRecord[], field: string): void {
  for (const record of records) {
    const value = asText(record.data, field);
    if (value) map.set(value, record.id);
  }
}

/**
 * Build the reference snapshot from the content store. Uniqueness maps index
 * every record regardless of status (plates and keys are never reused); the
 * resolution maps only publish/external records, so a reference to anything
 * else fails validation as unpublished-linked-content.
 */
export async function buildReferenceLookup(content: ContentStore): Promise<ReferenceLookup> {
  const [
    locations,
    media,
    documents,
    metrics,
    portfolioAssets,
    businessVerticals,
    esgInitiatives,
    contactDirectory,
  ] = await Promise.all([
    content.list("locations"),
    content.list("media"),
    content.list("documents"),
    content.list("metrics"),
    content.list("portfolio-assets"),
    content.list("business-verticals"),
    content.list("esg-initiatives"),
    content.list("contact-directory"),
  ]);

  const locationsMap = new Map<string, StoredRecord>();
  for (const record of locations) if (isPublic(record)) locationsMap.set(record.id, record);

  const mediaMap = new Map<string, StoredRecord>();
  for (const record of media) if (isPublic(record)) mediaMap.set(record.id, record);

  const documentsMap = new Map<string, StoredRecord>();
  for (const record of documents) {
    if (!isPublic(record)) continue;
    const ref = asText(record.data, "ref");
    if (ref) documentsMap.set(ref, record);
  }

  const metricsMap = new Map<string, string>();
  const publishedMetricKeys = new Set<string>();
  for (const record of metrics) {
    const key = asText(record.data, "key");
    if (!key) continue;
    metricsMap.set(key, record.id);
    if (isPublic(record)) publishedMetricKeys.add(key);
  }
  const platesMap = new Map<string, string>();
  indexValue(platesMap, portfolioAssets, "plate");
  const verticalIndexes = new Map<string, string>();
  indexValue(verticalIndexes, businessVerticals, "index");
  const initiativeCodes = new Map<string, string>();
  indexValue(initiativeCodes, esgInitiatives, "code");
  const directoryKeys = new Map<string, string>();
  indexValue(directoryKeys, contactDirectory, "key");

  return {
    locations: locationsMap,
    media: mediaMap,
    documents: documentsMap,
    metrics: metricsMap,
    publishedMetricKeys,
    plates: platesMap,
    verticalIndexes,
    initiativeCodes,
    directoryKeys,
  };
}
