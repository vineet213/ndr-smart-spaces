import type { Metadata } from "next";
import {
  CorporateStructure,
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
        title={{ before: "The ", accent: "governance", after: " manual." }}
        subtext={governance.masthead.subtext}
        id="corporate-governance-title"
      />
      <GovernanceManual />
      <CorporateStructure />
      <InvestorClosing />
      <Footer />
    </>
  );
}
