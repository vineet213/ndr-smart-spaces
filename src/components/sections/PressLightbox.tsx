"use client";

import { useEffect, useRef } from "react";
import type { PressArchiveEntry } from "@/lib/data/media";
import { getLenisInstance } from "@/lib/lenis";
import { Icon } from "../ui/Icon";
import { PressTitleCard } from "./PressTitleCard";
import styles from "./PressLightbox.module.css";

type PressLightboxProps = {
  /** The entries the viewer steps through (coverage with no link). */
  items: readonly PressArchiveEntry[];
  /** Index into `items`, or null when closed. */
  index: number | null;
  onClose: () => void;
  onStep: (delta: number) => void;
};

/* The clipping viewer: a native modal dialog (focus is trapped and Esc closes */
/* it for free), showing the clipping at up to its natural size with its       */
/* caption, and stepping through the rest with the arrows or ← / →.            */
export function PressLightbox({ items, index, onClose, onStep }: PressLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const open = index !== null;
  const entry = index !== null ? items[index] : undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Page scroll lock without layout shift (html.drawer-open, see reset.css),
  // with Lenis' wheel smoothing paused, as in the Leadership drawer.
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("drawer-open");
    const lenis = getLenisInstance();
    lenis?.stop();
    return () => {
      document.documentElement.classList.remove("drawer-open");
      lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onStep]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={entry ? `${entry.publication ?? ""}: ${entry.title}` : "Press clipping"}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // a click on the backdrop (the dialog box itself, outside the panel)
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {entry ? (
        <div className={styles.panel}>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>

          <figure className={styles.figure}>
            <div className={styles.stage}>
              {entry.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={entry.id}
                  src={entry.image}
                  alt={`${entry.publication ?? ""}: ${entry.title}`}
                  className={styles.image}
                />
              ) : (
                <PressTitleCard entry={entry} large />
              )}
            </div>
            <figcaption className={styles.caption}>
              <span className={styles.meta}>
                <span className={styles.outlet}>{entry.publication}</span>
                <span aria-hidden="true">·</span>{" "}
                <time>{entry.date}</time>
              </span>{" "}
              <span className={styles.title}>{entry.title}</span>
              {entry.note ? <span className={styles.note}>{entry.note}</span> : null}
            </figcaption>
          </figure>

          {items.length > 1 ? (
            <div className={styles.nav}>
              <button
                type="button"
                className={styles.step}
                onClick={() => onStep(-1)}
                aria-label="Previous clipping"
              >
                <Icon name="chevron-right" className={styles.prevIcon} />
              </button>
              <span className={styles.count}>
                {(index ?? 0) + 1} / {items.length}
              </span>
              <button
                type="button"
                className={styles.step}
                onClick={() => onStep(1)}
                aria-label="Next clipping"
              >
                <Icon name="chevron-right" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
