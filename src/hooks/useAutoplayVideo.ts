"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Drives a full-bleed background `<video>`: plays it muted and looped unless
 * the user has requested reduced motion, in which case it never autoplays
 * and simply holds on its own first frame — a static fallback drawn from the
 * same footage rather than a separate image. Attach `videoRef` to the
 * `<video>` element and use `motionAllowed` for the `loop` attribute.
 */
export function useAutoplayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setMotionAllowed(!event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (motionAllowed) {
      video.play().catch(() => {
        /* Autoplay can be rejected by the browser; the first frame still shows. */
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [motionAllowed]);

  return { videoRef, motionAllowed };
}
