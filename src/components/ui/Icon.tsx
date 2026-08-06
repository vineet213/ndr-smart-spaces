import type { ReactNode } from "react";
import styles from "./Icon.module.css";
import { cx } from "./cx";

export type IconName =
  | "arrow-right"
  | "arrow-up-right"
  | "chevron-down"
  | "phone"
  | "mail"
  | "map-pin"
  | "download"
  | "menu"
  | "close";

type IconSize = "sm" | "md";

const paths: Record<IconName, ReactNode> = {
  "arrow-right": (
    <>
      <path d="M4 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </>
  ),
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
  ),
  mail: (
    <>
      <rect x="2" y="5" width="20" height="14" />
      <path d="M22 7l-10 6L2 7" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 21h16" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
};

const sizeClass: Record<IconSize, string> = {
  sm: styles.sm,
  md: styles.md,
};

type IconProps = {
  name: IconName;
  size?: IconSize;
  className?: string;
};

export function Icon({ name, size = "md", className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={cx(styles.icon, sizeClass[size], className)}
    >
      {paths[name]}
    </svg>
  );
}
