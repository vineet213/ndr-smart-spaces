"use client";

import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import styles from "./DevelopmentLifecycle.module.css";

const SOURCES = {
  desktop: "/videos/development-lifecycle/final-product.mp4",
  // 640px / 30fps encode: ~5 MB instead of ~31 MB
  mobile: "/videos/development-lifecycle/final-product-mobile.mp4",
} as const;
const POSTER_SRC = "/videos/development-lifecycle/final-product-poster.jpg";

/**
 * 3D render of the finished logistics park for the "A peak into the final
 * product" section. Playback (autoplay/loop vs. reduced-motion static frame)
 * is handled by `useAutoplayVideo`, same as the Residential Plotting video.
 */
export function FinalProductVideo() {
  const { videoRef, motionAllowed, autoplayBlocked } = useAutoplayVideo(SOURCES);

  return (
    <video
      ref={videoRef}
      className={styles.plateVideo}
      poster={POSTER_SRC}
      muted
      loop={motionAllowed}
      playsInline
      controls={autoplayBlocked}
      preload="none"
    />
  );
}
