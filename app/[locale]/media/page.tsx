import type { Metadata } from "next";
import { Footer, MediaMasthead, MediaSlideshow, PressArchive } from "@/components/sections";
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
      <MediaSlideshow />
      <PressArchive />
      <Footer />
    </>
  );
}
