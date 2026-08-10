/**
 * Collection editor schemas — the data-driven editor model (Phase 1.1).
 *
 * Each of the seven Phase 1.1 editors is described here: field kinds, required
 * rules, formats, and map/list children. The admin UI renders from these
 * schemas; the engine validates against them. Editors never bypass the CMS
 * engine — custom validation (routes, publication gate) is layered on top
 * (editor/validators.ts).
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "email"
  | "url"
  | "list"
  | "object"
  | "map"
  | "file";

export type FieldSchema = {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  options?: readonly string[];
  helper?: string;
  placeholder?: string;
  itemFields?: readonly FieldSchema[];
  fields?: readonly FieldSchema[];
  keyLabel?: string;
  valueLabel?: string;
};

export type EditorKind = "settings" | "navigation" | "footer" | "documents" | "media" | "records";

export type CollectionEditorSchema = {
  key: string;
  label: string;
  editor: EditorKind;
  singleRecord?: boolean;
  statusEnabled?: boolean;
  refKind?: "doc" | "register:gv";
  description: string;
  fields: readonly FieldSchema[];
};

export const EDITOR_SCHEMAS: readonly CollectionEditorSchema[] = [
  {
    key: "corporate-settings",
    label: "Corporate Settings",
    editor: "settings",
    singleRecord: true,
    description: "Legal entity, CIN, addresses, phones, emails (blueprint §1.1).",
    fields: [
      { key: "companyName", label: "Company name", kind: "text", required: true },
      { key: "legalEntity", label: "Legal entity", kind: "text", required: true },
      { key: "registryLine", label: "Registry line", kind: "text" },
      {
        key: "cin",
        label: "CIN",
        kind: "text",
        required: true,
        pattern: "^[A-Z0-9]{21}$",
        helper: "21-character Corporate Identification Number.",
      },
      {
        key: "addresses",
        label: "Addresses",
        kind: "list",
        itemFields: [
          { key: "label", label: "Label", kind: "text", required: true },
          {
            key: "lines",
            label: "Address lines",
            kind: "list",
            required: true,
            itemFields: [{ key: "value", label: "Line", kind: "text", required: true }],
          },
        ],
      },
      {
        key: "phoneNumbers",
        label: "Phone numbers",
        kind: "list",
        itemFields: [{ key: "value", label: "Phone", kind: "text", required: true }],
      },
      {
        key: "emails",
        label: "Emails",
        kind: "list",
        itemFields: [{ key: "value", label: "Email", kind: "email", required: true }],
      },
      { key: "pressResponseExpectation", label: "Press response expectation", kind: "text" },
      {
        key: "externalLinks",
        label: "External links",
        kind: "object",
        fields: [
          { key: "invitUrl", label: "NDR InvIT URL", kind: "url" },
          { key: "aveAcresUrl", label: "Ave Acres URL", kind: "url" },
          { key: "googleMapsDirectionsUrl", label: "Google Maps directions URL", kind: "url" },
        ],
      },
    ],
  },
  {
    key: "publication-settings",
    label: "Publication Settings",
    editor: "settings",
    singleRecord: true,
    description: "Edition, reporting period, prefixes, numbering rules (blueprint §1.2).",
    fields: [
      {
        key: "editionPeriod",
        label: "Edition period",
        kind: "text",
        required: true,
        placeholder: "FY26",
      },
      {
        key: "asOnDate",
        label: "Reporting period",
        kind: "text",
        required: true,
        placeholder: "As on 31 March 2026",
      },
      {
        key: "documentPrefixes",
        label: "Document prefixes",
        kind: "map",
        keyLabel: "Prefix",
        valueLabel: "Format",
      },
      {
        key: "numberingRules",
        label: "Numbering rules",
        kind: "map",
        keyLabel: "Rule",
        valueLabel: "Format",
      },
      { key: "copyrightLine", label: "Copyright line", kind: "text", required: true },
    ],
  },
  {
    key: "brand-settings",
    label: "Brand Settings",
    editor: "settings",
    singleRecord: true,
    description: "Logos, favicon, SEO defaults, OG image, social links (blueprint §1.3).",
    fields: [
      { key: "brandName", label: "Brand name", kind: "text", required: true },
      {
        key: "logoLight",
        label: "Logo — light",
        kind: "object",
        fields: [
          { key: "src", label: "Path", kind: "text", required: true },
          { key: "alt", label: "Alt text", kind: "text" },
        ],
      },
      {
        key: "logoDark",
        label: "Logo — dark",
        kind: "object",
        fields: [
          { key: "src", label: "Path", kind: "text", required: true },
          { key: "alt", label: "Alt text", kind: "text" },
        ],
      },
      { key: "favicon", label: "Favicon", kind: "file" },
      {
        key: "seoDefaults",
        label: "SEO defaults",
        kind: "object",
        fields: [
          { key: "title", label: "Title", kind: "text", required: true },
          { key: "description", label: "Description", kind: "textarea" },
        ],
      },
      { key: "ogImage", label: "OG image", kind: "file" },
      {
        key: "socialLinks",
        label: "Social links",
        kind: "list",
        itemFields: [
          { key: "label", label: "Label", kind: "text", required: true },
          { key: "href", label: "URL", kind: "url", required: true },
        ],
      },
    ],
  },
  {
    key: "navigation",
    label: "Navigation",
    editor: "navigation",
    singleRecord: true,
    description: "Header nav, utility strip, header CTA, mobile nav (blueprint §2).",
    fields: [],
  },
  {
    key: "footer",
    label: "Footer",
    editor: "footer",
    singleRecord: true,
    description: "Footer groups, legal links, contact, social, copyright (blueprint §2).",
    fields: [],
  },
  {
    key: "documents",
    label: "Documents Register",
    editor: "documents",
    statusEnabled: true,
    refKind: "doc",
    description: "Filings, disclosures, policies — the central publication gate (blueprint §11.4).",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "category", label: "Category", kind: "text", required: true },
      { key: "type", label: "Type", kind: "text", required: true },
      { key: "asOn", label: "Reporting period", kind: "text", placeholder: "As on 31 March 2026" },
      { key: "note", label: "Note", kind: "textarea" },
      { key: "href", label: "External href", kind: "url" },
      { key: "size", label: "Size label", kind: "text" },
      { key: "revision", label: "Revision", kind: "text" },
      {
        key: "fileUpload",
        label: "Upload file",
        kind: "file",
        helper: "Optional at draft; required before publish (or provide an external href).",
      },
    ],
  },
  {
    key: "media",
    label: "Media Library",
    editor: "media",
    statusEnabled: true,
    description: "Images, logos, PDFs, SVGs — referenceable across collections (blueprint §11.5).",
    fields: [
      { key: "name", label: "File name", kind: "text", required: true },
      {
        key: "kind",
        label: "Kind",
        kind: "select",
        required: true,
        options: ["image", "logo", "pdf", "svg"],
      },
      { key: "folder", label: "Folder", kind: "text", helper: "Organise assets into folders." },
      { key: "mime", label: "MIME type", kind: "text" },
      { key: "alt", label: "Alt text", kind: "text", helper: "Required for images." },
      { key: "caption", label: "Caption", kind: "textarea" },
      {
        key: "fileUpload",
        label: "Upload file",
        kind: "file",
        helper: "Optional at draft; required before publish.",
      },
    ],
  },
  {
    key: "metrics",
    label: "Metrics",
    editor: "records",
    statusEnabled: true,
    description:
      "Canonical metric ledger — every figure with its source and period (blueprint §11.1).",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      {
        key: "key",
        label: "Key",
        kind: "text",
        required: true,
        pattern: "^[A-Z]{1,4}\\d*(?:-\\d+)?$",
        helper: "Canonical key, e.g. M17 or EN-01. Unique across the ledger.",
      },
      {
        key: "value",
        label: "Display value",
        kind: "text",
        required: true,
        placeholder: "60+ years",
      },
      { key: "unit", label: "Unit", kind: "text", placeholder: "%" },
      {
        key: "period",
        label: "Reporting period",
        kind: "text",
        required: true,
        placeholder: "As on FY26",
      },
      { key: "source", label: "Source", kind: "text", required: true },
      {
        key: "entity",
        label: "Entity",
        kind: "select",
        options: ["ndr-smart-spaces", "ndr-invit", "ndr-group"],
      },
      {
        key: "lead",
        label: "Lead metric",
        kind: "boolean",
        helper: "Include in the landing metrics band.",
      },
      {
        key: "history",
        label: "Historical values",
        kind: "list",
        itemFields: [
          { key: "value", label: "Value", kind: "text", required: true },
          { key: "period", label: "Period", kind: "text", required: true },
          { key: "source", label: "Source", kind: "text" },
        ],
      },
      {
        key: "usages",
        label: "Usages",
        kind: "list",
        itemFields: [
          {
            key: "target",
            label: "Target (route)",
            kind: "text",
            required: true,
            placeholder: "/en/investor-centre#capital-strength",
          },
          { key: "label", label: "Label", kind: "text", required: true },
        ],
      },
      { key: "note", label: "Note", kind: "textarea" },
    ],
  },
  {
    key: "locations",
    label: "Locations",
    editor: "records",
    statusEnabled: true,
    description:
      "Master geographic collection — zones, tiers, coordinates, visibility, offsets (blueprint §11.2).",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      {
        key: "tier",
        label: "Tier",
        kind: "select",
        required: true,
        options: ["hq", "hub", "satellite"],
      },
      {
        key: "zone",
        label: "Zone",
        kind: "select",
        required: true,
        options: ["south", "west", "east", "north"],
      },
      { key: "region", label: "Region", kind: "text", placeholder: "Tamil Nadu" },
      { key: "line", label: "Line", kind: "text", placeholder: "Chennai, Tamil Nadu" },
      { key: "lat", label: "Latitude", kind: "number", required: true },
      { key: "lon", label: "Longitude", kind: "number", required: true },
      {
        key: "homepageOffset",
        label: "Homepage map offset",
        kind: "object",
        fields: [
          { key: "x", label: "x", kind: "number", required: true },
          { key: "y", label: "y", kind: "number", required: true },
          { key: "labelSide", label: "Label side", kind: "select", options: ["left", "right"] },
          {
            key: "leaderTo",
            label: "Leader line target",
            kind: "object",
            fields: [
              { key: "x", label: "x", kind: "number", required: true },
              { key: "y", label: "y", kind: "number", required: true },
            ],
          },
        ],
      },
      {
        key: "portfolioOffset",
        label: "Portfolio map offset",
        kind: "object",
        fields: [
          { key: "x", label: "x", kind: "number", required: true },
          { key: "y", label: "y", kind: "number", required: true },
          { key: "labelSide", label: "Label side", kind: "select", options: ["left", "right"] },
          {
            key: "leaderTo",
            label: "Leader line target",
            kind: "object",
            fields: [
              { key: "x", label: "x", kind: "number", required: true },
              { key: "y", label: "y", kind: "number", required: true },
            ],
          },
        ],
      },
      {
        key: "contactOffset",
        label: "Contact map offset",
        kind: "object",
        fields: [
          { key: "x", label: "x", kind: "number", required: true },
          { key: "y", label: "y", kind: "number", required: true },
          { key: "labelSide", label: "Label side", kind: "select", options: ["left", "right"] },
        ],
      },
      {
        key: "visible",
        label: "Surface visibility",
        kind: "object",
        fields: [
          { key: "homepage", label: "Homepage", kind: "boolean" },
          { key: "portfolio", label: "Portfolio", kind: "boolean" },
          { key: "contact", label: "Contact", kind: "boolean" },
        ],
      },
      {
        key: "media",
        label: "Media",
        kind: "list",
        itemFields: [{ key: "mediaId", label: "Media id", kind: "text", required: true }],
      },
      {
        key: "documents",
        label: "Documents",
        kind: "list",
        itemFields: [{ key: "ref", label: "Document ref", kind: "text", required: true }],
      },
      { key: "address", label: "Address", kind: "textarea" },
      { key: "note", label: "Note", kind: "textarea" },
    ],
  },
  {
    key: "portfolio-assets",
    label: "Portfolio Assets",
    editor: "records",
    statusEnabled: true,
    description: "Catalogue plates — each asset linked to a shared location (blueprint §11.3).",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      {
        key: "plate",
        label: "Plate",
        kind: "text",
        required: true,
        pattern: "^\\d{2}$",
        helper: "Two-digit catalogue plate (NN). Unique.",
      },
      { key: "city", label: "City", kind: "text", required: true },
      {
        key: "zone",
        label: "Zone",
        kind: "select",
        required: true,
        options: ["south", "west", "east", "north"],
      },
      {
        key: "locationId",
        label: "Location",
        kind: "text",
        helper: "Id of the published shared location.",
      },
      {
        key: "class",
        label: "Class",
        kind: "select",
        required: true,
        options: ["warehousing", "industrial", "commercial", "institutional"],
      },
      {
        key: "status",
        label: "Status",
        kind: "select",
        required: true,
        options: ["completed", "ongoing"],
      },
      { key: "sizeSqFt", label: "Size (sq ft)", kind: "number" },
      { key: "occupier", label: "Occupier", kind: "text" },
      { key: "completedYear", label: "Completed year", kind: "text", pattern: "^\\d{4}$" },
      { key: "entity", label: "Entity", kind: "select", options: ["spv", "invit"] },
      {
        key: "imageMedia",
        label: "Image media id",
        kind: "text",
        helper: "Id of a published media asset.",
      },
      {
        key: "route",
        label: "Route",
        kind: "object",
        fields: [
          { key: "label", label: "Label", kind: "text", required: true },
          {
            key: "href",
            label: "Href",
            kind: "text",
            required: true,
            placeholder: "/en/portfolio#register",
          },
          { key: "external", label: "External", kind: "boolean" },
        ],
      },
      { key: "source", label: "Source", kind: "text" },
    ],
  },
  {
    key: "business-verticals",
    label: "Business Verticals",
    editor: "records",
    statusEnabled: true,
    description:
      "Operating divisions with specs, proof and cross-referenced metrics (blueprint §11.6).",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      {
        key: "index",
        label: "Index",
        kind: "text",
        required: true,
        pattern: "^\\d{2}$",
        helper: "Two-digit chapter index (NN). Unique.",
      },
      { key: "writeup", label: "Write-up", kind: "textarea", required: true },
      {
        key: "spec",
        label: "Spec",
        kind: "list",
        itemFields: [
          { key: "label", label: "Label", kind: "text", required: true },
          { key: "value", label: "Value", kind: "text", required: true },
        ],
      },
      { key: "proof", label: "Proof", kind: "text", required: true },
      { key: "proofSource", label: "Proof source", kind: "text", required: true },
      { key: "anchor", label: "Section anchor", kind: "text", placeholder: "grade-a-warehousing" },
      {
        key: "route",
        label: "Route",
        kind: "object",
        fields: [
          { key: "label", label: "Label", kind: "text", required: true },
          {
            key: "href",
            label: "Href",
            kind: "text",
            required: true,
            placeholder: "/en/business#grade-a-warehousing",
          },
          { key: "external", label: "External", kind: "boolean" },
        ],
      },
      { key: "imageMedia", label: "Image media id", kind: "text" },
      {
        key: "metrics",
        label: "Metrics",
        kind: "list",
        itemFields: [{ key: "metricKey", label: "Metric key", kind: "text", required: true }],
      },
      { key: "source", label: "Source", kind: "text" },
    ],
  },
  {
    key: "esg-initiatives",
    label: "ESG Initiatives",
    editor: "records",
    statusEnabled: true,
    description:
      "Impact initiatives on the ledger map — each tied to a shared location (blueprint §11.7).",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      {
        key: "code",
        label: "Code",
        kind: "text",
        required: true,
        pattern: "^[A-Z]+-\\d+$",
        helper: "Registry-style code, e.g. IM-01. Unique.",
      },
      { key: "place", label: "Place", kind: "text", required: true },
      { key: "region", label: "Region", kind: "text" },
      {
        key: "category",
        label: "Category",
        kind: "select",
        required: true,
        options: ["energy", "water", "waste", "green-building", "community"],
      },
      {
        key: "status",
        label: "Status",
        kind: "select",
        required: true,
        options: ["Operational", "Planned", "In certification", "Under development", "Scoping"],
      },
      {
        key: "locationId",
        label: "Location",
        kind: "text",
        required: true,
        helper: "Id of the published shared location.",
      },
      { key: "lat", label: "Latitude", kind: "number", required: true },
      { key: "lon", label: "Longitude", kind: "number", required: true },
      { key: "note", label: "Note", kind: "textarea" },
      {
        key: "media",
        label: "Media",
        kind: "list",
        itemFields: [{ key: "mediaId", label: "Media id", kind: "text", required: true }],
      },
      {
        key: "documents",
        label: "Documents",
        kind: "list",
        itemFields: [{ key: "ref", label: "Document ref", kind: "text", required: true }],
      },
    ],
  },
  {
    key: "governance-records",
    label: "Governance Records",
    editor: "records",
    statusEnabled: true,
    refKind: "register:gv",
    description:
      "Board, committee, policy and charter records — numbered by the register (blueprint §11.8).",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      {
        key: "kind",
        label: "Kind",
        kind: "select",
        required: true,
        options: ["board", "committee", "policy", "charter"],
      },
      { key: "holder", label: "Holder", kind: "text" },
      { key: "role", label: "Role", kind: "text" },
      {
        key: "recordStatus",
        label: "Record status",
        kind: "select",
        required: true,
        options: ["active", "pending", "superseded"],
      },
      { key: "summary", label: "Summary", kind: "textarea" },
      {
        key: "documentRef",
        label: "Document ref",
        kind: "text",
        helper: "Ref of a published document in the register.",
      },
      { key: "photoMedia", label: "Photo media id", kind: "text" },
      { key: "effectiveDate", label: "Effective date", kind: "text" },
    ],
  },
  {
    key: "contact-directory",
    label: "Contact Directory",
    editor: "records",
    statusEnabled: true,
    description:
      "Offices and response desks — each optionally tied to a shared location (blueprint §11.9).",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      {
        key: "key",
        label: "Key",
        kind: "text",
        required: true,
        pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        helper: "Slug key, e.g. corporate. Unique.",
      },
      { key: "kind", label: "Kind", kind: "text", required: true, placeholder: "Corporate office" },
      {
        key: "lines",
        label: "Address lines",
        kind: "list",
        itemFields: [{ key: "value", label: "Line", kind: "text", required: true }],
      },
      { key: "phone", label: "Phone", kind: "text", required: true },
      {
        key: "email",
        label: "Email",
        kind: "object",
        fields: [
          { key: "label", label: "Label", kind: "email", required: true },
          { key: "href", label: "Href", kind: "url", required: true },
        ],
      },
      { key: "hours", label: "Hours", kind: "text", required: true },
      {
        key: "directions",
        label: "Directions",
        kind: "object",
        fields: [
          { key: "label", label: "Label", kind: "text", required: true },
          { key: "href", label: "Href", kind: "url", required: true },
          { key: "external", label: "External", kind: "boolean" },
        ],
      },
      {
        key: "locationId",
        label: "Location",
        kind: "text",
        helper: "Id of the published shared location.",
      },
      { key: "note", label: "Note", kind: "textarea" },
    ],
  },
];

export function getEditorSchema(key: string): CollectionEditorSchema | undefined {
  return EDITOR_SCHEMAS.find((schema) => schema.key === key);
}
