import { Container, Section, Stack } from "@/components/layout";
import { Eyebrow, Heading, Body } from "@/components/ui";
import { assetFlip } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./AssetFlip.module.css";

export function AssetFlip() {
  return (
    <Section tone="light" ariaLabelledby="asset-flip-overview-title">
      <Container>
        <Reveal>
          <Stack gap="xl" className={styles.overview}>
            <span className={styles.goldRule} aria-hidden="true" />
            <Eyebrow>{assetFlip.eyebrow}</Eyebrow>
            <Heading variant="section" id="asset-flip-overview-title">
              {assetFlip.heading}
            </Heading>
            <Body className={styles.body}>{assetFlip.overview}</Body>
          </Stack>
        </Reveal>

        <Reveal delay={1}>
          <div className={styles.diagram} role="img" aria-label={`${assetFlip.diagram.from} transfers to ${assetFlip.diagram.to} via ${assetFlip.diagram.label}`}>
            <div className={styles.node} aria-hidden="true">
              <span className={styles.nodeLabel}>{assetFlip.diagram.from}</span>
            </div>

            <div className={styles.connector} aria-hidden="true">
              <span className={styles.connectorLine} />
              <span className={styles.connectorTag}>{assetFlip.diagram.label}</span>
              <span className={styles.connectorArrow} />
            </div>

            <div className={styles.node} aria-hidden="true">
              <span className={styles.nodeLabel}>{assetFlip.diagram.to}</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
