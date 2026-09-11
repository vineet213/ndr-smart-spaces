import type { Metadata } from "next";
import { Footer, MediaMasthead, MediaSlideshow } from "@/components/sections";
import { slideshows } from "@/lib/data/slideshow";
import { localAssetExists } from "@/lib/staticAssets";
import { runMediaValidation } from "@/lib/data/mediaValidation";

export const metadata: Metadata = {
  title: "Media",
  description:
    "The press archive and featured coverage of NDR Smart Spaces — press releases, media kit and editorial content.",
};

if (process.env.NODE_ENV === "development") {
  runMediaValidation();
}

const COVERAGE_ID = "media-coverage";

export default function MediaPage() {
  const slideshow = slideshows.find((entry) => entry.id === COVERAGE_ID);

  if (!slideshow) {
    return (
      <>
        <MediaMasthead />
        <Footer />
      </>
    );
  }

  const slides = slideshow.slides.filter((slide) => localAssetExists(slide.image));

  return (
    <>
      <MediaMasthead />
      <MediaSlideshow slideshow={{ title: slideshow.title, caption: slideshow.caption, slides }} />
      <Footer />
    </>
  );
}
