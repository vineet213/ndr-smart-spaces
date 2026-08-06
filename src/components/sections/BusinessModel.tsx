import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading, Lede } from "@/components/ui";
import { businessModel } from "@/lib/data/about";
import { LifecycleDiagram } from "@/components/visualizations/LifecycleDiagram";
import { Reveal } from "./Reveal";
import styles from "./BusinessModel.module.css";

export function BusinessModel() {
  return (
    <section className={styles.section} aria-labelledby="business-model-title">
      <Container>
        <Stack gap="6xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow tone="dark">{businessModel.eyebrow}</Eyebrow>
              <Heading variant="section" tone="dark" id="business-model-title">
                {businessModel.heading}
              </Heading>
              <Lede tone="dark" className={styles.lede}>
                {businessModel.lede}
              </Lede>
            </Stack>
          </Reveal>

          <LifecycleDiagram
            nodes={businessModel.steps}
            returnLabel={businessModel.returnLabel}
            returnCaption={businessModel.returnCaption}
          />
        </Stack>
      </Container>
    </section>
  );
}
