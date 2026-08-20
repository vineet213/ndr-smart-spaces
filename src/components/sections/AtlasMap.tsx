"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import {
  INDIA_OUTLINE,
  PROJECTION,
  geoLocations,
  geoZones,
  plateAtLocation,
} from "@/lib/data/portfolio";
import type { GeoLocation, LocationTier, ZoneId } from "@/lib/data/portfolio";
import { cx } from "../ui/cx";
import styles from "./AtlasMap.module.css";

export const ATLAS_VIEWBOX = "0 0 1020 1090";
const OFFSET = 45;

type AtlasMapProps = {
  hoveredZoneId?: ZoneId | null;
  selectedZoneId?: ZoneId | null;
  onZoneHover?: (zoneId: ZoneId | null) => void;
  onZoneClick?: (zoneId: ZoneId) => void;
};

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

function Coordinates() {
  const labels: ReactNode[] = [];
  for (let i = 1; i < 6; i += 1) {
    const x = (i * 930) / 6;
    const lon = PROJECTION.lonMin + (x / 930) * PROJECTION.lonSpan;
    labels.push(
      <text key={`c-top-${i}`} x={x} y={-16} textAnchor="middle" className={styles.coordinate}>
        {`${Math.round(lon)}°E`}
      </text>,
    );
    const y = (i * 1000) / 6;
    const lat = PROJECTION.latMax - (y / 1000) * PROJECTION.latSpan;
    labels.push(
      <text
        key={`c-left-${i}`}
        x={-16}
        y={y}
        textAnchor="end"
        dy="0.32em"
        className={styles.coordinate}
      >
        {`${Math.round(lat)}°N`}
      </text>,
    );
  }
  return <g className={styles.coordinates}>{labels}</g>;
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

function NodeMark({ x, y, tier }: { x: number; y: number; tier: LocationTier }) {
  if (tier === "hq") {
    return (
      <g>
        <circle cx={x} cy={y} r={7.5} className={styles.ringHq} />
        <circle cx={x} cy={y} r={2.5} className={styles.dotHq} />
      </g>
    );
  }
  if (tier === "hub") {
    return <circle cx={x} cy={y} r={4} className={styles.dotHub} />;
  }
  return <circle cx={x} cy={y} r={3.5} className={styles.dotSat} />;
}

export function AtlasMap({
  hoveredZoneId = null,
  selectedZoneId = null,
  onZoneHover,
  onZoneClick,
}: AtlasMapProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const hasFocus = hoveredZoneId !== null || selectedZoneId !== null;
  const activeZone = selectedZoneId ?? hoveredZoneId;

  const handleNodeEnter = useCallback((location: GeoLocation, e: React.MouseEvent) => {
    setHoveredId(location.id);
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = 1020 / rect.width;
    const scaleY = 1090 / rect.height;
    setTooltipPos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY - 16,
    });
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHoveredId(null);
    setTooltipPos(null);
  }, []);

  const scrollToRegister = useCallback(() => {
    const register = document.getElementById("register");
    if (register) {
      register.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleNodeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToRegister();
      }
    },
    [scrollToRegister],
  );

  return (
    <div ref={ref} className={cx(styles.wrapper, inView && styles.isInView)}>
      <svg
        ref={svgRef}
        viewBox={ATLAS_VIEWBOX}
        className={styles.map}
        role="img"
        aria-label="Interactive map of India showing NDR Smart Spaces locations across four zones — hover a zone to explore, click to view details."
        focusable="false"
      >
        <EdgeTicks />
        <g transform={`translate(${OFFSET} ${OFFSET})`}>
          <Graticule />
          <Coordinates />
          <path className={styles.outline} d={INDIA_OUTLINE} />

          {/* Zone frames — interactive */}
          <g className={styles.frames}>
            {geoZones.map((zone) => {
              const isHovered = hoveredZoneId === zone.id;
              const isSelected = selectedZoneId === zone.id;
              const isActive = isHovered || isSelected;
              const isDimmed = hasFocus && !isActive;
              return (
                <g
                  key={zone.id}
                  className={cx(
                    styles.zoneGroup,
                    isActive && styles.zoneActive,
                    isDimmed && styles.zoneDimmed,
                  )}
                  onMouseEnter={() => onZoneHover?.(zone.id)}
                  onMouseLeave={() => onZoneHover?.(null)}
                  onClick={() => onZoneClick?.(zone.id)}
                  style={{ cursor: "pointer" }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${zone.name} zone — ${zone.fact}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onZoneClick?.(zone.id);
                    }
                  }}
                >
                  <rect
                    x={zone.frame.x}
                    y={zone.frame.y}
                    width={zone.frame.width}
                    height={zone.frame.height}
                    className={styles.zoneFrame}
                  />
                  {isSelected && (
                    <rect
                      x={zone.frame.x}
                      y={zone.frame.y}
                      width={zone.frame.width}
                      height={zone.frame.height}
                      className={styles.zoneFrameActive}
                      rx={2}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Leader lines */}
          <g className={styles.leaders}>
            {geoLocations.map((location: GeoLocation) => {
              const target = location.leaderTo;
              if (!target) return null;
              const locDimmed = hasFocus && activeZone !== location.zone;
              return (
                <g key={location.id} className={cx(locDimmed && styles.dimmedElement)}>
                  <line
                    x1={location.x}
                    y1={location.y}
                    x2={target.x}
                    y2={target.y}
                    className={styles.leader}
                  />
                  <circle cx={target.x} cy={target.y} r={3} className={styles.anchor} />
                </g>
              );
            })}
          </g>

          {/* Location nodes — interactive */}
          <g className={styles.nodes}>
            {geoLocations.map((location: GeoLocation, index: number) => {
              const plate = plateAtLocation(location.id);
              const isActive = hoveredId === location.id;
              const locDimmed = hasFocus && activeZone !== location.zone;
              return (
                <g
                  key={location.id}
                  style={{ "--i": index } as CSSProperties}
                  className={cx(
                    styles.nodeGroup,
                    isActive && styles.nodeActive,
                    locDimmed && styles.nodeDimmed,
                  )}
                  tabIndex={0}
                  role="button"
                  aria-label={`${location.name}, ${location.zone} zone${plate ? ` — plate ${plate}` : ""}`}
                  onMouseEnter={(e) => handleNodeEnter(location, e)}
                  onMouseMove={(e) => handleNodeEnter(location, e)}
                  onMouseLeave={handleNodeLeave}
                  onClick={scrollToRegister}
                  onKeyDown={handleNodeKeyDown}
                >
                  {plate ? (
                    <g className={styles.plateRef}>
                      <rect x={location.x + 8} y={location.y - 9} width={36} height={18} />
                      <circle cx={location.x} cy={location.y} r={5} className={styles.dotAsset} />
                      <text
                        x={location.x + 8 + 18}
                        y={location.y + 4}
                        textAnchor="middle"
                        className={styles.plateRefText}
                      >
                        {plate}
                      </text>
                    </g>
                  ) : (
                    <NodeMark x={location.x} y={location.y} tier={location.tier} />
                  )}
                </g>
              );
            })}
          </g>

          {/* Zone tags */}
          <g className={styles.zoneTags}>
            {geoZones.map((zone) => {
              const isActive = activeZone === zone.id;
              const isDimmed = hasFocus && !isActive;
              return (
                <g
                  key={zone.id}
                  transform={`translate(${zone.frame.x + zone.frame.width / 2} ${zone.frame.y})`}
                  className={cx(isDimmed && styles.dimmedElement)}
                >
                  <line x1={0} y1={0} x2={0} y2={-9} className={styles.zoneTagLine} />
                  <text
                    x={0}
                    y={-13}
                    textAnchor="middle"
                    className={cx(styles.zoneTagText, isActive && styles.zoneTagActive)}
                  >
                    {zone.name.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </g>
        </g>

        {hoveredId && tooltipPos && (
          <g className={styles.tooltip}>
            <rect
              x={tooltipPos.x - 4}
              y={tooltipPos.y - 12}
              width={(geoLocations.find((l) => l.id === hoveredId)?.name.length ?? 0) * 7.5 + 16}
              height={18}
              rx={3}
            />
            <text x={tooltipPos.x + 4} y={tooltipPos.y + 1} className={styles.tooltipText}>
              {geoLocations.find((l) => l.id === hoveredId)?.name ?? ""}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
