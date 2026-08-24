/**
 * E2E — unified Property Register UI inspection.
 *
 * Temporarily publishes all land-bank drafts (restored byte-exactly at the
 * end) so the real 35-parcel dataset drives the UI checks:
 *   - old catalogue systems are gone from /en/portfolio
 *   - exactly ONE geographic map remains
 *   - Land Bank / Under Construction are modes inside one Atlas sheet
 *   - Tamil Nadu's 19 records render in a constrained scrolling survey panel
 *     with a working View-all expansion; every record stays in the DOM
 *   - keyboard access + mobile overflow
 *
 * Usage: node scripts/e2e-register-ui.mjs   (admin :4173, site :3000, Edge)
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

console.log("\n── Unified Property Register — UI inspection ──");
const moduleBefore = readFileSync(LANDBANK_MODULE, "utf8");
const cookie = await apiLogin();

/* Publish every parcel temporarily so the real dataset drives the UI */
const list = await apiGet(cookie, "/api/c/land-bank");
const ids = (list.body.records ?? []).map((r) => r.id);
record("dataset intact before UI pass", ids.length === 35);
for (const id of ids) {
  await apiPost(cookie, "/api/c/land-bank?action=transition", { id, status: "published" });
}
const pubAll = await apiPost(cookie, "/api/publish");
record(
  "temporary Publish All completes",
  pubAll.body.ok === true && pubAll.body.stage === "done",
  `build ${((pubAll.body.build?.durationMs ?? 0) / 1000).toFixed(1)}s`,
);

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

  /* ── old systems gone ── */
  const gone = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      filingBand: text.includes("Plates in filing"),
      photoPending: text.includes("Photographic record in preparation"),
      recordPrep: text.includes("Record in preparation"),
      zoneProfile: text.includes("Zone profile"),
      registerOfAssets: text.includes("The register of assets."),
      locationsMapped: text.includes("Locations mapped"),
      operatingZones: text.includes("Operating zones"),
      standaloneUC: text.includes("Nothing under construction"),
      standaloneLBHeading: [...document.querySelectorAll("h2,h3")].some(
        (h) => h.textContent.trim() === "The land bank.",
      ),
      oldRegisterSection: !!document.querySelector("#register table"), // legacy asset table
    };
  });
  record("old 'Plates in filing' band gone", !gone.filingBand && !gone.photoPending && !gone.recordPrep);
  record("old zone sections / profiles gone", !gone.zoneProfile);
  record("old Register of Assets gone", !gone.registerOfAssets && !gone.locationsMapped && !gone.operatingZones);
  record("old asset table gone", !gone.oldRegisterSection);
  record("standalone 'The land bank.' section gone", !gone.standaloneLBHeading);
  record("full-width Under Construction empty section gone", !gone.standaloneUC);

  /* ── exactly one geographic map ── */
  const maps = await page.evaluate(() => {
    const svgs = [...document.querySelectorAll("#register svg")];
    const geoMaps = svgs.filter((s) => s.querySelectorAll("path").length >= 30);
    const pageSvgs = [...document.querySelectorAll("svg")].filter((s) => s.querySelectorAll("path").length >= 30);
    const selectable = document.querySelectorAll('#register svg path[role="button"]').length;
    return { geoInRegister: geoMaps.length, geoOnPage: pageSvgs.length, selectable };
  });
  record("exactly ONE geographic/property map on the page", maps.geoOnPage === 1 && maps.geoInRegister === 1, `${maps.geoOnPage} map(s)`);
  record("atlas states selectable (36-path survey intact)", maps.selectable === 9, `${maps.selectable} selectable`);

  /* ── unified chrome ── */
  const chrome = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('#register [role="group"] button')];
    const modeButtons = buttons.filter((b) =>
      ["Land bank", "Under construction"].includes(b.textContent.trim()),
    );
    return {
      heading: document.querySelector("#register-title")?.textContent ?? "",
      modeCount: modeButtons.length,
      provenance: document.querySelector('[class*="provenanceMeta"]')?.textContent.replace(/\s+/g, " ").trim() ?? "",
    };
  });
  record("unified atlas heading present", chrome.heading === "The property atlas.", chrome.heading);
  record("two mode controls inside one sheet", chrome.modeCount === 2);
  record("provenance bar reconciles full ledger", chrome.provenance.includes("9 states") && chrome.provenance.includes("35") && chrome.provenance.includes("471.81"), chrome.provenance);

  /* ── Tamil Nadu: constrained survey panel ── */
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('#register [role="group"] button')];
    buttons.find((b) => b.textContent.includes("Tamil Nadu"))?.click();
  });
  let tnReady = false;
  for (let i = 0; i < 24 && !tnReady; i += 1) {
    await new Promise((r) => setTimeout(r, 250));
    tnReady = await page.evaluate(
      () => document.querySelector('#register [class*="selectedState"]')?.textContent.includes("Tamil Nadu") ?? false,
    );
  }
  record("Tamil Nadu selection opens survey panel", tnReady);

  const tn = await page.evaluate(() => {
    const scroll = document.querySelector('[role="region"][aria-label*="parcel records" i], [role="region"][aria-label*="Parcel records"]');
    const rows = document.querySelectorAll('[class*="recordList"] > li');
    const viewAll = [...document.querySelectorAll("#register button")].find((b) => b.textContent.startsWith("View all"));
    return {
      rowCount: rows.length,
      constrained: scroll ? scroll.className.includes("recordConstrained") : false,
      overflows: scroll ? scroll.scrollHeight > scroll.clientHeight : false,
      clientH: scroll ? Math.round(scroll.clientHeight) : 0,
      viewAllText: viewAll?.textContent.trim() ?? null,
      viewAllExpanded: viewAll?.getAttribute("aria-expanded") ?? null,
      regionTabIndex: scroll?.getAttribute("tabindex") ?? null,
      pins: document.querySelectorAll('#register [class*="pinGroup"]').length,
      sectionH: Math.round(document.querySelector("#register").getBoundingClientRect().height),
    };
  });
  record("all 19 Tamil Nadu records render in the DOM", tn.rowCount === 19, `${tn.rowCount} rows`);
  record("survey panel is constrained and scrolls", tn.constrained && tn.overflows, `${tn.clientH}px visible`);
  record("page stays compact while collapsed", tn.sectionH < 2400, `${tn.sectionH}px section`);
  record("'View all' offered with correct count", tn.viewAllText === "View all 19 parcels", tn.viewAllText ?? "missing");
  record("panel is keyboard-scrollable (tabindex=0)", tn.regionTabIndex === "0");
  record("state pins render for selected state", tn.pins === 19, `${tn.pins} pins`);

  /* expand */
  await page.evaluate(() => {
    const viewAll = [...document.querySelectorAll("#register button")].find((b) => b.textContent.startsWith("View all"));
    viewAll?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const expanded = await page.evaluate(() => {
    const scroll = document.querySelector('#register [role="region"]');
    const viewAll = [...document.querySelectorAll("#register button")].find((b) => b.getAttribute("aria-expanded") !== null);
    const firstRow = document.querySelector('[class*="recordList"] > li');
    const lastRow = [...document.querySelectorAll('[class*="recordList"] > li')].pop();
    return {
      stillRows: document.querySelectorAll('[class*="recordList"] > li').length,
      unconstrained: scroll ? !scroll.className.includes("recordConstrained") : false,
      ariaExpanded: viewAll?.getAttribute("aria-expanded"),
      lastVisible: lastRow ? lastRow.getBoundingClientRect().height > 0 : false,
      firstName: firstRow?.textContent.slice(0, 40) ?? "",
    };
  });
  record("expansion removes the height clamp", expanded.unconstrained && expanded.ariaExpanded === "true");
  record("records not truncated by expansion", expanded.stillRows === 19 && expanded.lastVisible, `${expanded.stillRows} rows`);
  await page.screenshot({ path: join(process.env.TEMP ?? ".", "opencode", "register-tn-expanded.png"), clip: { x: 0, y: 0, width: 1440, height: 1000 } });

  /* collapse again, then exercise the map itself: reset, keyboard-activate the
     TN path (role=button + Enter), then a plain mouse click on its geometry */
  await page.evaluate(() => {
    const collapse = [...document.querySelectorAll("#register button")].find((b) => b.textContent.trim() === "Collapse");
    collapse?.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#register button")].find((b) => b.textContent.trim() === "All India" && b.className.includes("reset"));
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const zoomedState = () =>
    page.evaluate(() => {
      const g = document.querySelector('#register [class*="zoomLayer"]');
      const t = getComputedStyle(g).transform;
      const selected = !!document.querySelector('#register [class*="selectedState"]');
      return selected && t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)";
    });
  const tnPath = await page.$('#register svg path[aria-label="Tamil Nadu — survey land bank"]');
  await page.evaluate((el) => el.focus(), tnPath);
  await page.keyboard.press("Enter");
  let kbZoomed = false;
  for (let i = 0; i < 12 && !kbZoomed; i += 1) {
    await new Promise((r) => setTimeout(r, 250));
    kbZoomed = await zoomedState();
  }
  record("keyboard Enter on state path selects and animates zoom", kbZoomed);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#register button")].find((b) => b.textContent.trim() === "All India" && b.className.includes("reset"));
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  const box = await tnPath.boundingBox();
  let clickZoomed = false;
  for (const [fx, fy] of [[0.5, 0.5], [0.45, 0.55], [0.55, 0.45], [0.4, 0.5], [0.5, 0.42], [0.6, 0.55]]) {
    if (clickZoomed) break;
    await page.mouse.click(box.x + box.width * fx, box.y + box.height * fy);
    for (let i = 0; i < 8 && !clickZoomed; i += 1) {
      await new Promise((r) => setTimeout(r, 250));
      clickZoomed = await zoomedState();
    }
  }
  record("mouse click on state geometry selects (tooltip no longer intercepts)", clickZoomed);
  const resetBtn = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#register button")].find((b) => b.textContent.trim() === "All India" && b.className.includes("reset"));
    btn?.click();
    return !!btn;
  });
  record("reset/back control present and clickable", resetBtn);

  /* ── Under Construction mode ── */
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#register button")].find((b) => b.textContent.trim().startsWith("Under construction"));
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  const uc = await page.evaluate(() => {
    const empty = document.querySelector('[class*="constructionEmpty"]');
    const sheet = empty?.closest('[class*="sheet"]');
    const rect = empty ? empty.getBoundingClientRect() : null;
    const meta = document.querySelector('[class*="provenanceMeta"]')?.textContent.replace(/\s+/g, " ").trim();
    return {
      insideSheet: !!empty && !!sheet,
      height: rect ? Math.round(rect.height) : 0,
      meta,
      mapStillThere: !!document.querySelector('#register svg path[role="button"]'),
    };
  });
  record(
    "Under Construction empty state renders INSIDE the atlas sheet",
    uc.insideSheet && uc.height > 0 && uc.height < 320,
    `${uc.height}px`,
  );
  record("UC mode provenance counts projects", uc.meta === "0 projects", uc.meta);
  record("map persists across modes (one atlas)", uc.mapStillThere);
  await page.screenshot({ path: join(process.env.TEMP ?? ".", "opencode", "register-uc-mode.png"), clip: { x: 0, y: 0, width: 1440, height: 1000 } });

  /* back to land bank mode */
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#register button")].find((b) => b.textContent.trim() === "Land bank");
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const backToLB = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('#register [role="group"] button')];
    return buttons.some((b) => b.textContent.includes("Tamil Nadu"));
  });
  record("mode switch back restores state index", backToLB);

  /* ── mobile overflow ── */
  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844 });
  await mobile.goto(PUBLIC_PORTFOLIO, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  const mob = await mobile.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  record("no horizontal overflow at 390px", mob.overflow <= 1, `${mob.overflow}px`);
  await mobile.evaluate(() => document.querySelector("#register").scrollIntoView());
  await new Promise((r) => setTimeout(r, 800));
  await mobile.screenshot({ path: join(process.env.TEMP ?? ".", "opencode", "register-mobile.png"), clip: { x: 0, y: 0, width: 390, height: 844 } });
  await mobile.close();
} finally {
  await browser.close();
}

/* ── restore everything ── */
for (const id of ids) {
  await apiPost(cookie, "/api/c/land-bank?action=transition", { id, status: "draft" });
}
const pubRestore = await apiPost(cookie, "/api/publish");
record(
  "restoring Publish All completes",
  pubRestore.body.ok === true && pubRestore.body.stage === "done",
);
const after = await apiGet(cookie, "/api/c/land-bank");
record(
  "store restored: all 35 drafts",
  after.body.records.every((r) => r.status === "draft") && after.body.records.length === 35,
);
record(
  "generated landBank.ts byte-identical to pre-run state",
  readFileSync(LANDBANK_MODULE, "utf8") === moduleBefore,
);

console.log(`\n${failures === 0 ? "ALL REGISTER UI CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
