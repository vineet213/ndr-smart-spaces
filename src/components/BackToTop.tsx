"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { getLenisInstance } from "@/lib/lenis";
import styles from "./BackToTop.module.css";

/** Appears once the reader is more than two screens down. */
const SHOW_AFTER_SCREENS = 2;

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      frame.current = 0;
      const show = window.scrollY > window.innerHeight * SHOW_AFTER_SCREENS;
      setVisible((current) => (current === show ? current : show));
    };
    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const goTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = getLenisInstance();
    if (reduced) {
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (lenis) {
      lenis.scrollTo(0, { duration: 1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ""}`}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={goTop}
    >
      <Icon name="arrow-right" className={styles.arrow} />
    </button>
  );
}
