/**
 * Fixed points used to give every warehouse page the same hero figures
 * (distance to the airport and to the city) when the site's valuation report
 * does not state them. Distances worked out from these are straight-line and
 * shown as approximate.
 */

export type ReferencePlace = { name: string; lat: number; lon: number };

export const AIRPORTS: readonly ReferencePlace[] = [
  { name: "Indira Gandhi International Airport", lat: 28.5562, lon: 77.1 },
  { name: "Chennai International Airport", lat: 12.9941, lon: 80.1709 },
  { name: "Tirupati Airport", lat: 13.6325, lon: 79.5434 },
  { name: "Coimbatore International Airport", lat: 11.03, lon: 77.0434 },
  { name: "Kempegowda International Airport", lat: 13.1986, lon: 77.7066 },
  { name: "Puducherry Airport", lat: 11.968, lon: 79.812 },
  { name: "Rajiv Gandhi International Airport", lat: 17.2403, lon: 78.4294 },
  { name: "Netaji Subhas Chandra Bose International Airport", lat: 22.6547, lon: 88.4467 },
  { name: "Aurangabad Airport", lat: 19.8627, lon: 75.3981 },
  { name: "Goa International Airport", lat: 15.3808, lon: 73.8314 },
  { name: "Navi Mumbai International Airport", lat: 18.9926, lon: 73.0702 },
  { name: "Chhatrapati Shivaji Maharaj International Airport", lat: 19.0896, lon: 72.8656 },
  { name: "Pune International Airport", lat: 18.5821, lon: 73.9197 },
  { name: "Surat Airport", lat: 21.1141, lon: 72.7418 },
  { name: "Chaudhary Charan Singh International Airport", lat: 26.7606, lon: 80.8893 },
  { name: "Cochin International Airport", lat: 10.152, lon: 76.4019 },
];

const CITIES = {
  bengaluru: { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  chennai: { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  coimbatore: { name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
  gurugram: { name: "Gurugram", lat: 28.4595, lon: 77.0266 },
  hyderabad: { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  kochi: { name: "Kochi", lat: 9.9816, lon: 76.2999 },
  kolkata: { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  lucknow: { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  mumbai: { name: "Mumbai", lat: 18.9402, lon: 72.8356 },
  naviMumbai: { name: "Navi Mumbai", lat: 19.033, lon: 73.0297 },
  newDelhi: { name: "New Delhi", lat: 28.6315, lon: 77.2167 },
  panaji: { name: "Panaji", lat: 15.4909, lon: 73.8278 },
  puducherry: { name: "Puducherry", lat: 11.9416, lon: 79.8083 },
  pune: { name: "Pune", lat: 18.5204, lon: 73.8567 },
  // short form: the full "Chhatrapati Sambhajinagar" does not fit a hero figure label
  sambhajinagar: { name: "Sambhajinagar", lat: 19.8762, lon: 75.3433 },
  surat: { name: "Surat", lat: 21.1702, lon: 72.8311 },
} satisfies Record<string, ReferencePlace>;

/** The city a warehouse is measured to, keyed by the ledger's `city`. */
export const CITY_FOR_LEDGER_CITY: Readonly<Record<string, ReferencePlace>> = {
  Bhiwandi: CITIES.mumbai,
  Bidadi: CITIES.bengaluru,
  Chennai: CITIES.chennai,
  "Chhatrapati Sambhajinagar": CITIES.sambhajinagar,
  Coimbatore: CITIES.coimbatore,
  Hoskote: CITIES.bengaluru,
  Hosur: CITIES.bengaluru,
  Hyderabad: CITIES.hyderabad,
  Kochi: CITIES.kochi,
  Kolkata: CITIES.kolkata,
  "Mohanlal Ganj": CITIES.lucknow,
  "New Delhi": CITIES.newDelhi,
  Oragadam: CITIES.chennai,
  Puducherry: CITIES.puducherry,
  Pune: CITIES.pune,
  Sidlaghatta: CITIES.bengaluru,
  Sohna: CITIES.gurugram,
  "Sri City": CITIES.chennai,
  "Surat Kosamba": CITIES.surat,
  Tauru: CITIES.gurugram,
  Uran: CITIES.naviMumbai,
  Verna: CITIES.panaji,
};
