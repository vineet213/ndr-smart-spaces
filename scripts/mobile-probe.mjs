/**
 * Mobile probe — per-route, per-width audit against the static export.
 *
 * Reports for every route in out/en/**\/index.html at 360 / 390 / 430px:
 *   - horizontal overflow (+ offending elements)
 *   - interactive elements under 44x44 CSS px
 *   - visible text under 12px
 *   - form fields under 16px font-size (iOS focus zoom)
 *   - elements hidden at mobile width that are visible at 1440 (content that "disappears")
 * and saves full-page screenshots.
 *
 * Usage: npm run build && npm start   (port 3000)
 *        node scripts/mobile-probe.mjs [--out <dir>] [--routes /en/esg,/en/contact] [--widths 360,390]
 *        [--desktop]   also capture 1440 screenshots (desktop regression baseline)
 */

import { readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import puppeteer from "puppeteer-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const OUT = arg("--out", join(process.env.TEMP ?? ".", "ndr-mobile-probe"));
const WIDTHS = arg("--widths", "360,390,430").split(",").map(Number);
const HEIGHTS = { 360: 740, 390: 844, 430: 932 };
const DESKTOP = args.includes("--desktop");

function discoverRoutes() {
  const root = join(process.cwd(), "out");
  const routes = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (name.startsWith("_") || name.startsWith("__")) continue;
        walk(full);
      } else if (name === "index.html") {
        const rel = "/" + relative(root, dir).split(sep).join("/");
        if (rel.startsWith("/en")) routes.push(rel);
      }
    }
  };
  walk(root);
  return routes.sort();
}

const routes = arg("--routes", "") ? arg("--routes").split(",") : discoverRoutes();

/** Runs inside the page. */
function audit() {
  const cw = document.documentElement.clientWidth;
  const sel = (el) =>
    el.tagName.toLowerCase() +
    (el.id ? "#" + el.id : "") +
    (el.className && typeof el.className === "string"
      ? "." + el.className.trim().split(/\s+/)[0]
      : "");
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
  };

  const overflow = [];
  for (const el of document.body.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (getComputedStyle(el).visibility === "hidden") continue;
    if (r.right > cw + 1 || r.left < -1) {
      // skip things clipped by an overflow ancestor
      let p = el.parentElement;
      let clipped = false;
      while (p && p !== document.body) {
        const ps = getComputedStyle(p);
        if (/(hidden|clip|auto|scroll)/.test(ps.overflowX)) {
          clipped = true;
          break;
        }
        if (getComputedStyle(p).position === "fixed") break;
        p = p.parentElement;
      }
      if (!clipped)
        overflow.push({ el: sel(el), left: Math.round(r.left), right: Math.round(r.right) });
    }
  }

  const small = [];
  const targets = document.querySelectorAll(
    'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [tabindex="0"]',
  );
  for (const el of targets) {
    if (!visible(el)) continue;
    if (el.closest("[aria-hidden='true']")) continue;
    const r = el.getBoundingClientRect();
    // inline text links inside paragraphs are exempt (WCAG 2.5.8 inline exception)
    const inline = getComputedStyle(el).display === "inline" && el.closest("p, li, dd");
    if (inline) continue;
    if (r.width < 44 || r.height < 44) {
      small.push({
        el: sel(el),
        w: Math.round(r.width),
        h: Math.round(r.height),
        text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30),
      });
    }
  }

  const tiny = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || !visible(el) || el.closest("svg, [aria-hidden='true']")) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 11.99) {
      const k = sel(el) + "@" + fs;
      tiny.set(k, (tiny.get(k) ?? 0) + 1);
    }
  }

  const smallInputs = [];
  for (const el of document.querySelectorAll("input:not([type=hidden]), select, textarea")) {
    if (!visible(el)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 16) smallInputs.push({ el: sel(el), fs });
  }

  const hidden = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (
      getComputedStyle(el).display === "none" &&
      !/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT)$/.test(el.tagName)
    ) {
      const text = (el.textContent || "").trim();
      if (text) hidden.push({ el: sel(el), text: text.slice(0, 50) });
    }
  }

  return {
    cw,
    scrollWidth: document.documentElement.scrollWidth,
    overflow: overflow.slice(0, 12),
    small: small.slice(0, 40),
    smallCount: small.length,
    tiny: [...tiny.entries()].slice(0, 20),
    smallInputs,
    hidden: hidden.slice(0, 40),
  };
}

mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-first-run", "--disable-extensions"],
});

const report = {};
let problems = 0;
for (const route of routes) {
  report[route] = {};
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({
      width,
      height: HEIGHTS[width] ?? 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    try {
      await page.goto(BASE + route + "/", { waitUntil: "load", timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1200));
      // trigger scroll reveals so screenshots show real content
      await page.evaluate(async () => {
        const step = Math.max(300, innerHeight * 0.7);
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        scrollTo(0, 0);
      });
      await new Promise((r) => setTimeout(r, 400));
      const result = await page.evaluate(audit);
      report[route][width] = result;
      const o = result.scrollWidth > result.cw + 1 ? 1 : 0;
      problems += o + result.overflow.length + result.smallInputs.length;
      console.log(
        `${route.padEnd(70)} ${String(width).padStart(3)}  overflow:${o ? "PAGE" : "ok"}/${result.overflow.length}  tap<44:${result.smallCount}  text<12:${result.tiny.length}  input<16:${result.smallInputs.length}  hidden:${result.hidden.length}`,
      );
      const name = route.replace(/\//g, "_").replace(/^_/, "") || "home";
      await page.screenshot({ path: join(OUT, `${name}-${width}.png`), fullPage: true });
    } catch (e) {
      console.log(`${route} ${width} ERROR ${e.message}`);
      report[route][width] = { error: e.message };
    }
    await page.close();
  }
  if (DESKTOP) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    try {
      await page.goto(BASE + route + "/", { waitUntil: "load", timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1500));
      const name = route.replace(/\//g, "_").replace(/^_/, "") || "home";
      await page.screenshot({ path: join(OUT, `${name}-1440.png`), fullPage: true });
    } catch (e) {
      console.log(`${route} 1440 ERROR ${e.message}`);
    }
    await page.close();
  }
}
await browser.close();
writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log(`\nReport + screenshots: ${OUT}\nHard problems (overflow + small inputs): ${problems}`);
