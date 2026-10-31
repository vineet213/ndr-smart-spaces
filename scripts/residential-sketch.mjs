/**
 * Generates the artwork for the Residential Plotting "drawn, then painted"
 * scroll reveal (src/components/sections/SketchReveal.tsx) from one render.
 *
 *   node scripts/residential-sketch.mjs
 *
 * The render is read as a plan rather than traced as a picture: green is
 * plots, pale grey inside the site is road, white on green is a plot number.
 *
 * Outputs (public/images/residential/):
 *   masterplan-photo.jpg / masterplan-photo-1200.jpg  the colour render, cropped
 *   masterplan-sketch.png   R = roads (the block outlines)
 *                           G = plot lines and plot numbers
 *                           B = the site boundary, drawn in gold
 *   masterplan-timemap.png  when each pixel appears, 0-255 = 0-1 of its phase:
 *                           R, G = a wave out from the entrance
 *                           B = colour: roads, then block by block, then the
 *                               land around the site
 */
import os from "node:os";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "Project resources/residential plotting/gallery-14.jpg";
const OUT = "public/images/residential";
const W = 2400;
const H = 1230;
const TW = 1200; // time map size
const TH = 615;

// tight on the plots; 4096 x 2304 source, ratio matches IMAGE_ASPECT in SketchReveal
const CROP = { left: 50, top: 10, width: 3996, height: 2048 };

// the developed site, in output 0-1 coordinates: keeps the fields and sheds
// around it out of the drawing
const SITE = [
  [0.375, 0.02],
  [0.69, 0.02],
  [0.83, 0.25],
  [0.93, 0.31],
  [0.895, 0.385],
  [0.985, 0.49],
  [0.98, 0.76],
  [0.8, 0.8],
  [0.02, 0.815],
  [0.06, 0.66],
  [0.17, 0.55],
  [0.25, 0.32],
];
const ENTRANCE = [0.5, 0.74]; // the main road, where the drawing and the colour start

/* ── small image toolkit on Float32Arrays ──────────────────────────────── */

function boxBlur(src, w, h, r) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const span = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    let acc = 0;
    const row = y * w;
    for (let x = -r; x <= r; x++) acc += src[row + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = acc / span;
      acc += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let y = -r; y <= r; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc / span;
      acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}

/* Gaussian approximated by three box blurs. */
function blur(src, w, h, sigma) {
  const n = 3;
  const wIdeal = Math.sqrt((12 * sigma * sigma) / n + 1);
  let wl = Math.floor(wIdeal);
  if (wl % 2 === 0) wl--;
  const m = Math.round((12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4));
  let out = src;
  for (let i = 0; i < n; i++) {
    const size = i < m ? wl : wl + 2;
    out = boxBlur(out, w, h, Math.max(0, (size - 1) / 2));
  }
  return out;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* Deterministic value noise. */
function hash(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function noise(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, seed) {
  return (
    noise(x, y, seed) * 0.6 +
    noise(x * 2.1, y * 2.1, seed + 7) * 0.3 +
    noise(x * 4.3, y * 4.3, seed + 13) * 0.1
  );
}

/* ── load ──────────────────────────────────────────────────────────────── */

await mkdir(OUT, { recursive: true });

const cropped = () => sharp(SRC).extract(CROP);
await cropped()
  .resize(W, H)
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(OUT, "masterplan-photo.jpg"));
await cropped()
  .resize(1200, 615)
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(OUT, "masterplan-photo-1200.jpg"));

const { data: rgb } = await cropped()
  .resize(W, H)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

/* ── read the plan ─────────────────────────────────────────────────────── */

function inPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const site = new Float32Array(W * H);
const green = new Float32Array(W * H); // plots: a clean, saturated green
const number = new Float32Array(W * H); // plot numbers: white on green
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    if (!inPolygon(x / W, y / H, SITE)) continue;
    site[i] = 1;
    const r = rgb[i * 3] / 255;
    const g = rgb[i * 3 + 1] / 255;
    const b = rgb[i * 3 + 2] / 255;
    if (g > r * 1.05 && g > b * 1.12 && g > 0.2) green[i] = 1;
    if (Math.min(r, g, b) > 0.62) number[i] = 1;
  }
}

// a plot block: blur over the numbers, fill what is left enclosed, then
// smooth the outline so roadside trees leave no bumps
const blockRough = blur(green, W, H, 8);
{
  const outside = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let top = 0;
  outside[0] = 1;
  queue[top++] = 0;
  while (top > 0) {
    const i = queue[--top];
    const x = i % W;
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) {
      if (j >= 0 && j < W * H && !outside[j] && blockRough[j] < 0.5) {
        outside[j] = 1;
        queue[top++] = j;
      }
    }
  }
  for (let i = 0; i < blockRough.length; i++) blockRough[i] = outside[i] ? 0 : 1;
}
const siteSoft = blur(site, W, H, 6);
for (let i = 0; i < blockRough.length; i++) blockRough[i] *= siteSoft[i] > 0.75 ? 1 : 0;
const blockSoft = blur(blockRough, W, H, 3.5);

// an even-width line along one level of a smooth field
function contour(field, level, width) {
  const out = new Float32Array(W * H);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = (field[i + 1] - field[i - 1]) / 2;
      const gy = (field[i + W] - field[i - W]) / 2;
      const d = Math.abs(field[i] - level) / Math.max(Math.hypot(gx, gy), 0.002);
      out[i] = 1 - smoothstep(width * 0.5, width * 0.5 + 1, d);
    }
  }
  return out;
}

const roads = contour(blockSoft, 0.5, 1.4);

// the site boundary follows the traced outline, softened into a drawn line
const boundary = contour(siteSoft, 0.5, 2.2);

// plot lines: where the checker of light and dark green changes, read from
// bright green pixels only so numbers and tree shadows leave no mark
const lit = new Float32Array(W * H);
const value = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) {
  lit[i] = green[i] && rgb[i * 3 + 1] > 80 ? 1 : 0;
  value[i] = lit[i] * (rgb[i * 3 + 1] / 255);
}
const weight = blur(lit, W, H, 3);
const sum = blur(value, W, H, 3);
const tone = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) tone[i] = sum[i] / Math.max(weight[i], 0.02);
const grad = new Float32Array(W * H);
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    const i = y * W + x;
    grad[i] = Math.hypot(tone[i + 1] - tone[i - 1], tone[i + W] - tone[i - W]);
  }
}
const gradWide = blur(grad, W, H, 3);
const cellThin = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) {
  const ridge = smoothstep(1.0, 1.35, grad[i] / Math.max(gradWide[i], 0.001));
  cellThin[i] = ridge * smoothstep(0.03, 0.06, grad[i]) * smoothstep(0.8, 0.98, blockSoft[i]);
}

const plots = new Float32Array(W * H);
for (let i = 0; i < plots.length; i++) {
  const figure = number[i] * smoothstep(0.8, 0.98, blockSoft[i]);
  plots[i] = clamp01(Math.max(cellThin[i] * 0.5, figure * 0.9));
}

const sketchBuf = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  sketchBuf[i * 3] = Math.round(roads[i] * 255);
  sketchBuf[i * 3 + 1] = Math.round(plots[i] * 255);
  sketchBuf[i * 3 + 2] = Math.round(boundary[i] * 255);
}
await sharp(sketchBuf, { raw: { width: W, height: H, channels: 3 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, "masterplan-sketch.png"));

/* Preview of the finished drawing, for checking by eye (written to the OS temp folder). */
const preview = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  const paper = [250, 247, 242];
  const graphite = [38, 36, 34];
  const gold = [214, 150, 58];
  const d = Math.max(roads[i], plots[i]);
  for (let c = 0; c < 3; c++) {
    const inked = paper[c] + (graphite[c] - paper[c]) * d;
    preview[i * 3 + c] = Math.round(inked + (gold[c] - inked) * boundary[i]);
  }
}
await sharp(preview, { raw: { width: W, height: H, channels: 3 } })
  .jpeg({ quality: 85 })
  .toFile(path.join(os.tmpdir(), "residential-sketch-preview.jpg"));

/* ── time map ───────────────────────────────────────────────────────────── */

const N = TW * TH;
const S = W / TW;
const down = (src) => {
  const out = new Float32Array(N);
  for (let y = 0; y < TH; y++) {
    for (let x = 0; x < TW; x++) out[y * TW + x] = src[y * S * W + x * S];
  }
  return out;
};

// R and G: one wave out from the entrance, with a little drift so it never
// reads as a perfect circle
const fromEntrance = new Float32Array(N);
let reach = 0;
for (let y = 0; y < TH; y++) {
  for (let x = 0; x < TW; x++) {
    const dx = (x - ENTRANCE[0] * TW) / TW;
    const dy = ((y - ENTRANCE[1] * TH) / TH) * (TH / TW);
    const d = Math.hypot(dx, dy) + (fbm(x / 90, y / 90, 21) - 0.5) * 0.05;
    fromEntrance[y * TW + x] = d;
    reach = Math.max(reach, d);
  }
}
for (let i = 0; i < N; i++) fromEntrance[i] = clamp01(fromEntrance[i] / reach);

// B: separate each plot block, then give every block its turn
const blockSmall = down(blockSoft);
const siteSmall = down(site);
const label = new Int32Array(N).fill(-1);
const stack = new Int32Array(N);
const blocks = [];
for (let start = 0; start < N; start++) {
  if (blockSmall[start] < 0.6 || label[start] !== -1) continue;
  let top = 0;
  stack[top++] = start;
  label[start] = blocks.length;
  let total = 0;
  let count = 0;
  while (top > 0) {
    const i = stack[--top];
    total += fromEntrance[i];
    count++;
    const x = i % TW;
    for (const j of [x > 0 ? i - 1 : -1, x < TW - 1 ? i + 1 : -1, i - TW, i + TW]) {
      if (j >= 0 && j < N && blockSmall[j] >= 0.6 && label[j] === -1) {
        label[j] = blocks.length;
        stack[top++] = j;
      }
    }
  }
  blocks.push({ count, near: total / count });
}
const order = blocks
  .map((b, k) => ({ ...b, k }))
  .filter((b) => b.count > 200)
  .sort((a, b) => a.near - b.near);
const turn = new Float32Array(blocks.length).fill(0.5);
order.forEach((b, rank) => {
  turn[b.k] = rank / Math.max(order.length - 1, 1);
});

// distance from the nearest road into each block: colour comes in from its edges
const edge = new Float32Array(N).fill(1e6);
for (let i = 0; i < N; i++) if (label[i] === -1) edge[i] = 0;
for (let y = 1; y < TH - 1; y++) {
  for (let x = 1; x < TW - 1; x++) {
    const i = y * TW + x;
    edge[i] = Math.min(edge[i], edge[i - 1] + 1, edge[i - TW] + 1);
  }
}
for (let y = TH - 2; y > 0; y--) {
  for (let x = TW - 2; x > 0; x--) {
    const i = y * TW + x;
    edge[i] = Math.min(edge[i], edge[i + 1] + 1, edge[i + TW] + 1);
  }
}

const paintTime = new Float32Array(N);
for (let i = 0; i < N; i++) {
  if (label[i] !== -1) {
    paintTime[i] = 0.16 + turn[label[i]] * 0.52 + Math.min(edge[i] / 70, 1) * 0.1;
  } else if (siteSmall[i]) {
    paintTime[i] = 0.02 + fromEntrance[i] * 0.2; // roads
  } else {
    paintTime[i] = 0.78 + fromEntrance[i] * 0.2; // the land around the site, last
  }
}
const paintSoft = blur(paintTime, TW, TH, 1.6);

const timeBuf = Buffer.alloc(N * 3);
for (let i = 0; i < N; i++) {
  timeBuf[i * 3] = Math.round(fromEntrance[i] * 255);
  timeBuf[i * 3 + 1] = Math.round(fromEntrance[i] * 255);
  timeBuf[i * 3 + 2] = Math.round(clamp01(paintSoft[i]) * 255);
}
await sharp(timeBuf, { raw: { width: TW, height: TH, channels: 3 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, "masterplan-timemap.png"));

console.log(`plot blocks: ${order.length}`);
