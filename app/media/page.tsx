import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { MediaMasthead } from "@/components/sections/MediaMasthead";
import { PressArchive } from "@/components/sections/PressArchive";
import { runMediaValidation } from "@/lib/data/mediaValidation";

export const metadata: Metadata = {
  title: "Media",
  description: "Press releases, media coverage and the media kit for NDR Smart Spaces.",
};

if (process.env.NODE_ENV === "development") {
  runMediaValidation();
}

export default function MediaPage() {
  return (
    <>
      <MediaMasthead />
      <PressArchive />
      <Footer />
    </>
  );
}
