import type { Metadata } from "next";
import { EsgFramework } from "@/components/sections/EsgFramework";
import { EsgGreenFeatures } from "@/components/sections/EsgGreenFeatures";
import { EsgMasthead } from "@/components/sections/EsgMasthead";
import { Footer } from "@/components/sections/Footer";
import { runEsgValidation } from "@/lib/data/esgValidation";

export const metadata: Metadata = {
  title: "ESG & Sustainability",
  description:
    "The sustainability ledger of NDR Smart Spaces — the environmental, social and governance record, measured, governed and reported as an operating discipline.",
};

if (process.env.NODE_ENV === "development") {
  runEsgValidation();
}

export default function EsgPage() {
  return (
    <>
      <EsgMasthead />
      <EsgGreenFeatures />
      <EsgFramework />
      <Footer />
    </>
  );
}
