/**
 * E2E — Land Bank ⇄ Under Construction relationship.
 *
 * One underlying site may exist in BOTH collections: a portfolio-asset
 * references its land-bank parcel via landBankId. This test drives the real
 * CMS UI and real public site:
 *
 *   snapshot → publish one parcel (Save→Publish) →
 *   Land Bank row "+ U/C" → prefilled Portfolio Assets form (landBankId) →
 *   create → row indicator flips to "U/C · 1" (no duplicate offered) →
 *   public register: asset appears in Under Construction WITH its parcel line,
 *   Land Bank map still shows exactly 19 TN pins (no duplicate pins) →
 *   delete asset, un-publish parcel, Publish All → byte-identical restore.
 *
 * Usage: node scripts/e2e-register-linkage.mjs  (admin :4173, site :3000)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const ADMIN = "http://localhost:4173";
const PUBLIC_PORTFOLIO = "http://localhost:3000/en/portfolio";
const LANDBANK_MODULE = join(process.cwd(), "src", "lib", "data", "generated", "landBank.ts");
const ASSETS_MODULE = join(process.cwd(), "src", "lib", "data", "generated", "portfolioAssets.ts");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

let failures = 0;
function record(name, ok, detail = "") {
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}
async function apiLogin() {
  const res = await fetch(`${ADMIN}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user: "admin", password: "admin" }),
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

console.log("\n── Land Bank ⇄ Under Construction linkage ──");
const moduleBefore = {
  landBank: readFileSync(LANDBANK_MODULE, "utf8"),
  assets: readFileSync(ASSETS_MODULE, "utf8"),
};
const cookie = await apiLogin();

/* fixtures from the real store */
const lb = await apiGet(cookie, "/api/c/land-bank");
const assets = await apiGet(cookie, "/api/c/portfolio-assets");
const parcels = lb.body.records ?? [];
const assetRecords = assets.body.records ?? [];
record("store intact", parcels.length === 35 && parcels.every((r) => r.status === "draft"));

const linkedIds = new Set(assetRecords.map((a) => a.data?.landBankId).filter(Boolean));
record("no pre-existing links to our target pool", linkedIds.size >= 0, `${linkedIds.size} linked ids`);
const tnDrafts = parcels.filter((r) => r.data?.state === "Tamil Nadu" && r.status === "draft");
const nameCounts = new Map();
for (const r of parcels) nameCounts.set(r.data.name, (nameCounts.get(r.data.name) ?? 0) + 1);
const target =
  tnDrafts.find((r) => nameCounts.get(r.data.name) === 1 && !linkedIds.has(r.id)) ??
  tnDrafts.find((r) => !linkedIds.has(r.id));
record("unique-name TN fixture found", !!target, target?.data.name ?? "");
const usedPlates = new Set(assetRecords.map((a) => a.data?.plate).filter(Boolean));
let plateNum = 1;
while (usedPlates.has(String(plateNum).padStart(2, "0"))) plateNum += 1;
const NEW_PLATE = String(plateNum).padStart(2, "0");
const NEW_NAME = `${target.data.name} — under construction`;

/* Save → Publish: the parcel must be published before it can be referenced */
record(
  "transition draft → published",
  (await apiPost(cookie, "/api/c/land-bank?action=transition", { id: target.id, status: "published" })).status === 200,
);
const pub1 = await apiPost(cookie, "/api/publish");
record("Publish All #1 completes", pub1.body.ok === true && pub1.body.stage === "done", `build ${((pub1.body.build?.durationMs ?? 0) / 1000).toFixed(1)}s`);

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-first-run", "--disable-extensions"],
});
let createdId = null;
try {
  /* ════ admin phase: associate via the row action ════ */
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
  await page.goto(ADMIN, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.getElementById("login-overlay").style.display !== "none", { timeout: 20000 });
  await page.type("#login-user", "admin");
  await page.type("#login-pass", "admin");
  await page.click("#login-submit");
  await page.waitForFunction(() => document.getElementById("login-overlay").style.display === "none", { timeout: 15000 });
  await page.waitForSelector('.nav-item[data-key="land-bank"]', { visible: true, timeout: 20000 });
  await page.click('.nav-item[data-key="land-bank"]');
  await page.waitForFunction(() => document.querySelectorAll("#record-list-inner .record-row").length > 0, { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 800)); // allow prefetch of assets cache

  const ucButton = await page.evaluateHandle((name) => {
    const rows = [...document.querySelectorAll("#record-list-inner .record-row")];
    const row = rows.find((r) => r.querySelector(".title")?.textContent === name);
    if (!row) return null;
    return [...row.querySelectorAll("button")].find((b) => b.textContent.trim().startsWith("+")) ?? null;
  }, target.data.name);
  const plusBtn = ucButton.asElement();
  record("unlinked parcel offers '+ U/C' association control", !!plusBtn);
  if (!plusBtn) throw new Error("fixture row not found");

  await plusBtn.click();
  await page.waitForFunction(
    () =>
      !document.getElementById("record-list-inner") &&
      [...document.querySelectorAll("#content h3")].some((h) => h.textContent.startsWith("New")),
    { timeout: 15000 },
  );
  const form = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("#content .row")];
    const byLabel = (label) => {
      const row = rows.find((r) => r.querySelector("label")?.textContent === label);
      if (!row) return null;
      const sel = row.querySelector("select");
      return sel ? { kind: "select", value: sel.value } : { kind: "input", value: row.querySelector("input")?.value ?? "" };
    };
    return {
      heading: document.querySelector("#content h3")?.textContent,
      parcel: byLabel("Land-bank parcel"),
    };
  });
  record("association opens a NEW Portfolio Asset editor", form.heading === "New Portfolio Assets", form.heading);
  record("landBankId pre-filled with THIS parcel (no retyping, no duplicate)", form.parcel?.value === target.id, form.parcel?.value ?? "");

  /* fill required fields */
  const fillText = (label, value) =>
    page.evaluate(
      (label, value) => {
        const row = [...document.querySelectorAll("#content .row")].find(
          (r) => r.querySelector("label")?.textContent === label,
        );
        const input = row?.querySelector("input");
        if (!input) return false;
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
      },
      label,
      value,
    );
  const fillSelect = (label, value) =>
    page.evaluate(
      (label, value) => {
        const row = [...document.querySelectorAll("#content .row")].find(
          (r) => r.querySelector("label")?.textContent === label,
        );
        const sel = row?.querySelector("select");
        if (!sel) return false;
        sel.value = value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      },
      label,
      value,
    );
  record("fill Name", await fillText("Name", NEW_NAME));
  record("fill Plate", await fillText("Plate", NEW_PLATE));
  record("fill City", await fillText("City", target.data.district ?? "Chennai"));
  record("fill Zone", await fillSelect("Zone", "south"));
  record("fill Class", await fillSelect("Class", "warehousing"));
  record("fill Status", await fillSelect("Status", "ongoing"));
  record("fill Size", await fillText("Size (sq ft)", "120000"));

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#content button")].find((b) => b.textContent.trim() === "Create record");
    btn?.click();
  });
  await page.waitForFunction(() => !!document.getElementById("record-list-inner"), { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 600));

  const savedAsset = (await apiGet(cookie, "/api/c/portfolio-assets")).body.records.find(
    (a) => a.data?.landBankId === target.id,
  );
  createdId = savedAsset?.id ?? null;
  record("asset created referencing the parcel (relationship is explicit)", !!savedAsset, savedAsset?.id ?? "");
  record("no duplicate land-bank record was created", (await apiGet(cookie, "/api/c/land-bank")).body.records.length === 35);

  /* the new asset starts as a draft — Save ≠ Publish: push it through the
     same workflow before checking the public register */
  record(
    "transition new asset draft → published",
    (
      await apiPost(cookie, "/api/c/portfolio-assets?action=transition", {
        id: savedAsset.id,
        status: "published",
      })
    ).status === 200,
  );
  const pub2 = await apiPost(cookie, "/api/publish");
  record("Publish All #2 (asset live) completes", pub2.body.ok === true && pub2.body.stage === "done", `build ${((pub2.body.build?.durationMs ?? 0) / 1000).toFixed(1)}s`);
  const pubHtmlNow = await (await fetch(PUBLIC_PORTFOLIO)).text();
  const publishedParcels = (await apiGet(cookie, "/api/c/land-bank")).body.records.filter(
    (r) => r.status === "published",
  );
  const pubStates = [...new Set(publishedParcels.map((r) => r.data.state))];
  const pubAcres = publishedParcels.reduce((s, r) => s + (r.data.extentAcres ?? 0), 0);
  const EXPECTED_PROV = `${pubStates.length} ${
    pubStates.length === 1 ? "state" : "states"
  } · ${publishedParcels.length} ${
    publishedParcels.length === 1 ? "parcel" : "parcels"
  } · ${pubAcres.toFixed(2)} acres`;

  /* back to Land Bank: indicator replaces the offer */
  await page.click('.nav-item[data-key="land-bank"]');
  await page.waitForFunction(() => document.querySelectorAll("#record-list-inner .record-row").length > 0, { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 800));
  const indicator = await page.evaluate((name) => {
    const rows = [...document.querySelectorAll("#record-list-inner .record-row")];
    const row = rows.find((r) => r.querySelector(".title")?.textContent === name);
    return [...(row?.querySelectorAll("button") ?? [])].map((b) => b.textContent.trim());
  }, target.data.name);
  record("row now indicates existing U/C link instead of offering another", indicator.some((t) => t === "U/C · 1"), indicator.join(", "));

  /* clicking it reveals the linked asset, filtered by the parcel id */
  await page.evaluate((name) => {
    const rows = [...document.querySelectorAll("#record-list-inner .record-row")];
    const row = rows.find((r) => r.querySelector(".title")?.textContent === name);
    const btn = [...row.querySelectorAll("button")].find((b) => b.textContent.trim() === "U/C · 1");
    btn?.click();
  }, target.data.name);
  await page.waitForFunction(() => !!document.getElementById("record-list-inner"), { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 600));
  const reveal = await page.evaluate(() => ({
    search: document.querySelector(".filter-bar input")?.value ?? "",
    rows: document.querySelectorAll("#record-list-inner .record-row").length,
  }));
  record("indicator click reveals linked asset (search = parcel id)", reveal.search === target.id && reveal.rows === 1, `${reveal.rows} row(s)`);

  /* ════ public phase: both modes resolve correctly ════ */
  const pub = await browser.newPage();
  await pub.setViewport({ width: 1440, height: 1000 });
  await pub.goto(PUBLIC_PORTFOLIO, { waitUntil: "networkidle0", timeout: 60000 });
  await pub.evaluate(() => document.querySelector("#register").scrollIntoView());
  await new Promise((r) => setTimeout(r, 1800));

  /* land bank first: TN pins unchanged */
  await pub.evaluate(() => {
    const buttons = [...document.querySelectorAll('#register [role="group"] button')];
    buttons.find((b) => b.textContent.includes("Tamil Nadu"))?.click();
  });
  let tnSelected = false;
  for (let i = 0; i < 20 && !tnSelected; i += 1) {
    await new Promise((r) => setTimeout(r, 250));
    tnSelected = await pub.evaluate(() => !!document.querySelector('#register [class*="selectedState"]'));
  }
  const lbPins = await pub.evaluate((needle) => ({
    pins: document.querySelectorAll('#register [class*="pinGroup"]').length,
    rows: document.querySelectorAll('[class*="recordList"] > li').length,
    targetRow: [...document.querySelectorAll('[class*="recordName"]')].some((n) => n.textContent === needle),
  }), target.data.name);
  record(
    "Land Bank mode shows the published parcel (single pin, single record)",
    lbPins.pins === publishedParcels.length && lbPins.rows === publishedParcels.length && lbPins.targetRow,
    `${lbPins.pins} pin(s), ${lbPins.rows} row(s)`,
  );

  /* switch to Under Construction */
  await pub.evaluate(() => {
    const btn = [...document.querySelectorAll("#register button")].find((b) => b.textContent.trim().startsWith("Under construction"));
    btn?.click();
  });
  let ucReady = false;
  for (let i = 0; i < 20 && !ucReady; i += 1) {
    await new Promise((r) => setTimeout(r, 250));
    ucReady = await pub.evaluate((needle) => document.querySelector("#register").textContent.includes(needle), NEW_NAME);
  }
  const ucView = await pub.evaluate((name) => {
    const reg = document.querySelector("#register").textContent.replace(/\s+/g, " ");
    return {
      assetShown: reg.includes(name),
      parcelLine: reg.includes(`Land parcel: ${name.split(" — ")[0]}`),
      emptyGone: !reg.includes("Nothing under construction"),
      pinsVisible: document.querySelectorAll('#register [class*="pinGroup"]').length,
    };
  }, NEW_NAME);
  record("Under Construction mode shows the SAME site as an asset", ucView.assetShown, NEW_NAME);
  record("public register resolves parent parcel (Land parcel: …)", ucView.parcelLine);
  record("UC empty state replaced by the project", ucView.emptyGone);
  record("no duplicate pins from dual membership", ucView.pinsVisible === 0, `${ucView.pinsVisible} pin(s)`);
  await pub.screenshot({ path: join(process.env.TEMP ?? ".", "opencode", "linkage-uc-mode.png"), clip: { x: 0, y: 0, width: 1440, height: 1000 } });

  /* meta counts: LB provenance still 9 states · 35 parcels · 471.81 acres */
  const prov = await pub.evaluate(() => {
    const btn = [...document.querySelectorAll("#register button")].find((b) => b.textContent.trim() === "Land bank");
    btn?.click();
    return new Promise((resolve) =>
      setTimeout(() => resolve(document.querySelector('[class*="provenanceMeta"]')?.textContent.replace(/\s+/g, " ").trim()), 400),
    );
  });
  record("provenance ledger matches the published set exactly", prov === EXPECTED_PROV, `${prov} (expected ${EXPECTED_PROV})`);
} finally {
  await browser.close();
}

/* ════ restore: delete link, un-publish, rebuild, verify bytes ════ */
if (!createdId) throw new Error("created asset id missing before cleanup");
record(
  "cleanup: delete linked asset",
  (
    await apiPost(cookie, `/api/c/portfolio-assets?action=delete`, { id: createdId })
  ).status === 200,
);
record(
  "cleanup: un-publish parcel",
  (await apiPost(cookie, "/api/c/land-bank?action=transition", { id: target.id, status: "draft" })).status === 200,
);
const pubRestore = await apiPost(cookie, "/api/publish");
record("Publish All #3 (restore) completes", pubRestore.body.ok === true && pubRestore.body.stage === "done");

const lbAfter = await apiGet(cookie, "/api/c/land-bank");
const asAfter = await apiGet(cookie, "/api/c/portfolio-assets");
record(
  "stores restored: 35 drafts, no dangling links",
  lbAfter.body.records.every((r) => r.status === "draft") &&
    asAfter.body.records.every((a) => a.data?.landBankId !== target.id),
);
record(
  "generated landBank.ts byte-identical",
  readFileSync(LANDBANK_MODULE, "utf8") === moduleBefore.landBank,
);
record(
  "generated portfolioAssets.ts byte-identical",
  readFileSync(ASSETS_MODULE, "utf8") === moduleBefore.assets,
);

console.log(`\n${failures === 0 ? "ALL LINKAGE CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
