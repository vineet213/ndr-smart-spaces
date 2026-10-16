import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Body, Eyebrow, TextLink, Icon } from "@/components/ui";
import { companyOverview } from "@/lib/data/homepage";
import { OverviewMedia } from "./OverviewMedia";
import { Reveal } from "./Reveal";
import styles from "./CompanyOverview.module.css";

export function CompanyOverview() {
  return (
    <section className={styles.section} aria-labelledby="company-overview-title">
      {/* Decorative: an outlined "1954" and the NDR corner bracket, very faint. */}
      <span className={styles.ghostYear} aria-hidden="true">
        1954
      </span>
      <svg className={styles.cornerMark} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M12 12 H52 V52" />
        <path d="M22 22 H42 V42" />
      </svg>

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
