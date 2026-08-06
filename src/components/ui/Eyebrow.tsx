import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";
import { cx } from "./cx";
import type { Tone } from "./types";

type EyebrowProps = {
  as?: "span" | "p";
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export function Eyebrow({ as: Tag = "p", tone = "light", className, children }: EyebrowProps) {
  return (
    <Tag
      className={cx(
        "text-label-meta",
        styles.eyebrow,
        tone === "dark" ? styles.onDark : styles.onLight,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
