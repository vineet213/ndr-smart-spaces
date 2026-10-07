import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { MediaMasthead } from "@/components/sections/MediaMasthead";
import { PressArchive } from "@/components/sections/PressArchive";
import { runMediaValidation } from "@/lib/data/mediaValidation";

export const metadata: Metadata = {
  title: "Media",
  description:
    "The press archive and featured coverage of NDR Smart Spaces — press releases, media kit and editorial content.",
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
