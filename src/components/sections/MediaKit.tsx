import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { mediaKit } from "@/lib/data/media";
import { MediaDocHeader } from "./MediaDocHeader";
import { Reveal, type RevealDelay } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./MediaKit.module.css";

export function MediaKit() {
  return (
    <section className={styles.section} id="media-kit" aria-labelledby="media-kit-title">
      <Container>
        <Reveal>
          <MediaDocHeader numeral="04" code="REF 04 · MEDIA KIT" />
          <Eyebrow className={styles.eyebrow}>{mediaKit.eyebrow}</Eyebrow>
          <Heading variant="section" id="media-kit-title" className={styles.heading}>
            {mediaKit.heading}
          </Heading>
          <Lede className={styles.lede}>{mediaKit.lede}</Lede>
        </Reveal>

        <div className={styles.registerIndex}>
          <span className={styles.registerCode}>{mediaKit.registerCode}</span>
          <span className={styles.registerMeta}>Assets · {mediaKit.items.length}</span>
        </div>

        <ol className={styles.items}>
          {mediaKit.items.map((item, index) => (
            <Reveal
              key={item.ref}
              as="li"
              delay={(index % 3) as RevealDelay}
              className={styles.item}
            >
              <span className={styles.itemRef}>{item.ref}</span>
              <div className={styles.itemBody}>
                <h3 className={styles.itemLabel}>{item.label}</h3>
                <p className={styles.itemNote}>{item.note}</p>
              </div>
              <span className={styles.itemClass}>{item.classification}</span>
              <span className={styles.itemRevision}>{item.revision}</span>
              <span className={styles.itemFormat}>{item.format}</span>
              <span
                className={cx(
                  styles.itemStatus,
                  item.status === "available" ? styles.itemAvailable : styles.itemPending,
                )}
              >
                {item.status === "available" ? "Available" : "In preparation"}
              </span>
            </Reveal>
          ))}
        </ol>

        <SourceFootnote className={styles.note}>{mediaKit.note}</SourceFootnote>
      </Container>
    </section>
  );
}
