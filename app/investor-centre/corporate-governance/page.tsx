import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CorporateStructure } from "@/components/sections/CorporateStructure";
import { Footer } from "@/components/sections/Footer";
import { GovernanceManual } from "@/components/sections/GovernanceManual";
import { InvestorMasthead } from "@/components/sections/InvestorMasthead";
import { governance } from "@/lib/data/investor";

export const metadata: Metadata = pageMetadata({
  path: "/investor-centre/corporate-governance",
  title: "Corporate Governance",
  description:
    "The governance framework, board, committees, policies and capital-market timeline of NDR Smart Spaces.",
});

export default function CorporateGovernancePage() {
  return (
    <>
      <InvestorMasthead
        title={{ before: "The ", accent: "governance", after: " manual" }}
        subtext={governance.masthead.subtext}
        id="corporate-governance-title"
      />
      <GovernanceManual />
      <CorporateStructure />
      <Footer />
    </>
  );
}
