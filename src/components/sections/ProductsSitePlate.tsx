"use client";

import type { CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./ProductsSitePlate.module.css";

/* Isometric projection ---------------------------------------------------- */
/* World coordinates in metres, projected with a standard 2:1 isometric.     */

const S = 3.2;
const K = 0.866 * S;
const H = 0.5 * S;
const OX = 700;
const OY = 720;

const pt = (x: number, y: number, z = 0): [number, number] => [
  OX + (x - y) * K,
  OY + (x + y) * H - z * S,
];

const face = (points: Array<[number, number, number]>): string =>
  points.map(([x, y, z]) => pt(x, y, z).join(",")).join(" ");

/* Assemble-on sequence ---------------------------------------------------- */
/* Each tagged element carries a --s index; delay = index * 70ms.           */

const stagger = (index: number): CSSProperties => ({ "--s": index }) as CSSProperties;

/* Plan rotation (world-space, applied to corners before projection) and a   */
/* generic draw that picks the two camera-facing walls of a rotated prism.   */

const R = (x: number, y: number, px: number, py: number, deg: number): [number, number] => {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = x - px;
  const dy = y - py;
  return [px + dx * cos - dy * sin, py + dx * sin + dy * cos];
};

/* A fixed screen-space offset a mass's footprint is cast onto, to fake a    */
/* soft contact shadow without a real 3-D light model.                      */

const SHADOW_DX = 15;
const SHADOW_DY = 11;

const shadowPoints = (ground: Array<[number, number]>): string =>
  ground.map(([x, y]) => `${x + SHADOW_DX},${y + SHADOW_DY}`).join(" ");

type Wall = {
  pts: Array<[number, number]>;
  normal: [number, number];
  isFront: boolean;
};

function visibleWalls(corners: Array<[number, number]>): Array<Wall> {
  const centroid = corners.reduce((acc, [x, y]) => [acc[0] + x / 4, acc[1] + y / 4], [0, 0] as [
    number,
    number,
  ]);
  const walls: Array<Wall> = [];
  for (let i = 0; i < corners.length; i += 1) {
    const [px, py] = corners[i];
    const [qx, qy] = corners[(i + 1) % corners.length];
    const mid: [number, number] = [(px + qx) / 2, (py + qy) / 2];
    let nx = -(qy - py);
    let ny = qx - px;
    if (nx * (mid[0] - centroid[0]) + ny * (mid[1] - centroid[1]) < 0) {
      nx = -nx;
      ny = -ny;
    }
    if (nx + ny > 0) {
      walls.push({
        pts: [corners[i], corners[(i + 1) % corners.length]],
        normal: [nx, ny],
        isFront: Math.abs(ny) >= Math.abs(nx),
      });
    }
  }
  return walls;
}

/* Campus plan (metres). Left cluster is a stepped trio of distinct halls     */
/* (largest combined footprint); the right cluster holds the dominant single  */
/* hall. Each cluster is rotated in plan a few degrees relative to the other. */

type MassCfg = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  h: number;
  pivot: [number, number];
  deg: number;
  seams?: number[];
  doors?: number;
  hero?: boolean;
};

const LEFT_PIVOT: [number, number] = [72, 80];
const RIGHT_PIVOT: [number, number] = [222, 80];
const LEFT_DEG = -3;
const RIGHT_DEG = 5;

/* Each mass is trimmed slightly off its shared edge (rather than shifting   */
/* its counterpart) so every gap reads as a deliberate, modest service gap   */
/* without moving any footprint's relationship to the roads/yards it fronts.*/

const LEFT_MASSES: MassCfg[] = [
  { x0: 14, y0: 14, x1: 112, y1: 55, h: 18, pivot: LEFT_PIVOT, deg: LEFT_DEG, seams: [0.33, 0.66] },
  {
    x0: 66,
    y0: 58,
    x1: 132,
    y1: 95,
    h: 16.5,
    pivot: LEFT_PIVOT,
    deg: LEFT_DEG,
    seams: [0.4, 0.75],
  },
  {
    x0: 20,
    y0: 98,
    x1: 108,
    y1: 142,
    h: 15.5,
    pivot: LEFT_PIVOT,
    deg: LEFT_DEG,
    seams: [0.5],
    doors: 2,
  },
];

const RIGHT_MASSES: MassCfg[] = [
  {
    x0: 186,
    y0: 6,
    x1: 282,
    y1: 61,
    h: 17,
    pivot: RIGHT_PIVOT,
    deg: RIGHT_DEG,
    seams: [0.35, 0.7],
  },
  { x0: 176, y0: 64, x1: 268, y1: 146, h: 20, pivot: RIGHT_PIVOT, deg: RIGHT_DEG, hero: true },
];

/* The central access road runs strictly between the two clusters, from       */
/* behind the rear facades to a junction at the foreground road.             */

const CENTRAL_ROAD: Array<[number, number]> = [
  [146, -10],
  [158, -10],
  [158, 190],
  [146, 190],
];

const FOREGROUND_ROAD: Array<[number, number]> = [
  [-6, 176],
  [270, 176],
  [270, 190],
  [-6, 190],
];

/* Paved yards: a loading apron in front of the front-left hall and a         */
/* service yard at the base of the right-side warehouse.                      */

const LEFT_YARD: Array<[number, number]> = [
  [10, 146],
  [144, 146],
  [144, 176],
  [10, 176],
];

const RIGHT_YARD: Array<[number, number]> = [
  [164, 148],
  [268, 148],
  [268, 176],
  [164, 176],
];

/* Unpaved service track: branches at the central/foreground-road junction    */
/* and runs down toward the lower-right marsh, stopping short of it.          */

const DIRT_TRACK: Array<[number, number]> = [
  [160, 190],
  [176, 198],
  [240, 212],
  [248, 220],
  [232, 224],
  [164, 200],
];

const PLATFORM: Array<[number, number]> = [
  [-16, -16],
  [288, -16],
  [288, 238],
  [-16, 238],
];

/* Perimeter compound wall — traced just outside the roads/yards, enclosing  */
/* the developed core (not the scrub/wetland halo beyond it). Each run is a  */
/* single low vertical panel between two ground points (not a box extrusion —*/
/* a box's flat top face reads as a wide bright ribbon at this wall's very   */
/* elongated, low proportions). A gap on the south run seats the main gate,  */
/* where the central road meets the front boundary.                         */

const WALL_H = 2.4;
const GATE_GAP: [number, number] = [136, 168];

const WALL_LINES: Array<[[number, number], [number, number]]> = [
  [
    [-6, -16],
    [284, -16],
  ], // north run
  [
    [-6, 190],
    [GATE_GAP[0], 190],
  ], // south run, west of gate
  [
    [GATE_GAP[1], 190],
    [284, 190],
  ], // south run, east of gate
  [
    [-6, -16],
    [-6, 190],
  ], // west run
  [
    [284, -16],
    [284, 190],
  ], // east run
];

/* Main gate: two posts flanking the gap, a lintel bar tying them together,  */
/* and a small guard booth just inside — reads clearly as the access point.  */

const GATE_POSTS: Array<[number, number]> = [
  [GATE_GAP[0] - 2, 188],
  [GATE_GAP[1], 188],
];
const GATE_POST_H = 4.6;
const GATE_BOOTH = { x0: GATE_GAP[1] + 6, y0: 176, x1: GATE_GAP[1] + 15, y1: 184, h: 2.6 };

/* A small staff/visitor car park, adjacent to the loading yard's existing   */
/* continuous red edge line but set back from both the paved road and the   */
/* truck loading positions.                                                 */

const CARS = [
  { x0: 112, y0: 165, x1: 119, y1: 170 },
  { x0: 122, y0: 165, x1: 129, y1: 170 },
  { x0: 132, y0: 165, x1: 139, y1: 170 },
  { x0: 14, y0: 165, x1: 21, y1: 170 },
] as const;

/* Dock levelers: low raised platforms at the loading-dock face of each      */
/* warehouse that actually fronts a yard — matching the existing door        */
/* positions on the left cluster's dock hall, plus the two service yards.   */

const DOCK_LEVELERS = [
  { x0: 47, y0: 145, x1: 53, y1: 149 },
  { x0: 73, y0: 145, x1: 79, y1: 149 },
  { x0: 195, y0: 149, x1: 202, y1: 153 },
  { x0: 227, y0: 149, x1: 234, y1: 153 },
] as const;

/* Sprinkler risers: one small fire-safety marker near a yard-facing corner  */
/* of each of the five building masses — subtle, not a repeated pattern.    */

const SPRINKLERS = [
  { x: 9, y: 20 }, // west of the rear-most left hall, clear of its footprint
  { x: 137, y: 70 }, // east of the middle left hall
  { x: 24, y: 146 }, // south of the front-left hall, in its own yard
  { x: 181, y: 20 }, // west of the right cluster's rear block
  { x: 272, y: 150 }, // south-east of the dominant hero hall, in its yard
];

const TRUCKS = [
  { x0: 26, y0: 152, x1: 42, y1: 156, cab: "east", maroon: true },
  { x0: 62, y0: 150, x1: 78, y1: 154, cab: "west", maroon: false },
  { x0: 30, y0: 164, x1: 46, y1: 168, cab: "east", maroon: false },
  { x0: 88, y0: 162, x1: 104, y1: 166, cab: "west", maroon: false },
  { x0: 196, y0: 158, x1: 212, y1: 162, cab: "east", maroon: false },
  { x0: 226, y0: 166, x1: 242, y1: 170, cab: "west", maroon: false },
] as const;

const TREES = [
  { x: 10, y: 60 },
  { x: 6, y: 120 },
  { x: 118, y: 12 },
  { x: 160, y: 14 },
  { x: 274, y: 90 },
  { x: 272, y: 150 },
  { x: 24, y: 198 },
  { x: 96, y: 198 },
  { x: 224, y: 208 },
  { x: 246, y: 234 },
];

/* Low scrub scattered through the otherwise-bare ground either side of the   */
/* road, so the flanking yard doesn't read as empty negative space.          */

const SHRUBS = [
  { x: 32, y: 178, r: 3.4 },
  { x: 54, y: 186, r: 2.6 },
  { x: 18, y: 210, r: 3 },
  { x: 66, y: 214, r: 2.4 },
  { x: 8, y: 168, r: 2.8 },
  { x: 190, y: 180, r: 3 },
  { x: 210, y: 190, r: 2.6 },
  { x: 276, y: 200, r: 3.2 },
  { x: 256, y: 178, r: 2.4 },
  { x: 40, y: 40, r: 2.6 },
  { x: 192, y: 8, r: 2.6 },
];

/* Dense scrub tracing the plot boundary and blanketing the foreground —     */
/* the real site is mostly green, not bare ground with a few landscaped      */
/* shrubs, so this is the highest-leverage fix for matching the photo. Drawn */
/* as soft overlapping ground-cover patches (same construction as the water  */
/* bodies), not individually-placed dots — those read as too sparse at this  */
/* scale to feel like real coverage.                                        */

const SCRUB_PATCHES = [
  { x: -14, y: 20, rx: 18, ry: 22, seed: 1.1 },
  { x: -15, y: 65, rx: 18, ry: 24, seed: 2.3 },
  { x: -14, y: 112, rx: 19, ry: 24, seed: 3.5 },
  { x: -13, y: 160, rx: 18, ry: 22, seed: 4.1 },
  { x: -8, y: 205, rx: 16, ry: 18, seed: 5 },
  { x: 45, y: -15, rx: 22, ry: 16, seed: 6.2 },
  { x: 105, y: -16, rx: 22, ry: 16, seed: 7.4 },
  { x: 165, y: -16, rx: 22, ry: 16, seed: 8.6 },
  { x: 286, y: 15, rx: 18, ry: 22, seed: 9.8 },
  { x: 288, y: 60, rx: 18, ry: 24, seed: 1.9 },
  { x: 288, y: 105, rx: 19, ry: 24, seed: 2.7 },
  { x: 287, y: 150, rx: 18, ry: 22, seed: 3.3 },
  { x: 284, y: 195, rx: 18, ry: 22, seed: 4.9 },
  { x: 20, y: 230, rx: 26, ry: 16, seed: 5.5 },
  { x: 70, y: 235, rx: 26, ry: 17, seed: 6.1 },
  { x: 120, y: 234, rx: 24, ry: 16, seed: 7.7 },
  { x: 170, y: 234, rx: 24, ry: 16, seed: 8.3 },
  { x: 220, y: 232, rx: 24, ry: 16, seed: 9.1 },
  { x: 265, y: 228, rx: 22, ry: 16, seed: 1.5 },
  { x: -2, y: 195, rx: 14, ry: 12, seed: 2.2 },
  { x: 95, y: 215, rx: 13, ry: 10, seed: 3.8 },
  { x: 175, y: 208, rx: 12, ry: 10, seed: 4.4 },
];

/* Wet ground: an irregular, hand-wobbled outline reads as real water rather  */
/* than a geometric ellipse. Two foreground bodies (pond, marsh) plus two     */
/* wide, low-lying patches backing the rear boundary, well clear of the      */
/* halls so they read as distant ground.                                    */

function organicBlob(
  ox: number,
  oy: number,
  rx: number,
  ry: number,
  seed: number,
): Array<[number, number]> {
  const n = 48;
  const out: Array<[number, number]> = [];
  for (let i = 0; i < n; i += 1) {
    const t = (i / n) * Math.PI * 2;
    const wobble = 1 + 0.14 * Math.sin(3 * t + seed) + 0.06 * Math.sin(7 * t + seed * 1.6);
    out.push([ox + rx * wobble * Math.cos(t), oy + ry * wobble * Math.sin(t)]);
  }
  return out;
}

const POND = organicBlob(12, 200, 20, 10, 0.4);
const MARSH = organicBlob(256, 214, 26, 14, 2.1);
const REAR_WETLAND_L = organicBlob(40, -28, 52, 17, 4.6);
const REAR_WETLAND_R = organicBlob(226, -26, 58, 18, 6.3);

/* A handful of small water pockets scattered through the foreground scrub,   */
/* echoing the several ponds visible in the real aerial photo.               */

const POND2 = organicBlob(70, 212, 9, 4.6, 8.2);
const POND3 = organicBlob(150, 228, 7.5, 4, 10.5);

/* A box extruded from z0 up to z0 + h, drawn as the three visible faces      */

function Box({
  x0,
  y0,
  x1,
  y1,
  h,
  z0 = 0,
  className,
}: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  h: number;
  z0?: number;
  className?: string;
}) {
  const z1 = z0 + h;
  return (
    <g className={className}>
      <polygon
        className={styles.boxFront}
        points={face([
          [x0, y1, z0],
          [x1, y1, z0],
          [x1, y1, z1],
          [x0, y1, z1],
        ])}
      />
      <polygon
        className={styles.boxRight}
        points={face([
          [x1, y0, z0],
          [x1, y1, z0],
          [x1, y1, z1],
          [x1, y0, z1],
        ])}
      />
      <polygon
        className={styles.boxTop}
        points={face([
          [x0, y0, z1],
          [x1, y0, z1],
          [x1, y1, z1],
          [x0, y1, z1],
        ])}
      />
    </g>
  );
}

/* A world-rotated extruded hall: contact shadow, roof + the two camera-      */
/* facing walls, a gold sun-glint along the lit ridge, plus optional roof     */
/* seams and dock doors on the front face.                                   */

function Mass({
  x0,
  y0,
  x1,
  y1,
  h,
  pivot,
  deg,
  seams,
  doors,
  hero = false,
  style,
}: MassCfg & { style?: CSSProperties }) {
  const corners = [
    R(x0, y0, pivot[0], pivot[1], deg),
    R(x1, y0, pivot[0], pivot[1], deg),
    R(x1, y1, pivot[0], pivot[1], deg),
    R(x0, y1, pivot[0], pivot[1], deg),
  ];
  const centroid = corners.reduce((acc, [x, y]) => [acc[0] + x / 4, acc[1] + y / 4], [0, 0] as [
    number,
    number,
  ]);
  const walls = visibleWalls(corners);
  const parapetClass = hero ? styles.parapetGold : styles.parapet;
  const roofClass = hero ? styles.roofTopHero : styles.roofTop;
  const d = y1 - y0;
  const w = x1 - x0;

  const groundShadow = corners.map(([x, y]) => pt(x, y, 0));

  const seamPoints = (seams ?? []).map((t) => {
    const [ax, ay] = R(x0, y0 + t * d, pivot[0], pivot[1], deg);
    const [bx, by] = R(x1, y0 + t * d, pivot[0], pivot[1], deg);
    return { ax, ay, bx, by };
  });

  const frontWall = walls.find((w2) => w2.isFront);
  const doorPoints = !frontWall
    ? []
    : Array.from({ length: doors ?? 0 }, (_, index) => {
        const t = 0.35 + index * 0.3;
        const [ax, ay] = R(x0 + w * t - 1.6, y1, pivot[0], pivot[1], deg);
        const [bx, by] = R(x0 + w * t + 1.6, y1, pivot[0], pivot[1], deg);
        const [cx2, cy2] = R(x0 + w * t + 1.6, y1 + 1.5, pivot[0], pivot[1], deg);
        const [dx2, dy2] = R(x0 + w * t - 1.6, y1 + 1.5, pivot[0], pivot[1], deg);
        return { ax, ay, bx, by, cx2, cy2, dx2, dy2 };
      });

  return (
    <g className={styles.rise} style={style}>
      <polygon className={styles.shadowBlob} points={shadowPoints(groundShadow)} />
      {walls.map((wall, index) => (
        <polygon
          key={index}
          className={wall.isFront ? styles.wallFront : styles.wallRight}
          points={face([
            [wall.pts[0][0], wall.pts[0][1], 0],
            [wall.pts[1][0], wall.pts[1][1], 0],
            [wall.pts[1][0], wall.pts[1][1], h],
            [wall.pts[0][0], wall.pts[0][1], h],
          ])}
        />
      ))}
      <polygon
        className={roofClass}
        points={face([
          [corners[0][0], corners[0][1], h],
          [corners[1][0], corners[1][1], h],
          [corners[2][0], corners[2][1], h],
          [corners[3][0], corners[3][1], h],
        ])}
      />
      <polygon
        className={parapetClass}
        points={face(
          corners.map(([x, y]) => {
            const dx = centroid[0] - x;
            const dy = centroid[1] - y;
            const len = Math.hypot(dx, dy) || 1;
            const inset = 0.8 / len;
            return [x + dx * inset, y + dy * inset, h];
          }),
        )}
      />
      {frontWall && (
        <line
          className={styles.rimLight}
          x1={pt(frontWall.pts[0][0], frontWall.pts[0][1], h)[0]}
          y1={pt(frontWall.pts[0][0], frontWall.pts[0][1], h)[1]}
          x2={pt(frontWall.pts[1][0], frontWall.pts[1][1], h)[0]}
          y2={pt(frontWall.pts[1][0], frontWall.pts[1][1], h)[1]}
        />
      )}
      {seamPoints.map((s, index) => (
        <line key={index} className={styles.roofSeam} x1={s.ax} y1={s.ay} x2={s.bx} y2={s.by} />
      ))}
      {doorPoints.map((p, index) => (
        <polygon
          key={index}
          className={styles.dockDoor}
          points={face([
            [p.ax, p.ay, 1],
            [p.bx, p.by, 1],
            [p.cx2, p.cy2, 4.5],
            [p.dx2, p.dy2, 4.5],
          ])}
        />
      ))}
    </g>
  );
}

function Truck({
  x0,
  y0,
  x1,
  y1,
  cab,
  maroon,
  style,
}: (typeof TRUCKS)[number] & { style?: CSSProperties }) {
  const cabBox =
    cab === "east" ? { x0: x1 - 3, y0, x1, y1, h: 3.2 } : { x0, y0, x1: x0 + 3, y1, h: 3.2 };
  const shadow = [
    [x0, y1],
    [x1, y1],
    [x1, y0],
    [x0, y0],
  ].map(([x, y]) => pt(x, y, 0));
  return (
    <g className={cx(styles.rise, maroon && styles.truckMaroon)} style={style}>
      <polygon className={styles.shadowBlobSoft} points={shadowPoints(shadow)} />
      <Box x0={x0} y0={y0} x1={x1} y1={y1} h={3.6} />
      <Box {...cabBox} />
    </g>
  );
}

/* A small parked car — a low body plus an inset cabin box, scaled well      */
/* under the trucks so the size difference alone reads as "car, not truck". */

function Car({
  x0,
  y0,
  x1,
  y1,
  style,
}: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  style?: CSSProperties;
}) {
  const cabinInset = (x1 - x0) * 0.22;
  const shadow = [
    [x0, y1],
    [x1, y1],
    [x1, y0],
    [x0, y0],
  ].map(([x, y]) => pt(x, y, 0));
  return (
    <g className={styles.rise} style={style}>
      <polygon className={styles.shadowBlobSoft} points={shadowPoints(shadow)} />
      <Box x0={x0} y0={y0} x1={x1} y1={y1} h={0.9} />
      <Box x0={x0 + cabinInset} y0={y0} x1={x1 - cabinInset} y1={y1} h={0.55} z0={0.9} />
    </g>
  );
}

/* A dock leveler: a low raised platform at a warehouse's loading face.      */

function DockLeveler({
  x0,
  y0,
  x1,
  y1,
  style,
}: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  style?: CSSProperties;
}) {
  return (
    <g className={styles.rise} style={style}>
      <Box x0={x0} y0={y0} x1={x1} y1={y1} h={0.4} />
    </g>
  );
}

/* A restrained fire-safety riser (sprinkler/hydrant stand) — a thin post    */
/* with a small head and two short outlet arms, reusing the same fine-line   */
/* treatment the site's other utility fittings use, kept intentionally tiny  */
/* so it reads as ground equipment rather than a structure.                 */

function Sprinkler({ x, y, style }: { x: number; y: number; style?: CSSProperties }) {
  const [bx, by] = pt(x, y, 0);
  const [tx, ty] = pt(x, y, 1.4);
  const [ax, ay] = pt(x - 0.9, y, 1.1);
  const [cx2, cy2] = pt(x + 0.9, y, 1.1);
  return (
    <g className={styles.rise} style={style}>
      <line className={styles.poleShaft} x1={bx} y1={by} x2={tx} y2={ty} />
      <line className={styles.poleArm} x1={ax} y1={ay} x2={cx2} y2={cy2} />
      <circle className={styles.sprinklerHead} cx={tx} cy={ty} r={1.6} />
    </g>
  );
}

/* One run of the perimeter wall: a single low vertical panel between two    */
/* ground points, with a thin cap line along its top edge. Working directly  */
/* from two points (rather than an x0/y0/x1/y1 box) means every run — north/ */
/* south (long in x) and east/west (long in y) alike — renders as the same   */
/* kind of thin strip, with no flat top face to read as a wide bright band.  */

function WallPanel({
  a,
  b,
  style,
}: {
  a: [number, number];
  b: [number, number];
  style?: CSSProperties;
}) {
  const panel = face([
    [a[0], a[1], 0],
    [b[0], b[1], 0],
    [b[0], b[1], WALL_H],
    [a[0], a[1], WALL_H],
  ]);
  const [capAx, capAy] = pt(a[0], a[1], WALL_H);
  const [capBx, capBy] = pt(b[0], b[1], WALL_H);
  return (
    <g className={styles.rise} style={style}>
      <polygon className={styles.wallPanel} points={panel} />
      <line className={styles.wallCap} x1={capAx} y1={capAy} x2={capBx} y2={capBy} />
    </g>
  );
}

function Tree({ x, y, style }: { x: number; y: number; style?: CSSProperties }) {
  const [gx, gy] = pt(x, y, 0);
  const [tx, ty] = pt(x, y, 2);
  return (
    <g className={styles.rise} style={style}>
      <ellipse className={styles.shadowBlobSoft} cx={gx + 4} cy={gy + 2} rx={4.5} ry={2.2} />
      <line className={styles.treeTrunk} x1={gx} y1={gy} x2={tx} y2={ty} />
      <ellipse className={styles.treeCanopy} cx={tx} cy={ty} rx={5} ry={3.8} />
      <ellipse className={styles.treeCanopyInner} cx={tx + 1.3} cy={ty - 1.5} rx={2.8} ry={2.2} />
    </g>
  );
}

function Shrub({ x, y, r, style }: { x: number; y: number; r: number; style?: CSSProperties }) {
  const [gx, gy] = pt(x, y, 0);
  return (
    <ellipse
      className={cx(styles.shrub, styles.fade)}
      style={style}
      cx={gx}
      cy={gy}
      rx={r}
      ry={r * 0.62}
    />
  );
}

/* A soft, irregular ground-cover patch — same construction as the water      */
/* bodies (organicBlob), just filled green. Chained along the boundary with   */
/* enough overlap to read as a continuous band of scrub, the way the real     */
/* site's tree cover actually reads from the air, rather than as dots.       */

function ScrubPatch({
  x,
  y,
  rx,
  ry,
  seed,
  style,
}: {
  x: number;
  y: number;
  rx: number;
  ry: number;
  seed: number;
  style?: CSSProperties;
}) {
  const shape = organicBlob(x, y, rx, ry, seed);
  const points = face(shape.map(([px, py]) => [px, py, 0]));
  return (
    <g className={styles.fade} style={style}>
      <polygon className={styles.scrubHalo} points={points} />
      <polygon className={styles.scrub} points={points} />
    </g>
  );
}

function Ripple({
  ox,
  oy,
  w,
  bow,
  style,
}: {
  ox: number;
  oy: number;
  w: number;
  bow: number;
  style?: CSSProperties;
}) {
  const [x1, y1] = pt(ox - w, oy);
  const [mx, my] = pt(ox, oy - bow);
  const [x2, y2] = pt(ox + w, oy);
  return (
    <path
      className={cx(styles.ripple, styles.fade)}
      style={style}
      d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
    />
  );
}

export function ProductsSitePlate() {
  const { ref, inView } = useInView<HTMLDivElement>();

  const ground = face(PLATFORM.map(([x, y]) => [x, y, 0]));
  const boundary = PLATFORM.map(([x, y]) => pt(x, y, 0).join(",")).join(" ");
  const centralMid = 152;

  return (
    <div ref={ref} className={cx(styles.plate, inView && styles.drawn)}>
      <span className={cx(styles.cropTopLeft, styles.pop)} style={stagger(0)} aria-hidden="true" />
      <span className={cx(styles.cropTopRight, styles.pop)} style={stagger(1)} aria-hidden="true" />
      <span
        className={cx(styles.cropBottomLeft, styles.pop)}
        style={stagger(2)}
        aria-hidden="true"
      />
      <span
        className={cx(styles.cropBottomRight, styles.pop)}
        style={stagger(3)}
        aria-hidden="true"
      />

      <svg
        className={styles.svg}
        viewBox="20 610 1500 930"
        focusable="false"
        role="img"
        aria-label="Isometric site plan of an NDR logistics campus, enclosed by a perimeter compound wall with a main entrance gate: a stepped cluster of three warehouse halls on the left and a dominant broad-roofed warehouse with a smaller rear hall on the right, divided by a central access road, with paved loading and service yards, staff parking, an unpaved service track, and surrounding scrub, pond and marshland."
      >
        <defs>
          <pattern
            id="ndr-hatch"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(28,26,25,0.05)" strokeWidth="1" />
          </pattern>

          <radialGradient id="ndr-atmosphere" cx="38%" cy="28%" r="82%">
            <stop offset="0%" stopColor="#faf4e7" />
            <stop offset="55%" stopColor="#f3ede0" />
            <stop offset="100%" stopColor="#e9e1cf" />
          </radialGradient>

          <linearGradient id="ndr-wall-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2ead7" />
            <stop offset="100%" stopColor="#dbccae" />
          </linearGradient>

          <linearGradient id="ndr-wall-right" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ddd0b4" />
            <stop offset="100%" stopColor="#c0b18e" />
          </linearGradient>

          <linearGradient id="ndr-roof" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbf7ee" />
            <stop offset="100%" stopColor="#e4d9bd" />
          </linearGradient>

          <linearGradient id="ndr-roof-hero" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fdf6e2" />
            <stop offset="100%" stopColor="#e8cd8f" />
          </linearGradient>

          <linearGradient id="ndr-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{ stopColor: "var(--color-gold)" }} stopOpacity={0} />
            <stop offset="50%" style={{ stopColor: "var(--color-gold)" }} stopOpacity={0.85} />
            <stop offset="100%" style={{ stopColor: "var(--color-gold)" }} stopOpacity={0} />
          </linearGradient>

          <radialGradient id="ndr-water-blue" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#dee7ec" />
            <stop offset="60%" stopColor="#b7c8d5" />
            <stop offset="100%" stopColor="#8fa5b6" />
          </radialGradient>

          <radialGradient id="ndr-water-green" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#d8ddb9" />
            <stop offset="60%" stopColor="#aebb8c" />
            <stop offset="100%" stopColor="#889765" />
          </radialGradient>

          <radialGradient id="ndr-scrub" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#b7c088" />
            <stop offset="60%" stopColor="#96a468" />
            <stop offset="100%" stopColor="#788a4e" />
          </radialGradient>

          <filter id="ndr-soft-shadow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>

          <filter id="ndr-soft-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        {/* ground + atmosphere */}
        <polygon className={styles.ground} points={ground} />
        <polygon className={styles.groundHatch} points={ground} />
        <polyline className={styles.boundary} points={`${boundary} ${boundary.split(" ")[0]}`} />

        {/* dense scrub tracing the boundary and blanketing the foreground — drawn   */}
        {/* first so roads, yards and buildings all paint cleanly over it           */}
        {SCRUB_PATCHES.map((p, index) => (
          <ScrubPatch
            key={index}
            x={p.x}
            y={p.y}
            rx={p.rx}
            ry={p.ry}
            seed={p.seed}
            style={stagger(4 + index)}
          />
        ))}

        {/* perimeter compound wall, enclosing the developed core */}
        {WALL_LINES.map(([a, b], index) => (
          <WallPanel key={index} a={a} b={b} style={stagger(4 + index)} />
        ))}

        {/* rear wetland — flooded paddy backing the site */}
        <polygon
          className={styles.marshHalo}
          points={face(REAR_WETLAND_L.map(([x, y]) => [x, y, 0]))}
        />
        <polygon
          className={styles.marsh}
          points={face(REAR_WETLAND_L.map(([x, y]) => [x, y, 0]))}
        />
        <polygon
          className={styles.marshHalo}
          points={face(REAR_WETLAND_R.map(([x, y]) => [x, y, 0]))}
        />
        <polygon
          className={styles.marsh}
          points={face(REAR_WETLAND_R.map(([x, y]) => [x, y, 0]))}
        />

        {/* pond + marsh */}
        <polygon className={styles.waterHalo} points={face(POND.map(([x, y]) => [x, y, 0]))} />
        <polygon className={styles.water} points={face(POND.map(([x, y]) => [x, y, 0]))} />
        <Ripple ox={8} oy={198} w={7} bow={1.5} style={stagger(9)} />
        <polygon className={styles.marshHalo} points={face(MARSH.map(([x, y]) => [x, y, 0]))} />
        <polygon className={styles.marsh} points={face(MARSH.map(([x, y]) => [x, y, 0]))} />
        <Ripple ox={250} oy={210} w={10} bow={2} style={stagger(10)} />
        <Ripple ox={262} oy={220} w={7} bow={1.4} style={stagger(11)} />

        {/* small water pockets scattered through the foreground scrub */}
        <polygon className={styles.waterHalo} points={face(POND2.map(([x, y]) => [x, y, 0]))} />
        <polygon className={styles.water} points={face(POND2.map(([x, y]) => [x, y, 0]))} />
        <polygon className={styles.waterHalo} points={face(POND3.map(([x, y]) => [x, y, 0]))} />
        <polygon className={styles.water} points={face(POND3.map(([x, y]) => [x, y, 0]))} />

        {/* central through-road (runs between the clusters, past the rear) */}
        <polygon className={styles.road} points={face(CENTRAL_ROAD.map(([x, y]) => [x, y, 0]))} />
        <line
          className={styles.roadEdge}
          x1={pt(146, -10)[0]}
          y1={pt(146, -10)[1]}
          x2={pt(146, 190)[0]}
          y2={pt(146, 190)[1]}
        />
        <line
          className={styles.roadEdge}
          x1={pt(158, -10)[0]}
          y1={pt(158, -10)[1]}
          x2={pt(158, 190)[0]}
          y2={pt(158, 190)[1]}
        />
        <line
          className={styles.centerline}
          x1={pt(centralMid, -10)[0]}
          y1={pt(centralMid, -10)[1]}
          x2={pt(centralMid, 190)[0]}
          y2={pt(centralMid, 190)[1]}
        />

        {/* foreground road (paved, full width) */}
        <polygon
          className={styles.road}
          points={face(FOREGROUND_ROAD.map(([x, y]) => [x, y, 0]))}
        />
        <line
          className={styles.roadEdge}
          x1={pt(-6, 176)[0]}
          y1={pt(-6, 176)[1]}
          x2={pt(270, 176)[0]}
          y2={pt(270, 176)[1]}
        />
        <line
          className={styles.roadEdge}
          x1={pt(-6, 190)[0]}
          y1={pt(-6, 190)[1]}
          x2={pt(270, 190)[0]}
          y2={pt(270, 190)[1]}
        />

        {/* paved yards: left loading apron + right service yard */}
        <polygon className={styles.apron} points={face(LEFT_YARD.map(([x, y]) => [x, y, 0]))} />
        <line
          className={styles.apronEdge}
          x1={pt(10, 168)[0]}
          y1={pt(10, 168)[1]}
          x2={pt(144, 168)[0]}
          y2={pt(144, 168)[1]}
        />
        <polygon className={styles.apron} points={face(RIGHT_YARD.map(([x, y]) => [x, y, 0]))} />

        {/* unpaved service track (separate element, stops short of the marsh) */}
        <polygon className={styles.dirt} points={face(DIRT_TRACK.map(([x, y]) => [x, y, 0]))} />
        <line
          className={styles.roadEdge}
          x1={pt(160, 190)[0]}
          y1={pt(160, 190)[1]}
          x2={pt(248, 220)[0]}
          y2={pt(248, 220)[1]}
        />
        <line
          className={styles.roadEdge}
          x1={pt(164, 200)[0]}
          y1={pt(164, 200)[1]}
          x2={pt(232, 224)[0]}
          y2={pt(232, 224)[1]}
        />

        {/* low scrub filling the bare yard either side of the road */}
        {SHRUBS.map((s, index) => (
          <Shrub key={index} x={s.x} y={s.y} r={s.r} style={stagger(24 + index)} />
        ))}

        {/* rear scrub */}
        {TREES.slice(0, 4).map((t, index) => (
          <Tree key={index} x={t.x} y={t.y} style={stagger(8 + index)} />
        ))}

        {/* left cluster — stepped trio, rotated in plan */}
        {LEFT_MASSES.map((m, index) => (
          <Mass key={index} {...m} style={stagger(14 + index)} />
        ))}

        {/* right cluster — dominant hall + rear block, rotated the other way */}
        {RIGHT_MASSES.map((m, index) => (
          <Mass key={index} {...m} style={stagger(17 + index)} />
        ))}

        {/* dock levelers at the loading-dock faces */}
        {DOCK_LEVELERS.map((d, index) => (
          <DockLeveler key={index} {...d} style={stagger(19 + index)} />
        ))}

        {/* sprinkler risers — one near a yard-facing corner of each mass */}
        {SPRINKLERS.map((s, index) => (
          <Sprinkler key={index} x={s.x} y={s.y} style={stagger(20 + index)} />
        ))}

        {/* trucks — staged at the front-left loading apron and right yard */}
        {TRUCKS.map((t, index) => (
          <Truck key={index} {...t} style={stagger(19 + index)} />
        ))}

        {/* staff cars, parked adjacent to the loading yard's red edge line */}
        {CARS.map((c, index) => (
          <Car key={index} {...c} style={stagger(21 + index)} />
        ))}

        {/* main gate — two posts under a lintel bar, a gold cap marking it as */}
        {/* the deliberate entrance, plus a guard booth set back inside it     */}
        <g className={styles.rise} style={stagger(23)}>
          {GATE_POSTS.map(([gx, gy], index) => (
            <g key={index}>
              <Box x0={gx} y0={gy} x1={gx + 2.2} y1={gy + 2.2} h={GATE_POST_H} />
              <polygon
                className={styles.gateCap}
                points={face([
                  [gx - 0.3, gy - 0.3, GATE_POST_H],
                  [gx + 2.5, gy - 0.3, GATE_POST_H],
                  [gx + 2.5, gy + 2.5, GATE_POST_H],
                  [gx - 0.3, gy + 2.5, GATE_POST_H],
                ])}
              />
            </g>
          ))}
          <polygon
            className={styles.gateLintel}
            points={face([
              [GATE_POSTS[0][0] + 1.1, GATE_POSTS[0][1] + 1.1, GATE_POST_H],
              [GATE_POSTS[1][0] + 1.1, GATE_POSTS[1][1] + 1.1, GATE_POST_H],
              [GATE_POSTS[1][0] + 1.1, GATE_POSTS[1][1] + 1.1, GATE_POST_H + 0.9],
              [GATE_POSTS[0][0] + 1.1, GATE_POSTS[0][1] + 1.1, GATE_POST_H + 0.9],
            ])}
          />
          <Box {...GATE_BOOTH} />
        </g>

        {/* remaining trees scattered in the scrub */}
        {TREES.slice(4).map((t, index) => (
          <Tree key={index + 4} x={t.x} y={t.y} style={stagger(25 + index)} />
        ))}
      </svg>
    </div>
  );
}
