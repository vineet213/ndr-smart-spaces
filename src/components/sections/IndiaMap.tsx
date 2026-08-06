import type { MapLocation, ZoneId } from "@/lib/data/homepage";
import styles from "./IndiaMap.module.css";
import { cx } from "../ui/cx";

export const MAP_VIEWBOX = { width: 930, height: 1000 } as const;

const OUTLINE =
  "M297.4 55.5 L309.8 56.3 L339.9 38.6 L355.4 38.2 L362.7 41.3 L366.9 50.2 L376.3 51.5 L378.0 57.6 L382.8 52.4 L389.4 55.8 " +
  "L378.7 82.4 L369.5 85.1 L369.8 90.1 L360.7 91.0 L363.8 98.5 L357.3 106.6 L340.9 107.6 L347.4 119.2 L341.5 119.7 L342.6 1" +
  "28.0 L347.9 134.2 L357.5 134.6 L355.0 141.1 L361.9 152.3 L343.5 164.0 L337.5 159.1 L336.2 151.6 L325.2 157.3 L337.5 175." +
  "8 L337.4 199.3 L347.6 194.4 L358.1 209.3 L372.0 211.0 L383.9 218.2 L383.2 224.5 L409.1 236.0 L387.9 253.2 L389.3 258.4 L" +
  "384.0 263.7 L385.8 271.9 L380.9 275.4 L378.7 285.0 L392.7 294.4 L394.4 289.7 L414.8 301.0 L418.2 308.8 L422.3 307.9 L436" +
  ".3 318.3 L442.2 316.0 L454.2 324.5 L462.4 323.0 L463.3 330.6 L477.7 332.2 L481.8 336.5 L484.1 331.3 L499.2 335.9 L498.7 " +
  "332.5 L508.3 330.1 L523.3 336.2 L524.0 346.3 L541.4 352.3 L542.1 356.2 L555.3 352.2 L562.5 362.8 L577.8 361.0 L590.4 367" +
  ".8 L601.3 362.1 L601.9 366.8 L609.8 370.4 L627.2 365.5 L631.1 369.9 L636.7 356.9 L630.4 343.8 L637.1 320.6 L634.6 316.2 " +
  "L651.1 309.3 L659.1 318.4 L655.1 328.3 L659.9 337.8 L654.5 343.0 L666.9 354.5 L674.7 352.6 L690.0 358.1 L705.7 351.3 L71" +
  "7.3 355.8 L748.2 354.5 L754.6 350.6 L759.9 353.1 L759.3 339.0 L762.0 338.0 L758.6 331.3 L747.0 331.2 L744.1 326.1 L746.7" +
  " 321.6 L755.7 323.2 L765.8 317.3 L772.6 320.5 L781.3 314.2 L779.6 308.2 L787.4 306.5 L803.4 290.6 L812.5 290.5 L830.0 28" +
  "1.3 L833.3 278.1 L831.0 273.7 L841.6 268.8 L861.9 276.6 L887.0 265.8 L895.0 272.3 L891.3 277.7 L895.8 275.1 L905.4 288.1" +
  " L898.3 296.0 L901.2 298.6 L901.0 294.7 L908.0 292.3 L914.8 301.3 L928.6 306.4 L929.7 313.0 L928.8 317.6 L913.6 327.0 L9" +
  "21.5 344.7 L907.7 335.0 L892.6 338.3 L858.3 361.1 L855.5 366.8 L859.4 379.8 L850.3 397.3 L841.9 403.2 L840.0 409.4 L845." +
  "3 412.4 L844.4 419.0 L826.7 456.5 L813.9 451.0 L805.9 453.2 L800.3 448.4 L803.8 462.0 L802.1 481.1 L799.2 485.5 L793.9 4" +
  "84.2 L796.3 511.0 L786.9 522.2 L780.3 514.8 L777.2 520.9 L767.0 460.9 L759.6 463.4 L756.7 460.4 L757.1 469.2 L750.5 475." +
  "4 L752.8 482.5 L745.9 487.9 L739.3 475.9 L737.3 482.2 L731.3 464.7 L738.2 447.5 L744.9 448.7 L747.4 443.2 L750.5 446.3 L" +
  "749.9 442.7 L754.9 446.5 L755.5 439.6 L763.3 436.8 L767.5 425.9 L765.4 420.2 L773.9 421.0 L771.6 415.7 L760.0 410.3 L708" +
  ".5 411.8 L689.3 406.7 L690.8 384.2 L684.2 374.1 L681.0 383.4 L674.0 382.1 L667.6 377.6 L665.4 368.6 L659.6 368.2 L664.2 " +
  "374.0 L652.0 373.3 L654.5 370.3 L643.5 360.7 L641.4 365.7 L647.5 369.9 L636.4 377.2 L634.2 388.7 L639.4 388.9 L648.0 399" +
  ".3 L656.6 398.7 L662.9 407.7 L660.2 411.1 L644.9 409.5 L643.5 418.7 L635.2 419.0 L631.1 428.2 L641.4 438.1 L654.2 441.6 " +
  "L655.3 451.9 L649.1 456.0 L648.6 463.3 L656.3 468.6 L653.7 476.9 L662.5 478.3 L657.7 485.4 L665.7 514.8 L662.2 523.7 L66" +
  "5.8 532.6 L660.1 532.9 L658.2 527.8 L657.8 533.4 L653.8 531.2 L655.6 519.7 L651.1 517.5 L648.5 526.5 L645.4 523.7 L645.2" +
  " 533.5 L639.6 529.3 L638.7 535.3 L637.4 515.0 L631.4 512.5 L636.9 516.6 L624.6 530.6 L601.9 536.1 L596.2 542.9 L593.5 54" +
  "9.9 L598.2 560.8 L594.8 562.4 L601.2 564.2 L590.5 570.6 L592.2 576.1 L588.6 578.9 L592.6 577.1 L579.0 590.7 L552.5 599.5" +
  " L536.6 610.0 L507.7 647.3 L489.4 657.1 L478.6 672.1 L449.7 691.1 L449.6 707.6 L430.7 716.4 L416.6 716.8 L406.1 736.9 L3" +
  "97.9 730.7 L384.7 738.2 L377.8 758.8 L382.5 775.9 L380.3 793.5 L387.3 820.5 L381.3 848.8 L368.6 876.0 L372.5 922.9 L353." +
  "8 924.7 L341.3 951.3 L343.2 956.4 L350.5 958.4 L321.1 967.5 L314.9 989.7 L298.4 1000.0 L281.3 990.5 L266.4 971.5 L270.2 " +
  "968.3 L266.2 970.4 L260.4 955.5 L257.6 932.5 L244.9 894.9 L234.5 874.7 L223.6 864.6 L211.7 835.8 L208.4 808.3 L199.0 786" +
  ".2 L201.9 787.5 L194.4 771.3 L182.6 758.5 L178.7 738.9 L168.1 725.1 L165.3 713.8 L168.5 712.6 L163.7 709.3 L167.7 709.7 " +
  "L163.7 706.3 L166.4 705.7 L164.0 691.1 L159.7 682.2 L163.1 682.4 L151.5 650.5 L156.8 653.1 L156.3 647.0 L151.1 646.0 L15" +
  "0.6 639.4 L153.8 641.9 L149.1 634.1 L151.7 629.5 L154.1 633.3 L150.7 627.1 L155.7 622.8 L153.1 617.0 L147.4 627.2 L146.8" +
  " 613.0 L150.8 613.6 L145.5 607.7 L150.1 605.5 L145.0 605.3 L142.6 594.8 L151.4 562.9 L145.1 554.7 L148.8 553.5 L144.3 55" +
  "1.6 L146.9 548.4 L142.1 551.8 L142.1 547.5 L145.4 547.8 L140.8 544.3 L151.3 531.3 L138.9 531.8 L145.6 521.1 L137.9 521.0" +
  " L140.4 513.1 L150.8 511.0 L138.8 509.6 L135.5 513.1 L132.2 509.5 L127.6 519.4 L129.6 522.8 L127.0 521.5 L131.5 533.0 L1" +
  "25.3 547.7 L84.3 565.3 L63.1 552.7 L24.3 509.6 L28.5 503.7 L33.6 511.3 L42.6 505.5 L47.6 509.0 L49.5 503.8 L52.1 506.4 L" +
  "63.7 501.5 L72.4 486.7 L65.1 483.8 L65.3 487.3 L54.5 488.7 L49.0 494.7 L32.6 491.3 L14.6 479.9 L17.4 481.4 L13.0 477.9 L" +
  "16.1 475.3 L8.1 468.1 L20.3 455.4 L10.9 460.0 L8.1 457.5 L5.7 465.6 L0.0 464.4 L5.6 460.5 L0.6 460.7 L5.9 452.1 L18.5 45" +
  "2.2 L20.2 440.4 L22.1 443.9 L24.6 440.8 L45.2 441.2 L59.0 445.3 L76.0 436.7 L76.3 442.6 L80.9 443.8 L93.8 437.4 L89.9 43" +
  "5.9 L93.0 427.5 L79.3 403.1 L79.2 392.6 L66.7 392.2 L61.3 384.5 L63.7 363.3 L42.6 356.7 L45.0 341.6 L70.0 313.0 L76.9 31" +
  "3.0 L85.9 323.6 L118.5 314.7 L134.2 286.9 L151.9 278.0 L166.2 246.4 L184.5 237.7 L183.3 227.6 L207.6 207.5 L201.6 205.5 " +
  "L206.2 195.4 L200.9 185.4 L204.7 179.4 L229.1 167.8 L220.5 159.1 L207.1 158.6 L207.8 146.6 L197.2 149.1 L173.8 137.9 L17" +
  "2.5 110.4 L166.3 93.6 L168.0 87.1 L174.5 87.3 L176.8 80.3 L186.8 76.0 L189.6 68.1 L177.5 64.6 L178.6 54.1 L166.5 54.0 L1" +
  "57.6 47.4 L159.3 42.6 L139.9 42.9 L139.3 29.7 L152.6 21.3 L155.6 13.7 L181.0 12.8 L174.9 6.0 L186.7 9.0 L207.3 0.0 L214." +
  "1 5.3 L221.9 2.1 L230.5 4.7 L231.9 12.6 L240.6 11.8 L249.9 22.6 L271.9 32.2 L275.7 42.6 L291.9 47.4 L297.4 55.5 Z";

const TIER_LABEL = {
  hq: "Headquarters",
  hub: "Primary logistics hub",
  satellite: "Secondary location",
} as const;

type IndiaMapProps = {
  locations: readonly MapLocation[];
  activeZone: ZoneId | null;
  tooltip: MapLocation | null;
  onLocationEnter: (location: MapLocation) => void;
  onLocationLeave: () => void;
};

export function IndiaMap({
  locations,
  activeZone,
  tooltip,
  onLocationEnter,
  onLocationLeave,
}: IndiaMapProps) {
  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label="Map of India showing NDR Smart Spaces locations — headquarters, primary logistics hubs and secondary locations"
    >
      <div className={styles.frame}>
        <svg
          viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
          className={styles.map}
          focusable="false"
        >
          <path className={styles.outline} d={OUTLINE} />
          <g className={styles.leaders} aria-hidden="true">
            {locations.map((location) =>
              location.leaderTo ? (
                <g key={location.name}>
                  <line
                    x1={location.leaderTo.x}
                    y1={location.leaderTo.y}
                    x2={location.x}
                    y2={location.y}
                    className={styles.leader}
                  />
                  <circle
                    cx={location.leaderTo.x}
                    cy={location.leaderTo.y}
                    r={2.5}
                    className={styles.anchorDot}
                  />
                </g>
              ) : null,
            )}
          </g>
          <g className={styles.dots}>
            {locations.map((location) => {
              const active = activeZone === location.zone;
              const hovered = tooltip?.name === location.name;
              const dimmed =
                (tooltip !== null && !hovered) ||
                (tooltip === null && activeZone !== null && !active);
              return (
                <g
                  key={location.name}
                  className={cx(
                    styles.dot,
                    active && styles.dotActive,
                    hovered && styles.dotHovered,
                    dimmed && styles.dotDim,
                  )}
                  role="button"
                  tabIndex={0}
                  aria-label={`${location.name}, ${location.line} — ${location.zone} zone · ${TIER_LABEL[location.tier]}`}
                  aria-describedby={hovered ? "map-tooltip" : undefined}
                  onMouseEnter={() => onLocationEnter(location)}
                  onMouseLeave={onLocationLeave}
                  onFocus={() => onLocationEnter(location)}
                  onBlur={onLocationLeave}
                >
                  {location.tier === "hq" ? (
                    <g className={styles.hqGroup}>
                      <circle className={styles.haloHq} cx={location.x} cy={location.y} r={19} />
                      <circle className={styles.ringHq} cx={location.x} cy={location.y} r={13} />
                      <rect
                        className={styles.nodeHq}
                        x={location.x - 7.5}
                        y={location.y - 7.5}
                        width={15}
                        height={15}
                        rx={1}
                        transform={`rotate(45 ${location.x} ${location.y})`}
                      />
                    </g>
                  ) : location.tier === "hub" ? (
                    <>
                      <circle className={styles.halo} cx={location.x} cy={location.y} r={18} />
                      <circle className={styles.glow} cx={location.x} cy={location.y} r={11} />
                      <circle className={styles.node} cx={location.x} cy={location.y} r={8} />
                    </>
                  ) : (
                    <circle className={styles.nodeSat} cx={location.x} cy={location.y} r={5} />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
        {tooltip ? (
          <div
            id="map-tooltip"
            role="tooltip"
            className={styles.tooltip}
            style={{
              left: `${Math.max(14, Math.min((tooltip.x / MAP_VIEWBOX.width) * 100, 86))}%`,
              top: `${Math.max(14, Math.min((tooltip.y / MAP_VIEWBOX.height) * 100, 86))}%`,
            }}
          >
            <span className={styles.tooltipName}>{tooltip.name}</span>
            <span className={cx("text-label-meta", styles.tooltipZone)}>{tooltip.zone} zone</span>
            <span className={styles.tooltipLine}>{tooltip.line}</span>
          </div>
        ) : null}
      </div>
      <ul className={styles.legend}>
        <li>
          <span className={styles.legendHq} aria-hidden="true" />
          Headquarters
        </li>
        <li>
          <span className={styles.legendHub} aria-hidden="true" />
          Primary logistics hub
        </li>
        <li>
          <span className={styles.legendSat} aria-hidden="true" />
          Secondary location
        </li>
      </ul>
    </div>
  );
}
