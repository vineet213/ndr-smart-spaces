import type { CompanyMetric } from "./homepage";

export const aboutHero = {
  headline: "Seven decades of building ",
  headlineAccent: "infrastructure.",
  lede: "NDR Smart Spaces is the logistics and infrastructure development platform of the NDR Group, established in 1954, and a leading developer of logistics and industrial spaces in India.",
  cta: { label: "Our story", href: "#story" },
  ctaSecondary: {
    label: "Explore the business",
    href: "/business/logistics-and-industrial-infrastructure/",
  },
} as const;

/**
 * Full-bleed black-and-gold stat band directly under the About Us masthead —
 * the same `CompanyMetrics` treatment used on the homepage, rather than the
 * smaller in-hero ledger this used to be.
 */
export const aboutStats: readonly CompanyMetric[] = [
  { value: 1954, label: "GROUP FOUNDED", context: "GROUP FOUNDED" },
  {
    value: 2001,
    label: "NDR WAREHOUSING ACTIVE OPERATIONS",
    context: "NDR WAREHOUSING ACTIVE OPERATIONS",
  },
  { value: 2025, label: "NDR SMART SPACES INCORPORATED", context: "NDR SMART SPACES INCORPORATED" },
];

export const aboutStory = {
  eyebrow: "Origin of the group",
  heading: "Seven decades of building",
  paragraphs: [
    "The NDR Group was founded in 1954 by the late Mr. Naidu Dasaratha Rami Reddy. It began with a modest land parcel and a vision to establish a rice mill, marking the start of entrepreneurship in a family rooted in agriculture. His pioneering spirit laid the foundation for a multi-generational legacy of growth and innovation.",
    "Since 2002, under new leadership, the company has achieved significant scale, attracted marquee investors and executed strategic acquisitions to strengthen its market position. Today, the organization is entering a new phase of growth and modernization, with a vision to strengthen India's socio-economic infrastructure landscape, anchored primarily in logistics and industrial infrastructure.",
  ],
  quote: "A modest land parcel, a rice mill, and a multi-generational legacy.",
  quoteAttribution: "Mr. Naidu Dasaratha Rami Reddy · Founder, 1954",
  image: {
    src: "/images/about/origin.jpg",
    alt: "An archival photograph of an early NDR Group warehouse with trucks loading outside",
  },
} as const;

export type TimelineNode = {
  year: string;
  title: string;
  caption?: string;
  detail?: string;
};

export const aboutTimeline = {
  eyebrow: "The journey",
  heading: "1954 to today.",
  nodes: [
    {
      year: "1954",
      title: "Beginning of NDR Group operations",
    },
    {
      year: "1979",
      title: "NDR’s First Warehouse",
    },
    {
      year: "1998",
      title:
        "India’s First Private Bonded Warehouse Established by CWCNSL (Continental Warehousing Corporation (Nhava Seva) Limited), a former NDR group company",
    },
    {
      year: "2001",
      title:
        "Established India's first IBM Manufacturing Facility; NDR Warehousing's First Modern Built-to-Suit structure",
    },
    {
      year: "2005",
      title:
        "NDR Warehousing invested in CWCNSL, Along With IL&FS Investment Managers - The Group's First Foray With Private Equity",
    },
    {
      year: "2008",
      title: "1 Million Sq. Ft. of Construction Completed",
    },
    {
      year: "2010",
      title:
        "Investment secured from Warburg Pincus, IFC (for CWCNSL) & First Association with Kotak",
    },
    {
      year: "2014",
      title: "3 Million Sq. Ft. of Construction Completed",
    },
    {
      year: "2016",
      title: "Post-GST Era: Consolidation of Logistics Infrastructure Accelerates NDR’s Growth",
    },
    {
      year: "2018",
      title:
        "NDR Warehousing Exits CWCNSL, CWCNSL Acquired by DP World, One of the Largest Logistics Deals of the Decade",
    },
    {
      year: "2020",
      title: "8 Million Sq. Ft. of Construction Completed",
    },
    {
      year: "2021",
      title: "Investcorp's First Tranche of Investment in NDR Warehousing",
    },
    {
      year: "2022",
      title:
        "NDR Warehousing’s First 1 Million Sq. Ft. Park each Established at Chennai and Coimbatore",
    },
    {
      year: "2023",
      title:
        "Investcorp's Second Tranche of Investment in the Pre-Round of NDR InvIT, India’s First Perpetual Warehousing InvIT",
    },
    {
      year: "2024",
      title:
        "NDR InvIT Listed on NSE with ₹8.8 Billion Offer Size and 17 Million (Approx.) Sq. Ft. of Asset Portfolio",
    },
    {
      year: "2025",
      title: "Incorporation of NDR Smart Spaces",
    },
    {
      year: "2026",
      title:
        "IFC (International Finance Corporation) brings a 225 crore equity investment into NDR Smart Spaces, with 23 Million Sq. Ft. Under Management and 10 Million Sq. Ft. Under Construction",
    },
  ] as readonly TimelineNode[],
} as const;

export const aboutPrinciples = {
  eyebrow: "Vision · Mission",
  heading: "What we are building toward.",
  lede: "The operating principles that govern the organization.",
  columns: [
    {
      index: "01",
      title: "Vision",
      body: "We aspire to be a leading organisation in the Logistics, industrial and socio-economic Infrastructure Sector, actively contributing to India's dynamic growth story. We aim to positively impact social development and elevate infrastructure standards, positioning ourselves as a key player committed to excellence and progress.",
      image: {
        src: "/images/vision-mission/vision.svg",
        alt: "Editorial line illustration of a future-ready master plan, with plotted land rising into an institutional skyline.",
      },
    },
    {
      index: "02",
      title: "Mission",
      body: "Our mission is to deliver infrastructure solutions that create lasting impact for communities, build enduring partnerships with our clients, and create sustainable long-term value for our investors, while upholding uncompromising standards of safety, ethics and environmental responsibility.",
      image: {
        src: "/images/vision-mission/mission.svg",
        alt: "Editorial line illustration of construction in progress: a tower crane, braced building frame and survey datum lines.",
      },
    },
  ],
} as const;

export type OurCodeValue = {
  index: string;
  title: string;
  tagline: string;
  body: string;
};

export const ourCode = {
  heading: "Our Code",
  lede: "What we build matters. What it makes possible for people matters more.",
  values: [
    {
      index: "01",
      title: "Built Smarter. Scaled Further",
      tagline: "Efficiency that helps our customers grow.",
      body: "We believe better infrastructure starts with better thinking. By combining disciplined execution, intelligent engineering, and streamlined construction, we create high-quality spaces that are here to stay. From the first concept to final handover, every decision builds the foundation to deliver more.",
    },
    {
      index: "02",
      title: "Infrastructure That Drives Growth",
      tagline: "Creating the foundations for business to thrive.",
      body: "The right infrastructure does more than provide a place to store, it expands every horizon. Our warehouses and industrial developments help businesses strengthen supply chains, reach new markets, and house their operations with confidence. By creating assets designed around real commercial needs, we help build stronger enterprises and more connected economies.",
    },
    {
      index: "03",
      title: "Closer to Every Opportunity",
      tagline: "Strategic Locations. Seamless Connectivity. Greater Possibilities.",
      body: "The right location can change everything. We strategically position our logistics and industrial spaces to bring your business closer to key markets, skilled talent, transport networks, and critical supply chains.",
    },
    {
      index: "04",
      title: "Designed for the Future",
      tagline: "Built for Today. Ready for What's Next.",
      body: "As businesses grow and industries evolve, their infrastructure should keep pace. Through future-focused planning and adaptable design, we create spaces that respond to changing business needs and an ever-evolving, dynamic landscape, ensuring every development is built with purpose.",
    },
    {
      index: "05",
      title: "Agility with Accountability",
      tagline: "Integrity in every decision. Speed and precision in every project.",
      body: "Great outcomes demand both swift action and ownership. We bring clarity to complex projects through decisive execution, transparent processes, and an uncompromising commitment to safety, compliance, and quality. For our clients and investors, that means a partner focused on responsible delivery, dependable standards, and long-term performance.",
    },
    {
      index: "06",
      title: "Strong Teams. Stronger Foundations.",
      tagline: "The right people turn ambitious plans into lasting progress.",
      body: "Behind every successful development is a team that takes ownership and a shared commitment to getting things right. Our strength lies in our people: in the passion they bring, the trust they build, and the way they stand together through every challenge.",
    },
    {
      index: "07",
      title: "Customer-Led Approach",
      tagline: "The right space makes business easier.",
      body: "We spend time with our customers to understand how they actually work. Then we build the space around them, instead of asking them to fit into a standard design.",
    },
  ] as readonly OurCodeValue[],
} as const;

export const businessModel = {
  eyebrow: "Integrated business model",
  heading: "The complete asset lifecycle.",
  lede: "One integrated chain, owned end to end: land in, listed assets out, capital recycled back to land.",
  returnLabel: "Back to land",
  returnCaption: "Proceeds go back into new development and the loop begins again.",
  steps: [
    {
      index: "01",
      name: "Land",
      caption: "Acquisition, entitlement and planning: a modest land parcel begins the journey.",
    },
    {
      index: "02",
      name: "Planning",
      caption: "Master planning and approvals before a single foundation is laid.",
    },
    {
      index: "03",
      name: "Development",
      caption: "Conceptualization, design and delivery of institutional-grade assets.",
    },
    {
      index: "04",
      name: "Industrial Infrastructure",
      caption: "High-quality industrial, commercial and institutional assets for global occupiers.",
    },
    {
      index: "05",
      name: "Warehousing",
      caption: "Grade A facilities near highways, ports, railways and airports.",
    },
    {
      index: "06",
      name: "Asset Management",
      caption:
        "End-to-end planning, execution and delivery, plus ongoing operations and maintenance.",
    },
    {
      index: "07",
      name: "NDR InvIT",
      caption: "Completed assets are offered to NDR InvIT under a Right of First Offer.",
    },
    {
      index: "08",
      name: "Capital recycling",
      caption: "Proceeds go back into new development, so the cycle keeps running.",
    },
  ],
} as const;

export type LeadershipProfile = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

export type LeadershipGroup = {
  id: string;
  title: string;
  placeholderTitle: string;
  placeholderStatus: string;
  placeholderNote: string;
  profiles: readonly LeadershipProfile[];
  placeholderSlots: number;
};

export const leadership = {
  eyebrow: "Leadership",
  heading: "The people behind the platform.",
  groups: [
    {
      id: "board-directors",
      title: "The Board",
      placeholderTitle: "Director seat",
      placeholderStatus: "Official profile pending",
      placeholderNote: "Reserved for board confirmation",
      profiles: [
        {
          name: "P. Chandrashekar",
          role: "Independent Director",
          bio: "P. Chandrashekar is a senior business leader with over 43 years of experience across finance, strategy, corporate governance, M&A, business transformation and scale-up leadership. He holds a Master of Management Studies (MMS) from Narsee Monjee Institute of Management Studies (NMIMS), Mumbai, and a Bachelor of Commerce from R. A. Podar College of Commerce and Economics, Mumbai. He has held senior leadership positions, including Executive Director & CEO of Runwal Group and Chief Financial Officer of DHL India and Coca-Cola India. He currently serves on the boards of several companies and is the Founder & Principal Consultant of Crescentia Strategists LLP.",
          photo: "/images/leadership/board-directors/p-chandrashekar.jpg",
        },
        {
          name: "N. Amrutesh Reddy",
          role: "Director",
          bio: "N. Amrutesh Reddy is a third-generation entrepreneur and a prominent leader in India's infrastructure and logistics sector. He holds a Bachelors in Commerce degree from Madras University, Chennai. He is the Managing Director of NDR Warehousing Private Limited and Sponsor & Board Member of NDR InvIT. With over two decades of leadership experience, he has overseen marquee investments and led several industry-defining initiatives in warehousing and logistics. He was honored with the Entrepreneur of the Year Award in 2025.",
          photo: "/images/leadership/board-directors/n-amrutesh-reddy.jpg",
        },
        {
          name: "Raj Srinivasan",
          role: "Director",
          bio: "Raj Srinivasan is the Chief Executive Officer of NDR Smart Spaces, with nearly two decades of experience within the NDR Group. He is a management graduate from Sikkim University and previously served as CEO of NDR Warehousing for five years. He brings deep expertise in logistics, industrial real estate operations and business strategy. Known for his strong client relationships and operational discipline, he has played a key role in driving strategic growth and delivering complex construction projects.",
          photo: "/images/leadership/management-team/raj-srinivasan.jpg",
        },
      ] as readonly LeadershipProfile[],
      placeholderSlots: 3,
    },
    {
      id: "management-team",
      title: "Meet the team",
      placeholderTitle: "Executive seat",
      placeholderStatus: "Official profile pending",
      placeholderNote: "Reserved for management confirmation",
      profiles: [
        {
          name: "Raj Srinivasan",
          role: "Chief Executive Officer",
          bio: "Raj Srinivasan is the Chief Executive Officer of NDR Smart Spaces, with nearly two decades of experience within the NDR Group. He is a management graduate from Sikkim University and previously served as CEO of NDR Warehousing for five years. He brings deep expertise in logistics, industrial real estate operations and business strategy. Known for his strong client relationships and operational discipline, he has played a key role in driving strategic growth and delivering complex construction projects.",
          photo: "/images/leadership/management-team/raj-srinivasan.jpg",
        },
        {
          name: "S. Shreyance Chhajer",
          role: "Chief Financial Officer",
          bio: "S. Shreyance Chhajer is the Chief Financial Officer of NDR Smart Spaces Private Limited and a Chartered Accountant with over a decade of experience across statutory audit, professional practice and corporate finance. He holds a Bachelors in Commerce degree from Madras University, Chennai. He began his career with Deloitte Haskins and Sells LLP and subsequently served as a Partner at Joseph and Rajaram, Chartered Accountants. At NDR Group, he has held senior finance roles and now leads the finance function across the group's infrastructure business.",
          photo: "/images/leadership/management-team/s-shreyance-chhajer.jpg",
        },
        {
          name: "Swati Agarwal",
          role: "Company Secretary",
          bio: "Ms. Swati Agarwal is a qualified Company Secretary and an Associate Member of the Institute of Company Secretaries of India (ICSI), with a Bachelor of Commerce (B.Com.) degree from Calcutta University. She has around 7 years of experience across secretarial, legal and compliance functions, having worked with listed and unlisted entities across diverse sectors. She has previously worked with Tamil Nadu Advance Manufacturing Centre of Excellence Private Limited (TAMCOE), a wholly-owned subsidiary of TIDCO, and Refex Renewables & Infrastructure Limited (RRIL), the renewable arm of the Refex Group and a BSE-listed company.",
          photo: "/images/leadership/management-team/swati-agarwal.jpg",
        },
        {
          name: "K. Jeevan Kumar",
          role: "Legal Head",
          bio: "Mr. K. Jeevan Kumar holds a Bachelor of Commerce (B.Com.) degree from Noble College and an LL.B. degree from Hindu College of Law, Machilipatnam, Andhra Pradesh. He was enrolled with the Bar Council of Andhra Pradesh in 1998 and has 10 years of litigation experience, including appearances before the High Courts and the Supreme Court of India. He also brings 17 years of corporate legal experience, having served as Legal Head at leading real estate companies such as Narne Estates, at Hyderabad; DLF, Radiance Realty, and House of Hiranandani, at Chennai. His expertise spans legal advisory, corporate legal functions, compliance, land acquisition and real estate-related legal matters.",
          photo: "/images/leadership/management-team/k-jeevan-kumar.jpg",
        },
      ] as readonly LeadershipProfile[],
      placeholderSlots: 4,
    },
  ],
} as const;

export const whyNdr = {
  eyebrow: "Why NDR",
  heading: "Reasons an institution builds with us.",
  lede: "Five strengths, each carried by a verifiable claim.",
  strengths: [
    {
      index: "01",
      title: "Governance",
      body: "Prudent management and strong governance.",
      proof: "AAA-rated entity · long-term bonds · long WALE · low receivable risk",
    },
    {
      index: "02",
      title: "Execution",
      body: "Delivery from concept to completion.",
      proof: "6,00,000 sq ft delivered in 4 months · 99% greenfield",
    },
    {
      index: "03",
      title: "Capital discipline",
      body: "Capital from completed assets goes back into new development.",
      proof: "Develop → stabilize → offer under ROFO → recycle",
    },
    {
      index: "04",
      title: "Long-term partnerships",
      body: "Relationships that last for decades.",
      proof: "100+ Fortune Global 500 companies served",
    },
    {
      index: "05",
      title: "Institutional credibility",
      body: "Backed by institutional investors.",
      proof: "Kotak Alternatives · Investcorp-led $55 mn",
    },
  ],
} as const;

export const aboutClosing = {
  eyebrow: "Next",
  heading: "From land to listed assets.",
  lede: "Explore the business, the portfolio and the capital model, or speak to the team building India's warehousing infrastructure.",
  primaryCta: { label: "Business Enquiry", href: "mailto:project@ndrsmart.com" },
  secondaryCta: { label: "Investor Centre", href: "https://ndrinvit.com" },
} as const;
