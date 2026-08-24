/**
 * E2E — CMS list filters survive save/publish/edit navigation.
 *
 * Uses the real store via the real UI:
 *   1. Land Bank + Tamil Nadu + draft + search
 *   2. Publish a filtered row (UI action, confirm modal)
 *   3. List reloads → filters intact, count updated
 *   4. Public site untouched (Save ≠ Publish — no export ran)
 *   5. Edit → Back keeps filters
 *   6. Clear filters restores the full collection
 *   All mutations reverted (published → draft) before exit.
 *
 * Usage: node scripts/e2e-filter-persistence.mjs   (admin :4173, site :3000)
 */

import puppeteer from "puppeteer-core";

const ADMIN = "http://localhost:4173";
const PUBLIC_PORTFOLIO = "http://localhost:3000/en/portfolio";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const SEARCH_TERM = "eskate";

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
async function apiTransition(cookie, id, status) {
  const res = await fetch(`${ADMIN}/api/c/land-bank?action=transition`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ id, status }),
  });
  return res.status;
}

console.log("\n── Filter persistence across publish/edit navigation ──");
const cookie = await apiLogin();
const store = await apiGet(cookie, "/api/c/land-bank");
const records = store.body.records ?? [];
const tnDrafts = records.filter(
  (r) => r.data?.state === "Tamil Nadu" && r.status === "draft",
);
const searchHits = tnDrafts.filter((r) => {
  const d = r.data;
  const text = [r.id, r.status, d.name, d.city, d.region, d.state]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return text.includes(SEARCH_TERM);
});
record("fixture: TN drafts matching search", searchHits.length >= 2, `${searchHits.length} hits`);
const target = searchHits[0];
record("fixture chosen", !!target, target?.data.name ?? "");

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-first-run", "--disable-extensions"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(ADMIN, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.getElementById("login-overlay").style.display !== "none" || !!document.querySelector(".nav-item"),
    { timeout: 20000 },
  );
  if (
    await page.evaluate(() => document.getElementById("login-overlay").style.display !== "none")
  ) {
    await page.type("#login-user", "admin");
    await page.type("#login-pass", "admin");
    await page.click("#login-submit");
    await page.waitForFunction(() => document.getElementById("login-overlay").style.display === "none", {
      timeout: 15000,
    });
  }
  await page.goto(`${ADMIN}#land-bank`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('.nav-item[data-key="land-bank"]', { visible: true, timeout: 20000 });
  await page.click('.nav-item[data-key="land-bank"]');
  await page.waitForFunction(() => document.querySelectorAll("#record-list-inner .record-row").length > 0, {
    timeout: 15000,
  });

  const readUi = () =>
    page.evaluate(() => ({
      rows: document.querySelectorAll("#record-list-inner .record-row").length,
      count: document.getElementById("record-count")?.textContent ?? "",
      selectValue: document.querySelector(".filter-bar select.filter-select")?.value ?? null,
      activePill:
        [...document.querySelectorAll(".filter-pill")].find((p) => p.classList.contains("active"))
          ?.textContent ?? null,
      searchValue: document.querySelector(".filter-bar input")?.value ?? "",
      clearVisible: (() => {
        const c = document.getElementById("clear-filters");
        return !!c && c.style.display !== "none";
      })(),
    }));

  /* apply the three composed filters */
  await page.evaluate(() => {
    const sel = document.querySelector(".filter-bar select.filter-select");
    sel.value = "Tamil Nadu";
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForFunction((n) => document.querySelectorAll("#record-list-inner .record-row").length === n, { timeout: 10000 }, tnDrafts.length);
  await page.evaluate(() => {
    const pill = [...document.querySelectorAll(".filter-pill")].find((b) => b.textContent.startsWith("draft"));
    pill?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate((term) => {
    const input = document.querySelector(".filter-bar input");
    input.value = term;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, SEARCH_TERM);
  await page.waitForFunction((n) => document.querySelectorAll("#record-list-inner .record-row").length === n, { timeout: 10000 }, searchHits.length);

  /* ── 1. publish a filtered row from the collection view ── */
  const rowButton = await page.evaluateHandle((name) => {
    for (const row of document.querySelectorAll("#record-list-inner .record-row")) {
      if (row.textContent.includes(name)) {
        return [...row.querySelectorAll("button.mini")].find((b) => b.textContent.trim() === "Publish") ?? null;
      }
    }
    return null;
  }, target.data.name);
  const publishBtn = rowButton.asElement();
  if (!publishBtn) {
    const diag = await page.evaluate((name) => {
      const rows = [...document.querySelectorAll("#record-list-inner .record-row")];
      const match = rows.find((row) => row.textContent.includes(name));
      return {
        count: document.getElementById("record-count")?.textContent,
        sel: document.querySelector(".filter-select")?.value,
        activePill: [...document.querySelectorAll(".filter-pill")].find((p) => p.classList.contains("active"))?.textContent,
        search: document.querySelector(".filter-bar input")?.value,
        rowCount: rows.length,
        matchedRow: !!match,
        btns: match ? [...match.querySelectorAll("button")].map((b) => `${b.className}:${b.textContent.trim()}`) : null,
      };
    }, target.data.name);
    console.log("  DIAG:", JSON.stringify(diag, null, 2));
  }
  record("Publish action available on filtered row", !!publishBtn);
  await publishBtn.click();
  await page.waitForFunction(() => {
    const o = document.getElementById("modal-overlay");
    return o && o.style.display !== "none";
  }, { timeout: 10000 });
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#modal-overlay button")].find(
      (b) => b.textContent.trim() === "Publish",
    );
    btn?.click();
  });

  /* list reloads with the SAME filters */
  const expectedAfter = searchHits.length - 1;
  let uiOk = false;
  let ui = null;
  for (let i = 0; i < 30 && !uiOk; i += 1) {
    await new Promise((r) => setTimeout(r, 300));
    ui = await readUi();
    uiOk =
      ui.selectValue === "Tamil Nadu" &&
      ui.activePill?.startsWith("draft") &&
      ui.searchValue === SEARCH_TERM &&
      ui.count === `${expectedAfter} of ${records.length} records`;
  }
  record("filters survive Publish (state/status/search)", ui.selectValue === "Tamil Nadu" && ui.activePill?.startsWith("draft") && ui.searchValue === SEARCH_TERM, `sel=${ui.selectValue} pill=${ui.activePill} q=${ui.searchValue}`);
  record("count updates to reflect new status", ui.count === `${expectedAfter} of ${records.length} records`, ui.count);
  record("row left the draft filter after publishing", ui.rows === expectedAfter, `${ui.rows} rows`);

  const stored = await apiGet(cookie, "/api/c/land-bank");
  const nowPublished = stored.body.records.find((r) => r.id === target.id)?.status;
  record("workflow status actually changed in the store", nowPublished === "published", nowPublished);

  /* Save ≠ Publish: public site must NOT know yet */
  const pubHtml = await (await fetch(PUBLIC_PORTFOLIO)).text();
  record("public site unchanged by Save-side transition (no export)", !pubHtml.includes(target.data.name));

  /* restore */
  record("restore transition published → draft", (await apiTransition(cookie, target.id, "draft")) === 200);

  /* ── 2. edit → back keeps filters (continuing on the live filtered view) ── */
  const editBtn = await page.evaluateHandle(() =>
    [...document.querySelectorAll("#record-list-inner .record-row button")]
      .find((b) => b.textContent.trim() === "Edit"),
  );
  await editBtn.asElement().click();
  await page.waitForFunction(
    () =>
      !document.getElementById("record-list-inner") &&
      [...document.querySelectorAll("#content button")].some((b) => b.textContent.includes("Back")),
    { timeout: 15000 },
  );
  const backBtn = await page.evaluateHandle(() =>
    [...document.querySelectorAll("#content button")].find((b) => b.textContent.includes("Back")),
  );
  await backBtn.asElement().click();
  await page.waitForFunction(() => !!document.getElementById("record-list-inner"), { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 400));
  ui = await readUi();
  record(
    "Edit → Back preserves state/status/search filters",
    ui.selectValue === "Tamil Nadu" && ui.activePill?.startsWith("draft") && ui.searchValue === SEARCH_TERM,
    `sel=${ui.selectValue} pill=${ui.activePill} q=${ui.searchValue}`,
  );

  /* ── 3. clear restores everything ── */
  await page.evaluate(() => document.getElementById("clear-filters")?.click());
  await page.waitForFunction(
    (n) => document.getElementById("record-count")?.textContent === `${n} of ${n} records`,
    { timeout: 10000 },
    records.length,
  );
  ui = await readUi();
  record(
    "Clear filters returns the complete collection",
    ui.rows === records.length && ui.count === `${records.length} of ${records.length} records` &&
      ui.selectValue === "all" && ui.searchValue === "" && !ui.clearVisible,
    ui.count,
  );
} finally {
  await browser.close();
}

/* final read-only guarantee */
const after = await apiGet(cookie, "/api/c/land-bank");
record(
  "store fully restored (35 drafts)",
  after.body.records.length === 35 && after.body.records.every((r) => r.status === "draft"),
);

console.log(`\n${failures === 0 ? "ALL FILTER-PERSISTENCE CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
