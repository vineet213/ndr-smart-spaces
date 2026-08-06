"use client";

import { useInView } from "@/hooks/useInView";
import styles from "./CapitalCycle.module.css";
import { cx } from "../ui/cx";

const nodes = [
  {
    name: "Develop",
    caption: "Identification, planning and design",
    cx: 200,
    cy: 60,
    textX: 200,
    textY: 88,
    anchor: "middle",
  },
  {
    name: "Stabilize",
    caption: "Operations, leasing, occupancy",
    cx: 340,
    cy: 200,
    textX: 312,
    textY: 196,
    anchor: "end",
  },
  {
    name: "Offer to NDR InvIT",
    caption: "First offer on eligible assets",
    cx: 200,
    cy: 340,
    textX: 200,
    textY: 312,
    anchor: "middle",
  },
  {
    name: "Recycle capital",
    caption: "Back into new development",
    cx: 60,
    cy: 200,
    textX: 88,
    textY: 196,
    anchor: "start",
  },
] as const;

const arcs = [
  "M200,60 A140,140 0 0 1 340,200",
  "M340,200 A140,140 0 0 1 200,340",
  "M200,340 A140,140 0 0 1 60,200",
  "M60,200 A140,140 0 0 1 200,60",
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
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-maroon)" />
          </marker>
        </defs>
        <circle className={styles.guide} cx="200" cy="200" r="140" />
        {arcs.map((d) => (
          <path
            key={d}
            className={styles.arc}
            d={d}
            pathLength={100}
            markerEnd="url(#cycle-arrow)"
          />
        ))}
        {nodes.map((node) => (
          <g key={node.name}>
            <circle className={styles.node} cx={node.cx} cy={node.cy} r="12" />
            <text className={styles.name} x={node.textX} y={node.textY} textAnchor={node.anchor}>
              {node.name}
            </text>
            <text
              className={styles.caption}
              x={node.textX}
              y={node.textY + 18}
              textAnchor={node.anchor}
            >
              {node.caption}
            </text>
          </g>
        ))}
      </svg>

      <ol className={styles.stepper}>
        {nodes.map((node) => (
          <li key={node.name} className={styles.step}>
            <span className={styles.stepMarker} aria-hidden="true" />
            <span className={styles.stepContent}>
              <span className={styles.stepName}>{node.name}</span>
              <span className={styles.stepCaption}>{node.caption}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
