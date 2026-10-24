import { metrics } from "./generated/metrics";

/**
 * The Why NDR page (/why-ndr/). Every claim here is already published
 * elsewhere on the site: figures come from the corporate-presentation
 * metrics, the About timeline and the business pages.
 */

const metric = (key: string): string => metrics.find((m) => m.key === key)?.value ?? "";

export const whyMasthead = {
  title: { before: "Built to be ", accent: "relied on." },
  statement:
    "Since 1954 the NDR Group has turned land into infrastructure India's businesses depend on. Today: 46 parks and around 25 million sq ft under management.",
};

export type WhyReason = {
  index: string;
  title: string;
  line: string;
  proof: string;
  body: string;
};

export const whyOverview = {
  heading: "Five reasons to build with NDR.",
  lead: "Occupiers, investors and partners choose NDR for five reasons.",
  rest: "Each one is backed by something you can check.",
  reasons: [
    {
      index: "01",
      title: "Governance",
      line: "Prudent management, strong governance.",
      proof: metric("M15"),
      body: "Long-term bond financing, long leases and low receivable risk, overseen by a board with independent representation.",
    },
    {
      index: "02",
      title: "Execution",
      line: "Concept to completion under one roof.",
      proof: "6,00,000 sq ft delivered in 4 months",
      body: "Land, approvals, design and construction are run by one team, so nothing is lost between stages. 99% of our industrial projects are greenfield.",
    },
    {
      index: "03",
      title: "Capital discipline",
      line: "Capital that keeps building.",
      proof: "Develop, stabilise, offer under ROFO, recycle",
      body: "Completed parks are offered to NDR InvIT under a right of first offer, and the capital goes straight back into new development.",
    },
    {
      index: "04",
      title: "Partnerships",
      line: "Relationships that last decades.",
      proof: metric("M5"),
      body: "Amazon, Flipkart, Samsung, Lenovo, FedEx and Reliance are among the occupiers who run their operations from NDR parks.",
    },
    {
      index: "05",
      title: "Credibility",
      line: "Backed by institutions.",
      proof: "IFC ₹225 crore equity, 2026",
      body: "Over two decades NDR has been backed by IL&FS, Warburg Pincus, IFC, Kotak and Investcorp.",
    },
  ] satisfies readonly WhyReason[],
};
