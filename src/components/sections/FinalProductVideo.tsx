"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { pickVideoSource, useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import styles from "./DevelopmentLifecycle.module.css";

const SOURCES = {
  desktop: "/videos/development-lifecycle/final-product.mp4",
  // 640px / 30fps encode: ~5 MB instead of ~37 MB
  mobile: "/videos/development-lifecycle/final-product-mobile.mp4",
} as const;
const POSTER_SRC = "/videos/development-lifecycle/final-product-poster.jpg";

type Quality = "auto" | "high" | "low";

const QUALITY_OPTIONS: ReadonlyArray<{ value: Quality; label: string; hint: string }> = [
  { value: "auto", label: "Auto", hint: "Matches your device" },
  { value: "high", label: "High quality", hint: "Full resolution" },
  { value: "low", label: "Data saver", hint: "Smaller file" },
];

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 8 5.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.playerStroke}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h0a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v0a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z" />
    </svg>
  );
}

function FullscreenIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.playerStroke}>
      {active ? (
        <path d="M9 4v4a1 1 0 0 1-1 1H4M15 4v4a1 1 0 0 0 1 1h4M9 20v-4a1 1 0 0 0-1-1H4M15 20v-4a1 1 0 0 1 1-1h4" />
      ) : (
        <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
      )}
    </svg>
  );
}

/**
 * 3D render of the finished logistics park for the "A peak into the final
 * product" section, with a full player: play/pause, scrubber, elapsed time,
 * quality and fullscreen. Autoplay/loop (or the reduced-motion static frame)
 * is handled by `useAutoplayVideo`; a visitor's own pause is remembered so the
 * video doesn't restart when it scrolls back into view.
 *
 * "Quality" chooses between the two encodes already shipped (full resolution
 * and the small data-saver file); switching keeps the playback position.
 */
export function FinalProductVideo() {
  const { videoRef, motionAllowed, manualPauseRef } = useAutoplayVideo(SOURCES);
  const frameRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState<Quality>("auto");
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      manualPauseRef.current = false;
      // Reduced-motion visitors never get a source from the autoplay hook.
      if (!video.getAttribute("src")) video.src = pickVideoSource(SOURCES);
      void video.play().catch(() => setPlaying(false));
    } else {
      manualPauseRef.current = true;
      video.pause();
    }
  }, [videoRef, manualPauseRef]);

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setTime(value);
  };

  const chooseQuality = (next: Quality) => {
    setQuality(next);
    setMenuOpen(false);
    const video = videoRef.current;
    if (!video) return;
    const target = next === "auto" ? pickVideoSource(SOURCES) : next === "high" ? SOURCES.desktop : SOURCES.mobile;
    const current = video.getAttribute("src");
    if (current === target) return;
    // Nothing has loaded yet: the right file is assigned when playback first starts.
    if (!current) return;

    const resumeAt = video.currentTime;
    const wasPlaying = !video.paused;
    video.preload = "auto";
    video.src = target;
    video.addEventListener(
      "loadedmetadata",
      () => {
        video.currentTime = Math.min(resumeAt, video.duration || resumeAt);
        if (wasPlaying) void video.play().catch(() => setPlaying(false));
      },
      { once: true },
    );
    video.load();
  };

  const toggleFullscreen = () => {
    const frame = frameRef.current;
    const video = videoRef.current as FullscreenVideo | null;
    if (!frame || !video) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (frame.requestFullscreen) {
      void frame.requestFullscreen();
    } else {
      // iPhone Safari only fullscreens the <video> itself.
      video.webkitEnterFullscreen?.();
    }
  };

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Close the quality menu on an outside click.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setMenuOpen(false);
      menuRef.current?.querySelector<HTMLButtonElement>("button[aria-haspopup]")?.focus();
    }
  };

  return (
    <div ref={frameRef} className={styles.player}>
      <video
        ref={videoRef}
        className={styles.plateVideo}
        poster={POSTER_SRC}
        muted
        loop={motionAllowed}
        playsInline
        preload="none"
        aria-label="3D render of the finished logistics park"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
      />

      <div className={styles.playerBar} data-playing={playing}>
        <button
          type="button"
          className={styles.playerButton}
          onClick={togglePlay}
          aria-label={playing ? "Pause video" : "Play video"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>

        <span className={styles.playerTime} aria-hidden="true">
          {formatTime(time)} / {formatTime(duration)}
        </span>

        <input
          type="range"
          className={styles.playerScrub}
          min={0}
          max={duration > 0 ? duration : 0}
          step={0.1}
          value={Math.min(time, duration > 0 ? duration : 0)}
          disabled={!(duration > 0)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Seek"
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          style={{ "--played": duration > 0 ? `${(time / duration) * 100}%` : "0%" } as CSSProperties}
        />

        <div ref={menuRef} className={styles.playerMenuWrap} onKeyDown={onMenuKeyDown}>
          <button
            type="button"
            className={styles.playerButton}
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="Video quality"
          >
            <GearIcon />
          </button>
          {menuOpen ? (
            <div className={styles.playerMenu} role="group" aria-label="Video quality">
              {QUALITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={styles.playerMenuItem}
                  aria-pressed={quality === option.value}
                  onClick={() => chooseQuality(option.value)}
                >
                  <span className={styles.playerMenuLabel}>{option.label}</span>
                  <span className={styles.playerMenuHint}>{option.hint}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={styles.playerButton}
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Exit full screen" : "Full screen"}
        >
          <FullscreenIcon active={fullscreen} />
        </button>
      </div>
    </div>
  );
}
