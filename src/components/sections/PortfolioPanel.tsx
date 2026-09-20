"use client";

import { useEffect, useRef, useState } from "react";
import {
  ASSET_CLASS_LABELS,
  AUM_CLASSIFICATION_LABELS,
  AUM_STATUS_LABELS,
  formatMsf,
  formatSqFt,
} from "@/lib/data/portfolio";
import type { AumAsset, PortfolioAsset, StateAumSummary } from "@/lib/data/portfolio";
import { INDIA_STATE_BOUNDS, INDIA_STATE_PATHS } from "@/lib/data/india-state-paths";
import { cx } from "../ui/cx";
import { PortfolioSearch } from "./PortfolioSearch";
import type { SearchItem } from "./PortfolioSearch";
import styles from "./PortfolioPanel.module.css";

export type CardRecord =
  | { kind: "aum"; asset: AumAsset }
  | { kind: "construction"; asset: PortfolioAsset; linked: AumAsset | null };

export type CardCity = {
  name: string;
  stateId: string;
  stateName: string;
  count: number;
  totalMsf: number | null;
};

export type CityGroup = {
  city: string;
  msf: number | null;
  records: readonly CardRecord[];
};

export type PanelLevel = "india" | "state" | "city" | "warehouse";

export function recordMsf(record: CardRecord): number | undefined {
  return record.kind === "aum" ? record.asset.leasableAreaMsf : record.linked?.leasableAreaMsf;
}

function recordPin(record: CardRecord): { x: number; y: number } | null {
  return (record.kind === "aum" ? record.asset.pin : record.linked?.pin) ?? null;
}

function recordCoords(record: CardRecord): { lat: number; lon: number } | null {
  const source = record.kind === "aum" ? record.asset : record.linked;
  return source?.lat !== undefined && source?.lon !== undefined
    ? { lat: source.lat, lon: source.lon }
    : null;
}

function recordSub(record: CardRecord): string {
  if (record.kind === "aum") {
    return [
      record.asset.classification ? AUM_CLASSIFICATION_LABELS[record.asset.classification] : null,
      record.asset.status ? AUM_STATUS_LABELS[record.asset.status] : null,
      record.asset.district && record.asset.district !== record.asset.city
        ? record.asset.district
        : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return `${ASSET_CLASS_LABELS[record.asset.class]} · ${formatSqFt(record.asset.sizeSqFt)}`;
}

/* rows ------------------------------------------------------------------------ */

function WarehouseRow({
  record,
  index,
  hovered,
  spotlight = false,
  onSelect,
  onHover,
}: {
  record: CardRecord;
  index: number;
  hovered: boolean;
  spotlight?: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const msf = recordMsf(record);
  const sub = recordSub(record);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (spotlight) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [spotlight]);
  return (
    <li>
      <button
        ref={ref}
        type="button"
        className={cx(styles.row, hovered && styles.rowHover)}
        onClick={() => onSelect(record.asset.id)}
        onMouseEnter={() => onHover(record.asset.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(record.asset.id)}
        onBlur={() => onHover(null)}
      >
        <span className={styles.rowIndex}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.rowMain}>
          <span className={styles.rowName}>{record.asset.name}</span>
          {sub ? <span className={styles.rowSub}>{sub}</span> : null}
        </span>
        {msf !== undefined ? <span className={styles.rowMsf}>{formatMsf(msf)}</span> : null}
      </button>
    </li>
  );
}

/* dossier --------------------------------------------------------------------- */

function Locator({ stateId, pin }: { stateId: string; pin: { x: number; y: number } }) {
  const path = INDIA_STATE_PATHS[stateId];
  const bounds = INDIA_STATE_BOUNDS[stateId];
  if (!path || !bounds) return null;
  const pad = Math.max(bounds.width, bounds.height) * 0.1;
  return (
    <svg
      className={styles.locator}
      viewBox={`${bounds.x - pad} ${bounds.y - pad} ${bounds.width + pad * 2} ${bounds.height + pad * 2}`}
      role="img"
      aria-label="Position within the state"
    >
      <path d={path} className={styles.locatorState} />
      <circle cx={pin.x} cy={pin.y} r={bounds.width * 0.09} className={styles.locatorRing} />
      <circle cx={pin.x} cy={pin.y} r={bounds.width * 0.035} className={styles.locatorDot} />
    </svg>
  );
}

function Tile({
  label,
  value,
  accent,
  hot,
}: {
  label: string;
  value: string | null | undefined;
  accent?: boolean;
  hot?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={styles.tile}>
      <dd className={cx(styles.tileValue, accent && styles.tileAccent, hot && styles.tileHot)}>
        {value}
      </dd>
      <dt className={styles.tileLabel}>{label}</dt>
    </div>
  );
}

function Dossier({
  record,
  city,
  index,
  total,
}: {
  record: CardRecord;
  city: CardCity;
  index: number;
  total: number;
}) {
  const [copied, setCopied] = useState(false);
  const aum = record.kind === "aum" ? record.asset : null;
  const built = record.kind === "construction" ? record.asset : null;
  const linked = record.kind === "construction" ? record.linked : null;
  const pin = recordPin(record);
  const coords = recordCoords(record);
  const location = aum
    ? [...new Set([aum.district, aum.city, aum.stateName].filter(Boolean))].join(", ")
    : built
      ? `${built.city}${built.zone ? ` · ${built.zone} zone` : ""}`
      : "";

  const copy = () => {
    if (!coords) return;
    void navigator.clipboard
      ?.writeText(`${coords.lat}, ${coords.lon}`)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => undefined);
  };

  return (
    <div className={styles.dossier}>
      <span className={styles.stamp}>
        {built
          ? `Filed · Plate ${built.plate}`
          : `Site ${String(index + 1).padStart(2, "0")} of ${String(total).padStart(2, "0")}`}
      </span>
      <h3 className={styles.title}>{record.asset.name}</h3>
      <p className={styles.location}>{location}</p>
      {aum?.summary ? <p className={styles.copy}>{aum.summary}</p> : null}

      <dl className={styles.tiles}>
        {aum ? (
          <>
            <Tile label="Leasable area" value={formatMsf(aum.leasableAreaMsf)} accent />
            <Tile
              label="Category"
              value={aum.classification ? AUM_CLASSIFICATION_LABELS[aum.classification] : null}
            />
            <Tile label="Status" value={aum.status ? AUM_STATUS_LABELS[aum.status] : null} />
          </>
        ) : built ? (
          <>
            <Tile label="Class" value={ASSET_CLASS_LABELS[built.class]} />
            <Tile
              label="Status"
              value={built.status === "ongoing" ? "Under construction" : "Completed"}
              hot={built.status === "ongoing"}
            />
            <Tile label="Built-up area" value={formatSqFt(built.sizeSqFt)} accent />
          </>
        ) : null}
      </dl>

      {aum?.note ? <p className={styles.copy}>{aum.note}</p> : null}

      {linked ? (
        <div className={styles.lifecycle}>
          <span className={styles.meta}>Asset lifecycle</span>
          <div className={styles.track} aria-hidden="true">
            <span className={styles.nodeOn} />
            <span className={styles.line} />
            <span className={styles.nodeOff} />
          </div>
          <div className={styles.trackLabels}>
            <span>Under construction</span>
            <span>
              Becomes {linked.name}
              {linked.leasableAreaMsf !== undefined
                ? ` · ${formatMsf(linked.leasableAreaMsf)}`
                : ""}
            </span>
          </div>
        </div>
      ) : null}

      <div className={styles.foot}>
        {pin ? <Locator stateId={city.stateId} pin={pin} /> : null}
        <div className={styles.footText}>
          <span className={styles.meta}>Located in</span>
          <span className={styles.footValue}>
            {city.name}, {city.stateName}
          </span>
          <span className={styles.footSub}>
            {total} {total === 1 ? "site" : "sites"} in this city
          </span>
        </div>
      </div>

      {coords ? (
        <div className={styles.actions}>
          <a
            className={styles.action}
            href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lon}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps ↗
          </a>
          <button type="button" className={styles.action} onClick={copy}>
            {copied ? "Copied" : "Copy coordinates"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* panel ----------------------------------------------------------------------- */

type PanelProps = {
  level: PanelLevel;
  noun: "warehouse" | "project";
  states: readonly StateAumSummary[];
  stateId: string | null;
  stateName: string;
  stateFigures: { sites: number; msf: number | null } | null;
  groups: readonly CityGroup[];
  city: CardCity | null;
  cityRecords: readonly CardRecord[];
  record: CardRecord | null;
  recordIndex: number;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  /** Warehouse to highlight without opening it (after a search). */
  spotlightId: string | null;
  hoveredStateId: string | null;
  onHoverState: (stateId: string | null) => void;
  onSelectState: (stateId: string | null) => void;
  onSelectCity: (city: string | null) => void;
  onSelectRecord: (id: string | null) => void;
  searchItems: readonly SearchItem[];
  searchPlaceholder: string;
  searchNoun: string;
  onSearchPick: (item: SearchItem) => void;
  sheetOpen: boolean;
  onToggleSheet: () => void;
};

export function PortfolioPanel(props: PanelProps) {
  const {
    level,
    noun,
    states,
    stateId,
    stateName,
    stateFigures,
    groups,
    city,
    cityRecords,
    record,
    recordIndex,
    hoveredId,
    onHover,
    spotlightId,
    hoveredStateId,
    onHoverState,
    onSelectState,
    onSelectCity,
    onSelectRecord,
    sheetOpen,
    onToggleSheet,
  } = props;

  const plural = noun === "warehouse" ? "warehouses" : "projects";

  return (
    <aside className={cx(styles.panel, sheetOpen ? styles.open : styles.collapsed)}>
      <button
        type="button"
        className={styles.handle}
        aria-label={sheetOpen ? "Collapse panel" : "Expand panel"}
        aria-expanded={sheetOpen}
        onClick={onToggleSheet}
      />

      <div className={styles.head}>
        <PortfolioSearch
          items={props.searchItems}
          placeholder={props.searchPlaceholder}
          noun={props.searchNoun}
          onPick={props.onSearchPick}
        />
        <nav className={styles.crumbs} aria-label="Location">
          <button type="button" data-active={level === "india"} onClick={() => onSelectState(null)}>
            India
          </button>
          {stateId ? (
            <>
              <span aria-hidden="true">›</span>
              <button
                type="button"
                data-active={level === "state"}
                onClick={() => onSelectCity(null)}
              >
                {stateName}
              </button>
            </>
          ) : null}
          {city ? (
            <>
              <span aria-hidden="true">›</span>
              <button
                type="button"
                data-active={level === "city"}
                onClick={() => onSelectRecord(null)}
              >
                {city.name}
              </button>
            </>
          ) : null}
        </nav>
        {level !== "india" ? (
          <button
            type="button"
            className={styles.backBar}
            onClick={() => {
              if (level === "warehouse") onSelectRecord(null);
              else if (level === "city") onSelectCity(null);
              else onSelectState(null);
            }}
          >
            <span className={styles.backArrow} aria-hidden="true">
              ←
            </span>
            <span>
              Back to {level === "warehouse" ? city?.name : level === "city" ? stateName : "India"}
            </span>
          </button>
        ) : null}
      </div>

      <div className={styles.body} key={`${level}:${stateId}:${city?.name}:${record?.asset.id}`}>
        {level === "india" ? (
          <>
            <p className={styles.lede}>
              Select a state, or search for a city or {noun}, to open the map.
            </p>
            <ul className={styles.states}>
              {states.map((state) => (
                <li key={state.stateId}>
                  <button
                    type="button"
                    className={cx(
                      styles.stateRow,
                      hoveredStateId === state.stateId && styles.stateHover,
                    )}
                    onClick={() => onSelectState(state.stateId)}
                    onMouseEnter={() => onHoverState(state.stateId)}
                    onMouseLeave={() => onHoverState(null)}
                    onFocus={() => onHoverState(state.stateId)}
                    onBlur={() => onHoverState(null)}
                  >
                    <span className={styles.stateName}>{state.stateName}</span>
                    <span className={styles.stateMeta}>
                      {state.parcelCount} · {formatMsf(state.totalLeasableAreaMsf)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {level === "state" && stateFigures ? (
          <>
            <span className={styles.meta}>State</span>
            <h3 className={styles.title}>{stateName}</h3>
            <div className={styles.figures}>
              <div>
                <span className={styles.figureValue}>{stateFigures.sites}</span>
                <span className={styles.meta}>{plural}</span>
              </div>
              {stateFigures.msf !== null ? (
                <div>
                  <span className={styles.figureValue}>
                    {stateFigures.msf.toLocaleString("en-IN")}
                  </span>
                  <span className={styles.meta}>msf leasable</span>
                </div>
              ) : null}
              <div>
                <span className={styles.figureValue}>{groups.length}</span>
                <span className={styles.meta}>{groups.length === 1 ? "city" : "cities"}</span>
              </div>
            </div>
            <ul className={styles.states}>
              {groups.map((group) => (
                <li key={group.city}>
                  <button
                    type="button"
                    className={styles.stateRow}
                    onClick={() => onSelectCity(group.city)}
                  >
                    <span className={styles.stateName}>{group.city}</span>
                    <span className={styles.stateMeta}>
                      {group.records.length} {group.records.length === 1 ? noun : plural}
                      {group.msf !== null ? ` · ${group.msf.toLocaleString("en-IN")} msf` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {level === "city" && city ? (
          <>
            <span className={styles.meta}>{city.stateName}</span>
            <h3 className={styles.title}>{city.name}</h3>
            <div className={styles.figures}>
              <div>
                <span className={styles.figureValue}>{city.count}</span>
                <span className={styles.meta}>{city.count === 1 ? noun : plural}</span>
              </div>
              {city.totalMsf !== null ? (
                <div>
                  <span className={styles.figureValue}>
                    {city.totalMsf.toLocaleString("en-IN")}
                  </span>
                  <span className={styles.meta}>msf leasable</span>
                </div>
              ) : null}
            </div>
            <ol className={styles.list}>
              {cityRecords.map((item, index) => (
                <WarehouseRow
                  key={item.asset.id}
                  record={item}
                  index={index}
                  hovered={hoveredId === item.asset.id || spotlightId === item.asset.id}
                  spotlight={spotlightId === item.asset.id}
                  onSelect={onSelectRecord}
                  onHover={onHover}
                />
              ))}
            </ol>
          </>
        ) : null}

        {level === "warehouse" && record && city ? (
          <>
            <Dossier record={record} city={city} index={recordIndex} total={cityRecords.length} />
          </>
        ) : null}
      </div>
    </aside>
  );
}
