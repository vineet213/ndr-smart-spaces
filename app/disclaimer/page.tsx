import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Footer } from "@/components/sections/Footer";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { disclaimer } from "@/lib/data/legal";

export const metadata: Metadata = pageMetadata({
  path: "/disclaimer",
  title: "Disclaimer",
  description:
    "Important statements about the information published on the NDR Smart Spaces website, including the operating manual and investor-facing references.",
});

export default function DisclaimerPage() {
  return (
    <>
      <LegalDocument doc={disclaimer} />
      <Footer />
    </>
  );
}
