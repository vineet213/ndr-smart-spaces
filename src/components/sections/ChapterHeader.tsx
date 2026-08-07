import { Eyebrow, Heading, Lede } from "@/components/ui";
import { cx } from "../ui/cx";
import styles from "./ChapterHeader.module.css";

type ChapterHeaderProps = {
  numeral: string;
  eyebrow: string;
  heading: string;
  headingId: string;
  lede?: string;
  tone?: "light" | "dark";
  className?: string;
};

export function ChapterHeader({
  numeral,
  eyebrow,
  heading,
  headingId,
  lede,
  tone = "light",
  className,
}: ChapterHeaderProps) {
  return (
    <div className={cx(styles.chapter, tone === "dark" && styles.onDark, className)}>
      <span className={styles.rule} aria-hidden="true" />
      <div className={styles.row}>
        <span className={styles.numeral} aria-hidden="true">
          {numeral}
        </span>
        <div className={styles.body}>
          <div className={styles.eyebrowRow}>
            <span className={styles.diamond} aria-hidden="true" />
            <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
          </div>
          <Heading as="h2" id={headingId} tone={tone}>
            {heading}
          </Heading>
          {lede ? (
            <Lede tone={tone} className={styles.lede}>
              {lede}
            </Lede>
          ) : null}
        </div>
      </div>
    </div>
  );
}
