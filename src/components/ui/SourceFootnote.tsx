import type { ReactNode } from "react";
import styles from "./SourceFootnote.module.css";
import { cx } from "./cx";
import type { Tone } from "./types";

type SourceFootnoteProps = {
  as?: "p" | "span";
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export function SourceFootnote({
  as: Tag = "p",
  tone = "light",
  className,
  children,
}: SourceFootnoteProps) {
  return (
    <Tag
      className={cx(
        "text-small",
        styles.footnote,
        tone === "dark" ? styles.onDark : styles.onLight,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
