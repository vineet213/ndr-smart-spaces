/**
 * File store — binary persistence for the Documents register and Media library.
 *
 * Files live on disk under `{root}/{fileId}/{fileName}`; metadata (mime, size,
 * savedAt) is tracked in an index so versions and usage can be audited.
 * Replacements keep the prior version on disk — document replacements preserve
 * version history (§15.1).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type StoredFileMeta = {
  fileId: string;
  fileName: string;
  mime: string;
  sizeBytes: number;
  savedAt: string;
  version: string;
};

export class FileStore {
  private readonly indexPath: string;

  constructor(private readonly root: string) {
    this.indexPath = join(root, "index.json");
  }

  private readIndex(): Record<string, StoredFileMeta[]> {
    if (!existsSync(this.indexPath)) return {};
    return JSON.parse(readFileSync(this.indexPath, "utf8")) as Record<string, StoredFileMeta[]>;
  }

  private writeIndex(index: Record<string, StoredFileMeta[]>): void {
    mkdirSync(this.root, { recursive: true });
    writeFileSync(this.indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  }

  async save(
    fileId: string,
    fileName: string,
    mime: string,
    data: Uint8Array,
  ): Promise<StoredFileMeta> {
    const index = this.readIndex();
    const history = index[fileId] ?? [];
    const version = String(history.length + 1);
    const directory = join(this.root, fileId);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, fileName), Buffer.from(data), "utf8");
    const meta: StoredFileMeta = {
      fileId,
      fileName,
      mime,
      sizeBytes: data.byteLength,
      savedAt: new Date().toISOString(),
      version,
    };
    history.push(meta);
    index[fileId] = history;
    this.writeIndex(index);
    return meta;
  }

  async history(fileId: string): Promise<StoredFileMeta[]> {
    return this.readIndex()[fileId] ?? [];
  }

  async read(fileId: string, fileName: string): Promise<Uint8Array | null> {
    const file = join(this.root, fileId, fileName);
    if (!existsSync(file)) return null;
    return readFileSync(file);
  }
}
