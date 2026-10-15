import type { CSSProperties } from "react";
import styles from "./SnapStop.module.css";

/**
 * An invisible 1px marker the browser can snap to on touch devices while the
 * page is in a pinned scroll section (see useSnapZone). `top` is any CSS length
 * measured from the top of the positioned parent; `stop` makes a fast swipe
 * unable to skip past it.
 */
export function SnapStop({ top }: { top: string }) {
  return <span className={styles.stop} style={{ top } as CSSProperties} aria-hidden="true" />;
}
