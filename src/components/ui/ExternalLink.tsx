import type { AnchorHTMLAttributes, ReactNode } from "react";
import textLinkStyles from "./TextLink.module.css";
import styles from "./ExternalLink.module.css";
import { Icon } from "./Icon";
import { VisuallyHidden } from "./VisuallyHidden";
import { cx } from "./cx";
import type { Tone } from "./types";

type ExternalLinkProps = {
  tone?: Tone;
  className?: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function ExternalLink({ tone = "light", className, children, ...rest }: ExternalLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "text-label-button",
        textLinkStyles.base,
        tone === "dark" ? textLinkStyles.onDark : textLinkStyles.onLight,
        styles.external,
        className,
      )}
      {...rest}
    >
      {children}
      <Icon name="arrow-up-right" className={styles.arrow} />
      <VisuallyHidden>Opens in a new tab</VisuallyHidden>
    </a>
  );
}
