import { cx } from "../ui/cx";
import styles from "./ContactDocHeader.module.css";

type ContactDocHeaderProps = {
  numeral: string;
  code: string;
  tone?: "light" | "dark";
  className?: string;
};

export function ContactDocHeader({
  numeral,
  code,
  tone = "light",
  className,
}: ContactDocHeaderProps) {
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
