/**
 * Static file server for the Next.js export output (`out/`).
 *
 * The site is built with `output: "export"` (next.config.ts), so production
 * serving is a static host — `next start` does not apply. This zero-dependency
 * server mirrors that hosting model for local verification:
 *
 *   npm run build   → regenerates out/
 *   npm run start   → serves out/ on http://localhost:3000
 */

import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import { join, normalize, resolve, sep } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "out");
const PORT = Number(process.env.PORT ?? "3000");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

async function fileIfExists(path) {
  try {
    const stat = await fs.stat(path);
    return stat.isFile() ? path : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`).pathname,
    );
    const relative = normalize(pathname).replace(/^([/\\]|\.\.)+/, "");
    let target = await fileIfExists(resolve(OUT_DIR, relative));
    if (!target && !pathname.endsWith("/")) {
      target = await fileIfExists(resolve(OUT_DIR, relative + ".html"));
    }
    if (!target) target = await fileIfExists(join(resolve(OUT_DIR, relative), "index.html"));
    if (!target) target = await fileIfExists(join(OUT_DIR, "404.html"));
    if (!target) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }
    const status = target === join(OUT_DIR, "404.html") ? 404 : 200;
    res.writeHead(status, {
      "content-type": MIME[target.slice(target.lastIndexOf(".")).toLowerCase()] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(await fs.readFile(target));
  } catch (error) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(`Internal error: ${error instanceof Error ? error.message : String(error)}`);
  }
});

server.listen(PORT, () => {
  console.log(`Serving ${OUT_DIR} on http://localhost:${PORT}`);
});
