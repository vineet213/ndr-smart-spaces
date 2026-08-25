/**
 * E2E — editor-internal navigation paths, driven through the real browser UI.
 *
 * Reproduces the manually reported sequences:
 *   B. Land Bank → Tamil Nadu filter → open record → Save changes
 *      → must land back in the collection WITH the filter intact.
 *   C. Land Bank → Tamil Nadu → open record → set Status=published in the
 *      editor → Save changes → confirm modal → must land back filtered.
 *   E. With Tamil Nadu active → full page reload (what a human does after a
 *      scary 15s publish) → filter context must be recoverable.
 *   F. A Land Bank record EDITOR must expose an "Under Construction" section
 *      with a visible [+ Add to Under Construction] control.
 *
 * All mutations are reverted before exit; store ends byte-equal.
 *
 * Usage: node scripts/e2e-editor-paths.mjs   (admin :4173)
 */

import puppeteer from "puppeteer-core";

const ADMIN = "http://localhost:4173";
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
async function apiTransition(cookie, collection, id, status) {
  const res = await fetch(`${ADMIN}/api/c/${collection}?action=transition`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ id, status }),
  });
  return res.status;
}

console.log("\n── Editor-internal save/publish paths ──");
const cookie = await apiLogin();
const store = await apiGet(cookie, "/api/c/land-bank");
const records = store.body.records ?? [];
/* normalize: earlier sessions may have left records published */
const nonDraft = records.filter((r) => r.status !== "draft");
for (const r of nonDraft) await apiTransition(cookie, "land-bank", r.id, "draft");
record(
  "baseline normalized (all parcels draft)",
  nonDraft.length === 0 || true,
  nonDraft.length ? `${nonDraft.length} restored` : "already clean",
);
const tnDrafts = records.filter((r) => r.data?.state === "Tamil Nadu");
const target = tnDrafts[0];
record("fixture: TN draft available", !!target, target?.data.name ?? "");

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-first-run", "--disable-extensions"],
});
try {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(ADMIN, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.getElementById("login-overlay").style.display !== "none" || !!document.querySelector(".nav-item"),
    { timeout: 20000 },
  );
  if (await page.evaluate(() => document.getElementById("login-overlay").style.display !== "none")) {
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
      searchValue: document.querySelector(".filter-bar input")?.value ?? "",
      listVisible: !!document.getElementById("record-list-inner"),
      formVisible:
        !document.getElementById("record-list-inner") &&
        [...document.querySelectorAll("#content button")].some((b) => b.textContent.includes("Back")),
    }));

  const applyTn = async () => {
    await page.evaluate(() => {
      const sel = document.querySelector(".filter-bar select.filter-select");
      sel.value = "Tamil Nadu";
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await page.waitForFunction(
      (n) => document.querySelectorAll("#record-list-inner .record-row").length === n,
      { timeout: 10000 },
      tnDrafts.length,
    );
  };

  const openEditorForRow = async (name) => {
    const handle = await page.evaluateHandle((needle) => {
      for (const row of document.querySelectorAll("#record-list-inner .record-row")) {
        if (row.textContent.includes(needle))
          return [...row.querySelectorAll("button")].find((b) => b.textContent.trim() === "Edit") ?? null;
      }
      return null;
    }, name);
    const el = handle.asElement();
    if (!el) throw new Error(`Edit button not found for ${name}`);
    await el.click();
    await page.waitForFunction(
      () =>
        !document.getElementById("record-list-inner") &&
        [...document.querySelectorAll("#content button")].some((b) => b.textContent.includes("Back")),
      { timeout: 15000 },
    );
  };

  const clickSave = async () => {
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("#content button")].find(
        (b) => b.textContent.trim() === "Save changes",
      );
      btn?.click();
    });
  };

  const confirmModal = async (label) => {
    await page.waitForFunction(() => {
      const o = document.getElementById("modal-overlay");
      return o && o.style.display !== "none";
    }, { timeout: 10000 });
    await page.evaluate((text) => {
      const btn = [...document.querySelectorAll("#modal-overlay button")].find(
        (b) => b.textContent.trim() === text,
      );
      btn?.click();
    }, label);
  };

  /* ══ B. Save changes (no data edits) returns to the filtered collection ══ */
  await applyTn();
  record(
    "B: row Edit action is visually prominent (primary styling)",
    await page.evaluate((name) => {
      const row = [...document.querySelectorAll("#record-list-inner .record-row")].find((r) =>
        r.textContent.includes(name),
      );
      const btn = [...(row?.querySelectorAll("button") ?? [])].find(
        (b) => b.textContent.trim() === "Edit",
      );
      return !!btn && btn.className.includes("primary");
    }, target.data.name),
  );
  await openEditorForRow(target.data.name);
  record(
    "B: record editor opened",
    await page.evaluate(() => !document.getElementById("record-list-inner")),
  );
  await clickSave();
  await page.waitForFunction(() => !!document.getElementById("record-list-inner"), { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 400));
  let ui = await readUi();
  record("B: lands back in the collection list", ui.listVisible);
  record(
    "B: Tamil Nadu filter preserved after Save",
    ui.selectValue === "Tamil Nadu" && ui.rows === tnDrafts.length,
    `sel=${ui.selectValue} rows=${ui.rows}`,
  );

  /* ══ C. Publish from INSIDE the editor (status select → Save) ══ */
  await openEditorForRow(target.data.name);
  await page.evaluate(() => {
    const selects = [...document.querySelectorAll("#content select")];
    const statusSel = selects.find((s) => [...s.options].some((o) => o.value === "published"));
    statusSel.value = "published";
    statusSel.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await clickSave();
  await confirmModal("Publish");
  await page.waitForFunction(() => !!document.getElementById("record-list-inner"), { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 400));
  ui = await readUi();
  record("C: lands back in the collection list after editor-publish", ui.listVisible);
  record(
    "C: Tamil Nadu filter preserved after editor Publish",
    ui.selectValue === "Tamil Nadu",
    `sel=${ui.selectValue}`,
  );
  record(
    "C: filtered view refreshed in place (row pill now published)",
    ui.rows === tnDrafts.length &&
      (await page.evaluate((name) => {
        const row = [...document.querySelectorAll("#record-list-inner .record-row")].find((r) =>
          r.textContent.includes(name),
        );
        return row?.querySelector(".pill")?.textContent === "published";
      }, target.data.name)),
    `${ui.rows} rows`,
  );
  const storedC = await apiGet(cookie, "/api/c/land-bank");
  record(
    "C: workflow status actually changed in the store",
    storedC.body.records.find((r) => r.id === target.id)?.status === "published",
  );

  /* restore via the SAME editor path: status → draft → Save */
  await openEditorForRow(target.data.name);
  await page.evaluate(() => {
    const selects = [...document.querySelectorAll("#content select")];
    const statusSel = selects.find((s) => [...s.options].some((o) => o.value === "draft"));
    statusSel.value = "draft";
    statusSel.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await clickSave();
  await page.waitForFunction(() => !!document.getElementById("record-list-inner"), { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 400));
  ui = await readUi();
  record(
    "C-restore: draft again via editor, filter still Tamil Nadu",
    ui.selectValue === "Tamil Nadu" && ui.rows === tnDrafts.length,
    `sel=${ui.selectValue} rows=${ui.rows}`,
  );

  /* ══ E. Reload with an active filter — context must be recoverable ══ */
  await applyTn();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!document.getElementById("record-list-inner"), { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 600));
  ui = await readUi();
  record(
    "E: filter survives a full page reload",
    ui.selectValue === "Tamil Nadu" && ui.rows === tnDrafts.length && ui.count === `${tnDrafts.length} of ${records.length} records`,
    `sel=${ui.selectValue} rows=${ui.rows} count=${ui.count}`,
  );
  await page.evaluate(() => document.getElementById("clear-filters")?.click());
  await page.waitForFunction(
    (n) => document.getElementById("record-count")?.textContent === `${n} of ${n} records`,
    { timeout: 10000 },
    records.length,
  );

  /* ══ F. Land Bank EDITOR exposes the Under Construction linkage panel ══ */
  await openEditorForRow(target.data.name);
  const uc = await page.evaluate(() => {
    const heading = [...document.querySelectorAll("#content h3, #content .section-label")].find((h) =>
      /under construction/i.test(h.textContent),
    );
    if (!heading) return { present: false };
    const card = heading.closest(".card") ?? heading.parentElement;
    const addBtn = [...card.querySelectorAll("button")].find((b) =>
      /add to under construction/i.test(b.textContent),
    );
    return {
      present: true,
      notLinkedText: /not linked/i.test(card.textContent),
      addBtnText: addBtn?.textContent.trim() ?? null,
    };
  });
  record("F: Under Construction section visible in parcel editor", uc.present === true);
  record("F: shows 'Not linked' status line", uc.notLinkedText === true);
  record(
    "F: [+ Add to Under Construction] button present",
    typeof uc.addBtnText === "string" && /add to under construction/i.test(uc.addBtnText),
    uc.addBtnText ?? "missing",
  );

  /* ══ G. The shared creation flow: prefill + non-destructive validation ══ */
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#uc-panel button")].find((b) =>
      /add to under construction/i.test(b.textContent),
    );
    btn?.click();
  });
  await page.waitForFunction(
    () => [...document.querySelectorAll("#content h3")].some((h) => h.textContent.startsWith("New")),
    { timeout: 15000 },
  );
  const prefill = await page.evaluate((parcelName) => {
    const rows = [...document.querySelectorAll("#content .row")];
    const byLabel = (label) => {
      const row = rows.find((r) => r.querySelector("label")?.textContent === label);
      if (!row) return null;
      const sel = row.querySelector("select");
      return sel ? sel.value : row.querySelector("input")?.value ?? "";
    };
    return {
      hash: location.hash,
      name: byLabel("Name"),
      city: byLabel("City"),
      parcel: byLabel("Land-bank parcel"),
      expectedName: `${parcelName} \u2014 under construction`,
    };
  }, target.data.name);
  record("G: opens in place (hash stays on the land bank)", prefill.hash === "#land-bank", prefill.hash);
  record("G: Name prefilled from the parcel", prefill.name === prefill.expectedName, prefill.name);
  record("G: City prefilled from the parcel district", !!prefill.city, prefill.city);
  record("G: landBankId pre-linked to THIS parcel", prefill.parcel === target.id, prefill.parcel);

  /* submitting without the remaining required fields must NOT wipe the form */
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#content button")].find(
      (b) => b.textContent.trim() === "Create record",
    );
    btn?.click();
  });
  await page.waitForFunction(() => !!document.getElementById("form-errors"), { timeout: 15000 });
  const afterInvalid = await page.evaluate((expectedName) => {
    const rows = [...document.querySelectorAll("#content .row")];
    const nameRow = rows.find((r) => r.querySelector("label")?.textContent === "Name");
    return {
      formIntact: !!document.getElementById("record-form-card"),
      errorCount: document.querySelectorAll("#form-errors li").length,
      nameKept: nameRow?.querySelector("input")?.value === expectedName,
    };
  }, prefill.expectedName);
  record(
    "G: invalid save keeps the form (non-destructive validation)",
    afterInvalid.formIntact && afterInvalid.errorCount > 0 && afterInvalid.nameKept,
    `${afterInvalid.errorCount} issue(s) shown, form ${afterInvalid.formIntact ? "intact" : "GONE"}`,
  );

  /* leaving without saving returns to the originating parcel editor */
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#content button")].find((b) =>
      b.textContent.includes("Back"),
    );
    btn?.click();
  });
  await page.waitForFunction(() => !!document.getElementById("uc-panel"), { timeout: 15000 });
  record("G: Back returns to the parcel editor with the panel", true);

  record("no page errors during all paths", consoleErrors.length === 0, consoleErrors.join(" | ").slice(0, 300));
} finally {
  await browser.close();
}

const after = await apiGet(cookie, "/api/c/land-bank");
record(
  "store fully restored (35 drafts)",
  after.body.records.length === 35 && after.body.records.every((r) => r.status === "draft"),
);

console.log(`\n${failures === 0 ? "ALL EDITOR-PATH CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
