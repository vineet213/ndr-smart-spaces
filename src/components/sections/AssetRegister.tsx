"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout";
import { ExternalLink, Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import {
  ASSET_CLASS_LABELS,
  assetsInZone,
  formatPlateRange,
  formatSqFt,
  geoLocations,
  geoZones,
  portfolioAssets,
  portfolioMasthead,
  portfolioRegister,
} from "@/lib/data/portfolio";
import type { PortfolioAsset, ZoneId } from "@/lib/data/portfolio";
import { LocatorMap } from "./LocatorMap";
import { Reveal } from "./Reveal";
import { StatusBadge } from "./StatusBadge";
import { cx } from "../ui/cx";
import styles from "./AssetRegister.module.css";

const COLUMNS = ["plate", "asset", "class", "zone", "size", "status"] as const;

type SortKey = "plate" | "asset" | "size";
type SortDir = "asc" | "desc";

function parseOrder(value: string): { key: SortKey; dir: SortDir } {
  const [key, dir] = value.split("-");
  return {
    key: (key === "asset" || key === "size" ? key : "plate") as SortKey,
    dir: dir === "desc" ? "desc" : "asc",
  };
}

function zoneName(zoneId: ZoneId): string {
  return geoZones.find((zone) => zone.id === zoneId)?.name ?? zoneId;
}

function isZoneId(value: string | null): value is ZoneId {
  return value !== null && geoZones.some((zone) => zone.id === value);
}

function plateNumber(plate: string): number {
  const value = Number.parseInt(plate, 10);
  return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
}

export function AssetRegister() {
  const [zoneFilter, setZoneFilter] = useState<ZoneId | "all">("all");
  const [order, setOrder] = useState<string>("plate-asc");
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const rows = useRef<Map<string, HTMLTableRowElement>>(new Map());
  const { ref: tableRef, inView: tableInView } = useInView<HTMLDivElement>();

  useEffect(() => {
    const zone = new URLSearchParams(window.location.search).get("zone");
    // Read the zone-handoff query once at mount; initialising from the URL in
    // state would cause a hydration mismatch on the statically exported page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (zone === "all" || isZoneId(zone)) setZoneFilter(zone);
    else setZoneFilter("all");
  }, []);

  const handleZoneFilter = useCallback((zone: ZoneId | "all") => {
    setZoneFilter(zone);
    const params = new URLSearchParams(window.location.search);
    if (zone === "all") params.delete("zone");
    else params.set("zone", zone);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, []);

  const assets = portfolioAssets;

  const { key: sortKey, dir: sortDir } = useMemo(() => parseOrder(order), [order]);

  const filtered = useMemo(() => {
    const matches = assets.filter((asset) => zoneFilter === "all" || asset.zone === zoneFilter);
    const sign = sortDir === "asc" ? 1 : -1;
    return [...matches].sort((a, b) => {
      if (sortKey === "plate") return sign * (plateNumber(a.plate) - plateNumber(b.plate));
      if (sortKey === "asset") return sign * a.name.localeCompare(b.name);
      return sign * ((a.sizeSqFt ?? 0) - (b.sizeSqFt ?? 0));
    });
  }, [assets, zoneFilter, sortKey, sortDir]);

  const cataloguedLocationIds = useMemo(
    () =>
      Array.from(
        new Set(
          filtered
            .map((asset) => asset.locationId)
            .filter((locationId): locationId is string => Boolean(locationId)),
        ),
      ),
    [filtered],
  );

  const indexedZones = useMemo(
    () => geoZones.filter((zone) => assetsInZone(zone.id).length > 0),
    [],
  );

  const scrollRowIntoView = useCallback((locationId: string) => {
    const row = Array.from(rows.current.values()).find(
      (element) => element.dataset.locationId === locationId,
    );
    if (!row) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }, []);

  const handlePinFocus = useCallback(
    (locationId: string) => {
      setActiveLocationId(locationId);
      scrollRowIntoView(locationId);
    },
    [scrollRowIntoView],
  );

  return (
    <section className={styles.register} id="register" aria-labelledby="register-title">
      <Container>
        <Reveal>
          <div className={styles.headingBlock}>
            <span className={styles.goldRule} aria-hidden="true" />
            <span className={styles.chapter} aria-hidden="true">
              V
            </span>
            <Eyebrow>{portfolioRegister.eyebrow}</Eyebrow>
            <Heading variant="section" id="register-title">
              {portfolioRegister.heading}
            </Heading>
            <Lede className={styles.framing}>{portfolioRegister.framing}</Lede>
          </div>
        </Reveal>

        {assets.length > 0 ? (
          <Reveal variant="fade">
            <div className={styles.sheet}>
              <div className={styles.provenance}>
                <span>{portfolioRegister.provenanceLabel}</span>
                <span>
                  {formatPlateRange(portfolioAssets.map((asset) => asset.plate))} ·{" "}
                  {portfolioMasthead.editionPeriod}
                </span>
              </div>
              <dl className={styles.summary}>
                <div className={styles.summaryCell}>
                  <dt className={styles.summaryLabel}>
                    {portfolioRegister.summary.locationsLabel}
                  </dt>
                  <dd className={styles.summaryValue}>{geoLocations.length}</dd>
                </div>
                <div className={styles.summaryCell}>
                  <dt className={styles.summaryLabel}>{portfolioRegister.summary.assetsLabel}</dt>
                  <dd className={styles.summaryValue}>{portfolioAssets.length}</dd>
                </div>
                <div className={styles.summaryCell}>
                  <dt className={styles.summaryLabel}>{portfolioRegister.summary.zonesLabel}</dt>
                  <dd className={styles.summaryValue}>{geoZones.length}</dd>
                </div>
                <div className={styles.summaryCell}>
                  <dt className={styles.summaryLabel}>{portfolioRegister.summary.editionLabel}</dt>
                  <dd className={styles.summaryValue}>{portfolioRegister.summary.editionValue}</dd>
                </div>
              </dl>

              <div className={styles.toolbar}>
                <div
                  className={styles.folioNav}
                  role="group"
                  aria-label={portfolioRegister.indexLabel}
                >
                  <button
                    type="button"
                    className={cx(styles.folio, zoneFilter === "all" && styles.folioActive)}
                    aria-pressed={zoneFilter === "all"}
                    onClick={() => handleZoneFilter("all")}
                  >
                    <span className={styles.folioName}>{portfolioRegister.allPlatesLabel}</span>
                    <span className={styles.folioRange}>
                      {formatPlateRange(assets.map((asset) => asset.plate))}
                    </span>
                  </button>
                  {indexedZones.map((zone) => {
                    const active = zoneFilter === zone.id;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        className={cx(styles.folio, active && styles.folioActive)}
                        aria-pressed={active}
                        onClick={() => handleZoneFilter(zone.id)}
                      >
                        <span className={styles.folioName}>{zone.name}</span>
                        <span className={styles.folioRange}>
                          {formatPlateRange(assetsInZone(zone.id).map((asset) => asset.plate))}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <label className={styles.order}>
                  <span className={styles.orderLabel}>{portfolioRegister.orderLabel}</span>
                  <select value={order} onChange={(event) => setOrder(event.target.value)}>
                    {portfolioRegister.orderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles.panels}>
                <div className={styles.locatorPanel}>
                  <Reveal variant="fade">
                    <LocatorMap
                      locationIds={cataloguedLocationIds}
                      activeLocationId={activeLocationId}
                      onPinEnter={setActiveLocationId}
                      onPinLeave={() => setActiveLocationId(null)}
                      onPinFocus={handlePinFocus}
                    />
                  </Reveal>
                </div>
                <div className={styles.tablePanel}>
                  <Reveal variant="fade">
                    {filtered.length > 0 ? (
                      <div
                        ref={tableRef}
                        className={cx(styles.tableWrap, tableInView && styles.isInView)}
                      >
                        <table className={styles.table}>
                          <caption className="visually-hidden">
                            {portfolioRegister.heading} — {portfolioRegister.framing}
                          </caption>
                          <thead>
                            <tr>
                              {COLUMNS.map((column) => (
                                <th
                                  key={column}
                                  scope="col"
                                  className={cx(
                                    styles.columnHeader,
                                    column === "size" && styles.columnSize,
                                  )}
                                >
                                  {portfolioRegister.columns[column]}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map((asset: PortfolioAsset, index: number) => {
                              const highlight =
                                activeLocationId !== null && activeLocationId === asset.locationId;
                              return (
                                <tr
                                  key={asset.id}
                                  ref={(element) => {
                                    if (element) rows.current.set(asset.id, element);
                                    else rows.current.delete(asset.id);
                                  }}
                                  data-location-id={asset.locationId ?? ""}
                                  className={cx(highlight && styles.rowActive)}
                                  style={{ "--i": index } as CSSProperties}
                                  tabIndex={asset.locationId ? 0 : undefined}
                                  onMouseEnter={() => {
                                    if (asset.locationId) setActiveLocationId(asset.locationId);
                                  }}
                                  onMouseLeave={() => setActiveLocationId(null)}
                                  onFocus={() => {
                                    if (asset.locationId) setActiveLocationId(asset.locationId);
                                  }}
                                  onBlur={() => setActiveLocationId(null)}
                                >
                                  <td data-label={portfolioRegister.columns.plate}>
                                    <span className={styles.plateCell}>
                                      <span className={styles.plateMark} aria-hidden="true" />
                                      <span className={styles.plateNum}>{asset.plate}</span>
                                    </span>
                                  </td>
                                  <td data-label={portfolioRegister.columns.asset}>
                                    <span className={styles.assetCell}>
                                      <span className={styles.assetName}>{asset.name}</span>
                                      <span className={styles.assetCity}>{asset.city}</span>
                                    </span>
                                  </td>
                                  <td data-label={portfolioRegister.columns.class}>
                                    {ASSET_CLASS_LABELS[asset.class]}
                                  </td>
                                  <td data-label={portfolioRegister.columns.zone}>
                                    {zoneName(asset.zone)}
                                  </td>
                                  <td
                                    data-label={portfolioRegister.columns.size}
                                    className={styles.sizeCell}
                                  >
                                    {formatSqFt(asset.sizeSqFt)}
                                  </td>
                                  <td data-label={portfolioRegister.columns.status}>
                                    <StatusBadge status={asset.status} />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className={styles.noRecords}>
                        <p className={styles.noRecordsText}>{portfolioRegister.noRecordsLabel}</p>
                        <button
                          type="button"
                          className={styles.reset}
                          onClick={() => handleZoneFilter("all")}
                        >
                          {portfolioRegister.noRecordsReset}
                        </button>
                      </div>
                    )}
                  </Reveal>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>{portfolioRegister.emptyTitle}</p>
              <p className={styles.emptyNote}>{portfolioRegister.emptyNote}</p>
            </div>
          </Reveal>
        )}

        <Reveal>
          <footer className={styles.footer}>
            <p className={styles.entityNote}>
              {portfolioRegister.entityNote}{" "}
              <ExternalLink href={portfolioRegister.entityLink.href}>
                {portfolioRegister.entityLink.label}
              </ExternalLink>
            </p>
            <SourceFootnote>{portfolioRegister.source}</SourceFootnote>
          </footer>
        </Reveal>
      </Container>
    </section>
  );
}
