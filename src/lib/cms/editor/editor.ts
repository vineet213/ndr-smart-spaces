/**
 * Collection editor engine — the single pipeline every Phase 1.1 editor flows
 * through. No editor may bypass this module.
 *
 * Every mutation: validates (§13), issues registry references where required
 * (§1.4), persists via the content store (deterministic ordering), appends a
 * hash-chained audit entry (§15.1), and keeps byte-stable exports intact
 * (§16.2). Actions: create / update / publish / archive / restore / delete.
 */

import { AuditLog } from "../audit";
import { ReferenceRegistry } from "../registry";
import { CmsStore } from "../store";
import { JsonValue, PublicationStatus } from "../types";
import { CollectionName } from "../types";
import { ValidationIssue } from "../validation";
import { ContentStore, RESERVED_ID, StoredRecord } from "./contentStore";
import { FileStore, StoredFileMeta } from "./fileStore";
import { CollectionEditorSchema, getEditorSchema } from "./schemas";
import { validateForEditor } from "./validators";
import { buildReferenceLookup } from "./lookup";

export type EditorContext = {
  user: string;
  role: string;
};

export type SaveInput = {
  collectionKey: string;
  id?: string;
  data: JsonValue;
  status?: PublicationStatus;
  file?: { name: string; mime: string; dataBase64: string };
  /** Deterministic ordering key — seeding only; defaults to the previous value or now (§2A). */
  order?: string;
} & EditorContext;

export type SaveResult = {
  record: StoredRecord;
  auditSeq: number;
  issuedRef?: string;
  file?: StoredFileMeta;
};

export class EditorValidationError extends Error {
  constructor(readonly issues: ValidationIssue[]) {
    super(issues.map((issue) => issue.message).join("; "));
    this.name = "EditorValidationError";
  }
}

export class EditorPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EditorPermissionError";
  }
}

export function sortKeys(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object") {
    const object = value as Record<string, JsonValue>;
    const sorted: Record<string, JsonValue> = {};
    for (const key of Object.keys(object).sort()) sorted[key] = sortKeys(object[key]);
    return sorted;
  }
  return value;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const AUTO_STATUS: Record<string, PublicationStatus> = {
  "corporate-settings": "published",
  "publication-settings": "published",
  "brand-settings": "published",
  navigation: "published",
  footer: "published",
};

export class CollectionEditor {
  private readonly content: ContentStore;

  constructor(
    private readonly store: CmsStore,
    private readonly files: FileStore,
    private readonly registry: ReferenceRegistry,
    private readonly audit: AuditLog,
  ) {
    this.content = new ContentStore(store);
  }

  async list(collectionKey: string): Promise<StoredRecord[]> {
    return this.content.list(collectionKey);
  }

  async get(collectionKey: string, id: string): Promise<StoredRecord | null> {
    return this.content.get(collectionKey, id);
  }

  async save(input: SaveInput): Promise<SaveResult> {
    const schema = getEditorSchema(input.collectionKey);
    if (!schema) throw new Error(`Unknown collection "${input.collectionKey}".`);

    const existing = schema.singleRecord
      ? await this.content.getSingle(schema.key)
      : input.id
        ? await this.content.get(schema.key, input.id)
        : null;
    const isNew = existing === null;
    const id = isNew ? input.id || (await this.resolveId(schema.key, input)) : (input.id || existing!.id);

    let data = sortKeys(input.data);
    const nextStatus: PublicationStatus =
      input.status ?? existing?.status ?? AUTO_STATUS[schema.key] ?? "draft";

    // Registry: issue a DOC or register reference on record creation (§1.4).
    let issuedRef: string | undefined;
    if (isNew && schema.refKind) {
      if (hasText(data, "ref")) {
        issuedRef = asText(data, "ref");
        if (
          (await this.content.list(schema.key)).some(
            (record) => asText(record.data, "ref") === issuedRef,
          )
        ) {
          throw new EditorValidationError([
            {
              rule: "duplicate-references",
              collection: schema.key,
              recordId: issuedRef,
              severity: "error",
              message: `Reference "${issuedRef}" already exists in ${schema.label}.`,
            },
          ]);
        }
      } else {
        issuedRef = await this.issueReference(schema.refKind);
        data = sortKeys({ ...(data as Record<string, JsonValue>), ref: issuedRef });
      }
    }

    // File handling: documents/media carry an uploaded asset (versioned).
    // The record version tracks the file version — first upload is v1, each
    // replacement bumps it (§15.1). Revisions without a file keep their version.
    let file: StoredFileMeta | undefined;
    let fileId = asOptionalText(data, "fileId");
    let version = existing?.version ?? "1";
    if (input.file) {
      const name = input.file.name || `${id}-v${version}`;
      file = await this.files.save(
        id,
        name,
        input.file.mime || "application/octet-stream",
        Buffer.from(input.file.dataBase64, "base64"),
      );
      fileId = id;
      version = file.version;
      data = sortKeys({
        ...(data as Record<string, JsonValue>),
        fileId,
        fileName: file.fileName,
        mime: file.mime,
        sizeBytes: file.sizeBytes,
      });
    }

    const now = new Date().toISOString();
    const record: StoredRecord = {
      id,
      status: nextStatus,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      revision: (existing?.revision ?? 0) + 1,
      version,
      order: input.order ?? existing?.order ?? now,
      data,
    };

    const lookup = await buildReferenceLookup(this.content);
    const issues = validateForEditor(
      schema,
      {
        id,
        status: nextStatus,
        data,
        filePresent: input.file !== undefined,
      },
      lookup,
    );
    if (issues.some((issue) => issue.severity === "error")) {
      throw new EditorValidationError(issues);
    }

    await this.content.put(schema.key, record);
    const statusChanged =
      existing !== null && existing.status !== nextStatus
        ? { from: existing.status, to: nextStatus }
        : undefined;
    const versionChanged =
      existing !== null && existing.version !== version
        ? { from: existing.version, to: version }
        : undefined;
    const auditEntry = await this.audit.append({
      user: input.user,
      role: input.role,
      action: isNew ? "create" : "update",
      collection: auditCollection(schema.key),
      recordId: id,
      before: existing?.data ?? null,
      after: data,
      ...(statusChanged ? { statusChange: statusChanged } : {}),
      ...(versionChanged ? { documentVersion: versionChanged } : {}),
      ...(issuedRef ? { registryRef: issuedRef } : {}),
    });

    return { record, auditSeq: auditEntry.seq, issuedRef, file };
  }

  /** Publish / archive / restore — explicit audit actions with role rules (§15). */
  async transition(
    collectionKey: string,
    id: string,
    to: PublicationStatus,
    context: EditorContext,
  ): Promise<SaveResult> {
    const schema = getEditorSchema(collectionKey);
    if (!schema) throw new Error(`Unknown collection "${collectionKey}".`);
    const existing = await this.content.get(schema.key, id);
    if (!existing) throw new Error(`Record "${id}" not found in ${schema.label}.`);
    if (existing.status === to) return { record: existing, auditSeq: 0 };

    if (to === "archived" && context.role !== "super-admin") {
      throw new EditorPermissionError("Only Super Admin can archive records (§15).");
    }

    const record: StoredRecord = {
      ...existing,
      status: to,
      updatedAt: new Date().toISOString(),
      revision: existing.revision + 1,
    };

    if (to === "published") {
      const issues = validateForEditor(
        schema,
        {
          id,
          status: to,
          data: existing.data,
          filePresent: false,
        },
        await buildReferenceLookup(this.content),
      );
      if (issues.some((issue) => issue.severity === "error")) {
        throw new EditorValidationError(issues);
      }
    }

    await this.content.put(schema.key, record);
    const action = to === "published" ? "publish" : to === "archived" ? "archive" : "restore";
    const auditEntry = await this.audit.append({
      user: context.user,
      role: context.role,
      action,
      collection: auditCollection(schema.key),
      recordId: id,
      before: existing.data,
      after: record.data,
      statusChange: { from: existing.status, to },
    });
    return { record, auditSeq: auditEntry.seq };
  }

  async remove(collectionKey: string, id: string, context: EditorContext): Promise<number> {
    const schema = getEditorSchema(collectionKey);
    if (!schema) throw new Error(`Unknown collection "${collectionKey}".`);
    const existing = await this.content.get(schema.key, id);
    if (!existing) throw new Error(`Record "${id}" not found in ${schema.label}.`);
    await this.content.remove(schema.key, id);
    const auditEntry = await this.audit.append({
      user: context.user,
      role: context.role,
      action: "delete",
      collection: auditCollection(schema.key),
      recordId: id,
      before: existing.data,
      after: null,
      statusChange: { from: existing.status, to: "archived" },
    });
    return auditEntry.seq;
  }

  async auditFor(collectionKey: string, recordId?: string) {
    const schema = getEditorSchema(collectionKey);
    const collection = schema ? auditCollection(schema.key) : collectionKey;
    const entries = await this.audit.tail(500);
    return entries.filter(
      (entry) => entry.collection === collection && (!recordId || entry.recordId === recordId),
    );
  }

  private async issueReference(
    refKind: Exclude<CollectionEditorSchema["refKind"], undefined>,
  ): Promise<string> {
    if (refKind === "doc") return (await this.registry.issue("doc")).value;
    return (await this.registry.issue("register", "gv")).value;
  }

  private async resolveId(collectionKey: string, input: SaveInput): Promise<string> {
    const schema = getEditorSchema(collectionKey);
    if (!schema) throw new Error(`Unknown collection "${collectionKey}".`);
    if (schema.singleRecord) return RESERVED_ID;
    const base =
      asOptionalText(input.data, "title") || asOptionalText(input.data, "name") || "record";
    const baseId = slugify(base) || "record";
    const existing = await this.content.list(schema.key);
    let candidate = baseId;
    let suffix = 2;
    while (existing.some((record) => record.id === candidate)) {
      candidate = `${baseId}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }
}

export function auditCollection(schemaKey: string): CollectionName {
  return (schemaKey === "footer" ? "navigation" : schemaKey) as CollectionName;
}

function asText(data: JsonValue, key: string): string {
  return String((data as Record<string, JsonValue>)[key] ?? "");
}

function asOptionalText(data: JsonValue, key: string): string {
  return hasText(data, key) ? asText(data, key) : "";
}

function hasText(data: JsonValue, key: string): boolean {
  const value = (data as Record<string, JsonValue>)[key];
  return typeof value === "string" && value.trim().length > 0;
}
