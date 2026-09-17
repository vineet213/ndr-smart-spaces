import type { Metadata } from "next";
import { Footer, InvestorMasthead, AssetFlip } from "@/components/sections";
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
        variant="slim"
        title={{ before: "Asset Flip — ", accent: "Transfer of SPVs" }}
        subtext={assetFlip.mastheadSubtext}
        id="asset-flip-title"
      />
      <AssetFlip />
      <Footer />
    </>
  );
}
