import type { Feature, MultiPolygon } from "geojson";
import { INDIA_STATE_BOUNDS, INDIA_STATE_PATHS } from "@/lib/data/india-state-paths";
import { MAP_VIEWBOX, PROJECTION } from "@/lib/data/portfolio";

export type LonLat = [number, number];
export type LonLatBounds = [LonLat, LonLat];

/** Inverse of the atlas projection: viewBox units back to longitude/latitude. */
function unproject(x: number, y: number): LonLat {
  return [
    PROJECTION.lonMin + (x / MAP_VIEWBOX.width) * PROJECTION.lonSpan,
    PROJECTION.latMax - (y / MAP_VIEWBOX.height) * PROJECTION.latSpan,
  ];
}

const TOKEN = /([MLZ])|(-?\d*\.?\d+)/g;

/** The atlas paths only use absolute M / L / Z commands, one ring per sub-path. */
function pathToRings(path: string): LonLat[][] {
  const rings: LonLat[][] = [];
  let current: LonLat[] = [];
  const numbers: number[] = [];
  let command = "";

  const flushPoint = () => {
    if (numbers.length >= 2) {
      current.push(unproject(numbers[0], numbers[1]));
      numbers.length = 0;
    }
  };
  const closeRing = () => {
    if (current.length > 2) {
      const [first] = current;
      current.push([first[0], first[1]]);
      rings.push(current);
    }
    current = [];
  };

  for (const match of path.matchAll(TOKEN)) {
    if (match[1]) {
      flushPoint();
      command = match[1];
      if (command === "M") closeRing();
      if (command === "Z") closeRing();
    } else if (match[2] !== undefined && command !== "Z") {
      numbers.push(Number(match[2]));
      if (numbers.length === 2) flushPoint();
    }
  }
  closeRing();
  return rings;
}

const cache = new Map<string, Feature<MultiPolygon>>();

/** A state outline as GeoJSON, built from the same paths the SVG atlas draws. */
export function stateFeature(stateId: string): Feature<MultiPolygon> | null {
  const cached = cache.get(stateId);
  if (cached) return cached;
  const path = INDIA_STATE_PATHS[stateId];
  if (!path) return null;
  const feature: Feature<MultiPolygon> = {
    type: "Feature",
    properties: { id: stateId },
    geometry: { type: "MultiPolygon", coordinates: pathToRings(path).map((ring) => [ring]) },
  };
  cache.set(stateId, feature);
  return feature;
}

/** Longitude/latitude bounds of a state, [[west, south], [east, north]]. */
export function stateLonLatBounds(stateId: string): LonLatBounds | null {
  const bounds = INDIA_STATE_BOUNDS[stateId];
  if (!bounds) return null;
  const [west, north] = unproject(bounds.x, bounds.y);
  const [east, south] = unproject(bounds.x + bounds.width, bounds.y + bounds.height);
  return [
    [west, south],
    [east, north],
  ];
}

export function stateLonLatCenter(stateId: string): LonLat | null {
  const bounds = stateLonLatBounds(stateId);
  if (!bounds) return null;
  return [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
}
