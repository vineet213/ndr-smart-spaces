"use client";

import { useState, type CSSProperties } from "react";
import { Container } from "@/components/layout";
import { useInView } from "@/hooks/useInView";
import { whyAnatomy } from "@/lib/data/whyNdrPage";
import { cx } from "../ui/cx";
import { SheetHeader } from "./SheetHeader";
import styles from "./WhyParkAnatomy.module.css";

/* Drawing geometry, in the 1000 × 520 viewBox. */
const GROUND = 430;
const EAVE = 200;
const RIDGE_X = 495;
const RIDGE_Y = 120;
const WALL_L = 170;
const WALL_R = 820;

/* Height of the roof line above a point on the left or right slope. */
const roofY = (x: number) =>
  x <= RIDGE_X
    ? EAVE - ((x - WALL_L) * (EAVE - RIDGE_Y)) / (RIDGE_X - WALL_L)
    : RIDGE_Y + ((x - RIDGE_X) * (EAVE - RIDGE_Y)) / (WALL_R - RIDGE_X);

const r = (n: number) => Number(n.toFixed(1));

/* Solar modules sit just proud of the left slope. */
const solarPanels = [232, 270, 308, 346, 384].map((x) => {
  const x2 = x + 30;
  return `M ${x} ${r(roofY(x) - 7)} L ${x2} ${r(roofY(x2) - 7)}`;
});

/* Precast wall panels: one joint every 46 units up both walls. */
const panelJoints = [246, 292, 338, 384].map((y) => ({ y }));

/* Louvres in the right wall's upper band. */
const louvres = [228, 240, 252, 264, 276, 288].map(
  (y) => `M ${WALL_R - 12} ${y} L ${WALL_R + 4} ${y + 8}`,
);

/* Pallet racking inside the shed. */
const racks = [250, 320, 390, 600, 670, 740];
const shelves = [270, 310, 350, 390];

/* Ventilation slats in the roof monitor. */
const monitorSlats = [462, 474, 486, 498, 510, 522, 534];

const monitorBaseL = r(roofY(450));
const monitorBaseR = r(roofY(540));

/**
 * "Inside an NDR park": a section cut through a warehouse with each green
 * feature from the ESG page marked on it. The linework draws in when the
 * drawing scrolls into view; hovering a marker or a legend entry lights its
 * partner. With reduced motion the drawing is shown complete.
 */
export function WhyParkAnatomy() {
  const { features } = whyAnatomy;
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className={styles.section} id="anatomy" aria-labelledby="anatomy-title">
      <Container>
        <SheetHeader
          sheet="04"
          of="06"
          eyebrow={whyAnatomy.eyebrow}
          heading={whyAnatomy.heading}
          headingId="anatomy-title"
          lede={whyAnatomy.lede}
        />

        <div ref={ref} className={cx(styles.figure, inView && styles.drawn)}>
          <div className={styles.titleBlock} aria-hidden="true">
            <span>Section A–A</span>
            <span>Typical NDR warehouse</span>
            <span>Not to scale</span>
          </div>

          <svg
            viewBox="0 0 1000 520"
            className={styles.svg}
            role="img"
            aria-label="Section drawing of an NDR warehouse park marking nine sustainability features, listed below."
          >
            <defs>
              <pattern
                id="anatomy-soil"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="12" className={styles.hatch} />
              </pattern>
            </defs>

            {/* ground and soil */}
            <rect x="0" y={GROUND} width="1000" height="90" fill="url(#anatomy-soil)" />
            <path
              className={cx(styles.stroke, styles.heavy)}
              d={`M 0 ${GROUND} H 1000`}
              pathLength={1}
            />

            {/* shed: precast walls, pitched roof */}
            <path
              className={cx(styles.stroke, styles.heavy)}
              d={`M ${WALL_L} ${GROUND} V ${EAVE} L ${RIDGE_X} ${RIDGE_Y} L ${WALL_R} ${EAVE} V ${GROUND}`}
              pathLength={1}
            />
            <path
              className={styles.stroke}
              d={`M ${WALL_L + 12} ${GROUND} V ${EAVE + 4} M ${WALL_R - 12} ${GROUND} V ${EAVE + 4}`}
              pathLength={1}
            />
            {panelJoints.map(({ y }) => (
              <path
                key={y}
                className={styles.fine}
                d={`M ${WALL_L} ${y} h 12 M ${WALL_R - 12} ${y} h 12`}
              />
            ))}

            {/* roof monitor at the ridge */}
            <path
              className={styles.stroke}
              d={`M 450 ${monitorBaseL} V 100 H 540 V ${monitorBaseR}`}
              pathLength={1}
            />
            {monitorSlats.map((x) => (
              <path key={x} className={styles.fine} d={`M ${x} 104 V 118`} />
            ))}

            {/* rooftop solar on the left slope */}
            {solarPanels.map((d) => (
              <path key={d} className={styles.solar} d={d} pathLength={1} />
            ))}

            {/* cool-roof coating along the right slope */}
            <path
              className={styles.coating}
              d={`M 560 ${r(roofY(560) + 5)} L 800 ${r(roofY(800) + 5)}`}
              pathLength={1}
            />

            {/* louvres high on the right wall */}
            {louvres.map((d) => (
              <path key={d} className={styles.fine} d={d} />
            ))}

            {/* racking inside */}
            {racks.map((x) => (
              <g key={x}>
                <path
                  className={styles.fine}
                  d={`M ${x} ${GROUND} V 250 M ${x + 44} ${GROUND} V 250`}
                />
                {shelves.map((y) => (
                  <path key={y} className={styles.fine} d={`M ${x} ${y} H ${x + 44}`} />
                ))}
              </g>
            ))}

            {/* dock opening, EV charger and a truck in the yard */}
            <path
              className={styles.stroke}
              d={`M ${WALL_R} 360 H ${WALL_R + 14} V ${GROUND}`}
              pathLength={1}
            />
            <path
              className={styles.stroke}
              d="M 842 430 V 382 H 856 V 430 M 846 392 H 852"
              pathLength={1}
            />
            <path
              className={styles.stroke}
              d="M 872 418 V 340 H 962 V 418 Z M 962 364 H 990 L 996 384 V 418 H 962"
              pathLength={1}
            />
            <circle className={styles.stroke} cx="892" cy="422" r="8" pathLength={1} />
            <circle className={styles.stroke} cx="978" cy="422" r="8" pathLength={1} />

            {/* trees */}
            <circle className={styles.green} cx="45" cy="372" r="28" pathLength={1} />
            <path className={styles.stroke} d="M 45 400 V 430" pathLength={1} />
            <circle className={styles.green} cx="112" cy="390" r="20" pathLength={1} />
            <path className={styles.stroke} d="M 112 410 V 430" pathLength={1} />

            {/* rainwater: gutter, downpipe and recharge pit */}
            <path
              className={styles.water}
              d={`M ${WALL_L - 2} ${EAVE} H ${WALL_L - 6} V ${GROUND + 12} H 160`}
              pathLength={1}
            />
            <path className={styles.stroke} d="M 104 446 H 160 V 496 H 104 Z" pathLength={1} />
            <path
              className={styles.water}
              d="M 110 470 q 6 -5 12 0 t 12 0 t 12 0 t 12 0"
              pathLength={1}
            />

            {/* STP below the yard */}
            <path
              className={styles.stroke}
              d="M 640 448 H 740 V 498 H 640 Z M 690 448 V 498"
              pathLength={1}
            />
            <path className={styles.water} d={`M 690 ${GROUND} V 448`} pathLength={1} />

            {/* markers */}
            {features.map((feature, index) => (
              <g
                key={feature.index}
                className={cx(styles.marker, hovered === feature.index && styles.markerActive)}
                style={{ "--i": index } as CSSProperties}
                transform={`translate(${feature.x} ${feature.y})`}
                onMouseEnter={() => setHovered(feature.index)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle className={styles.markerHalo} r="20" />
                <circle className={styles.markerDot} r="14" />
                <text className={styles.markerText} y="4.5" textAnchor="middle">
                  {feature.index}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <ol className={styles.legend}>
          {features.map((feature) => (
            <li
              key={feature.index}
              className={cx(styles.item, hovered === feature.index && styles.itemActive)}
              onMouseEnter={() => setHovered(feature.index)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className={styles.itemIndex} aria-hidden="true">
                {feature.index}
              </span>
              <span className={styles.itemText}>
                <span className={styles.itemTitle}>{feature.title}</span>{" "}
                <span className={styles.itemBody}>{feature.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
