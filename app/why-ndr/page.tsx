import type { Metadata } from "next";
import { PageMasthead } from "@/components/sections/PageMasthead";
import { CompanyMetrics } from "@/components/sections/CompanyMetrics";
import { WhyAudience } from "@/components/sections/WhyAudience";
import { WhyNdr } from "@/components/sections/WhyNdr";
import { WhyFirsts } from "@/components/sections/WhyFirsts";
import { WhyParkAnatomy } from "@/components/sections/WhyParkAnatomy";
import { CycleSection } from "@/components/sections/CycleSection";
import { WhyReach } from "@/components/sections/WhyReach";
import { MarqueeClients } from "@/components/sections/MarqueeClients";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Footer } from "@/components/sections/Footer";
import { whyClosing, whyCycle, whyMasthead, whyProof } from "@/lib/data/whyNdrPage";

export const metadata: Metadata = {
  title: "Why NDR",
  description:
    "Why occupiers, investors and partners build with NDR Smart Spaces: seven decades of building, 46 parks, around 25 million sq ft under management and 98% portfolio occupancy.",
};

export default function WhyNdrPage() {
  return (
    <>
      <PageMasthead id="why-ndr-masthead" title={whyMasthead.title} subtext={whyMasthead.subtext} />
      <CompanyMetrics data={whyProof} id="why-proof" />
      <WhyAudience />
      <WhyNdr sheet={{ sheet: "02", of: "06" }} />
      <WhyFirsts />
      <WhyParkAnatomy />
      <CycleSection
        id="land-to-listed"
        sheet="05"
        of="06"
        eyebrow={whyCycle.eyebrow}
        heading={whyCycle.heading}
        lede={whyCycle.lede}
        links={whyCycle.links}
      />
      <WhyReach />
      <MarqueeClients />
      <ClosingCta data={whyClosing} />
      <Footer />
    </>
  );
}
