import { Button } from "../ui/Button";
import { headerCta } from "@/lib/data/navigation";
import { cx } from "../ui/cx";
import styles from "./CtaArea.module.css";

type CtaAreaProps = {
  scrolled?: boolean;
};

/**
 * The header's one call to action: a quiet outlined "Contact us" pill at the
 * end of the bar. The bar is always dark, so it uses the on-dark outline.
 */
export function CtaArea({ scrolled = false }: CtaAreaProps) {
  return (
    <div className={styles.area}>
      <span className={styles.contactWrap}>
        <Button
          href={headerCta.enquiry.href}
          variant="secondary"
          tone="dark"
          className={cx(styles.contactButton, scrolled && styles.contactButtonScrolled)}
        >
          {headerCta.enquiry.label}
        </Button>
      </span>
    </div>
  );
}
