import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { InvestorMasthead } from "@/components/sections/InvestorMasthead";
import { AssetFlip } from "@/components/sections/AssetFlip";
import { assetFlip } from "@/lib/data/investor";

export const metadata: Metadata = {
  title: "Asset Flip",
  description:
    "Investor Centre · Asset Flip — how NDR Smart Spaces transfers Special Purpose Vehicles (SPVs) to NDR InvIT to unlock value and reinvest in new development.",
};

export default function AssetFlipPage() {
  return (
    <>
      <InvestorMasthead
        title={{ before: "Asset Flip — ", accent: "Transfer of SPVs" }}
        subtext={assetFlip.mastheadSubtext}
        id="asset-flip-title"
      />
      <AssetFlip />
      <Footer />
    </>
  );
}
