import { Container } from "@/components/layout";
import { SourceFootnote, TextLink } from "@/components/ui";
import { mediaFeatured, MEDIA_STATUS_LABELS } from "@/lib/data/media";
import { MediaDocHeader } from "./MediaDocHeader";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./FeaturedPublication.module.css";

export function FeaturedPublication() {
  const active = mediaFeatured.status === "published";
  return (
    <section
      className={styles.section}
      id="featured-publication"
      aria-labelledby="featured-publication-title"
    >
      <Container>
        <Reveal>
          <MediaDocHeader numeral="02" code="REF 02 · FEATURED" />
          <article className={styles.spread}>
            <header className={styles.spreadHead}>
              <span className={styles.spreadPublication}>
                {mediaFeatured.publication} · {mediaFeatured.issue}
              </span>
              <span className={styles.spreadArchive}>Archive {mediaFeatured.archiveCode}</span>
            </header>

            <div className={styles.kicker}>
              <span className={styles.kickerType}>{mediaFeatured.category}</span>
              <span className={styles.kickerMeta}>{mediaFeatured.date}</span>
              <span
                className={cx(styles.status, active ? styles.statusActive : styles.statusPending)}
              >
                <span className={styles.statusGlyph} aria-hidden="true">
                  {active ? "●" : "—"}
                </span>
                {MEDIA_STATUS_LABELS[mediaFeatured.status]}
              </span>
            </div>

            <h2 id="featured-publication-title" className={styles.heading}>
              {mediaFeatured.title}
            </h2>
            <p className={styles.statement}>{mediaFeatured.statement}</p>

            <blockquote className={styles.pull}>{mediaFeatured.excerpt}</blockquote>

            <dl className={styles.record}>
              {mediaFeatured.record.map((item) => (
                <div key={item.label} className={styles.recordCell}>
                  <dt className={styles.recordLabel}>{item.label}</dt>
                  <dd className={styles.recordValue}>{item.value}</dd>
                </div>
              ))}
            </dl>

            <footer className={styles.footer}>
              <SourceFootnote className={styles.source}>{mediaFeatured.source}</SourceFootnote>
              <TextLink
                href={mediaFeatured.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(styles.link)}
              >
                Read at the InvIT
              </TextLink>
            </footer>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
