"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import {
  INDIA_OUTLINE,
  PROJECTION,
  geoLocations,
  geoZones,
  plateAtLocation,
} from "@/lib/data/portfolio";
import type { GeoLocation, LocationTier } from "@/lib/data/portfolio";
import { cx } from "../ui/cx";
import styles from "./AtlasMap.module.css";

export const ATLAS_VIEWBOX = "0 0 1020 1090";
const OFFSET = 45;

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

export function AtlasMap() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div ref={ref} className={cx(styles.wrapper, inView && styles.isInView)}>
      <svg
        viewBox={ATLAS_VIEWBOX}
        className={styles.map}
        role="img"
        aria-label="Survey map of India showing NDR Smart Spaces locations across four zones — south, west, east and north."
        focusable="false"
      >
        <EdgeTicks />
        <g transform={`translate(${OFFSET} ${OFFSET})`}>
          <Graticule />
          <Coordinates />
          <path className={styles.outline} d={INDIA_OUTLINE} />
          <g className={styles.leaders}>
            {geoLocations.map((location: GeoLocation) => {
              const target = location.leaderTo;
              if (!target) return null;
              return (
                <g key={location.id}>
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
          <g className={styles.frames}>
            {geoZones.map((zone) => (
              <rect
                key={zone.id}
                x={zone.frame.x}
                y={zone.frame.y}
                width={zone.frame.width}
                height={zone.frame.height}
                className={styles.zoneFrame}
              />
            ))}
          </g>
          <g className={styles.nodes}>
            {geoLocations.map((location: GeoLocation, index: number) => {
              const plate = plateAtLocation(location.id);
              return (
                <g key={location.id} style={{ "--i": index } as CSSProperties}>
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
          <g className={styles.zoneTags}>
            {geoZones.map((zone) => (
              <g
                key={zone.id}
                transform={`translate(${zone.frame.x + zone.frame.width / 2} ${zone.frame.y})`}
              >
                <line x1={0} y1={0} x2={0} y2={-9} className={styles.zoneTagLine} />
                <text x={0} y={-13} textAnchor="middle" className={styles.zoneTagText}>
                  {zone.name.toUpperCase()}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
