export type CounterStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: boolean;
};

export type AboutHeroStat = {
  label: string;
  metric: string;
  count?: CounterStat;
  source: string;
};

export const aboutHero = {
  eyebrow: "About NDR Smart Spaces · Est. 2025",
  headline: "From a rice mill to ",
  headlineAccent: "institutional infrastructure.",
  lede: "NDR Smart Spaces Private Limited is an infra development and real estate platform of the NDR Group, incorporated in February 2025, focused on logistics and industrial infrastructure as well as residential and commercial plots.",
  cta: { label: "Our story", href: "#story" },
  ctaSecondary: { label: "Explore the business", href: "/en/business/grade-a-warehousing/" },
  stats: [
    {
      label: "GROUP FOUNDED",
      metric: "1954",
      source: "NDR Corporate Presentation, FY26",
    },
    {
      label: "NDRW ACTIVE OPERATIONS",
      metric: "2001",
      source: "NDR Corporate Presentation, FY26",
    },
    {
      label: "NDR SMART SPACES INCORPORATED",
      metric: "2025",
      source: "NDR Corporate Presentation, FY26",
    },
  ] as readonly AboutHeroStat[],
} as const;

export const aboutStory = {
  eyebrow: "Our story",
  heading: "Three generations of building.",
  paragraphs: [
    "The NDR Group was founded in 1954 by the late Mr. Naidu Dasaratha Rami Reddy. It began with a modest land parcel and a vision to establish a rice mill, marking the start of entrepreneurship in a family rooted in agriculture. His pioneering spirit laid the foundation for a multi-generational legacy of growth and innovation.",
    "Since 2002, under the leadership of Mr. N. Amrutesh Reddy, the company has achieved significant scale, attracted marquee investors and executed strategic acquisitions to strengthen its market position. Today, Mr. N. Amrutesh Reddy is steering the organization into a new phase of growth and modernization, focused on redefining India's warehousing, industrial parks and logistics landscape through institutional-grade A infrastructure, sustainability, and technology integration.",
  ],
  quote: "A modest land parcel, a rice mill, and a multi-generational legacy.",
  quoteAttribution: "Mr. Naidu Dasaratha Rami Reddy · Founder, 1954",
} as const;

export type TimelineNode = {
  year: string;
  title: string;
  caption?: string;
  detail?: string;
};

export const aboutTimeline = {
  eyebrow: "The journey",
  heading: "1954 to today.",
  nodes: [
    {
      year: "1954",
      title: "NDR Group began",
    },
    {
      year: "1979",
      title: "First private bonded warehouse",
    },
    {
      year: "2002",
      title: "India's first IBM (now Lenovo) facility",
    },
    {
      year: "2023",
      title: "NDR Group incorporated NDR InvIT Trust",
    },
    {
      year: "2024",
      title: "NDR InvIT Trust listed on NSE, offer size INR 8.8 bn",
    },
    {
      year: "2025",
      title: "NDR Smart Spaces incorporated and applied for demerger from NDR Warehousing",
    },
    {
      year: "2027",
      title: "Planned IPO",
    },
  ] as readonly TimelineNode[],
} as const;

export const aboutPrinciples = {
  eyebrow: "Vision · Mission",
  heading: "What we are building toward.",
  lede: "The operating principles that govern the organization.",
  columns: [
    {
      index: "01",
      title: "Vision",
      body: "To build India's institutional-grade infrastructure from land to listed assets — the development platform behind the institutions that power growth.",
    },
    {
      index: "02",
      title: "Mission",
      body: "Develop, own and manage high-quality industrial, commercial and institutional assets across the complete asset lifecycle — from conceptualization and development to operations, leasing and investment management.",
    },
  ],
  image: {
    src: "",
    alt: "Image pending",
    caption: "Image to be supplied by the client.",
  },
} as const;

export const businessModel = {
  eyebrow: "Integrated business model",
  heading: "The complete asset lifecycle.",
  lede: "One integrated chain, owned end to end — land in, listed assets out, capital recycled back to land.",
  returnLabel: "Back to land",
  returnCaption: "Proceeds recycle into new development — the loop closes and begins again.",
  steps: [
    {
      index: "01",
      name: "Land",
      caption: "Acquisition, entitlement and planning — a modest land parcel begins the journey.",
    },
    {
      index: "02",
      name: "Planning",
      caption: "Master planning and approvals before a single foundation is laid.",
    },
    {
      index: "03",
      name: "Development",
      caption: "Conceptualization, design and delivery of institutional-grade assets.",
    },
    {
      index: "04",
      name: "Industrial Infrastructure",
      caption: "High-quality industrial, commercial and institutional assets for global occupiers.",
    },
    {
      index: "05",
      name: "Warehousing",
      caption: "Grade A facilities near highways, ports, railways and airports.",
    },
    {
      index: "06",
      name: "Asset Management",
      caption:
        "End-to-end planning, execution and delivery, plus ongoing operations and maintenance.",
    },
    {
      index: "07",
      name: "NDR InvIT",
      caption: "Completed assets are offered to NDR InvIT under a Right of First Offer.",
    },
    {
      index: "08",
      name: "Capital recycling",
      caption: "Proceeds recycle into new development — a disciplined engine that keeps building.",
    },
  ],
} as const;

export type LeadershipProfile = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

export type LeadershipGroup = {
  id: string;
  title: string;
  placeholderTitle: string;
  placeholderStatus: string;
  placeholderNote: string;
  profiles: readonly LeadershipProfile[];
  placeholderSlots: number;
};

export const leadership = {
  eyebrow: "Leadership",
  heading: "The people behind the platform.",
  groups: [
    {
      id: "board-directors",
      title: "Board directors",
      placeholderTitle: "Director seat",
      placeholderStatus: "Official profile pending",
      placeholderNote: "Reserved for board confirmation",
      profiles: [] as readonly LeadershipProfile[],
      placeholderSlots: 3,
    },
    {
      id: "management-team",
      title: "The Management team",
      placeholderTitle: "Executive seat",
      placeholderStatus: "Official profile pending",
      placeholderNote: "Reserved for management confirmation",
      profiles: [] as readonly LeadershipProfile[],
      placeholderSlots: 4,
    },
  ],
} as const;

export const whyNdr = {
  eyebrow: "Why NDR",
  heading: "Reasons an institution builds with us.",
  lede: "Five strengths, each carried by a verifiable claim.",
  strengths: [
    {
      index: "01",
      title: "Governance",
      body: "Prudent management and governance, reported as a discipline.",
      proof: "AAA-rated entity · long-term bonds · long WALE · low receivable risk",
    },
    {
      index: "02",
      title: "Execution",
      body: "Institutional delivery from concept to completion.",
      proof: "6,00,000 sq ft delivered in 4 months · 99% greenfield",
    },
    {
      index: "03",
      title: "Capital discipline",
      body: "A transparent engine that recycles capital into new development.",
      proof: "Develop → stabilize → offer under ROFO → recycle",
    },
    {
      index: "04",
      title: "Long-term partnerships",
      body: "Relationships measured in decades, not deals.",
      proof: "100+ Fortune Global 500 companies served",
    },
    {
      index: "05",
      title: "Institutional credibility",
      body: "Backing from institutional investors who underwrite the platform.",
      proof: "Kotak Alternatives · Investcorp-led $55 mn",
    },
  ],
} as const;

export const aboutClosing = {
  eyebrow: "Next",
  heading: "From land to listed assets.",
  lede: "Explore the business, the portfolio and the capital model — or speak to the team building India's warehousing infrastructure.",
  primaryCta: { label: "Business Enquiry", href: "mailto:project@ndrsmart.com" },
  secondaryCta: { label: "Investor Centre", href: "https://ndrinvit.com" },
} as const;
