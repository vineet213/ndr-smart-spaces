"use client";

import { Container } from "@/components/layout";
import { Button, SourceFootnote } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { businessClosing } from "@/lib/data/business";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./BusinessClosing.module.css";

export function BusinessClosing() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className={styles.section}>
      <Container>
        <Reveal>
          <div ref={ref} className={cx(styles.stage, inView && styles.drawn)}>
            <div className={styles.plate}>
              <p className={styles.line}>{businessClosing.line}</p>
              <div className={styles.routes}>
                <Button href={businessClosing.enquiry.href}>{businessClosing.enquiry.label}</Button>
                <span className={styles.portfolio} aria-disabled="true">
                  {businessClosing.portfolio.label}
                </span>
              </div>
              <SourceFootnote className={styles.portfolioNote}>
                {businessClosing.portfolio.note}
              </SourceFootnote>
            </div>

            <div className={styles.colophon} aria-hidden="true">
              <span className={styles.endRule} />
              <span className={styles.diamond} />
              <span className={styles.endRule} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
