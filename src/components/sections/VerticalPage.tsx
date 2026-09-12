import type { ReactNode } from "react";
import { Container, Section } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import { verticalOverview, type Division } from "@/lib/data/business";
import { cx } from "@/components/ui/cx";
import { AveAcresExplore } from "./AveAcresExplore";
import { AveAcresProcess } from "./AveAcresProcess";
import { AveAcresValues } from "./AveAcresValues";
import { DrawnGrid } from "./DrawnGrid";
import { PropertyRegister } from "./PropertyRegister";
import { Reveal } from "./Reveal";
import { Vertical02Stats } from "./Vertical02Stats";
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
  const titleParts = title.split(" - ");

  return (
    <>
      <Section tone="charcoal" ariaLabelledby="vertical-masthead-title" className={styles.masthead}>
        <span className={styles.ruleTop} aria-hidden="true" />

        <Container className={styles.hero}>
          <h1
            id="vertical-masthead-title"
            className={cx(styles.title, division.index === "01" && styles.titleLg)}
          >
            {isV2 && titleParts.length === 2 ? (
              <>
                <span className={styles.titleMain}>{titleParts[0]}-</span>
                <span className={styles.titleSub}>{titleParts[1]}</span>
              </>
            ) : (
              title
            )}
          </h1>
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
            <div className={styles.overview}>
              {overview ? <h3 className={styles.overviewHeading}>{overview.heading}</h3> : null}
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

          {isV2 ? (
            <>
              <Vertical02Stats />
              <Reveal>
                <VerticalManagement />
              </Reveal>
            </>
          ) : null}

          {division.source ? (
            <Reveal>
              <div className={styles.closing}>
                <SourceFootnote className={styles.source}>{division.source}</SourceFootnote>
              </div>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      {isV3 ? (
        <>
          <Section tone="light">
            <AveAcresProcess />
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
