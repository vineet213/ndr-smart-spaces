"use client";

import { useRef, useState } from "react";
import Image from "next/image";
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
          const profile = verticalManagement.profiles[index];
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
                  {profile ? (
                    <>
                      {profile.photo ? (
                        <div className={styles.photoFrame}>
                          <Image
                            src={profile.photo}
                            alt={profile.name}
                            fill
                            sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 18vw"
                            className={styles.photo}
                          />
                        </div>
                      ) : null}
                      <p className={styles.slotTitle}>{profile.name}</p>
                      <span className={styles.profileRule} aria-hidden="true" />
                      <p className={styles.profileRole}>{profile.role}</p>
                    </>
                  ) : (
                    <>
                      <p className={styles.slotTitle}>{verticalManagement.placeholderTitle}</p>
                      <p className={styles.slotStatus}>{verticalManagement.placeholderStatus}</p>
                      <p className={styles.slotNote}>{verticalManagement.placeholderNote}</p>
                    </>
                  )}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
