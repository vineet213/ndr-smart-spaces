import styles from "./Divider.module.css";
import { cx } from "../ui/cx";
import type { Tone } from "../ui/types";

type DividerProps = {
  orientation?: "horizontal" | "vertical";
  tone?: Tone;
  className?: string;
};

export function Divider({ orientation = "horizontal", tone = "light", className }: DividerProps) {
  const classes = cx(
    styles.divider,
    orientation === "vertical" ? styles.vertical : styles.horizontal,
    tone === "dark" ? styles.dark : styles.light,
    className,
  );

  if (orientation === "vertical") {
    return <div aria-hidden="true" className={classes} />;
  }

  return <hr className={classes} />;
}
