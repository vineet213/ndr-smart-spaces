"use client";

import { useInView } from "@/hooks/useInView";
import type { Chapter } from "@/lib/data/business";
import { cx } from "../ui/cx";
import styles from "./ChapterOpener.module.css";

type ChapterOpenerProps = {
  chapter: Chapter;
  headingId: string;
  tone?: "light" | "dark";
  animate?: boolean;
  className?: string;
  hideNumeral?: boolean;
  hideThesis?: boolean;
  hideRule?: boolean;
};

export function ChapterOpener({
  chapter,
  headingId,
  tone = "light",
  animate = true,
  className,
  hideNumeral = false,
  hideThesis = false,
  hideRule = false,
}: ChapterOpenerProps) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <header
      ref={ref}
      className={cx(
        styles.opener,
        tone === "dark" && styles.onDark,
        (animate === false || inView) && styles.drawn,
        className,
      )}
    >
      <div className={styles.row}>
        {!hideNumeral && (
          <span className={styles.numeral} aria-hidden="true">
            {chapter.index}
          </span>
        )}

        <div className={styles.type}>
          <h2 id={headingId} className={styles.title}>
            {chapter.label}
          </h2>
          {!hideThesis && <p className={styles.thesis}>{chapter.title}</p>}
        </div>
      </div>

      {!hideRule && <span className={styles.rule} aria-hidden="true" />}
    </header>
  );
}
