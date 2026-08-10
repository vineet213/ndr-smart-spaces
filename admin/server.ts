/**
 * CMS admin server — local content operations over the editor engine.
 *
 * A dependency-free Node HTTP server exposing the fourteen editors to the admin
 * SPA (admin/public/admin.html). Every write flows through
 * CollectionEditor — validation, registry references, deterministic
 * persistence, hash-chained audit — and the export endpoint regenerates the
 * managed modules then verifies byte-stability (§16.2).
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
import { AuditLog } from "../src/lib/cms/audit";
import { JsonFileStore } from "../src/lib/cms/store";
import { ReferenceRegistry } from "../src/lib/cms/registry";
import { RegistryConfig } from "../src/lib/cms/types";

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
const audit = new AuditLog(store);
const editor = new CollectionEditor(store, files, registry, audit);
const content = new ContentStore(store);

function send(res: ServerResponse, status: number, body: unknown): void {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "content-type":
      typeof body === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(payload);
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

async function handleExport(): Promise<{
  ok: boolean;
  generated: unknown[];
  generatedValid: boolean;
  contract: unknown;
  audit: unknown;
}> {
  const filesToWrite = await generateMerged(content);
  writeGenerated(GENERATED_DIR, filesToWrite);
  const generated = await verifyGeneratedExports(content, GENERATED_DIR);
  const contract = verifyExportContract(DATA_DIR);
  const chain = await audit.verify();
  return {
    ok: generated.valid && contract.stable && chain.valid,
    generated: generated.statuses,
    generatedValid: generated.valid,
    contract,
    audit: chain,
  };
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const path = url.pathname;

  if (req.method === "GET" && path === "/") {
    if (!existsSync(ADMIN_HTML))
      return send(res, 404, "admin.html missing — run `npm run cms:admin` from the project root.");
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(readFileSync(ADMIN_HTML, "utf8"));
  }

  if (req.method === "GET" && path === "/api/meta") {
    return send(res, 200, {
      schemas: EDITOR_SCHEMAS.map(
        ({ key, label, editor: kind, singleRecord, statusEnabled, refKind, description }) => ({
          key,
          label,
          editor: kind,
          singleRecord,
          statusEnabled,
          refKind,
          description,
        }),
      ),
      publicationStatuses: ["draft", "pending", "published", "archived", "external"],
    });
  }

  const collectionMatch = path.match(/^\/api\/c\/([^/]+)$/);
  const collectionAuditMatch = path.match(/^\/api\/c\/([^/]+)\/audit$/);

  if (collectionAuditMatch && req.method === "GET") {
    const collectionKey = decodeURIComponent(collectionAuditMatch[1]);
    return send(res, 200, await editor.auditFor(collectionKey));
  }

  if (collectionMatch && req.method === "GET") {
    const collectionKey = decodeURIComponent(collectionMatch[1]);
    const records = await editor.list(collectionKey);
    return send(res, 200, { collectionKey, records, audit: await editor.auditFor(collectionKey) });
  }

  if (collectionMatch && req.method === "POST") {
    const collectionKey = decodeURIComponent(collectionMatch[1]);
    const action = url.searchParams.get("action") ?? "save";
    try {
      const body = (await readJson(req)) as Record<string, unknown>;
      if (action === "save") {
        const result = await editor.save({
          collectionKey,
          id: typeof body.id === "string" ? body.id : undefined,
          data: body.data as never,
          status: body.status as never,
          file: body.file as never,
          user: String(body.user ?? "local-admin"),
          role: String(body.role ?? "super-admin"),
        });
        return send(res, 200, result);
      }
      if (action === "transition") {
        const result = await editor.transition(
          collectionKey,
          String(body.id),
          body.status as never,
          {
            user: String(body.user ?? "local-admin"),
            role: String(body.role ?? "super-admin"),
          },
        );
        return send(res, 200, result);
      }
      if (action === "delete") {
        const seq = await editor.remove(collectionKey, String(body.id), {
          user: String(body.user ?? "local-admin"),
          role: String(body.role ?? "super-admin"),
        });
        return send(res, 200, { seq });
      }
      return send(res, 400, { error: `Unknown action "${action}".` });
    } catch (error) {
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
  }

  if (req.method === "POST" && path === "/api/export") {
    try {
      return send(res, 200, await handleExport());
    } catch (error) {
      return send(res, 500, { error: error instanceof Error ? error.message : "Export failed." });
    }
  }

  if (req.method === "GET" && path === "/api/audit") {
    return send(res, 200, { entries: await audit.tail(200), chain: await audit.verify() });
  }

  return send(res, 404, "Not found.");
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
  console.log("NDR CMS admin (Phase 1.2 — shared data collections)");
  console.log(`  http://localhost:${PORT}`);
  console.log(`  editors: ${EDITOR_SCHEMAS.map((schema) => schema.key).join(", ")}`);
  console.log(`  generated modules: ${generatedModules.join(", ")}`);
  console.log("  DEV ONLY — localhost content operations, not an auth boundary.");
});
