"use client";

import { useEffect, useState } from "react";
import { businessChapters } from "@/lib/data/business";
import { cx } from "../ui/cx";
import styles from "./BusinessStickyIndex.module.css";

const STRIP_SHOW_AT = 320;
const HEADER_TALL = "4.5rem";
const HEADER_COMPACT = "3.5rem";

const isDarkLuminance = (bg: string): boolean => {
  const match = bg.match(/[\d.]+/g);
  if (!match || match.length < 3) return false;
  const [r, g, b] = match.slice(0, 3).map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 92;
};

export function BusinessStickyIndex() {
  const [active, setActive] = useState(-1);
  const [scrollY, setScrollY] = useState(0);
  const [railTop, setRailTop] = useState<number | null>(null);
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    let raf = 0;

    const readTone = (railY: number): boolean => {
      const probe = (y: number): boolean | null => {
        const el = document.elementFromPoint(78, y);
        if (!el) return null;
        let node: Element | null = el;
        while (node && node !== document.documentElement) {
          const bg = window.getComputedStyle(node).backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            return isDarkLuminance(bg);
          }
          node = node.parentElement;
        }
        return null;
      };
      const probes = [railY, railY - 84, railY + 84]
        .map(probe)
        .filter((v): v is boolean => v !== null);
      if (probes.length === 0) return true;
      return probes.filter(Boolean).length >= Math.ceil(probes.length / 2);
    };

    const alignRail = () => {
      const hero = document.getElementById("business-hero");
      if (!hero) return null;
      const rect = hero.getBoundingClientRect();
      return Math.round(window.scrollY + rect.top + rect.height / 2);
    };

    const update = () => {
      raf = 0;
      setScrollY(window.scrollY);
      const nextRailTop = alignRail();
      if (nextRailTop !== null) {
        setRailTop((current) => (current === nextRailTop ? current : nextRailTop));
        setOnDark((current) => {
          const theme = readTone(nextRailTop);
          return current === theme ? current : theme;
        });
      }
      const mid = window.innerHeight * 0.45;
      let current = -1;
      for (let index = 0; index < businessChapters.length; index += 1) {
        const element = document.getElementById(businessChapters[index].id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= mid) current = index;
      }
      setActive(current);
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
  }, []);

  const stripVisible = scrollY > STRIP_SHOW_AT;
  const headerCompacted = scrollY > 4;

  return (
    <>
      <nav
        className={cx(styles.railNav, onDark && styles.onDark)}
        style={railTop !== null ? { top: railTop } : undefined}
        aria-label="Chapter index"
      >
        <ol className={styles.rail}>
          {businessChapters.map((chapter, index) => (
            <li key={chapter.id} className={styles.railItem}>
              <a
                href={`#${chapter.id}`}
                className={cx(styles.railLink, active === index && styles.railActive)}
                aria-current={active === index ? "true" : undefined}
              >
                <span className={styles.railMarker} aria-hidden="true" />
                <span className={styles.railDiamond} aria-hidden="true" />
                <span className={styles.railNumeral}>{chapter.index}</span>
                <span className={styles.railLabel}>{chapter.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <nav
        className={cx(styles.stripNav, stripVisible && styles.stripVisible)}
        aria-label="Chapter index"
        style={{ top: headerCompacted ? HEADER_COMPACT : HEADER_TALL }}
      >
        <ol className={styles.stripList}>
          {businessChapters.map((chapter, index) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className={cx(styles.stripLink, active === index && styles.stripActive)}
                aria-current={active === index ? "true" : undefined}
              >
                <span className={styles.stripNumeral}>{chapter.index}</span>
                <span className={styles.stripLabel}>{chapter.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
