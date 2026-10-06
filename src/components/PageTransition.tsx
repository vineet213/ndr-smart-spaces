"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./PageTransition.module.css";

/**
 * A soft cross-fade/rise on every route change instead of the default hard
 * cut. Keyed on the pathname so React remounts the subtree on navigation,
 * which re-triggers the CSS mount animation below — no transition library,
 * no risk to the static export build.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className={styles.fade}>
      {children}
    </div>
  );
}
