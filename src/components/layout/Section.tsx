import type { ReactNode } from "react";
import styles from "./Section.module.css";
import { cx } from "../ui/cx";
import type { SurfaceTone } from "../ui/types";

const toneClass: Record<SurfaceTone, string> = {
  light: styles.light,
  dim: styles.dim,
  dark: styles.dark,
  charcoal: styles.charcoal,
};

type SectionProps = {
  as?: "section" | "div";
  tone?: SurfaceTone;
  id?: string;
  ariaLabelledby?: string;
  className?: string;
  children: ReactNode;
};

export function Section({
  as: Tag = "section",
  tone = "light",
  id,
  ariaLabelledby,
  className,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cx(styles.section, toneClass[tone], className)}
    >
      {children}
    </Tag>
  );
}
