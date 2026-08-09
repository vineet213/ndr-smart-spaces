import { projectPlace, INDIA_OUTLINE, MAP_VIEWBOX } from "./portfolio";

/**
 * ESG & Sustainability — The Sustainability Ledger.
 * Fourth major NDR editorial publication.
 *
 * One figure, one source, everywhere (Design Direction §3.14). Nothing here is
 * invented: every metric, goal and register entry is either an approved record
 * or a clearly-marked draft awaiting client confirmation before go-live.
 *
 * Draft convention (inherited from the Investor Centre): periods flagged with
 * * are client-confirm. Provenance banners in each section restate the rule.
 */

export const ESG_EDITION = {
  asOn: "As on 31 March 2026",
  edition: "Edition FY26 · Volume I",
} as const;

export type EsgDraft = {
  draft?: boolean;
};

export type EsgRecordStatus = "published" | "pending" | "draft";

export const ESG_STATUS_LABELS: Record<EsgRecordStatus, string> = {
  published: "On record",
  pending: "Pending filing",
  draft: "Draft for confirmation",
};

export const ESG_STATUS_TONES: Record<EsgRecordStatus, "active" | "pending"> = {
  published: "active",
  pending: "pending",
  draft: "pending",
};

/* masthead ---------------------------------------------------------------- */

export const esgMasthead = {
  registry: "NDR Smart Spaces Pvt. Ltd. — an NDR Group platform",
  section: "ESG & Sustainability",
  title: { before: "The sustainability ", accent: "ledger", after: "." },
  statement:
    "How the company measures, governs and reports its environmental, social and governance performance — as an operating discipline.",
  asOn: ESG_EDITION.asOn,
  edition: ESG_EDITION.edition,
  folio: "Ledger FY26",
  controlCaption: "REF SL-001 · COVER",
  watermark: "SL",
} as const;

/* statement --------------------------------------------------------------- */

export const esgStatement = {
  eyebrow: "The editorial statement",
  heading: "Sustainability is an operating discipline, governed and reported.",
  statement:
    "This ledger records how NDR Smart Spaces measures its environmental, social and governance performance — the standards it holds, the targets it sets, and the evidence it files. Every figure carries a source and a period; nothing is stated that is not reported.",
  signatory: "NDR Smart Spaces · Sustainability Desk",
  provenance:
    "Figures in this edition marked * are placeholders pending confirmation against the approved ESG data source.",
} as const;

/* framework --------------------------------------------------------------- */

export type EsgPillarItem = {
  ref: string;
  label: string;
  note: string;
};

export type EsgPillar = {
  key: "E" | "S" | "G";
  name: string;
  chapter: string;
  focus: string;
  items: readonly EsgPillarItem[];
};

export const esgFramework = {
  eyebrow: "The framework",
  heading: "Three disciplines, one ledger.",
  lede: "The sustainability framework is organised into three governed disciplines — environmental, social and governance — each carrying coded commitments that recur across this edition.",
  pillars: [
    {
      key: "E",
      name: "Environmental",
      chapter: "I",
      focus: "Energy, water, waste, emissions and the built asset.",
      items: [
        {
          ref: "EN-01",
          label: "Energy",
          note: "Renewable generation and energy intensity across the portfolio.",
        },
        {
          ref: "EN-02",
          label: "Water",
          note: "Water intensity, recycling and rainwater management.",
        },
        {
          ref: "EN-03",
          label: "Waste",
          note: "Diversion away from landfill across construction and operations.",
        },
        {
          ref: "EN-04",
          label: "Emissions",
          note: "Greenhouse-gas mapping and a science-aligned net-zero pathway.",
        },
        {
          ref: "EN-05",
          label: "Green building",
          note: "Certification and design standards for the built asset.",
        },
      ],
    },
    {
      key: "S",
      name: "Social",
      chapter: "II",
      focus: "Workforce, safety, community and local engagement.",
      items: [
        {
          ref: "SO-01",
          label: "Workforce",
          note: "Permanent and contracted employment at each asset.",
        },
        {
          ref: "SO-02",
          label: "Health & safety",
          note: "Occupational-health practices across sites.",
        },
        { ref: "SO-03", label: "Training", note: "Skilling and upskilling hours." },
        { ref: "SO-04", label: "Community", note: "Local initiatives at operating locations." },
        {
          ref: "SO-05",
          label: "Inclusion",
          note: "Equal-opportunity commitments in hiring and work.",
        },
        { ref: "SO-06", label: "Local engagement", note: "Stakeholder engagement at asset level." },
      ],
    },
    {
      key: "G",
      name: "Governance",
      chapter: "III",
      focus: "Oversight, risk, policy and disclosure.",
      items: [
        { ref: "GV-01", label: "Oversight", note: "ESG governed at committee level." },
        {
          ref: "GV-02",
          label: "Risk",
          note: "Sustainability risk held on the group risk register.",
        },
        {
          ref: "GV-03",
          label: "Disclosure",
          note: "BRSR-aligned reporting and disclosure discipline.",
        },
        { ref: "GV-04", label: "Policy", note: "A published policy register." },
        { ref: "GV-05", label: "Ethics", note: "Whistle-blower and anti-corruption channels." },
      ],
    },
  ] as const,
} as const;

/* environmental ----------------------------------------------------------- */

export type EsgEnvironmentMetric = {
  id: string;
  code: string;
  stat: string;
  value: string;
  unit: string;
  period: string;
  source: string;
  trend: "up" | "down";
  draft?: boolean;
};

export type EsgEnvironmentCategory = {
  code: string;
  title: string;
  body: string;
  metricId: string;
};

export const esgEnvironment = {
  eyebrow: "Environmental",
  heading: "The environmental record.",
  lede: "How the portfolio consumes energy and water, manages waste, and maps its emissions — measured on the same assets the company develops and owns.",
  note: "Headline figures marked * are placeholders pending confirmation against the approved ESG data source.",
  metrics: [
    {
      id: "EN-REN",
      code: "EN-01",
      stat: "Renewable energy share",
      value: "51",
      unit: "%",
      period: "FY26 *",
      source: "Draft — internal energy records",
      trend: "up",
      draft: true,
    },
    {
      id: "EN-WAT",
      code: "EN-02",
      stat: "Water intensity",
      value: "0.31",
      unit: "kl / sq ft · year",
      period: "FY26 *",
      source: "Draft — internal water records",
      trend: "down",
      draft: true,
    },
    {
      id: "EN-WST",
      code: "EN-03",
      stat: "Waste diversion",
      value: "85",
      unit: "%",
      period: "FY26 *",
      source: "Draft — internal waste records",
      trend: "up",
      draft: true,
    },
    {
      id: "EN-ENE",
      code: "EN-04",
      stat: "Energy intensity",
      value: "6.8",
      unit: "kWh / sq ft · year",
      period: "FY26 *",
      source: "Draft — internal energy records",
      trend: "down",
      draft: true,
    },
    {
      id: "EN-GRN",
      code: "EN-05",
      stat: "Green building share",
      value: "34",
      unit: "% of portfolio",
      period: "FY26 *",
      source: "Draft — certification pipeline",
      trend: "up",
      draft: true,
    },
    {
      id: "EN-NZP",
      code: "EN-06",
      stat: "Net-zero pathway",
      value: "Registered",
      unit: "science-aligned",
      period: "Commitment *",
      source: "Approved design direction · pending board confirmation",
      trend: "up",
      draft: true,
    },
  ] as const satisfies readonly EsgEnvironmentMetric[],
  categories: [
    {
      code: "EN-01",
      title: "Energy",
      body: "On-site solar generation feeding leased and owned assets, with intensity tracked per square foot of built area.",
      metricId: "EN-REN",
    },
    {
      code: "EN-02",
      title: "Water",
      body: "Water recycled within operations, rainwater managed on campus, and intensity tracked across the portfolio.",
      metricId: "EN-WAT",
    },
    {
      code: "EN-03",
      title: "Waste",
      body: "Construction and operational waste diverted through reuse, recycling and co-processing.",
      metricId: "EN-WST",
    },
    {
      code: "EN-04",
      title: "Emissions",
      body: "Energy intensity as the leading proxy for scope 1 and 2 emissions, feeding a science-aligned net-zero pathway.",
      metricId: "EN-ENE",
    },
    {
      code: "EN-05",
      title: "Green building",
      body: "Green-building certification applied to new build, with the share of certified portfolio area rising.",
      metricId: "EN-GRN",
    },
    {
      code: "EN-06",
      title: "Commitment",
      body: "A registered net-zero pathway governs the emissions programme until full board confirmation.",
      metricId: "EN-NZP",
    },
  ] as const satisfies readonly EsgEnvironmentCategory[],
} as const;

/* social ------------------------------------------------------------------ */

export type EsgSocialRow = {
  ref: string;
  label: string;
  note: string;
  source: string;
  status: EsgRecordStatus;
};

export const esgSocial = {
  eyebrow: "Social",
  heading: "The social record.",
  lede: "Workforce, safety, training, community and inclusion — the social evidence reported at asset level.",
  note: "Qualitative commitments are reported to the same standard as figures: each carries a source and a filing status.",
  rows: [
    {
      ref: "SO-01",
      label: "Workforce",
      note: "Permanent and contracted employment is recorded at every operating location.",
      source: "Draft — site HR records",
      status: "draft",
    },
    {
      ref: "SO-02",
      label: "Health & safety",
      note: "Occupational-health practices in place, aligned with the ISO 45001 pipeline.",
      source: "Approved design direction",
      status: "pending",
    },
    {
      ref: "SO-03",
      label: "Training",
      note: "Skilling hours tracked per employee category and per site.",
      source: "Draft — site HR records",
      status: "draft",
    },
    {
      ref: "SO-04",
      label: "Community",
      note: "Local initiatives run at operating locations across the four zones.",
      source: "Approved design direction",
      status: "pending",
    },
    {
      ref: "SO-05",
      label: "Inclusion",
      note: "Equal-opportunity commitments apply to hiring and working conditions.",
      source: "Approved design direction",
      status: "pending",
    },
    {
      ref: "SO-06",
      label: "Local engagement",
      note: "Stakeholder engagement is maintained at asset level and reported.",
      source: "Approved design direction",
      status: "pending",
    },
  ] as const satisfies readonly EsgSocialRow[],
} as const;

/* governance -------------------------------------------------------------- */

export type EsgGovernanceCommitment = {
  ref: string;
  label: string;
  note: string;
  source: string;
};

export type EsgRegisterRow = {
  id: string;
  ref: string;
  asOn: string;
  entry: string;
  note: string;
  status: EsgRecordStatus;
};

export type EsgRegister = {
  title: string;
  rows: readonly EsgRegisterRow[];
};

export const esgGovernance = {
  eyebrow: "Governance",
  heading: "The governance record.",
  lede: "Oversight, risk, policy and disclosure — how the sustainability programme is controlled.",
  commitments: [
    {
      ref: "GV-01",
      label: "Oversight",
      note: "Sustainability is governed by a dedicated committee reporting to the board.",
      source: "Approved design direction",
    },
    {
      ref: "GV-02",
      label: "Risk",
      note: "Environmental and social risk is held on the group risk register.",
      source: "Approved design direction",
    },
    {
      ref: "GV-03",
      label: "Disclosure",
      note: "Reporting is aligned with the BRSR and this ledger is the primary disclosure.",
      source: "Approved design direction",
    },
    {
      ref: "GV-04",
      label: "Policy",
      note: "A published policy register governs environmental and social conduct.",
      source: "Approved design direction",
    },
    {
      ref: "GV-05",
      label: "Ethics",
      note: "Whistle-blower and anti-corruption channels are in place.",
      source: "Approved design direction",
    },
  ] as const satisfies readonly EsgGovernanceCommitment[],
  registers: [
    {
      title: "Committees",
      rows: [
        {
          id: "esg-comm",
          ref: "GC-01",
          asOn: "—",
          entry: "ESG Committee",
          note: "Oversees the sustainability programme.",
          status: "pending",
        },
        {
          id: "csr-comm",
          ref: "GC-02",
          asOn: "—",
          entry: "CSR Committee",
          note: "Governs community investment.",
          status: "pending",
        },
        {
          id: "risk-comm",
          ref: "GC-03",
          asOn: "—",
          entry: "Risk Committee",
          note: "Holds sustainability risk.",
          status: "pending",
        },
        {
          id: "audit-comm",
          ref: "GC-04",
          asOn: "—",
          entry: "Audit Committee",
          note: "Reviews disclosure integrity.",
          status: "pending",
        },
      ],
    },
    {
      title: "Policies",
      rows: [
        {
          id: "pol-whistle",
          ref: "GP-01",
          asOn: "—",
          entry: "Whistle-blower policy",
          note: "Reporting channel for concerns.",
          status: "pending",
        },
        {
          id: "pol-ethics",
          ref: "GP-02",
          asOn: "—",
          entry: "Code of conduct",
          note: "Business ethics across the group.",
          status: "pending",
        },
        {
          id: "pol-hr",
          ref: "GP-03",
          asOn: "—",
          entry: "Human rights policy",
          note: "Workforce and community standards.",
          status: "pending",
        },
        {
          id: "pol-env",
          ref: "GP-04",
          asOn: "—",
          entry: "Environmental policy",
          note: "Environmental commitments in operations.",
          status: "pending",
        },
      ],
    },
    {
      title: "Disclosure index",
      rows: [
        {
          id: "dis-brsr",
          ref: "GD-01",
          asOn: "—",
          entry: "BRSR",
          note: "Business Responsibility & Sustainability Report.",
          status: "pending",
        },
        {
          id: "dis-esg",
          ref: "GD-02",
          asOn: "—",
          entry: "ESG report",
          note: "This ledger — the primary sustainability disclosure.",
          status: "pending",
        },
        {
          id: "dis-ghg",
          ref: "GD-03",
          asOn: "—",
          entry: "GHG inventory",
          note: "Greenhouse-gas inventory for scope 1 and 2.",
          status: "pending",
        },
      ],
    },
  ] as const satisfies readonly EsgRegister[],
  note: "Register entries publish as approvals land. Rows marked pending are filed without a documentary reference until then.",
} as const;

/* dashboard --------------------------------------------------------------- */

export type EsgTrendPoint = { period: string; value: number };

export type EsgTrend = {
  id: string;
  code: string;
  title: string;
  unit: string;
  source: string;
  draft?: boolean;
  points: readonly EsgTrendPoint[];
};

export type EsgGoal = {
  id: string;
  code: string;
  label: string;
  unit: string;
  current: number;
  target: number;
  targetPeriod: string;
  direction: "higher" | "lower";
  source: string;
  draft?: boolean;
};

export type EsgCompositionPart = { label: string; value: number };

export type EsgComposition = {
  id: string;
  code: string;
  title: string;
  unit: string;
  source: string;
  draft?: boolean;
  parts: readonly EsgCompositionPart[];
};

export const esgDashboard = {
  eyebrow: "The dashboard",
  heading: "The metrics ledger.",
  lede: "Trends, targets and composition — the numbers behind the narrative. All series are placeholders pending confirmation of the approved ESG data source.",
  note: "Series marked * are draft placeholders for design verification only.",
  trends: [
    {
      id: "TR-REN",
      code: "T-01",
      title: "Renewable energy share",
      unit: "%",
      source: "Draft — internal energy records",
      draft: true,
      points: [
        { period: "FY21", value: 12 },
        { period: "FY22", value: 18 },
        { period: "FY23", value: 26 },
        { period: "FY24", value: 34 },
        { period: "FY25", value: 42 },
        { period: "FY26", value: 51 },
      ],
    },
    {
      id: "TR-WST",
      code: "T-02",
      title: "Waste diversion",
      unit: "%",
      source: "Draft — internal waste records",
      draft: true,
      points: [
        { period: "FY21", value: 42 },
        { period: "FY22", value: 51 },
        { period: "FY23", value: 60 },
        { period: "FY24", value: 68 },
        { period: "FY25", value: 78 },
        { period: "FY26", value: 85 },
      ],
    },
    {
      id: "TR-WAT",
      code: "T-03",
      title: "Water intensity",
      unit: "kl / sq ft · yr",
      source: "Draft — internal water records",
      draft: true,
      points: [
        { period: "FY21", value: 0.62 },
        { period: "FY22", value: 0.57 },
        { period: "FY23", value: 0.49 },
        { period: "FY24", value: 0.44 },
        { period: "FY25", value: 0.38 },
        { period: "FY26", value: 0.31 },
      ],
    },
  ] as const satisfies readonly EsgTrend[],
  goals: [
    {
      id: "GO-REN",
      code: "G-01",
      label: "Renewable energy share",
      unit: "%",
      current: 51,
      target: 60,
      targetPeriod: "FY28",
      direction: "higher",
      source: "Draft — internal target",
      draft: true,
    },
    {
      id: "GO-WST",
      code: "G-02",
      label: "Waste diversion",
      unit: "%",
      current: 85,
      target: 90,
      targetPeriod: "FY27",
      direction: "higher",
      source: "Draft — internal target",
      draft: true,
    },
    {
      id: "GO-WAT",
      code: "G-03",
      label: "Water intensity",
      unit: "kl / sq ft · yr",
      current: 0.31,
      target: 0.26,
      targetPeriod: "FY28",
      direction: "lower",
      source: "Draft — internal target",
      draft: true,
    },
    {
      id: "GO-ENE",
      code: "G-04",
      label: "Energy intensity",
      unit: "kWh / sq ft · yr",
      current: 6.8,
      target: 5.8,
      targetPeriod: "FY28",
      direction: "lower",
      source: "Draft — internal target",
      draft: true,
    },
  ] as const satisfies readonly EsgGoal[],
  composition: [
    {
      id: "CO-ENE",
      code: "C-01",
      title: "Energy mix",
      unit: "% of energy consumed",
      source: "Draft — internal energy records",
      draft: true,
      parts: [
        { label: "Grid", value: 44 },
        { label: "On-site solar", value: 36 },
        { label: "Other renewable", value: 12 },
        { label: "Diesel backup", value: 8 },
      ],
    },
    {
      id: "CO-WST",
      code: "C-02",
      title: "Waste handling",
      unit: "% of waste generated",
      source: "Draft — internal waste records",
      draft: true,
      parts: [
        { label: "Recycled", value: 68 },
        { label: "Co-processed", value: 17 },
        { label: "Energy recovery", value: 9 },
        { label: "Landfill", value: 6 },
      ],
    },
    {
      id: "CO-WKF",
      code: "C-03",
      title: "Workforce composition",
      unit: "% of workforce",
      source: "Draft — site HR records",
      draft: true,
      parts: [
        { label: "Permanent", value: 82 },
        { label: "Contracted", value: 18 },
      ],
    },
  ] as const satisfies readonly EsgComposition[],
} as const;

/* impact map -------------------------------------------------------------- */

export type ImpactCategory = "energy" | "water" | "waste" | "green-building" | "community";

export type ImpactInitiative = {
  id: string;
  code: string;
  name: string;
  place: string;
  region: string;
  category: ImpactCategory;
  status: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  note: string;
};

export type ImpactCategoryDef = {
  key: ImpactCategory;
  label: string;
  color: string;
};

export const IMPACT_CATEGORIES: readonly ImpactCategoryDef[] = [
  { key: "energy", label: "Energy", color: "#f0b65a" },
  { key: "water", label: "Water", color: "#c9636a" },
  { key: "waste", label: "Waste", color: "#f5c97f" },
  { key: "green-building", label: "Green building", color: "#faf7f2" },
  { key: "community", label: "Community", color: "#7d7871" },
] as const;

export const esgImpactMap = {
  eyebrow: "Impact map",
  heading: "Where the work is done.",
  lede: "Sustainability initiatives mapped to the locations where the company operates — each recorded with its category and status.",
  note: "Schematic outline · not to scale. Initiatives are draft placeholders pending confirmation.",
  captionLead: "Fig. 02 · Ledger · Impact map",
  captionDetail: "Each initiative is recorded by category and status in the register below.",
  source: "Source: Draft — initiative register",
  notToScale: "Schematic outline · not to scale",
  mapViewbox: MAP_VIEWBOX,
  indiaOutline: INDIA_OUTLINE,
  initiatives: [
    {
      id: "chennai-solar",
      code: "IM-01",
      name: "Portfolio solar programme",
      place: "Chennai",
      region: "Tamil Nadu",
      category: "energy",
      status: "Operational",
      lat: 13.0887,
      lon: 80.2707,
      x: projectPlace(13.0887, 80.2707).x,
      y: projectPlace(13.0887, 80.2707).y,
      note: "On-site solar capacity across the Chennai portfolio.",
    },
    {
      id: "bidadi-water",
      code: "IM-02",
      name: "Water stewardship",
      place: "Bidadi",
      region: "Karnataka",
      category: "water",
      status: "Operational",
      lat: 12.8456,
      lon: 77.4861,
      x: projectPlace(12.8456, 77.4861).x,
      y: projectPlace(12.8456, 77.4861).y,
      note: "Rainwater management and recycling at the Bidadi campus.",
    },
    {
      id: "coimbatore-build",
      code: "IM-03",
      name: "Green building certification",
      place: "Coimbatore",
      region: "Tamil Nadu",
      category: "green-building",
      status: "In certification",
      lat: 11.0168,
      lon: 76.9558,
      x: projectPlace(11.0168, 76.9558).x,
      y: projectPlace(11.0168, 76.9558).y,
      note: "The Amazon fulfilment centre advanced through green-building certification.",
    },
    {
      id: "ghaziabad-community",
      code: "IM-04",
      name: "Community engagement",
      place: "Ghaziabad",
      region: "NCR, Uttar Pradesh",
      category: "community",
      status: "Operational",
      lat: 28.67,
      lon: 77.42,
      x: projectPlace(28.67, 77.42).x,
      y: projectPlace(28.67, 77.42).y,
      note: "Community initiatives run alongside the NCR operations.",
    },
    {
      id: "hyderabad-waste",
      code: "IM-05",
      name: "Waste management hub",
      place: "Hyderabad",
      region: "Telangana",
      category: "waste",
      status: "Under development",
      lat: 17.385,
      lon: 78.487,
      x: projectPlace(17.385, 78.487).x,
      y: projectPlace(17.385, 78.487).y,
      note: "Centralised waste handling for the Hyderabad portfolio.",
    },
    {
      id: "pune-retrofit",
      code: "IM-06",
      name: "Energy retrofit",
      place: "Pune",
      region: "Maharashtra",
      category: "energy",
      status: "Planned",
      lat: 18.52,
      lon: 73.856,
      x: projectPlace(18.52, 73.856).x,
      y: projectPlace(18.52, 73.856).y,
      note: "Retrofit programme for the existing Pune campus.",
    },
    {
      id: "kolkata-community",
      code: "IM-07",
      name: "Community engagement",
      place: "Kolkata",
      region: "West Bengal",
      category: "community",
      status: "Planned",
      lat: 22.5727,
      lon: 88.3639,
      x: projectPlace(22.5727, 88.3639).x,
      y: projectPlace(22.5727, 88.3639).y,
      note: "Community initiatives scoped for the East zone.",
    },
    {
      id: "hosur-training",
      code: "IM-08",
      name: "Skilling & training",
      place: "Hosur",
      region: "Tamil Nadu",
      category: "community",
      status: "Scoping",
      lat: 12.7407,
      lon: 77.8257,
      x: projectPlace(12.7407, 77.8257).x,
      y: projectPlace(12.7407, 77.8257).y,
      note: "Local skilling programme in scoping at Hosur.",
    },
  ] as const satisfies readonly ImpactInitiative[],
  categories: IMPACT_CATEGORIES,
} as const;

/* certifications ---------------------------------------------------------- */

export type EsgCertification = {
  ref: string;
  standard: string;
  scope: string;
  status: EsgRecordStatus;
  validFrom?: string;
  note?: string;
};

export const esgCertifications = {
  eyebrow: "Certifications",
  heading: "The certificate register.",
  lede: "Standards the company holds or is working toward — each entry with its scope and status. Certificates publish as they are awarded.",
  note: "Certificates publish as they are awarded. Rows pending carry no validity date until then.",
  certifications: [
    {
      ref: "CE-01",
      standard: "EDGE / EDGE Advanced",
      scope: "Green building certification — certified assets",
      status: "pending",
      note: "Pipeline under assessment for the built portfolio.",
    },
    {
      ref: "CE-02",
      standard: "ISO 14001",
      scope: "Environmental management system",
      status: "pending",
      note: "Certification programme in preparation.",
    },
    {
      ref: "CE-03",
      standard: "ISO 45001",
      scope: "Occupational health & safety",
      status: "pending",
      note: "Certification programme in preparation.",
    },
    {
      ref: "CE-04",
      standard: "GHG inventory",
      scope: "Scope 1 and 2 greenhouse-gas inventory",
      status: "pending",
      note: "Third-party assurance under planning.",
    },
    {
      ref: "CE-05",
      standard: "Net-zero pathway",
      scope: "Science-aligned net-zero commitment",
      status: "pending",
      note: "Commitment registered; awaiting board confirmation.",
    },
  ] as readonly EsgCertification[],
} as const;

/* disclosures ------------------------------------------------------------- */

export type EsgDocument = {
  ref: string;
  title: string;
  asOn: string;
  status: EsgRecordStatus;
  edition?: string;
  note?: string;
};

export type EsgDocumentGroup = {
  category: string;
  documents: readonly EsgDocument[];
};

export const esgDisclosures = {
  eyebrow: "Disclosures",
  heading: "The disclosure archive.",
  lede: "The records of this ledger — annual, sustainability, climate and governance filings. Documents publish as they are approved.",
  note: "The archive is being filed. Documents publish as approvals land.",
  groups: [
    {
      category: "Annual reporting",
      documents: [
        {
          ref: "DS-01",
          title: "Annual Report",
          asOn: "FY26",
          status: "pending",
          note: "The annual record of the company.",
        },
      ],
    },
    {
      category: "Sustainability reporting",
      documents: [
        {
          ref: "DS-02",
          title: "ESG Report",
          asOn: "FY26",
          status: "pending",
          edition: "This edition — the Sustainability Ledger",
        },
        {
          ref: "DS-03",
          title: "BRSR",
          asOn: "—",
          status: "pending",
          note: "Business Responsibility & Sustainability Report.",
        },
      ],
    },
    {
      category: "Climate & environment",
      documents: [
        {
          ref: "DS-04",
          title: "GHG inventory",
          asOn: "—",
          status: "pending",
          note: "Scope 1 and 2 inventory.",
        },
      ],
    },
    {
      category: "Governance",
      documents: [
        {
          ref: "DS-05",
          title: "Policy register",
          asOn: "—",
          status: "pending",
          note: "Published policies of the group.",
        },
      ],
    },
  ] as readonly EsgDocumentGroup[],
} as const;

/* closing ----------------------------------------------------------------- */

export const esgClosing = {
  eyebrow: "Ledger · Endnote",
  line: "The ledger remains open.",
  body: "Sustainability at NDR Smart Spaces is governed and reported as an operating discipline. Records file as they are confirmed and approved; until then every figure carries its source and status.",
  primaryCta: { label: "Write to the ESG desk", href: "mailto:compliance@ndrsmart.com" },
  secondaryCta: { label: "Open the Investor Centre", href: "/en/investor-centre" },
  tertiaryLink: { label: "NDR InvIT Trust", href: "https://ndrinvit.com" },
  enquiry: { label: "Business Enquiry", href: "/en/contact#business-enquiry" },
  provenanceNote:
    "Draft placeholders in this edition are marked * and remain subject to client confirmation before go-live.",
} as const;

/* validation is wired from the page — see esgValidation.ts (one-directional) */
