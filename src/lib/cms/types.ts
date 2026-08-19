/**
 * CMS foundation — frozen domain model.
 *
 * Source of truth: "NDR Smart Spaces CMS Blueprint V1" Version 1.1 (final
 * architecture freeze). Collections §1, §11; workflow §15; audit history
 * §15.1; Reference Registry §1.4. No architectural change beyond this model
 * without a blueprint revision.
 */

export const PUBLICATION_STATUSES = [
  "draft",
  "pending",
  "published",
  "archived",
  "external",
] as const;

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export const AUDIT_ACTIONS = [
  "create",
  "update",
  "publish",
  "archive",
  "restore",
  "delete",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

/**
 * The fourteen editable collections (blueprint §11, §15.1). Settings are
 * single-record collections; the rest are record collections.
 */
export const COLLECTIONS = [
  "metrics",
  "locations",
  "documents",
  "media",
  "business-verticals",
  "portfolio-assets",
  "esg-initiatives",
  "governance-records",
  "contact-directory",
  "announcements",
  "navigation",
  "corporate-settings",
  "publication-settings",
  "brand-settings",
  "slideshows",
] as const;

export type CollectionName = (typeof COLLECTIONS)[number];

export const REGISTRY_REFERENCE_KINDS = [
  "ref",
  "plate",
  "fig",
  "doc",
  "fy",
  "volume",
  "register",
] as const;

export type RegistryReferenceKind = (typeof REGISTRY_REFERENCE_KINDS)[number];

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** Corporate Settings — §1.1 (Category D, Super Admin). */
export type CorporateSettings = {
  legalEntity: string;
  registryLine: string;
  cin: string;
  addresses: { label: string; lines: string[] }[];
  phoneNumbers: string[];
  emails: string[];
  pressResponseExpectation: string;
  externalLinks: {
    invitUrl: string;
    aveAcresUrl: string;
    googleMapsDirectionsUrl: string;
  };
};

/** Publication Settings — §1.2 (Category D, Super Admin). */
export type PublicationSettings = {
  editionPeriod: string;
  asOnDate: string;
  documentPrefixes: Record<string, string>;
  numberingRules: Record<string, string>;
  copyrightLine: string;
};

/** Brand Settings — §1.3 (Category B/D, Super Admin). */
export type BrandSettings = {
  brandName: string;
  logoLight: { src: string; alt: string };
  logoDark: { src: string; alt: string };
  favicon: string;
  seoDefaults: { title: string; description: string };
  ogImage: string;
  socialLinks: { label: string; href: string }[];
};

/** Sequence-based reference formats — §1.4. */
export type RegistrySequenceConfig = {
  prefix: string;
  width: number;
  start: number;
};

/** Reference Registry configuration — §1.4 (Super Admin). */
export type RegistryConfig = {
  ref: RegistrySequenceConfig;
  plate: RegistrySequenceConfig;
  fig: RegistrySequenceConfig;
  doc: RegistrySequenceConfig;
  register: RegistrySequenceConfig;
  volume: RegistrySequenceConfig;
  fy: { label: string };
};

/** A single reference issued by the registry — stable, never renumbered. */
export type RegistryIssue = {
  kind: RegistryReferenceKind;
  value: string;
  scope?: string;
  sequence: number | null;
  issuedAt: string;
};

/** Audit entry — §15.1, append-only and hash-chained. */
export type AuditEntry = {
  seq: number;
  user: string;
  role: string;
  timestamp: string;
  action: AuditAction;
  collection: CollectionName;
  recordId: string;
  before: JsonValue | null;
  after: JsonValue | null;
  statusChange?: { from: PublicationStatus; to: PublicationStatus };
  documentVersion?: { from: string; to: string };
  registryRef?: string;
  prevHash: string;
  hash: string;
};

/** Common envelope for every editable record. */
export type CmsRecord = {
  id: string;
  status: PublicationStatus;
};
