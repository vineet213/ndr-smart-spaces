"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container, Stack } from "@/components/layout";
import { Heading, Icon } from "@/components/ui";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { getLenisInstance } from "@/lib/lenis";
import { leadership, type LeadershipGroup, type LeadershipProfile } from "@/lib/data/about";
import { Reveal } from "./Reveal";
import styles from "./Leadership.module.css";
import { cx } from "../ui/cx";

const noopSubscribe = () => () => {};

/** False while rendering on the server / hydrating, true in the running browser. */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** A portrait with a fixed 4:5 box (explicit width/height), or a monogram if there is no photo. */
function Photo({ profile, eager }: { profile: LeadershipProfile; eager: boolean }) {
  if (!profile.photo) {
    return (
      <span className={styles.monogram} aria-hidden="true">
        {initialsOf(profile.name)}
      </span>
    );
  }
  return (
    <Image
      src={profile.photo}
      alt=""
      width={640}
      height={800}
      sizes="(max-width: 767px) 80vw, (max-width: 1023px) 45vw, 22rem"
      loading={eager ? "eager" : undefined}
      decoding="async"
      className={styles.photo}
    />
  );
}

type PersonCardProps = {
  profile: LeadershipProfile;
  index: number;
  eager: boolean;
  onOpen: (index: number, trigger: HTMLButtonElement) => void;
};

/**
 * One identical card per person: portrait, name, role and a "View profile"
 * cue. No bio, no numbering. Hover only changes colour/scale inside a
 * fixed-size frame, so no box ever resizes or moves.
 */
function PersonCard({ profile, index, eager, onOpen }: PersonCardProps) {
  return (
    <li className={styles.item} style={{ "--i": index } as CSSProperties}>
      <button
        type="button"
        className={styles.card}
        aria-haspopup="dialog"
        aria-label={`${profile.name}, ${profile.role}: view profile`}
        onClick={(event) => onOpen(index, event.currentTarget)}
      >
        <span className={styles.media}>
          <span className={styles.frame}>
            <span className={styles.portrait}>
              <Photo profile={profile} eager={eager} />
            </span>
          </span>
          <svg className={styles.bracket} viewBox="0 0 52 52" aria-hidden="true" focusable="false">
            <path d="M50.5 1.5 H0" pathLength="1" />
            <path d="M50.5 1.5 V52" pathLength="1" />
          </svg>
        </span>
        <span className={styles.cardName}>{profile.name}</span>
        <span className={styles.cardRole}>{profile.role}</span>
        <span className={styles.rule} aria-hidden="true" />
        <span className={styles.cue}>
          View profile <span aria-hidden="true">+</span>
        </span>
      </button>
    </li>
  );
}

function PendingCard({ group }: { group: LeadershipGroup }) {
  return (
    <li className={cx(styles.item, styles.pending)}>
      <div className={styles.pendingCard}>
        <span className={styles.pendingFrame} aria-hidden="true" />
        <span className={styles.cardName}>{group.placeholderTitle}</span>
        <span className={styles.cardRole}>{group.placeholderStatus}</span>
      </div>
    </li>
  );
}

function LeadershipGroupSection({ group, eager }: { group: LeadershipGroup; eager: boolean }) {
  const profiles = group.profiles;
  const pending = Math.max(0, Math.max(profiles.length, group.placeholderSlots) - profiles.length);
  const baseId = useId();
  const gridRef = useRef<HTMLUListElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // `ready` is only set once JS is running, so with JS off the cards just show.
  // `revealed` flips once when the grid first scrolls into view.
  const ready = useIsClient();
  const mounted = ready;
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Safari doesn't focus a button on click, so return focus explicitly too.
    triggerRef.current?.focus();
  }, []);

  useFocusTrap(drawerRef, open, close, closeRef);

  // Page scroll lock without any layout shift: the gutter stays reserved
  // (html.drawer-open, see reset.css) and Lenis' wheel smoothing is paused.
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

  const openProfile = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setCurrent(index);
    setOpen(true);
  };

  const step = (delta: number) => {
    setCurrent((value) => (value + delta + profiles.length) % profiles.length);
  };

  const onDrawerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  };

  const drawer = (
    <div className={cx(styles.layer, open && styles.layerOpen)}>
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-name-${current}`}
        aria-hidden={!open}
        inert={!open}
        className={styles.drawer}
        onKeyDown={onDrawerKeyDown}
        data-lenis-prevent
      >
        <div className={styles.drawerBar}>
          <span className={styles.drawerGroup}>{group.title}</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.iconButton}
            aria-label="Close profile"
            onClick={close}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {profiles.map((profile, index) => {
            const active = index === current;
            return (
              <div
                key={profile.name}
                className={cx(styles.sheet, active && styles.sheetActive)}
                aria-hidden={!active}
                inert={!active}
              >
                <div className={styles.sheetPortrait}>
                  <Photo profile={profile} eager />
                </div>
                <div className={styles.sheetHead}>
                  <h4 className={styles.sheetName} id={`${baseId}-name-${index}`}>
                    {profile.name}
                  </h4>
                  <p className={styles.sheetRole}>{profile.role}</p>
                  <span className={styles.sheetRule} aria-hidden="true" />
                </div>
                <p className={styles.sheetBio}>{profile.bio}</p>
              </div>
            );
          })}
        </div>

        <div className={styles.drawerNav}>
          <button type="button" className={styles.navButton} onClick={() => step(-1)}>
            <Icon name="arrow-right" className={styles.flip} />
            Previous
          </button>
          <button type="button" className={styles.navButton} onClick={() => step(1)}>
            Next
            <Icon name="arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Stack gap="6xl">
      <Reveal>
        <h3 className={styles.groupTitle} id={`${group.id}-title`}>
          {group.title}
        </h3>
      </Reveal>

      <ul
        ref={gridRef}
        className={cx(styles.grid, ready && styles.ready, revealed && styles.revealed)}
        aria-labelledby={`${group.id}-title`}
      >
        {profiles.map((profile, index) => (
          <PersonCard
            key={profile.name}
            profile={profile}
            index={index}
            eager={eager}
            onOpen={openProfile}
          />
        ))}
        {Array.from({ length: pending }, (_, slot) => (
          <PendingCard key={`pending-${slot}`} group={group} />
        ))}
      </ul>

      {mounted ? createPortal(drawer, document.body) : null}
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
