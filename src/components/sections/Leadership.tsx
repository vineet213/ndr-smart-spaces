"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container, Stack } from "@/components/layout";
import { Heading, Icon } from "@/components/ui";
import { leadership, type LeadershipGroup, type LeadershipProfile } from "@/lib/data/about";
import { Reveal } from "./Reveal";
import styles from "./Leadership.module.css";
import { cx } from "../ui/cx";

/* How long the pointer must rest on a roster row before it selects that person. */
/* Long enough that sweeping across the list doesn't flicker; short enough to feel */
/* instant. Clicks, taps and keyboard focus select immediately.                  */
const HOVER_INTENT_MS = 80;

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type PhotoProps = {
  profile: LeadershipProfile;
  /** Portrait (spotlight) or square thumbnail (roster). */
  variant: "portrait" | "thumb";
  eager: boolean;
};

/**
 * Every portrait is in the DOM from the start (the first group eager, the rest
 * lazy but async-decoded) with an explicit aspect ratio, so a selection change
 * never reveals an empty box and never changes any layout.
 */
function Photo({ profile, variant, eager }: PhotoProps) {
  if (!profile.photo) {
    return (
      <div className={styles.monogram} aria-hidden="true">
        {initialsOf(profile.name)}
      </div>
    );
  }
  const portrait = variant === "portrait";
  return (
    <Image
      src={profile.photo}
      alt={portrait ? profile.name : ""}
      width={portrait ? 640 : 144}
      height={portrait ? 800 : 144}
      sizes={portrait ? "(max-width: 767px) 80vw, 18rem" : "72px"}
      loading={eager ? "eager" : undefined}
      decoding="async"
      className={styles.photo}
    />
  );
}

/**
 * "Spotlight & Roster": one person is shown large (the spotlight) while the
 * roster lists everyone. Nothing ever changes size or position on hover or
 * selection: every spotlight panel sits in the SAME grid cell, so the box is
 * always as tall as the tallest profile, and switching people only animates
 * opacity, transform and clip-path. All motion is CSS state classes, so
 * interrupting A -> B -> C mid-transition simply reverses from where it is.
 */
function LeadershipGroupSection({ group, eager }: { group: LeadershipGroup; eager: boolean }) {
  const profiles = group.profiles;
  const pending = Math.max(0, Math.max(profiles.length, group.placeholderSlots) - profiles.length);
  const [active, setActive] = useState(0);
  const [vertical, setVertical] = useState(true);
  const baseId = useId();
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const clearHover = useCallback(() => {
    if (hoverTimer.current !== null) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const select = (index: number) => {
    clearHover();
    setActive(index);
  };

  // Hover selects after a short intent delay, and only where hover really exists
  // (so a touch laptop's emulated mouse events don't double-fire with the tap).
  const hoverSelect = (index: number) => {
    clearHover();
    if (!window.matchMedia("(hover: hover)").matches) return;
    hoverTimer.current = setTimeout(() => {
      hoverTimer.current = null;
      setActive(index);
    }, HOVER_INTENT_MS);
  };

  useEffect(() => clearHover, [clearHover]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setVertical(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = profiles.length - 1;
    let next: number | null = null;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = active === last ? 0 : active + 1;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = active === 0 ? last : active - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Stack gap="6xl">
      <Reveal>
        <h3 className={styles.groupTitle} id={`${group.id}-title`}>
          {group.title}
        </h3>
      </Reveal>

      <div className={styles.layout}>
        <div className={styles.spotlight}>
          {profiles.map((profile, index) => {
            const isActive = index === active;
            return (
              <div
                key={profile.name}
                id={`${baseId}-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-${index}`}
                aria-hidden={!isActive}
                inert={!isActive}
                className={cx(styles.panel, isActive && styles.panelActive)}
              >
                <div className={styles.portraitOuter}>
                  <div className={styles.portraitFrame}>
                    <div className={styles.portraitInner}>
                      <Photo profile={profile} variant="portrait" eager={eager} />
                    </div>
                  </div>
                </div>
                <div className={styles.text}>
                  <p className={cx(styles.reveal, styles.counter)}>
                    {pad(index + 1)}
                    <span className={styles.counterTotal}> / {pad(profiles.length)}</span>
                  </p>
                  <h4 className={cx(styles.reveal, styles.name)}>{profile.name}</h4>
                  <p className={cx(styles.reveal, styles.role)}>{profile.role}</p>
                  <span className={cx(styles.reveal, styles.rule)} aria-hidden="true" />
                  <p className={cx(styles.reveal, styles.bio)}>{profile.bio}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          role="tablist"
          aria-orientation={vertical ? "vertical" : "horizontal"}
          aria-label={group.title}
          className={styles.roster}
          onKeyDown={move}
        >
          {profiles.map((profile, index) => {
            const isActive = index === active;
            return (
              <button
                key={profile.name}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={isActive ? 0 : -1}
                className={cx(styles.tab, isActive && styles.tabActive)}
                onMouseEnter={() => hoverSelect(index)}
                onMouseLeave={clearHover}
                onFocus={() => select(index)}
                onClick={() => select(index)}
              >
                <span className={styles.thumb}>
                  <Photo profile={profile} variant="thumb" eager={eager} />
                </span>
                <span className={styles.tabText}>
                  <span className={styles.tabName}>{profile.name}</span>
                  <span className={styles.tabRole}>{profile.role}</span>
                </span>
                <Icon name="arrow-right" className={styles.tabArrow} />
              </button>
            );
          })}

          {Array.from({ length: pending }, (_, slot) => (
            <div
              key={`pending-${slot}`}
              role="tab"
              aria-selected="false"
              aria-disabled="true"
              tabIndex={-1}
              className={cx(styles.tab, styles.tabPending)}
            >
              <span className={cx(styles.thumb, styles.thumbPending)} aria-hidden="true" />
              <span className={styles.tabText}>
                <span className={styles.tabName}>{group.placeholderTitle}</span>
                <span className={styles.tabRole}>{group.placeholderStatus}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
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
              <Heading variant="section" id="leadership-title">
                {leadership.heading}
              </Heading>
            </Stack>
          </Reveal>

          {leadership.groups.map((group, index) => (
            <LeadershipGroupSection key={group.id} group={group} eager={index === 0} />
          ))}
        </Stack>
      </Container>
    </section>
  );
}
