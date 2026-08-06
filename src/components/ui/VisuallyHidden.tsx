import type { ElementType, ReactNode } from "react";
import { cx } from "./cx";

type VisuallyHiddenProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function VisuallyHidden({ as: Tag = "span", className, children }: VisuallyHiddenProps) {
  return <Tag className={cx("visually-hidden", className)}>{children}</Tag>;
}
