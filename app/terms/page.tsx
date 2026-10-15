import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { termsOfUse } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing access to and use of the NDR Smart Spaces website and its publications.",
};

export default function TermsPage() {
  return (
    <>
      <LegalDocument doc={termsOfUse} />
      <Footer />
    </>
  );
}
