/**
 * CMS foundation — audit log engine (§15.1).
 *
 * Append-only, tamper-evident, hash-chained audit history across every
 * editable collection. Every create / update / publish / archive / restore /
 * delete records user, role, timestamp, action, before/after values, the
 * affected collection and record, the publication status change, the document
 * version (where applicable), and any affected registry reference. Entries are
 * immutable — the chain verifier recomputes each hash and rejects drift.
 */

import { createHash } from "node:crypto";
import { AuditAction, AuditEntry, CollectionName, JsonValue, PublicationStatus } from "./types";
import { CmsStore } from "./store";

const LOG_KEY = "audit:log";

export type AuditInput = {
  user: string;
  role: string;
  action: AuditAction;
  collection: CollectionName;
  recordId: string;
  before?: JsonValue | null;
  after?: JsonValue | null;
  statusChange?: { from: PublicationStatus; to: PublicationStatus };
  documentVersion?: { from: string; to: string };
  registryRef?: string;
};

function canonicalJson(value: JsonValue | null): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys
    .map(
      (key) => `${JSON.stringify(key)}:${canonicalJson((value as Record<string, JsonValue>)[key])}`,
    )
    .join(",")}}`;
}

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export class AuditLog {
  constructor(private readonly store: CmsStore) {}

  async append(input: AuditInput): Promise<AuditEntry> {
    const lines = await this.store.readLines(LOG_KEY);
    const seq = lines.length + 1;
    const prevHash =
      lines.length > 0 ? (JSON.parse(lines[lines.length - 1]) as AuditEntry).hash : "GENESIS";

    const entry: AuditEntry = {
      seq,
      user: input.user,
      role: input.role,
      timestamp: new Date().toISOString(),
      action: input.action,
      collection: input.collection,
      recordId: input.recordId,
      before: input.before ?? null,
      after: input.after ?? null,
      ...(input.statusChange ? { statusChange: input.statusChange } : {}),
      ...(input.documentVersion ? { documentVersion: input.documentVersion } : {}),
      ...(input.registryRef ? { registryRef: input.registryRef } : {}),
      prevHash,
      hash: "",
    };

    entry.hash = this.hashOf(entry);
    await this.store.append(LOG_KEY, JSON.stringify(entry));
    return entry;
  }

  private hashOf(entry: AuditEntry): string {
    const { hash: _omit, ...rest } = entry;
    return sha256(canonicalJson(rest as JsonValue));
  }

  async tail(count = 50): Promise<AuditEntry[]> {
    const lines = await this.store.readLines(LOG_KEY);
    return lines.slice(-count).map((line) => JSON.parse(line) as AuditEntry);
  }

  /**
   * Recompute the whole chain. Returns the last sequence whose hash is valid;
   * valid is true only when every entry verifies against its predecessor.
   */
  async verify(): Promise<{ valid: boolean; lastVerifiedSeq: number }> {
    const lines = await this.store.readLines(LOG_KEY);
    let previousHash = "GENESIS";
    let lastVerifiedSeq = 0;
    for (const line of lines) {
      const entry = JSON.parse(line) as AuditEntry;
      const { hash, ...rest } = entry;
      const recomputed = sha256(canonicalJson(rest as JsonValue));
      if (entry.prevHash !== previousHash || recomputed !== hash) break;
      previousHash = entry.hash;
      lastVerifiedSeq = entry.seq;
    }
    return { valid: lastVerifiedSeq === lines.length, lastVerifiedSeq };
  }
}
