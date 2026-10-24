import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { canonicalHref } from "@/lib/routes";
import { cultureClosing } from "@/lib/data/careers";
import styles from "./CultureClosing.module.css";

/**
 * The page's last word: a full-width slot for the closing film or image
 * (until the client supplies it, a marked placeholder), then one large link
 * to the open roles.
 */
export function CultureClosing() {
  return (
    <section className={styles.section} aria-label="Join NDR">
      <div className={styles.media}>
        <p className={styles.placeholder}>{cultureClosing.placeholder}</p>
      </div>

      <Link href={canonicalHref(cultureClosing.cta.href)} className={styles.cta}>
        <span className={styles.line}>{cultureClosing.line}</span>
        <span className={styles.action}>
          {cultureClosing.cta.label}
          <Icon name="arrow-right" />
        </span>
      </Link>
    </section>
  );
}
