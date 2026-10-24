import Link from "next/link";
import { Icon } from "../ui";
import { headerCta } from "@/lib/data/navigation";
import styles from "./CtaArea.module.css";

/**
 * The header's one call to action: "Contact us" set like a menu item, in gold
 * with an arrow and a thin divider before it, so it belongs to the bar while
 * still reading as the way to get in touch.
 */
export function CtaArea() {
  return (
    <div className={styles.area}>
      <Link href={headerCta.enquiry.href} className={styles.contact}>
        {headerCta.enquiry.label}
        <Icon name="arrow-right" size="sm" className={styles.arrow} />
      </Link>
    </div>
  );
}
