import type { ElementType, ReactNode } from "react";
import styles from "./Band.module.css";
import { cx } from "../ui/cx";
import type { SurfaceTone } from "../ui/types";

type RulePosition = "top" | "bottom" | "both" | "none";

const toneClass: Record<SurfaceTone, string> = {
  light: styles.light,
  dim: styles.dim,
  dark: styles.dark,
  charcoal: styles.charcoal,
};

type BandProps = {
  as?: ElementType;
  tone?: SurfaceTone;
  rule?: RulePosition;
  className?: string;
  children: ReactNode;
};

export function Band({
  as: Tag = "div",
  tone = "light",
  rule = "none",
  className,
  children,
}: BandProps) {
  return (
    <Tag
      className={cx(
        styles.band,
        toneClass[tone],
        rule === "top" || rule === "both" ? styles.ruleTop : null,
        rule === "bottom" || rule === "both" ? styles.ruleBottom : null,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
