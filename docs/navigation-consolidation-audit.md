# Navigation Consolidation Audit

Status: **Diagnosis only** — recommendations listed, **no changes implemented**.

Scope: `src/lib/data/navigation.ts`, `src/lib/data/homepage.ts` (footer + `headerCta`), header renderers (`MainNav`, `MobileNav`, `CtaArea`, `UtilityStrip`), and every route under `app/[locale]/`.

As of the V1.6 checkpoint (ESG, Media, Contact shipped), the site has the following public routes:
`/en`, `/en/about-us`, `/en/business`, `/en/portfolio`, `/en/investor-centre` (+ 7 subpages), `/en/esg`, `/en/media`, `/en/contact`.

---

## 1. Findings

### 1.1 Dangling links — referenced routes that do not exist

| Link label                 | Target                              | Source             | Route exists? |
| -------------------------- | ----------------------------------- | ------------------ | ------------- |
| Grade A Warehousing        | `/en/business/grade-a-warehousing`  | Business mega menu | No            |
| NDR Asset Management       | `/en/business/ndr-asset-management` | Business mega menu | No            |
| The NDR InvIT relationship | `/en/business/ndr-invit`            | Business mega menu | No            |
| Privacy Policy             | `/en/privacy-policy`                | Footer legal       | No            |
| Terms & Conditions         | `/en/terms`                         | Footer legal       | No            |
| Disclaimer                 | `/en/disclaimer`                    | Footer legal       | No            |
| Website Sitemap            | `/en/sitemap`                       | Footer legal       | No            |

These render 404s today. The three Business vertical pages were the "page identities" template that never got routes; the four legal pages are a separate missing batch.

### 1.2 Multiple labels resolving to the same destination

| Destination           | Reached via                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `/en/business`        | Top-level "Business" **and** mega-menu "Business Overview"                                       |
| `/en/portfolio`       | Top-level "Portfolio" **and** mega-menu "Asset Portfolio"                                        |
| `/en/investor-centre` | Top-level "Investor Centre", header CTA "Investor Centre", **and** mega-menu "Investor Overview" |

Each of these pairs is one duplicated entry. The mega-menu "overview" rows duplicate the very top-level item that opens the menu.

### 1.3 Nav label vs. page title inconsistency

| Nav label       | Page `<title>`            |
| --------------- | ------------------------- |
| ESG             | ESG & Sustainability      |
| Media           | Media & Newsroom          |
| Contact         | Contact & Correspondence  |
| Investor Centre | Investor Centre (matches) |
| Business        | Business (matches)        |
| Portfolio       | Portfolio (matches)       |

Three labels are shortened in nav. This is defensible for a tight nav, but the mismatch should be a deliberate, documented choice — or the nav labels should match.

### 1.4 Mega-menu column structure

Both menus lead with a column whose heading duplicates the top-level label:

- **Business**: columns "Business" + "Business Verticals". The "Business" column carries the cross-navigation "Asset Portfolio" link (conceptually a Portfolio item) beside "Business Overview".
- **Investor Centre**: columns "Investor Centre" + "Governance". The "Investor Centre" column begins with "Investor Overview" (duplicate of the top-level link).

The two menus are otherwise structurally parallel (2 columns, 4 links each in Investor; 2 + 2 in Business).

### 1.5 Mobile flattening

`MobileNav` flattens `item.columns[].links` via `flatMap` — column headings are dropped and all children render flat under the top-level item. Grouping context ("Verticals", "Governance") is lost on mobile, and the mobile list for Investor Centre becomes an unlabeled run of 8 items. Same duplicates as 1.2 appear (Investor Overview, Asset Portfolio).

### 1.6 Anchor targets — now valid

- `headerCta.enquiry` → `/en/contact#business-enquiry`. The new Contact page's Correspondence section is `id="business-enquiry"`, so this anchor now resolves correctly.
- `esgClosing.enquiry`, `mediaClosing.enquiry`, `contactClosing.enquiry`, `portfolioClosing` all point at the same `/en/contact#business-enquiry` target. Consistent.

### 1.7 Email duplication across surfaces

`compliance@ndrsmart.com` appears in: `utilityStrip.email`, `MobileNav` footer (`mobileMenuFooter.emails`), `homepage.footer.contact.emails`, PressContact desk, Contact routing. `project@ndrsmart.com` appears in `mobileMenuFooter`, footer, Contact routing, PressContact business line. Not a defect, but every new page keeps restating the same two addresses from its own data file (homepage.ts `contact`, contact.ts, media.ts) — a single `contactInfo` source would prevent drift.

---

## 2. Recommended fixes (not yet applied)

Priority P0 (broken) → P3 (polish).

1. **P0 — Resolve dangling routes.** Either create the three Business vertical pages (`grade-a-warehousing`, `ndr-asset-management`, `ndr-invit`) as the "page identities" templates promised in V1.x, or remove them from the mega menu until they exist. Do the same for the four footer legal routes (`privacy-policy`, `terms`, `disclaimer`, `sitemap`): create stubs or drop from footer.
2. **P1 — De-duplicate overview rows.** Drop "Business Overview" and "Investor Overview" from their mega menus (the top-level item already targets those routes). Reconsider "Asset Portfolio" in the Business menu: either move it under Portfolio semantics or rename to "Portfolio Catalogue" to stop implying it lives under Business.
3. **P1 — Decide the header CTA.** `headerCta.investor` duplicates the top-level "Investor Centre". Either drop the top-level nav item when CTA is present, or keep one canonical entry. Keep "Business Enquiry" (anchor-based, unique).
4. **P2 — Normalise labels.** Choose one convention: nav labels match page titles verbatim ("ESG & Sustainability", "Media & Newsroom", "Contact & Correspondence") or a documented short-form policy. If short-form is kept, add it to the Page Identity Guide so it is a decision, not an accident.
5. **P2 — Preserve column grouping on mobile.** Render column headings in `MobileNav` (nested sub-lists) instead of flat-mapping, so "Verticals" / "Governance" grouping survives on small screens.
6. **P3 — Single correspondence source.** Centralise `compliance@` / `project@` / the Chennai address in one data module and have homepage, Contact page, Media press contact, and header/footer all import from it.

## 3. What NOT to do

- Do not restructure nav labels/routes before pages exist (see P0) — the nav is the sitemap today.
- Do not merge Business and Portfolio into a single mega menu; they are distinct top-level publications per the Page Identity Guide.
- Do not introduce a hamburger-only desktop nav; `MainNav` + `MegaMenuButton` is the approved desktop pattern.
