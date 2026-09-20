import { inside, intersects } from "./layout";
import type { Point, Rect } from "./types";

/**
 * Deterministic placement of every name box on the map.
 *
 * Each label is tried at a fixed list of positions around the thing it names;
 * the first position that touches nothing already placed, no pin icon, and
 * stays inside the safe area wins. If none fits the label is suppressed. Since
 * every placement is checked against every earlier placement, two boxes can
 * never intersect.
 */

export type LabelKind = "pin" | "city" | "callout";

export type LabelItem = {
  id: string;
  kind: LabelKind;
  /** Lower placed first, so it wins any conflict. */
  priority: number;
  /** Box of the thing being named (pin icon or city dot); leaders end here. */
  head: Rect;
  size: { w: number; h: number };
  /** Candidate used last time, kept while it stays valid so labels do not jitter. */
  prefer?: number;
};

export type Placed = {
  id: string;
  box: Rect;
  candidate: number;
  /** Line from the box edge to the head, only when the box sits away from it. */
  leader: { x1: number; y1: number; x2: number; y2: number } | null;
};

export type LayoutResult = { placed: Map<string, Placed>; suppressed: string[] };

const GAP = 8;
const CLEAR = 6;

function candidates(item: LabelItem): { box: Rect; far: boolean }[] {
  const { head: h, size } = item;
  const { w, h: bh } = size;
  const cx = h.x + h.w / 2;
  const cy = h.y + h.h / 2;
  const out: { box: Rect; far: boolean }[] = [];
  const push = (x: number, y: number, far = false) => out.push({ box: { x, y, w, h: bh }, far });

  if (item.kind === "city") {
    push(cx - w / 2, h.y - GAP - bh);
    push(h.x + h.w + GAP, cy - bh / 2);
    push(h.x - GAP - w, cy - bh / 2);
    push(cx - w / 2, h.y + h.h + GAP);
  } else {
    const upper = h.y + h.h * 0.15 - bh / 2;
    const lower = h.y + h.h * 0.75 - bh / 2;
    push(h.x + h.w + GAP, upper);
    push(h.x + h.w + GAP, lower);
    push(h.x - GAP - w, upper);
    push(h.x - GAP - w, lower);
    push(cx - w / 2, h.y - GAP - bh);
    push(cx - w / 2, h.y + h.h + GAP);
  }

  // A second ring further out, joined to the pin by a leader line.
  const reach = GAP * 4;
  push(h.x + h.w + reach, h.y - reach - bh * 0.5, true);
  push(h.x - reach - w, h.y - reach - bh * 0.5, true);
  push(h.x + h.w + reach, h.y + h.h + reach - bh * 0.5, true);
  push(h.x - reach - w, h.y + h.h + reach - bh * 0.5, true);
  push(cx - w / 2, h.y - reach * 2 - bh, true);
  push(cx - w / 2, h.y + h.h + reach * 2, true);
  return out;
}

function leaderFor(box: Rect, head: Rect): Placed["leader"] {
  const hx = head.x + head.w / 2;
  const hy = head.y + head.h / 2;
  const x2 = hx;
  const y2 = hy;
  const x1 = Math.min(Math.max(hx, box.x), box.x + box.w);
  const y1 = Math.min(Math.max(hy, box.y), box.y + box.h);
  return { x1, y1, x2, y2 };
}

export function layoutLabels(
  items: readonly LabelItem[],
  /** Boxes labels must stay clear of, keyed so a label can ignore its own pin. */
  pinBoxes: ReadonlyMap<string, Rect>,
  fixed: readonly Rect[],
  safe: Rect,
): LayoutResult {
  const ordered = [...items].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  const placed = new Map<string, Placed>();
  const taken: Rect[] = [];
  const suppressed: string[] = [];

  for (const item of ordered) {
    const options = candidates(item);
    const order = options.map((_, index) => index);
    if (item.prefer !== undefined && item.prefer >= 0 && item.prefer < options.length) {
      order.splice(order.indexOf(item.prefer), 1);
      order.unshift(item.prefer);
    }

    let chosen = -1;
    for (const index of order) {
      const { box } = options[index];
      if (!inside(box, safe)) continue;
      if (taken.some((other) => intersects(box, other, CLEAR))) continue;
      if (fixed.some((other) => intersects(box, other))) continue;
      let hitsPin = false;
      for (const [id, pin] of pinBoxes) {
        if (id !== item.id && intersects(box, pin, 2)) {
          hitsPin = true;
          break;
        }
      }
      if (hitsPin) continue;
      chosen = index;
      break;
    }

    if (chosen < 0) {
      suppressed.push(item.id);
      continue;
    }
    const { box, far } = options[chosen];
    taken.push(box);
    placed.set(item.id, {
      id: item.id,
      box,
      candidate: chosen,
      leader: far ? leaderFor(box, item.head) : null,
    });
  }

  return { placed, suppressed };
}

/** Test helper: every pair of placed boxes must be disjoint. */
export function firstOverlap(placed: ReadonlyMap<string, Placed>): [string, string] | null {
  const list = [...placed.values()];
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      if (intersects(list[i].box, list[j].box)) return [list[i].id, list[j].id];
    }
  }
  return null;
}

export type { Point };
