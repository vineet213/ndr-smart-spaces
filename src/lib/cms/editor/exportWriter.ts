/**
 * Export writer — deterministic generation of the managed content modules.
 *
 * Phase 1.1 collections are emitted into `src/lib/data/generated/` as typed
 * `as const` modules (blueprint §16.2). Hand-written modules stay frozen; the
 * generated modules are deterministic (same content → same bytes) and the
 * verifier confirms byte identity against the last generated state.
 *
 * Since Phase 2B every register module is emitted in full — each row carries
 * its system `id` and `status` alongside the editable payload, so the frontend
 * renders the complete ledger state (pending rows included) exactly as the
 * frozen handwritten modules did.
 */

import { ContentStore } from "./contentStore";
import { serializeAsConst, JsonLike } from "../export";
import { JsonValue } from "../types";

export type GeneratedFile = {
  fileName: string;
  source: string;
};

const SETTINGS_KEYS = ["corporate-settings", "publication-settings", "brand-settings"] as const;
const SETTINGS_FILES: Record<string, string> = {
  "corporate-settings": "corporateSettings.ts",
  "publication-settings": "publicationSettings.ts",
  "brand-settings": "brandSettings.ts",
};
const SETTINGS_EXPORTS: Record<string, string> = {
  "corporate-settings": "corporateSettings",
  "publication-settings": "publicationSettings",
  "brand-settings": "brandSettings",
};

async function recordFile(
  content: ContentStore,
  key: string,
  fileName: string,
  exportName: string,
): Promise<GeneratedFile | null> {
  const record = await content.getSingle(key);
  if (!record) return null;
  return { fileName, source: serializeAsConst(exportName, record.data as JsonLike) };
}

async function registerFile(
  content: ContentStore,
  key: string,
  fileName: string,
  exportName: string,
): Promise<GeneratedFile | null> {
  const records = await content.list(key);
  const rows = records.map((record) => ({
    id: record.id,
    status: record.status,
    ...(record.data as object),
  }));
  if (rows.length === 0) return null;
  return { fileName, source: serializeAsConst(exportName, rows as unknown as JsonLike) };
}

/**
 * Generate the full managed module set. Each entry is a deterministic,
 * prettier-shaped `as const` module. Same content always yields same bytes.
 */
export async function generateMerged(content: ContentStore): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];
  for (const key of SETTINGS_KEYS) {
    const file = await recordFile(content, key, SETTINGS_FILES[key], SETTINGS_EXPORTS[key]);
    if (file) files.push(file);
  }
  const navigation = await recordFile(content, "navigation", "navigation.ts", "navigation");
  if (navigation) files.push(navigation);
  const footer = await recordFile(content, "footer", "footer.ts", "footer");
  if (footer) files.push(footer);
  const documents = await registerFile(content, "documents", "documents.ts", "documents");
  if (documents) files.push(documents);
  const media = await registerFile(content, "media", "media.ts", "media");
  if (media) files.push(media);
  const metrics = await registerFile(content, "metrics", "metrics.ts", "metrics");
  if (metrics) files.push(metrics);
  const locations = await registerFile(content, "locations", "locations.ts", "locations");
  if (locations) files.push(locations);
  const portfolioAssets = await registerFile(
    content,
    "portfolio-assets",
    "portfolioAssets.ts",
    "portfolioAssets",
  );
  if (portfolioAssets) files.push(portfolioAssets);
  const businessVerticals = await registerFile(
    content,
    "business-verticals",
    "businessVerticals.ts",
    "businessVerticals",
  );
  if (businessVerticals) files.push(businessVerticals);
  const esgInitiatives = await registerFile(
    content,
    "esg-initiatives",
    "esgInitiatives.ts",
    "esgInitiatives",
  );
  if (esgInitiatives) files.push(esgInitiatives);
  const governanceRecords = await registerFile(
    content,
    "governance-records",
    "governanceRecords.ts",
    "governanceRecords",
  );
  if (governanceRecords) files.push(governanceRecords);
  const contactDirectory = await registerFile(
    content,
    "contact-directory",
    "contactDirectory.ts",
    "contactDirectory",
  );
  if (contactDirectory) files.push(contactDirectory);
  return files.sort((a, b) => (a.fileName < b.fileName ? -1 : a.fileName > b.fileName ? 1 : 0));
}

/** Write the generated module set to disk. */
export function writeGenerated(dir: string, files: readonly GeneratedFile[]): void {
  const { mkdirSync, writeFileSync } = require("node:fs");
  const { join } = require("node:path");
  mkdirSync(dir, { recursive: true });
  for (const file of files) {
    writeFileSync(join(dir, file.fileName), file.source, "utf8");
  }
}

export type GeneratedModuleStatus = {
  fileName: string;
  exists: boolean;
  byteIdentical: boolean;
  deterministic: boolean;
};

/**
 * Verify the generated module set. Regenerates everything from the store and
 * compares byte-for-byte against what is on disk, and asserts the generator is
 * deterministic (two passes emit identical bytes). Used by the editor save flow
 * and by `npm run verify:cms`.
 */
export async function verifyGeneratedExports(
  content: ContentStore,
  dir: string,
): Promise<{ statuses: GeneratedModuleStatus[]; valid: boolean }> {
  const { existsSync, readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const expected = await generateMerged(content);
  const statuses: GeneratedModuleStatus[] = expected.map((file) => {
    const path = join(dir, file.fileName);
    const onDisk = existsSync(path) ? readFileSync(path, "utf8") : null;
    return {
      fileName: file.fileName,
      exists: onDisk !== null,
      byteIdentical: onDisk === file.source,
      deterministic: false,
    };
  });
  const secondPass = await generateMerged(content);
  const deterministic =
    expected.length === secondPass.length &&
    expected.every((file, index) => file.source === secondPass[index].source);
  return {
    statuses: statuses.map((status) => ({ ...status, deterministic })),
    valid: statuses.every((status) => status.byteIdentical) && deterministic,
  };
}
