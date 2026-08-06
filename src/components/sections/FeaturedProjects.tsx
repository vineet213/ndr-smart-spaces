import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Eyebrow, Body, TextLink, Icon } from "@/components/ui";
import { featuredProjects } from "@/lib/data/homepage";
import { ArchitecturalField } from "./ArchitecturalField";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import styles from "./FeaturedProjects.module.css";
import { cx } from "../ui/cx";

function FactValue({
  value,
  unit,
  format,
}: {
  value: number | string;
  unit: string;
  format?: boolean;
}) {
  if (typeof value === "number") {
    return <Counter value={value} suffix={unit ? ` ${unit}` : ""} format={format} />;
  }
  return (
    <>
      {value}
      {unit ? ` ${unit}` : ""}
    </>
  );
}

export function FeaturedProjects() {
  const { primary, secondary } = featuredProjects;

  return (
    <section className={styles.section} aria-labelledby="featured-projects-title">
      <Container>
        <Stack gap="8xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow>{featuredProjects.eyebrow}</Eyebrow>
              <Heading variant="section" id="featured-projects-title">
                {featuredProjects.heading}
              </Heading>
            </Stack>
          </Reveal>

          <Reveal>
            <Grid className={styles.primaryGrid}>
              <GridItem span={5} className={styles.primaryContent}>
                <Stack gap="3xl">
                  <Eyebrow className={styles.projectEyebrow}>
                    <span className={styles.eyebrowBar} aria-hidden="true" />
                    {primary.eyebrow}
                  </Eyebrow>
                  <Heading variant="sub" as="h3" className={styles.projectTitle}>
                    {primary.title}
                  </Heading>
                  <Body>{primary.narrative}</Body>
                  <ul className={styles.factGrid}>
                    {primary.facts.map((fact) => (
                      <li key={fact.label} className={styles.factCell}>
                        <span className={styles.factValue}>
                          <FactValue value={fact.value} unit={fact.unit} format={fact.format} />
                        </span>
                        <span className={cx("text-label-meta", styles.factLabel)}>
                          {fact.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <TextLink href={primary.link.href}>
                      {primary.link.label}
                      <Icon name="arrow-right" size="sm" />
                    </TextLink>
                  </div>
                </Stack>
              </GridItem>
              <GridItem span={7} className={styles.primaryMedia}>
                <div className={styles.mediaPrimary}>
                  <div className={styles.zoom}>
                    <ArchitecturalField />
                  </div>
                </div>
              </GridItem>
            </Grid>
          </Reveal>

          <Reveal delay={1}>
            <div className={styles.compact}>
              <Grid>
                <GridItem span={4} className={styles.compactMedia}>
                  <div className={styles.mediaCompact}>
                    <div className={styles.zoom}>
                      <ArchitecturalField />
                    </div>
                  </div>
                </GridItem>
                <GridItem span={8} className={styles.compactContent}>
                  <Stack gap="xl">
                    <Eyebrow className={styles.projectEyebrow}>
                      <span className={styles.eyebrowBar} aria-hidden="true" />
                      {secondary.eyebrow}
                    </Eyebrow>
                    <Heading variant="sub" as="h3" className={styles.compactTitle}>
                      {secondary.title}
                    </Heading>
                    <Body>{secondary.narrative}</Body>
                    <div>
                      <TextLink href={secondary.link.href}>
                        {secondary.link.label}
                        <Icon name="arrow-right" size="sm" />
                      </TextLink>
                    </div>
                  </Stack>
                </GridItem>
              </Grid>
            </div>
          </Reveal>
        </Stack>
      </Container>
    </section>
  );
}
