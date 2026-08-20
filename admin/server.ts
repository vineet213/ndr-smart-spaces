/**
 * CMS admin server — local content operations over the editor engine.
 *
 * A dependency-free Node HTTP server exposing the fourteen editors to the admin
 * SPA (admin/public/admin.html). Every write flows through
 * CollectionEditor — validation, registry references, deterministic
 * persistence, hash-chained audit — and the export endpoint regenerates the
 * managed modules then verifies byte-stability (§16.2).
 *
 * Phase 4.3 — Export chains into a deployment adapter. Export and deployment
 * are separate stages: export success does not depend on deployment, and
 * deployment failure is reported distinctly. Both actions are recorded in the
 * audit chain with the authenticated session identity.
 *
 * Phase 4.1 — All mutations require an authenticated session. Identity is
 * derived server-side from a signed session cookie; the client never supplies
 * user/role for authorization.
 *
 * DEV ONLY. Runs on localhost for content operations; not an authentication
 * boundary and never exposed publicly.
 *
 *   npm run cms:admin
 */

import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  CollectionEditor,
  ContentStore,
  FileStore,
  generateMerged,
  verifyGeneratedExports,
  EDITOR_SCHEMAS,
  writeGenerated,
} from "../src/lib/cms/editor";
import { verifyExportContract, DataModuleName } from "../src/lib/cms/export";
import { createDeploymentAdapter, DeploymentAdapter } from "../src/lib/cms/deploy";
import { AuditLog } from "../src/lib/cms/audit";
import { JsonFileStore } from "../src/lib/cms/store";
import { ReferenceRegistry } from "../src/lib/cms/registry";
import { RegistryConfig, PublicationStatus } from "../src/lib/cms/types";
import {
  authenticate,
  extractSession,
  signSessionCookie,
  destroySession,
  requirePermission,
  AuthenticationError,
  AuthorizationError,
  COOKIE_NAME,
  COOKIE_MAX_AGE,
  CmsRole,
  Session,
  DEV_CREDENTIALS,
} from "../src/lib/cms/auth";

const PORT = Number(process.env.CMS_ADMIN_PORT ?? "4173");
const ROOT = process.cwd();
const STORE_FILE = join(ROOT, ".cms-store", "content.json");
const FILES_DIR = join(ROOT, ".cms-store", "files");
const GENERATED_DIR = join(ROOT, "src", "lib", "data", "generated");
const DATA_DIR = join(ROOT, "src", "lib", "data");
const ADMIN_HTML = join(ROOT, "admin", "public", "admin.html");

const REGISTRY_DEFAULTS: RegistryConfig = {
  ref: { prefix: "PR-", width: 3, start: 4 },
  plate: { prefix: "", width: 2, start: 1 },
  fig: { prefix: "FIG-", width: 3, start: 1 },
  doc: { prefix: "DOC-", width: 3, start: 1 },
  register: { prefix: "REG-", width: 3, start: 1 },
  volume: { prefix: "", width: 1, start: 1 },
  fy: { label: "FY26" },
};

const store = new JsonFileStore(STORE_FILE);
const files = new FileStore(FILES_DIR);
const registry = new ReferenceRegistry(store, REGISTRY_DEFAULTS);
const auditLog = new AuditLog(store);
const editor = new CollectionEditor(store, files, registry, auditLog);
const content = new ContentStore(store);
const deploymentAdapter = createDeploymentAdapter();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function send(res: ServerResponse, status: number, body: unknown): void {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "content-type":
      typeof body === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(payload);
}

function sendSetCookie(res: ServerResponse, cookieValue: string): void {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${cookieValue}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${COOKIE_MAX_AGE}`,
  );
}

function sendClearCookie(res: ServerResponse): void {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`,
  );
}

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function requireSession(req: IncomingMessage): Session {
  const session = extractSession(req);
  if (!session) throw new AuthenticationError();
  return session;
}

// ─── Export handler ───────────────────────────────────────────────────────────

async function handleExport(session: {
  user: string;
  role: string;
}): Promise<{
  ok: boolean;
  generated: unknown[];
  generatedValid: boolean;
  contract: unknown;
  audit: unknown;
  export: { logged: boolean };
  deployment: { configured: boolean; deployed: boolean; provider: string; message: string };
}> {
  // Stage 1: Export (generate + write + verify)
  const filesToWrite = await generateMerged(content);
  writeGenerated(GENERATED_DIR, filesToWrite);
  const generated = await verifyGeneratedExports(content, GENERATED_DIR);
  const contract = verifyExportContract(DATA_DIR);
  const chain = await auditLog.verify();

  const exportOk = generated.valid && contract.stable && chain.valid;

  // Record export action in the audit chain
  let exportLogged = false;
  if (exportOk) {
    try {
      await auditLog.append({
        user: session.user,
        role: session.role,
        action: "export",
        collection: "metrics", // export is cross-collection; use metrics as anchor
        recordId: "export",
        after: {
          generatedValid: generated.valid,
          contractStable: contract.stable,
          fileCount: filesToWrite.length,
        },
      });
      exportLogged = true;
    } catch {
      // Audit append failure is non-fatal but logged
    }
  }

  // Stage 2: Deployment (separate from export)
  let deployment: {
    configured: boolean;
    deployed: boolean;
    provider: string;
    message: string;
  };
  try {
    const result = deploymentAdapter.deploy();
    deployment = {
      configured: result.provider !== "null",
      deployed: result.deployed,
      provider: result.provider,
      message: result.message,
    };

    // Record deploy action in the audit chain
    if (result.deployed) {
      try {
        await auditLog.append({
          user: session.user,
          role: session.role,
          action: "deploy",
          collection: "metrics",
          recordId: "deploy",
          after: { provider: result.provider, message: result.message },
        });
      } catch {
        // Audit append failure is non-fatal
      }
    }
  } catch (error) {
    deployment = {
      configured: true,
      deployed: false,
      provider: "unknown",
      message: `Deployment failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  return {
    ok: exportOk,
    generated: generated.statuses,
    generatedValid: generated.valid,
    contract,
    audit: chain,
    export: { logged: exportLogged },
    deployment,
  };
}

// ─── Server ───────────────────────────────────────────────────────────────────

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const path = url.pathname;

  try {
    // ── Public: serve admin HTML ────────────────────────────────────────────
    if (req.method === "GET" && path === "/") {
      if (!existsSync(ADMIN_HTML))
        return send(res, 404, "admin.html missing — run `npm run cms:admin` from the project root.");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      return res.end(readFileSync(ADMIN_HTML, "utf8"));
    }

    // ── Public: login ───────────────────────────────────────────────────────
    if (req.method === "POST" && path === "/api/auth/login") {
      const body = (await readJson(req)) as Record<string, unknown>;
      const user = String(body.user ?? "");
      const password = String(body.password ?? "");
      const session = authenticate(user, password);
      if (!session) {
        return send(res, 401, { error: "Invalid credentials." });
      }
      sendSetCookie(res, signSessionCookie(session.sessionId));
      return send(res, 200, {
        user: session.user,
        role: session.role,
        createdAt: session.createdAt,
      });
    }

    // ── Authenticated: session info ─────────────────────────────────────────
    if (req.method === "GET" && path === "/api/auth/session") {
      const session = extractSession(req);
      if (!session) {
        return send(res, 401, { authenticated: false });
      }
      return send(res, 200, {
        authenticated: true,
        user: session.user,
        role: session.role,
        createdAt: session.createdAt,
      });
    }

    // ── Authenticated: logout ───────────────────────────────────────────────
    if (req.method === "POST" && path === "/api/auth/logout") {
      const session = extractSession(req);
      if (session) destroySession(session.sessionId);
      sendClearCookie(res);
      return send(res, 200, { ok: true });
    }

    // ── From here: all endpoints require authentication ─────────────────────
    const session = requireSession(req);

    // ── Authenticated: meta (schema list) ───────────────────────────────────
    if (req.method === "GET" && path === "/api/meta") {
      requirePermission(session, "settings:read");
      return send(res, 200, {
        schemas: EDITOR_SCHEMAS.map(
          ({ key, label, editor: kind, singleRecord, statusEnabled, refKind, description, fields }) => ({
            key,
            label,
            editor: kind,
            singleRecord,
            statusEnabled,
            refKind,
            description,
            fields,
          }),
        ),
        publicationStatuses: ["draft", "pending", "published", "archived", "external"],
      });
    }

    // ── Collection routes ───────────────────────────────────────────────────
    const collectionMatch = path.match(/^\/api\/c\/([^/]+)$/);
    const collectionAuditMatch = path.match(/^\/api\/c\/([^/]+)\/audit$/);

    // GET /api/c/:collection/audit
    if (collectionAuditMatch && req.method === "GET") {
      requirePermission(session, "audit:read");
      const collectionKey = decodeURIComponent(collectionAuditMatch[1]);
      return send(res, 200, await editor.auditFor(collectionKey));
    }

    // GET /api/c/:collection
    if (collectionMatch && req.method === "GET") {
      requirePermission(session, "collection:read");
      const collectionKey = decodeURIComponent(collectionMatch[1]);
      const records = await editor.list(collectionKey);
      return send(res, 200, { collectionKey, records, audit: await editor.auditFor(collectionKey) });
    }

    // POST /api/c/:collection?action=...
    if (collectionMatch && req.method === "POST") {
      const collectionKey = decodeURIComponent(collectionMatch[1]);
      const action = url.searchParams.get("action") ?? "save";
      const body = (await readJson(req)) as Record<string, unknown>;

      // Server derives identity from session — never from client body.
      const ctx = { user: session.user, role: session.role };

      if (action === "save") {
        requirePermission(session, "collection:create");
        const result = await editor.save({
          collectionKey,
          id: typeof body.id === "string" ? body.id : undefined,
          data: body.data as never,
          status: body.status as never,
          file: body.file as never,
          ...ctx,
        });
        return send(res, 200, result);
      }
      if (action === "transition") {
        requirePermission(session, "collection:transition");
        const result = await editor.transition(
          collectionKey,
          String(body.id),
          body.status as never,
          ctx,
        );
        return send(res, 200, result);
      }
      if (action === "delete") {
        requirePermission(session, "collection:delete");
        const seq = await editor.remove(collectionKey, String(body.id), ctx);
        return send(res, 200, { seq });
      }
      return send(res, 400, { error: `Unknown action "${action}".` });
    }

    // ── Export (privileged) ─────────────────────────────────────────────────
    if (req.method === "POST" && path === "/api/export") {
      requirePermission(session, "export:run");
      return send(res, 200, await handleExport({ user: session.user, role: session.role }));
    }

    // ── Deploy only (privileged, re-triggers deployment without re-export) ──
    if (req.method === "POST" && path === "/api/deploy") {
      requirePermission(session, "deploy:run");
      let deployment: {
        configured: boolean;
        deployed: boolean;
        provider: string;
        message: string;
      };
      try {
        const result = deploymentAdapter.deploy();
        deployment = {
          configured: result.provider !== "null",
          deployed: result.deployed,
          provider: result.provider,
          message: result.message,
        };
        if (result.deployed) {
          await auditLog.append({
            user: session.user,
            role: session.role,
            action: "deploy",
            collection: "metrics",
            recordId: "deploy",
            after: { provider: result.provider, message: result.message },
          });
        }
      } catch (error) {
        deployment = {
          configured: true,
          deployed: false,
          provider: "unknown",
          message: `Deployment failed: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
      return send(res, 200, { ok: deployment.deployed || !deployment.configured, deployment });
    }

    // ── Audit log ───────────────────────────────────────────────────────────
    if (req.method === "GET" && path === "/api/audit") {
      requirePermission(session, "audit:read");
      return send(res, 200, { entries: await auditLog.tail(200), chain: await auditLog.verify() });
    }

    return send(res, 404, "Not found.");
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return send(res, 401, { error: error.message });
    }
    if (error instanceof AuthorizationError) {
      return send(res, 403, { error: error.message });
    }
    if (error instanceof Error) {
      const status =
        error.name === "EditorValidationError" || error.name === "EditorPermissionError"
          ? 422
          : 400;
      return send(res, status, {
        error: error.message,
        issues: (error as { issues?: unknown[] }).issues ?? [],
      });
    }
    return send(res, 500, { error: "Unknown error." });
  }
});

server.listen(PORT, () => {
  const generatedModules = [
    "navigation",
    "footer",
    "settings",
    "documents",
    "media",
    "metrics",
    "locations",
    "portfolioAssets",
    "businessVerticals",
    "esgInitiatives",
    "governanceRecords",
    "contactDirectory",
  ];
  console.log("NDR CMS admin (Phase 4.3 — publication + deployment seam)");
  console.log(`  http://localhost:${PORT}`);
  console.log(`  editors: ${EDITOR_SCHEMAS.map((schema) => schema.key).join(", ")}`);
  console.log(`  generated modules: ${generatedModules.join(", ")}`);
  console.log(`  deployment: ${process.env.DEPLOY_PROVIDER ?? "null"} (set DEPLOY_PROVIDER to enable)`);
  console.log("");
  console.log("  DEV credentials (replace with production identity provider):");
  for (const cred of DEV_CREDENTIALS) {
    console.log(`    ${cred.user} / ${cred.password} → ${cred.role}`);
  }
  console.log("");
  console.log("  DEV ONLY — localhost content operations with dev auth.");
});
