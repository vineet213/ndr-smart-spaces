/**
 * Module resolve hook for build-chat-knowledge.mjs. The site's data modules
 * (src/lib/data/*.ts) import each other without a file extension, as the
 * bundler allows; Node needs the ".ts" added before it can load them.
 */

import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[cm]?[jt]s$/.test(specifier) && context.parentURL?.endsWith(".ts")) {
    const url = new URL(`${specifier}.ts`, context.parentURL);
    if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
  }
  return nextResolve(specifier, context);
}
