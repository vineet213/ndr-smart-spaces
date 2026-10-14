/**
 * Local stand-in for public/api/contact.php (no PHP needed).
 *
 * Implements the same contract — honeypot, time-trap, consent, Turnstile token
 * present, per-IP rate limit, field validation, JSON responses — but instead of
 * mailing it writes each message it would send (the enquiry and the visitor's
 * auto-reply) as JSON to .contact-outbox/. Recipients and the from-address are
 * read from public/api/config.php (or config.example.php), as on the server.
 *
 *   npm start            → serve-static.mjs routes POST /api/contact.php here
 *   npm run contact:mock → standalone on http://localhost:3200 for `next dev`
 */

import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const OUTBOX = join(ROOT, ".contact-outbox");
const RATE_MAX = 5;
const RATE_WINDOW_MS = 3600_000;
const MIN_FILL_MS = 3000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+]?[\d\s().-]+$/;

const hitsByIp = new Map();

function readConfig() {
  const file = ["config.php", "config.example.php"]
    .map((name) => join(ROOT, "public", "api", name))
    .find((path) => existsSync(path));
  const source = file ? readFileSync(file, "utf8") : "";
  const list = source.match(/'default'\s*=>\s*\[([^\]]*)\]/)?.[1] ?? "";
  return {
    recipients: [...list.matchAll(/'([^']+@[^']+)'/g)].map((match) => match[1]),
    fromEmail: source.match(/'from_email'\s*=>\s*'([^']+)'/)?.[1] ?? "no-reply@example.com",
  };
}

const line = (data, key, max) =>
  String(data.get(key) ?? "")
    .trim()
    .replace(/[\r\n]+/g, " ")
    .slice(0, max);

function send(res, status, body, cors) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...(cors ? { "Access-Control-Allow-Origin": "*" } : {}),
  });
  res.end(JSON.stringify(body));
}

function writeOutbox(kind, message) {
  mkdirSync(OUTBOX, { recursive: true });
  const file = join(OUTBOX, `${new Date().toISOString().replace(/[:.]/g, "-")}-${kind}.json`);
  writeFileSync(file, JSON.stringify(message, null, 2));
  return file;
}

/** Handles one POST to the enquiry endpoint. */
export async function handleContact(req, res, { cors = false } = {}) {
  if (req.method === "OPTIONS" && cors) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "method" }, cors);

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const data = await new Request("http://local/", {
    method: "POST",
    headers: { "content-type": req.headers["content-type"] ?? "" },
    body: Buffer.concat(chunks),
  })
    .formData()
    .catch(() => new FormData());

  // Bots: report success, send nothing.
  const renderedAt = Number(data.get("t") ?? 0);
  if (line(data, "website", 200) || !renderedAt || Date.now() - renderedAt < MIN_FILL_MS) {
    console.log("contact-mock: dropped as bot (honeypot or too fast)");
    return send(res, 200, { ok: true }, cors);
  }

  const ip = req.socket.remoteAddress ?? "unknown";
  const hits = (hitsByIp.get(ip) ?? []).filter((at) => at > Date.now() - RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) return send(res, 429, { ok: false, error: "rate_limited" }, cors);

  const form = line(data, "form", 40) === "contact" ? "contact" : "homepage";
  const fields = {
    name: line(data, "name", 120),
    email: line(data, "email", 200),
    company: line(data, "company", 160),
    phone: line(data, "phone", 40),
    enquiryType: line(data, "enquiryType", 120),
  };
  const message = String(data.get("message") ?? "").trim().slice(0, 5000);
  const invalid =
    !fields.name ||
    !fields.company ||
    !EMAIL.test(fields.email) ||
    (fields.phone && !PHONE.test(fields.phone)) ||
    (form === "homepage" && !fields.enquiryType);
  if (invalid) return send(res, 422, { ok: false, error: "invalid" }, cors);
  if (data.get("consent") !== "yes") return send(res, 422, { ok: false, error: "consent" }, cors);
  if (!data.get("cf-turnstile-response")) {
    return send(res, 403, { ok: false, error: "verification" }, cors);
  }

  const { recipients, fromEmail } = readConfig();
  const enquiry = writeOutbox("enquiry", {
    to: recipients,
    from: fromEmail,
    replyTo: `${fields.name} <${fields.email}>`,
    subject: `Website enquiry: ${fields.enquiryType || "General"} (${fields.name}, ${fields.company})`,
    source: form === "contact" ? "Contact page" : "Homepage",
    fields,
    message,
  });
  writeOutbox("autoreply", {
    to: fields.email,
    from: fromEmail,
    subject: "We've received your enquiry: NDR Smart Spaces",
  });
  hitsByIp.set(ip, [...hits, Date.now()]);
  console.log(`contact-mock: enquiry for ${recipients.join(", ")} → ${enquiry}`);
  return send(res, 200, { ok: true }, cors);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const port = Number(process.env.CONTACT_MOCK_PORT ?? "3200");
  createServer((req, res) => {
    if (new URL(req.url ?? "/", "http://local").pathname !== "/api/contact.php") {
      return send(res, 404, { ok: false, error: "not_found" }, true);
    }
    handleContact(req, res, { cors: true }).catch((error) => {
      console.error(error);
      send(res, 500, { ok: false, error: "unknown" }, true);
    });
  }).listen(port, () => {
    console.log(`contact-mock on http://localhost:${port}/api/contact.php (outbox: .contact-outbox/)`);
  });
}
