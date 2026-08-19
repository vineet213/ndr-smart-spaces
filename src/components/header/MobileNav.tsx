import { useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";
import { headerCta, mobileMenuFooter, mobileNavItems, utilityStrip } from "@/lib/data/navigation";
import styles from "./MobileNav.module.css";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open, onClose);
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
          <button type="button" className={styles.close} aria-label="Close menu" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Site">
          <ul className={styles.list}>
            {mobileNavItems.map((item) =>
              item.type === "link" ? (
                <li key={item.href}>
                  <a className={styles.link} href={item.href} onClick={onClose}>
                    {item.label}
                    <Icon name="arrow-right" className={styles.linkIcon} />
                  </a>
                </li>
              ) : (
                <li key={item.id}>
                  <a className={styles.link} href={item.href} onClick={onClose}>
                    {item.label}
                    <Icon name="chevron-down" className={styles.linkIcon} />
                  </a>
                  <div className={styles.groups}>
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
                                href={link.href}
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
