import { Container } from "@/components/layout";
import { Button, SourceFootnote } from "@/components/ui";
import { businessClosing } from "@/lib/data/business";
import { Reveal } from "./Reveal";
import styles from "./BusinessClosing.module.css";

export function BusinessClosing() {
  return (
    <section className={styles.section}>
      <Container>
        <Reveal>
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
        </Reveal>
      </Container>
    </section>
  );
}
