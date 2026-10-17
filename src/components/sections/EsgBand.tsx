"use client";

import { useEffect, useRef } from "react";
import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container } from "@/components/layout";
import { Heading } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import styles from "./EsgBand.module.css";

type EsgBandProps = {
  id: string;
  heading: string;
  lede: string;
  image: { src: string; alt: string };
  align?: "left" | "right";
};

/**
 * A full-bleed photo band that opens an ESG section: the photo drifts slowly as
 * the page scrolls and settles from a slight zoom when it first appears, under
 * a dark gradient that carries the heading and lede. The section's content then
 * overlaps the band's lower edge (handled by the host section).
 */
export function EsgBand({ id, heading, lede, image, align = "left" }: EsgBandProps) {
  const { ref: bandRef, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const layerRef = useRef<HTMLDivElement | null>(null);

  /* Parallax: one read per frame, transform only; band height measured once. */
  useEffect(() => {
    const band = bandRef.current;
    const layer = layerRef.current;
    if (!band || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const box = band.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (box.bottom < 0 || box.top > viewport) return;
      // -1 as the band enters at the bottom, +1 as it leaves at the top
      const progress =
        (viewport / 2 - (box.top + box.height / 2)) / (viewport / 2 + box.height / 2);
      layer.style.transform = `translate3d(0, ${(progress * 7).toFixed(2)}%, 0)`;
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
  }, [bandRef]);

  return (
    <div
      ref={bandRef}
      className={cx(styles.band, align === "right" && styles.alignRight, inView && styles.inView)}
    >
      <div ref={layerRef} className={styles.layer} aria-hidden="true">
        <div className={styles.zoom}>
          <Image src={image.src} alt="" fill sizes="100vw" className={styles.photo} />
        </div>
      </div>
      <span className={styles.shade} aria-hidden="true" />

      <Container className={styles.content}>
        <div className={styles.text}>
          <Reveal variant="wipe">
            <Heading variant="section" tone="dark" id={id} className={styles.heading}>
              {heading}
            </Heading>
          </Reveal>
          <p className={styles.lede}>{lede}</p>
        </div>
      </Container>
    </div>
  );
}
