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
      <div className={styles.body}>
        <div className={styles.numeral} aria-hidden="true">
          {division.index}
        </div>
        <div className={styles.middle}>
          <h3 className={styles.name}>{division.title}</h3>
          <p className={styles.writeup}>{division.writeup}</p>
        </div>
        <dl className={styles.spec}>
          {division.spec.map((row) => (
            <div key={row.label} className={styles.specRow}>
              <dt className={styles.specLabel}>{row.label}</dt>
              <dd className={styles.specValue}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={styles.footer}>
        <p className={styles.proof}>
          <span className={styles.proofLabel}>Proof · </span>
          {division.proof}
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
    </article>
  );
}
