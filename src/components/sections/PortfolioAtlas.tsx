"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import {
  formatAcres,
  landBankStates,
  landPinsByState,
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
};

/** States that hold at least one published parcel — the selectable set. */
const selectableStates = new Set(landBankStates.map((state) => state.stateId));

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

/**
 * Zoom transform (translate + uniform scale) centring a state's bounds in the
 * 930×1000 frame with breathing room; identity for the full-union view.
 */
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

export function PortfolioAtlas({ selectedStateId, onStateSelect }: PortfolioAtlasProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const hasFocus = selectedStateId !== null || hoveredStateId !== null;
  const activeState = selectedStateId ?? hoveredStateId;

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

  const pins = selectedStateId ? landPinsByState(selectedStateId) : [];
  const hoveredPin = pins.find((parcel) => parcel.id === hoveredParcelId);
  const hoveredSelectable =
    hoveredStateId !== null && selectableStates.has(hoveredStateId)
      ? landBankStates.find((state) => state.stateId === hoveredStateId)
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
          aria-label="Map of India by state — select a state with land-bank parcels to survey it."
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
                  const hasParcels = selectableStates.has(state.id);
                  const isActive = activeState === state.id;
                  const isDimmed = hasFocus && !isActive;
                  const index = hasParcels ? stateIndex++ : 0;
                  return (
                    <path
                      key={state.id}
                      d={INDIA_STATE_PATHS[state.id]}
                      style={{ "--i": index } as CSSProperties}
                      className={cx(
                        styles.state,
                        hasParcels && styles.stateSelectable,
                        isActive && styles.stateActive,
                        isDimmed && styles.stateDimmed,
                      )}
                      tabIndex={hasParcels ? 0 : undefined}
                      role={hasParcels ? "button" : undefined}
                      aria-label={
                        hasParcels
                          ? `${state.name} — survey land bank`
                          : undefined
                      }
                      aria-pressed={hasParcels ? selectedStateId === state.id : undefined}
                      onMouseEnter={() => handleStateEnter(state.id)}
                      onMouseLeave={handleStateLeave}
                      onClick={() => {
                        if (hasParcels) onStateSelect(selectedStateId === state.id ? null : state.id);
                      }}
                      onKeyDown={(e) => {
                        if (!hasParcels) return;
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onStateSelect(selectedStateId === state.id ? null : state.id);
                        }
                      }}
                    />
                  );
                })}
              </g>

              {/* Parcel pins — only rendered while a state is selected */}
              <g className={cx(styles.pins, selectedStateId && styles.pinsShown)}>
                {pins.map((parcel, index) => (
                  <g
                    key={parcel.id}
                    style={{ "--i": index } as CSSProperties}
                    className={cx(styles.pinGroup, parcel.id === hoveredParcelId && styles.pinActive)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${parcel.name}${parcel.district ? `, ${parcel.district}` : ""} — ${formatAcres(parcel.extentAcres)}`}
                    onMouseEnter={(e) => handlePinEnter(parcel.id, e)}
                    onMouseMove={(e) => updateTooltip(e)}
                    onMouseLeave={handlePinLeave}
                    onFocus={() => setHoveredParcelId(parcel.id)}
                    onBlur={handlePinLeave}
                  >
                    <circle cx={parcel.pin!.x} cy={parcel.pin!.y} r={8} className={styles.pinHit} />
                    <circle
                      cx={parcel.pin!.x}
                      cy={parcel.pin!.y}
                      r={4.5}
                      className={styles.pinDot}
                    />
                    <circle
                      cx={parcel.pin!.x}
                      cy={parcel.pin!.y}
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
                  : `${hoveredSelectable?.stateName} · ${hoveredSelectable?.parcelCount} ${hoveredSelectable?.parcelCount === 1 ? "parcel" : "parcels"}`;
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
            onClick={() => onStateSelect(null)}
          >
            All India
          </button>
        )}
      </div>
      <p className={styles.notToScale}>Schematic outline · not to scale</p>
    </div>
  );
}
