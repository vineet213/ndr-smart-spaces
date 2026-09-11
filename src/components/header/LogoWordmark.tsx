import Image from "next/image";
import { canonicalHref } from "@/lib/routes";
import { siteHome } from "@/lib/data/navigation";
import styles from "./LogoWordmark.module.css";

export function LogoWordmark() {
  return (
    <a href={canonicalHref(siteHome)} className={styles.link} aria-label="NDR Smart Spaces — home">
      <Image
        src="/logos/ndr-smart-spaces-lockup.svg"
        alt=""
        width={190}
        height={43}
        className={styles.logo}
      />
    </a>
  );
}
