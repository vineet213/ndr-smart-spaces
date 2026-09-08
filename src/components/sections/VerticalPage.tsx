import { Container, Section } from "@/components/layout";
import { Metric, SourceFootnote } from "@/components/ui";
import {
  businessMasthead,
  vertical02Metrics,
  verticalEmployeeSection,
  type Division,
} from "@/lib/data/business";
import { cx } from "@/components/ui/cx";
import { CompanyMetrics } from "./CompanyMetrics";
import { DrawnGrid } from "./DrawnGrid";
import { Reveal } from "./Reveal";
import { WarehousePlate } from "./WarehousePlate";
import styles from "./VerticalPage.module.css";

type VerticalPageProps = {
  division: Division;
};

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
          <h1
            id="vertical-masthead-title"
            className={cx(styles.title, division.index === "01" && styles.titleLg)}
          >
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
              <h2 className={styles.sheetTitle}>{division.title}</h2>
            </header>
          </Reveal>

          <Reveal>
            <p className={styles.writeup}>{division.writeup}</p>
          </Reveal>

          {division.spec.length > 0 ? (
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
          ) : null}

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

          {division.index === "01" ? (
            <Reveal>
              <div className={styles.figure}>
                <WarehousePlate />
              </div>
            </Reveal>
          ) : null}

          {division.index === "02" ? (
            <>
              <Reveal>
                <CompanyMetrics data={vertical02Metrics} id="vertical-metrics" bare />
              </Reveal>
              <Reveal>
                <div className={styles.employee}>
                  <h3 className={styles.employeeHeading}>{verticalEmployeeSection.heading}</h3>
                  <p className={styles.employeeBody}>{verticalEmployeeSection.body}</p>
                </div>
              </Reveal>
            </>
          ) : null}

          <Reveal>
            <div className={styles.closing}>
              <SourceFootnote className={styles.source}>{division.source}</SourceFootnote>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
