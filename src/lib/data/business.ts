export type Chapter = {
  index: string;
  label: string;
  id: string;
  title: string;
  plate: string;
  code: string;
};

export const businessChapters = [
  {
    index: "01",
    label: "Operating Verticals",
    id: "verticals",
    title: "What the company runs.",
    plate: "PL. 101",
    code: "OP.01",
  },
  {
    index: "02",
    label: "Capabilities & Services",
    id: "capabilities",
    title: "What NDR can deliver.",
    plate: "PL. 201",
    code: "OP.02",
  },
  {
    index: "03",
    label: "Corporate Structure",
    id: "structure",
    title: "How the corporate body is assembled.",
    plate: "PL. 301",
    code: "OP.03",
  },
  {
    index: "04",
    label: "Capital Deployment",
    id: "capital",
    title: "How capital flows.",
    plate: "PL. 401",
    code: "OP.04",
  },
  {
    index: "05",
    label: "Execution",
    id: "execution",
    title: "How projects are delivered.",
    plate: "PL. 501",
    code: "OP.05",
  },
] as const satisfies readonly Chapter[];

export const businessMasthead = {
  folio: "OP. MANUAL · FY26",
  controlCaption: "Cover · Sheet 01 of 06",
  statement:
    "Developing, owning and managing high-quality industrial, commercial and institutional assets for over 60 years.",
  headline: { before: "The ", accent: "operating", after: " manual." },
} as const;

export type DivisionSpecRow = { label: string; value: string };

export type DivisionRoute = { label: string; href: string; external?: boolean };

export type Division = {
  index: string;
  title: string;
  writeup: string;
  spec: readonly DivisionSpecRow[];
  proof: string;
  proofSource: string;
  route: DivisionRoute;
  source: string;
};

export const divisions = [
  {
    index: "01",
    title: "Grade A Warehousing",
    writeup:
      "Institutional-grade warehousing developed on owned land — warehouses, industrial sheds, godowns, storage facilities and logistics parks positioned on national highways, ports, railways and airports, and let to retail, e-commerce, 3PL and manufacturing occupiers.",
    spec: [
      {
        label: "Facility types",
        value: "Warehouses · industrial sheds · godowns · storage facilities · logistics parks",
      },
      { label: "Location", value: "National highways · ports · railways · airports" },
      { label: "Occupiers", value: "Retail · e-commerce · 3PL · manufacturing" },
    ],
    proof: "99% greenfield",
    proofSource: "NDR Corporate Presentation",
    route: { label: "Grade A Warehousing", href: "/en/business/grade-a-warehousing" },
    source: "Client IA response · Post-Demerger business note · NDR Corporate Presentation",
  },
  {
    index: "02",
    title: "NDR Asset Management",
    writeup:
      "The group's project management company — carrying a project from design coordination, procurement and scheduling through construction management and quality assurance to timely completion, then operating and maintaining the asset.",
    spec: [
      {
        label: "Project lifecycle",
        value:
          "Design coordination → procurement → scheduling → construction management → quality assurance → timely completion",
      },
      {
        label: "Operations",
        value:
          "Facility & property management · maintenance planning · statutory & regulatory compliance · tenant coordination · HSE",
      },
    ],
    proof: "100%-owned project management arm",
    proofSource: "Approved homepage content",
    route: { label: "NDR Asset Management", href: "/en/business/ndr-asset-management" },
    source: "Client IA response · Post-Demerger business note",
  },
  {
    index: "03",
    title: "Residential Plotting — Ave Acres",
    writeup:
      "RERA-compliant plotted layouts planned, plotted, approved, marketed and sold through the group's plotting entity.",
    spec: [
      { label: "Product", value: "RERA-compliant plotted layouts" },
      {
        label: "Scope",
        value: "Planning · plotting · approvals · marketing · sale of developed land",
      },
    ],
    proof: "External entity",
    proofSource: "Post-Demerger business note",
    route: { label: "Ave Acres", href: "https://aveacres.com", external: true },
    source: "Client IA response · Post-Demerger business note",
  },
] as const satisfies readonly Division[];

export const capabilityMatrix = {
  footprint: {
    label: "Operating footprint",
    line: "Mumbai · NCR · Bengaluru · Chennai · Kolkata · Pune · Goa · Hyderabad · Surat",
    note: "access to ~80% of India's consumption markets",
    source: "Source: NDR Corporate Presentation",
  },
  headers: ["Capability", "Scope", "Evidence"] as const,
  rows: [
    {
      phase: "ORIGINATION",
      capability: "SPV funding",
      scope: "Financial assistance to group SPVs for land acquisition and construction",
      evidence: "Subsidiaries / JVs",
    },
    {
      phase: "DEVELOPMENT",
      capability: "Development & delivery",
      scope: "Conceptualization, design and delivery of institutional-grade assets",
      evidence: "6,00,000 sq ft delivered in 4 months",
    },
    {
      phase: "DEVELOPMENT",
      capability: "Project management",
      scope:
        "Design coordination, procurement, scheduling, construction management, quality assurance, timely completion",
      evidence: "100%-owned project management arm",
    },
    {
      phase: "DEVELOPMENT",
      capability: "Plotting & land development",
      scope: "Planning, plotting, approvals, marketing and sale of RERA-compliant layouts",
      evidence: "Ave Acres · aveacres.com",
    },
    {
      phase: "OPERATIONS",
      capability: "Operations & asset management",
      scope:
        "Facility & property management, maintenance planning, statutory compliance, tenant coordination, HSE",
      evidence: "98% portfolio occupancy",
    },
    {
      phase: "MONETIZATION",
      capability: "Asset monetization",
      scope: "Sale or transfer of SPVs, including offers to NDR InvIT under ROFO",
      evidence: "INR 143.9 cr MLG monetization",
    },
  ] as const,
  source: "Source: Client IA response · Post-Demerger business note · NDR Corporate Presentation",
} as const;

export type StructureBranch = {
  name: string;
  function: string;
  relationship: string;
  route?: DivisionRoute;
  routeNote?: string;
};

export const corporateStructure = {
  header: { name: "NDR Smart Spaces Pvt. Ltd.", role: "Parent platform of the NDR Group" },
  branches: [
    {
      name: "Group SPVs",
      function: "Owns / leases land · constructs warehouses",
      relationship: "Rental income · subsidiaries / JVs",
      routeNote: "Asset register routes to Portfolio when built",
    },
    {
      name: "NDR Asset Management Pvt. Ltd.",
      function: "Project management company",
      relationship: "PMC fee · 100% ownership",
    },
    {
      name: "Ave Acres LLP",
      function: "Development entity · plotting",
      relationship: "Development fee · sale of developed land",
      route: { label: "Ave Acres", href: "https://aveacres.com", external: true },
    },
    {
      name: "NDR InvIT Trust",
      function: "Separate listed entity under the NDR Group",
      relationship: "Sale of SPV ownership · consideration",
      route: { label: "NDR InvIT Trust", href: "https://ndrinvit.com", external: true },
    },
    {
      name: "Third parties",
      function: "Sale of developed land",
      relationship: "Consideration",
    },
  ] as readonly StructureBranch[],
  source: "Source: NDR structure diagram · Post-Demerger business note",
} as const;

export type ChainNode = { index: string; name: string; caption: string };

export const capitalDeployment = {
  rofo: "Right of First Offer — NDR InvIT evaluates each eligible asset before any third party.",
  chain: [
    { index: "01", name: "Develop", caption: "SPVs build on owned or leased land" },
    {
      index: "02",
      name: "Offer under ROFO",
      caption: "Each eligible asset is offered before any third party",
    },
    { index: "03", name: "Monetize", caption: "SPV ownership transfers to NDR InvIT" },
    { index: "04", name: "Recycle", caption: "Consideration returns to new development" },
    { index: "05", name: "Develop", caption: "The loop begins again" },
  ] as const satisfies readonly ChainNode[],
  evidence: "INR 143.9 cr MLG monetization · SPV transfers to NDR InvIT",
  evidenceSource: "Source: NDR Corporate Presentation",
  cta: { label: "NDR InvIT Trust", href: "https://ndrinvit.com" },
  source: "Source: Client IA response · NDR Corporate Presentation",
} as const;

export const execution = {
  evidenceLabel: "Execution record",
  chain: [
    { index: "01", name: "Originate", caption: "Identify land and structure the SPV" },
    { index: "02", name: "Design", caption: "Design coordination and scheduling" },
    { index: "03", name: "Procure", caption: "Procurement of materials and services" },
    { index: "04", name: "Build", caption: "Construction management and quality assurance" },
    {
      index: "05",
      name: "Assure & Deliver",
      caption: "Inspection, assurance and timely completion",
    },
    { index: "06", name: "Operate", caption: "Facility and asset management" },
  ] as const satisfies readonly ChainNode[],
  evidence: [
    {
      claim: "6,00,000 sq ft Amazon Fulfilment Centre delivered in 4 months",
      source: "Source: NDR Corporate Presentation",
    },
    {
      claim: "99% of industrial projects of NDR are greenfield",
      source: "Source: NDR Corporate Presentation",
    },
  ] as const,
  source: "Source: Client IA response · NDR Corporate Presentation",
} as const;

export const businessClosing = {
  line: "How the platform runs, documented.",
  enquiry: { label: "Business Enquiry", href: "mailto:project@ndrsmart.com" },
  portfolio: {
    label: "View the asset portfolio",
    note: "Opens with the Portfolio page · Phase 2",
  },
} as const;
