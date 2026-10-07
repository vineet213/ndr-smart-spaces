"use client";

/**
 * next/image loader for the static export.
 *
 * There is no image optimiser in an `output: "export"` build, so photographs are
 * pre-rendered to WebP at fixed widths by `scripts/build-images.mjs` (run before
 * `next dev` / `next build`) into `public/_img/`. This maps each requested srcset
 * width to the smallest pre-rendered width that covers it.
 *
 * Anything else — SVG logos, client marks, files outside /images — is returned
 * untouched; a throwaway `?w=` keeps the URLs distinct so next/image doesn't
 * warn that the loader ignores `width`.
 */

// Keep in sync with scripts/build-images.mjs and `images.deviceSizes` in next.config.ts
export const IMAGE_WIDTHS = [480, 800, 1200, 1600] as const;

const PHOTO = /^\/images\/(?!clients\/|logos\/).+\.(?:jpe?g|png)$/i;

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (!PHOTO.test(src)) return `${src}?w=${width}`;
  const target = IMAGE_WIDTHS.find((candidate) => candidate >= width) ?? IMAGE_WIDTHS.at(-1);
  return `/_img${src.replace(/\.(?:jpe?g|png)$/i, "")}-${target}.webp`;
}
