import type { Metadata } from "next";
import { FilingLibrary, Footer } from "@/components/sections";
import { reportsDisclosures } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Reports & Disclosures",
  description:
    "Reports, disclosures and regulatory filings of NDR Smart Spaces. Records publish as filings are approved.",
};

export default function ReportsDisclosuresPage() {
  return (
    <>
      <FilingLibrary config={reportsDisclosures} />
      <Footer />
    </>
  );
}
