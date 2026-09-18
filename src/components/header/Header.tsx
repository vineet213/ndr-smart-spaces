"use client";

import { useScrolled } from "@/hooks/useScrolled";
import { useDisclosure } from "@/hooks/useDisclosure";
import { cx } from "../ui/cx";
import { UtilityStrip } from "./UtilityStrip";
import { LogoWordmark } from "./LogoWordmark";
import { MainNav } from "./MainNav";
import { CtaArea } from "./CtaArea";
import { MenuButton } from "./MenuButton";
import { MobileNav } from "./MobileNav";
import styles from "./Header.module.css";

export function Header() {
  const scrolled = useScrolled(40);
  const mobileMenu = useDisclosure(false);

  return (
    <header className={styles.header}>
      {/* Normal document flow — scrolls away naturally, is not part of the */}
      {/* fixed nav below. */}
      <UtilityStrip />
      <div className={cx(styles.navBar, scrolled && styles.navBarScrolled)}>
        <div className={styles.navContainer}>
          <LogoWordmark scrolled={scrolled} light />
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
