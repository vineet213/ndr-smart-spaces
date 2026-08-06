import { useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { TextLink } from "../ui/TextLink";
import { VisuallyHidden } from "../ui/VisuallyHidden";
import { cx } from "../ui/cx";
import { headerCta, mobileMenuFooter, navItems, utilityStrip } from "@/lib/data/navigation";
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
                href={utilityStrip.invIT.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {utilityStrip.invIT.label}
                <Icon name="arrow-up-right" className={styles.utilityIcon} />
                <VisuallyHidden>Opens in a new tab</VisuallyHidden>
              </a>
              <a
                className={cx("text-label-meta", styles.utilityLink)}
                href={utilityStrip.email.href}
              >
                {utilityStrip.email.label}
              </a>
            </div>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Menu">
          <ul className={styles.list}>
            {navItems.map((item) =>
              item.type === "link" ? (
                <li key={item.href}>
                  <a className={styles.link} href={item.href} onClick={onClose}>
                    {item.label}
                  </a>
                </li>
              ) : (
                <li key={item.id}>
                  <a className={styles.link} href={item.href} onClick={onClose}>
                    {item.label}
                  </a>
                  <ul className={styles.subList}>
                    {item.columns
                      .flatMap((column) => column.links)
                      .map((child) => (
                        <li key={child.href}>
                          <a
                            className={styles.subLink}
                            href={child.href}
                            onClick={onClose}
                            {...(child.external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {child.label}
                            {child.external ? (
                              <Icon name="arrow-up-right" className={styles.externalIcon} />
                            ) : null}
                          </a>
                        </li>
                      ))}
                  </ul>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className={styles.ctas}>
          <TextLink
            tone="dark"
            href={headerCta.investor.href}
            onClick={onClose}
            className={styles.investorCta}
          >
            {headerCta.investor.label}
          </TextLink>
          <Button
            tone="dark"
            href={headerCta.enquiry.href}
            onClick={onClose}
            className={styles.enquiryCta}
          >
            {headerCta.enquiry.label}
          </Button>
        </div>

        <div className={styles.footer}>
          <p className={cx("text-label-meta", styles.footerHeading)}>{mobileMenuFooter.heading}</p>
          <ul className={styles.emails}>
            {mobileMenuFooter.emails.map((email) => (
              <li key={email.href}>
                <a className={styles.email} href={email.href} onClick={onClose}>
                  {email.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
