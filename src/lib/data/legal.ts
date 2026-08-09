export type LegalSection = {
  heading: string;
  body: readonly string[];
};

export type LegalDocumentData = {
  eyebrow: string;
  title: string;
  lede: string;
  edition: string;
  sections: readonly LegalSection[];
};

export const privacyPolicy: LegalDocumentData = {
  eyebrow: "Legal · Notice",
  title: "Privacy Policy",
  lede: "How NDR Smart Spaces Pvt. Ltd. collects, uses and protects the information you share with us through this website.",
  edition: "Published 2026 · Applies to ndrsmart.com and the operating manual publication",
  sections: [
    {
      heading: "Information we collect",
      body: [
        "We collect the details you submit through the business enquiry form — name, work email, company and message — along with the enquiry type you select. We also record standard technical data (IP address, browser, pages visited) to operate and protect the site.",
      ],
    },
    {
      heading: "How we use it",
      body: [
        "Enquiry details are routed to the appropriate business desk (for example, investor relations enquiries route to our compliance desk) solely to respond to your request. Technical data is used for security, diagnostics and aggregate analytics; it is not used to build profiles.",
      ],
    },
    {
      heading: "Sharing and disclosure",
      body: [
        "We do not sell personal information. Data is shared only within the NDR Group and with processors we engage to operate the website, and only where required to provide our services or to comply with law.",
      ],
    },
    {
      heading: "Retention and security",
      body: [
        "Enquiry records are retained only as long as needed to resolve your request and meet statutory obligations. Access to personal data is restricted to personnel with a legitimate need, and transmitted over encrypted connections.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You may request access to, correction of, or deletion of the personal information we hold about you, or object to its processing, by writing to compliance@ndrsmart.com. We will respond within the timeframes required by applicable law.",
      ],
    },
  ],
};

export const termsOfUse: LegalDocumentData = {
  eyebrow: "Legal · Notice",
  title: "Terms & Conditions",
  lede: "The terms governing your access to and use of the NDR Smart Spaces website and its publications.",
  edition: "Published 2026 · Applies to all pages under ndrsmart.com",
  sections: [
    {
      heading: "Acceptance",
      body: [
        "By accessing this website you agree to these terms. If you do not agree, please discontinue use. The terms may be updated from time to time; continued use after an update constitutes acceptance of the revised terms.",
      ],
    },
    {
      heading: "Use of content",
      body: [
        "Content on this site — including text, graphics, logos, and the operating manual and investor record publications — is provided for information only. You may not reproduce, distribute or commercially exploit it without prior written consent from NDR Smart Spaces Pvt. Ltd.",
      ],
    },
    {
      heading: "No offer",
      body: [
        "Nothing on this website constitutes an offer, invitation or recommendation to buy, sell or subscribe to securities, units, or any financial product. Investors should rely solely on the documents and disclosures made by NDR InvIT Management Pvt. Ltd. under applicable securities laws.",
      ],
    },
    {
      heading: "External links",
      body: [
        "This site links to third-party websites (including group entities and external service providers). We do not control and accept no responsibility for the content, accuracy or practices of those sites.",
      ],
    },
    {
      heading: "Liability",
      body: [
        'This website is provided on an "as is" basis. To the fullest extent permitted by law, NDR Smart Spaces Pvt. Ltd. disclaims all warranties and shall not be liable for any loss or damage arising from use of the site or reliance on its content.',
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of India, and courts at Chennai shall have exclusive jurisdiction over any dispute arising in connection with them.",
      ],
    },
  ],
};

export const disclaimer: LegalDocumentData = {
  eyebrow: "Legal · Notice",
  title: "Disclaimer",
  lede: "Important statements about the information published on this website, including the operating manual and investor-facing references.",
  edition: "Published 2026 · Read in conjunction with the terms of use",
  sections: [
    {
      heading: "Editorial independence",
      body: [
        "The operating manual is published by NDR Smart Spaces Pvt. Ltd. as a living document and reflects the company's own operational narrative. It is not audited financial reporting and is not reviewed or endorsed by NDR InvIT Management Pvt. Ltd.",
      ],
    },
    {
      heading: "Forward-looking statements",
      body: [
        "Certain statements on this site describe plans, estimates and aspirations. Such statements are forward-looking and subject to risks and uncertainties; actual results may differ materially. Nothing herein should be construed as a representation of future performance.",
      ],
    },
    {
      heading: "Third-party references",
      body: [
        'References to occupiers, clients, investors and other third parties (for example, "100+ Fortune Global 500 companies") are made in good faith based on available information and may change over time. Marks and names remain the property of their owners.',
      ],
    },
    {
      heading: "Currency",
      body: [
        "Information is provided as of the dates stated on each page and may be superseded. While we aim to keep the site accurate and current, we accept no liability for errors, omissions or outdated material.",
      ],
    },
  ],
};

export type SitemapGroup = {
  heading: string;
  links: readonly { label: string; href: string }[];
};

export const sitemapGroups: readonly SitemapGroup[] = [
  {
    heading: "Operating Manual",
    links: [
      { label: "Home", href: "/en" },
      { label: "About Us & Our People", href: "/en/about-us" },
      { label: "Business", href: "/en/business" },
      { label: "Portfolio", href: "/en/portfolio" },
      { label: "ESG & Sustainability", href: "/en/esg" },
    ],
  },
  {
    heading: "Investor Centre",
    links: [
      { label: "Investor Centre", href: "/en/investor-centre" },
      { label: "Investment Highlights", href: "/en/investor-centre/investment-highlights" },
      { label: "Reports & Disclosures", href: "/en/investor-centre/reports-disclosures" },
      { label: "Financial Results", href: "/en/investor-centre/financial-results" },
      { label: "Annual Reports", href: "/en/investor-centre/annual-reports" },
      { label: "Corporate Governance", href: "/en/investor-centre/corporate-governance" },
      { label: "Announcements", href: "/en/investor-centre/announcements" },
      { label: "Downloads", href: "/en/investor-centre/downloads" },
    ],
  },
  {
    heading: "Media & Contact",
    links: [
      { label: "Media & Newsroom", href: "/en/media" },
      { label: "Contact", href: "/en/contact" },
    ],
  },
  {
    heading: "Legal & Notice",
    links: [
      { label: "Privacy Policy", href: "/en/privacy-policy" },
      { label: "Terms & Conditions", href: "/en/terms" },
      { label: "Disclaimer", href: "/en/disclaimer" },
      { label: "Website Sitemap", href: "/en/sitemap" },
    ],
  },
];
