# NDR Smart Spaces — Investor Centre Architecture V1

**Identity: The Financial Statement · the annual-report register**
Lead UI/UX Designer & Senior Frontend Engineer · derives exclusively from: Page Identity Guide §2.4 (design intent) · Design Direction v2 §3.13–3.14 (data viz · investor communication) · the approved builds (Homepage · About Us · Business · Portfolio) · the shared design tokens and component system · the client's investor IA and the NDR corporate presentation (the source deck).

Status: **Architecture V1 — build authority.** Investor Centre retention is a client on-hold item; the B1 gate ships this build on approval (Design Direction §8). No code has been written; this document is the implementation authority.

---

## 0. What this page must be

Investor Centre is **The Financial Statement** — the institutional annual-report register of NDR Smart Spaces. The visitor is a prospective or existing investor, an analyst, or an underwriter. They are not being sold; they are being *reported to*. The page's job is to make the company's capital story and governance verifiable in the register of an equity-research cover page: precise, sourced, hedged where appropriate.

Five immutable rules govern the build:

1. **Safe-harbour language preserved verbatim.** The deck's Slide 2 statement is the canonical disclosure text. The full block renders on the Investor Overview; every sub-page carries a concise footer disclaimer linking to the full statement. No paraphrase, no truncation without the client's written approval.
2. **One stat, one source.** Every figure carries a reporting period and a source footnote. All figures render from the single source-of-truth table (§4.2). The site never performs arithmetic the client has not approved (1954 + current year is not a stated metric).
3. **Entity honesty.** NDR Smart Spaces, NDR Asset Management, Ave Acres, and NDR InvIT Trust are named precisely and never conflated. NDR InvIT's own financial results, distributions, credit ratings and shareholding live at `ndrinvit.com` and are linked out, never absorbed. An InvIT figure on this site is always attributed to NDR InvIT Trust.
4. **Content-gated structure.** The full document ships as structure; rows, tables, and filings render when approved content lands. No empty shells, no invented facts.

**Density doctrine:** the highest density on the site (guide §2.4) — financial density *is* the identity. Marketing whitespace is replaced by the structured margins of a printed statement.

---

## 1. Why "The Financial Statement", not a fourth template

| Page      | Document              | Leading evidence device           | Signature interaction                   |
| --------- | --------------------- | --------------------------------- | --------------------------------------- |
| Homepage  | Front cover           | Hero stat band, logo grid         | Count-up                                |
| About     | Founding ledger       | Ledger plates, lifecycle ring     | Draw-in geometry, linked highlight      |
| Business  | Operating manual      | Matrices, process chains          | Sticky index + row emphasis             |
| Portfolio | Institutional catalogue | Survey field + asset register    | Register ↔ locator linked highlight     |
| Investor  | **Financial statement** | **Sourced statement tables + contents rail** | **Table row / archive filter tabs** |

### 1.1 Companion volume, not the same book

Business established the **operating manual** identity; Investor Centre must establish a **different** identity. The two are volumes from the same publisher (same tokens, same Fraunces/Inter/tabular type system, same hairline discipline, same maroon/gold economy) but different documents. Explicit forbidden patterns on Investor Centre:

- **No Business language:** no chapter numerals (01–05), no ChapterHeader block, no numbered sticky chapter index, no capability matrices, no process chains, no 2 px maroon masthead rule.
- **No Portfolio language:** no plates, no plate-run markers, no survey field, no status badges, no map.
- **No About language:** no gold-diamond lifecycle ring as the leading device, no drawn geometry, no ledger top-rule lockup, no record-register slots beyond the board register (governance, licensed).
- **No Homepage language:** no full-bleed cinematic hero, no count-up, no audience strip, no logo grid, no value-over-label stat cells.

The **contents rail** is the statement's *index of contents* — section titles + "as on", tabular, quiet. It is deliberately not Business's sticky chapter rail with numerals and progress state.

### 1.2 Document hierarchy (the reading order — critical)

The Investor Centre must **not** open like a filing archive. It must first establish institutional credibility and the capital story, then demonstrate how the story is controlled, then document it. Every route, and the contents rail that indexes them, follows this fixed order:

1. **Editorial statement** — why this document exists (the fiduciary sentence).
2. **Capital strength** — the sourced metrics (how strong the platform is).
3. **Capital cycle** — how value is created and recycled (the signature diagram).
4. **Governance** — how it is controlled (the flagship governance page).
5. **Filings** — how it is documented (the archive, financial results, annual reports, announcements, downloads).

The page must feel like a statement that *happens to be archived*, never like a downloads page with a story attached. The landing renders stages 1–3 on the page, routes to stage 4 and stage 5, and the contents rail indexes all five.

---

## 2. Route architecture (the eight routes)

The client IA lists twelve investor sub-pages. `navigation.ts` consolidates these to eight; the four folded sub-pages (Policies · Credit Ratings · Shareholding Information · Distribution Information) become categories inside the **Downloads** archive and are referenced on the overview. This consolidation is approved and preserved.

| Route | Page | Template |
|---|---|---|
| `/en/investor-centre` | Investor Overview | **Bespoke — the cover and front matter** |
| `/en/investor-centre/investment-highlights` | Investment Highlights | **Bespoke — the full sourced statement + resilience** |
| `/en/investor-centre/corporate-governance` | Corporate Governance | **Bespoke — the governance flagship** |
| `/en/investor-centre/reports-disclosures` | Reports & Disclosures | FilingLibrary — `index` |
| `/en/investor-centre/financial-results` | Financial Results | FilingLibrary — `table` |
| `/en/investor-centre/annual-reports` | Annual Reports | FilingLibrary — `index` |
| `/en/investor-centre/announcements` | Announcements | FilingLibrary — `index` |
| `/en/investor-centre/downloads` | Downloads | FilingLibrary — `library` |

**The FilingLibrary is a reusable institutional component, not five bespoke pages.** Five routes are configuration of one component (three render modes, §3.3). No thin pages: a route with no content renders its designed filing state (§7), never an empty shell. The consolidation also avoids months of empty pages.

---

## 3. Composition per route

### 3.1 Landing — Investor Overview (the cover and front matter)

Opens like the **front page of an annual report**, in the fixed order:

1. **InvestorMasthead** — the document cover, not a marketing hero. Registry eyebrow (`NDR Smart Spaces Pvt. Ltd. — an NDR Group platform`), the document title, the **"as on" line** (`As on 31 March 2026 · Edition FY26` — as-on date client-confirmed, §10), and a small-caps **edition line**. **Slim.** The numbers never open the page.
2. **ContentsRail** — the statement's index of contents, sticky on desktop (§5). Lists the document sections in hierarchy order: Statement · Capital strength · Capital cycle · Governance · Reports & Disclosures · Financial Results · Annual Reports · Announcements · Downloads. Landing anchors for stages 1–3; routes for stages 4–5.
3. **EditorialStatement** — **one** fiduciary sentence: why this document exists. Lede-measure, no superlative without a number, no second paragraph. ("We report to you as fiduciaries." register.)
4. **MetricsBand** — the **capital strength** lead metrics (M1, M3, M4, M5, M7 from §4.2). Each metric is a hairline-ruled entry: value (tabular numerals) · small-caps label · **period + source footnote directly beneath**. Sourced, restrained, **static** — no counters, no dashboard behaviour. These are the cover's headline figures; the complete statement lives on Investment Highlights (see §3.2 note).
5. **CapitalCycle** — the signature visual moment (§3.5). The only diagram on the landing.
6. **CapitalMarketTimeline** — the investor's milestone record (2011 → 2026), distinct data from About's six-node journey (§4.3). Reuses the AboutTimeline component under its license; captions always visible.
7. **InvITRelationship** — the ROFO documentary section: the relationship framed as a matter of record, with the client-approved ROFO language, entity names precise, and an external link to `ndrinvit.com`. Not Business's partnership band.
8. **SafeHarbourBlock** — the full verbatim Slide 2 text (§3.6), id `safe-harbour`, targeted by every sub-page's footer disclaimer.
9. **InvestorClosing** — charcoal colophon. `Write to the investor mailbox` → `mailto:compliance@ndrsmart.com` · `Open the download archive` → `/en/investor-centre/downloads` · `NDR InvIT Trust` → `https://ndrinvit.com` (external) · `Business Enquiry` → `/en/contact#business-enquiry`.

### 3.2 Investment Highlights — the full sourced statement

- **InvestorMasthead** (slim document variant: `Investment Highlights` · as-on line · edition line).
- **StatementTable** — the complete sourced statement, all sixteen metrics M1–M16 as a ruled document table: `Ref · Stat · Value · Period · Source · Entity`. This is the *statement proper*; the landing's MetricsBand is its cover excerpt. Both draw from the same rows in `investor.ts` — one stat, one source, never two registers. A single footnote block reconciles the statement to the deck and the frozen builds.
- **ResilienceIndex** — qualitative risk & resilience rows sourced to deck §29 (long WALE — stated qualitatively, **no invented figure** · geographic/industry/client diversification · governance and personnel · SPV debt replaced by long-term bonds, AAA-rated entity, sponsor comfort · low receivable risk). Each row hedged and sourced; no metric without a number.
- **CapitalCycle** reference link back to the landing anchor (one line, not a re-rendered diagram — the signature lives once).
- **InvestorClosing**.

### 3.3 FilingLibrary — the archive (one component, three modes)

The archive is a **documentary archive room, not a download centre.** All five archive routes share one component configured by a `FilingLibraryConfig`:

- **Mode `index`** (Reports & Disclosures · Annual Reports · Announcements) — ruled archive rows (§3.4) under **filter tabs** (category / year / type, config-driven arrays). Newest first. The leading evidence device is the **document reference code**, not a download button.
- **Mode `table`** (Financial Results) — the **ruled statement table**: period column (`Q1 FY26` · `FY25` …) · revenue / EBITDA / PAT / PBT columns as approved · tabular numerals · `as on` in the caption · a source footnote · `aria-sort` columns. Rows render only where a statement exists; otherwise the designed filing row (§7).
- **Mode `library`** (Downloads) — **grouped document records** by category: Policies · Credit Ratings · Shareholding Information · Distribution Information · Presentations. Each record is a ruled row (reference · title · date · type · size · status · action), *not* a card grid. The folded IA routes surface here as category groups.

Filter config is an **array** — the taxonomy (category, year, type) grows without redesign. The archive ships with its full structure and its filing states; rows appear when filings are approved.

### 3.4 FilingRow — the archival record

The archive's atomic unit, a single hairline row: **document reference** (`RD-2026-001`) · **as-on date** · **title** · **category** small-caps · **status indicator** (Published / Pending filing / External — never colour-only) · **file size** where known · **action** (`Download PDF` / `Open on ndrinvit.com` / `View`). Rows are keyboard-reachable, hover-emphasis only, reveal with a ≤ 120 ms stagger.

### 3.5 CapitalCycle — the signature visual moment

The one moment on the page that is a diagram, and it must be understood **within five seconds**:

- A **charcoal band** carrying a custom architectural SVG — four numbered nodes on thin connectors, the deck's diagram language (Design Direction §3.13): **01 Develop → 02 Stabilise → 03 Offer (ROFO) → 04 Recycle**, the loop closing back to Develop.
  - **01 Develop** — greenfield industrial and logistics assets, designed to institutional grade.
  - **02 Stabilise** — assets complete and are leased to marquee occupiers.
  - **03 Offer** — NDR InvIT receives the Right of First Offer over eligible completed assets.
  - **04 Recycle** — capital returns to new development.
- Gold serif numerals, maroon on charcoal, hairline connectors, generous whitespace. Deterministic SVG (`role="img"`), **passive** — no tooltips, no node interaction, no animation loop.
- This is a **new diagram**, not About's LifecycleDiagram ring. The capital cycle fulfils the guide's "LifecycleDiagram (capital cycle)" license *intent* without importing About's exclusive ring composition (§11).

### 3.6 SafeHarbourBlock

The full verbatim Slide 2 text, rendered as a document disclosure section on the landing (id `safe-harbour`): the deck's **SAFE HARBOUR** heading + the forward-looking-statement paragraph, copied **exactly** from the source deck at implementation time (the deck file is the canonical text — the extract in the project notes is truncated). Full legible body copy, visible (not collapsed), on a hairline-ruled ivory surface. Every sub-page's footer carries a concise disclaimer line: *"Forward-looking statements — read the full safe-harbour statement."* → `/en/investor-centre#safe-harbour`.

### 3.7 Corporate Governance — the flagship

Designed at full depth, content conditional (§7). The register of how the company is controlled:

1. **GovernanceMasthead** — slim document masthead (`Corporate Governance` · as-on · edition).
2. **GovernanceFramework** — one editorial statement (how control works) + framework rows sourced to the deck's governance commitments (active stakeholder engagement · well-defined policies and procedures · strong governance framework · full regulatory compliance · cybersecurity policy and periodic awareness programmes · auditor-certified utilisation certificates). Hairline rows, sourced, hedged.
3. **BoardRegister** — the Leadership-slots license (guide §4): board members as board-register slots; **photo-gated** — portrait renders from `profiles[].photo`, otherwise the numbered Record empty state. Never a placeholder shell.
4. **CommitteeIndex** — the committee register (Audit · Nomination & Remuneration · Stakeholders' Relationship · CSR, as confirmed). Hairline rows; a committee with no approved data renders its filing row.
5. **PolicyIndex** — the policy register (hairline rows) with **documentary references** to the policy PDFs (the folded Policies route surfaces here and in Downloads).
6. **GovernanceDisclosure** — documentary references: links to the governance sections of the Annual Report, board/committee charters, and the audit trail. InvIT governance links out to `ndrinvit.com`.

---

## 4. Data model — `src/lib/data/investor.ts`

### 4.1 Types

```ts
export type InvestorMetric = {
  id: string; // stable source-of-truth key ("M1"…"M16") — never the array index
  stat: string; // display name
  value: string; // pre-formatted display value ("60+", "₹5,000 cr", "98%")
  period: string; // reporting period, always stamped "as on"
  source: string; // one source per figure
  entity: "ndr-smart-spaces" | "ndr-invit" | "ndr-group"; // attribution — never conflated
  lead?: boolean; // landing MetricsBand headline set
};

export type CapitalCycleNode = {
  number: "01" | "02" | "03" | "04";
  label: string;
  caption: string; // one line, ≤ 5-second comprehension
};

export type TimelineNode = { year: string; title: string; caption: string; detail?: string };

export type FilingStatus = "published" | "pending" | "external";
export type FilingCategory = string; // config-driven taxonomy

export type Filing = {
  ref: string; // explicit document reference ("RD-2026-001") — unique, validated, never derived
  asOn: string;
  title: string;
  category: FilingCategory;
  type: string; // PDF | Circular | Results | …
  status: FilingStatus;
  size?: string; // only where known
  href?: string; // external PDF / InvIT URL for status "external"
};

export type StatementRow = {
  period: string; // "Q1 FY26"
  cells: { label: string; value?: string }[]; // revenue / EBITDA / … — undefined renders filing dash
  source: string;
};

export type DocumentGroup = { category: string; documents: Filing[] };

export type Governance = {
  framework: { title: string; statement: string; rows: { label: string; note: string; source: string }[] };
  board: { id: string; name: string; role: string; photo?: { src: string; alt: string } }[];
  committees: { id: string; name: string; charter: string; status: FilingStatus }[];
  policies: Filing[];
};
```

### 4.2 The single source-of-truth table (seed)

All figures cross-checked against the frozen builds (`homepage.ts` · `about.ts` · `business.ts`) and the source deck. *One stat, one source, everywhere.*

| Ref | Stat | Value | Period | Source | Entity | Frozen match |
|---|---|---|---|---|---|---|
| M1 | Industrial experience | 60+ years | as on 2026 | Corporate presentation §21 | NDR Smart Spaces | ✓ (60+) |
| M2 | Founded | 1954 | 1954 | Corporate presentation §4 | NDR Group | ✓ |
| M3 | Portfolio occupancy | 98% | as on 31 Mar 2026 * | Corporate presentation §21 | NDR Smart Spaces | ✓ |
| M4 | Consumption-market access | ~80% of India's consumption markets | as on 2026 | Corporate presentation §21 | NDR Smart Spaces | ✓ |
| M5 | Clientele | 100+ Fortune Global 500 companies | as on 2026 | Corporate presentation §21 | NDR Smart Spaces | ✓ |
| M6 | Developer standing | Fourth largest warehouse developer in India | as on 2026 | Corporate presentation §21 | NDR Smart Spaces | — |
| M7 | NDR InvIT valuation | ₹5,000 cr | as on 2026 | Corporate presentation §21 | **NDR InvIT Trust** | — |
| M8 | NDR InvIT IPO | INR 8.8 bn (₹880 cr), NSE listing | 2018 | Corporate presentation §8 · NSE | **NDR InvIT Trust** | ✓ (₹880 cr, 2018) |
| M9 | MLG monetization | INR 143.9 cr, sold to NDR InvIT | 2025 | Corporate presentation §8 | NDR Smart Spaces / NDR InvIT | ✓ |
| M10 | Institutional investment | $100 mn — US global PE, $90 bn+ AUM | 2023–24 * | Corporate presentation §8 | NDR Smart Spaces | ✓ (no year) |
| M11 | Institutional investment | $60 mn — global financial institution, $15 bn / 400 companies | 2023–24 * | Corporate presentation §8 | NDR Smart Spaces | ✓ (no year) |
| M12 | Fundraise | $23 mn — US/UK/India PE consortium | 2018 * | Corporate presentation §8 | NDR Smart Spaces | — |
| M13 | Early institutional backing | $7 mn — Kotak Alternatives | 2011 | Corporate presentation §8 | NDR Smart Spaces | ✓ (Kotak) |
| M14 | Greenfield share | 99% of industrial projects greenfield | as on 2026 | Corporate presentation §17 | NDR Smart Spaces | ✓ |
| M15 | Debt standing | Long-term bonds · AAA-rated entity | as on 2026 | Corporate presentation §29 | NDR Smart Spaces group | — |
| M16 | Geographic reach | Pan-India — Mumbai · NCR · Bengaluru · Chennai · Kolkata · Pune · Goa · Hyderabad · Surat | as on 2026 | Corporate presentation §21 | NDR Smart Spaces | — |

\* = period **client-confirm before go-live** (Design Direction §8 "final stat source list").

**Lead set (landing MetricsBand):** M1 · M3 · M4 · M5 · M7. **Full statement (Investment Highlights):** M1–M16.

**Suppressed — no approved figure, no metric:** WALE (deck says "long WALE", no number — qualitative row only) · total GLA / portfolio area (never supplied) · Amazon 6,00,000 sq ft / 4-month delivery (project proof, owned by Portfolio/About) · all InvIT financials, distributions, credit ratings, shareholding (pending; live at `ndrinvit.com`).

**Stat reconciliation note:** the deck and the client overview state "60+ years" while the group was founded in 1954. The canonical operating figure is **60+ years** (client's own wording, frozen on Homepage/About/Business). "Founded 1954" renders as a separate, independently sourced fact (M2); the site never derives years from the founding year. About's label "Years of industrial experience since 1954" is internally inconsistent (60+ ≠ 72) and is recorded as a **future change request** — About is frozen and is not touched by this phase.

### 4.3 Capital-market milestones (distinct from About's journey)

Not a duplicate of About's six-node history — this is the **investor's** record, and the two pages state different events:

2011 Kotak Alternatives backing · 2015 NDR InvIT Trust incorporated · 2018 NDR InvIT listed on the NSE (INR 8.8 bn — India's first warehousing InvIT) · 2023–24 $100 mn US global PE investment · 2023–24 $60 mn global financial institution investment · 2025 MLG (INR 143.9 cr) and SPV transfers to NDR InvIT · 2026 as on. Years flagged * carry the same client-confirm obligation as M10–M12.

### 4.4 Document references (explicit, never derived)

Filing references are stable, unique keys set in data — the same discipline as Portfolio's plate numbers. Prefix by archive: `RD-` (Reports & Disclosures) · `FR-` (Financial Results) · `AR-` (Annual Reports) · `AN-` (Announcements) · `DL-` (Downloads) · `PO-` (Policies). Validation on ingest; editing one record never renumbers another.

---

## 5. Component architecture

**New (14 + local states):**

1. `InvestorMasthead` — document cover (landing) / slim document header (sub-pages). Registry eyebrow, title, as-on line, edition line. No hero image, no overlay, no gradient.
2. `ContentsRail` _(client)_ — sticky statement index of contents; links landing anchors + the six sub-page routes. Tabular, quiet; distinct from Business's chapter rail.
3. `EditorialStatement` — the one fiduciary sentence.
4. `MetricsBand` — hairline-ruled sourced metrics (value · label · period · source). Static.
5. `CapitalCycle` — the passive charcoal signature diagram (architectural SVG, §3.5).
6. `CapitalMarketTimeline` — AboutTimeline license with investor milestone data; captions always visible.
7. `InvITRelationship` — ROFO matter-of-record section + external `ndrinvit.com` link.
8. `SafeHarbourBlock` — verbatim disclosure, id `safe-harbour`.
9. `StatementTable` _(client)_ — the investor-owned ruled table (tabular numerals, maroon headers, zebra rows, source footnote, `aria-sort`). Powers Investment Highlights and Financial Results.
10. `FilingLibrary` _(client)_ — one component, three modes (`index` · `table` · `library`) via config. Owns filter tabs + row reveal.
11. `FilingRow` — the archival record (§3.4).
12. `DocumentGroup` — category-blocked records for Downloads (`library` mode).
13. `ResilienceIndex` — qualitative, sourced risk & resilience rows (deck §29).
14. `GovernanceManual` — the flagship composition: framework · board register · committee index · policy index · documentary references. Local sub-parts: `BoardSlot` (photo-gated), `CommitteeRow`, `PolicyRow`.
15. `InvestorClosing` — charcoal colophon.

**Reused (existing):** `Container` · `Section` · `Band` · `Grid` · `GridItem` · `Stack` · `Eyebrow` · `Heading` · `Lede` · `Body` · `Caption` · `Metric` · `SourceFootnote` · `TextLink` · `ExternalLink` · `Button` · `Icon` · `VisuallyHidden` · `Reveal` (document-section level only) · `AboutTimeline` (as `CapitalMarketTimeline`, investor data) · Header/Footer.

**Explicitly NOT used:** `Counter` (forbidden — no count-up on this page) · `LifecycleDiagram` (About's ring composition; replaced by the new `CapitalCycle`) · `ChapterHeader` / sticky Business chapter rail · `ProjectPlate` / plate language · `IndiaMap` / `AtlasMap` · `PartnershipBand` · `FeaturedProjects` · `Esg` plate.

**Server/client split:** masthead, editorial, metrics, capital cycle, timeline, InvIT relationship, safe harbour, resilience, governance manual, closing render as static server components. Only `ContentsRail` · `StatementTable` · `FilingLibrary` are `"use client"`. Deterministic SVG, no `Math.random`, no `Date` — hydration-safe.

---

## 6. Interaction & accessibility

- **Signature interaction:** the **ruled statement table + archive filter tabs** (guide §2.4). Table-row hover/focus emphasis; `aria-sort` columns; `aria-pressed` tab groups; row reveal with ≤ 120 ms stagger. The CapitalCycle is a visual signature, **not** an interaction — passive `role="img"` with a visually-hidden node list (existing site pattern).
- **Archive:** semantic tables (`<caption>`, `th scope`) and rows with full keyboard reach; filter tabs are buttons with `aria-pressed`; sort is `<button aria-sort>`; external filings carry `ExternalLink` semantics (explicit label + target).
- **Status indicators:** glyph + text, never colour-only (WCAG 1.4.1).
- **Safe harbour:** full legible copy (not a collapsed accordion), generous line-height; the sub-page footer disclaimer is a plain `TextLink` to `#safe-harbour`.
- **Motion (subtle editorial only):** rule draws (metrics band, statement headers) · fade + rise reveals at **document-section level** · archive row reveals (≤ 120 ms stagger). **Forbidden:** count-up, card choreography, staggered card bursts, marquee, parallax, infinite loops. One easing curve and the three token durations (Design Direction §3.11). `prefers-reduced-motion` → everything instant, counters never animate (they do not exist here), values render final.
- **Baseline inherited:** 48 px targets, gold focus rings (2 px, 2 px offset), skip-link, landmarks, WCAG 2.1 AA.

---

## 7. Filing / empty states (designed, first-class)

1. **Archive filing row** — an archive with no approved filings renders one ruled row per category: small-caps "Documents being filed" + "Records publish as filings are approved." No card grid, no skeleton, no grey box.
2. **Statement pending rows** — Financial Results renders the statement table's structure; a period with no approved statement shows a filing dash (`—`) in its cells and a single ruled filing row beneath. Never a fabricated result.
3. **Governance pending** — a board member without an approved portrait renders the numbered Record empty state (leadership license); committees and policies without data render filing rows. Framework rows render only with sourced commitments.
4. **Downloads pending** — each category group renders its filing row until documents publish. The four folded IA routes (Policies · Credit Ratings · Shareholding · Distribution) appear as category groups even before content lands.
5. **Audit obligation** — seeded, sparse, and fully-empty states are all verified layouts (§13). Empty must be designed, never defaulted.

---

## 8. Mobile behavior (designed now)

- **Masthead** — cover/slim block stacks cleanly; registry eyebrow, as-on and edition lines survive.
- **ContentsRail** — desktop sticky; on mobile it becomes a **horizontal scroll-snap chip row** beneath the masthead. No sticky height tax.
- **MetricsBand** — stacked hairline-ruled entries (label over value); period + source always visible beneath each value.
- **CapitalCycle** — nodes stack vertically on a charcoal band with connectors; numbering and captions survive; the 5-second read persists.
- **StatementTable / Financial Results** — collapses to **stacked statement rows** (period + labelled cells) with no horizontal scroll; sort becomes a select.
- **FilingLibrary** — rows stack full-width; filters become a scroll-snap chip row; document references and status indicators remain the constant.
- **Governance** — board slots and committee rows stack; photo-gated states unchanged.
- The document language is the constant across breakpoints — the archive rows, references, and as-on stamps survive every collapse.

---

## 9. Content balance

Narrative: masthead · one editorial statement · the capital-cycle node captions · framework statements · closing line. Structural–document: contents rail · metrics band · statement tables · capital-cycle diagram · timeline · archive rows · governance registers · safe-harbour block. **≈ 20% narrative / 80% structural-document** against the financial-statement density target. No two consecutive full-width text blocks; tables and rows carry the information.

---

## 10. CMS compatibility & scalability

- **Collections:** `metrics` · `milestones` · `cycleNodes` · `filings` · `statements` · `documentGroups` · `governance` — all render from data; a CMS editor adds/edits rows without rebuild.
- **FilingLibrary config** — one component, five routes, three modes; new archive routes (e.g., a future "Policies" route) are configuration, not new builds.
- **Stable keys:** `id` (CMS primary key) · `ref` (explicit document reference, validated unique) · `status` enum · `entity` attribution. No index-derived numbering.
- **Filter config arrays** — category/year/type taxonomy grows without redesign.
- **`entity` field on every metric** — the InvIT handoff can later become an in-page dimension without a model change.
- **External filings** — `status: "external"` links to `ndrinvit.com`; InvIT documents are referenced, never mirrored.

---

## 11. Identity Guide alignment (identity-language changes recorded)

To be written into Page Identity Guide §2.4 at freeze (§14). Changes from the current design-intent text:

1. **"LifecycleDiagram (capital cycle)"** — fulfilled by the new **CapitalCycle** diagram (four-node capital loop). About's LifecycleDiagram composition is **not** reused; About keeps its ring, Investor keeps its loop.
2. **"AboutTimeline (InvIT milestones)"** — confirmed, with **distinct investor data** (`CapitalMarketTimeline`); About's journey and Investor's capital-market record state different events.
3. **"Ruled data tables"** — confirmed as **`StatementTable`**, investor-owned; Portfolio's register remains the licensee with its distinct plate-column identity.
4. **New exclusives to record:** document cover masthead with as-on + edition lines · the contents rail (statement index, distinct from Business's chapter rail) · the sourced MetricsBand (static, ruled) · the CapitalCycle loop diagram · FilingRow archive records with document references · the safe-harbour disclosure block · the governance flagship registers.
5. **Identity and screenshot cue retained:** "The Financial Statement"; "masthead + contents rail above a full-width ruled statement table with footnotes; 'as on' datestamps."

---

## 12. CTAs resolved (live targets only)

- Persistent header CTA `Investor Centre` → `/en/investor-centre`; megamenu links land on the eight routes above (already in `navigation.ts`).
- Landing: `Read the full statement →` `/en/investor-centre/investment-highlights` · `Open the archive →` `/en/investor-centre/reports-disclosures` · `Governance →` `/en/investor-centre/corporate-governance` · `Downloads →` `/en/investor-centre/downloads` · `NDR InvIT Trust →` `https://ndrinvit.com` (external) · `Write to the investor mailbox →` `mailto:compliance@ndrsmart.com` · `Business Enquiry →` `/en/contact#business-enquiry`.
- Sub-page footer disclaimer → `/en/investor-centre#safe-harbour` (in-page anchor, live in this phase).
- No CTA points at an unbuilt route.

---

## 13. Quality gates (all run before any freeze claim)

1. `npm run typecheck` · `npm run lint` · `prettier` clean.
2. `npm run build` (`output: "export"`) — all eight routes pre-rendered.
3. Zero console errors / horizontal overflow at 1920 · 1440 · 1280 · 1024 · 768 · 390 — **in both seeded and empty data states**.
4. All CTAs resolve only to live targets (§12); footer disclaimers resolve to `#safe-harbour`.
5. Identity exclusives respected (§1.1/§1.2); homepage/about/business/portfolio frozen files untouched.
6. No TODO / FIXME / console.log / debugger / `@ts-ignore` / `@ts-expect-error`.
7. Reduced motion + keyboard reachability verified on the statement table, filter tabs, and archive rows.
8. Safe-harbour language verified **verbatim** against the source deck.
9. Every rendered figure present in the source-of-truth table (§4.2) with period + source; no derived arithmetic.
10. Metadata and document titles correct for all eight routes.

---

## 14. Post-build documentation (per Documentation rules)

When the build passes §13 gates: update Page Identity Guide §2.4 from design intent to the built identity (§11 changes) · update the roadmap freeze-state table · run the Playwright audit matrix · record the exclusive visual language and forbidden patterns (§1.1) · log the About "since 1954" wording reconciliation as a client change request · confirm the client-flagged periods (§4.2) and the investor-retention B1 gate before any freeze claim.

---

## 15. Open items (carried in the document, not resolved here)

- **Investor Centre retention / B1 gate** — client on hold; this build ships on approval (Design Direction §8).
- **As-on date + edition** — default `As on 31 March 2026 · Edition FY26`; exact as-on date client-confirmed.
- **Client-flagged periods** — M3, M10, M11, M12 and the 2023–24 milestone years require client confirmation (the deck places the two institutional investments in a 2023–24 cluster).
- **Final stat source list** — client confirmation before go-live; the §4.2 table is the seed.
- **Investor-logo usage** — requires client approval; entity names appear in text meanwhile.
- **InvIT-owned content** — financials, distributions, credit ratings, shareholding remain at `ndrinvit.com`; links only.

---

_This document is the working authority for the Investor Centre build. The design system (Design Direction v2), the Page Identity Guide, and the four frozen pages override it wherever they conflict. Client documentation is the single source of truth for all content._
