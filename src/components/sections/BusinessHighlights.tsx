import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Eyebrow, Lede, Button, Icon } from "@/components/ui";
import { businessHighlights } from "@/lib/data/homepage";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./BusinessHighlights.module.css";

export function BusinessHighlights() {
  const { verticals, partnership } = businessHighlights;

  return (
    <section className={styles.section} aria-labelledby="business-highlights-title">
      <Container>
        <Stack gap="6xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow tone="dark">{businessHighlights.eyebrow}</Eyebrow>
              <Heading variant="section" tone="dark" id="business-highlights-title">
                {businessHighlights.heading}
              </Heading>
            </Stack>
          </Reveal>

          <Grid>
            {verticals.map((vertical, index) => {
              const external = "external" in vertical && vertical.external;
              const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
              return (
                <GridItem key={vertical.title} span={4}>
                  <Reveal delay={(index + 1) as RevealDelay}>
                    <a
                      href={vertical.href}
                      className={styles.card}
                      aria-label={`${vertical.title}${external ? ", opens in a new tab" : ""}`}
                      {...linkProps}
                    >
                      <Eyebrow tone="dark" as="span" className={styles.cardEyebrow}>
                        {vertical.index}
                      </Eyebrow>
                      <Heading variant="sub" tone="dark">
                        {vertical.title}
                      </Heading>
                      <p className={styles.cardBody}>{vertical.body}</p>
                      <span className={styles.cardProof}>
                        {vertical.proof}
                        <Icon name={external ? "arrow-up-right" : "arrow-right"} size="sm" />
                      </span>
                    </a>
                  </Reveal>
                </GridItem>
              );
            })}
          </Grid>

          <Reveal delay={2}>
            <div className={styles.partnership}>
              <div className="container">
                <Stack gap="4xl">
                  <Heading variant="sub" tone="dark" as="h3" className={styles.partnerTitle}>
                    {partnership.title}
                  </Heading>
                  <Lede tone="dark" className={styles.partnerLine}>
                    {partnership.line}
                  </Lede>
                  <div>
                    <Button tone="dark" href={partnership.cta.href}>
                      {partnership.cta.label}
                    </Button>
                  </div>
                </Stack>
              </div>
            </div>
          </Reveal>
        </Stack>
      </Container>
    </section>
  );
}
