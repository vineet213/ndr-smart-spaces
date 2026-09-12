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

export type HeroCta = { label: string; href: string };

export const hero: {
  headline: string;
  subhead: string;
  primaryCta?: HeroCta;
  stats: typeof heroStats;
  statsSource: string;
  image: { src: string; alt: string } | null;
} = {
  headline: "From land to listed assets.",
  subhead:
    "A diversified infrastructure organization developing, owning and managing institutional-grade industrial, commercial and institutional assets across India — and the development platform behind NDR InvIT, India's first warehousing InvIT.",
  stats: heroStats,
  statsSource: "Source: NDR Corporate Presentation, FY26",
  image: null,
};

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
    href: "/en/business/logistics-and-industrial-infrastructure",
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
    fact: "Chennai, Hyderabad, Bidadi, Hosur, Kochi — warehousing corridors of Tamil Nadu, Karnataka and Telangana.",
  },
  {
    id: "west",
    name: "West",
    fact: "Pune — a major production and consumption centre.",
  },
  {
    id: "east",
    name: "East",
    fact: "Kolkata, Varanasi — a rising consumption belt.",
  },
  {
    id: "north",
    name: "North",
    fact: "Ghaziabad, Lucknow, Kanpur — a gateway to the NCR and the northern consumption belt.",
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

export type CompanyOverviewSegment = { text: string; bold?: boolean };

export const companyOverview = {
  eyebrow: "Company overview",
  heading: "Developing, owning and managing.",
  lede: "NDR Smart Spaces is a diversified infrastructure organization focused on developing, owning, and managing high-quality industrial, commercial and institutional assets.",
  // Client-provided copy, reproduced verbatim (including the deliberately
  // unfinished final sentence) — do not rewrite, shorten or complete it.
  paragraphs: [
    [
      { text: "NDR Smart Spaces Private Limited", bold: true },
      { text: " is the infrastructure development and real estate platform of the " },
      { text: "NDR Group", bold: true },
      {
        text:
          ", established to spearhead the Group’s development initiatives across logistics, industrial, residential and commercial segments. The company was formed pursuant to the demerger of the infrastructure development business of ",
      },
      { text: "NDR Warehousing Private Limited", bold: true },
      {
        text:
          ", in accordance with the order of the National Company Law Tribunal (NCLT). The demerger created a dedicated platform with a clear focus on infrastructure and real estate development, enabling greater operational focus, agility and scalability.",
      },
    ],
    [
      { text: "NDR Smart Spaces is focused on the " },
      {
        text: "development of logistics and industrial infrastructure, as well as residential and commercial plotted developments",
        bold: true,
      },
      {
        text: ", supporting the evolving requirements of businesses, investors and communities across India.",
      },
    ],
    [
      { text: "In addition to development activities, the Company provides " },
      { text: "project management consultancy services", bold: true },
      {
        text: ", supporting the planning, execution and coordination of infrastructure and real estate projects.",
      },
    ],
    [
      { text: "Backed by the experience and capabilities of the " },
      { text: "NDR Group", bold: true },
      {
        text:
          ", NDR Smart Spaces aims to build high-quality, scalable and strategically located assets that contribute to India’s growing ",
      },
      { text: "logistics, industrial and real estate", bold: true },
    ],
  ] as CompanyOverviewSegment[][],
};

export type CompanyMetric = {
  value: number | null;
  label: string;
  context: string;
  prefix?: string;
  suffix?: string;
  format?: boolean;
  source?: string;
};

export const companyMetrics = [
  {
    value: 500,
    suffix: "+",
    label: "ACRES APPROX. LAND BANK",
    context: "ACRES APPROX. LAND BANK",
  },
  {
    value: 20,
    suffix: "+",
    label: "MARKETS · PRESENCE",
    context: "MARKETS · PRESENCE",
  },
  {
    value: 10,
    suffix: " Mn",
    label: "SQ FT IN PIPELINE",
    context: "SQ FT IN PIPELINE",
  },
] as const satisfies ReadonlyArray<CompanyMetric>;

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
    cta: {
      label: "The capital model",
      href: "/en/business/logistics-and-industrial-infrastructure",
    },
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
      "Logistics and Industrial Infrastructure",
      "Project and Operations Management Consultancy - NDR Asset Management",
      "Residential Plotting",
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
