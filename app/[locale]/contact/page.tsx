import type { Metadata } from "next";
import {
  ContactClosing,
  ContactMasthead,
  Correspondence,
  Footer,
  OfficeDirectory,
} from "@/components/sections";
import { runContactValidation } from "@/lib/data/contactValidation";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Smart Spaces, HR and Grievance desks — reach the NDR Smart Spaces team that answers your enquiry.",
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
      <ContactClosing />
      <Footer />
    </>
  );
}
