"use client";

import type { CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import type { ChainNode } from "@/lib/data/business";
import { cx } from "../ui/cx";
import styles from "./LinearChain.module.css";

type LinearChainProps = {
  nodes: readonly ChainNode[];
  tone: "light" | "dark";
  className?: string;
};

export function LinearChain({ nodes, tone, className }: LinearChainProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cx(
        styles.chain,
        tone === "dark" ? styles.onDark : styles.onLight,
        inView && styles.drawn,
        className,
      )}
    >
      <span className={styles.spine} aria-hidden="true" />
      <ol className={styles.list}>
        {nodes.map((node, index) => (
          <li
            key={node.index}
            className={styles.node}
            style={{ "--pop-delay": `${300 + index * 50}ms` } as CSSProperties}
          >
            <span className={styles.mark} aria-hidden="true" />
            <span className={styles.nodeBody}>
              <span className={styles.nodeHeading}>
                <span className={styles.nodeIndex}>{node.index}</span>
                <span className={styles.nodeName}>{node.name}</span>
              </span>
              <span className={styles.nodeCaption}>{node.caption}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
