/**
 * Artwork for the warehouse pins and name chips, drawn on a canvas at runtime
 * and handed to MapLibre with `map.addImage` (pixelRatio 2), so no image
 * files ship with the site.
 */

const GOLD = "#f0b65a";
const GOLD_LIGHT = "#f5c97f";
const MAROON = "#c14750";
const INK = "#faf7f2";
const CORE = "#14120f";

type PinKind = "aum" | "construction" | "selected";

function canvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const element = document.createElement("canvas");
  element.width = width;
  element.height = height;
  const ctx = element.getContext("2d");
  if (!ctx) throw new Error("2d canvas unavailable");
  return [element, ctx];
}

/** Teardrop map pin with a warehouse silhouette in its head. */
export function pinImage(kind: PinKind): ImageData {
  const width = 96;
  const height = 128;
  const [, ctx] = canvas(width, height);
  const cx = 48;
  const cy = 44;
  const r = 32;

  const body = kind === "aum" ? GOLD : MAROON;
  const rim = kind === "selected" ? GOLD : CORE;
  const glyph = kind === "construction" ? INK : GOLD;

  ctx.beginPath();
  ctx.moveTo(cx, 122);
  ctx.bezierCurveTo(cx - 6, 102, cx - r, 80, cx - r, cy);
  ctx.arc(cx, cy, r, Math.PI, Math.PI * 2, false);
  ctx.bezierCurveTo(cx + r, 80, cx + 6, 102, cx, 122);
  ctx.closePath();

  ctx.fillStyle = body;
  ctx.fill();
  ctx.lineJoin = "round";
  ctx.lineWidth = kind === "selected" ? 7 : 5;
  ctx.strokeStyle = rim;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 21, 0, Math.PI * 2);
  ctx.fillStyle = CORE;
  ctx.fill();

  ctx.fillStyle = glyph;
  ctx.beginPath();
  ctx.moveTo(cx - 13, cy + 10);
  ctx.lineTo(cx - 13, cy - 3);
  ctx.lineTo(cx, cy - 12);
  ctx.lineTo(cx + 13, cy - 3);
  ctx.lineTo(cx + 13, cy + 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = CORE;
  ctx.fillRect(cx - 5, cy + 1, 10, 9);

  return ctx.getImageData(0, 0, width, height);
}
