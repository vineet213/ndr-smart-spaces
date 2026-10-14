/**
 * Touch scroll-motion probe. Emulates a phone (isMobile + hasTouch), scrolls each
 * route with real CDP touch gestures in steps, and reports per step:
 *   - stuck: elements mostly in view whose effective opacity is still < 0.6 after settling
 *   - CLS accumulated during the walk
 * plus, at the end, elements that never revealed (opacity 0, sized, not display:none).
 * Usage: BASE_URL=http://localhost:3000 node scripts/touch-scroll-probe.mjs --out <dir>
 *        [--routes /en,/en/esg] [--width 390] [--height 844] [--shots]
 * (Git Bash mangles a bare "/en"; set MSYS_NO_PATHCONV=1.)
 */
import { readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import puppeteer from "puppeteer-core";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const args = process.argv.slice(2);
const arg = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : d;
};
const OUT = arg("--out", join(process.env.TEMP ?? ".", "ndr-touch-probe"));
const W = Number(arg("--width", "390"));
const H = Number(arg("--height", "844"));
const SHOTS = args.includes("--shots");

function discover() {
  const root = join(process.cwd(), "out");
  const routes = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (!name.startsWith("_")) walk(full);
      } else if (name === "index.html") {
        const rel = "/" + relative(root, dir).split(sep).join("/");
        if (rel.startsWith("/en")) routes.push(rel);
      }
    }
  };
  walk(root);
  return routes.sort();
}
const routes = arg("--routes", "") ? arg("--routes").split(",") : discover();
mkdirSync(OUT, { recursive: true });

function inspect() {
  const vh = innerHeight;
  const sel = (el) =>
    el.tagName.toLowerCase() +
    (el.id ? "#" + el.id : "") +
    (typeof el.className === "string" && el.className
      ? "." + el.className.split(/\s+/).slice(0, 2).join(".")
      : "");
  const effOpacity = (el) => {
    let o = 1;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden") return -1;
      o *= parseFloat(cs.opacity);
    }
    return o;
  };
  const stuck = [];
  for (const el of document.body.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width < 24 || r.height < 12) continue;
    const vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    if (vis < Math.min(r.height, vh) * 0.5) continue;
    if (el.closest("[aria-hidden='true'],[inert]")) continue;
    const o = effOpacity(el);
    if (
      (o >= 0 && o < 0.6 && el.children.length === 0) ||
      (o >= 0 && o < 0.6 && el.matches("[class*=reveal],[class*=Reveal]"))
    )
      stuck.push({ el: sel(el), o: +o.toFixed(2), h: Math.round(r.height) });
  }
  return stuck.slice(0, 8);
}

function neverRevealed() {
  const out = [];
  const sel = (el) =>
    el.tagName.toLowerCase() +
    (typeof el.className === "string" && el.className
      ? "." + el.className.split(/\s+/).slice(0, 2).join(".")
      : "");
  for (const el of document.body.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width < 24 || r.height < 12) continue;
    if (el.closest("[aria-hidden='true'],[inert]")) continue;
    let o = 1,
      hidden = false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden") {
        hidden = true;
        break;
      }
      o *= parseFloat(cs.opacity);
    }
    if (!hidden && o < 0.05 && el.textContent.trim().length > 0) out.push(sel(el));
  }
  return out.slice(0, 10);
}

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-first-run", "--disable-extensions"],
});
const report = {};
for (const route of routes) {
  const page = await browser.newPage();
  await page.setViewport({
    width: W,
    height: H,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const cdp = await page.createCDPSession();
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  const rep = { steps: [], neverRevealed: [], cls: 0, height: 0 };
  try {
    await page.goto(BASE + route + "/", { waitUntil: "load", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 1000));
    rep.height = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = Math.round(H * 0.75);
    let y = 0,
      i = 0;
    while (y < rep.height - H && i < 60) {
      const before = await page.evaluate(() => scrollY);
      await cdp.send("Input.synthesizeScrollGesture", {
        x: W / 2,
        y: H * 0.8,
        yDistance: -step,
        speed: 1500,
        gestureSourceType: "touch",
      });
      await new Promise((r) => setTimeout(r, 300));
      // Headless Edge ignores synthesized touch scrolls; fall back to an instant scroll.
      if ((await page.evaluate(() => scrollY)) === before)
        await page.evaluate((d) => scrollBy({ top: d, behavior: "instant" }), step);
      await new Promise((r) => setTimeout(r, 900));
      y = await page.evaluate(() => scrollY);
      if (y === before) break;
      const stuck = await page.evaluate(inspect);
      rep.steps.push({ i, y: Math.round(y), stuck });
      if (SHOTS)
        await page.screenshot({
          path: join(OUT, route.replace(/\//g, "_") + `-s${String(i).padStart(2, "0")}.png`),
        });
      i++;
      rep.height = await page.evaluate(() => document.documentElement.scrollHeight);
    }
    await new Promise((r) => setTimeout(r, 800));
    rep.neverRevealed = await page.evaluate(neverRevealed);
    rep.cls = +(await page.evaluate(() => window.__cls)).toFixed(4);
  } catch (e) {
    rep.error = String(e.message ?? e);
  }
  const bad = rep.steps.filter((s) => s.stuck.length).length;
  console.log(
    route.padEnd(70),
    `h:${rep.height}`.padEnd(9),
    `steps:${rep.steps.length}`.padEnd(9),
    `stuckSteps:${bad}`.padEnd(14),
    `never:${rep.neverRevealed.length}`.padEnd(8),
    `cls:${rep.cls}`,
    rep.error ?? "",
  );
  report[route] = rep;
  await page.close();
}
writeFileSync(join(OUT, "touch-report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log("Report:", OUT);
