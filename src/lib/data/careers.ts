import type { MastheadTitle } from "@/components/sections/PageMasthead";
import type { ClosingCtaData } from "@/components/sections/ClosingCta";
import type { CycleMedallion, CycleNodeDef } from "@/components/sections/CapitalCycle";
import type { LifecycleStage } from "./business";
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

export const cultureMasthead = {
  title: { before: "People are ", accent: "the foundation." } satisfies MastheadTitle,
  subtext:
    "Seven decades after a modest land parcel and a rice mill, the NDR Group still runs on the same thing: people who take ownership of what they build.",
};

export const cultureOverview = {
  eyebrow: "Corporate culture",
  heading: "Strong teams. Stronger foundations.",
  lead: "Every park we build starts with the people who build it.",
  body: [
    "From land teams in the field to engineers on live sites and the people who run each park long after handover, NDR works as one team, held to one standard. We hire for ownership, learn on real projects and give people room to grow as the platform grows.",
    "It is how a family-founded group has kept building for seven decades, and how it now builds at institutional scale.",
  ],
  /* CONFIRM WITH CLIENT: replace with the team photograph. */
  image: {
    src: "/images/asset-management/facility-technical.jpg",
    alt: "An NDR facility manager reviewing a tablet beside the loading docks of a warehouse park",
  },
  chip: { label: "Team strength", value: "230" },
};

export type HrStat = {
  /** null until the client confirms the figure: renders an em dash. */
  value: number | null;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
};

export const hrStats = {
  eyebrow: "HR at a glance",
  heading: "The team, in numbers.",
  stats: [
    {
      value: 230,
      label: "Strength",
      note: "People across development, operations and the corporate office",
    },
    {
      /* CONFIRM WITH CLIENT: growth figure and what it measures. */
      value: null,
      suffix: "%",
      label: "Growth",
      note: "Year-on-year growth in team strength",
    },
    {
      /* CONFIRM WITH CLIENT: average years of working. */
      value: null,
      suffix: " yrs",
      label: "Avg. years of working",
      note: "Average time our people have been with NDR",
    },
  ] as readonly HrStat[],
};

/* CONFIRM WITH CLIENT: the ring's wording. */
export const cultureCycle = {
  eyebrow: "How we grow people",
  heading: "A cycle that keeps building teams.",
  lede: "The people we hire learn on real sites, grow with the platform and go on to lead the next team. Then the cycle starts again.",
  nodes: [
    { index: "01", name: "Hire for character", caption: ["People who own", "the outcome"] },
    { index: "02", name: "Learn on site", caption: ["Real projects", "from day one"] },
    { index: "03", name: "Grow with NDR", caption: ["Roles that scale", "with the platform"] },
    { index: "04", name: "Lead & pass it on", caption: ["Building the", "next team"] },
  ] satisfies readonly CycleNodeDef[],
  medallion: { title: "PEOPLE", sub: "At the centre" } satisfies CycleMedallion,
};

/* CONFIRM WITH CLIENT: stage wording and photographs (stand-ins below). */
export const learningDevelopment = {
  eyebrow: "Learning & development",
  heading: "Learning that happens on the job, and beyond it.",
  lede: "Five ways NDR invests in its people, from the first week to the first team they lead.",
  stages: [
    {
      index: "01",
      title: "Induction & onboarding",
      body: "Every joiner starts with the whole picture: the group's story, how a park moves from land to handover, and the people who make each stage happen.",
      image: {
        src: "/images/lifecycle/02-due-diligence.jpg",
        alt: "Project documents, surveys and plans laid out on a desk",
        credit: "",
        width: 1408,
        height: 768,
      },
    },
    {
      index: "02",
      title: "Learning on live sites",
      body: "Engineers and managers learn where the work is: on live projects, alongside the teams delivering them, with responsibility that grows with each build.",
      image: {
        src: "/images/lifecycle/06-engineering.jpg",
        alt: "Engineers at work on the steel structure of a warehouse under construction",
        credit: "",
        width: 2200,
        height: 1238,
      },
    },
    {
      index: "03",
      title: "Mentorship from leadership",
      body: "Leaders with decades in the business work closely with their teams, so judgement is passed on along with the job.",
      image: {
        src: "/images/lifecycle/05-project-planning.jpg",
        alt: "A blueprint drawing of a warehouse park with loading docks and an office block",
        credit: "",
        width: 1408,
        height: 768,
      },
    },
    {
      index: "04",
      title: "Safety & professional skills",
      body: "Safety training on every project, and support for the technical and professional skills each role needs as it grows.",
      image: {
        src: "/images/lifecycle/07-safety-equipment.jpg",
        alt: "A site team in hard hats and high-visibility vests walking a warehouse construction site",
        credit: "",
        width: 1536,
        height: 1024,
      },
    },
    {
      index: "05",
      title: "Growing into leadership",
      body: "As the platform grows, so do the roles. People who have built and run our parks go on to lead projects, parks and functions.",
      image: {
        src: "/images/lifecycle/09-asset-operations.jpg",
        alt: "An operating NDR warehouse park with trucks at the loading docks",
        credit: "",
        width: 1672,
        height: 941,
      },
    },
  ] satisfies readonly LifecycleStage[],
};

export const cultureClosing = {
  eyebrow: "Join us",
  heading: "Build what India runs on.",
  lede: "See the roles open across the platform, or find out why businesses and investors choose to build with NDR.",
  primaryCta: {
    label: "See open roles",
    href: "/culture-and-careers/careers-and-opportunities",
  },
  secondaryCta: { label: "Why NDR", href: "/why-ndr" },
} as const satisfies ClosingCtaData;

/* careers & opportunities --------------------------------------------------- */

export const careersMasthead = {
  title: { before: "Careers & ", accent: "Opportunities" } satisfies MastheadTitle,
  subtext:
    "Roles across development, park operations and the corporate office, building and running logistics infrastructure across India.",
};

export type JobRole = {
  /** Reference quoted in the application email subject, e.g. "NDR-PRJ-014". */
  ref: string;
  title: string;
  /** Team, e.g. "Development & Projects". Roles are filterable by it. */
  team: string;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  experience: string;
  summary: string;
};

/**
 * Open roles, newest first. Leave the list empty when nothing is open: the
 * page then shows the talent-pool note instead. To add a role, copy this
 * shape:
 *
 *   {
 *     ref: "NDR-PRJ-014",
 *     title: "Project Manager – Civil",
 *     team: "Development & Projects",
 *     location: "Chennai",
 *     type: "Full-time",
 *     experience: "8–12 years",
 *     summary: "Lead the civil works of a greenfield warehouse park from groundbreaking to handover.",
 *   },
 */
export const roles: readonly JobRole[] = [];

export const careersOpenings = {
  eyebrow: "Job openings",
  heading: "Open roles",
  applyLabel: "Apply via email",
  empty: {
    heading: "No open roles right now.",
    body: "We're always glad to meet good people. Send your CV with the function and city you're interested in, and we'll be in touch when a suitable role opens.",
    cta: "Send your CV",
  },
  talentPool: "Don't see your role? Send your CV with the function and city you're interested in.",
  notice:
    "NDR never asks for a fee at any stage of hiring, and job offers come only from an @ndrsmart.com address. CVs are used only for recruitment.",
};

/** mailto for one role, or the general talent pool when no role is given. */
export function applyHref(role?: JobRole): string {
  const subject = role ? `Application – ${role.title} (${role.ref})` : "CV for future openings";
  return `mailto:${hrEmail}?subject=${encodeURIComponent(subject)}`;
}
