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

const nodes: CycleNode[] = [
  {
    index: "01",
    name: "Develop",
    caption: ["Identification, planning", "and design"],
    cx: 116.6,
    cy: 116.6,
    nameX: 78,
    nameY: 38,
    cap1Y: 66,
    cap2Y: 84,
    leader: "M116.6,116.6 L78,52",
  },
  {
    index: "02",
    name: "Stabilize",
    caption: ["Operations, leasing,", "occupancy"],
    cx: 283.4,
    cy: 116.6,
    nameX: 322,
    nameY: 38,
    cap1Y: 66,
    cap2Y: 84,
    leader: "M283.4,116.6 L322,52",
  },
  {
    index: "03",
    name: "Offer to NDR InvIT",
    caption: ["First offer on", "eligible assets"],
    cx: 283.4,
    cy: 283.4,
    nameX: 322,
    nameY: 330,
    cap1Y: 358,
    cap2Y: 376,
    leader: "M283.4,283.4 L322,344",
  },
  {
    index: "04",
    name: "Recycle capital",
    caption: ["Back into new", "development"],
    cx: 116.6,
    cy: 283.4,
    nameX: 78,
    nameY: 330,
    cap1Y: 358,
    cap2Y: 376,
    leader: "M116.6,283.4 L78,344",
  },
];

const arcs = [
  "M116.6,116.6 A118,118 0 0 1 283.4,116.6",
  "M283.4,116.6 A118,118 0 0 1 283.4,283.4",
  "M283.4,283.4 A118,118 0 0 1 116.6,283.4",
  "M116.6,283.4 A118,118 0 0 1 116.6,116.6",
] as const;

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

        <circle className={styles.guide} cx="200" cy="200" r="118" />

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
            <circle className={styles.nodeCircle} cx={node.cx} cy={node.cy} r="17" />
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
          <circle className={styles.medallionDisc} cx="200" cy="200" r="60" />
          <circle className={styles.medallionRing} cx="200" cy="200" r="60" />
          <text className={styles.rofo} x="200" y="196" textAnchor="middle">
            ROFO
          </text>
          <text className={styles.rofoSub} x="200" y="216" textAnchor="middle">
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
