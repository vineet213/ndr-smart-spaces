export type LegalSection = {
  heading: string;
  body: readonly string[];
  /** Optional bulleted list, shown after the paragraphs. */
  list?: readonly string[];
};

export type LegalDocumentData = {
  eyebrow: string;
  title: string;
  lede: string;
  edition: string;
  sections: readonly LegalSection[];
};

const COMPANY = "NDR Smart Spaces Pvt. Ltd.";
const COMPLIANCE_EMAIL = "compliance@ndrsmart.com";
const OFFICE = "Bazulla Road, T. Nagar, Chennai, Tamil Nadu 600017, India";
const EDITION = "Last updated 20 October 2026";

export const privacyPolicy: LegalDocumentData = {
  eyebrow: "Legal · Notice",
  title: "Privacy Policy",
  lede: `How ${COMPANY} collects, uses, shares and protects personal data shared with us through this website, and the rights you have over it.`,
  edition: `${EDITION} · Applies to ndrsmart.com`,
  sections: [
    {
      heading: "Who we are and scope",
      body: [
        `This website, ndrsmart.com, is operated by ${COMPANY} ("NDR Smart Spaces", "we", "us"), a company with its corporate office at ${OFFICE}. For the personal data described in this policy, we decide why and how the data is processed and are the "Data Fiduciary" under the Digital Personal Data Protection Act, 2023.`,
        "This policy applies to visitors to this website and to anyone who contacts us through it. It does not apply to other websites we link to, including those of NDR InvIT and Ave Acres, which have their own policies. This policy is published in line with the Digital Personal Data Protection Act, 2023 (and the rules made under it), the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.",
      ],
    },
    {
      heading: "Information we collect",
      body: [
        "We collect personal data in two ways: what you give us, and what is collected automatically when you use the site.",
      ],
      list: [
        "Details you submit through the business enquiry form: your name, company, work email address, telephone number (optional), the message you write, and the confirmation that you agree to this policy. Please do not include sensitive information, such as financial account details, government identifiers or health information, in your message.",
        "Correspondence you send to the email addresses published on this site, including your email address and anything you choose to tell us.",
        "Technical data that your browser sends when it loads a page: your IP address, browser and device type, the pages requested and the date and time. This is held in server logs and is used to run, secure and troubleshoot the site.",
        "A bot-check token, if the human-verification step is shown on the form (see Cookies and similar technologies).",
      ],
    },
    {
      heading: "Why we use your data",
      body: [
        "We use personal data only for the purposes below, and for no other purpose without telling you or, where the law requires it, asking for your consent again.",
      ],
      list: [
        "To read your enquiry, route it to the right business desk and reply to you. The basis is your consent, given when you tick the box on the form.",
        "To keep the website and our systems secure, to detect and prevent spam, abuse and fraud, and to find and fix faults.",
        "To keep records of our dealings and to meet our legal, regulatory, tax and audit obligations, and to establish, exercise or defend legal claims.",
        "To produce aggregate statistics about how the site is used, in a form that does not identify you.",
      ],
    },
    {
      heading: "What we do not do",
      body: [
        "We do not sell your personal data. We do not use it to make decisions that affect you by automated means, and we do not build advertising profiles. We do not send marketing messages to the details you give us in an enquiry unless you have separately agreed to receive them.",
      ],
    },
    {
      heading: "Sharing and disclosure",
      body: [
        "We share personal data only where needed for the purposes above, and only with:",
      ],
      list: [
        "Our group and affiliated companies, and the NDR business desk that deals with your enquiry, where this is needed to answer you.",
        "Service providers that help us run the site and receive enquiries. These include our hosting provider, the form-handling service that delivers your enquiry to us by email, and the bot-check provider (Cloudflare Turnstile). They may process your data only on our instructions and under confidentiality and security obligations.",
        "Our professional advisers, such as auditors and lawyers, under a duty of confidentiality.",
        "Courts, regulators, law-enforcement or other government authorities, where we are required to by law or by a lawful order, or where this is needed to protect our rights, property or safety or those of others.",
        "A purchaser or successor, if all or part of our business is reorganised, merged or sold, subject to the same protections for your data.",
      ],
    },
    {
      heading: "Transfers outside India",
      body: [
        "Some of our service providers, including the form-handling and bot-check services, may store or process data on servers outside India. Where that happens, we transfer data only to the extent the Digital Personal Data Protection Act, 2023 and the rules made under it allow, and we expect the provider to protect it to a standard that is comparable to this policy.",
      ],
    },
    {
      heading: "Cookies and similar technologies",
      body: [
        "This website does not use advertising or cross-site tracking cookies, and we do not run third-party analytics or advertising trackers on it. Your browser may store limited technical data that the site or its providers need to work. In particular, if the human-verification step is shown, Cloudflare Turnstile may use a short-lived token and similar technology to tell people from automated programs. You can block or delete cookies in your browser settings; the site will still work, although the verification step may not.",
        "If we later add analytics or any other non-essential cookies, we will update this policy and ask for your consent first where the law requires it.",
      ],
    },
    {
      heading: "How long we keep data",
      body: [
        "We keep personal data only for as long as it is needed for the purposes in this policy. As a guide, enquiry details are kept for as long as it takes to deal with your request and for a further reasonable period afterwards, so that we can follow up and keep proper records. Server logs are kept for the period needed for security and as required by law, including directions issued by the Indian Computer Emergency Response Team (CERT-In). We keep data for longer where a law or a legal claim requires it. When data is no longer needed, we delete it or make it anonymous.",
      ],
    },
    {
      heading: "How we protect your data",
      body: [
        "We use reasonable security safeguards to protect personal data against loss, misuse and unauthorised access, disclosure, alteration or destruction. These include encrypted (HTTPS) connections to the site, restricting access to the people who need it, spam and bot filtering on forms, and confidentiality obligations on staff and providers. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
        `If a personal data breach affects you, we will tell you and the Data Protection Board of India as the law requires. If you think your data has been put at risk, please write to ${COMPLIANCE_EMAIL} straight away.`,
      ],
    },
    {
      heading: "Your rights",
      body: ["Under the Digital Personal Data Protection Act, 2023, you have the right to:"],
      list: [
        "Ask for a summary of the personal data we hold about you, the processing we carry out, and the other parties we have shared it with.",
        "Ask us to correct inaccurate or misleading data, complete incomplete data, or update it.",
        "Ask us to erase your personal data, unless we need to keep it for a legal reason or the purpose it was collected for.",
        "Withdraw your consent at any time. This is as easy to do as giving it, and does not affect anything we did lawfully before you withdrew. If you withdraw consent, we will stop processing your data for that purpose, unless the law lets or requires us to keep it.",
        "Have your grievances dealt with, and nominate another person to exercise these rights for you if you die or become unable to do so.",
      ],
    },
    {
      heading: "How to use your rights, and grievance redressal",
      body: [
        `To exercise any of these rights, withdraw consent, or raise a concern about how your data is handled, write to the Grievance Officer, ${COMPANY}, at ${COMPLIANCE_EMAIL}, or by post to ${OFFICE}. Please tell us what you want us to do and give enough detail for us to find your data and check who you are. We acknowledge requests promptly and aim to resolve them within one month, or sooner where the law sets a shorter period.`,
        "If you are not satisfied with our response, you may complain to the Data Protection Board of India, once the Board is operational and after you have first used our grievance process.",
      ],
    },
    {
      heading: "Children",
      body: [
        "This website is meant for businesses, investors and other adult visitors. It is not directed at children under 18, and we do not knowingly collect their personal data. If you believe a child has sent us personal data, please write to us and we will delete it.",
      ],
    },
    {
      heading: "Links to other websites",
      body: [
        "This site links to other websites, including NDR InvIT (ndrinvit.com) and Ave Acres (aveacres.com), and to map services such as Google Maps. When you follow one of those links, the other site's own privacy policy applies, and we are not responsible for it.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "We may update this policy from time to time, for example when our practices or the law change. The date at the top of this page shows when it was last updated. If we make a significant change, we will make it clear on this site. Please check back from time to time.",
      ],
    },
    {
      heading: "Contact",
      body: [
        `${COMPANY}, ${OFFICE}. Email: ${COMPLIANCE_EMAIL}.`,
      ],
    },
  ],
};

export const termsOfUse: LegalDocumentData = {
  eyebrow: "Legal · Notice",
  title: "Terms & Conditions",
  lede: `The terms that apply when you access or use the ${COMPANY} website and its publications.`,
  edition: `${EDITION} · Applies to all pages under ndrsmart.com`,
  sections: [
    {
      heading: "About these terms",
      body: [
        `These terms and conditions ("Terms") govern your access to and use of ndrsmart.com (the "Website"), which is operated by ${COMPANY} ("NDR Smart Spaces", "we", "us"), whose corporate office is at ${OFFICE}. They are an electronic record under the Information Technology Act, 2000, and do not need to be signed to be valid.`,
        "By accessing or using the Website you agree to be bound by these Terms and by our Privacy Policy and Disclaimer, which form part of them. If you do not agree, please do not use the Website.",
      ],
    },
    {
      heading: "Who may use the Website",
      body: [
        "You may use the Website only if you are at least 18 years old and are legally able to enter into a binding agreement under Indian law. If you use it for or on behalf of a company or other organisation, you confirm that you are authorised to bind it to these Terms.",
      ],
    },
    {
      heading: "Information only",
      body: [
        "The Website is provided for general information about NDR Smart Spaces, its businesses, assets and publications. It is not professional, legal, financial, tax or investment advice, and you should not rely on it as such. See our Disclaimer for important further statements.",
      ],
    },
    {
      heading: "No offer of securities or property",
      body: [
        "Nothing on the Website is an offer, invitation, solicitation, advertisement or recommendation to buy, sell or subscribe to any securities, units of a trust, or other financial product, or an offer to sell, lease or allot any land, plot, building or other real estate. Any such offer will be made only through the formal documents and disclosures required by applicable law, including the SEBI (Infrastructure Investment Trusts) Regulations, 2014 and the Real Estate (Regulation and Development) Act, 2016, as the case may be.",
        "Investors should rely solely on the documents and disclosures issued by NDR InvIT Management Pvt. Ltd. under applicable securities laws. Prospective purchasers should check the registration of any project with the relevant State Real Estate Regulatory Authority before making a decision.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        `Unless stated otherwise, the Website and its content, including text, graphics, images, illustrations, maps, data compilations, software, page design, the "NDR" and "NDR Smart Spaces" names and logos, and the operating manual and investor record publications, are owned by or licensed to ${COMPANY} and are protected by the Copyright Act, 1957, the Trade Marks Act, 1999 and other laws. Trade marks, names and logos of other parties, including clients and occupiers, belong to their owners.`,
        "You may view the Website and print or download single copies of pages for your own personal, non-commercial or internal business reference, provided you keep all copyright and other notices and do not change the content. Any other use needs our prior written permission.",
      ],
    },
    {
      heading: "Acceptable use",
      body: ["When using the Website you agree that you will not:"],
      list: [
        "Break any law, or use the Website for any unlawful, fraudulent or harmful purpose.",
        "Copy, scrape, harvest or republish the Website's content or data, in bulk or by automated means, or use it to build a competing database, product or service, without our written permission.",
        "Introduce viruses or other harmful code, or try to gain unauthorised access to the Website, its servers, or any system connected to it.",
        "Interfere with or disrupt the Website or its security, including by overloading it, or bypass any measure we use to restrict access or prevent abuse.",
        "Submit false, misleading or abusive information through our forms, or use the forms to send unsolicited commercial messages or to impersonate another person.",
        "Remove or alter any copyright, trade mark or other proprietary notice, or frame or mirror any part of the Website without permission.",
      ],
    },
    {
      heading: "What you send us",
      body: [
        "If you send us an enquiry or other material through the Website, you confirm that the information is accurate and that you have the right to share it. We will use your personal data as set out in our Privacy Policy. We do not guarantee a reply to every enquiry, and submitting one does not create a contract, a client relationship or any obligation on us. Please do not send confidential or commercially sensitive information through the Website unless we have agreed to receive it under a written confidentiality arrangement.",
      ],
    },
    {
      heading: "Third-party links and content",
      body: [
        "The Website links to websites and services run by others, including group and affiliated entities such as NDR InvIT and Ave Acres, and to map and verification services. We do not control them and are not responsible for their content, availability, security or privacy practices. A link is not an endorsement, and you use linked sites at your own risk and under their own terms.",
      ],
    },
    {
      heading: "Accuracy and availability",
      body: [
        "We take reasonable care to keep the Website accurate and up to date, but we do not promise that it is complete, current or error-free, and information may change without notice. We may change, suspend or withdraw all or part of the Website at any time, and we do not promise that it will always be available or free from interruptions, errors or harmful components.",
      ],
    },
    {
      heading: "Disclaimer of warranties",
      body: [
        'The Website and its content are provided "as is" and "as available". To the fullest extent permitted by law, we give no warranties or conditions of any kind, whether express or implied, including as to accuracy, fitness for a particular purpose, non-infringement or uninterrupted access.',
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        `To the fullest extent permitted by law, ${COMPANY}, its directors, officers, employees, group companies and affiliates will not be liable for any indirect, incidental, special or consequential loss, or for any loss of profit, revenue, business, goodwill or data, arising from your use of, or inability to use, the Website or from your reliance on its content, even if we have been told such loss is possible.`,
        "Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under applicable law.",
      ],
    },
    {
      heading: "Indemnity",
      body: [
        `You agree to indemnify and hold harmless ${COMPANY} and its directors, officers, employees and affiliates against any claim, loss, liability or expense, including reasonable legal fees, arising from your breach of these Terms or your misuse of the Website.`,
      ],
    },
    {
      heading: "Changes to these terms",
      body: [
        "We may revise these Terms from time to time. The updated Terms take effect when they are posted on this page, and the date at the top shows when they were last changed. By continuing to use the Website after a change, you accept the revised Terms.",
      ],
    },
    {
      heading: "General",
      body: [
        "If any part of these Terms is found to be invalid or unenforceable, the rest remains in force. If we do not enforce a right under these Terms, that is not a waiver of it. These Terms, together with the Privacy Policy and Disclaimer, are the whole agreement between you and us about the Website. You may not transfer your rights under them; we may transfer ours to a group company or successor.",
      ],
    },
    {
      heading: "Governing law and jurisdiction",
      body: [
        "These Terms are governed by the laws of India. Subject to any rights you have that cannot be excluded by law, the courts at Chennai, Tamil Nadu have exclusive jurisdiction over any dispute arising out of or in connection with these Terms or the Website.",
      ],
    },
    {
      heading: "Contact",
      body: [
        `Questions about these Terms can be sent to ${COMPLIANCE_EMAIL}, or by post to ${COMPANY}, ${OFFICE}.`,
      ],
    },
  ],
};

export const disclaimer: LegalDocumentData = {
  eyebrow: "Legal · Notice",
  title: "Disclaimer",
  lede: "Important statements about the information published on this website, including the operating manual, investor-facing references, portfolio data, maps and images.",
  edition: `${EDITION} · Read together with the Terms & Conditions`,
  sections: [
    {
      heading: "General",
      body: [
        `The information on this website is published by ${COMPANY} for general information only. It is not, and should not be taken as, professional, legal, financial, tax, accounting or investment advice, and you should take your own independent advice before acting on any of it. While we try to keep it accurate and current, we make no representation or warranty, express or implied, that it is complete or free from error, and we accept no liability for errors, omissions or outdated material.`,
      ],
    },
    {
      heading: "Not an offer; investor information",
      body: [
        "Nothing on this website is an offer, invitation, solicitation or recommendation to buy, sell or subscribe to any securities, units or other financial products, and it does not form the basis of any contract or investment decision. NDR Smart Spaces Pvt. Ltd. is not a registered investment adviser and does not give investment advice.",
        "NDR InvIT is a separate listed infrastructure investment trust. Investors should rely only on the offer documents, filings, disclosures and notices made by NDR InvIT and its manager, NDR InvIT Management Pvt. Ltd., under the SEBI (Infrastructure Investment Trusts) Regulations, 2014 and other applicable law, and on the official NDR InvIT website. Investment in units of a trust is subject to market and other risks; past performance is not a guide to future performance.",
      ],
    },
    {
      heading: "Real estate and residential plotting",
      body: [
        "Information, images, plans, layouts and artist's impressions relating to any land, plotting, residential or other development are illustrative only. They are not an offer for sale, an advertisement or a prospectus. Areas, dimensions, specifications, amenities, timelines and prices are indicative, may change, and may be subject to statutory approvals. Marketing material does not replace the registered documents, approvals and agreements for a project.",
        "Under the Real Estate (Regulation and Development) Act, 2016, certain projects must be registered with the relevant State Real Estate Regulatory Authority before they are advertised or sold. Prospective purchasers should check the registration status and approvals of any project directly with the relevant Authority, and read the agreement and sanctioned plans, before making any decision.",
      ],
    },
    {
      heading: "Forward-looking statements",
      body: [
        "Some statements on this website describe plans, estimates, pipelines, targets and aspirations, including the land bank, area under development, project timelines, ESG goals and expected performance. These are forward-looking statements. They rest on assumptions and expectations that may prove wrong, and are subject to risks and uncertainties, including changes in market, regulatory, economic and environmental conditions, so actual results may differ materially. We have no obligation to update them. Nothing here is a representation or guarantee of future performance.",
      ],
    },
    {
      heading: "Portfolio, area and statistical data",
      body: [
        'Figures such as assets under management, leasable or developable area, land bank, occupancy, locations, "market locations" and pipeline are given as indicative figures as of the dates shown or the date of the last update. They may be rounded, may include projects that are planned or under construction, and may change as projects are completed, acquired, disposed of or re-measured. They are not audited financial information and are not a statement of financial results.',
      ],
    },
    {
      heading: "Operating manual and editorial content",
      body: [
        `The operating manual and similar publications are produced by ${COMPANY} as living documents that describe its own operations and viewpoint. They are not audited financial reporting and are not reviewed or endorsed by NDR InvIT Management Pvt. Ltd. or any regulator.`,
      ],
    },
    {
      heading: "ESG and sustainability information",
      body: [
        "ESG and sustainability metrics, initiatives, certifications and targets are reported by the company based on information available to it, using the methods described on the relevant pages. Unless a page says so, they have not been independently verified or assured. Targets are aspirations, not guarantees.",
      ],
    },
    {
      heading: "Maps, locations and boundaries",
      body: [
        "Maps and location diagrams on this website are schematic and not to scale. They show approximate positions only and are not survey maps. They are not an authoritative depiction of the external or internal boundaries of India or of any state or territory, and no inference on boundaries or title should be drawn from them. Directions and map links open third-party services, and we are not responsible for their accuracy.",
      ],
    },
    {
      heading: "Images and illustrations",
      body: [
        "Photographs, renders, drawings and illustrations are included to give a general impression. They may be artist's impressions, composites or stock images, and may not show actual sites, assets, people or the current state of a project. Some images are used under licence from third parties and credited where required. Features and finishes shown may not be provided.",
      ],
    },
    {
      heading: "Third-party names, logos and references",
      body: [
        'References to clients, occupiers, investors, partners and other third parties (for example, "100+ Fortune Global 500 companies") are made in good faith on the basis of information available to us and may change over time. All trade marks, names and logos belong to their respective owners. Their appearance here does not mean the owner sponsors, endorses or is affiliated with NDR Smart Spaces, other than as stated.',
      ],
    },
    {
      heading: "Links to other websites",
      body: [
        "We link to other websites, including NDR InvIT and Ave Acres, for convenience. We do not control them or endorse their content, and we are not responsible for it. Your use of them is at your own risk and under their own terms and policies.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        `To the fullest extent permitted by law, ${COMPANY}, its directors, officers, employees, group companies and affiliates accept no responsibility or liability for any loss or damage of any kind arising from the use of, or reliance on, this website or its content, including loss arising from errors, omissions, delays, interruptions or viruses. Nothing in this Disclaimer limits any liability that cannot be limited by law.`,
      ],
    },
    {
      heading: "Changes and contact",
      body: [
        `We may change this Disclaimer at any time by updating this page, and the date at the top shows when it was last updated. Questions can be sent to ${COMPLIANCE_EMAIL}.`,
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
    heading: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us & Our People", href: "/about-us" },
    ],
  },
  {
    heading: "Verticals",
    links: [
      {
        label: "Logistics and Industrial Infrastructure",
        href: "/business/logistics-and-industrial-infrastructure",
      },
      {
        label: "Project Management and Maintenance - NDR Asset Management",
        href: "/business/ndr-asset-management",
      },
      {
        label: "Development Lifecycle",
        href: "/business/ndr-asset-management/development-lifecycle",
      },
      {
        label: "Asset Performance Management",
        href: "/business/ndr-asset-management/asset-performance-management",
      },
      { label: "Residential Plotting", href: "/business/residential-plotting" },
      { label: "Asset Flip: Transfer of SPVs", href: "/investor-centre/asset-flip" },
    ],
  },
  {
    heading: "Investor Centre",
    links: [
      { label: "Corporate Governance", href: "/investor-centre/corporate-governance" },
    ],
  },
  {
    heading: "ESG, Media & Contact",
    links: [
      { label: "ESG & Sustainability", href: "/esg" },
      { label: "Media & Newsroom", href: "/media" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal & Notice",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Website Sitemap", href: "/sitemap" },
    ],
  },
];
