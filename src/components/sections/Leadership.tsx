"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { leadership, type LeadershipGroup } from "@/lib/data/about";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./Leadership.module.css";
import { cx } from "../ui/cx";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * "Pop & grow" member grid: the default state is a compact photo + name +
 * designation tile — no reserved space, nothing empty. Hovering, focusing or
 * tapping a tile makes it (and only it) the active one: the portrait lifts
 * slightly, a tonal curtain rises over it, and the bio unfolds inside that
 * same tile via a height reveal — never an absolutely positioned overlay, so
 * it can never spill outside the grid. On wide screens the active tile also
 * widens (flex-basis grows), and siblings on its row reflow to make room,
 * exactly like an editorial "featured tile" grid. Narrower breakpoints keep
 * the width fixed and let the tile grow only in height (a plain accordion).
 */
function LeadershipGroupSection({ group }: { group: LeadershipGroup }) {
  const profiles = group.profiles;
  const slots = Math.max(profiles.length, group.placeholderSlots);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pointerTypeRef = useRef<string>("");

  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveTimer = () => {
    if (leaveTimer.current !== null) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };
  const activate = (index: number) => {
    clearLeaveTimer();
    setActiveIndex(index);
  };
  const resetIfActive = (index: number) => {
    clearLeaveTimer();
    // A short hysteresis delay: the active tile's growth reflows its
    // neighbours, so a cursor sitting near a tile boundary can otherwise end
    // up briefly outside the card it's still "on", firing leave/enter in a
    // flickering loop. Deferring the collapse gives a same-card re-entry a
    // moment to cancel it before anything visibly changes.
    leaveTimer.current = setTimeout(() => {
      setActiveIndex((current) => (current === index ? null : current));
    }, 120);
  };
  const toggle = (index: number) => setActiveIndex((current) => (current === index ? null : index));

  useEffect(() => clearLeaveTimer, []);

  return (
    <Stack gap="6xl">
      <Reveal>
        <h3 className={styles.groupTitle} id={`${group.id}-title`}>
          {group.title}
        </h3>
      </Reveal>

      <ol className={styles.grid} aria-labelledby={`${group.id}-title`}>
        {Array.from({ length: slots }, (_, index) => {
          const profile = profiles[index];
          const isActive = activeIndex === index;
          const isDimmed = activeIndex !== null && !isActive;
          return (
            <li
              key={profile?.name ?? index}
              className={cx(
                styles.item,
                isActive && styles.itemActive,
                isDimmed && styles.itemDimmed,
              )}
            >
              <Reveal delay={(index + 1) as RevealDelay}>
                {profile ? (
                  <article
                    className={cx(
                      styles.card,
                      isActive && styles.cardActive,
                      isDimmed && styles.cardDimmed,
                    )}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isActive}
                    aria-label={`${profile.name}, ${profile.role} — read full profile`}
                    onPointerLeave={(event) => {
                      if (event.pointerType === "mouse") resetIfActive(index);
                    }}
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
                    onClick={() => {
                      if (pointerTypeRef.current === "touch") toggle(index);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggle(index);
                      }
                    }}
                  >
                    <figure
                      className={styles.portrait}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") activate(index);
                      }}
                    >
                      {profile.photo ? (
                        <Image
                          src={profile.photo}
                          alt={profile.name}
                          fill
                          sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 28rem"
                          className={styles.photo}
                        />
                      ) : (
                        <div className={styles.monogram} aria-hidden="true">
                          {initialsOf(profile.name)}
                        </div>
                      )}
                      <span className={styles.curtain} aria-hidden="true" />
                    </figure>
                    <div className={styles.cardBody}>
                      <h4 className={styles.cardName}>{profile.name}</h4>
                      <p className={styles.cardRole}>{profile.role}</p>
                      <div className={styles.bio}>
                        <p className={styles.bioText}>{profile.bio}</p>
                      </div>
                    </div>
                  </article>
                ) : (
                  <div className={cx(styles.slot, isDimmed && styles.cardDimmed)}>
                    <div className={styles.slotHeader}>
                      <span className={styles.slotIndex}>
                        Record {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.slotMark} aria-hidden="true" />
                    </div>
                    <p className={styles.slotTitle}>{group.placeholderTitle}</p>
                    <p className={styles.slotStatus}>{group.placeholderStatus}</p>
                    <p className={styles.slotNote}>{group.placeholderNote}</p>
                  </div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Stack>
  );
}

export function Leadership() {
  return (
    <section className={styles.section} aria-labelledby="leadership-title">
      <Container>
        <Stack gap="8xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow>{leadership.eyebrow}</Eyebrow>
              <Heading variant="section" id="leadership-title">
                {leadership.heading}
              </Heading>
            </Stack>
          </Reveal>

          {leadership.groups.map((group) => (
            <LeadershipGroupSection key={group.id} group={group} />
          ))}
        </Stack>
      </Container>
    </section>
  );
}
