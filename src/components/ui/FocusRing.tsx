import type { ElementType, ReactNode } from "react";
import { cx } from "./cx";

type FocusRingProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function FocusRing({ as: Tag = "div", className, children }: FocusRingProps) {
  return <Tag className={cx("focus-ring", className)}>{children}</Tag>;
}
