"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";
import { getLenisInstance } from "@/lib/lenis";
import styles from "./EnquireTab.module.css";

const FORM_ID = "business-enquiry";

/** Puts the cursor in the form's first field; skipped on touch screens so no keyboard pops up. */
function focusFirstField(section: HTMLElement) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  section.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
}

/**
 * "Enquire Now" tab fixed to the right edge of every page; it takes the reader
 * to the enquiry form on the Contact page. It steps aside while that form is
 * already on screen.
 */
export function EnquireTab() {
  const pathname = usePathname();
  // The page whose form is on screen, so leaving that page resets it.
  const [formInViewOn, setFormInViewOn] = useState<string | null>(null);
  const formInView = formInViewOn === pathname;

  useEffect(() => {
    const section = document.getElementById(FORM_ID);
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormInViewOn(entry.isIntersecting ? pathname : null),
      { rootMargin: "-20% 0px -20% 0px" },
    );
    observer.observe(section);

    // Arrived from another page via this tab (or any /contact#business-enquiry link).
    let timer = 0;
    if (window.location.hash === `#${FORM_ID}`) {
      timer = window.setTimeout(() => focusFirstField(section), 600);
    }
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  // Already on the Contact page: glide to the form instead of jumping.
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById(FORM_ID);
    if (!section) return;
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offset = -parseFloat(getComputedStyle(section).scrollMarginTop || "0");
    const lenis = getLenisInstance();
    if (lenis && !reduced) {
      lenis.scrollTo(section, { offset, duration: 1.2, onComplete: () => focusFirstField(section) });
    } else {
      section.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
      focusFirstField(section);
    }
    window.history.replaceState(null, "", `#${FORM_ID}`);
  };

  return (
    <Link
      href={`/contact#${FORM_ID}`}
      className={`${styles.tab} ${formInView ? styles.hidden : ""}`}
      aria-label="Enquire now"
      tabIndex={formInView ? -1 : 0}
      aria-hidden={formInView}
      onClick={onClick}
    >
      <Icon name="mail" className={styles.mail} />
      <span className={styles.label}>Enquire Now</span>
    </Link>
  );
}
