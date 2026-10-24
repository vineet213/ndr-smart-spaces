"use client";

import { Container } from "@/components/layout";
import { Button, TextLink } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { whyWaybill } from "@/lib/data/whyNdrPage";
import { cx } from "../ui/cx";
import styles from "./Waybill.module.css";

/* A fixed barcode pattern: bar widths derived from the note number, so the */
/* server and browser always draw the same bars.                           */
const BARS = "19544611954461195446".split("").map((digit, index) => ({
  x: index * 9 + (Number(digit) % 3),
  w: 1 + (Number(digit) % 4),
}));

/**
 * The closing argument as a consignment note: the facts filled in on a
 * printed form, addressed to "your next facility". When the note scrolls
 * into view, a rubber stamp comes down on it.
 */
export function Waybill() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.45 });
  const w = whyWaybill;

  return (
    <section className={styles.section} aria-labelledby="waybill-title">
      <Container>
        <h2 id="waybill-title" className={styles.heading}>
          {w.heading}
        </h2>

        <div ref={ref} className={cx(styles.note, inView && styles.stamped)}>
          <header className={styles.top}>
            <div>
              <p className={styles.formName}>Consignment note</p>
              <p className={styles.number}>No. {w.number}</p>
            </div>
            <svg className={styles.barcode} viewBox="0 0 180 40" aria-hidden="true">
              {BARS.map((bar, index) => (
                <rect key={index} x={bar.x} y="0" width={bar.w} height="40" />
              ))}
            </svg>
          </header>

          <dl className={styles.fields}>
            {w.fields.map((field) => (
              <div key={field.label} className={styles.field}>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
            <div className={cx(styles.field, styles.wide)}>
              <dt>Markets served</dt>
              <dd>{w.markets.join(", ")}</dd>
            </div>
            <div className={cx(styles.field, styles.wide)}>
              <dt>Track record</dt>
              <dd>
                <ul className={styles.firsts}>
                  {w.firsts.map((first) => (
                    <li key={first.year}>
                      <span className={styles.year}>{first.year}</span> {first.title}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <div className={styles.consignee}>
            <p className={styles.consigneeLabel}>Consignee</p>
            <p className={styles.consigneeValue}>{w.consignee}</p>
            <div className={styles.actions}>
              <Button href={w.primaryCta.href}>{w.primaryCta.label}</Button>
              <TextLink href={w.secondaryCta.href}>{w.secondaryCta.label}</TextLink>
            </div>
          </div>

          <div className={styles.stamp} aria-hidden="true">
            <span className={styles.stampRing}>
              <span className={styles.stampTop}>NDR Smart Spaces</span>
              <span className={styles.stampMain}>
                {w.stamp[0]}
                <br />
                {w.stamp[1]}
              </span>
              <span className={styles.stampBottom}>Since 1954</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
