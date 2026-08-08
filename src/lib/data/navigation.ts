export type MenuLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type MegaMenuColumn = {
  heading: string;
  links: MenuLink[];
};

export type MenuId = "business" | "investor";

export type NavMenu = {
  type: "menu";
  id: MenuId;
  label: string;
  href: string;
  align: "left" | "right";
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
  investor: { label: "Investor Centre", href: "/en/investor-centre" },
  enquiry: { label: "Business Enquiry", href: "/en/contact#business-enquiry" },
} as const;

export const navItems: NavItem[] = [
  { type: "link", label: "Home", href: "/en" },
  { type: "link", label: "About Us", href: "/en/about-us" },
  {
    type: "menu",
    id: "business",
    label: "Business",
    href: "/en/business",
    align: "left",
    columns: [
      {
        heading: "Business",
        links: [
          { label: "Business Overview", href: "/en/business" },
          { label: "Asset Portfolio", href: "/en/portfolio" },
        ],
      },
      {
        heading: "Business Verticals",
        links: [
          { label: "Grade A Warehousing", href: "/en/business/grade-a-warehousing" },
          { label: "NDR Asset Management", href: "/en/business/ndr-asset-management" },
          {
            label: "Residential Plotting — Ave Acres",
            href: "https://aveacres.com",
            external: true,
          },
          { label: "The NDR InvIT relationship", href: "/en/business/ndr-invit" },
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
    columns: [
      {
        heading: "Investor Centre",
        links: [
          { label: "Investor Overview", href: "/en/investor-centre" },
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
  { type: "link", label: "ESG", href: "/en/esg" },
  { type: "link", label: "Media", href: "/en/media" },
  { type: "link", label: "Contact", href: "/en/contact" },
] as const;

export function isActivePath(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/+$/, "");
  const target = href.replace(/\/+$/, "");
  return path === target || path.startsWith(`${target}/`);
}

export const mobileMenuFooter = {
  heading: "Business Enquiry",
  emails: [
    { label: "project@ndrsmart.com", href: "mailto:project@ndrsmart.com" },
    { label: "compliance@ndrsmart.com", href: "mailto:compliance@ndrsmart.com" },
  ],
} as const;

export const siteHome = "/en";
