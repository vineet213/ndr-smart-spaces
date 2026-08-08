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
            <Eyebrow>The ruled statement</Eyebrow>
            <Heading variant="section" id="highlights-statement-title" className={styles.heading}>
              Every figure, its period, its source.
            </Heading>
            <StatementTable
              caption="Investment highlights — NDR Smart Spaces"
              columns={columns}
              rows={rows}
              footnotes={footnotes}
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
