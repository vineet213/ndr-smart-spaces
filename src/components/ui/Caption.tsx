import type { ReactNode } from "react";
import styles from "./Caption.module.css";
import { cx } from "./cx";
import type { Tone } from "./types";

type CaptionProps = {
  as?: "p" | "span";
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export function Caption({ as: Tag = "p", tone = "light", className, children }: CaptionProps) {
  return (
    <Tag
      className={cx(
        "text-small",
        styles.caption,
        tone === "dark" ? styles.onDark : styles.onLight,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
