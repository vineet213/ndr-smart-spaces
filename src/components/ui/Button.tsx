import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";
import { cx } from "./cx";
import type { Tone } from "./types";

type ButtonVariant = "primary" | "secondary";

type BaseProps = {
  variant?: ButtonVariant;
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsLink = BaseProps & {
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function variantClass(variant: ButtonVariant, tone: Tone): string {
  if (variant === "primary") {
    return tone === "dark" ? styles.primaryOnDark : styles.primaryOnLight;
  }
  return tone === "dark" ? styles.secondaryOnDark : styles.secondaryOnLight;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", tone = "light", className, children, ...rest } = props;

  const classes = cx("text-label-button", styles.base, variantClass(variant, tone), className);

  if ("href" in props && props.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
