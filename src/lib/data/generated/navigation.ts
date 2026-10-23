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
      align: "left",
      columns: [
        {
          heading: "About NDR",
          links: [
            {
              href: "/about-us",
              label: "About Us",
            },
            {
              href: "/why-ndr",
              label: "Why NDR",
            },
          ],
        },
      ],
      href: "/about-us",
      id: "about",
      label: "About",
      type: "menu",
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
          ],
        },
      ],
      href: "/business/logistics-and-industrial-infrastructure",
      id: "business",
      label: "Verticals",
      type: "menu",
    },
    {
      align: "left",
      columns: [
        {
          heading: "Culture & Careers",
          links: [
            {
              href: "/culture-and-careers/corporate-culture",
              label: "Corporate Culture",
            },
            {
              href: "/culture-and-careers/careers-and-opportunities",
              label: "Careers & Opportunities",
            },
          ],
        },
      ],
      href: "/culture-and-careers/corporate-culture",
      id: "culture",
      label: "Culture & Careers",
      type: "menu",
    },
    {
      href: "/investor-centre/corporate-governance",
      label: "Investor Centre",
      type: "link",
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
      align: "left",
      columns: [
        {
          heading: "About NDR",
          links: [
            {
              href: "/about-us",
              label: "About Us",
            },
            {
              href: "/why-ndr",
              label: "Why NDR",
            },
          ],
        },
      ],
      href: "/about-us",
      id: "about",
      label: "About",
      type: "menu",
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
          ],
        },
      ],
      href: "/business/logistics-and-industrial-infrastructure",
      id: "business",
      label: "Verticals",
      type: "menu",
    },
    {
      align: "left",
      columns: [
        {
          heading: "Culture & Careers",
          links: [
            {
              href: "/culture-and-careers/corporate-culture",
              label: "Corporate Culture",
            },
            {
              href: "/culture-and-careers/careers-and-opportunities",
              label: "Careers & Opportunities",
            },
          ],
        },
      ],
      href: "/culture-and-careers/corporate-culture",
      id: "culture",
      label: "Culture & Careers",
      type: "menu",
    },
    {
      href: "/investor-centre/corporate-governance",
      label: "Investor Centre",
      type: "link",
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
