"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrolled } from "@/hooks/useScrolled";
import { useDisclosure } from "@/hooks/useDisclosure";
import { cx } from "../ui/cx";
import { LogoWordmark } from "./LogoWordmark";
import { MainNav } from "./MainNav";
import { CtaArea } from "./CtaArea";
import { MenuButton } from "./MenuButton";
import { MobileNav } from "./MobileNav";
import styles from "./Header.module.css";

const HIDE_AFTER_PX = 200;
const HIDE_DELTA_PX = 8;

export function Header() {
  const scrolled = useScrolled(40);
  const mobileMenu = useDisclosure(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const [hidden, setHidden] = useState(false);
  const menuOpenRef = useRef(false);

  // The scroll handler reads this instead of re-subscribing when the menu toggles.
  useEffect(() => {
    menuOpenRef.current = mobileMenu.open;
  }, [mobileMenu.open]);

  // setState only when the value really changes (this runs on every scroll frame).
  const setHiddenSafe = useCallback(
    (next: boolean) => setHidden((current) => (current === next ? current : next)),
    [],
  );

  // One scroll listener (once per frame) drives both the reading-progress line
  // and the hide-on-scroll-down / show-on-scroll-up behaviour.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let last = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty(
        "--p",
        max > 0 ? String(Math.min(Math.max(y / max, 0), 1)) : "0",
      );

      const delta = y - last;
      const header = headerRef.current;
      // Open dropdowns are looked for in the bar only: the mobile menu (closed,
      // hidden on desktop) pre-expands the current page's section, which would
      // otherwise keep the bar pinned on those pages. menuOpenRef covers it.
      const pinned =
        reduced.matches ||
        menuOpenRef.current ||
        !!navBarRef.current?.querySelector('[aria-expanded="true"]') ||
        !!header?.contains(document.activeElement);
      if (pinned || y < HIDE_AFTER_PX) {
        setHiddenSafe(false);
        last = y;
      } else if (delta > HIDE_DELTA_PX) {
        setHiddenSafe(true);
        last = y;
      } else if (delta < -HIDE_DELTA_PX) {
        setHiddenSafe(false);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const reveal = () => setHiddenSafe(false);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const header = headerRef.current;
    header?.addEventListener("focusin", reveal);
    header?.addEventListener("pointerenter", reveal);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      header?.removeEventListener("focusin", reveal);
      header?.removeEventListener("pointerenter", reveal);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [setHiddenSafe]);

  // Publish the hidden state on <html> so pinned sections can take the freed
  // space via --nav-offset (see tokens/spacing.css).
  const navHidden = hidden && !mobileMenu.open;
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-nav-hidden", navHidden);
    return () => root.removeAttribute("data-nav-hidden");
  }, [navHidden]);

  return (
    <header ref={headerRef} className={styles.header}>
      <span ref={progressRef} className={styles.progress} aria-hidden="true" />
      <div
        ref={navBarRef}
        className={cx(
          styles.navBar,
          scrolled && styles.navBarScrolled,
          navHidden && styles.navBarHidden,
        )}
      >
        <div className={styles.navContainer}>
          <LogoWordmark scrolled={scrolled} />
          <MainNav />
          <CtaArea scrolled={scrolled} />
          <MenuButton open={mobileMenu.open} onToggle={mobileMenu.toggle} />
        </div>
      </div>
      {/* .navBar is `position: fixed` (out of flow) — this reserves the    */}
      {/* equivalent space right after the utility strip so content below  */}
      {/* doesn't jump up underneath it. */}
      <div aria-hidden="true" className={styles.spacer} />
      <MobileNav open={mobileMenu.open} onClose={mobileMenu.closePanel} />
    </header>
  );
}
