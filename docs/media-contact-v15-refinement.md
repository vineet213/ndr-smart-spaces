# Media & Contact — V1.5 Flagship Refinement Report

Phase: V1.5 refinement pass over `/en/media` (The Press Register) and `/en/contact`
(The Correspondence Office). Not a redesign — a hierarchy, composition and
documentary-authority pass that brings both pages level with Business V1.5,
Portfolio V1.5, Investor V1.5 and ESG V1.6.

Verified: `npx tsc --noEmit` clean · `npm run lint` clean · prettier applied ·
`npm run build` green (20 SSG routes).

---

## 1. Masthead improvements (both pages)

Both covers were charcoal; the composition is retained but rebuilt to read more
monumental and more like a printed cover:

- **Gold registration rule** across the top of the section (3px, gold→gold-light
  gradient, drawn on load) — borrowed from `PortfolioMasthead.ruleTop`.
- **Folio rebuilt as a ruled three-column grid** (`1.5fr 1fr 1fr`): registry ·
  publication run (name + document reference) · control caption. Cell dividers,
  tabular numerals, gold run. Collapses to two columns, then one, at breakpoints.
- **Publication line** above the title: publication name (gold) + document ref,
  with a gold square register mark.
- **Title scale/rhythm**: tightened `line-height: 0.92`, `letter-spacing: -0.03em`,
  `text-wrap: balance`, slight scale increase.
- **Watermark** ("PR" / "CO"): larger (`clamp(8rem,18vw,16rem)`), tracked
  `0.1em`, opacity ~0.045, settled on load — a registration mark, not decoration.
- **Edition hierarchy**: edition now carries the gold square bullet and gold
  colour, separated from the as-on line in the meta row.
- Gold seam rule retained at the foot of the cover.
- Motion remains editorial only (rule draw, title rise, fade, watermark settle);
  all disabled under `prefers-reduced-motion`.

## 2. Hierarchy improvements

- **MediaStatement** is now a publication preface: tighter measure (`64ch`),
  `line-height 1.45`, maroon documentary rule, signatory line, plus a new
  **documentary reference line** (ruled top and bottom) carrying
  `NDR-PR-FY26 · Statement` and `Recorded · FY26`.
- **FeaturedPublication** becomes the visual centrepiece on an archival stone-warm
  plate with a framed ivory spread (2px frame + inset gold hairline, mirroring
  the atlas plate). Head hierarchy: publication+issue run → category/date/status
  kicker → display title → lede → maroon-ruled pull quote → documentary metadata
  grid → source + link.
- **PressArchive** gets a register index header (register code left, entry count +
  folio right) so the sheet reads as a filing register rather than a list.
- **MediaKit**, **PressContact** and **Contact**'s **OfficeDirectory** and
  **InquiryRouting** all adopt the same register-index header, tying the sheet
  grammar together across both pages.
- **ContactClosing / MediaClosing** colophons: new ruled colophon row
  (document ref + edition) above the closing meta, standardised on both pages.

## 3. Register improvements

- **PressArchive → institutional filing register.** Register index, tabular
  reference/date columns, category now set as uppercase register meta (not body
  text), row hover, refined status glyph treatment.
- **MediaKit → documentary asset register.** Each asset now carries an asset
  code (MK-01…), a **file classification** (Corporate profile / Brand assets /
  Brand guidance / Corporate statistics), a **revision** (Rev. 01) and its
  publication status; register index header added.
- **OfficeDirectory → documentary office register.** Each office now carries a
  **reference (OF-01…)** and a **classification** (Corporate / Registered /
  Legal), with a new **Legal records & statutory registers** entry (OF-03,
  pending) making the corporate→registered→legal hierarchy explicit.
- **InquiryRouting → routing register.** Each desk carries a **reference
  (RT-01…RT-05)**, a **routing purpose** classification and a **response
  classification** (Within 2 business days); a new **General desk (RT-05)**
  covers all other correspondence. Desk cards are now ruled register entries
  with a purpose row and a bottom rule holding response + recipient.

## 4. Map improvements (ContactMap → atlas sheet)

Rebuilt in the Portfolio/ESG atlas language inside the charcoal section:

- **Framed ivory plate** (2px frame + inset gold hairline) with crop-style mark
  and plate reference (`Fig. 01`), on a stone-warm archival board.
- **Metadata panels**: Coordinates (`13.0521° N · 80.2461° E`) and Projection
  (Schematic outline of India) as ruled panels beneath the drawing.
- **Locator register**: code · name/place/region · computed lat/lon per marker
  (formatted, not hardcoded).
- **Documentary legend**: gold headquarters ring mark with maroon centre.
- Caption row (`Fig. 01 · Office · Location`, detail, not-to-scale) and register
  line retained, all data-driven.

## 5. Correspondence improvements

- **CorrespondenceForm → incoming correspondence register.** Card re-framed as a
  ruled register sheet; intake header inside the form carries the **intake
  reference (CO-F-01)** and classification (Incoming correspondence); a
  **routing indicator** appears under the enquiry-type select showing the exact
  desk (e.g. `RT-03 · Press desk`) the correspondence will route to. Submit is
  now administrative language ("File correspondence"). The intro column shows a
  register index line (intake ref · classification / response) and a register
  note instead of hardcoded copy.
- **PressContact → correspondence office.** Response classification bar (label ·
  value · classification), register index (code + desk count), and department
  entries (PC-01 Press desk, PC-02 Business desk) with ref, note and address in
  a ruled directory.

## 6. CMS implications

No presentation logic is hardcoded; every new element is driven by the data
layer:

- `src/lib/data/media.ts` now exposes `MEDIA_PUBLICATION` (document ref/title/
  classification), richer `mediaMasthead.publication`, `mediaStatement.reference/
recorded`, `mediaFeatured.record` (documentary metadata grid), `pressArchive
.registerCode/.folio`, `mediaKit.registerCode` + per-item `classification/
revision`, `pressContact.response/.registerCode/.departments`, and closing
  colophon refs.
- `src/lib/data/contact.ts` now exposes `CONTACT_PUBLICATION`, office
  `classification`, routing desk `ref/purpose/response`, correspondence intake
  `intakeRef/classification/response/registerNote/deskForType`, and map atlas
  fields (`frameMark/plateRef/projection/coordinates/legend/registerCode`).
- Validation extended and kept one-directional + dev-only:
  `mediaValidation.ts` adds featured-reference, kit-reference and press-contact
  reference checks; `contactValidation.ts` adds office-classification, routing-ref
  and projection-in-viewbox checks.
- Admin implication: a CMS editor can retitle sheets, add archive/asset/office/
  routing rows and coordinates without touching components; the register codes
  are single-source document references shared by masthead, folio and colophon.

## 7. Remaining visual debt (before the global publication-system pass)

- **Email duplication across data files** still stands (project@/compliance@ in
  utilityStrip, mobile menu footer, homepage footer, media pressContact,
  contact routing). Recommend a single `src/lib/data/contacts.ts` registry as
  part of the global pass (already diagnosed in the navigation audit).
- The two masthead modules are near-identical copies (`MediaMasthead.module.css`
  vs `ContactMasthead.module.css`); the register-index and register styles are
  also repeated per section. A shared publication-system layer (folio, register
  index, register row, status mark) would remove the duplication — this is the
  natural next pass.
- MediaStatement and the FeaturedPublication pull both use the maroon documentary
  rule; acceptable, but the global pass should define one "preface" and one
  "pull" primitive.
- Status glyphs (● / —) are implemented locally in PressArchive, OfficeDirectory
  and FeaturedPublication; a shared `StatusMark` component is warranted.
- The audit's P0 dangling routes (3 business verticals + 4 footer legal pages)
  remain unaddressed and should be fixed before the publication-system pass.
- `--color-maroon-30` was already replaced with an inline `rgba`; the global pass
  should decide whether such derived tints become tokens.
