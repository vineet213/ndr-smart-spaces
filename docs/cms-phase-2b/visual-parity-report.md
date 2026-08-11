# Phase 2B — Visual Parity Report: Homepage & Navigation Integration

- Generated: 2026-08-11
- Scope: `src/lib/data/homepage.ts` + `src/lib/data/navigation.ts` now derive from the CMS-generated modules (`src/lib/data/generated/*`) seeded from `.cms-store/content.json`.
- Verdict: **PASS — zero unintended visual differences.**

## Method

The baseline is the last pre-integration static export (`out/`, built 10 Aug 02:57) snapshotted to
`%TEMP%\opencode\out-baseline`. After the integration edits the site was rebuilt with `npm run build`
(`next.config.ts` → `output: "export"`, `trailingSlash: true`) and every HTML page was compared against
the baseline.

Because Next.js re-fingerprints the bundle on every build, the comparison normalizes build-only
fingerprints before diffing:

| Fingerprint | Normalized to |
| --- | --- |
| `/_next/static/chunks/<hash>.js` / `.css` | `/_next/static/chunks/CHUNK.js` / `.css` |
| `/_next/static/media/<hash>.` | `/_next/static/media/CHUNK.` |
| `/_next/static/css/<hash>.` | `/_next/static/css/CHUNK.` |
| `/_next/static/<hash>/<hash>.js` / `.css` | `/_next/static/FH.CHUNK.js` / `.css` |
| RSC build id (`"b":"<buildId>"`, escaped-quote variants) | `"b":"BUILD_ID"` |
| `/icon.svg?icon=<hash>.svg` | `/icon.svg?icon=HASH.svg` |

## Result

| Metric | Value |
| --- | --- |
| HTML pages compared | 24 |
| Byte-identical after normalization | 24 |
| Differences | 0 |
| Missing / extra pages | 0 |

## Checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Navigation visually identical | Nav items rendered — "About Us", "Business Verticals" mega menu, "Investor Centre" mega menu present in `out/en/index.html`; `integration.navigation` parity check PASS | PASS |
| Homepage metrics identical | Hero renders `60+` with labels "Years of industrial experience", "Fortune Global 500 companies served", "Portfolio occupancy"; `integration.homepage.hero` parity check PASS (M1 60+ · M5 100+ · M3 98%) | PASS |
| Homepage map markers identical | Markers render — "Headquarters", "Kochi", "Kanpur" present; `integration.homepage.map` parity check PASS (homepage-visible locations, Chennai aliased to Headquarters) | PASS |
| Business highlight links identical | Proof strings "99% greenfield", "100%-owned project management arm", "Trusted plotted development" present; `integration.homepage.verticals` parity check PASS (Ave Acres external) | PASS |
| Footer identical | "Announcements", "Website Sitemap", "© 2026 NDR Smart Spaces Pvt. Ltd." present; `integration.homepage.footer` parity check PASS | PASS |
| No new sections | `esg-teaser` occurrences 0, `latest-updates` occurrences 0 in `out/en/index.html`; `integration.homepage.no-new-sections` parity check PASS (`esg` null, `latestUpdates` empty) | PASS |

## Supporting verification

- `npm run seed:cms` — PASS: 79 records across 14 collections; "generated exports byte-identical: true".
- `npm run verify:parity` — PASS: 371 checks, 0 failed, 0 unintended (see
  `docs/cms-phase-2a/parity-report.md`). Six new `integration` layer checks assert the runtime modules
  derive from the generated CMS modules byte-for-byte.
- Typechecks: `npx tsc --noEmit` (app) and `npx tsc -p scripts/tsconfig.cms.json` (cms) both PASS.

## Conclusion

Homepage and navigation integration introduces zero unintended visual differences. The next milestones
(Contact, Media, Portfolio, Business, Investor Centre, ESG) each get their own unchecked integration +
visual parity pass.

---

# Milestone 2 — Contact Page Integration

- Scope: `src/lib/data/contact.ts` now derives data from the CMS-generated modules.
- Verdict: **PASS — zero unintended visual differences.**

## Wiring

| Data | Source |
| --- | --- |
| Office directory (all five offices: key, kind, name, address lines, phone, email, hours, directions) | `generated/contactDirectory.ts` (`contact-directory` collection) |
| Map directions URL | `generated/corporateSettings.ts` → `externalLinks.googleMapsDirectionsUrl` |
| Map marker placement (x/y) | `generated/locations.ts` → `chennai-hq.contactOffset` (fallback 384/828) |
| Masthead heading, directory/form/routing copy | Frozen editorial copy (no CMS counterpart) |

Frozen presentation fields preserved: marker `id`/`name`/`place`/`region`/`lat`/`lon` (the displayed
"13.0521° N · 80.2461° E" coordinates stay byte-identical; only the projected x/y come from the CMS
contact offset), directory `eyebrow`/`heading`/`lede`/`note`, form and routing copy.

## Result

| Metric | Value |
| --- | --- |
| HTML pages compared | 24 |
| Byte-identical after normalization | 24 |
| Differences | 0 |

## Evidence (out/en/contact/index.html)

- All five office cards render: "NDR Smart Spaces Pvt. Ltd.", "Registered office", "Investor relations desk",
  "Business development desk", "Media relations desk" with phone "+91 44 4296 1200", email
  "project@ndrsmart.com", T. Nagar address and IST hours.
- Map locator renders "Corporate office — Chennai, Tamil Nadu" with coordinates and the Google Maps
  directions link.
- Form heading "Business Enquiry" and "Contact the right team." routing section present.

## Supporting verification

- `npm run verify:parity` — PASS: 371 checks, 0 failed, 0 unintended (`fidelity.directory.*` and
  `fidelity.locations.chennai-hq` confirm the derived offices and contact offset match the store).
- `npx tsc --noEmit` (app) PASS.

