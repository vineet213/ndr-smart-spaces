"use client";

import { useMemo, useState } from "react";
import { cx } from "../ui/cx";
import styles from "./StatementTable.module.css";

export type StatementColumn = {
  label: string;
  key: string;
  numeric?: boolean;
};

export type StatementRowData = {
  id: string;
  cells: Record<string, string>;
};

type StatementTableProps = {
  caption: string;
  columns: StatementColumn[];
  rows: StatementRowData[];
  footnotes?: string[];
  entityNote?: string;
};

type SortState = { key: string; dir: "asc" | "desc" } | null;

export function StatementTable({
  caption,
  columns,
  rows,
  footnotes,
  entityNote,
}: StatementTableProps) {
  const [sort, setSort] = useState<SortState>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    return [...rows].sort((a, b) => {
      const av = a.cells[sort.key] ?? "";
      const bv = b.cells[sort.key] ?? "";
      const result = av.localeCompare(bv, "en", { numeric: true });
      return sort.dir === "asc" ? result : -result;
    });
  }, [rows, sort]);

  const toggleSort = (key: string) => {
    setSort((current) => {
      if (!current || current.key !== key) return { key, dir: "asc" };
      if (current.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const empty = rows.length === 0;

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>{caption}</figcaption>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={cx(column.numeric && styles.numeric)}
                    aria-sort={
                      isSorted ? (sort?.dir === "asc" ? "ascending" : "descending") : "none"
                    }
                  >
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.label}
                      <span className={styles.sortGlyph} aria-hidden="true">
                        {isSorted ? (sort?.dir === "asc" ? "↑" : "↓") : ""}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {empty ? (
              <tr>
                <td className={styles.emptyCell} colSpan={columns.length}>
                  The statement is being filed. Rows publish as data is approved.
                </td>
              </tr>
            ) : (
              sorted.map((row, index) => (
                <tr key={row.id} className={index % 2 === 1 ? styles.zebra : undefined}>
                  {columns.map((column) => (
                    <td key={column.key} className={cx(column.numeric && styles.numeric)}>
                      {row.cells[column.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {footnotes?.length ? (
        <ul className={styles.footnotes}>
          {footnotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
      {entityNote ? <p className={styles.entityNote}>{entityNote}</p> : null}
    </figure>
  );
}
