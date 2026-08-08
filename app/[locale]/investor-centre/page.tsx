import type { Metadata } from "next";
import {
  CapitalCycleDiagram,
  CapitalMarketTimeline,
  ContentsRail,
  EditorialStatement,
  Footer,
  InvITRelationship,
  InvestorClosing,
  InvestorMasthead,
  MetricsBand,
  SafeHarbourBlock,
} from "@/components/sections";
import { investorMasthead } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Investor Centre",
  description:
    "The investor record of NDR Smart Spaces — the financial statement, capital strength, capital cycle, capital-market record and governance.",
};

export default function InvestorCentrePage() {
  return (
    <>
      <InvestorMasthead
        title={investorMasthead.title}
        asOn={investorMasthead.asOn}
        edition={investorMasthead.edition}
        id="investor-centre-title"
      />
      <EditorialStatement />
      <ContentsRail />
      <MetricsBand />
      <CapitalCycleDiagram />
      <CapitalMarketTimeline />
      <InvITRelationship />
      <SafeHarbourBlock />
      <InvestorClosing />
      <Footer />
    </>
  );
}
