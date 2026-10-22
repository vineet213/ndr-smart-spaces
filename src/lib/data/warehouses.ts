/**
 * One page per operating warehouse (/warehouses/<id>/).
 *
 * The base record (name, place, area, coordinates) comes from the assets under
 * management ledger. Everything a detail page adds on top of it (photos, specs,
 * connectivity, FAQ) lives in `warehouseDetails.json`, keyed by the same id.
 * Every detail field is optional: a section with no data is simply not drawn.
 *
 * Fields listed in a record's `sampleFields` are placeholder content for client
 * review. `scripts/validate-warehouses.mjs` refuses a production build while any
 * remain, so they can never reach the live site.
 */

import { warehouseHref } from "@/lib/routes";
import { aumAssets, type AumAsset } from "./portfolio";
import detailsJson from "./warehouseDetails.json";

export type LandmarkKind = "airport" | "seaport" | "rail" | "metro" | "highway" | "city";

export type WarehousePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type WarehouseDetail = {
  /** Finer place line than the ledger city, e.g. "Keezhmad, Aluva". */
  locality?: string;
  /** Verified site pin; replaces the ledger coordinate, which may be a town centroid. */
  location?: { lat: number; lon: number };
  summary?: string;
  availability?: { label: string; asOf: string };
  bestFor?: string[];
  certifications?: string[];
  keyStats?: { label: string; value: string; unit: string }[];
  specs?: { title: string; rows: { label: string; value: string }[] }[];
  amenities?: string[];
  landmarks?: { label: string; kind: LandmarkKind; lat: number; lon: number; roadKm?: number }[];
  photos?: WarehousePhoto[];
  faq?: { q: string; a: string }[];
  contact?: { email?: string; phone?: string; whatsapp?: string };
  sampleFields?: string[];
};

const details = detailsJson as Readonly<Record<string, WarehouseDetail>>;

export type Connection = {
  label: string;
  kind: LandmarkKind;
  lat: number;
  lon: number;
  km: number;
  /** "road" when a measured driving distance was supplied, else straight-line. */
  basis: "road" | "straight-line";
};

export type Warehouse = {
  id: string;
  href: string;
  name: string;
  stateName: string;
  city: string;
  district?: string;
  placeLine: string;
  leasableAreaMsf?: number;
  /** Site coordinate, and whether it is a verified pin or the ledger's approximation. */
  location: { lat: number; lon: number; verified: boolean } | null;
  connections: Connection[];
  detail: WarehouseDetail;
  /** Thin pages (no summary and no photos) stay out of search results until filled. */
  indexable: boolean;
  hasSampleContent: boolean;
};

/** Great-circle distance in km. */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function toWarehouse(asset: AumAsset): Warehouse {
  const detail = details[asset.id] ?? {};
  const location = detail.location
    ? { ...detail.location, verified: true }
    : asset.lat !== undefined && asset.lon !== undefined
      ? { lat: asset.lat, lon: asset.lon, verified: false }
      : null;

  const connections: Connection[] = location
    ? (detail.landmarks ?? [])
        .map((landmark) => ({
          label: landmark.label,
          kind: landmark.kind,
          lat: landmark.lat,
          lon: landmark.lon,
          km: landmark.roadKm ?? distanceKm(location, landmark),
          basis: landmark.roadKm !== undefined ? ("road" as const) : ("straight-line" as const),
        }))
        .sort((a, b) => a.km - b.km)
    : [];

  const place = detail.locality ?? asset.city;
  return {
    id: asset.id,
    href: warehouseHref(asset.id),
    name: asset.name,
    stateName: asset.stateName,
    city: asset.city,
    ...(asset.district !== undefined ? { district: asset.district } : {}),
    placeLine: [...new Set([place, asset.city, asset.stateName])].join(", "),
    ...(asset.leasableAreaMsf !== undefined ? { leasableAreaMsf: asset.leasableAreaMsf } : {}),
    location,
    connections,
    detail,
    indexable: Boolean(detail.summary) && (detail.photos?.length ?? 0) > 0,
    hasSampleContent: (detail.sampleFields?.length ?? 0) > 0,
  };
}

export const warehouses: readonly Warehouse[] = aumAssets.map(toWarehouse);

export function warehouseById(id: string): Warehouse | null {
  return warehouses.find((warehouse) => warehouse.id === id) ?? null;
}

/** Nearest other warehouses: same state first, then anywhere, closest first. */
export function relatedWarehouses(warehouse: Warehouse, count = 3): readonly Warehouse[] {
  const origin = warehouse.location;
  const others = warehouses.filter((other) => other.id !== warehouse.id);
  const score = (other: Warehouse) =>
    (other.stateName === warehouse.stateName ? 0 : 1e6) +
    (origin && other.location ? distanceKm(origin, other.location) : 5e5);
  return [...others].sort((a, b) => score(a) - score(b)).slice(0, count);
}

/** 0.22 msf -> "2,20,000 sq ft" (Indian grouping, as the client writes areas). */
export function formatAreaSqFt(msf: number): string {
  return `${Math.round(msf * 1_000_000).toLocaleString("en-IN")} sq ft`;
}

/** "2026-10" -> "October 2026". */
export function formatMonth(value: string): string {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const LANDMARK_LABELS: Record<LandmarkKind, string> = {
  airport: "Airport",
  seaport: "Port",
  rail: "Rail",
  metro: "Metro",
  highway: "Highway",
  city: "City",
};
