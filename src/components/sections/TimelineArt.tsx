import type { ReactNode } from "react";

/* Line art for the About timeline. Everything here is decorative: small       */
/* single-colour drawings that sit beside each milestone and a set of flowing   */
/* contour lines that run the length of the section. The drawings are made of   */
/* `pathLength={1}` strokes so the stylesheet can draw them in with one         */
/* dash-offset transition, whatever the real length of each stroke.             */

export type MotifKey =
  | "wheat"
  | "warehouse"
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
  "wheat",
  "warehouse",
  "containers",
  "factory",
  "coin",
  "skyline",
  "chart",
  "warehouse",
  "truck",
  "ship",
  "skyline",
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

/* Flowing contour lines: three down each edge, like survey lines across land   */
/* being planned. Drawn in a 1000 x 2000 box and stretched to the section, with  */
/* a constant stroke width.                                                      */
const contours = [
  "M90 0 C170 220 10 440 90 660 S170 1100 90 1320 S10 1760 90 2000",
  "M56 0 C136 260 -24 520 56 780 S136 1240 56 1500 S-24 1900 56 2000",
  "M124 0 C44 180 204 400 124 620 S44 1060 124 1280 S204 1700 124 2000",
];

export function WavePaths() {
  return (
    <>
      {contours.map((d, index) => (
        <g key={index}>
          <path
            d={d}
            vectorEffect="non-scaling-stroke"
            strokeDasharray={index === 1 ? "2 9" : undefined}
          />
          <path
            d={d}
            transform="translate(1000 0) scale(-1 1)"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={index === 1 ? "2 9" : undefined}
          />
        </g>
      ))}
    </>
  );
}
