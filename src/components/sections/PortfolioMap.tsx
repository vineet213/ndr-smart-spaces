"use client";

import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ExpressionSpecification, FilterSpecification } from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Feature, FeatureCollection, MultiPolygon, Point as GeoPoint } from "geojson";
import type { AtlasPinData, StateAumSummary } from "@/lib/data/portfolio";
import { INDIA_STATE_PATHS } from "@/lib/data/india-state-paths";
import { indianStateById } from "@/lib/data/india-states";
import { cityMapStyle } from "@/lib/map/cityMapStyle";
import { inside, pinBox } from "@/lib/map/layout";
import { pinImage } from "@/lib/map/pinImages";
import { stateFeature, stateLonLatBounds } from "@/lib/map/stateGeo";
import type { LonLat } from "@/lib/map/stateGeo";
import type { Rect } from "@/lib/map/types";
import { cx } from "../ui/cx";
import { PortfolioLabels } from "./PortfolioLabels";
import type { CalloutLabel, CityLabel, PinLabel } from "./PortfolioLabels";
import styles from "./PortfolioMap.module.css";

export type MapContext = { flying: boolean };

export type CalloutContent = {
  eyebrow: string;
  title: string;
  figures: readonly { value: string; label: string }[];
};

type PortfolioMapProps = {
  /** Every pin for the current mode. */
  pins: readonly AtlasPinData[];
  /** Selectable states for the current mode. */
  states: readonly StateAumSummary[];
  stateId: string | null;
  cityId: string | null;
  parcelId: string | null;
  hoveredId: string | null;
  /** A warehouse to draw attention to without opening it (e.g. after a search). */
  spotlightId: string | null;
  hoveredStateId: string | null;
  tone: "aum" | "construction";
  sheetOpen: boolean;
  /** Content of the pointing callout for the open warehouse. */
  callout: CalloutContent | null;
  onCloseCallout: () => void;
  onSelectState: (stateId: string | null) => void;
  onSelectCity: (city: string | null) => void;
  onSelectParcel: (id: string) => void;
  onHoverParcel: (id: string | null) => void;
  onHoverState: (stateId: string | null) => void;
  onBackground: () => void;
  onReady: () => void;
  onFailure: () => void;
  children?: (context: MapContext) => ReactNode;
};

const WORKER_URL = "/vendor/maplibre/maplibre-gl-worker.mjs";
const PANEL_RESERVE = 400;
const PARCEL_ZOOM = 15.5;
const CITY_MAX_ZOOM = 18;
/** How long warehouse name boxes stay up before they fade away on their own. */
const NAMES_MS = 5500;
const PIN_LAYERS = ["pin", "pin-hover", "pin-selected"];
const INDIA_BOUNDS: [LonLat, LonLat] = [
  [68.4, 6.6],
  [97.6, 35.9],
];

const GOLD = "#f0b65a";
const INK = "#faf7f2";

const hovered = ["boolean", ["feature-state", "hover"], false] as const;

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function pinCollection(pins: readonly AtlasPinData[]): FeatureCollection<GeoPoint> {
  return {
    type: "FeatureCollection",
    features: pins
      .filter((pin) => pin.lat !== undefined && pin.lon !== undefined)
      .map((pin) => ({
        type: "Feature",
        id: pin.id,
        geometry: { type: "Point", coordinates: [pin.lon!, pin.lat!] },
        properties: {
          id: pin.id,
          name: pin.name,
          city: pin.city ?? "",
          state: pin.stateId ?? "",
          msf: pin.leasableAreaMsf ?? 0.3,
        },
      })),
  };
}

function stateCollection(states: readonly StateAumSummary[]): FeatureCollection<MultiPolygon> {
  const selectable = new Set(states.map((state) => state.stateId));
  const features: Feature<MultiPolygon>[] = [];
  for (const id of Object.keys(INDIA_STATE_PATHS)) {
    const base = stateFeature(id);
    if (!base) continue;
    features.push({
      type: "Feature",
      id,
      geometry: base.geometry,
      properties: { id, name: indianStateById(id)?.name ?? id, selectable: selectable.has(id) },
    });
  }
  return { type: "FeatureCollection", features };
}

function pinBounds(pins: readonly AtlasPinData[]): maplibregl.LngLatBounds | null {
  const bounds = new maplibregl.LngLatBounds();
  let any = false;
  for (const pin of pins) {
    if (pin.lat === undefined || pin.lon === undefined) continue;
    bounds.extend([pin.lon, pin.lat]);
    any = true;
  }
  return any ? bounds : null;
}

function cityLabels(pins: readonly AtlasPinData[]): CityLabel[] {
  const groups = new Map<string, AtlasPinData[]>();
  for (const pin of pins) {
    if (!pin.city || pin.lat === undefined || pin.lon === undefined) continue;
    const list = groups.get(pin.city);
    if (list) list.push(pin);
    else groups.set(pin.city, [pin]);
  }
  return [...groups.entries()]
    .map(([city, list]) => ({
      city,
      count: list.length,
      lon: list.reduce((sum, p) => sum + p.lon!, 0) / list.length,
      lat: list.reduce((sum, p) => sum + p.lat!, 0) / list.length,
    }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
}

/** Pin scale by zoom and leasable size: bigger sites read as bigger pins. */
function pinSize(factor: number): ExpressionSpecification {
  const at = (small: number, large: number) => [
    "interpolate",
    ["linear"],
    ["get", "msf"],
    0,
    small * factor,
    2,
    large * factor,
  ];
  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    5,
    at(0.5, 0.68),
    9,
    at(0.62, 0.86),
    15,
    at(0.92, 1.25),
  ] as unknown as ExpressionSpecification;
}

/** State fill: gold where the group has assets, fading out as the street map takes over. */
function stateFillOpacity(hasSelection: boolean): ExpressionSpecification {
  const at = (k: number) => [
    "case",
    ["boolean", ["feature-state", "active"], false],
    0.04 * k,
    ["boolean", ["feature-state", "hover"], false],
    (hasSelection ? 0.26 : 0.38) * k,
    ["==", ["get", "selectable"], true],
    (hasSelection ? 0.08 : 0.17) * k,
    0.03 * k,
  ];
  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    6,
    at(1),
    9,
    at(0.3),
  ] as unknown as ExpressionSpecification;
}

const idFilter = (id: string | null): FilterSpecification =>
  ["==", ["get", "id"], id ?? ""] as unknown as FilterSpecification;

/** Only the open city's pins exist on the map; everything else is filtered out. */
const cityPinFilter = (stateId: string | null, cityId: string | null): FilterSpecification =>
  (stateId && cityId
    ? ["all", ["==", ["get", "state"], stateId], ["==", ["get", "city"], cityId]]
    : ["==", ["get", "id"], ""]) as unknown as FilterSpecification;

type Frame =
  | {
      kind: "bounds";
      bounds: maplibregl.LngLatBoundsLike;
      maxZoom: number;
      check: readonly AtlasPinData[];
    }
  | { kind: "point"; center: LonLat };

export default function PortfolioMap({
  pins,
  states,
  stateId,
  cityId,
  parcelId,
  hoveredId,
  spotlightId,
  hoveredStateId,
  tone,
  sheetOpen,
  callout,
  onCloseCallout,
  onSelectState,
  onSelectCity,
  onSelectParcel,
  onHoverParcel,
  onHoverState,
  onBackground,
  onReady,
  onFailure,
  children,
}: PortfolioMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [flying, setFlying] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; label: string } | null>(null);
  const [namesOn, setNamesOn] = useState(false);
  const [alwaysNames, setAlwaysNames] = useState(false);
  const namesTimer = useRef<number | undefined>(undefined);
  const atHome = useRef(true);
  /** The zoom a state or city was framed at; zooming well past it steps up one level. */
  const fitRef = useRef<{ armed: boolean; zoom: number | null }>({ armed: false, zoom: null });

  const handlerSet = {
    onSelectState,
    onSelectCity,
    onSelectParcel,
    onHoverParcel,
    onHoverState,
    onBackground,
    onReady,
    onFailure,
  };
  const handlers = useRef(handlerSet);
  useEffect(() => {
    handlers.current = handlerSet;
  });

  const pinData = useMemo(() => pinCollection(pins), [pins]);
  const stateData = useMemo(() => stateCollection(states), [states]);
  const stateInfo = useMemo(
    () => new Map(states.map((state) => [state.stateId, state] as const)),
    [states],
  );
  const stateInfoRef = useRef(stateInfo);
  useEffect(() => {
    stateInfoRef.current = stateInfo;
  }, [stateInfo]);

  const statePins = useMemo(
    () => (stateId ? pins.filter((pin) => pin.stateId === stateId) : []),
    [pins, stateId],
  );
  const cityPins = useMemo(
    () => (cityId ? statePins.filter((pin) => pin.city === cityId) : []),
    [statePins, cityId],
  );
  const parcelPin = useMemo(
    () => (parcelId ? (pins.find((pin) => pin.id === parcelId) ?? null) : null),
    [pins, parcelId],
  );
  const pinIcon = tone === "aum" ? "pin-aum" : "pin-con";

  /* what the overlay draws */
  const level: "state" | "city" = cityId ? "city" : "state";
  const cityLabelList = useMemo(
    () => (stateId && !cityId ? cityLabels(statePins) : []),
    [stateId, cityId, statePins],
  );
  const pinLabelList = useMemo<PinLabel[]>(
    () =>
      cityPins
        .filter((pin) => pin.lat !== undefined && pin.lon !== undefined)
        .map((pin) => ({
          id: pin.id,
          name: pin.name,
          msfLabel:
            pin.leasableAreaMsf !== undefined
              ? `${pin.leasableAreaMsf.toLocaleString("en-IN")} msf`
              : "",
          msf: pin.leasableAreaMsf ?? 0.3,
          lon: pin.lon!,
          lat: pin.lat!,
        })),
    [cityPins],
  );
  const calloutLabel = useMemo<CalloutLabel | null>(
    () =>
      callout && parcelPin && parcelPin.lat !== undefined && parcelPin.lon !== undefined
        ? {
            id: parcelPin.id,
            ...callout,
            msf: parcelPin.leasableAreaMsf ?? 0.3,
            lon: parcelPin.lon,
            lat: parcelPin.lat,
          }
        : null,
    [callout, parcelPin],
  );

  const padding = useCallback((): Required<maplibregl.PaddingOptions> => {
    const wrapper = wrapperRef.current;
    const width = wrapper?.clientWidth ?? 1200;
    const height = wrapper?.clientHeight ?? 700;
    if (width >= 768) return { top: 84, bottom: 64, left: PANEL_RESERVE + 30, right: 90 };
    return {
      top: 84,
      bottom: sheetOpen ? Math.round(height * 0.5) + 10 : 90,
      left: 20,
      right: 70,
    };
  }, [sheetOpen]);

  /** Where boxes may sit: the map minus the panel, controls, context bar and legend band. */
  const safeRect = useCallback((): Rect => {
    const wrapper = wrapperRef.current;
    const w = wrapper?.clientWidth ?? 1200;
    const h = wrapper?.clientHeight ?? 700;
    if (w >= 768) {
      const x = PANEL_RESERVE + 10;
      return { x, y: 76, w: w - x - 84, h: h - 76 - 64 };
    }
    const bottom = sheetOpen ? Math.round(h * 0.5) + 10 : 90;
    return { x: 10, y: 76, w: w - 10 - 64, h: h - 76 - bottom };
  }, [sheetOpen]);

  /* One function describes where the camera should be for the current selection. */
  const frame = useCallback((): Frame => {
    if (parcelPin && parcelPin.lat !== undefined && parcelPin.lon !== undefined) {
      return { kind: "point", center: [parcelPin.lon, parcelPin.lat] };
    }
    const cityBounds = pinBounds(cityPins);
    if (cityBounds) {
      return { kind: "bounds", bounds: cityBounds, maxZoom: CITY_MAX_ZOOM, check: cityPins };
    }
    if (stateId) {
      return {
        kind: "bounds",
        bounds: stateLonLatBounds(stateId) ?? INDIA_BOUNDS,
        maxZoom: 10,
        check: [],
      };
    }
    return { kind: "bounds", bounds: INDIA_BOUNDS, maxZoom: 6, check: [] };
  }, [parcelPin, cityPins, stateId]);

  const frameRef = useRef(frame);
  const paddingRef = useRef(padding);
  const safeRef = useRef(safeRect);
  const liveRef = useRef({ cityId, stateId });
  useEffect(() => {
    frameRef.current = frame;
    paddingRef.current = padding;
    safeRef.current = safeRect;
    liveRef.current = { cityId, stateId };
  });

  /**
   * Frame the selection. For a city, every pin must be fully visible: the
   * padding is widened step by step until all pin icons sit inside the safe
   * area, then one animated fitBounds does the move, so MapLibre keeps the
   * centre and padding consistent.
   */
  const settle = (map: maplibregl.Map, next: Frame, duration: number) => {
    const pad = paddingRef.current();
    atHome.current = next.kind === "bounds" && next.bounds === INDIA_BOUNDS;
    fitRef.current = { armed: next.kind === "bounds", zoom: null };
    if (next.kind === "point") {
      const options = {
        center: next.center,
        zoom: Math.max(map.getZoom(), PARCEL_ZOOM),
        padding: pad,
      };
      if (duration > 0) map.flyTo({ ...options, duration, curve: 1.4, essential: true });
      else map.jumpTo(options);
      return;
    }
    let finalPad = pad;
    if (next.check.length > 0) {
      const prev = { center: map.getCenter(), zoom: map.getZoom(), padding: map.getPadding() };
      const safe = safeRef.current();
      const fits = () =>
        next.check.every((pin) => {
          if (pin.lat === undefined || pin.lon === undefined) return true;
          const p = map.project([pin.lon, pin.lat]);
          return inside(pinBox(p.x, p.y, map.getZoom(), pin.leasableAreaMsf ?? 0.3), safe);
        });
      let inflate = 0;
      for (let i = 0; i < 9; i += 1) {
        finalPad = {
          top: pad.top + inflate,
          bottom: pad.bottom + inflate,
          left: pad.left + inflate,
          right: pad.right + inflate,
        };
        map.fitBounds(next.bounds, { padding: finalPad, maxZoom: next.maxZoom, duration: 0 });
        if (fits()) break;
        inflate += 30;
      }
      map.jumpTo(prev);
    }
    map.fitBounds(next.bounds, {
      padding: finalPad,
      maxZoom: next.maxZoom,
      duration,
      curve: 1.4,
      essential: true,
    });
  };
  const settleRef = useRef(settle);
  useEffect(() => {
    settleRef.current = settle;
  });

  /* name boxes appear on arrival, then fade away by themselves */
  const revealNames = useCallback(() => {
    window.clearTimeout(namesTimer.current);
    setNamesOn(true);
    namesTimer.current = window.setTimeout(() => setNamesOn(false), NAMES_MS);
  }, []);
  const revealRef = useRef(revealNames);
  useEffect(() => {
    revealRef.current = revealNames;
  });
  useEffect(() => () => window.clearTimeout(namesTimer.current), []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (cityId) revealNames();
      else {
        window.clearTimeout(namesTimer.current);
        setNamesOn(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [cityId, revealNames]);

  /* map lifecycle */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let map: maplibregl.Map;
    try {
      maplibregl.setWorkerUrl(WORKER_URL);
      const initial = frameRef.current();
      map = new maplibregl.Map({
        container: canvas,
        style: cityMapStyle,
        ...(initial.kind === "point"
          ? { center: initial.center, zoom: PARCEL_ZOOM }
          : {
              bounds: initial.bounds,
              fitBoundsOptions: { padding: paddingRef.current(), maxZoom: initial.maxZoom },
            }),
        minZoom: 3.2,
        maxZoom: 18.5,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        cooperativeGestures: true,
      });
    } catch {
      handlers.current.onFailure();
      return;
    }
    mapRef.current = map;
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      /* runtime-drawn pin artwork */
      map.addImage("pin-aum", pinImage("aum"), { pixelRatio: 2 });
      map.addImage("pin-con", pinImage("construction"), { pixelRatio: 2 });
      map.addImage("pin-sel", pinImage("selected"), { pixelRatio: 2 });

      map.addSource("states", { type: "geojson", data: stateData, promoteId: "id" });
      map.addSource("selected", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addSource("pins", { type: "geojson", data: pinData, promoteId: "id" });

      /* states: the country-level view. Fills start invisible and are revealed by an effect. */
      map.addLayer({
        id: "states-fill",
        type: "fill",
        source: "states",
        paint: {
          "fill-color": ["case", ["==", ["get", "selectable"], true], GOLD, INK] as never,
          "fill-opacity": 0,
          "fill-opacity-transition": { duration: 1400, delay: 150 },
        } as never,
      });
      map.addLayer({
        id: "states-line",
        type: "line",
        source: "states",
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "selectable"], true],
            "rgba(240, 182, 90, 0.6)",
            "rgba(250, 247, 242, 0.2)",
          ] as never,
          "line-width": ["case", hovered, 1.8, 0.9] as never,
          "line-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 10, 0.2] as never,
        },
      });
      map.addLayer({
        id: "selected-line",
        type: "line",
        source: "selected",
        paint: { "line-color": GOLD, "line-width": 2, "line-opacity": 0.95 },
      });

      /* pins exist only for the open city: soft ground shadow, the teardrop, hover and selected, pulse */
      const scoped = cityPinFilter(liveRef.current.stateId, liveRef.current.cityId);
      map.addLayer({
        id: "pin-shadow",
        type: "circle",
        source: "pins",
        filter: scoped,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 3, 15, 9],
          "circle-color": "#000000",
          "circle-blur": 0.9,
          "circle-opacity": 0.45,
        } as never,
      });
      map.addLayer({
        id: "pin-pulse",
        type: "circle",
        source: "pins",
        filter: idFilter(null),
        paint: {
          "circle-radius": 10,
          "circle-color": "rgba(240, 182, 90, 0)",
          "circle-stroke-color": GOLD,
          "circle-stroke-width": 2,
          "circle-stroke-opacity": 0.6,
        },
      });
      const pinLayout = (icon: string, factor: number) => ({
        "icon-image": icon,
        "icon-anchor": "bottom" as const,
        "icon-size": pinSize(factor),
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      });
      map.addLayer({
        id: "pin",
        type: "symbol",
        source: "pins",
        filter: scoped,
        layout: pinLayout("pin-aum", 1) as never,
      });
      map.addLayer({
        id: "pin-hover",
        type: "symbol",
        source: "pins",
        filter: idFilter(null),
        layout: { ...pinLayout("pin-aum", 1.22), "icon-offset": [0, -3] } as never,
      });
      map.addLayer({
        id: "pin-selected",
        type: "symbol",
        source: "pins",
        filter: idFilter(null),
        layout: pinLayout("pin-sel", 1.5) as never,
      });

      const pointer = () => (map.getCanvas().style.cursor = "pointer");
      const arrow = () => (map.getCanvas().style.cursor = "");
      let hoverPin: string | null = null;
      let hoverState: string | null = null;

      map.on("mousemove", PIN_LAYERS, (event) => {
        pointer();
        const id = event.features?.[0]?.properties?.id as string | undefined;
        if (!id || id === hoverPin) return;
        hoverPin = id;
        handlers.current.onHoverParcel(id);
      });
      map.on("mouseleave", PIN_LAYERS, () => {
        arrow();
        hoverPin = null;
        handlers.current.onHoverParcel(null);
      });

      const clearTip = () => {
        hoverState = null;
        setTip(null);
        handlers.current.onHoverState(null);
      };
      map.on("mousemove", "states-fill", (event) => {
        const feature = event.features?.[0];
        const id = feature?.properties?.id as string | undefined;
        /* every state can be entered from anywhere; the open one has nothing to hover */
        if (
          !feature ||
          !id ||
          feature.properties?.selectable !== true ||
          id === liveRef.current.stateId
        ) {
          if (hoverState) clearTip();
          return;
        }
        pointer();
        const info = stateInfoRef.current.get(id);
        const name = (feature.properties?.name as string) ?? id;
        setTip({
          x: event.point.x,
          y: event.point.y,
          label: info
            ? `${name} · ${info.parcelCount} ${info.parcelCount === 1 ? "site" : "sites"}`
            : name,
        });
        if (id !== hoverState) {
          hoverState = id;
          handlers.current.onHoverState(id);
        }
      });
      map.on("mouseleave", "states-fill", () => {
        arrow();
        clearTip();
      });

      map.on("click", (event) => {
        const pin = map.queryRenderedFeatures(event.point, { layers: PIN_LAYERS })[0];
        if (pin) {
          handlers.current.onSelectParcel(pin.properties.id as string);
          return;
        }
        const state = map.queryRenderedFeatures(event.point, { layers: ["states-fill"] })[0];
        if (
          state &&
          state.properties.selectable === true &&
          state.properties.id !== liveRef.current.stateId
        ) {
          clearTip();
          handlers.current.onSelectState(state.properties.id as string);
          return;
        }
        handlers.current.onBackground();
      });

      /* names return whenever the camera settles inside a city */
      map.on("moveend", (event) => {
        if (liveRef.current.cityId) revealRef.current();
        const fit = fitRef.current;
        if (!fit.armed) return;
        const user = (event as { originalEvent?: unknown }).originalEvent !== undefined;
        if (fit.zoom === null) {
          /* the first landing after a programmatic fit records the level's own zoom */
          if (!user) fit.zoom = map.getZoom();
          return;
        }
        if (!user) return;
        const { cityId, stateId } = liveRef.current;
        if (cityId && map.getZoom() < fit.zoom - 1.2) {
          fit.armed = false;
          handlers.current.onSelectCity(null);
        } else if (!cityId && stateId && map.getZoom() < fit.zoom - 0.9) {
          fit.armed = false;
          handlers.current.onSelectState(null);
        }
      });

      /* correct first framing: the container may have been laid out after creation */
      map.resize();
      const start = frameRef.current();
      settleRef.current(map, start, 0);
      /* a gentle settle onto the country on first reveal */
      if (start.kind === "bounds" && !liveRef.current.stateId && !reducedMotion()) {
        const settled = map.getZoom();
        map.jumpTo({ zoom: settled - 0.55 });
        map.easeTo({ zoom: settled, duration: 1700, easing: (t) => 1 - Math.pow(1 - t, 3) });
      }
      setMapInstance(map);
      setReady(true);
      handlers.current.onReady();
    });

    /* the country view stays centred in the free area when the container changes size */
    map.on("dragstart", () => {
      atHome.current = false;
    });
    map.on("wheel", () => {
      atHome.current = false;
    });
    const observer = new ResizeObserver(() => {
      map.resize();
      if (atHome.current) settleRef.current(map, frameRef.current(), 0);
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // The map is created once per mount; selection changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* the state fills fade in once the map is up, and restyle when a state opens */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const handle = requestAnimationFrame(() => {
      map.setPaintProperty(
        "states-fill",
        "fill-opacity",
        stateFillOpacity(stateId !== null) as never,
      );
    });
    return () => cancelAnimationFrame(handle);
  }, [ready, stateId]);

  /* data + tone follow the props */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    (map.getSource("pins") as maplibregl.GeoJSONSource | undefined)?.setData(pinData);
    (map.getSource("states") as maplibregl.GeoJSONSource | undefined)?.setData(stateData);
  }, [pinData, stateData, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setLayoutProperty("pin", "icon-image", pinIcon);
    map.setLayoutProperty("pin-hover", "icon-image", pinIcon);
  }, [pinIcon, ready]);

  /* the open state outline */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    (map.getSource("selected") as maplibregl.GeoJSONSource | undefined)?.setData(
      (stateId ? stateFeature(stateId) : null) ?? { type: "FeatureCollection", features: [] },
    );
  }, [stateId, ready]);

  /* pins exist only for the open city, so nothing else can be seen or clicked */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const scoped = cityPinFilter(stateId, cityId);
    map.setFilter("pin", scoped);
    map.setFilter("pin-shadow", scoped);
  }, [stateId, cityId, ready]);

  /* hover and selection are id filters on their own layers */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setFilter("pin-hover", idFilter(cityId ? hoveredId : null));
  }, [hoveredId, cityId, ready]);

  const ringId = parcelId ?? spotlightId;
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setFilter("pin-selected", idFilter(parcelId));
    map.setFilter("pin-pulse", idFilter(ringId));
    if (!ringId || reducedMotion()) {
      map.setPaintProperty("pin-pulse", "circle-radius", 14);
      map.setPaintProperty("pin-pulse", "circle-stroke-opacity", ringId ? 0.6 : 0);
      return;
    }
    let raf = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = ((now - started) % 1800) / 1800;
      map.setPaintProperty("pin-pulse", "circle-radius", 8 + t * 26);
      map.setPaintProperty("pin-pulse", "circle-stroke-opacity", 0.7 * (1 - t));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parcelId, ringId, ready]);

  /* state hover / active as feature-state */
  const applied = useRef<{ state: string | null; active: string | null }>({
    state: null,
    active: null,
  });
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (applied.current.state) {
      map.setFeatureState({ source: "states", id: applied.current.state }, { hover: false });
    }
    if (hoveredStateId) {
      map.setFeatureState({ source: "states", id: hoveredStateId }, { hover: true });
    }
    applied.current.state = hoveredStateId;
  }, [hoveredStateId, ready, stateData]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (applied.current.active) {
      map.setFeatureState({ source: "states", id: applied.current.active }, { active: false });
    }
    if (stateId) map.setFeatureState({ source: "states", id: stateId }, { active: true });
    applied.current.active = stateId;
  }, [stateId, ready, stateData]);

  /* camera: one continuous flight between India, state, city and warehouse framing */
  const firstFrame = useRef(true);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (firstFrame.current) {
      firstFrame.current = false;
      return;
    }
    const next = frame();
    const duration = reducedMotion() ? 0 : next.kind === "point" ? 1600 : 2200;
    setFlying(duration > 0);
    settle(map, next, duration);
    if (duration > 0) map.once("moveend", () => setFlying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId, cityId, parcelId, ready]);

  const resetView = () => {
    const map = mapRef.current;
    if (!map) return;
    settle(map, frame(), reducedMotion() ? 0 : 1400);
  };

  return (
    <div ref={wrapperRef} className={cx(styles.wrapper, ready && styles.ready)}>
      <div ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} aria-hidden="true" />

      {tip && !flying ? (
        <span className={styles.tip} style={{ left: tip.x, top: tip.y }}>
          {tip.label}
        </span>
      ) : null}

      <PortfolioLabels
        map={mapInstance}
        level={level}
        pins={pinLabelList}
        cities={cityLabelList}
        namesOn={namesOn || alwaysNames}
        hoveredId={hoveredId}
        spotlightId={spotlightId}
        callout={calloutLabel}
        flying={flying}
        safeRect={safeRect}
        onSelectCity={onSelectCity}
        onSelectParcel={onSelectParcel}
        onHoverParcel={onHoverParcel}
        onCloseCallout={onCloseCallout}
      />

      <div className={styles.controls}>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => mapRef.current?.zoomIn({ duration: 350 })}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => mapRef.current?.zoomOut({ duration: 350 })}
        >
          –
        </button>
        <button type="button" aria-label="Centre the view" onClick={resetView}>
          ◎
        </button>
        {cityId ? (
          <button
            type="button"
            className={cx(styles.toggle, alwaysNames && styles.toggleOn)}
            aria-label="Keep warehouse names showing"
            aria-pressed={alwaysNames}
            title="Keep names showing"
            onClick={() => setAlwaysNames((value) => !value)}
          >
            Aa
          </button>
        ) : null}
      </div>

      {cityId && !parcelId ? (
        <ul
          className={cx(styles.legend, tone === "construction" && styles.legendMaroon)}
          aria-label="Marker size"
        >
          <li>
            <span className={styles.pinIcon} style={{ width: 12, height: 17 }} />
            0.2 msf
          </li>
          <li>
            <span className={styles.pinIcon} style={{ width: 17, height: 23 }} />1 msf
          </li>
          <li>
            <span className={styles.pinIcon} style={{ width: 22, height: 30 }} />
            1.8 msf
          </li>
        </ul>
      ) : null}

      {children?.({ flying })}
    </div>
  );
}
