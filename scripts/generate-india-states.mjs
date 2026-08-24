#!/usr/bin/env node
/**
 * Generate `src/lib/data/india-state-paths.ts` from an India districts GeoJSON.
 *
 * The source file (district-level features with an `st_nm` property, e.g.
 * https://github.com/udit-001/india-maps-data geojson/india.geojson) is
 * dissolved into state polygons by cancelling shared edges, simplified with
 * Douglas-Peucker in the site's equirectangular projection, and emitted as SVG
 * path strings keyed by the canonical state ids from
 * `src/lib/data/india-states.ts`.
 *
 * Usage:
 *   node scripts/generate-india-states.mjs <path-to-india.geojson>
 *
 * The output module is committed; re-run only when boundaries or the
 * projection change. Nothing here runs at build time.
 */

import { readFileSync, writeFileSync } from "node:fs";

const STATES = [
  ["andhra-pradesh", "Andhra Pradesh"],
  ["arunachal-pradesh", "Arunachal Pradesh"],
  ["assam", "Assam"],
  ["bihar", "Bihar"],
  ["chhattisgarh", "Chhattisgarh"],
  ["goa", "Goa"],
  ["gujarat", "Gujarat"],
  ["haryana", "Haryana"],
  ["himachal-pradesh", "Himachal Pradesh"],
  ["jharkhand", "Jharkhand"],
  ["karnataka", "Karnataka"],
  ["kerala", "Kerala"],
  ["madhya-pradesh", "Madhya Pradesh"],
  ["maharashtra", "Maharashtra"],
  ["manipur", "Manipur"],
  ["meghalaya", "Meghalaya"],
  ["mizoram", "Mizoram"],
  ["nagaland", "Nagaland"],
  ["odisha", "Odisha"],
  ["punjab", "Punjab"],
  ["rajasthan", "Rajasthan"],
  ["sikkim", "Sikkim"],
  ["tamil-nadu", "Tamil Nadu"],
  ["telangana", "Telangana"],
  ["tripura", "Tripura"],
  ["uttar-pradesh", "Uttar Pradesh"],
  ["uttarakhand", "Uttarakhand"],
  ["west-bengal", "West Bengal"],
  ["andaman-and-nicobar-islands", "Andaman and Nicobar Islands"],
  ["chandigarh", "Chandigarh"],
  ["dadra-and-nagar-haveli-and-daman-and-diu", "Dadra and Nagar Haveli and Daman and Diu"],
  ["delhi", "Delhi"],
  ["jammu-and-kashmir", "Jammu and Kashmir"],
  ["ladakh", "Ladakh"],
  ["lakshadweep", "Lakshadweep"],
  ["puducherry", "Puducherry"],
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

function ringKey(point) {
  return `${point[0].toFixed(6)},${point[1].toFixed(6)}`;
}

function edgeKey(a, b) {
  const ka = ringKey(a), kb = ringKey(b);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

function shoelace(loop) {
  let sum = 0;
  for (let i = 0, n = loop.length; i < n; i++) {
    const a = loop[i], b = loop[(i + 1) % n];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

/** Dissolve exterior rings by cancelling edges shared by two districts. */
function dissolveRings(rings) {
  const counts = new Map();
  const edgeCoords = new Map();
  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i], b = ring[i + 1];
      if (ringKey(a) === ringKey(b)) continue;
      const key = edgeKey(a, b);
      counts.set(key, (counts.get(key) ?? 0) + 1);
      if (!edgeCoords.has(key)) edgeCoords.set(key, { a, b });
    }
  }

  const incident = new Map();
  const survivors = [];
  for (const [key, coords] of edgeCoords) {
    if ((counts.get(key) ?? 0) !== 1) continue;
    const edge = { ...coords, key, used: false };
    survivors.push(edge);
    for (const point of [coords.a, coords.b]) {
      const pointKey = ringKey(point);
      const list = incident.get(pointKey) ?? [];
      list.push(edge);
      incident.set(pointKey, list);
    }
  }

  const loops = [];
  for (const seed of survivors) {
    if (seed.used) continue;
    seed.used = true;
    const headKey = ringKey(seed.a);
    const loop = [seed.a, seed.b];
    while (ringKey(loop[loop.length - 1]) !== headKey) {
      const tail = ringKey(loop[loop.length - 1]);
      const next = (incident.get(tail) ?? []).find((edge) => !edge.used);
      if (!next) break;
      next.used = true;
      const tailPoint = loop[loop.length - 1];
      loop.push(ringKey(next.a) === ringKey(tailPoint) ? next.b : next.a);
    }
    if (loop.length >= 4 && ringKey(loop[loop.length - 1]) === headKey) {
      loop.pop();
      loops.push(loop.map(project));
    }
  }
  // Drop dissolved-away slivers (sub-km artefacts of imperfect tessellation).
  return loops.filter((loop) => Math.abs(shoelace(loop)) > 0.0002);
}

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("Usage: node scripts/generate-india-states.mjs <path-to-india.geojson>");
    process.exit(1);
  }
  const geojson = JSON.parse(readFileSync(input, "utf8"));

  const byState = new Map(STATES.map(([id]) => [id, []]));
  const unmatched = new Set();
  const seenRings = new Set();
  for (const feature of geojson.features) {
    const name = feature.properties.st_nm;
    // The dataset mixes in pre-dissolved state outlines (no `district`
    // property). They would pair with every coastal district edge and leave
    // no boundary behind, so only true districts take part in the dissolve.
    if (!feature.properties.district) continue;
    const entry = STATES.find(([, displayName]) => displayName === name);
    if (!entry) { unmatched.add(name); continue; }
    const { geometry } = feature;
    const polygons =
      geometry.type === "Polygon" ? [geometry.coordinates]
      : geometry.type === "MultiPolygon" ? geometry.coordinates
      : [];
    for (const polygon of polygons) {
      const signature = polygon[0].map((p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`).join(";");
      if (seenRings.has(signature)) continue; // duplicated UT features
      seenRings.add(signature);
      byState.get(entry[0]).push(polygon[0]);
    }
  }
  if (unmatched.size) console.error("Unmatched feature names:", [...unmatched].join(", "));

  const paths = {};
  const bounds = {};
  let missing = [];
  for (const [id] of STATES) {
    const rings = byState.get(id);
    if (rings.length === 0) { missing.push(id); continue; }
    const loops = dissolveRings(rings).map((loop) => simplify(loop, 1.2));
    if (loops.length === 0) { missing.push(id); continue; }
    const d = loops
      .map((loop) => loop.map((p, i) => `${i === 0 ? "M" : "L"}${round1(p.x)} ${round1(p.y)}`).join("") + "Z")
      .join("");
    paths[id] = d;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const loop of loops)
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

  if (missing.length) console.error("States without geometry:", missing.join(", "));
  const body = JSON.stringify({ paths, bounds }, null, 2)
    .replace(/"([a-z-]+)":/g, '"$1":');
  const source = `/**
 * India state geometry — generated by \`scripts/generate-india-states.mjs\`
 * from a public districts GeoJSON (dissolved to states, simplified in the
 * site's equirectangular projection). Committed static data; do not edit by
 * hand. Coordinates live in the portfolio atlas viewBox (930×1000).
 */

export type StateBounds = { x: number; y: number; width: number; height: number };

export const INDIA_STATE_PATHS: Readonly<Record<string, string>> = ${JSON.stringify(paths, null, 2)};

export const INDIA_STATE_BOUNDS: Readonly<Record<string, StateBounds>> = ${JSON.stringify(bounds, null, 2)};
`;
  writeFileSync(new URL("../src/lib/data/india-state-paths.ts", import.meta.url), source, "utf8");
  const bytes = Buffer.byteLength(source, "utf8");
  const points = Object.values(paths).reduce((sum, d) => sum + (d.match(/L/g)?.length ?? 0) + 1, 0);
  console.log(`Wrote india-state-paths.ts — ${(bytes / 1024).toFixed(1)} KB, ${points} points, ${Object.keys(paths).length} states`);
}

main();
