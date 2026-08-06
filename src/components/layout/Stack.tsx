import type { ElementType, ReactNode } from "react";
import styles from "./Stack.module.css";
import { cx } from "../ui/cx";
import type { SpacingToken } from "../ui/types";

type Align = "start" | "center" | "end" | "stretch";

const gapClass: Record<SpacingToken, string> = {
  "2xs": styles.gap2xs,
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
  "2xl": styles.gap2xl,
  "3xl": styles.gap3xl,
  "4xl": styles.gap4xl,
  "5xl": styles.gap5xl,
  "6xl": styles.gap6xl,
  "7xl": styles.gap7xl,
  "8xl": styles.gap8xl,
  "9xl": styles.gap9xl,
  "10xl": styles.gap10xl,
  "11xl": styles.gap11xl,
  "12xl": styles.gap12xl,
  "13xl": styles.gap13xl,
};

const alignClass: Record<Align, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
};

type StackProps = {
  as?: ElementType;
  gap?: SpacingToken;
  align?: Align;
  className?: string;
  children: ReactNode;
};

export function Stack({
  as: Tag = "div",
  gap = "lg",
  align = "stretch",
  className,
  children,
}: StackProps) {
  return (
    <Tag className={cx(styles.stack, gapClass[gap], alignClass[align], className)}>{children}</Tag>
  );
}
