/**
 * E2E verification for the admin panel Save vs Publish UX (Issue 1) and
 * editor-section persistence across refresh (Issue 2).
 *
 *   node scripts/e2e-admin.mjs
 *
 * Requires: admin server on :4173, static site on :3000, Microsoft Edge.
 * Uses puppeteer-core (no browser download) against the system Edge binary.
 */

import puppeteer from "puppeteer-core";
import { writeFile, rm } from "node:fs/promises";

const ADMIN = "http://localhost:4173";
const PUBLIC_EN = "http://localhost:3000/en/";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BROKEN_FILE = new URL("../src/lib/data/zz-e2e-broken.ts", import.meta.url);

const results = [];
function record(name, ok, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function apiLogin(user, password) {
  const res = await fetch(`${ADMIN}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user, password }),
  });
  if (!res.ok) throw new Error(`login ${user} failed: HTTP ${res.status}`);
  return (res.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
}
async function apiGet(cookie, path) {
  const res = await fetch(`${ADMIN}${path}`, { headers: { cookie } });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}
async function apiPost(cookie, path, payload) {
  const res = await fetch(`${ADMIN}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

/* ── browser helpers ── */
async function loginViaUI(page, user, password) {
  await page.waitForSelector("#login-user", { visible: true });
  await page.evaluate(() => {
    document.getElementById("login-user").value = "";
    document.getElementById("login-pass").value = "";
  });
  await page.type("#login-user", user);
  await page.type("#login-pass", password);
  await page.click("#login-submit");
  await page.waitForFunction(
    () => document.getElementById("login-overlay").style.display === "none",
    { timeout: 15000 },
  );
}
/* Pages in the same browser context share the session cookie — log in only
   when the overlay is actually showing. */
async function ensureLoggedIn(page, user, password) {
  await page.waitForFunction(
    () =>
      document.getElementById("login-overlay").style.display !== "none" ||
      !!document.querySelector(".nav-item"),
    { timeout: 20000 },
  );
  const needsLogin = await page.evaluate(
    () => document.getElementById("login-overlay").style.display !== "none",
  );
  if (needsLogin) await loginViaUI(page, user, password);
}
async function waitBooted(page, expectedKey) {
  await page.waitForFunction(
    (key) =>
      document.getElementById("login-overlay").style.display === "none" &&
      document.querySelector(".nav-item.active")?.dataset.key === key,
    { timeout: 20000 },
    expectedKey,
  );
}
async function activeSection(page) {
  return page.evaluate(() => ({
    active: document.querySelector(".nav-item.active")?.dataset.key ?? null,
    hash: location.hash,
  }));
}

const driver = {
  async main() {
    /* ── PHASE 1: Save ≠ live (API-level) ── */
    console.log("\n── Phase 1: Save ≠ Publish ──");
    const adminCookie = await apiLogin("admin", "admin");
    const footGet = await apiGet(adminCookie, "/api/c/footer");
    record("GET /api/c/footer", footGet.status === 200 && !!footGet.body.records?.[0]);
    const footerRec = footGet.body.records[0];
    /* self-healing baseline: strip markers left by an earlier crashed run */
    const origDescriptor = footerRec.data.descriptor.replaceAll(" [UX-E2E]", "");
    console.log(`      current CMS descriptor: "${origDescriptor.slice(0, 60)}…"`);

    const marked = `${origDescriptor} [UX-E2E]`;
    const pubBefore = await (await fetch(`${PUBLIC_EN}?t=${Date.now()}`)).text();
    const saveRes = await apiPost(adminCookie, "/api/c/footer?action=save", {
      id: footerRec.id,
      status: footerRec.status,
      data: { ...footerRec.data, descriptor: marked },
    });
    record("SAVE marker via CMS API", saveRes.status === 200);
    const afterSave = await apiGet(adminCookie, "/api/c/footer");
    record(
      "CMS store holds saved value",
      afterSave.body.records[0].data.descriptor === marked,
    );

    let pub = await (await fetch(`${PUBLIC_EN}?t=${Date.now()}`)).text();
    record(
      "PUBLIC SITE UNCHANGED right after save (Save ≠ live)",
      pub === pubBefore && !pub.includes("[UX-E2E]"),
    );

    /* ── PHASE 2: Issue 2 — section persistence (real browser) ── */
    console.log("\n── Phase 2: refresh keeps section / guards / logout ──");
    const browser = await puppeteer.launch({
      executablePath: EDGE,
      headless: "new",
      protocolTimeout: 300000,
      args: ["--no-first-run", "--disable-extensions"],
    });
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      await page.goto(ADMIN, { waitUntil: "domcontentloaded" });
      await loginViaUI(page, "admin", "admin");
      await waitBooted(page, "corporate-settings");
      record("fresh login opens default section (corporate-settings)", true);

      for (const key of ["footer", "navigation", "documents", "metrics"]) {
        await page.click(`.nav-item[data-key="${key}"]`);
        await waitBooted(page, key);
        const s1 = await activeSection(page);
        await page.reload({ waitUntil: "domcontentloaded" });
        await waitBooted(page, key);
        const s2 = await activeSection(page);
        record(
          `refresh stays on "${key}"`,
          s1.active === key && s1.hash === `#${key}` && s2.active === key && s2.hash === `#${key}`,
          `hash=${s2.hash}`,
        );
      }

      // deep link: brand-new page opened straight onto a hash
      const deep = await browser.newPage();
      await deep.setViewport({ width: 1440, height: 900 });
      await deep.goto(`${ADMIN}#esg-initiatives`, { waitUntil: "domcontentloaded" });
      await ensureLoggedIn(deep, "editor", "editor");
      await waitBooted(deep, "esg-initiatives");
      record("deep-link #esg-initiatives survives full reload/login", true);
      await deep.close();

      // unsaved-changes modal guard when switching sections
      await page.click('.nav-item[data-key="footer"]');
      await waitBooted(page, "footer");
      const descriptorSelector = "#content textarea";
      await page.waitForSelector(descriptorSelector, { timeout: 10000 });
      await page.focus(descriptorSelector);
      await page.type(descriptorSelector, "X"); // makes draft differ → dirty
      await page.click('.nav-item[data-key="navigation"]');
      const modalShown = await page.waitForFunction(
        () =>
          document.getElementById("modal-overlay").style.display !== "none" &&
          document.getElementById("modal-title").textContent.includes("Unsaved"),
        { timeout: 5000 },
      ).then(() => true, () => false);
      record("switching section with unsaved edits shows guard modal", modalShown);
      if (modalShown) {
        const buttons = await page.$$("#modal-actions button");
        await buttons[0].click(); // Cancel
        await page.waitForFunction(() => document.getElementById("modal-overlay").style.display === "none");
        const stayed = await activeSection(page);
        record("Cancel keeps the editor open (edits preserved)", stayed.active === "footer");

        // beforeunload protection while dirty
        let unloadPrompted = null;
        page.once("dialog", async (d) => {
          unloadPrompted = d.type();
          await d.dismiss(); // stay on page
        });
        await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
        await new Promise((r) => setTimeout(r, 1200));
        record(
          "reload with unsaved edits triggers beforeunload guard",
          unloadPrompted === "beforeunload",
          unloadPrompted ? `dialog type=${unloadPrompted}` : "no dialog fired",
        );
        // clean up: discard via explicit switch
        await waitBooted(page, "footer");
        await page.click(`.nav-item[data-key="navigation"]`);
        const m2 = await page.waitForFunction(
          () => document.getElementById("modal-overlay").style.display !== "none",
          { timeout: 5000 },
        ).then(() => true, () => false);
        if (m2) {
          const b2 = await page.$$("#modal-actions button");
          await b2[1].click(); // Discard changes
        }
        await waitBooted(page, "navigation");
        record("Discard changes switches section (dirty cleared)", true);
      }

      // logout resets editor state
      await page.click("#btn-logout");
      await page.waitForSelector("#login-user", { visible: true });
      const loggedOutHash = await page.evaluate(() => location.hash);
      record(
        "logout clears section state (hash reset)",
        loggedOutHash === "" || loggedOutHash === "#",
        `hash="${loggedOutHash}"`,
      );
      await loginViaUI(page, "publisher", "publisher");
      await waitBooted(page, "corporate-settings");
      record("re-login opens default section, no stale editor", true);

      /* ── PHASE 3: Publish All via the real UI ── */
      console.log("\n── Phase 3: Publish All (UI button → export + build) ──");
      await page.click("#btn-export");
      const barShown = await page
        .waitForFunction(() => document.getElementById("publish-status").style.display !== "none", {
          timeout: 5000,
        })
        .then(() => true, () => false);
      record("progress indicator shown while publishing", barShown);
      /* next build saturates the CPU and can stall CDP — poll tolerantly */
      let headingText = null;
      const deadline = Date.now() + 240000;
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
          headingText = await page.evaluate(
            () => document.querySelector("#drawer-panel h3")?.textContent ?? null,
          );
          if (headingText) break;
        } catch (_) { /* CDP busy during the build; retry */ }
      }
      record(
        "publish completes with SUCCESS report (export + build)",
        !!headingText && headingText.includes("Published"),
        `report heading: "${headingText ?? "(timeout)"}"`,
      );
      const failedToast = await page.evaluate(() =>
        Array.from(document.querySelectorAll("#toasts .toast")).some((t) =>
          t.textContent.includes("FAILED"),
        ),
      );
      record("no false failure reported", !failedToast);

      pub = await (await fetch(PUBLIC_EN)).text();
      record("PUBLISHED marker is LIVE on public site", pub.includes("[UX-E2E]"));
    } finally {
      await browser.close();
    }

    /* ── PHASE 4: restore + failure paths ── */
    console.log("\n── Phase 4: restore + failure handling ──");
    const restoreRes = await apiPost(adminCookie, "/api/c/footer?action=save", {
      id: footerRec.id,
      status: footerRec.status,
      data: { ...footerRec.data, descriptor: origDescriptor },
    });
    record("restore original descriptor", restoreRes.status === 200);
    const republished = await apiPost(adminCookie, "/api/publish");
    record(
      "POST /api/publish works standalone (ok:true, stage:done)",
      republished.status === 200 && republished.body.ok === true && republished.body.stage === "done",
      `build ${((republished.body.build?.durationMs ?? 0) / 1000).toFixed(1)}s`,
    );
    pub = await (await fetch(PUBLIC_EN)).text();
    record("public site back to original content", !pub.includes("[UX-E2E]") && pub.includes(origDescriptor));

    const viewerCookie = await apiLogin("viewer", "viewer");
    const forbidden = await apiPost(viewerCookie, "/api/publish");
    record(
      "viewer role is rejected (RBAC preserved)",
      forbidden.status === 403 && forbidden.body.ok !== true,
      `HTTP ${forbidden.status}`,
    );

    await writeFile(BROKEN_FILE, "this is (( not valid typescript ]]", "utf8");
    const buildFail = await apiPost(adminCookie, "/api/publish");
    record(
      "broken build reports FAILURE, not success",
      buildFail.status === 200 &&
        buildFail.body.ok === false &&
        buildFail.body.stage === "build" &&
        typeof buildFail.body.build?.tail === "string",
      `stage=${buildFail.body.stage}`,
    );
    await rm(BROKEN_FILE, { force: true });
    pub = await (await fetch(PUBLIC_EN)).text();
    record("failed build did NOT change the live site", pub.includes(origDescriptor));

    const exportOnly = await apiPost(adminCookie, "/api/export");
    record(
      "legacy POST /api/export still intact",
      exportOnly.status === 200 && exportOnly.body.ok === true,
    );

    const failed = results.filter((r) => !r.ok);
    console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
    if (failed.length) {
      console.log("FAILURES: " + failed.map((f) => f.name).join(" | "));
      process.exitCode = 1;
    }
  },
};

driver.main().catch((error) => {
  console.error("E2E crashed:", error);
  process.exitCode = 1;
});
