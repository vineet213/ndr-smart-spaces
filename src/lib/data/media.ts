export type PressCategory = "press-release" | "coverage" | "interview" | "update";

/**
 * Media — The Press Register.
 * Fifth major NDR editorial publication.
 *
 * The company's newsroom archive: releases, coverage, interviews and updates,
 * dated and referenced as a public record. Content is source-grounded. Nothing
 * here is invented — every entry is either an approved record or a clearly
 * marked draft awaiting client confirmation before go-live.
 *
 * Draft convention (inherited from the Investor Centre): periods flagged with
 * * are client-confirm. Provenance banners restate the rule.
 */

export const MEDIA_EDITION = {
  asOn: "As on 31 March 2026",
  edition: "Edition FY26 · Volume I",
} as const;

/**
 * Document-level publication reference. Every sheet in the register carries
 * this code in its folio line.
 */
export const MEDIA_PUBLICATION = {
  ref: "NDR-PR-FY26",
  title: "The Press Register",
  classification: "Public record",
} as const;

export type MediaRecordStatus = "published" | "pending" | "draft";

export const MEDIA_STATUS_LABELS: Record<MediaRecordStatus, string> = {
  published: "On record",
  pending: "Pending filing",
  draft: "Draft for confirmation",
};

export const MEDIA_STATUS_TONES: Record<MediaRecordStatus, "active" | "pending"> = {
  published: "active",
  pending: "pending",
  draft: "pending",
};

/* masthead ---------------------------------------------------------------- */

export const mediaMasthead = {
  registry: "NDR Smart Spaces Pvt. Ltd. — an NDR Group platform",
  publication: "NDR Press Register",
  section: "Media & Newsroom",
  title: { before: "The press ", accent: "register", after: "." },
  statement:
    "The company's newsroom archive — releases, coverage, interviews and updates, dated and referenced as a public record.",
  asOn: MEDIA_EDITION.asOn,
  edition: MEDIA_EDITION.edition,
  folio: "Register FY26",
  controlCaption: "REF PR-001 · COVER",
  watermark: "PR",
} as const;

/* statement --------------------------------------------------------------- */

export const mediaStatement = {
  eyebrow: "The editorial statement",
  heading: "A newsroom archive, kept as a public record.",
  statement:
    "This register records how NDR Smart Spaces speaks to the public — the releases it issues, the coverage it receives and the updates it files. Every entry carries a date and a reference; nothing is stated that is not on record.",
  signatory: "NDR Smart Spaces · Media Desk",
  provenance:
    "Entries in this register marked * are placeholders pending confirmation against the approved newsroom record.",
  reference: "NDR-PR-FY26 · Statement",
  recorded: "Recorded · FY26",
} as const;

/* featured publication ---------------------------------------------------- */

export const mediaFeatured = {
  ref: "PR-002",
  publication: "The Press Register",
  issue: "Issue No. 02",
  archiveCode: "AR-PR-002",
  category: "Press Release",
  date: "2018",
  status: "published",
  genre: "Primary disclosure",
  title: "NDR InvIT lists on the NSE through an INR 8.8 bn IPO — India's first warehousing InvIT",
  statement:
    "The listing opened India's first warehousing InvIT to public-market investors, giving the group's development platform a transparent, regulated capital partner.",
  excerpt: "India's first warehousing InvIT opens to public-market investors.",
  source: "Source: NDR InvIT disclosures · reproduced in the group archive",
  href: "https://ndrinvit.com",
  external: true,
  record: [
    { label: "Reference", value: "PR-002" },
    { label: "Issue", value: "No. 02" },
    { label: "Archive code", value: "AR-PR-002" },
    { label: "Classification", value: "Press release · Primary disclosure" },
    { label: "Recorded", value: "2018" },
  ] as readonly { label: string; value: string }[],
} as const;

/* press archive ----------------------------------------------------------- */

export type PressArchiveEntry = {
  id: string;
  ref: string;
  date: string;
  category: PressCategory;
  title: string;
  note?: string;
  status: MediaRecordStatus;
  href?: string;
  external?: boolean;
};

export const PRESS_CATEGORIES: readonly {
  key: PressCategory;
  label: string;
  description: string;
}[] = [
  {
    key: "press-release",
    label: "Press Releases",
    description: "Statements issued by the company.",
  },
  {
    key: "coverage",
    label: "Coverage",
    description: "Reporting and mentions by external publications.",
  },
  {
    key: "interview",
    label: "Interviews",
    description: "Interviews given by leadership.",
  },
  {
    key: "update",
    label: "Updates",
    description: "Programmatic updates to the record.",
  },
];

export const pressArchive = {
  eyebrow: "The archive",
  heading: "The public record, dated and referenced.",
  lede: "Releases, coverage, interviews and updates filed by the company — each entry with its date and reference. The archive is being filed; entries publish as approvals land.",
  note: "The archive is being filed. Entries publish as they are approved.",
  registerCode: "NDR-PR-FY26 · Press archive",
  folio: "Folio PR",
  categories: PRESS_CATEGORIES,
  entries: [
    {
      id: "pr-001",
      ref: "PR-001",
      date: "2015",
      category: "press-release",
      title: "NDR InvIT Trust incorporated",
      note: "The trust is incorporated to own and manage income-generating infrastructure assets.",
      status: "published",
      href: "https://ndrinvit.com",
      external: true,
    },
    {
      id: "pr-002",
      ref: "PR-002",
      date: "2018",
      category: "press-release",
      title: "NDR InvIT lists on the NSE through an INR 8.8 bn IPO",
      note: "India's first warehousing InvIT opens to public-market investors.",
      status: "published",
      href: "https://ndrinvit.com",
      external: true,
    },
    {
      id: "pr-003",
      ref: "PR-003",
      date: "FY26*",
      category: "press-release",
      title: "NDR Smart Spaces completes the MLG monetization to NDR InvIT",
      note: "MLG (INR 143.9 cr) and SPV transfers complete the capital cycle.",
      status: "draft",
    },
    {
      id: "up-001",
      ref: "UP-001",
      date: "FY26*",
      category: "update",
      title: "ESG — The Sustainability Ledger, Edition FY26",
      note: "This edition of the company's sustainability record.",
      status: "draft",
    },
  ] as readonly PressArchiveEntry[],
} as const;

/* media kit --------------------------------------------------------------- */

export type MediaKitItemStatus = "available" | "pending";

export const mediaKit = {
  eyebrow: "Media kit",
  heading: "Assets for the press.",
  lede: "The official materials of the company — profile, logos and brand guidance — filed for editorial use.",
  note: "Kit assets publish as the brand system is approved.",
  registerCode: "NDR-PR-FY26 · Asset register",
  items: [
    {
      ref: "MK-01",
      label: "Company profile",
      note: "The one-page profile of NDR Smart Spaces.",
      format: "PDF",
      classification: "Corporate profile",
      revision: "Rev. 01",
      status: "pending",
    },
    {
      ref: "MK-02",
      label: "Logo suite",
      note: "Primary and monochrome lockups.",
      format: "SVG / PNG",
      classification: "Brand assets",
      revision: "Rev. 01",
      status: "pending",
    },
    {
      ref: "MK-03",
      label: "Brand guidance",
      note: "Colour, type and usage.",
      format: "PDF",
      classification: "Brand guidance",
      revision: "Rev. 01",
      status: "pending",
    },
    {
      ref: "MK-04",
      label: "Key statistics",
      note: "The corporate dashboard in one sheet.",
      format: "PDF",
      classification: "Corporate statistics",
      revision: "Rev. 01",
      status: "pending",
    },
  ] as readonly {
    ref: string;
    label: string;
    note: string;
    format: string;
    classification: string;
    revision: string;
    status: MediaKitItemStatus;
  }[],
} as const;

/* press contact ----------------------------------------------------------- */

export const pressContact = {
  eyebrow: "Press contact",
  heading: "Write to the correspondence office.",
  body: "Journalists and editors: direct press enquiries to the press desk below. Every enquiry is logged, routed and answered within two business days.",
  response: {
    label: "Response",
    value: "Within 2 business days",
    classification: "Standard response",
  },
  registerCode: "NDR-PR-FY26 · Correspondence",
  departments: [
    {
      ref: "PC-01",
      label: "Press desk",
      value: "compliance@ndrsmart.com",
      href: "mailto:compliance@ndrsmart.com",
      note: "Releases, coverage and interviews — the newsroom register.",
    },
    {
      ref: "PC-02",
      label: "Business desk",
      value: "project@ndrsmart.com",
      href: "mailto:project@ndrsmart.com",
      note: "Business enquiries, partnerships and the commercial line.",
    },
  ],
  address: "No. 56/1, next to GT Reddy Cars, Bazulla Road, T. Nagar, Chennai, Tamil Nadu 600017",
} as const;

/* closing ----------------------------------------------------------------- */

export const mediaClosing = {
  eyebrow: "Register · Endnote",
  line: "The register remains open.",
  body: "The company's public record is kept in order — releases, coverage, interviews and updates file as they are approved. Until then, every entry carries its status.",
  publicationRef: MEDIA_PUBLICATION.ref,
  edition: MEDIA_EDITION.edition,
  primaryCta: { label: "Write to the press desk", href: "mailto:compliance@ndrsmart.com" },
  secondaryCta: { label: "Contact NDR Smart Spaces.", href: "/en/contact" },
  tertiaryLink: { label: "NDR InvIT Trust", href: "https://ndrinvit.com" },
  enquiry: { label: "Business Enquiry", href: "/en/contact#business-enquiry" },
  provenanceNote:
    "Draft entries in this register are marked * and remain subject to client confirmation before go-live.",
} as const;
