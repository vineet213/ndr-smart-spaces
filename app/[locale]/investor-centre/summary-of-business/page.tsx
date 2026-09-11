import type { Metadata } from "next";
import { Footer, InvestorMasthead, SummaryOfBusiness } from "@/components/sections";

export const metadata: Metadata = {
  title: "Summary of Business",
  description:
    "Investor Centre · Summary of Business — the business of NDR Smart Spaces at a glance.",
};

export default function SummaryOfBusinessPage() {
  return (
    <>
      <InvestorMasthead
        variant="slim"
        eyebrow="Investor Centre · Summary of Business"
        title={{ before: "The business at a glance." }}
        id="summary-of-business-title"
      />
      <SummaryOfBusiness />
      <Footer />
    </>
  );
}