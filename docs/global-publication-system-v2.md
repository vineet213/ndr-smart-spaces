# Global Publication System V2 — Design-System Refinement

A refinement-only pass over the institutional design system of the NDR Smart Spaces public site — the
"six volumes from the same publisher." No page architecture, publication identity, navigation
structure, content hierarchy, or component functionality was changed. Every change is a tightening of
a system rule so that the volumes read as one set.

## 1. The identity system

Each public page is a "volume" of a single publication house. The V2 pass made the covers of the five
institutional volumes physically identical, so the identity is carried by typography, spacing, rules,
and register conventions rather than by colour per volume.

| Volume                     | Page            | Watermark | Folio               | As-on / edition row |
| -------------------------- | --------------- | --------- | ------------------- | ------------------- |
| Institutional Introduction | Homepage        | —         | —                   | —                   |
| Corporate Record           | About           | —         | —                   | —                   |
| Operating Manual           | Business        | `OP`      | `OP. MANUAL · FY26` | added (V2)          |
| Register of Places         | Portfolio       | —         | —                   | —                   |
| Financial Statement        | Investor Centre | `ST`      | section + registry  | present             |
| Sustainability Ledger      | ESG             | `SL`      | section + registry  | present             |
| Press Register             | Media           | `PR`      | publication · ref   | present             |
| Contact                    | Contact         | `CO`      | section + registry  | added (V2)          |

## 2. Canonical cover (charcoal masthead family)

All five institutional covers now share one recipe. Business, ESG, Media, Contact already used the
charcoal family; **Investor was converted from a light cover to the charcoal family** (it was the lone
outlier and the cause of a four-light-section page opening on the investor centre).

The canonical cover:

- **Registration rule** — a 2px gold gradient seam at the very top of the cover
  (`linear-gradient(90deg, transparent 0%, gold 16%, gold-light 50%, gold 84%, transparent 100%)`).
  Added to Business and ESG (Media/Contact already had it at 3px; reduced to 2px). Investor received
  it as part of the conversion.
- **Folio strip** — one rule under the strip (`border-bottom: 1px solid hairline-dark`; the old
  Business/ESG `border-block` double-line was reduced to a single rule now that the gold seam sits
  above), `font-meta`, uppercase, `tracking-meta`, `text-inverse-70`. Investor's strip switched from
  light-ink to the family recipe.
- **Watermark** — `clamp(7rem, 15vw, 13rem)`, weight 300, `letter-spacing: -0.04em`,
  `rgba(250,247,242,0.04)`, top `-0.04em` / right `-0.02em`. Media/Contact had grown a variant
  (`clamp(8rem,18vw,16rem)`, `+0.1em` tracking, 0.045 opacity) — reverted to the family recipe.
  Investor's light grey `::before` watermark (weight 600) became the family ivory-print watermark
  `ST`.
- **Title** — weight 300, `line-height: 0.95`, `letter-spacing: -0.02em`, ivory with a gold accent
  word. Media/Contact's 0.92/−0.03 tuned back to the family values. Investor's weight-600 ink title
  is now the family ivory/gold treatment (gold accent replaces the old maroon accent).
- **Statement** — `max-width: 42ch`, `line-height: 1.2`. Business's 34ch measure widened to 42ch;
  Media/Contact's 1.25 leading tightened to 1.2.
- **As-on · edition meta row** — `font-meta`, uppercase, `text-inverse-70`, rendered under the
  statement. Added to Business and Contact (data added to `businessMasthead` and `contactMasthead`;
  the family value `As on 31 March 2026 · Edition FY26 · Volume I` is shared with ESG/Media/Investor).
- **Gold seam** — 2px gold rule closing the cover, `margin-top: 6rem` (`--space-11xl`; Business/ESG
  were at 7rem). Investor's 3px rule became the 2px family seam on both cover and slim variants.

Files: `BusinessMasthead.{tsx,module.css}`, `EsgMasthead.{tsx,module.css}`,
`MediaMasthead.module.css`, `ContactMasthead.{tsx,module.css}`, `InvestorMasthead.{tsx,module.css}`,
`src/lib/data/{business,contact,investor}.ts`.

## 3. Register system (tables and registers)

Registers are the volumes' ledgers; V2 gave them one density, one column rhythm, and one status
grammar.

- **Row height** — `--space-2xl` (24px) everywhere. Was 20px (PressArchive), 28px (EsgDisclosures),
  40px (MediaKit), 31px (EsgSocial). FilingLibrary already at 24px.
- **Column gap** — `--space-2xl` (24px). Was 16–20px (FilingLibrary/PressArchive) and 48px
  (EsgDisclosures/EsgSocial).
- **Head rows** — `font-meta`, uppercase, `tracking-meta`, subtle stone. Added a register head
  ("Ref · Document · As on · Status") to each EsgDisclosures group (the per-group head matches the
  FilingLibrary `LibraryMode` convention). Hidden on tablet/mobile like the other heads.
- **Status grammar (light registers)** — active = maroon text + maroon glyph; pending = stone text +
  gold glyph; external = stone text + gold glyph.
  - FilingLibrary: badge glyph is maroon when published, gold when pending/external. The component
    referenced `styles.badgePending`, which was never defined in CSS — added it (pending rows were
    silently falling back to the base badge).
  - StatusBadge (portfolio AssetRegister): completed → maroon text; ongoing → ink-muted text; gold dot
    for both (the old `ongoing` maroon-dot override removed).
- **Body type in ruled tables** — AssetRegister cell text reduced from 17px to `--font-small`
  (14px) to match the other registers.
- **Dark register (PressArchive)** — unchanged status grammar (active gold glyph, pending dim glyph),
  only density/gap normalised.

Files: `FilingLibrary.module.css`, `PressArchive.module.css`, `EsgDisclosures.{tsx,module.css}`,
`MediaKit.module.css`, `EsgSocial.module.css`, `AssetRegister.module.css`, `StatusBadge.module.css`.

## 4. Map system

- **Crop marks** — the Portfolio survey map (AtlasMap) draws edge ticks around the sheet; ContactMap
  had none. Added the same edge-ticks recipe to the Contact map (`EdgeTicks`, 7px ticks at 80px
  intervals on a 930×1000 viewBox) with matching stroke styling, so the office-locations plate reads
  as the same family of plate.
- **Dead data** — `esgImpactMap.note` was authored but never rendered (the caption already uses
  `notToScale`). Removed the dead field.

Files: `ContactMap.{tsx,module.css}`, `src/lib/data/esg.ts`.

## 5. Chart system

- **Tokenisation** — `EsgCompositionBar` used five hard-coded hex colours; replaced with the design
  tokens (`--color-maroon-print`, `--color-gold`, `--color-maroon-bright`, `--color-stone`,
  `--color-gold-light`) applied via CSS variables (valid in inline styles). The ESG impact categories
  in `esg.ts` were tokenised the same way.
- **Tabular numerals** — added `font-variant-numeric: tabular-nums` to the composition-bar unit
  read-out (legend values already had it).
- **Reduced-motion** — added `prefers-reduced-motion` blocks to `LifecycleDiagram`,
  `CapitalMarketTimeline`, `KeyNumbers`, and `LinearChain` (the four draw-on-view components that
  lacked one). Each forces the final state and disables animation/transition. `CapitalMarketTimeline`
  additionally forces the gold progress spine to full (`scaleY(1)`) so reduced-motion users still see
  the full timeline.

Files: `EsgCompositionBar.{tsx,module.css}`, `LifecycleDiagram.module.css`,
`CapitalMarketTimeline.module.css`, `KeyNumbers.module.css`, `LinearChain.module.css`,
`src/lib/data/esg.ts`.

## 6. Token layer (dead tokens restored)

During the V1→V2 token migration the numbered scale names were renamed (`--space-2/3/4` →
`--space-sm/md/lg`, `--text-2xs/--text-sm` → `--font-meta/--font-small`), but 58 usages across ~25
files were left pointing at the old names. Because none of the old names were defined, those rules
silently fell back (gaps → 0/initial, font-size → inherited). The aliases were restored in the token
layer so every usage resolves to its intended value:

```
--space-2: var(--space-sm);   /* 0.5rem  */
--space-3: var(--space-md);   /* 0.75rem */
--space-4: var(--space-lg);   /* 1rem    */
--text-2xs: var(--font-meta); /* 0.75rem */
--text-sm:  var(--font-small);/* 0.875rem */
```

Files: `src/styles/tokens/spacing.css`, `src/styles/tokens/typography.css`.

## 7. Accessibility

- **Caption/SourceFootnote on light** — `--color-text-secondary` (stone, ~3.9:1) → `--color-ink-muted`
  (`#5f5a54`, ~6.3:1) to clear the 4.5:1 WCAG AA bar for small text.
- **TextLink touch target** — padding-block raised from `--space-xs` (4px) to `--space-sm` (8px) for a
  more reliable touch target without changing line height.
- **Metric tabular numerals** — `font-variant-numeric: tabular-nums` added to the shared `Metric`
  component so band figures don't jitter.
- **Tabular utility** — `.tabular` utility added to `src/styles/utilities/text.css` for numeric
  read-outs that need fixed-width digits.

Files: `Caption.module.css`, `SourceFootnote.module.css`, `TextLink.module.css`, `Metric.module.css`,
`src/styles/utilities/text.css`.

## 8. Section rhythm

- **Investor centre opening** — the cover was the only light masthead, giving a
  light→light→light→light opening. Converting it to charcoal fixes the opening to
  charcoal→dim→light. The two slim subpage mastheads (corporate-governance, investment-highlights)
  converted with it (charcoal, `ST` watermark, gold seam).
- **EditorialStatement** — moved from ivory to `--color-ivory-dim` so the section following the
  charcoal investor cover lands on dim, not another ivory sheet.

Files: `InvestorMasthead.{tsx,module.css}`, `EditorialStatement.module.css`.

## 9. CMS inventory (editable content vs code)

All content lives in `src/lib/data/*.ts`; all behaviour in `src/components/**`. There is no admin
panel; this inventory lists what an editor would edit (and where) for each publication. Validation
scripts exist for contact/esg/media records (`runContactValidation`, `runEsgValidation`,
`runMediaValidation`) and should be run after any data edit — wire them into the build/CI when an
admin layer is built.

### Mastheads (all five volumes)

| Field                                                     | Source                                                           | Notes                                                               |
| --------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| registry / section / publication / controlCaption / folio | `business.ts`, `contact.ts`, `esg.ts`, `media.ts`, `investor.ts` | editorial identity — do not change structure                        |
| headline / title (before · accent · after)                | same                                                             | accent word renders gold                                            |
| statement                                                 | same                                                             | 42ch measure                                                        |
| asOn / edition                                            | same                                                             | shared family value `As on 31 March 2026 · Edition FY26 · Volume I` |
| watermark                                                 | same                                                             | 2-letter glyph (OP / SL / PR / CO / ST)                             |

### Business — Operating Manual

| Content                                                   | Source                             |
| --------------------------------------------------------- | ---------------------------------- |
| Chapters (index/label/plate/code)                         | `business.ts` `businessChapters`   |
| Divisions (writeup, spec rows, proof, proofSource, route) | `business.ts` `divisions`          |
| Capability matrix rows + source                           | `business.ts` `capabilityMatrix`   |
| Corporate structure branches + source                     | `business.ts` `corporateStructure` |
| Capital deployment chain + evidence                       | `business.ts` `capitalDeployment`  |
| Execution chain + evidence                                | `business.ts` `execution`          |
| Closing line + CTAs                                       | `business.ts` `businessClosing`    |

### Investor Centre — Financial Statement

| Content                                                                     | Source                                                                                            |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Metric figures (value, period, source, entity) — source of truth per figure | `investor.ts` `investorMetrics`                                                                   |
| Editorial statement                                                         | `investor.ts` `editorialStatement`                                                                |
| Capital cycle chain                                                         | `investor.ts` `capitalCycle`                                                                      |
| Capital-market timeline                                                     | `investor.ts` `capitalMarketTimeline`                                                             |
| NDR InvIT relationship copy                                                 | `investor.ts` `invitRelationship`                                                                 |
| Safe-harbour text + disclaimer                                              | `investor.ts` `safeHarbour*`                                                                      |
| Resilience register rows                                                    | `investor.ts` `resilience`                                                                        |
| Filing library configs (filings, groups, statements, tabs)                  | `investor.ts` `reportsDisclosures` `financialResults` `annualReports` `announcements` `downloads` |
| Governance record                                                           | `investor.ts` `governance`                                                                        |
| Closing                                                                     | `investor.ts` `investorClosing`                                                                   |

### ESG — Sustainability Ledger

| Content                                   | Source                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| Statement                                 | `esg.ts` `esgStatement`                                                                    |
| Framework pillars (refs EN/SO/GV + notes) | `esg.ts` `esgFramework`                                                                    |
| Environment metrics/categories            | `esg.ts` `esgEnvironment`                                                                  |
| Social register rows                      | `esg.ts` `esgSocial`                                                                       |
| Governance register rows                  | `esg.ts` `esgGovernance`                                                                   |
| Dashboard trends / goals / composition    | `esg.ts` `esgDashboard` (trends `EsgTrend`, goals `EsgGoal`, composition `EsgComposition`) |
| Impact map initiatives + categories       | `esg.ts` `esgImpactMap`, `IMPACT_CATEGORIES`                                               |
| Certifications                            | `esg.ts` `esgCertifications`                                                               |
| Disclosure documents/groups               | `esg.ts` `esgDisclosures`                                                                  |
| Closing                                   | `esg.ts` `esgClosing`                                                                      |

### Media — Press Register

| Content                      | Source                                          |
| ---------------------------- | ----------------------------------------------- |
| Featured item                | `media.ts` `mediaFeatured`                      |
| Archive entries + categories | `media.ts` `pressArchive`, `PRESS_CATEGORIES`   |
| Media-kit items              | `media.ts` `mediaKit`                           |
| Press contact copy           | `media.ts` `pressContact`                       |
| Edition / publication refs   | `media.ts` `MEDIA_EDITION`, `MEDIA_PUBLICATION` |
| Closing                      | `media.ts` `mediaClosing`                       |

### Contact

| Content                                                       | Source                            |
| ------------------------------------------------------------- | --------------------------------- |
| Office directory (addresses, phone, hours, email, directions) | `contact.ts` `officeDirectory`    |
| Inquiry routing desks                                         | `contact.ts` `inquiryRouting`     |
| Form fields, routing map, desk labels                         | `contact.ts` `correspondenceForm` |
| Map markers / caption / plate ref                             | `contact.ts` `contactMap`         |
| Closing                                                       | `contact.ts` `contactClosing`     |

### Portfolio — Register of Places

| Content                                                                                         | Source                                                                                                                                              |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Geographic data (locations, zones, projection, outline)                                         | `portfolio.ts` `geoLocations`, `geoZones`, `PROJECTION`, `INDIA_OUTLINE`                                                                            |
| Asset register rows                                                                             | `portfolio.ts` `portfolioAssets`                                                                                                                    |
| Masthead, atlas field, locator index, zone sections, filing band, plate copy, register, closing | `portfolio.ts` `portfolioMasthead`, `atlasField`, `locatorIndex`, `zoneSection`, `filingBand`, `plateCopy`, `portfolioRegister`, `portfolioClosing` |

### Cross-cutting

| Content                                                                                      | Source                                                  |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Homepage blocks (hero, routes, map, journey, highlights, projects, clients, contact, footer) | `homepage.ts`                                           |
| About volume (hero, story, timeline, principles, model, leadership, numbers, closing)        | `about.ts`                                              |
| Legal documents + sitemap                                                                    | `legal.ts`                                              |
| Navigation + mega-menus                                                                      | `navigation.ts`                                         |
| Shared design tokens                                                                         | `src/styles/tokens/*.css` — typography, spacing, colour |

### Not editable as content (code/config)

- Component structure and behaviour (`src/components/**`).
- Publication identities and page architecture (fixed by direction).
- Chart/map geometry constants (`PROJECTION`, `MAP_VIEWBOX`, viewBoxes) — edit via `portfolio.ts`
  projection helpers, not inline.

## 10. Verification

- `npm run typecheck` — clean.
- `npm run lint` — clean.
- `npm run build` — clean; 24 routes pre-rendered (SSG).
- Rendered-HTML smoke check on the built output confirmed: Business/Contact edition rows and
  registration rule present; Investor cover + slim subpages render the charcoal family with the `ST`
  watermark and seam; EsgDisclosures register heads present.

## 11. Pre-existing issues and deferred decisions

- **Prettier drift** — `prettier --check` flags five files that predate this pass: `MobileNav.tsx`,
  `ContentsRail.tsx`, `LegalDocument.tsx`, `navigationValidation.ts`, and `investor.ts` (13 lines).
  None were introduced here; fix in a dedicated formatting commit (`npm run format`).
- **Portfolio light cover** — the light 58rem cover box is a deliberate different expression for the
  Register of Places; left untouched, flagged for client confirmation.
- **Homepage/Portfolio ivory stretches** — long ivory sections are the identity of those two volumes;
  left as-is per the brief.
- **Chart units in tooltips** — the trend chart's `title`/aria already carries units, but units are not
  rendered in the visible axis; deferred to a data-visualisation pass.
- **Contact particulars** — phone numbers/office hours remain draft awaiting client confirmation;
  registered-office address and CIN still to be confirmed (noted in `contact.ts`).
- **`font: 600` leftovers** — LifecycleDiagram `nodeName` and LinearChain `nodeIndex` use a literal
  600 weight rather than the display tokens; harmless, noted for a future token sweep.
