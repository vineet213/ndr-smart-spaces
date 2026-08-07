# NDR Smart Spaces — Page Identity Guide

**Composition doctrine for the corporate website**
Lead UI/UX Designer · derives exclusively from: Design Direction v2 · Homepage Visual Specification v2.1 · client documents · the approved homepage build · the approved About Us page

Version 2.0 · Status: Homepage · About Us · Business **frozen** (built and production-verified) · Portfolio · Investor Centre · ESG · Media · Contact remain design intent · Scope: the seven major pages of the approved IA (About Us · Business · Portfolio · Investor Centre · ESG · Media · Contact)

---

## 0. Purpose and authority

The homepage defines the **design system** — typography, colors, spacing, motion, components, and the institutional language. This guide defines the **page identities built on top of that system**.

Two rules govern everything in this document:

1. **The design system is frozen.** Nothing here adds a color, a typeface, a token, a radius, a curve, or a component behavior not already approved. Identities are _compositions_ of existing tokens, surfaces, components, and motion.
2. **No page may read as a clone of the homepage or of another page.** Shared components are encouraged; shared _composition_ is not. A visitor must recognize the page from a screenshot alone, without the URL.

Each page is assigned a **register** — a real document or object the page is composed like. The registers are drawn from the design direction's own metaphor, "a site that reads like an annual report you can scroll." Every page is a different document from the same house.

| Register                        | Page                    |
| ------------------------------- | ----------------------- |
| Front cover / Monument          | Homepage (existing)     |
| The Ledger / founding archive   | About Us (approved, V2) |
| The Operating Manual            | Business                |
| The Atlas / register of places  | Portfolio               |
| The Financial Statement         | Investor Centre         |
| The Sustainability Statement    | ESG                     |
| The Chronicle / wire            | Media                   |
| The Letterhead / correspondence | Contact                 |

---

## 1. The seven compositional levers

Distinct page personalities are produced by varying seven levers — **never by varying tokens**. If a page still feels like the homepage after choosing all seven, the composition is wrong, not the system.

1. **Background rhythm** — the sequence of surfaces (ivory / ivory-dim / maroon-dark / charcoal) that paces the page. The homepage runs marketing alternation (ivory → dim → dark → ivory). A page can run document alternation (ivory → ivory with a dark plate → ivory), map alternation (ivory → map field → register), or statement alternation (ivory → ruled table → charcoal plate).
2. **Hero stance** — what the top of the page _is_: a full-bleed scene, a typographic ledger, a document masthead, a map field, a technical plate, a magazine chapter opener, a newsroom dateline, or a letterhead.
3. **Grid stance** — the page's governing geometry: symmetric 12-col, asymmetric editorial splits, indexed ruled columns, map+register two-panel, magazine chapter grid, newsroom list, or stationery two-column.
4. **Density register** — where the page sits between "open editorial whitespace" and "ruled financial density." Density is an identity, not an accident.
5. **Data presentation style** — how evidence is carried: ledger plates, registers, statement tables, matrices, diagrams, indexes, or fact rows. Every page is _led by a different evidence device_.
6. **Interaction signature** — exactly one primary interaction per page (count-up, draw-in, linked highlight, filter, table row, or none). The signature is the page's motion identity.
7. **Imagery role** — whether photography leads (Portfolio), frames (Media, ESG), accents (Business, About plates), or is absent (Investor, Contact).

---

## 2. Page identities

### 2.0 Frozen visual identities (Homepage · About Us · Business)

The three approved builds are **frozen** — composition, interactions, and exclusives below are reserved. No unbuilt page (Portfolio · Investor Centre · ESG · Media · Contact) may adopt them, in whole or in part. §2.1 and §2.2 are built to this identity and frozen; §2.3–2.7 remain design intent until built.

#### Homepage — frozen

- **Reserved layout:** Full-bleed cinematic hero (Monument + horizontal stat band) · audience routing strip · client logo grid · the approved homepage section sequence. Marketing surface alternation (ivory → dim → dark → ivory).
- **Reserved interactions:** Count-up hero stats; the homepage section sequence as scrolled.
- **Reserved visual language:** Cinematic, imagery-led front cover; the client logo grid.
- **Exclusives (other pages must not adopt):** the full-bleed cinematic hero · the audience routing strip · the client logo grid · the homepage section sequence.

#### About Us — frozen (approved V2 + V2.1 production polish)

- **Reserved layout:** Single-column typographic ledger hero — eyebrow, gold rule, Fraunces headline in a fixed three-line lockup (_"From a rice mill to" / "institutional" / "infrastructure."_), lede, CTAs, then a **full-width hairline-framed stat band** (3 sourced metrics, gold top rule). No decorative plate, no strip-line motif, no imagery in the hero. Followed by the fixed section order: OurStory → AboutTimeline → VisionMissionValues → BusinessModel (LifecycleDiagram) → Leadership → WhyNdr → KeyNumbers → ClosingCta → Footer.
- **Reserved interactions:** Draw-in geometry (timeline spine, lifecycle ring, entry rules); node↔legend linked highlight on the lifecycle circle; staggered gold markers; once per view.
- **Reserved visual language:** The institutional ledger. Fraunces on ivory and dark-maroon bands; gold top rules as signature marks; hairline-divided ledger plates; the gold-diamond lifecycle circle as the page's geometric signature. No full-bleed imagery anywhere — this page is a document.
- **Reserved empty-state language:** Leadership renders a **board register** when profiles are empty — numbered "Record 01–04" entries ("Executive seat" / "Official profile pending" / "Reserved for board confirmation"). Portraits auto-render when `profiles[].photo` is supplied; no invented executives, bios, or illustrations.
- **Exclusives (other pages must not adopt):** the typographic ledger hero (Concept A) · the gold-diamond lifecycle circle · the full-width hairline stat band with gold top rule · the board-register Leadership empty state · the 1954 founding-archive narrative content (story, timeline, ledger metrics).
- **CTA doctrine (current build):** no About Us content CTA may resolve to an unbuilt route. Unbuilt targets are redirected to live anchors/external surfaces until built — `#story`, `#business-model-title`, `mailto:project@ndrsmart.com`, `https://ndrinvit.com`. Header/footer global navigation is shared and out of About Us scope.

#### Business — frozen (Operating Manual, production build)

- **Reserved layout:** Technical-plate masthead (eyebrow · Fraunces headline · lede · hairline) with a **responsive TOC** (content-sized index at ≤768px, scroll-snap) · a **sticky left rail** (01 Verticals · 02 Capabilities & Services · 03 Corporate Structure · 04 Capital Deployment · 05 Execution) with active-chapter emphasis, flyout label, and a strip progress indicator · the fixed chapter order: OperatingDivisions → CapabilityMatrix → CorporateStructure → CapitalDeployment → ExecutionFramework → BusinessClosing. One dark band (Capital Deployment). Ruled ivory elsewhere.
- **Reserved interactions:** Sticky section index with active state; flyout on hover/focus; strip progress line under the rail as the page scrolls; process chains draw left→right; no circular or playful motion; fully keyboard-accessible.
- **Reserved visual language:** Engineering blueprint. Orthogonal geometry — straight lines, right angles, numbered systems, hairline column grid across the page. Maroon as the working color; gold reserved for numbers and marks. Sentence-case, spec-precise typography.
- **Reserved data devices:** the capability **matrix with bordered register** (03 systems, run-scored rows) · the **corporate-structure diagram** (client template, deck line-art) · the **capital deployment band** (capital-cycle diagram referencing the LifecycleDiagram language on dark) · the **execution framework ledger** (numbered register rows with an evidence plate per stage, 2px maroon rule).
- **Exclusives (other pages must not adopt):** the sticky rail + strip index · the ruled capability matrix · the corporate-structure diagram · the capital-cycle dark band · the execution framework ledger.
- **CTA doctrine (current build):** every Business CTA resolves to a live target — existing anchors (`#verticals`, `#capabilities`, `#structure`, `#capital`, `#execution`), `mailto:project@ndrsmart.com`, or `https://ndrinvit.com`. No unbuilt route is linked from the page.

### 2.1 About Us — **The Ledger / founding archive** _(approved, built to this identity)_

- **Emotional objective:** Heritage, permanence, trust — _this house has kept its books since 1954._
- **Visual language:** The institutional ledger. Typography-led (Visual Specification Concept A, assigned to About Us). Fraunces on ivory and dark-maroon bands; gold top rules as signature marks; hairline-divided ledger plates; one geometric signature — the gold-diamond lifecycle circle.
- **Layout philosophy:** Asymmetric editorial alternation. A single-column typographic hero above a full-width hairline-framed stat band, a zigzag timeline spine, a 1fr/1.15fr diagram band. Surfaces alternate ivory → ivory-dim → maroon-dark → ivory for a document rhythm. **No full-bleed imagery anywhere — this page is a document.** _(V2.1: the 7/5 text-and-plate hero and decorative plate were removed; the hero is now purely typographic, the stat band is full-width.)_
- **Preferred components:** AboutHero (ledger) · OurStory plate · AboutTimeline · VisionMissionValues columns · LifecycleDiagram · Leadership board-register slots · WhyNdr ledger · KeyNumbers plate · ClosingCta plate · Metric + SourceFootnote · Counter · Reveal.
- **Interaction style:** Draw-in geometry (timeline spine, lifecycle ring, entry rules), staggered gold markers, node↔legend linked highlight. Quiet, once per view.
- **Density:** Medium — editorial; one idea per screen.
- **Whitespace rhythm:** Open voids between bands; dark bands are punctuations, not backdrops.
- **Imagery style:** None — no decorative geometry in the hero (the strip-lines and founder plate stand-in were removed in V2.1). The gold-diamond lifecycle circle is the page's only geometry. Approved photography enters only as hairline-framed 4:5 / 3:2 plates.
- **Data presentation style:** Ledger plates (metric + label + source), sourced key numbers, timeline nodes with always-visible captions.
- **Screenshot cue:** A gold top rule over a Fraunces headline with a full-width hairline stat band on ivory; the gold-diamond lifecycle circle on dark maroon.

### 2.2 Business — **The Operating Manual** _(frozen — built to this identity)_

- **Emotional objective:** Capability, competence, operational rigor — _this is how it runs._
- **Visual language:** Engineering blueprint. Orthogonal geometry: straight lines, right angles, numbered systems, a hairline column grid drawn across the whole page. Maroon as the working color; gold reserved for numbers and marks. Typography does the work — sentence-case, spec-precise.
- **Layout philosophy:** A structured operating report. A sticky section index on a left rail (01 Verticals · 02 Capabilities & Services · 03 Corporate Structure · 04 Capital Deployment · 05 Execution) with a strip progress indicator and flyout labels; content as numbered plates in a true 12-col grid. Processes are **linear chains running left→right** — the orthogonal opposite of About's circle.
- **Preferred components:** Section headers with gold serif numerals · ruled service/capability matrices (service → outcome → proof) · linear process chains · OperatingDivisions vertical cards as the three operating verticals · the partnership band (NDR InvIT) · corporate-structure diagram (client template, deck line-art) · dark band for the capital model · the execution framework ledger with evidence plates.
- **Interaction style:** Sticky section index with active state; strip progress line; table-row hover emphasis; process chain draws left→right; no circular, no playful motion. Fully keyboard-accessible.
- **Density:** Medium-high — the most tabular of the editorial pages.
- **Whitespace rhythm:** Ruled columns rather than open fields; whitespace lives inside cells.
- **Imagery style:** Real-asset photography in architectural crops, hi-vis human scale at distance, hairline-framed; verticals lead with imagery only where approved.
- **Data presentation style:** Capability matrices, service tables, numbered systems, the process chain, the entity map, the execution ledger.
- **Screenshot cue:** A sticky numbered index + ruled multi-column plates; the row of three deep-maroon vertical cards above the dark partnership band; orthogonal line art.

### 2.3 Portfolio — **The Atlas / register of places**

- **Emotional objective:** Scale, credibility, presence — _here is what exists on the ground._
- **Visual language:** Cartography + register. Map-first, list-second (Design Direction §3.15). Hairline geography, gold locator nodes, zone frames, and a ruled, sortable asset register. Ivory-heavy; the map is the hero field.
- **Layout philosophy:** Full-width map field as the hero, then zone-by-zone sections, then the analyst register. Two-panel compositions (map 7 / facts 5) carried through, then a full-width table. Entity honesty: group SPVs vs NDR InvIT assets are separated and the InvIT links out to ndrinvit.com.
- **Preferred components:** IndiaMap with locator dots · PortfolioPresence zone facts · FeaturedProjects primary/compact (photo-led) · asset register table (tabular numerals, sortable/filterable) · status badges (Completed / Ongoing) · Metric + SourceFootnote.
- **Interaction style:** Map ↔ register linked highlight (hovering a row highlights its pin — the same language as the LifecycleDiagram), zone/class/status filters, image scale ≤1.03. No pulse under reduced motion.
- **Density:** High in the register, low around the map.
- **Whitespace rhythm:** The map breathes; the register is ruled and tight.
- **Imagery style:** The site's photography page — warm-graded real assets, hairline-framed, consistent grade. **Imagery and portfolio data are pending client items; the register renders its structure, rows conditional on data.**
- **Data presentation style:** Sortable asset table (location · size · status · class), zone fact rows, project fact grids, status legend.
- **Screenshot cue:** The India map with gold nodes beside a ruled asset register; status badges in small caps.

### 2.4 Investor Centre — **The Financial Statement**

- **Emotional objective:** Confidence, transparency, precision — _we report to you as fiduciaries._
- **Visual language:** The financial document. A document masthead hero (issue-style, not marketing), ruled statement tables, footnotes, safe-harbour and disclaimer lines, obvious archive patterns. **Highest density on the site** — financial density is the identity. Tabular Inter numerals; Fraunces reserved for headline metrics.
- **Layout philosophy:** Document-centric. Slim masthead (eyebrow · title · "as on" line) → sticky contents rail → numbered document sections (Financial Results · Reports & Disclosures · Governance · Downloads) → wide ruled tables → footnoted paragraphs. One source per figure. Marketing motion is absent by design.
- **Preferred components:** Ruled data tables · Metric + SourceFootnote · Counter · LifecycleDiagram (capital cycle) · JourneyTimeline / AboutTimeline (InvIT milestones) · document & download cards · governance lists (hairline rows) · disclaimer block · TextLink.
- **Interaction style:** Document-appropriate: table-row hover, download actions, year/type filter tabs, archive links; reveals only at document-section level — no staggered card bursts.
- **Density:** Highest on the site.
- **Whitespace rhythm:** The margins of a printed statement — structured, not open.
- **Imagery style:** None; occasional hairline-framed custom-SVG charts (no 3D, no gradients — Design Direction §3.13).
- **Data presentation style:** Statements with "as on" dates, sourced metrics, a report library, a governance index, a safe-harbour footnote block.
- **Screenshot cue:** Masthead + contents rail above a full-width ruled statement table with footnotes; "as on" datestamps.

### 2.5 ESG — **The Sustainability Statement / Index**

- **Emotional objective:** Stewardship, accountability, measured responsibility.
- **Visual language:** Editorial report / measured index. Chapter-numbered document register; large serif chapter numerals; pull-quote plate (the homepage's ESG statement as the chapter opener); goal→progress pairs; the "index" framing — everything measured, published, verifiable. Charcoal + ivory editorial register; gold as measurement marks only.
- **Layout philosophy:** Magazine/report format. A chapter opener plate on charcoal, then numbered chapters (01 Commitment · 02 Metrics · 03 Governance · 04 Policy) as asymmetric 7/5 statements with a full-width sourced metric band and hairline policy rows.
- **Preferred components:** Esg plate (statement + proof chips) as opener · Metric + SourceFootnote · commitment/policy rows · goal↔progress pairs with periods · governance lists · proof chips (EDGE, GHG, net-zero) · ClosingCta.
- **Interaction style:** Report-slow. Reveal at chapter level only; metric entry-rules draw (the KeyNumbers language); minimal hover.
- **Density:** Editorial medium, airy — more open than Investor, less than About.
- **Whitespace rhythm:** Magazine margins; chapter breaks breathe.
- **Imagery style:** Real-asset photography in hairline-framed plates where approved; otherwise fully typographic.
- **Data presentation style:** Commitment index, goal/progress pairs with periods, sourced metrics, policy list.
- **Screenshot cue:** Large serif chapter numerals + a pull-quote plate on charcoal + a row of proof chips.

### 2.6 Media — **The Chronicle / wire**

- **Emotional objective:** Currency, authority, being the source.
- **Visual language:** Newsroom / wire. Dateline-first typography — a visible date and small-caps category on every row; newest-first index; high rule density on ivory. A newspaper of record.
- **Layout philosophy:** Inverted list. A lean masthead (title + one lede line), then a dated index of ruled rows (date · category · headline · Read more); feature spreads as cards; a resource library; a press-contact ledger. Category filter tabs sit above the index.
- **Preferred components:** LatestUpdates news cards scaled to a full index · dated ruled rows · category small-caps labels · TextLink read-more · filter tabs · press-contact ledger · ClosingCta.
- **Interaction style:** Category filter — the page's one real interaction and its motion signature; row hover emphasis; read-more arrow slides.
- **Density:** High in the index, low on article spreads.
- **Whitespace rhythm:** Tight index rows; feature spreads breathe.
- **Imagery style:** Editorial 16:10 thumbnails where available (warm grade); otherwise a pure typographic index. **Items are pending client content; rows render conditionally.**
- **Data presentation style:** Dated index, category tags, featured/archive split, press contacts.
- **Screenshot cue:** Date-led ruled rows with small-caps categories under filter tabs.

### 2.7 Contact — **The Letterhead**

- **Emotional objective:** Access, directness, a human response.
- **Visual language:** Correspondence / stationery. A formal letter: letterhead header (entity + address block), ruled contact blocks, the enquiry form as a typed record, a formal closing line. Ivory dominant, low density, generous margins. Nothing marketed.
- **Layout philosophy:** Asymmetric two-column letter. Left: the letterhead — office address, hours, mailboxes, map link. Right: the 5-field enquiry form as a clean record. A closing line beneath the form (_"We typically respond within 2 business days."_). No marketing band above the fold.
- **Preferred components:** ContactCta pattern rebuilt as a letter · EnquiryForm (5 fields, all existing states) · address definition rows · TextLink / ExternalLink · small-print lines · Footer.
- **Interaction style:** Minimal: form focus states, inline validation, submit → success panel (existing). No page-level reveal bursts.
- **Density:** Low-medium, formal.
- **Whitespace rhythm:** The margins of a letter; nothing crowded.
- **Imagery style:** None, or a single hairline-framed office plate where approved. A map link, not a map.
- **Data presentation style:** Address blocks, office/hours ledger, mailbox routing list, form fields.
- **Screenshot cue:** A letterhead with an address block and a ruled form panel on ivory; a formal closing line.

---

## 3. The screenshot test (distinctness matrix)

| Page            | Background rhythm                                | Hero                              | Leading evidence device           | Signature interaction               | Screenshot cue                                       |
| --------------- | ------------------------------------------------ | --------------------------------- | --------------------------------- | ----------------------------------- | ---------------------------------------------------- |
| Homepage        | ivory → dim → dark → ivory marketing alternation | Full-bleed Monument + stat band   | Hero stats                        | Count-up                            | Cinematic scene + horizontal stat band               |
| About Us        | ivory / dark-maroon punctuations                 | Typographic ledger (Concept A)    | Ledger plates + lifecycle circle  | Draw-in geometry + linked highlight | Gold top rule + hairline ledger; gold-diamond circle |
| Business        | ruled ivory, one dark band                       | Technical plate                   | Service matrices + process chains | Sticky index + row emphasis         | Numbered index + 3 deep-maroon vertical cards        |
| Portfolio       | ivory map field + register                       | India map field                   | Sortable asset register           | Map↔register linked highlight       | Gold map nodes beside a ruled register               |
| Investor Centre | ruled ivory + charcoal plate                     | Document masthead + contents rail | Statement tables + footnotes      | Table row / filter tabs             | Masthead + ruled statement table, "as on" dates      |
| ESG             | charcoal plate + airy ivory                      | Chapter opener plate              | Goal↔progress index               | Metric rules draw                   | Serif chapter numerals + pull-quote plate            |
| Media           | ruled ivory newsroom                             | Dateline masthead                 | Dated index rows                  | Category filter                     | Date-led rows with small-caps categories             |
| Contact         | single ivory surface                             | Letterhead                        | Address + form record             | Form states only                    | Address block + ruled form panel                     |

**Homepage-exclusive licenses** (other pages must not adopt): the full-bleed cinematic hero · the audience routing strip · the client logo grid · the homepage section sequence. About Us keeps Concept A per the Visual Specification decision.

---

## 4. Shared component license

Shared components are encouraged; _where_ each leads is fixed so no page repeats another's emphasis.

| Component                                  | Primary owner             | Also licensed to                                  | Notes                                                                                                                   |
| ------------------------------------------ | ------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| LifecycleDiagram                           | About Us (business model) | Investor Centre (capital cycle), Business (model) | Renders on a dark band                                                                                                  |
| IndiaMap + zone facts                      | Portfolio                 | Homepage (existing)                               | Pins linked to register rows on Portfolio                                                                               |
| JourneyTimeline / AboutTimeline            | About Us                  | Investor Centre (milestones)                      | Captions always visible                                                                                                 |
| Metric / Counter / ledger / SourceFootnote | All                       | All                                               | One stat, one source, everywhere                                                                                        |
| Ruled data table (tabular)                 | Investor Centre           | Portfolio (register)                              | New build — investor-owned                                                                                              |
| Esg plate + proof chips                    | ESG                       | Homepage (existing band)                          | Statement + chips, not bullet lists                                                                                     |
| News cards / dated rows                    | Media                     | Homepage LatestUpdates                            | Conditional render                                                                                                      |
| EnquiryForm                                | Contact                   | Homepage ContactCta                               | 5 fields, existing states                                                                                               |
| BusinessHighlights vertical cards          | Business                  | Homepage (existing)                               | Numbered eyebrows                                                                                                       |
| FeaturedProjects primary/compact           | Portfolio                 | Homepage (existing)                               | Photo-led; conditional on data                                                                                          |
| Leadership slots                           | About Us                  | Investor Centre (governance)                      | Board-register slots; photo-gated; portraits auto-render from `profiles[].photo`, otherwise numbered Record empty state |
| Partnership band                           | Business                  | Homepage (existing)                               | NDR InvIT relationship                                                                                                  |

---

## 5. Cross-page consistency rules

1. **One visual signature per page** — one hero stance and one leading evidence device. A page that uses two proof systems reads as clutter, not as two pages.
2. **One interaction signature per page** — the table in §3 is the fixed assignment. Motion vocabulary may be shared; the _signature_ may not.
3. **Token discipline is absolute** — §1's levers vary; the tokens never do. No new colors, typefaces, radii, curves, or surfaces.
4. **Gold ≤ ~6% per screen; one primary CTA per viewport** — Design Direction §3.8, unchanged.
5. **Every figure carries a source and a period** — "one stat, one source." Data-presentation styles differ; sourcing discipline does not.
6. **Entity separation is visual** — NDR Smart Spaces, NDR Asset Management, Ave Acres, NDR InvIT Trust are named precisely on Business, Portfolio, and Investor Centre (§3.14).
7. **Conditional render for pending content** — Portfolio register, Media rows, ESG chapters ship their structure; rows and plates appear when content lands. No empty shells (§1 of Design Direction).
8. **Reduced motion is a first-class state** — every signature interaction has an instant equivalent (existing global reset).
9. **Accessibility baseline is global** — skip-link, landmarks, 48 px targets, gold focus rings, WCAG 2.1 AA, semantic landmarks (Visual Specification §0.7).
10. **The homepage is the front cover, not the template** — §1 levers exist precisely so a page never inherits the homepage's composition by default.

---

## 6. Implementation order

About Us is approved and conforms (Concept A Ledger). Business is built and frozen. Recommended build order for the remaining pages, in dependency order of the existing CTAs:

1. ~~**Business** — target of the About Us and homepage "Explore the business" CTAs. Builds the operating-manual primitives (sticky index, service tables, process chain, corporate-structure diagram).~~ **Built · frozen** (Production Pass V1 + visual QA).
2. **Portfolio** — target of the homepage map's "View Portfolio →." Builds the register + linked-map interaction; structure ships, rows conditional on data.
3. **Investor Centre** — target of the persistent header CTA. Builds the statement tables, report library, and safe-harbour block; reuses LifecycleDiagram and AboutTimeline.
4. **ESG** — reuses the Esg plate and KeyNumbers language; new chapter-numeral framing only.
5. **Media** — builds the dated index and filter; rows conditional on content.
6. **Contact** — reuses EnquiryForm; the letterhead is mostly a new composition of existing blocks.

Each page is verified by the same gates: typecheck · lint · prettier · production build · CSS-module audit · token audit.

---

## 7. Freeze protocol

A page is **frozen** when it passes the release gates and the freeze checklist below. Frozen pages are production-verified and may not be redesigned; fixes only for real defects, gated and re-verified.

**Freeze checklist — applies to Homepage, About Us, Business (all passed):**

1. Typecheck · lint · prettier — clean.
2. Production build (`output: "export"`) — clean, all routes pre-rendered.
3. Zero console errors and zero horizontal overflow across 1920 · 1440 · 1280 · 1024 · 768 · 390 (Playwright quantitative audit).
4. Header/footer and page CTAs resolve only to live anchors or external surfaces — no unbuilt route linked.
5. Identity exclusives respected: the page's reserved layout, interaction, and evidence devices are not borrowed by another page.
6. No TODO / FIXME / console.log / debugger / `@ts-ignore` / `@ts-expect-error` in frozen code.
7. Reduced motion + keyboard reachability verified on signature interactions.
8. Metadata and document titles correct per page.

**After freeze:** no new content, layout, or interaction work without a written change request (defect or client-approval). The design system (Design Direction v2) and the Visual Specification remain the authorities for tokens, components, and accessibility. Client documents override wherever they conflict.

_This guide is the working authority for page composition._
