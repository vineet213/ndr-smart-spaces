/**
 * CMS export CLI — publishes CMS content into the managed frontend modules.
 *
 *   npm run cms:export
 *
 * Reproduces Stage 1 of the admin server's POST /api/export handler
 * (admin/server.ts) using the exact same underlying engines: deterministic
 * generation of `src/lib/data/generated/*.ts` from `.cms-store/content.json`,
 * byte-stability verification of both the generated set and the pass-through
 * data modules (§16.2), and audit-chain integrity verification.
 *
 * Unlike the HTTP handler, this command appends no audit entry: the audit
 * chain records authenticated identities, and a local CLI invocation has no
 * session. Chain integrity is still verified before export is declared valid.
 *
 * Stage 2 (deployment) is reported but never blocks export success — same
 * contract as the admin server. Run `next build` afterwards to bake the new
 * modules into the static site (`npm run publish` does both).
 */

import { join } from "node:path";
import { JsonFileStore } from "../src/lib/cms/store";
import {
  ContentStore,
  generateMerged,
  verifyGeneratedExports,
  writeGenerated,
} from "../src/lib/cms/editor";
import { verifyExportContract } from "../src/lib/cms/export";
import { AuditLog } from "../src/lib/cms/audit";
import { createDeploymentAdapter } from "../src/lib/cms/deploy";

const ROOT = process.cwd();
const STORE_FILE = join(ROOT, ".cms-store", "content.json");
const GENERATED_DIR = join(ROOT, "src", "lib", "data", "generated");
const DATA_DIR = join(ROOT, "src", "lib", "data");

async function main(): Promise<number> {
  const store = new JsonFileStore(STORE_FILE);
  const content = new ContentStore(store);
  const auditLog = new AuditLog(store);

  console.log("CMS export — generating managed modules");
  const filesToWrite = await generateMerged(content);
  writeGenerated(GENERATED_DIR, filesToWrite);
  for (const file of filesToWrite) {
    console.log(`    wrote src/lib/data/generated/${file.fileName}`);
  }

  const generated = await verifyGeneratedExports(content, GENERATED_DIR);
  for (const status of generated.statuses) {
    if (!status.byteIdentical || !status.deterministic) {
      console.error(
        `    ✗ ${status.fileName} byteIdentical=${status.byteIdentical} deterministic=${status.deterministic}`,
      );
    }
  }

  const contract = verifyExportContract(DATA_DIR);
  for (const status of contract.modules) {
    if (!status.stable) {
      console.error(`    ✗ data module drifted from baseline: ${status.module}`);
    }
  }

  const chain = await auditLog.verify();
  if (!chain.valid) console.error("    ✗ audit chain integrity check failed");

  const exportOk = generated.valid && contract.stable && chain.valid;
  if (!exportOk) {
    console.error("CMS export failed — see errors above. Public build NOT updated.");
    return 1;
  }
  console.log(
    `export ok (${filesToWrite.length} modules, contract stable, audit chain valid at seq ${chain.lastVerifiedSeq})`,
  );

  // Stage 2: deployment — reported separately, never gates export success.
  try {
    const result = createDeploymentAdapter().deploy();
    console.log(`deployment: provider=${result.provider} deployed=${result.deployed} — ${result.message}`);
  } catch (error) {
    console.error(
      `deployment failed (export unaffected): ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exit(1);
  });
