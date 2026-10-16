import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Eyebrow, Heading, Body } from "@/components/ui";
import { aboutStory } from "@/lib/data/about";
import { Reveal, type RevealDelay } from "./Reveal";
import { cx } from "../ui/cx";
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
                  <Reveal variant="wipe">
                    <Heading variant="section" id="story-title">
                      {aboutStory.heading}
                    </Heading>
                  </Reveal>
                </Stack>
              </Reveal>
              <Stack gap="lg">
                {aboutStory.paragraphs.map((paragraph, index) => (
                  <Reveal key={index} delay={(index + 1) as RevealDelay}>
                    <Body className={cx(styles.paragraph, index === 0 && styles.lead)}>
                      {paragraph}
                    </Body>
                  </Reveal>
                ))}
              </Stack>
            </Stack>
          </GridItem>
          <GridItem span={5} className={styles.plateColumn}>
            <figure className={styles.figure}>
              <div className={styles.plateWrap}>
                <span className={styles.plateFrame} aria-hidden="true" />
                <Reveal variant="unmask" className={styles.plateReveal}>
                  <div className={styles.plate}>
                    <Image
                      src={aboutStory.image.src}
                      alt={aboutStory.image.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 40vw"
                      loading="eager"
                      className={styles.plateImage}
                    />
                  </div>
                </Reveal>
                <span className={styles.chip} aria-hidden="true">
                  <span className={styles.chipLabel}>Est.</span>
                  <span className={styles.chipValue}>1979</span>
                </span>
              </div>
              <figcaption className={styles.caption}>{aboutStory.image.caption}</figcaption>
            </figure>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
