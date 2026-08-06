import type { ReactNode } from "react";
import styles from "./Heading.module.css";
import { cx } from "./cx";
import type { Tone } from "./types";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingVariant = "hero" | "section" | "sub";

const defaultElement: Record<HeadingVariant, HeadingLevel> = {
  hero: "h1",
  section: "h2",
  sub: "h3",
};

const variantClass: Record<HeadingVariant, string> = {
  hero: styles.hero,
  section: styles.section,
  sub: styles.sub,
};

type HeadingProps = {
  as?: HeadingLevel;
  variant?: HeadingVariant;
  tone?: Tone;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Heading({
  as,
  variant = "section",
  tone = "light",
  id,
  className,
  children,
}: HeadingProps) {
  const Tag = as ?? defaultElement[variant];
  return (
    <Tag
      id={id}
      className={cx(
        styles.heading,
        variantClass[variant],
        tone === "dark" ? styles.onDark : styles.onLight,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
