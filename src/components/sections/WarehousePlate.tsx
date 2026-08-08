"use client";

import type { CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./WarehousePlate.module.css";

/* Isometric projection ---------------------------------------------------- */
/* World coordinates in metres, projected with a standard 2:1 isometric.    */

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

const STAGGER_BASE = 70;

const stagger = (index: number): CSSProperties => ({ "--s": index }) as CSSProperties;

/* Campus plan (metres). Visible side faces are +x (east) and +y (south).   */

const BUILDINGS = [
  { id: "W-01", x0: 16, y0: 16, x1: 104, y1: 62, h: 18, size: "88.0 × 46.0 M" },
  { id: "W-02", x0: 136, y0: 16, x1: 224, y1: 62, h: 18, size: "88.0 × 46.0 M" },
  { id: "W-03", x0: 16, y0: 96, x1: 104, y1: 142, h: 16, size: "88.0 × 46.0 M" },
  { id: "W-04", x0: 136, y0: 96, x1: 224, y1: 142, h: 16, size: "88.0 × 46.0 M" },
];

const DOCK_BAYS_NORTH = [24, 40, 56, 72, 88];
const DOCK_BAYS_SOUTH = [24, 40, 56, 72, 88];

const POLES = [20, 46, 72, 98, 124, 150].map((y) => ({ x: 12, y }));

const TREES = [
  { x: 6, y: 6 },
  { x: 112, y: 6 },
  { x: 234, y: 6 },
  { x: 6, y: 164 },
  { x: 234, y: 164 },
];

const TRUCKS = [
  { x0: 48, y0: 66, x1: 60, y1: 74, cab: "east", maroon: false },
  { x0: 176, y0: 66, x1: 188, y1: 74, cab: "west", maroon: true },
  { x0: 150, y0: 140, x1: 162, y1: 148, cab: "east", maroon: false },
  { x0: 104, y0: 150, x1: 116, y1: 158, cab: "east", maroon: false },
] as const;

/* A box extruded from z0 up to z0 + h, drawn as the three visible faces    */
/* (+y front, +x right, top) in painter's order.                            */

function Box({
  x0,
  y0,
  x1,
  y1,
  h,
  z0 = 0,
  className,
  style,
}: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  h: number;
  z0?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const z1 = z0 + h;
  return (
    <g className={className} style={style}>
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

function Block({
  id,
  x0,
  y0,
  x1,
  y1,
  h,
  size,
  style,
}: (typeof BUILDINGS)[number] & { style?: CSSProperties }) {
  const d = y1 - y0;
  const w = x1 - x0;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const [lx, ly] = pt(cx, cy, h + 0.4);
  const roofUnits =
    id === "W-02"
      ? [
          { x0: x1 - 10, y0: y0 + 5, x1: x1 - 3, y1: y0 + 16, z0: h },
          { x0: x1 - 10, y0: y0 + 20, x1: x1 - 3, y1: y0 + 31, z0: h },
          { x0: x1 - 10, y0: y0 + 35, x1: x1 - 3, y1: y0 + 46, z0: h },
        ]
      : null;
  return (
    <g className={styles.rise} style={style}>
      <polygon
        className={styles.wallFront}
        points={face([
          [x0, y1, 0],
          [x1, y1, 0],
          [x1, y1, h],
          [x0, y1, h],
        ])}
      />
      <polygon
        className={styles.wallRight}
        points={face([
          [x1, y0, 0],
          [x1, y1, 0],
          [x1, y1, h],
          [x1, y0, h],
        ])}
      />
      <polygon
        className={styles.roofTop}
        points={face([
          [x0, y0, h],
          [x1, y0, h],
          [x1, y1, h],
          [x0, y1, h],
        ])}
      />
      <polygon
        className={styles.parapet}
        points={face([
          [x0 + 0.8, y0 + 0.8, h],
          [x1 - 0.8, y0 + 0.8, h],
          [x1 - 0.8, y1 - 0.8, h],
          [x0 + 0.8, y1 - 0.8, h],
        ])}
      />
      {[d / 3, (2 * d) / 3].map((t) => {
        const [a, b] = pt(x0, y0 + t, h + 0.1);
        const [c, e] = pt(x1, y0 + t, h + 0.1);
        return <line key={t} className={styles.roofSeam} x1={a} y1={b} x2={c} y2={e} />;
      })}
      {[0.32, 0.55, 0.78].map((t) => (
        <polygon
          key={t}
          className={styles.skylight}
          points={face([
            [x0 + w * t - 2, y0 + 5, h + 0.15],
            [x0 + w * t + 2, y0 + 5, h + 0.15],
            [x0 + w * t + 2, y1 - 5, h + 0.15],
            [x0 + w * t - 2, y1 - 5, h + 0.15],
          ])}
        />
      ))}
      {roofUnits?.map((u, index) => (
        <Box
          key={index}
          x0={u.x0}
          y0={u.y0}
          x1={u.x1}
          y1={u.y1}
          h={1.8}
          z0={u.z0}
          className={styles.roofUnit}
        />
      ))}
      <text className={styles.blockLabel} x={lx} y={ly} textAnchor="middle">
        {id}
      </text>
      <text className={styles.blockMeta} x={lx} y={ly + 15} textAnchor="middle">
        {size}
      </text>
    </g>
  );
}

function Dock({
  bay,
  y,
  buildingY,
  style,
}: {
  bay: number;
  y: number;
  buildingY: number;
  style?: CSSProperties;
}) {
  return (
    <g className={styles.rise} style={style}>
      <polygon
        className={styles.dockDoor}
        points={face([
          [bay - 1.5, buildingY, 1],
          [bay + 1.5, buildingY, 1],
          [bay + 1.5, buildingY, 5.5],
          [bay - 1.5, buildingY, 5.5],
        ])}
      />
      <Box x0={bay - 3} y0={y} x1={bay + 3} y1={y + 6} h={1.2} className={styles.dock} />
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
  const trailer = { x0, y0, x1, y1, h: 3.6 };
  const cabBox =
    cab === "east" ? { x0: x1 - 3, y0, x1, y1, h: 3.2 } : { x0, y0, x1: x0 + 3, y1, h: 3.2 };
  return (
    <g className={cx(styles.rise, maroon && styles.truckMaroon)} style={style}>
      <Box {...trailer} className={styles.truckTrailer} />
      <Box {...cabBox} className={styles.truckCab} />
    </g>
  );
}

function Tree({ x, y, style }: { x: number; y: number; style?: CSSProperties }) {
  const [gx, gy] = pt(x, y, 0);
  const [tx, ty] = pt(x, y, 2);
  return (
    <g className={styles.rise} style={style}>
      <line className={styles.treeTrunk} x1={gx} y1={gy} x2={tx} y2={ty} />
      <ellipse className={styles.treeCanopy} cx={tx} cy={ty} rx={5} ry={3.8} />
      <ellipse className={styles.treeCanopyInner} cx={tx + 1.3} cy={ty - 1.5} rx={2.8} ry={2.2} />
    </g>
  );
}

function Pole({ x, y, style }: { x: number; y: number; style?: CSSProperties }) {
  const [bx, by] = pt(x, y, 0);
  const [tx, ty] = pt(x, y, 9);
  const [ax, ay] = pt(x - 1.6, y, 8.6);
  const [c, e] = pt(x + 1.6, y, 8.6);
  return (
    <g className={styles.rise} style={style}>
      <line className={styles.poleShaft} x1={bx} y1={by} x2={tx} y2={ty} />
      <line className={styles.poleArm} x1={ax} y1={ay} x2={c} y2={e} />
    </g>
  );
}

function WaterTank({ x, y, style }: { x: number; y: number; style?: CSSProperties }) {
  const corners: Array<[number, number]> = [
    [x, y],
    [x + 10, y],
    [x, y + 10],
    [x + 10, y + 10],
  ];
  return (
    <g className={styles.rise} style={style}>
      {corners.map(([cx, cy], index) => (
        <line
          key={index}
          className={styles.tankLeg}
          x1={pt(cx, cy, 0)[0]}
          y1={pt(cx, cy, 0)[1]}
          x2={pt(cx, cy, 8)[0]}
          y2={pt(cx, cy, 8)[1]}
        />
      ))}
      <polygon
        className={styles.tankCollar}
        points={face([
          [x, y, 8],
          [x + 10, y, 8],
          [x + 10, y + 10, 8],
          [x, y + 10, 8],
        ])}
      />
      <polygon
        className={styles.tankFront}
        points={face([
          [x, y + 10, 8],
          [x + 10, y + 10, 8],
          [x + 10, y + 10, 12],
          [x, y + 10, 12],
        ])}
      />
      <polygon
        className={styles.tankRight}
        points={face([
          [x + 10, y, 8],
          [x + 10, y + 10, 8],
          [x + 10, y + 10, 12],
          [x + 10, y, 12],
        ])}
      />
      <polygon
        className={styles.tankTop}
        points={face([
          [x, y, 12],
          [x + 10, y, 12],
          [x + 10, y + 10, 12],
          [x, y + 10, 12],
        ])}
      />
    </g>
  );
}

function Arrow({ x, y, dx, dy }: { x: number; y: number; dx: number; dy: number }) {
  const [ax, ay] = pt(x, y, 0.05);
  const [tx, ty] = pt(x + dx, y + dy, 0.05);
  const [w1x, w1y] = pt(x - dy * 0.55, y + dx * 0.55, 0.05);
  const [w2x, w2y] = pt(x + dy * 0.55, y - dx * 0.55, 0.05);
  return (
    <polyline className={styles.roadArrow} points={`${w1x},${w1y} ${tx},${ty} ${w2x},${w2y}`} />
  );
}

function Callout({
  fx,
  fy,
  lx,
  ly,
  label,
  anchor = "start",
  style,
}: {
  fx: number;
  fy: number;
  lx: number;
  ly: number;
  label: string;
  anchor?: "start" | "end" | "middle";
  style?: CSSProperties;
}) {
  return (
    <g className={styles.fade} style={style}>
      <line className={styles.calloutLine} x1={lx} y1={ly} x2={fx} y2={fy} />
      <circle className={styles.calloutDot} cx={fx} cy={fy} r={2.6} />
      <text className={styles.calloutText} x={lx} y={ly} textAnchor={anchor}>
        {label}
      </text>
    </g>
  );
}

export function WarehousePlate() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [aX, aY] = pt(0, 0);
  const [bX, bY] = pt(240, 0);
  const [cX, cY] = pt(240, 170);
  const [dX, dY] = pt(0, 170);
  const plot = face([
    [0, 0, 0],
    [240, 0, 0],
    [240, 170, 0],
    [0, 170, 0],
  ]);

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

      <span className={cx(styles.plateRef, styles.fade)} style={stagger(2)}>
        PL. 101 — Operating Verticals
      </span>
      <span className={cx(styles.figureRef, styles.fade)} style={stagger(3)}>
        Fig. 1.1
      </span>

      <svg className={styles.svg} viewBox="90 550 1430 1040" focusable="false" aria-hidden="true">
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
        </defs>

        {/* plot ground + boundary */}
        <polygon className={styles.plotGround} points={plot} />
        <polygon className={styles.plotHatch} points={plot} />
        <polyline
          className={styles.boundary}
          points={`${aX},${aY} ${bX},${bY} ${cX},${cY} ${dX},${dY} ${aX},${aY}`}
        />
        <line
          className={styles.gateMark}
          x1={pt(113, 170)[0]}
          y1={pt(113, 170)[1]}
          x2={pt(113, 163)[0]}
          y2={pt(113, 163)[1]}
        />
        <line
          className={styles.gateMark}
          x1={pt(127, 170)[0]}
          y1={pt(127, 170)[1]}
          x2={pt(127, 163)[0]}
          y2={pt(127, 163)[1]}
        />

        {/* roads */}
        <polygon
          className={styles.road}
          points={face([
            [12, 62, 0],
            [228, 62, 0],
            [228, 74, 0],
            [12, 74, 0],
          ])}
        />
        <polygon
          className={styles.road}
          points={face([
            [12, 148, 0],
            [228, 148, 0],
            [228, 160, 0],
            [12, 160, 0],
          ])}
        />
        <polygon
          className={styles.road}
          points={face([
            [12, 62, 0],
            [24, 62, 0],
            [24, 160, 0],
            [12, 160, 0],
          ])}
        />
        <polygon
          className={styles.road}
          points={face([
            [226, 62, 0],
            [238, 62, 0],
            [238, 160, 0],
            [226, 160, 0],
          ])}
        />
        <polygon
          className={styles.road}
          points={face([
            [113, 160, 0],
            [127, 160, 0],
            [127, 170, 0],
            [113, 170, 0],
          ])}
        />

        <line
          className={styles.roadEdge}
          x1={pt(12, 62)[0]}
          y1={pt(12, 62)[1]}
          x2={pt(228, 62)[0]}
          y2={pt(228, 62)[1]}
        />
        <line
          className={styles.roadEdge}
          x1={pt(12, 74)[0]}
          y1={pt(12, 74)[1]}
          x2={pt(228, 74)[0]}
          y2={pt(228, 74)[1]}
        />
        <line
          className={styles.centerline}
          x1={pt(14, 68)[0]}
          y1={pt(14, 68)[1]}
          x2={pt(226, 68)[0]}
          y2={pt(226, 68)[1]}
        />
        <line
          className={styles.centerline}
          x1={pt(14, 154)[0]}
          y1={pt(14, 154)[1]}
          x2={pt(226, 154)[0]}
          y2={pt(226, 154)[1]}
        />
        <line
          className={styles.centerline}
          x1={pt(18, 64)[0]}
          y1={pt(18, 64)[1]}
          x2={pt(18, 158)[0]}
          y2={pt(18, 158)[1]}
        />
        <line
          className={styles.centerline}
          x1={pt(232, 64)[0]}
          y1={pt(232, 64)[1]}
          x2={pt(232, 158)[0]}
          y2={pt(232, 158)[1]}
        />
        <line
          className={styles.centerline}
          x1={pt(120, 162)[0]}
          y1={pt(120, 162)[1]}
          x2={pt(120, 168)[0]}
          y2={pt(120, 168)[1]}
        />

        {/* direction arrows */}
        <Arrow x={120} y={68} dx={1} dy={0} />
        <Arrow x={140} y={68} dx={1} dy={0} />
        <Arrow x={200} y={68} dx={-1} dy={0} />
        <Arrow x={92} y={154} dx={1} dy={0} />
        <Arrow x={112} y={154} dx={1} dy={0} />
        <Arrow x={18} y={120} dx={0} dy={1} />
        <Arrow x={232} y={100} dx={0} dy={-1} />
        <Arrow x={120} y={166} dx={0} dy={1} />

        {/* utility poles + feeder */}
        {POLES.map((pole, index) => (
          <Pole key={`${pole.x}-${pole.y}`} x={pole.x} y={pole.y} style={stagger(11 + index)} />
        ))}
        {POLES.slice(0, -1).map((pole, index) => {
          const next = POLES[index + 1];
          return (
            <line
              key={`wire-${index}`}
              className={cx(styles.wire, styles.fade)}
              style={stagger(11)}
              x1={pt(pole.x, pole.y, 8.5)[0]}
              y1={pt(pole.x, pole.y, 8.5)[1]}
              x2={pt(next.x, next.y, 8.5)[0]}
              y2={pt(next.x, next.y, 8.5)[1]}
            />
          );
        })}

        {/* substation */}
        <Box
          x0={26}
          y0={4}
          x1={40}
          y1={14}
          h={6}
          className={cx(styles.substation, styles.rise)}
          style={stagger(4)}
        />

        {/* buildings far to near */}
        {BUILDINGS.map((b, index) => (
          <Block key={b.id} {...b} style={stagger(5 + index)} />
        ))}

        {/* dock plates + doors */}
        {DOCK_BAYS_NORTH.map((bay, index) => (
          <Dock key={`n-${bay}`} bay={bay} y={62} buildingY={62} style={stagger(8 + index)} />
        ))}
        {DOCK_BAYS_SOUTH.map((bay, index) => (
          <Dock key={`s-${bay}`} bay={bay} y={142} buildingY={142} style={stagger(9 + index)} />
        ))}

        {/* trucks */}
        {TRUCKS.map((t, index) => (
          <Truck key={index} {...t} style={stagger(10 + index)} />
        ))}

        {/* gatehouse + staff parking */}
        <Box
          x0={128}
          y0={162}
          x1={136}
          y1={170}
          h={4}
          className={cx(styles.gatehouse, styles.rise)}
          style={stagger(15)}
        />
        {[146, 158, 170, 182, 194, 206, 218].map((x, index) => (
          <Box
            key={x}
            x0={x}
            y0={162}
            x1={x + 7}
            y1={168}
            h={1.6}
            className={cx(index % 2 ? styles.carB : styles.carA, styles.rise)}
            style={stagger(16 + index)}
          />
        ))}

        {/* water tank */}
        <WaterTank x={0} y={148} style={stagger(17)} />

        {/* trees */}
        {TREES.map((t, index) => (
          <Tree key={index} x={t.x} y={t.y} style={stagger(18 + index)} />
        ))}

        {/* dimension lines */}
        <line
          className={cx(styles.dimLine, styles.fade)}
          style={stagger(20)}
          x1={aX}
          y1={aY}
          x2={645}
          y2={688}
        />
        <line
          className={cx(styles.dimLine, styles.fade)}
          style={stagger(20)}
          x1={bX}
          y1={bY}
          x2={1420}
          y2={1136}
        />
        <line
          className={cx(styles.dimBar, styles.fade)}
          style={stagger(21)}
          x1={645}
          y1={688}
          x2={1310}
          y2={1072}
        />
        <line
          className={cx(styles.dimBar, styles.fade)}
          style={stagger(22)}
          x1={1420}
          y1={1136}
          x2={949}
          y2={1408}
        />
        <text
          className={cx(styles.dimText, styles.fade)}
          style={stagger(21)}
          x={977}
          y={868}
          textAnchor="middle"
          transform="rotate(30 977 868)"
        >
          240.00 M
        </text>
        <text
          className={cx(styles.dimText, styles.fade)}
          style={stagger(22)}
          x={1184}
          y={1292}
          textAnchor="middle"
          transform="rotate(-30 1184 1292)"
        >
          160.00 M
        </text>
        <line
          className={cx(styles.dimBar, styles.fade)}
          style={stagger(23)}
          x1={553}
          y1={1166}
          x2={592}
          y2={1189}
        />
        <text
          className={cx(styles.dimText, styles.fade)}
          style={stagger(23)}
          x={572}
          y={1190}
          textAnchor="middle"
          transform="rotate(30 572 1190)"
        >
          ROAD 14.0 M
        </text>

        {/* callouts */}
        <Callout
          fx={683}
          fy={922}
          lx={150}
          ly={970}
          label="LOADING DOCKS — 5 NOS"
          style={stagger(22)}
        />
        <Callout
          fx={900}
          fy={1085}
          lx={1440}
          ly={1100}
          label="TRUCK CIRCULATION — ONE-WAY"
          anchor="end"
          style={stagger(23)}
        />
        <Callout
          fx={1146}
          fy={1095}
          lx={1450}
          ly={930}
          label="ROOF PLANT — HVAC &amp; CHW"
          anchor="end"
          style={stagger(24)}
        />
        <Callout
          fx={390}
          fy={921}
          lx={120}
          ly={900}
          label="SUBSTATION — 33 / 11 KV"
          style={stagger(25)}
        />
        <Callout fx={789} fy={781} lx={240} ly={640} label="11 KV FEEDER" style={stagger(26)} />
        <Callout
          fx={290}
          fy={934}
          lx={90}
          ly={1150}
          label="ELEVATED WATER TANK — 250 KL"
          style={stagger(27)}
        />
        <Callout
          fx={742}
          fy={1272}
          lx={520}
          ly={1540}
          label="STAFF PARKING — 24 BAYS"
          style={stagger(28)}
        />
        <Callout
          fx={606}
          fy={1184}
          lx={360}
          ly={1280}
          label="SECURITY GATEHOUSE — GATE B"
          style={stagger(29)}
        />

        {/* north arrow + scale bar */}
        <g className={styles.fade} style={stagger(25)} transform="translate(170 1490) rotate(-30)">
          <circle className={styles.northCircle} cx="0" cy="0" r="26" />
          <line className={styles.northNeedle} x1="0" y1="9" x2="0" y2="-13" />
          <polygon className={styles.northNeedle} points="0,-21 5,-12 -5,-12" />
          <text className={styles.northText} x="0" y="-33" textAnchor="middle">
            N
          </text>
        </g>

        <g className={styles.fade} style={stagger(27)} transform="translate(1240 1500)">
          <line className={styles.scaleBar} x1="0" y1="0" x2="208" y2="0" />
          {[0, 69.3, 138.6, 208].map((x, index) => (
            <line
              key={x}
              className={styles.scaleTick}
              x1={x}
              y1="0"
              x2={x}
              y2={index % 2 ? 5 : 8}
            />
          ))}
          <text className={styles.scaleText} x="0" y="18" textAnchor="middle">
            0
          </text>
          <text className={styles.scaleText} x="69.3" y="18" textAnchor="middle">
            25
          </text>
          <text className={styles.scaleText} x="138.6" y="18" textAnchor="middle">
            50
          </text>
          <text className={styles.scaleText} x="216" y="18" textAnchor="middle">
            m
          </text>
          <text className={styles.scaleText} x="0" y="-14">
            SCALE · 1 : 2000 @ A0
          </text>
        </g>
      </svg>

      <span className={cx(styles.captionLine, styles.fade)} style={stagger(4)}>
        NDR Logistics Campus · Site &amp; grading plan
      </span>
      <span className={cx(styles.notToScale, styles.fade)} style={stagger(5)}>
        DWG NDR-OP-101-A · Rev A · not to scale
      </span>
    </div>
  );
}
