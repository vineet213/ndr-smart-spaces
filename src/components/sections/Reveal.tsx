"use client";

import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import styles from "./Reveal.module.css";
import { cx } from "../ui/cx";

export type RevealDelay = 0 | 1 | 2 | 3 | 4 | 5;
export type RevealVariant = "rise" | "fade";

const delayClass: Record<RevealDelay, string> = {
  0: styles.d0,
  1: styles.d80,
  2: styles.d160,
  3: styles.d240,
  4: styles.d320,
  5: styles.d400,
};

const variantClass: Record<RevealVariant, string> = {
  rise: styles.rise,
  fade: styles.fade,
};

type RevealProps = {
  as?: ElementType;
  delay?: RevealDelay;
  variant?: RevealVariant;
  className?: string;
  children: ReactNode;
};

export function Reveal({
  as: Tag = "div",
  delay = 0,
  variant = "rise",
  className,
  children,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cx(
        styles.reveal,
        variantClass[variant],
        delayClass[delay],
        inView && styles.isInView,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
