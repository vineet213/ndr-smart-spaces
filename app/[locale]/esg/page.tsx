import type { Metadata } from "next";
import {
  EsgCertifications,
  EsgClosing,
  EsgDashboard,
  EsgDisclosures,
  EsgEnvironment,
  EsgFramework,
  EsgGovernance,
  EsgImpactMap,
  EsgMasthead,
  EsgSocial,
  EsgStatement,
  Footer,
} from "@/components/sections";
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
      <EsgStatement />
      <EsgFramework />
      <EsgEnvironment />
      <EsgSocial />
      <EsgGovernance />
      <EsgDashboard />
      <EsgImpactMap />
      <EsgCertifications />
      <EsgDisclosures />
      <EsgClosing />
      <Footer />
    </>
  );
}
