"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { canonicalHref } from "@/lib/routes";
import { isActivePath, navItems } from "@/lib/data/navigation";
import type { MenuId } from "@/lib/data/navigation";
import { cx } from "../ui/cx";
import { MegaMenuButton } from "./MegaMenuButton";
import styles from "./MainNav.module.css";

type IndicatorRect = { left: number; width: number } | null;

export function MainNav() {
  const pathname = usePathname() ?? "";
  const [openMenuId, setOpenMenuId] = useState<MenuId | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState<IndicatorRect>(null);

  const openMenu = useCallback((id: MenuId) => setOpenMenuId(id), []);
  const closeMenu = useCallback(() => setOpenMenuId(null), []);

  /* One shared "liquid" indicator glides beneath whichever nav anchor is    */
  /* hovered/focused, tracked here by event delegation on the list — rather  */
  /* than each link/trigger owning its own static underline — so it works    */
  /* uniformly across plain links and MegaMenuButton's own trigger element   */
  /* without MainNav needing to know anything about how that one opens.      */
  const moveIndicatorTo = useCallback((target: EventTarget | null) => {
    const list = listRef.current;
    const anchor = target instanceof HTMLElement ? target.closest<HTMLElement>("[data-nav-anchor]") : null;
    if (!list || !anchor) return;
    const listRect = list.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    setIndicator({ left: anchorRect.left - listRect.left, width: anchorRect.width });
  }, []);

  const handleHoverMove = useCallback(
    (event: React.MouseEvent<HTMLUListElement> | React.FocusEvent<HTMLUListElement>) => {
      moveIndicatorTo(event.target);
    },
    [moveIndicatorTo],
  );

  const clearIndicator = useCallback(() => setIndicator(null), []);

  const handleListBlur = useCallback(
    (event: React.FocusEvent<HTMLUListElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) clearIndicator();
    },
    [clearIndicator],
  );

  return (
    <nav className={styles.nav} aria-label="Main">
      <ul
        ref={listRef}
        className={styles.list}
        onMouseOver={handleHoverMove}
        onMouseLeave={clearIndicator}
        onFocus={handleHoverMove}
        onBlur={handleListBlur}
      >
        {navItems.map((item) => {
          if (item.type === "link") {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href} className={styles.item}>
                <a
                  href={canonicalHref(item.href)}
                  className={cx(styles.link, active && styles.linkActive)}
                  aria-current={active ? "page" : undefined}
                  data-nav-anchor
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
              isActive={item.overview ? isActivePath(pathname, item.href) : false}
              pathname={pathname}
              open={openMenuId === item.id}
              onOpen={() => openMenu(item.id)}
              onClose={closeMenu}
            />
          );
        })}
        <span
          className={styles.indicator}
          aria-hidden="true"
          style={
            indicator
              ? { opacity: 1, transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }
              : { opacity: 0 }
          }
        />
      </ul>
    </nav>
  );
}
