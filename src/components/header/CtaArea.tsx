import { Button } from "../ui/Button";
import { TextLink } from "../ui/TextLink";
import { headerCta } from "@/lib/data/navigation";
import styles from "./CtaArea.module.css";

export function CtaArea() {
  return (
    <div className={styles.area}>
      <TextLink href={headerCta.investor.href} className={styles.investor}>
        {headerCta.investor.label}
      </TextLink>
      <Button href={headerCta.enquiry.href} className={styles.enquiry}>
        {headerCta.enquiry.label}
      </Button>
    </div>
  );
}
