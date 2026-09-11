/**
 * Build-time static-asset checks for the static export.
 *
 * Server components query this at prerender time to keep the exported site
 * free of references to local assets that do not physically exist in
 * `public/` (a `next build` with `output: "export"` cannot serve an asset
 * that was never placed). Client components must never import this module.
 */

import { existsSync } from "node:fs";
import { join, normalize, sep } from "node:path";

export function localAssetExists(src: string): boolean {
  if (typeof src !== "string" || src === "") return false;
  if (src.startsWith("//") || src.startsWith("http:") || src.startsWith("https:")) return true;
  if (!src.startsWith("/")) return true;

  const pathname = src.split("?")[0].split("#")[0];
  const relative = normalize(pathname)
    .replace(/^[/\\]+/, "")
    .split("/")
    .join(sep);
  return existsSync(join(process.cwd(), "public", relative));
}
