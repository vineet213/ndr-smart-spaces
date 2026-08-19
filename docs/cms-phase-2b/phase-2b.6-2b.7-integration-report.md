# Phase 2B.6–2B.7 — CMS Integration Report: Investor Centre & ESG Pages

- Generated: 2026-08-19
- Scope: `src/lib/data/investor.ts` (Phase 2B.6) + `src/lib/data/esg.ts` (Phase 2B.7) now derive CMS-managed data from the generated modules (`src/lib/data/generated/*`).
- Verdict: **PASS — 400/400 parity checks pass, zero unintended visual differences.**

---

## 1. What was done

Phase 2B.6 and 2B.7 wire the last two major page data modules — the Investor Centre and ESG & Sustainability — into the CMS-generated data layer. Both modules follow the established integration pattern: import from the `generated/*` modules, derive the shapes components already expect, keep all export interfaces byte-identical to the frozen Frontend V1 baseline.

No component files, page files, or test files were modified. All changes are confined to two data files.

### Phase 2B.6 — Investor Centre (`src/lib/data/investor.ts`)

**New imports:**
- `metrics` from `./generated/metrics` — 22-record shared metrics ledger
- `publicationSettings` from `./generated/publicationSettings` — edition and as-on date

**CMS-derived values:**
| Export | Source | Notes |
| --- | --- | --- |
| `investorMetrics` | `cmsMetrics` filtered to non-EN records (M1–M16) | `key` → `id`, `name` → `stat`; lead flag preserved |
| `leadMetrics` | Derived from `investorMetrics` where `lead === true` | No change to logic, just downstream |
| `investorMasthead.asOn` | `cmsPublication.asOnDate` | Frozen editorial text unchanged |
| `investorMasthead.edition` | `cmsPublication.editionPeriod` | Template: `Edition {period} · Volume I` |
| `investorEdition` | `cmsPublication.asOnDate` + `cmsPublication.editionPeriod` | New derived constant |

**Frozen (no CMS counterpart):** editorial statement, capital cycle, capital strength, timeline, InvIT relationship, safe harbour, governance framework, resilience, filing configs.

### Phase 2B.7 — ESG & Sustainability (`src/lib/data/esg.ts`)

**New imports:**
- `metrics` from `./generated/metrics` — shared metrics ledger (EN-01 through EN-06)
- `esgInitiatives` from `./generated/esgInitiatives` — 8 impact-map initiative records
- `governanceRecords` from `./generated/governanceRecords` — 8 governance records (committees + policies)
- `documents` from `./generated/documents` — 5 disclosure documents

**CMS-derived values:**
| Export | Source | Notes |
| --- | --- | --- |
| `esgEnvironment.metrics` | `cmsMetrics` filtered to `EN-*` records | 6 records; `key` → `code`, `name` → `stat`; trend/unit fields preserved |
| `esgImpactMap.initiatives` | `cmsInitiatives` mapped through `projectPlace(lat, lon)` | 8 records; lat/lon → x/y projection computed at module init |
| `esgGovernance.registers[0]` (Committees) | `cmsGovernanceRecords` where `kind === "committee"` | 4 records; `sourceRef` → `ref`, `title` → `entry` |
| `esgGovernance.registers[1]` (Policies) | `cmsGovernanceRecords` where `kind === "policy"` | 4 records; same mapping |
| `esgDisclosures.groups` | `cmsDocuments` grouped by `category` | 5 records across 4 categories |

**Frozen (no CMS counterpart):** masthead, editorial statement, ESG framework pillars, social discipline, certifications register, dashboard, closing endnote. The Disclosure index (GV-01 through GV-03 commitments and the `disclosureIndex` register) is editorial content with no CMS records and stays frozen.

---

## 2. CMS collections used

| Collection | Record count | Used by |
| --- | --- | --- |
| `metrics` | 22 (M1–M16 + EN-01–EN-06) | `investor.ts` (16 records), `esg.ts` (6 records) |
| `publicationSettings` | 1 global | `investor.ts` (masthead asOn + edition) |
| `governanceRecords` | 8 (4 committees + 4 policies) | `esg.ts` (governance registers) |
| `documents` | 5 | `esg.ts` (disclosure archive groups) |
| `esgInitiatives` | 8 | `esg.ts` (impact map with lat/lon) |

Note: `metrics` is the shared metrics ledger (§11.3) used by `investor.ts`, `esg.ts`, `homepage.ts`, and `business.ts`. Each module filters by key prefix or entity to select its relevant slice.

---

## 3. Relationships and data flow

```
.cms-store/content.json
  └─ seed:cms (scripts/cms-seed.ts)
       └─ src/lib/data/generated/
            ├── metrics.ts ──────────────┬── investor.ts (M1–M16 filtered by !key.startsWith("EN-"))
            │                            └── esg.ts     (EN-01–EN-06 filtered by key.startsWith("EN-"))
            ├── publicationSettings.ts ─── investor.ts (masthead asOn + edition)
            ├── governanceRecords.ts ───── esg.ts     (committees + policies filtered by kind)
            ├── documents.ts ───────────── esg.ts     (grouped by category)
            └── esgInitiatives.ts ──────── esg.ts     (mapped through projectPlace for x/y)
```

---

## 4. Verification

| Script | Result |
| --- | --- |
| `npm run seed:cms` | SEED OK — 83 records, 14 collections, byte-identical exports |
| `npm run verify:parity` | 400/400 PASS — 0 failed, 0 unintended |
| `npx tsc --noEmit` | Clean — no type errors |
| `npm run lint` | Clean — no warnings or errors |
| `npm run build` | 24/24 pages generated |
| `npx prettier --write` | Formatting applied to modified files |

Visual regression baseline: the last pre-integration `out/` build (built 10 Aug) was compared page-by-page after integration. After build-fingerprint normalisation, all 24 HTML pages are byte-identical.

---

## 5. What was NOT changed

Per the Frozen Frontend Rule (Design Direction §8):

- **Zero component files modified** — `MetricsBand`, `ImpactMap`, `GovernanceDisclosures`, `DisclosuresArchive`, all section components remain untouched
- **Zero page files modified** — `/investor-centre`, `/esg-sustainability` pages unchanged
- **Zero test files modified** — all existing tests pass
- **All editorial content frozen** — mastheads, statements, framework, timeline, capital cycle, certifications, dashboard, closing, safe harbour, governance framework, resilience, filing configs, disclosure index
- **No client revision changes** — larger logo, header changes, readability, dropdown redesign, Contact simplification all excluded per instruction

---

## 6. Remaining CMS-integrated data files

| File | Status | CMS collections |
| --- | --- | --- |
| `src/lib/data/homepage.ts` | Already integrated (Phase 2B.1) | metrics, publicationSettings |
| `src/lib/data/about.ts` | Already integrated (Phase 2B.2) | locations, media, metrics |
| `src/lib/data/business.ts` | Already integrated (Phase 2B.3) | businessVerticals, metrics, publicationSettings, locations |
| `src/lib/data/portfolio.ts` | Already integrated (Phase 2B.4) | locations, portfolioAssets, publicationSettings |
| `src/lib/data/navigation.ts` | Already integrated (Phase 2B.5) | navigation |
| `src/lib/data/investor.ts` | **Integrated (Phase 2B.6)** | metrics, publicationSettings |
| `src/lib/data/esg.ts` | **Integrated (Phase 2B.7)** | metrics, esgInitiatives, governanceRecords, documents |
| `src/lib/data/contact.ts` | Frozen — no CMS counterpart | — |
| `src/lib/data/terms.ts` | Frozen — no CMS counterpart | — |

---

## 7. Readiness for Phase 3

Phase 2B is now complete. All data files that have CMS-managed counterparts are wired into the generated modules. The site builds and renders identically to the frozen Frontend V1 baseline. Readiness for Phase 3 (CMS editor UI / admin panel):
- All 14 CMS collections seeded and verified
- All data modules consuming CMS-generated exports
- Byte-identical export verification passing
- Zero component or page changes required for CMS integration
