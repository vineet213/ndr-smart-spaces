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

function PendingRow({ category }: { category: string }) {
  return (
    <li className={cx(styles.row, styles.pendingRow)}>
      <span className={styles.ref} aria-hidden="true">
        —
      </span>
      <span className={styles.asOn} aria-hidden="true">
        —
      </span>
      <span className={styles.title}>
        <span className={styles.entryLabel}>{category}</span>
        <span className={styles.entryNote}>Records publish as filings are approved.</span>
      </span>
      <span className={styles.category}>Pending</span>
      <span className={styles.type} aria-hidden="true">
        —
      </span>
      <span className={styles.status}>
        <StatusBadge status="pending" />
      </span>
      <span className={styles.action} aria-hidden="true">
        —
      </span>
    </li>
  );
}

const HEAD_LABELS = ["Ref", "As on", "Document", "Category", "Type", "Status", "Action"];

function RegisterHead() {
  return (
    <div className={styles.head} aria-hidden="true">
      {HEAD_LABELS.map((label) => (
        <span key={label} className={styles.headCell}>
          {label}
        </span>
      ))}
    </div>
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

      <div className={styles.register}>
        <RegisterHead />
        {hasFilings ? (
          <ol className={styles.list}>
            {visible.map((filing) => (
              <FilingRow key={filing.ref} filing={filing} />
            ))}
          </ol>
        ) : (
          <ol className={styles.list}>
            {config.categories.map((category) => (
              <PendingRow key={category} category={category} />
            ))}
          </ol>
        )}
      </div>

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
        footnotes={rows.length > 0 && config.note ? [config.note] : undefined}
        firstColAccent
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
            <div className={styles.register}>
              <RegisterHead />
              {group.documents.length > 0 ? (
                <ol className={styles.list}>
                  {group.documents.map((filing) => (
                    <FilingRow key={filing.ref} filing={filing} />
                  ))}
                </ol>
              ) : (
                <ol className={styles.list}>
                  <PendingRow category={group.category} />
                </ol>
              )}
            </div>
          </section>
        ))}
      </div>
      {config.note ? <SourceFootnote className={styles.note}>{config.note}</SourceFootnote> : null}
    </>
  );
}

export function FilingLibrary({ config }: FilingLibraryProps) {
  const publishedCount = config.filings.filter((filing) => filing.status === "published").length;
  const summaryLine =
    config.mode === "table"
      ? (config.statements?.length ?? 0) > 0
        ? "Results statements on record."
        : "Statement pending publication."
      : publishedCount > 0
        ? `${publishedCount} document${publishedCount === 1 ? "" : "s"} on record.`
        : "The record is being filed.";

  return (
    <section className={styles.section} aria-labelledby="filing-library-title">
      <Container>
        <Reveal>
          <div className={styles.docHeader}>
            <span className={styles.numeral} aria-hidden="true">
              01
            </span>
            <span className={styles.ref}>DOC · {config.eyebrow}</span>
          </div>
          <Eyebrow>{config.eyebrow}</Eyebrow>
          <Heading variant="section" id="filing-library-title" className={styles.heading}>
            {config.title}
          </Heading>
          <Lede className={styles.lede}>{config.lede}</Lede>
          <p className={styles.meta}>
            {config.asOn} · {config.edition}
          </p>
          <div className={styles.summary} role="status">
            <span className={styles.summaryKicker}>Record status</span>
            <p className={styles.summaryLine}>{summaryLine}</p>
            {config.note ? <p className={styles.summaryNote}>{config.note}</p> : null}
          </div>
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
