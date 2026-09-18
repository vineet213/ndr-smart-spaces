import Image from "next/image";
import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Body, TextLink } from "@/components/ui";
import { companyOverview } from "@/lib/data/homepage";
import styles from "./CompanyOverview.module.css";

export function CompanyOverview() {
  return (
    <section className={styles.section} aria-labelledby="company-overview-title">
      <Container>
        <Grid className={styles.grid}>
          <GridItem span={5} className={styles.mediaColumn}>
            <div className={styles.media}>
              <Image
                src={companyOverview.image.src}
                alt={companyOverview.image.alt}
                fill
                sizes="(max-width: 767px) 100vw, 40vw"
                className={styles.mediaImage}
              />
            </div>
          </GridItem>
          <GridItem span={7}>
            <Stack gap="4xl">
              <Stack gap="3xl">
                <Heading variant="section" id="company-overview-title">
                  {companyOverview.heading}
                </Heading>
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
                </TextLink>
              </Stack>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
