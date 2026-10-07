import { useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";
import { canonicalHref } from "@/lib/routes";
import {
  headerCta,
  isActivePath,
  mobileMenuFooter,
  mobileNavItems,
  utilityStrip,
  type NavMenu,
} from "@/lib/data/navigation";
import styles from "./MobileNav.module.css";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

/** True when the current page is the menu's own page or one of its links. */
function menuIsActive(menu: NavMenu, pathname: string): boolean {
  const hrefs = menu.columns.flatMap((column) =>
    column.links.flatMap((link) => [link.href, ...(link.children?.map((c) => c.href) ?? [])]),
  );
  return [menu.href, ...hrefs].some((href) => isActivePath(pathname, href));
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const idBase = useId();
  const pathname = (usePathname() ?? "").replace(/\/+$/, "") || "/en";

  // Accordion state: groups the visitor toggled; the section they are in starts open.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const isExpanded = (menu: NavMenu) => toggled[menu.id] ?? menuIsActive(menu, pathname);
  const toggleMenu = (menu: NavMenu) =>
    setToggled((current) => ({ ...current, [menu.id]: !isExpanded(menu) }));

  useFocusTrap(panelRef, open, onClose, closeRef);
  useBodyScrollLock(open);

  return (
    <div
      id="site-menu"
      className={cx(styles.wrapper, open && styles.wrapperOpen)}
      aria-hidden={!open}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-label="Site menu"
        className={styles.panel}
      >
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <p className={cx("text-label-meta", styles.entity)}>{utilityStrip.entity}</p>
            <div className={styles.utilityLinks}>
              <a
                className={cx("text-label-meta", styles.utilityLink)}
                href={utilityStrip.email.href}
              >
                {utilityStrip.email.label}
              </a>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Site">
          <ul className={styles.list}>
            {mobileNavItems.map((item) =>
              item.type === "link" ? (
                <li key={item.href}>
                  <a className={styles.link} href={canonicalHref(item.href)} onClick={onClose}>
                    {item.label}
                    <Icon name="arrow-right" className={styles.linkIcon} />
                  </a>
                </li>
              ) : (
                <li key={item.id}>
                  <div className={styles.row}>
                    {item.overview ? (
                      <a className={styles.link} href={canonicalHref(item.href)} onClick={onClose}>
                        {item.label}
                      </a>
                    ) : null}
                    <button
                      type="button"
                      className={cx(styles.link, item.overview ? styles.toggle : styles.toggleRow)}
                      aria-expanded={isExpanded(item)}
                      aria-controls={`${idBase}-${item.id}`}
                      aria-label={item.overview ? `Toggle ${item.label} links` : undefined}
                      onClick={() => toggleMenu(item)}
                    >
                      {item.overview ? null : item.label}
                      <Icon
                        name="chevron-down"
                        className={cx(styles.linkIcon, isExpanded(item) && styles.linkIconOpen)}
                      />
                    </button>
                  </div>
                  <div
                    id={`${idBase}-${item.id}`}
                    className={styles.groups}
                    hidden={!isExpanded(item)}
                  >
                    {item.columns.map((column) => (
                      <div key={column.heading} className={styles.group}>
                        <p className={cx("text-label-meta", styles.groupHeading)}>
                          {column.heading}
                        </p>
                        <ul className={styles.subList}>
                          {column.links.map((link) => (
                            <li key={link.href}>
                              <a
                                className={styles.subLink}
                                href={canonicalHref(link.href)}
                                onClick={onClose}
                                {...(link.external
                                  ? { target: "_blank", rel: "noopener noreferrer" }
                                  : {})}
                              >
                                {link.label}
                                {link.external && (
                                  <Icon name="arrow-up-right" className={styles.externalIcon} />
                                )}
                              </a>
                              {Boolean(link.children && link.children.length > 0) && (
                                <ul className={styles.childList}>
                                  {link.children!.map((child) => (
                                    <li key={child.href}>
                                      <a
                                        className={styles.childLink}
                                        href={canonicalHref(child.href)}
                                        onClick={onClose}
                                        {...(child.external
                                          ? { target: "_blank", rel: "noopener noreferrer" }
                                          : {})}
                                      >
                                        {child.label}
                                        {child.external && (
                                          <Icon
                                            name="arrow-up-right"
                                            className={styles.externalIcon}
                                          />
                                        )}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className={styles.ctas}>
          <Button
            href={headerCta.enquiry.href}
            tone="dark"
            className={styles.enquiryCta}
            onClick={onClose}
          >
            {headerCta.enquiry.label}
          </Button>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerHeading}>{mobileMenuFooter.heading}</p>
          <div className={styles.emails}>
            {mobileMenuFooter.emails.map((email) => (
              <a key={email} className={styles.email} href={`mailto:${email}`}>
                {email}
              </a>
            ))}
          </div>
          {mobileMenuFooter.notes.map((note) => (
            <p key={note} className={styles.footerNote}>
              {note}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
