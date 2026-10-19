import type { ReactNode } from "react";
import { Container, Section } from "@/components/layout";
import { Eyebrow, SourceFootnote } from "@/components/ui";
import {
  logisticsOverview,
  verticalOverview,
  verticalMastheadSubtext,
  verticalMastheadTitle,
  vertical02Metrics,
  type Division,
} from "@/lib/data/business";
import { cx } from "../ui/cx";
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
import { VerticalSubpages } from "./VerticalSubpages";
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

/* Logistics overview: heading on the left, the copy on the                  */
/* right with its first sentence set as a lead.                              */
function LogisticsOverview({ heading, writeup }: { heading: string; writeup: string }) {
  const split = writeup.indexOf(". ");
  const lead = split === -1 ? writeup : writeup.slice(0, split + 1);
  const rest = split === -1 ? "" : writeup.slice(split + 2);
  const { eyebrow } = logisticsOverview;

  return (
    <div>
      <Reveal>
        <div className={styles.loGrid}>
          <div className={styles.loHead}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className={styles.loHeading}>{heading}</h2>
          </div>
          <div className={styles.loBody}>
            <p className={styles.loLead}>{lead}</p>
            {rest ? <p className={styles.loRest}>{rest}</p> : null}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* Residential Plotting overview: the heading on the left, the copy on the   */
/* right with its first sentence set as a lead, divided by a gold hairline.  */
function ResidentialOverview({ heading, writeup }: { heading: string; writeup: string }) {
  const split = writeup.indexOf(". ");
  const lead = split === -1 ? writeup : writeup.slice(0, split + 1);
  const rest = split === -1 ? "" : writeup.slice(split + 2);

  return (
    <Reveal>
      <div className={styles.roGrid}>
        <h2 className={styles.roHeading}>{heading}</h2>
        <div className={styles.roBody}>
          <p className={styles.roLead}>{lead}</p>
          {rest ? <p className={styles.roRest}>{rest}</p> : null}
        </div>
      </div>
    </Reveal>
  );
}

/* Asset Management overview: the three-part heading as a ruled, numbered  */
/* list of statements, with the copy beside it.                            */
function StackedOverview({ heading, writeup }: { heading: string; writeup: string }) {
  const lines = heading.split(/(?<=\.)\s+/);

  return (
    <Reveal>
      <div className={styles.so}>
        <h2 className={styles.soHeading}>
          {lines.map((line, index) => (
            <span key={index} className={styles.soLine}>
              <span className={styles.soIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {line}{" "}
            </span>
          ))}
        </h2>
        <p className={styles.soBody}>{writeup}</p>
      </div>
    </Reveal>
  );
}

export function VerticalPage({ division }: VerticalPageProps) {
  const overview = verticalOverview[division.index];
  const isV1 = division.index === "01";
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

      <Section
        tone={isV3 ? "light" : "dim"}
        className={cx(styles.bodySection, isV3 && styles.bodySectionCompact)}
      >
        <div className={cx(styles.overviewWrap, isV3 && styles.overviewWrapCompact)}>
          {isV3 ? null : <DrawnGrid />}
          <Container className={styles.content}>
            {isV1 ? (
              <LogisticsOverview
                heading={overview?.heading ?? division.title}
                writeup={division.writeup}
              />
            ) : isV2 ? (
              <StackedOverview
                heading={overview?.heading ?? division.title}
                writeup={division.writeup}
              />
            ) : isV3 ? (
              <ResidentialOverview
                heading={overview?.heading ?? division.title}
                writeup={division.writeup}
              />
            ) : (
              <Reveal>
                <div className={styles.overview}>
                  <h2 className={styles.overviewHeading}>{overview?.heading ?? division.title}</h2>
                  <p className={styles.writeup}>
                    {renderEmphasized(division.writeup, overview?.emphasis)}
                  </p>
                </div>
              </Reveal>
            )}

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

              <VerticalSubpages />

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
          <AveAcresProcess />
          <Section tone="dark" className={styles.videoSection}>
            <ResidentialPlottingVideo />
          </Section>
          <AveAcresValues />
          <AveAcresExplore />
        </>
      ) : null}

      {division.index === "01" ? <PropertyRegister /> : null}
    </>
  );
}
