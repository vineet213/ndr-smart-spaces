import type { Metadata } from "next";
import { Footer, LegalDocument } from "@/components/sections";
import { privacyPolicy } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How NDR Smart Spaces Pvt. Ltd. collects, uses and protects information shared through this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalDocument doc={privacyPolicy} />
      <Footer />
    </>
  );
}
