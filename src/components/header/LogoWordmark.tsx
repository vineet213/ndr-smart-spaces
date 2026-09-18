import Image from "next/image";
import { canonicalHref } from "@/lib/routes";
import { siteHome } from "@/lib/data/navigation";
import { cx } from "../ui/cx";
import styles from "./LogoWordmark.module.css";

type LogoWordmarkProps = {
  /** Shrinks the mark slightly for the condensed scrolled pill. */
  scrolled?: boolean;
  /** Whether to show the ivory lockup, for use on a dark background. */
  light?: boolean;
};

export function LogoWordmark({ scrolled = false, light = false }: LogoWordmarkProps) {
  return (
    <a
      href={canonicalHref(siteHome)}
      className={cx(styles.link, scrolled && styles.linkScrolled)}
      aria-label="NDR Smart Spaces — home"
    >
      <Image
        src={light ? "/logos/ndr-smart-spaces-lockup-light.svg" : "/logos/ndr-smart-spaces-lockup.svg"}
        alt=""
        width={190}
        height={43}
        className={styles.logo}
      />
    </a>
  );
}
