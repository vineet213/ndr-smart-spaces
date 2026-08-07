"use client";

import { useEffect, useState } from "react";
import { businessChapters } from "@/lib/data/business";
import { cx } from "../ui/cx";
import styles from "./BusinessStickyIndex.module.css";

const STRIP_SHOW_AT = 320;
const HEADER_TALL = "4.5rem";
const HEADER_COMPACT = "3.5rem";

export function BusinessStickyIndex() {
  const [active, setActive] = useState(-1);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrollY(window.scrollY);
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
      <nav className={styles.railNav} aria-label="Chapter index">
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
