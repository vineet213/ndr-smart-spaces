import { Container, Section } from "@/components/layout";
import { investorMasthead } from "@/lib/data/investor";
import styles from "./InvestorMasthead.module.css";
import { cx } from "../ui/cx";

type InvestorMastheadProps = {
  title: { before: string; accent?: string; after?: string };
  asOn?: string;
  edition?: string;
  eyebrow?: string;
  subtext?: string;
  variant?: "cover" | "slim";
  id?: string;
};

export function InvestorMasthead({
  title,
  asOn,
  edition,
  eyebrow,
  subtext,
  variant = "cover",
  id,
}: InvestorMastheadProps) {
  const isCover = variant === "cover";
  const showMeta = Boolean(asOn || edition);

  const meta = showMeta ? (
    <p className={styles.meta}>
      {asOn ? <span>{asOn}</span> : null}
      {asOn && edition ? <span aria-hidden="true">·</span> : null}
      {edition ? <span>{edition}</span> : null}
    </p>
  ) : null;

  return (
    <Section tone="charcoal" ariaLabelledby={id} className={styles.section}>
      {isCover ? <span className={styles.ruleTop} aria-hidden="true" /> : null}

      <Container className={styles.inner}>
        {isCover ? (
          <>
            <div className={cx(styles.hero, styles.coverHero)}>
              <span className={styles.watermark} aria-hidden="true">
                {investorMasthead.watermark}
              </span>
              <h1 id={id} className={styles.title}>
                {title.before}
                {title.accent ? <span className={styles.accent}>{title.accent}</span> : null}
                {title.after}
              </h1>
              {meta}
            </div>
            <span className={cx(styles.rule, styles.coverRule)} aria-hidden="true" />
          </>
        ) : (
          <>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            <div className={styles.hero}>
              <span className={styles.watermark} aria-hidden="true">
                {investorMasthead.watermark}
              </span>
              <h1 id={id} className={cx(styles.title, styles.slimTitle)}>
                {title.before}
                {title.accent ? <span className={styles.accent}>{title.accent}</span> : null}
                {title.after}
              </h1>
              {subtext ? <p className={styles.subtext}>{subtext}</p> : null}
              {meta}
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}
