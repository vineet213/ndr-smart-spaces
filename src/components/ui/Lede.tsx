import type { ReactNode } from "react";
import styles from "./Lede.module.css";
import { cx } from "./cx";
import type { Tone } from "./types";

type LedeProps = {
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export function Lede({ tone = "light", className, children }: LedeProps) {
  return (
    <p className={cx(styles.lede, tone === "dark" ? styles.onDark : styles.onLight, className)}>
      {children}
    </p>
  );
}
