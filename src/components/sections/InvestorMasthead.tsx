import { Container, Section } from "@/components/layout";
import { investorMasthead } from "@/lib/data/investor";
import styles from "./InvestorMasthead.module.css";
import { cx } from "../ui/cx";

type InvestorMastheadProps = {
  title: { before: string; accent?: string; after?: string };
  asOn: string;
  edition: string;
  eyebrow?: string;
  variant?: "cover" | "slim";
  id?: string;
};

export function InvestorMasthead({
  title,
  asOn,
  edition,
  eyebrow,
  variant = "cover",
  id,
}: InvestorMastheadProps) {
  const isCover = variant === "cover";

  return (
    <Section tone="charcoal" ariaLabelledby={id} className={styles.section}>
      <span className={styles.ruleTop} aria-hidden="true" />

      <Container className={styles.inner}>
        {isCover ? (
          <>
            <p className={styles.folio}>
              <span>{investorMasthead.registry}</span>
              <span>{investorMasthead.section}</span>
            </p>
            <div className={styles.hero}>
              <span className={styles.watermark} aria-hidden="true">
                {investorMasthead.watermark}
              </span>
              <h1 id={id} className={styles.title}>
                {title.before}
                {title.accent ? <span className={styles.accent}>{title.accent}</span> : null}
                {title.after}
              </h1>
              <p className={styles.meta}>
                <span>{asOn}</span>
                <span aria-hidden="true">·</span>
                <span>{edition}</span>
              </p>
            </div>
            <span className={styles.rule} aria-hidden="true" />
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
              <p className={styles.meta}>
                <span>{asOn}</span>
                <span aria-hidden="true">·</span>
                <span>{edition}</span>
              </p>
            </div>
            <span className={styles.rule} aria-hidden="true" />
          </>
        )}
      </Container>
    </Section>
  );
}
