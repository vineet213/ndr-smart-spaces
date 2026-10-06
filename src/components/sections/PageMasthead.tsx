import { Container } from "@/components/layout";
import { cx } from "../ui/cx";
import styles from "./PageMasthead.module.css";

export type MastheadTitle = { before: string; accent?: string; after?: string };

type PageMastheadProps = {
  id: string;
  title: MastheadTitle;
  subtext?: string;
};

/* The ESG masthead's scale is the default. Only titles/subtexts too long to   */
/* fit one screen at that scale step down — just far enough to fit.           */
function titleSize(length: number): string {
  if (length <= 36) return styles.titleXl;
  if (length <= 48) return styles.titleLg;
  return styles.titleMd;
}

function subtextSize(length: number): string {
  return length <= 150 ? styles.subtextLg : styles.subtextMd;
}

/**
 * The single masthead every text-led page renders through: exactly one screen
 * tall below the header, content centred so there's no dead band above or
 * below it.
 */
export function PageMasthead({ id, title, subtext }: PageMastheadProps) {
  const titleLength = `${title.before}${title.accent ?? ""}${title.after ?? ""}`.length;

  return (
    <section className={styles.masthead} aria-labelledby={id}>
      <span className={styles.ruleTop} aria-hidden="true" />

      <Container className={styles.hero}>
        <h1 id={id} className={cx(styles.title, titleSize(titleLength))}>
          {title.before}
          {title.accent ? <span className={styles.accent}>{title.accent}</span> : null}
          {title.after}
        </h1>
        {subtext ? (
          <p className={cx(styles.subtext, subtextSize(subtext.length))}>{subtext}</p>
        ) : null}
      </Container>

      <span className={styles.rule} aria-hidden="true" />
    </section>
  );
}
