# NDR Smart Spaces CMS Blueprint V1

**The Admin Architecture**
Architect · derives exclusively from: the shipped Frontend V1 baseline (`app/[locale]/*`, `src/components/**`, `src/lib/data/*`), Global Publication System V2 §9 · CMS inventory · Page Identity Guide · Design Direction v2 · Homepage Visual Specification · Business Page Architecture V1 · Portfolio Page Architecture V1 · Investor Centre Architecture V1 · client IA response

Version 1.1 · Status: **approved — final architecture freeze** · Scope: the complete admin architecture for the public website · Build order: architecture only — no admin panel is built in this phase

This revision is the frozen architecture for Phase 1 implementation. It incorporates the client-approved decisions: collection-driven CMS (§0), three settings modules (§1.1–1.3), the central Reference Registry (§1.4), a single master Locations collection with homepage display offsets (§6.1, §11.1), the mandatory Metrics-ledger rule (§11.3), unified Documents/Media registers with the `archived` status (§11.4–11.5), derived content feeds (§3.10), shared-content relationships (§3.9, §7.2), legal hash-lock (§13.6), the five-role workflow with `archived` state (§15), and the four-phase build order (§17). Final amendment: **system-wide audit history** (§15.1) — append-only, tamper-evident, covering every editable collection. No further architectural changes will be made during implementation.

---

## 0. Register and purpose

This document is the complete CMS audit of the NDR Smart Spaces public website and the blueprint for the admin panel that will manage it. It answers one question:

> **What must the client be able to edit — and how must that editing be structured, validated, and connected to the frontend — so the website can be managed without a developer?**

Every element of every public page is inventoried and classified into one of five categories (Content / Media / Data / Settings / System). From that inventory the blueprint defines: the master collections (the data model), the relationships between them, the validation layer, the shared map and chart architectures, the admin modules, the role permissions, the headless data architecture, and the implementation priority.

**Approved architecture principles (frozen):**

1. **Collection-driven, not page-driven.** The admin is built around reusable collections (§11); pages are compositions of those collections through relationships. No content is entered twice.
2. **Relationship-based.** Repeating content is authored once and referenced — the Metrics ledger, the Locations collection, the Documents register, the ESG framework, and the derived feeds (§3.10).
3. **Contract-safe.** The CMS writes to the existing frontend data contracts exactly — byte-stable `src/lib/data/*.ts` with no component rewrites (§16). The frontend architecture remains intact.
4. **A–E governance.** The Content / Media / Data / Settings / System classification (§0.3) governs every editable field.

The deliverable is complete enough that the admin panel can be built from this document alone, **without re-auditing the frontend**. Where a field exists today only in code (a hardcoded string, a metadata export, a projection constant), it is listed here with its exact source location so the build can surface it without a second pass.

### 0.1 How content flows today (baseline)

- The site is a **Next.js 16 static export** (`output: "export"`, 24 pre-rendered routes, `app/[locale]` with a single locale `en`).
- **All content lives in typed, `as const` data modules** under `src/lib/data/*.ts`, consumed by server/client components in `src/components/**`.
- Pages are assembled from **fixed sections** in `app/[locale]/*/page.tsx`. There is no block builder and no freeform layout.
- Four **validation modules** already run in development only (`runNavigationValidation`, `runContactValidation`, `runEsgValidation`, `runMediaValidation`) and fail loud on bad data. They are the seed of the CMS validation layer.
- SEO lives in per-page `metadata` exports (hardcoded). Routing lives in `src/lib/routes.ts` (hardcoded). Design tokens live in `src/styles/tokens/*.css` (system).
- The media library is effectively empty: two logo SVGs exist; hero photography, leadership portraits, asset plates, and all download documents are placeholders with `pending` status.

### 0.2 Current data modules (the single source of truth to be lifted into the CMS)

| Module                       | Contents                                                                                                                                                                                                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/data/homepage.ts`   | hero, audienceRoutes, zones, portfolioPresence, mapLocations, companyOverview, journey, businessHighlights, investmentHighlights, featuredProjects, marqueeClients, esg (placeholder), latestUpdates (placeholder), contact (teaser + form), footer |
| `src/lib/data/about.ts`      | aboutHero, aboutStory, aboutTimeline, aboutPrinciples, businessModel, leadership, whyNdr, aboutNumbers, aboutClosing                                                                                                                                |
| `src/lib/data/business.ts`   | businessChapters, businessMasthead, divisions, capabilityMatrix, corporateStructure, capitalDeployment, execution, businessClosing                                                                                                                  |
| `src/lib/data/portfolio.ts`  | MAP_VIEWBOX, PROJECTION, INDIA_OUTLINE, projectPlace, geoLocations, geoZones, ZONE_CHAPTERS, portfolioAssets, labels/helpers, portfolioMasthead, atlasField, locatorIndex, zoneSection, filingBand, plateCopy, portfolioRegister, portfolioClosing  |
| `src/lib/data/investor.ts`   | investorMasthead, investorEdition, editorialStatement, investorContents, investorMetrics (M1–M16), capitalCycle, capitalMarketTimeline, invitRelationship, safeHarbour, resilience, five FilingLibraryConfigs, governance, investorClosing          |
| `src/lib/data/esg.ts`        | ESG_EDITION, esgMasthead, esgStatement, esgFramework, esgEnvironment, esgSocial, esgGovernance, esgDashboard (trends/goals/composition), esgImpactMap + IMPACT_CATEGORIES, esgCertifications, esgDisclosures, esgClosing                            |
| `src/lib/data/media.ts`      | MEDIA_EDITION, MEDIA_PUBLICATION, mediaMasthead, mediaStatement, mediaFeatured, PRESS_CATEGORIES, pressArchive, mediaKit, pressContact, mediaClosing                                                                                                |
| `src/lib/data/contact.ts`    | contactMasthead, officeDirectory, inquiryRouting, correspondenceForm, contactMap, contactClosing                                                                                                                                                    |
| `src/lib/data/legal.ts`      | privacyPolicy, termsOfUse, disclaimer, sitemapGroups                                                                                                                                                                                                |
| `src/lib/data/navigation.ts` | utilityStrip, headerCta, navItems, mobileNavItems, mobileMenuFooter, siteHome                                                                                                                                                                       |
| `src/lib/routes.ts`          | siteRoutes, routeAnchors                                                                                                                                                                                                                            |

### 0.3 The five categories (applied consistently through this audit)

| Category         | Meaning                               | Editable                                                                                                                                                                                              |
| ---------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A — Content**  | text the client can reword            | headings, subheadings, paragraphs, quotes, labels, buttons, CTA text, section introductions, publication statements                                                                                   |
| **B — Media**    | assets the client can swap            | images, galleries, logos, videos, downloadable assets, brochures, PDFs, certifications, press documents                                                                                               |
| **C — Data**     | records/figures the client can change | metrics, numbers, percentages, investor figures, ESG data, timelines, office locations, portfolio assets, project records, media entries, announcements, disclosures, governance records              |
| **D — Settings** | configuration                         | navigation labels, menu ordering, footer links, social links, contact information, office hours, inquiry routing, SEO fields, publication metadata, map visibility, chart visibility, document status |
| **E — System**   | never editable                        | layouts, spacing, typography, colors, animations, section architecture, component structure, validation logic, chart rendering, map rendering, responsive behavior                                    |

**The gate:** _If the client might reasonably ask to change it, it is editable (A–D). If changing it would affect the design system, layout system, or application architecture, it is system-controlled (E)._

---

## 1. Settings architecture

Three settings modules replace a single global record so the client edits the right thing in the right place, and a central **Reference Registry** owns every publication reference. No value in this section is repeated anywhere else in the CMS.

### 1.1 Corporate Settings (Category D — Super Admin)

| Field                      | Today                                                                 | Source                                                                  |
| -------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `legalEntity`              | NDR Smart Spaces Pvt. Ltd.                                            | navigation.ts `utilityStrip.entity`, legal.ts                           |
| `registryLine`             | NDR Smart Spaces Pvt. Ltd. — an NDR Group platform                    | investor/esg/media/contact mastheads                                    |
| `cin`                      | U45201TN2005PTC059267                                                 | navigation.ts `mobileMenuFooter.notes` — _awaiting client confirmation_ |
| `addresses`                | registered + corporate addresses (Chennai HQ)                         | contact.ts `officeDirectory`, homepage.ts `footer`                      |
| `phoneNumbers[]`           | office phones                                                         | contact.ts `officeDirectory`                                            |
| `emails`                   | compliance@ndrsmart.com, project@ndrsmart.com, investors@ndrsmart.com | many — `investors@` currently only in `mobileMenuFooter.emails`         |
| `pressResponseExpectation` | Within 2 business days                                                | media.ts / contact.ts                                                   |
| `externalLinks`            | `invitUrl`, `aveAcresUrl`, `googleMapsDirectionsUrl`                  | business.ts / homepage.ts / contact.ts                                  |

### 1.2 Publication Settings (Category D — Super Admin)

| Field              | Today                                              | Source                                                   |
| ------------------ | -------------------------------------------------- | -------------------------------------------------------- |
| `editionPeriod`    | FY26                                               | all mastheads + `portfolioRegister.summary.editionValue` |
| `asOnDate`         | As on 31 March 2026                                | investorEdition / ESG_EDITION / MEDIA_EDITION / contact  |
| `documentPrefixes` | governing prefixes for filings, disclosures, media | investor filings, esg disclosures, media records         |
| `numberingRules`   | plate `NN`, ref-code formats, register numbers     | portfolio plates, filing refs, governance policies       |
| `copyrightLine`    | © 2026 NDR Smart Spaces Pvt. Ltd.                  | homepage.ts `footer.copyright`                           |

> **Decision:** Publication identity strings (watermark glyph, folio, control caption, section label, edition, asOn) are **Category D** — editable, format-constrained (see §7). Their **structure** (before · accent · after title parts, the 2-letter watermark) is **Category E**. The reference formats themselves are defined here and generated by §1.4.

### 1.3 Brand Settings (Category B/D — Super Admin)

| Field         | Today                              | Source                                                       |
| ------------- | ---------------------------------- | ------------------------------------------------------------ |
| `brandName`   | NDR Smart Spaces                   | navigation.ts `siteHome`/wordmark, legal docs                |
| `logos`       | `brandLogoLight` / `brandLogoDark` | footer + header lockups (`/logos/*.svg`) — Category B assets |
| `favicon`     | system default                     | app metadata                                                 |
| `seoDefaults` | per-page SEO defaults              | page.tsx `metadata` exports                                  |
| `ogImages`    | per-page OG images                 | page.tsx `metadata` exports                                  |
| `socialLinks` | not currently published            | reserved                                                     |

### 1.4 Reference Registry (Category D — Super Admin)

The registry is the **single generator of every publication reference** on the site. No page manually maintains a publication reference.

| Identifier         | Purpose                                                            |
| ------------------ | ------------------------------------------------------------------ |
| `REF`              | filing / disclosure / press / publication reference codes          |
| `PLATE`            | portfolio plate numbers — sequential `NN` per zone                 |
| `FIG`              | figure identifiers for metrics and dashboard series                |
| `DOC`              | document serials in the Documents register                         |
| `FY`               | fiscal-year labels (edition / period strings)                      |
| `Volume`           | publication volume / edition identifiers                           |
| `Register numbers` | governance committee/policy register numbers, office and desk keys |

**Rules:** prefixes, formats, and sequences are defined in §1.2 (`documentPrefixes`, `numberingRules`) and issued here. The CMS assigns the next value on create; issued values are **stable** — never renumbered while referenced. Validation rejects manually invented references that collide with the registry (§13.1).

---

## 2. Navigation & Footer

### 2.1 Collection `Navigation` (Category D — Settings)

Source today: `src/lib/data/navigation.ts` (header) and `homepage.ts` `footer` (footer). The frontend renders a **fixed nav architecture** (utility strip, logo, primary nav with two mega-menus, header CTA, mobile panel; footer with 4 link groups + ecosystem + legal + contact band). Menu _structure_ (mega-menu columns, alignment, overview blocks) is **Category E**; the _labels, destinations, ordering, and visibility_ of entries are editable.

| Element             | Fields                                                                                                                | Category | Validation                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------- |
| Utility strip       | `entity` text, InvIT link (label + href), email (label + href)                                                        | D        | href resolves (see §7)                                    |
| Header CTA          | `enquiry.label`, `enquiry.href`                                                                                       | A/D      | route + anchor resolve                                    |
| Primary nav items   | per item: `label`, `href`, `external?`, `type` (link/menu), `align`, `order`, `visible`                               | D        | no duplicate hrefs per surface; one label per destination |
| Mega-menu overview  | `label`, `tagline`, `href`                                                                                            | A/D      | route resolves                                            |
| Mega-menu columns   | `heading`, per link `label` + `href`                                                                                  | D        | no duplicates; anchors valid                              |
| Mobile nav          | same items + `Home` link; `mobileMenuFooter` heading, emails, notes                                                   | D        | same rules                                                |
| Footer descriptor   | `footer.descriptor`                                                                                                   | A        | non-empty                                                 |
| Footer ecosystem    | `footer.ecosystem[]` label + href + external                                                                          | D        | external links http(s)                                    |
| Footer link groups  | `footer.groups[]` heading + links                                                                                     | D        | route resolves; no dup per group                          |
| Footer contact band | `address`, `emails[]`                                                                                                 | D        | mailto valid                                              |
| Footer legal        | `footer.legal[]` label + href                                                                                         | D        | routes resolve                                            |
| Footer copyright    | `footer.copyright`                                                                                                    | A/D      | non-empty                                                 |
| Footer CTA strings  | `Work with us` / `Start a conversation` / `Corporate office` / `Write to us` / `Contact us` (hardcoded in Footer.tsx) | A        | —                                                         |
| Sitemap page        | `sitemapGroups` (heading + links)                                                                                     | D        | routes resolve; every route reachable                     |

**Relationship:** Navigation destinations must be validated against `Routes` (the fixed route registry) and page anchors (`routeAnchors`). It is the only collection allowed to read the full route list.

---

## 3. Homepage — Institutional Introduction

Source: `src/lib/data/homepage.ts`. Sections (fixed order, `app/[locale]/page.tsx`): Hero → AudienceStrip → PortfolioPresence → CompanyOverview → BusinessHighlights → InvestmentHighlights → FeaturedProjects → MarqueeClients → Esg (conditional) → LatestUpdates (conditional) → ContactCta → Footer.

### 3.1 Hero (A + B + C + D)

| Element          | Fields                                                  | Category | Validation                                                            |
| ---------------- | ------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| Eyebrow          | `eyebrow`                                               | A        | non-empty                                                             |
| Headline         | `headline`                                              | A        | non-empty, ≤ ~60 chars                                                |
| Subhead          | `subhead`                                               | A        | non-empty                                                             |
| Primary CTA      | `primaryCta.label`, `primaryCta.href`                   | A/D      | route/anchor resolves                                                 |
| Secondary CTA    | `secondaryCta.label`, `secondaryCta.href`               | A/D      | route resolves                                                        |
| Background image | `image` (src + alt), null → architectural field renders | B        | alt required if present; size/format rules                            |
| Stats            | `stats[]`: `value` (number), `suffix`, `label`          | C        | **must reference the Metrics ledger** (§11.3); ≤3 items; value finite |
| Stats source     | `statsSource`                                           | A        | non-empty                                                             |

### 3.2 AudienceStrip (A + D)

| Element         | Fields                                            | Category | Validation                                      |
| --------------- | ------------------------------------------------- | -------- | ----------------------------------------------- |
| Audience routes | `audienceRoutes[]`: `label`, `descriptor`, `href` | A/D      | route resolves; label unique; count fixed 4 (E) |

### 3.3 PortfolioPresence (A + C + D)

| Element                | Fields                                           | Category | Validation                                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Section intro          | `eyebrow`, `heading`, `lede`                     | A        | non-empty                                                                                                                                                                                                                   |
| View-portfolio link    | `viewPortfolio` label                            | A        | —                                                                                                                                                                                                                           |
| Zones                  | `zones[]`: `id`, `name`, `fact`                  | C/D      | **shared Zones collection** (§11.1) — fact editable, id/name system-linked                                                                                                                                                  |
| Map locations          | `mapLocations[]`: `name`, `zone`, `tier`, `line` | C/D      | **shared Locations collection** (§11.1) — no separate homepage map system. The current hand-authored pixels migrate to lat/lon; **homepage display offsets** (`homepageOffset`) remain editable for visual composition only |
| Map hover/tooltip text | zone facts, location `line`                      | A/C      | derived from shared collections                                                                                                                                                                                             |

### 3.4 CompanyOverview (A + D)

`eyebrow`, `heading`, `lede`, `body`, `link.label`, `link.href` (anchor `#journey`). All A; href D.

### 3.5 BusinessHighlights (A + C + D)

| Element           | Fields                                                                | Category | Validation                                                              |
| ----------------- | --------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------- |
| Intro             | `eyebrow`, `heading`                                                  | A        |                                                                         |
| Verticals         | `verticals[]`: `index`, `title`, `body`, `proof`, `href`, `external?` | A/C      | index is sequence (E); href route resolves; external flag for Ave Acres |
| Partnership block | `partnership.title`, `partnership.line`, `partnership.cta.label/href` | A/D      | anchor `#capital` resolves                                              |

### 3.6 InvestmentHighlights (A + C + D)

| Element         | Fields                     | Category | Validation                                                                                                      |
| --------------- | -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| Intro           | `eyebrow`, `heading`       | A        |                                                                                                                 |
| Cycle note      | `cycleNote`                | A        |                                                                                                                 |
| Proof items     | `proof[]`: `name`, `value` | C        | **must reference the Metrics ledger** where the figure appears elsewhere (INR 143.9 cr, 99% greenfield) — §11.3 |
| Resilience list | `resilience[]`             | A        |                                                                                                                 |
| Link            | `link.label`, `link.href`  | A/D      | route resolves                                                                                                  |

### 3.7 FeaturedProjects (A + B + C)

| Element           | Fields                                                                                                                                               | Category | Validation                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------ |
| Intro             | `eyebrow`, `heading`                                                                                                                                 | A        |                                            |
| Primary project   | `primary.eyebrow`, `primary.title`, `primary.narrative`, `facts[]` (value, unit, label, format), `primary.link.label/href`, optional `primary.image` | A/B/C    | fact values finite; unit present; ≤4 facts |
| Secondary project | `secondary.eyebrow`, `secondary.title`, `secondary.narrative`, `secondary.link.label/href`, optional image                                           | A/B/C    |                                            |
| Photography       | optional `image` per project                                                                                                                         | B        | alt required                               |

### 3.8 MarqueeClients (A + C)

`claim`, `subline`, `clients[]` (16 names). **Decision:** client names are a Category C record (a "Clients" collection) so the marquee can be maintained without touching copy; claim/subline are A.

### 3.9 EsgTeaser (A + D) — currently `null`

`esg` block is **conditional** (renders only when content exists). Fields per the existing `EsgContent` type: `eyebrow`, `heading`, `lede`, `pillars[]` (index, title, body), `link.label/href`. Categories A/D. When the homepage ESG teaser is enabled in the CMS, the **pillars must be pulled from the ESG framework collection** (§8.2) via relationship — they are never re-entered. This relationship principle applies wherever content is repeated across pages (§0).

### 3.10 LatestUpdates (C + D) — currently empty

`latestUpdates[]`: `date`, `category`, `title`, `href`. **Approved: this is a derived feed, not an independent collection.** It draws from the **Announcements** (investor) and **Press Archive** (media) collections filtered by date — publish once, render everywhere, no duplicate entry. The current placeholder collection is replaced by a feed rule (Category D: which categories feed it, max items, order).

### 3.11 ContactCta + homepage contact teaser (A + D)

`contact.eyebrow`, `contact.heading`, `contact.info[]` (label, value, href?, external?), `contact.form` (see §10.2 form config). The teaser **info items and form configuration are shared with the Contact page** — one source, via the **Contact Directory** collection (§11.12).

### 3.12 Footer — see §2.

---

## 4. About — Corporate Record

Source: `src/lib/data/about.ts`. Sections: AboutHero → OurStory → AboutTimeline → VisionMissionValues → BusinessModel → Leadership → WhyNdr → KeyNumbers → ClosingCta.

### 4.1 AboutHero (A + C + D)

`eyebrow`, `headline` (before-accent — headline + `headlineAccent`), `lede`, `cta.label/href`, `ctaSecondary.label/href` (A/D). Stats `aboutHero.stats[]` (label, metric OR count{value,prefix,suffix,format}, source) — Category C, **must reference the Metrics ledger** (§11.3). The `Founded 1954` row is a metric with `metric` string; `100+` and `98%` are counted metrics.

### 4.2 OurStory (A)

`eyebrow`, `heading`, `paragraphs[]` (3), `quote`, `quoteAttribution`. All A. Structure fixed (E).

### 4.3 AboutTimeline (A + C)

`eyebrow`, `heading`, `lede`, `nodes[]` (year, title, caption, detail). **Shared `Timelines` collection** (§5.3) keyed to this page. Category C for nodes, A for intros.

### 4.4 VisionMissionValues (A)

`aboutPrinciples`: `eyebrow`, `heading`, `lede`, `columns[]`. The Vision and Mission are `index/title/body`; Values is `index/title/values[]` (name + line). All A. The 3-column structure is E.

### 4.5 BusinessModel (A + C)

`businessModel`: intro (A) + `steps[]` (index, name, caption) — **shared `Sequences` collection** (§5.3) — plus `returnLabel`, `returnCaption`. The 8-node lifecycle is the page's system diagram; node copy editable (C/A), chain structure E.

### 4.6 Leadership (A + B + C)

`leadership`: `eyebrow`, `heading`, `lede` (A); `placeholderTitle`, `placeholderStatus`, `placeholderNote`, `placeholderSlots` (D); `profiles[]` (name, role, bio, photo) (B + C). **Shared `TeamMembers` collection** (§5.5). Validation: name/role required when a profile exists; photo alt required.

### 4.7 WhyNdr (A + C)

`whyNdr`: `eyebrow`, `heading`, `lede`, `strengths[]` (index, title, body, proof). Title/body A; `proof` C (figures); structure E. Proof strings that state figures **must reference the Metrics ledger** where the figure appears on any other page (§11.3).

### 4.8 KeyNumbers (A + C)

`aboutNumbers`: `eyebrow`, `heading`, `lede`, `stats[]` (count, label, source). Category C, **must reference the Metrics ledger** — the 6,00,000 sq ft / 4 months figures appear in featured projects and whyNdr too; one metric, one source (§11.3).

### 4.9 ClosingCta (A + D)

`aboutClosing`: `eyebrow`, `heading`, `lede`, `primaryCta.label/href`, `secondaryCta.label/href`. A/D.

---

## 5. Business — Operating Manual

Source: `src/lib/data/business.ts`. Sections: BusinessStickyIndex → BusinessMasthead → OperatingDivisions → CapabilityMatrix → CorporateStructure → CapitalDeployment → ExecutionFramework → BusinessClosing. The page is a fixed 5-chapter manual; chapter **structure is E**, chapter copy is A/C.

### 5.1 Sticky index + masthead (A + D)

- `businessChapters[]` (index, label, id, title, plate, code): **Category D** — labels/plates/codes are publication metadata with fixed format; `id` (anchor) is system-stable.
- `businessMasthead`: `folio`, `controlCaption`, `asOn`, `edition`, `statement`, `headline` (before·accent·after). D (format-constrained) + A for statement.

### 5.2 OperatingDivisions (A + C + B)

`divisions[]`: `index` (E), `title`, `writeup` (A), `spec[]` (label/value) (A/C), `proof` (C — **must reference the Metrics ledger** where a figure appears elsewhere, §11.3), `proofSource` (A), `route.label/href/external` (A/D), `source` (D — provenance string), `anchor` (E). The verticals live in the shared **Business Verticals** collection (§11.10). Optional vertical photography (B) is **conditional** (Tier B in the architecture): the CMS media field exists but renders nothing until an image is uploaded.

### 5.3 CapabilityMatrix (A + C)

`capabilityMatrix`: `footprint` (label/line/note/source — A/D), `headers` (E — column structure), `rows[]` (phase, capability, scope, evidence) — phase is a fixed taxonomy (E), capability/scope A, evidence C. `source` (D).

### 5.4 CorporateStructure (A + D)

`corporateStructure`: `header` (name/role — A), `branches[]` (name, function, relationship, route?, routeNote?) — A/C, `source` (D). The entity-map **structure** (5 branches, orthogonal layout) is E; branch count is semi-fixed — the blueprint allows add/remove of branches **within the same node layout** (all branches are direct children of the parent entity).

### 5.5 CapitalDeployment (A + C + D)

`capitalDeployment`: `rofo` (A), `chain[]` (index, name, caption — shared Sequences §5.3), `evidence` (C), `evidenceSource` (D), `cta.label/href` (A/D), `source` (D).

### 5.6 ExecutionFramework (A + C)

`execution`: `evidenceLabel` (A), `chain[]` (shared Sequences), `evidence[]` (claim, source — C/A), `source` (D).

### 5.7 BusinessClosing (A + D)

`businessClosing`: `line`, `enquiry.label/href`, `portfolio.label`, `portfolio.note`. A/D.

---

## 6. Portfolio — Register of Places

Source: `src/lib/data/portfolio.ts`. Sections: PortfolioMasthead → AtlasField → ZoneSections (per filed zone) → FilingBand (conditional) → AssetRegister → PortfolioClosing.

### 6.1 Map architecture (the shared location system)

Portfolio owns the **canonical geographic data**: `PROJECTION` (lon 68.2–97.4, lat 37.1–8.07), `MAP_VIEWBOX` (930×1000), the frozen `INDIA_OUTLINE` path, and the `projectPlace(lat, lon) → x,y` helper. **All maps on the site reuse these** (ESG impact map and Contact map import them). This is the system backbone for §12.

- `PROJECTION`, `MAP_VIEWBOX`, `INDIA_OUTLINE`, `projectPlace` — **Category E** (system geometry; frozen file, never edited via CMS).
- `geoLocations[]` (id, name, zone, tier, lat, lon, x, y, line, labelSide?, leaderTo?) — **Category C/D** → shared **Locations** collection (§11.1). `id` is system-stable; `x`/`y` are **derived from lat/lon** and not hand-edited (system projection); `tier` is a fixed taxonomy (hq/hub/satellite); `leaderTo`, `labelSide` are presentation hints — editable but validated to stay inside the viewbox.
- `geoZones[]` (id, name, fact, frame, centroid) — **Category C/D** → shared **Zones** collection (§11.1). `frame`/`centroid` are system-managed presentation geometry (E); `name`/`fact` editable.

> **Approved — one master Locations collection, no separate homepage map system.** `homepage.mapLocations` (15 hand-placed x/y entries) duplicates `geoLocations` (16 lat/lon entries). The CMS unifies them into one **Locations** collection; the homepage map consumes the same records (lat/lon → projection). Coimbatore and Puducherry exist in portfolio but not on the homepage map — visibility per-map is a **Category D** flag (`visibleOn: homepage | atlas | esg | contact`), not a separate record. **Homepage display offsets** (`homepageOffset`) are permitted on the shared record for visual composition only; they never replace the authoritative lat/lon.

### 6.2 PortfolioMasthead (A + D)

`portfolioMasthead`: `eyebrow`, `title`, `lede`, `editionPeriod`. A/D. (The portfolio light cover treatment is a deliberate design decision — Category E.)

### 6.3 AtlasField (A + C + D)

`atlasField`: `mark`, `captionLabel`, `captionLead`, `captionDetail`, `source`, `zoneIndexLabel`, `surveyKeyLabel`, `surveyKey[]` (mark, label), `locationUnitLabel`, `notToScale`. A/D; survey key mark-taxonomy E.

### 6.4 ZoneSections + FilingBand + LocatorIndex + PlateCopy (A + C + D)

- `locatorIndex`: `label`, `cataloguedLabel`, `linkedLabel`, `note` — A/D.
- `zoneSection`: `zoneFactLabel`, `handoffPrefix`, `handoffSuffix` — A.
- `filingBand`: `label`, `chapterLabel`, `framing`, `filedLabel`, `pendingLabel`, `referenceLabel`, `plateRefLabel`, `registerChapterLabel`, `registerHandoffLabel`, `handoffPrefix/suffix` — A/D.
- `plateCopy`: `photographyPending`, `classLabel`, `sizeLabel`, `statusLabel`, `occupierLabel`, `completedLabel`, `yearLabel`, `sourceLabel` — A.

### 6.5 AssetRegister (C + B)

`portfolioAssets[]` — the **Assets** collection (§11.2):

| Field              | Category          | Validation                                                       |
| ------------------ | ----------------- | ---------------------------------------------------------------- |
| `id`               | E (system-stable) | unique                                                           |
| `plate`            | D                 | unique, format `NN`, sequential across zones                     |
| `name`, `city`     | A                 | required                                                         |
| `zone`             | C                 | must reference an existing Zone                                  |
| `locationId`       | C                 | optional reference to a Location; one asset per location         |
| `class`            | C                 | fixed taxonomy (warehousing/industrial/commercial/institutional) |
| `status`           | C                 | fixed taxonomy (completed/ongoing)                               |
| `sizeSqFt`         | C                 | positive integer; formatted in Indian digits                     |
| `occupier`         | C                 | optional                                                         |
| `completedYear`    | C                 | 4-digit year                                                     |
| `entity`           | C                 | fixed taxonomy (spv/invit)                                       |
| `image` (src/alt)  | B                 | alt required                                                     |
| `route.label/href` | A/D               | resolves                                                         |
| `source`           | D                 | provenance required                                              |

Register **labels and ordering options** (`portfolioRegister`, incl. `summary`, `columns`, `orderOptions`, empty states) are A/D. Column set is E.

---

## 7. Investor Centre — Financial Statement

Source: `src/lib/data/investor.ts`. Routes: `/en/investor-centre` + investment-highlights, reports-disclosures, financial-results, annual-reports, corporate-governance, announcements, downloads.

### 7.1 InvestorMasthead / edition / contents (A + D)

`investorMasthead` (registry, section, title before·accent·after, asOn, edition, watermark), `investorEdition` (asOn, edition), `investorContents[]` (label, href, type anchor/route). Masthead fields D (format-constrained); contents list D with route/anchor validation.

### 7.2 Metrics — the canonical figure ledger (C)

`investorMetrics[]` M1–M16 is the **single source of truth for every figure on the investor pages** ("one stat, one source"). Fields: `id` (E, never the array index — the source-of-truth key), `stat`, `value` (pre-formatted display string), `period` (always "as on"), `source`, `entity` (fixed taxonomy ndr-smart-spaces / ndr-invit / ndr-group), `lead?` (flags the MetricsBand headline set).

**Approved — mandatory rule:** this collection becomes the shared **Metrics** collection (§11.3). **Any metric appearing on more than one page must reference the ledger** — homepage hero metrics, About hero/key-number stats, Business proof lines, Investor metrics, and ESG summary metrics. Page-specific narrative figures that appear only once may remain local. The `lead` flag generalises to `usages`. Validation enforces the rule (§13.2).

### 7.3 EditorialStatement / CapitalCycle / CapitalMarketTimeline (A + C)

- `editorialStatement`: `eyebrow`, `heading`, `statement` — A.
- `capitalCycle`: `eyebrow`, `heading`, `lede`, `nodes[]` (number, label, caption) — shared Sequences.
- `capitalMarketTimeline`: `eyebrow`, `heading`, `lede`, `nodes[]` (year, title, caption, detail) — shared Timelines. Periods flagged `*` are client-confirm (D marker).

### 7.4 InvITRelationship / SafeHarbour / Resilience (A + C + D)

- `invitRelationship`: `eyebrow`, `heading`, `body[]`, `external.label/href`, `note` — A/D. The ROFO legal framing copy is **A but restricted** (see §13 permission note on legal copy).
- `safeHarbour` + `safeHarbourDisclaimer`: A, **restricted to Super Admin / legal review** — verbatim source text; must not be casually edited.
- `resilience` `rows[]`: `label`, `note`, `source` — A/C/D.

### 7.5 Filing registers — Reports, Results, Annual, Announcements, Downloads (C + B + D)

The five `FilingLibraryConfig` objects share one shape (`mode`, `categories`, `filings[]`, `statements[]`, `groups[]`, intro copy, notes). `mode` is **E** (index/table/library fixed per route).

| Field                                                                               | Category | Validation                                                                                                                                              |
| ----------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intro copy (`eyebrow`, `title`, `asOn`, `edition`, `lede`, `note`, `entityNote`)    | A/D      | non-empty                                                                                                                                               |
| `categories[]`                                                                      | D        | unique; drives the filter tabs                                                                                                                          |
| `filings[]`: `ref`, `asOn`, `title`, `category`, `type`, `status`, `size?`, `href?` | C/B/D    | ref unique; `asOn` present when published; `href` required when published/external; category ∈ categories; status taxonomy (published/pending/external) |
| `statements[]` (financial-results): `period`, `cells[]` (label/value), `source`     | C        | period unique; every cell value present or explicit "—"; numeric cells numeric                                                                          |
| `groups[]` (downloads): `category`, `documents[]`                                   | C/B      | category unique                                                                                                                                         |

The **Downloadable Document** fields (PDF asset, size, revision) tie to the shared **Documents** collection (§11.4) and media library (§11.5). "Document status" (`published/pending/external`) is **Category D** and drives the publication gate — a document does not render publicly until published.

### 7.6 GovernanceManual (A + C + B)

- `governance.masthead`: A/D.
- `governance.framework`: `eyebrow`, `heading`, `statement`, `rows[]` (label, note, source) — A/C/D.
- `governance.board[]`: (id, name, role, photo) — C + B → shared TeamMembers (§5.5 reused for board).
- `governance.committees[]`: (id, name, charter, status) — C.
- `governance.policies[]` (Filing records) — C/B/D.
- `governance.note`, `policyCategories[]` — A/D.
- Register structure (Board / Committees / Policies tables) — E.

### 7.7 InvestorClosing (A + D)

`investorClosing`: `line`, `body`, `primaryCta`, `secondaryCta`, `tertiaryLink`, `enquiry`. A/D.

---

## 8. ESG & Sustainability — Sustainability Ledger

Source: `src/lib/data/esg.ts`. Sections: EsgMasthead → EsgStatement → EsgFramework → EsgEnvironment → EsgSocial → EsgGovernance → EsgDashboard → EsgImpactMap → EsgCertifications → EsgDisclosures → EsgClosing.

### 8.1 Masthead / statement (A + D)

`esgMasthead` (registry, section, title parts, statement, asOn, edition, folio, controlCaption, watermark) — D (format-constrained) + A for statement. `esgStatement`: `eyebrow`, `heading`, `statement`, `signatory`, `provenance` — A/D. Record status taxonomy (published/pending/draft) and its labels/tones (`ESG_STATUS_LABELS`, `ESG_STATUS_TONES`) — **D** (labels) with taxonomy E.

### 8.2 Framework (A + C)

`esgFramework`: intro (A) + `pillars[]` (key E/S/G, name, chapter, focus, items[] with ref/label/note). Pillar count (3) and ref prefixes (EN-/SO-/GV-) are **E**; `name`, `focus`, `label`, `note` are A/C. The ref codes are D (publication references, format-constrained).

### 8.3 Environment / Social / Governance records (C)

- `esgEnvironment`: intro (A) + `metrics[]` (id, code, stat, value, unit, period, source, trend, draft?) — **Category C → shared ESG Metrics** (§11.6). `trend` (up/down) taxonomy E. `draft` marker must be consistent with `*` in period (§13).
- `esgEnvironment.categories[]` (code, title, body, metricId) — A/C; `metricId` links a category to its headline metric.
- `esgSocial` `rows[]` (ref, label, note, source, status) — A/C/D.
- `esgGovernance`: `commitments[]` (ref, label, note, source) — A/C; `registers[]` (title, rows[]: id, ref, asOn, entry, note, status) — C/D; `note` — A.

### 8.4 Dashboard — the chart system (C + D + E)

The dashboard is the site's **chart test bed**. Data shapes: `EsgTrend` (id, code, title, unit, source, draft?, points[]: period+value), `EsgGoal` (id, code, label, unit, current, target, targetPeriod, direction higher/lower, source, draft?), `EsgComposition` (id, code, title, unit, source, draft?, parts[]: label+value). Block labels **Trends / Targets / Composition** are hardcoded in EsgDashboard.tsx — Category A (move to data).

- **Editable (C/D):** all values, labels, units, periods, targets, draft flags, sources, series points. Chart **visibility** per series (draft/published) is D.
- **System (E):** chart rendering (svg geometry, axis ticks, animation), the approved color tokens, the 5-token segment palette, `direction` semantics (target status text), and the requirement that each composition sums to 100.
- Colors are **approved tokens only** — the admin can assign a token from the palette to a series/segment, never an arbitrary hex (§12.2).

### 8.5 Impact map (C + D)

`esgImpactMap`: intro (A) + `initiatives[]` (id, code, name, place, region, category, status, lat, lon, x, y, note) — **shared Locations pattern** (§11.1) + initiative register. `IMPACT_CATEGORIES` (key, label, color-token) — D (labels) with token assignment; category taxonomy E. Status is free text (D) with suggestion list. The outline/viewbox are E.

### 8.6 Certifications / Disclosures / Closing (C + B + D)

- `esgCertifications` `certifications[]` (ref, standard, scope, status, validFrom?, note?): C/B/D. **Documents** relationship: a certificate is published with its certificate PDF (§11.4).
- `esgDisclosures` `groups[]` (category, documents[]: ref, title, asOn, status, edition?, note?): C/B/D → shared Documents.
- `esgClosing` + `provenanceNote`: A/D.

---

## 9. Media — Press Register

Source: `src/lib/data/media.ts`. Sections: MediaMasthead → MediaStatement → FeaturedPublication → PressArchive → MediaKit → PressContact → MediaClosing.

### 9.1 Masthead / statement (A + D)

`mediaMasthead`, `MEDIA_EDITION`, `MEDIA_PUBLICATION` (ref, title, classification), `mediaStatement` (incl. reference + recorded lines). D (format-constrained) + A.

### 9.2 FeaturedPublication (A + B + C + D)

`mediaFeatured`: `ref`, `publication`, `issue`, `archiveCode`, `category`, `date`, `status`, `genre`, `title`, `statement`, `excerpt`, `source`, `href`, `external`, `record[]` (label/value). A/C/D. **Relationship:** `ref` must exist in the press archive (§13 — existing `validateFeaturedReference`). Optional cover asset (B).

### 9.3 PressArchive (C + B + D)

`pressArchive`: intro (A) + `PRESS_CATEGORIES[]` (key, label, description — D) + `entries[]` (id, ref, date, category, title, note?, status, href?, external?). Category taxonomy (press-release/coverage/interview/update) E; labels D. Entry copy A/C; document link B/D. Status taxonomy (published/pending/draft) D.

### 9.4 MediaKit (B + D)

`mediaKit`: intro (A) + `items[]` (ref, label, note, format, classification, revision, status). **Category B/D → media library** — each item is a downloadable asset (PDF/SVG/PNG) with its file, format label, revision, and status.

### 9.5 PressContact (A + D)

`pressContact`: intro (A) + `response` (label/value/classification — D) + `departments[]` (ref, label, value, href, note) — **shared with Contact desks** (§10.2) — + `address` (D).

### 9.6 MediaClosing (A + D)

`mediaClosing`: intro copy + CTAs + `provenanceNote`. A/D.

---

## 10. Contact

Source: `src/lib/data/contact.ts`. Sections: ContactMasthead → OfficeDirectory → Correspondence → ContactMap → InquiryRouting → ContactClosing.

### 10.1 OfficeDirectory (A + C + D)

`officeDirectory` `offices[]` (key, kind, name, lines[], phone, email, hours, directions?):

| Field                              | Category   | Validation                                                                      |
| ---------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `key`                              | E (stable) | unique                                                                          |
| `kind`, `name`                     | A          | required                                                                        |
| `lines[]` (address)                | A          | ≥1                                                                              |
| `phone`                            | C/D        | phone pattern; **draft flag** until client-confirmed                            |
| `email` (label + href)             | D          | href starts `mailto:`                                                           |
| `hours`                            | D          | non-empty; **draft flag**                                                       |
| `directions` (label/href/external) | D          | external Google Maps URL                                                        |
| `locationId`                       | C          | optional reference to a shared Location (§11.1) — drives the Contact map marker |

The current `note` (phones/hours are draft) is a site-wide provenance banner — **D**, tied to the draft flags on phone/hours fields. Offices are part of the **Contact Directory** collection (§11.12).

### 10.2 InquiryRouting + form config (A + D — the shared desk model)

`inquiryRouting` `desks[]` (key, label, route, recipient, href, phone, response) and `correspondenceForm` (eyebrow, heading, subheading, response, note, fields[] incl. name/company/email/phone + types/required/autocomplete, enquiryTypes[], messageLabel, submit, sending, success, route map, deskForType map). Both live in the **Contact Directory** collection (§11.12). The **enquiry-type → desk → email routing map is Category D** and is the single source of truth for both the homepage EnquiryForm and the contact CorrespondenceForm (they currently duplicate routing in `homepage.ts` `contact.form` and `contact.ts` `correspondenceForm` — unify).

- Field schema (labels, required flags, order, autocomplete) — D; field **types** (text/email/tel) E.
- Client-side form validation (email/phone patterns, required checks) — **E** (validation logic) but the _error strings_ are A.
- The current forms are `mailto:` clients — the **submission transport** is E (replaced behind the scenes by the CMS form backend in Phase 3 without touching the form UI; see §14.5).

### 10.3 ContactMap (C + D)

`contactMap`: intro (A) + `markers[]` (id, name, place, region, lat, lon, x, y) — **shared Locations pattern** (§11.1). `frameMark`, `plateRef`, `notToScale`, `directions`, `source` — A/D. **Map visibility** (which offices show on the map) is D.

### 10.4 ContactClosing (A + D)

`contactClosing`: intro + CTAs. A/D.

---

## 11. Shared data architectures

The audit found five recurring structures the frontend treats as separate arrays but the CMS must treat as **collections** (one editor, one source, validated once).

### 11.1 Locations + Zones (shared across Portfolio · ESG · Contact · Homepage)

```
Collection "zones"          Collection "locations"
  id (E: south/west/east/north)   id (E: stable slug)
  name (A)                        name (A)
  fact (A)                        zoneId  → zones.id
  frame/centroid (E)              tier (E taxonomy: hq/hub/satellite)
  chapter numeral (E: I–IV)       category (D: for ESG initiatives)
  ──                              region (D)
                                  lat, lon (C — the authoritative coordinates)
                                  x, y  → DERIVED via projectPlace (E, never hand-edited)
                                  homepageOffset (D — visual composition only, validated
                                    to stay inside the viewbox)
                                  line (A)
                                  labelSide/leaderTo (D presentation)
                                  visibleOn[] (D: homepage/atlas/esg/contact)
                                  media (B)   documents (D → §11.4)
                                  status (D)
```

- Portfolio `geoLocations`, ESG `initiatives`, Contact `markers`, and homepage `mapLocations` all become rows of this collection (or related sub-collections) sharing `lat`/`lon` and the projection — one geographic source of truth.
- ESG initiatives add `categoryId`, `status`, `note`, `code` (an **initiative record** related to a location).
- Contact markers relate to **offices** (an office can carry coordinates).
- Admin operations: add / edit / delete / re-coordinate / categorize / assign region / upload media / attach documents / control visibility — all on the shared model (§12).

### 11.2 Assets (portfolio)

`portfolioAssets[]` as in §6.5. Relationship: `zoneId → zones.id`, `locationId → locations.id`, optional `image → media`, optional `route → page/href`.

### 11.3 Metrics (shared figure ledger)

`investorMetrics` M1–M16 becomes the canonical **Metrics** collection:

```
Metric { id (E), stat (A), value (C), period (C/D), source (D), entity (taxonomy),
         usages[] (D: homepage-hero, about-hero, about-key-numbers, investor-lead,
                   investor-table, proof-line, portfolio) }
```

- Rendering (value formatting, counter animation, table vs band) is E; the _string_ is C.
- **Mandatory rule:** any metric appearing on more than one page **must** reference the ledger — homepage hero stats, about hero stats, about key numbers, investor metrics, Business proof lines, and ESG summary metrics. Page-specific narrative figures may stay local.
- The investor `lead` flag generalises to `usages`.

### 11.4 Documents (shared documentary register)

One **Documents** collection absorbs every filed/attached document:

```
Document { ref (unique, from §1.4), title (A), category (D), type (A/D), asOn (C/D),
           status (D: draft/pending/published/archived/external), size (D), revision (D),
           file → media library (B), href? (B/D external link),
           publication[] (D: which registers it appears in) }
```

Feeds: investor `filings` + `statements`, ESG `disclosures`, ESG `certifications`, governance `policies`, media-kit items, announcements. The **publication gate** is enforced centrally: a document does not appear publicly until `published`. `archived` removes it from public renders while retaining the record.

### 11.5 Media library (assets)

```
MediaAsset { id, kind (image/logo/pdf/svg), file, alt (A — required for images),
             title, caption, mime, sizeBytes, dimensions,
             status (D: draft/pending/published/archived/external),
             usedBy[] (read-only usage list) }
```

- The two logo lockups are seeded; hero imagery, leadership portraits, board photos, asset plates, and media-kit files attach from here.
- Broken-link detection runs over every `usedBy` reference (§13). The same status taxonomy as Documents applies; only `published` assets render publicly.

### 11.6 ESG metric registers (environment + dashboard)

`esgEnvironment.metrics` and `esgDashboard.trends/goals/composition` are kept as **ESG metric registers** (typed: environment metric / trend series / goal / composition), each a Category C record with draft/published status. Goal `current` **must resolve** to the matching environment metric or trend's latest point (relationship, validated for consistency — the same value appearing in two places with different numbers is a validation error).

### 11.7 Sequences & timelines (chains and journeys)

Two node shapes recur:

- **Sequence** (index, name, caption): businessModel steps, capitalDeployment chain, execution chain, capitalCycle.
- **Timeline** (year, title, caption, detail): homepage journey, aboutTimeline, capitalMarketTimeline.

Model both as ordered-node collections scoped to a `context` (which page/publication) so each publication's editorial line stays independent while sharing one editor component and one validator.

### 11.8 Team members (leadership + board)

`TeamMember { id, name (A), role (A), bio (A), photo → media (B), sortOrder, visible }`. The About leadership grid and the governance board register read from this collection (board rows add no photo → initials monogram).

### 11.9 Pages (SEO + publication metadata)

Per public route (the fixed `siteRoutes` set), a **Page** record holds:

- `seo`: `title` (D, ≤ 60 chars), `description` (D, ≤ 160 chars), canonical, `robots` (D). Defaults come from Brand Settings (§1.3 `seoDefaults`, `ogImages`); each page overrides.
- `publication`: watermark, folio, control caption, edition, asOn, registry line (D, format-constrained) where the volume has one — references issued by the Reference Registry (§1.4).
- `editionStatus`: live / in-draft (D) — drives which content a visitor sees.

Today SEO is hardcoded in each `app/[locale]/*/page.tsx` `metadata` export and masthead strings live in data modules; the CMS surfaces both here.

### 11.10 Business Verticals

`divisions[]` from §5.2 becomes a first-class collection: `id`, `index` (E), `title`, `writeup` (A), `spec[]` (A/C), `proof` (C → Metrics refs where shared), `proofSource`, `route` (A/D), `source` (D), `anchor` (E), `image` (B, conditional). The homepage BusinessHighlights verticals (§3.5) reference these records via relationship.

### 11.11 Governance Records

`governance.framework/board/committees/policies` (§7.6) become a **Governance Records** collection: board members reuse TeamMembers (§11.8); committees (`id`, `name`, `charter`, `status`); policies are Documents (§11.4) with register numbers from §1.4; framework rows are A/C/D. Register numbers are issued by the Reference Registry, never hand-typed.

### 11.12 Contact Directory

`officeDirectory.offices[]` (§10.1) and `inquiryRouting.desks[]` (§10.2) become a **Contact Directory** collection: offices (`key`, `kind`, `name`, `address`, `phone`, `email`, `hours`, `directions`, `locationId → locations.id`, draft flags) and desks (`key`, `label`, `route`, `recipient`, `phone`, `response`). Both the Contact page and the homepage contact teaser read from these records (§3.11) — one source.

### 11.13 Announcements

The investor **Announcements** register becomes a first-class collection: `id`, `ref` (from §1.4), `date`, `category`, `title`, `note`, `status` (draft/pending/published/archived/external), optional document → §11.4. It is the source for the announcements route (§7.5) **and** the homepage LatestUpdates derived feed (§3.10) — publish once, render everywhere.

---

## 12. Map & chart architecture (fully dynamic)

### 12.1 Maps — shared, fully dynamic

- **One location model** (lat/lon authoritative) with `x/y` derived by the frozen projection. Any coordinate edit re-projects instantly; validation flags coordinates that project outside the viewbox.
- Admin capabilities on every map surface (Portfolio atlas, Portfolio locator, ESG impact map, Contact map, Homepage presence map): add location, edit location, delete location, change coordinates, assign zone/category/region/tier, upload media, attach documents, control visibility per-map and per-record status, and edit homepage display offsets (visual composition only — never the coordinates).
- The India outline, projection, viewbox, zone frames, graticule, and edge ticks are **E** (frozen). Location labels/leader lines and homepage offsets are D with viewbox validation.
- Contact map markers derive from the **Office** records (add an office with coordinates → marker appears; toggle `visibleOn: contact`).

### 12.2 Charts — data-driven, token-safe

- All charts render from the ESG metric registers (`EsgTrendChart`, `EsgGoalProgress`, `EsgCompositionBar`); the dashboard rebuilds automatically on publish.
- Admin controls: values, labels, units, reporting periods, historical series, targets, and per-series draft/published visibility.
- **Colors:** series/segment/category colors are selected from the **approved token palette** (maroon-print, gold, maroon-bright, stone, gold-light, + impact category tokens). Arbitrary hex is rejected (E).
- **Automation:** composition bars recompute segment widths from part values and must sum to 100 (±0.5); goal progress bars recompute `% of target` and the target-status string from `current/target/direction`; trend axes rescale from point values. None of these are hand-authored.
- Chart geometry, animation, axis math, and reduced-motion behavior are E.

---

## 13. Validation layer

The four existing modules (`navigationValidation`, `contactValidation`, `esgValidation`, `mediaValidation`) become the core of a single CMS-side validator. The full rule set the CMS must enforce (grouped):

### 13.1 Structural & referential

- **Routes:** every internal href resolves in `siteRoutes`; every `#anchor` exists in `routeAnchors` for its route (existing `navigationValidation`).
- **Duplicates:** no destination repeats within a surface; one label per destination; **no duplicate metrics** (same `stat`+`value`+`period` under two ids); **no duplicate locations** (same `name`+`region`); no duplicate office keys, desk keys, ref codes, plate numbers, metric ids, document refs (existing contact/media/esg rules + new).
- **References:** asset `zone`/`locationId` exist; ESG category `metricId` exists; featured publication `ref` exists in the archive (existing); document/media `usedBy` targets exist (new); goal `current` matches the referenced metric/trend value (new).
- **Publication references:** every `REF`/`PLATE`/`FIG`/`DOC`/`FY`/`Volume`/register number is issued by the Reference Registry (§1.4) — no manually invented codes, no collisions, no renumbering of a referenced value (new).
- **Reachability:** every route reachable from nav, CTA, or footer (existing).

### 13.2 Numeric

- **Percentages:** metrics/trends/compositions in `%` must be 0–100; composition sums 100 ±0.5 (existing); environment metrics with `%` unit ≤ 100 (new).
- **Compositions:** every `EsgComposition` sums to 100 ±0.5 (existing `validateComposition`).
- **Goals:** `current` and `target` positive and finite (existing `validateGoals`); `targetPeriod` ≥ latest data period (new).
- **Trend series:** ≥2 points; every value finite; no repeated period (existing `validateTrendSeries`).
- **Metrics:** `value` non-empty; `period` present ("as on …"); `source` present; lead metrics unique-ish by usage (new).
- **Reporting periods:** every published metric, filing, disclosure, and trend point carries a valid period/date — missing reporting periods are a blocking error (new).
- **Portfolio:** `sizeSqFt` positive; `plate` unique and format `NN` (registry-issued); `completedYear` 4-digit (new).

### 13.3 Coordinates

- Lat ∈ [-90, 90], lon ∈ [-180, 180] (existing contact/esg map rules, extended to the shared Locations collection).
- Projected `x/y` within viewbox (existing contact rule; new for atlas/ESG/homepage).
- No duplicate location name+region (existing ESG uniqueness, extended).

### 13.4 Draft / status consistency

- `draft` record must carry the `*` marker in its period/date (existing ESG + media draft rules).
- Published document/filing requires `href` (or media file) and `asOn`; pending requires neither; external requires `href` (new).
- `status: published` items on the live site must be a subset of approved content — a pre-publish "reconcile" step (new).
- **Unpublished linked content:** any published record that references a document, media asset, or metric whose status is not `published` (or which is `archived`) is a blocking error — the publication gate is enforced at reference depth, not just at the record (new).

### 13.5 Links & media

- Broken document/media links: every `href`/file reference resolves to an existing asset or a reachable route (new — completes the blueprint requirement).
- `mailto:` hrefs well-formed; email label matches a known desk or global setting (existing contact rule, extended).
- Image alt required for decorative-swap assets (new).

### 13.6 Copy & SEO

- Required field completeness: non-empty across all sections (block intros, CTAs, mastheads, addresses, contact details) — a record is publish-blocked until every required field is complete (new).
- SEO title ≤ 60 chars, description ≤ 160 chars (new).
- Edition/asOn strings consistent with **Publication Settings** (§1.2) (new).
- Safe-harbour and legal copy: **hash-locked** — any change requires Super Admin + a legal-approval status; the validator blocks accidental edits (new).

### 13.7 Unit consistency

- Metrics of the same `stat` across usages share the same unit string (e.g. all "sq ft", "%") (new — the blueprint's "inconsistent units" rule).

### 13.8 Operating model

- Validators run in **development and CI** (fail loud), and inside the **admin before publish** (blocking). Draft/invalid records may be saved but cannot be published; a "validation report" panel lists every failing rule with its field.

---

## 14. Admin modules

The admin panel is organised as ten modules — **collection-driven, not page-driven**. Each module manages the collections in §11 and the pages consume them through relationships (§0). Each maps to the roles in §15.

### 14.1 Dashboard (all roles)

Site health: validation report, publish queue (`draft → pending → published → archived`), route reachability, broken links, records awaiting approval, per-publication status summary, edition/asOn quick facts.

### 14.2 Content — Pages & Sections

Edit every Category A field, page by page, in the fixed section order. Page picker → section list → field forms. Includes block intros, CTAs, editorial statements, division writeups (via Business Verticals, §11.10), highlights, project narratives, legal copy (restricted), and the component-label strings moved out of components (Footer CTAs, dashboard block labels, etc.). SEO fields per page (§11.9) with defaults from Brand Settings (§1.3).

### 14.3 Media & Documents

The Media library (§11.5) and Documents register (§11.4): upload, replace, revise, alt/caption, status, and the "used by" list. Document status drives publication.

### 14.4 Navigation & Footer

Menu hierarchy (label, order, visibility), mega-menu overview + columns, header CTA, utility strip, footer groups/links/legal/ecosystem/contact band, mobile nav, sitemap groups. Route/anchor pickers with validation.

### 14.5 Contact & Enquiries

Offices, inquiry desks, enquiry-type → desk → email routing, form fields/labels/errors/CTAs, office hours + draft flags, map markers (via the location editor), press-contact departments. **Phase 3:** form submission inbox + routing targets (the `mailto:` transport is replaced without changing the public form).

### 14.6 Portfolio

Asset creation/editing/deletion (plate auto-assign), location management (the shared map editor), zone assignment, project media, status, register copy, and the atlas/filing-band settings.

### 14.7 Investor Centre

Metrics ledger (with usage tags — mandatory references), capital cycle/timeline, resilience, safe-harbour (locked), the five filing registers (reports, results statements, annual, **announcements**, downloads) with document uploads and the publication gate. Announcements are a first-class collection (§11.13) feeding the homepage LatestUpdates (§3.10).

### 14.8 ESG

Environment/social/governance registers, dashboard metric registers (trends, goals, compositions — the chart editors), impact initiatives on the map, certifications, disclosures, framework copy, status/draft flags.

### 14.9 Media Centre

Press archive entries, categories, featured publication selection, media-kit assets (from the media library), press contact desks (via the Contact Directory, §11.12), closing copy.

### 14.10 Settings & Reference Registry (Super Admin)

The three settings modules (§1.1 Corporate, §1.2 Publication, §1.3 Brand) and the Reference Registry (§1.4): prefixes, formats, and sequence counters for `REF`/`PLATE`/`FIG`/`DOC`/`FY`/`Volume`/register numbers, plus a registry audit (what each issued reference is used by). No page or record maintains a publication reference manually.

---

## 15. Role structure & permissions

| Module                                                                                                  | Super Admin   | Content Editor      | Investor Editor     | ESG Editor           | Media Editor        |
| ------------------------------------------------------------------------------------------------------- | ------------- | ------------------- | ------------------- | -------------------- | ------------------- |
| Dashboard & validation report                                                                           | full          | view                | view                | view                 | view                |
| Content — pages & sections                                                                              | full          | **read/write**      | read                | read                 | read                |
| Media & documents                                                                                       | full          | **upload + status** | **upload + status** | **upload + status**  | **upload + status** |
| Navigation & footer                                                                                     | full          | **read/write**      | —                   | —                    | —                   |
| Contact & enquiries                                                                                     | full          | **read/write**      | read                | read                 | read                |
| Portfolio                                                                                               | full          | read                | read                | read                 | read                |
| Investor Centre — metrics                                                                               | full          | —                   | **read/write**      | read                 | —                   |
| Investor Centre — filings                                                                               | full          | read                | **read/write**      | read                 | read                |
| Investor Centre — safe harbour / legal                                                                  | full (locked) | —                   | view                | view                 | view                |
| ESG registers & charts                                                                                  | full          | read                | read                | **read/write**       | read                |
| ESG certifications/disclosures                                                                          | full          | read                | read                | **read/write**       | read                |
| Media Centre — archive                                                                                  | full          | read                | read                | read                 | **read/write**      |
| Media Centre — media kit                                                                                | full          | read                | read                | read                 | **read/write**      |
| Locations & zones (shared)                                                                              | full          | read                | read                | **write (ESG cat.)** | —                   |
| Portfolio assets/locations                                                                              | full          | —                   | read                | read                 | —                   |
| Publish (draft → published)                                                                             | full          | own content         | own content         | own content          | own content         |
| Roles & users, Settings (Corporate/Publication/Brand), Reference Registry, themes, publication identity | full          | —                   | —                   | —                    | —                   |

**Roles defined:**

- **Super Admin** — full control; the only role that edits the three settings modules (§1.1–1.3), the Reference Registry (§1.4), publication identity, safe-harbour/legal copy, roles & users, and approve/reject any record.
- **Content Editor** — text, media, documents, navigation/footer, contact copy across all pages.
- **Investor Editor** — financial metrics, reports, filings, disclosures, announcements, governance records (framework/board/committees/policies), safe-harbour read-only.
- **ESG Editor** — ESG metrics, trends/goals/compositions, initiatives, certifications, disclosures, ESG-category locations.
- **Media Editor** — press releases, archive entries, featured publication, media kit, press contact.

**Workflow:** every edit moves a record through `draft → pending → published → archived` (and `reverted → draft`). Only the owning role (or Super Admin) can publish; only Super Admin can archive. Validation (§13) blocks publishing an invalid record. Every change is versioned with author, timestamp, and a diff; legal/safe-harbour records additionally require a legal-approval flag.

### 15.1 System-wide audit history (final requirement)

**Every editable collection maintains a complete audit trail.** For every **create, update, publish, archive, restore, or delete** action, the system records an immutable audit entry:

| Field             | Meaning                                                |
| ----------------- | ------------------------------------------------------ |
| `user`            | who performed the action                               |
| `role`            | the role the user held                                 |
| `timestamp`       | when (UTC, monotonic sequence)                         |
| `actionType`      | create / update / publish / archive / restore / delete |
| `beforeValues`    | full prior state of the affected record                |
| `afterValues`     | full resulting state of the affected record            |
| `collection`      | affected collection                                    |
| `recordId`        | affected record                                        |
| `statusChange`    | prior → new publication status (where applicable)      |
| `documentVersion` | prior → new version (where applicable)                 |
| `auditRef`        | Reference-Registry reference affected, if any          |

**Coverage — every collection:** Metrics, Locations, Documents, Media, Business Verticals, Portfolio Assets, ESG Initiatives, Governance Records, Contact Directory, Announcements, Navigation, Corporate Settings, Publication Settings, Brand Settings.

**Permanence rules:**

- **Publishing is fully traceable** — every publish/archive/restore is an audit entry; there is no silent status change.
- **Document replacements preserve version history** — a replacement creates a new document version; the prior file and prior values remain retrievable.
- **Metric revisions preserve historical values** — old values are never overwritten in place; they live in the audit trail for publication-grade reporting.
- **Location edits preserve coordinate history** — every lat/lon change is recorded; prior coordinates remain retrievable.
- **Investor and ESG changes maintain publication-grade auditability** — full before/after on every metric, filing, trend, goal, and composition edit.
- Audit entries are **append-only and tamper-evident** (hash-chained, Super Admin cannot edit them); they are excluded from the byte-stable export generator.

This is the final system-wide requirement. The architecture is now **fully frozen** — Version 1.1 is the definitive admin-panel architecture; no further architectural changes will be made during implementation.

---

## 16. Data architecture (connecting the CMS to the frontend)

The frontend is a **static export** with no server runtime and must not be rewritten. The CMS is therefore **headless**: it authors and validates content in a database and generates the exact TypeScript data modules the components already import.

### 16.1 Recommended stack shape

- **Admin app** (Next.js or a lightweight React admin) with auth + RBAC, connected to a database (SQL, or a structured document store) and an object store for media/documents.
- **Content export pipeline** ("build gate"): on publish, the CMS serialises collections to typed, `as const` `.ts` modules matching today's shapes exactly (`src/lib/data/*.ts`) — same keys, same union types — so **no frontend component changes** are required. The existing validation modules run inside the CMS first and in CI after.
- **Static rebuild:** the existing `next build` regenerates the site; the "publish" action is: validate → write data modules → commit/PR → build → deploy. This preserves the static architecture, SEO, and performance baseline.

### 16.2 Idempotency and schema lock

- Data module filenames, export names, and type shapes are the **contract** between CMS and frontend. The blueprint freezes them as listed in §0.2; the CMS generator must emit byte-stable output so diffs stay reviewable.
- The **Reference Registry** (§1.4) is contract-safe: issued values are stable and never renumbered, so re-publishes produce byte-stable output.
- System constants (`PROJECTION`, `MAP_VIEWBOX`, `INDIA_OUTLINE`, route anchors, taxonomies, tokens) are **not** generated — they remain frozen code.

### 16.3 Future-proofing

- **Localisation:** the single `en` locale is structural (`app/[locale]`). The collection schema adds `locale` per content record without frontend changes; the generator emits per-locale modules and `generateStaticParams`.
- **Form backend:** Phase 3 replaces the `mailto:` transport with a submissions API/inbox while keeping the same public form markup and routing map.
- **Feed:** LatestUpdates is a derived feed from Announcements + Press Archive (§3.10) — publish once, render everywhere; no duplicate entry.

---

## 17. Implementation priority

| Phase                                           | Scope                                                                                                                                                                                                                                    | Modules / collections                                                            | Exit criteria                                                                                                                                            |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P1 — Content, media, documents, settings**    | Content sections (Category A/D), Settings (Corporate/Publication/Brand) + Reference Registry, Pages/SEO, Media library, Documents, Navigation & Footer                                                                                   | Dashboard, Content, Media & Documents, Navigation, Settings & Reference Registry | Client can edit all text, SEO, nav, footer, and upload documents on every page; references issued by the registry; build gate emits unchanged components |
| **P2 — Metrics, locations, registers**          | Metrics ledger (+ mandatory usage tags), Locations/Zones master collection (incl. homepage offsets), Portfolio assets, Investor filing registers + announcements + governance, Contact Directory (offices/desks/routing), Legal (locked) | Portfolio, Investor Centre, Contact, shared Locations/Zones, Metrics             | Client can maintain every figure (one metric, one source), asset plate, location, filing, announcement, office, and routing rule without code            |
| **P3 — ESG, charts, maps, relationships**       | ESG registers, chart editors, impact initiatives (Locations relationships), certifications/disclosures, dynamic map editor, derived feeds (LatestUpdates), form backend + inbox                                                          | ESG, chart editors, location editor, enquiry inbox, derived feeds                | Client can add a location or an ESG series and see it render automatically; shared-content relationships enforced (ESG teaser, LatestUpdates)            |
| **P4 — Roles, workflow, publishing, approvals** | RBAC, versioning, audit log, publish queue (draft → pending → published → archived), legal hash-lock, reference-registry audit, CI validation, locale readiness                                                                          | all                                                                              | Non-developer staff operate the site under roles; every publish is gated by validation and review                                                        |

**Priority principle:** Phase 1 delivers the "edit the words, the files, and the settings" promise fastest; Phase 2 makes the data-driven registers (metrics, locations, filings) single-source; Phase 3 connects ESG, charts, maps, and derived feeds through relationships; Phase 4 makes it safe to hand to the client team.

---

## 18. Build checklist (verification against this document)

- [ ] Every field listed in §3–§10 is present in the CMS with the category shown and the source module referenced.
- [ ] Collections §1, §2, §11 implemented with the stated keys and taxonomies; Settings split into Corporate/Publication/Brand (§1.1–1.3).
- [ ] Reference Registry (§1.4) issues `REF`/`PLATE`/`FIG`/`DOC`/`FY`/`Volume`/register numbers; no page maintains a publication reference manually.
- [ ] Metrics ledger rule enforced: any metric on more than one page references the ledger (§11.3).
- [ ] One master Locations collection drives Portfolio, ESG, Contact, and Homepage maps; homepage offsets are display-only (§11.1).
- [ ] Documents/Media status taxonomy `draft/pending/published/archived/external`; publication gate enforced at reference depth (§11.4–11.5, §13.4).
- [ ] Derived feeds live (LatestUpdates from Announcements + Press Archive, §3.10); ESG teaser references the ESG framework (§3.9).
- [ ] All validation rules §13 run in the admin before publish and in CI — incl. the nine approved checks (duplicate metrics/locations, invalid coordinates, missing periods, inconsistent units, broken document refs, unpublished linked content, invalid publication references, required completeness).
- [ ] Map editor (§12.1) covers add/edit/delete/re-coordinate/categorise/media/document/visibility + homepage offsets for all four map surfaces.
- [ ] Chart editors (§12.2) regenerate automatically; colors restricted to the approved tokens.
- [ ] Roles/permissions §15 enforced; publish gate honours the draft → pending → published → archived workflow.
- [ ] Audit history (§15.1) recorded on every create/update/publish/archive/restore/delete across all fourteen collections; entries append-only and tamper-evident; publishing fully traceable.
- [ ] Data generator emits byte-stable `src/lib/data/*.ts`; `npm run typecheck`, `npm run lint`, `npm run build` stay clean after a publish.
- [ ] `prettier --check` clean on generated modules.
