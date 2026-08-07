"use client";

import { useId, useState } from "react";
import type { CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./LifecycleDiagram.module.css";

export type LifecycleNode = {
  index: string;
  name: string;
  caption: string;
};

type LifecycleDiagramProps = {
  nodes: readonly LifecycleNode[];
  returnLabel: string;
  returnCaption: string;
  className?: string;
};

const CENTER = 460;
const RING = 320;
const TICK_TOP = 318;
const TICK_BOTTOM = 290;
const NUM_R = 264;
const INNER_R = 244;
const NAME_R = 380;
const RETURN_R = 292;
const RETURN_TEXT_R = 302;
const SEAL_R = 168;
const SEAL_INNER_R = 152;
const STEP = 45;
const GEOMETRY_PRECISION = 3;

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

const angleAt = (index: number) => -90 + index * STEP;

function tickLine(degrees: number, r1: number, r2: number) {
  const a = point(degrees, r1);
  const b = point(degrees, r2);
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

function connectorPath(index: number) {
  const s = point(angleAt(index), RING);
  const e = point(angleAt(index + 1), RING);
  return `M ${s.x} ${s.y} A ${RING} ${RING} 0 0 1 ${e.x} ${e.y}`;
}

const SEAL_TICKS = Array.from({ length: 24 }, (_, k) => k * 15);
const SEAL_NODE_TICKS = Array.from({ length: 8 }, (_, k) => k * STEP);

export function LifecycleDiagram({
  nodes,
  returnLabel,
  returnCaption,
  className,
}: LifecycleDiagramProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [active, setActive] = useState<number | null>(null);
  const titleId = useId();
  const returnLabelId = useId();

  const returnStart = point(angleAt(nodes.length - 1), RETURN_R);
  const returnEnd = point(angleAt(0), RETURN_R);
  const returnPathD = `M ${returnStart.x} ${returnStart.y} A ${RETURN_R} ${RETURN_R} 0 0 1 ${returnEnd.x} ${returnEnd.y}`;

  const returnLabelStart = point(angleAt(nodes.length - 1) + 1, RETURN_TEXT_R);
  const returnLabelEnd = point(angleAt(0) - 1, RETURN_TEXT_R);
  const returnLabelPathD = `M ${returnLabelStart.x} ${returnLabelStart.y} A ${RETURN_TEXT_R} ${RETURN_TEXT_R} 0 0 1 ${returnLabelEnd.x} ${returnLabelEnd.y}`;

  const chevronAngle = angleAt(nodes.length - 1) + STEP / 2;
  const chevronMid = point(chevronAngle, RETURN_R);
  const chevronRotation = fmt(
    (Math.atan2(Math.cos(radians(chevronAngle)), -Math.sin(radians(chevronAngle))) * 180) / Math.PI,
  );

  const returnActive = active === nodes.length - 1 || active === 0;

  return (
    <div
      ref={ref}
      className={cx(
        styles.root,
        className,
        inView && styles.drawn,
        active !== null && styles.recede,
      )}
    >
      <div className={styles.diagramWrap}>
        <svg viewBox="0 0 920 920" className={styles.svg} role="img" aria-labelledby={titleId}>
          <title id={titleId}>
            The complete asset lifecycle — land, planning, development, industrial infrastructure,
            warehousing, asset management, NDR InvIT, capital recycling, and back to land.
          </title>
          <desc>
            {nodes.map((node) => `${node.name}: ${node.caption}`).join(". ")} Then {returnLabel},{" "}
            {returnCaption}
          </desc>

          <g className={styles.rings}>
            <circle cx={CENTER} cy={CENTER} r={RING} pathLength={1} className={styles.ring} />
            <circle cx={CENTER} cy={CENTER} r={INNER_R} className={styles.innerRing} />
          </g>

          <g className={styles.connectors}>
            {nodes.slice(0, -1).map((node, index) => (
              <path
                key={node.name}
                d={connectorPath(index)}
                className={cx(
                  styles.connector,
                  (active === index || active === index + 1) && styles.connectorOn,
                )}
              />
            ))}
            <path
              d={returnPathD}
              className={cx(styles.returnPath, returnActive && styles.returnPathOn)}
            />
            <path
              d={tickLine(angleAt(nodes.length - 1), RETURN_R - 6, RETURN_R + 6)}
              className={cx(styles.returnTick, returnActive && styles.returnTickOn)}
            />
            <path
              d={tickLine(angleAt(0), RETURN_R - 6, RETURN_R + 6)}
              className={cx(styles.returnTick, returnActive && styles.returnTickOn)}
            />
            <g transform={`translate(${chevronMid.x} ${chevronMid.y}) rotate(${chevronRotation})`}>
              <path d="M -9 -7 L 0 0 L -9 7" className={styles.returnChevron} />
            </g>
            <path id={returnLabelId} d={returnLabelPathD} fill="none" stroke="none" />
            <text className={cx(styles.returnLabelText, returnActive && styles.returnLabelOn)}>
              <textPath href={`#${returnLabelId}`} startOffset="50%" textAnchor="middle">
                {returnLabel}
              </textPath>
            </text>
          </g>

          <g className={styles.seal}>
            <circle cx={CENTER} cy={CENTER} r={SEAL_R} className={styles.sealOuter} />
            <circle cx={CENTER} cy={CENTER} r={SEAL_INNER_R} className={styles.sealInner} />
            {SEAL_TICKS.map((deg) => (
              <path
                key={deg}
                d={tickLine(deg, SEAL_R - 18, SEAL_R - 2)}
                className={styles.sealTick}
              />
            ))}
            {SEAL_NODE_TICKS.map((deg) => (
              <path
                key={`node-${deg}`}
                d={tickLine(deg, SEAL_R - 24, SEAL_R - 2)}
                className={styles.sealTickNode}
              />
            ))}
            <g transform={`translate(${CENTER} ${CENTER - 30})`}>
              <rect
                x={-9}
                y={-9}
                width={18}
                height={18}
                transform="rotate(45)"
                className={styles.centerMark}
              />
            </g>
            <text
              x={CENTER}
              y={CENTER}
              textAnchor="middle"
              dominantBaseline="central"
              className={styles.centerWord}
            >
              NDR
            </text>
            <line
              x1={CENTER - 20}
              y1={CENTER + 26}
              x2={CENTER + 20}
              y2={CENTER + 26}
              className={styles.centerRule}
            />
            <text
              x={CENTER}
              y={CENTER + 48}
              textAnchor="middle"
              dominantBaseline="central"
              className={styles.centerLabel}
            >
              Complete asset lifecycle
            </text>
          </g>

          <g>
            {nodes.map((node, index) => {
              const mark = point(angleAt(index), RING);
              const number = point(angleAt(index), NUM_R);
              const name = point(angleAt(index), NAME_R);
              const isActive = active === index;
              const delay = `${120 + index * 60}ms`;
              return (
                <g
                  key={node.name}
                  className={cx(styles.nodeGroup, isActive && styles.nodeActive)}
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                >
                  <g
                    className={styles.nodeEnter}
                    style={{ "--node-delay": delay } as CSSProperties}
                  >
                    <circle cx={mark.x} cy={mark.y} r={26} className={styles.hit} />
                    <circle
                      cx={mark.x}
                      cy={mark.y}
                      r={17}
                      className={cx(styles.nodeHalo, isActive && styles.nodeHaloOn)}
                    />
                    <g transform={`translate(${mark.x} ${mark.y})`}>
                      <rect
                        x={-6}
                        y={-6}
                        width={12}
                        height={12}
                        transform="rotate(45)"
                        className={styles.nodeMark}
                      />
                    </g>
                    <path
                      d={tickLine(angleAt(index), TICK_BOTTOM, TICK_TOP)}
                      className={cx(styles.nodeTick, isActive && styles.nodeTickOn)}
                    />
                    <text
                      x={number.x}
                      y={number.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={cx(styles.nodeNum, isActive && styles.nodeNumActive)}
                    >
                      {node.index}
                    </text>
                    <text
                      x={name.x}
                      y={name.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={cx(styles.nodeName, isActive && styles.nodeNameActive)}
                    >
                      {node.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <ol className={styles.legend}>
        {nodes.map((node, index) => (
          <li key={node.name}>
            <button
              type="button"
              className={styles.cell}
              aria-pressed={active === index}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
            >
              <span className={styles.stepIndex}>{node.index}</span>
              <span className={styles.stepName}>{node.name}</span>
              <span className={styles.stepCaption}>{node.caption}</span>
            </button>
          </li>
        ))}
        <li className={styles.legendReturn}>
          <span className={styles.returnArrow} aria-hidden="true">
            ↺
          </span>
          <div className={styles.returnBody}>
            <span className={styles.returnLabel}>{returnLabel}</span>
            <span className={styles.returnCaption}>{returnCaption}</span>
          </div>
        </li>
      </ol>

      <ol className={styles.chain}>
        {nodes.map((node) => (
          <li key={node.name} className={styles.chainRow}>
            <span className={styles.chainMark} aria-hidden="true" />
            <div className={styles.chainBody}>
              <span className={styles.chainHeading}>
                <span className={styles.chainIndex}>{node.index}</span>
                <span className={styles.chainName}>{node.name}</span>
              </span>
              <span className={styles.chainCaption}>{node.caption}</span>
            </div>
          </li>
        ))}
        <li className={cx(styles.chainRow, styles.chainReturn)}>
          <span className={styles.chainMark} aria-hidden="true" />
          <div className={styles.chainBody}>
            <span className={styles.returnLabel}>{returnLabel}</span>
            <span className={styles.returnCaption}>{returnCaption}</span>
          </div>
        </li>
      </ol>
    </div>
  );
}
