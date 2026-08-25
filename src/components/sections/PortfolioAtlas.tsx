"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import {
  formatAcres,
  type AtlasPinData,
  type StateLandSummary,
} from "@/lib/data/portfolio";
import { INDIAN_STATES } from "@/lib/data/india-states";
import { INDIA_STATE_BOUNDS, INDIA_STATE_PATHS } from "@/lib/data/india-state-paths";
import { cx } from "../ui/cx";
import styles from "./PortfolioAtlas.module.css";

export const ATLAS_VIEWBOX = "0 0 1020 1090";
const OFFSET = 45;

type PortfolioAtlasProps = {
  selectedStateId: string | null;
  onStateSelect: (stateId: string | null) => void;
  /** Override pins (for U/C mode). Falls back to landPinsByState when omitted. */
  pins?: readonly AtlasPinData[];
  /** State summaries for the selectable set (land bank or U/C). */
  states?: readonly StateLandSummary[];
  selectedParcelId?: string | null;
  onParcelSelect?: (parcelId: string | null) => void;
  ariaLabel?: string;
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

function zoomTransform(stateId: string | null): string {
  if (!stateId) return "translate(0px, 0px) scale(1)";
  const bounds = INDIA_STATE_BOUNDS[stateId];
  if (!bounds) return "translate(0px, 0px) scale(1)";
  const width = Math.max(bounds.width + 120, 170);
  const height = Math.max(bounds.height + 120, 170);
  const scale = Math.min(930 / width, 1000 / height);
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  return `translate(${(465 - scale * cx).toFixed(1)}px, ${(500 - scale * cy).toFixed(1)}px) scale(${scale.toFixed(3)})`;
}

/**
 * Detect pins sharing the same (x,y) and spread them in a small circle so
 * they are individually clickable.  Returns a new array with rendered
 * coordinates in `rx` / `ry`.
 */
function resolveOverlaps(
  pins: readonly AtlasPinData[],
): (AtlasPinData & { rx: number; ry: number })[] {
  const groups = new Map<string, number[]>();
  pins.forEach((p, i) => {
    const key = `${p.pin.x},${p.pin.y}`;
    const arr = groups.get(key);
    if (arr) arr.push(i);
    else groups.set(key, [i]);
  });
  const offsets = pins.map(() => ({ dx: 0, dy: 0 }));
  for (const indices of groups.values()) {
    if (indices.length <= 1) continue;
    const r = 10;
    indices.forEach((i, j) => {
      const angle = (j / indices.length) * Math.PI * 2 - Math.PI / 2;
      offsets[i] = { dx: Math.cos(angle) * r, dy: Math.sin(angle) * r };
    });
  }
  return pins.map((p, i) => ({
    ...p,
    rx: p.pin.x + offsets[i].dx,
    ry: p.pin.y + offsets[i].dy,
  }));
}

export function PortfolioAtlas({
  selectedStateId,
  onStateSelect,
  pins: customPins,
  states: customStates,
  selectedParcelId,
  onParcelSelect,
  ariaLabel,
}: PortfolioAtlasProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const hasFocus = selectedStateId !== null || hoveredStateId !== null;
  const activeState = selectedStateId ?? hoveredStateId;

  /* Selectable states come from the provided `states` prop (or default to
     land bank states when omitted). */
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
      x: ((e.clientX - rect.left) * 1020) / rect.width,
      y: ((e.clientY - rect.top) * 1090) / rect.height - 18,
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

  /* Resolve pins: use customPins when provided, otherwise fall back to
     the default landPinsByState import. */
  const resolvedPins = useMemo(() => {
    const raw = customPins ?? [];
    return resolveOverlaps(raw);
  }, [customPins]);

  const hoveredPin = resolvedPins.find((p) => p.id === hoveredParcelId);
  const hoveredSelectable =
    hoveredStateId !== null && selectableSet.has(hoveredStateId)
      ? (customStates ?? []).find((s) => s.stateId === hoveredStateId)
      : undefined;

  let stateIndex = 0;

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
            <g
              className={styles.zoomLayer}
              style={{ transform: zoomTransform(selectedStateId) }}
            >
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
                      aria-label={
                        isSelectable
                          ? `${state.name} — select`
                          : undefined
                      }
                      aria-pressed={isSelectable ? selectedStateId === state.id : undefined}
                      onMouseEnter={() => handleStateEnter(state.id)}
                      onMouseLeave={handleStateLeave}
                      onClick={() => {
                        if (isSelectable) onStateSelect(selectedStateId === state.id ? null : state.id);
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

              <g className={cx(styles.pins, selectedStateId && styles.pinsShown)}>
                {resolvedPins.map((pin, index) => (
                  <g
                    key={pin.id}
                    style={{ "--i": index } as CSSProperties}
                    className={cx(
                      styles.pinGroup,
                      pin.id === hoveredParcelId && styles.pinHover,
                      pin.id === selectedParcelId && styles.pinSelected,
                    )}
                    tabIndex={0}
                    role="button"
                    aria-label={`${pin.name}${pin.district ? `, ${pin.district}` : ""} — ${formatAcres(pin.extentAcres)}`}
                    onMouseEnter={(e) => handlePinEnter(pin.id, e)}
                    onMouseMove={(e) => updateTooltip(e)}
                    onMouseLeave={handlePinLeave}
                    onClick={() => handlePinClick(pin.id)}
                    onFocus={() => setHoveredParcelId(pin.id)}
                    onBlur={handlePinLeave}
                  >
                    <circle cx={pin.rx} cy={pin.ry} r={8} className={styles.pinHit} />
                    <circle
                      cx={pin.rx}
                      cy={pin.ry}
                      r={4.5}
                      className={styles.pinDot}
                    />
                    <circle
                      cx={pin.rx}
                      cy={pin.ry}
                      r={1.6}
                      className={styles.pinCore}
                    />
                  </g>
                ))}
              </g>
            </g>
          </g>

          {(hoveredPin || hoveredSelectable) && tooltipPos && (
            <g className={styles.tooltip}>
              {(() => {
                const label = hoveredPin
                  ? `${hoveredPin.name} · ${formatAcres(hoveredPin.extentAcres)}`
                  : `${hoveredSelectable?.stateName} · ${hoveredSelectable?.parcelCount} ${hoveredSelectable?.parcelCount === 1 ? "location" : "locations"}`;
                return (
                  <>
                    <rect
                      x={tooltipPos.x - 4}
                      y={tooltipPos.y - 13}
                      width={label.length * 7.5 + 16}
                      height={18}
                      rx={3}
                    />
                    <text x={tooltipPos.x + 4} y={tooltipPos.y} className={styles.tooltipText}>
                      {label}
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>
        {selectedStateId && (
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              onStateSelect(null);
              onParcelSelect?.(null);
            }}
          >
            All India
          </button>
        )}
      </div>
      <p className={styles.notToScale}>Schematic outline · not to scale</p>
    </div>
  );
}
