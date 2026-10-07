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
 *
 * Playback only runs while the video is (nearly) on screen: with `preload="none"`
 * the file isn't fetched at all until the visitor scrolls close to it, and it
 * pauses again when it leaves — a phone should never download or decode tens of
 * megabytes of footage that sits twenty screens down the page.
 *
 * Pass `sources` to serve a much smaller encode on phones. The `<video>` is rendered
 * without a `src`; the hook assigns the right one the first time it nears the viewport,
 * so nothing is fetched (and SSR output carries no file URL) before then.
 *
 * `autoplayBlocked` is true when the browser refused to start playback (iOS Low
 * Power Mode, data-saver); render native `controls` then so the video is never
 * a dead frame.
 */
type VideoSources = { desktop: string; mobile: string };

export function useAutoplayVideo(sources?: VideoSources) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(() => !prefersReducedMotion());
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setMotionAllowed(!event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!motionAllowed) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (sources && !video.getAttribute("src")) {
            const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
              .connection;
            const small =
              window.matchMedia("(max-width: 767px)").matches || connection?.saveData === true;
            video.src = small ? sources.mobile : sources.desktop;
          }
          video.play().then(
            () => setAutoplayBlocked(false),
            () => setAutoplayBlocked(true),
          );
        } else {
          video.pause();
        }
      },
      { rootMargin: "150px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [motionAllowed, sources]);

  return { videoRef, motionAllowed, autoplayBlocked };
}
