import { Container, Stack } from "@/components/layout";
import { Button, Eyebrow, Heading, Lede } from "@/components/ui";
import { aboutClosing } from "@/lib/data/about";
import { Reveal } from "./Reveal";
import styles from "./ClosingCta.module.css";

export function ClosingCta() {
  return (
    <section className={styles.section} aria-labelledby="closing-title">
      <Container>
        <Reveal>
          <div className={styles.plate}>
            <span className={styles.goldRule} aria-hidden="true" />
            <Stack gap="xl" align="center" className={styles.inner}>
              <Eyebrow tone="dark">{aboutClosing.eyebrow}</Eyebrow>
              <Heading variant="section" tone="dark" id="closing-title">
                {aboutClosing.heading}
              </Heading>
              <Lede tone="dark" className={styles.lede}>
                {aboutClosing.lede}
              </Lede>
              <div className={styles.ctas}>
                <Button href={aboutClosing.primaryCta.href} tone="dark">
                  {aboutClosing.primaryCta.label}
                </Button>
                <Button
                  variant="secondary"
                  tone="dark"
                  href={aboutClosing.secondaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {aboutClosing.secondaryCta.label}
                </Button>
              </div>
            </Stack>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
