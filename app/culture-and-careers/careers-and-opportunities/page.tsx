import type { Metadata } from "next";
import { CareersBoard } from "@/components/sections/CareersBoard";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Careers & Opportunities",
  description:
    "Open roles at NDR Smart Spaces across development, park operations and the corporate office, and how to apply.",
};

export default function CareersAndOpportunitiesPage() {
  return (
    <>
      <CareersBoard />
      <Footer />
    </>
  );
}
