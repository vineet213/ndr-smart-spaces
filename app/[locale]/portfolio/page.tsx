import type { Metadata } from "next";
import { Footer, PortfolioMasthead, WhyNdr } from "@/components/sections";

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
