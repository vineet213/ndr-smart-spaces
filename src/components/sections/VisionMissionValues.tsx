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
                    {"values" in column ? (
                      <ul className={styles.values}>
                        {column.values.map((value) => (
                          <li key={value.name} className={styles.valueRow}>
                            <span className={styles.valueName}>{value.name}</span>
                            <span className={styles.valueLine}>{value.line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.body}>{column.body}</p>
                    )}
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
