import { cx } from "../ui/cx";
import styles from "./MediaDocHeader.module.css";

type MediaDocHeaderProps = {
  numeral: string;
  code: string;
  tone?: "light" | "dark";
  className?: string;
};

export function MediaDocHeader({ numeral, code, tone = "light", className }: MediaDocHeaderProps) {
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
