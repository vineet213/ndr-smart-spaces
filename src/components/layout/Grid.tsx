import type { ElementType, ReactNode } from "react";
import gridStyles from "./Grid.module.css";
import itemStyles from "./GridItem.module.css";
import { cx } from "../ui/cx";

type GridProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Grid({ as: Tag = "div", className, children }: GridProps) {
  return <Tag className={cx(gridStyles.grid, className)}>{children}</Tag>;
}
