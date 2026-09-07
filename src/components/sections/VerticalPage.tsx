import { Container, Section } from "@/components/layout";
import { Eyebrow, Icon, Metric, SourceFootnote, TextLink } from "@/components/ui";
import { businessMasthead, execution, executionChapter, type Division } from "@/lib/data/business";
import { DrawnGrid } from "./DrawnGrid";
import { LinearChain } from "./LinearChain";
import { Reveal } from "./Reveal";
import { WarehousePlate } from "./WarehousePlate";
import styles from "./VerticalPage.module.css";

type VerticalPageProps = {
  division: Division;
};

function VerticalFigure({ division }: { division: Division }) {
  if (division.index === "01") {
    return (
      <Reveal>
        <div className={styles.figure}>
          <WarehousePlate />
        </div>
      </Reveal>
    );
  }

  if (division.index === "02") {
    return (
      <Reveal>
        <figure className={styles.figure}>
          <Eyebrow>
            {executionChapter.label} · {executionChapter.plate}
          </Eyebrow>
          <LinearChain nodes={execution.chain} tone="light" className={styles.chain} />
          <SourceFootnote>{execution.source}</SourceFootnote>
        </figure>
      </Reveal>
    );
  }

  return null;
}

export function VerticalPage({ division }: VerticalPageProps) {
  return (
    <>
      <Section tone="charcoal" ariaLabelledby="vertical-masthead-title" className={styles.masthead}>
        <span className={styles.ruleTop} aria-hidden="true" />

        <Container className={styles.folio}>
          <span>NDR Smart Spaces · Business</span>
          <span>{businessMasthead.folio}</span>
          <span>{businessMasthead.controlCaption}</span>
        </Container>

        <Container className={styles.hero}>
          <p className={styles.eyebrow}>Operating Vertical · {division.index}</p>
          <h1 id="vertical-masthead-title" className={styles.title}>
            {division.title}
          </h1>
          <p className={styles.meta}>
            <span>{businessMasthead.asOn}</span>
            <span aria-hidden="true">·</span>
            <span>{businessMasthead.edition}</span>
          </p>
        </Container>

        <span className={styles.rule} aria-hidden="true" />
      </Section>

      <Section tone="dim" className={styles.bodySection}>
        <DrawnGrid />
        <Container className={styles.content}>
          <Reveal>
            <header className={styles.sheetHeader}>
              <span className={styles.numeral} aria-hidden="true">
                {division.index}
              </span>
              <div className={styles.sheetType}>
                <Eyebrow>Operating vertical · {division.route.label}</Eyebrow>
                <h2 className={styles.sheetTitle}>{division.title}</h2>
              </div>
            </header>
          </Reveal>

          <Reveal>
            <p className={styles.writeup}>{division.writeup}</p>
          </Reveal>

          <Reveal>
            <dl className={styles.spec}>
              {division.spec.map((row) => (
                <div key={row.label} className={styles.specRow}>
                  <dt className={styles.specLabel}>{row.label}</dt>
                  <dd className={styles.specValue}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <div className={styles.proof}>
              <span className={styles.proofLabel}>Proof</span>
              <span className={styles.proofText}> {division.proof}</span>
              <span className={styles.proofSource}> — {division.proofSource}</span>
            </div>
          </Reveal>

          {division.metrics.length > 0 ? (
            <Reveal>
              <div className={styles.metrics}>
                {division.metrics.map((metric) => (
                  <div key={metric.key} className={styles.metricRow}>
                    <Metric className={styles.metricValue}>{metric.value}</Metric>
                    <span className={styles.metricName}>{metric.name}</span>
                    <span className={styles.metricKey}>{metric.key}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}

          <VerticalFigure division={division} />

          <Reveal>
            <div className={styles.closing}>
              <SourceFootnote className={styles.source}>{division.source}</SourceFootnote>
              <TextLink href="/en/business#verticals" className={styles.backLink}>
                Back to Business overview
                <Icon name="arrow-right" size="sm" />
              </TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
