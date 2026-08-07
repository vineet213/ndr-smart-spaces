"use client";

import { useInView } from "@/hooks/useInView";
import styles from "./CapitalCycle.module.css";
import { cx } from "../ui/cx";

type CycleNode = {
  index: string;
  name: string;
  caption: [string, string];
  cx: number;
  cy: number;
  nameX: number;
  nameY: number;
  cap1Y: number;
  cap2Y: number;
  leader: string;
};

const CENTER = 200;
const RING_R = 118;
const NODE_R = 18;
const MEDALLION_R = 68;
const ARC_START_INSET = 3;
const ARC_END_INSET = 12;
const GEOMETRY_PRECISION = 2;

// Geometry entering SVG serialization must be byte-identical between the
// server prerender and the browser; fmt absorbs floating-point drift in trig.
const fmt = (n: number) => Number(n.toFixed(GEOMETRY_PRECISION));

function radians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function point(degrees: number, radius: number) {
  return {
    x: fmt(CENTER + radius * Math.cos(radians(degrees))),
    y: fmt(CENTER + radius * Math.sin(radians(degrees))),
  };
}

const NODE_ANGLES = [225, 315, 45, 135] as const;

const nodeDefs = [
  { index: "01", name: "Develop", caption: ["Identification, planning", "and design"] },
  { index: "02", name: "Stabilize", caption: ["Operations, leasing,", "occupancy"] },
  { index: "03", name: "Offer to NDR InvIT", caption: ["First offer on", "eligible assets"] },
  { index: "04", name: "Recycle capital", caption: ["Back into new", "development"] },
] as const;

const LABEL_TOP = { nameY: 38, cap1Y: 60, cap2Y: 76, leaderY: 57 };
const LABEL_BOTTOM = { nameY: 324, cap1Y: 346, cap2Y: 362, leaderY: 343 };

const nodes: CycleNode[] = NODE_ANGLES.map((angle, index) => {
  const { x, y } = point(angle, RING_R);
  const isLeft = angle === 225 || angle === 135;
  const label = angle === 225 || angle === 315 ? LABEL_TOP : LABEL_BOTTOM;
  const nameX = isLeft ? 78 : 322;
  return {
    index: nodeDefs[index].index,
    name: nodeDefs[index].name,
    caption: [nodeDefs[index].caption[0], nodeDefs[index].caption[1]],
    cx: x,
    cy: y,
    nameX,
    nameY: label.nameY,
    cap1Y: label.cap1Y,
    cap2Y: label.cap2Y,
    leader: `M ${x} ${y} L ${nameX} ${label.leaderY}`,
  };
});

const arcs = NODE_ANGLES.map((angle, index) => {
  const start = point(angle + ARC_START_INSET, RING_R);
  const next = NODE_ANGLES[(index + 1) % NODE_ANGLES.length];
  const endAngle = next < angle ? next + 360 - ARC_END_INSET : next - ARC_END_INSET;
  const end = point(endAngle, RING_R);
  return `M ${start.x} ${start.y} A ${RING_R} ${RING_R} 0 0 1 ${end.x} ${end.y}`;
});

export function CapitalCycle() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });

  return (
    <div ref={ref} className={cx(styles.cycle, inView && styles.drawn)}>
      <svg viewBox="0 0 400 400" className={styles.svg} focusable="false" aria-hidden="true">
        <defs>
          <marker
            id="cycle-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-maroon)" />
          </marker>
        </defs>

        <circle className={styles.guide} cx={CENTER} cy={CENTER} r={RING_R} />

        {arcs.map((d, index) => (
          <path
            key={d}
            className={styles.arc}
            d={d}
            pathLength={100}
            markerEnd="url(#cycle-arrow)"
          />
        ))}

        {nodes.map((node) => (
          <g key={node.name} className={styles.group}>
            <path className={styles.leader} d={node.leader} />
            <circle className={styles.nodeCircle} cx={node.cx} cy={node.cy} r={NODE_R} />
            <text className={styles.nodeNum} x={node.cx} y={node.cy + 5} textAnchor="middle">
              {node.index}
            </text>
            <text className={styles.name} x={node.nameX} y={node.nameY} textAnchor="middle">
              {node.name}
            </text>
            <text className={styles.caption} x={node.nameX} y={node.cap1Y} textAnchor="middle">
              {node.caption[0]}
            </text>
            <text className={styles.caption} x={node.nameX} y={node.cap2Y} textAnchor="middle">
              {node.caption[1]}
            </text>
          </g>
        ))}

        <g>
          <circle className={styles.medallionDisc} cx={CENTER} cy={CENTER} r={MEDALLION_R} />
          <circle className={styles.medallionRing} cx={CENTER} cy={CENTER} r={MEDALLION_R} />
          <text className={styles.rofo} x={CENTER} y={199} textAnchor="middle">
            ROFO
          </text>
          <text className={styles.rofoSub} x={CENTER} y={219} textAnchor="middle">
            Right of First Offer
          </text>
        </g>
      </svg>

      <ol className={styles.stepper}>
        {nodes.map((node) => (
          <li key={node.name} className={styles.step}>
            <span className={styles.stepMarker} aria-hidden="true">
              {node.index}
            </span>
            <span className={styles.stepContent}>
              <span className={styles.stepName}>{node.name}</span>
              <span className={styles.stepCaption}>{node.caption.join(" ")}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
