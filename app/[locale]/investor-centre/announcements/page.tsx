import type { Metadata } from "next";
import { FilingLibrary, Footer } from "@/components/sections";
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
