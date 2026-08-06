import styles from "./ArchitecturalField.module.css";
import { cx } from "../ui/cx";

type ArchitecturalFieldProps = {
  className?: string;
  ariaHidden?: boolean;
};

export function ArchitecturalField({ className, ariaHidden = true }: ArchitecturalFieldProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden={ariaHidden || undefined}
      focusable="false"
      className={cx(styles.field, className)}
    >
      <defs>
        <pattern id="ndr-grid" width="100" height="90" patternUnits="userSpaceOnUse">
          <path
            d="M 100 0 L 0 0 0 90"
            fill="none"
            stroke="rgba(250,247,242,0.05)"
            strokeWidth="1"
          />
        </pattern>
        <linearGradient id="ndr-field-shade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(90,30,34,0.25)" />
          <stop offset="1" stopColor="rgba(28,16,18,0.6)" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="#7C282E" />
      <rect width="1600" height="900" fill="url(#ndr-grid)" />
      <rect width="1600" height="900" fill="url(#ndr-field-shade)" />
      <g transform="translate(1000 260)">
        <rect
          x="0"
          y="120"
          width="340"
          height="220"
          fill="rgba(240,182,90,0.10)"
          stroke="rgba(240,182,90,0.45)"
          strokeWidth="2"
        />
        <rect
          x="60"
          y="30"
          width="220"
          height="360"
          fill="rgba(250,247,242,0.04)"
          stroke="rgba(250,247,242,0.28)"
          strokeWidth="2"
        />
      </g>
      <g transform="translate(340 560)">
        <rect
          x="0"
          y="0"
          width="220"
          height="200"
          fill="none"
          stroke="rgba(240,182,90,0.35)"
          strokeWidth="2"
        />
        <rect
          x="40"
          y="40"
          width="140"
          height="120"
          fill="rgba(90,30,34,0.35)"
          stroke="rgba(250,247,242,0.18)"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
