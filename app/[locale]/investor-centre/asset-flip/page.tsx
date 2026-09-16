import type { Metadata } from "next";
import { Footer, InvestorMasthead, AssetFlip } from "@/components/sections";

export const metadata: Metadata = {
  title: "Asset Flip",
  description:
    "Investor Centre · Asset Flip — how NDR Smart Spaces transfers Special Purpose Vehicles (SPVs) to NDR InvIT to unlock value and reinvest in new development.",
};

export default function AssetFlipPage() {
  return (
    <>
      <InvestorMasthead
        variant="slim"
        eyebrow="Investor Centre · Asset Flip"
        title={{ before: "Asset Flip — ", accent: "Transfer of SPVs" }}
        id="asset-flip-title"
      />
      <AssetFlip />
      <Footer />
    </>
  );
}
