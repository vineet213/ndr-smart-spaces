/**
 * CMS Phase 2A — seeding pipeline.
 *
 * Resets the local CMS store and seeds all fourteen shared collections from the
 * frozen data modules via the shared migration mapping (`cms-migration/`),
 * flowing every record through CollectionEditor — validation, registry
 * references, deterministic ordering, hash-chained audit. Then regenerates the
 * managed modules in `src/lib/data/generated/` and verifies byte-stability.
 *
 *   npm run seed:cms
 *
 * DEV ONLY. Destroys `.cms-store` and the generated modules; the frozen
 * handwritten modules are never touched.
 */

import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";import {
  CollectionEditor,
  ContentStore,
  FileStore,
  AuditLog,
  ReferenceRegistry,
  JsonFileStore,
  RegistryConfig,
  generateMerged,
  verifyGeneratedExports,
  writeGenerated,
} from "../src/lib/cms";
import { allSeedCollections, seedRecordsFor } from "./cms-migration/mappings";

const ROOT = process.cwd();
const STORE_FILE = join(ROOT, ".cms-store", "content.json");
const FILES_DIR = join(ROOT, ".cms-store", "files");
const GENERATED_DIR = join(ROOT, "src", "lib", "data", "generated");

const REGISTRY_DEFAULTS: RegistryConfig = {
  ref: { prefix: "PR-", width: 3, start: 4 },
  plate: { prefix: "", width: 2, start: 1 },
  fig: { prefix: "FIG-", width: 3, start: 1 },
  doc: { prefix: "DOC-", width: 3, start: 1 },
  register: { prefix: "REG-", width: 3, start: 1 },
  volume: { prefix: "", width: 1, start: 1 },
  fy: { label: "FY26" },
};

async function main(): Promise<void> {
  console.log("CMS Phase 2A — seed collections from the frozen data modules");
  rmSync(join(ROOT, ".cms-store"), { recursive: true, force: true });
  rmSync(GENERATED_DIR, { recursive: true, force: true });

  const store = new JsonFileStore(STORE_FILE);
  const files = new FileStore(FILES_DIR);
  const registry = new ReferenceRegistry(store, REGISTRY_DEFAULTS);
  const audit = new AuditLog(store);
  const editor = new CollectionEditor(store, files, registry, audit);
  const content = new ContentStore(store);

  const summary: Record<string, { seeded: number; issuedRefs: string[] }> = {};
  let total = 0;

  for (const collectionKey of allSeedCollections()) {
    const records = seedRecordsFor(collectionKey);
    const issuedRefs: string[] = [];
    for (const spec of records) {
      const result = await editor.save({
        collectionKey,
        id: spec.id,
        data: spec.data,
        status: spec.status,
        order: spec.order,
        user: "cms-seed@ndr.com",
        role: "super-admin",
      });
      if (result.issuedRef) issuedRefs.push(result.issuedRef);
      total += 1;
    }
    summary[collectionKey] = { seeded: records.length, issuedRefs };
    console.log(`  ${collectionKey.padEnd(22)} ${String(records.length).padStart(2)} records`);
  }

  const generated = await generateMerged(content);
  writeGenerated(GENERATED_DIR, generated);
  const generatedCheck = await verifyGeneratedExports(content, GENERATED_DIR);
  const chain = await audit.verify();

  console.log(`seeded ${total} records across ${allSeedCollections().length} collections`);
  console.log(`generated modules: ${generated.map((file) => file.fileName).join(", ")}`);
  console.log(`generated exports byte-identical: ${generatedCheck.valid}`);
  console.log(`audit chain valid: ${chain.valid} (${chain.lastVerifiedSeq} entries)`);

  writeFileSync(
    join(ROOT, ".cms-store", "seed-manifest.json"),
    `${JSON.stringify(
      {
        phase: "2A",
        seededAt: new Date().toISOString(),
        collections: summary,
        generated: generated.map((file) => file.fileName),
        generatedValid: generatedCheck.valid,
        auditValid: chain.valid,
        auditEntries: chain.lastVerifiedSeq,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  if (!generatedCheck.valid || !chain.valid) process.exit(1);
  console.log("SEED OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
