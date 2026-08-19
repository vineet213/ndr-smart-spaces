import type { Metadata } from "next";
import { Footer, InvestorClosing, InvestorMasthead } from "@/components/sections";
import { investorMasthead } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Investor Centre",
  description:
    "The investor record of NDR Smart Spaces — the financial statement, capital strength and governance.",
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
      <InvestorClosing />
      <Footer />
    </>
  );
}
