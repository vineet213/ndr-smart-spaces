export type MenuLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type MegaMenuColumn = {
  heading: string;
  links: MenuLink[];
};

export type MenuOverview = {
  label: string;
  tagline: string;
  href: string;
};

export type MenuId = "business" | "investor";

export type NavMenu = {
  type: "menu";
  id: MenuId;
  label: string;
  href: string;
  align: "left" | "right";
  overview: MenuOverview;
  columns: MegaMenuColumn[];
};

export type NavLink = {
  type: "link";
  label: string;
  href: string;
};

export type NavItem = NavLink | NavMenu;

export const utilityStrip = {
  entity: "NDR Smart Spaces Pvt. Ltd. — an NDR Group platform",
  invIT: { label: "NDR InvIT Trust", href: "https://ndrinvit.com" },
  email: { label: "compliance@ndrsmart.com", href: "mailto:compliance@ndrsmart.com" },
} as const;

export const headerCta = {
  enquiry: { label: "Business Enquiry", href: "/en/contact#business-enquiry" },
} as const;

export const navItems: NavItem[] = [
  { type: "link", label: "About Us", href: "/en/about-us" },
  {
    type: "menu",
    id: "business",
    label: "Business",
    href: "/en/business",
    align: "left",
    overview: { label: "Business Overview", tagline: "The Operating Manual", href: "/en/business" },
    columns: [
      {
        heading: "Business Verticals",
        links: [
          { label: "Grade A Warehousing", href: "/en/business#grade-a-warehousing" },
          { label: "NDR Asset Management", href: "/en/business#ndr-asset-management" },
          {
            label: "Residential Plotting — Ave Acres",
            href: "https://aveacres.com",
            external: true,
          },
          { label: "The NDR InvIT relationship", href: "/en/business#capital" },
        ],
      },
    ],
  },
  { type: "link", label: "Portfolio", href: "/en/portfolio" },
  {
    type: "menu",
    id: "investor",
    label: "Investor Centre",
    href: "/en/investor-centre",
    align: "right",
    overview: {
      label: "Investor Overview",
      tagline: "The Financial Statement",
      href: "/en/investor-centre",
    },
    columns: [
      {
        heading: "Investor Centre",
        links: [
          { label: "Investment Highlights", href: "/en/investor-centre/investment-highlights" },
          { label: "Reports & Disclosures", href: "/en/investor-centre/reports-disclosures" },
          { label: "Financial Results", href: "/en/investor-centre/financial-results" },
        ],
      },
      {
        heading: "Governance",
        links: [
          { label: "Annual Reports", href: "/en/investor-centre/annual-reports" },
          { label: "Corporate Governance", href: "/en/investor-centre/corporate-governance" },
          { label: "Announcements", href: "/en/investor-centre/announcements" },
          { label: "Downloads", href: "/en/investor-centre/downloads" },
        ],
      },
    ],
  },
  { type: "link", label: "ESG & Sustainability", href: "/en/esg" },
  { type: "link", label: "Media & Newsroom", href: "/en/media" },
  { type: "link", label: "Contact", href: "/en/contact" },
];

export const mobileNavItems: NavItem[] = [
  { type: "link", label: "Home", href: "/en" },
  ...navItems,
];

export const mobileMenuFooter = {
  heading: "Correspondence",
  emails: ["compliance@ndrsmart.com", "investors@ndrsmart.com"],
  notes: ["NDR Smart Spaces Pvt. Ltd. — CIN U45201TN2005PTC059267"],
} as const;

export const siteHome = "/en";

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "#") return false;
  if (href.startsWith("mailto:") || href.startsWith("https://")) return false;
  const clean = href.split("#")[0];
  if (clean === "/en") return pathname === "/en";
  return pathname === clean || pathname.startsWith(clean + "/");
}
