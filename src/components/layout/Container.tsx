import type { ElementType, ReactNode } from "react";
import { cx } from "../ui/cx";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return <Tag className={cx("container", className)}>{children}</Tag>;
}
