import { useEffect, useRef, useState } from "react";
import { useId } from "react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Icon } from "../ui/Icon";
import { VisuallyHidden } from "../ui/VisuallyHidden";
import { cx } from "../ui/cx";
import { isActivePath, type NavMenu } from "@/lib/data/navigation";
import styles from "./MegaMenu.module.css";

type MegaMenuButtonProps = {
  menu: NavMenu;
  isActive: boolean;
  pathname: string;
};

export function MegaMenuButton({ menu, isActive, pathname }: MegaMenuButtonProps) {
  const { open, toggle, setOpen } = useDisclosure(false);
  const [suppressed, setSuppressed] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 80rem)").matches) return;

    const node = itemRef.current;
    const onPointerDown = (event: PointerEvent) => {
      if (node && !node.contains(event.target as Node)) {
        setSuppressed(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSuppressed(true);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [setOpen]);

  const handleTriggerClick = () => {
    setSuppressed(false);
    toggle();
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSuppressed(false);
      toggle();
    }
  };

  const handleFocusCapture = (event: React.FocusEvent<HTMLLIElement>) => {
    const target = event.target as Element;
    if (target !== triggerRef.current) {
      setSuppressed(false);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget as Node | null;
    if (itemRef.current && next && itemRef.current.contains(next)) return;
    setOpen(false);
  };

  const handleMouseEnter = () => {
    setSuppressed(false);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (itemRef.current && !itemRef.current.contains(document.activeElement)) {
      setOpen(false);
    }
  };

  return (
    <li
      ref={itemRef}
      className={cx(styles.item, open && styles.itemOpen, suppressed && styles.itemSuppressed)}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cx(styles.trigger, isActive && styles.triggerActive)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        {menu.label}
        <Icon name="chevron-down" className={styles.chevron} />
      </button>

      <div
        id={panelId}
        role="region"
        aria-label={menu.label}
        className={cx(styles.panel, menu.align === "right" ? styles.panelRight : styles.panelLeft)}
      >
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
