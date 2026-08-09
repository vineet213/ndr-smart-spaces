"use client";

import { useCallback, useEffect, useRef } from "react";
import { useId } from "react";
import { Icon } from "../ui/Icon";
import { VisuallyHidden } from "../ui/VisuallyHidden";
import { cx } from "../ui/cx";
import { isActivePath, type NavMenu } from "@/lib/data/navigation";
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

/**
 * The megamenu trigger. One dropdown may be open at a time — the active id is
 * owned by MainNav and passed down, so opening this item closes every other.
 * Hover opening runs a 150 ms intent delay; closing a short grace period. The
 * panel is driven exclusively by the `open` class (never CSS `:hover`), so the
 * visible state always matches `aria-expanded`.
 *
 * The trigger is a real link to the publication root (e.g. `/en/business`), so
 * clicking navigates there. A featured overview row leads each panel, then a
 * divider, then the child-link columns. Keyboard users open the panel with
 * ArrowDown and navigate with Enter.
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
  const triggerRef = useRef<HTMLAnchorElement>(null);
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
    (event: React.KeyboardEvent<HTMLAnchorElement>) => {
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
                {column.links.map((child) => {
                  const childActive = isActivePath(pathname, child.href);
                  return (
                    <li key={child.href}>
                      {child.external ? (
                        <a
                          className={cx(styles.link, childActive && styles.linkActive)}
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
                          className={cx(styles.link, childActive && styles.linkActive)}
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
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}
