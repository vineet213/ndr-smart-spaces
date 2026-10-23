import { contactDirectory } from "./generated/contactDirectory";

/**
 * Culture & Careers: the Corporate Culture page and the Careers &
 * Opportunities page (/culture-and-careers/…).
 *
 * Items marked CONFIRM WITH CLIENT are drafted from the brief and the rest of
 * the site; the client signs them off or supplies the figure. Stand-in
 * photographs are reused site imagery until the client sends team photos.
 */

/* HR mailbox: the HR desk of the contact directory, never typed twice. */
const hrDesk = contactDirectory.find((desk) => desk.key === "hr");
export const hrEmail = hrDesk?.email.label ?? "hrms@ndrsmart.com";

/* corporate culture --------------------------------------------------------- */

export const cultureHero = {
  /* Each line stacks into place like a pallet on load. */
  title: ["People", "are the", "foundation."],
  lead: "Every park we build starts with the people who build it.",
  body: [
    "From land teams in the field to engineers on live sites and the people who run each park long after handover, NDR works as one team, held to one standard.",
    "We hire for ownership, learn on real projects and give people room to grow as the platform grows. It is how a family-founded group has kept building for seven decades.",
  ],
  /* CONFIRM WITH CLIENT: replace with the team photograph. */
  image: {
    src: "/images/asset-management/facility-technical.jpg",
    alt: "An NDR facility manager reviewing a tablet beside the loading docks of a warehouse park",
  },
};

/**
 * HR stats, written as one sentence. `value: null` until the client confirms
 * the figure: the slot renders as an open blank.
 */
export type HrStat = { value: number | null; suffix?: string; label: string };

export const hrStats: {
  strength: HrStat;
  growth: HrStat;
  tenure: HrStat;
} = {
  strength: { value: 230, label: "Strength" },
  /* CONFIRM WITH CLIENT: growth in team strength, and over what period. */
  growth: { value: null, suffix: "%", label: "Growth" },
  /* CONFIRM WITH CLIENT: average years of working with NDR. */
  tenure: { value: null, label: "Average years of working" },
};

/* CONFIRM WITH CLIENT: the ring's wording. */
export const cultureRing = {
  heading: "How we grow people.",
  lede: "A cycle that keeps building teams. Turn the ring.",
  centre: "People",
  nodes: [
    {
      name: "Hire for character",
      body: "We look for people who take ownership: of a site, a deadline, a customer's problem.",
    },
    {
      name: "Learn on site",
      body: "New joiners learn on live projects, next to the people delivering them.",
    },
    {
      name: "Grow with NDR",
      body: "As the platform adds parks and markets, the roles grow with it.",
    },
    {
      name: "Lead and pass it on",
      body: "The people who built our parks go on to lead teams, and train the next ones.",
    },
  ],
};

/* CONFIRM WITH CLIENT: wording and photographs (stand-ins below). */
export const learningDevelopment = {
  heading: "Learning that happens on the job, and beyond it.",
  items: [
    {
      title: "Induction & onboarding",
      body: "Every joiner starts with the whole picture: the group's story, how a park moves from land to handover, and the people behind each stage.",
      image: {
        src: "/images/lifecycle/02-due-diligence.jpg",
        alt: "Project documents, surveys and plans laid out on a desk",
      },
    },
    {
      title: "Learning on live sites",
      body: "Engineers and managers learn where the work is, on live projects, with responsibility that grows with each build.",
      image: {
        src: "/images/lifecycle/06-engineering.jpg",
        alt: "The steel structure of a warehouse under construction, with cranes on site",
      },
    },
    {
      title: "Mentorship from leadership",
      body: "Leaders with decades in the business work closely with their teams, so judgement is passed on along with the job.",
      image: {
        src: "/images/lifecycle/05-project-planning.jpg",
        alt: "A blueprint drawing of a warehouse park with loading docks and an office block",
      },
    },
    {
      title: "Safety & professional skills",
      body: "Safety training on every project, and support for the technical and professional skills each role needs as it grows.",
      image: {
        src: "/images/lifecycle/07-safety-equipment.jpg",
        alt: "A site team in hard hats and high-visibility vests walking a warehouse under construction",
      },
    },
    {
      title: "Growing into leadership",
      body: "As the platform grows, so do the roles. People who have built and run our parks go on to lead projects, parks and functions.",
      image: {
        src: "/images/lifecycle/09-asset-operations.jpg",
        alt: "An operating NDR warehouse park with trucks at the loading docks",
      },
    },
  ],
};

/* CONFIRM WITH CLIENT: closing video or image. */
export const cultureClosing = {
  placeholder: "Video / closing image to be inserted",
  line: "Want to build with us?",
  cta: { label: "See open roles", href: "/culture-and-careers/careers-and-opportunities" },
};

/* careers & opportunities --------------------------------------------------- */

export const careersHero = {
  title: "Careers & Opportunities",
  lede: "Roles across development, park operations and the corporate office, building and running logistics infrastructure across India.",
};

export type JobRole = {
  /** Reference quoted in the application email subject, e.g. "NDR-PRJ-014". */
  ref: string;
  title: string;
  /** Team, e.g. "Development & Projects". */
  team: string;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  experience: string;
};

/**
 * Open roles, newest first. Leave the list empty when nothing is open: the
 * board then says so and invites a CV instead. To add a role, copy this
 * shape:
 *
 *   {
 *     ref: "NDR-PRJ-014",
 *     title: "Project Manager – Civil",
 *     team: "Development & Projects",
 *     location: "Chennai",
 *     type: "Full-time",
 *     experience: "8–12 years",
 *   },
 */
export const roles: readonly JobRole[] = [];

export const careersBoard = {
  title: "Open roles",
  columns: ["Role", "Team", "Location", "Type", "Status"],
  status: "Open",
  apply: "Apply",
  empty: ["No open roles", "right now"],
  emptyStatus: "Check back",
  invite: {
    heading: "Send us your CV anyway.",
    body: "We're always glad to meet good people. Tell us the function and city you're interested in, and we'll be in touch when a suitable role opens.",
    cta: "Email your CV",
  },
  notice:
    "NDR never asks for a fee at any stage of hiring, and job offers come only from an @ndrsmart.com address. CVs are used only for recruitment.",
};

/** mailto for one role, or the general CV inbox when no role is given. */
export function applyHref(role?: JobRole): string {
  const subject = role ? `Application – ${role.title} (${role.ref})` : "CV for future openings";
  return `mailto:${hrEmail}?subject=${encodeURIComponent(subject)}`;
}
