import { Eyebrow, Heading, Lede } from "@/components/ui";
import type { Tone } from "@/components/ui/types";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import styles from "./SheetHeader.module.css";

type SheetHeaderProps = {
  /** Sheet number in the page's drawing set, e.g. "02". */
  sheet: string;
  /** Total sheets on the page, e.g. "06". */
  of: string;
  eyebrow: string;
  heading: string;
  headingId: string;
  lede?: string;
  tone?: Tone;
  className?: string;
};

/**
 * Section opener drawn like a drawing's title block: a hairline strip with
 * the sheet number on the left and the subject on the right, then the
 * heading and lede. Used by the Why NDR and Culture & Careers pages.
 */
export function SheetHeader({
  sheet,
  of,
  eyebrow,
  heading,
  headingId,
  lede,
  tone = "light",
  className,
}: SheetHeaderProps) {
  return (
    <Reveal className={cx(styles.header, tone === "dark" && styles.dark, className)}>
      <div className={styles.strip}>
        <span className={styles.sheet} aria-hidden="true">
          Sheet <span className={styles.sheetNumber}>{sheet}</span>
          <span className={styles.sheetTotal}> / {of}</span>
        </span>
        <Eyebrow tone={tone} className={styles.eyebrow}>
          {eyebrow}
        </Eyebrow>
      </div>
      <Reveal variant="wipe">
        <Heading variant="section" tone={tone} id={headingId} className={styles.heading}>
          {heading}
        </Heading>
      </Reveal>
      {lede ? (
        <Lede tone={tone} className={styles.lede}>
          {lede}
        </Lede>
      ) : null}
    </Reveal>
  );
}
