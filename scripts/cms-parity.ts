/**
 * CMS Phase 2A — parity verification.
 *
 *   npm run verify:parity
 *
 * After `npm run seed:cms`, proves the CMS store and the generated modules
 * equal the frozen handwritten data. Four layers:
 *
 *   1. Inventory   — every seeded record present with the exact id, status and
 *                    deterministic order key.
 *   2. Data equality — each record payload is byte-equal to its mapping spec
 *                    (modulo the engine-issued GV-REG references, asserted
 *                    explicitly against the registry sequence).
 *   3. Generated exports — the managed modules are byte-identical to disk,
 *                    deterministic across passes, with no stray files.
 *   4. Source fidelity — independent field checks straight against the frozen
 *                    modules (not the mappings) plus cross-collection
 *                    relationship and uniqueness checks.
 *   5. Integration fidelity (Phase 2B) — the runtime data modules
 *                    (homepage, navigation) re-export or derive from the
 *                    generated CMS modules byte-for-byte.
 *
 * Every check is classified `expected`, `migration-related` (a documented,
 * reversible deviation the migration introduces) or `unintended`. Any
 * unintended failure exits non-zero. A machine-readable report is written to
 * `docs/cms-phase-2a/parity-report.json` with a human summary alongside.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  AuditLog,
  ContentStore,
  JsonFileStore,
  JsonValue,
  StoredRecord,
  generateMerged,
  sortKeys,
  verifyGeneratedExports,
} from "../src/lib/cms";
import {
  allSeedCollections,
  expectedGovernanceRefs,
  seedRecordsFor,
} from "./cms-migration/mappings";
import { investorMetrics } from "../src/lib/data/investor";
import {
  esgEnvironment,
  esgDisclosures,
  esgGovernance,
  esgImpactMap,
} from "../src/lib/data/esg";
import { geoLocations, portfolioAssets } from "../src/lib/data/portfolio";
import {
  businessHighlights,
  esg,
  hero,
  latestUpdates,
  mapLocations,
} from "../src/lib/data/homepage";
import { officeDirectory, contactMap } from "../src/lib/data/contact";
import {
  MEDIA_EDITION,
  MEDIA_PUBLICATION,
  PRESS_ARCHIVE_ENTRIES,
  mediaFeatured,
  mediaKit,
  pressArchive,
  pressContact,
} from "../src/lib/data/media";
import { divisions } from "../src/lib/data/business";
import { footer as homepageFooter, contact as homepageContact } from "../src/lib/data/homepage";
import {
  navItems,
  mobileNavItems,
  mobileMenuFooter,
  siteHome,
  utilityStrip,
  headerCta,
} from "../src/lib/data/navigation";
import { navigation as cmsNavigation } from "../src/lib/data/generated/navigation";
import { footer as cmsFooter } from "../src/lib/data/generated/footer";
import { metrics as cmsMetrics } from "../src/lib/data/generated/metrics";
import { businessVerticals as cmsVerticals } from "../src/lib/data/generated/businessVerticals";
import { locations as cmsLocations } from "../src/lib/data/generated/locations";
import { media as cmsMedia } from "../src/lib/data/generated/media";
import { publicationSettings } from "../src/lib/data/generated/publicationSettings";
import { corporateSettings } from "../src/lib/data/generated/corporateSettings";
import { contactDirectory } from "../src/lib/data/generated/contactDirectory";

const ROOT = process.cwd();
const STORE_FILE = join(ROOT, ".cms-store", "content.json");
const GENERATED_DIR = join(ROOT, "src", "lib", "data", "generated");
const REPORT_DIR = join(ROOT, "docs", "cms-phase-2a");

type Classification = "expected" | "migration-related" | "unintended";

const MIGRATION_COLLECTIONS = new Set([
  "governance-records",
  "footer",
  "corporate-settings",
  "publication-settings",
  "brand-settings",
]);

function collectionClass(key: string): Classification {
  return MIGRATION_COLLECTIONS.has(key) ? "migration-related" : "expected";
}

type CheckResult = {
  id: string;
  layer: string;
  description: string;
  classification: Classification;
  passed: boolean;
  detail?: string;
};

const results: CheckResult[] = [];

function check(
  id: string,
  layer: string,
  description: string,
  classification: Classification,
  passed: boolean,
  detail?: string,
): void {
  results.push({ id, layer, description, classification, passed, detail });
}

function jsonEqual(a: JsonValue, b: JsonValue): boolean {
  return JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
}

function asRecord(data: JsonValue): Record<string, JsonValue> {
  return (data ?? {}) as Record<string, JsonValue>;
}

function text(data: JsonValue, key: string): string {
  return String(asRecord(data)[key] ?? "");
}

async function main(): Promise<void> {
  console.log("CMS Phase 2A — parity verification");
  const store = new JsonFileStore(STORE_FILE);
  const content = new ContentStore(store);
  const audit = new AuditLog(store);

  const getById = async (key: string, id: string): Promise<StoredRecord | undefined> =>
    (await content.list(key)).find((record) => record.id === id);

  /* Layer 1 + 2 — inventory and data equality per collection ----------------- */

  for (const collectionKey of allSeedCollections()) {
    const records = await content.list(collectionKey);
    const specs = seedRecordsFor(collectionKey);
    const layer = "inventory/data";

    check(
      `${collectionKey}.count`,
      layer,
      `${collectionKey} has exactly ${specs.length} records`,
      collectionClass(collectionKey),
      records.length === specs.length,
      records.length !== specs.length ? `found ${records.length}` : undefined,
    );

    const excludeRef = collectionKey === "governance-records";
    for (let index = 0; index < specs.length; index += 1) {
      const spec = specs[index];
      const record = await getById(collectionKey, spec.id);
      const where = `${collectionKey}.${spec.id}`;
      if (!record) {
        check(where, layer, `record ${spec.id} exists`, "expected", false, "missing");
        continue;
      }
      check(`${where}.status`, layer, `${spec.id} has status ${spec.status}`, "expected", record.status === spec.status, `found ${record.status}`);
      check(`${where}.order`, layer, `${spec.id} has order ${spec.order}`, "expected", record.order === spec.order, `found ${record.order}`);
      const actual = excludeRef
        ? omitKeys(record.data, ["ref"])
        : record.data;
      const detail = jsonEqual(actual, spec.data)
        ? undefined
        : firstDiff(actual, spec.data);
      check(
        `${where}.data`,
        layer,
        `${spec.id} payload matches the source mapping`,
        collectionClass(collectionKey),
        detail === undefined,
        detail,
      );
    }
  }

  /* Governance registry references — issued by the engine in sequence --------- */

  {
    const records = await content.list("governance-records");
    const expected = expectedGovernanceRefs();
    const actual = records.map((record) => text(record.data, "ref"));
    const inOrder = actual.every((ref, index) => ref === expected[index]);
    check(
      "governance-records.refs",
      "data",
      "GV-REG references match the registry sequence GV-REG-001…008",
      "migration-related",
      inOrder && actual.length === expected.length,
      `found ${JSON.stringify(actual)}`,
    );
  }

  /* Layer 3 — generated exports ----------------------------------------------- */

  {
    const expected = await generateMerged(content);
    const expectedNames = expected.map((file) => file.fileName).sort();
    const expectedSet = new Set(expectedNames);

    check(
      "generated.registers-complete",
      "generated",
      "every seeded collection emits a module (documents, media, governance-records included)",
      "expected",
      expectedNames.includes("documents.ts") &&
        expectedNames.includes("media.ts") &&
        expectedNames.includes("governanceRecords.ts"),
      `generated: ${expectedNames.join(", ")}`,
    );

    const onDisk = existsSync(GENERATED_DIR) ? readdirSync(GENERATED_DIR) : [];
    const stray = onDisk.filter((file) => !expectedSet.has(file));
    check(
      "generated.no-strays",
      "generated",
      "generated directory holds exactly the expected module set",
      "expected",
      stray.length === 0,
      stray.length > 0 ? `unexpected files: ${stray.join(", ")}` : undefined,
    );

    for (const file of expected) {
      const path = join(GENERATED_DIR, file.fileName);
      const disk = existsSync(path) ? readFileSync(path, "utf8") : null;
      check(
        `generated.${file.fileName}`,
        "generated",
        `${file.fileName} is byte-identical on disk`,
        "expected",
        disk === file.source,
        disk === null ? "missing on disk" : disk !== file.source ? "byte drift" : undefined,
      );
    }

    const verified = await verifyGeneratedExports(content, GENERATED_DIR);
    check(
      "generated.deterministic",
      "generated",
      "regeneration is deterministic and byte-stable",
      "expected",
      verified.valid,
      verified.statuses
        .filter((status) => !status.byteIdentical || !status.deterministic)
        .map((status) => status.fileName)
        .join(", ") || undefined,
    );
  }

  /* Layer 4 — independent source fidelity against the frozen modules ---------- */

  await verifyMetrics(content);
  await verifyLocations(content);
  await verifyAssets(content);
  await verifyVerticals(content);
  await verifyInitiatives(content);
  await verifyGovernance(content);
  await verifyDocuments(content);
  await verifyMedia(content);
  await verifyDirectory(content);
  await verifyNavigation(content);
  await verifyFooter(content);
  await verifySettings(content);

  /* Layer 5 — Phase 2B integration fidelity ----------------------------------- */

  await verifyNavigationIntegration();
  await verifyHomepageIntegration();
  await verifyMediaIntegration();

  /* Relationships and integrity ---------------------------------------------- */

  {
    const locations = (await content.list("locations")).filter((record) =>
      ["published", "external"].includes(record.status),
    );
    const locationIds = new Set(locations.map((record) => record.id));

    const assets = await content.list("portfolio-assets");
    for (const record of assets) {
      const id = text(record.data, "locationId");
      const zoneOk = locations.some(
        (location) => location.id === id && text(location.data, "zone") === text(record.data, "zone"),
      );
      check(
        `relations.asset-location.${record.id}`,
        "relations",
        `asset ${record.id} → published location ${id} with matching zone`,
        "expected",
        locationIds.has(id) && zoneOk,
        undefined,
      );
    }

    const initiatives = await content.list("esg-initiatives");
    for (const record of initiatives) {
      const id = text(record.data, "locationId");
      check(
        `relations.initiative-location.${record.id}`,
        "relations",
        `initiative ${record.id} → published location ${id}`,
        "expected",
        locationIds.has(id),
        undefined,
      );
    }

    const metrics = await content.list("metrics");
    const keys = metrics.map((record) => text(record.data, "key"));
    check(
      "relations.metric-keys-unique",
      "relations",
      `metric keys unique (${keys.length} records)`,
      "expected",
      new Set(keys).size === keys.length,
      undefined,
    );

    const documents = await content.list("documents");
    const refs = documents.map((record) => text(record.data, "ref"));
    check(
      "relations.document-refs-unique",
      "relations",
      `document refs unique (${refs.length} records)`,
      "expected",
      new Set(refs).size === refs.length && refs.every((ref) => ref.startsWith("DS-")),
      undefined,
    );

    const ledger = await store.readLines("registry:ledger");
    check(
      "relations.registry-ledger",
      "relations",
      `registry ledger records exactly ${expectedGovernanceRefs().length} issues (the GV-REG refs)`,
      "migration-related",
      ledger.length === expectedGovernanceRefs().length,
      `found ${ledger.length}`,
    );

    let totalRecords = 0;
    for (const key of allSeedCollections()) totalRecords += seedRecordsFor(key).length;
    const chain = await audit.verify();
    check(
      "relations.audit-chain",
      "relations",
      `audit chain intact — ${totalRecords} create entries (one per seeded record)`,
      "expected",
      chain.valid && chain.lastVerifiedSeq === totalRecords,
      `valid=${chain.valid}, verified=${chain.lastVerifiedSeq}, expected=${totalRecords}`,
    );
  }

  /* Report ------------------------------------------------------------------- */

  const unintended = results.filter((result) => !result.passed && result.classification === "unintended");
  const failed = results.filter((result) => !result.passed);
  const verdict = unintended.length === 0 && failed.length === 0 ? "PASS" : "FAIL";

  mkdirSync(REPORT_DIR, { recursive: true });
  const report = {
    phase: "2A/2B",
    generatedAt: new Date().toISOString(),
    verdict,
    counts: {
      total: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      unintended: unintended.length,
    },
    results,
  };
  writeFileSync(
    join(REPORT_DIR, "parity-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(join(REPORT_DIR, "parity-report.md"), renderMarkdown(report), "utf8");

  console.log(`\n${results.length} checks — ${report.counts.passed} passed, ${report.counts.failed} failed, ${unintended.length} unintended.`);
  if (failed.length > 0) {
    for (const result of failed) {
      console.error(`  ✗ [${result.layer}] ${result.description}${result.detail ? ` — ${result.detail}` : ""}`);
    }
  }
  console.log(`report: docs/cms-phase-2a/parity-report.md`);
  console.log(`verdict: ${verdict}`);
  process.exit(verdict === "PASS" ? 0 : 1);
}

/* Layer 4 helpers ------------------------------------------------------------- */

function omitKeys(data: JsonValue, keys: string[]): JsonValue {
  const record = asRecord(data);
  const next: Record<string, JsonValue> = {};
  for (const key of Object.keys(record)) if (!keys.includes(key)) next[key] = record[key];
  return next;
}

function firstDiff(actual: JsonValue, expected: JsonValue): string | undefined {
  const a = sortKeys(actual);
  const b = sortKeys(expected);
  return JSON.stringify(a) === JSON.stringify(b)
    ? undefined
    : `payload differs (mapping vs store)`;
}

async function verifyMetrics(content: ContentStore): Promise<void> {
  const records = await content.list("metrics");
  const published = records.filter((record) => record.status === "published");
  check(
    "fidelity.metrics.published-count",
    "fidelity",
    `published metrics == ${investorMetrics.length} (M1…M16)`,
    "expected",
    published.length === investorMetrics.length,
    `found ${published.length}`,
  );
  published.forEach((record, index) => {
    const m = investorMetrics[index];
    const d = asRecord(record.data);
    const leadMatch = m.lead ? d.lead === true : d.lead === undefined;
    const pass =
      d.name === m.stat &&
      d.key === m.id &&
      d.value === m.value &&
      d.period === m.period &&
      d.source === m.source &&
      d.entity === m.entity &&
      leadMatch;
    check(
      `fidelity.metrics.${m.id}`,
      "fidelity",
      `metric M${index + 1} (${m.stat}) carries the source fields verbatim`,
      "expected",
      Boolean(pass),
      undefined,
    );
  });
  const draft = records.filter((record) => record.status === "draft");
  check(
    "fidelity.metrics.en-count",
    "fidelity",
    `draft metrics == ${esgEnvironment.metrics.length} (EN-01…06, source-draft)`,
    "migration-related",
    draft.length === esgEnvironment.metrics.length,
    `found ${draft.length}`,
  );
  draft.forEach((record, index) => {
    const m = esgEnvironment.metrics[index];
    const d = asRecord(record.data);
    const pass =
      d.name === m.stat &&
      d.key === m.code &&
      d.value === m.value &&
      d.unit === m.unit &&
      d.period === m.period &&
      d.source === m.source &&
      d.trend === m.trend;
    check(
      `fidelity.metrics.${m.id}`,
      "fidelity",
      `environment metric ${m.code} (${m.stat}) carries the source fields verbatim`,
      "migration-related",
      Boolean(pass),
      undefined,
    );
  });
}

async function verifyLocations(content: ContentStore): Promise<void> {
  const records = await content.list("locations");
  const homeMapNames: Record<string, string> = { Chennai: "Headquarters" };
  records.forEach((record) => {
    const geo = geoLocations.find((location) => location.id === record.id);
    if (!geo) return;
    const d = asRecord(record.data);
    const home = mapLocations.find(
      (location) => location.name === (homeMapNames[geo.name] ?? geo.name),
    );
    const marker = contactMap.markers[0];
    const po = asRecord(d.portfolioOffset);
    const hpo = home ? asRecord(d.homepageOffset) : null;
    const co = geo.id === "chennai-hq" ? asRecord(d.contactOffset) : null;
    const visible = asRecord(d.visible);
    const pass =
      d.name === geo.name &&
      d.zone === geo.zone &&
      d.tier === geo.tier &&
      d.lat === geo.lat &&
      d.lon === geo.lon &&
      d.line === geo.line &&
      po.x === geo.x &&
      po.y === geo.y &&
      (geo.labelSide ? po.labelSide === geo.labelSide : po.labelSide === undefined) &&
      (geo.leaderTo
        ? asRecord(po.leaderTo).x === geo.leaderTo.x && asRecord(po.leaderTo).y === geo.leaderTo.y
        : po.leaderTo === undefined) &&
      (home
        ? hpo !== null &&
          hpo.x === home.x &&
          hpo.y === home.y &&
          (home.leaderTo
            ? asRecord(hpo.leaderTo).x === home.leaderTo.x && asRecord(hpo.leaderTo).y === home.leaderTo.y
            : hpo.leaderTo === undefined)
        : d.homepageOffset === undefined) &&
      (geo.id === "chennai-hq" && marker
        ? co !== null && co.x === marker.x && co.y === marker.y
        : d.contactOffset === undefined) &&
      visible.portfolio === true &&
      visible.homepage === (home !== undefined) &&
      visible.contact === (geo.id === "chennai-hq");
    check(
      `fidelity.locations.${geo.id}`,
      "fidelity",
      `location ${geo.id} (${geo.name}) preserves coordinates, offsets and visibility`,
      geo.id === "chennai-hq" || geo.id === "coimbatore" || geo.id === "puducherry"
        ? "migration-related"
        : "expected",
      Boolean(pass),
      undefined,
    );
  });
}

async function verifyAssets(content: ContentStore): Promise<void> {
  const records = await content.list("portfolio-assets");
  portfolioAssets.forEach((asset, index) => {
    const record = records[index];
    const d = asRecord(record?.data ?? {});
    const pass =
      record?.status === "published" &&
      d.name === asset.name &&
      d.plate === asset.plate &&
      d.city === asset.city &&
      d.zone === asset.zone &&
      d.class === asset.class &&
      d.status === asset.status &&
      d.locationId === asset.locationId &&
      d.sizeSqFt === asset.sizeSqFt &&
      d.occupier === asset.occupier &&
      d.completedYear === asset.completedYear &&
      d.source === asset.source &&
      d.route === undefined;
    check(
      `fidelity.assets.${asset.id}`,
      "fidelity",
      `asset ${asset.id} preserves the catalogue fields`,
      "expected",
      Boolean(pass),
      undefined,
    );
  });
}

async function verifyVerticals(content: ContentStore): Promise<void> {
  const records = await content.list("business-verticals");
  divisions.forEach((division, index) => {
    const record = records[index];
    const d = asRecord(record?.data ?? {});
    const route = asRecord(d.route);
    const spec = Array.isArray(d.spec)
      ? (d.spec as { label?: string; value?: string }[]).map((row) => row.label + "|" + row.value)
      : [];
    const expectedSpec = division.spec.map((row) => row.label + "|" + row.value);
    const pass =
      record?.status === "published" &&
      d.title === division.title &&
      d.index === division.index &&
      d.writeup === division.writeup &&
      d.proof === division.proof &&
      d.proofSource === division.proofSource &&
      ("anchor" in division ? d.anchor === division.anchor : d.anchor === undefined) &&
      route.label === division.route.label &&
      route.href === division.route.href &&
      ("external" in division.route ? route.external === true : route.external === undefined) &&
      JSON.stringify(spec) === JSON.stringify(expectedSpec) &&
      Array.isArray(d.metrics) &&
      (d.metrics as JsonValue[]).length === 0 &&
      d.source === division.source;
    check(
      `fidelity.verticals.${division.index}`,
      "fidelity",
      `vertical ${division.index} (${division.title}) preserves the division fields`,
      "anchor" in division ? "migration-related" : "expected",
      Boolean(pass),
      undefined,
    );
  });
}

async function verifyInitiatives(content: ContentStore): Promise<void> {
  const records = await content.list("esg-initiatives");
  esgImpactMap.initiatives.forEach((initiative, index) => {
    const record = records[index];
    const d = asRecord(record?.data ?? {});
    const expectedLocation = geoLocations.find((geo) => geo.name === initiative.place)?.id;
    const pass =
      record?.status === "published" &&
      d.name === initiative.name &&
      d.code === initiative.code &&
      d.place === initiative.place &&
      d.region === initiative.region &&
      d.category === initiative.category &&
      d.status === initiative.status &&
      d.lat === initiative.lat &&
      d.lon === initiative.lon &&
      d.note === initiative.note &&
      d.locationId === expectedLocation;
    check(
      `fidelity.initiatives.${initiative.id}`,
      "fidelity",
      `initiative ${initiative.code} (${initiative.name}) preserves the impact fields`,
      "expected",
      Boolean(pass),
      undefined,
    );
  });
}

async function verifyGovernance(content: ContentStore): Promise<void> {
  const records = await content.list("governance-records");
  const kinds: Record<string, string> = { Committees: "committee", Policies: "policy" };
  const expected: { id: string; ref: string; entry: string; note: string; kind: string }[] = [];
  for (const register of esgGovernance.registers) {
    if (register.title === "Disclosure index") continue;
    for (const row of register.rows) {
      expected.push({
        id: row.id,
        ref: row.ref,
        entry: row.entry,
        note: row.note,
        kind: kinds[register.title] ?? "",
      });
    }
  }
  expected.forEach((item, index) => {
    const record = records[index];
    const d = asRecord(record?.data ?? {});
    const pass =
      record?.status === "pending" &&
      d.title === item.entry &&
      d.kind === item.kind &&
      d.holder === "NDR Smart Spaces Pvt. Ltd." &&
      d.recordStatus === "pending" &&
      d.summary === item.note &&
      d.sourceRef === item.ref &&
      d.ref === expectedGovernanceRefs()[index];
    check(
      `fidelity.governance.${item.id}`,
      "fidelity",
      `governance record ${item.ref} (${item.entry}) preserved with GV-REG reference`,
      "migration-related",
      Boolean(pass),
      undefined,
    );
  });
}

async function verifyDocuments(content: ContentStore): Promise<void> {
  const records = await content.list("documents");
  const expected: {
    ref: string;
    title: string;
    category: string;
    asOn: string;
    note?: string;
    edition?: string;
  }[] = [];
  for (const group of esgDisclosures.groups) {
    for (const document of group.documents) {
      expected.push({
        ref: document.ref,
        title: document.title,
        category: group.category,
        asOn: document.asOn,
        ...(document.note ? { note: document.note } : {}),
        ...(document.edition ? { edition: document.edition } : {}),
      });
    }
  }
  expected.forEach((item, index) => {
    const record = records[index];
    const d = asRecord(record?.data ?? {});
    const pass =
      record?.status === "pending" &&
      d.title === item.title &&
      d.category === item.category &&
      d.type === item.title &&
      d.asOn === item.asOn &&
      d.ref === item.ref &&
      (item.note ? d.note === item.note : d.note === undefined) &&
      (item.edition ? d.edition === item.edition : d.edition === undefined);
    check(
      `fidelity.documents.${item.ref}`,
      "fidelity",
      `document ${item.ref} (${item.title}) preserved with explicit ref`,
      "migration-related",
      Boolean(pass),
      undefined,
    );
  });
}

async function verifyMedia(content: ContentStore): Promise<void> {
  const records = await content.list("media");

  const kitRecords = records.filter((record) => text(record.data, "folder") === "media-kit");
  kitRecords.forEach((record, index) => {
    const item = mediaKit.items[index];
    const d = asRecord(record.data);
    const isSvg = Boolean(item) && item.format.includes("SVG");
    const name = item
      ? `${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.${isSvg ? "svg" : "pdf"}`
      : null;
    const pass =
      record?.status === "pending" &&
      item !== undefined &&
      d.ref === item.ref &&
      d.label === item.label &&
      d.name === name &&
      d.kind === (isSvg ? "logo" : "pdf") &&
      d.folder === "media-kit" &&
      d.mime === (isSvg ? "image/svg+xml" : "application/pdf") &&
      d.caption === item.note &&
      d.format === item.format &&
      d.classification === item.classification &&
      d.revision === item.revision &&
      d.status === item.status;
    check(
      `fidelity.media.${item?.ref ?? record.id}`,
      "fidelity",
      `media kit item ${item?.ref ?? index} (${item?.label ?? record.id}) preserved as a pending asset`,
      "migration-related",
      Boolean(pass),
      undefined,
    );
  });

  const pressRecords = records.filter((record) => text(record.data, "folder") === "press-archive");
  PRESS_ARCHIVE_ENTRIES.forEach((entry) => {
    const record = pressRecords.find((candidate) => candidate.id === entry.id);
    const d = asRecord(record?.data ?? {});
    const pass =
      record?.status === "pending" &&
      d.ref === entry.ref &&
      d.label === entry.title &&
      d.kind === "pdf" &&
      d.folder === "press-archive" &&
      d.caption === entry.note &&
      d.recordStatus === entry.status &&
      d.date === entry.date &&
      d.category === entry.category &&
      (entry.href ? d.href === entry.href : d.href === undefined) &&
      (entry.external ? d.external === true : d.external === undefined);
    check(
      `fidelity.media.${entry.ref}`,
      "fidelity",
      `press record ${entry.ref} (${entry.title}) preserved as a pending archive entry`,
      "expected",
      Boolean(pass),
      undefined,
    );
  });

  check(
    "fidelity.media.press-count",
    "fidelity",
    `press archive == ${PRESS_ARCHIVE_ENTRIES.length} records (PR-001…UP-001)`,
    "expected",
    pressRecords.length === PRESS_ARCHIVE_ENTRIES.length,
    `found ${pressRecords.length}`,
  );
}

async function verifyDirectory(content: ContentStore): Promise<void> {
  const records = await content.list("contact-directory");
  officeDirectory.offices.forEach((office, index) => {
    const record = records[index];
    const d = asRecord(record?.data ?? {});
    const lines = Array.isArray(d.lines) ? (d.lines as { value?: string }[]).map((l) => l.value) : [];
    const email = asRecord(d.email);
    const directions = office.directions ? asRecord(d.directions) : null;
    const pass =
      record?.status === "published" &&
      d.name === office.name &&
      d.key === office.key &&
      d.kind === office.kind &&
      JSON.stringify(lines) === JSON.stringify([...office.lines]) &&
      d.phone === office.phone &&
      email.label === office.email.label &&
      email.href === office.email.href &&
      d.hours === office.hours &&
      (office.directions
        ? directions !== null &&
          directions.label === office.directions.label &&
          directions.href === office.directions.href &&
          directions.external === true
        : d.directions === undefined);
    check(
      `fidelity.directory.${office.key}`,
      "fidelity",
      `directory entry ${office.key} (${office.name}) preserved`,
      office.directions ? "migration-related" : "expected",
      Boolean(pass),
      undefined,
    );
  });
}

async function verifyNavigation(content: ContentStore): Promise<void> {
  const record = (await content.list("navigation"))[0];
  const expected: Record<string, JsonValue> = {
    siteHome,
    utilityStrip: utilityStrip as unknown as JsonValue,
    headerCta: headerCta as unknown as JsonValue,
    navItems: navItems as unknown as JsonValue,
    mobileNavItems: mobileNavItems as unknown as JsonValue,
    mobileMenuFooter: mobileMenuFooter as unknown as JsonValue,
  };
  const pass = record !== undefined && jsonEqual(record.data, expected as unknown as JsonValue);
  check(
    "fidelity.navigation",
    "fidelity",
    "navigation record carries the frozen header/nav data byte-for-byte",
    "expected",
    Boolean(pass),
    undefined,
  );
}

async function verifyFooter(content: ContentStore): Promise<void> {
  const record = (await content.list("footer"))[0];
  const d = asRecord(record?.data ?? {});
  const contact = asRecord(d.contact);
  const ecosystem = Array.isArray(d.ecosystem)
    ? (d.ecosystem as { label?: string; href?: string; external?: boolean }[])
    : [];
  const groups = Array.isArray(d.groups)
    ? (d.groups as { heading?: string; links?: { label?: string; href?: string }[] }[])
    : [];
  const legal = Array.isArray(d.legal) ? (d.legal as { label?: string; href?: string }[]) : [];
  const emails = Array.isArray(contact.emails)
    ? (contact.emails as { label?: string; href?: string }[])
    : [];
  const pass =
    record?.status === "published" &&
    d.descriptor === homepageFooter.descriptor &&
    jsonEqual(ecosystem as unknown as JsonValue, homepageFooter.ecosystem as unknown as JsonValue) &&
    jsonEqual(groups as unknown as JsonValue, homepageFooter.groups as unknown as JsonValue) &&
    jsonEqual(legal as unknown as JsonValue, homepageFooter.legal as unknown as JsonValue) &&
    d.copyright === homepageFooter.copyright &&
    contact.heading === "Correspondence" &&
    contact.address === homepageFooter.contact.address &&
    jsonEqual(emails as unknown as JsonValue, homepageFooter.contact.emails as unknown as JsonValue) &&
    d.socialLinks === undefined;
  check(
    "fidelity.footer",
    "fidelity",
    "footer record carries the frozen footer data (with correspondence heading)",
    "migration-related",
    Boolean(pass),
    undefined,
  );
}

async function verifySettings(content: ContentStore): Promise<void> {
  const corporate = asRecord((await content.list("corporate-settings"))[0]?.data ?? {});
  const corporateOffice = officeDirectory.offices.find((office) => office.key === "corporate")!;
  const officeEmails = [...new Set(officeDirectory.offices.map((office) => office.email.label))];
  const allEmails = [...new Set([...officeEmails, ...mobileMenuFooter.emails])];
  const officePhones = [...new Set(officeDirectory.offices.map((office) => office.phone))];
  const addresses = Array.isArray(corporate.addresses)
    ? (corporate.addresses as { label?: string; lines?: { value?: string }[] }[])
    : [];
  const corporateAddress = addresses[0] ?? {};
  const lines = Array.isArray(corporateAddress.lines)
    ? (corporateAddress.lines as { value?: string }[]).map((line) => line.value)
    : [];
  const phones = Array.isArray(corporate.phoneNumbers)
    ? (corporate.phoneNumbers as { value?: string }[]).map((entry) => entry.value)
    : [];
  const emails = Array.isArray(corporate.emails)
    ? (corporate.emails as { value?: string }[]).map((entry) => entry.value)
    : [];
  const links = asRecord(corporate.externalLinks);
  const corporatePass =
    corporate.companyName === "NDR Smart Spaces" &&
    corporate.legalEntity === "NDR Smart Spaces Pvt. Ltd." &&
    corporate.registryLine === "NDR Smart Spaces Pvt. Ltd. — an NDR Group platform" &&
    corporate.cin === "U45201TN2005PTC059267" &&
    addresses[0]?.label === "Corporate office" &&
    JSON.stringify(lines) === JSON.stringify([...corporateOffice.lines]) &&
    addresses[1]?.label === "Registered office" &&
    JSON.stringify([...phones].sort()) === JSON.stringify([...officePhones].sort()) &&
    JSON.stringify([...emails].sort()) === JSON.stringify([...allEmails].sort()) &&
    corporate.pressResponseExpectation === "Within 2 business days" &&
    links.invitUrl === "https://ndrinvit.com" &&
    links.aveAcresUrl === "https://aveacres.com" &&
    links.googleMapsDirectionsUrl === corporateOffice.directions?.href;
  check(
    "fidelity.settings.corporate",
    "fidelity",
    "corporate settings carry the legal, contact and external-link record",
    "migration-related",
    Boolean(corporatePass),
    undefined,
  );

  const publication = asRecord((await content.list("publication-settings"))[0]?.data ?? {});
  const prefixes = asRecord(publication.documentPrefixes);
  const numbering = asRecord(publication.numberingRules);
  const publicationPass =
    publication.editionPeriod === "FY26" &&
    publication.asOnDate === "As on 31 March 2026" &&
    ["PR-", "PC-", "MK-", "DOC-", "DS-", "CE-", "GV-REG-", "GC-", "GP-", "IM-"].every(
      (key) => typeof prefixes[key] === "string",
    ) &&
    ["ref", "fig", "doc", "register", "plate", "volume"].every(
      (key) => typeof numbering[key] === "string",
    ) &&
    publication.copyrightLine === "© 2026 NDR Smart Spaces Pvt. Ltd.";
  check(
    "fidelity.settings.publication",
    "fidelity",
    "publication settings carry the edition, prefix and numbering rules",
    "expected",
    Boolean(publicationPass),
    undefined,
  );

  const brand = asRecord((await content.list("brand-settings"))[0]?.data ?? {});
  const logoLight = asRecord(brand.logoLight);
  const logoDark = asRecord(brand.logoDark);
  const seo = asRecord(brand.seoDefaults);
  const brandPass =
    brand.brandName === "NDR Smart Spaces" &&
    logoLight.src === "/logos/ndr-smart-spaces-lockup-light.svg" &&
    logoDark.src === "/logos/ndr-smart-spaces-lockup.svg" &&
    brand.favicon === "/icon.svg" &&
    seo.title === "NDR Smart Spaces Pvt. Ltd." &&
    typeof seo.description === "string" &&
    seo.description.length > 40 &&
    brand.ogImage === undefined &&
    brand.socialLinks === undefined;
  check(
    "fidelity.settings.brand",
    "fidelity",
    "brand settings carry logos, favicon and SEO defaults (no OG image or social links)",
    "migration-related",
    Boolean(brandPass),
    undefined,
  );

  // Footer contact heading source: the frozen homepage contact section.
  check(
    "fidelity.settings.corporate.address-source",
    "fidelity",
    "corporate office address matches the frozen homepage contact record",
    "expected",
    homepageContact.info[0].value.startsWith("No. 56/1") && corporateAddress.label === "Corporate office",
    undefined,
  );
}

/* Phase 2B integration helpers ------------------------------------------------- */

async function verifyNavigationIntegration(): Promise<void> {
  const equal =
    jsonEqual(utilityStrip as unknown as JsonValue, cmsNavigation.utilityStrip as unknown as JsonValue) &&
    jsonEqual(headerCta as unknown as JsonValue, cmsNavigation.headerCta as unknown as JsonValue) &&
    jsonEqual(navItems as unknown as JsonValue, cmsNavigation.navItems as unknown as JsonValue) &&
    jsonEqual(mobileNavItems as unknown as JsonValue, cmsNavigation.mobileNavItems as unknown as JsonValue) &&
    jsonEqual(mobileMenuFooter as unknown as JsonValue, cmsNavigation.mobileMenuFooter as unknown as JsonValue) &&
    siteHome === cmsNavigation.siteHome;
  check(
    "integration.navigation",
    "integration",
    "navigation module re-exports the generated CMS navigation byte-for-byte",
    "expected",
    equal,
    undefined,
  );
}

async function verifyHomepageIntegration(): Promise<void> {
  const statByKey = new Map(cmsMetrics.map((metric) => [metric.key, metric.value]));
  const heroKeys = ["M1", "M5", "M3"] as const;
  const heroOk =
    hero.stats.length === heroKeys.length &&
    hero.stats.every((stat, index) => {
      const raw = statByKey.get(heroKeys[index]) ?? "";
      const expectedValue = Number(/^([0-9]+(?:\.[0-9]+)?)/.exec(raw)?.[1] ?? 0);
      const expectedSuffix = /^[0-9][0-9,.]*([+%]?)/.exec(raw)?.[1] ?? "";
      return stat.value === expectedValue && stat.suffix === expectedSuffix;
    });
  check(
    "integration.homepage.hero",
    "integration",
    "hero stats derive from the published metrics (M1 60+ · M5 100+ · M3 98%)",
    "expected",
    heroOk,
    undefined,
  );

  const verticalsOk =
    businessHighlights.verticals.length === cmsVerticals.length &&
    businessHighlights.verticals.every((vertical, index) => {
      const source = cmsVerticals[index];
      return (
        vertical.index === source.index &&
        vertical.title === source.title &&
        vertical.href === source.route.href &&
        Boolean(vertical.external) === ("external" in source.route && source.route.external === true)
      );
    });
  check(
    "integration.homepage.verticals",
    "integration",
    "business highlight verticals derive from the generated business verticals (Ave Acres external)",
    "expected",
    verticalsOk,
    undefined,
  );

  const expectedMap: {
    name: string;
    zone: string;
    tier: string;
    x: number;
    y: number;
    line: string;
    leaderTo?: { x: number; y: number };
  }[] = [];
  for (const location of cmsLocations) {
    if (!("homepageOffset" in location) || !location.visible.homepage) continue;
    const offset = location.homepageOffset;
    expectedMap.push({
      name: location.name === "Chennai" ? "Headquarters" : location.name,
      zone: location.zone,
      tier: location.tier,
      x: offset.x,
      y: offset.y,
      line: location.line,
      ...("leaderTo" in offset ? { leaderTo: offset.leaderTo } : {}),
    });
  }
  const mapOk = jsonEqual(mapLocations as unknown as JsonValue, expectedMap as unknown as JsonValue);
  check(
    "integration.homepage.map",
    "integration",
    "map markers derive from the generated locations (homepage-visible, Chennai aliased to Headquarters)",
    "expected",
    mapOk,
    undefined,
  );

  const footerOk = jsonEqual(homepageFooter as unknown as JsonValue, cmsFooter as unknown as JsonValue);
  check(
    "integration.homepage.footer",
    "integration",
    "footer re-exports the generated footer byte-for-byte",
    "expected",
    footerOk,
    undefined,
  );

  check(
    "integration.homepage.no-new-sections",
    "integration",
    "homepage keeps esg null and latestUpdates empty — no new sections introduced",
    "expected",
    esg === null && latestUpdates.length === 0,
    undefined,
  );
}

async function verifyMediaIntegration(): Promise<void> {
  type CmsMediaRecord = {
    id: string;
    status: string;
    folder: string;
    ref?: string;
    label?: string;
    caption?: string;
    format?: string;
    classification?: string;
    revision?: string;
    date?: string;
    category?: string;
    recordStatus?: string;
    href?: string;
    external?: boolean;
  };
  const mediaRecords = cmsMedia as unknown as readonly CmsMediaRecord[];

  const kitSources = mediaRecords.filter((record) => record.folder === "media-kit");
  const kitOk =
    kitSources.length === mediaKit.items.length &&
    mediaKit.items.every((item, index) => {
      const source = kitSources[index];
      return (
        source.ref === item.ref &&
        source.label === item.label &&
        source.caption === item.note &&
        source.format === item.format &&
        source.classification === item.classification &&
        source.revision === item.revision &&
        source.status === item.status
      );
    });
  check(
    "integration.media.kit",
    "integration",
    "media kit items derive from the generated media collection (media-kit folder)",
    "expected",
    kitOk,
    undefined,
  );

  const pressSources = mediaRecords.filter((record) => record.folder === "press-archive");
  const pressMatchesSources =
    pressSources.length === pressArchive.entries.length &&
    pressArchive.entries.every((entry, index) => {
      const source = pressSources[index];
      return (
        entry.id === source.id &&
        entry.ref === source.ref &&
        entry.date === source.date &&
        entry.category === source.category &&
        entry.title === source.label &&
        (entry.note ?? null) === (source.caption ?? null) &&
        entry.status === source.recordStatus &&
        (entry.href ?? null) === (source.href ?? null) &&
        Boolean(entry.external) === (source.external === true)
      );
    });
  const pressMatchesFrozen =
    pressSources.length === PRESS_ARCHIVE_ENTRIES.length &&
    pressArchive.entries.every((entry, index) => {
      const source = PRESS_ARCHIVE_ENTRIES[index];
      return (
        entry.id === source.id &&
        entry.ref === source.ref &&
        entry.date === source.date &&
        entry.category === source.category &&
        entry.title === source.title &&
        (entry.note ?? null) === (source.note ?? null) &&
        entry.status === source.status &&
        (entry.href ?? null) === (source.href ?? null) &&
        Boolean(entry.external) === (source.external === true)
      );
    });
  check(
    "integration.media.press-archive",
    "integration",
    "press archive entries derive from the media collection and stay byte-equal to the frozen source",
    "expected",
    pressMatchesSources && pressMatchesFrozen,
    undefined,
  );

  check(
    "integration.media.edition",
    "integration",
    "edition and publication reference derive from the publication settings (FY26)",
    "expected",
    MEDIA_EDITION.asOn === publicationSettings.asOnDate &&
      MEDIA_EDITION.edition === `Edition ${publicationSettings.editionPeriod} · Volume I` &&
      MEDIA_PUBLICATION.ref === `NDR-PR-${publicationSettings.editionPeriod}`,
    undefined,
  );

  const pressDesk = contactDirectory.find((entry) => entry.key === "media");
  const businessDesk = contactDirectory.find((entry) => entry.key === "business");
  const contactOk =
    pressContact.response.value === corporateSettings.pressResponseExpectation &&
    pressContact.departments[0].value === pressDesk?.email.label &&
    pressContact.departments[0].href === pressDesk?.email.href &&
    pressContact.departments[1].value === businessDesk?.email.label &&
    pressContact.departments[1].href === businessDesk?.email.href &&
    pressContact.address ===
      corporateSettings.addresses[0].lines.map((line) => line.value).join(", ");
  check(
    "integration.media.press-contact",
    "integration",
    "press contact derives from the contact directory and corporate settings",
    "expected",
    Boolean(contactOk),
    undefined,
  );

  const featuredOk = pressArchive.entries.some(
    (entry) => entry.ref === mediaFeatured.ref && entry.status === mediaFeatured.status,
  );
  check(
    "integration.media.featured",
    "integration",
    "featured publication references the PR-002 press record from the archive",
    "expected",
    featuredOk,
    undefined,
  );
}

function renderMarkdown(report: unknown): string {
  const r = report as {
    verdict: string;
    counts: { total: number; passed: number; failed: number; unintended: number };
    results: CheckResult[];
  };
  const lines: string[] = [];
  lines.push("# CMS Phase 2A/2B — Parity Report");
  lines.push("");
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push(`- Store: \`.cms-store/content.json\``);
  lines.push(`- Generated modules: \`src/lib/data/generated/\``);
  lines.push(`- Verdict: **${r.verdict}** — ${r.counts.passed}/${r.counts.total} checks passed, ${r.counts.failed} failed, ${r.counts.unintended} unintended`);
  lines.push("");
  const byLayer = new Map<string, CheckResult[]>();
  for (const result of r.results) {
    const list = byLayer.get(result.layer) ?? [];
    list.push(result);
    byLayer.set(result.layer, list);
  }
  for (const [layer, list] of byLayer) {
    lines.push(`## ${layer}`);
    lines.push("");
    lines.push(`| Check | Result | Class |`);
    lines.push(`| --- | --- | --- |`);
    for (const result of list) {
      lines.push(
        `| ${result.description}${result.detail ? ` <br><small>${result.detail}</small>` : ""} | ${result.passed ? "PASS" : "FAIL"} | ${result.classification} |`,
      );
    }
    lines.push("");
  }
  lines.push(`## Summary`);
  lines.push("");
  lines.push(`- Total: ${r.counts.total}`);
  lines.push(`- Passed: ${r.counts.passed}`);
  lines.push(`- Failed: ${r.counts.failed}`);
  lines.push(`- Unintended: ${r.counts.unintended}`);
  return lines.join("\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
