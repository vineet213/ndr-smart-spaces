import { Button } from "../ui/Button";
import { headerCta } from "@/lib/data/navigation";
import styles from "./CtaArea.module.css";

export function CtaArea() {
  return (
    <div className={styles.area}>
      <Button href={headerCta.enquiry.href} className={styles.enquiry}>
        {headerCta.enquiry.label}
      </Button>
    </div>
  );
}
