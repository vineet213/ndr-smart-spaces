import puppeteer from "puppeteer-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto("http://localhost:3000/en/", { waitUntil: "domcontentloaded", timeout: 30000 });
await new Promise((r) => setTimeout(r, 800));

const info = await page.evaluate(() => {
  const cw = document.documentElement.clientWidth;
  // Walk down from header finding the first descendant chain where scrollWidth first exceeds cw,
  // by comparing each element to its children to find the actual widest leaf-ish culprit.
  function widest(el, path) {
    const results = [];
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    results.push({
      path,
      tag: el.tagName,
      cls: el.className?.toString().slice(0, 60),
      scrollWidth: el.scrollWidth,
      rectWidth: rect.width,
      rectRight: rect.right,
      whiteSpace: style.whiteSpace,
      display: style.display,
      overflow: style.overflow,
    });
    return results;
  }
  const header = document.querySelector("header");
  const out = [];
  function walk(el, path, depth) {
    if (depth > 6) return;
    out.push(...widest(el, path));
    for (const child of el.children) {
      if (child.scrollWidth > cw + 2 || child.getBoundingClientRect().right > cw + 2) {
        walk(child, path + " > " + child.tagName + (child.className ? "." + String(child.className).split(" ")[0] : ""), depth + 1);
      }
    }
  }
  walk(header, "header", 0);
  return { cw, out };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
