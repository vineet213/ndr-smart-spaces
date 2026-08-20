/**
 * CMS Phase 4.1 — RBAC and authentication verification.
 *
 * Exercises the auth module, permission model, and server-side enforcement
 * without requiring a running HTTP server. Tests run against the in-process
 * auth primitives and the CollectionEditor with session-derived contexts.
 *
 *   tsc -p scripts/tsconfig.cms.json && node .cms-build/scripts/cms-rbac.js
 */

import { join } from "node:path";
import {
  authenticate,
  createSession,
  destroySession,
  signSessionCookie,
  verifySessionCookie,
  requirePermission,
  AuthorizationError,
  hasPermission,
  hasRole,
  DEV_CREDENTIALS,
  CmsRole,
  CollectionEditor,
  ContentStore,
  FileStore,
  AuditLog,
  ReferenceRegistry,
  MemoryStore,
  RegistryConfig,
} from "../src/lib/cms";

/* ─── Test harness ────────────────────────────────────────────────────────── */

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed += 1;
  } else {
    failed += 1;
    failures.push(message);
    console.error(`  FAIL: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  assert(actual === expected, `${message} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function section(name: string): void {
  console.log(`\n[${name}]`);
}

/* ─── Setup ────────────────────────────────────────────────────────────────── */

const REGISTRY_DEFAULTS: RegistryConfig = {
  ref: { prefix: "PR-", width: 3, start: 4 },
  plate: { prefix: "", width: 2, start: 1 },
  fig: { prefix: "FIG-", width: 3, start: 1 },
  doc: { prefix: "DOC-", width: 3, start: 1 },
  register: { prefix: "REG-", width: 3, start: 1 },
  volume: { prefix: "", width: 1, start: 1 },
  fy: { label: "FY26" },
};

function makeEditorContext() {
  const store = new MemoryStore();
  const files = new FileStore(join(process.cwd(), ".cms-store", "files"));
  const registry = new ReferenceRegistry(store, REGISTRY_DEFAULTS);
  const audit = new AuditLog(store);
  const editor = new CollectionEditor(store, files, registry, audit);
  const content = new ContentStore(store);
  return { store, files, registry, audit, editor, content };
}

/* ─── Tests ────────────────────────────────────────────────────────────────── */

async function run(): Promise<void> {

section("Role hierarchy");
assert(hasRole("super-admin", "publisher"), "super-admin ≥ publisher");
assert(hasRole("super-admin", "editor"), "super-admin ≥ editor");
assert(hasRole("super-admin", "viewer"), "super-admin ≥ viewer");
assert(hasRole("publisher", "editor"), "publisher ≥ editor");
assert(hasRole("publisher", "viewer"), "publisher ≥ viewer");
assert(hasRole("editor", "viewer"), "editor ≥ viewer");
assert(!hasRole("viewer", "editor"), "viewer < editor");
assert(!hasRole("viewer", "publisher"), "viewer < publisher");
assert(!hasRole("editor", "publisher"), "editor < publisher");
assert(!hasRole("editor", "super-admin"), "editor < super-admin");

section("Permission matrix");
assert(hasPermission("viewer", "collection:read"), "viewer can read");
assert(!hasPermission("viewer", "collection:create"), "viewer cannot create");
assert(!hasPermission("viewer", "collection:update"), "viewer cannot update");
assert(!hasPermission("viewer", "collection:delete"), "viewer cannot delete");
assert(!hasPermission("viewer", "collection:transition"), "viewer cannot transition");
assert(!hasPermission("viewer", "export:run"), "viewer cannot export");

assert(hasPermission("editor", "collection:read"), "editor can read");
assert(hasPermission("editor", "collection:create"), "editor can create");
assert(hasPermission("editor", "collection:update"), "editor can update");
assert(!hasPermission("editor", "collection:delete"), "editor cannot delete");
assert(!hasPermission("editor", "collection:transition"), "editor cannot transition");
assert(!hasPermission("editor", "export:run"), "editor cannot export");

assert(hasPermission("publisher", "collection:read"), "publisher can read");
assert(hasPermission("publisher", "collection:create"), "publisher can create");
assert(hasPermission("publisher", "collection:update"), "publisher can update");
assert(hasPermission("publisher", "collection:transition"), "publisher can transition");
assert(hasPermission("publisher", "export:run"), "publisher can export");
assert(!hasPermission("publisher", "collection:delete"), "publisher cannot delete");

assert(hasPermission("super-admin", "collection:read"), "super-admin can read");
assert(hasPermission("super-admin", "collection:create"), "super-admin can create");
assert(hasPermission("super-admin", "collection:update"), "super-admin can update");
assert(hasPermission("super-admin", "collection:delete"), "super-admin can delete");
assert(hasPermission("super-admin", "collection:transition"), "super-admin can transition");
assert(hasPermission("super-admin", "collection:archive"), "super-admin can archive");
assert(hasPermission("super-admin", "export:run"), "super-admin can export");

section("Authentication — dev credentials");
for (const cred of DEV_CREDENTIALS) {
  const session = authenticate(cred.user, cred.password);
  assert(session !== null, `authenticate("${cred.user}", "${cred.password}") succeeds`);
  if (session) {
    assertEqual(session.user, cred.user, `session user for "${cred.user}"`);
    assertEqual(session.role, cred.role, `session role for "${cred.user}"`);
  }
}
assert(authenticate("admin", "wrong") === null, "wrong password returns null");
assert(authenticate("nobody", "admin") === null, "unknown user returns null");
assert(authenticate("", "") === null, "empty credentials returns null");

section("Session lifecycle");
const testSession = createSession("test-user", "editor");
assert(testSession.sessionId.length > 0, "session has an id");
assertEqual(testSession.user, "test-user", "session user");
assertEqual(testSession.role, "editor" as CmsRole, "session role");
const fetched = verifySessionCookie(signSessionCookie(testSession.sessionId));
assertEqual(fetched, testSession.sessionId, "signed cookie round-trips");
destroySession(testSession.sessionId);

section("Signed cookie integrity");
const sid = "abc123def456";
const signed = signSessionCookie(sid);
assert(signed.startsWith(sid + "."), "cookie has format sid.signature");
assert(verifySessionCookie(signed) === sid, "valid signature verifies");
assert(verifySessionCookie("tampered." + signed.split(".")[1]) === null, "tampered session id fails");
assert(verifySessionCookie("abc.badhex") === null, "bad hex signature fails");
assert(verifySessionCookie("noseparator") === null, "no dot fails");

section("requirePermission — allowed");
const viewerSession = createSession("viewer", "viewer");
const editorSession = createSession("editor", "editor");
const publisherSession = createSession("publisher", "publisher");
const adminSession = createSession("admin", "super-admin");

requirePermission(viewerSession, "collection:read");
requirePermission(editorSession, "collection:create");
requirePermission(publisherSession, "collection:transition");
requirePermission(adminSession, "collection:delete");
requirePermission(adminSession, "export:run");
assert(true, "requirePermission did not throw for allowed operations");

section("requirePermission — denied");
function expectDenied(fn: () => void, name: string): void {
  try {
    fn();
    assert(false, `${name} should have thrown`);
  } catch (e) {
    assert(e instanceof AuthorizationError, `${name} throws AuthorizationError`);
  }
}

expectDenied(() => requirePermission(viewerSession, "collection:create"), "viewer → create");
expectDenied(() => requirePermission(viewerSession, "collection:update"), "viewer → update");
expectDenied(() => requirePermission(viewerSession, "collection:transition"), "viewer → transition");
expectDenied(() => requirePermission(viewerSession, "export:run"), "viewer → export");
expectDenied(() => requirePermission(editorSession, "collection:transition"), "editor → transition");
expectDenied(() => requirePermission(editorSession, "export:run"), "editor → export");
expectDenied(() => requirePermission(editorSession, "collection:delete"), "editor → delete");
expectDenied(() => requirePermission(publisherSession, "collection:delete"), "publisher → delete");

section("Editor integration — archive restriction");
{
  const { editor } = makeEditorContext();
  const saved = await editor.save({
    collectionKey: "metrics",
    data: { name: "Archive Test", key: "AT1", value: "50", period: "FY26", source: "test" },
    user: "admin",
    role: "super-admin",
  });

  try {
    await editor.transition("metrics", saved.record.id, "archived", {
      user: "editor",
      role: "editor",
    });
    assert(false, "editor archive should fail");
  } catch (e) {
    assert(
      e instanceof Error && e.name === "EditorPermissionError",
      "non-super-admin archive throws EditorPermissionError",
    );
  }

  try {
    const result = await editor.transition("metrics", saved.record.id, "archived", {
      user: "admin",
      role: "super-admin",
    });
    assert(result.record.status === "archived", "super-admin archive succeeds");
  } catch (e) {
    assert(false, `super-admin archive failed: ${e}`);
  }
}

section("Archive transition — published → archived (Phase 4.1.1)");
{
  const { editor, audit } = makeEditorContext();
  const saved = await editor.save({
    collectionKey: "contact-directory",
    data: { name: "HQ", key: "hq", kind: "Corporate", lines: [{ value: "123 Main" }], phone: "000", email: { label: "a@b.com", href: "mailto:a@b.com" }, hours: "9-5" },
    user: "admin",
    role: "super-admin",
  });
  assertEqual(saved.record.status, "draft", "record starts as draft");

  await editor.transition("contact-directory", saved.record.id, "published", { user: "admin", role: "super-admin" });
  const published = await editor.get("contact-directory", saved.record.id);
  assert(published !== null && published.status === "published", "record is published");

  const result = await editor.transition("contact-directory", saved.record.id, "archived", { user: "admin", role: "super-admin" });
  assertEqual(result.record.status, "archived", "published → archived succeeds");
  assert(result.auditSeq > 0, "archive transition records audit entry");

  const archived = await editor.get("contact-directory", saved.record.id);
  assert(archived !== null && archived.status === "archived", "record is archived in store");

  const chain = await audit.verify();
  assert(chain.valid, "audit chain stays valid through archive transition");
}

section("Archive transition — no schema re-validation on status change");
{
  const { editor } = makeEditorContext();
  const saved = await editor.save({
    collectionKey: "contact-directory",
    data: { name: "Incomplete", key: "inc", kind: "Office", lines: [{ value: "Addr" }], phone: "111", email: { label: "x@y.com", href: "mailto:x@y.com" }, hours: "9-5" },
    user: "admin",
    role: "super-admin",
  });
  await editor.transition("contact-directory", saved.record.id, "published", { user: "admin", role: "super-admin" });

  try {
    const result = await editor.transition("contact-directory", saved.record.id, "archived", { user: "admin", role: "super-admin" });
    assert(result.record.status === "archived", "archive transition bypasses full-record validation");
  } catch (e) {
    assert(false, `archive transition should not require unrelated fields: ${e}`);
  }
}

section("Archive transition — publisher blocked from archive");
{
  const { editor } = makeEditorContext();
  const saved = await editor.save({
    collectionKey: "metrics",
    data: { name: "Pub Block", key: "PB1", value: "1", period: "FY26", source: "test" },
    user: "admin",
    role: "super-admin",
  });
  await editor.transition("metrics", saved.record.id, "published", { user: "admin", role: "super-admin" });

  try {
    await editor.transition("metrics", saved.record.id, "archived", { user: "publisher", role: "publisher" });
    assert(false, "publisher archive should fail");
  } catch (e) {
    assert(
      e instanceof Error && e.name === "EditorPermissionError",
      "publisher archive throws EditorPermissionError (editor-level check)",
    );
  }
}

section("Audit identity correctness");
{
  const { audit } = makeEditorContext();
  const entry = await audit.append({
    user: "real-user",
    role: "publisher",
    action: "create",
    collection: "metrics",
    recordId: "test-1",
  });
  assertEqual(entry.user, "real-user", "audit entry records correct user");
  assertEqual(entry.role, "publisher", "audit entry records correct role");

  const chain = await audit.verify();
  assert(chain.valid, "audit chain is valid after append");
}

section("Dev credentials structure");
assert(DEV_CREDENTIALS.length >= 2, "at least 2 dev credentials defined");
const devRoles = DEV_CREDENTIALS.map((c) => c.role);
assert(devRoles.includes("super-admin"), "dev credentials include super-admin");
assert(devRoles.includes("editor"), "dev credentials include editor");
assert(devRoles.includes("viewer"), "dev credentials include viewer");

} // end run()

/* ─── Main ─────────────────────────────────────────────────────────────────── */

run().then(() => {
  console.log("\n" + "═".repeat(60));
  console.log(`RBAC verification: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const f of failures) console.log(`  · ${f}`);
    process.exit(1);
  } else {
    console.log("All RBAC checks passed.");
    process.exit(0);
  }
}).catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
