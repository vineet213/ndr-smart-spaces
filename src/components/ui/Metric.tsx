import type { ReactNode } from "react";
import styles from "./Metric.module.css";
import { cx } from "./cx";
import type { Tone } from "./types";

type MetricVariant = "hero" | "section";

const variantClass: Record<MetricVariant, string> = {
  hero: styles.hero,
  section: styles.section,
};

type MetricProps = {
  as?: "span" | "p";
  variant?: MetricVariant;
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export function Metric({
  as: Tag = "span",
  variant = "section",
  tone = "light",
  className,
  children,
}: MetricProps) {
  return (
    <Tag
      className={cx(
        styles.metric,
        variantClass[variant],
        tone === "dark" ? styles.onDark : styles.onLight,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
