import type { Metadata } from "next";
import { ContactMasthead } from "@/components/sections/ContactMasthead";
import { Correspondence } from "@/components/sections/Correspondence";
import { Footer } from "@/components/sections/Footer";
import { OfficeDirectory } from "@/components/sections/OfficeDirectory";
import { runContactValidation } from "@/lib/data/contactValidation";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact NDR Smart Spaces Pvt. Ltd., Chennai: write to projects@ndrsmart.com or reach the Smart Spaces, HR and Grievance desks.",
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
