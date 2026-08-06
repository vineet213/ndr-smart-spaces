"use client";

import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading, Lede, Metric, SourceFootnote } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { aboutNumbers } from "@/lib/data/about";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import styles from "./KeyNumbers.module.css";
import { cx } from "../ui/cx";

export function KeyNumbers() {
  const { ref, inView } = useInView<HTMLDListElement>({ threshold: 0.2 });

  return (
    <section className={styles.section} aria-labelledby="numbers-title">
      <Container>
        <Stack gap="6xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow tone="dark">{aboutNumbers.eyebrow}</Eyebrow>
              <Heading variant="section" tone="dark" id="numbers-title">
                {aboutNumbers.heading}
              </Heading>
              <Lede tone="dark" className={styles.lede}>
                {aboutNumbers.lede}
              </Lede>
            </Stack>
          </Reveal>

          <dl ref={ref} className={cx(styles.stats, inView && styles.drawn)}>
            {aboutNumbers.stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.label}>{stat.label}</dt>
                <dd className={styles.value}>
                  <Metric variant="hero" tone="dark" as="span">
                    <Counter
                      value={stat.count.value}
                      prefix={stat.count.prefix}
                      suffix={stat.count.suffix}
                      format={stat.count.format}
                    />
                  </Metric>
                </dd>
                <span className={styles.rule} aria-hidden="true" />
                <SourceFootnote tone="dark" className={styles.source}>
                  Source · {stat.source}
                </SourceFootnote>
              </div>
            ))}
          </dl>
        </Stack>
      </Container>
    </section>
  );
}
