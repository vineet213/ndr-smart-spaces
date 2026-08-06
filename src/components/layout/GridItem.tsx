import type { ElementType, ReactNode } from "react";
import styles from "./GridItem.module.css";
import { cx } from "../ui/cx";
import type { ColumnSpan } from "../ui/types";

type GridItemProps = {
  as?: ElementType;
  span?: ColumnSpan;
  className?: string;
  children: ReactNode;
};

export function GridItem({ as: Tag = "div", span = 12, className, children }: GridItemProps) {
  return <Tag className={cx(styles.item, styles[`span-${span}`], className)}>{children}</Tag>;
}
