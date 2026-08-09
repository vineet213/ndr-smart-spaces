# Navigation Consolidation — v1

Status: implemented · 2026 edition
Implements: [`docs/navigation-consolidation-audit.md`](./navigation-consolidation-audit.md)

## What changed

### 1. Header nav data model (`src/lib/data/navigation.ts`)

Rewritten as a single CMS-ready source of truth:

- **Home dropped from the desktop nav** — the logo mark is the home link (`/en`).
  Mobile keeps Home via a new `mobileNavItems` export (`[Home, ...navItems]`), so
  mobile users still have an explicit Home entry without the desktop duplication.
- **Full publication titles** — "ESG", "Media" and "Contact" are now "ESG &
  Sustainability", "Media & Newsroom" and "Contact & Correspondence", matching
  the operating-manual naming used on the pages and in the footer.
- **Business menu** — one "Business Verticals" column. "Business Overview" and
  "Asset Portfolio" rows are gone. Vertical routes point at on-page anchors
  (`/en/business#grade-a-warehousing`, `#ndr-asset-management`, `#capital`),
  Ave Acres remains external.
- **Investor Centre menu** — two columns ("Investor Centre" + "Governance")
  covering the six live sub-routes. "Investor Overview" duplicate removed.
- **Single CTA** — `headerCta` now exposes only `enquiry` ("Business Enquiry" →
  `/en/contact#business-enquiry`). `headerCta.investor` removed everywhere.
- `utilityStrip`, `mobileMenuFooter`, `siteHome`, `isActivePath` unchanged in
  shape (the pre-existing "Correspondence" footer shape is preserved).

### 2. Header components

- **`CtaArea`** — renders the enquiry button only; the Investor Centre text link
  is removed (`CtaArea.module.css` drops the `.investor` rule).
- **`MegaMenuButton`** — the trigger is now a real `<a href={menu.href}>`
  pointing at the publication root, so the top-level item navigates (matching
  the audit's assumption). The panel only surfaces child links. Keyboard:
  ArrowDown opens the panel, Enter navigates, Escape closes and refocuses.
- **`MainNav.module.css`** — nav gap tightened `space-xl` → `space-lg` to fit
  full titles.
- **`Header.module.css`** — the nav bar row is now self-contained and widened
  to `max-width: 90rem` (was the global 80rem container) so the full titles fit
  at ≥1440 px. `Header.tsx` no longer composes the global `container` utility on
  the nav row.
- **`MobileNav`** — uses `mobileNavItems`; column groupings are preserved with
  labelled headings ("Business Verticals", "Investor Centre", "Governance")
  instead of a flat `flatMap`; external children open in a new tab; the
  redundant Investor Centre CTA link is gone. Fixed latent CSS class mismatches
  (`footerEmail`/`footerNote`/`linkIcon` were referenced but unstyled).

### 3. Vertical routes → anchors

The dead vertical sub-routes (`/en/business/grade-a-warehousing`,
`/en/business/ndr-asset-management`, `/en/business/ndr-invit`) were never pages.
All references now point at live section anchors:

- `src/lib/data/homepage.ts` — `businessHighlights` verticals →
  `#grade-a-warehousing` / `#ndr-asset-management`; partnership CTA → `#capital`.
- `src/lib/data/business.ts` — `Division` gains an optional `anchor`; divisions
  01/02 carry `anchor` + anchor-based routes. Fixed a pre-existing type gap
  (`Division.source` was used by `DivisionPlate` but missing from the type).
- `src/components/sections/DivisionPlate.tsx` — `<article id={division.anchor}>`.

### 4. Legal pages (were dead footer links)

The footer always linked `/en/privacy-policy`, `/en/terms`, `/en/disclaimer` and
`/en/sitemap` — none existed. Built:

- `src/lib/data/legal.ts` — copy for privacy policy, terms, disclaimer + sitemap groups.
- `src/components/sections/LegalDocument.tsx` (+ css) — charcoal cover + indexed sections.
- `src/components/sections/LegalSitemap.tsx` (+ css) — grouped route index.
- Pages: `app/[locale]/privacy-policy`, `terms`, `disclaimer`, `sitemap`.

### 5. Footer rewrite (`src/lib/data/homepage.ts` + `Footer.tsx`)

`sitemap` + `investor` columns replaced by four publication `groups`
(Corporate / Business / Investor / ESG & Media). Footer nav columns now carry
full titles consistent with the header. "Investor Overview" dead link removed.

### 6. Route registry + nav validation

- `src/lib/routes.ts` — single source of truth for the 19 production routes and
  every deep-linkable section anchor.
- `src/lib/navigationValidation.ts` — five rules:
  1. every internal href resolves to a known route (no 404s);
  2. every `#anchor` target exists for its route;
  3. no destination repeats within a single surface;
  4. no destination carries two labels within a single surface;
  5. every production route is reachable.
- Wired in `app/[locale]/layout.tsx` (dev-only, fails loud via `console.error`).

## Route map after consolidation

| Destination | Canonical entry |
| --- | --- |
| `/en` | Logo · mobile Home |
| `/en/about-us` | About Us (nav) |
| `/en/business` | Business (nav trigger + footer) · `#verticals`, `#grade-a-warehousing`, `#ndr-asset-management`, `#capital` |
| `/en/portfolio` | Portfolio (nav + footer) |
| `/en/investor-centre` | Investor Centre (nav trigger + footer) |
| `/en/investor-centre/investment-highlights` | Investor menu + footer |
| `/en/investor-centre/reports-disclosures` | Investor menu + footer |
| `/en/investor-centre/financial-results` | Investor menu + footer |
| `/en/investor-centre/annual-reports` | Investor menu |
| `/en/investor-centre/corporate-governance` | Investor menu |
| `/en/investor-centre/announcements` | Investor menu + footer |
| `/en/investor-centre/downloads` | Investor menu |
| `/en/esg` | ESG & Sustainability (nav + footer) |
| `/en/media` | Media & Newsroom (nav + footer) |
| `/en/contact` | Contact & Correspondence (nav + footer) · `#business-enquiry` |
| `/en/privacy-policy`, `/en/terms`, `/en/disclaimer`, `/en/sitemap` | Footer · Legal |

## Verification

- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — all 24 routes prerender (SSG)
- Dev server smoke test — `/en/` 200, `[navigation-validation]` reports nothing

## Notes

- **Header width** — the sticky nav row was widened to 90rem so the seven full
  titles fit at desktop. If titles change, re-check the fit.
- **Dev server** — stopped during verification; restart with `npm run dev`.
- `/en/demo` is excluded from `siteRoutes` (scratch route, not part of the IA).
