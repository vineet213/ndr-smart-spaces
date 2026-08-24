/**
 * Land bank import — Annexure A parcels into the CMS as DRAFTS.
 *
 * Reads the user-provided extraction (`ndr-land-bank-extracted.json`) and the
 * research manifest (`scripts/land-bank-enrichment.json`), then flows every
 * parcel through CollectionEditor.save — validation, ordering, hash-chained
 * audit — WITHOUT publishing. The public site keeps rendering an empty land
 * bank until each draft clears review in the admin (SAVE → Publish All).
 *
 * Fields policy:
 *   - `name`, `district` (from `location`) and `extentAcres` come verbatim from
 *     the extraction; nothing is invented.
 *   - `state`/lat/lon are researched additions recorded in the manifest and
 *     disclosed inside each record's `note`.
 *   - `classification`/`status` stay unset — the annexure does not state them.
 *
 * Idempotent: parcel ids that already exist in the store are skipped.
 *
 *   npx tsx scripts/import-land-bank.ts   (or via tsconfig.cms build)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  AuditLog,
  CollectionEditor,
  ContentStore,
  FileStore,
  JsonFileStore,
  ReferenceRegistry,
  RegistryConfig,
  generateMerged,
  verifyGeneratedExports,
  writeGenerated,
} from "../src/lib/cms";

const ROOT = process.cwd();
const STORE_FILE = join(ROOT, ".cms-store", "content.json");
const FILES_DIR = join(ROOT, ".cms-store", "files");
const GENERATED_DIR = join(ROOT, "src", "lib", "data", "generated");

const EXTRACT_FILE = join(ROOT, "ndr-land-bank-extracted.json");
const MANIFEST_FILE = join(ROOT, "scripts", "land-bank-enrichment.json");
const IMPORT_USER = "cms-import@ndr.com";

/** Same registry configuration as `cms-seed.ts` — the store's counters win. */
const REGISTRY_DEFAULTS: RegistryConfig = {
  ref: { prefix: "PR-", width: 3, start: 4 },
  plate: { prefix: "", width: 2, start: 1 },
  fig: { prefix: "FIG-", width: 3, start: 1 },
  doc: { prefix: "DOC-", width: 3, start: 1 },
  register: { prefix: "REG-", width: 3, start: 1 },
  volume: { prefix: "", width: 1, start: 1 },
  fy: { label: "FY26" },
};

const SOURCE_LABELS: Record<string, string> = {
  city: "OpenStreetMap/Wikipedia city coordinates",
  "village-census": "Census of India village directory",
  wiki: "Wikipedia article coordinates",
  "lei-registry": "GLEIF LEI registry address record",
  sricity: "Sri City industrial park location",
};

type ExtractRecord = {
  sr_no: number;
  name: string;
  location: string;
  area_acres: number | null;
  remarks: string;
};

type ManifestRecord = {
  sr_no: number;
  state: string;
  lat?: number;
  lon?: number;
  sourceRef: keyof typeof SOURCE_LABELS;
  note?: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main(): Promise<void> {
  const extract = JSON.parse(readFileSync(EXTRACT_FILE, "utf8")) as {
    records: ExtractRecord[];
  };
  const manifest = JSON.parse(readFileSync(MANIFEST_FILE, "utf8")) as {
    records: ManifestRecord[];
  };

  const store = new JsonFileStore(STORE_FILE);
  const files = new FileStore(FILES_DIR);
  const registry = new ReferenceRegistry(store, REGISTRY_DEFAULTS);
  const audit = new AuditLog(store);
  const editor = new CollectionEditor(store, files, registry, audit);
  const content = new ContentStore(store);

  const existing = new Set((await content.list("land-bank")).map((record) => record.id));
  const usedIds = new Set(existing);

  let imported = 0;
  let skipped = 0;
  let acreSum = 0;

  for (const record of extract.records) {
    const enrichment = manifest.records.find((entry) => entry.sr_no === record.sr_no);
    if (!enrichment) {
      throw new Error(`No enrichment manifest entry for sr_no ${record.sr_no} (${record.name}).`);
    }

    const base = slugify(`${record.name}-${record.location}`);
    let id = base;
    for (let suffix = 2; usedIds.has(id); suffix += 1) id = `${base}-${suffix}`;
    if (existing.has(id)) {
      skipped += 1;
      continue;
    }
    usedIds.add(id);

    const sourceLabel =
      SOURCE_LABELS[enrichment.sourceRef] ?? String(enrichment.sourceRef ?? "researched source");
    const provenanceParts = [
      `State & pin coordinates are researched additions (${sourceLabel}), not part of the deed statement.`,
    ];
    if (enrichment.note) provenanceParts.push(enrichment.note);
    if (record.remarks) provenanceParts.push(record.remarks);

    const result = await editor.save({
      collectionKey: "land-bank",
      id,
      status: "draft",
      user: IMPORT_USER,
      role: "super-admin",
      data: {
        name: record.name,
        state: enrichment.state,
        district: record.location,
        ...(typeof record.area_acres === "number"
          ? { extentAcres: record.area_acres }
          : {}),
        ...(Number.isFinite(enrichment.lat) && Number.isFinite(enrichment.lon)
          ? { lat: enrichment.lat, lon: enrichment.lon }
          : {}),
        note: provenanceParts.join(" "),
      },
    });

    imported += 1;
    if (typeof record.area_acres === "number") acreSum += record.area_acres;
    console.log(
      `  + ${id.padEnd(46)} ${String(record.area_acres ?? "—").padStart(7)} acres${
        result.issuedRef ? ` [${result.issuedRef}]` : ""
      }`,
    );
  }

  const generated = await generateMerged(content);
  writeGenerated(GENERATED_DIR, generated);
  const generatedCheck = await verifyGeneratedExports(content, GENERATED_DIR);
  const chain = await audit.verify();

  console.log(`imported ${imported} parcels as drafts (${skipped} already present)`);
  console.log(`extract total acres: ${acreSum.toFixed(2)} (annexure aggregate: 471.81)`);
  console.log(`generated exports byte-identical: ${generatedCheck.valid}`);
  console.log(`audit chain valid: ${chain.valid}`);

  if (!generatedCheck.valid || !chain.valid) process.exit(1);
  console.log("IMPORT OK — drafts await review in the admin; nothing was published.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
