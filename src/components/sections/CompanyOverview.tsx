import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Eyebrow, Lede, Body, TextLink, Icon } from "@/components/ui";
import { companyOverview } from "@/lib/data/homepage";
import { JourneyTimeline } from "./JourneyTimeline";
import styles from "./CompanyOverview.module.css";

export function CompanyOverview() {
  return (
    <section className={styles.section} aria-labelledby="company-overview-title">
      <Container>
        <Grid>
          <GridItem span={7}>
            <Stack gap="3xl">
              <Eyebrow>{companyOverview.eyebrow}</Eyebrow>
              <Heading variant="section" id="company-overview-title">
                {companyOverview.heading}
              </Heading>
              <Lede>{companyOverview.lede}</Lede>
              <Body>{companyOverview.body}</Body>
              <div>
                <TextLink href={companyOverview.link.href}>
                  {companyOverview.link.label}
                  <Icon name="arrow-right" size="sm" />
                </TextLink>
              </div>
            </Stack>
          </GridItem>
          <GridItem span={5}>
            <figure className={styles.plate}>
              <blockquote className={styles.quote}>
                “A modest land parcel, a rice mill, and a multi-generational legacy.”
              </blockquote>
              <figcaption className={styles.plateCaption}>
                Mr. Naidu Dasarathi Rami Reddy · Founder, 1954
              </figcaption>
            </figure>
          </GridItem>
        </Grid>
      </Container>
      <JourneyTimeline />
    </section>
  );
}
