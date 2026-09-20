import type { Rect } from "./types";

/**
 * Screen-space boxes for what the map draws (pins, name pills, city chips),
 * used to keep overlays clear of clickable things and to frame a city so every
 * warehouse is fully visible. They mirror the sizes set in PortfolioMap.
 */

const PIN_W = 48;
const PIN_H = 64;
const PILL_EM = 14;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Same scale the pin layer uses: zoom stops 5/9/15, interpolated by leasable msf 0..2. */
export function pinScale(zoom: number, msf: number, factor = 1): number {
  const m = clamp01(msf / 2);
  const at5 = lerp(0.5, 0.68, m);
  const at9 = lerp(0.62, 0.86, m);
  const at15 = lerp(0.92, 1.25, m);
  let scale: number;
  if (zoom <= 5) scale = at5;
  else if (zoom <= 9) scale = lerp(at5, at9, (zoom - 5) / 4);
  else if (zoom <= 15) scale = lerp(at9, at15, (zoom - 9) / 6);
  else scale = at15;
  return scale * factor;
}

/** Pin icon box; the tip sits on the coordinate. */
export function pinBox(x: number, y: number, zoom: number, msf: number, factor = 1): Rect {
  const s = pinScale(zoom, msf, factor);
  return { x: x - (PIN_W * s) / 2, y: y - PIN_H * s, w: PIN_W * s, h: PIN_H * s };
}

/** Name pill: to the right of and above the pin head (text-offset [1.9, -3.4] em). */
export function pillBox(name: string, msfLabel: string, x: number, y: number): Rect {
  const text = Math.max(name.length * 8.7, msfLabel.length * 7.6);
  const w = text + 26;
  const h = 52;
  return { x: x + 1.9 * PILL_EM, y: y - 3.4 * PILL_EM - h / 2, w, h };
}

/** City chip, anchored above the city centroid. */
export function cityChipBox(label: string, zoom: number, x: number, y: number): Rect {
  const fs = zoom <= 5 ? 13 : zoom >= 10 ? 16 : lerp(13, 16, (zoom - 5) / 5);
  const w = label.length * fs * 0.62 + 24;
  const h = fs * 1.2 + 12;
  return { x: x - w / 2, y: y - 1.3 * fs - h, w, h };
}

export function intersects(a: Rect, b: Rect, gap = 0): boolean {
  return (
    a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y
  );
}

export function overlapArea(a: Rect, b: Rect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

export function inside(inner: Rect, outer: Rect): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.w <= outer.x + outer.w &&
    inner.y + inner.h <= outer.y + outer.h
  );
}
