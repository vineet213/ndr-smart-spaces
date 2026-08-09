"use client";

import { useState } from "react";
import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote, TextLink } from "@/components/ui";
import { ExternalLink } from "@/components/ui";
import { pressArchive, MEDIA_STATUS_LABELS, MEDIA_STATUS_TONES } from "@/lib/data/media";
import type { MediaRecordStatus, PressCategory } from "@/lib/data/media";
import { MediaDocHeader } from "./MediaDocHeader";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./PressArchive.module.css";

type FilterId = "all" | PressCategory;

function StatusMark({ status }: { status: MediaRecordStatus }) {
  const tone = MEDIA_STATUS_TONES[status];
  return (
    <span
      className={cx(styles.status, tone === "active" ? styles.statusActive : styles.statusPending)}
    >
      <span className={styles.statusGlyph} aria-hidden="true">
        {tone === "active" ? "●" : "—"}
      </span>
      {MEDIA_STATUS_LABELS[status]}
    </span>
  );
}

export function PressArchive() {
  const [filter, setFilter] = useState<FilterId>("all");

  const visible =
    filter === "all"
      ? pressArchive.entries
      : pressArchive.entries.filter((entry) => entry.category === filter);

  return (
    <section className={styles.section} id="press-archive" aria-labelledby="press-archive-title">
      <Container>
        <Reveal>
          <MediaDocHeader numeral="03" code="REF 03 · PRESS ARCHIVE" tone="dark" />
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {pressArchive.eyebrow}
          </Eyebrow>
          <Heading
            variant="section"
            tone="dark"
            id="press-archive-title"
            className={styles.heading}
          >
            {pressArchive.heading}
          </Heading>
          <Lede tone="dark" className={styles.lede}>
            {pressArchive.lede}
          </Lede>
        </Reveal>

        <div className={styles.tabs} role="group" aria-label="Filter the archive">
          <button
            type="button"
            className={cx(styles.tab, filter === "all" && styles.tabActive)}
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {pressArchive.categories.map((category) => (
            <button
              key={category.key}
              type="button"
              className={cx(styles.tab, filter === category.key && styles.tabActive)}
              aria-pressed={filter === category.key}
              onClick={() => setFilter(category.key)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className={styles.registerIndex}>
          <span className={styles.registerCode}>{pressArchive.registerCode}</span>
          <span className={styles.registerMeta}>
            Entries · {pressArchive.entries.length}
            <span aria-hidden="true">·</span>
            {pressArchive.folio}
          </span>
        </div>

        <div className={styles.register}>
          <div className={styles.head} aria-hidden="true">
            <span className={styles.headCell}>Ref</span>
            <span className={styles.headCell}>Date</span>
            <span className={styles.headCell}>Entry</span>
            <span className={styles.headCell}>Category</span>
            <span className={styles.headCell}>Status</span>
            <span className={styles.headCell}>Source</span>
          </div>
          <ol className={styles.list}>
            {visible.map((entry) => (
              <li key={entry.id} className={styles.row}>
                <span className={styles.ref}>{entry.ref}</span>
                <span className={styles.date}>{entry.date}</span>
                <span className={styles.entry}>
                  <span className={styles.entryTitle}>{entry.title}</span>
                  {entry.note ? <span className={styles.entryNote}>{entry.note}</span> : null}
                </span>
                <span className={styles.category}>
                  {pressArchive.categories.find((item) => item.key === entry.category)?.label ??
                    entry.category}
                </span>
                <span className={styles.statusCell}>
                  <StatusMark status={entry.status} />
                </span>
                <span className={styles.action}>
                  {entry.href ? (
                    entry.external ? (
                      <ExternalLink href={entry.href}>External</ExternalLink>
                    ) : (
                      <TextLink href={entry.href}>Open</TextLink>
                    )
                  ) : (
                    <span className={styles.actionNone}>—</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <SourceFootnote tone="dark" className={styles.note}>
          {pressArchive.note}
        </SourceFootnote>
      </Container>
    </section>
  );
}
