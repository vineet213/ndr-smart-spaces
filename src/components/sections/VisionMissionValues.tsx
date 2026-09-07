import Image from "next/image";
import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Eyebrow, Heading, Lede } from "@/components/ui";
import { aboutPrinciples } from "@/lib/data/about";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./VisionMissionValues.module.css";

export function VisionMissionValues() {
  return (
    <section className={styles.section} aria-labelledby="principles-title">
      <Container>
        <Stack gap="6xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow>{aboutPrinciples.eyebrow}</Eyebrow>
              <Heading variant="section" id="principles-title">
                {aboutPrinciples.heading}
              </Heading>
              <Lede className={styles.lede}>{aboutPrinciples.lede}</Lede>
            </Stack>
          </Reveal>

          <Grid>
            {aboutPrinciples.columns.map((column, index) => (
              <GridItem key={column.title} span={4}>
                <Reveal delay={(index + 1) as RevealDelay}>
                  <article className={styles.column}>
                    <span className={styles.rule} aria-hidden="true" />
                    <span className={styles.index} aria-hidden="true">
                      {column.index}
                    </span>
                    <h3 className={styles.title}>{column.title}</h3>
                    <p className={styles.body}>{column.body}</p>
                  </article>
                </Reveal>
              </GridItem>
            ))}
            <GridItem span={4}>
              <Reveal delay={3 as RevealDelay}>
                <figure className={styles.imageSlot}>
                  {aboutPrinciples.image.src ? (
                    <Image
                      src={aboutPrinciples.image.src}
                      alt={aboutPrinciples.image.alt}
                      fill
                      sizes="(max-width: 1023px) 100vw, 33vw"
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} aria-hidden="true" />
                  )}
                  <figcaption className={styles.imageCaption}>
                    {aboutPrinciples.image.caption}
                  </figcaption>
                </figure>
              </Reveal>
            </GridItem>
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}
