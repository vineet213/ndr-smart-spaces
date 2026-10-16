"use client";

import { companyMetrics, type CompanyMetric } from "@/lib/data/homepage";
import { Counter } from "./Counter";
import { WavePaths } from "./TimelineArt";
import { cx } from "../ui/cx";
import styles from "./CompanyMetrics.module.css";

function MetricValue({ metric }: { metric: CompanyMetric }) {
  if (metric.value === null) {
    return <span className={styles.placeholder}>{metric.label}</span>;
  }
  return (
    <span className={styles.value}>
      <Counter
        value={metric.value}
        prefix={metric.prefix}
        suffix={metric.suffix}
        format={metric.format}
      />
    </span>
  );
}

type CompanyMetricsProps = {
  data?: readonly CompanyMetric[];
  id?: string;
  bare?: boolean;
};

export function CompanyMetrics({
  data = companyMetrics,
  id = "company-metrics",
  bare = false,
}: CompanyMetricsProps) {
  const grid = (
    <ol
      id={id}
      className={cx(styles.grid, data.length === 4 && styles.gridFour, bare && styles.bare)}
    >
      {data.map((metric, index) => (
        <li key={index} className={styles.block}>
          <MetricValue metric={metric} />
          <span className={styles.context}>{metric.context}</span>
        </li>
      ))}
    </ol>
  );

  if (bare) return grid;

  return (
    <div className={styles.band}>
      {/* the same contour lines as the About timeline, faint behind the figures */}
      <svg
        className={styles.waves}
        viewBox="0 0 1000 2000"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        aria-hidden="true"
        focusable="false"
      >
        <WavePaths />
      </svg>
      <div className={cx("container", styles.bandInner)}>{grid}</div>
    </div>
  );
}
