import styles from "./Spinner.module.css";
import { cx } from "./cx";

type SpinnerTone = "gold" | "maroon";

type SpinnerProps = {
  tone?: SpinnerTone;
  className?: string;
};

export function Spinner({ tone = "gold", className }: SpinnerProps) {
  return (
    <span
      role="status"
      className={cx(styles.spinner, tone === "maroon" ? styles.maroon : styles.gold, className)}
    >
      <span className="visually-hidden">Loading</span>
    </span>
  );
}
