import type { Metadata } from "next";
import { ShutterHero } from "@/components/sections/ShutterHero";
import { WhyBays } from "@/components/sections/WhyBays";
import { WhyParkAnatomy } from "@/components/sections/WhyParkAnatomy";
import { Waybill } from "@/components/sections/Waybill";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Why NDR",
  description:
    "Why occupiers, investors and partners build with NDR Smart Spaces: seven decades of building, 46 parks, around 25 million sq ft under management and 98% portfolio occupancy.",
};

export default function WhyNdrPage() {
  return (
    <>
      <ShutterHero />
      <WhyBays />
      <WhyParkAnatomy />
      <Waybill />
      <Footer />
    </>
  );
}
