#!/usr/bin/env node
/**
 * MapLibre GL 6 starts its tile worker from a file next to its own module.
 * A bundler moves that module, so the worker file is served from `public/`
 * and pointed at with `setWorkerUrl` (see CityMap.tsx). Re-run after changing
 * the maplibre-gl version; it also runs on `npm install`.
 */

import { copyFileSync, existsSync, mkdirSync } from "node:fs";

const from = new URL("../node_modules/maplibre-gl/dist/", import.meta.url);
const to = new URL("../public/vendor/maplibre/", import.meta.url);
const files = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

if (!existsSync(from)) {
  console.warn("maplibre-gl is not installed; skipping worker copy.");
  process.exit(0);
}

mkdirSync(to, { recursive: true });
for (const file of files) copyFileSync(new URL(file, from), new URL(file, to));
console.log(`Copied ${files.length} MapLibre worker files to public/vendor/maplibre/`);
