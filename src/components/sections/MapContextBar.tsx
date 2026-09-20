"use client";

import { cx } from "../ui/cx";
import styles from "./MapContextBar.module.css";

export type CalloutFigure = { value: string; label: string };

/**
 * The state / city banner. It lives in a fixed slot at the top of the free map
 * area, so it can never sit on a pin, a name pill or a city chip.
 */
export function MapContextBar({
  visible,
  eyebrow,
  title,
  figures,
  onClose,
}: {
  visible: boolean;
  eyebrow: string;
  title: string;
  figures: readonly CalloutFigure[];
  onClose: () => void;
}) {
  return (
    <div className={cx(styles.slot, !visible && styles.hidden)} aria-hidden={!visible}>
      <div className={styles.bar} role="status">
        <span className={styles.eyebrow}>{eyebrow}</span>
        <strong className={styles.title}>{title}</strong>
        {figures.length > 0 ? (
          <span className={styles.figures}>
            {figures.map((figure) => (
              <span key={figure.label} className={styles.figure}>
                <b>{figure.value}</b> {figure.label}
              </span>
            ))}
          </span>
        ) : null}
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}
