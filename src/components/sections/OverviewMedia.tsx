"use client";

import { useEffect, useRef } from "react";
import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Reveal } from "./Reveal";
import styles from "./CompanyOverview.module.css";

type OverviewMediaProps = {
  src: string;
  alt: string;
};

/* The overview photograph: an offset gold frame behind it, a slow parallax   */
/* drift as the page scrolls, and two glass chips with the company's headline */
/* facts floating over its corners.                                            */
export function OverviewMedia({ src, alt }: OverviewMediaProps) {
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = mediaRef.current;
    const layer = layerRef.current;
    if (!media || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const box = media.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (box.bottom < 0 || box.top > viewport) return;
      // -1 when the photo enters at the bottom, +1 when it leaves at the top
      const progress =
        (viewport / 2 - (box.top + box.height / 2)) / (viewport / 2 + box.height / 2);
      layer.style.transform = `translate3d(0, ${(progress * 6).toFixed(2)}%, 0) scale(1.14)`;
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.mediaWrap}>
      <span className={styles.mediaFrame} aria-hidden="true" />
      <Reveal variant="unmask" className={styles.mediaReveal}>
        <div ref={mediaRef} className={styles.media}>
          <div ref={layerRef} className={styles.mediaLayer}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 767px) 100vw, 40vw"
              className={styles.mediaImage}
            />
          </div>
        </div>
      </Reveal>
      <div className={`${styles.chip} ${styles.chipTop}`}>
        <span className={styles.chipLabel}>Since</span>{" "}
        <span className={styles.chipValue}>1954</span>
      </div>
      <div className={`${styles.chip} ${styles.chipBottom}`}>
        <span className={styles.chipLabel}>Under management</span>{" "}
        <span className={styles.chipValue}>23 Mn sq ft</span>
      </div>
    </div>
  );
}
