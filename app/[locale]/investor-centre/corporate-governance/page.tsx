import type { Metadata } from "next";
import { Footer, GovernanceManual, InvestorClosing, InvestorMasthead } from "@/components/sections";
import { governance } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Corporate Governance",
  description:
    "The governance manual of NDR Smart Spaces — the framework, board, committees and policies on record.",
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
      <InvestorClosing />
      <Footer />
    </>
  );
}
