/**
 * CMS foundation — Reference Registry engine (§1.4).
 *
 * The registry is the single generator of every publication reference on the
 * site: REF, PLATE, FIG, DOC, FY, Volume, and register numbers. No page
 * manually maintains a publication reference. Issued values are stable and
 * never renumbered while referenced. Counter state persists through the
 * storage seam; every issue is recorded to the registry ledger for audit.
 */

import { RegistryConfig, RegistryIssue, RegistryReferenceKind } from "./types";
import { CmsStore } from "./store";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const SEQUENCE_KINDS: readonly RegistryReferenceKind[] = [
  "ref",
  "plate",
  "fig",
  "doc",
  "register",
  "volume",
];

export class ReferenceRegistry {
  constructor(
    private readonly store: CmsStore,
    private readonly config: RegistryConfig,
  ) {}

  private counterKey(kind: RegistryReferenceKind, scope?: string): string {
    return `registry:counter:${kind}${scope ? `:${scope}` : ""}`;
  }

  private ledgerKey(): string {
    return "registry:ledger";
  }

  private nextSequence(kind: RegistryReferenceKind, scope?: string): Promise<number> {
    return this.store.get(this.counterKey(kind, scope)).then((raw) => {
      const next = raw === null ? (this.config[kind] as { start: number }).start : Number(raw);
      return this.store.set(this.counterKey(kind, scope), String(next + 1)).then(() => next);
    });
  }

  private format(kind: RegistryReferenceKind, sequence: number, scope?: string): string {
    switch (kind) {
      case "plate":
        return String(sequence).padStart(this.config.plate.width, "0");
      case "fig":
        return this.config.fig.prefix + String(sequence).padStart(this.config.fig.width, "0");
      case "doc":
        return this.config.doc.prefix + String(sequence).padStart(this.config.doc.width, "0");
      case "volume":
        return ROMAN_NUMERALS[sequence - 1] ?? `Volume ${sequence}`;
      case "register":
        return (
          (scope ? `${scope.toUpperCase()}-` : "") +
          this.config.register.prefix +
          String(sequence).padStart(this.config.register.width, "0")
        );
      case "ref":
      default:
        return this.config.ref.prefix + String(sequence).padStart(this.config.ref.width, "0");
    }
  }

  private record(issue: RegistryIssue): Promise<void> {
    return this.store.append(this.ledgerKey(), JSON.stringify(issue));
  }

  /** Issue the next value for a reference kind. FY is a fixed label; the rest sequence. */
  async issue(kind: RegistryReferenceKind, scope?: string): Promise<RegistryIssue> {
    if (kind === "fy") {
      const issue: RegistryIssue = {
        kind,
        value: this.config.fy.label,
        scope,
        sequence: null,
        issuedAt: new Date().toISOString(),
      };
      await this.record(issue);
      return issue;
    }

    const sequence = await this.nextSequence(kind, scope);
    const issue: RegistryIssue = {
      kind,
      value: this.format(kind, sequence, scope),
      scope,
      sequence,
      issuedAt: new Date().toISOString(),
    };
    await this.record(issue);
    return issue;
  }

  /** Read the ledger of issued references (oldest first) for audit/review. */
  async ledger(): Promise<RegistryIssue[]> {
    const lines = await this.store.readLines(this.ledgerKey());
    return lines.map((line) => JSON.parse(line) as RegistryIssue);
  }

  /** Next sequence value without consuming it. */
  async peek(kind: RegistryReferenceKind, scope?: string): Promise<number> {
    if (!SEQUENCE_KINDS.includes(kind)) return 0;
    const raw = await this.store.get(this.counterKey(kind, scope));
    return raw === null ? (this.config[kind] as { start: number }).start : Number(raw);
  }

  /** True when a value already issued — rejects manually invented collisions (§13.1). */
  async isIssued(value: string): Promise<boolean> {
    const ledger = await this.ledger();
    return ledger.some((issue) => issue.value === value);
  }
}
