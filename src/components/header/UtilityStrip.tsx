import { cx } from "../ui/cx";
import { utilityStrip } from "@/lib/data/navigation";
import styles from "./UtilityStrip.module.css";

export function UtilityStrip() {
  return (
    <div className={styles.strip}>
      <div className={cx("container", styles.inner)}>
        <p className={cx("text-label-meta", styles.entity)}>{utilityStrip.entity}</p>
        <div className={styles.links}>
          <a className={cx("text-label-meta", styles.link)} href={utilityStrip.email.href}>
            {utilityStrip.email.label}
          </a>
        </div>
      </div>
    </div>
  );
}
