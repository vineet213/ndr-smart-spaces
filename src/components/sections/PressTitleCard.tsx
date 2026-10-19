import type { PressArchiveEntry } from "@/lib/data/media";
import { cx } from "../ui/cx";
import styles from "./PressArchive.module.css";

/* Stands in for coverage that has no clipping or capture on file: the outlet, */
/* date and headline set as a typographic card on paper. It is a citation in   */
/* the site's own type, not an imitation of the publication's page.           */
export function PressTitleCard({
  entry,
  large = false,
}: {
  entry: PressArchiveEntry;
  large?: boolean;
}) {
  return (
    <div className={cx(styles.titleCard, large && styles.titleCardLarge)}>
      <span className={styles.titleCardOutlet}>{entry.publication ?? entry.ref}</span>
      <span className={styles.titleCardRule} aria-hidden="true" />
      <span className={styles.titleCardHeadline}>{entry.title}</span>{" "}
      <span className={styles.titleCardDate}>{entry.date}</span>
    </div>
  );
}
