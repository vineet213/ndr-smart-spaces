import { cx } from "../ui/cx";
import styles from "./EsgDocHeader.module.css";

type EsgDocHeaderProps = {
  numeral: string;
  code: string;
  tone?: "light" | "dark";
  className?: string;
};

export function EsgDocHeader({ numeral, code, tone = "light", className }: EsgDocHeaderProps) {
  return (
    <div
      className={cx(styles.docHeader, tone === "dark" ? styles.onDark : styles.onLight, className)}
    >
      <span className={styles.numeral} aria-hidden="true">
        {numeral}
      </span>
      <span className={styles.ref}>{code}</span>
    </div>
  );
}
