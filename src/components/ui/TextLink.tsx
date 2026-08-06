import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./TextLink.module.css";
import { cx } from "./cx";
import type { Tone } from "./types";

type TextLinkProps = {
  tone?: Tone;
  className?: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function TextLink({ tone = "light", className, children, ...rest }: TextLinkProps) {
  return (
    <a
      className={cx(
        "text-label-button",
        styles.base,
        tone === "dark" ? styles.onDark : styles.onLight,
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
