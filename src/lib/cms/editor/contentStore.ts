/**
 * Content store — typed JSON persistence over the CMS storage seam.
 *
 * Records carry system fields (id, status, timestamps, revision, version) plus
 * the editable payload. Ordering is deterministic: primary sort key, then id.
 * Single-record collections (settings, navigation, footer) use the reserved id
 * "default".
 */

import { CmsStore } from "../store";
import { JsonValue, PublicationStatus } from "../types";

export type StoredRecord = {
  id: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  revision: number;
  version: string;
  order: string;
  data: JsonValue;
};

export const RESERVED_ID = "default";

function contentKey(collectionKey: string): string {
  return `content:${collectionKey}`;
}

export function comparisons(
  a: { order: string; id: string },
  b: { order: string; id: string },
): number {
  if (a.order !== b.order) return a.order < b.order ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

export class ContentStore {
  constructor(private readonly store: CmsStore) {}

  async list(collectionKey: string): Promise<StoredRecord[]> {
    const raw = await this.store.get(contentKey(collectionKey));
    if (!raw) return [];
    const records = JSON.parse(raw) as StoredRecord[];
    records.sort(comparisons);
    return records;
  }

  async get(collectionKey: string, id: string): Promise<StoredRecord | null> {
    const records = await this.list(collectionKey);
    return records.find((record) => record.id === id) ?? null;
  }

  async getSingle(collectionKey: string): Promise<StoredRecord | null> {
    return this.get(collectionKey, RESERVED_ID);
  }

  async put(collectionKey: string, record: StoredRecord): Promise<StoredRecord> {
    const list = await this.list(collectionKey);
    const index = list.findIndex((existing) => existing.id === record.id);
    if (index >= 0) list[index] = record;
    else list.push(record);
    list.sort(comparisons);
    await this.store.set(contentKey(collectionKey), JSON.stringify(list));
    return record;
  }

  async remove(collectionKey: string, id: string): Promise<boolean> {
    const list = await this.list(collectionKey);
    const next = list.filter((record) => record.id !== id);
    if (next.length === list.length) return false;
    await this.store.set(contentKey(collectionKey), JSON.stringify(next));
    return true;
  }
}
