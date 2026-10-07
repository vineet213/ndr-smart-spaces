import type { Metadata } from "next";
import { FilingLibrary } from "@/components/sections/FilingLibrary";
import { Footer } from "@/components/sections/Footer";
import { announcements } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Announcements",
  description: "Company announcements of NDR Smart Spaces, newest first.",
};

export default function AnnouncementsPage() {
  return (
    <>
      <FilingLibrary config={announcements} />
      <Footer />
    </>
  );
}
