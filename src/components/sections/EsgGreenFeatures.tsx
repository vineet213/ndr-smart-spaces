"use client";

import Image from "next/image";
import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Lede } from "@/components/ui";
import { esgGreenFeatures } from "@/lib/data/esg";
import type { EsgGreenFeature } from "@/lib/data/esg";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import styles from "./EsgGreenFeatures.module.css";

type FeatureRowProps = {
  feature: EsgGreenFeature;
  fromLeft: boolean;
  priority: boolean;
};

function FeatureRow({ feature, fromLeft, priority }: FeatureRowProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -12% 0px" });

  const photo = (
    <div className={styles.photoColumn}>
      <figure className={styles.photo}>
        <Image
          src={feature.image.src}
          alt={feature.image.alt}
          fill
          sizes="(min-width: 1024px) 420px, 90vw"
          className={styles.image}
          priority={priority}
          unoptimized
        />
      </figure>
    </div>
  );

  const text = (
    <Stack gap="md" className={cx(styles.textColumn, styles.text)}>
      <span className={styles.index}>{feature.index}</span>
      <Heading variant="sub" as="h3" className={styles.title}>
        {feature.title}
      </Heading>
      <p className={styles.body}>{feature.body}</p>
    </Stack>
  );

  return (
    <div
      ref={ref}
      className={cx(styles.row, fromLeft ? styles.fromLeft : styles.fromRight, inView && styles.isInView)}
    >
      <Grid className={styles.grid}>
        {fromLeft ? (
          <>
            <GridItem span={5}>{photo}</GridItem>
            <GridItem span={7}>{text}</GridItem>
          </>
        ) : (
          <>
            <GridItem span={7}>{text}</GridItem>
            <GridItem span={5}>{photo}</GridItem>
          </>
        )}
      </Grid>
    </div>
  );
}

export function EsgGreenFeatures() {
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

        <div className={styles.rows}>
          {esgGreenFeatures.features.map((feature, index) => (
            <FeatureRow
              key={feature.index}
              feature={feature}
              fromLeft={index % 2 === 0}
              priority={index === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
