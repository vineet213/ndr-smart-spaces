import type { Metadata } from "next";
import { FilingLibrary, Footer } from "@/components/sections";
import { annualReports } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Annual Reports",
  description: "Annual reports of NDR Smart Spaces, newest first.",
};

export default function AnnualReportsPage() {
  return (
    <>
      <FilingLibrary config={annualReports} />
      <Footer />
    </>
  );
}
