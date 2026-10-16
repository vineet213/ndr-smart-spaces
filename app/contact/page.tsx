import type { Metadata } from "next";
import { ContactMasthead } from "@/components/sections/ContactMasthead";
import { Correspondence } from "@/components/sections/Correspondence";
import { Footer } from "@/components/sections/Footer";
import { OfficeDirectory } from "@/components/sections/OfficeDirectory";
import { runContactValidation } from "@/lib/data/contactValidation";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the NDR Smart Spaces team through the Smart Spaces, HR and Grievance desks.",
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
      <Footer hideWorkWithUsCta={false} />
    </>
  );
}
