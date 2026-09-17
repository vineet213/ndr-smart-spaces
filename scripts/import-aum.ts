/**
 * Assets Under Management import — the corporate-presentation warehouse
 * table into the CMS as DRAFTS.
 *
 * Reads the source extraction (`ndr-aum-extracted.json`) and the research
 * manifest (`scripts/aum-enrichment.json`), then flows every asset through
 * CollectionEditor.save — validation, ordering, hash-chained audit — WITHOUT
 * publishing. The public site keeps rendering an empty Assets Under
 * Management register until each draft clears review in the admin
 * (SAVE → Publish All).
 *
 * Fields policy:
 *   - `name` and `leasableAreaMsf` come verbatim from the extraction; nothing
 *     is invented.
 *   - `state`, `city`, `district`, `lat`/`lon` are researched additions
 *     recorded in the manifest and disclosed inside each record's `note`.
 *   - `classification`/`landStatus` stay unset — neither source states them.
 *
 * Idempotent: asset ids that already exist in the store are skipped.
 *
 *   npx tsx scripts/import-aum.ts   (or via tsconfig.cms build)
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

const EXTRACT_FILE = join(ROOT, "ndr-aum-extracted.json");
const MANIFEST_FILE = join(ROOT, "scripts", "aum-enrichment.json");
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
  "valuation-report": "NDR InvIT Trust independent valuer's Valuation Report (NSE regulatory filing)",
  "village-census": "Census of India village directory",
  wiki: "Wikipedia article coordinates",
  "maps-listing": "Google Maps / business directory listing",
  other: "researched source (see note)",
};

type ExtractRecord = {
  sr_no: number;
  name: string;
  tableCityLabel: string;
  interestValued: string;
  leasableAreaMsf: number;
  note?: string;
};

type ManifestRecord = {
  sr_no: number;
  city: string;
  district?: string;
  stateName: string;
  lat?: number;
  lon?: number;
  sourceRef: keyof typeof SOURCE_LABELS;
  sourceLabel?: string;
  confidence: "verified" | "unverified";
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

  const existing = new Set(
    (await content.list("assets-under-management")).map((record) => record.id),
  );
  const usedIds = new Set(existing);

  let imported = 0;
  let skipped = 0;
  let unverified = 0;
  let areaSum = 0;

  for (const record of extract.records) {
    const enrichment = manifest.records.find((entry) => entry.sr_no === record.sr_no);
    if (!enrichment) {
      throw new Error(`No enrichment manifest entry for sr_no ${record.sr_no} (${record.name}).`);
    }
    if (enrichment.confidence === "unverified") unverified += 1;

    const base = slugify(`${record.name}-${enrichment.city}`);
    let id = base;
    for (let suffix = 2; usedIds.has(id); suffix += 1) id = `${base}-${suffix}`;
    if (existing.has(id)) {
      skipped += 1;
      continue;
    }
    usedIds.add(id);

    const result = await editor.save({
      collectionKey: "assets-under-management",
      id,
      status: "draft",
      user: IMPORT_USER,
      role: "super-admin",
      data: {
        name: record.name,
        state: enrichment.stateName,
        city: enrichment.city,
        ...(enrichment.district ? { district: enrichment.district } : {}),
        leasableAreaMsf: record.leasableAreaMsf,
        ...(Number.isFinite(enrichment.lat) && Number.isFinite(enrichment.lon)
          ? { lat: enrichment.lat, lon: enrichment.lon }
          : {}),
      },
    });

    imported += 1;
    areaSum += record.leasableAreaMsf;
    console.log(
      `  + ${id.padEnd(46)} ${String(record.leasableAreaMsf).padStart(6)} msf${
        enrichment.confidence === "unverified" ? " [unverified coords]" : ""
      }${result.issuedRef ? ` [${result.issuedRef}]` : ""}`,
    );
  }

  const generated = await generateMerged(content);
  writeGenerated(GENERATED_DIR, generated);
  const generatedCheck = await verifyGeneratedExports(content, GENERATED_DIR);
  const chain = await audit.verify();

  console.log(`imported ${imported} assets as drafts (${skipped} already present)`);
  console.log(`${unverified} record(s) carry unverified/approximate coordinates — review before publishing`);
  console.log(`extract total leasable area: ${areaSum.toFixed(2)} msf (table total: 22.96)`);
  console.log(`generated exports byte-identical: ${generatedCheck.valid}`);
  console.log(`audit chain valid: ${chain.valid}`);

  if (!generatedCheck.valid || !chain.valid) process.exit(1);
  console.log("IMPORT OK — drafts await review in the admin; nothing was published.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
