import type { Metadata } from "next";
import {
  BusinessStickyIndex,
  BusinessMasthead,
  OperatingDivisions,
  CapabilityMatrix,
  CorporateStructure,
  CapitalDeployment,
  ExecutionFramework,
  BusinessClosing,
  Footer,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "Business",
  description:
    "The operating manual of NDR Smart Spaces — operating divisions, capabilities, corporate structure, capital deployment and the delivery process.",
};

export default function BusinessPage() {
  return (
    <>
      <BusinessStickyIndex />
      <BusinessMasthead />
      <OperatingDivisions />
      <CapabilityMatrix />
      <CorporateStructure />
      <CapitalDeployment />
      <ExecutionFramework />
      <BusinessClosing />
      <Footer />
    </>
  );
}
