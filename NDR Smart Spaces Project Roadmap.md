# NDR Smart Spaces — Project Roadmap

Lead UI/UX Designer · build sequence for the corporate website, frozen-state tracker, and release gates.

Derives from: Page Identity Guide v2 · Design Direction v2 · Homepage Visual Specification.

---

## 0. Current state

| Phase | Page                   | State                                                          |
| ----- | ---------------------- | -------------------------------------------------------------- |
| 1     | Homepage               | **Frozen** (v2.1 production build, QA + collision audit clean) |
| 2     | About Us               | **Frozen** (V2 ledger build, approved)                         |
| 3     | Business               | **Frozen** (Operating Manual, Production Pass V1 + visual QA)  |
| 4     | Portfolio              | Design intent (Page Identity Guide §2.3) — **next build**      |
| 5     | Investor Centre        | Design intent (§2.4)                                           |
| 6     | ESG                    | Design intent (§2.5)                                           |
| 7     | Media                  | Design intent (§2.6)                                           |
| 8     | Contact                | Design intent (§2.7)                                           |
| —     | Demo / Core UI Library | Reference route, kept for build reference (not in navigation)  |

Consolidation & freeze pass: complete — cross-page consistency audit, dead-code cleanup, Page Identity Guide v2, UX backlog, freeze protocol. Two real defects found and fixed (Business TOC 768px; Home AudienceStrip 390px overflow). All gates pass; zero console errors and zero horizontal overflow across all four built routes × 1920/1440/1280/1024/768/390.

## 1. Release gates (every page)

1. `typecheck` · `lint` · `prettier` clean.
2. Production build (`output: "export"`, `trailingSlash`) clean, all routes pre-rendered.
3. Zero console errors and zero horizontal overflow across 1920 · 1440 · 1280 · 1024 · 768 · 390 (Playwright quantitative audit).
4. Header/footer and page CTAs resolve only to live anchors or external surfaces.
5. Identity exclusives respected (Page Identity Guide §2, §7).
6. No TODO / FIXME / console.log / debugger / `@ts-ignore` / `@ts-expect-error`.
7. Reduced motion + keyboard reachability verified on signature interactions.
8. Metadata and document titles correct.

A page is **frozen** when it passes all eight; after freeze, no content/layout/interaction work without a written change request (defect or client approval). See Page Identity Guide §7.

## 2. Build order (dependency of existing CTAs)

1. ~~Business~~ — done.
2. **Portfolio** — target of the homepage map's "View Portfolio →". Builds the register + linked-map interaction; structure ships, rows conditional on data. Primitives: IndiaMap pins already exist (Homepage), zone facts exist (Homepage PortfolioPresence).
3. **Investor Centre** — target of the persistent header CTA. Builds statement tables, report library, safe-harbour block; reuses LifecycleDiagram and AboutTimeline.
4. **ESG** — reuses the Esg plate and KeyNumbers language; new chapter-numeral framing only.
5. **Media** — dated index and filter; rows conditional on content.
6. **Contact** — reuses EnquiryForm; the letterhead is mostly a new composition of existing blocks.

## 3. Roadmap notes

- No new page starts until the current phase is frozen under §1 gates.
- Content-dependent rows ship as structure and render when data lands (guide §5.7) — never empty shells.
- Entity separation (NDR Smart Spaces · NDR Asset Management · Ave Acres · NDR InvIT Trust) is visual and verified on Business, Portfolio, Investor Centre.
- The `out/` export and the Playwright audit suite (temp workspace) are the verification harness; the audit matrix is re-run per page.
