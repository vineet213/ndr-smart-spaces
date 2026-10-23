import { Container } from "@/components/layout";
import styles from "./MediaPlaceholder.module.css";

/**
 * A marked slot for media the client has yet to supply: a framed 16:9 plate
 * carrying a short note in place of the video or image.
 */
export function MediaPlaceholder({ note }: { note: string }) {
  return (
    <section className={styles.section} aria-label={note}>
      <Container>
        <div className={styles.plate}>
          <p className={styles.note}>{note}</p>
        </div>
      </Container>
    </section>
  );
}
