import { Container, Section } from "@/components/layout";
import { Button, Icon, SourceFootnote } from "@/components/ui";
import { capitalDeployment } from "@/lib/data/business";
import { ChapterHeader } from "./ChapterHeader";
import { LinearChain } from "./LinearChain";
import { Reveal } from "./Reveal";
import styles from "./CapitalDeployment.module.css";

export function CapitalDeployment() {
  return (
    <Section tone="dark" id="capital" ariaLabelledby="capital-title" className={styles.section}>
      <Container className={styles.content}>
        <Reveal>
          <ChapterHeader
            numeral="04"
            eyebrow="Capital Deployment"
            heading="How capital flows."
            headingId="capital-title"
            lede={capitalDeployment.lede}
            tone="dark"
          />

          <p className={styles.rofo}>{capitalDeployment.rofo}</p>

          <LinearChain nodes={capitalDeployment.chain} tone="dark" className={styles.chain} />

          <div className={styles.evidence}>
            <span className={styles.evidenceText}>{capitalDeployment.evidence}</span>
            <SourceFootnote tone="dark">{capitalDeployment.evidenceSource}</SourceFootnote>
          </div>

          <div className={styles.cta}>
            <Button
              tone="dark"
              href={capitalDeployment.cta.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {capitalDeployment.cta.label}
              <Icon name="arrow-up-right" size="sm" />
            </Button>
          </div>

          <SourceFootnote tone="dark" className={styles.source}>
            {capitalDeployment.source}
          </SourceFootnote>
        </Reveal>
      </Container>
    </Section>
  );
}
