/**
 * CMS foundation verification — runs in development and CI.
 *
 *   npm run verify:cms
 *
 * Checks, in order: consolidated validation (§13), the byte-stable export
 * contract (§16.2), Reference Registry issuance (§1.4), audit-chain integrity
 * including tamper detection (§15.1), and the Phase 1.1 editor engine
 * end-to-end (validation gate, DOC reference issuance, publication workflow,
 * archive role rules, deterministic export generation). Exits non-zero on any
 * error.
 */

import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
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
  CollectionEditor,
  ContentStore,
  FileStore,
  EditorValidationError,
  EditorPermissionError,
  generateMerged,
  verifyGeneratedExports,
  writeGenerated,
  JsonValue,
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

  console.log("\n[5] Phase 1.1 editor engine end-to-end");
  const editorStore = new MemoryStore();
  const editorAudit = new AuditLog(editorStore);
  const filesDir = join(tmpdir(), "ndr-cms-verify-files");
  rmSync(filesDir, { recursive: true, force: true });
  const editorFiles = new FileStore(filesDir);
  const editorRegistry = new ReferenceRegistry(editorStore, registryConfig);
  const editor = new CollectionEditor(editorStore, editorFiles, editorRegistry, editorAudit);
  const editorContent = new ContentStore(editorStore);

  // Documents: registry reference on create, publication gate, versioning.
  const documentRecord = await editor.save({
    collectionKey: "documents",
    data: {
      title: "Annual Report FY26",
      category: "Annual Reports",
      type: "Annual Report",
      asOn: "As on 31 March 2026",
    },
    status: "draft",
    user: "investor-editor@ndr.com",
    role: "investor-editor",
  });
  assert(
    documentRecord.issuedRef === "DOC-001",
    `document creation issues a DOC reference (${documentRecord.issuedRef})`,
  );
  assert(
    documentRecord.record.status === "draft" && documentRecord.record.version === "1",
    "document starts as draft v1",
  );
  assert(
    await editorRegistry.isIssued("DOC-001"),
    "issued DOC reference is in the registry ledger",
  );

  let gateRejected = false;
  try {
    await editor.transition("documents", documentRecord.record.id, "published", {
      user: "investor-editor@ndr.com",
      role: "investor-editor",
    });
  } catch (error) {
    gateRejected =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "unpublished-linked-content");
  }
  assert(gateRejected, "publishing a document without a file or href is rejected by the gate");

  const docWithFile = await editor.save({
    collectionKey: "documents",
    id: documentRecord.record.id,
    data: {
      ...(documentRecord.record.data as unknown as Record<string, JsonValue>),
      note: "File uploaded.",
    },
    file: { name: "annual-report-fy26.pdf", mime: "application/pdf", dataBase64: "aGVsbG8=" },
    user: "investor-editor@ndr.com",
    role: "investor-editor",
  });
  assert(
    docWithFile.record.version === "1" && docWithFile.file?.sizeBytes === 5,
    "upload stores the file and sets version 1",
  );

  await editor.transition("documents", documentRecord.record.id, "published", {
    user: "investor-editor@ndr.com",
    role: "investor-editor",
  });
  const docAudit = await editor.auditFor("documents", documentRecord.record.id);
  assert(
    docAudit.some((entry) => entry.action === "publish" && entry.statusChange?.to === "published"),
    "publish records an explicit audit action",
  );

  const replaced = await editor.save({
    collectionKey: "documents",
    id: documentRecord.record.id,
    data: docWithFile.record.data as JsonValue,
    file: {
      name: "annual-report-fy26.pdf",
      mime: "application/pdf",
      dataBase64: "aGVsbG8gYWdhaW4=",
    },
    user: "investor-editor@ndr.com",
    role: "investor-editor",
  });
  assert(replaced.record.version === "2", "replacing the file bumps the document version");
  const replaceAudit = await editor.auditFor("documents", documentRecord.record.id);
  assert(
    replaceAudit.some(
      (entry) =>
        entry.documentVersion &&
        entry.documentVersion.from === "1" &&
        entry.documentVersion.to === "2",
    ),
    "file replacement records the version change in the audit chain",
  );

  let archiveRejected = false;
  try {
    await editor.transition("documents", documentRecord.record.id, "archived", {
      user: "investor-editor@ndr.com",
      role: "investor-editor",
    });
  } catch (error) {
    archiveRejected = error instanceof EditorPermissionError;
  }
  assert(archiveRejected, "only Super Admin can archive a record (§15)");

  await editor.transition("documents", documentRecord.record.id, "archived", {
    user: "superadmin@ndr.com",
    role: "super-admin",
  });
  await editor.transition("documents", documentRecord.record.id, "draft", {
    user: "investor-editor@ndr.com",
    role: "investor-editor",
  });
  const restored = await editor.get("documents", documentRecord.record.id);
  assert(restored?.status === "draft", "restore returns a record to draft");
  await editor.transition("documents", documentRecord.record.id, "published", {
    user: "investor-editor@ndr.com",
    role: "investor-editor",
  });

  // Media: same gate, no registry reference.
  const media = await editor.save({
    collectionKey: "media",
    data: { name: "corporate-factsheet.pdf", kind: "pdf" },
    status: "draft",
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  assert(media.record.status === "draft", "media starts as a draft");
  let mediaGateRejected = false;
  try {
    await editor.transition("media", media.record.id, "published", {
      user: "business-editor@ndr.com",
      role: "business-editor",
    });
  } catch (error) {
    mediaGateRejected = error instanceof EditorValidationError;
  }
  assert(mediaGateRejected, "publishing media without a file is rejected by the gate");
  await editor.save({
    collectionKey: "media",
    id: media.record.id,
    data: { name: "corporate-factsheet.pdf", kind: "pdf" },
    file: { name: "factsheet.pdf", mime: "application/pdf", dataBase64: "ZmFjdHNoZWV0" },
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  await editor.transition("media", media.record.id, "published", {
    user: "business-editor@ndr.com",
    role: "business-editor",
  });

  // Navigation: route validation rejects broken links, then passes.
  let brokenNav = false;
  try {
    await editor.save({
      collectionKey: "navigation",
      data: {
        siteHome: { label: "Home", href: "/en" },
        navItems: [{ label: "Business", href: "/en/does-not-exist" }],
      },
      user: "business-editor@ndr.com",
      role: "business-editor",
    });
  } catch (error) {
    brokenNav =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "broken-routes");
  }
  assert(brokenNav, "navigation rejects links to unknown routes");
  await editor.save({
    collectionKey: "navigation",
    data: {
      siteHome: { label: "Home", href: "/en" },
      utilityStrip: [{ label: "Investor Centre", href: "/en/investor-centre" }],
      headerCta: { label: "Contact us", href: "/en/contact" },
      navItems: [
        {
          label: "Business",
          href: "/en/business",
          columns: [
            {
              heading: "Overview",
              links: [{ label: "Business Overview", href: "/en/business#verticals" }],
            },
          ],
        },
      ],
      mobileNavItems: [{ label: "Home", href: "/en" }],
      mobileMenuFooter: [{ label: "Privacy Policy", href: "/en/privacy-policy" }],
    },
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  const navRecord = await editorContent.getSingle("navigation");
  assert(navRecord !== null, "valid navigation saves");

  // Footer: validates required fields and routes.
  await editor.save({
    collectionKey: "footer",
    data: {
      descriptor: "The Operating Manual",
      ecosystem: [{ label: "NDR InvIT Trust", href: "https://ndrinvit.com" }],
      groups: [{ heading: "Quick Links", links: [{ label: "About Us", href: "/en/about-us" }] }],
      legal: [{ label: "Privacy Policy", href: "/en/privacy-policy" }],
      socialLinks: [
        { label: "LinkedIn", href: "https://www.linkedin.com/company/ndr-smart-spaces" },
      ],
      contact: {
        heading: "Chennai HQ",
        address: "Guindy, Chennai 600032",
        emails: [{ label: "compliance@ndrsmart.com", href: "mailto:compliance@ndrsmart.com" }],
      },
      copyright: "© 2026 NDR Smart Spaces Pvt. Ltd.",
    },
    user: "superadmin@ndr.com",
    role: "super-admin",
  });
  assert((await editorContent.getSingle("footer")) !== null, "valid footer saves");

  // Settings: corporate settings with CIN format validation.
  let badCin = false;
  try {
    await editor.save({
      collectionKey: "corporate-settings",
      data: {
        companyName: "NDR Smart Spaces",
        legalEntity: "NDR Smart Spaces Pvt. Ltd.",
        cin: "BAD",
        addresses: [{ label: "HQ", lines: ["Guindy"] }],
        emails: [{ value: "compliance@ndrsmart.com" }],
      },
      user: "superadmin@ndr.com",
      role: "super-admin",
    });
  } catch (error) {
    badCin =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.message.includes("CIN"));
  }
  assert(badCin, "corporate settings enforce the 21-character CIN format");
  await editor.save({
    collectionKey: "corporate-settings",
    data: {
      companyName: "NDR Smart Spaces",
      legalEntity: "NDR Smart Spaces Pvt. Ltd.",
      cin: "U74900TN2004PTC053347",
      registryLine: "Company Registration No. 053347",
      addresses: [
        {
          label: "Head Office",
          lines: ["6-12, Developed Plots", "Thiru-Vi-Ka Industrial Estate, Guindy, Chennai 600032"],
        },
      ],
      phoneNumbers: [{ value: "+91 44 4345 1000" }],
      emails: [{ value: "compliance@ndrsmart.com" }],
      externalLinks: { invitUrl: "https://ndrinvit.com" },
    },
    user: "superadmin@ndr.com",
    role: "super-admin",
  });
  assert(
    (await editorContent.getSingle("corporate-settings")) !== null,
    "valid corporate settings save",
  );

  // Deterministic export generation: only published/external content exports.
  const generatedDir = join(tmpdir(), "ndr-cms-verify-generated");
  rmSync(generatedDir, { recursive: true, force: true });
  const generated = await generateMerged(editorContent);
  const sources = generated.map((file) => file.source).join("\n");
  assert(sources.includes("DOC-001"), "published document appears in the generated register");
  assert(
    sources.includes("corporate-factsheet.pdf"),
    "published media appears in the generated library",
  );
  const draftOnly = new MemoryStore();
  const draftContent = new ContentStore(draftOnly);
  await new ContentStore(draftOnly).put("documents", { ...documentRecord.record, status: "draft" });
  const draftGenerated = await generateMerged(draftContent);
  const draftDocuments =
    draftGenerated.find((file) => file.fileName === "documents.ts")?.source ?? "";
  assert(
    draftDocuments.includes("DOC-001") && draftDocuments.includes('"status": "draft"'),
    "draft-only registers emit the documents module in full with the status preserved",
  );
  writeGenerated(generatedDir, generated);
  const generatedCheck = await verifyGeneratedExports(editorContent, generatedDir);
  assert(generatedCheck.valid, "generated modules are byte-identical after regeneration");
  const pass2 = await generateMerged(editorContent);
  assert(
    pass2.length === generated.length &&
      generated.every((file, i) => file.source === pass2[i].source),
    "generated module bytes are deterministic across passes",
  );

  const chainAfterEdits = await editorAudit.verify();
  assert(chainAfterEdits.valid, "audit chain stays valid through the full editor workflow");

  console.log("\n[6] Phase 1.2 shared data collections end-to-end");
  const sharedRoot = join(tmpdir(), "ndr-cms-verify-shared");
  rmSync(sharedRoot, { recursive: true, force: true });
  const sharedStore = new MemoryStore();
  const sharedAudit = new AuditLog(sharedStore);
  const sharedFiles = new FileStore(join(sharedRoot, "files"));
  const sharedRegistry = new ReferenceRegistry(sharedStore, registryConfig);
  const shared = new CollectionEditor(sharedStore, sharedFiles, sharedRegistry, sharedAudit);
  const sharedContent = new ContentStore(sharedStore);

  // Governance records carry a register reference issued on create (§1.4).
  const governance = await shared.save({
    collectionKey: "governance-records",
    data: {
      title: "Board of Directors",
      kind: "board",
      holder: "NDR Smart Spaces Pvt. Ltd.",
      recordStatus: "active",
    },
    status: "draft",
    user: "superadmin@ndr.com",
    role: "super-admin",
  });
  assert(
    governance.issuedRef === "GV-REG-001",
    `governance creation issues a scoped register reference (${governance.issuedRef})`,
  );

  // Locations: coordinate gate, surface visibility on publish, master reference.
  let badCoordinates = false;
  try {
    await shared.save({
      collectionKey: "locations",
      data: { name: "Pune", tier: "hub", zone: "west", lat: 99, lon: 73.856 },
      status: "draft",
      user: "business-editor@ndr.com",
      role: "business-editor",
    });
  } catch (error) {
    badCoordinates =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "coordinates");
  }
  assert(badCoordinates, "locations reject out-of-range coordinates");
  const location = await shared.save({
    collectionKey: "locations",
    data: {
      name: "Pune",
      tier: "hub",
      zone: "west",
      region: "Maharashtra",
      line: "Maharashtra",
      lat: 18.52,
      lon: 73.856,
    },
    status: "draft",
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  let visibilityGap = false;
  try {
    await shared.transition("locations", location.record.id, "published", {
      user: "business-editor@ndr.com",
      role: "business-editor",
    });
  } catch (error) {
    visibilityGap =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "unpublished-linked-content");
  }
  assert(visibilityGap, "a location with no visible surface cannot publish");
  const locationVisible = await shared.save({
    collectionKey: "locations",
    id: location.record.id,
    data: {
      name: "Pune",
      tier: "hub",
      zone: "west",
      region: "Maharashtra",
      line: "Maharashtra",
      lat: 18.52,
      lon: 73.856,
      visible: { homepage: true, portfolio: false, contact: false },
    },
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  assert(locationVisible.record.id === "pune", "location id resolves from its name");
  await shared.transition("locations", "pune", "published", {
    user: "business-editor@ndr.com",
    role: "business-editor",
  });

  // Portfolio assets: a location reference must resolve to a published location.
  let unresolvedLocation = false;
  try {
    await shared.save({
      collectionKey: "portfolio-assets",
      data: {
        name: "Draft Depot",
        plate: "01",
        city: "Pune",
        zone: "west",
        locationId: "ghaziabad",
        class: "warehousing",
        status: "completed",
      },
      status: "draft",
      user: "business-editor@ndr.com",
      role: "business-editor",
    });
  } catch (error) {
    unresolvedLocation =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "references");
  }
  assert(unresolvedLocation, "portfolio assets reject references to unknown locations");
  const asset = await shared.save({
    collectionKey: "portfolio-assets",
    data: {
      name: "Pune Warehouse",
      plate: "01",
      city: "Pune",
      zone: "west",
      locationId: "pune",
      class: "warehousing",
      status: "completed",
      sizeSqFt: 400000,
      source: "NDR Corporate Presentation",
    },
    status: "draft",
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  assert(asset.record.id === "pune-warehouse", "portfolio asset id resolves from its name");
  let duplicatePlate = false;
  try {
    await shared.save({
      collectionKey: "portfolio-assets",
      data: {
        name: "Second Depot",
        plate: "01",
        city: "Pune",
        zone: "west",
        class: "industrial",
        status: "ongoing",
      },
      status: "draft",
      user: "business-editor@ndr.com",
      role: "business-editor",
    });
  } catch (error) {
    duplicatePlate =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "duplicate-references");
  }
  assert(duplicatePlate, "portfolio assets reject duplicate plates");
  await shared.transition("portfolio-assets", "pune-warehouse", "published", {
    user: "business-editor@ndr.com",
    role: "business-editor",
  });

  // Metrics: canonical ledger keys unique, usages resolve to real routes.
  const metric = await shared.save({
    collectionKey: "metrics",
    data: {
      name: "Portfolio occupancy",
      key: "M17",
      value: "98%",
      period: "As on 31 March 2026",
      source: "NDR Corporate Presentation",
      usages: [{ target: "/en/investor-centre#capital-strength", label: "Capital strength" }],
    },
    status: "draft",
    user: "investor-editor@ndr.com",
    role: "investor-editor",
  });
  assert(metric.record.id === "portfolio-occupancy", "metric id resolves from its name");
  let duplicateKey = false;
  try {
    await shared.save({
      collectionKey: "metrics",
      data: {
        name: "Occupancy again",
        key: "M17",
        value: "98%",
        period: "FY26",
        source: "Source",
      },
      status: "draft",
      user: "investor-editor@ndr.com",
      role: "investor-editor",
    });
  } catch (error) {
    duplicateKey =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "duplicate-references");
  }
  assert(duplicateKey, "metrics reject duplicate canonical keys");
  let brokenUsage = false;
  try {
    await shared.save({
      collectionKey: "metrics",
      data: {
        name: "Broken usage",
        key: "M18",
        value: "1",
        period: "FY26",
        source: "Source",
        usages: [{ target: "/en/does-not-exist", label: "Nope" }],
      },
      status: "draft",
      user: "investor-editor@ndr.com",
      role: "investor-editor",
    });
  } catch (error) {
    brokenUsage =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "broken-routes");
  }
  assert(brokenUsage, "metric usages must resolve to real routes");

  // Business verticals: metric references must resolve to published metrics.
  let unpublishedMetric = false;
  try {
    await shared.save({
      collectionKey: "business-verticals",
      data: {
        title: "Grade A Warehousing",
        index: "01",
        writeup: "Institutional-grade warehousing.",
        proof: "99% greenfield",
        proofSource: "NDR Corporate Presentation",
        metrics: [{ metricKey: "M17" }],
      },
      status: "draft",
      user: "business-editor@ndr.com",
      role: "business-editor",
    });
  } catch (error) {
    unpublishedMetric =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "unpublished-linked-content");
  }
  assert(unpublishedMetric, "verticals reject references to unpublished metrics");
  await shared.transition("metrics", "portfolio-occupancy", "published", {
    user: "investor-editor@ndr.com",
    role: "investor-editor",
  });
  const vertical = await shared.save({
    collectionKey: "business-verticals",
    data: {
      title: "Grade A Warehousing",
      index: "01",
      writeup: "Institutional-grade warehousing.",
      proof: "99% greenfield",
      proofSource: "NDR Corporate Presentation",
      metrics: [{ metricKey: "M17" }],
      route: { label: "Grade A Warehousing", href: "/en/business#grade-a-warehousing" },
    },
    status: "draft",
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  assert(vertical.record.id === "grade-a-warehousing", "vertical id resolves from its title");

  // ESG initiatives: location reference required and resolvable.
  let missingLocation = false;
  try {
    await shared.save({
      collectionKey: "esg-initiatives",
      data: {
        name: "Solar programme",
        code: "IM-10",
        place: "Pune",
        category: "energy",
        status: "Operational",
        lat: 18.52,
        lon: 73.856,
      },
      status: "draft",
      user: "business-editor@ndr.com",
      role: "business-editor",
    });
  } catch (error) {
    missingLocation =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "required-completeness");
  }
  assert(missingLocation, "ESG initiatives require a location reference");
  const initiative = await shared.save({
    collectionKey: "esg-initiatives",
    data: {
      name: "Solar programme",
      code: "IM-10",
      place: "Pune",
      region: "Maharashtra",
      category: "energy",
      status: "Operational",
      locationId: "pune",
      lat: 18.52,
      lon: 73.856,
    },
    status: "draft",
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  assert(initiative.record.id === "solar-programme", "initiative id resolves from its name");
  let duplicateCode = false;
  try {
    await shared.save({
      collectionKey: "esg-initiatives",
      data: {
        name: "Solar again",
        code: "IM-10",
        place: "Pune",
        category: "energy",
        status: "Planned",
        locationId: "pune",
        lat: 18.52,
        lon: 73.856,
      },
      status: "draft",
      user: "business-editor@ndr.com",
      role: "business-editor",
    });
  } catch (error) {
    duplicateCode =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "duplicate-references");
  }
  assert(duplicateCode, "ESG initiatives reject duplicate codes");

  // Contact directory: keys unique, optional location resolves.
  const office = await shared.save({
    collectionKey: "contact-directory",
    data: {
      name: "Corporate office",
      key: "corporate",
      kind: "Corporate office",
      lines: [{ value: "T. Nagar, Chennai" }],
      phone: "+91 44 4296 1200",
      email: { label: "project@ndrsmart.com", href: "mailto:project@ndrsmart.com" },
      hours: "Monday – Saturday · 9:30 AM – 6:30 PM IST",
    },
    status: "draft",
    user: "superadmin@ndr.com",
    role: "super-admin",
  });
  assert(office.record.id === "corporate-office", "directory id resolves from its name");
  let duplicateKey2 = false;
  try {
    await shared.save({
      collectionKey: "contact-directory",
      data: {
        name: "Corporate office again",
        key: "corporate",
        kind: "Corporate office",
        phone: "+91 44 4296 1200",
        email: { label: "project@ndrsmart.com", href: "mailto:project@ndrsmart.com" },
        hours: "9:30 AM – 6:30 PM IST",
      },
      status: "draft",
      user: "superadmin@ndr.com",
      role: "super-admin",
    });
  } catch (error) {
    duplicateKey2 =
      error instanceof EditorValidationError &&
      error.issues.some((issue) => issue.rule === "duplicate-references");
  }
  assert(duplicateKey2, "contact directory rejects duplicate keys");

  // Publish the remaining shared collections so their registers export.
  await shared.transition("business-verticals", "grade-a-warehousing", "published", {
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  await shared.transition("esg-initiatives", "solar-programme", "published", {
    user: "business-editor@ndr.com",
    role: "business-editor",
  });
  await shared.transition("contact-directory", "corporate-office", "published", {
    user: "superadmin@ndr.com",
    role: "super-admin",
  });

  // Governance publish (no document/media refs) succeeds.
  await shared.transition("governance-records", governance.record.id, "published", {
    user: "superadmin@ndr.com",
    role: "super-admin",
  });

  // Deterministic export across all seven new modules: published only, stable.
  const sharedGeneratedDir = join(sharedRoot, "generated");
  const sharedGenerated = await generateMerged(sharedContent);
  const sharedNames = sharedGenerated.map((file) => file.fileName);
  for (const fileName of [
    "metrics.ts",
    "locations.ts",
    "portfolioAssets.ts",
    "businessVerticals.ts",
    "esgInitiatives.ts",
    "governanceRecords.ts",
    "contactDirectory.ts",
  ]) {
    assert(sharedNames.includes(fileName), `generated modules include ${fileName}`);
  }
  const sharedSources = sharedGenerated.map((file) => file.source).join("\n");
  assert(
    sharedSources.includes("GV-REG-001") &&
      sharedSources.includes('"key": "M17"') &&
      sharedSources.includes('"plate": "01"') &&
      sharedSources.includes('"code": "IM-10"') &&
      sharedSources.includes('"key": "corporate"'),
    "published records appear in their generated modules",
  );
  await shared.save({
    collectionKey: "metrics",
    data: {
      name: "Draft only",
      key: "M19",
      value: "1%",
      period: "FY26",
      source: "Source",
    },
    status: "draft",
    user: "investor-editor@ndr.com",
    role: "investor-editor",
  });
  const afterDraft = await generateMerged(sharedContent);
  const draftOnlySource = afterDraft.find((file) => file.fileName === "metrics.ts")?.source ?? "";
  assert(
    draftOnlySource.includes("M19") && draftOnlySource.includes('"status": "draft"'),
    "draft rows stay in the generated ledger with their status preserved",
  );
  const sharedFinal = await generateMerged(sharedContent);
  writeGenerated(sharedGeneratedDir, sharedFinal);
  const sharedGeneratedCheck = await verifyGeneratedExports(sharedContent, sharedGeneratedDir);
  assert(sharedGeneratedCheck.valid, "all generated modules are byte-identical after regeneration");
  const sharedPass2 = await generateMerged(sharedContent);
  assert(
    sharedPass2.length === sharedFinal.length &&
      sharedFinal.every((file, i) => file.source === sharedPass2[i].source),
    "shared module bytes are deterministic across passes",
  );
  const sharedChain = await sharedAudit.verify();
  assert(sharedChain.valid, "audit chain stays valid across shared collections");

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
