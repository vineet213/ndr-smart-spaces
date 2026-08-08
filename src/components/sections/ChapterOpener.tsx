"use client";

import { useInView } from "@/hooks/useInView";
import type { Chapter } from "@/lib/data/business";
import { cx } from "../ui/cx";
import styles from "./ChapterOpener.module.css";

type ChapterOpenerProps = {
  chapter: Chapter;
  headingId: string;
  tone?: "light" | "dark";
  className?: string;
};

const sheetOf = (numeral: string) => String(Number(numeral) + 1);

export function ChapterOpener({
  chapter,
  headingId,
  tone = "light",
  className,
}: ChapterOpenerProps) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <header
      ref={ref}
      className={cx(
        styles.opener,
        tone === "dark" && styles.onDark,
        inView && styles.drawn,
        className,
      )}
    >
      <div className={styles.row}>
        <span className={styles.numeral} aria-hidden="true">
          {chapter.index}
        </span>

        <div className={styles.type}>
          <h2 id={headingId} className={styles.title}>
            {chapter.label}
          </h2>
          <p className={styles.thesis}>{chapter.title}</p>
        </div>

        <div className={styles.meta}>
          <span className={styles.plate}>{chapter.plate}</span>
          <span className={styles.sheet}>Sheet {sheetOf(chapter.index)} of 06</span>
        </div>
      </div>

      <span className={styles.rule} aria-hidden="true" />
    </header>
  );
}
