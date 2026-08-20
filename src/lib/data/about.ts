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
  lede: "NDR Smart Spaces is a diversified infrastructure organization focused on developing, owning, and managing high-quality industrial, commercial and institutional assets.",
  cta: { label: "Our story", href: "#story" },
  ctaSecondary: { label: "Explore the business", href: "#business-model-title" },
  stats: [
    {
      label: "Founded",
      metric: "1954",
      source: "NDR Corporate Presentation, FY26",
    },
    {
      label: "Fortune Global 500 companies served",
      metric: "",
      count: { value: 100, suffix: "+" },
      source: "NDR Corporate Presentation, FY26",
    },
    {
      label: "Portfolio occupancy",
      metric: "",
      count: { value: 98, suffix: "%" },
      source: "NDR Corporate Presentation, FY26",
    },
  ] as readonly AboutHeroStat[],
} as const;

export const aboutStory = {
  eyebrow: "Our story",
  heading: "Three generations of building.",
  paragraphs: [
    "NDR began in 1954, when a family rooted in agriculture started with a modest land parcel and a rice mill. What followed was not a real estate company but a discipline: acquire land, build on it, and build institutions around it.",
    "In 1996 the group developed India's first private bonded warehouse — an industry first. In 2002, Lenovo's first industrial facility in India rose in Puducherry, built to international manufacturing and warehousing specifications two decades ahead of the industry.",
    "In 2015 NDR InvIT Trust was incorporated, and in 2018 it listed on the NSE through an INR 8.8 bn IPO — India's first warehousing InvIT. Today NDR Smart Spaces develops, owns and manages institutional-grade assets across the complete asset lifecycle, recycling capital from completed assets into new development.",
  ],
  quote: "A modest land parcel, a rice mill, and a multi-generational legacy.",
  quoteAttribution: "Mr. Naidu Dasarathi Rami Reddy · Founder, 1954",
} as const;

export type TimelineNode = {
  year: string;
  title: string;
  caption: string;
  detail: string;
};

export const aboutTimeline = {
  eyebrow: "The journey",
  heading: "1954 to today.",
  lede: "Six milestones from the group's own corporate record — evidence, not spectacle.",
  nodes: [
    {
      year: "1954",
      title: "Group founded",
      caption: "A family rooted in agriculture begins with a modest land parcel and a rice mill.",
      detail:
        "Land is the starting point of the entire model — acquired, entitled and built upon over generations.",
    },
    {
      year: "1996",
      title: "First bonded warehouse",
      caption: "India's first private bonded warehouse — an industry first for the group.",
      detail:
        "The move into institutional warehousing begins: spec-built, strategically located, developed to a standard the market had not yet asked for.",
    },
    {
      year: "2002",
      title: "Lenovo Puducherry",
      caption: "Lenovo's first industrial facility in India, built under NDR Warehousing.",
      detail:
        "Delivered to international manufacturing and warehousing specifications — two decades ahead of the industry.",
    },
    {
      year: "2015",
      title: "NDR InvIT Trust incorporated",
      caption: "The group's infrastructure investment trust is established.",
      detail:
        "The capital channel is formed — the vehicle through which completed assets are offered to NDR InvIT.",
    },
    {
      year: "2018",
      title: "InvIT listed",
      caption: "NDR InvIT lists on the NSE through an INR 8.8 bn IPO.",
      detail:
        "India's first warehousing InvIT — the group's development platform is now visible to public-market investors.",
    },
    {
      year: "2025–26",
      title: "SPV transfers",
      caption: "MLG (INR 143.9 cr) and SPV transfers to NDR InvIT complete the capital cycle.",
      detail: "Capital recycles into new development — the loop closes and begins again.",
    },
  ] as readonly TimelineNode[],
} as const;

export const aboutPrinciples = {
  eyebrow: "Vision · Mission · Values",
  heading: "What we are building toward.",
  lede: "The operating principles that govern the organization — stated plainly, reported annually.",
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
    {
      index: "03",
      title: "Values",
      values: [
        {
          name: "Governance",
          line: "Prudent management and governance, reported as a discipline.",
        },
        {
          name: "Capital discipline",
          line: "A transparent, disciplined engine that recycles capital into new development.",
        },
        {
          name: "Long-term partnership",
          line: "Over 60 years of relationships serving 100+ Fortune Global 500 companies.",
        },
      ],
    },
  ],
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

export const leadership = {
  eyebrow: "Leadership",
  heading: "The people behind the platform.",
  lede: "Profiles are published as photography and biographies are confirmed by the board.",
  placeholderTitle: "Executive seat",
  placeholderStatus: "Official profile pending",
  placeholderNote: "Reserved for board confirmation",
  profiles: [] as readonly LeadershipProfile[],
  placeholderSlots: 4,
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
