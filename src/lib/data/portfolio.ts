import type { ZoneId } from "./homepage";

export type { ZoneId } from "./homepage";

/**
 * Portfolio — The Institutional Catalogue.
 *
 * Two-layer model (Page Identity Guide §2.3 · Portfolio Architecture V1.1):
 * - Layer A · Geography: locations + zones. Complete today (approved diagrams).
 * - Layer B · Inventory: assets as numbered plates. In filing; rows conditional on data.
 *
 * Content is source-grounded. Nothing here is invented: location coordinates are
 * real latitudes/longitudes projected onto the group's schematic outline; the
 * outline itself is not to scale; asset facts carry a source.
 */

export const MAP_VIEWBOX = { width: 930, height: 1000 } as const;

/**
 * Projection for the schematic outline (equirectangular fit, verified against
 * Chennai, Kolkata, Pune, Hyderabad, Kochi — all within ±3 units):
 * longitude 68.2°E–97.4°E maps to x 0–930; latitude 37.1°N–8.07°N maps to y 0–1000.
 */
export const PROJECTION = {
  lonMin: 68.2,
  lonSpan: 97.4 - 68.2,
  latMax: 37.1,
  latSpan: 37.1 - 8.07,
} as const;

export function projectPlace(lat: number, lon: number): { x: number; y: number } {
  return {
    x: Math.round(((lon - PROJECTION.lonMin) / PROJECTION.lonSpan) * MAP_VIEWBOX.width),
    y: Math.round(((PROJECTION.latMax - lat) / PROJECTION.latSpan) * MAP_VIEWBOX.height),
  };
}

/**
 * Duplicated from the frozen IndiaMap.tsx outline (Architecture V1.1 §C7):
 * frozen files are never modified; this static geographic path is data, not code.
 */
export const INDIA_OUTLINE =
  "M297.4 55.5 L309.8 56.3 L339.9 38.6 L355.4 38.2 L362.7 41.3 L366.9 50.2 L376.3 51.5 L378.0 57.6 L382.8 52.4 L389.4 55.8 " +
  "L378.7 82.4 L369.5 85.1 L369.8 90.1 L360.7 91.0 L363.8 98.5 L357.3 106.6 L340.9 107.6 L347.4 119.2 L341.5 119.7 L342.6 1" +
  "28.0 L347.9 134.2 L357.5 134.6 L355.0 141.1 L361.9 152.3 L343.5 164.0 L337.5 159.1 L336.2 151.6 L325.2 157.3 L337.5 175." +
  "8 L337.4 199.3 L347.6 194.4 L358.1 209.3 L372.0 211.0 L383.9 218.2 L383.2 224.5 L409.1 236.0 L387.9 253.2 L389.3 258.4 L" +
  "384.0 263.7 L385.8 271.9 L380.9 275.4 L378.7 285.0 L392.7 294.4 L394.4 289.7 L414.8 301.0 L418.2 308.8 L422.3 307.9 L436" +
  ".3 318.3 L442.2 316.0 L454.2 324.5 L462.4 323.0 L463.3 330.6 L477.7 332.2 L481.8 336.5 L484.1 331.3 L499.2 335.9 L498.7 " +
  "332.5 L508.3 330.1 L523.3 336.2 L524.0 346.3 L541.4 352.3 L542.1 356.2 L555.3 352.2 L562.5 362.8 L577.8 361.0 L590.4 367" +
  ".8 L601.3 362.1 L601.9 366.8 L609.8 370.4 L627.2 365.5 L631.1 369.9 L636.7 356.9 L630.4 343.8 L637.1 320.6 L634.6 316.2 " +
  "L651.1 309.3 L659.1 318.4 L655.1 328.3 L659.9 337.8 L654.5 343.0 L666.9 354.5 L674.7 352.6 L690.0 358.1 L705.7 351.3 L71" +
  "7.3 355.8 L748.2 354.5 L754.6 350.6 L759.9 353.1 L759.3 339.0 L762.0 338.0 L758.6 331.3 L747.0 331.2 L744.1 326.1 L746.7" +
  " 321.6 L755.7 323.2 L765.8 317.3 L772.6 320.5 L781.3 314.2 L779.6 308.2 L787.4 306.5 L803.4 290.6 L812.5 290.5 L830.0 28" +
  "1.3 L833.3 278.1 L831.0 273.7 L841.6 268.8 L861.9 276.6 L887.0 265.8 L895.0 272.3 L891.3 277.7 L895.8 275.1 L905.4 288.1" +
  " L898.3 296.0 L901.2 298.6 L901.0 294.7 L908.0 292.3 L914.8 301.3 L928.6 306.4 L929.7 313.0 L928.8 317.6 L913.6 327.0 L9" +
  "21.5 344.7 L907.7 335.0 L892.6 338.3 L858.3 361.1 L855.5 366.8 L859.4 379.8 L850.3 397.3 L841.9 403.2 L840.0 409.4 L845." +
  "3 412.4 L844.4 419.0 L826.7 456.5 L813.9 451.0 L805.9 453.2 L800.3 448.4 L803.8 462.0 L802.1 481.1 L799.2 485.5 L793.9 4" +
  "84.2 L796.3 511.0 L786.9 522.2 L780.3 514.8 L777.2 520.9 L767.0 460.9 L759.6 463.4 L756.7 460.4 L757.1 469.2 L750.5 475." +
  "4 L752.8 482.5 L745.9 487.9 L739.3 475.9 L737.3 482.2 L731.3 464.7 L738.2 447.5 L744.9 448.7 L747.4 443.2 L750.5 446.3 L" +
  "749.9 442.7 L754.9 446.5 L755.5 439.6 L763.3 436.8 L767.5 425.9 L765.4 420.2 L773.9 421.0 L771.6 415.7 L760.0 410.3 L708" +
  ".5 411.8 L689.3 406.7 L690.8 384.2 L684.2 374.1 L681.0 383.4 L674.0 382.1 L667.6 377.6 L665.4 368.6 L659.6 368.2 L664.2 " +
  "374.0 L652.0 373.3 L654.5 370.3 L643.5 360.7 L641.4 365.7 L647.5 369.9 L636.4 377.2 L634.2 388.7 L639.4 388.9 L648.0 399" +
  ".3 L656.6 398.7 L662.9 407.7 L660.2 411.1 L644.9 409.5 L643.5 418.7 L635.2 419.0 L631.1 428.2 L641.4 438.1 L654.2 441.6 " +
  "L655.3 451.9 L649.1 456.0 L648.6 463.3 L656.3 468.6 L653.7 476.9 L662.5 478.3 L657.7 485.4 L665.7 514.8 L662.2 523.7 L66" +
  "5.8 532.6 L660.1 532.9 L658.2 527.8 L657.8 533.4 L653.8 531.2 L655.6 519.7 L651.1 517.5 L648.5 526.5 L645.4 523.7 L645.2" +
  " 533.5 L639.6 529.3 L638.7 535.3 L637.4 515.0 L631.4 512.5 L636.9 516.6 L624.6 530.6 L601.9 536.1 L596.2 542.9 L593.5 54" +
  "9.9 L598.2 560.8 L594.8 562.4 L601.2 564.2 L590.5 570.6 L592.2 576.1 L588.6 578.9 L592.6 577.1 L579.0 590.7 L552.5 599.5" +
  " L536.6 610.0 L507.7 647.3 L489.4 657.1 L478.6 672.1 L449.7 691.1 L449.6 707.6 L430.7 716.4 L416.6 716.8 L406.1 736.9 L3" +
  "97.9 730.7 L384.7 738.2 L377.8 758.8 L382.5 775.9 L380.3 793.5 L387.3 820.5 L381.3 848.8 L368.6 876.0 L372.5 922.9 L353." +
  "8 924.7 L341.3 951.3 L343.2 956.4 L350.5 958.4 L321.1 967.5 L314.9 989.7 L298.4 1000.0 L281.3 990.5 L266.4 971.5 L270.2 " +
  "968.3 L266.2 970.4 L260.4 955.5 L257.6 932.5 L244.9 894.9 L234.5 874.7 L223.6 864.6 L211.7 835.8 L208.4 808.3 L199.0 786" +
  ".2 L201.9 787.5 L194.4 771.3 L182.6 758.5 L178.7 738.9 L168.1 725.1 L165.3 713.8 L168.5 712.6 L163.7 709.3 L167.7 709.7 " +
  "L163.7 706.3 L166.4 705.7 L164.0 691.1 L159.7 682.2 L163.1 682.4 L151.5 650.5 L156.8 653.1 L156.3 647.0 L151.1 646.0 L15" +
  "0.6 639.4 L153.8 641.9 L149.1 634.1 L151.7 629.5 L154.1 633.3 L150.7 627.1 L155.7 622.8 L153.1 617.0 L147.4 627.2 L146.8" +
  " 613.0 L150.8 613.6 L145.5 607.7 L150.1 605.5 L145.0 605.3 L142.6 594.8 L151.4 562.9 L145.1 554.7 L148.8 553.5 L144.3 55" +
  "1.6 L146.9 548.4 L142.1 551.8 L142.1 547.5 L145.4 547.8 L140.8 544.3 L151.3 531.3 L138.9 531.8 L145.6 521.1 L137.9 521.0" +
  " L140.4 513.1 L150.8 511.0 L138.8 509.6 L135.5 513.1 L132.2 509.5 L127.6 519.4 L129.6 522.8 L127.0 521.5 L131.5 533.0 L1" +
  "25.3 547.7 L84.3 565.3 L63.1 552.7 L24.3 509.6 L28.5 503.7 L33.6 511.3 L42.6 505.5 L47.6 509.0 L49.5 503.8 L52.1 506.4 L" +
  "63.7 501.5 L72.4 486.7 L65.1 483.8 L65.3 487.3 L54.5 488.7 L49.0 494.7 L32.6 491.3 L14.6 479.9 L17.4 481.4 L13.0 477.9 L" +
  "16.1 475.3 L8.1 468.1 L20.3 455.4 L10.9 460.0 L8.1 457.5 L5.7 465.6 L0.0 464.4 L5.6 460.5 L0.6 460.7 L5.9 452.1 L18.5 45" +
  "2.2 L20.2 440.4 L22.1 443.9 L24.6 440.8 L45.2 441.2 L59.0 445.3 L76.0 436.7 L76.3 442.6 L80.9 443.8 L93.8 437.4 L89.9 43" +
  "5.9 L93.0 427.5 L79.3 403.1 L79.2 392.6 L66.7 392.2 L61.3 384.5 L63.7 363.3 L42.6 356.7 L45.0 341.6 L70.0 313.0 L76.9 31" +
  "3.0 L85.9 323.6 L118.5 314.7 L134.2 286.9 L151.9 278.0 L166.2 246.4 L184.5 237.7 L183.3 227.6 L207.6 207.5 L201.6 205.5 " +
  "L206.2 195.4 L200.9 185.4 L204.7 179.4 L229.1 167.8 L220.5 159.1 L207.1 158.6 L207.8 146.6 L197.2 149.1 L173.8 137.9 L17" +
  "2.5 110.4 L166.3 93.6 L168.0 87.1 L174.5 87.3 L176.8 80.3 L186.8 76.0 L189.6 68.1 L177.5 64.6 L178.6 54.1 L166.5 54.0 L1" +
  "57.6 47.4 L159.3 42.6 L139.9 42.9 L139.3 29.7 L152.6 21.3 L155.6 13.7 L181.0 12.8 L174.9 6.0 L186.7 9.0 L207.3 0.0 L214." +
  "1 5.3 L221.9 2.1 L230.5 4.7 L231.9 12.6 L240.6 11.8 L249.9 22.6 L271.9 32.2 L275.7 42.6 L291.9 47.4 L297.4 55.5 Z";

export type LocationTier = "hq" | "hub" | "satellite";

export type GeoLocation = {
  id: string;
  name: string;
  zone: ZoneId;
  tier: LocationTier;
  lat: number;
  lon: number;
  x: number;
  y: number;
  line: string;
  labelSide?: "left" | "right";
  leaderTo?: { x: number; y: number };
};

export type ZoneFrame = { x: number; y: number; width: number; height: number };

export type GeoZone = {
  id: ZoneId;
  name: string;
  fact: string;
  frame: ZoneFrame;
  centroid: { x: number; y: number };
};

export const geoLocations: readonly GeoLocation[] = [
  {
    id: "chennai-hq",
    name: "Chennai",
    zone: "south",
    tier: "hq",
    lat: 13.0887,
    lon: 80.2707,
    x: projectPlace(13.0887, 80.2707).x,
    y: projectPlace(13.0887, 80.2707).y,
    line: "Chennai, Tamil Nadu",
  },
  {
    id: "nallur",
    name: "Nallur",
    zone: "south",
    tier: "hub",
    lat: 13.03,
    lon: 80.05,
    x: projectPlace(13.03, 80.05).x,
    y: projectPlace(13.03, 80.05).y,
    line: "Chennai, Tamil Nadu",
    leaderTo: { x: 386, y: 829 },
  },
  {
    id: "bidadi",
    name: "Bidadi",
    zone: "south",
    tier: "hub",
    lat: 12.8456,
    lon: 77.4861,
    x: projectPlace(12.8456, 77.4861).x,
    y: projectPlace(12.8456, 77.4861).y,
    line: "Bengaluru, Karnataka",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    zone: "west",
    tier: "hub",
    lat: 17.385,
    lon: 78.487,
    x: projectPlace(17.385, 78.487).x,
    y: projectPlace(17.385, 78.487).y,
    line: "Telangana",
  },
  {
    id: "pune",
    name: "Pune",
    zone: "west",
    tier: "hub",
    lat: 18.52,
    lon: 73.856,
    x: projectPlace(18.52, 73.856).x,
    y: projectPlace(18.52, 73.856).y,
    line: "Maharashtra",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    zone: "east",
    tier: "hub",
    lat: 22.5727,
    lon: 88.3639,
    x: projectPlace(22.5727, 88.3639).x,
    y: projectPlace(22.5727, 88.3639).y,
    line: "West Bengal",
  },
  {
    id: "ghaziabad",
    name: "Ghaziabad",
    zone: "north",
    tier: "hub",
    lat: 28.67,
    lon: 77.42,
    x: projectPlace(28.67, 77.42).x,
    y: projectPlace(28.67, 77.42).y,
    line: "NCR, Uttar Pradesh",
  },
  {
    id: "walajapet",
    name: "Walajapet",
    zone: "south",
    tier: "satellite",
    lat: 12.9258,
    lon: 79.4247,
    x: projectPlace(12.9258, 79.4247).x,
    y: projectPlace(12.9258, 79.4247).y,
    line: "Chennai, Tamil Nadu",
  },
  {
    id: "oragadam",
    name: "Oragadam",
    zone: "south",
    tier: "satellite",
    lat: 12.8366,
    lon: 79.9361,
    x: projectPlace(12.8366, 79.9361).x,
    y: projectPlace(12.8366, 79.9361).y,
    line: "Chennai, Tamil Nadu",
    leaderTo: { x: 388, y: 832 },
  },
  {
    id: "krishnapuram-kandigai",
    name: "Krishnapuram Kandigai",
    zone: "south",
    tier: "satellite",
    lat: 12.87,
    lon: 80.17,
    x: projectPlace(12.87, 80.17).x,
    y: projectPlace(12.87, 80.17).y,
    line: "Chennai, Tamil Nadu",
    leaderTo: { x: 382, y: 832 },
  },
  {
    id: "hosur",
    name: "Hosur",
    zone: "south",
    tier: "satellite",
    lat: 12.7407,
    lon: 77.8257,
    x: projectPlace(12.7407, 77.8257).x,
    y: projectPlace(12.7407, 77.8257).y,
    line: "Tamil Nadu",
  },
  {
    id: "kochi",
    name: "Kochi",
    zone: "south",
    tier: "satellite",
    lat: 9.9312,
    lon: 76.2673,
    x: projectPlace(9.9312, 76.2673).x,
    y: projectPlace(9.9312, 76.2673).y,
    line: "Kerala",
  },
  {
    id: "varanasi",
    name: "Varanasi",
    zone: "east",
    tier: "satellite",
    lat: 25.3176,
    lon: 82.9739,
    x: projectPlace(25.3176, 82.9739).x,
    y: projectPlace(25.3176, 82.9739).y,
    line: "Uttar Pradesh",
  },
  {
    id: "lucknow",
    name: "Lucknow",
    zone: "east",
    tier: "satellite",
    lat: 26.8467,
    lon: 80.9462,
    x: projectPlace(26.8467, 80.9462).x,
    y: projectPlace(26.8467, 80.9462).y,
    line: "Uttar Pradesh",
  },
  {
    id: "kanpur",
    name: "Kanpur",
    zone: "east",
    tier: "satellite",
    lat: 26.4499,
    lon: 80.3316,
    x: projectPlace(26.4499, 80.3316).x,
    y: projectPlace(26.4499, 80.3316).y,
    line: "Uttar Pradesh",
  },
  {
    id: "coimbatore",
    name: "Coimbatore",
    zone: "south",
    tier: "satellite",
    lat: 11.0168,
    lon: 76.9558,
    x: projectPlace(11.0168, 76.9558).x,
    y: projectPlace(11.0168, 76.9558).y,
    line: "Tamil Nadu",
    labelSide: "left",
  },
  {
    id: "puducherry",
    name: "Puducherry",
    zone: "south",
    tier: "satellite",
    lat: 11.9416,
    lon: 79.8083,
    x: projectPlace(11.9416, 79.8083).x,
    y: projectPlace(11.9416, 79.8083).y,
    line: "Puducherry",
    labelSide: "right",
  },
] as const;

export const geoZones: readonly GeoZone[] = [
  {
    id: "south",
    name: "South",
    fact: "Chennai, Bidadi, Hosur, Kochi — warehousing corridors of Tamil Nadu and Karnataka.",
    frame: { x: 225, y: 780, width: 250, height: 190 },
    centroid: { x: 340, y: 850 },
  },
  {
    id: "west",
    name: "West",
    fact: "Hyderabad and Pune — major production and consumption centres.",
    frame: { x: 140, y: 600, width: 260, height: 150 },
    centroid: { x: 260, y: 665 },
  },
  {
    id: "east",
    name: "East",
    fact: "Kolkata, Varanasi, Lucknow, Kanpur — a rising consumption belt.",
    frame: { x: 345, y: 305, width: 345, height: 250 },
    centroid: { x: 505, y: 420 },
  },
  {
    id: "north",
    name: "North",
    fact: "Ghaziabad — a gateway to the NCR market.",
    frame: { x: 230, y: 235, width: 180, height: 120 },
    centroid: { x: 315, y: 292 },
  },
] as const;

/**
 * Presentation chapter numerals — derived from the geoZones order (south, west,
 * east, north), not factual data. Used to number catalogue chapters I–IV and the
 * closing register as chapter V.
 */
export const ZONE_CHAPTERS: Record<ZoneId, string> = {
  south: "I",
  west: "II",
  east: "III",
  north: "IV",
};

export function locationsInZone(zoneId: ZoneId): readonly GeoLocation[] {
  return geoLocations.filter((location) => location.zone === zoneId);
}

export type AssetStatus = "completed" | "ongoing";
export type AssetClass = "warehousing" | "industrial" | "commercial" | "institutional";
export type AssetEntity = "spv" | "invit";

export type PortfolioAsset = {
  id: string;
  plate: string;
  name: string;
  city: string;
  zone: ZoneId;
  locationId?: string;
  class: AssetClass;
  status: AssetStatus;
  sizeSqFt?: number;
  occupier?: string;
  completedYear?: string;
  entity?: AssetEntity;
  image?: { src: string; alt: string };
  route?: { label: string; href: string };
  source: string;
};

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  warehousing: "Warehousing",
  industrial: "Industrial",
  commercial: "Commercial",
  institutional: "Institutional",
};

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
};

export const portfolioAssets: readonly PortfolioAsset[] = [
  {
    id: "amazon-coimbatore",
    plate: "01",
    name: "Amazon Fulfilment Centre",
    city: "Coimbatore",
    zone: "south",
    locationId: "coimbatore",
    class: "warehousing",
    status: "completed",
    sizeSqFt: 600000,
    occupier: "Amazon",
    source: "NDR Corporate Presentation",
  },
  {
    id: "lenovo-puducherry",
    plate: "02",
    name: "Lenovo Industrial Facility",
    city: "Puducherry",
    zone: "south",
    locationId: "puducherry",
    class: "industrial",
    status: "completed",
    occupier: "Lenovo",
    completedYear: "2002",
    source: "Approved homepage content",
  },
] as const;

export function assetsInZone(zoneId: ZoneId): readonly PortfolioAsset[] {
  return portfolioAssets.filter((asset) => asset.zone === zoneId);
}

export function assetsAtLocation(locationId: string): readonly PortfolioAsset[] {
  return portfolioAssets.filter((asset) => asset.locationId === locationId);
}

export function plateAtLocation(locationId: string): string | null {
  const asset = portfolioAssets.find((item) => item.locationId === locationId);
  return asset ? asset.plate : null;
}

export function formatPlateRange(plates: readonly string[]): string {
  const values = plates
    .map((plate) => Number.parseInt(plate, 10))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (values.length === 0) return "";
  const min = String(values[0]).padStart(2, "0");
  const max = String(values[values.length - 1]).padStart(2, "0");
  return values.length === 1 ? `Plate ${min}` : `Plates ${min}–${max}`;
}

export function formatSqFt(sizeSqFt: number | undefined): string {
  if (sizeSqFt == null) return "—";
  return `${sizeSqFt.toLocaleString("en-IN")} sq ft`;
}

export const portfolioMasthead = {
  eyebrow: "Portfolio · The Institutional Catalogue",
  title: "The register of places.",
  lede: "Assets developed and owned by the NDR Smart Spaces group — mapped by zone, recorded as numbered plates, and cross-referenced in an analyst register.",
  editionPeriod: "Edition FY26",
} as const;

export type SurveyMark = "asset" | "hq" | "hub" | "satellite";

export const atlasField = {
  mark: "The Atlas · Register of places",
  captionLabel: "Fig. 01 · Atlas · Survey map",
  captionLead:
    "Mapped from the group's corporate diagrams — headquarters, logistics hubs and secondary locations across four operating zones.",
  captionDetail: "Each catalogued plate is cross-referenced in the register below.",
  source: "Source: NDR Smart Presentation · locations diagram",
  zoneIndexLabel: "Zone index",
  surveyKeyLabel: "Key",
  surveyKey: [
    { mark: "asset", label: "Catalogued asset · plate reference" },
    { mark: "hq", label: "Headquarters" },
    { mark: "hub", label: "Logistics hub" },
    { mark: "satellite", label: "Secondary location" },
  ] as const,
  locationUnitLabel: "locations mapped",
  notToScale: "Schematic outline · not to scale",
} as const;

export const locatorIndex = {
  label: "Locator index",
  cataloguedLabel: "catalogued",
  linkedLabel: "Linked to the register",
  note: "Schematic outline · not to scale",
} as const;

export const zoneSection = {
  zoneFactLabel: "Zone profile",
  handoffPrefix: "Open the",
  handoffSuffix: "register",
} as const;

export const filingBand = {
  label: "Plates in filing",
  chapterLabel: "Chapter IV · Filing",
  framing:
    "Asset documentation is under archival review. Plates publish as records clear approval — filed zones are cross-referenced in the register below.",
  filedLabel: "filed",
  pendingLabel: "Record in preparation",
  referenceLabel: "Filing reference",
  plateRefLabel: "Plate reference",
  registerChapterLabel: "Chapter V · The register",
  registerHandoffLabel: "Cross-referenced in the register below",
  handoffPrefix: "Open the",
  handoffSuffix: "register",
} as const;

export const plateCopy = {
  photographyPending: "Photographic record in preparation",
  classLabel: "Class",
  sizeLabel: "Size",
  statusLabel: "Status",
  occupierLabel: "Occupier",
  completedLabel: "Completed",
  yearLabel: "Year",
  sourceLabel: "Source",
} as const;

export const portfolioRegister = {
  eyebrow: "Register · Cross-reference",
  heading: "The register of assets.",
  framing:
    "The cross-reference record of the catalogue — every catalogued asset, compared by class, zone, size and status.",
  provenanceLabel: "Cross-referenced from the records filed in this edition",
  summary: {
    locationsLabel: "Locations mapped",
    assetsLabel: "Assets catalogued",
    zonesLabel: "Operating zones",
    editionLabel: "Edition",
    editionValue: "FY26",
  } as const,
  columns: {
    plate: "Plate",
    asset: "Asset",
    class: "Class",
    zone: "Zone",
    size: "Size",
    status: "Status",
  } as const,
  indexLabel: "Index by zone",
  allPlatesLabel: "All plates",
  orderLabel: "Order",
  orderOptions: [
    { value: "plate-asc", label: "Catalogue — plate" },
    { value: "size-desc", label: "Size — largest first" },
    { value: "asset-asc", label: "Asset — A to Z" },
  ] as const,
  noRecordsLabel: "No records match the current index.",
  noRecordsReset: "Show all plates",
  emptyTitle: "Asset records are being filed.",
  emptyNote: "Records publish upon archival approval.",
  entityNote:
    "Group SPV assets are catalogued here. NDR InvIT's own portfolio is maintained by the trust.",
  entityLink: { label: "NDR InvIT Trust", href: "https://ndrinvit.com" },
  source: "Source: NDR Corporate Presentation · approved website content",
  sizeMissing: "—",
} as const;

export const portfolioClosing = {
  eyebrow: "Catalogue · Endnote",
  line: "The register continues at NDR InvIT.",
  body: "Completed assets are offered to NDR InvIT under a Right of First Offer; the listed portfolio is maintained separately by the trust.",
  primaryCta: { label: "Discuss an asset", href: "mailto:project@ndrsmart.com" },
  secondaryCta: { label: "NDR InvIT Trust", href: "https://ndrinvit.com" },
  tertiaryLink: { label: "View the operating model", href: "/en/business#verticals" },
} as const;
