import { Icon } from "../ui/Icon";
import { VisuallyHidden } from "../ui/VisuallyHidden";
import { cx } from "../ui/cx";
import { utilityStrip } from "@/lib/data/navigation";
import styles from "./UtilityStrip.module.css";

export function UtilityStrip() {
  return (
    <div className={styles.strip}>
      <div className={cx("container", styles.inner)}>
        <p className={cx("text-label-meta", styles.entity)}>{utilityStrip.entity}</p>
        <div className={styles.links}>
          <a
            className={cx("text-label-meta", styles.link)}
            href={utilityStrip.invIT.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {utilityStrip.invIT.label}
            <Icon name="arrow-up-right" className={styles.externalIcon} />
            <VisuallyHidden>Opens in a new tab</VisuallyHidden>
          </a>
          <a className={cx("text-label-meta", styles.link)} href={utilityStrip.email.href}>
            {utilityStrip.email.label}
          </a>
        </div>
      </div>
    </div>
  );
}
