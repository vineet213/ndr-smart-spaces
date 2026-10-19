"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container } from "@/components/layout";
import { Heading } from "@/components/ui";
import { pressArchive } from "@/lib/data/media";
import type { PressArchiveEntry, PressCategory } from "@/lib/data/media";
import { Icon } from "../ui/Icon";
import { cx } from "../ui/cx";
import { PressLightbox } from "./PressLightbox";
import { PressTitleCard } from "./PressTitleCard";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./PressArchive.module.css";

type FilterId = "all" | PressCategory;

/* Dates are written "10 June 2026", with a trailing * on drafts. */
const timeOf = (entry: PressArchiveEntry) => Date.parse(entry.date.replace("*", "")) || 0;

/* Newest first; entries on the same day keep their register order. */
const SORTED = [...pressArchive.entries]
  .map((entry, order) => ({ entry, order }))
  .sort((a, b) => timeOf(b.entry) - timeOf(a.entry) || a.order - b.order)
  .map(({ entry }) => entry);

/* How an entry's picture is shown: a print clipping on a paper matte, a      */
/* capture of the web article filling the frame, or the typographic card.     */
function mediaKind(entry: PressArchiveEntry) {
  if (!entry.image) return "card" as const;
  return entry.href ? ("web" as const) : ("clipping" as const);
}

function PressMedia({ entry, sizes }: { entry: PressArchiveEntry; sizes: string }) {
  const kind = mediaKind(entry);
  if (kind === "card") return <PressTitleCard entry={entry} />;
  return (
    <div className={cx(styles.frame, kind === "clipping" ? styles.frameClipping : styles.frameWeb)}>
      <Image
        src={entry.image!}
        alt={`${entry.publication ?? "Coverage"}: ${entry.title}`}
        fill
        sizes={sizes}
        className={kind === "clipping" ? styles.clippingImage : styles.webImage}
      />
    </div>
  );
}

type ActionProps = { entry: PressArchiveEntry; onView: (entry: PressArchiveEntry) => void };

/* Linked coverage opens the article; everything else opens the viewer. */
function PressAction({ entry, onView }: ActionProps) {
  if (entry.href) {
    return (
      <a
        href={entry.href}
        target={entry.external ? "_blank" : undefined}
        rel={entry.external ? "noopener noreferrer" : undefined}
        className={styles.action}
      >
        Read article
        <Icon name="arrow-up-right" size="sm" />
        {entry.external ? <span className={styles.srOnly}> (opens in a new tab)</span> : null}
      </a>
    );
  }
  return (
    <button type="button" className={styles.action} onClick={() => onView(entry)}>
      {entry.image ? "View clipping" : "View coverage"}
      <Icon name="arrow-right" size="sm" />
    </button>
  );
}

type CardProps = ActionProps & {
  categoryLabel: string;
  open: boolean;
  onToggle: (id: string) => void;
};

function PressCard({ entry, categoryLabel, open, onToggle, onView }: CardProps) {
  const badge = entry.publication ?? categoryLabel;

  return (
    <article
      className={styles.card}
      data-open={open || undefined}
      onClick={(event) => {
        // Touch: the first tap opens the panel; taps on the action pass through.
        if ((event.target as HTMLElement).closest("a, button")) return;
        if (window.matchMedia("(hover: none)").matches) onToggle(entry.id);
      }}
    >
      <div className={styles.media}>
        <PressMedia
          entry={entry}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
        />
        {/* the text card already prints the outlet's name */}
        {mediaKind(entry) === "card" ? null : <span className={styles.badge}>{badge}</span>}
      </div>

      <div className={styles.body}>
        <time className={styles.date}>{entry.date}</time>
        <h3 className={styles.title}>{entry.title}</h3>
      </div>

      {/* Revealed on hover, keyboard focus or (touch) a tap. */}
      <div className={styles.reveal}>
        {/* the headline stays readable while the panel covers the card body */}
        <div className={styles.revealHead} aria-hidden="true">
          <span className={styles.date}>{entry.date}</span>{" "}
          <span className={styles.revealTitle}>{entry.title}</span>
        </div>
        {entry.note ? <p className={styles.note}>{entry.note}</p> : null}
        <PressAction entry={entry} onView={onView} />
      </div>
    </article>
  );
}

function LeadStory({ entry, categoryLabel, onView }: ActionProps & { categoryLabel: string }) {
  return (
    <article className={styles.lead}>
      <div className={styles.leadMedia}>
        <PressMedia entry={entry} sizes="(max-width: 1023px) 100vw, 60vw" />
      </div>
      <div className={styles.leadBody}>
        <span className={styles.leadKicker}>
          <span className={styles.leadBadge}>{entry.publication ?? categoryLabel}</span>{" "}
          <span>Latest</span>
        </span>{" "}
        <time className={styles.date}>{entry.date}</time>
        <h3 className={styles.leadTitle}>{entry.title}</h3>
        {entry.note ? <p className={styles.leadNote}>{entry.note}</p> : null}
        <PressAction entry={entry} onView={onView} />
      </div>
    </article>
  );
}

export function PressArchive() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const labelOf = useCallback(
    (category: PressCategory) =>
      pressArchive.categories.find((item) => item.key === category)?.label ?? category,
    [],
  );

  // Only categories that have entries get a tab.
  const tabs = useMemo(() => {
    const list: { id: FilterId; label: string; count: number }[] = [
      { id: "all", label: "All", count: SORTED.length },
    ];
    for (const category of pressArchive.categories) {
      const count = SORTED.filter((entry) => entry.category === category.key).length;
      if (count > 0) list.push({ id: category.key, label: category.label, count });
    }
    return list;
  }, []);

  const visible = filter === "all" ? SORTED : SORTED.filter((entry) => entry.category === filter);
  const lead = filter === "all" ? visible[0] : undefined;
  const grid = lead ? visible.slice(1) : visible;

  // The viewer steps through the visible coverage that has no link.
  const viewable = visible.filter((entry) => !entry.href);

  const onView = (entry: PressArchiveEntry) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setViewing(viewable.findIndex((item) => item.id === entry.id));
  };
  const closeViewer = useCallback(() => {
    setViewing(null);
    triggerRef.current?.focus();
  }, []);
  const viewableCount = viewable.length;
  const stepViewer = (delta: number) =>
    setViewing((value) =>
      value === null ? value : (value + delta + viewableCount) % viewableCount,
    );

  // Touch: tapping outside an open card closes it.
  useEffect(() => {
    if (!openId) return;
    const onDown = (event: PointerEvent) => {
      if (!(event.target as HTMLElement).closest(`.${styles.card}`)) setOpenId(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openId]);

  // Sliding gold indicator under the active tab.
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const active = tabsRef.current?.querySelector<HTMLElement>("[aria-pressed='true']");
      if (active) setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter]);

  return (
    <section className={styles.section} id="press-archive" aria-labelledby="press-archive-title">
      <Container>
        <Reveal>
          <header className={styles.header}>
            <span className={styles.goldRule} aria-hidden="true" />
            <Heading
              variant="section"
              tone="dark"
              id="press-archive-title"
              className={styles.heading}
            >
              {pressArchive.heading}
            </Heading>
          </header>
        </Reveal>

        <div ref={tabsRef} className={styles.tabs} role="group" aria-label="Filter the archive">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cx(styles.tab, filter === tab.id && styles.tabActive)}
              aria-pressed={filter === tab.id}
              onClick={() => {
                setFilter(tab.id);
                setOpenId(null);
              }}
            >
              {tab.label}
              <span className={styles.tabCount}>{tab.count}</span>
            </button>
          ))}
          <span
            className={styles.indicator}
            style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
            aria-hidden="true"
          />
        </div>

        {lead ? (
          <Reveal key={`lead-${filter}`}>
            <LeadStory entry={lead} categoryLabel={labelOf(lead.category)} onView={onView} />
          </Reveal>
        ) : null}

        <ol className={styles.grid} key={filter}>
          {grid.map((entry, index) => (
            <li key={entry.id}>
              <Reveal delay={(index % 3) as RevealDelay}>
                <PressCard
                  entry={entry}
                  categoryLabel={labelOf(entry.category)}
                  open={openId === entry.id}
                  onToggle={(id) => setOpenId((current) => (current === id ? null : id))}
                  onView={onView}
                />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>

      <PressLightbox items={viewable} index={viewing} onClose={closeViewer} onStep={stepViewer} />
    </section>
  );
}
