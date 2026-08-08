import type { Metadata } from "next";
import { Container } from "@/components/layout";
import {
  Footer,
  InvestorClosing,
  InvestorMasthead,
  ResilienceIndex,
  StatementTable,
} from "@/components/sections";
import type { StatementRowData } from "@/components/sections/StatementTable";
import { Eyebrow, Heading } from "@/components/ui";
import { investorEdition, investorMetrics, type EntityRef } from "@/lib/data/investor";
import { Reveal } from "@/components/sections/Reveal";
import styles from "./highlights.module.css";

export const metadata: Metadata = {
  title: "Investment Highlights",
  description:
    "The ruled statement of NDR Smart Spaces — every figure, its period and its source, in one table.",
};

const entityName: Record<EntityRef, string> = {
  "ndr-smart-spaces": "NDR Smart Spaces",
  "ndr-invit": "NDR InvIT Trust",
  "ndr-group": "NDR Group",
};

const columns = [
  { label: "Ref", key: "ref" },
  { label: "Stat", key: "stat" },
  { label: "Value", key: "value" },
  { label: "Period", key: "period" },
  { label: "Source", key: "source" },
  { label: "Entity", key: "entity" },
];

const rows: StatementRowData[] = investorMetrics.map((metric) => ({
  id: metric.id,
  cells: {
    ref: metric.id,
    stat: metric.stat,
    value: metric.value,
    period: metric.period,
    source: metric.source,
    entity: entityName[metric.entity],
  },
}));

const footnotes = [
  "Figures as stated in the NDR Corporate Presentation — one source per figure.",
  "Periods flagged * are client-confirm before go-live.",
];

const summaryIds = ["M7", "M3", "M5"] as const;

const summaryFigures = summaryIds.map((id) => {
  const metric = investorMetrics.find((m) => m.id === id);
  if (!metric) throw new Error(`Missing summary metric ${id}`);
  return metric;
});

export default function InvestmentHighlightsPage() {
  return (
    <>
      <InvestorMasthead
        variant="slim"
        eyebrow="Investment Highlights"
        title={{ before: "The highlights statement." }}
        asOn={investorEdition.asOn}
        edition={investorEdition.edition}
        id="investment-highlights-title"
      />

      <section className={styles.section} aria-labelledby="highlights-statement-title">
        <Container>
          <Reveal>
            <div className={styles.docHeader}>
              <span className={styles.numeral} aria-hidden="true">
                01
              </span>
              <span className={styles.ref}>REF 01 · HEADLINE FIGURES</span>
            </div>
            <Eyebrow>The ruled statement</Eyebrow>
            <Heading variant="section" id="highlights-statement-title" className={styles.heading}>
              Every figure, its period, its source.
            </Heading>
          </Reveal>

          <Reveal>
            <div className={styles.band} role="list">
              {summaryFigures.map((metric) => (
                <div key={metric.id} className={styles.bandItem} role="listitem">
                  <p className={styles.bandValue}>{metric.value}</p>
                  <p className={styles.bandStat}>{metric.stat}</p>
                  <p className={styles.bandOrigin}>
                    {metric.source} · {entityName[metric.entity]}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <StatementTable
              caption="Investment highlights — NDR Smart Spaces"
              columns={columns}
              rows={rows}
              footnotes={footnotes}
              firstColAccent
              entityNote={`As on ${investorEdition.asOn.replace("As on ", "")} · ${investorEdition.edition}`}
            />
          </Reveal>
        </Container>
      </section>

      <ResilienceIndex />
      <InvestorClosing />
      <Footer />
    </>
  );
}
