import type { Metadata } from "next";
import {
  FeaturedPublication,
  Footer,
  MediaClosing,
  MediaKit,
  MediaMasthead,
  MediaStatement,
  PressArchive,
  PressContact,
} from "@/components/sections";
import { runMediaValidation } from "@/lib/data/mediaValidation";

export const metadata: Metadata = {
  title: "Media & Newsroom",
  description:
    "The press register of NDR Smart Spaces — releases, coverage, interviews and updates, dated and referenced as a public record.",
};

if (process.env.NODE_ENV === "development") {
  runMediaValidation();
}

export default function MediaPage() {
  return (
    <>
      <MediaMasthead />
      <MediaStatement />
      <FeaturedPublication />
      <PressArchive />
      <MediaKit />
      <PressContact />
      <MediaClosing />
      <Footer />
    </>
  );
}
