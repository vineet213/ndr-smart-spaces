import type { Metadata } from "next";
import { ContactClosing } from "@/components/sections/ContactClosing";
import { ContactMasthead } from "@/components/sections/ContactMasthead";
import { Correspondence } from "@/components/sections/Correspondence";
import { Footer } from "@/components/sections/Footer";
import { OfficeDirectory } from "@/components/sections/OfficeDirectory";
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
      <Footer hideWorkWithUsCta={false} />
    </>
  );
}
