"use client";

import { useRef, useState } from "react";
import { verticalManagement } from "@/lib/data/business";
import { Reveal, type RevealDelay } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./VerticalManagement.module.css";

/**
 * Vertical 02 — management. Placeholder profile cards until the client
 * supplies the records. The interaction mirrors the About Us leadership
 * cards: a subtle hover/focus highlight with a small description reveal.
 */
export function VerticalManagement() {
  const slots = Math.max(verticalManagement.profiles.length, verticalManagement.placeholderSlots);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pointerTypeRef = useRef<string>("");

  const activate = (index: number) => setActiveIndex(index);
  const resetIfActive = (index: number) =>
    setActiveIndex((current) => (current === index ? null : current));

  return (
    <section
      className={styles.section}
      id="vertical-management"
      aria-labelledby="vertical-management-title"
    >
      <Reveal>
        <h3 id="vertical-management-title" className={styles.heading}>
          {verticalManagement.heading}
        </h3>
      </Reveal>
      <ol className={styles.grid} aria-labelledby="vertical-management-title">
        {Array.from({ length: slots }, (_, index) => {
          const isActive = activeIndex === index;
          return (
            <li key={index}>
              <Reveal delay={((index % 4) + 1) as RevealDelay}>
                <div
                  className={cx(styles.slot, isActive && styles.slotActive)}
                  tabIndex={0}
                  onMouseEnter={() => activate(index)}
                  onMouseLeave={() => resetIfActive(index)}
                  onFocus={() => {
                    if (pointerTypeRef.current !== "touch") activate(index);
                  }}
                  onBlur={(event) => {
                    const next = event.relatedTarget as Node | null;
                    if (!event.currentTarget.contains(next)) resetIfActive(index);
                  }}
                  onPointerDown={(event) => {
                    pointerTypeRef.current = event.pointerType;
                  }}
                >
                  <div className={styles.slotHeader}>
                    <span className={styles.slotIndex}>
                      Record {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.slotMark} aria-hidden="true" />
                  </div>
                  <p className={styles.slotTitle}>{verticalManagement.placeholderTitle}</p>
                  <p className={styles.slotStatus}>{verticalManagement.placeholderStatus}</p>
                  <p className={styles.slotNote}>{verticalManagement.placeholderNote}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
