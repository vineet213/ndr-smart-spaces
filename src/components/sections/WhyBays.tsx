"use client";

import { useState } from "react";
import { Container } from "@/components/layout";
import { useInView } from "@/hooks/useInView";
import { whyBays } from "@/lib/data/whyNdrPage";
import { cx } from "../ui/cx";
import styles from "./WhyBays.module.css";

/**
 * Five reasons as five loading bays on a dock wall. Each shutter is a button:
 * open it and the proof is waiting inside. One bay is open at a time; when
 * the wall first comes into view, bay 01 lifts a little to show it opens.
 * The proof text is always in the document, so nothing depends on a click.
 */
export function WhyBays() {
  const { bays } = whyBays;
  const [open, setOpen] = useState<string | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 });

  return (
    <section className={styles.section} id="bays" aria-labelledby="bays-title">
      <Container>
        <div className={styles.head}>
          <h2 id="bays-title" className={styles.heading}>
            {whyBays.heading}
          </h2>
          <p className={styles.lede}>{whyBays.lede}</p>
        </div>
      </Container>

      <div ref={ref} className={cx(styles.wall, inView && styles.inView)}>
        <Container>
          <ul className={styles.bays}>
            {bays.map((bay) => {
              const isOpen = open === bay.bay;
              const panelId = `bay-${bay.bay}-inside`;
              return (
                <li key={bay.bay} className={cx(styles.bay, isOpen && styles.open)}>
                  <span className={styles.plate} aria-hidden="true">
                    Bay {bay.bay}
                  </span>

                  <div className={styles.door}>
                    <div className={styles.inside} id={panelId}>
                      <p className={styles.proof}>{bay.proof}</p>
                      <p className={styles.body}>{bay.body}</p>
                    </div>

                    <button
                      type="button"
                      className={styles.shutter}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : bay.bay)}
                    >
                      <span className={styles.title}>{bay.title}</span>
                      <span className={styles.line}>{bay.line}</span>
                      <span className={styles.pull}>
                        {isOpen ? "Close" : "Open"} bay {bay.bay}
                      </span>
                      <span className={styles.lip} aria-hidden="true" />
                    </button>
                  </div>

                  <span className={styles.bumpers} aria-hidden="true" />
                </li>
              );
            })}
          </ul>
        </Container>
        <span className={styles.apron} aria-hidden="true" />
      </div>
    </section>
  );
}
