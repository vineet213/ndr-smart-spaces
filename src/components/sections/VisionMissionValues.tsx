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
        <Stack gap="7xl">
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
              <GridItem key={column.title} span={6}>
                <Reveal delay={(index + 1) as RevealDelay}>
                  <article className={styles.panel} aria-label={column.title}>
                    <Image
                      src={column.image.src}
                      alt={column.image.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className={styles.image}
                      unoptimized
                    />
                    <div className={styles.scrim} aria-hidden="true" />
                    <div className={styles.content}>
                      <Eyebrow tone="dark" as="span" className={styles.index}>
                        {column.index}
                      </Eyebrow>
                      <h3 className={styles.title}>{column.title}</h3>
                      <span className={styles.titleRule} aria-hidden="true" />
                      <p className={styles.body}>{column.body}</p>
                      <span className={styles.cue} aria-hidden="true">
                        <svg
                          width="34"
                          height="28"
                          viewBox="0 0 34 28"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 27 L29 2 M22 2 H29 V9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Reveal>
              </GridItem>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}
