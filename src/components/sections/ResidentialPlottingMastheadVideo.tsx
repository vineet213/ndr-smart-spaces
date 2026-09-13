"use client";

import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import styles from "./VerticalPage.module.css";

const VIDEO_SRC = "/videos/residential-plotting/masthead.mp4";

/**
 * Full-bleed masthead background for the Residential Plotting vertical.
 * Playback behavior (autoplay/loop vs. reduced-motion static frame) is
 * handled by `useAutoplayVideo`.
 */
export function ResidentialPlottingMastheadVideo() {
  const { videoRef, motionAllowed } = useAutoplayVideo();

  return (
    <div className={styles.mastheadVideo} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.mastheadVideoEl}
        src={VIDEO_SRC}
        muted
        loop={motionAllowed}
        playsInline
        preload="auto"
      />
      <span className={styles.mastheadVideoScrim} />
    </div>
  );
}
