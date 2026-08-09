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
  const scrolled = useScrolled(4);
  const mobileMenu = useDisclosure(false);

  return (
    <header className={styles.header}>
      <UtilityStrip />
      <div className={cx(styles.navBar, scrolled && styles.navBarScrolled)}>
        <div className={styles.navContainer}>
          <LogoWordmark />
          <MainNav />
          <CtaArea />
          <MenuButton open={mobileMenu.open} onToggle={mobileMenu.toggle} />
        </div>
      </div>
      <MobileNav open={mobileMenu.open} onClose={mobileMenu.closePanel} />
    </header>
  );
}
