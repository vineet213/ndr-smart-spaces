"use client";

import {
  INDIA_OUTLINE,
  atlasField,
  geoLocations,
  locatorIndex,
  plateAtLocation,
} from "@/lib/data/portfolio";
import type { GeoLocation, LocationTier } from "@/lib/data/portfolio";
import { cx } from "../ui/cx";
import styles from "./LocatorMap.module.css";

type LocatorMapProps = {
  locationIds: readonly string[];
  activeLocationId: string | null;
  onPinEnter: (locationId: string) => void;
  onPinLeave: () => void;
  onPinFocus: (locationId: string) => void;
};

function labelSideFor(location: GeoLocation): "left" | "right" {
  return location.labelSide ?? (location.x < 465 ? "right" : "left");
}

function GhostMark({ tier }: { tier: LocationTier }) {
  if (tier === "hq") return <span className={styles.ghostDiamond} aria-hidden="true" />;
  if (tier === "hub") return <span className={styles.ghostSquare} aria-hidden="true" />;
  return <span className={styles.ghostDot} aria-hidden="true" />;
}

const GRATICULE_LINES = [1, 2, 3] as const;

export function LocatorMap({
  locationIds,
  activeLocationId,
  onPinEnter,
  onPinLeave,
  onPinFocus,
}: LocatorMapProps) {
  const catalogued = geoLocations.filter((location) => locationIds.includes(location.id));
  const ghosts = geoLocations.filter(
    (location) => !locationIds.includes(location.id) && location.tier !== "satellite",
  );

  return (
    <div
      className={styles.locator}
      role="group"
      aria-label="Catalogue pin index, linked to the register"
    >
      <div className={styles.header}>
        <span className={styles.title}>{locatorIndex.label}</span>
        <span className={styles.catalogued}>
          {catalogued.length} {locatorIndex.cataloguedLabel}
        </span>
      </div>

      <div className={styles.plate}>
        <span className={styles.cropTopLeft} aria-hidden="true" />
        <span className={styles.cropTopRight} aria-hidden="true" />
        <span className={styles.cropBottomLeft} aria-hidden="true" />
        <span className={styles.cropBottomRight} aria-hidden="true" />
        <div className={styles.mapArea}>
          <svg
            viewBox="0 0 930 1000"
            className={styles.map}
            role="img"
            aria-label="Outline of India with catalogue pins"
            focusable="false"
          >
            <g className={styles.graticule}>
              {GRATICULE_LINES.map((part) => {
                const x = (part * 930) / 4;
                return <line key={`v${part}`} x1={x} y1={0} x2={x} y2={1000} />;
              })}
              {GRATICULE_LINES.map((part) => {
                const y = (part * 1000) / 4;
                return <line key={`h${part}`} x1={0} y1={y} x2={930} y2={y} />;
              })}
            </g>
            <path className={styles.outline} d={INDIA_OUTLINE} />
            <g className={styles.leaders}>
              {ghosts.map((location) => {
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
          </svg>
          {ghosts.map((location) => (
            <span
              key={location.id}
              className={styles.ghost}
              style={{
                left: `${(location.x / 930) * 100}%`,
                top: `${(location.y / 1000) * 100}%`,
              }}
            >
              <GhostMark tier={location.tier} />
            </span>
          ))}
          {catalogued.map((location) => {
            const active = activeLocationId === location.id;
            const side = labelSideFor(location);
            const plate = plateAtLocation(location.id);
            return (
              <button
                key={location.id}
                type="button"
                className={cx(styles.pin, active && styles.pinActive)}
                style={{
                  left: `${(location.x / 930) * 100}%`,
                  top: `${(location.y / 1000) * 100}%`,
                }}
                aria-pressed={active}
                aria-label={`Plate ${plate ?? "—"} — ${location.name} — ${location.line}`}
                onMouseEnter={() => onPinEnter(location.id)}
                onMouseLeave={onPinLeave}
                onFocus={() => onPinFocus(location.id)}
                onBlur={onPinLeave}
              >
                <span
                  className={cx(
                    styles.pinLabel,
                    side === "left" ? styles.pinLabelLeft : styles.pinLabelRight,
                  )}
                >
                  {plate ?? location.name}
                </span>
                <span className={styles.pinDot} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.meta}>
        <span>
          {geoLocations.length} {atlasField.locationUnitLabel}
        </span>
        <span>{locatorIndex.linkedLabel}</span>
      </div>
      <p className={styles.note}>{locatorIndex.note}</p>
    </div>
  );
}
