"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import { Heading, Lede } from "@/components/ui";
import { esgGreenFeatures } from "@/lib/data/esg";
import type { EsgGreenFeature } from "@/lib/data/esg";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import styles from "./EsgGreenFeatures.module.css";

/* Six curated, on-brand tones (deep/muted, not neon) cycling per card. */
const CARD_COLORS = [
  styles.colorMaroon,
  styles.colorBronze,
  styles.colorTeal,
  styles.colorPlum,
  styles.colorTerracotta,
  styles.colorForest,
] as const;

const SIDES = [styles.sideLeft, styles.sideRight] as const;

/* Each card owns a slice of the track's scroll timeline, sliced with a
 * deliberate overlap between neighbours so the outgoing card is still
 * blurring out while the incoming one is sharpening in — a true cross-fade,
 * not a hard cut. The first and last cards use their own keyframe (already
 * sharp at rest / staying sharp at rest) since there's nothing before the
 * first or after the last to cross-fade against. */
const CARD_POSITION = {
  first: styles.cardFirst,
  middle: styles.cardMiddle,
  last: styles.cardLast,
} as const;

const SLICE_RANGES = [
  ["0%", "20%"],
  ["14%", "36%"],
  ["30%", "52%"],
  ["46%", "68%"],
  ["62%", "84%"],
  ["78%", "100%"],
] as const;

type FeatureCardProps = {
  feature: EsgGreenFeature;
  order: number;
  total: number;
  priority: boolean;
};

function FeatureCard({ feature, order, total, priority }: FeatureCardProps) {
  const colorClass = CARD_COLORS[order % CARD_COLORS.length];
  const side = SIDES[order % 2];
  const position = order === 0 ? CARD_POSITION.first : order === total - 1 ? CARD_POSITION.last : CARD_POSITION.middle;
  const [rangeStart, rangeEnd] = SLICE_RANGES[order] ?? ["0%", "100%"];

  return (
    <article
      className={cx(styles.card, colorClass, position)}
      style={{ "--card-range-start": rangeStart, "--card-range-end": rangeEnd } as CSSProperties}
    >
      <div className={cx(styles.row, side)}>
        <div className={styles.textCol}>
          <span className={styles.ghostIndex} aria-hidden="true">
            {feature.index}
          </span>
          <Heading variant="sub" as="h3" className={styles.title}>
            {feature.title}
          </Heading>
          <p className={styles.body}>{feature.body}</p>
        </div>

        <figure className={styles.photoCol}>
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            fill
            sizes="(min-width: 1024px) 31rem, 100vw"
            className={styles.image}
            priority={priority}
            unoptimized
          />
        </figure>
      </div>
    </article>
  );
}

export function EsgGreenFeatures() {
  const total = esgGreenFeatures.features.length;

  return (
    <section className={styles.section} id="in-practice" aria-labelledby="esg-in-practice-title">
      <Container>
        <Reveal>
          <header className={styles.header}>
            <Heading variant="section" id="esg-in-practice-title" className={styles.heading}>
              {esgGreenFeatures.heading}
            </Heading>
            <Lede className={styles.lede}>{esgGreenFeatures.lede}</Lede>
          </header>
        </Reveal>

        <div className={styles.stackTrack}>
          <div className={styles.stackBox}>
            {esgGreenFeatures.features.map((feature, index) => (
              <FeatureCard key={feature.index} feature={feature} order={index} total={total} priority={index === 0} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
