/**
 * Checks src/lib/data/warehouseDetails.json before every build.
 *
 * Fails (exit 1) when:
 *   - a record's key is not a published warehouse id in the AUM ledger;
 *   - a photo file is missing, has no alt text, or its width/height are wrong;
 *   - a number (coordinates, road distance) is not a finite number;
 *   - any record still lists `sampleFields` (placeholder content for review).
 *
 * The last rule is what keeps made-up specs off the live site: `npm run build`
 * (and so the deploy) stops while sample content remains. Preview builds for
 * client review pass `--allow-sample` (see `npm run build:preview`).
 *
 *   node scripts/validate-warehouses.mjs [--allow-sample]
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const allowSample = process.argv.includes("--allow-sample");

const details = JSON.parse(
  readFileSync(join(ROOT, "src/lib/data/warehouseDetails.json"), "utf8"),
);
const ledger = readFileSync(
  join(ROOT, "src/lib/data/generated/assetsUnderManagement.ts"),
  "utf8",
);
const publishedIds = new Set(
  [...ledger.matchAll(/"id":\s*"([^"]+)",\s*"status":\s*"published"/g)].map((match) => match[1]),
);

const errors = [];
const samples = [];
const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

for (const [id, record] of Object.entries(details)) {
  if (!publishedIds.has(id)) errors.push(`${id}: not a published warehouse id`);

  if (record.location && !(isNumber(record.location.lat) && isNumber(record.location.lon))) {
    errors.push(`${id}: location needs numeric lat and lon`);
  }

  for (const landmark of record.landmarks ?? []) {
    if (!isNumber(landmark.lat) || !isNumber(landmark.lon)) {
      errors.push(`${id}: landmark "${landmark.label}" needs numeric lat and lon`);
    }
    if (landmark.roadKm !== undefined && !isNumber(landmark.roadKm)) {
      errors.push(`${id}: landmark "${landmark.label}" roadKm must be a number`);
    }
  }

  for (const connection of record.connectivity ?? []) {
    if (!connection.label?.trim()) errors.push(`${id}: connectivity entry has no label`);
    if (!/^[<>]?\d+(\.\d+)?(–\d+(\.\d+)?)?$/.test(connection.km ?? "")) {
      errors.push(`${id}: connectivity "${connection.label}" km must look like "12–14" or "<1"`);
    }
  }

  for (const photo of record.photos ?? []) {
    const file = join(ROOT, "public", photo.src);
    if (!existsSync(file)) {
      errors.push(`${id}: photo not found: ${photo.src}`);
      continue;
    }
    if (!photo.alt || !photo.alt.trim()) errors.push(`${id}: photo has no alt text: ${photo.src}`);
    const meta = await sharp(file).rotate().metadata();
    const [width, height] =
      (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
    if (photo.width !== width || photo.height !== height) {
      errors.push(
        `${id}: ${photo.src} is ${width}x${height}, but the record says ${photo.width}x${photo.height}`,
      );
    }
  }

  if (record.sampleFields?.length) samples.push(`${id} (${record.sampleFields.join(", ")})`);
}

if (samples.length && !allowSample) {
  errors.push(
    `Sample content must be replaced before a live build: ${samples.join("; ")}. ` +
      "For a client preview, run `npm run build:preview` instead.",
  );
}

if (errors.length) {
  console.error(`validate-warehouses: ${errors.length} problem(s)`);
  for (const error of errors) console.error(`  · ${error}`);
  process.exit(1);
}

console.log(
  `validate-warehouses: ${Object.keys(details).length} record(s) OK` +
    (samples.length ? ` (sample content allowed for preview: ${samples.length})` : ""),
);
