import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Eyebrow, Lede, Body } from "@/components/ui";
import { companyOverview } from "@/lib/data/homepage";
import styles from "./CompanyOverview.module.css";

export function CompanyOverview() {
  return (
    <section className={styles.section} aria-labelledby="company-overview-title">
      <Container>
        <Grid>
          <GridItem span={5}>
            <Stack gap="3xl">
              <Eyebrow>{companyOverview.eyebrow}</Eyebrow>
              <Heading variant="section" id="company-overview-title">
                {companyOverview.heading}
              </Heading>
              <Lede>{companyOverview.lede}</Lede>
            </Stack>
          </GridItem>
          <GridItem span={7}>
            <Stack gap="lg">
              {companyOverview.paragraphs.map((segments, pIndex) => (
                <Body key={pIndex} className={styles.paragraph}>
                  {segments.map((segment, sIndex) =>
                    segment.bold ? <strong key={sIndex}>{segment.text}</strong> : segment.text,
                  )}
                </Body>
              ))}
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
