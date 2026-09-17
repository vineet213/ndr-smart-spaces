"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { formatMsf, type AtlasPinData, type StateAumSummary } from "@/lib/data/portfolio";
import { INDIAN_STATES, indianStateById } from "@/lib/data/india-states";
import { INDIA_STATE_BOUNDS, INDIA_STATE_PATHS } from "@/lib/data/india-state-paths";
import { INDIA_DISTRICT_BOUNDS, INDIA_DISTRICT_PATHS } from "@/lib/data/india-district-paths";
import { cx } from "../ui/cx";
import styles from "./PortfolioAtlas.module.css";

export const ATLAS_VIEWBOX = "0 0 1020 1090";
const OFFSET = 45;

/* Tooltip box sizing/positioning — kept in viewBox units (see ATLAS_VIEWBOX). */
const [VB_X, VB_Y, VB_W, VB_H] = ATLAS_VIEWBOX.split(" ").map(Number);
const TOOLTIP_PAD_X = 8;
const TOOLTIP_HEIGHT = 31;
const TOOLTIP_TEXT_OFFSET_Y = 22;
const TOOLTIP_EDGE_MARGIN = 4;

/**
 * City backdrop lookup — which real district shape (from the same public
 * dataset used for the state outlines) draws behind a city's zoom, keyed by
 * `${stateId}::${city}`. A city with no entry here still zooms correctly
 * (the frame is sized from its pins alone); this only supplies the optional
 * outline drawn for context. Extend when `scripts/generate-india-districts.mjs`
 * gains a new district.
 */
const CITY_DISTRICT_BACKDROP: Readonly<Record<string, string>> = {
  "tamil-nadu::Coimbatore": "coimbatore",
  "tamil-nadu::Chennai": "thiruvallur",
  "tamil-nadu::Oragadam": "kancheepuram",
  "karnataka::Hoskote": "bengaluru-rural",
  "west-bengal::Kolkata": "howrah",
  "maharashtra::Uran": "raigad",
  "maharashtra::Pune": "pune",
  "haryana::Sohna": "gurugram",
  "goa::Goa": "south-goa",
};

type PortfolioAtlasProps = {
  selectedStateId: string | null;
  onStateSelect: (stateId: string | null) => void;
  /** Pins for the current mode + selected state (already scoped to that state). */
  pins?: readonly AtlasPinData[];
  /** State summaries for the selectable set (assets under management or U/C). */
  states?: readonly StateAumSummary[];
  selectedParcelId?: string | null;
  onParcelSelect?: (parcelId: string | null) => void;
  /** City selected for the second zoom level (state → city), when a city holds 2+ pins. */
  selectedCityId?: string | null;
  onCitySelect?: (city: string | null) => void;
  ariaLabel?: string;
};

type Bounds = { x: number; y: number; width: number; height: number };

function Graticule() {
  const lines: ReactNode[] = [];
  for (let i = 1; i < 6; i += 1) {
    const x = (i * 930) / 6;
    lines.push(<line key={`v${i}`} x1={x} y1={0} x2={x} y2={1000} />);
    const y = (i * 1000) / 6;
    lines.push(<line key={`h${i}`} x1={0} y1={y} x2={930} y2={y} />);
  }
  return <g className={styles.graticule}>{lines}</g>;
}

function EdgeTicks() {
  const ticks: ReactNode[] = [];
  for (let x = 0; x <= 930; x += 80) {
    ticks.push(<line key={`t${x}`} x1={OFFSET + x} y1={0} x2={OFFSET + x} y2={7} />);
    ticks.push(<line key={`b${x}`} x1={OFFSET + x} y1={1090} x2={OFFSET + x} y2={1083} />);
  }
  for (let y = 0; y <= 1000; y += 80) {
    ticks.push(<line key={`l${y}`} x1={0} y1={OFFSET + y} x2={7} y2={OFFSET + y} />);
    ticks.push(<line key={`r${y}`} x1={1020} y1={OFFSET + y} x2={1013} y2={OFFSET + y} />);
  }
  return <g className={styles.ticks}>{ticks}</g>;
}

type Frame = { css: string; scale: number };

function frameTransform(bounds: Bounds, pad: number, floor: number, maxScale = Infinity): Frame {
  const width = Math.max(bounds.width + pad, floor);
  const height = Math.max(bounds.height + pad, floor);
  const scale = Math.min(930 / width, 1000 / height, maxScale);
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  return {
    css: `translate(${(465 - scale * cx).toFixed(1)}px, ${(500 - scale * cy).toFixed(1)}px) scale(${scale.toFixed(3)})`,
    scale,
  };
}

const IDENTITY_FRAME: Frame = { css: "translate(0px, 0px) scale(1)", scale: 1 };

function zoomTransform(stateId: string | null): Frame {
  if (!stateId) return IDENTITY_FRAME;
  const bounds = INDIA_STATE_BOUNDS[stateId];
  if (!bounds) return IDENTITY_FRAME;
  return frameTransform(bounds, 120, 170);
}

/** Bounding box of a city's pins, unioned with its district backdrop when one is mapped. */
function cityBounds(cityPins: readonly AtlasPinData[], districtId: string | undefined): Bounds {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const pin of cityPins) {
    minX = Math.min(minX, pin.pin.x);
    minY = Math.min(minY, pin.pin.y);
    maxX = Math.max(maxX, pin.pin.x);
    maxY = Math.max(maxY, pin.pin.y);
  }
  const districtBounds = districtId ? INDIA_DISTRICT_BOUNDS[districtId] : undefined;
  if (districtBounds) {
    minX = Math.min(minX, districtBounds.x);
    minY = Math.min(minY, districtBounds.y);
    maxX = Math.max(maxX, districtBounds.x + districtBounds.width);
    maxY = Math.max(maxY, districtBounds.y + districtBounds.height);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function cityZoomTransform(bounds: Bounds): Frame {
  return frameTransform(bounds, 60, 60, 8);
}

/* Marker sizing — kept in one place since declutter() needs to reason about
   how big things actually render on screen (see its unitsPerScreenUnit
   parameter below). */
const PIN_RADIUS = 4.5; // matches .pinDot's r
const CLUSTER_RADIUS = 9; // matches .clusterDot's r
/** How much bigger a city-zoomed pin renders than its normal state-zoom size. */
const CITY_PIN_SCALE = 1.6;
const DECLUTTER_GAP = 2;
const DECLUTTER_ITERATIONS = 6;

type Marker = { id: string; x: number; y: number; r: number };

/**
 * Push apart any two markers whose rendered circles would overlap — not just
 * exact-coordinate duplicates, but any pair closer than the sum of their
 * radii (e.g. two real, distinct warehouses a few hundred metres apart, or a
 * city-cluster badge sitting near an unrelated single-asset pin). A handful
 * of relaxation passes is enough to settle short overlap chains; this is not
 * a physics sim, just enough to stop visual collisions.
 *
 * `unitsPerScreenUnit` converts a *rendered* radius into map-projection
 * units for this comparison: markers that scale with the zoom (state-level
 * pins/clusters, whose on-screen size grows with the zoom transform) use 1
 * (the zoom scale cancels out of the inequality); markers that are
 * counter-scaled to a constant on-screen size (city-zoomed pins) use
 * `CITY_PIN_SCALE / activeTransform.scale`, since their apparent size no
 * longer grows with the zoom the way their position does.
 */
function declutter(markers: readonly Marker[], unitsPerScreenUnit: number): Marker[] {
  const positions = markers.map((m) => ({ ...m }));
  for (let iter = 0; iter < DECLUTTER_ITERATIONS; iter += 1) {
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        const a = positions[i];
        const b = positions[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);
        const minDist = (a.r + b.r + DECLUTTER_GAP) * unitsPerScreenUnit;
        if (dist >= minDist) continue;
        if (dist < 1e-6) {
          const angle = ((i + j + 1) / positions.length) * Math.PI * 2;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          dist = 1;
        }
        const push = (minDist - dist) / 2;
        const ux = dx / dist;
        const uy = dy / dist;
        a.x -= ux * push;
        a.y -= uy * push;
        b.x += ux * push;
        b.y += uy * push;
      }
    }
  }
  return positions;
}

type CityGroup = { city: string; pins: readonly AtlasPinData[]; centroid: { x: number; y: number } };

/** Cities with 2+ pins in the current (state-scoped) pin set — the city-zoom targets. */
function groupByCity(pins: readonly AtlasPinData[]): CityGroup[] {
  const byCity = new Map<string, AtlasPinData[]>();
  for (const pin of pins) {
    if (!pin.city) continue;
    const arr = byCity.get(pin.city);
    if (arr) arr.push(pin);
    else byCity.set(pin.city, [pin]);
  }
  const groups: CityGroup[] = [];
  for (const [city, cityPins] of byCity) {
    if (cityPins.length < 2) continue;
    const centroid = {
      x: cityPins.reduce((sum, p) => sum + p.pin.x, 0) / cityPins.length,
      y: cityPins.reduce((sum, p) => sum + p.pin.y, 0) / cityPins.length,
    };
    groups.push({ city, pins: cityPins, centroid });
  }
  return groups;
}

export function PortfolioAtlas({
  selectedStateId,
  onStateSelect,
  pins: customPins,
  states: customStates,
  selectedParcelId,
  onParcelSelect,
  selectedCityId,
  onCitySelect,
  ariaLabel,
}: PortfolioAtlasProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const hasFocus = selectedStateId !== null || hoveredStateId !== null;
  const activeState = selectedStateId ?? hoveredStateId;

  /* Selectable states come from the provided `states` prop (or default to
     assets-under-management states when omitted). */
  const selectableSet = useMemo(
    () => new Set((customStates ?? []).map((s) => s.stateId)),
    [customStates],
  );

  const handleStateEnter = useCallback((stateId: string) => {
    setHoveredStateId(stateId);
  }, []);

  const handleStateLeave = useCallback(() => {
    setHoveredStateId(null);
  }, []);

  const updateTooltip = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setTooltipPos({
      x: ((e.clientX - rect.left) * VB_W) / rect.width,
      y: ((e.clientY - rect.top) * VB_H) / rect.height - 18,
    });
  }, []);

  const handlePinEnter = useCallback(
    (parcelId: string, e: React.MouseEvent) => {
      setHoveredParcelId(parcelId);
      updateTooltip(e);
    },
    [updateTooltip],
  );

  const handlePinLeave = useCallback(() => {
    setHoveredParcelId(null);
    setTooltipPos(null);
  }, []);

  const handlePinClick = useCallback(
    (parcelId: string) => {
      if (!onParcelSelect) return;
      onParcelSelect(selectedParcelId === parcelId ? null : parcelId);
    },
    [onParcelSelect, selectedParcelId],
  );

  const handleClusterEnter = useCallback(
    (city: string, e: React.MouseEvent) => {
      setHoveredCity(city);
      updateTooltip(e);
    },
    [updateTooltip],
  );

  const handleClusterLeave = useCallback(() => {
    setHoveredCity(null);
    setTooltipPos(null);
  }, []);

  const handleClusterClick = useCallback(
    (city: string) => {
      onCitySelect?.(city);
    },
    [onCitySelect],
  );

  /* All pins for the selected state (unfiltered by city) — used both to
     render individual pins and to derive city clusters. */
  const statePins = customPins ?? [];
  const cityGroups = useMemo(() => groupByCity(statePins), [statePins]);
  const activeCityGroup = selectedCityId
    ? (cityGroups.find((g) => g.city === selectedCityId) ??
      { city: selectedCityId, pins: statePins.filter((p) => p.city === selectedCityId), centroid: { x: 0, y: 0 } })
    : null;

  /* When a city is zoomed, only that city's pins render individually;
     otherwise every non-clustered pin renders, plus one marker per cluster. */
  const singlePins = selectedCityId
    ? (activeCityGroup?.pins ?? [])
    : statePins.filter((p) => !p.city || !cityGroups.some((g) => g.city === p.city));

  const districtId = selectedCityId
    ? CITY_DISTRICT_BACKDROP[`${selectedStateId}::${selectedCityId}`]
    : undefined;

  const activeTransform = selectedCityId
    ? cityZoomTransform(cityBounds(activeCityGroup?.pins ?? [], districtId))
    : zoomTransform(selectedStateId);

  /* Convert a rendered radius into map-projection units for declutter() —
     see its doc comment. City-zoomed pins are counter-scaled to a constant
     on-screen size (§ enlarge-pins fix), so their effective radius shrinks
     in map-space as the zoom tightens; state-level markers scale with the
     zoom, so the conversion factor is 1. */
  const unitsPerScreenUnit = selectedCityId ? CITY_PIN_SCALE / activeTransform.scale : 1;

  const { declutteredPins, declutteredClusters } = useMemo(() => {
    const pinMarkers: Marker[] = singlePins.map((p) => ({
      id: `pin:${p.id}`,
      x: p.pin.x,
      y: p.pin.y,
      r: PIN_RADIUS,
    }));
    const clusterMarkers: Marker[] = selectedCityId
      ? []
      : cityGroups.map((g) => ({
          id: `cluster:${g.city}`,
          x: g.centroid.x,
          y: g.centroid.y,
          r: CLUSTER_RADIUS,
        }));
    const settled = declutter([...pinMarkers, ...clusterMarkers], unitsPerScreenUnit);
    const byId = new Map(settled.map((m) => [m.id, m]));
    const pins = singlePins.map((p) => {
      const pos = byId.get(`pin:${p.id}`)!;
      return { ...p, rx: pos.x, ry: pos.y };
    });
    const clusters = cityGroups.map((g) => {
      const pos = byId.get(`cluster:${g.city}`);
      return { ...g, cx: pos ? pos.x : g.centroid.x, cy: pos ? pos.y : g.centroid.y };
    });
    return { declutteredPins: pins, declutteredClusters: clusters };
  }, [singlePins, cityGroups, selectedCityId, unitsPerScreenUnit]);

  const hoveredPin = declutteredPins.find((p) => p.id === hoveredParcelId);
  const hoveredClusterGroup = hoveredCity ? cityGroups.find((g) => g.city === hoveredCity) : undefined;
  const hoveredSelectable =
    hoveredStateId !== null && selectableSet.has(hoveredStateId)
      ? (customStates ?? []).find((s) => s.stateId === hoveredStateId)
      : undefined;

  const tooltipLabel = hoveredPin
    ? hoveredPin.leasableAreaMsf !== undefined
      ? `${hoveredPin.name} · ${formatMsf(hoveredPin.leasableAreaMsf)}`
      : hoveredPin.district
        ? `${hoveredPin.name}, ${hoveredPin.district}`
        : hoveredPin.name
    : hoveredClusterGroup
      ? `${hoveredClusterGroup.city} · ${hoveredClusterGroup.pins.length} assets`
      : hoveredSelectable
        ? `${hoveredSelectable.stateName} · ${hoveredSelectable.parcelCount} ${hoveredSelectable.parcelCount === 1 ? "site" : "sites"}`
        : null;

  /* The tooltip box is sized from the text's *actual* rendered width rather   */
  /* than a character-count estimate — an estimate can undershoot depending   */
  /* on font metrics, letting the text spill outside the dark rect and land   */
  /* invisibly on the light map beneath it. Falls back to a generous estimate */
  /* for the first paint of a new label, before the measurement effect runs.  */
  const tooltipTextRef = useRef<SVGTextElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(0);

  useEffect(() => {
    setMeasuredWidth(tooltipTextRef.current?.getComputedTextLength() ?? 0);
  }, [tooltipLabel]);

  const tooltipRect = (() => {
    if (!tooltipLabel || !tooltipPos) return null;
    const textWidth = measuredWidth > 0 ? measuredWidth : tooltipLabel.length * 8;
    const width = textWidth + TOOLTIP_PAD_X * 2;
    const x = Math.min(
      Math.max(tooltipPos.x - 4, VB_X + TOOLTIP_EDGE_MARGIN),
      VB_X + VB_W - width - TOOLTIP_EDGE_MARGIN,
    );
    const y = Math.min(
      Math.max(tooltipPos.y - 14, VB_Y + TOOLTIP_EDGE_MARGIN),
      VB_Y + VB_H - TOOLTIP_HEIGHT - TOOLTIP_EDGE_MARGIN,
    );
    return { x, y, width };
  })();

  let stateIndex = 0;
  const stateName = selectedStateId ? indianStateById(selectedStateId)?.name : null;

  return (
    <div ref={ref} className={cx(styles.wrapper, inView && styles.isInView)}>
      <div className={styles.mapFrame}>
        <svg
          ref={svgRef}
          viewBox={ATLAS_VIEWBOX}
          className={styles.map}
          role="img"
          aria-label={ariaLabel ?? "Map of India by state — select a state to survey it."}
          focusable="false"
        >
          <EdgeTicks />
          <g transform={`translate(${OFFSET} ${OFFSET})`}>
            <g className={styles.zoomLayer} style={{ transform: activeTransform.css }}>
              <Graticule />
              <g className={styles.states}>
                {INDIAN_STATES.map((state) => {
                  if (!(state.id in INDIA_STATE_PATHS)) return null;
                  const isSelectable = selectableSet.has(state.id);
                  const isActive = activeState === state.id;
                  const isDimmed = hasFocus && !isActive;
                  const index = isSelectable ? stateIndex++ : 0;
                  return (
                    <path
                      key={state.id}
                      d={INDIA_STATE_PATHS[state.id]}
                      style={{ "--i": index } as CSSProperties}
                      className={cx(
                        styles.state,
                        isSelectable && styles.stateSelectable,
                        isActive && styles.stateActive,
                        isDimmed && styles.stateDimmed,
                      )}
                      tabIndex={isSelectable ? 0 : undefined}
                      role={isSelectable ? "button" : undefined}
                      aria-label={isSelectable ? `${state.name} — select` : undefined}
                      aria-pressed={isSelectable ? selectedStateId === state.id : undefined}
                      onMouseEnter={() => handleStateEnter(state.id)}
                      onMouseLeave={handleStateLeave}
                      onClick={() => {
                        if (isSelectable)
                          onStateSelect(selectedStateId === state.id ? null : state.id);
                      }}
                      onKeyDown={(e) => {
                        if (!isSelectable) return;
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onStateSelect(selectedStateId === state.id ? null : state.id);
                        }
                      }}
                    />
                  );
                })}
              </g>

              {selectedCityId && districtId && INDIA_DISTRICT_PATHS[districtId] && (
                <path
                  d={INDIA_DISTRICT_PATHS[districtId]}
                  className={styles.districtBackdrop}
                  aria-hidden="true"
                />
              )}

              <g className={cx(styles.pins, declutteredPins.length > 0 && styles.pinsShown)}>
                {declutteredPins.map((pin, index) => (
                  <g
                    key={pin.id}
                    style={
                      {
                        "--i": index,
                        /* Counter-scale pins while city-zoomed so a tight real-world
                           cluster (a few hundred metres apart) stays legible instead
                           of the fixed pin radius blowing up with the zoom — enlarged
                           by CITY_PIN_SCALE so they still read clearly at high zoom. */
                        ...(selectedCityId
                          ? {
                              transform: `translate(${pin.rx}px, ${pin.ry}px) scale(${unitsPerScreenUnit.toFixed(4)}) translate(${-pin.rx}px, ${-pin.ry}px)`,
                            }
                          : {}),
                      } as CSSProperties
                    }
                    className={cx(
                      styles.pinGroup,
                      pin.id === hoveredParcelId && styles.pinHover,
                      pin.id === selectedParcelId && styles.pinSelected,
                    )}
                    tabIndex={0}
                    role="button"
                    aria-label={
                      pin.leasableAreaMsf !== undefined
                        ? `${pin.name}${pin.district ? `, ${pin.district}` : ""} — ${formatMsf(pin.leasableAreaMsf)}`
                        : `${pin.name}${pin.district ? `, ${pin.district}` : ""}`
                    }
                    onMouseEnter={(e) => handlePinEnter(pin.id, e)}
                    onMouseMove={(e) => updateTooltip(e)}
                    onMouseLeave={handlePinLeave}
                    onClick={() => handlePinClick(pin.id)}
                    onFocus={() => setHoveredParcelId(pin.id)}
                    onBlur={handlePinLeave}
                  >
                    <circle cx={pin.rx} cy={pin.ry} r={8} className={styles.pinHit} />
                    <circle cx={pin.rx} cy={pin.ry} r={4.5} className={styles.pinDot} />
                    <circle cx={pin.rx} cy={pin.ry} r={1.6} className={styles.pinCore} />
                  </g>
                ))}
              </g>

              {!selectedCityId && (
                <g className={cx(styles.pins, declutteredClusters.length > 0 && styles.pinsShown)}>
                  {declutteredClusters.map((group, index) => (
                    <g
                      key={group.city}
                      style={{ "--i": index } as CSSProperties}
                      className={cx(styles.clusterGroup, group.city === hoveredCity && styles.clusterHover)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${group.city} — ${group.pins.length} assets, zoom in`}
                      onMouseEnter={(e) => handleClusterEnter(group.city, e)}
                      onMouseMove={(e) => updateTooltip(e)}
                      onMouseLeave={handleClusterLeave}
                      onClick={() => handleClusterClick(group.city)}
                      onFocus={() => setHoveredCity(group.city)}
                      onBlur={handleClusterLeave}
                    >
                      <circle cx={group.cx} cy={group.cy} r={16} className={styles.clusterHit} />
                      <circle cx={group.cx} cy={group.cy} r={9} className={styles.clusterDot} />
                      <text x={group.cx} y={group.cy} className={styles.clusterCount}>
                        {group.pins.length}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </g>
          </g>

          {tooltipLabel && tooltipRect && (
            <g className={styles.tooltip}>
              <rect
                x={tooltipRect.x}
                y={tooltipRect.y}
                width={tooltipRect.width}
                height={TOOLTIP_HEIGHT}
                rx={3}
              />
              <text
                ref={tooltipTextRef}
                x={tooltipRect.x + TOOLTIP_PAD_X}
                y={tooltipRect.y + TOOLTIP_TEXT_OFFSET_Y}
                className={styles.tooltipText}
              >
                {tooltipLabel}
              </text>
            </g>
          )}
        </svg>
        {(selectedStateId || selectedCityId) && (
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              if (selectedCityId) {
                onCitySelect?.(null);
                return;
              }
              onStateSelect(null);
              onParcelSelect?.(null);
            }}
          >
            {selectedCityId ? (stateName ?? "Back to state") : "All India"}
          </button>
        )}
      </div>
      <p className={styles.notToScale}>Schematic outline · not to scale</p>
    </div>
  );
}
