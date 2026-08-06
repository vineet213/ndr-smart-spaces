import styles from "./Skeleton.module.css";
import { cx } from "./cx";

type SkeletonVariant = "line" | "block" | "media";

const variantClass: Record<SkeletonVariant, string> = {
  line: styles.line,
  block: styles.block,
  media: styles.media,
};

type SkeletonProps = {
  variant?: SkeletonVariant;
  className?: string;
};

export function Skeleton({ variant = "block", className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cx(styles.skeleton, variantClass[variant], className)} />
  );
}
