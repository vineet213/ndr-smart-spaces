import type { MapLocation, ZoneId } from "@/lib/data/homepage";
import styles from "./IndiaMap.module.css";
import { cx } from "../ui/cx";

const OUTLINE =
  "M194 20 L126 39 L147 107 L78 223 L39 246 L34 263 L63 273 L51 288 L78 304 L111 287 L113 312 L113 338 L122 377 L132 410 L142 420 L163 476 L171 487 L180 514 L204 549 L228 497 L238 453 L234 427 L295 364 L344 323 L367 290 L394 271 L406 285 L435 271 L464 223 L477 281 L502 252 L521 213 L580 175 L512 146 L416 175 L252 146 L232 126 L213 117 L209 88 L223 39 L213 30 Z";

type IndiaMapProps = {
  locations: readonly MapLocation[];
  activeZone: ZoneId | null;
  tooltip: MapLocation | null;
  onLocationEnter: (location: MapLocation) => void;
  onLocationLeave: () => void;
};

export function IndiaMap({
  locations,
  activeZone,
  tooltip,
  onLocationEnter,
  onLocationLeave,
}: IndiaMapProps) {
  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label="Stylized map of India showing NDR Smart Spaces locations by zone"
    >
      <svg viewBox="0 0 600 600" className={styles.map} focusable="false">
        <path className={styles.outline} d={OUTLINE} />
        <g>
          {locations.map((location) => {
            const active = activeZone === location.zone;
            return (
              <g
                key={location.name}
                className={cx(styles.dot, active && styles.dotActive)}
                role="button"
                tabIndex={0}
                aria-label={`${location.name}, ${location.line} — ${location.zone} zone`}
                aria-describedby={tooltip?.name === location.name ? "map-tooltip" : undefined}
                onMouseEnter={() => onLocationEnter(location)}
                onMouseLeave={onLocationLeave}
                onFocus={() => onLocationEnter(location)}
                onBlur={onLocationLeave}
              >
                <circle className={styles.glow} cx={location.x} cy={location.y} r="8" />
                <circle className={styles.node} cx={location.x} cy={location.y} r="4" />
              </g>
            );
          })}
        </g>
      </svg>
      {tooltip ? (
        <div
          id="map-tooltip"
          role="tooltip"
          className={styles.tooltip}
          style={{
            left: `${Math.max(14, Math.min(tooltip.x / 6, 86))}%`,
            top: `${Math.max(12, Math.min(tooltip.y / 6, 88))}%`,
          }}
        >
          <span className={styles.tooltipName}>{tooltip.name}</span>
          <span className={cx("text-label-meta", styles.tooltipZone)}>{tooltip.zone} zone</span>
          <span className={styles.tooltipLine}>{tooltip.line}</span>
        </div>
      ) : null}
    </div>
  );
}
