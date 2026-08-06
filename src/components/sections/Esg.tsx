import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Eyebrow, Heading, Lede, TextLink, Icon } from "@/components/ui";
import { esg } from "@/lib/data/homepage";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./Esg.module.css";

export function Esg() {
  if (!esg) return null;

  return (
    <section className={styles.section} aria-labelledby="esg-title">
      <Container>
        <Grid>
          <GridItem span={4}>
            <Stack gap="3xl">
              <Reveal>
                <Stack gap="xl">
                  <span className={styles.goldRule} aria-hidden="true" />
                  <Eyebrow>{esg.eyebrow}</Eyebrow>
                  <Heading variant="section" id="esg-title">
                    {esg.heading}
                  </Heading>
                  <Lede>{esg.lede}</Lede>
                  <TextLink href={esg.link.href}>
                    {esg.link.label}
                    <Icon name="arrow-right" size="sm" />
                  </TextLink>
                </Stack>
              </Reveal>
            </Stack>
          </GridItem>
          <GridItem span={8}>
            <ul className={styles.pillars}>
              {esg.pillars.map((pillar, index) => (
                <li key={pillar.index}>
                  <Reveal delay={(index + 1) as RevealDelay}>
                    <div className={styles.pillar}>
                      <span className={styles.pillarIndex} aria-hidden="true">
                        {pillar.index}
                      </span>
                      <div className={styles.pillarBody}>
                        <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                        <p className={styles.pillarText}>{pillar.body}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
