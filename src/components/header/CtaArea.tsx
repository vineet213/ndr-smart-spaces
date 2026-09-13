import { Button } from "../ui/Button";
import { headerCta } from "@/lib/data/navigation";
import styles from "./CtaArea.module.css";

export function CtaArea() {
  return (
    <div className={styles.area}>
      <span className={styles.enquiryWrap}>
        <Button href={headerCta.enquiry.href}>{headerCta.enquiry.label}</Button>
      </span>
    </div>
  );
}
