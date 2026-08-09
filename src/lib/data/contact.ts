import { projectPlace, INDIA_OUTLINE, MAP_VIEWBOX } from "./portfolio";

/**
 * Contact — NDR Smart Spaces.
 *
 * The company's contact record: where it is reached, how enquiries are routed
 * and which desk answers. Content is source-grounded — office addresses and
 * email addresses are approved records. Phone numbers and office hours are
 * draft particulars awaiting client confirmation before go-live; the directory
 * note restates the rule.
 */

/* masthead ---------------------------------------------------------------- */

export const contactMasthead = {
  registry: "NDR Smart Spaces Pvt. Ltd. — an NDR Group platform",
  publication: "Contact",
  section: "Contact",
  title: { before: "Contact ", accent: "NDR Smart Spaces", after: "." },
  statement:
    "Corporate offices, investor relations, media contacts, ESG inquiries, and business development.",
  watermark: "CO",
} as const;

/* office directory -------------------------------------------------------- */

export type ContactOffice = {
  key: string;
  kind: string;
  name: string;
  lines: readonly string[];
  phone: string;
  email: { label: string; href: string };
  hours: string;
  directions?: { label: string; href: string; external: boolean };
};

export const officeDirectory = {
  eyebrow: "Office directory",
  heading: "Where to reach us.",
  lede: "Five addresses that receive correspondence — the corporate and registered offices, and the desks that answer investor, business and media enquiries.",
  note: "Phone numbers and office hours are draft particulars awaiting client confirmation before go-live. Hours are Indian Standard Time (IST).",
  offices: [
    {
      key: "corporate",
      kind: "Corporate office",
      name: "NDR Smart Spaces Pvt. Ltd.",
      lines: [
        "No. 56/1, next to GT Reddy Cars, Bazulla Road, T. Nagar",
        "Chennai, Tamil Nadu 600017",
      ],
      phone: "+91 44 4296 1200",
      email: { label: "project@ndrsmart.com", href: "mailto:project@ndrsmart.com" },
      hours: "Monday – Saturday · 9:30 AM – 6:30 PM IST",
      directions: {
        label: "Open in Google Maps",
        href: "https://www.google.com/maps/dir/13.0520847,80.246055/NDR+INVIT,+56-79,+Bazulla+Rd,+Bharathy+Nagar,+Rama+Kamat+Puram,+Chennai,+Greater+Chennai,+Tamil+Nadu+600017",
        external: true,
      },
    },
    {
      key: "registered",
      kind: "Registered office",
      name: "Registered office",
      lines: ["Registered office address and CIN to be confirmed."],
      phone: "+91 44 4296 1201",
      email: { label: "compliance@ndrsmart.com", href: "mailto:compliance@ndrsmart.com" },
      hours: "Monday – Saturday · 9:30 AM – 6:30 PM IST",
    },
    {
      key: "investor",
      kind: "Investor relations",
      name: "Investor relations desk",
      lines: ["Investor centre · reports & disclosures · investor queries"],
      phone: "+91 44 4296 1202",
      email: { label: "compliance@ndrsmart.com", href: "mailto:compliance@ndrsmart.com" },
      hours: "Monday – Saturday · 9:30 AM – 6:30 PM IST",
    },
    {
      key: "business",
      kind: "Business development",
      name: "Business development desk",
      lines: ["Grade A warehousing · asset management · land & plotting · partnerships"],
      phone: "+91 44 4296 1203",
      email: { label: "project@ndrsmart.com", href: "mailto:project@ndrsmart.com" },
      hours: "Monday – Saturday · 9:30 AM – 6:30 PM IST",
    },
    {
      key: "media",
      kind: "Media contact",
      name: "Media relations desk",
      lines: ["Press releases · coverage · interviews"],
      phone: "+91 44 4296 1204",
      email: { label: "compliance@ndrsmart.com", href: "mailto:compliance@ndrsmart.com" },
      hours: "Monday – Saturday · 9:30 AM – 6:30 PM IST",
    },
  ] as readonly ContactOffice[],
} as const;

/* inquiry routing --------------------------------------------------------- */

export type InquiryDesk = {
  key: "business" | "investor" | "media" | "esg" | "general";
  label: string;
  purpose: string;
  route: string;
  recipient: string;
  href: string;
  phone: string;
  response: string;
  note: string;
};

export const inquiryRouting = {
  eyebrow: "Routing",
  heading: "Contact the right team.",
  lede: "Every enquiry lands on the desk that answers it — business, investor relations, media, ESG or general. Write to the desk directly or use the enquiry form and the routing is applied for you.",
  note: "A misdirected enquiry is still answered within two business days.",
  desks: [
    {
      key: "business",
      label: "Business",
      purpose: "Commercial correspondence",
      route: "Grade A Warehousing · Asset Management · Land & Plotting · Partnerships",
      recipient: "project@ndrsmart.com",
      href: "mailto:project@ndrsmart.com",
      phone: "+91 44 4296 1203",
      response: "Within 2 business days",
      note: "The commercial desk — warehousing, asset management, land and partnerships.",
    },
    {
      key: "investor",
      label: "Investor relations",
      purpose: "Investor correspondence",
      route: "Investor centre · reports & disclosures · investor queries",
      recipient: "compliance@ndrsmart.com",
      href: "mailto:compliance@ndrsmart.com",
      phone: "+91 44 4296 1202",
      response: "Within 2 business days",
      note: "The investor desk — the investor centre, its disclosures and investor queries.",
    },
    {
      key: "media",
      label: "Media",
      purpose: "Press & media correspondence",
      route: "Press releases · coverage · interviews",
      recipient: "compliance@ndrsmart.com",
      href: "mailto:compliance@ndrsmart.com",
      phone: "+91 44 4296 1204",
      response: "Within 2 business days",
      note: "The press desk — journalists and editors writing to the newsroom.",
    },
    {
      key: "esg",
      label: "ESG & sustainability",
      purpose: "Sustainability correspondence",
      route: "Sustainability · ESG disclosures · climate",
      recipient: "compliance@ndrsmart.com",
      href: "mailto:compliance@ndrsmart.com",
      phone: "+91 44 4296 1205",
      response: "Within 2 business days",
      note: "The ESG desk — the sustainability ledger and its disclosures.",
    },
    {
      key: "general",
      label: "General",
      purpose: "All other correspondence",
      route: "Enquiries not covered by the desks above",
      recipient: "project@ndrsmart.com",
      href: "mailto:project@ndrsmart.com",
      phone: "+91 44 4296 1200",
      response: "Within 2 business days",
      note: "The general line — anything the desks above do not cover.",
    },
  ] as readonly InquiryDesk[],
} as const;

/* form -------------------------------------------------------------------- */

export const correspondenceForm = {
  eyebrow: "Send an enquiry",
  heading: "Business Enquiry",
  subheading:
    "Tell us who you are and what you need — the enquiry is routed to the desk that answers it.",
  response: "Within 2 business days",
  note: "Enquiries are logged on intake, routed to the desk that answers them, and replied to within two business days.",
  fields: [
    { name: "name", label: "Name", type: "text", autocomplete: "name", required: true },
    {
      name: "company",
      label: "Company",
      type: "text",
      autocomplete: "organization",
      required: true,
    },
    { name: "email", label: "Work email", type: "email", autocomplete: "email", required: true },
    { name: "phone", label: "Phone", type: "tel", autocomplete: "tel", required: false },
  ] as const,
  enquiryTypes: [
    "Business enquiry",
    "Investor relations",
    "Press & media",
    "ESG & sustainability",
    "General",
  ] as const,
  messageLabel: "Message",
  submit: "Send Inquiry",
  sending: "Sending…",
  success: "Thank you — your enquiry has been sent and routed to the right desk.",
  route: {
    "Business enquiry": "project@ndrsmart.com",
    "Investor relations": "compliance@ndrsmart.com",
    "Press & media": "compliance@ndrsmart.com",
    "ESG & sustainability": "compliance@ndrsmart.com",
    General: "project@ndrsmart.com",
  } as const,
  deskForType: {
    "Business enquiry": "Business desk",
    "Investor relations": "Investor relations desk",
    "Press & media": "Media desk",
    "ESG & sustainability": "ESG desk",
    General: "General desk",
  } as const,
} as const;

/* map --------------------------------------------------------------------- */

export const contactMap = {
  eyebrow: "Office locations",
  heading: "The office on the map.",
  lede: "The corporate office in Chennai — the company's primary correspondence address — plotted on the group's schematic outline of India.",
  captionLead: "Fig. 01 · Office locations",
  captionDetail:
    "The corporate office is the primary correspondence address. The registered office and regional offices are listed in the office directory.",
  frameMark: "NDR Smart Spaces",
  plateRef: "Office locations",
  notToScale: "Schematic outline · not to scale",
  directions: {
    label: "Get directions",
    href: "https://www.google.com/maps/dir/13.0520847,80.246055/NDR+INVIT,+56-79,+Bazulla+Rd,+Bharathy+Nagar,+Rama+Kamat+Puram,+Chennai,+Greater+Chennai,+Tamil+Nadu+600017",
  },
  source: "Source: Corporate office record",
  legend: [{ key: "hq", label: "Corporate office — Chennai" }] as readonly {
    key: "hq";
    label: string;
  }[],
  mapViewbox: MAP_VIEWBOX,
  indiaOutline: INDIA_OUTLINE,
  markers: [
    {
      id: "chennai-office",
      name: "Corporate office",
      place: "Chennai",
      region: "Tamil Nadu",
      lat: 13.0521,
      lon: 80.2461,
      x: projectPlace(13.0521, 80.2461).x,
      y: projectPlace(13.0521, 80.2461).y,
    },
  ] as readonly {
    id: string;
    name: string;
    place: string;
    region: string;
    lat: number;
    lon: number;
    x: number;
    y: number;
  }[],
} as const;

/* closing ----------------------------------------------------------------- */

export const contactClosing = {
  eyebrow: "Contact",
  line: "Contact NDR Smart Spaces.",
  body: "Business, investor, media, and partnership inquiries.",
  primaryCta: { label: "Send an enquiry", href: "/en/contact#business-enquiry" },
  secondaryCta: { label: "Open the Press Register", href: "/en/media" },
  tertiaryLink: { label: "NDR InvIT Trust", href: "https://ndrinvit.com" },
} as const;
