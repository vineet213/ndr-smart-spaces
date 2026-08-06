import type { ReactNode } from "react";
import styles from "./Body.module.css";
import { cx } from "./cx";
import type { Tone } from "./types";

type BodyProps = {
  as?: "p" | "span";
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export function Body({ as: Tag = "p", tone = "light", className, children }: BodyProps) {
  return (
    <Tag className={cx(styles.body, tone === "dark" ? styles.onDark : styles.onLight, className)}>
      {children}
    </Tag>
  );
}
