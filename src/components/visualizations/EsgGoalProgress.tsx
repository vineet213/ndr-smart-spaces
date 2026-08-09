"use client";

import type { CSSProperties } from "react";
import type { EsgGoal } from "@/lib/data/esg";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./EsgGoalProgress.module.css";

const fmt = (value: number) => String(Math.round(value * 100) / 100);

function goalStatus(goal: EsgGoal): string {
  if (goal.direction === "lower") {
    if (goal.current <= goal.target) return "Within target";
    return "Above target";
  }
  if (goal.current >= goal.target) return "Target met";
  return `${Math.round((goal.current / goal.target) * 100)}% of target`;
}

type EsgGoalProgressProps = {
  goal: EsgGoal;
  className?: string;
};

export function EsgGoalProgress({ goal, className }: EsgGoalProgressProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  const scaleMax = Math.max(goal.current, goal.target) * 1.15;
  const currentPct = (goal.current / scaleMax) * 100;
  const targetPct = (goal.target / scaleMax) * 100;

  return (
    <div ref={ref} className={cx(styles.root, inView && styles.drawn, className)}>
      <div className={styles.head}>
        <span className={styles.code}>{goal.code}</span>
        <span className={styles.label}>{goal.label}</span>
        <span className={styles.status}>{goalStatus(goal)}</span>
      </div>

      <div className={styles.track}>
        <span className={styles.fill} style={{ "--progress": `${currentPct}%` } as CSSProperties} />
        <span className={styles.marker} style={{ "--target": `${targetPct}%` } as CSSProperties} />
      </div>

      <div className={styles.meta}>
        <span className={styles.current}>
          Current {fmt(goal.current)} {goal.unit}
        </span>
        <span className={styles.target}>
          Target {fmt(goal.target)} {goal.unit} by {goal.targetPeriod}
        </span>
      </div>
    </div>
  );
}
