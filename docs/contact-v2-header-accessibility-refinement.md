# Contact V2 + Header & Accessibility Refinement

Institutional usability pass across the Contact page, the header lockup, the
homepage reading experience and the mega-menu. Four objectives, implemented
data-first so every surface stays CMS/editable via `src/lib/data`.

Status: **complete** — typecheck, lint, Prettier and production build pass
(24 routes, all SSG). Dev smoke test verified on `localhost:3000`.

---

## 1. Contact page redesign (`/en/contact`)

Navigation label, page title, metadata and every reference renamed
**"Contact & Correspondence" → "Contact"** (`navigation.ts`, `homepage.ts`
footer group, `legal.ts` sitemap, page `Metadata`).

Documentary chrome removed across the page: publication references
(`NDR-CO-FY26`), edition/folio lines, intake/register codes, status badges
("On record" / "Pending filing"), classifications and the closing provenance
footnote. `CONTACT_EDITION`, `CONTACT_PUBLICATION` and `CONTACT_STATUS_*` were
deleted from `contact.ts`.

### Masthead
- Charcoal cover and gold rule kept; folio strip reduced to two cells
  (registry + publication).
- New hierarchy: `CONTACT` (gold label) → **"Contact NDR Smart Spaces."**
  → "Corporate offices, investor relations, media contacts, ESG inquiries,
  and business development."
- Hero edition/date meta row dropped.

### Section 01 — Office Directory (`OfficeDirectory`)
- Five entries: **Corporate Office**, **Registered Office**, **Investor
  Relations**, **Business Development**, **Media Contact** — each with address,
  phone, email and office hours, plus directions on the corporate entry.
- Per-entry reference codes, classifications and status badges removed; each
  row now reads `kind / name / address` on the left and a ruled contact block
  (Phone · Email · Hours · Directions) on the right.

### Section 02 — Business Enquiry (`Correspondence` + `CorrespondenceForm`)
- Renamed from "Correspondence form" to **Business Enquiry**.
- Fields: Name, Company, Work email, Phone (new, optional, `type="tel"`),
  Enquiry type, Message. Submit CTA: **"Send Inquiry"**.
- Intake header (`CO-F-01 · Incoming correspondence`) removed; live
  "Routes to …" indicator retained; response-time strip added to the intro.
- Phone is validated against a loose pattern only when populated.

### Section 03 — Office Locations (`ContactMap`)
- Atlas plate kept; coordinates/projection metadata panel and the register
  code line removed; locator simplified to `name — place, region` + coords.
- Caption now points to the office directory for the registered/regional
  offices; a **"Get directions"** link added under the plate.

### Section 04 — Contact the Right Team (`InquiryRouting`)
- Heading changed to **"Contact the right team."**; each desk now carries
  purpose, coverage, note, email, phone and response expectation
  ("Within 2 business days"). Desk reference codes removed.

### Closing (`ContactClosing`)
- Restrained charcoal close: gold rule → "Contact" → **"Contact NDR Smart
  Spaces."** → "Business, investor, media, and partnership inquiries."
- Colophon, provenance footnote and meta rows removed; primary CTA now points
  to `#business-enquiry`.

### Validation
`contactValidation.ts` updated to the new shape — office keys unique, every
office has phone/hours/valid email, routing keys unique, every desk has
recipient/phone/response, map markers within the viewbox. Dev-only, fails
loud, never in production.

---

## 2. Header logo enlargement

- Lockup: 175×40 → **190×43** (`LogoWordmark.tsx`), CSS now `width: 11.875rem;
  height: auto` (`LogoWordmark.module.css`).
- Single-row masthead kept; current header height unchanged; the shorter
  "Contact" nav label frees the horizontal room the wider lockup needs, so no
  gap rebalancing was required.

> Note: the brief said "+30%", but the stated absolute target (185–195 px)
> was taken as authoritative — 175 → 190 px is ~+8.6%. If a true +30%
> (~228 px) is wanted, say so and it can be sized up again.

---

## 3. Homepage readability pass

- `--font-body-size: 1rem → 1.0625rem`, `--leading-body: 1.6 → 1.7`
  (global tokens; applies to body copy site-wide).
- New `--color-ink-muted: #5f5a54` — darker secondary text for light
  backgrounds (~5:1 contrast on ivory vs ~3.9:1 for the old stone).
  `Body` (`Body.module.css`) and the journey captions now use it.
- `JourneyTimeline`: titles bumped to semibold (600, new token) at body size,
  captions enlarged 0.875 → 0.9375rem with darker ink and longer line-height,
  and more event spacing (item gap `space-xs → space-sm`, column gap up,
  stacked row-gap up).

---

## 4. Mega-menu featured overview rows

- `NavMenu` gains `overview: { label, tagline, href }`.
  - Business → **Business Overview / The Operating Manual** → `/en/business`
  - Investor → **Investor Overview / The Financial Statement**
    → `/en/investor-centre`
- `MegaMenuButton` renders the overview above the columns, separated by a
  hairline divider; the overview uses display serif at 1.5rem, maroon
  uppercase tagline and a subtle gold underline on hover/focus/active.
- Keyboard/AX behaviour unchanged (panel still driven by the `open` class and
  `aria-expanded`).

---

## Accessibility & CMS notes

- All Contact V2 content is data-driven (`contact.ts`): office records,
  phone/hours, enquiry categories, routing desks, map markers/captions,
  navigation labels, page metadata. No hardcoded copy added.
- Form inputs keep programmatic labels, `aria-invalid`/`aria-describedby`
  error wiring, `role="alert"` errors, `role="status"` success and
  `role="note"` routing hint; new optional marker added for the phone field.
- Larger body type + darker secondary ink improve contrast and reading
  comfort; `prefers-reduced-motion` handling retained.

### Content follow-ups (client-confirm)
- Phone numbers and office hours are **draft placeholders** (`+91 44 4296 12xx`,
  Mon–Sat 9:30–18:30 IST), flagged in the directory note and pending client
  confirmation before go-live — per agreed approach.
- Registered-office address/CIN, and `media@ndrsmart.com` were NOT invented;
  media/investor entries reuse the approved `compliance@ndrsmart.com`.
- `docs/media-contact-v15-refinement.md` still references the removed
  `CONTACT_PUBLICATION` export — historical doc, may be updated separately.

## Verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npx prettier --check` (touched files) | pass |
| `npm run build` | pass — 24 routes, all SSG |
| Dev smoke test | `/en/contact` + `/en` render; new copy present, old documentary copy absent; overview rows + 190 px lockup in header |
