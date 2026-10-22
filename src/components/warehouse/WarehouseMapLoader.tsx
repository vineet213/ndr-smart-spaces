"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import type { WarehouseMapProps } from "./WarehouseMap";
import styles from "./WarehouseMap.module.css";

const WarehouseMap = dynamic(() => import("./WarehouseMap"), { ssr: false });

/**
 * MapLibre and its tiles are heavy, so the map only loads as the section nears
 * the viewport. Until then (and if WebGL is unavailable) the frame shows a
 * quiet placeholder; the distance list beside it carries the same facts.
 */
export function WarehouseMapLoader(props: WarehouseMapProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "400px 0px", threshold: 0 });
  const [failed, setFailed] = useState(false);

  return (
    <div ref={ref} className={styles.frame}>
      {inView && !failed ? (
        <WarehouseMap {...props} onFailure={() => setFailed(true)} />
      ) : (
        <div className={styles.placeholder} aria-hidden="true">
          <span className={styles.placeholderPin} />
        </div>
      )}
    </div>
  );
}
