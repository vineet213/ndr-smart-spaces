# NDR Smart Spaces — Homepage Visual Specification

**Production-grade visual spec · for Figma build-out**
Creative Director · derives exclusively from: Homepage Blueprint v2 · Design Direction v2 · client documents · corporate deck · existing sites · logo & brand colours

Version 2.1 · Status: ready for Figma · Frames: Desktop 1440 × 900 · Tablet 768 × 1024 · Mobile 390 × 844

---

## 0. Global system (applies to every section)

### 0.1 Canvas & grid
- **Desktop frame** 1440 × 900. Content container max-width **1280 px**, centered. 12-column grid, **gutter 24**, side margin 80.
- **Tablet frame** 768 × 1024. 12-column grid, **gutter 20**, side margin 24.
- **Mobile frame** 390 × 844. **4-column** grid, **gutter 16**, side margin 20.
- **Section padding:** 112 px top/bottom (desktop), 72 (tablet), 56 (mobile). Hero and dark bands may use 120.
- **Baseline:** every vertical measurement lands on an 8 px step.
- **Hairline discipline:** 1 px rules separate bands. Grid is drawn with rules, not boxes.

### 0.2 Type scale (desktop / tablet / mobile) — Fraunces display + Inter body

| Role | Font | Size (d/t/m) | Weight | Leading | Tracking |
|---|---|---|---|---|---|
| Hero display | Fraunces | 88 / 64 / 40 | 500 | 1.0 | −0.01em |
| Section H2 | Fraunces | 56 / 44 / 32 | 500 | 1.05 | 0 |
| Sub-head H3 | Fraunces | 28 / 24 / 21 | 400 | 1.2 | 0 |
| Lede | Inter | 20 / 18 / 17 | 400 | 1.55 | 0 |
| Body | Inter | 16 | 400 | 1.6 | 0 |
| Small | Inter | 14 | 400 | 1.5 | 0 |
| Meta / label | Inter | 12 | 500 | 1.4 | +0.12em, UPPERCASE |
| Metric (display number) | Fraunces | 64–80 hero · 44 section | 500 | 1.0 | 0 |
| Button | Inter | 14 | 500 | 1 | +0.06em, UPPERCASE |
| Nav item | Inter | 15 | 500 | 1 | 0 |

- Measure: body ≤ 65 ch · lede ≤ 70 ch · display ≤ 12 words per line on desktop.

### 0.3 Colour roles (tokens from Design Direction v2 §3.8)
- maroon `#A0353A` · deep maroon `#7C282E` · dark maroon `#5A1E22` · gold `#F0B65A` · gold-light `#F5C97F`
- ivory `#FAF7F2` · ivory-dim `#F2EDE4` · charcoal `#1C1A19` · stone `#8A857D`
- hairline-light `#E4DED3` · hairline-dark `#3A3134`
- **Budget:** ivory majority · maroon ≤ ~15–20% per screen · gold ≤ ~6%, never body text on ivory.

### 0.4 Components primitives
- **Primary button:** h48, px28, radius **2 px**, bg maroon, text ivory 14/500 uppercase, border 1 px gold @30%; hover = deep maroon + gold @100%; active = dark maroon.
- **Secondary button:** h48, radius 2, transparent, border 1 px (charcoal on light / ivory on dark); hover = maroon fill.
- **Text link:** 14/500 uppercase, maroon text, gold 2 px underline on hover.
- **Focus ring:** 2 px gold outline, 2 px offset, visible on all interactive elements.
- **Cards:** radius 2 px, hairline border, padding 32, no shadow on light (soft warm `0 8 16 0.06` on dark only).
- **Eyebrow:** 12/500 uppercase +0.12em; gold on dark surfaces, maroon on ivory.

### 0.5 Imagery grade (global)
- Warm grade: +4 temperature, +5 contrast; shadows split-toned toward maroon-black `#1C1012`; highlights warmed toward ivory.
- One grade for the entire library — portfolio reads as one institution.
- Formats: WebP + LQIP blur placeholder → fade 400 ms on load.

### 0.6 Motion tokens
- One curve `cubic-bezier(0.22, 1, 0.36, 1)` · durations 150 / 400 / 800 ms · reveal = fade + 20 px rise, stagger ≤ 80–120 ms · counters 800–1200 ms ease-out · `prefers-reduced-motion` → all instant.

### 0.7 Global accessibility baseline
- Skip-to-content link first in DOM. Landmarks: header/nav/main/footer.
- AA contrast everywhere; focus-visible gold rings; 48 px tap targets.
- Form labels visible (never placeholder-only). Megamenu & mobile menu ARIA-expanded + ESC close.
- Map = `role="img"` + accessible text list of locations. Timeline captions always visible.
- `prefers-reduced-motion`: no pulse, no counter, no reveal.

---

## 1. HERO — three concepts

### Concept A — "The Institutional Ledger" (Editorial / Blackstone)

**Layout:** No full-bleed photo. Ivory field, editorial two-column: left column (7/12) carries eyebrow → Fraunces headline at 88 px in charcoal, with "listed assets." set in maroon. Right column (4/12, offset) is a **ledger panel**: three metrics stacked as hairline-divided rows (Fraunces 64 maroon + small-cap labels + source footnotes). A single horizontal gold hairline sits above the headline. Subhead + CTAs on the left baseline. Optional 4:5 "plate" photograph (hairline-framed) tucked bottom-right.

- **Height:** 720 px. **Grid:** 12 col, asymmetric 7/4. **Alignment:** top-aligned, baseline-anchored CTAs.
- **Spacing:** container padding 112; columns 80 apart; ledger rows 32.
- **Typography:** hero 88/500; lede 20; metric 64/500.
- **Colour:** ivory field, charcoal type, maroon accent phrase, gold hairline + eyebrows. No overlay.
- **Image:** optional small plate 4:5, hairline frame 1 px hairline-light, warm grade.
- **Motion:** type lines mask-reveal; metrics ledger rows fade up; no image motion.
- **Loading:** LQIP on plate; counters JS-off show final.
- **Accessibility:** full contrast on ivory (AA naturally); no contrast risk.
- **Pro:** purest institutional calm; zero dependency on pending photography; impossible to mistake for the consumer legacy site.
- **Con:** least "premium property" glamour; relies entirely on typography; risk of reading cold.

### Concept B — "The Monument" (Brookfield cinematic, full-bleed)

**Layout:** Full-bleed 16:9 industrial photograph (aerial park at golden hour / warehouse interior with natural light). Deep maroon overlay gradient `linear-gradient(90deg, rgba(90,30,34,0.92) 0%, rgba(90,30,34,0.55) 55%, rgba(90,30,34,0.25) 100%)`. Masthead eyebrow top-left (issue-style): `NDR SMART SPACES — CORPORATE PLATFORM · EST. 1954`. Headline left-aligned at 2/3 width, ivory. Subhead ivory @85%. CTAs bottom-left: primary gold-on-maroon + secondary outline ivory. Bottom: floating **stat band** (ivory translucent `#FAF7F2 @ 96%`, gold top hairline, 3 metrics, hairline dividers) at container width.

- **Height:** 800 px (min 80 vh). **Grid:** 12 col; type on left 8/12; stat band full 12.
- **Spacing:** inner type stack top 120; stat band bottom 48; metrics 32 apart.
- **Typography:** hero 88/500 ivory; metric 64/500 maroon on ivory band; labels 12/500 uppercase.
- **Colour:** maroon overlay + gold accents on ivory band; gold = primary CTA.
- **Image:** 16:9 → 21:9 on ultrawide; 4:5 mobile crop. LQIP blur. Overlay must hold type at all widths.
- **Motion:** single slow image reveal (scale 1.00→1.03, 3 s, once); type lines mask-reveal 80 ms stagger; counters ≤800 ms.
- **Loading:** LQIP → crisp 400 ms; **fallback:** if photography pending, image slot renders an abstract maroon architectural field (grid lines + oversized ghost geometry from the logo motif) — layout identical, no launch blocker.
- **Accessibility:** overlay guarantees ivory-on-maroon contrast (≥6.8:1); stat band ivory/maroon AA.
- **Pro:** instant, non-verbal proof of the asset class; matches the client's confirmed "hero + portfolio, inspo from InvIT website"; communicates Scale + Infrastructure Expertise on first glance; fallback is fully typographic.
- **Con:** depends on art-directed photography; overlay can muddy ungraded images (mitigated by global grade + fallback).

### Concept C — "The Infrastructure Magazine" (premium editorial cover)

**Layout:** Split screen — left 60% charcoal `#1C1A19` field; right 40% duotone photograph (maroon-tinted loading dock, 4:3). Masthead top: eyebrow + "issue" meta line. Oversized Fraunces headline on charcoal with "listed assets." in **gold**. A vertical 2 px gold rule separates the two halves. Pull-quote caption in the photo corner. Stats as a bottom footline: one horizontal row, hairline-divided, Fraunces 44 gold on charcoal. CTAs: gold primary + ivory outline on charcoal.

- **Height:** 760 px. **Grid:** 6/6 split. **Spacing:** type stack 96; footline bottom 48.
- **Typography:** hero 88/500 ivory+gold on charcoal; footline metrics 44/500 gold.
- **Colour:** charcoal dominant, gold signal (≤6%), duotone image.
- **Image:** duotone grade (maroon-shadows/ivory-highlights) — forgiving of uneven source photography.
- **Motion:** masthead drops in; headline mask; footline counters; no image motion.
- **Accessibility:** gold on charcoal ≥5.5:1 (large text OK); duotone photo contrast checked.
- **Pro:** most distinctive; premium-magazine energy; typographic identity is memorable; duotone forgives photography.
- **Con:** darkest register; edges toward lifestyle not infrastructure; most bespoke to build; risks looking "designed" rather than "institutional."

### Comparison

| Criterion | A Ledger | B Monument | C Magazine |
|---|---|---|---|
| Matches client's confirmed "hero + portfolio, InvIT inspo" | ✗ | ✓ | ~ |
| Communicates Scale instantly | ~ | ✓ | ~ |
| Institutional calm / annual-report register | ✓ | ✓ | ~ |
| Independent of pending photography | ✓ | ✓ (fallback) | ✓ |
| Premium / distinctive | ~ | ✓ | ✓ |
| Fits photography direction (real assets, warm grade) | ~ | ✓ | ~ |
| Launch risk | low | low | low |

### Decision — **Concept B, "The Monument."**
Why: it is the only concept that satisfies the client's own confirmation verbatim ("Hero Banner and portfolio to be shown — inspo from InvIT website"); it uses the photography direction to do the proving the audience needs (Scale, Infrastructure Expertise) at the exact moment of first impression; and it is the *only* concept that merges all three signatures — the **masthead eyebrow from C**, the **hairline-ledger stat band from A** (laid horizontally), and Brookfield's cinematic overlay. Its fallback field is typographic, so launch is never blocked by pending imagery. Concept A remains the specified treatment for *About Us* page headers (full typographic ledger, no photo) — the concept is not discarded, it is reassigned.

---

## 2. SECTION SPECS (A1–A9, B1–B4)

### A1 · Header — Utility strip + Navigation

- **Height:** 32 (utility) + 72 (nav) = 104 total · compresses to 56 on scroll (utility scrolls away).
- **Grid/alignment:** utility = full-width bar, content at 1280, flex row, left = entity line, right = links. Nav = logo left, nav center-right, CTAs far right, vertically centered.
- **Spacing:** nav item gutter 36; CTA gap 16; logo height 32 (locked aspect).
- **Typography:** utility 12/500 uppercase · nav 15/500 · CTA 14/500 uppercase.
- **Colour:** utility bg dark maroon `#5A1E22`, text ivory 70% / gold links; nav bg ivory @98% → charcoal on scroll; nav text charcoal, active = maroon + 2 px gold underline; logo in brand maroon/gold (SVG only).
- **Buttons:** right = ghost `Investor Centre` (maroon text, gold underline hover) + solid `Business Enquiry` (maroon, ivory text, gold hairline border).
- **Dividers:** 1 px hairline-light under nav; utility separated by 1 px hairline-dark from nav.
- **Interaction:** megamenu on Business + Investor Centre (150 ms hover delay); ARIA-expanded; ESC closes; scroll = shrink + solid bg.
- **Hover:** nav item → text shifts maroon; underline grows gold 2 px (left→right, 300 ms).
- **Loading:** none (static header); active route highlighted from page metadata.
- **Responsive:** 768 → nav collapses to hamburger (48 px target), CTA `Business Enquiry` stays in bar; 390 → same, CTAs move into the menu panel.
- **Accessibility:** landmarks, 48 px targets, focus rings, skip-link target.

### A2 · Hero — "From land to listed assets." (Concept B)

- **Height:** 800 px desktop (min 80 vh) · 640 tablet · 560 mobile.
- **Grid/alignment:** 12 col; masthead eyebrow top-left; headline + subhead left-aligned 8/12; CTAs left; stat band anchored bottom, full 12 width.
- **Spacing:** container padding 120; eyebrow→headline 24; headline→subhead 32; subhead→CTAs 40; CTA row→stat band 64; stat band height 120, metrics 32 apart.
- **Typography:** eyebrow 12/500 uppercase gold; hero 88/500 ivory; subhead 20/400 ivory@85%; metrics 64/500 maroon; labels 12/500 uppercase stone.
- **Colour:** full-bleed image + maroon gradient (per §1 Concept B); stat band ivory 96% + gold top hairline 2 px; gold = primary CTA only.
- **Image:** 16:9, warm grade, LQIP; fallback = abstract maroon architectural field if pending.
- **Buttons:** primary `Explore Our Business Verticals` gold fill / deep-maroon text; secondary `Investor Centre` outline ivory; one primary CTA.
- **Dividers:** gold top hairline on stat band; hairline-light dividers between metrics.
- **Interaction:** stats count up once ≤800 ms on load; scroll cue (gold chevron, fades out by 8% scroll).
- **Hover:** primary → gold-light; secondary → maroon fill 40% overlay.
- **Loading:** LQIP → crisp 400 ms; counters JS-off = final values; fallback field swaps in if image missing.
- **Responsive:** 390 → headline 40, subhead 17, stat band = horizontal scroll-snap chips (4/col), CTAs stack full-width, overlay darkened +20%.
- **Accessibility:** ivory-on-maroon ≥6.8:1; aria-live on counter region; no autoplay motion.

### A3 · Audience strip

- **Height:** 112 desktop · 96 tablet · auto (2×2) mobile.
- **Grid/alignment:** 4 equal columns (12/4) on a slim ivory band; each route = label + one-line descriptor + arrow.
- **Spacing:** column padding 24; divider between columns; band on 8 px ivory-dim strip.
- **Typography:** route label 15/500 maroon; descriptor 14/400 stone; arrow glyph 16.
- **Colour:** ivory field, hairline-light dividers; label maroon, arrow gold on hover.
- **Dividers:** vertical 1 px hairline-light between the 4 columns; 1 px hairline-light top and bottom of band.
- **Interaction:** whole column clickable; hover → label shifts deep maroon, gold arrow slides +8 px right.
- **Hover:** as above, 300 ms.
- **Loading:** static; active routes from IA.
- **Responsive:** 768 → 2×2 grid of full-width tap cards; 390 → same, 44 px rows; descriptors truncated to one line.
- **Accessibility:** 4 links with clear labels; 48 px targets; focus ring gold.

### A4 · Portfolio presence (client-confirmed) [PENDING imagery]

- **Height:** 640 desktop · 560 tablet · 480 mobile.
- **Grid/alignment:** two-zone: left 5/12 = heading + intro + zone facts stack; right 7/12 = India map (SVG) vertically centered. Zone facts = 4 stacked rows.
- **Spacing:** section padding 112; map inset 48; fact rows 28 apart.
- **Typography:** H2 56/500 charcoal; intro lede 20/400; zone fact label 12/500 uppercase maroon + fact 16/400.
- **Colour:** ivory field; map lines hairline-light, locator dots gold (pulse), selected zone maroon; `View Portfolio →` gold arrow.
- **Image/map:** SVG India, 1:1 viewBox, 1.5 px strokes; dots 8 px gold with 16 px soft glow.
- **Buttons:** text link `View Portfolio →` under facts (maroon, gold arrow).
- **Dividers:** hairline-light between zone facts; gold top hairline on section eyebrow.
- **Interaction:** hover dot → tooltip (name, zone, one line); zone fact hover → highlights matching dots on map; mobile = zone tap-cards replacing map.
- **Hover:** dot scales 1.5; fact row underline gold.
- **Loading:** map renders static (no data fetch); dots fade in stagger 60 ms; skeleton not required (SVG inline).
- **Responsive:** 768 → map below facts (stacked); 390 → zone tap-cards (4×1), map hidden.
- **Accessibility:** `role="img"` aria-label on map + text location list; tooltips keyboard-reachable; dot pulse off under reduced motion.

### A5 · Company Overview + Journey line

- **Height:** overview block 480 + journey 240 = 720 desktop.
- **Grid/alignment:** editorial 7/5 split: left 7 = eyebrow + H2 + lede + body + link; right 5 = legacy plate (3:2 image or founder portrait treatment). Journey = full-width band below.
- **Spacing:** padding 112; columns 80 apart; journey nodes 96 apart.
- **Typography:** H2 56/500; lede 20/400; body 16/400 stone; journey years 28/500 maroon (Fraunces); node captions 14/400.
- **Colour:** ivory field; gold eyebrow hairline; journey hairline-light line with gold node dots 10 px; hover caption → deep maroon.
- **Image:** right plate 3:2, warm grade, hairline frame 1 px; LQIP.
- **Buttons:** text link `Our journey →` (maroon, gold arrow).
- **Dividers:** gold top hairline above H2; hairline-light beneath body before link.
- **Interaction:** journey draws left→right on scroll (stroke, 900 ms); nodes pop 50 ms stagger; captions always visible.
- **Hover:** plate scale 1.02 (800 ms); link arrow slides.
- **Loading:** LQIP plate; journey static if JS off.
- **Responsive:** 768 → single column, plate below text; journey becomes vertical left-rail timeline (gold markers); 390 → same, years 24.
- **Accessibility:** timeline = `<ol>` list; captions not hover-dependent; contrast AA on ivory.

### A6 · Business Highlights — 3 verticals + partnership band

- **Height:** verticals 560 + partnership 200 = 760 desktop.
- **Grid/alignment:** dark maroon band; eyebrow + H2 ivory top-left; 3 cards in 12/4 row (gutter 24); partnership band full-width beneath with its own inner container.
- **Spacing:** section padding 112; cards 24 apart; card inner padding 32; partnership padding 56.
- **Typography:** H2 56/500 ivory; card eyebrow 12/500 uppercase gold; card title 28/500 ivory; card body 16/400 ivory@80%; proof line 14/500 gold; partnership title 32/500 ivory; partnership line 18/400 ivory@85%.
- **Colour:** band dark maroon `#5A1E22`; card bg deep maroon `#7C282E`; card border 1 px hairline-dark `#3A3134` + gold top rule 3 px on hover; proof line gold; partnership band = charcoal `#1C1A19` (band-break colour shift); CTA gold.
- **Cards:** 400 px wide (12/4), height auto ~380, radius 2, padding 32, no shadow (dark surface uses soft warm `0 8 16 0.06`).
- **Buttons:** partnership CTA `The capital model →` gold fill/deep-maroon text (primary on dark).
- **Dividers:** gold hairline above eyebrow; 1 px hairline-dark between partnership band and cards.
- **Interaction:** card hover → gold top rule 3 px, border → gold@40%, 2 px lift (300 ms).
- **Hover:** as above; numbered eyebrow 01–03 shifts to gold-light.
- **Loading:** cards fade-up stagger 80 ms.
- **Responsive:** 768 → cards stack (1 col, full-width, taller); partnership band padding 48; 390 → same, proof line full-width.
- **Accessibility:** ivory-on-dark-maroon ≥6.8:1; gold-on-maroon for large labels OK; links keyboard reachable.

### B1 · Investment Highlights — capital cycle + investor proof

- **Height:** 640 desktop (cycle left, proof right) + resilience strip 96 = 736.
- **Grid/alignment:** ivory field; left 6/12 = H2 + capital-cycle diagram (SVG 1:1, 4 nodes circular); right 6/12 = investor proof list (hairline rows) + 3 resilience chips.
- **Spacing:** padding 112; proof rows 28; chips 16 apart; diagram inset 48.
- **Typography:** H2 56/500; diagram node 20/500 maroon + 14/400 stone captions; proof item name 18/500 charcoal + value 16/400 stone; chip 14/500.
- **Colour:** diagram line-art = hairline charcoal; cycle arc maroon 2 px; nodes gold 12 px; proof dividers hairline-light; chips ivory-dim bg + maroon text.
- **Cards/chips:** chip h40, px16, radius 2, bg ivory-dim, text maroon, 1 px hairline-light border.
- **Buttons:** text link `Investor Centre →` (maroon, gold arrow).
- **Dividers:** hairline-light between proof rows; gold hairline above H2.
- **Interaction:** cycle draws (stroke 1.4 s once); node hover → caption panel; proof rows hover → bg ivory-dim 40%.
- **Hover:** as above.
- **Loading:** diagram static if JS off; counters (if any) final values.
- **Responsive:** 768 → stack: diagram above proof; cycle stays SVG 1:1; 390 → cycle becomes vertical stepper (4 rows, gold markers).
- **Accessibility:** diagram = text-ordered list for SR; ROFO expanded inline on first use; chips not hover-dependent.

### A7 · Featured Projects — 1 cinematic + 1 compact + 1 reserved [PENDING imagery]

- **Height:** primary 640 + compact 360 + slot 0 = 1000 desktop (slot expands on data).
- **Grid/alignment:** Primary = full-bleed 16:9 cinematic feature: image right 7/12, text left 5/12 on ivory; fact grid 2×2 beneath text. Compact = image left 4/12 (4:3), text right 8/12. Reserved slot = 1/3 ghost tile, only when data exists.
- **Spacing:** padding 112; primary text block 48 from edge; fact grid 24; compact padding 56.
- **Typography:** section H2 56/500; project eyebrow `FEATURED · 01` 12/500 gold; project title 44/500 charcoal; narrative 16/400 stone; fact value 44/500 maroon + fact label 12/500 uppercase.
- **Colour:** ivory field; eyebrow gold; fact values maroon; compact title 28/500; reserved slot = dashed hairline-light border + "Pipeline" label stone (only when data present).
- **Images:** primary 16:9 warm grade + subtle maroon vignette; compact 4:3; hover scale 1.03 (800 ms).
- **Cards/facts:** 2×2 grid, hairline-light dividers, no card chrome — "ledger facts."
- **Buttons:** primary → text link `Explore the portfolio →`; compact → `Project details →`.
- **Dividers:** gold hairline above section eyebrow; hairline-light between fact cells.
- **Interaction:** image scale on hover; fact counters count once in view; reserved slot inactive until data.
- **Hover:** image 1.03; link arrow slide.
- **Loading:** LQIP all imagery; counters final if JS off; reserved slot hidden at launch (conditional-render rule).
- **Responsive:** 768 → single column, image first, fact grid 2×2; 390 → fact grid becomes 4×1 stacked blocks; compact full-width.
- **Accessibility:** alt text per project; fact grid semantic; contrast AA; focus rings on links.

### B2 · Marquee Clients

- **Height:** 200 desktop.
- **Grid/alignment:** ivory-dim band; one-line claim left 4/12; logo grid right 8/12 = 4 rows × 4 cols (16 logos), static, centered.
- **Spacing:** padding 56; logo cells 32 apart; logos max-height 40, grayscale.
- **Typography:** claim 18/500 charcoal + sub-line 14/400 stone.
- **Colour:** logos grayscale @65% opacity → full charcoal on hover; claim maroon on "100+ Fortune Global 500".
- **Dividers:** hairline-light top/bottom of band.
- **Interaction:** static grid (NO marquee); hover → logo to 100% opacity.
- **Hover:** opacity + 300 ms.
- **Loading:** logos as inline SVG/PNG, lazy-loaded below fold.
- **Responsive:** 390 → 2 cols; logos 70% opacity; claim above grid.
- **Accessibility:** logos decorative (`alt=""`), claim text carries the message.

### B3 · ESG & Governance [PENDING]

- **Height:** 360 desktop.
- **Grid/alignment:** dark charcoal band; left 5/12 = statement H3 + governance line; right 7/12 = 3 proof chips row.
- **Spacing:** padding 64; chips 16 apart; chip inner 24.
- **Typography:** H3 32/500 ivory; statement lede 18/400 ivory@85%; chip 16/500 gold + 14/400 stone.
- **Colour:** charcoal field; chip = 1 px hairline-dark border, gold icon node; governance line gold small-caps eyebrow.
- **Cards/chips:** chip w auto, h64, radius 2, bg deep maroon @20%, border hairline-dark.
- **Dividers:** gold hairline above H3.
- **Interaction:** static (content pending); conditional-render at launch.
- **Loading:** none until content delivered.
- **Responsive:** 768 → stack; chips 1 col; 390 → chips stack full-width.
- **Accessibility:** contrast ivory-on-charcoal ≥12:1; chips text-based.

### B4 · Latest Updates [PENDING — conditional]

- **Height:** 480 desktop (only when ≥1 item).
- **Grid/alignment:** ivory field; H2 left; 3 news cards in 12/4 row; `All media →` right.
- **Spacing:** padding 96; cards 24 apart; card padding 28.
- **Typography:** H2 56/500; card date 12/500 uppercase gold; category 12/500 uppercase maroon; headline 22/500 charcoal; Read more 14/500.
- **Colour:** ivory field; card bg ivory, border hairline-light; hover headline → deep maroon; date gold.
- **Cards:** 1/3 width, radius 2, padding 28, image strip 16:10 top (when available).
- **Dividers:** hairline-light between header and grid; gold hairline above H2.
- **Interaction:** card hover → lift 2 px, border gold@40%; link opens media page.
- **Hover:** as above 300 ms.
- **Loading:** skeleton cards (16:10 ivory-dim blocks, subtle pulse) only in preview/admin; section hidden at launch without content.
- **Responsive:** 768 → 2+1 grid; 390 → single column.
- **Accessibility:** date & category present in DOM; focus rings; links descriptive.

### A8 · Contact / Business Enquiry

- **Height:** 720 desktop.
- **Grid/alignment:** dark maroon band; left 6/12 = H2 + contact info block; right 6/12 = form panel on ivory.
- **Spacing:** padding 112; form fields 20 apart; form inner padding 48; info rows 24.
- **Typography:** H2 56/500 ivory; info label 12/500 uppercase gold; info value 16/400 ivory@90%; form label 12/500 uppercase charcoal; input text 16/400; submit 14/500 uppercase.
- **Colour:** band dark maroon; form panel ivory 100%; inputs bg ivory, border 1 px hairline-light, focus border gold 2 px; submit gold fill/deep-maroon text (primary on dark).
- **Form fields:** h52, radius 2, px16, labels above (visible), 5 fields + textarea (h120) + submit.
- **Buttons:** submit 48 gold primary; aside map link text link gold.
- **Dividers:** gold hairline above H2; hairline-light between info rows.
- **Interaction:** inline validation on blur (message under field, maroon); submit → disabled + spinner (gold arc) → success panel replaces form; error inline.
- **Hover:** submit → gold-light; input border → deep maroon.
- **Loading:** button "SENDING…" state 400 ms min; success = check + "Thank you — your enquiry has been routed."
- **Responsive:** 768 → stack: H2 + info above form; 390 → form full-width, padding 24; map link opens native maps.
- **Accessibility:** visible labels, aria-invalid on error, autocomplete attrs, focus order, 48 px targets, success/error announced.

### A9 · Footer

- **Height:** 560 desktop.
- **Grid/alignment:** charcoal field; 4 columns (4/3/3/2): logo+descriptor+ecosystem links · sitemap · investor shortcuts · contact+socials. Bottom bar full-width.
- **Spacing:** padding 96; column gap 40; link rows 16; bottom bar padding 24.
- **Typography:** footer title 12/500 uppercase gold; links 15/400 ivory@75%; descriptor 14/400 stone; legal 12/400 stone.
- **Colour:** charcoal bg; logo maroon/gold; link hover ivory 100% + gold underline; external arrow gold.
- **Dividers:** 1 px hairline-dark above bottom bar; column separators none (spacing only).
- **Interaction:** external links (NDR InvIT Trust · Ave Acres) marked `↗`; sitemap links navigate.
- **Hover:** link → ivory + gold underline 300 ms.
- **Loading:** static.
- **Responsive:** 768 → 2×2 columns; 390 → accordions (chevron, aria-expanded).
- **Accessibility:** landmark footer; legal links; contrast AA on charcoal.

---

## 3. Reusable component inventory (design-system seeds)

**Navigation & identity**
1. Utility strip (entity-separation bar)
2. Primary nav bar (sticky, scroll-compact) with active-gold-underline
3. Megamenu panel (Business, Investor Centre)
4. Mobile menu panel (full-screen maroon)
5. Logo lockup (SVG only)
6. Nav CTA pair (ghost + solid)

**Typography & structure**
7. Eyebrow label (gold-on-dark / maroon-on-light)
8. Section heading (Fraunces H2)
9. Lede paragraph
10. Gold hairline divider / top-rule
11. Hairline-light/hairline-dark rule

**Actions**
12. Primary button (light surface)
13. Primary button (dark surface — gold)
14. Secondary button
15. Text link + external link (arrow-up-right)

**Evidence & data**
16. Stat/ledger band (metric + label + source footnote)
17. Counter (count-once)
18. Fact grid (2×2 ledger facts)
19. Source footnote line
20. Zone fact row

**Maps & diagrams**
21. India map (SVG) with locator dots + tooltip
22. Capital-cycle diagram (4-node line-art)
23. Journey timeline (horizontal / vertical)
24. Corporate-structure diagram (deck line-art style)

**Cards & modules**
25. Vertical card (numbered eyebrow + proof line) — A6
26. Partnership band — A6
27. Audience route card (4-up) — A3
28. News card — B4
29. ESG proof chip — B3
30. Resilience chip — B1
31. Project feature (cinematic primary) — A7
32. Project feature (compact) — A7
33. Reserved/pipeline slot (conditional) — A7
34. Client logo grid (grayscale static) — B2
35. Contact info block — A8
36. Enquiry form (5 fields, states: idle/error/submitting/success) — A8
37. Footer column system + legal bar — A9

**State & utility**
38. Focus ring (gold)
39. LQIP image wrapper (blur → crisp)
40. Skeleton block (admin/preview only)
41. Inline form spinner
42. Scroll cue (gold chevron)
43. Map locator dot (pulse, reduced-motion off)

---

## 4. Contingency notes

- **Pending imagery:** Hero (A2) uses the abstract maroon architectural fallback field until photography lands; A4/A7 sections conditional-render per Design Direction v2 §1.
- **Pending content:** B3 (ESG) and B4 (Updates) render only when content exists; components ship tested.
- **No-JS:** all figures display final values; reveals/counters skip; diagrams static; menu works via `:focus-within`.
- **Reduced motion:** every animation defined above has an instant-render equivalent.
- **Ultrawide:** hero image crops to 21:9; container caps at 1280; background bands stretch full-width.

*Visual Specification is the working authority for Figma handoff. Where a visual decision conflicts with Design Direction v2 or client documents, those documents win.*
