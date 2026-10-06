"use client";

import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import styles from "./VerticalPage.module.css";

const VIDEO_SRC = "/videos/residential-plotting/masthead.mp4";

/**
 * Framed video panel for the Residential Plotting vertical, placed below the
 * "From Land to Community" section. Playback behavior (autoplay/loop vs.
 * reduced-motion static frame) is handled by `useAutoplayVideo`.
 */
export function ResidentialPlottingVideo() {
  const { videoRef, motionAllowed } = useAutoplayVideo();

  return (
    <div className={styles.videoFrame}>
      <video
        ref={videoRef}
        className={styles.videoEl}
        src={VIDEO_SRC}
        muted
        loop={motionAllowed}
        playsInline
        preload="auto"
      />
    </div>
  );
}
