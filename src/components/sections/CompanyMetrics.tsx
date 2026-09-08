"use client";

import { companyMetrics, type CompanyMetric } from "@/lib/data/homepage";
import { Counter } from "./Counter";
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
    <ol id={id} className={cx(styles.grid, data.length === 4 && styles.gridFour)}>
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
      <div className="container">{grid}</div>
    </div>
  );
}
