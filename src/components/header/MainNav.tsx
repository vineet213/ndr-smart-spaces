"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { isActivePath, navItems } from "@/lib/data/navigation";
import type { MenuId } from "@/lib/data/navigation";
import { cx } from "../ui/cx";
import { MegaMenuButton } from "./MegaMenuButton";
import styles from "./MainNav.module.css";

export function MainNav() {
  const pathname = usePathname() ?? "";
  const [openMenuId, setOpenMenuId] = useState<MenuId | null>(null);

  const openMenu = useCallback((id: MenuId) => setOpenMenuId(id), []);
  const closeMenu = useCallback(() => setOpenMenuId(null), []);

  return (
    <nav className={styles.nav} aria-label="Main">
      <ul className={styles.list}>
        {navItems.map((item) => {
          if (item.type === "link") {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href} className={styles.item}>
                <a
                  href={item.href}
                  className={cx(styles.link, active && styles.linkActive)}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={closeMenu}
                  onFocus={closeMenu}
                >
                  {item.label}
                </a>
              </li>
            );
          }
          return (
            <MegaMenuButton
              key={item.id}
              menu={item}
              isActive={isActivePath(pathname, item.href)}
              pathname={pathname}
              open={openMenuId === item.id}
              onOpen={() => openMenu(item.id)}
              onClose={closeMenu}
            />
          );
        })}
      </ul>
    </nav>
  );
}
