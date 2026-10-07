import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { PortfolioMasthead } from "@/components/sections/PortfolioMasthead";
import { WhyNdr } from "@/components/sections/WhyNdr";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "The institutional catalogue of NDR Smart Spaces — one state survey of the group's properties: the developable land bank and the assets rising on it, recorded as filed.",
};

export default function PortfolioPage() {
  return (
    <>
      <PortfolioMasthead />
      <WhyNdr />
      <Footer />
    </>
  );
}
