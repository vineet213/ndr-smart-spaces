import Image from "next/image";
import { siteHome } from "@/lib/data/navigation";
import styles from "./LogoWordmark.module.css";

export function LogoWordmark() {
  return (
    <a href={siteHome} className={styles.link} aria-label="NDR Smart Spaces — home">
      <Image
        src="/logos/ndr-smart-spaces-lockup.svg"
        alt=""
        width={175}
        height={40}
        className={styles.logo}
      />
    </a>
  );
}
