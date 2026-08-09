"use client";

import { useId } from "react";
import type { EsgTrend } from "@/lib/data/esg";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./EsgTrendChart.module.css";

const W = 720;
const H = 260;
const PAD_T = 26;
const PAD_B = 30;
const PAD_L = 6;
const PAD_R = 10;

const fmt = (value: number) => String(Math.round(value * 100) / 100);

function niceTicks(min: number, max: number, count = 4): number[] {
  const span = max - min;
  if (span === 0) return [min];
  const step = span / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / magnitude;
  let nice: number;
  if (norm <= 1) nice = 1;
  else if (norm <= 2) nice = 2;
  else if (norm <= 5) nice = 5;
  else nice = 10;
  const niceStep = nice * magnitude;
  const start = Math.ceil(min / niceStep) * niceStep;
  const ticks: number[] = [];
  for (let value = start; value <= max + 1e-9; value += niceStep) {
    ticks.push(Number(value.toFixed(6)));
  }
  return ticks;
}

type EsgTrendChartProps = {
  trend: EsgTrend;
  className?: string;
};

export function EsgTrendChart({ trend, className }: EsgTrendChartProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const titleId = useId();

  const values = trend.points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const span = maxValue - minValue;
  const yMin = span === 0 ? minValue - 1 : minValue - span * 0.12;
  const yMax = span === 0 ? maxValue + 1 : maxValue + span * 0.12;

  const xAt = (index: number) =>
    trend.points.length === 1
      ? PAD_L
      : PAD_L + (index / (trend.points.length - 1)) * (W - PAD_L - PAD_R);
  const yAt = (value: number) => PAD_T + (1 - (value - yMin) / (yMax - yMin)) * (H - PAD_T - PAD_B);

  const coords = trend.points.map((point, index) => ({
    x: xAt(index),
    y: yAt(point.value),
    point,
  }));

  const linePath = coords
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${fmt(x)} ${fmt(y)}`)
    .join(" ");
  const areaPath = `${linePath} L ${fmt(coords[coords.length - 1].x)} ${fmt(H - PAD_B)} L ${fmt(
    coords[0].x,
  )} ${fmt(H - PAD_B)} Z`;

  const ticks = niceTicks(yMin, yMax);
  const last = coords[coords.length - 1];

  return (
    <div ref={ref} className={cx(styles.root, inView && styles.drawn, className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-labelledby={titleId}>
        <title id={titleId}>
          {trend.title} —{" "}
          {trend.points.map((p) => `${p.period} ${p.value}${trend.unit}`).join(", ")}
        </title>
        <desc>
          Trend of {trend.title}. Source: {trend.source}.
        </desc>

        <g className={styles.grid}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={yAt(tick)}
                y2={yAt(tick)}
                className={styles.gridline}
              />
              <text x={PAD_L} y={yAt(tick) - 6} className={styles.axis}>
                {fmt(tick)}
              </text>
            </g>
          ))}
        </g>

        <g className={styles.frame}>
          <path d={areaPath} className={styles.area} />
          <path d={linePath} pathLength={1} className={styles.line} />
        </g>

        <g className={styles.points}>
          {coords.map(({ x, y, point }) => (
            <g key={point.period}>
              <circle cx={fmt(x)} cy={fmt(y)} r={4} className={styles.dot} />
              <text x={fmt(x)} y={H - 10} textAnchor="middle" className={styles.period}>
                {point.period}
              </text>
            </g>
          ))}
        </g>

        <g className={styles.latest}>
          <text x={fmt(last.x)} y={last.y - 14} textAnchor="middle" className={styles.latestValue}>
            {fmt(last.point.value)}
          </text>
        </g>
      </svg>
    </div>
  );
}
