import type { MastheadTitle } from "@/components/sections/PageMasthead";
import type { ClosingCtaData } from "@/components/sections/ClosingCta";
import type { CompanyMetric } from "./homepage";
import { metrics } from "./generated/metrics";

/**
 * The Why NDR page (/why-ndr/). Every claim here is already published
 * elsewhere on the site: figures come from the corporate-presentation
 * metrics, the About timeline and the business pages. The five strengths
 * ledger reuses `whyNdr` from ./about.
 */

const metric = (key: string): string => metrics.find((m) => m.key === key)?.value ?? "";

export const whyMasthead = {
  title: { before: "Built to be ", accent: "relied on." } satisfies MastheadTitle,
  subtext:
    "Since 1954 the NDR Group has turned land into infrastructure that India's businesses depend on. Today that is 46 parks and around 25 million sq ft under management.",
};

export const whyProof: readonly CompanyMetric[] = [
  { value: 46, label: "PARKS", context: "PARKS ACROSS INDIA" },
  { value: 25, suffix: " MN", label: "SQ FT UNDER MANAGEMENT", context: "SQ FT UNDER MANAGEMENT" },
  { value: 98, suffix: "%", label: "PORTFOLIO OCCUPANCY", context: "PORTFOLIO OCCUPANCY" },
  {
    value: 100,
    suffix: "+",
    label: "FORTUNE GLOBAL 500 COMPANIES SERVED",
    context: "FORTUNE GLOBAL 500 COMPANIES SERVED",
  },
];

export type AudienceReason = { title: string; body: string; proof: string };

export type Audience = {
  id: string;
  tab: string;
  heading: string;
  lede: string;
  reasons: readonly AudienceReason[];
  cta: { label: string; href: string };
};

export const whyAudiences = {
  eyebrow: "Who are you building for?",
  heading: "One platform. Three reasons to choose it.",
  audiences: [
    {
      id: "occupiers",
      tab: "Occupiers",
      heading: "Space that is ready when your business is.",
      lede: "We start with your operation and build the facility around it, then stay on to run it.",
      reasons: [
        {
          title: "Built around your brief",
          body: "Built-to-suit since 2001: layouts, specifications and timelines are set by how your operation works.",
          proof: metric("M14"),
        },
        {
          title: "Delivered at pace",
          body: "One team carries a project from land identification to handover, so nothing is lost between stages.",
          proof: "6,00,000 sq ft delivered in 4 months",
        },
        {
          title: "Run well after handover",
          body: "NDR Asset Management looks after facilities, security, soft services and compliance across the park.",
          proof: `${metric("M3")} portfolio occupancy`,
        },
      ],
      cta: { label: "Business Enquiry", href: "/contact#business-enquiry" },
    },
    {
      id: "investors",
      tab: "Investors",
      heading: "A platform with institutional discipline.",
      lede: "Governance, a clear capital cycle and long-standing institutional backing.",
      reasons: [
        {
          title: "Prudent governance",
          body: "Strong governance, long-term financing and long leases with low receivable risk.",
          proof: metric("M15"),
        },
        {
          title: "A clear capital cycle",
          body: "Assets are developed and stabilised, offered to NDR InvIT under a right of first offer, and the capital is recycled into new development.",
          proof: "Develop → stabilise → ROFO → recycle",
        },
        {
          title: "Institutional backing",
          body: "Investors across two decades include IL&FS, Warburg Pincus, IFC, Kotak and Investcorp.",
          proof: "IFC ₹225 crore equity, 2026",
        },
      ],
      cta: { label: "Investor Centre", href: "/investor-centre/corporate-governance" },
    },
    {
      id: "partners",
      tab: "Partners",
      heading: "Relationships that last for decades.",
      lede: "Landowners, contractors and consultants work with a group that has been building since 1954.",
      reasons: [
        {
          title: "Continuity",
          body: "Seven decades of one group, with the leadership and balance sheet to see long projects through.",
          proof: "Building since 1954",
        },
        {
          title: "A documented standard",
          body: "Every project follows the same documented stages, from due diligence and approvals to design, construction and handover.",
          proof: "Land to handover, stage by stage",
        },
        {
          title: "Scale to grow with",
          body: "A development pipeline across India's main logistics markets, with 10 MN sq ft under construction.",
          proof: metric("M6"),
        },
      ],
      cta: { label: "Contact us", href: "/contact" },
    },
  ] satisfies readonly Audience[],
};

export const whyFirsts = {
  eyebrow: "Track record",
  heading: "A record of firsts.",
  lede: "Some of the milestones that set the standard others now build to.",
  firsts: [
    { year: "1998", title: "India's first private bonded warehouse" },
    { year: "2001", title: "NDR Warehousing's first modern built-to-suit structure" },
    { year: "2022", title: "First 1 MN sq ft parks, at Chennai and Coimbatore" },
    { year: "2023", title: "India's first perpetual warehousing InvIT" },
    { year: "2026", title: "IFC invests ₹225 crore in NDR Smart Spaces" },
  ],
};

/**
 * Inside an NDR park: the green features from the ESG page, each pinned to
 * where it sits on the section drawing (x, y: its marker in the drawing's
 * 1000 × 520 viewBox).
 */
export const whyAnatomy = {
  eyebrow: "Inside an NDR park",
  heading: "Sustainability is drawn in, not added on.",
  lede: "The measures that go into every NDR park, from the roof down to the ground beneath the yard.",
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

export const whyCycle = {
  eyebrow: "Land to listed asset",
  heading: "One partner for the whole life of an asset.",
  lede: "We develop, stabilise and run each park, then offer it to NDR InvIT under a right of first offer, and the capital goes back into the next one.",
  links: [
    {
      label: "Development lifecycle",
      href: "/business/ndr-asset-management/development-lifecycle",
    },
    { label: "NDR Asset Management", href: "/business/ndr-asset-management" },
  ],
};

export const whyReach = {
  eyebrow: "Where we build",
  heading: "Within reach of around 80% of India's consumption markets.",
  lede: "Parks along the country's main logistics corridors, close to highways, ports, railways and airports.",
  cities: metric("M16")
    .split("·")
    .map((city) => city.trim())
    .filter(Boolean),
  link: {
    label: "Explore the portfolio",
    href: "/business/logistics-and-industrial-infrastructure#register",
  },
};

export const whyClosing = {
  eyebrow: "Next",
  heading: "Build your next facility with NDR.",
  lede: "Tell us what your operation needs, or explore how the platform is governed and financed.",
  primaryCta: { label: "Business Enquiry", href: "/contact#business-enquiry" },
  secondaryCta: { label: "Investor Centre", href: "/investor-centre/corporate-governance" },
} as const satisfies ClosingCtaData;
