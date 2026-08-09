import type { Metadata } from "next";
import { Footer, LegalDocument } from "@/components/sections";
import { disclaimer } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important statements about the information published on the NDR Smart Spaces website, including the operating manual and investor-facing references.",
};

export default function DisclaimerPage() {
  return (
    <>
      <LegalDocument doc={disclaimer} />
      <Footer />
    </>
  );
}
