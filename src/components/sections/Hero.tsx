"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import { Lede, Button } from "@/components/ui";
import { hero } from "@/lib/data/homepage";
import { ArchitecturalField } from "./ArchitecturalField";
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
      </div>

      <Container as="div" className={styles.typeContainer}>
        <div className={styles.typeBlock}>
          <h1 id="hero-title" className={styles.screenReaderTitle}>
            {hero.headline}
          </h1>
          <div className={styles.lockup}>
            <Image
              src="/logos/ndr-smart-spaces-logo.svg"
              alt="NDR Smart Spaces"
              width={314}
              height={72}
              priority
              className={styles.lockupImage}
            />
          </div>
          <Lede tone="dark" className={styles.subhead}>
            {hero.subhead}
          </Lede>
          {hero.primaryCta ? (
            <div className={styles.ctas}>
              <Button tone="dark" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </Button>
            </div>
          ) : null}
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
