import Image from "next/image";
import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Eyebrow, Heading, Body } from "@/components/ui";
import { aboutStory } from "@/lib/data/about";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./OurStory.module.css";

export function OurStory() {
  return (
    <section className={styles.section} id="story" aria-labelledby="story-title">
      <Container>
        <Grid>
          <GridItem span={7}>
            <Stack gap="4xl">
              <Reveal>
                <Stack gap="xl">
                  <span className={styles.goldRule} aria-hidden="true" />
                  <Eyebrow>{aboutStory.eyebrow}</Eyebrow>
                  <Heading variant="section" id="story-title">
                    {aboutStory.heading}
                  </Heading>
                </Stack>
              </Reveal>
              <Stack gap="lg">
                {aboutStory.paragraphs.map((paragraph, index) => (
                  <Reveal key={index} delay={(index + 1) as RevealDelay}>
                    <Body className={styles.paragraph}>{paragraph}</Body>
                  </Reveal>
                ))}
              </Stack>
            </Stack>
          </GridItem>
          <GridItem span={5} className={styles.plateColumn}>
            <Reveal delay={2} className={styles.plateReveal}>
              <figure className={styles.figure}>
                <div className={styles.plate}>
                  <Image
                    src={aboutStory.image.src}
                    alt={aboutStory.image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 40vw"
                    className={styles.plateImage}
                  />
                </div>
                <figcaption className={styles.caption}>{aboutStory.image.caption}</figcaption>
              </figure>
            </Reveal>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
