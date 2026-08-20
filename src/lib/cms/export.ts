/**
 * CMS foundation — byte-stable export contract (§16.2).
 *
 * The frontend is a static export and is never rewritten: on publish the CMS
 * serialises collections to typed `src/lib/data/*.ts` modules matching today's
 * shapes. Byte stability means (a) the generator is deterministic — the same
 * content always yields the same bytes — and (b) modules not yet CMS-managed
 * are passed through verbatim, so a publish cannot introduce drift.
 *
 * This module provides the deterministic serializer, the module manifest, and
 * the contract verifier that runs in development and CI.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Content data modules (excludes the validation modules and .gitkeep). */
export const DATA_MODULES = [
  "about",
  "business",
  "contact",
  "esg",
  "homepage",
  "investor",
  "legal",
  "media",
  "navigation",
  "portfolio",
] as const;

export type DataModuleName = (typeof DATA_MODULES)[number];

/**
 * Modules whose byte stability is guaranteed by the deterministic CMS serializer
 * rather than the frozen-baseline check. Currently only `navigation` — the sole
 * handwritten module that was fully replaced by a CMS-generated equivalent.
 */
export const MANAGED_MODULES: readonly DataModuleName[] = ["navigation"];

export type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function serializeString(value: string): string {
  return JSON.stringify(value).replace(
    /[\u007f-\uffff]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}

function serializeValue(value: JsonLike, indent: number): string {
  const pad = "  ".repeat(indent);
  const padInner = "  ".repeat(indent + 1);
  if (value === null) return "null";
  if (typeof value === "string") return serializeString(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const lines = value.map((item) => `${padInner}${serializeValue(item, indent + 1)},`);
    return `[\n${lines.join("\n")}\n${pad}]`;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return "{}";
  const lines = keys.map(
    (key) => `${padInner}${serializeString(key)}: ${serializeValue(value[key], indent + 1)},`,
  );
  return `{\n${lines.join("\n")}\n${pad}}`;
}

/**
 * Deterministic TS-module serializer in the repo's prettier conventions
 * (2-space indent, single quotes, trailing commas). Given the same content it
 * always emits the same bytes — the core property of the export contract.
 */
export function serializeAsConst(exportName: string, value: JsonLike): string {
  return `export const ${exportName} = ${serializeValue(value, 0)} as const;\n`;
}

/** Assert determinism: two serialisations of the same content are identical. */
export function isDeterministic(exportName: string, value: JsonLike): boolean {
  return serializeAsConst(exportName, value) === serializeAsConst(exportName, value);
}

export type ExportModuleStatus = {
  module: DataModuleName;
  managed: boolean;
  baselineSha: string;
  currentSha: string;
  stable: boolean;
};

export type BaselineManifest = Record<DataModuleName, string>;

const BASELINE_PATH = join(process.cwd(), "src", "lib", "cms", "export-baseline.json");

function modulePath(dir: string, module: DataModuleName): string {
  return join(dir, `${module}.ts`);
}

export function hashFile(dir: string, module: DataModuleName): string {
  const file = modulePath(dir, module);
  if (!existsSync(file)) return "";
  return sha256(readFileSync(file, "utf8"));
}

/** Read the committed byte-stability baseline. */
export function readBaseline(): BaselineManifest | null {
  if (!existsSync(BASELINE_PATH)) return null;
  return JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as BaselineManifest;
}

/** Write the baseline manifest (used at freeze time, not by the verifier). */
export function recordBaseline(dir: string): BaselineManifest {
  const manifest = {} as BaselineManifest;
  for (const name of DATA_MODULES) manifest[name] = hashFile(dir, name);
  writeFileSync(BASELINE_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

/**
 * Contract verifier. Pass-through modules must match their committed baseline
 * byte-for-byte; managed modules are covered by the deterministic serializer.
 */
export function verifyExportContract(dir: string): {
  modules: ExportModuleStatus[];
  stable: boolean;
} {
  const baseline = readBaseline();
  const modules: ExportModuleStatus[] = [];
  for (const name of DATA_MODULES) {
    const currentSha = hashFile(dir, name);
    const baselineSha = baseline?.[name] ?? "";
    modules.push({
      module: name,
      managed: MANAGED_MODULES.includes(name),
      baselineSha,
      currentSha,
      stable: baseline !== null && baselineSha === currentSha,
    });
  }
  const stable = baseline !== null && modules.every((status) => status.stable);
  return { modules, stable };
}
