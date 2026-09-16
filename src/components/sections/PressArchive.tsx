"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import { Heading, TextLink } from "@/components/ui";
import { ExternalLink } from "@/components/ui";
import { pressArchive } from "@/lib/data/media";
import type { PressArchiveEntry, PressCategory } from "@/lib/data/media";
import { Reveal, type RevealDelay } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./PressArchive.module.css";

type FilterId = "all" | PressCategory;

function PressCard({ entry, categoryLabel }: { entry: PressArchiveEntry; categoryLabel: string }) {
  const badge = entry.publication ?? categoryLabel;

  return (
    <article className={styles.card}>
      <span className={styles.badge}>{badge}</span>
      <div className={styles.media}>
        {entry.image ? (
          <Image
            src={entry.image}
            alt={`${badge} — ${entry.title}`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className={styles.mediaImage}
          />
        ) : (
          <div className={styles.mediaPlaceholder} aria-hidden="true">
            <span className={styles.placeholderRef}>{entry.ref}</span>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <time className={styles.date} dateTime={entry.date}>
          {entry.date}
        </time>
        <h3 className={styles.cardTitle}>{entry.title}</h3>
        {entry.note ? <p className={styles.cardNote}>{entry.note}</p> : null}
        {entry.href ? (
          entry.external ? (
            <ExternalLink tone="dark" href={entry.href} className={styles.readMore}>
              Read more
            </ExternalLink>
          ) : (
            <TextLink tone="dark" href={entry.href} className={styles.readMore}>
              Read more
            </TextLink>
          )
        ) : null}
      </div>
    </article>
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
          <Heading
            variant="section"
            tone="dark"
            id="press-archive-title"
            className={styles.heading}
          >
            {pressArchive.heading}
          </Heading>
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

        <ol className={styles.grid}>
          {visible.map((entry, index) => (
            <li key={entry.id}>
              <Reveal delay={(index % 6) as RevealDelay}>
                <PressCard
                  entry={entry}
                  categoryLabel={
                    pressArchive.categories.find((item) => item.key === entry.category)?.label ??
                    entry.category
                  }
                />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
