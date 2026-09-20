import type { Map as MapLibreMap } from "maplibre-gl";
import { pinBox } from "./layout";
import { layoutLabels } from "./labelLayout";
import type { LabelItem } from "./labelLayout";
import type { Rect } from "./types";

export type PinLabel = {
  id: string;
  name: string;
  msfLabel: string;
  msf: number;
  lon: number;
  lat: number;
};

export type CityLabel = {
  city: string;
  count: number;
  lon: number;
  lat: number;
};

export type CalloutLabel = {
  id: string;
  eyebrow: string;
  title: string;
  figures: readonly { value: string; label: string }[];
  msf: number;
  lon: number;
  lat: number;
};

export type LabelState = {
  level: "state" | "city";
  pins: readonly PinLabel[];
  cities: readonly CityLabel[];
  namesOn: boolean;
  hoveredId: string | null;
  spotlightId: string | null;
  callout: CalloutLabel | null;
  flying: boolean;
  safeRect: () => Rect;
};

export const CALLOUT_ID = "__callout";

/**
 * Owns the DOM elements of every name box and moves them straight from the
 * layout result, so the map camera never triggers a React render.
 */
export class LabelDom {
  private elements = new Map<string, HTMLElement>();
  private lines = new Map<string, SVGLineElement>();
  private dots = new Map<string, SVGCircleElement>();
  private sizes = new Map<string, { w: number; h: number }>();
  private prefer = new Map<string, number>();
  private wasOn = new Set<string>();

  element = (id: string) => (el: HTMLElement | null) => {
    if (el) this.elements.set(id, el);
    else {
      this.elements.delete(id);
      this.sizes.delete(id);
      this.prefer.delete(id);
    }
  };

  line = (id: string) => (el: SVGLineElement | null) => {
    if (el) this.lines.set(id, el);
    else this.lines.delete(id);
  };

  dot = (id: string) => (el: SVGCircleElement | null) => {
    if (el) this.dots.set(id, el);
    else this.dots.delete(id);
  };

  forgetSizes() {
    this.sizes.clear();
  }

  private sizeOf(id: string) {
    const cached = this.sizes.get(id);
    if (cached) return cached;
    const el = this.elements.get(id);
    if (!el) return null;
    const measured = { w: el.offsetWidth, h: el.offsetHeight };
    if (measured.w > 0) this.sizes.set(id, measured);
    return measured;
  }

  update(map: MapLibreMap, now: LabelState) {
    const zoom = map.getZoom();
    const items: LabelItem[] = [];
    const pinBoxes = new Map<string, Rect>();
    const tips = new Map<string, { x: number; y: number }>();

    if (!now.flying) {
      if (now.level === "state") {
        now.cities.forEach((city, index) => {
          const id = `city:${city.city}`;
          const p = map.project([city.lon, city.lat]);
          tips.set(id, p);
          const size = this.sizeOf(id);
          if (!size) return;
          items.push({
            id,
            kind: "city",
            priority: 100 + index,
            head: { x: p.x - 5, y: p.y - 5, w: 10, h: 10 },
            size,
            prefer: this.prefer.get(id),
          });
        });
      } else {
        const rank = [...now.pins].sort((a, b) => b.msf - a.msf);
        for (const pin of now.pins) {
          const p = map.project([pin.lon, pin.lat]);
          const isCallout = now.callout?.id === pin.id;
          pinBoxes.set(pin.id, pinBox(p.x, p.y, zoom, pin.msf, isCallout ? 1.5 : 1));
          tips.set(pin.id, p);
        }
        for (const pin of now.pins) {
          if (now.callout?.id === pin.id) continue;
          const featured = pin.id === now.hoveredId || pin.id === now.spotlightId;
          if (!now.namesOn && !featured) continue;
          const size = this.sizeOf(pin.id);
          const head = pinBoxes.get(pin.id);
          if (!size || !head) continue;
          items.push({
            id: pin.id,
            kind: "pin",
            priority:
              pin.id === now.hoveredId
                ? 1
                : pin.id === now.spotlightId
                  ? 2
                  : 10 + rank.indexOf(pin),
            head,
            size,
            prefer: this.prefer.get(pin.id),
          });
        }
        if (now.callout) {
          const head = pinBoxes.get(now.callout.id);
          const size = this.sizeOf(CALLOUT_ID);
          if (head && size) {
            items.push({
              id: CALLOUT_ID,
              kind: "callout",
              priority: 0,
              head,
              size,
              prefer: this.prefer.get(CALLOUT_ID),
            });
          }
        }
      }
    }

    const result = layoutLabels(items, pinBoxes, [], now.safeRect());
    const shown = new Set<string>();
    let order = 0;
    for (const [id, el] of this.elements) {
      const placed = result.placed.get(id);
      const line = this.lines.get(id);
      if (!placed) {
        if (el.dataset.state !== "off") el.dataset.state = "off";
        line?.setAttribute("opacity", "0");
        continue;
      }
      this.prefer.set(id, placed.candidate);
      shown.add(id);
      el.style.transform = `translate(${Math.round(placed.box.x)}px, ${Math.round(placed.box.y)}px)`;
      el.style.transitionDelay = this.wasOn.has(id) ? "0ms" : `${Math.min(order * 45, 360)}ms`;
      order += 1;
      el.dataset.state = "on";
      if (line) {
        if (placed.leader) {
          line.setAttribute("x1", String(placed.leader.x1));
          line.setAttribute("y1", String(placed.leader.y1));
          line.setAttribute("x2", String(placed.leader.x2));
          line.setAttribute("y2", String(placed.leader.y2));
          line.setAttribute("opacity", "1");
        } else {
          line.setAttribute("opacity", "0");
        }
      }
    }
    this.wasOn = shown;

    for (const [id, dot] of this.dots) {
      const tip = tips.get(id);
      if (!tip || now.flying || now.level !== "state") {
        dot.setAttribute("opacity", "0");
        continue;
      }
      dot.setAttribute("cx", String(tip.x));
      dot.setAttribute("cy", String(tip.y));
      dot.setAttribute("opacity", "1");
    }
  }
}
