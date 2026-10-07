import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { InvestorMasthead } from "@/components/sections/InvestorMasthead";
import { SummaryOfBusiness } from "@/components/sections/SummaryOfBusiness";
import { businessMasthead } from "@/lib/data/business";

export const metadata: Metadata = {
  title: "Summary of Business",
  description:
    "Investor Centre · Summary of Business — the business of NDR Smart Spaces at a glance.",
};

export default function SummaryOfBusinessPage() {
  return (
    <>
      <InvestorMasthead
        title={{ before: "The business at a glance." }}
        subtext={businessMasthead.statement}
        id="summary-of-business-title"
      />
      <SummaryOfBusiness />
      <Footer />
    </>
  );
}
