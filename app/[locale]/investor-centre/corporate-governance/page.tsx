import type { Metadata } from "next";
import {
  CapitalMarketTimeline,
  Footer,
  GovernanceManual,
  InvestorClosing,
  InvestorMasthead,
} from "@/components/sections";
import { governance } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Corporate Governance",
  description:
    "The governance manual and capital market record of NDR Smart Spaces — the framework, board, committees, policies and capital-market timeline.",
};

export default function CorporateGovernancePage() {
  return (
    <>
      <InvestorMasthead
        variant="slim"
        eyebrow={governance.masthead.eyebrow}
        title={{ before: governance.masthead.title }}
        asOn={governance.masthead.asOn}
        edition={governance.masthead.edition}
        id="corporate-governance-title"
      />
      <GovernanceManual />
      <CapitalMarketTimeline />
      <InvestorClosing />
      <Footer />
    </>
  );
}
