"use client";

import { ZONE_CHAPTERS, atlasField, geoZones, locationsInZone } from "@/lib/data/portfolio";
import type { ZoneId } from "@/lib/data/portfolio";
import { cx } from "../ui/cx";
import styles from "./ZoneLegend.module.css";

type ZoneLegendProps = {
  hoveredZoneId?: ZoneId | null;
  selectedZoneId?: ZoneId | null;
  onZoneHover?: (zoneId: ZoneId | null) => void;
  onZoneClick?: (zoneId: ZoneId) => void;
};

export function ZoneLegend({
  hoveredZoneId = null,
  selectedZoneId = null,
  onZoneHover,
  onZoneClick,
}: ZoneLegendProps) {
  const hasFocus = hoveredZoneId !== null || selectedZoneId !== null;
  const activeZone = selectedZoneId ?? hoveredZoneId;

  return (
    <div className={styles.legend} aria-label={atlasField.zoneIndexLabel}>
      <span className={styles.label}>{atlasField.zoneIndexLabel}</span>
      <ol className={styles.rows}>
        {geoZones.map((zone) => {
          const isActive = activeZone === zone.id;
          const isDimmed = hasFocus && !isActive;
          return (
            <li
              key={zone.id}
              className={cx(
                styles.cell,
                isActive && styles.cellActive,
                isDimmed && styles.cellDimmed,
              )}
              onMouseEnter={() => onZoneHover?.(zone.id)}
              onMouseLeave={() => onZoneHover?.(null)}
              onClick={() => onZoneClick?.(zone.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onZoneClick?.(zone.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${zone.name} zone — ${locationsInZone(zone.id).length} locations`}
            >
              <span className={cx(styles.mark, isActive && styles.markActive)} aria-hidden="true" />
              <div className={styles.text}>
                <span className={styles.name}>
                  <span className={styles.chapter} aria-hidden="true">
                    {ZONE_CHAPTERS[zone.id]}
                  </span>
                  {zone.name}
                </span>
                <span className={styles.fact}>{zone.fact}</span>
              </div>
              <span className={styles.count}>
                {locationsInZone(zone.id).length}
                <span className={styles.countUnit}>{atlasField.locationUnitLabel}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
