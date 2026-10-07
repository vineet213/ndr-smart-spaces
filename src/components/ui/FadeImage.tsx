"use client";

import { useState } from "react";
import NextImage, { type ImageProps } from "next/image";
import styles from "./FadeImage.module.css";
import { cx } from "./cx";

/**
 * Drop-in replacement for `next/image`: same props, but below-the-fold images
 * fade/sharpen in on load (blurred + slightly scaled up → clear) instead of
 * popping in the instant bytes arrive. Pure CSS (filter/transform/opacity), so
 * it adds no network weight and doesn't affect layout.
 *
 * Images flagged `priority` / `loading="eager"` (the above-the-fold ones) skip
 * the effect entirely: the fade is switched on by React's `onLoad`, so applying
 * it to them would keep the hero artwork invisible until the whole JS bundle had
 * downloaded and hydrated — on a phone that is the largest contentful paint.
 */
export function FadeImage({ className, onLoad, priority, loading, preload, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const eager = Boolean(priority || preload) || loading === "eager";

  return (
    <NextImage
      className={cx(!eager && styles.img, !eager && loaded && styles.loaded, className)}
      priority={priority}
      preload={preload}
      loading={loading}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      {...props}
    />
  );
}
