/**
 * Builds the website chatbot's knowledge file from the static export (`out/`).
 *
 * Every exported page's <main> content is reduced to plain Markdown-ish text
 * (headings, paragraphs, list items, table rows), tagged with the page's URL,
 * and written to out/api/chat-knowledge.md. api/chat.php sends it to the AI
 * with every question, so the bot answers only from what the site says, and
 * it is always in step with the deployed pages. The file is denied to browsers
 * by api/.htaccess.
 *
 * The portfolio register (every published site, by state) is drawn in the
 * browser, so it is not in the exported HTML; it is added from the same data
 * the register uses, with the same rule: only `published` records are public.
 *
 *   npm run build   → next build, then this script (postbuild)
 */

import { promises as fs } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

const OUT_DIR = join(process.cwd(), "out");
const TARGET = join(OUT_DIR, "api", "chat-knowledge.md");
const REGISTER_PAGE = "/business/logistics-and-industrial-infrastructure/";
const AUM_DATA = join(process.cwd(), "src", "lib", "data", "generated", "assetsUnderManagement.ts");

// Pages that only repeat other pages or hold nothing a visitor would ask about.
const SKIP = new Set(["/404/", "/_not-found/", "/sitemap/"]);
// Warehouse pages still carry SAMPLE pilot text; the bot must not repeat it.
// Remove this once every published warehouse page has real content.
const SKIP_PREFIXES = ["/warehouses/"];

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  middot: "·",
  rarr: "→",
};

function decode(text) {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

async function* pages(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name.startsWith("__next")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* pages(full);
    else if (entry.name === "index.html") yield full;
  }
}

function pageText(html) {
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").trim();
  let main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/)?.[1] ?? "";
  main = main
    .replace(
      /<(script|style|svg|noscript|template|form|button|select|figure|footer)\b[\s\S]*?<\/\1>/gi,
      " ",
    )
    .replace(/<[^>]+aria-hidden="true"[^>]*\/>/gi, " ")
    .replace(/<h([1-4])\b[^>]*>/gi, (_, level) => `\n\n${"#".repeat(Number(level) + 1)} `)
    .replace(/<\/h[1-4]>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<tr\b[^>]*>/gi, "\n| ")
    .replace(/<\/t[dh]>/gi, " | ")
    .replace(
      /<(p|div|section|article|dt|dd|br|ul|ol|table|header|footer|blockquote)\b[^>]*>/gi,
      "\n",
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/\s*Opens in a new tab/g, "");
  const lines = [];
  for (const raw of decode(main).split("\n")) {
    const line = raw.replace(/[ \t ]+/g, " ").trim();
    if (!line || line === "-" || line === "|" || /^[|\s]+$/.test(line)) continue;
    // Animated counters and carousels repeat text; keep each line once per page.
    if (lines.includes(line) && !line.startsWith("#")) continue;
    lines.push(line);
  }
  return { title, body: lines.join("\n").replace(/\n(#+ )/g, "\n\n$1") };
}

/** The portfolio register as text: one line per published site, grouped by state. */
async function registerText() {
  // Node runs the generated data module directly (plain data, no imports).
  const { assetsUnderManagement } = await import(pathToFileURL(AUM_DATA).href);
  const published = assetsUnderManagement.filter((asset) => asset.status === "published");
  const byState = new Map();
  for (const asset of published) {
    byState.set(asset.state, [...(byState.get(asset.state) ?? []), asset]);
  }
  const lines = [
    "## Portfolio register: every site, by state",
    `${published.length} sites across ${byState.size} states (msf = million sq ft of leasable area). Current availability and rents are not published; the team shares them on enquiry.`,
  ];
  for (const [state, assets] of [...byState].sort(([a], [b]) => a.localeCompare(b))) {
    const total = assets.reduce((sum, asset) => sum + (asset.leasableAreaMsf ?? 0), 0);
    lines.push(
      `\n### ${state} (${assets.length} site${assets.length === 1 ? "" : "s"}, ${Math.round(total * 100) / 100} msf)`,
    );
    for (const asset of assets) {
      const district =
        asset.district && asset.district !== asset.city ? `, ${asset.district} district` : "";
      const area =
        typeof asset.leasableAreaMsf === "number"
          ? `${asset.leasableAreaMsf} msf`
          : "area not stated";
      lines.push(`- ${asset.name}: ${asset.city}${district}, ${area}`);
    }
  }
  return lines.join("\n");
}

async function main() {
  try {
    await fs.access(OUT_DIR);
  } catch {
    console.warn("build-chat-knowledge: no out/ folder, run `npm run build` first.");
    return;
  }
  const sections = [];
  for await (const file of pages(OUT_DIR)) {
    const path = `/${relative(OUT_DIR, file).split(sep).slice(0, -1).join("/")}${file === join(OUT_DIR, "index.html") ? "" : "/"}`;
    if (SKIP.has(path) || SKIP_PREFIXES.some((prefix) => path.startsWith(prefix))) continue;
    const page = pageText(await fs.readFile(file, "utf8"));
    const body = path === REGISTER_PAGE ? `${page.body}\n\n${await registerText()}` : page.body;
    const title = page.title;
    if (body.length < 40) continue;
    sections.push({ path, text: `# PAGE: ${title || path}\nURL: ${path}\n\n${body}` });
  }
  sections.sort((a, b) =>
    a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path),
  );
  const text = sections.map((section) => section.text).join("\n\n---\n\n") + "\n";
  await fs.mkdir(join(OUT_DIR, "api"), { recursive: true });
  await fs.writeFile(TARGET, text);
  console.log(
    `build-chat-knowledge: ${sections.length} pages, ${Math.round(text.length / 1024)} KB → out/api/chat-knowledge.md`,
  );
}

await main();
