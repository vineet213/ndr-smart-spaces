# NDR Smart Spaces — Portfolio Page Architecture V1.1

**Identity: The Institutional Catalogue / The Atlas · register of places**
Lead UI/UX Designer & Senior Frontend Engineer · derives exclusively from: Page Identity Guide §2.3 (design intent) · Design Direction v2 §3.15 · the approved builds (Homepage · About Us · Business) · the shared design tokens and component system.

Status: **Architecture V1.1 — revised per board review. Identity approved in principle; implementation pending acceptance of this revision.** Homepage · About Us · Business remain frozen and are not touched by this phase. No code has been written; this document is the build authority.

Revision note: V1.1 supersedes V1.0. V1.0 was returned with ten required changes (eight mandatory revisions R1–R8, two additions R9–R10). Every one is resolved below; each resolution is traceable in §2.

---

## 0. What this page must be

Portfolio is the **Institutional Catalogue** — a documented inventory of the assets NDR Smart Spaces develops and owns. It is the most visual page on the site and the only page where **photography leads**. The visitor's question is not _"what do you do?"_ (Business) or _"who are you?"_ (About). It is _"what exists on the ground?"_ — and the page answers with maps, plates, and a register, not paragraphs.

Three immutable rules govern the build:

1. **Map-first, list-second** (Design Direction §3.15). The map is the hero field; the register is the analyst's tool.
2. **Entity honesty** (guide §3.14). Group SPV assets are catalogued here. NDR InvIT's portfolio lives at `ndrinvit.com` and is linked out, never absorbed.
3. **No invented facts.** Assets, imagery, and portfolio data are pending client items. The page ships its full structure; **rows, plates, and photographs render conditionally when approved data lands.** Only two asset records exist today (Amazon Coimbatore, Lenovo Puducherry — both approved homepage content). Everything else ships as designed structure and honesty states.

**Content Balance Doctrine (permanent rule):** Portfolio targets ~30% narrative / ~70% visual–structural. **Plates carry no prose** — the fact strip is the record. Narrative is confined to the masthead, one field caption, the register's framing line, and the colophon.

---

## 1. Why "Catalogue", not a fourth template

| Page      | Document              | Leading evidence device           | Signature interaction                   |
| --------- | --------------------- | --------------------------------- | --------------------------------------- |
| Homepage  | Front cover           | Hero stat band, logo grid         | Count-up                                |
| About     | Founding ledger       | Ledger plates, lifecycle ring     | Draw-in geometry, linked highlight      |
| Business  | Operating manual      | Matrices, process chains          | Sticky index + row emphasis             |
| Portfolio | **Catalogue / Atlas** | **Survey field + asset register** | **Register ↔ locator linked highlight** |

The Catalogue adds a device no other page has: **the plate** — a numbered, hairline-framed record (image + specimen-label strip). Plate numbers are the page's numbering system, distinct from Business's chapters (01–05) and About's records (Record 01–04). The same plate number appears on three carriers — the map node, the project plate, and the register row — which is how the page links geography to the analyst table.

**One visual signature and one interaction signature per page.** Portfolio's visual signature is the framed survey field; its interaction signature is the register↔locator linked highlight. There is exactly one interactive system on the page — the field is a monument.

---

## 2. V1.0 review → V1.1 revisions (traceability)

| #   | V1.0 issue                                                                                         | V1.1 resolution                                                                                                                                                                                                                                                                                 |
| --- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Masthead was the generic editorial spine (eyebrow → H1 → lede), colliding with Business            | **Centered atlas title-page.** H1 centered; paired 1px hairline rules above and below the title block (title-page convention); small-caps edition line. No control cells, no gold rule (About), no 2px maroon rule (Business). Centering is a stance no frozen page uses.                       |
| R2  | Survey field was not decisively distinct from the homepage map                                     | **Full-bleed, edge-to-edge, framed survey plate.** Hairline frame with **crop marks outside the frame** on the ivory page; graticule ticks; north indicator; catalogue mark; zone frames inside. A framed full-bleed object, not a contained column illustration.                               |
| R3  | Field interaction (zone-fact on hover) resembled the homepage map's tooltips                       | **Field is fully passive.** `role="img"`, no per-node tooltips, no zone-hover, no focusable nodes. The homepage map is the interactive map; the field is the monument. The page's only interaction lives in the register.                                                                       |
| R4  | Zone section headers replicated Business `ChapterHeader` (gold numeral + eyebrow + heading + lede) | **Portfolio plate header + plate-run markers.** Zone header is a 7/5 split — zone name left, approved fact right — with a **plate-run marker** ("Plates 01–02") as the catalogue transition device. No ChapterHeader skeleton, no diamond, no numbered-chapter block.                           |
| R5  | Register table could be mistaken for the CapabilityMatrix                                          | **Register is unmistakably a catalogue instrument:** leading gold plate-number column (tabular), status badges with glyphs, filter/sort control row (the matrix has none), the locator map panel, and a cross-reference framing line.                                                           |
| R6  | Plate fact strips copied the homepage's value-over-label fact grid                                 | **Specimen-label rows.** Each fact is `label left · value right` on a hairline, tabular numerals — the label of a museum specimen, not a homepage stat cell.                                                                                                                                    |
| R7  | Plate numbers derived from array index (renumbered on any edit); unbounded plates grids            | **Explicit `id` and `plate`** on every asset (stable, unique, set by data/CMS). **Plate-per-zone cap (4–6, one lead + compacts)** with a handoff to the register filtered to that zone. The register is the long tail; zones stay narrative.                                                    |
| R8  | No mobile behavior designed                                                                        | **Mobile designed now:** field compresses to a zone-level map (4 zone markers + frames only, no pin clutter); zone legend becomes full-width hairline rows; register becomes compact plate rows (stacked, no horizontal scroll); locator map is desktop-only with a zone-chip fallback on rows. |
| R9  | Single-layer model risked conflating locations with assets                                         | **Two-layer data model** — geography (locations/zones, complete today) vs inventory (assets, in filing). Derived counts are labeled by layer ("locations mapped" vs "assets catalogued"). No conflation.                                                                                        |
| R10 | Filing / empty states unspecified                                                                  | **Designed states:** per-zone filing row, plate-pending survey mark, register filing row, and a first-class empty layout. Both seeded and empty layouts are audited states (§7, §13).                                                                                                           |

---

## 3. The composition

### 3.1 Section order (the five acts of the catalogue)

1. **PortfolioMasthead** — the centered atlas title page. Eyebrow · paired hairlines · centered H1 ("The register of places.") · centered lede (narrow measure) · small-caps edition line (plate range + "Edition FY26", conditional on inventory). **Slim** — the field owns the hero viewport.
2. **AtlasField** — the full-bleed passive survey field, edge-to-edge, framed. **ZoneLegend** is furniture of this field, not a standalone section: a horizontal hairline with zone marks, names, and **derived location counts** (geography layer). No links, no interaction.
3. **ZoneSections** — zone-by-zone. Each zone **with assets** renders a plate header (7/5: name left, approved fact right) + **plate-run marker** + its **capped plates grid** + a handoff link ("Open the South register →") to the register pre-filtered to that zone. Zones without assets render a designed **filing row** instead of a shell.
4. **AssetRegister** — the analyst view. Framing line ("The cross-reference register — compare assets by location, class, size and status.") · filter/sort control row · two-panel: **LocatorMap** (desktop only) + **ruled asset table** with the leading gold plate column, status badges, and source footnote. Entity-honesty note beneath.
5. **PortfolioClosing** — charcoal colophon plate. InvIT handoff line + enquiry CTA + external InvIT route + business-model text link.

### 3.2 The seven levers (guide §1)

| Lever                 | Portfolio choice                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Background rhythm     | ivory → **full-bleed survey field** (ivory-dim plate) → ivory zones → ivory register → **charcoal colophon**. Map rhythm, not marketing alternation. |
| Hero stance           | **The survey field** — the framed map is the hero; the masthead is a title page above it.                                                            |
| Grid stance           | Asymmetric 7/5 and 5/7 two-panels carried through zone headers and the register.                                                                     |
| Density register      | Low around the field; **high in the register** (ruled and tight).                                                                                    |
| Data presentation     | **The asset register** leads; plates, zone legend, and status badges support.                                                                        |
| Interaction signature | **Register ↔ locator linked highlight** (zone/class/status filters + sort support).                                                                  |
| Imagery role          | **Photography leads** — the site's photo page; hairline-framed plates, warm grade. V1 ships map-led until imagery lands (flagged dependency).        |

### 3.3 Exclusive visual language (reserved for Portfolio)

- **The centered atlas title page** — paired hairlines, centered H1, edition line.
- **The survey field** — full-bleed framed map plate: graticule ticks, corner crop marks (outside the frame), north indicator, zone frames, catalogue mark. No scale bar (a schematic map must not imply real measurement).
- **Plate numerals** — explicit, unique; the catalogue's numbering system across map node / plate / register row.
- **Plate-run markers** — the page's transition device: a thin full-width hairline with the covered plate range in gold tabular numerals at the left edge ("Plates 01–02"), like a catalogue volume spine label.
- **Plate headers** — 7/5 zone headers (name left / fact right); not Business's numbered chapter block.
- **Specimen-label fact strips** — `label left · value right` on hairlines, tabular numerals.
- **Status badges** — Completed / Ongoing, small caps + glyph, never color-only.
- **The zone legend** — declarative field furniture with geography counts.
- **The locator index map** — compact, desktop-only, pin-linked.
- **The plate-pending mark** — a survey crosshair on a hairline-framed 16:10 plate, small-caps "Photography pending".
- **The charcoal colophon** — catalogue close with InvIT handoff.

### 3.4 Forbidden patterns on Portfolio

- No sticky rail / chapter index, no DrawnGrid blueprint, no process chains, no ChapterHeader block, no 2px maroon masthead rule (Business).
- No gold-diamond lifecycle circle, no typographic 3-line ledger hero lockup, no gold top-rule ledger as the leading device, no board-register slot language (About).
- No full-bleed cinematic hero with overlay gradient, no audience routing strip, no client logo grid, no count-up, no value-over-label fact cells, no interactive map tooltips, no marquee (Homepage).

---

## 4. Two-layer data model — `src/lib/data/portfolio.ts`

### 4.1 Layer A · Geography (complete today — approved data)

```ts
export type ZoneId = "south" | "west" | "east" | "north"; // reused type from homepage

export type GeoLocation = {
  id: string; // stable, unique
  name: string;
  zone: ZoneId;
  tier: "hq" | "hub" | "satellite";
  x: number; // schematic SVG placement (editorial framing, per approved diagrams)
  y: number;
  line: string;
  leaderTo?: { x: number; y: number };
};

export type GeoZone = {
  id: ZoneId;
  name: string;
  fact: string; // approved zone fact (homepage data)
  locations: string[]; // GeoLocation ids
};
```

- `zones` (4, approved) and `locations` (homepage's 15 + **Coimbatore** and **Puducherry** — both approved project locations, added as geography nodes).
- Powers: the survey field, the zone frames, the zone legend (derived **location counts**, labeled as geography), the locator map, and the register's zone column + zone filter.

### 4.2 Layer B · Inventory (in filing — rows conditional on data)

```ts
export type AssetStatus = "completed" | "ongoing";
export type AssetClass = "warehousing" | "industrial" | "commercial" | "institutional";

export type PortfolioAsset = {
  id: string; // stable CMS primary key — never the array index
  plate: string; // explicit catalogue number ("01", "02"…) — validated unique on ingest
  name: string; // approved asset name
  city: string;
  zone: ZoneId;
  locationId?: string; // pairing key to Layer A (a pin may serve several assets)
  class: AssetClass;
  status: AssetStatus;
  sizeSqFt?: number; // optional — never invent sizes
  occupier?: string; // only where public
  completedYear?: string; // optional
  entity?: "spv" | "invit"; // future-proofing for InvIT records; not rendered until approved
  image?: { src: string; alt: string }; // pending
  route?: { label: string; href: string }; // future project-detail; not linked until built
  source: string; // "one stat, one source"
};
```

**Seed (only approved records):**

- `id: "amazon-coimbatore"`, `plate: "01"` — Amazon Fulfilment Centre · Coimbatore · south · warehousing · completed · 6,00,000 sq ft · occupier Amazon · `locationId: "coimbatore"`.
- `id: "lenovo-puducherry"`, `plate: "02"` — Lenovo Industrial Facility · Puducherry · south · industrial · completed · occupier Lenovo · 2002 · `locationId: "puducherry"`.

### 4.3 Numbering and pairing rules

- **Plate numbers are explicit, not derived.** Set by data/CMS; the data layer validates uniqueness on ingest. Editing or removing one asset never renumbers another.
- **Pairing is by `id`, never by index.** Register row → pin via `locationId` → `GeoLocation.id`. One pin may serve many rows (several assets at one hub); rows without `locationId` render a dash and no highlight.

---

## 5. Component architecture

New (9 + local states):

1. `PortfolioMasthead` — centered atlas title page (paired hairlines, edition line).
2. `AtlasField` — the full-bleed passive survey section; hosts `AtlasMap` + the **ZoneLegend** furniture. Server-rendered, no client state.
3. `AtlasMap` — passive survey SVG: outline, graticule ticks, corner crop marks, north indicator, zone frames, catalogue mark, node glyphs. `role="img"`; deterministic.
4. `ZoneLegend` — field furniture: horizontal hairline, zone marks + names + derived location counts. No links, no interaction.
5. `ZoneSection` — plate header (7/5) + plate-run marker + capped plates grid + register handoff. Renders only for zones with assets; otherwise a **filing row**.
6. `ProjectPlate` — plate numeral, hairline 16:10 image (or **plate-pending mark**), specimen-label strip, status badge. `lead` and `compact` variants for hierarchy inside the capped grid.
7. `AssetRegister` _(client)_ — framing line, filter/sort control row (config-driven), two-panel (locator + table), source footnote, entity note. States: filled, sparse, empty (filing row).
8. `LocatorMap` _(client, desktop-only)_ — compact pin index; receives linked-highlight state from the register. Mobile: hidden; rows show a zone chip instead.
9. `PortfolioClosing` — charcoal colophon.
   `StatusBadge` — local micro-component (glyph + small caps).

Reused: `Container`, `Section`, `Band`, `Grid`, `GridItem`, `Stack` · `Eyebrow`, `Heading`, `Lede`, `Body`, `Caption`, `Metric`, `SourceFootnote`, `TextLink`, `ExternalLink`, `Button`, `Icon`, `VisuallyHidden` · `Reveal` (section-level only). No `Counter`, no `IndiaMap`, no `FeaturedProjects`, no `DrawnGrid`, no `ChapterHeader`.

Server/client split: masthead, field, legend, zones, plates, closing render as static server components. Only `AssetRegister` + `LocatorMap` are `"use client"`. Deterministic SVG, no `Math.random`, no `Date` — hydration-safe.

---

## 6. Interaction & accessibility

- **Register ↔ locator linked highlight** (the one signature): hover/focus a row → its pin (by `locationId`) emphasizes; pin focus → the row scrolls into view. Same linked-highlight language as the LifecycleDiagram, composed differently. Keyboard-reachable; reduced motion → instant.
- **Filters / sort**: small-caps toggle tabs (`aria-pressed`), sortable columns (`aria-sort`), semantic `<table>` (caption, `th scope`). Filter config is an **array** (extensible taxonomy). State-only, no motion.
- **Status badges**: glyph + text, never color-only (WCAG 1.4.1).
- **The field is passive** — no interactive map nodes, no tooltips, no keyboard traps. Its accessible equivalent is a visually-hidden location list (existing site pattern).
- **Reduced motion**: inherited globally (`reset.css` forces instant transitions); no pulse, parallax, or infinite loops; smooth scroll degrades to instant.
- **48 px targets, gold focus rings, skip-link, landmarks** — inherited system baseline.

---

## 7. Filing / empty states (designed, first-class)

1. **Zone filing row** — a zone with no assets renders a single hairline row: small-caps "Plates pending" + "Asset documentation in progress". Not a card grid, not an empty shell. (Same honesty precedent as About's Leadership register.)
2. **Plate-pending mark** — an asset with no image renders the 16:10 survey plate with a centered crosshair and small-caps "Photography pending". Never a grey box, never a skeleton.
3. **Register filing row** — zero assets renders a single ruled row: "Asset records are being filed. Plates publish as documentation is approved." plus the entity note.
4. **Field at sparse inventory** — the survey field renders fully (geography is complete); the zone legend carries location counts; plate-run markers show the actual range ("Plates 01–02"). Nothing promises content that is absent.
5. **Audit obligation** — seeded, sparse, and fully-empty states are all verified layouts (§13). Empty must be designed, never defaulted.

---

## 8. Mobile behavior (designed now)

- **Masthead** — centered block stacks cleanly; paired hairlines and edition line remain.
- **Survey field** — compresses to a **zone-level map**: four zone markers + zone frames only; individual nodes and node labels are dropped at ≤767px. The framed treatment and crop marks survive. **ZoneLegend** becomes full-width hairline rows (zone name + location count).
- **Zone sections** — plate header stacks (fact below name); plates grid collapses to a single column; lead plate remains lead. Handoff row stays full-width.
- **Register** — becomes **compact plate rows**: each record is a stacked, hairline-divided mini-plate (plate number, name, city, size, status badge, occupier). **No horizontal scroll.** Filters collapse to a horizontal scroll-snap chip row; sort to a select.
- **Locator map** — **desktop-only**. On mobile, each row carries a zone chip; the linked-highlight signature degrades to row emphasis only (the pairing logic stays intact, so returning to desktop restores it).
- The atlas identity survives mobile because the **plate language is the constant** across breakpoints, not the map.

---

## 9. Content balance

Narrative: masthead (title block) · one field caption · register framing line · colophon line. Visual–structural: survey field, zone legend, plates (imagery + specimen labels), register. **≈ 25% narrative / 75% visual–structural** against the 30/70 target — the most visual page on the site, with **no prose on plates** and no two consecutive full-width text blocks.

---

## 10. CMS compatibility & scalability

- **Collections**: `zones`, `locations` (geography) · `assets` (inventory) — all render from data; a CMS editor adds/edits rows without rebuild.
- **Zones are a collection** — new zones auto-propagate to the legend, field frames, zone sections, and register filters. (Zone frames derive from location clusters.)
- **Stable keys**: `id` (CMS primary key), `plate` (unique, validated), `locationId` (pairing). No index-derived numbering.
- **Filter config array** — taxonomy (class, status, zone) grows without redesign.
- **`entity` field reserved** — the InvIT handoff can later become an in-page dimension instead of only a link, without a model change.
- **Image discipline** — WebP + lazy loading + srcset; a single warm grading pass on ingest (Design Direction §3.4). Performance at 50+ plates is carried by lazy images and the register absorbing the long tail.

---

## 11. Identity Guide alignment (identity-language changes recorded)

To be written into Page Identity Guide §2.3 at freeze (§14). Changes from the current design-intent text:

1. **"IndiaMap with locator dots"** → replaced by the **AtlasMap (passive survey field)** + **LocatorMap (desktop index)** pair. `IndiaMap` remains homepage-owned.
2. **"PortfolioPresence zone facts"** → replaced by the **ZoneLegend** (declarative field furniture, geography counts).
3. **"FeaturedProjects primary/compact"** → replaced by **ProjectPlate** (lead/compact within a zone, specimen labels, plate header). FeaturedProjects stays homepage-owned.
4. **New exclusives to record:** centered atlas title page · survey field (graticule/crop marks/north indicator/zone frames) · plate numerals · plate-run markers · plate headers · specimen-label strips · status badges · zone legend · locator index · plate-pending crosshair mark · charcoal colophon.
5. **Register identity and screenshot cue retained:** "The Atlas / register of places"; "the India map with gold nodes beside a ruled asset register; status badges in small caps."

---

## 12. CTAs resolved (live targets only)

- Homepage map "View Portfolio →", nav "Portfolio", Business "View the asset portfolio" land here.
- Portfolio's own CTAs: `Discuss an asset` → `mailto:project@ndrsmart.com` · `NDR InvIT Trust` → `https://ndrinvit.com` · `View the operating model` → `/en/business#verticals` · zone handoff → `#register` with the zone filter pre-set (in-page state, no unbuilt route) · colophon routes as above.

---

## 13. Quality gates (all run before any freeze claim)

1. `npm run typecheck` · `npm run lint` · `prettier` clean.
2. `npm run build` (`output: "export"`) — all routes pre-rendered.
3. Zero console errors / horizontal overflow at 1920 · 1440 · 1280 · 1024 · 768 · 390 — **in both seeded and empty data states**.
4. All CTAs resolve only to live targets (§12).
5. Identity exclusives respected (§3.3/§3.4); homepage/about/business frozen files untouched.
6. No TODO / FIXME / console.log / debugger / `@ts-ignore` / `@ts-expect-error`.
7. Reduced motion + keyboard reachability verified on the linked highlight.
8. Metadata + document title correct.

---

## 14. Post-build documentation (per Documentation rules)

When the build passes §13 gates: update Page Identity Guide §2.3 from design intent to the built identity (§11 changes), update the roadmap freeze-state table, run the Playwright audit matrix, and record the exclusive visual language and forbidden patterns (§3.3/§3.4).

---

_This document is the working authority for the Portfolio build. The design system (Design Direction v2), the Page Identity Guide, and the three frozen pages override it wherever they conflict. Client documentation is the single source of truth for all content._
