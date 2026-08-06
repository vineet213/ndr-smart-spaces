"use client";

import { useInView } from "@/hooks/useInView";
import { journey } from "@/lib/data/homepage";
import styles from "./JourneyTimeline.module.css";
import { cx } from "../ui/cx";

export function JourneyTimeline() {
  const { ref, inView } = useInView<HTMLOListElement>({ threshold: 0.3 });

  return (
    <div className={styles.band} id="journey">
      <div className="container">
        <ol ref={ref} className={cx(styles.journey, inView && styles.drawn)}>
          {journey.map((node) => (
            <li key={node.year} className={styles.item}>
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.year}>{node.year}</span>
              <span className={styles.title}>{node.title}</span>
              <span className={styles.caption}>{node.caption}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
