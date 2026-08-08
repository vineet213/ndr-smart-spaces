import { ASSET_STATUS_LABELS } from "@/lib/data/portfolio";
import type { AssetStatus } from "@/lib/data/portfolio";
import { cx } from "../ui/cx";
import styles from "./StatusBadge.module.css";

export function StatusBadge({ status, className }: { status: AssetStatus; className?: string }) {
  const ongoing = status === "ongoing";
  return (
    <span className={cx(styles.badge, ongoing ? styles.ongoing : styles.completed, className)}>
      <span className={styles.dot} aria-hidden="true" />
      {ASSET_STATUS_LABELS[status]}
    </span>
  );
}
