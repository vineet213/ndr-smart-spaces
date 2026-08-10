/**
 * CMS foundation — storage seam.
 *
 * The Reference Registry and Audit Log depend only on this interface, so the
 * storage backend (memory, JSON file, or a future SQL/document store) can be
 * swapped without touching the engines. Blueprint §16.1.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export interface CmsStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  append(key: string, line: string): Promise<void>;
  readLines(key: string): Promise<string[]>;
}

export class MemoryStore implements CmsStore {
  private readonly map = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.map.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.map.set(key, value);
  }

  async append(key: string, line: string): Promise<void> {
    const existing = this.map.get(key) ?? "";
    this.map.set(key, existing.length > 0 ? `${existing}\n${line}` : line);
  }

  async readLines(key: string): Promise<string[]> {
    const raw = this.map.get(key);
    if (!raw) return [];
    return raw.split("\n").filter((line) => line.length > 0);
  }
}

/** Single-file JSON store — a dependency-free persistence backend. */
export class JsonFileStore implements CmsStore {
  constructor(private readonly file: string) {}

  private read(): Record<string, string> {
    if (!existsSync(this.file)) return {};
    return JSON.parse(readFileSync(this.file, "utf8")) as Record<string, string>;
  }

  private write(map: Record<string, string>): void {
    mkdirSync(dirname(this.file), { recursive: true });
    writeFileSync(this.file, `${JSON.stringify(map, null, 2)}\n`, "utf8");
  }

  async get(key: string): Promise<string | null> {
    return this.read()[key] ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    const map = this.read();
    map[key] = value;
    this.write(map);
  }

  async append(key: string, line: string): Promise<void> {
    const map = this.read();
    const existing = map[key] ?? "";
    map[key] = existing.length > 0 ? `${existing}\n${line}` : line;
    this.write(map);
  }

  async readLines(key: string): Promise<string[]> {
    const raw = this.read()[key];
    if (!raw) return [];
    return raw.split("\n").filter((line) => line.length > 0);
  }
}
