"use client";

import { useState } from "react";
import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote, TextLink } from "@/components/ui";
import { ExternalLink } from "@/components/ui";
import type { Filing, FilingLibraryConfig, FilingStatus } from "@/lib/data/investor";
import { StatementTable, type StatementColumn, type StatementRowData } from "./StatementTable";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./FilingLibrary.module.css";

type FilingLibraryProps = {
  config: FilingLibraryConfig;
};

const statusLabel: Record<FilingStatus, string> = {
  published: "Published",
  pending: "Pending filing",
  external: "External",
};

function StatusBadge({ status }: { status: FilingStatus }) {
  return (
    <span
      className={cx(
        styles.badge,
        status === "published"
          ? styles.badgePublished
          : status === "external"
            ? styles.badgeExternal
            : styles.badgePending,
      )}
    >
      <span className={styles.badgeGlyph} aria-hidden="true">
        {status === "published" ? "●" : status === "external" ? "↗" : "—"}
      </span>
      {statusLabel[status]}
    </span>
  );
}

function FilingRow({ filing }: { filing: Filing }) {
  return (
    <li className={styles.row}>
      <span className={styles.ref}>{filing.ref}</span>
      <span className={styles.asOn}>{filing.asOn}</span>
      <span className={styles.title}>{filing.title}</span>
      <span className={styles.category}>{filing.category}</span>
      <span className={styles.type}>{filing.type}</span>
      <span className={styles.status}>
        <StatusBadge status={filing.status} />
      </span>
      <span className={styles.action}>
        {filing.status === "external" && filing.href ? (
          <ExternalLink href={filing.href}>{filing.type}</ExternalLink>
        ) : filing.status === "published" && filing.href ? (
          <TextLink href={filing.href}>
            {filing.size ? `Download PDF · ${filing.size}` : "Download PDF"}
          </TextLink>
        ) : null}
      </span>
    </li>
  );
}

function PendingRow({ label }: { label: string }) {
  return (
    <li className={cx(styles.row, styles.pendingRow)}>
      <span className={styles.ref}>—</span>
      <span className={styles.asOn}>—</span>
      <span className={styles.title}>{label}</span>
      <span className={styles.category}>Pending filing</span>
      <span className={styles.type}>—</span>
      <span className={styles.status}>
        <StatusBadge status="pending" />
      </span>
      <span className={styles.action} aria-hidden="true">
        —
      </span>
    </li>
  );
}

function IndexMode({ config }: { config: FilingLibraryConfig }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const hasFilings = config.filings.length > 0;
  const categories = hasFilings ? ["All", ...config.categories] : [];
  const visible = hasFilings
    ? activeCategory === "All"
      ? config.filings
      : config.filings.filter((filing) => filing.category === activeCategory)
    : [];

  return (
    <>
      {categories.length > 0 ? (
        <div className={styles.tabs} role="group" aria-label="Filter by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={cx(styles.tab, activeCategory === category && styles.tabActive)}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      {hasFilings ? (
        <ol className={styles.rows}>
          {visible.map((filing) => (
            <FilingRow key={filing.ref} filing={filing} />
          ))}
        </ol>
      ) : (
        <ol className={styles.rows}>
          {config.categories.map((category) => (
            <PendingRow key={category} label={`${category} — documents being filed`} />
          ))}
        </ol>
      )}

      {config.note ? <SourceFootnote className={styles.note}>{config.note}</SourceFootnote> : null}
    </>
  );
}

function TableMode({ config }: { config: FilingLibraryConfig }) {
  const columns: StatementColumn[] =
    config.statementCols?.map((column) => ({
      key: column.key,
      label: column.label,
      numeric: column.key !== "period",
    })) ?? [];

  const rows: StatementRowData[] =
    config.statements?.map((statement) => {
      const cells: Record<string, string> = { period: statement.period };
      for (const cell of statement.cells) {
        cells[cell.label] = cell.value ?? "—";
      }
      return { id: statement.period, cells };
    }) ?? [];

  return (
    <>
      <StatementTable
        caption={`${config.eyebrow} · ${config.asOn}`}
        columns={columns}
        rows={rows}
        footnotes={config.note ? [config.note] : undefined}
      />
      {config.entityNote ? <SourceFootnote>{config.entityNote}</SourceFootnote> : null}
    </>
  );
}

function LibraryMode({ config }: { config: FilingLibraryConfig }) {
  return (
    <>
      <div className={styles.groups}>
        {config.groups?.map((group) => (
          <section
            key={group.category}
            className={styles.group}
            aria-labelledby={`group-${group.category}`}
          >
            <h3 id={`group-${group.category}`} className={styles.groupTitle}>
              {group.category}
            </h3>
            {group.documents.length > 0 ? (
              <ol className={styles.rows}>
                {group.documents.map((filing) => (
                  <FilingRow key={filing.ref} filing={filing} />
                ))}
              </ol>
            ) : (
              <ol className={styles.rows}>
                <PendingRow label={`${group.category} — documents being filed`} />
              </ol>
            )}
          </section>
        ))}
      </div>
      {config.note ? <SourceFootnote className={styles.note}>{config.note}</SourceFootnote> : null}
    </>
  );
}

export function FilingLibrary({ config }: FilingLibraryProps) {
  return (
    <section className={styles.section} aria-labelledby="filing-library-title">
      <Container>
        <Reveal>
          <Eyebrow>{config.eyebrow}</Eyebrow>
          <Heading variant="section" id="filing-library-title" className={styles.heading}>
            {config.title}
          </Heading>
          <Lede className={styles.lede}>{config.lede}</Lede>
          <p className={styles.meta}>
            {config.asOn} · {config.edition}
          </p>
        </Reveal>

        <Reveal>
          {config.mode === "index" ? <IndexMode config={config} /> : null}
          {config.mode === "table" ? <TableMode config={config} /> : null}
          {config.mode === "library" ? <LibraryMode config={config} /> : null}
        </Reveal>
      </Container>
    </section>
  );
}
