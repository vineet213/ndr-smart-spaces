"use client";

import { useState } from "react";
import NextImage, { type ImageProps } from "next/image";
import styles from "./FadeImage.module.css";
import { cx } from "./cx";

/**
 * Drop-in replacement for `next/image`: same props, but fades/sharpens in
 * on load (blurred + slightly scaled up → clear) instead of popping in the
 * instant bytes arrive. Pure CSS (filter/transform/opacity), so it adds no
 * network weight and doesn't affect layout — safe under `images.unoptimized`
 * (static export) since it only touches how an already-resolved image paints.
 */
export function FadeImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <NextImage
      className={cx(styles.img, loaded && styles.loaded, className)}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      {...props}
    />
  );
}
