"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import type { StateAumSummary } from "@/lib/data/portfolio";
import { INDIAN_STATES } from "@/lib/data/india-states";
import { INDIA_STATE_BOUNDS, INDIA_STATE_PATHS } from "@/lib/data/india-state-paths";
import { cx } from "../ui/cx";
import styles from "./PortfolioAtlas.module.css";

export const ATLAS_VIEWBOX = "0 0 1020 1090";
const OFFSET = 45;

/* Tooltip box sizing/positioning — kept in viewBox units (see ATLAS_VIEWBOX). */
const [VB_X, VB_Y, VB_W, VB_H] = ATLAS_VIEWBOX.split(" ").map(Number);
const TOOLTIP_PAD_X = 8;
const TOOLTIP_HEIGHT = 31;
const TOOLTIP_TEXT_OFFSET_Y = 22;
const TOOLTIP_EDGE_MARGIN = 4;

type PortfolioAtlasProps = {
  selectedStateId: string | null;
  onStateSelect: (stateId: string | null) => void;
  /** State summaries for the selectable set (assets under management or U/C). */
  states?: readonly StateAumSummary[];
  ariaLabel?: string;
};

type Bounds = { x: number; y: number; width: number; height: number };

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

function frameTransform(bounds: Bounds, pad: number, floor: number): string {
  const width = Math.max(bounds.width + pad, floor);
  const height = Math.max(bounds.height + pad, floor);
  const scale = Math.min(930 / width, 1000 / height);
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  return `translate(${(465 - scale * cx).toFixed(1)}px, ${(500 - scale * cy).toFixed(1)}px) scale(${scale.toFixed(3)})`;
}

const IDENTITY = "translate(0px, 0px) scale(1)";

function zoomTransform(stateId: string | null): string {
  if (!stateId) return IDENTITY;
  const bounds = INDIA_STATE_BOUNDS[stateId];
  return bounds ? frameTransform(bounds, 80, 150) : IDENTITY;
}

/**
 * The country-level map. Choosing a state plays the zoom-in here; the real
 * map then fades in over it (see PropertyRegister) so the hand-off is a
 * crossfade rather than a cut.
 */
export function PortfolioAtlas({
  selectedStateId,
  onStateSelect,
  states: customStates,
  ariaLabel,
}: PortfolioAtlasProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const hasFocus = selectedStateId !== null || hoveredStateId !== null;
  const activeState = selectedStateId ?? hoveredStateId;

  const selectableSet = useMemo(
    () => new Set((customStates ?? []).map((s) => s.stateId)),
    [customStates],
  );

  const updateTooltip = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setTooltipPos({
      x: ((e.clientX - rect.left) * VB_W) / rect.width,
      y: ((e.clientY - rect.top) * VB_H) / rect.height - 18,
    });
  }, []);

  const hoveredSelectable =
    hoveredStateId !== null && selectableSet.has(hoveredStateId)
      ? (customStates ?? []).find((s) => s.stateId === hoveredStateId)
      : undefined;

  const tooltipLabel =
    !selectedStateId && hoveredSelectable
      ? `${hoveredSelectable.stateName} · ${hoveredSelectable.parcelCount} ${hoveredSelectable.parcelCount === 1 ? "site" : "sites"}`
      : null;

  const tooltipTextRef = useRef<SVGTextElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(0);

  useEffect(() => {
    setMeasuredWidth(tooltipTextRef.current?.getComputedTextLength() ?? 0);
  }, [tooltipLabel]);

  const tooltipRect = (() => {
    if (!tooltipLabel || !tooltipPos) return null;
    const textWidth = measuredWidth > 0 ? measuredWidth : tooltipLabel.length * 8;
    const width = textWidth + TOOLTIP_PAD_X * 2;
    const x = Math.min(
      Math.max(tooltipPos.x - 4, VB_X + TOOLTIP_EDGE_MARGIN),
      VB_X + VB_W - width - TOOLTIP_EDGE_MARGIN,
    );
    const y = Math.min(
      Math.max(tooltipPos.y - 14, VB_Y + TOOLTIP_EDGE_MARGIN),
      VB_Y + VB_H - TOOLTIP_HEIGHT - TOOLTIP_EDGE_MARGIN,
    );
    return { x, y, width };
  })();

  let stateIndex = 0;

  return (
    <div ref={ref} className={cx(styles.wrapper, inView && styles.isInView)}>
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
          <g className={styles.zoomLayer} style={{ transform: zoomTransform(selectedStateId) }}>
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
                    aria-label={isSelectable ? `${state.name} — select` : undefined}
                    aria-pressed={isSelectable ? selectedStateId === state.id : undefined}
                    onMouseEnter={(e) => {
                      setHoveredStateId(state.id);
                      updateTooltip(e);
                    }}
                    onMouseMove={updateTooltip}
                    onMouseLeave={() => {
                      setHoveredStateId(null);
                      setTooltipPos(null);
                    }}
                    onClick={() => {
                      if (isSelectable) onStateSelect(state.id);
                    }}
                    onKeyDown={(e) => {
                      if (!isSelectable) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onStateSelect(state.id);
                      }
                    }}
                  />
                );
              })}
            </g>
          </g>
        </g>

        {tooltipLabel && tooltipRect && (
          <g className={styles.tooltip}>
            <rect
              x={tooltipRect.x}
              y={tooltipRect.y}
              width={tooltipRect.width}
              height={TOOLTIP_HEIGHT}
              rx={3}
            />
            <text
              ref={tooltipTextRef}
              x={tooltipRect.x + TOOLTIP_PAD_X}
              y={tooltipRect.y + TOOLTIP_TEXT_OFFSET_Y}
              className={styles.tooltipText}
            >
              {tooltipLabel}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
