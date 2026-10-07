"use client";

import type { CSSProperties } from "react";
import { FadeImage as Image } from "@/components/ui/FadeImage";
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

const glyphStyle = {
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * Restrained line-art marks for the cards without a site photograph yet —
 * same stroke treatment as the "From Land to Community" stage marks
 * (AveAcresProcess), so a placeholder reads as a deliberate editorial choice
 * rather than a missing asset.
 */
function PlaceholderMark({ index }: { index: string }) {
  switch (index) {
    // 01 — Solar Panel Installation: a panel grid under a sun.
    case "01":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <circle cx="40" cy="14" r="5" />
          <path d="M40 4v3M48 6l-2 2M31 14h3M40 24v-3M31 6l2 2" />
          <rect x="6" y="22" width="34" height="24" rx="1" />
          <path d="M6 30h34M6 38h34M17 22v24M28 22v24" />
        </svg>
      );
    // 02 — Rainwater Harvesting: raindrops into a storage tank.
    case "02":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <path d="M20 6c0 5-6 9-6 15a6 6 0 0 0 12 0c0-6-6-10-6-15Z" />
          <path d="M36 16c0 3.5-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6.5-4-10Z" />
          <rect x="10" y="34" width="30" height="16" rx="2" />
          <path d="M10 41h30" />
        </svg>
      );
    // 03 — EV Charging Stations: a charging plug.
    case "03":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <rect x="14" y="10" width="20" height="28" rx="3" />
          <path d="M22 4v6M30 4v6" />
          <path d="M28 22h5l-7 12 2-8h-5l5-10" />
          <path d="M14 46h20" />
        </svg>
      );
    // 05 — Waste Management: a bin under a recycling loop.
    case "05":
      return (
        <svg {...glyphStyle} aria-hidden="true" focusable="false">
          <path d="M14 18h20l-2 26a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3L14 18Z" />
          <path d="M10 18h28M20 18l1.5-5h5L28 18" />
          <path d="M19 24v15M24.5 24v15M30 24v15" />
        </svg>
      );
    default:
      return null;
  }
}

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
};

function FeatureCard({ feature, order, total }: FeatureCardProps) {
  const colorClass = CARD_COLORS[order % CARD_COLORS.length];
  const side = SIDES[order % 2];
  const position =
    order === 0
      ? CARD_POSITION.first
      : order === total - 1
        ? CARD_POSITION.last
        : CARD_POSITION.middle;
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

        <figure className={cx(styles.photoCol, !feature.image && styles.photoPlaceholder)}>
          {feature.image ? (
            <Image
              src={feature.image.src}
              alt={feature.image.alt}
              fill
              sizes="(min-width: 1024px) 31rem, 100vw"
              className={styles.image}
            />
          ) : (
            <span className={styles.placeholderGlyph}>
              <PlaceholderMark index={feature.index} />
            </span>
          )}
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
              <FeatureCard key={feature.index} feature={feature} order={index} total={total} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
