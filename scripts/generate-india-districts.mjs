#!/usr/bin/env node
/**
 * Generate `src/lib/data/india-district-paths.ts` — backdrop shapes for the
 * portfolio atlas's state→city zoom, drawn from the same public per-state
 * district GeoJSON already used by `scripts/generate-india-states.mjs`
 * (https://github.com/udit-001/india-maps-data, `geojson/states/<state>.geojson`).
 *
 * Unlike the state script, no dissolve is needed: each district here is
 * already a single feature in its source state file, matched by exact
 * `properties.district` name. Only the specific districts the city-zoom
 * feature needs are emitted (not all ~700 districts in India) — extend the
 * DISTRICTS list below and re-run when a new city group needs a backdrop.
 *
 * Usage:
 *   node scripts/generate-india-districts.mjs <dir-of-state-geojson-files>
 *
 * The output module is committed; re-run only when the DISTRICTS list or the
 * projection changes. Nothing here runs at build time.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** [id, district property value, source state geojson file (without extension)] */
const DISTRICTS = [
  ["coimbatore", "Coimbatore", "tamil-nadu"],
  ["thiruvallur", "Thiruvallur", "tamil-nadu"],
  ["kancheepuram", "Kancheepuram", "tamil-nadu"],
  ["bengaluru-rural", "Bengaluru Rural", "karnataka"],
  ["howrah", "Howrah", "west-bengal"],
  ["raigad", "Raigad", "maharashtra"],
  ["pune", "Pune", "maharashtra"],
  ["gurugram", "Gurugram", "haryana"],
  ["south-goa", "South Goa", "goa"],
];

// Same equirectangular fit as src/lib/data/portfolio.ts (PROJECTION/MAP_VIEWBOX).
const PROJECTION = { lonMin: 68.2, lonSpan: 97.4 - 68.2, latMax: 37.1, latSpan: 37.1 - 8.07 };
const VIEWBOX = { width: 930, height: 1000 };

function project([lon, lat]) {
  return {
    x: ((lon - PROJECTION.lonMin) / PROJECTION.lonSpan) * VIEWBOX.width,
    y: ((PROJECTION.latMax - lat) / PROJECTION.latSpan) * VIEWBOX.height,
  };
}

/** Drop collinear points, then Douglas-Peucker simplification (pixel space). */
function simplify(points, tolerance) {
  if (points.length < 4) return points;
  const sqTol = tolerance * tolerance;

  const sqSegDist = (p, a, b) => {
    let x = a.x, y = a.y, dx = b.x - x, dy = b.y - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = b.x; y = b.y; } else if (t > 0) { x += dx * t; y += dy * t; }
    }
    dx = p.x - x; dy = p.y - y;
    return dx * dx + dy * dy;
  };

  const firstPass = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const a = firstPass[firstPass.length - 1], p = points[i];
    if ((p.x - a.x) ** 2 + (p.y - a.y) ** 2 > 0.01) firstPass.push(p);
  }
  firstPass.push(points[points.length - 1]);
  if (firstPass.length < 4) return firstPass;

  const keep = new Uint8Array(firstPass.length);
  keep[0] = 1; keep[firstPass.length - 1] = 1;
  const stack = [[0, firstPass.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxDist = 0, index = -1;
    for (let i = first + 1; i < last; i++) {
      const dist = sqSegDist(firstPass[i], firstPass[first], firstPass[last]);
      if (dist > maxDist) { maxDist = dist; index = i; }
    }
    if (maxDist > sqTol && index > 0) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  return firstPass.filter((_, i) => keep[i]);
}

const round1 = (value) => Math.round(value * 10) / 10;

function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: node scripts/generate-india-districts.mjs <dir-of-state-geojson-files>");
    process.exit(1);
  }

  const paths = {};
  const bounds = {};
  const missing = [];
  const stateCache = new Map();

  for (const [id, districtName, stateFile] of DISTRICTS) {
    if (!stateCache.has(stateFile)) {
      stateCache.set(
        stateFile,
        JSON.parse(readFileSync(join(dir, `${stateFile}.geojson`), "utf8")),
      );
    }
    const geojson = stateCache.get(stateFile);
    const feature = geojson.features.find(
      (f) => f.properties && f.properties.district === districtName,
    );
    if (!feature) { missing.push(`${districtName} (${stateFile})`); continue; }

    const { geometry } = feature;
    const polygons =
      geometry.type === "Polygon" ? [geometry.coordinates]
      : geometry.type === "MultiPolygon" ? geometry.coordinates
      : [];

    const loops = polygons.map((rings) =>
      rings.map((ring) => simplify(ring.map(project), 0.6)),
    );

    const d = loops
      .flat()
      .map((loop) => loop.map((p, i) => `${i === 0 ? "M" : "L"}${round1(p.x)} ${round1(p.y)}`).join("") + "Z")
      .join("");
    paths[id] = d;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const loop of loops.flat())
      for (const point of loop) {
        if (point.x < minX) minX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.x > maxX) maxX = point.x;
        if (point.y > maxY) maxY = point.y;
      }
    bounds[id] = {
      x: round1(minX),
      y: round1(minY),
      width: round1(maxX - minX),
      height: round1(maxY - minY),
    };
  }

  if (missing.length) {
    console.error("Districts not found:", missing.join(", "));
    process.exit(1);
  }

  const source = `/**
 * India district geometry — generated by
 * \`scripts/generate-india-districts.mjs\` from the same public per-state
 * district GeoJSON used for the state outlines (simplified in the site's
 * equirectangular projection). Committed static data; do not edit by hand.
 * Coordinates live in the portfolio atlas viewBox (930×1000).
 *
 * Only the districts the state→city map zoom needs are included here — see
 * the DISTRICTS list in the generation script to add more.
 */

export type DistrictBounds = { x: number; y: number; width: number; height: number };

export const INDIA_DISTRICT_PATHS: Readonly<Record<string, string>> = ${JSON.stringify(paths, null, 2)};

export const INDIA_DISTRICT_BOUNDS: Readonly<Record<string, DistrictBounds>> = ${JSON.stringify(bounds, null, 2)};
`;
  writeFileSync(new URL("../src/lib/data/india-district-paths.ts", import.meta.url), source, "utf8");
  const bytes = Buffer.byteLength(source, "utf8");
  console.log(`Wrote india-district-paths.ts — ${(bytes / 1024).toFixed(1)} KB, ${Object.keys(paths).length} districts`);
}

main();
