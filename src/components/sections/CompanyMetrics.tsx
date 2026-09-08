"use client";

import { companyMetrics, type CompanyMetric } from "@/lib/data/homepage";
import { Counter } from "./Counter";
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

export function CompanyMetrics() {
  return (
    <div className={styles.band} id="company-metrics">
      <div className="container">
        <ol className={styles.grid}>
          {companyMetrics.map((metric) => (
            <li key={metric.label} className={styles.block}>
              <MetricValue metric={metric} />
              <span className={styles.context}>{metric.context}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
