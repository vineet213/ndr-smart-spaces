import type { ReactNode } from "react";
import { Container, Section } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import {
  verticalOverview,
  verticalMastheadSubtext,
  verticalMastheadTitle,
  vertical02Metrics,
  type Division,
} from "@/lib/data/business";
import { AveAcresExplore } from "./AveAcresExplore";
import { AveAcresProcess } from "./AveAcresProcess";
import { AveAcresValues } from "./AveAcresValues";
import { CompanyMetrics } from "./CompanyMetrics";
import { DrawnGrid } from "./DrawnGrid";
import { PageMasthead } from "./PageMasthead";
import { PropertyRegister } from "./PropertyRegister";
import { Reveal } from "./Reveal";
import { ResidentialPlottingVideo } from "./ResidentialPlottingVideo";
import { VerticalManagement } from "./VerticalManagement";
import styles from "./VerticalPage.module.css";

type VerticalPageProps = {
  division: Division;
};

/** Split the overview copy on the configured emphasis phrases and set them off. */
function renderEmphasized(text: string, phrases?: readonly string[]): ReactNode {
  if (!phrases || phrases.length === 0) return text;
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;
  for (const phrase of phrases) {
    const index = remaining.indexOf(phrase);
    if (index === -1) continue;
    if (index > 0) nodes.push(remaining.slice(0, index));
    nodes.push(<em key={key++}>{phrase}</em>);
    remaining = remaining.slice(index + phrase.length);
  }
  if (remaining.length > 0) nodes.push(remaining);
  return nodes;
}

export function VerticalPage({ division }: VerticalPageProps) {
  const overview = verticalOverview[division.index];
  const isV2 = division.index === "02";
  const isV3 = division.index === "03";
  const title = division.title;
  const mastheadSubtext = verticalMastheadSubtext[division.index];
  const mastheadTitle = verticalMastheadTitle[division.index];

  return (
    <>
      <PageMasthead
        id="vertical-masthead-title"
        title={mastheadTitle ?? { before: title }}
        subtext={mastheadSubtext}
      />

      <Section tone="dim" className={styles.bodySection}>
        <div className={styles.overviewWrap}>
          <DrawnGrid />
          <Container className={styles.content}>
            <Reveal>
              <div className={styles.overview}>
                <h2 className={styles.overviewHeading}>{overview?.heading ?? division.title}</h2>
                <p className={styles.writeup}>
                  {renderEmphasized(division.writeup, overview?.emphasis)}
                </p>
              </div>
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

            {!isV2 && division.source ? (
              <Reveal>
                <div className={styles.closing}>
                  <SourceFootnote className={styles.source}>{division.source}</SourceFootnote>
                </div>
              </Reveal>
            ) : null}
          </Container>
        </div>

        {isV2 ? (
          <>
            <CompanyMetrics data={vertical02Metrics} id="vertical-02-metrics" />
            <Container className={styles.content}>
              <Reveal>
                <VerticalManagement />
              </Reveal>

              {division.source ? (
                <Reveal>
                  <div className={styles.closing}>
                    <SourceFootnote className={styles.source}>{division.source}</SourceFootnote>
                  </div>
                </Reveal>
              ) : null}
            </Container>
          </>
        ) : null}
      </Section>

      {isV3 ? (
        <>
          <Section tone="light">
            <AveAcresProcess />
          </Section>
          <Section tone="dark" className={styles.videoSection}>
            <Reveal>
              <ResidentialPlottingVideo />
            </Reveal>
          </Section>
          <Section tone="charcoal">
            <AveAcresValues />
          </Section>
          <Section tone="dim">
            <AveAcresExplore />
          </Section>
        </>
      ) : null}

      {division.index === "01" ? <PropertyRegister /> : null}
    </>
  );
}
