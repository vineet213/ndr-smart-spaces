import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from "maplibre-gl";

/**
 * Dark gold/maroon basemap for the city-level portfolio map.
 *
 * Vector tiles come from OpenFreeMap (free, no API key), which serves the
 * OpenMapTiles schema built from OpenStreetMap data. Every colour here is
 * chosen to sit on the section's charcoal ground: roads warm from brown to
 * gold as they get more important, water is a cold near-black, and labels are
 * ivory with a dark halo.
 */

const TILE_URL = "https://tiles.openfreemap.org/planet";
const GLYPHS = "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf";

const INK = "#faf7f2";
const HALO = "#14120f";

const NAME = ["coalesce", ["get", "name:en"], ["get", "name"]] as const;

const roadClass = (classes: readonly string[]) =>
  ["in", ["get", "class"], ["literal", classes]] as const;

const width = (base: number, z14: number, z18: number) =>
  [
    "interpolate",
    ["exponential", 1.4],
    ["zoom"],
    8,
    base * 0.75,
    14,
    z14 * 0.75,
    18,
    z18 * 0.75,
  ] as ExpressionSpecification;

const layers: LayerSpecification[] = [
  { id: "background", type: "background", paint: { "background-color": "#14120f" } },
  {
    id: "landcover",
    type: "fill",
    source: "openmaptiles",
    "source-layer": "landcover",
    paint: {
      "fill-color": ["match", ["get", "class"], "wood", "#171b15", "grass", "#191e17", "#161815"],
      "fill-opacity": 0.85,
    },
  },
  {
    id: "landuse",
    type: "fill",
    source: "openmaptiles",
    "source-layer": "landuse",
    paint: {
      "fill-color": [
        "match",
        ["get", "class"],
        "industrial",
        "#231f19",
        "commercial",
        "#211d19",
        "retail",
        "#221d18",
        "residential",
        "#181614",
        "cemetery",
        "#171915",
        "#191715",
      ],
      "fill-opacity": 0.9,
    },
  },
  {
    id: "park",
    type: "fill",
    source: "openmaptiles",
    "source-layer": "park",
    paint: { "fill-color": "#1a2018", "fill-opacity": 0.85 },
  },
  {
    id: "water",
    type: "fill",
    source: "openmaptiles",
    "source-layer": "water",
    paint: { "fill-color": "#0d1519" },
  },
  {
    id: "waterway",
    type: "line",
    source: "openmaptiles",
    "source-layer": "waterway",
    paint: { "line-color": "#132027", "line-width": width(0.4, 1.2, 4) },
  },
  {
    id: "aeroway",
    type: "fill",
    source: "openmaptiles",
    "source-layer": "aeroway",
    paint: { "fill-color": "#1f1c19" },
  },
  {
    id: "rail",
    type: "line",
    source: "openmaptiles",
    "source-layer": "transportation",
    minzoom: 10,
    filter: roadClass(["rail", "transit"]) as never,
    paint: { "line-color": "#3b352f", "line-width": 1, "line-dasharray": [3, 2] },
  },
  {
    id: "road-service",
    type: "line",
    source: "openmaptiles",
    "source-layer": "transportation",
    minzoom: 13,
    filter: roadClass(["service", "track", "path"]) as never,
    paint: { "line-color": "#27231f", "line-width": width(0.3, 0.8, 4) },
  },
  {
    id: "road-minor",
    type: "line",
    source: "openmaptiles",
    "source-layer": "transportation",
    minzoom: 11,
    filter: roadClass(["minor", "busway"]) as never,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#2f2a24", "line-width": width(0.4, 1.4, 9) },
  },
  {
    id: "road-tertiary",
    type: "line",
    source: "openmaptiles",
    "source-layer": "transportation",
    minzoom: 9,
    filter: roadClass(["tertiary"]) as never,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#3a3229", "line-width": width(0.5, 1.8, 11) },
  },
  {
    id: "road-secondary",
    type: "line",
    source: "openmaptiles",
    "source-layer": "transportation",
    minzoom: 8,
    filter: roadClass(["secondary"]) as never,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#4a3f30", "line-width": width(0.7, 2.2, 12) },
  },
  {
    id: "road-primary",
    type: "line",
    source: "openmaptiles",
    "source-layer": "transportation",
    minzoom: 6,
    filter: roadClass(["primary", "trunk"]) as never,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#6b5936", "line-width": width(0.9, 2.8, 14) },
  },
  {
    id: "road-motorway",
    type: "line",
    source: "openmaptiles",
    "source-layer": "transportation",
    minzoom: 5,
    filter: roadClass(["motorway"]) as never,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#9d7a3c", "line-width": width(1.1, 3.4, 16) },
  },
  {
    id: "boundary-district",
    type: "line",
    source: "openmaptiles",
    "source-layer": "boundary",
    minzoom: 7,
    filter: ["in", ["get", "admin_level"], ["literal", [5, 6]]] as never,
    paint: {
      "line-color": "rgba(250, 247, 242, 0.09)",
      "line-width": 0.8,
      "line-dasharray": [2, 3],
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0, 9, 1, 11, 1, 12, 0],
    },
  },
  {
    id: "boundary-country",
    type: "line",
    source: "openmaptiles",
    "source-layer": "boundary",
    filter: ["==", ["get", "admin_level"], 2] as never,
    paint: { "line-color": "rgba(250, 247, 242, 0.16)", "line-width": 1 },
  },
  {
    id: "boundary",
    type: "line",
    source: "openmaptiles",
    "source-layer": "boundary",
    minzoom: 6.5,
    filter: ["in", ["get", "admin_level"], ["literal", [3, 4]]] as never,
    paint: {
      "line-color": "rgba(240, 182, 90, 0.35)",
      "line-width": 1,
      "line-dasharray": [4, 3],
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 6.5, 0, 8, 1],
    },
  },
  {
    id: "building",
    type: "fill",
    source: "openmaptiles",
    "source-layer": "building",
    minzoom: 13,
    paint: {
      "fill-color": "#2e2924",
      "fill-outline-color": "#3d362e",
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 15, 0.95],
    },
  },
  {
    id: "water-name",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "water_name",
    minzoom: 8,
    layout: {
      "text-field": NAME as never,
      "text-font": ["Noto Sans Italic"],
      "text-size": 12,
    },
    paint: { "text-color": "#5f8493", "text-halo-color": HALO, "text-halo-width": 1 },
  },
  {
    id: "road-name",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "transportation_name",
    minzoom: 14.5,
    layout: {
      "symbol-placement": "line",
      "text-field": NAME as never,
      "text-font": ["Noto Sans Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 13, 10, 18, 13],
      "text-letter-spacing": 0.04,
    },
    paint: {
      "text-color": "rgba(250, 247, 242, 0.55)",
      "text-halo-color": HALO,
      "text-halo-width": 1.4,
    },
  },
  {
    id: "place-state",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "place",
    minzoom: 6.2,
    maxzoom: 9,
    filter: ["==", ["get", "class"], "state"] as never,
    layout: {
      "text-field": NAME as never,
      "text-font": ["Noto Sans Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 4, 11, 8, 15],
      "text-transform": "uppercase",
      "text-letter-spacing": 0.28,
    },
    paint: {
      "text-color": "rgba(240, 182, 90, 0.55)",
      "text-halo-color": HALO,
      "text-halo-width": 1.5,
    },
  },
  {
    id: "place-minor",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "place",
    minzoom: 13.5,
    filter: [
      "in",
      ["get", "class"],
      ["literal", ["suburb", "neighbourhood", "quarter", "hamlet", "isolated_dwelling"]],
    ] as never,
    layout: {
      "text-field": NAME as never,
      "text-font": ["Noto Sans Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 11, 10, 16, 13],
      "text-transform": "uppercase",
      "text-letter-spacing": 0.1,
    },
    paint: {
      "text-color": "rgba(250, 247, 242, 0.5)",
      "text-halo-color": HALO,
      "text-halo-width": 1.4,
    },
  },
  {
    id: "place-village",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "place",
    minzoom: 12.5,
    filter: ["==", ["get", "class"], "village"] as never,
    layout: {
      "text-field": NAME as never,
      "text-font": ["Noto Sans Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 9, 11, 15, 14],
    },
    paint: {
      "text-color": "rgba(250, 247, 242, 0.7)",
      "text-halo-color": HALO,
      "text-halo-width": 1.5,
    },
  },
  {
    id: "place-town",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "place",
    minzoom: 8.5,
    filter: ["==", ["get", "class"], "town"] as never,
    layout: {
      "text-field": NAME as never,
      "text-font": ["Noto Sans Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 6, 11, 14, 16],
    },
    paint: {
      "text-color": "rgba(250, 247, 242, 0.85)",
      "text-halo-color": HALO,
      "text-halo-width": 1.6,
    },
  },
  {
    id: "place-city",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "place",
    minzoom: 5.8,
    filter: ["==", ["get", "class"], "city"] as never,
    layout: {
      "text-field": NAME as never,
      "text-font": ["Noto Sans Bold"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 4, 10, 8, 12, 14, 20],
    },
    paint: { "text-color": INK, "text-halo-color": HALO, "text-halo-width": 1.8 },
  },
];

/* Roads fade in as the camera closes on them so detail arrives continuously. */
for (const layer of layers) {
  if (layer.type === "line" && layer.id.startsWith("road-") && typeof layer.minzoom === "number") {
    layer.paint = {
      ...layer.paint,
      "line-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        layer.minzoom,
        0,
        layer.minzoom + 1.5,
        1,
      ],
    };
  }
}

export const cityMapStyle: StyleSpecification = {
  version: 8,
  glyphs: GLYPHS,
  sources: {
    openmaptiles: { type: "vector", url: TILE_URL },
  },
  layers,
};
