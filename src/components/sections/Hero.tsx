"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import { Heading, Eyebrow, Lede, Metric, SourceFootnote, Button } from "@/components/ui";
import { hero } from "@/lib/data/homepage";
import { ArchitecturalField } from "./ArchitecturalField";
import { Counter } from "./Counter";
import styles from "./Hero.module.css";
import { cx } from "../ui/cx";

export function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.08);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        {hero.image ? (
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            className={styles.mediaImage}
            width={1600}
            height={900}
            priority
            sizes="100vw"
          />
        ) : (
          <ArchitecturalField className={styles.mediaField} />
        )}
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <Container as="div" className={styles.typeContainer}>
        <Eyebrow tone="dark" as="p" className={styles.masthead}>
          {hero.eyebrow}
        </Eyebrow>
        <div className={styles.typeBlock}>
          <Heading variant="hero" tone="dark" id="hero-title" className={styles.headline}>
            {hero.headline}
          </Heading>
          <Lede tone="dark" className={styles.subhead}>
            {hero.subhead}
          </Lede>
          <div className={styles.ctas}>
            <Button tone="dark" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </Button>
            <Button variant="secondary" tone="dark" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Container>

      <Container as="div" className={styles.statContainer}>
        <div className={styles.statBand} role="region" aria-label="Key figures" aria-live="polite">
          {hero.stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <Metric variant="hero">
                <Counter value={stat.value} suffix={stat.suffix} />
              </Metric>
              <p className={cx("text-label-meta", styles.statLabel)}>{stat.label}</p>
            </div>
          ))}
          <p className={cx("text-small", styles.statSource)}>{hero.statsSource}</p>
        </div>
      </Container>

      <div className={cx(styles.scrollCue, scrolled && styles.scrollCueHidden)} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
