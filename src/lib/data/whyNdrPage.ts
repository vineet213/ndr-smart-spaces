import { metrics } from "./generated/metrics";

/**
 * The Why NDR page (/why-ndr/). Every claim here is already published
 * elsewhere on the site: figures come from the corporate-presentation
 * metrics, the About timeline and the business pages.
 */

const metric = (key: string): string => metrics.find((m) => m.key === key)?.value ?? "";

export const whyHero = {
  kicker: "Why NDR",
  title: ["Built to be", "relied on."],
  lede: "Since 1954 the NDR Group has turned land into infrastructure India's businesses depend on. Today: 46 parks and around 25 million sq ft under management.",
  image: {
    src: "/images/lifecycle/09-asset-operations.jpg",
    alt: "Aerial view of an operating NDR warehouse park with trucks at the loading docks",
  },
  scrollHint: "Five reasons below",
};

export type Bay = {
  bay: string;
  title: string;
  line: string;
  proof: string;
  body: string;
};

export const whyBays = {
  heading: "Five reasons, behind five doors.",
  lede: "Each one is backed by something you can check. Open a bay to see it.",
  bays: [
    {
      bay: "01",
      title: "Governance",
      line: "Prudent management, strong governance.",
      proof: metric("M15"),
      body: "Long-term bond financing, long leases and low receivable risk, overseen by a board with independent representation.",
    },
    {
      bay: "02",
      title: "Execution",
      line: "Concept to completion under one roof.",
      proof: "6,00,000 sq ft delivered in 4 months",
      body: "Land, approvals, design and construction are run by one team, so nothing is lost between stages. 99% of our industrial projects are greenfield.",
    },
    {
      bay: "03",
      title: "Capital discipline",
      line: "Capital that keeps building.",
      proof: "Develop, stabilise, offer under ROFO, recycle",
      body: "Completed parks are offered to NDR InvIT under a right of first offer, and the capital goes straight back into new development.",
    },
    {
      bay: "04",
      title: "Partnerships",
      line: "Relationships that last decades.",
      proof: metric("M5"),
      body: "Amazon, Flipkart, Samsung, Lenovo, FedEx and Reliance are among the occupiers who run their operations from NDR parks.",
    },
    {
      bay: "05",
      title: "Credibility",
      line: "Backed by institutions.",
      proof: "IFC ₹225 crore equity, 2026",
      body: "Over two decades NDR has been backed by IL&FS, Warburg Pincus, IFC, Kotak and Investcorp.",
    },
  ] satisfies readonly Bay[],
};

/**
 * Inside an NDR park: the green features from the ESG page, each pinned to
 * where it sits on the section drawing (x, y: its marker in the drawing's
 * 1000 × 520 viewBox).
 */
export const whyAnatomy = {
  heading: "Sustainability is drawn in, not added on.",
  lede: "What goes into every NDR park, from the roof down to the ground beneath the yard. Hover a number to find it.",
  features: [
    {
      index: "01",
      title: "Rooftop solar",
      body: "On-site generation that cuts each asset's reliance on the grid.",
      x: 325,
      y: 140,
    },
    {
      index: "02",
      title: "Roof monitors",
      body: "Ridge ventilation and daylight for the floor below.",
      x: 495,
      y: 86,
    },
    {
      index: "03",
      title: "Cool-roof coatings",
      body: "Reflective coatings that keep heat off the roof.",
      x: 680,
      y: 140,
    },
    {
      index: "04",
      title: "Louvred façades",
      body: "Façades that let air move naturally through the shed.",
      x: 850,
      y: 262,
    },
    {
      index: "05",
      title: "Precast systems",
      body: "Factory-made wall systems that cut construction waste.",
      x: 205,
      y: 300,
    },
    {
      index: "06",
      title: "EV charging",
      body: "Charging points in parking areas and logistics yards.",
      x: 848,
      y: 352,
    },
    {
      index: "07",
      title: "Rainwater harvesting",
      body: "Runoff collected and returned to the ground through recharge pits.",
      x: 132,
      y: 474,
    },
    {
      index: "08",
      title: "STP & waste segregation",
      body: "A sewage treatment plant and source segregation in every park.",
      x: 690,
      y: 474,
    },
    {
      index: "09",
      title: "Plantation & green cover",
      body: "Tree cover that extends well beyond the built footprint.",
      x: 45,
      y: 330,
    },
  ],
};

/** The closing consignment note: the case in one document. */
export const whyWaybill = {
  heading: "The case, in one document.",
  number: "1954 / 46",
  fields: [
    {
      label: "Consignor",
      value: "NDR Smart Spaces Pvt. Ltd., an NDR Group platform, building since 1954",
    },
    { label: "Parks", value: "46" },
    { label: "Under management", value: "Around 25 MN sq ft" },
    { label: "Under construction", value: "10 MN sq ft" },
    { label: "Portfolio occupancy", value: metric("M3") },
    { label: "Reach", value: metric("M4") },
  ],
  markets: metric("M16")
    .split("·")
    .map((city) => city.trim())
    .filter(Boolean),
  firsts: [
    { year: "1998", title: "India's first private bonded warehouse" },
    { year: "2001", title: "First modern built-to-suit structure" },
    { year: "2022", title: "First 1 MN sq ft parks, Chennai and Coimbatore" },
    { year: "2023", title: "India's first perpetual warehousing InvIT" },
  ],
  consignee: "Your next facility",
  stamp: ["Built to be", "relied on"],
  primaryCta: { label: "Make a business enquiry", href: "/contact#business-enquiry" },
  secondaryCta: {
    label: "Visit the Investor Centre",
    href: "/investor-centre/corporate-governance",
  },
};
