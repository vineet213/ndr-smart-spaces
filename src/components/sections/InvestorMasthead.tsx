import { Container } from "@/components/layout";
import { investorMasthead } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
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
    <section className={styles.section} aria-labelledby={id}>
      <Container>
        {isCover ? (
          <Reveal>
            <p className={styles.folio}>
              <span>{investorMasthead.registry}</span>
              <span>{investorMasthead.section}</span>
            </p>
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
            <span className={styles.rule} aria-hidden="true" />
          </Reveal>
        ) : (
          <Reveal>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
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
          </Reveal>
        )}
      </Container>
    </section>
  );
}
