"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cx } from "../ui/cx";
import styles from "./PortfolioSearch.module.css";

export type SearchItem =
  | { kind: "city"; key: string; label: string; sub: string; stateId: string; city: string }
  | {
      kind: "warehouse";
      key: string;
      label: string;
      sub: string;
      stateId: string;
      city: string;
      id: string;
    };

const MAX_RESULTS = 9;

function rank(item: SearchItem, query: string): number {
  const label = item.label.toLowerCase();
  if (label.startsWith(query)) return 0;
  if (label.split(/\s+/).some((word) => word.startsWith(query))) return 1;
  if (label.includes(query)) return 2;
  if (item.sub.toLowerCase().includes(query)) return 3;
  return -1;
}

export function PortfolioSearch({
  items,
  placeholder,
  noun,
  onPick,
}: {
  items: readonly SearchItem[];
  placeholder: string;
  noun: string;
  onPick: (item: SearchItem) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .map((item) => ({ item, score: rank(item, q) }))
      .filter((entry) => entry.score >= 0)
      .sort(
        (a, b) =>
          a.score - b.score ||
          (a.item.kind === b.item.kind ? 0 : a.item.kind === "city" ? -1 : 1) ||
          a.item.label.localeCompare(b.item.label),
      )
      .slice(0, MAX_RESULTS)
      .map((entry) => entry.item);
  }, [items, query]);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const pick = (item: SearchItem) => {
    onPick(item);
    setQuery("");
    setOpen(false);
  };

  const showList = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.field}>
        <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
        </svg>
        <input
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
          aria-label={placeholder}
          className={styles.input}
          placeholder={placeholder}
          value={query}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActive((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((value) => Math.max(value - 1, 0));
            } else if (event.key === "Enter") {
              const item = results[active];
              if (item) {
                event.preventDefault();
                pick(item);
              }
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        />
      </div>

      {showList ? (
        <ul id={listId} role="listbox" className={styles.list}>
          {results.length === 0 ? (
            <li className={styles.empty}>
              No {noun} or city matches “{query.trim()}”.
            </li>
          ) : (
            results.map((item, index) => (
              <li
                key={item.key}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                className={cx(styles.option, index === active && styles.optionActive)}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  pick(item);
                }}
              >
                <span className={styles.kind}>{item.kind === "city" ? "City" : noun}</span>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.sub}>{item.sub}</span>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
