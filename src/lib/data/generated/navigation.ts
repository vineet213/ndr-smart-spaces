export const navigation = {
  headerCta: {
    enquiry: {
      href: "/contact#business-enquiry",
      label: "Business Enquiry",
    },
  },
  mobileMenuFooter: {
    emails: ["compliance@ndrsmart.com", "investors@ndrsmart.com"],
    heading: "Correspondence",
    notes: ["NDR Smart Spaces Pvt. Ltd., CIN U45201TN2005PTC059267"],
  },
  mobileNavItems: [
    {
      href: "/",
      label: "Home",
      type: "link",
    },
    {
      href: "/about-us",
      label: "About Us",
      type: "link",
    },
    {
      align: "left",
      columns: [
        {
          heading: "Business Verticals",
          links: [
            {
              href: "/business/logistics-and-industrial-infrastructure",
              label: "Logistics and Industrial Infrastructure",
            },
            {
              children: [
                {
                  href: "/business/ndr-asset-management/development-lifecycle",
                  label: "Development Lifecycle",
                },
                {
                  href: "/business/ndr-asset-management/asset-performance-management",
                  label: "Asset Performance Management",
                },
              ],
              href: "/business/ndr-asset-management",
              label: "Project Management and Maintenance - NDR Asset Management",
            },
            {
              href: "/business/residential-plotting",
              label: "Residential Plotting",
            },
            {
              href: "/investor-centre/asset-flip",
              label: "Asset Flip: Transfer of SPVs",
            },
          ],
        },
      ],
      href: "/business/logistics-and-industrial-infrastructure",
      id: "business",
      label: "Verticals",
      type: "menu",
    },
    {
      align: "right",
      columns: [
        {
          heading: "Investor Centre",
          links: [
            {
              href: "/investor-centre/announcements",
              label: "Announcements",
            },
            {
              href: "/investor-centre/corporate-governance",
              label: "Corporate Governance",
            },
            {
              href: "/investor-centre/summary-of-business",
              label: "Summary of Business",
            },
          ],
        },
      ],
      href: "/investor-centre/announcements",
      id: "investor",
      label: "Investor Centre",
      type: "menu",
    },
    {
      href: "/esg",
      label: "ESG & Sustainability",
      type: "link",
    },
    {
      href: "/media",
      label: "Media & Newsroom",
      type: "link",
    },
    {
      href: "/contact",
      label: "Contact",
      type: "link",
    },
  ],
  navItems: [
    {
      href: "/",
      label: "Home",
      type: "link",
    },
    {
      href: "/about-us",
      label: "About Us",
      type: "link",
    },
    {
      align: "left",
      columns: [
        {
          heading: "Business Verticals",
          links: [
            {
              href: "/business/logistics-and-industrial-infrastructure",
              label: "Logistics and Industrial Infrastructure",
            },
            {
              children: [
                {
                  href: "/business/ndr-asset-management/development-lifecycle",
                  label: "Development Lifecycle",
                },
                {
                  href: "/business/ndr-asset-management/asset-performance-management",
                  label: "Asset Performance Management",
                },
              ],
              href: "/business/ndr-asset-management",
              label: "Project Management and Maintenance - NDR Asset Management",
            },
            {
              href: "/business/residential-plotting",
              label: "Residential Plotting",
            },
            {
              href: "/investor-centre/asset-flip",
              label: "Asset Flip: Transfer of SPVs",
            },
          ],
        },
      ],
      href: "/business/logistics-and-industrial-infrastructure",
      id: "business",
      label: "Verticals",
      type: "menu",
    },
    {
      align: "right",
      columns: [
        {
          heading: "Investor Centre",
          links: [
            {
              href: "/investor-centre/announcements",
              label: "Announcements",
            },
            {
              href: "/investor-centre/corporate-governance",
              label: "Corporate Governance",
            },
            {
              href: "/investor-centre/summary-of-business",
              label: "Summary of Business",
            },
          ],
        },
      ],
      href: "/investor-centre/announcements",
      id: "investor",
      label: "Investor Centre",
      type: "menu",
    },
    {
      href: "/esg",
      label: "ESG & Sustainability",
      type: "link",
    },
    {
      href: "/media",
      label: "Media & Newsroom",
      type: "link",
    },
    {
      href: "/contact",
      label: "Contact",
      type: "link",
    },
  ],
  siteHome: "/",
  utilityStrip: {
    email: {
      href: "mailto:compliance@ndrsmart.com",
      label: "compliance@ndrsmart.com",
    },
    entity: "NDR Smart Spaces Pvt. Ltd., an NDR Group platform",
  },
} as const;
