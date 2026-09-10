"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Icon } from "../ui/Icon";
import { VisuallyHidden } from "../ui/VisuallyHidden";
import { cx } from "../ui/cx";
import { isActivePath, type MenuLink, type NavMenu } from "@/lib/data/navigation";
import styles from "./MegaMenu.module.css";

const OPEN_INTENT_MS = 150;
const CLOSE_GRACE_MS = 80;

type MegaMenuButtonProps = {
  menu: NavMenu;
  isActive: boolean;
  pathname: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

type SubmenuLinkProps = {
  link: MenuLink;
  pathname: string;
};

/**
 * A column link that fans out its `children` into a side popup. The parent
 * stays a real link; the popup opens on hover/focus and follows the same
 * open/close contract as the menu itself (visibility is never CSS-only).
 */
function SubmenuLink({ link, pathname }: SubmenuLinkProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submenuId = useId();
  const [open, setOpen] = useState(false);

  const linkActive = isActivePath(pathname, link.href);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openSubmenu = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const closeSubmenu = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setOpen(false);
    }, CLOSE_GRACE_MS);
  }, [cancelClose]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSubmenu();
        setOpen(false);
        linkRef.current?.focus();
      }
    },
    [closeSubmenu],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLLIElement>) => {
      const next = event.relatedTarget as Node | null;
      if (rowRef.current && next && rowRef.current.contains(next)) return;
      cancelClose();
      setOpen(false);
    },
    [cancelClose],
  );

  return (
    <li
      ref={rowRef}
      className={cx(styles.linkWithMenu, open && styles.linkWithMenuOpen)}
      onMouseEnter={openSubmenu}
      onMouseLeave={closeSubmenu}
      onBlurCapture={handleBlur}
    >
      <a
        ref={linkRef}
        href={link.href}
        className={cx(styles.link, linkActive && styles.linkActive)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={submenuId}
        onKeyDown={handleKeyDown}
      >
        {link.label}
        <Icon name="chevron-right" className={styles.linkCaret} />
      </a>
      <ul id={submenuId} className={styles.submenu} aria-label={`${link.label} submenu`}>
        {link.children?.map((child) => {
          const childActive = isActivePath(pathname, child.href);
          return (
            <li key={child.href}>
              {child.external ? (
                <a
                  className={cx(styles.submenuLink, childActive && styles.linkActive)}
                  href={child.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {child.label}
                  <Icon name="arrow-up-right" className={styles.externalIcon} />
                  <VisuallyHidden>Opens in a new tab</VisuallyHidden>
                </a>
              ) : (
                <a
                  className={cx(styles.submenuLink, childActive && styles.linkActive)}
                  href={child.href}
                  aria-current={childActive ? "page" : undefined}
                >
                  {child.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}

/**
 * The megamenu trigger. One dropdown may be open at a time — the active id is
 * owned by MainNav and passed down, so opening this item closes every other.
 * Hover opening runs a 150 ms intent delay; closing a short grace period. The
 * panel is driven exclusively by the `open` class (never CSS `:hover`), so the
 * visible state always matches `aria-expanded`.
 *
 * Trigger with an overview: a real link to the publication root (e.g.
 * `/en/investor-centre`), whose panel leads with a featured overview row, then
 * a divider, then the child-link columns. Trigger without an overview (e.g.
 * Business): a plain button that only opens the panel — it never navigates.
 * Keyboard users open the panel with ArrowDown and navigate with Enter.
 */
export function MegaMenuButton({
  menu,
  isActive,
  pathname,
  open,
  onOpen,
  onClose,
}: MegaMenuButtonProps) {
  const itemRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressRef = useRef(false);
  const panelId = useId();

  const cancelOpen = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const clearTimers = useCallback(() => {
    cancelOpen();
    cancelClose();
  }, [cancelOpen, cancelClose]);

  const openNow = useCallback(() => {
    suppressRef.current = false;
    clearTimers();
    onOpen();
  }, [onOpen, clearTimers]);

  const openIntent = useCallback(() => {
    if (suppressRef.current) return;
    cancelClose();
    if (open) return;
    cancelOpen();
    openTimer.current = setTimeout(() => {
      openTimer.current = null;
      onOpen();
    }, OPEN_INTENT_MS);
  }, [open, onOpen, cancelOpen, cancelClose]);

  const closeIntent = useCallback(() => {
    cancelOpen();
    const node = itemRef.current;
    if (node && node.contains(document.activeElement)) return;
    cancelClose();
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      onClose();
    }, CLOSE_GRACE_MS);
  }, [onClose, cancelOpen, cancelClose]);

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        suppressRef.current = true;
        clearTimers();
        onClose();
        triggerRef.current?.focus();
      } else if (event.key === "ArrowDown" && !open) {
        event.preventDefault();
        openNow();
      }
    },
    [onClose, openNow, open, clearTimers],
  );

  const handleFocusCapture = useCallback(
    (event: React.FocusEvent<HTMLLIElement>) => {
      const target = event.target as Element;
      if (target !== triggerRef.current) {
        openNow();
      }
    },
    [openNow],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLLIElement>) => {
      const next = event.relatedTarget as Node | null;
      if (itemRef.current && next && itemRef.current.contains(next)) return;
      clearTimers();
      onClose();
    },
    [onClose, clearTimers],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 80rem)").matches) return;

    const onPointerDown = (event: PointerEvent) => {
      const node = itemRef.current;
      if (node && !node.contains(event.target as Node)) {
        suppressRef.current = false;
        clearTimers();
        onClose();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [onClose, clearTimers]);

  return (
    <li
      ref={itemRef}
      className={cx(styles.item, open && styles.itemOpen)}
      onMouseEnter={openIntent}
      onMouseLeave={closeIntent}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlur}
    >
      {menu.overview ? (
        <a
          ref={triggerRef}
          href={menu.href}
          className={cx(styles.trigger, isActive && styles.triggerActive)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={panelId}
          onKeyDown={handleTriggerKeyDown}
        >
          {menu.label}
          <Icon name="chevron-down" className={styles.chevron} />
        </a>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          className={cx(styles.trigger, isActive && styles.triggerActive)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={panelId}
          onKeyDown={handleTriggerKeyDown}
        >
          {menu.label}
          <Icon name="chevron-down" className={styles.chevron} />
        </button>
      )}

      <div
        id={panelId}
        role="region"
        aria-label={menu.label}
        className={cx(styles.panel, menu.align === "right" ? styles.panelRight : styles.panelLeft)}
      >
        {menu.overview ? (
          <div className={styles.overview}>
            <a
              href={menu.overview.href}
              className={cx(
                styles.overviewLink,
                isActivePath(pathname, menu.overview.href) && styles.overviewLinkActive,
              )}
            >
              <span className={styles.overviewLabel}>{menu.overview.label}</span>
              <span className={styles.overviewTagline}>{menu.overview.tagline}</span>
            </a>
          </div>
        ) : null}
        <div className={styles.columns}>
          {menu.columns.map((column) => (
            <div key={column.heading} className={styles.column}>
              <p className={cx("text-label-meta", styles.heading)}>{column.heading}</p>
              <ul className={styles.links}>
                {column.links.map((child) =>
                  child.children && child.children.length > 0 ? (
                    <SubmenuLink key={child.href} link={child} pathname={pathname} />
                  ) : (
                    <li key={child.href}>
                      {child.external ? (
                        <a
                          className={cx(
                            styles.link,
                            isActivePath(pathname, child.href) && styles.linkActive,
                          )}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {child.label}
                          <Icon name="arrow-up-right" className={styles.externalIcon} />
                          <VisuallyHidden>Opens in a new tab</VisuallyHidden>
                        </a>
                      ) : (
                        <a
                          className={cx(
                            styles.link,
                            isActivePath(pathname, child.href) && styles.linkActive,
                          )}
                          href={child.href}
                          aria-current={isActivePath(pathname, child.href) ? "page" : undefined}
                        >
                          {child.label}
                        </a>
                      )}
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}
