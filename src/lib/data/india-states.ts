/**
 * India states and union territories — canonical identifiers for the portfolio
 * atlas and the CMS state selects.
 *
 * The ids are stable slugs used by the generated state geometry
 * (`india-state-paths.ts`) and by the CMS records (`locations.state`,
 * `land-bank.state`). The names are the official display forms used verbatim
 * in the admin select options. Geometry is maintained separately by
 * `scripts/generate-india-states.mjs`; this list is hand-frozen.
 */

export type IndianState = { id: string; name: string };

export const INDIAN_STATES: readonly IndianState[] = [
  { id: "andhra-pradesh", name: "Andhra Pradesh" },
  { id: "arunachal-pradesh", name: "Arunachal Pradesh" },
  { id: "assam", name: "Assam" },
  { id: "bihar", name: "Bihar" },
  { id: "chhattisgarh", name: "Chhattisgarh" },
  { id: "goa", name: "Goa" },
  { id: "gujarat", name: "Gujarat" },
  { id: "haryana", name: "Haryana" },
  { id: "himachal-pradesh", name: "Himachal Pradesh" },
  { id: "jharkhand", name: "Jharkhand" },
  { id: "karnataka", name: "Karnataka" },
  { id: "kerala", name: "Kerala" },
  { id: "madhya-pradesh", name: "Madhya Pradesh" },
  { id: "maharashtra", name: "Maharashtra" },
  { id: "manipur", name: "Manipur" },
  { id: "meghalaya", name: "Meghalaya" },
  { id: "mizoram", name: "Mizoram" },
  { id: "nagaland", name: "Nagaland" },
  { id: "odisha", name: "Odisha" },
  { id: "punjab", name: "Punjab" },
  { id: "rajasthan", name: "Rajasthan" },
  { id: "sikkim", name: "Sikkim" },
  { id: "tamil-nadu", name: "Tamil Nadu" },
  { id: "telangana", name: "Telangana" },
  { id: "tripura", name: "Tripura" },
  { id: "uttar-pradesh", name: "Uttar Pradesh" },
  { id: "uttarakhand", name: "Uttarakhand" },
  { id: "west-bengal", name: "West Bengal" },
  { id: "andaman-and-nicobar-islands", name: "Andaman & Nicobar Islands" },
  { id: "chandigarh", name: "Chandigarh" },
  {
    id: "dadra-and-nagar-haveli-and-daman-and-diu",
    name: "Dadra & Nagar Haveli and Daman & Diu",
  },
  { id: "delhi", name: "Delhi" },
  { id: "jammu-and-kashmir", name: "Jammu & Kashmir" },
  { id: "ladakh", name: "Ladakh" },
  { id: "lakshadweep", name: "Lakshadweep" },
  { id: "puducherry", name: "Puducherry" },
] as const;

export const INDIAN_STATE_NAMES: readonly string[] = INDIAN_STATES.map((state) => state.name);

const STATE_BY_NAME = new Map<string, IndianState>(
  INDIAN_STATES.map((state) => [state.name.toLowerCase(), state]),
);

const STATE_BY_ID = new Map<string, IndianState>(
  INDIAN_STATES.map((state) => [state.id, state]),
);

/** Resolve a state by its display name (case-insensitive); null when unknown. */
export function indianStateByName(name: string): IndianState | null {
  return STATE_BY_NAME.get(name.trim().toLowerCase()) ?? null;
}

/** Resolve a state by its slug id; null when unknown. */
export function indianStateById(id: string): IndianState | null {
  return STATE_BY_ID.get(id) ?? null;
}
