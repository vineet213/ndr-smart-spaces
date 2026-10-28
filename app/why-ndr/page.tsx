import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Footer } from "@/components/sections/Footer";
import { PageMasthead } from "@/components/sections/PageMasthead";
import { WhyNdrOverview } from "@/components/sections/WhyNdrOverview";
import { whyMasthead } from "@/lib/data/whyNdrPage";

export const metadata: Metadata = pageMetadata({
  path: "/why-ndr",
  title: "Why NDR",
  description:
    "Why occupiers, investors and partners build with NDR Smart Spaces: seven decades of building, 46 parks, about 25 million sq ft and 98% occupancy.",
});

export default function WhyNdrPage() {
  return (
    <>
      <PageMasthead id="why-masthead-title" title={whyMasthead.title} subtext={whyMasthead.statement} />
      <WhyNdrOverview />
      <Footer />
    </>
  );
}
