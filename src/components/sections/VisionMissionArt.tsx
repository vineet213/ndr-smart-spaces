"use client";

import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./VisionMissionArt.module.css";

/**
 * The vision/mission panels ship as static architectural line-art SVGs
 * (public/images/vision-mission/{vision,mission}.svg). These two components
 * reproduce that exact artwork inline — same paths, same colors, same
 * opacities — so a handful of the technical-drawing strokes can be revealed
 * with a restrained line-draw / fade-in on scroll, in keeping with the
 * "technical drawing being constructed" brief. No new imagery is introduced;
 * this is the same art, just inlined so it can be animated.
 */

function useArtInView() {
  return useInView<HTMLDivElement>({ threshold: 0.3 });
}

export function VisionDiagram() {
  const { ref, inView } = useArtInView();
  return (
    <div ref={ref} className={cx(styles.art, inView && styles.active)}>
      <svg
        className={styles.svg}
        viewBox="0 0 800 1000"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Editorial line illustration of a future-ready master plan — plotted land rising into an institutional skyline."
      >
        <rect width="800" height="1000" fill="#1c1a19" />

        <g className={styles.fadeBase}>
          <g stroke="#faf7f2" strokeWidth="1" opacity="0.045">
            <path d="M80 120 V920 M160 120 V920 M240 120 V920 M320 120 V920 M400 120 V920 M480 120 V920 M560 120 V920 M640 120 V920 M720 120 V920" />
            <path d="M40 160 H760 M40 240 H760 M40 320 H760 M40 400 H760 M40 480 H760 M40 560 H760 M40 640 H760 M40 720 H760 M40 800 H760" />
          </g>
          <g stroke="#faf7f2" strokeWidth="1.5">
            <path
              d="M100 860 V868 M160 860 V868 M220 860 V868 M280 860 V868 M340 860 V868 M400 860 V868 M460 860 V868 M520 860 V868 M580 860 V868 M640 860 V868 M700 860 V868"
              opacity="0.55"
            />
            <path d="M240 860 V874 M480 860 V874 M720 860 V874" opacity="0.55" />
            <path
              d="M120 838 V860 M200 838 V860 M280 838 V860 M360 838 V860 M440 838 V860 M520 838 V860 M600 838 V860 M680 838 V860"
              opacity="0.4"
            />
          </g>
          <g stroke="#faf7f2" strokeWidth="2" opacity="0.34">
            <rect x="120" y="700" width="40" height="160" />
            <rect x="200" y="620" width="60" height="240" />
            <rect x="300" y="560" width="40" height="300" />
            <rect x="380" y="500" width="60" height="360" />
            <rect x="480" y="430" width="60" height="430" />
            <rect x="580" y="300" width="80" height="560" />
            <rect x="700" y="540" width="40" height="320" />
          </g>
          <g stroke="#faf7f2" strokeWidth="1.5" opacity="0.18">
            <path d="M120 740 H160 M120 780 H160 M120 820 H160" />
            <path d="M200 680 H260 M200 740 H260 M200 800 H260" />
            <path d="M300 620 H340 M300 680 H340 M300 740 H340 M300 800 H340" />
            <path d="M380 560 H440 M380 620 H440 M380 680 H440 M380 740 H440 M380 800 H440 M410 500 V860" />
            <path d="M480 480 H540 M480 540 H540 M480 600 H540 M480 660 H540 M480 720 H540 M480 780 H540" />
            <path d="M580 340 H660 M580 380 H660 M580 420 H660 M580 460 H660 M580 500 H660 M580 540 H660 M580 580 H660 M580 620 H660 M580 660 H660 M580 700 H660 M580 740 H660 M580 780 H660 M580 820 H660 M600 300 V860 M620 300 V860 M640 300 V860" />
            <path d="M700 600 H740 M700 660 H740 M700 720 H740 M700 780 H740" />
          </g>
          <g fill="#f0b65a" opacity="0.7">
            <rect x="116" y="862" width="8" height="8" />
            <rect x="356" y="862" width="8" height="8" />
            <rect x="636" y="862" width="8" height="8" />
          </g>
        </g>

        <path
          pathLength={1}
          d="M32 88 V32 H88"
          stroke="#f0b65a"
          strokeWidth="2"
          opacity="0.5"
          className={cx(styles.drawPath, styles.draw0)}
        />
        <path
          pathLength={1}
          d="M768 712 V768 H712"
          stroke="#f0b65a"
          strokeWidth="2"
          opacity="0.5"
          className={cx(styles.drawPath, styles.draw1)}
        />
        <path
          pathLength={1}
          d="M40 860 H760"
          stroke="#faf7f2"
          strokeWidth="2"
          opacity="0.55"
          className={cx(styles.drawPath, styles.draw2)}
        />

        <g className={styles.fadeHero} stroke="#f0b65a">
          <path d="M540 430 V860" strokeWidth="2" opacity="0.5" />
          <path
            d="M140 700 L230 620 L320 560 L410 500 L510 430 L620 300 L760 222"
            strokeWidth="2"
            opacity="0.7"
            strokeDasharray="7 7"
          />
          <path d="M760 212 V232 M750 222 H770" strokeWidth="2" opacity="0.85" />
          <rect x="580" y="296" width="80" height="4" fill="#f0b65a" opacity="0.8" />
          <rect x="616" y="280" width="8" height="8" fill="#f0b65a" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

export function MissionDiagram() {
  const { ref, inView } = useArtInView();
  return (
    <div ref={ref} className={cx(styles.art, inView && styles.active)}>
      <svg
        className={styles.svg}
        viewBox="0 0 800 1000"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Editorial line illustration of construction in progress — a tower crane, braced building frame and survey datum lines."
      >
        <rect width="800" height="1000" fill="#1c1a19" />

        <g className={styles.fadeBase}>
          <g stroke="#faf7f2" strokeWidth="1" opacity="0.05">
            <path d="M60 140 V860 M140 140 V860 M220 140 V860 M300 140 V860 M380 140 V860 M460 140 V860 M540 140 V860 M620 140 V860 M700 140 V860" />
          </g>
          <g stroke="#faf7f2" strokeWidth="1.5">
            <path
              d="M100 860 V868 M160 860 V868 M220 860 V868 M280 860 V868 M340 860 V868 M400 860 V868 M460 860 V868 M520 860 V868 M580 860 V868 M640 860 V868 M700 860 V868"
              opacity="0.55"
            />
            <path d="M300 860 V874 M480 860 V874 M660 860 V874" opacity="0.55" />
          </g>
          <g stroke="#faf7f2" opacity="0.1">
            <path d="M100 868 H540 M100 876 H540 M100 884 H540" />
            <path
              d="M100 862 V892 M118 862 V892 M136 862 V892 M154 862 V892 M172 862 V892 M190 862 V892 M208 862 V892 M226 862 V892 M244 862 V892 M262 862 V892 M280 862 V892 M298 862 V892 M316 862 V892 M334 862 V892 M352 862 V892 M370 862 V892 M388 862 V892 M406 862 V892 M424 862 V892 M442 862 V892 M460 862 V892 M478 862 V892 M496 862 V892 M514 862 V892 M532 862 V892"
              strokeWidth="1"
            />
            <rect x="100" y="862" width="440" height="30" strokeWidth="1" opacity="0.25" />
          </g>
          <g stroke="#faf7f2">
            <path
              d="M120 490 V860 M180 490 V860 M240 490 V860 M300 490 V860 M360 490 V860 M420 490 V860 M480 490 V860"
              strokeWidth="1.5"
              opacity="0.22"
            />
            <path d="M120 770 H480 M120 680 H480 M120 590 H480" strokeWidth="1.5" opacity="0.22" />
            <path d="M120 490 V482 M480 490 V482" strokeWidth="2" opacity="0.3" />
          </g>
          <g stroke="#f0b65a">
            <path d="M240 770 L300 860 M300 770 L240 860" strokeWidth="2" opacity="0.55" />
            <path d="M360 590 L420 680" strokeWidth="2" opacity="0.4" />
          </g>
          <g stroke="#faf7f2" opacity="0.5">
            <path
              d="M620 420 L636 340 M620 340 L636 420 M620 500 L636 420 M620 420 L636 500 M620 580 L636 500 M620 500 L636 580 M620 660 L636 580 M620 580 L636 660 M620 740 L636 660 M620 660 L636 740 M620 820 L636 740 M620 740 L636 820"
              strokeWidth="1.5"
              opacity="0.28"
            />
            <rect x="612" y="328" width="32" height="12" strokeWidth="1.5" opacity="0.5" />
            <path d="M632 342 H560" strokeWidth="1" opacity="0.2" />
            <path d="M610 860 H646" strokeWidth="1.5" opacity="0.4" />
          </g>
          <rect x="690" y="334" width="8" height="8" fill="#faf7f2" opacity="0.3" />
          <g fill="#f0b65a" opacity="0.7">
            <rect x="236" y="862" width="8" height="8" />
            <rect x="476" y="862" width="8" height="8" />
            <rect x="656" y="862" width="8" height="8" />
          </g>
          <g fill="#f0b65a">
            <rect x="60" y="848" width="36" height="12" opacity="0.5" />
            <rect x="60" y="828" width="36" height="12" opacity="0.35" />
            <path d="M78 828 V862" strokeWidth="1.5" opacity="0.35" />
          </g>
        </g>

        <path
          pathLength={1}
          d="M32 88 V32 H88"
          stroke="#f0b65a"
          strokeWidth="2"
          opacity="0.5"
          className={cx(styles.drawPath, styles.draw0)}
        />
        <path
          pathLength={1}
          d="M768 712 V768 H712"
          stroke="#f0b65a"
          strokeWidth="2"
          opacity="0.5"
          className={cx(styles.drawPath, styles.draw1)}
        />
        <path
          pathLength={1}
          d="M40 860 H760"
          stroke="#faf7f2"
          strokeWidth="2"
          opacity="0.55"
          className={cx(styles.drawPath, styles.draw2)}
        />
        <path
          pathLength={1}
          d="M120 490 H480 V860 H120 Z"
          stroke="#faf7f2"
          strokeWidth="2"
          opacity="0.4"
          className={cx(styles.drawPath, styles.draw3)}
        />

        <g className={styles.fadeHero} stroke="#f0b65a">
          <path d="M620 860 V340 M636 860 V340" strokeWidth="2" opacity="0.5" />
          <path d="M620 340 H448 M636 340 H704" strokeWidth="2" opacity="0.6" />
          <path d="M448 340 V438" strokeWidth="1.5" opacity="0.6" />
          <path d="M448 438 L438 448 M448 438 L458 448" strokeWidth="2" opacity="0.8" />
          <path d="M448 448 V858" strokeWidth="1.5" opacity="0.45" strokeDasharray="3 9" />
        </g>
      </svg>
    </div>
  );
}
