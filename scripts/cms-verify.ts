/**
 * CMS foundation verification — runs in development and CI.
 *
 *   npm run verify:cms
 *
 * Checks, in order: consolidated validation (§13), the byte-stable export
 * contract (§16.2), Reference Registry issuance (§1.4), and audit-chain
 * integrity including tamper detection (§15.1). Exits non-zero on any error.
 */

import { join } from "node:path";
import {
  MemoryStore,
  AuditLog,
  ReferenceRegistry,
  RegistryConfig,
  validateAll,
  verifyExportContract,
  isDeterministic,
  serializeAsConst,
  recordBaseline,
} from "../src/lib/cms";

const DATA_DIR = join(process.cwd(), "src", "lib", "data");

let failures = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${message}`);
  }
}

async function main(): Promise<void> {
  console.log("CMS foundation verification");

  console.log("\n[1] Consolidated validation (§13)");
  const report = validateAll();
  for (const issue of report.issues) {
    const tag = issue.severity === "error" ? "ERROR" : "WARN ";
    const where = issue.recordId ? `${issue.collection}:${issue.recordId}` : issue.collection;
    console[issue.severity === "error" ? "error" : "log"](
      `    ${tag} ${issue.rule} · ${where} — ${issue.message}`,
    );
  }
  assert(
    report.valid,
    `validation passes with zero errors (${report.errors.length} errors, ${report.warnings.length} warnings)`,
  );

  console.log("\n[2] Byte-stable export contract (§16.2)");
  if (process.argv.includes("--record-baseline")) {
    recordBaseline(DATA_DIR);
    console.log("    baseline manifest recorded.");
  }
  const contract = verifyExportContract(DATA_DIR);
  for (const status of contract.modules) {
    const marker = status.stable ? "stable" : "DRIFT";
    console.log(
      `    ${status.module.padEnd(14)} ${status.managed ? "managed" : "pass-through".padEnd(12)} ${marker}`,
    );
  }
  assert(
    contract.stable,
    `all ${contract.modules.length} data modules match their byte-stability baseline`,
  );

  const sample = { asOn: "As on 31 March 2026", edition: "Edition FY26", items: [1, 2, 3] };
  assert(
    isDeterministic("sample", sample),
    "serializer is deterministic (same content → same bytes)",
  );
  const emitted = serializeAsConst("sample", sample);
  assert(
    emitted.includes("as const;") && emitted.startsWith("export const sample ="),
    "serializer emits a typed `as const` module",
  );

  console.log("\n[3] Reference Registry issuance (§1.4)");
  const registryConfig: RegistryConfig = {
    ref: { prefix: "PR-", width: 3, start: 4 },
    plate: { prefix: "", width: 2, start: 1 },
    fig: { prefix: "FIG-", width: 3, start: 1 },
    doc: { prefix: "DOC-", width: 3, start: 1 },
    register: { prefix: "REG-", width: 3, start: 1 },
    volume: { prefix: "", width: 1, start: 1 },
    fy: { label: "FY26" },
  };
  const registry = new ReferenceRegistry(new MemoryStore(), registryConfig);
  const ref = await registry.issue("ref");
  const plate = await registry.issue("plate");
  const fig = await registry.issue("fig");
  const doc = await registry.issue("doc");
  const register = await registry.issue("register", "gv");
  const fy = await registry.issue("fy");
  const volume = await registry.issue("volume");
  assert(ref.value === "PR-004", `REF issues sequentially (${ref.value})`);
  assert(plate.value === "01", `PLATE issues as NN (${plate.value})`);
  assert(fig.value === "FIG-001", `FIG issues with prefix (${fig.value})`);
  assert(doc.value === "DOC-001", `DOC issues with prefix (${doc.value})`);
  assert(register.value === "GV-REG-001", `register numbers are scoped (${register.value})`);
  assert(fy.value === "FY26" && fy.sequence === null, `FY is a fixed label (${fy.value})`);
  assert(volume.value === "I", `Volume issues as a roman numeral (${volume.value})`);
  assert(await registry.isIssued("PR-004"), "issued values are recorded in the registry ledger");
  assert((await registry.peek("plate")) === 2, "counters advance without collision");

  console.log("\n[4] Audit chain integrity (§15.1)");
  const store = new MemoryStore();
  const audit = new AuditLog(store);
  await audit.append({
    user: "superadmin@ndr.com",
    role: "super-admin",
    action: "create",
    collection: "metrics",
    recordId: "M17",
    after: { id: "M17", value: "99%" },
  });
  await audit.append({
    user: "investor-editor@ndr.com",
    role: "investor-editor",
    action: "publish",
    collection: "documents",
    recordId: "DOC-001",
    statusChange: { from: "draft", to: "published" },
    documentVersion: { from: "1", to: "2" },
  });
  await audit.append({
    user: "investor-editor@ndr.com",
    role: "investor-editor",
    action: "update",
    collection: "locations",
    recordId: "chennai-hq",
    before: { lat: 13.0887 },
    after: { lat: 13.0887 },
  });
  const chain = await audit.verify();
  assert(chain.valid && chain.lastVerifiedSeq === 3, "audit chain verifies end-to-end");

  const lines = await store.readLines("audit:log");
  const tampered = JSON.parse(lines[1]) as { recordId: string };
  tampered.recordId = "DOC-999";
  lines[1] = JSON.stringify(tampered);
  await store.set("audit:log", lines.join("\n"));
  const afterTamper = await audit.verify();
  assert(
    !afterTamper.valid && afterTamper.lastVerifiedSeq === 1,
    "tampering breaks the chain at the edited entry",
  );

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
