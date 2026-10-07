/**
 * Pre-renders responsive WebP variants of every photograph in public/images.
 *
 * The site is a static export (`output: "export"`), so there is no runtime image
 * optimiser — phones would otherwise download the 1800px desktop JPEGs. This
 * writes `public/_img/<same path>-<width>.webp` for each width in IMAGE_WIDTHS;
 * `src/lib/imageLoader.ts` (wired through next.config.ts) points next/image's
 * srcset at those files.
 *
 * Variants are never upscaled: a source narrower than the target width is
 * written once at its own width under that target's filename, so the loader can
 * always request any width in the list.
 *
 * Runs automatically before `next dev` / `next build` (see package.json) and is
 * incremental: a variant newer than its source is skipped. Output is git-ignored.
 */

import { mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "public", "images");
const OUT_DIR = join(ROOT, "public", "_img");
// Keep in sync with src/lib/imageLoader.ts
const IMAGE_WIDTHS = [480, 800, 1200, 1600];
const QUALITY = 72;
const EXCLUDE = /^(clients|logos)[\/]/; // small marks are served as authored

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function mtime(path) {
  try {
    return (await stat(path)).mtimeMs;
  } catch {
    return 0;
  }
}

let written = 0;
let skipped = 0;

for await (const file of walk(SRC_DIR)) {
  const rel = relative(SRC_DIR, file);
  if (!/\.(jpe?g|png)$/i.test(rel) || EXCLUDE.test(rel)) continue;

  const srcTime = await mtime(file);
  const base = join(OUT_DIR, "images", rel.replace(/\.(jpe?g|png)$/i, ""));
  const metaWidth = (await sharp(file).rotate().metadata()).width;
  // EXIF-rotated dimensions: for 90° orientations sharp reports the stored (unrotated) width
  const orientation = (await sharp(file).metadata()).orientation ?? 1;
  const width = orientation >= 5 ? (await sharp(file).metadata()).height : metaWidth;

  for (const target of IMAGE_WIDTHS) {
    const out = `${base}-${target}.webp`;
    if ((await mtime(out)) > srcTime) {
      skipped += 1;
      continue;
    }
    await mkdir(dirname(out), { recursive: true });
    await sharp(file)
      .rotate()
      .resize({ width: Math.min(target, width ?? target), withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(out);
    written += 1;
  }
}

console.log(
  `build-images: ${written} variant(s) written, ${skipped} up to date → ${relative(ROOT, OUT_DIR).split(sep).join("/")}/`,
);
