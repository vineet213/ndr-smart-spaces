import type { Metadata } from "next";
import { CorporateStructure } from "@/components/sections/CorporateStructure";
import { Footer } from "@/components/sections/Footer";
import { GovernanceManual } from "@/components/sections/GovernanceManual";
import { InvestorClosing } from "@/components/sections/InvestorClosing";
import { InvestorMasthead } from "@/components/sections/InvestorMasthead";
import { governance } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Corporate Governance",
  description:
    "The governance framework, board, committees, policies and capital-market timeline of NDR Smart Spaces.",
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
