import type { TimelineNode } from "./about";

/**
 * Investor Centre — The Financial Statement.
 * Single source of truth for every figure on the investor pages.
 * One stat, one source, everywhere (Design Direction §3.14).
 */

export type EntityRef = "ndr-smart-spaces" | "ndr-invit" | "ndr-group";

export type InvestorMetric = {
  id: string; // source-of-truth key ("M1"…"M16") — never the array index
  stat: string;
  value: string; // pre-formatted display value
  period: string; // reporting period, always stamped "as on"
  source: string; // one source per figure
  entity: EntityRef;
  lead?: boolean; // landing MetricsBand headline set
};

export const investorMasthead = {
  registry: "NDR Smart Spaces Pvt. Ltd. — an NDR Group platform",
  section: "Investor Centre",
  title: { before: "The ", accent: "financial", after: " statement." },
  asOn: "As on 31 March 2026",
  edition: "Edition FY26 · Volume I",
  watermark: "ST",
} as const;

export const investorEdition = {
  asOn: "As on 31 March 2026",
  edition: "Edition FY26",
} as const;

export const editorialStatement = {
  eyebrow: "The editorial statement",
  heading: "We report to you as fiduciaries.",
  statement:
    "This document is the investor record of NDR Smart Spaces — what the company owns, how its capital moves, how it is governed, and what it files. Every figure carries a source and a period; nothing is stated that is not reported.",
} as const;

export const investorContents = [
  { label: "Statement", href: "#statement", type: "anchor" },
  { label: "Capital strength", href: "#capital-strength", type: "anchor" },
  { label: "Capital cycle", href: "#capital-cycle", type: "anchor" },
  { label: "Governance", href: "/en/investor-centre/corporate-governance", type: "route" },
  { label: "Reports & Disclosures", href: "/en/investor-centre/reports-disclosures", type: "route" },
  { label: "Financial Results", href: "/en/investor-centre/financial-results", type: "route" },
  { label: "Annual Reports", href: "/en/investor-centre/annual-reports", type: "route" },
  { label: "Announcements", href: "/en/investor-centre/announcements", type: "route" },
  { label: "Downloads", href: "/en/investor-centre/downloads", type: "route" },
] as const;

/**
 * Single source-of-truth table. Periods flagged with * are client-confirm before
 * go-live (Design Direction §8 — final stat source list).
 */
export const investorMetrics: readonly InvestorMetric[] = [
  {
    id: "M1",
    stat: "Industrial experience",
    value: "60+ years",
    period: "As on FY26",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
    lead: true,
  },
  {
    id: "M2",
    stat: "Founded",
    value: "1954",
    period: "1954",
    source: "NDR Corporate Presentation · Group record",
    entity: "ndr-group",
  },
  {
    id: "M3",
    stat: "Portfolio occupancy",
    value: "98%",
    period: "As on 31 Mar 2026 *",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
    lead: true,
  },
  {
    id: "M4",
    stat: "Consumption-market access",
    value: "~80% of India's consumption markets",
    period: "As on FY26",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
    lead: true,
  },
  {
    id: "M5",
    stat: "Clientele",
    value: "100+ Fortune Global 500 companies",
    period: "As on FY26",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
    lead: true,
  },
  {
    id: "M6",
    stat: "Developer standing",
    value: "Fourth largest warehouse developer in India",
    period: "As on FY26",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
  },
  {
    id: "M7",
    stat: "NDR InvIT valuation",
    value: "₹5,000 cr",
    period: "As on FY26",
    source: "NDR Corporate Presentation",
    entity: "ndr-invit",
    lead: true,
  },
  {
    id: "M8",
    stat: "NDR InvIT IPO",
    value: "INR 8.8 bn (₹880 cr) · NSE listing",
    period: "2018",
    source: "NDR Corporate Presentation · NSE",
    entity: "ndr-invit",
  },
  {
    id: "M9",
    stat: "MLG monetization",
    value: "INR 143.9 cr, sold to NDR InvIT",
    period: "2025",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
  },
  {
    id: "M10",
    stat: "Institutional investment",
    value: "$100 mn — US-based global PE, $90 bn+ AUM",
    period: "2023–24 *",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
  },
  {
    id: "M11",
    stat: "Institutional investment",
    value: "$60 mn — global financial institution, $15 bn across 400 companies",
    period: "2023–24 *",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
  },
  {
    id: "M12",
    stat: "Fundraise",
    value: "$23 mn — US, UK and India private equity consortium",
    period: "2018 *",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
  },
  {
    id: "M13",
    stat: "Early institutional backing",
    value: "$7 mn — Kotak Alternatives",
    period: "2011",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
  },
  {
    id: "M14",
    stat: "Greenfield share",
    value: "99% of industrial projects greenfield",
    period: "As on FY26",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
  },
  {
    id: "M15",
    stat: "Debt standing",
    value: "Long-term bonds · AAA-rated entity",
    period: "As on FY26",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
  },
  {
    id: "M16",
    stat: "Geographic reach",
    value: "Mumbai · NCR · Bengaluru · Chennai · Kolkata · Pune · Goa · Hyderabad · Surat",
    period: "As on FY26",
    source: "NDR Corporate Presentation",
    entity: "ndr-smart-spaces",
  },
] as const;

export const leadMetrics = investorMetrics.filter((metric) => metric.lead);

export type CapitalCycleNode = {
  number: "01" | "02" | "03" | "04";
  label: string;
  caption: string;
};

export const capitalCycle = {
  eyebrow: "The capital cycle",
  heading: "How value is created.",
  lede:
    "Develop, stabilise, offer to NDR InvIT, recycle. Four steps, one loop — the company's capital story in five seconds.",
  nodes: [
    {
      number: "01",
      label: "Develop",
      caption: "Greenfield industrial and logistics assets, designed to institutional grade.",
    },
    {
      number: "02",
      label: "Stabilise",
      caption: "Assets complete and are leased to marquee occupiers.",
    },
    {
      number: "03",
      label: "Offer",
      caption: "NDR InvIT receives the Right of First Offer over eligible completed assets.",
    },
    {
      number: "04",
      label: "Recycle",
      caption: "Capital returns to new development.",
    },
  ] as readonly CapitalCycleNode[],
} as const;

export const capitalMarketTimeline = {
  eyebrow: "The capital-market record",
  heading: "How the platform was capitalised.",
  lede:
    "The investor's record of the group — distinct from the company's founding journey. Years flagged * are client-confirm.",
  nodes: [
    {
      year: "2011",
      title: "Kotak Alternatives backing",
      caption: "Early institutional investment in the warehousing platform.",
      detail: "Marquee institutional investor underwrites the development model.",
    },
    {
      year: "2015",
      title: "NDR InvIT Trust incorporated",
      caption: "The capital vehicle is established under the NDR group.",
      detail: "The channel through which completed assets are offered and monetized.",
    },
    {
      year: "2018",
      title: "NDR InvIT listed",
      caption: "India's first warehousing InvIT lists on the NSE through an INR 8.8 bn IPO.",
      detail: "The development platform becomes visible to public-market investors.",
    },
    {
      year: "2023–24 *",
      title: "$100 mn institutional investment",
      caption: "A US-based global private equity firm ($90 bn+ AUM) invests.",
      detail: "Institutional capital underwrites the next phase of development.",
    },
    {
      year: "2023–24 *",
      title: "$60 mn institutional investment",
      caption: "A global financial institution ($15 bn across 400 companies) invests.",
      detail: "Long-horizon financing for the warehousing portfolio.",
    },
    {
      year: "2025",
      title: "SPV monetizations",
      caption: "MLG (INR 143.9 cr) and three SPVs transfer to NDR InvIT.",
      detail: "Monetized capital recycles into new development — the loop closes.",
    },
    {
      year: "2026",
      title: "As on",
      caption: "The reporting date of this edition.",
      detail: "Figures current as on 31 March 2026, subject to the source list.",
    },
  ] as readonly TimelineNode[],
} as const;

export const invitRelationship = {
  eyebrow: "The NDR InvIT relationship",
  heading: "A matter of record.",
  body: [
    "NDR Smart Spaces and NDR InvIT are distinct entities under the NDR group. NDR Smart Spaces is the development platform; NDR InvIT owns and manages income-generating infrastructure assets. To facilitate this relationship, NDR Smart Spaces has granted NDR InvIT a Right of First Offer (ROFO) over eligible assets developed by the company: once an asset is completed and meets the prescribed eligibility criteria, NDR InvIT receives the first opportunity to evaluate and acquire it.",
    "This framework supports transparent, disciplined asset monetization while giving NDR InvIT visibility into a pipeline of high-quality investment opportunities — and it lets NDR Smart Spaces recycle capital into new development.",
  ],
  external: { label: "NDR InvIT Trust", href: "https://ndrinvit.com" },
  note: "NDR InvIT's own financial results, distributions and disclosures are published by NDR InvIT Trust at ndrinvit.com.",
} as const;

export const safeHarbour = {
  eyebrow: "Safe harbour",
  heading: "Forward-looking statements.",
  paragraph:
    "Some of the statements in this communication may be forward looking statements within the meaning of applicable laws and regulations. Actual results might differ substantially from those expressed or implied. Important developments that could affect the entity's operations include changes in the industry structure, significant changes in political and economic environment in India and overseas, tax laws, import duties, litigation and labor relations. The information contained herein has been prepared to assist prospective investors in making their own evaluation of the Company and does not purport to be all-inclusive or to contain all of the information a prospective or existing investor may desire. In all cases, interested parties should conduct their own research/investigation and analysis of the Company and the data set forth in this information. The Company makes no representation or warranty as to the accuracy or completeness of this information and shall not have any liability for any representations (expressed or implied) regarding information contained in, or for any omissions from, this information or any other written or oral communications transmitted to the recipient during its evaluation of the Company. While we have made every attempt to ensure that the information contained in this presentation has been obtained from reliable source, the Company is not responsible for any errors or omissions, or for the results from the use of this information. All information in this presentation is provided on an \u201cas is\u201d basis with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information and without warranty of any kind, express or implies including but not limited to warranties of performance for a particular purpose. In no event will the Company, its Directors, legal representatives, agents or employees thereof be liable to anyone for any decision made or action taken by relying on data/information in this Presentation. All Financial and Business Indicators/KPIs/Ratios are in line with Statutory reporting and industry practices respectively unless otherwise specified.",
  // NOTE: verbatim from the NDR Corporate Presentation, Slide 2 (SAFE HARBOUR).
  // Verify character-for-character against the source deck before go-live.
} as const;

export const safeHarbourDisclaimer =
  "Forward-looking statements — read the full safe-harbour statement.";

export type ResilienceRow = {
  label: string;
  note: string;
  source: string;
};

export const resilience = {
  eyebrow: "Risk & resilience",
  heading: "How the platform is protected.",
  lede: "Qualitative commitments reported to investors — no figure is stated without a number.",
  rows: [
    {
      label: "Portfolio resilience",
      note: "A long weighted average lease expiry improves portfolio resilience.",
      source: "NDR Corporate Presentation §29",
    },
    {
      label: "Diversification",
      note: "Geographical, industry and client diversification reduces concentration risk.",
      source: "NDR Corporate Presentation §29",
    },
    {
      label: "Governance",
      note: "Prudent management, competent personnel and high governance standards mitigate investment and project risk.",
      source: "NDR Corporate Presentation §29",
    },
    {
      label: "Bonded funding",
      note: "SPV debt replaced with long-term bonds; AAA-rated entity; comfort from the sponsor's holding and warehousing expertise.",
      source: "NDR Corporate Presentation §29",
    },
    {
      label: "Receivables",
      note: "Low receivable risk across the client base.",
      source: "NDR Corporate Presentation §29",
    },
  ] as readonly ResilienceRow[],
} as const;

export type FilingStatus = "published" | "pending" | "external";

export type Filing = {
  ref: string; // explicit document reference — unique, validated, never derived
  asOn: string;
  title: string;
  category: string;
  type: string;
  status: FilingStatus;
  size?: string; // only where known
  href?: string; // external PDF / InvIT URL when status "external"
};

export type StatementRow = {
  period: string;
  cells: { label: string; value?: string }[];
  source: string;
};

export type DocumentGroup = {
  category: string;
  documents: Filing[];
};

export type FilingLibraryMode = "index" | "table" | "library";

export type FilingLibraryConfig = {
  eyebrow: string;
  title: string;
  asOn: string;
  edition: string;
  lede?: string;
  mode: FilingLibraryMode;
  categories: string[];
  filings: Filing[];
  statementCols?: { label: string; key: string }[];
  statements?: StatementRow[];
  groups?: DocumentGroup[];
  note?: string;
  entityNote?: string;
};

/** Reports & Disclosures — documentary archive. Content-gated; rows file when approved. */
export const reportsDisclosures: FilingLibraryConfig = {
  eyebrow: "Reports & Disclosures",
  title: "The disclosure register.",
  asOn: investorEdition.asOn,
  edition: investorEdition.edition,
  lede:
    "Reports, disclosures and regulatory filings of NDR Smart Spaces. Records publish as filings are approved.",
  mode: "index",
  categories: ["Reports", "Disclosures", "Notices"],
  filings: [],
  note: "The disclosure register is being filed. Records publish as filings are approved.",
};

/** Financial Results — the ruled statement table. Rows render only where a statement exists. */
export const financialResults: FilingLibraryConfig = {
  eyebrow: "Financial Results",
  title: "The results statement.",
  asOn: investorEdition.asOn,
  edition: investorEdition.edition,
  lede:
    "Quarterly and annual results as reported. No result is rendered before a statement is approved.",
  mode: "table",
  categories: ["Quarterly", "Annual"],
  filings: [],
  statementCols: [
    { label: "Period", key: "period" },
    { label: "Revenue", key: "revenue" },
    { label: "EBITDA", key: "ebitda" },
    { label: "PAT", key: "pat" },
  ],
  statements: [],
  note: "The results statement is being filed. Periods publish as statements are approved.",
};

/** Annual Reports — the year-index archive. */
export const annualReports: FilingLibraryConfig = {
  eyebrow: "Annual Reports",
  title: "The annual record.",
  asOn: investorEdition.asOn,
  edition: investorEdition.edition,
  lede: "Annual reports of NDR Smart Spaces, newest first.",
  mode: "index",
  categories: ["Annual Report"],
  filings: [],
  note: "The annual record is being filed. Reports publish as they are approved.",
};

/** Announcements — the dated index. */
export const announcements: FilingLibraryConfig = {
  eyebrow: "Announcements",
  title: "The announcement index.",
  asOn: investorEdition.asOn,
  edition: investorEdition.edition,
  lede: "Company announcements, newest first.",
  mode: "index",
  categories: ["Announcement"],
  filings: [],
  note: "The announcement index is being filed. Items publish as they are approved.",
};

/** Downloads — the documentary library, grouped by category (the folded IA routes). */
export const downloads: FilingLibraryConfig = {
  eyebrow: "Downloads",
  title: "The download archive.",
  asOn: investorEdition.asOn,
  edition: investorEdition.edition,
  lede:
    "Policies, credit ratings, shareholding information, distribution information and investor presentations.",
  mode: "library",
  categories: [],
  filings: [],
  groups: [
    { category: "Policies", documents: [] },
    { category: "Credit Ratings", documents: [] },
    { category: "Shareholding Information", documents: [] },
    { category: "Distribution Information", documents: [] },
    { category: "Presentations", documents: [] },
  ],
  note: "The archive is being filed. Documents publish as they are approved.",
};

export const governance = {
  masthead: {
    eyebrow: "Corporate Governance",
    title: "The governance manual.",
    asOn: investorEdition.asOn,
    edition: investorEdition.edition,
  },
  framework: {
    eyebrow: "Governance framework",
    heading: "How the company is controlled.",
    statement:
      "Control is documented, not assumed. The governance commitments below are those NDR Smart Spaces reports to investors; each is sourced and each publishes its documentary reference.",
    rows: [
      {
        label: "Stakeholder engagement",
        note: "Active stakeholder engagement is maintained across the group.",
        source: "NDR Corporate Presentation §23",
      },
      {
        label: "Policies and procedures",
        note: "Well-defined policies and procedures govern operations.",
        source: "NDR Corporate Presentation §23",
      },
      {
        label: "Governance framework",
        note: "A strong corporate governance framework is in place.",
        source: "NDR Corporate Presentation §23",
      },
      {
        label: "Compliance",
        note: "Full compliance with applicable regulations.",
        source: "NDR Corporate Presentation §23",
      },
      {
        label: "Cybersecurity",
        note: "Cybersecurity policy and manual with periodic awareness programmes.",
        source: "NDR Corporate Presentation §23",
      },
      {
        label: "Utilisation certificates",
        note: "Auditor-certified utilisation certificates (UC).",
        source: "NDR Corporate Presentation §23",
      },
    ],
  },
  board: [] as { id: string; name: string; role: string; photo?: { src: string; alt: string } }[],
  committees: [] as { id: string; name: string; charter: string; status: FilingStatus }[],
  policies: [] as Filing[],
  note: "Board, committee and policy records are being filed. Registers publish as approvals land.",
  policyCategories: ["Policies", "Committee Charters"],
} as const;

export const investorClosing = {
  line: "The statement closes.",
  body:
    "For investor correspondence, write to the investor mailbox. Reports and filings publish as they are approved.",
  primaryCta: { label: "Write to Investor Relations", href: "mailto:compliance@ndrsmart.com" },
  secondaryCta: {
    label: "Open the Download Archive",
    href: "/en/investor-centre/downloads",
  },
  tertiaryLink: { label: "NDR InvIT Trust", href: "https://ndrinvit.com" },
  enquiry: { label: "Business Enquiry", href: "/en/contact#business-enquiry" },
} as const;
