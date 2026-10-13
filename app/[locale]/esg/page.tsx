import type { Metadata } from "next";
import { EsgFramework } from "@/components/sections/EsgFramework";
import { EsgGreenFeatures } from "@/components/sections/EsgGreenFeatures";
import { EsgMasthead } from "@/components/sections/EsgMasthead";
import { Footer } from "@/components/sections/Footer";
import { runEsgValidation } from "@/lib/data/esgValidation";

export const metadata: Metadata = {
  title: "ESG & Sustainability",
  description:
    "How NDR Smart Spaces measures and reports its environmental, social and governance performance.",
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
