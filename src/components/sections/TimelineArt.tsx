import type { ReactNode } from "react";

/* Line art for the About timeline. Everything here is decorative: small       */
/* single-colour drawings that sit beside each milestone and a set of flowing   */
/* contour lines that run the length of the section. The drawings are made of   */
/* `pathLength={1}` strokes so the stylesheet can draw them in with one         */
/* dash-offset transition, whatever the real length of each stroke.             */

export type MotifKey =
  | "wheat"
  | "warehouse"
  | "forklift"
  | "racking"
  | "dock"
  | "park"
  | "containers"
  | "factory"
  | "coin"
  | "chart"
  | "truck"
  | "ship"
  | "skyline"
  | "shield"
  | "globe"
  | "mark";

const unit = { pathLength: 1 } as const;

function P({ d }: { d: string }) {
  return <path {...unit} d={d} />;
}

const motifShapes: Record<MotifKey, ReactNode> = {
  /* a sheaf of rice: where the group began */
  wheat: (
    <>
      <P d="M32 58 V20" />
      <P d="M32 8 C29.5 12 29.5 16 32 20 C34.5 16 34.5 12 32 8 Z" />
      <P d="M32 26 C27 25 24 20 25 15 C30 16 33 20 32 26" />
      <P d="M32 26 C37 25 40 20 39 15 C34 16 31 20 32 26" />
      <P d="M32 38 C26 37 22 32 23 26 C29 27 33 32 32 38" />
      <P d="M32 38 C38 37 42 32 41 26 C35 27 31 32 32 38" />
      <P d="M32 50 C26 49 22 44 23 38 C29 39 33 44 32 50" />
      <P d="M32 50 C38 49 42 44 41 38 C35 39 31 44 32 50" />
      <P d="M16 58 H48" />
    </>
  ),
  warehouse: (
    <>
      <P d="M7 54 V28 L32 13 L57 28 V54 Z" />
      <P d="M23 54 V37 H41 V54" />
      <P d="M23 42 H41" />
      <P d="M23 47 H41" />
      <P d="M4 54 H60" />
    </>
  ),
  /* a forklift carrying a pallet load */
  forklift: (
    <>
      <P d="M8 46 V32 H30 V46 Z" />
      <P d="M12 32 V17 H28 V32" />
      <P d="M34 50 V10 M38 50 V10" />
      <P d="M34 46 H58" />
      <P d="M42 46 V31 H56 V46" />
      <P d="M42 38 H56" />
      <circle {...unit} cx="14" cy="49" r="5" />
      <circle {...unit} cx="28" cy="50" r="4" />
      <P d="M4 55 H60" />
    </>
  ),
  /* pallet racking, loaded bay by bay */
  racking: (
    <>
      <P d="M8 56 V8 M32 56 V8 M56 56 V8" />
      <P d="M8 22 H56 M8 38 H56" />
      <P d="M12 22 V14 H26 V22" />
      <P d="M36 22 V15 H50 V22" />
      <P d="M12 38 V29 H26 V38" />
      <P d="M36 38 V29 H50 V38" />
      <P d="M12 56 V47 H27 V56" />
      <P d="M37 56 V47 H52 V56" />
      <P d="M4 56 H60" />
    </>
  ),
  /* a loading dock: doors in the wall, a trailer backed in */
  dock: (
    <>
      <P d="M6 54 V12 H58 V54" />
      <P d="M12 54 V26 H26 V54" />
      <P d="M12 33 H26 M12 40 H26 M12 47 H26" />
      <P d="M36 54 V30 H52 V54" />
      <P d="M36 36 H52" />
      <P d="M40 54 V44 H48 V54" />
      <P d="M3 54 H61" />
    </>
  ),
  /* a warehousing park from above: buildings, a service road, a yard */
  park: (
    <>
      <P d="M6 8 H30 V26 H6 Z" />
      <P d="M12 8 V26 M18 8 V26 M24 8 V26" />
      <P d="M34 8 H58 V26 H34 Z" />
      <P d="M40 8 V26 M46 8 V26 M52 8 V26" />
      <P d="M4 31 H60 M4 37 H60" />
      <P d="M6 43 H40 V58 H6 Z" />
      <P d="M14 43 V58 M22 43 V58 M30 43 V58" />
      <P d="M44 43 H58 V58 H44 Z" />
      <P d="M44 50 H58" />
    </>
  ),
  containers: (
    <>
      <P d="M5 54 H59" />
      <P d="M7 54 V43 H22 V54" />
      <P d="M24 54 V43 H39 V54" />
      <P d="M41 54 V43 H56 V54" />
      <P d="M15 43 V32 H30 V43" />
      <P d="M33 43 V32 H48 V43" />
      <P d="M24 32 V21 H39 V32" />
      <P d="M50 21 V8 L58 14" />
    </>
  ),
  factory: (
    <>
      <P d="M6 54 V32 L20 40 V32 L34 40 V32 L48 40 V54 Z" />
      <P d="M44 40 V14 H54 V40" />
      <P d="M12 46 H18 M24 46 H30 M36 46 H42" />
      <P d="M46 10 C46 8 49 8 49 10 C51 8 53 10 51 12" />
      <P d="M4 54 H60" />
    </>
  ),
  coin: (
    <>
      <circle {...unit} cx="32" cy="32" r="20" />
      <circle {...unit} cx="32" cy="32" r="14" />
      <P d="M25 24 H39 M25 30 H39 M27 24 C40 24 40 37 27 37 L39 46" />
    </>
  ),
  chart: (
    <>
      <P d="M9 54 H57 M9 54 V10" />
      <P d="M15 54 V46 H23 V54" />
      <P d="M27 54 V38 H35 V54" />
      <P d="M39 54 V30 H47 V54" />
      <P d="M13 38 L26 26 L35 31 L53 14" />
      <P d="M45 14 H53 V22" />
    </>
  ),
  truck: (
    <>
      <P d="M5 42 V22 H34 V42" />
      <P d="M34 29 H46 L55 38 V42" />
      <P d="M5 42 H55" />
      <circle {...unit} cx="16" cy="45" r="5" />
      <circle {...unit} cx="45" cy="45" r="5" />
      <P d="M40 33 H46" />
      <P d="M3 51 H61" />
    </>
  ),
  ship: (
    <>
      <P d="M6 42 H58 L50 54 H14 Z" />
      <P d="M14 42 V32 H27 V42" />
      <P d="M30 42 V32 H43 V42" />
      <P d="M37 32 V22 H48 V32" />
      <P d="M44 22 V10 M44 10 L54 16 L44 17" />
    </>
  ),
  skyline: (
    <>
      <P d="M5 56 H59" />
      <P d="M7 56 V36 H19 V56" />
      <P d="M21 56 V16 H36 V56" />
      <P d="M38 56 V28 H48 V56" />
      <P d="M50 56 V40 H58 V56" />
      <P d="M25 24 H32 M25 31 H32 M25 38 H32 M25 45 H32" />
      <P d="M11 42 H15 M11 48 H15 M42 34 H44 M42 41 H44" />
    </>
  ),
  shield: (
    <>
      <P d="M32 7 L12 15 V30 C12 44 21 52 32 58 C43 52 52 44 52 30 V15 Z" />
      <P d="M22 32 L29 39 L43 24" />
    </>
  ),
  globe: (
    <>
      <circle {...unit} cx="32" cy="32" r="23" />
      <ellipse {...unit} cx="32" cy="32" rx="10" ry="23" />
      <P d="M9 32 H55 M13 20 H51 M13 44 H51" />
    </>
  ),
  /* the corner bracket from the NDR Smart Spaces mark */
  mark: (
    <>
      <P d="M12 12 H52 V52" />
      <P d="M22 22 H42 V42" />
      <P d="M32 32 H32.01" />
    </>
  ),
};

/* One motif per milestone, in order. */
export const MOTIF_SEQUENCE: readonly MotifKey[] = [
  "forklift",
  "warehouse",
  "containers",
  "factory",
  "coin",
  "racking",
  "chart",
  "warehouse",
  "truck",
  "dock",
  "park",
  "coin",
  "warehouse",
  "shield",
  "chart",
  "mark",
  "globe",
];

export function motifFor(index: number): MotifKey {
  return MOTIF_SEQUENCE[index % MOTIF_SEQUENCE.length];
}

type MotifSvgProps = { name: MotifKey; className?: string };

export function MotifSvg({ name, className }: MotifSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {motifShapes[name]}
    </svg>
  );
}
