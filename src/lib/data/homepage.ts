import { footer as cmsFooter } from "./generated/footer";
import { locations as cmsLocations } from "./generated/locations";
import { metrics as cmsMetrics } from "./generated/metrics";
import { businessVerticals as cmsVerticals } from "./generated/businessVerticals";

const HERO_STAT_KEYS = [
  { key: "M1", label: "Years of industrial experience" },
  { key: "M5", label: "Fortune Global 500 companies served" },
  { key: "M3", label: "Portfolio occupancy" },
] as const;

function heroStatValue(raw: string): number {
  const match = /^([0-9]+(?:\.[0-9]+)?)/.exec(raw);
  return match ? Number(match[1]) : 0;
}

function heroStatSuffix(raw: string): string {
  const match = /^[0-9][0-9,.]*([+%]?)/.exec(raw);
  return match ? match[1] : "";
}

const heroStats: readonly { value: number; suffix: string; label: string }[] = HERO_STAT_KEYS.map(
  ({ key, label }) => {
    const metric = cmsMetrics.find((entry) => entry.key === key);
    const raw = metric?.value ?? "";
    return { value: heroStatValue(raw), suffix: heroStatSuffix(raw), label };
  },
);

export const hero = {
  eyebrow: "NDR Smart Spaces · Est. 2025",
  headline: "From land to listed assets.",
  subhead:
    "A diversified infrastructure organization developing, owning and managing institutional-grade industrial, commercial and institutional assets across India — and the development platform behind NDR InvIT, India's first warehousing InvIT.",
  primaryCta: { label: "Explore Our Business Verticals", href: "/en/business#verticals" },
  secondaryCta: { label: "Investor Centre", href: "/en/investor-centre" },
  stats: heroStats,
  statsSource: "Source: NDR Corporate Presentation, FY26",
  image: null as { src: string; alt: string } | null,
} as const;

export const audienceRoutes = [
  {
    label: "Investors",
    descriptor: "Reports, disclosures, governance",
    href: "/en/investor-centre",
  },
  {
    label: "Corporate clients",
    descriptor: "Warehouses & industrial space",
    href: "/en/portfolio",
  },
  {
    label: "Business partners",
    descriptor: "Land, development, JVs",
    href: "/en/business",
  },
  {
    label: "Media",
    descriptor: "News, press, gallery",
    href: "/en/media",
  },
] as const;

export type ZoneId = "south" | "west" | "east" | "north";

export type MapLocation = {
  name: string;
  zone: ZoneId;
  tier: "hq" | "hub" | "satellite";
  x: number;
  y: number;
  line: string;
  leaderTo?: { x: number; y: number };
};

export const zones = [
  {
    id: "south",
    name: "South",
    fact: "Chennai, Bidadi, Hosur, Kochi — warehousing corridors of Tamil Nadu and Karnataka.",
  },
  {
    id: "west",
    name: "West",
    fact: "Hyderabad and Pune — major production and consumption centres.",
  },
  {
    id: "east",
    name: "East",
    fact: "Kolkata, Varanasi, Lucknow, Kanpur — a rising consumption belt.",
  },
  {
    id: "north",
    name: "North",
    fact: "Ghaziabad — a gateway to the NCR market.",
  },
] as const satisfies ReadonlyArray<{ id: ZoneId; name: string; fact: string }>;

export const portfolioPresence = {
  eyebrow: "Portfolio presence",
  heading: "A pan-India footprint.",
  lede: "Strategically located at ports, national highways, railways and airports — giving access to ~80% of India's consumption markets.",
  viewPortfolio: "View Portfolio",
} as const;

const HOMEPAGE_MAP_NAMES: Record<string, string> = { Chennai: "Headquarters" };

const homepageMapLocations: MapLocation[] = [];

for (const location of cmsLocations) {
  if (!("homepageOffset" in location) || !location.visible.homepage) continue;
  const offset = location.homepageOffset;
  homepageMapLocations.push({
    name: HOMEPAGE_MAP_NAMES[location.name] ?? location.name,
    zone: location.zone,
    tier: location.tier,
    x: offset.x,
    y: offset.y,
    line: location.line,
    ...("leaderTo" in offset ? { leaderTo: offset.leaderTo } : {}),
  });
}

export const mapLocations: MapLocation[] = homepageMapLocations;

export const companyOverview = {
  eyebrow: "Company overview",
  heading: "Developing, owning and managing.",
  lede: "NDR Smart Spaces is a diversified infrastructure organization focused on developing, owning, and managing high-quality industrial, commercial and institutional assets.",
  body: "The company combines expertise in real estate development and grade A warehousing for over 60 years. Its integrated approach spans the complete asset lifecycle — from conceptualization and development to operations, leasing, and investment management.",
  link: { label: "Our journey", href: "#journey" },
} as const;

export const journey = [
  {
    year: "1954",
    title: "Group founded",
    caption: "A family rooted in agriculture begins with a modest land parcel and a rice mill.",
  },
  {
    year: "1996",
    title: "First bonded warehouse",
    caption: "India's first private bonded warehouse — an industry first for the group.",
  },
  {
    year: "2002",
    title: "Lenovo Puducherry",
    caption: "First warehouse under NDR Warehousing; Lenovo's first industrial facility in India.",
  },
  {
    year: "2015",
    title: "NDR InvIT Trust incorporated",
    caption: "The group's infrastructure investment trust is established.",
  },
  {
    year: "2018",
    title: "InvIT listed",
    caption: "NDR InvIT lists on the NSE through an INR 8.8 bn IPO.",
  },
  {
    year: "2025–26",
    title: "SPV transfers",
    caption: "MLG (INR 143.9 cr) and SPV transfers to NDR InvIT complete the capital cycle.",
  },
] as const;

const BUSINESS_HIGHLIGHT_BODY: Record<string, string> = {
  "01": "Strategically located, spec-forward facilities near highways, ports, railways and airports — serving retail, e-commerce, 3PL and manufacturing.",
  "02": "End-to-end project planning, execution and delivery, plus ongoing portfolio operations and maintenance.",
  "03": "RERA-compliant plotted layouts developed through the group's plotting entity.",
};

const BUSINESS_HIGHLIGHT_PROOF: Record<string, string> = {
  "01": "99% greenfield",
  "02": "100%-owned project management arm",
  "03": "Trusted plotted development",
};

export const businessHighlights = {
  eyebrow: "Business highlights",
  heading: "Three engines, one capital channel.",
  verticals: cmsVerticals.map((vertical) => ({
    index: vertical.index,
    title: vertical.title,
    body: BUSINESS_HIGHLIGHT_BODY[vertical.index] ?? "",
    proof: BUSINESS_HIGHLIGHT_PROOF[vertical.index] ?? "",
    href: vertical.route.href,
    ...("external" in vertical.route && vertical.route.external ? { external: true } : {}),
  })),
  partnership: {
    title: "The NDR InvIT relationship",
    line: "Completed assets are offered to NDR InvIT under a Right of First Offer, recycling capital into new development. A transparent, disciplined engine that keeps building.",
    cta: { label: "The capital model", href: "/en/business#execution" },
  },
};

export const featuredProjects = {
  eyebrow: "Featured projects",
  heading: "Proof, delivered on time.",
  primary: {
    eyebrow: "Featured · 01",
    title: "Amazon Fulfilment Centre, Coimbatore",
    narrative:
      "A Grade-A, air-conditioned warehouse spanning 6,00,000 sq ft — including a 2,00,000 sq ft mezzanine — conceptualized, designed and delivered in 4 months to institutional ESG standards.",
    facts: [
      { value: 600000, unit: "sq ft", label: "Grade-A area", format: true },
      { value: 4, unit: "months", label: "Concept to delivery", format: true },
      { value: "Amazon", unit: "", label: "Occupier", format: false },
      { value: "ESG", unit: "standards", label: "Institutional benchmark", format: false },
    ],
    link: { label: "Explore the portfolio", href: "/en/portfolio" },
  },
  secondary: {
    eyebrow: "Featured · 02",
    title: "Lenovo Industrial Facility, Puducherry",
    narrative:
      "Lenovo's first industrial facility in India (2002), built to international manufacturing and warehousing specifications — two decades ahead of the industry.",
    link: { label: "Project details", href: "/en/portfolio" },
  },
} as const;

export const marqueeClients = {
  claim: "Serving 100+ Fortune Global 500 companies",
  subline: "Across retail, e-commerce, 3PL, FMCG and industrial manufacturing.",
  clients: [
    "Amazon",
    "Samsung",
    "Lenovo",
    "Philips",
    "Flipkart",
    "LG",
    "ITC",
    "Dabur",
    "Godrej",
    "FedEx",
    "Apollo Tyres",
    "Goodyear",
    "JSW",
    "Pepsi",
    "Mahindra Logistics",
    "Kuehne+Nagel",
  ] as const,
} as const;

export type EsgPillar = {
  index: string;
  title: string;
  body: string;
};

export type EsgContent = {
  eyebrow: string;
  heading: string;
  lede: string;
  pillars: readonly EsgPillar[];
  link: { label: string; href: string };
};

export const esg: EsgContent | null = null;

export type LatestUpdate = {
  date: string;
  category: string;
  title: string;
  href: string;
};

export const latestUpdates: readonly LatestUpdate[] = [];

export type ContactInfoItem = {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

export const contact = {
  eyebrow: "Contact",
  heading: "Speak to our team.",
  info: [
    {
      label: "Corporate office",
      value: "No. 56/1, next to GT Reddy Cars, Bazulla Road, T. Nagar, Chennai, Tamil Nadu 600017",
    },
    {
      label: "Business enquiry",
      value: "compliance@ndrsmart.com · project@ndrsmart.com",
      href: "mailto:compliance@ndrsmart.com",
    },
    {
      label: "Directions",
      value: "Open in Google Maps",
      href: "https://www.google.com/maps/dir/13.0520847,80.246055/NDR+INVIT,+56-79,+Bazulla+Rd,+Bharathy+Nagar,+Rama+Kamat+Puram,+Chennai,+Greater+Chennai,+Tamil+Nadu+600017",
      external: true,
    },
  ] as ContactInfoItem[],
  form: {
    heading: "Business Enquiry",
    fields: [
      { name: "name", label: "Name", type: "text", autocomplete: "name", required: true },
      { name: "email", label: "Work email", type: "email", autocomplete: "email", required: true },
      {
        name: "company",
        label: "Company",
        type: "text",
        autocomplete: "organization",
        required: true,
      },
    ] as const,
    enquiryTypes: [
      "Grade A Warehousing",
      "Asset Management",
      "Land & Plotting",
      "Business Partnership",
      "Investor Relations",
    ] as const,
    messageLabel: "Message",
    submit: "Send enquiry",
    sending: "Sending…",
    success: "Thank you — your enquiry has been routed.",
    route: {
      "Investor Relations": "compliance@ndrsmart.com",
      default: "project@ndrsmart.com",
    } as const,
  },
} as const;

export const footer = cmsFooter;
