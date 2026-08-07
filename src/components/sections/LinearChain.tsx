"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import type { ChainNode } from "@/lib/data/business";
import { cx } from "../ui/cx";
import styles from "./LinearChain.module.css";

type LinearChainProps = {
  nodes: readonly ChainNode[];
  tone: "light" | "dark";
  className?: string;
};

const PROGRESS_START = 0.9;
const PROGRESS_END = 0.35;

export function LinearChain({ nodes, tone, className }: LinearChainProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * PROGRESS_START;
      const end = viewport * PROGRESS_END;
      setProgress(Math.min(1, Math.max(0, (start - rect.top) / (start - end))));
    };
    const onScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);

  const current = Math.min(nodes.length - 1, Math.floor(progress * nodes.length));

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
            className={cx(
              styles.node,
              index < current
                ? styles.nodePast
                : index === current
                  ? styles.nodeCurrent
                  : styles.nodeFuture,
            )}
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
