import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Body, Eyebrow, TextLink, Icon } from "@/components/ui";
import { companyOverview } from "@/lib/data/homepage";
import { OverviewMedia } from "./OverviewMedia";
import { Reveal } from "./Reveal";
import styles from "./CompanyOverview.module.css";

export function CompanyOverview() {
  return (
    <section className={styles.section} aria-labelledby="company-overview-title">
      <Container className={styles.content}>
        <Grid className={styles.grid}>
          <GridItem span={5} className={styles.mediaColumn}>
            <OverviewMedia src={companyOverview.image.src} alt={companyOverview.image.alt} />
          </GridItem>
          <GridItem span={7}>
            <Stack gap="4xl">
              <Stack gap="3xl">
                <Eyebrow>{companyOverview.eyebrow}</Eyebrow>
                <Reveal variant="wipe">
                  <Heading variant="section" id="company-overview-title">
                    {companyOverview.heading}
                  </Heading>
                </Reveal>
              </Stack>
              <Stack gap="lg">
                {companyOverview.paragraphs.map((segments, pIndex) => (
                  <Body key={pIndex} className={styles.paragraph}>
                    {segments.map((segment, sIndex) =>
                      segment.bold ? <strong key={sIndex}>{segment.text}</strong> : segment.text,
                    )}
                  </Body>
                ))}
                <TextLink href={companyOverview.aboutLink.href} className={styles.aboutLink}>
                  {companyOverview.aboutLink.label}
                  <Icon name="arrow-up-right" className={styles.aboutLinkArrow} />
                </TextLink>
              </Stack>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
