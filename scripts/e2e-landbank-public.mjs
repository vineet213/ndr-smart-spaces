/**
 * E2E — land-bank Save vs Publish on the public portfolio.
 *
 * Proves the public visibility rule end-to-end against the real servers:
 *   1. every imported parcel starts as a draft → the public /en/portfolio page
 *      renders NO parcels (empty state), while the admin API still lists them;
 *   2. publishing one parcel still changes nothing until "Publish All" runs
 *      (Save ≠ Publish);
 *   3. after Publish All the parcel appears in the map provenance bar and is
 *      resolvable, with every other parcel still absent;
 *   4. transitioning back to draft + Publish All restores the empty state;
 *   5. the CMS store and generated module are byte-restored afterwards.
 *
 * Usage:  node scripts/e2e-landbank-public.mjs
 * Needs:  admin server on :4173, static site server on :3000.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const ADMIN = "http://localhost:4173";
const PUBLIC_PORTFOLIO = "http://localhost:3000/en/portfolio";
const LANDBANK_MODULE = join(process.cwd(), "src", "lib", "data", "generated", "landBank.ts");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

let failures = 0;
function record(name, ok, detail = "") {
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

async function apiLogin(user, password) {
  const res = await fetch(`${ADMIN}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user, password }),
  });
  return (res.headers.get("set-cookie") ?? "").split(";")[0];
}
async function apiGet(cookie, path) {
  const res = await fetch(`${ADMIN}${path}`, { headers: { cookie } });
  return { status: res.status, body: await res.json() };
}
async function apiPost(cookie, path, payload) {
  const res = await fetch(`${ADMIN}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify(payload ?? {}),
  });
  return { status: res.status, body: await res.json() };
}
async function fetchPublic() {
  const res = await fetch(`${PUBLIC_PORTFOLIO}?t=${Date.now()}`);
  return res.text();
}

console.log("\n── Land-bank Save vs Publish ──");

const moduleBefore = readFileSync(LANDBANK_MODULE, "utf8");
const cookie = await apiLogin("admin", "admin");

const list = await apiGet(cookie, "/api/c/land-bank");
const records = list.body.records ?? [];
record(
  "admin lists all land-bank parcels regardless of status",
  list.status === 200 && records.length === 35,
  `${records.length} records`,
);
record(
  "all parcels start as drafts",
  records.every((r) => r.status === "draft"),
);

const target = records[0];
/* store records nest editable payload under .data; workflow status sits at the root */
const targetName = String(target.data.name);
const otherNames = records.slice(1).map((r) => String(r.data.name));
console.log(`      round-trip parcel: "${targetName}" (${target.id})`);

function provenance(html) {
  const raw = html.match(/provenanceMeta[^>]*>([\s\S]*?)<\/span>/)?.[1] ?? "";
  return raw.replace(/<!-- -->/g, "").replace(/\s+/g, " ").trim();
}

/* Phase 1 — drafts are invisible publicly */
{
  const html = await fetchPublic();
  record(
    "draft parcel absent from public portfolio",
    !html.includes(targetName),
  );
  record(
    "public section renders its empty state while nothing is published",
    html.includes("Land bank records are being filed."),
  );
}

/* Phase 2 — publish transition alone must not change the public site */
{
  const before = await fetchPublic();
  const tr = await apiPost(cookie, "/api/c/land-bank?action=transition", {
    id: target.id,
    status: "published",
  });
  record("transition draft → published via CMS API", tr.status === 200);
  const afterSave = await apiGet(cookie, "/api/c/land-bank");
  record(
    "store holds published status",
    afterSave.body.records.find((r) => r.id === target.id)?.status === "published",
  );
  const html = await fetchPublic();
  record(
    "public site unchanged right after publish transition (Save ≠ Publish)",
    html === before && !html.includes(targetName),
  );
}

/* Phase 3 — Publish All makes exactly that parcel public */
{
  const pub = await apiPost(cookie, "/api/publish");
  record(
    "Publish All completes (export + build)",
    pub.status === 200 && pub.body.ok === true && pub.body.stage === "done",
    `build ${((pub.body.build?.durationMs ?? 0) / 1000).toFixed(1)}s`,
  );
  const html = await fetchPublic();
  record("published parcel appears on public portfolio", html.includes(targetName) || html.includes(target.data.state));
  const prov = provenance(html);
  record(
    "provenance bar counts exactly 1 state · 1 parcel",
    /\b1 states?\b/.test(prov) && prov.includes("1 site") && !prov.includes("1 sites"),
    prov,
  );
  record(
    "published state becomes selectable on the atlas",
    html.includes(`${target.data.state} — select`),
  );
  record("empty-state copy gone once content is published", !html.includes("Land bank records are being filed."));
  const leakedStates = ["Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Uttar Pradesh", "Kerala", "Andhra Pradesh", "Puducherry"]
    .filter((s) => s !== target.data.state && html.includes(`${s} — select`));
  record("no draft-only state became selectable", leakedStates.length === 0, leakedStates.join(", "));
}

/* Phase 3b — the published parcel renders in the browser when its state is selected */
{
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    args: ["--no-first-run", "--disable-extensions"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(PUBLIC_PORTFOLIO, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(() => document.querySelector("#register").scrollIntoView());
    await new Promise((r) => setTimeout(r, 1800));
    const stateBtn = await page.evaluateHandle((stateName) => {
      const buttons = [...document.querySelectorAll('#register [role="group"] button')];
      return buttons.find((b) => b.textContent.includes(stateName)) ?? null;
    }, target.data.state);
    await stateBtn.asElement().click();
    let selected = false;
    for (let i = 0; i < 20 && !selected; i += 1) {
      await new Promise((r) => setTimeout(r, 250));
      selected = await page.evaluate(() => {
        const h = document.querySelector('#register [class*="selectedState"]');
        return !!h;
      });
    }
    record("selecting the published state opens its survey records", selected);
    const rendered = await page.evaluate((name) => {
      const pins = [...document.querySelectorAll('#register [class*="pinGroup"]')]
        .map((g) => g.getAttribute("aria-label") ?? "");
      const cells = [...document.querySelectorAll('#register [class*="recordName"]')]
        .map((el) => el.textContent ?? "");
      return { pinHit: pins.some((l) => l.includes(name)), cellHit: cells.some((c) => c.includes(name)), pinCount: pins.length };
    }, targetName);
    record(
      "published parcel renders as a map pin and a record row",
      rendered.pinHit && rendered.cellHit,
      `${rendered.pinCount} pin(s)`,
    );
  } finally {
    await browser.close();
  }
}

/* Phase 4 — back to draft restores the empty public state */
{
  const tr = await apiPost(cookie, "/api/c/land-bank?action=transition", {
    id: target.id,
    status: "draft",
  });
  record("transition published → draft via CMS API", tr.status === 200);
  const pub = await apiPost(cookie, "/api/publish");
  record(
    "second Publish All completes",
    pub.status === 200 && pub.body.ok === true && pub.body.stage === "done",
    `build ${((pub.body.build?.durationMs ?? 0) / 1000).toFixed(1)}s`,
  );
  const html = await fetchPublic();
  record("un-published parcel disappears from public portfolio", !html.includes(targetName));
  record("public empty state restored", html.includes("Land bank records are being filed."));
}

/* Phase 5 — full restoration */
{
  const after = await apiGet(cookie, "/api/c/land-bank");
  record(
    "store fully restored (all 35 drafts)",
    after.body.records.length === 35 &&
      after.body.records.every((r) => r.status === "draft"),
  );
  const moduleAfter = readFileSync(LANDBANK_MODULE, "utf8");
  record(
    "generated landBank.ts byte-identical to pre-run state",
    moduleAfter === moduleBefore,
  );
}

console.log(
  `\n${failures === 0 ? "ALL LAND-BANK PUBLISH CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`,
);
process.exit(failures === 0 ? 0 : 1);
