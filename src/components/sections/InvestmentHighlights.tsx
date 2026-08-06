import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Eyebrow, TextLink, Icon, VisuallyHidden } from "@/components/ui";
import { investmentHighlights } from "@/lib/data/homepage";
import { CapitalCycle } from "./CapitalCycle";
import styles from "./InvestmentHighlights.module.css";

export function InvestmentHighlights() {
  const { proof, resilience } = investmentHighlights;

  return (
    <section className={styles.section} aria-labelledby="investment-highlights-title">
      <Container>
        <Grid>
          <GridItem span={6}>
            <Stack gap="5xl">
              <Eyebrow>{investmentHighlights.eyebrow}</Eyebrow>
              <Heading variant="section" id="investment-highlights-title">
                {investmentHighlights.heading}
              </Heading>
              <CapitalCycle />
              <p className={styles.cycleNote}>{investmentHighlights.cycleNote}</p>
              <VisuallyHidden>
                <p>
                  Capital cycle: Develop, Stabilize, Offer to NDR InvIT, Recycle capital, then back
                  to Develop.
                </p>
              </VisuallyHidden>
            </Stack>
          </GridItem>
          <GridItem span={6}>
            <Stack gap="4xl">
              <ul className={styles.proofList}>
                {proof.map((item) => (
                  <li key={item.name} className={styles.proofRow}>
                    <span className={styles.proofName}>{item.name}</span>
                    <span className={styles.proofValue}>{item.value}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.chips}>
                {resilience.map((chip) => (
                  <span key={chip} className={styles.chip}>
                    {chip}
                  </span>
                ))}
              </div>
              <div>
                <TextLink href={investmentHighlights.link.href}>
                  {investmentHighlights.link.label}
                  <Icon name="arrow-right" size="sm" />
                </TextLink>
              </div>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
