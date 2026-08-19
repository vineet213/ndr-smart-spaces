import type { Metadata } from "next";
import {
  BusinessStickyIndex,
  BusinessMasthead,
  OperatingDivisions,
  BusinessModel,
  ExecutionFramework,
  CorporateStructure,
  BusinessClosing,
  Footer,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "Business",
  description:
    "The operating manual of NDR Smart Spaces — the integrated business model, operating divisions, execution framework, corporate structure and the delivery process.",
};

export default function BusinessPage() {
  return (
    <>
      <BusinessStickyIndex />
      <BusinessMasthead />
      <OperatingDivisions />
      <ExecutionFramework />
      <BusinessModel />
      <CorporateStructure />
      <BusinessClosing />
      <Footer />
    </>
  );
}
