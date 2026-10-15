/**
 * Section progress probe: for "The Code" (/about-us) and the Development
 * Lifecycle (/business/ndr-asset-management/development-lifecycle), scrolls
 * through each section and screenshots at 0/25/50/75/100% of its scroll
 * progress. Also samples the pinned frame's bottom edge to catch gaps.
 * Usage: MSYS_NO_PATHCONV=1 node scripts/section-progress-probe.mjs --out <dir> --width 390 --height 844 [--desktop]
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const args = process.argv.slice(2);
const arg = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const OUT = arg("--out", "./section-shots");
const W = Number(arg("--width", "390"));
const H = Number(arg("--height", "844"));
const DESKTOP = args.includes("--desktop");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
mkdirSync(OUT, { recursive: true });

const SECTIONS = [
  {
    name: "code",
    route: "/about-us",
    find: () =>
      document.querySelector("section[aria-label]:has([class*=sticky])")?.firstElementChild,
  },
  {
    name: "lifecycle",
    route: "/business/ndr-asset-management/development-lifecycle",
    find: () => document.querySelector("[class*=stageTrack]")?.parentElement,
  },
];

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: "new",
  args: ["--no-first-run", "--disable-extensions"],
});
for (const sec of SECTIONS) {
  const page = await browser.newPage();
  await page.setViewport({
    width: W,
    height: H,
    deviceScaleFactor: 1,
    isMobile: !DESKTOP,
    hasTouch: !DESKTOP,
  });
  await page.goto(BASE + sec.route + "/", { waitUntil: "load", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1200));
  const geo = await page.evaluate((fnSrc) => {
    const el = new Function("return (" + fnSrc + ")()")();
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + scrollY, height: r.height };
  }, sec.find.toString());
  if (!geo) {
    console.log(sec.name, "section not found");
    await page.close();
    continue;
  }
  const range = geo.height - H;
  console.log(
    sec.name,
    `top:${Math.round(geo.top)} height:${Math.round(geo.height)} scrollable:${Math.round(range)}`,
  );
  // walk in small steps so scroll-triggered state latches like a real visit
  const y0 = geo.top;
  const gaps = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const y = y0 + (range * i) / steps;
    await page.evaluate((yy) => scrollTo({ top: yy, behavior: "instant" }), y);
    await new Promise((r) => setTimeout(r, 120));
    const bottom = await page.evaluate(() => {
      const cands = [...document.querySelectorAll("[class*=sticky],[class*=__stage]")].filter(
        (e) => {
          const cs = getComputedStyle(e);
          return cs.position === "sticky";
        },
      );
      const vis = cands.filter((e) => {
        const r = e.getBoundingClientRect();
        return r.top <= 1 && r.bottom > 0;
      });
      return vis.length
        ? Math.round(Math.max(...vis.map((e) => e.getBoundingClientRect().bottom)))
        : null;
    });
    if (bottom !== null && bottom < H - 2 && i < steps)
      gaps.push({ pct: Math.round((i / steps) * 100), bottom });
  }
  console.log(
    "  pinned-frame bottom gaps (px short of viewport):",
    gaps.length ? JSON.stringify(gaps.slice(0, 6)) : "none",
  );
  for (const pct of [0, 25, 50, 75, 100]) {
    const y = y0 + (range * pct) / 100;
    await page.evaluate((yy) => scrollTo({ top: yy, behavior: "instant" }), y);
    await new Promise((r) => setTimeout(r, 1300));
    await page.screenshot({ path: join(OUT, `${sec.name}-${String(pct).padStart(3, "0")}.png`) });
  }
  await page.close();
}
await browser.close();
