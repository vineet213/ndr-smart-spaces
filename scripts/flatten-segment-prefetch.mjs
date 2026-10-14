/**
 * Post-build fix-up for link prefetching in the static export (`out/`).
 *
 * Next.js 16.3 writes per-segment prefetch data as nested folders, e.g.
 *   out/en/about-us/__next.$d$locale/about-us/__PAGE__.txt
 * but the client router requests the flat, dot-joined filename:
 *   out/en/about-us/__next.$d$locale.about-us.__PAGE__.txt
 * so every prefetch 404s on a static host and links fall back to full page
 * loads. This copies each nested file to the flat name the client asks for.
 * The nested originals are left in place.
 *
 *   npm run build   → next build, then this script (postbuild)
 */

import { promises as fs } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT_DIR = join(process.cwd(), "out");
const SEGMENT_DIR = /^__next\./;

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function flattenIn(dir) {
  let written = 0;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    if (!SEGMENT_DIR.test(entry.name)) {
      written += await flattenIn(full);
      continue;
    }
    for await (const file of walk(full)) {
      const flat = join(dir, relative(dir, file).split(sep).join("."));
      await fs.copyFile(file, flat);
      written += 1;
    }
  }
  return written;
}

const written = await flattenIn(OUT_DIR);
console.log(`flatten-segment-prefetch: ${written} prefetch file(s) written → out/`);
