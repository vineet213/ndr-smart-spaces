import { Container, Section, Stack } from "@/components/layout";
import { Body, Button, Eyebrow, Heading } from "@/components/ui";
import { assetFlip } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./AssetFlip.module.css";

/* Faint warehouse-roofline motif in the corners — matches the client's       */
/* reference image for this section, a quiet architectural texture behind    */
/* the flow diagram rather than a plain flat background.                     */
function BuildingBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <svg className={styles.backdropLeft} viewBox="0 0 400 300" preserveAspectRatio="xMinYMax slice">
        <path d="M0 300 L0 120 L40 90 L40 300" />
        <path d="M40 300 L40 60 L85 30 L85 300" />
        <path d="M85 300 L85 90 L130 60 L130 300" />
        <path d="M130 300 L130 40 L175 10 L175 300" />
      </svg>
      <svg className={styles.backdropRight} viewBox="0 0 400 300" preserveAspectRatio="xMaxYMax slice">
        <path d="M400 300 L400 120 L360 90 L360 300" />
        <path d="M360 300 L360 60 L315 30 L315 300" />
        <path d="M315 300 L315 90 L270 60 L270 300" />
        <path d="M270 300 L270 40 L225 10 L225 300" />
      </svg>
    </div>
  );
}

export function AssetFlip() {
  return (
    <Section tone="light" ariaLabelledby="asset-flip-overview-title" className={styles.section}>
      <BuildingBackdrop />
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

        <Reveal delay={2}>
          <div className={styles.moreInfo}>
            <div className={styles.moreInfoCopy}>
              <Eyebrow>{assetFlip.moreInfo.eyebrow}</Eyebrow>
              <Heading variant="sub">{assetFlip.moreInfo.heading}</Heading>
              <Body className={styles.moreInfoBody}>{assetFlip.moreInfo.body}</Body>
            </div>

            <div className={styles.moreInfoCta}>
              <Button href={assetFlip.moreInfo.cta.href} target="_blank" rel="noreferrer">
                {assetFlip.moreInfo.cta.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
