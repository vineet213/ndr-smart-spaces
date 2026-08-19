"use client";

import { useEffect, useState } from "react";
import { investorContents } from "@/lib/data/investor";
import { cx } from "../ui/cx";
import styles from "./ContentsRail.module.css";

const HEADER_TALL = "4.5rem";
const HEADER_COMPACT = "3.5rem";

const NAV_ITEMS = investorContents as readonly { label: string; href: string; type: string }[];
const ANCHOR_IDS = NAV_ITEMS.filter((item) => item.href.startsWith("#")).map((item) =>
  item.href.slice(1),
);

export function ContentsRail() {
  const [scrollY, setScrollY] = useState(0);
  const [active, setActive] = useState<string | null>(ANCHOR_IDS[0] ?? null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      setScrollY(window.scrollY);
      const mid = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of ANCHOR_IDS) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= mid) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const headerCompacted = scrollY > 4;

  return (
    <nav
      className={styles.section}
      style={{ top: headerCompacted ? HEADER_COMPACT : HEADER_TALL }}
      aria-label="Document contents"
    >
      <ol className={styles.list}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href.startsWith("#") && item.href.slice(1) === active;
          return (
            <li key={item.href + item.label}>
              <a
                href={item.href}
                className={cx(styles.link, isActive && styles.active)}
                aria-current={isActive ? "true" : undefined}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
