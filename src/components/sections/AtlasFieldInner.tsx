"use client";

import { useCallback, useState } from "react";
import type { ZoneId } from "@/lib/data/portfolio";
import { SourceFootnote } from "@/components/ui";
import {
  atlasField,
  formatPlateRange,
  portfolioAssets,
  portfolioMasthead,
} from "@/lib/data/portfolio";
import { cx } from "../ui/cx";
import { AtlasMap } from "./AtlasMap";
import { ZoneLegend } from "./ZoneLegend";
import styles from "./AtlasField.module.css";

function NorthIndicator({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1" />
      <path d="M12 4l3.5 5h-7L12 4z" fill="currentColor" />
    </svg>
  );
}

export function AtlasFieldInner() {
  const [hoveredZoneId, setHoveredZoneId] = useState<ZoneId | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId | null>(null);
  const plateRange = formatPlateRange(portfolioAssets.map((asset) => asset.plate));

  const handleZoneHover = useCallback((zoneId: ZoneId | null) => {
    setHoveredZoneId(zoneId);
  }, []);

  const handleZoneSelect = useCallback((zoneId: ZoneId) => {
    setSelectedZoneId((prev) => (prev === zoneId ? null : zoneId));
  }, []);

  const handleZoneClick = useCallback(
    (zoneId: ZoneId) => {
      handleZoneSelect(zoneId);
      const section = document.getElementById(`zone-${zoneId}`);
      if (section) {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
    },
    [handleZoneSelect],
  );

  return (
    <div className={styles.grid}>
      <div className={styles.mapColumn}>
        <div className={styles.frame}>
          <span className={styles.cropTopLeft} aria-hidden="true" />
          <span className={styles.cropTopRight} aria-hidden="true" />
          <span className={styles.cropBottomLeft} aria-hidden="true" />
          <span className={styles.cropBottomRight} aria-hidden="true" />
          <AtlasMap
            hoveredZoneId={hoveredZoneId}
            selectedZoneId={selectedZoneId}
            onZoneHover={handleZoneHover}
            onZoneClick={handleZoneClick}
          />
          <p className={styles.mark}>{atlasField.mark}</p>
          <NorthIndicator className={styles.compass} />
          <div className={styles.titleBlock}>
            <div className={styles.titleBlockRow}>
              <span className={styles.titleBlockCell}>
                <span className={styles.titleBlockLabel}>Survey ledger</span>
              </span>
              <span className={styles.titleBlockCell}>
                <span className={styles.notToScale}>{atlasField.notToScale}</span>
              </span>
            </div>
            <div className={styles.titleBlockRow}>
              <span className={styles.titleBlockCell}>
                <span className={styles.titleBlockRef}>
                  {plateRange} · {portfolioMasthead.editionPeriod}
                </span>
              </span>
              <span className={styles.titleBlockCell}>
                <span className={styles.scaleBar} aria-hidden="true">
                  <span className={styles.scaleTrack} />
                  <span className={styles.scaleLabel}>25 km</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.indexColumn}>
        <ZoneLegend
          hoveredZoneId={hoveredZoneId}
          selectedZoneId={selectedZoneId}
          onZoneHover={handleZoneHover}
          onZoneClick={handleZoneClick}
        />
        <div className={styles.key} aria-label={atlasField.surveyKeyLabel}>
          <span className={styles.keyLabel}>{atlasField.surveyKeyLabel}</span>
          <ul className={styles.keyRows}>
            {atlasField.surveyKey.map((entry) => (
              <li key={entry.mark} className={styles.keyRow}>
                <span
                  className={cx(
                    styles.keyMark,
                    entry.mark === "asset"
                      ? styles.keyMarkAsset
                      : entry.mark === "hq"
                        ? styles.keyMarkHq
                        : entry.mark === "hub"
                          ? styles.keyMarkHub
                          : styles.keyMarkSatellite,
                  )}
                  aria-hidden="true"
                />
                <span className={styles.keyText}>{entry.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.captionBlock}>
          <span className={styles.captionLabel}>{atlasField.captionLabel}</span>
          <p className={styles.captionLead}>{atlasField.captionLead}</p>
          <p className={styles.captionDetail}>{atlasField.captionDetail}</p>
        </div>
        <SourceFootnote className={styles.source}>{atlasField.source}</SourceFootnote>
      </div>
    </div>
  );
}
