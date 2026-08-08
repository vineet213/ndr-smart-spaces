import type { Metadata } from "next";
import { FilingLibrary, Footer } from "@/components/sections";
import { downloads } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Policies, credit ratings, shareholding information, distribution information and investor presentations of NDR Smart Spaces.",
};

export default function DownloadsPage() {
  return (
    <>
      <FilingLibrary config={downloads} />
      <Footer />
    </>
  );
}
