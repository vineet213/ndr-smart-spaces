import type { Metadata } from "next";
import {
  AssetRegister,
  AtlasField,
  FilingBand,
  PortfolioClosing,
  PortfolioMasthead,
  ZoneSection,
  Footer,
} from "@/components/sections";
import { assetsInZone, geoZones } from "@/lib/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "The institutional catalogue of NDR Smart Spaces — assets developed and owned by the group, mapped by zone, recorded as numbered plates and cross-referenced in an analyst register.",
};

export default function PortfolioPage() {
  const filedZones = geoZones.filter((zone) => assetsInZone(zone.id).length > 0);
  const pendingZones = geoZones.filter((zone) => assetsInZone(zone.id).length === 0);

  return (
    <>
      <PortfolioMasthead />
      <AtlasField />
      {filedZones.map((zone) => (
        <ZoneSection key={zone.id} zone={zone} />
      ))}
      {pendingZones.length > 0 ? <FilingBand /> : null}
      <AssetRegister />
      <PortfolioClosing />
      <Footer />
    </>
  );
}
