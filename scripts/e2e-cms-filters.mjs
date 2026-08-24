/**
 * E2E — Land Bank CMS collection list filtering.
 *
 * Verifies against the real store (read-only; no saves, no transitions):
 *   - State facet derived from the dataset (All States default, 9 states,
 *     per-state counts incl. Tamil Nadu (19))
 *   - Workflow-status pills compose with state and search
 *   - Filtered result count + Clear filters control
 *   - Unfiltered list still shows all 35 records
 *   - Collections without a schema "state" select get no state facet
 *
 * Usage: node scripts/e2e-cms-filters.mjs   (admin :4173)
 */

import { join } from "node:path";
import puppeteer from "puppeteer-core";

const ADMIN = "http://localhost:4173";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const SHOT_DIR = join(process.env.TEMP ?? ".", "opencode");

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

/* Expected filter results computed independently from the store API */
const cookie = await apiLogin();
const store = await apiGet(cookie, "/api/c/land-bank");
const records = store.body.records ?? [];
const tnRecords = records.filter((r) => r.data?.state === "Tamil Nadu");
const tnDrafts = tnRecords.filter((r) => r.status === "draft");
const published = records.filter((r) => r.status === "published");
const SEARCH_TERM = "eskate";
const searchHits = (list) =>
  list.filter((r) => {
    const d = r.data;
    const text = [r.id, r.status, d.title, d.name, d.key, d.city, d.region, d.state]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(SEARCH_TERM);
  });
const tnDraftSearch = searchHits(tnDrafts);

console.log("\n── Land Bank CMS filters ──");
record("store holds 35 land-bank records", records.length === 35, `${records.length}`);
record(
  "expected fixtures present (TN=19, TN+draft=19)",
  tnRecords.length === 19 && tnDrafts.length === 19,
  `tn=${tnRecords.length} tnDraft=${tnDrafts.length}`,
);

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-first-run", "--disable-extensions"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  /* login */
  await page.goto(ADMIN, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      document.getElementById("login-overlay").style.display !== "none" ||
      !!document.querySelector(".nav-item"),
    { timeout: 20000 },
  );
  const needsLogin = await page.evaluate(
    () => document.getElementById("login-overlay").style.display !== "none",
  );
  if (needsLogin) {
    await page.type("#login-user", "admin");
    await page.type("#login-pass", "admin");
    await page.click("#login-submit");
    await page.waitForFunction(
      () => document.getElementById("login-overlay").style.display === "none",
      { timeout: 15000 },
    );
  }

  /* open Land Bank */
  await page.goto(`${ADMIN}#land-bank`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('.nav-item[data-key="land-bank"]', { visible: true, timeout: 20000 });
  await page.click('.nav-item[data-key="land-bank"]');
  await page.waitForFunction(() => document.querySelectorAll("#record-list-inner .record-row").length > 0, { timeout: 15000 });

  const readUi = () =>
    page.evaluate(() => ({
      rows: document.querySelectorAll("#record-list-inner .record-row").length,
      count: document.getElementById("record-count")?.textContent ?? "",
      selectValue: document.querySelector(".filter-bar select.filter-select")?.value ?? null,
      options: [...document.querySelectorAll(".filter-bar select.filter-select option")].map((o) => o.textContent),
      pills: [...document.querySelectorAll(".filter-pill")].map((p) => ({ label: p.textContent, active: p.classList.contains("active") })),
      searchValue: document.querySelector(".filter-bar input")?.value ?? "",
      clearVisible: (() => {
        const c = document.getElementById("clear-filters");
        return !!c && c.style.display !== "none";
      })(),
      emptyShown: !!document.querySelector("#record-list-inner .empty"),
      statuses: [...document.querySelectorAll("#record-list-inner .record-row .pill")].map((p) => p.textContent),
    }));

  /* 1 — unfiltered baseline */
  let ui = await readUi();
  record("unfiltered list shows all 35 records", ui.rows === 35 && ui.count === "35 of 35 records", ui.count);
  record("state facet defaults to All States", ui.selectValue === "all");
  record("clear control hidden without active filters", !ui.clearVisible);

  /* 2 — facet options derived from the dataset */
  const statesInStore = [...new Set(records.map((r) => r.data?.state))].sort();
  const optionStates = ui.options
    .slice(1)
    .map((t) => t.replace(/\s*\(\d+\)$/, ""))
    .sort();
  record(
    "facet lists exactly the states represented by the records",
    JSON.stringify(optionStates) === JSON.stringify(statesInStore),
    `${optionStates.length} states`,
  );
  record(
    "Tamil Nadu selectable with correct count",
    ui.options.some((o) => o === "Tamil Nadu (19)"),
    ui.options.find((o) => o.includes("Tamil Nadu")) ?? "",
  );

  /* 3 — Tamil Nadu filter */
  await page.evaluate(() => {
    const sel = document.querySelector(".filter-bar select.filter-select");
    sel.value = "Tamil Nadu";
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForFunction(() => document.querySelectorAll("#record-list-inner .record-row").length === 19, { timeout: 10000 });
  ui = await readUi();
  record("Tamil Nadu → exactly 19 rows", ui.rows === 19 && ui.count === "19 of 35 records", ui.count);
  record("clear control appears when a filter is active", ui.clearVisible);

  /* 4 — compose with workflow status: TN + draft = 19 */
  await page.evaluate(() => {
    const pill = [...document.querySelectorAll(".filter-pill")].find((b) => b.textContent.startsWith("draft"));
    pill?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  ui = await readUi();
  record(
    "Tamil Nadu + draft composes to the same 19 parcels",
    ui.rows === 19 && ui.count === "19 of 35 records" && ui.statuses.every((s) => s === "draft"),
    ui.count,
  );

  /* 5 — three-way composition: TN + draft + search */
  await page.evaluate((term) => {
    const input = document.querySelector(".filter-bar input");
    input.value = term;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, SEARCH_TERM);
  await new Promise((r) => setTimeout(r, 400));
  ui = await readUi();
  record(
    "state + status + search compose correctly",
    ui.rows === tnDraftSearch.length &&
      ui.count === `${tnDraftSearch.length} of ${records.length} records`,
    `${ui.rows} rows (expected ${tnDraftSearch.length})`,
  );
  record("search input preserved while filtered", ui.searchValue === SEARCH_TERM);

  await page.screenshot({ path: join(SHOT_DIR, "cms-filters-composed.png"), clip: { x: 0, y: 0, width: 1440, height: 1000 } });

  /* 6 — workflow-status field drives the pill: All States + published → 0 */
  await page.evaluate(() => {
    const clear = document.getElementById("clear-filters");
    clear?.click();
  });
  await page.waitForFunction(
    (n) => {
      const c = document.getElementById("record-count");
      return !!c && c.textContent === `${n} of ${n} records`;
    },
    { timeout: 10000 },
    records.length,
  );
  ui = await readUi();
  record("Clear filters resets everything", ui.rows === 35 && ui.searchValue === "" && ui.selectValue === "all" && !ui.clearVisible);
  await page.evaluate(() => {
    const pill = [...document.querySelectorAll(".filter-pill")].find((b) => b.textContent.startsWith("published"));
    pill?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  ui = await readUi();
  record(
    "workflow-status filter uses actual status (published → 0 today)",
    published.length === 0 && ui.rows === 0 && ui.emptyShown && ui.count === "0 of 35 records",
    ui.count,
  );

  /* 7 — collections without a state select stay untouched */
  await page.evaluate(() => document.getElementById("clear-filters")?.click());
  await new Promise((r) => setTimeout(r, 300));
  await page.waitForSelector('.nav-item[data-key="portfolio-assets"]', { visible: true, timeout: 20000 });
  await page.click('.nav-item[data-key="portfolio-assets"]');
  await page.waitForFunction(() => document.querySelectorAll("#record-list-inner .record-row").length > 0, { timeout: 15000 });
  ui = await readUi();
  record(
    "portfolio-assets keeps legacy bar (search + status pills, no state facet)",
    ui.selectValue === null && ui.options.length === 0 && ui.pills.length >= 2 && /^\d+ of \d+ records$/.test(ui.count),
    `${ui.pills.length} pills · ${ui.count}`,
  );

  await page.screenshot({ path: join(SHOT_DIR, "cms-filters-landbank.png"), clip: { x: 0, y: 0, width: 1440, height: 1000 } });
} finally {
  await browser.close();
}

/* 8 — read-only guarantee */
const after = await apiGet(cookie, "/api/c/land-bank");
record(
  "no records modified or published (still 35 drafts)",
  after.body.records.length === 35 && after.body.records.every((r) => r.status === "draft"),
);

console.log(`\n${failures === 0 ? "ALL CMS FILTER CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
