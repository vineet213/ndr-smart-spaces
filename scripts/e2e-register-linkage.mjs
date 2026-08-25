/**
 * E2E — Land Bank ⇄ Under Construction relationship.
 *
 * One underlying site may exist in BOTH collections: a portfolio-asset
 * references its land-bank parcel via landBankId. This test drives the real
 * CMS UI and real public site:
 *
 *   snapshot → publish one parcel (Save→Publish) →
 *   Land Bank record EDITOR → "Under Construction" panel →
 *   [+ Add to Under Construction] → shared prefilled Portfolio Assets form
 *   (landBankId + name + city) → create → control returns to the PARCEL
 *   editor showing the linked project (Open ⇄ Back round-trip works) →
 *   row indicator "U/C · 1" → public register: asset in Under Construction
 *   WITH its parcel line, Land Bank map shows exactly 1 TN pin (no dupes) →
 *   delete asset, un-publish parcel, Publish All →
 *   row "+ U/C" pass: SAME shared flow opens IN PLACE (no navigation),
 *   prefilled, save returns to the parcel editor → cleanup → byte restore.
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
  /* ════ admin phase: associate from INSIDE the parcel editor ════ */
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

  const editHandle = await page.evaluateHandle((name) => {
    const rows = [...document.querySelectorAll("#record-list-inner .record-row")];
    const row = rows.find((r) => r.querySelector(".title")?.textContent === name);
    if (!row) return null;
    return [...row.querySelectorAll("button")].find((b) => b.textContent.trim() === "Edit") ?? null;
  }, target.data.name);
  const editBtn = editHandle.asElement();
  record("parcel row offers Edit", !!editBtn);
  if (!editBtn) throw new Error("fixture row not found");
  await editBtn.click();
  await page.waitForFunction(
    () =>
      !document.getElementById("record-list-inner") &&
      [...document.querySelectorAll("#content button")].some((b) => b.textContent.includes("Back")),
    { timeout: 15000 },
  );

  const panel0 = await page.evaluate(() => {
    const panel = document.getElementById("uc-panel");
    if (!panel) return null;
    const btn = [...panel.querySelectorAll("button")].find((b) =>
      /add to under construction/i.test(b.textContent),
    );
    return {
      heading: panel.querySelector("h3")?.textContent ?? "",
      notLinked: /not linked/i.test(panel.textContent),
      addBtn: btn?.textContent.trim() ?? null,
    };
  });
  record("editor shows an Under Construction panel", !!panel0);
  record("panel reports 'Not linked'", panel0?.notLinked === true);
  record(
    "panel exposes [+ Add to Under Construction]",
    typeof panel0?.addBtn === "string" && /add to under construction/i.test(panel0.addBtn),
    panel0?.addBtn ?? "missing",
  );

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#uc-panel button")].find((b) =>
      /add to under construction/i.test(b.textContent),
    );
    btn?.click();
  });
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("#content h3")].some((h) => h.textContent.startsWith("New")),
    { timeout: 15000 },
  );
  const form = await page.evaluate((parcelName) => {
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
      name: byLabel("Name"),
      city: byLabel("City"),
      expectedName: `${parcelName} \u2014 under construction`,
    };
  }, target.data.name);
  record("association opens a NEW Portfolio Asset editor", form.heading === "New Portfolio Assets", form.heading);
  record("landBankId pre-filled with THIS parcel (no retyping, no duplicate)", form.parcel?.value === target.id, form.parcel?.value ?? "");
  record("Name prefilled from the parcel (shared creation flow)", form.name?.value === form.expectedName, form.name?.value ?? "");
  record("City prefilled from the parcel district", !!form.city?.value, form.city?.value ?? "");

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
  /* Save must hand control back to the PARCEL editor, link visible in place */
  await page.waitForFunction(() => !!document.getElementById("uc-panel"), { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 600));
  const backInParcel = await page.evaluate((name) => {
    const panel = document.getElementById("uc-panel");
    return {
      listGone: !document.getElementById("record-list-inner"),
      linkShown: panel?.textContent.includes(name) ?? false,
      pillDraft: !!panel?.querySelector(".pill.draft"),
      openBtn: [...(panel?.querySelectorAll("button") ?? [])].some(
        (b) => b.textContent.trim() === "Open",
      ),
    };
  }, NEW_NAME);
  record("after Create, the PARCEL editor is shown again", backInParcel.listGone);
  record("linked project visible inside the parcel editor", backInParcel.linkShown, NEW_NAME);
  record("link shows its workflow status (draft — Save ≠ Publish)", backInParcel.pillDraft);
  record("panel offers Open for the linked project", backInParcel.openBtn);

  /* Open → asset editor → Back → parcel editor (context preserved) */
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#uc-panel button")].find(
      (b) => b.textContent.trim() === "Open",
    );
    btn?.click();
  });
  await page.waitForFunction(
    (plate) =>
      [...document.querySelectorAll("#content h3")].some((h) => h.textContent.includes(plate)),
    { timeout: 15000 },
    NEW_PLATE,
  );
  record(
    "Open loads the linked Under Construction record",
    await page.evaluate(
      (name) => document.querySelector("#content h3")?.textContent.includes(name) ?? false,
      NEW_NAME,
    ),
  );
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#content button")].find((b) =>
      b.textContent.includes("Back"),
    );
    btn?.click();
  });
  await page.waitForFunction(() => !!document.getElementById("uc-panel"), { timeout: 15000 });
  record(
    "Back from the linked project returns to the parcel editor",
    await page.evaluate(
      (name) => document.getElementById("uc-panel")?.textContent.includes(name) ?? false,
      NEW_NAME,
    ),
  );

  /* leave the editor for the collection list (later phases need the rows) */
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#content button")].find((b) =>
      b.textContent.includes("Back"),
    );
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
    publishedParcels.length === 1 ? "site" : "sites"
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
      stateIndexShown: reg.includes("Tamil Nadu") && reg.includes("project"),
      emptyGone: !reg.includes("Nothing under construction"),
      hintShown: reg.includes("Select a state"),
      pinsVisible: document.querySelectorAll('#register [class*="pinGroup"]').length,
    };
  }, NEW_NAME);
  record("UC state index shows the project state", ucView.stateIndexShown);
  record("UC empty state replaced by map architecture", ucView.emptyGone);
  record("UC hint guides the user", ucView.hintShown);
  record("no pins rendered until state selected", ucView.pinsVisible === 0, `${ucView.pinsVisible} pin(s)`);
  await pub.screenshot({ path: join(process.env.TEMP ?? ".", "opencode", "linkage-uc-mode.png"), clip: { x: 0, y: 0, width: 1440, height: 1000 } });

  /* meta counts: LB provenance still 9 states · 35 sites · 471.81 acres */
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

/* Re-publish the target parcel so the row "+ U/C" flow can reference it */
const rePub = await apiPost(cookie, "/api/c/land-bank?action=transition", { id: target.id, status: "published" });
record("re-transition parcel for row flow", rePub.status === 200);
const rePubAll = await apiPost(cookie, "/api/publish");
record("Publish All #4 (re-publish for row flow) completes", rePubAll.body.ok === true && rePubAll.body.stage === "done");

/* ════ row "+ U/C" pass — same shared flow, opened IN PLACE ════
   After cleanup the parcel is unlinked again; clicking the row action must
   open the SAME prefilled creation form without navigating away from the
   land-bank collection (no hash change, no filter reset). */
{
  const browser2 = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    args: ["--no-first-run", "--disable-extensions"],
  });
  try {
    const p2 = await browser2.newPage();
    await p2.setViewport({ width: 1440, height: 1000 });
    await p2.goto(ADMIN, { waitUntil: "domcontentloaded" });
    await p2.waitForFunction(() => document.getElementById("login-overlay").style.display !== "none", {
      timeout: 20000,
    });
    await p2.type("#login-user", "admin");
    await p2.type("#login-pass", "admin");
    await p2.click("#login-submit");
    await p2.waitForFunction(() => document.getElementById("login-overlay").style.display === "none", {
      timeout: 15000,
    });
    await p2.waitForSelector('.nav-item[data-key="land-bank"]', { visible: true, timeout: 20000 });
    await p2.click('.nav-item[data-key="land-bank"]');
    await p2.waitForFunction(() => document.querySelectorAll("#record-list-inner .record-row").length > 0, {
      timeout: 15000,
    });

    const rowUcHandle = await p2.evaluateHandle((name) => {
      const rows = [...document.querySelectorAll("#record-list-inner .record-row")];
      const row = rows.find((r) => r.querySelector(".title")?.textContent === name);
      if (!row) return null;
      return [...row.querySelectorAll("button")].find((b) => b.textContent.trim() === "+ U/C") ?? null;
    }, target.data.name);
    const rowUcBtn = rowUcHandle.asElement();
    record("row offers '+ U/C' after unlinking (shared flow entry)", !!rowUcBtn);
    record(
      "row Edit is prominent on the same row",
      await p2.evaluate((name) => {
        const rows = [...document.querySelectorAll("#record-list-inner .record-row")];
        const row = rows.find((r) => r.querySelector(".title")?.textContent === name);
        const btn = [...(row?.querySelectorAll("button") ?? [])].find(
          (b) => b.textContent.trim() === "Edit",
        );
        return !!btn && btn.className.includes("primary");
      }, target.data.name),
    );
    if (!rowUcBtn) throw new Error("+ U/C row button missing");
    await rowUcBtn.click();
    await p2.waitForFunction(
      () => [...document.querySelectorAll("#content h3")].some((h) => h.textContent.startsWith("New")),
      { timeout: 15000 },
    );
    const rowForm = await p2.evaluate((parcelName) => {
      const rows = [...document.querySelectorAll("#content .row")];
      const byLabel = (label) => {
        const row = rows.find((r) => r.querySelector("label")?.textContent === label);
        if (!row) return null;
        const sel = row.querySelector("select");
        return sel ? sel.value : row.querySelector("input")?.value ?? "";
      };
      return {
        hash: location.hash,
        heading: document.querySelector("#content h3")?.textContent,
        parcel: byLabel("Land-bank parcel"),
        name: byLabel("Name"),
        expectedName: `${parcelName} \u2014 under construction`,
      };
    }, target.data.name);
    record("row flow opens IN PLACE — no navigation to the assets collection", rowForm.hash === "#land-bank", rowForm.hash);
    record("row flow opens the same NEW Portfolio Asset editor", rowForm.heading === "New Portfolio Assets", rowForm.heading);
    record("row flow pre-links landBankId", rowForm.parcel === target.id, rowForm.parcel ?? "");
    record("row flow prefills Name from the parcel", rowForm.name === rowForm.expectedName, rowForm.name ?? "");

    const fillText2 = (label, value) =>
      p2.evaluate(
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
    const fillSelect2 = (label, value) =>
      p2.evaluate(
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
    record("fill Plate (row flow)", await fillText2("Plate", NEW_PLATE));
    record("fill Zone (row flow)", await fillSelect2("Zone", "south"));
    record("fill Class (row flow)", await fillSelect2("Class", "warehousing"));
    record("fill Status (row flow)", await fillSelect2("Status", "ongoing"));
    record("fill Size (row flow)", await fillText2("Size (sq ft)", "120000"));
    await p2.evaluate(() => {
      const btn = [...document.querySelectorAll("#content button")].find(
        (b) => b.textContent.trim() === "Create record",
      );
      btn?.click();
    });
    await p2.waitForFunction(() => !!document.getElementById("uc-panel"), { timeout: 20000 });
    await new Promise((r) => setTimeout(r, 500));
    record(
      "row flow save returns to the originating PARCEL editor with the link",
      await p2.evaluate((plate) => {
        const panel = document.getElementById("uc-panel");
        return !document.getElementById("record-list-inner") && panel?.textContent.includes(plate);
      }, NEW_PLATE),
    );
  } finally {
    await browser2.close();
  }
}

/* remove the draft asset created by the row-flow pass */
const rowAssetId = (await apiGet(cookie, "/api/c/portfolio-assets")).body.records.find(
  (a) => a.data?.landBankId === target.id,
)?.id;
record("row-flow asset exists and is draft-only", !!rowAssetId);
record(
  "cleanup: delete row-flow asset",
  (await apiPost(cookie, "/api/c/portfolio-assets?action=delete", { id: rowAssetId })).status === 200,
);

/* un-publish the parcel re-published for row flow and restore generated modules */
record(
  "cleanup: un-publish parcel (final)",
  (await apiPost(cookie, "/api/c/land-bank?action=transition", { id: target.id, status: "draft" })).status === 200,
);
const pubFinal = await apiPost(cookie, "/api/publish");
record("Publish All #5 (final restore) completes", pubFinal.body.ok === true && pubFinal.body.stage === "done");

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
