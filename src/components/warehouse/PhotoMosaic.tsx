"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FadeImage } from "@/components/ui/FadeImage";
import { getLenisInstance } from "@/lib/lenis";
import type { WarehousePhoto } from "@/lib/data/warehouses";
import styles from "./PhotoMosaic.module.css";

type PhotoMosaicProps = {
  photos: readonly WarehousePhoto[];
  /** The first photo is the page's hero; leave it out of the grid (it stays in the viewer). */
  skipFirst?: boolean;
};

/**
 * A fixed mosaic for the few photos a site has (one large tile and up to two
 * beside it), opening into a full-screen viewer with captions. The viewer is a
 * native <dialog>, which traps focus and closes on Escape; arrow keys and
 * swipes step through the photos.
 */
export function PhotoMosaic({ photos, skipFirst = false }: PhotoMosaicProps) {
  const offset = skipFirst ? 1 : 0;
  const tiles = photos.slice(offset, offset + 3);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  const step = useCallback(
    (delta: number) => setIndex((current) => (current + delta + photos.length) % photos.length),
    [photos.length],
  );

  const open = (photoIndex: number) => {
    setIndex(photoIndex);
    getLenisInstance()?.stop();
    dialogRef.current?.showModal();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => getLenisInstance()?.start();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("keydown", onKey);
    };
  }, [step]);

  if (tiles.length === 0) return null;
  const current = photos[index];

  return (
    <>
      <ul className={styles.mosaic} data-count={tiles.length}>
        {tiles.map((photo, tileIndex) => (
          <li key={photo.src} className={styles.tile}>
            <button
              type="button"
              className={styles.tileButton}
              onClick={() => open(tileIndex + offset)}
              aria-label={`View larger: ${photo.caption ?? photo.alt}`}
            >
              <FadeImage
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={tileIndex === 0 ? "(max-width: 767px) 100vw, 60vw" : "(max-width: 767px) 100vw, 40vw"}
                className={styles.tileImage}
              />
              {photo.caption ? <span className={styles.tileCaption}>{photo.caption}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      {photos.length > 1 ? (
        <button type="button" className={styles.viewAll} onClick={() => open(0)}>
          View all {photos.length} photographs
        </button>
      ) : null}

      <dialog
        ref={dialogRef}
        className={styles.viewer}
        aria-label="Photographs"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          const end = event.changedTouches[0]?.clientX;
          touchStart.current = null;
          if (start === null || end === undefined || Math.abs(end - start) < 40) return;
          step(end < start ? 1 : -1);
        }}
      >
        {current ? (
          <figure className={styles.viewerFigure}>
            <div className={styles.viewerImage}>
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className={styles.viewerImg}
              />
            </div>
            <figcaption className={styles.viewerCaption}>
              <span>{current.caption ?? current.alt}</span>
              <span className={styles.viewerCount}>
                {index + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
        ) : null}

        <button
          type="button"
          className={styles.viewerClose}
          onClick={() => dialogRef.current?.close()}
          aria-label="Close"
        >
          ×
        </button>
        {photos.length > 1 ? (
          <>
            <button
              type="button"
              className={styles.viewerPrev}
              onClick={() => step(-1)}
              aria-label="Previous photograph"
            >
              ‹
            </button>
            <button
              type="button"
              className={styles.viewerNext}
              onClick={() => step(1)}
              aria-label="Next photograph"
            >
              ›
            </button>
          </>
        ) : null}
      </dialog>
    </>
  );
}
