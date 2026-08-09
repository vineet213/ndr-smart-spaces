import type { Metadata } from "next";
import {
  ContactClosing,
  ContactMap,
  ContactMasthead,
  Correspondence,
  Footer,
  InquiryRouting,
  OfficeDirectory,
} from "@/components/sections";
import { runContactValidation } from "@/lib/data/contactValidation";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Corporate offices, investor relations, media contacts, ESG inquiries and business development — reach the NDR Smart Spaces desk that answers your enquiry.",
};

if (process.env.NODE_ENV === "development") {
  runContactValidation();
}

export default function ContactPage() {
  return (
    <>
      <ContactMasthead />
      <OfficeDirectory />
      <Correspondence />
      <ContactMap />
      <InquiryRouting />
      <ContactClosing />
      <Footer />
    </>
  );
}
