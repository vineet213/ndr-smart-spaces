import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { PortfolioMasthead } from "@/components/sections/PortfolioMasthead";
import { WhyNdr } from "@/components/sections/WhyNdr";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "The NDR Smart Spaces portfolio: the group's land bank and the assets being built on it, state by state.",
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
