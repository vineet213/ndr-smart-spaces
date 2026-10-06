"use client";

import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import styles from "./DevelopmentLifecycle.module.css";

const VIDEO_SRC = "/videos/development-lifecycle/final-product.mp4";
const POSTER_SRC = "/videos/development-lifecycle/final-product-poster.jpg";

/**
 * 3D render of the finished logistics park for the "A peak into the final
 * product" section. Playback (autoplay/loop vs. reduced-motion static frame)
 * is handled by `useAutoplayVideo`, same as the Residential Plotting video.
 */
export function FinalProductVideo() {
  const { videoRef, motionAllowed } = useAutoplayVideo();

  return (
    <video
      ref={videoRef}
      className={styles.plateVideo}
      src={VIDEO_SRC}
      poster={POSTER_SRC}
      muted
      loop={motionAllowed}
      playsInline
      preload="metadata"
    />
  );
}
