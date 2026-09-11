import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading, Lede, Metric, SourceFootnote } from "@/components/ui";
import { aboutHero } from "@/lib/data/about";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import styles from "./AboutHero.module.css";
import { cx } from "../ui/cx";

export function AboutHero() {
  return (
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <Container className={styles.content}>
        <Stack gap="6xl">
          <Stack gap="4xl">
            <Eyebrow>{aboutHero.eyebrow}</Eyebrow>
            <div className={styles.headlineBlock}>
              <span className={styles.goldRule} aria-hidden="true" />
              <Heading variant="hero" id="about-hero-title" className={styles.headline}>
                {aboutHero.headline}
                <span className={styles.accent}>{aboutHero.headlineAccent}</span>
              </Heading>
            </div>
            <Lede className={styles.lede}>{aboutHero.lede}</Lede>
          </Stack>

          <Reveal delay={1}>
            <dl className={styles.ledger}>
              {aboutHero.stats.map((stat) => (
                <div key={stat.label} className={styles.ledgerRow}>
                  <dt className={cx("text-label-meta", styles.ledgerLabel)}>{stat.label}</dt>
                  <dd className={styles.ledgerValue}>
                    <Metric variant="hero">
                      {stat.count ? (
                        <Counter
                          value={stat.count.value}
                          prefix={stat.count.prefix}
                          suffix={stat.count.suffix}
                          format={stat.count.format}
                        />
                      ) : (
                        stat.metric
                      )}
                    </Metric>
                  </dd>
                  {stat.source ? (
                    <SourceFootnote className={styles.ledgerSource}>{stat.source}</SourceFootnote>
                  ) : null}
                </div>
              ))}
            </dl>
          </Reveal>
        </Stack>
      </Container>
    </section>
  );
}
