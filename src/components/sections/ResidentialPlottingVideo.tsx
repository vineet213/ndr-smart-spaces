"use client";

import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import styles from "./VerticalPage.module.css";

const SOURCES = {
  desktop: "/videos/residential-plotting/masthead.mp4",
  // 640px / 30fps encode: ~2 MB instead of ~27 MB
  mobile: "/videos/residential-plotting/masthead-mobile.mp4",
} as const;
const POSTER_SRC = "/videos/residential-plotting/masthead-poster.jpg";

/**
 * Framed video panel for the Residential Plotting vertical, placed below the
 * "From Land to Community" section. Playback behavior (autoplay/loop vs.
 * reduced-motion static frame) is handled by `useAutoplayVideo`.
 */
export function ResidentialPlottingVideo() {
  const { videoRef, motionAllowed, autoplayBlocked } = useAutoplayVideo(SOURCES);

  return (
    <div className={styles.videoFrame}>
      <video
        ref={videoRef}
        className={styles.videoEl}
        poster={POSTER_SRC}
        muted
        loop={motionAllowed}
        playsInline
        controls={autoplayBlocked}
        preload="none"
      />
    </div>
  );
}
