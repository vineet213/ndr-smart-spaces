import { ExternalLink, Icon, SourceFootnote, TextLink } from "@/components/ui";
import type { Division } from "@/lib/data/business";
import styles from "./DivisionPlate.module.css";

type DivisionPlateProps = {
  division: Division;
};

export function DivisionPlate({ division }: DivisionPlateProps) {
  const external = division.route.external ?? false;

  return (
    <article className={styles.plate}>
      <div className={styles.rule} aria-hidden="true">
        <span className={styles.ruleCode}>DIV.{division.index}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.numeral} aria-hidden="true">
          {division.index}
        </div>

        <div className={styles.content}>
          <div className={styles.identity}>
            <h3 className={styles.name}>{division.title}</h3>
            <span className={styles.tag}>{division.route.label}</span>
          </div>

          <p className={styles.writeup}>{division.writeup}</p>

          <dl className={styles.spec}>
            {division.spec.map((row) => (
              <div key={row.label} className={styles.specRow}>
                <dt className={styles.specLabel}>{row.label}</dt>
                <dd className={styles.specValue}>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.footer}>
            <p className={styles.proof}>
              <span className={styles.proofLabel}>Proof</span>
              <span className={styles.proofText}> {division.proof}</span>
              <span className={styles.proofSource}> — {division.proofSource}</span>
            </p>
            {external ? (
              <ExternalLink href={division.route.href}>{division.route.label}</ExternalLink>
            ) : (
              <TextLink href={division.route.href}>
                {division.route.label}
                <Icon name="arrow-right" size="sm" />
              </TextLink>
            )}
          </div>

          <SourceFootnote className={styles.source}>{division.source}</SourceFootnote>
        </div>
      </div>
    </article>
  );
}
