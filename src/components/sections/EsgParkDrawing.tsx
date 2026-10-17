import type { CSSProperties } from "react";
import { cx } from "../ui/cx";
import styles from "./EsgGreenFeatures.module.css";

/* A line elevation of a warehouse park, drawn in a 1000 x 480 box: planting on */
/* the left, the main warehouse and a second bay, a rainwater tank, EV chargers */
/* and an STP chamber below ground. Six feature groups sit on top of the base   */
/* drawing and light up in order (data-step 0 to 5), accumulating as the reader */
/* scrolls, so by the end the whole park is lit.                                 */

const unit = { pathLength: 1 } as const;

type FeatureProps = { step: number; active: number; children: React.ReactNode };

function Feature({ step, active, children }: FeatureProps) {
  return (
    <g
      className={cx(
        styles.feature,
        step <= active && styles.featureLit,
        step === active && styles.featureCurrent,
      )}
      style={{ "--step": step } as CSSProperties}
    >
      {children}
    </g>
  );
}

/* Where the "you are here" pin sits for each feature. */
const PINS = [
  { x: 440, y: 150 }, // solar on the roof
  { x: 740, y: 312 }, // rainwater tank
  { x: 838, y: 352 }, // EV chargers
  { x: 75, y: 296 }, // planting
  { x: 610, y: 452 }, // STP below ground
  { x: 240, y: 214 }, // roof monitor and louvres
] as const;

export function EsgParkDrawing({ active }: { active: number }) {
  const pin = PINS[Math.max(0, Math.min(active, PINS.length - 1))];

  return (
    <svg
      className={styles.drawing}
      viewBox="0 70 1000 410"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* ── base drawing: always visible, quiet ─────────────────────────── */}
      <g className={styles.base}>
        <path d="M10 420 H990" />
        {/* main warehouse */}
        <path d="M150 420 V235 L340 165 L530 235 V420" />
        <path d="M150 235 H530" />
        <path d="M180 420 V345 H232 V420 M262 420 V345 H314 V420 M344 420 V345 H396 V420 M426 420 V345 H478 V420" />
        {/* second bay */}
        <path d="M530 420 V285 L610 255 L690 285 V420 M530 285 H690" />
        <path d="M560 420 V360 H600 V420 M620 420 V360 H660 V420" />
        {/* tank and its stand */}
        <path d="M710 420 V330 H770 V420" />
        {/* yard and road markings */}
        <path d="M790 420 H990" className={styles.baseFaint} />
        <path d="M150 432 H690" className={styles.baseFaint} strokeDasharray="6 10" />
        {/* survey ticks along the ground */}
        <path d="M10 414 V426 M990 414 V426" />
      </g>

      {/* ── 01 solar: panel strip along the right roof slope ────────────── */}
      <Feature step={0} active={active}>
        <path {...unit} d="M352 158 L520 220 L516 230 L348 168 Z" />
        <path
          {...unit}
          d="M380 168 L377 178 M408 179 L405 189 M436 189 L433 199 M464 199 L461 209 M492 210 L489 220"
        />
        <path {...unit} d="M470 112 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0" />
        <path
          {...unit}
          d="M470 90 V84 M470 140 V134 M448 112 H442 M498 112 H492 M454 96 L450 92 M486 128 L490 132 M486 96 L490 92 M454 128 L450 132"
        />
        <path className={styles.shimmer} d="M360 165 L392 177" />
      </Feature>

      {/* ── 02 rainwater: gutter, downpipe and the tank filling ─────────── */}
      <Feature step={1} active={active}>
        <path {...unit} d="M690 288 H740 V330" />
        <rect className={styles.tankFill} x="712" y="350" width="56" height="68" />
        <path {...unit} d="M718 346 H762" />
        <g className={styles.drops}>
          <path d="M740 300 V308" />
          <path d="M740 300 V308" />
          <path d="M740 300 V308" />
        </g>
      </Feature>

      {/* ── 03 EV charging: two chargers in the yard and a van ──────────── */}
      <Feature step={2} active={active}>
        <path {...unit} d="M806 420 V368 H826 V420 M846 420 V368 H866 V420" />
        <path {...unit} d="M818 378 L812 392 H820 L814 406 M858 378 L852 392 H860 L854 406" />
        <path {...unit} d="M884 420 V388 H938 L958 402 V420" />
        <path {...unit} d="M906 424 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        <path {...unit} d="M944 424 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        <path className={styles.charge} d="M826 380 C838 372 836 392 846 384" />
      </Feature>

      {/* ── 04 plantation: three trees growing from the ground line ─────── */}
      <Feature step={3} active={active}>
        <g className={styles.tree}>
          <path {...unit} d="M42 420 V372" />
          <path {...unit} d="M42 300 C20 318 20 356 42 372 C64 356 64 318 42 300 Z" />
        </g>
        <g className={styles.tree} style={{ "--grow-delay": "180ms" } as CSSProperties}>
          <path {...unit} d="M82 420 V360" />
          <path {...unit} d="M82 280 C54 300 56 344 82 360 C108 344 110 300 82 280 Z" />
        </g>
        <g className={styles.tree} style={{ "--grow-delay": "360ms" } as CSSProperties}>
          <path {...unit} d="M120 420 V380" />
          <path {...unit} d="M120 326 C102 338 102 368 120 380 C138 368 138 338 120 326 Z" />
        </g>
      </Feature>

      {/* ── 05 waste and STP: a treatment chamber below the yard ────────── */}
      <Feature step={4} active={active}>
        <path {...unit} d="M560 436 H660 V468 H560 Z" />
        <path {...unit} d="M610 420 V436" />
        <path className={styles.ripple} d="M572 452 Q582 446 592 452 T612 452 T632 452 T652 452" />
      </Feature>

      {/* ── 06 sustainable construction: roof monitor, louvres, cool roof ── */}
      <Feature step={5} active={active}>
        <path {...unit} d="M314 175 V160 H366 V175" />
        <path {...unit} d="M318 166 H362" />
        <path {...unit} d="M172 258 H300 M172 268 H300 M172 278 H300 M172 288 H300" />
        <path className={styles.sheen} d="M166 228 L328 170" />
      </Feature>

      {/* ── the "you are here" pin on the current feature ───────────────── */}
      <g
        className={styles.pin}
        style={{ transform: `translate(${pin.x}px, ${pin.y}px)` } as CSSProperties}
      >
        <circle r="5" className={styles.pinDot} />
        <circle r="5" className={styles.pinPulse} />
      </g>
    </svg>
  );
}
