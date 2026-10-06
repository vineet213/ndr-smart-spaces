# NDR Smart Spaces — UX Backlog

Lead UI/UX Designer · working register of deferred, non-blocking improvements and content-dependent work for the built pages (Homepage · About Us · Business).

Derives from: Page Identity Guide v2 · Design Direction v2 · Homepage Visual Specification · the production audit (Playwright quantitative audit across 1920 · 1440 · 1280 · 1024 · 768 · 390).

---

## 0. Status note

Homepage, About Us, and Business are **frozen**. The items below are either (a) confirmed resolved during the consolidation pass, recorded for traceability, or (b) deferred work that does not touch the frozen build — it is the next phase's backlog. Nothing here is a defect in the frozen pages; all gates pass.

---

## 1. Resolved during consolidation (recorded for traceability)

| #   | Item                                                | Finding                                                                                                                                      | Resolution                                                                                                                                                                                                                                 |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1  | Business Masthead TOC collision at 768px            | Desktop `flex:1` columns applied at exactly 768 (mobile block was `max-width: 767px`); "02Capabilities & Services" bled 14px past its column | TOC rules moved into `@media (max-width: 768px)`; content-sized flex columns, `overflow-x: auto`, scroll-snap. Verified at 768: scrollable index, no bleed                                                                                 |
| R2  | Homepage horizontal overflow at 390px               | `AudienceStrip` links (grid `1fr` columns with `nowrap` descriptors + 2rem padding) forced min-content to 269px/col → page panned to 574px   | `min-width: 0` on `.link` and `.descriptor`, reduced padding at ≤767px; descriptors ellipsize. Verified: `scrollWidth == 390`                                                                                                              |
| R3  | "No focus ring" (audit probe)                       | First-link computed `outline-style: none` read on an unfocused element                                                                       | False positive — global `:focus-visible` (2px gold, 2px offset) in `base.css` plus per-component focus rules (LifecycleDiagram cells, BusinessHighlights cards, IndiaMap dots, MarqueeClients items, mega-menu triggers). Verified present |
| R4  | Capability matrix `run:5` metric                    | Bordered register's internal 1px hairlines were counted as runs by the scan                                                                  | Metric artifact of the bordered layout, not a visual defect; register reads correctly to the eye                                                                                                                                           |
| R5  | CorporateStructure `headerPlate` 497/537 "overflow" | 40px connector `::after` (deck line-art style)                                                                                               | Intentional connector, not overflow                                                                                                                                                                                                        |
| R6  | Rail / strip "clipped labels"                       | Flyout label + sr-only duplicate caused clipped-text flags                                                                                   | Intentional pattern; flyout verified working on hover/focus                                                                                                                                                                                |

---

## 2. Deferred — pending client content (conditional render already shipped)

- **Portfolio register rows** — asset table structure is in the Page Identity Guide (§2.3); rows appear when asset data lands. Map↔register linked highlight is the first interaction to build.
- **Business vertical imagery** — verticals lead with typographic plates today; real-asset photography (architectural crops, hi-vis scale) enters only as hairline-framed plates where approved.
- **Media rows & ESG chapters** — dated index rows and chapter plates render conditionally on content (guide §2.5, §2.6).

## 3. Deferred — next phase (Portfolio build)

- Portfolio: full-width map field hero · zone-by-zone sections · ruled sortable asset register · map↔register linked highlight · zone/class/status filters · status badges (Completed / Ongoing).
- The demo route (Core UI Library) stays available for build reference; not in navigation.

## 4. Deferred — future polish (no change without a written change request)

- Consider an explicit score/rating field on the capability matrix so future tooling reads runs directly (today the bordered register is the scoring device).
- Monitor the 1440→1280 step for the sticky rail: at 1280 the flyout label remains correct, but re-run the quantitative audit after any nav change.
- Re-run the full audit matrix after each new page ships (each page verifies against the same gates per Page Identity Guide §7).
