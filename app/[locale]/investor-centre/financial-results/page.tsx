import type { Metadata } from "next";
import { FilingLibrary, Footer } from "@/components/sections";
import { financialResults } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Financial Results",
  description:
    "Quarterly and annual results of NDR Smart Spaces as reported. No result is rendered before a statement is approved.",
};

export default function FinancialResultsPage() {
  return (
    <>
      <FilingLibrary config={financialResults} />
      <Footer />
    </>
  );
}
