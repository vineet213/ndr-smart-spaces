"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { leadership, type LeadershipGroup } from "@/lib/data/about";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./Leadership.module.css";
import { cx } from "../ui/cx";

/* Slightly longer than the tiles' 420ms flex-basis transition: the row only  */
/* counts as "at rest" (safe to measure) once a collapse has fully finished.  */
const SETTLE_MS = 500;

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
  const [restHeights, setRestHeights] = useState<readonly number[]>([]);
  const pointerTypeRef = useRef<string>("");
  const activeRef = useRef<number | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const settledAfter = useRef(0);

  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveTimer = () => {
    if (leaveTimer.current !== null) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };
  const setActive = (next: number | null) => {
    if (next === null && activeRef.current !== null) {
      settledAfter.current = performance.now() + SETTLE_MS;
    }
    activeRef.current = next;
    setActiveIndex(next);
  };
  // Each tile's resting height, read only while the whole row is at rest. The
  // opened card takes it as a min-height (see .cardActive), so its footprint
  // always contains the tile it grew from and the cursor that opened it.
  const measureRest = () => {
    const list = listRef.current;
    if (!list) return;
    const heights: number[] = [];
    list.querySelectorAll<HTMLElement>("li[data-index]").forEach((li) => {
      const card = li.querySelector<HTMLElement>("article");
      heights[Number(li.dataset.index)] = card ? card.offsetHeight : 0;
    });
    setRestHeights(heights);
  };
  const activate = (index: number) => {
    clearLeaveTimer();
    if (activeRef.current === index) return;
    if (activeRef.current === null && performance.now() >= settledAfter.current) measureRest();
    setActive(index);
  };
  const resetIfActive = (index: number) => {
    clearLeaveTimer();
    leaveTimer.current = setTimeout(() => {
      if (activeRef.current === index) setActive(null);
    }, 120);
  };
  const toggle = (index: number) => {
    clearLeaveTimer();
    if (activeRef.current === index) setActive(null);
    else activate(index);
  };
  // Hover opens a tile only on real cursor movement. Browsers re-dispatch
  // pointer events at the same coordinates whenever layout shifts under a
  // still cursor; treating those as hovers is what let an opening/closing
  // tile retrigger itself in a loop.
  const handlePointerMove = (event: ReactPointerEvent<HTMLOListElement>) => {
    if (event.pointerType !== "mouse") return;
    const previous = lastPoint.current;
    lastPoint.current = { x: event.clientX, y: event.clientY };
    if (previous && previous.x === event.clientX && previous.y === event.clientY) return;
    const item = (event.target as HTMLElement).closest<HTMLElement>("li[data-index]");
    if (!item) return;
    const index = Number(item.dataset.index);
    if (profiles[index]) activate(index);
  };

  useEffect(() => clearLeaveTimer, []);

  return (
    <Stack gap="6xl">
      <Reveal>
        <h3 className={styles.groupTitle} id={`${group.id}-title`}>
          {group.title}
        </h3>
      </Reveal>

      <ol
        ref={listRef}
        className={styles.grid}
        aria-labelledby={`${group.id}-title`}
        onPointerMove={handlePointerMove}
      >
        {Array.from({ length: slots }, (_, index) => {
          const profile = profiles[index];
          const isActive = activeIndex === index;
          const isDimmed = activeIndex !== null && !isActive;
          const restHeight = restHeights[index];
          return (
            <li
              key={profile?.name ?? index}
              data-index={index}
              className={cx(
                styles.item,
                isActive && styles.itemActive,
                isDimmed && styles.itemDimmed,
              )}
              style={restHeight ? ({ "--rest-h": `${restHeight}px` } as CSSProperties) : undefined}
              // Open (pointermove, above) and close share this one element. It
              // is the tile's untransformed box, so the opened card's lift
              // can't carry the hit area away from the cursor.
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") resetIfActive(index);
              }}
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
                    <figure className={styles.portrait}>
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
