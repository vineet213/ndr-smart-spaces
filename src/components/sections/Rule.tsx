"use client";

import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import styles from "./Rule.module.css";

type RuleProps = {
  className?: string;
};

export function Rule({ className }: RuleProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.3 });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx(styles.rule, inView && styles.drawn, className)}
    />
  );
}
