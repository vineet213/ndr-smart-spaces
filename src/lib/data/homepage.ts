export const hero = {
  eyebrow: "NDR Smart Spaces · Est. 1954",
  headline: "From land to listed assets.",
  subhead:
    "A diversified infrastructure organization developing, owning and managing institutional-grade industrial, commercial and institutional assets across India — and the development platform behind NDR InvIT, India's first warehousing InvIT.",
  primaryCta: { label: "Explore Our Business Verticals", href: "/en/business#verticals" },
  secondaryCta: { label: "Investor Centre", href: "/en/investor-centre" },
  stats: [
    { value: 60, suffix: "+", label: "Years of industrial experience" },
    { value: 100, suffix: "+", label: "Fortune Global 500 companies served" },
    { value: 98, suffix: "%", label: "Portfolio occupancy" },
  ],
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
  tier: "hub" | "satellite";
  x: number;
  y: number;
  line: string;
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

export const mapLocations: MapLocation[] = [
  { name: "Nallur", zone: "south", tier: "hub", x: 232, y: 453, line: "Chennai, Tamil Nadu" },
  {
    name: "Walajapet",
    zone: "south",
    tier: "satellite",
    x: 243,
    y: 460,
    line: "Chennai, Tamil Nadu",
  },
  {
    name: "Oragadam",
    zone: "south",
    tier: "satellite",
    x: 251,
    y: 455,
    line: "Chennai, Tamil Nadu",
  },
  {
    name: "Krishnapuram Kandigai",
    zone: "south",
    tier: "satellite",
    x: 255,
    y: 461,
    line: "Chennai, Tamil Nadu",
  },
  { name: "Bidadi", zone: "south", tier: "hub", x: 202, y: 458, line: "Bengaluru, Karnataka" },
  { name: "Hosur", zone: "south", tier: "satellite", x: 209, y: 462, line: "Tamil Nadu" },
  { name: "Kochi", zone: "south", tier: "satellite", x: 180, y: 514, line: "Kerala" },
  { name: "Hyderabad", zone: "west", tier: "hub", x: 221, y: 370, line: "Telangana" },
  { name: "Pune", zone: "west", tier: "hub", x: 132, y: 348, line: "Maharashtra" },
  { name: "Kolkata", zone: "east", tier: "hub", x: 393, y: 270, line: "West Bengal" },
  { name: "Varanasi", zone: "east", tier: "satellite", x: 309, y: 217, line: "Uttar Pradesh" },
  { name: "Lucknow", zone: "east", tier: "satellite", x: 269, y: 188, line: "Uttar Pradesh" },
  { name: "Kanpur", zone: "east", tier: "satellite", x: 258, y: 196, line: "Uttar Pradesh" },
  { name: "Ghaziabad", zone: "north", tier: "hub", x: 202, y: 151, line: "NCR, Uttar Pradesh" },
] as const;

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
    title: "SPV monetizations",
    caption: "MLG (INR 143.9 cr) and SPV transfers to NDR InvIT complete the capital cycle.",
  },
] as const;

export const businessHighlights = {
  eyebrow: "Business highlights",
  heading: "Three engines, one capital channel.",
  verticals: [
    {
      index: "01",
      title: "Grade A Warehousing",
      body: "Strategically located, spec-forward facilities near highways, ports, railways and airports — serving retail, e-commerce, 3PL and manufacturing.",
      proof: "99% greenfield",
      href: "/en/business/grade-a-warehousing",
    },
    {
      index: "02",
      title: "NDR Asset Management",
      body: "End-to-end project planning, execution and delivery, plus ongoing portfolio operations and maintenance.",
      proof: "100%-owned project management arm",
      href: "/en/business/ndr-asset-management",
    },
    {
      index: "03",
      title: "Residential Plotting — Ave Acres",
      body: "RERA-compliant plotted layouts developed through the group's plotting entity.",
      proof: "Trusted plotted development",
      href: "https://aveacres.com",
      external: true,
    },
  ],
  partnership: {
    title: "The NDR InvIT relationship",
    line: "Completed assets are offered to NDR InvIT under a Right of First Offer, recycling capital into new development. A transparent, disciplined engine that keeps building.",
    cta: { label: "The capital model", href: "/en/business/ndr-invit" },
  },
} as const;

export const investmentHighlights = {
  eyebrow: "Investment highlights",
  heading: "Develop. Stabilize. Monetize. Rebuild.",
  cycleNote:
    "Right of First Offer — NDR InvIT evaluates each eligible asset before any third party.",
  proof: [
    { name: "Kotak Alternatives", value: "Marquee institutional investor" },
    { name: "Investcorp-led $55 mn", value: "Growth capital round" },
    { name: "$100 mn US global PE", value: "$90 bn+ assets under management" },
    { name: "$60 mn global financial institution", value: "$15 bn across 400 companies" },
    { name: "AAA-rated entity", value: "Long-term bonds · long WALE · low receivable risk" },
    { name: "INR 143.9 cr MLG monetization", value: "SPV transfers to NDR InvIT" },
  ],
  resilience: [
    "Geographic, industry and client diversification",
    "Prudent management and governance",
    "Strong balance sheet",
  ],
  link: { label: "Investor Centre", href: "/en/investor-centre" },
} as const;

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

export const footer = {
  descriptor:
    "A diversified infrastructure organization developing, owning and managing institutional-grade industrial, commercial and institutional assets since 1954.",
  ecosystem: [
    { label: "NDR InvIT Trust", href: "https://ndrinvit.com", external: true },
    { label: "Ave Acres", href: "https://aveacres.com", external: true },
  ],
  sitemap: [
    { label: "About Us", href: "/en/about-us" },
    { label: "Business", href: "/en/business" },
    { label: "Portfolio", href: "/en/portfolio" },
    { label: "Investor Centre", href: "/en/investor-centre" },
    { label: "ESG", href: "/en/esg" },
    { label: "Media", href: "/en/media" },
    { label: "Contact", href: "/en/contact" },
  ],
  investor: [
    { label: "Investor Overview", href: "/en/investor-centre" },
    { label: "Reports & Disclosures", href: "/en/investor-centre/reports-disclosures" },
    { label: "Financial Results", href: "/en/investor-centre/financial-results" },
    { label: "Announcements", href: "/en/investor-centre/announcements" },
    { label: "Downloads", href: "/en/investor-centre/downloads" },
  ],
  contact: {
    address: "No. 56/1, next to GT Reddy Cars, Bazulla Road, T. Nagar, Chennai, Tamil Nadu 600017",
    emails: [
      { label: "compliance@ndrsmart.com", href: "mailto:compliance@ndrsmart.com" },
      { label: "project@ndrsmart.com", href: "mailto:project@ndrsmart.com" },
    ],
  },
  legal: [
    { label: "Privacy Policy", href: "/en/privacy-policy" },
    { label: "Terms & Conditions", href: "/en/terms" },
    { label: "Disclaimer", href: "/en/disclaimer" },
    { label: "Website Sitemap", href: "/en/sitemap" },
  ],
  copyright: "© 2026 NDR Smart Spaces Pvt. Ltd.",
} as const;
