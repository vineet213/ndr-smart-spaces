/**
 * Generates the artwork for the Residential Plotting "drawn, then painted"
 * scroll reveal (src/components/sections/SketchReveal.tsx) from one render.
 *
 *   node scripts/residential-sketch.mjs
 *
 * Outputs (public/images/residential/):
 *   masterplan-photo.jpg / masterplan-photo-1200.jpg  the colour render
 *   masterplan-sketch.png   R = ink lines (difference of Gaussians, two scales)
 *                     G = pencil hatching, density following the tone
 *   masterplan-timemap.png  when each pixel appears, 0-255 = 0-1 of its phase:
 *                     R = ink: a left-to-right sweep plus distance travelled
 *                         along the lines themselves, so strokes grow
 *                     G = hatching, in diagonal bands
 *                     B = paint: bristled brush sweeps, time running along
 *                         each stroke
 */
import os from "node:os";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "Project resources/residential plotting/gallery-14.jpg";
const OUT = "public/images/residential";
const W = 2400;
const H = 1350;
const TW = 1200; // time map size
const TH = 675;

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

await sharp(SRC)
  .resize(W, H)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(OUT, "masterplan-photo.jpg"));
await sharp(SRC)
  .resize(1200, 675)
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(OUT, "masterplan-photo-1200.jpg"));

const { data: rgb } = await sharp(SRC)
  .resize(W, H)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const gray = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) {
  gray[i] = (0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2]) / 255;
}

/* ── ink lines: difference of Gaussians on brightness, plus colour edges ─ */

const smooth = blur(gray, W, H, 0.7);
function dogLines(sigma, k, lo, hi) {
  const a = blur(smooth, W, H, sigma);
  const b = blur(smooth, W, H, sigma * k);
  const out = new Float32Array(W * H);
  // a pixel darker than its surroundings becomes ink
  for (let i = 0; i < out.length; i++) out[i] = smoothstep(lo, hi, b[i] - a[i]);
  return out;
}
const fine = dogLines(0.9, 1.7, 0.014, 0.05);
const coarse = dogLines(2.2, 1.7, 0.02, 0.065);

// edges between areas of different colour but similar brightness (pink
// paths on sand, grass on paving), which a brightness-only pass misses
const colourInk = new Float32Array(W * H);
for (let c = 0; c < 3; c++) {
  const ch = new Float32Array(W * H);
  for (let i = 0; i < ch.length; i++) ch[i] = rgb[i * 3 + c] / 255;
  const a = blur(ch, W, H, 1.0);
  const b = blur(ch, W, H, 2.0);
  for (let i = 0; i < ch.length; i++) {
    colourInk[i] = Math.max(colourInk[i], smoothstep(0.035, 0.1, Math.abs(a[i] - b[i])));
  }
}
const ink = new Float32Array(W * H);
for (let i = 0; i < ink.length; i++) {
  // a firmer pen: lift faint lines towards full strength
  ink[i] = Math.pow(Math.max(fine[i], coarse[i] * 0.85, colourInk[i] * 0.7), 0.7);
}

/* ── shading: soft graphite tone, hatching only on planting ─────────────── */

// classic pencil tone: grayscale colour-dodged by its blurred inverse
const inv = new Float32Array(W * H);
for (let i = 0; i < inv.length; i++) inv[i] = 1 - gray[i];
const invBlur = blur(inv, W, H, 9);
// local texture: tree canopies are busy, lawns and the pitch are flat
const mean = blur(gray, W, H, 4);
const sq = new Float32Array(W * H);
for (let i = 0; i < sq.length; i++) sq[i] = gray[i] * gray[i];
const meanSq = blur(sq, W, H, 4);
const shade = new Float32Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const pencil = clamp01(gray[i] / Math.max(0.001, 1 - invBlur[i])); // 1 = paper
    const graphite = Math.pow(1 - pencil, 0.85) * 0.55;
    // planting: greener than it is red or blue, and not too bright
    const r = rgb[i * 3] / 255;
    const g = rgb[i * 3 + 1] / 255;
    const b = rgb[i * 3 + 2] / 255;
    const veg = smoothstep(0.015, 0.08, g - Math.max(r, b)) * smoothstep(0.8, 0.35, gray[i]);
    let hatch = 0;
    if (veg > 0.05) {
      const texture = smoothstep(
        0.025,
        0.07,
        Math.sqrt(Math.max(0, meanSq[i] - mean[i] * mean[i])),
      );
      const dark = smoothstep(0.75, 0.2, gray[i]) * (0.45 + texture * 0.55);
      const wobble = (fbm(x / 70, y / 70, 3) - 0.5) * 4;
      // flat grass: sparse single hatching; canopies: dense, crossed
      const spacing = texture > 0.5 ? 6 : 10;
      const p1 = (((x + y + wobble) % spacing) + spacing) % spacing;
      const run1 = noise((x - y) / 10, (x + y) / 6, 17) > 0.3;
      hatch = run1 && p1 < 0.9 + dark * 1.6 ? 1 : 0;
      if (dark > 0.5 && texture > 0.5) {
        const p2 = (((x - y + wobble) % 7) + 7) % 7;
        const run2 = noise((x + y) / 10, (x - y) / 7, 19) > 0.35;
        if (run2 && p2 < (dark - 0.5) * 2.4) hatch = 1;
      }
      hatch *= veg * (0.3 + dark * 0.55) * (0.55 + texture * 0.45);
    }
    const grain = 0.8 + fbm(x / 2.5, y / 2.5, 11) * 0.4;
    shade[i] = clamp01(Math.max(graphite, hatch) * grain);
  }
}

const sketchBuf = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  sketchBuf[i * 3] = Math.round(ink[i] * 255);
  sketchBuf[i * 3 + 1] = Math.round(shade[i] * 255);
  sketchBuf[i * 3 + 2] = 0;
}
await sharp(sketchBuf, { raw: { width: W, height: H, channels: 3 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, "masterplan-sketch.png"));

/* Preview of the finished drawing, for checking by eye (written to the OS temp folder). */
const preview = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  const d = clamp01(Math.max(ink[i], shade[i] * 0.6));
  const paper = [250, 247, 242];
  const graphite = [38, 36, 34];
  for (let c = 0; c < 3; c++)
    preview[i * 3 + c] = Math.round(paper[c] + (graphite[c] - paper[c]) * d);
}
await sharp(preview, { raw: { width: W, height: H, channels: 3 } })
  .jpeg({ quality: 85 })
  .toFile(path.join(os.tmpdir(), "residential-sketch-preview.jpg"));

/* ── time map ───────────────────────────────────────────────────────────── */

const N = TW * TH;
const S = W / TW;

// ink mask at time-map resolution (max of each 2x2 block)
const mask = new Uint8Array(N);
for (let y = 0; y < TH; y++) {
  for (let x = 0; x < TW; x++) {
    let m = 0;
    for (let dy = 0; dy < S; dy++)
      for (let dx = 0; dx < S; dx++) m = Math.max(m, ink[(y * S + dy) * W + x * S + dx]);
    mask[y * TW + x] = m > 0.2 ? 1 : 0;
  }
}

// R: seeds on a coarse grid start at a left-to-right sweep time; ink then
// grows outward from them along the lines (bucket-queue Dijkstra).
const BUCKETS = 8192;
const T_RANGE = 2; // bucket queue covers times 0-2; normalised afterwards
const inkTime = new Float64Array(N).fill(Infinity);
const CAP = N * 9;
const head = new Int32Array(BUCKETS).fill(-1);
const nextEntry = new Int32Array(CAP);
const entryPixel = new Int32Array(CAP);
let entries = 0;
const push = (bucket, pixel) => {
  if (entries >= CAP) return;
  entryPixel[entries] = pixel;
  nextEntry[entries] = head[bucket];
  head[bucket] = entries++;
};
// Every connected piece of line is seeded at its leftmost-on-the-sweep
// pixel, at the sweep's time there; it then grows outward along itself.
const sweepAt = (x, y) => 0.88 * (x / TW) + 0.06 * (y / TH) + hash(x, y, 9) * 0.02;
const label = new Int32Array(N).fill(-1);
const stack = new Int32Array(N);
let components = 0;
for (let start = 0; start < N; start++) {
  if (!mask[start] || label[start] !== -1) continue;
  let top = 0;
  stack[top++] = start;
  label[start] = components;
  let seed = start;
  let seedT = sweepAt(start % TW, Math.floor(start / TW));
  while (top > 0) {
    const i = stack[--top];
    const x = i % TW;
    const y = (i - x) / TW;
    const t = sweepAt(x, y);
    if (t < seedT) {
      seedT = t;
      seed = i;
    }
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= TW || ny >= TH) continue;
        const j = ny * TW + nx;
        if (mask[j] && label[j] === -1) {
          label[j] = components;
          stack[top++] = j;
        }
      }
    }
  }
  inkTime[seed] = seedT;
  push(Math.floor((seedT / T_RANGE) * (BUCKETS - 1)), seed);
  components++;
}
const STEP = 0.88 / TW; // time per pixel along a line: the sweep's own pace
for (let b = 0; b < BUCKETS; b++) {
  while (head[b] !== -1) {
    const e = head[b];
    head[b] = nextEntry[e];
    const i = entryPixel[e];
    const t = inkTime[i];
    if (Math.floor((t / T_RANGE) * (BUCKETS - 1)) < b) continue; // stale entry
    const x = i % TW;
    const y = (i - x) / TW;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= TW || ny >= TH) continue;
        const j = ny * TW + nx;
        if (!mask[j]) continue;
        const nt = t + STEP * (dx && dy ? 1.414 : 1);
        if (nt < inkTime[j]) {
          inkTime[j] = nt;
          push(Math.min(BUCKETS - 1, Math.floor((nt / T_RANGE) * (BUCKETS - 1))), j);
        }
      }
    }
  }
}
// normalise, then extend times a few pixels past the lines so bilinear
// sampling at full resolution never mixes in "never" (1.0)
let maxT = 0;
for (let i = 0; i < N; i++) if (inkTime[i] !== Infinity) maxT = Math.max(maxT, inkTime[i]);
for (let i = 0; i < N; i++)
  inkTime[i] = inkTime[i] === Infinity ? Infinity : (inkTime[i] / maxT) * 0.97;
for (let pass = 0; pass < 4; pass++) {
  const next = inkTime.slice();
  for (let y = 0; y < TH; y++) {
    for (let x = 0; x < TW; x++) {
      const i = y * TW + x;
      if (inkTime[i] !== Infinity) continue;
      let m = Infinity;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < TW && ny < TH) m = Math.min(m, inkTime[ny * TW + nx]);
        }
      next[i] = m;
    }
  }
  inkTime.set(next);
}

// G: hatching fills in diagonal bands, left to right, with a soft wobble
const shadeTime = new Float32Array(N);
for (let y = 0; y < TH; y++) {
  for (let x = 0; x < TW; x++) {
    const band = (x * 0.75 + y * 0.45) / (TW * 0.75 + TH * 0.45);
    shadeTime[y * TW + x] = clamp01(band * 0.85 + fbm(x / 40, y / 40, 21) * 0.15);
  }
}

// B: brush sweeps. Each is a solid core plus bristles of varied width and
// length with ragged ends; time runs along the stroke.
const strokes = [];
const diag = [0.68, -0.73]; // bottom-left to top-right in normalised space
const starts = [
  [0.3, 0.98],
  [0.08, 0.72],
  [0.52, 1.05],
  [0.02, 0.38],
  [0.7, 1.02],
  [0.2, 0.55],
  [0.44, 0.7],
  [0.84, 0.85],
  [0.6, 0.45],
  [-0.04, 1.0],
  [0.32, 0.3],
  [0.9, 0.5],
  [0.12, 0.15],
  [0.74, 0.2],
];
starts.forEach(([sx, sy], k) => {
  const len = 0.75 + hash(k, 1, 31) * 0.35;
  strokes.push({
    sx,
    sy,
    ex: sx + diag[0] * len,
    ey: sy + diag[1] * len * (TW / TH) * 0.56,
    hw: 0.075 + hash(k, 2, 31) * 0.04, // half-width, in width units
    start: (k / starts.length) * 0.82,
    dur: 0.2,
    seed: k * 17 + 3,
  });
});
const paintTime = new Float32Array(N).fill(1);
const BRISTLES = 44;
for (const s of strokes) {
  const ax = (s.ex - s.sx) * TW;
  const ay = (s.ey - s.sy) * TH;
  const L = Math.hypot(ax, ay);
  const ux = ax / L;
  const uy = ay / L;
  const hwPx = s.hw * TW;
  const bristle = Array.from({ length: BRISTLES }, (_, b) => ({
    reach: 0.86 + hash(b, s.seed, 41) * 0.2, // how far along this bristle paints
    gap: hash(b, s.seed, 43), // outer bristles with a high gap value are skipped
    lag: hash(b, s.seed, 47) * 0.05,
  }));
  for (let y = 0; y < TH; y++) {
    for (let x = 0; x < TW; x++) {
      const px = x - s.sx * TW;
      const py = y - s.sy * TH;
      const along = (px * ux + py * uy) / L;
      if (along < -0.02 || along > 1.08) continue;
      const across = (-px * uy + py * ux) / hwPx; // -1..1 inside the nominal width
      const wob = (fbm(along * 6, s.seed, 51) - 0.5) * 0.25;
      const c = Math.abs(across + wob);
      if (c > 1.18) continue;
      const bi = Math.max(
        0,
        Math.min(BRISTLES - 1, Math.floor(((across + 1.18) / 2.36) * BRISTLES)),
      );
      const br = bristle[bi];
      const outer = c > 0.72;
      if (outer && br.gap > 1.1 - c * 0.6) continue; // streaky edges
      const ragged = (fbm(x / 9, y / 9, s.seed) - 0.5) * 0.08;
      const reach = outer ? br.reach - (c - 0.72) * 0.35 : Math.max(br.reach, 1.0);
      if (along > reach + ragged) continue;
      const t =
        s.start +
        s.dur * (clamp01(along) / Math.max(reach, 0.5)) +
        br.lag +
        (hash(x, y, 61) - 0.5) * 0.008;
      const i = y * TW + x;
      if (t < paintTime[i]) paintTime[i] = t;
    }
  }
}

// a slight blur feathers the painted edge so it reads as wet paint, not a cut
const paintSoft = blur(paintTime, TW, TH, 1.3);

const timeBuf = Buffer.alloc(N * 3);
for (let i = 0; i < N; i++) {
  timeBuf[i * 3] = Math.round(clamp01(inkTime[i] === Infinity ? 1 : inkTime[i]) * 255);
  timeBuf[i * 3 + 1] = Math.round(shadeTime[i] * 255);
  timeBuf[i * 3 + 2] = Math.round(clamp01(paintSoft[i]) * 255);
}
await sharp(timeBuf, { raw: { width: TW, height: TH, channels: 3 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, "masterplan-timemap.png"));

let covered = 0;
for (let i = 0; i < N; i++) if (paintTime[i] < 1) covered++;
console.log(`ink pieces: ${components}`);
console.log(`done: paint covers ${((covered / N) * 100).toFixed(1)}% before the final fill`);
