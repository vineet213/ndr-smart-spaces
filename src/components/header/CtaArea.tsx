import { Button } from "../ui/Button";
import { headerCta } from "@/lib/data/navigation";
import { cx } from "../ui/cx";
import styles from "./CtaArea.module.css";

type CtaAreaProps = {
  scrolled?: boolean;
};

export function CtaArea({ scrolled = false }: CtaAreaProps) {
  return (
    <div className={styles.area}>
      <span className={styles.enquiryWrap}>
        <Button
          href={headerCta.enquiry.href}
          tone={scrolled ? "dark" : "light"}
          className={cx(styles.enquiryButton, scrolled && styles.enquiryButtonScrolled)}
        >
          {headerCta.enquiry.label}
        </Button>
      </span>
    </div>
  );
}
