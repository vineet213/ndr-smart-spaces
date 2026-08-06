# NDR Smart Spaces Design Direction v2

**Design bible for the corporate website**
Lead UI/UX Designer & Senior Frontend Engineer · Companion to the approved Homepage Blueprint (v1) · For GPT (Product Architecture) and the development team

Version 2.0 · Status: For review and approval · Build target: HTML5/CSS3/JS, Bootstrap 5, PHP + PHP Mailer/SMTP (per client tech spec)

---

## 0. Authority hierarchy

Client documentation is the single source of truth. Where generic design practice conflicts with these documents, the documents win.

1. Website Information Architecture (client response annotations) — **confirmed homepage scope**
2. NDR Corporate Presentation (edited, for website)
3. Company Overview + Business Vertical write-ups (client response doc)
4. NDR Smart Spaces Post-Demerger business note + Structure diagram
5. NDR Smart Presentation (diagrams: structure, growth roadmap, locations)
6. NDR Existing.xlsx (48-page inventory of the current web property)
7. NDR Smart Space logo assets (maroon `#A0353A` / gold `#F0B65A`)
8. Client technical specifications (UI strategy, SEO, deployment)

**Confirmed homepage scope (client, verbatim intent):**
> Hero Banner and portfolio to be shown (inspo from InvIT website) — portfolio data provided shortly · Company Overview (given) · Business Highlights · Featured Projects

Everything beyond these four elements is treated as **institutional depth** — compact supporting bands shipped only when their content exists or is approved. No placeholders.

---

## 1. Critical review digest — what changed from v1 and why

| # | v1 decision | v2 decision | Why the change is better (evidence) |
|---|---|---|---|
| 1 | 11 homepage sections | 4 confirmed "hero" sections + 5 conditional "depth" bands | The client confirmed exactly four homepage elements. Eleven sections bury the approved content under speculative material and dilute the message. Institutional sites (Prologis, Goodman, Blackstone) are surgical, not encyclopedic. |
| 2 | Hero: "Building the infrastructure of India's growth" | **"From land to listed assets."** | The generic line fits any infrastructure company. The differentiator is the development-platform-to-listed-InvIT monetization model. Four words state the entire business model and cannot be said by a competitor. |
| 3 | Hero stat band: 4 stats incl. ₹5,000 cr InvIT valuation | 3 stats (60+ years · 100+ Fortune 500 · 98% occupancy) + a **labeled** InvIT relationship line | ₹5,000 crore is the *InvIT's* valuation, not NDR Smart Spaces'. The post-demerger doc exists precisely to separate the entities; conflating them on the homepage would mislead the exact audience we serve. Three stats also read faster than four — the tenth second matters. |
| 4 | Portfolio strip with a duplicate metric ticker | Portfolio strip = map + 4 "zone facts" only | Two metric moments back-to-back repeat the same proof job and break the "one stat, one source" discipline. The map answers a *different* question ("where") and deserves its own screen. |
| 5 | Business Verticals as a symmetric 2×2 (vertical 4 = "NDR Smart Spaces & NDR InvIT") | **3 operating verticals + 1 capital-partnership band** | The business-model doc shows InvIT is a *monetization channel* (ROFO, asset transfer), not a co-equal operating vertical. A symmetric 2×2 implies four equal engines and misreads the model for analysts. |
| 6 | Featured Projects: two full alternating rows | One cinematic primary (Amazon) + one compact secondary (Lenovo) + one reserved slot | Two eight-row cinematic features over-weight the section before the capital story. A 1+1+1 composition gives hierarchy: one story owns the screen, one supports, one signals pipeline. |
| 7 | No explicit audience routing | **Audience strip under the hero:** Investors / Corporate Clients / Business Partners / Media | Four audiences, four first-click destinations. An institutional homepage must let a visitor self-identify in one second. The nav serves the return visitor; the strip serves the first-timer. |
| 8 | No marquee-client evidence | **Grayscale client band** — "Serving 100+ Fortune Global 500 companies" | The claim is stated as a number but never felt. The deck and legacy site supply the client list. A quiet logo band is the most persuasive third-party proof available. |
| 9 | ESG band = E/S/G three-column bullet lists | ESG & Governance = one statement + 3 proof chips + link | Bullet triads read like a policy page. For investors, ESG *is* risk management — three verifiable commitments prove more than ten bullets. Detail lives on the ESG page. |
| 10 | Investment Highlights after Featured Projects | Moved **before** Featured Projects | Primary audience is institutional. "Who we are → what we do → why it works financially → proof → trust" is the analyst's native sequence. Projects are proof of a model they must first understand. |
| 11 | Contact: 7-field form | **5 fields** (Name · Work email · Company · Enquiry type · Message) | Each field measurably drops completion. Region is redundant with enquiry type and office routing. The confirmed mailboxes route cleanly from a 5-field form. |
| 12 | Hero carried 4 motion systems | Mask reveal + fast counters (≤800 ms) only | Motion is sequencing, not decoration. Four competing systems read as noise to an analyst. One slow reveal + one count is calm and confident. |
| 13 | Pending sections shown as empty bands | **Conditional-render rule:** omit at launch until content exists | The client explicitly marked this content as pending. A shorter, fully resolved page beats empty shells. Components ship tested and appear when data lands. |
| 14 | Header CTA "Partner With NDR" | Two persistent CTAs: **"Investor Centre"** and **"Business Enquiry"** | "Partner" is vague. Naming the two audiences' destinations routes both primary constituencies in one click. |

**Unchanged because they survived the challenge:** utility-strip entity separation, sticky header, Company Overview retaining the client's verbatim overview, the 1954→2026 journey line, the capital-cycle concept, enquiry→mailbox routing, and the maroon/gold token system.

---

## 2. Homepage architecture v2

Tier A = client-confirmed core (always on). Tier B = institutional depth (conditional on content/approval).

### A1 · Header (Utility strip + Navigation)

- **UX verdict:** retained, refined.
- **Utility strip (32 px, deep maroon):** `NDR Smart Spaces Pvt. Ltd. — an NDR Group platform` · right: `NDR InvIT Trust →` (external) and `compliance@ndrsmart.com`. Performs *entity separation* — the governance signal the post-demerger doc demands.
- **Main bar (72 px → 56 px on scroll):** logo lockup left (SVG only), nav center (About Us · Business · Portfolio · Investor Centre · ESG · Media · Contact per approved IA), two persistent CTAs right: `Investor Centre` (ghost) + `Business Enquiry` (solid maroon). Active item = maroon text + 2 px gold underline.
- **Interaction:** megamenu with 150 ms hover delay (Business lists the verticals; Investor Centre lists confirmed sub-pages). No click-hover traps; keyboard- and touch-accessible.
- **Mobile:** full-screen maroon panel from right; 48 px targets; phone + enquiry email pinned at bottom; utility strip collapses into the menu header.

### A2 · Hero — "From land to listed assets."

- **UX verdict:** challenged and rebuilt.
- **Copy:**
  - Eyebrow: `NDR SMART SPACES · EST. 1954` (gold small-caps)
  - Headline: **From land to listed assets.**
  - Subhead: *A diversified infrastructure organization developing, owning and managing institutional-grade industrial, commercial and institutional assets across India — and the development platform behind NDR InvIT, India's first warehousing InvIT.*
  - CTAs: Primary `Explore Our Business Verticals` (gold on maroon) · Secondary `Investor Centre` (outline).
  - Stat band (3, reconciled to the corporate deck — one source): **60+ years** · **100+ Fortune Global 500 companies served** · **98% portfolio occupancy**.
- **Why better:** states the business model in four words; entity claims are separated honestly; three stats read inside the 10-second window; the InvIT proof sits in the subhead where it is attributed correctly.
- **Interaction/motion:** line-by-line mask reveal (80 ms stagger), stats count up once ≤800 ms ease-out. Ken Burns removed. Scroll cue kept (gold, once). `prefers-reduced-motion` → instant reveal, final stat values.
- **Mobile:** headline 34–40 px; stat band becomes horizontal scroll-snap chips; CTAs stack full-width; overlay darkened +20% for contrast.

### A3 · Audience strip (NEW)

- **UX verdict:** the single biggest usability addition.
- **Layout:** slim ivory band, four equal routes with one-line descriptors separated by hairline rules:
  1. **Investors** — reports, disclosures, governance → Investor Centre
  2. **Corporate clients** — warehouses & industrial space → Portfolio / Business
  3. **Business partners** — land, development, JVs → Business
  4. **Media** — news, press, gallery → Media
- **Why better:** four distinct first-time profiles each find their door in one second. This pattern (Embassy REIT, Blackstone, Goodman) converts "where do I go?" into an action before the fold is passed.
- **Mobile:** 2×2 grid of full-width tap cards; touch focus states only.

### A4 · Portfolio presence (client-confirmed) [PENDING imagery]

- **UX verdict:** kept as a full-width pan-India band; **duplicate ticker removed.**
- **Content:** India map (SVG) with plotted locations from the diagrams deck — South: Chennai (Nallur, Krishnapuram Kandigai, Oragadam, Walajapet), Bidadi, Hosur, Kochi; West: Hyderabad, Pune; East: Kolkata, Varanasi, Lucknow, Kanpur; North: Ghaziabad. Four zone facts instead of metrics, e.g. *"Strategically located at ports, national highways, railways and airports."*
- **Components:** map component, pulsing locator dots (desktop only, 2 s, reduced-motion off), zone tabs, `View Portfolio →`.
- **Why better:** one proof job per screen. Map = "where," hero = "how big," Business = "what." No metric repeats.
- **Mobile:** map collapses to four zone tap-cards.

### A5 · Company Overview (client-confirmed)

- **UX verdict:** retained; tightened.
- **Content:** the client's verbatim overview, split into lede + continuation for scannability:
  - Lede: *"NDR Smart Spaces is a diversified infrastructure organization focused on developing, owning, and managing high-quality industrial, commercial and institutional assets."*
  - Continuation: *"The company combines expertise in real estate development and grade A warehousing for over 60 years. Its integrated approach spans the complete asset lifecycle — from conceptualization and development to operations, leasing, and investment management."*
  - Link: `Our journey →`
- **Journey line (sub-band):** horizontal 1954→2026, six nodes from the deck — 1954 founded · 1996 India's first private bonded warehouse · 2002 Lenovo Puducherry · 2015 NDR InvIT Trust incorporated · 2018 InvIT listed (INR 8.8 bn IPO) · 2025–26 SPV monetizations (MLG INR 143.9 cr). Hairline with gold node dots; captions always visible (analysts verify — they don't hover-hunt).
- **Why better:** the overview is a homepage *requirement*, not a link to About. Verbatim honors the client; split honors the reader. The timeline is evidence, not spectacle.
- **Mobile:** journey becomes a left-rail vertical timeline with gold markers.

### A6 · Business Highlights (client-confirmed)

- **UX verdict:** 2×2 challenged. Now **3 operating verticals + 1 capital-partnership band.**
- **Three vertical cards (deep maroon):**
  1. **Grade A Warehousing** — strategically located, spec-forward facilities near highways, ports, railways and airports; serving retail, e-commerce, 3PL, manufacturing. Proof: *99% greenfield.*
  2. **NDR Asset Management** — end-to-end project planning, execution, delivery plus ongoing portfolio O&M. Proof: *100%-owned project management arm.*
  3. **Residential Plotting — Ave Acres** — RERA-compliant plotted layouts. Proof: *Trusted plotted development* (external: aveacres.com).
- **Partnership band (full width, maroon-to-charcoal):** **The NDR InvIT relationship** — *completed assets are offered to NDR InvIT under a Right of First Offer, recycling capital into new development. A transparent, disciplined engine that keeps building.* CTA `The capital model →`.
- **Why better:** structurally honest to the post-demerger note; analysts read "3 engines + 1 capital channel," not a misleading square. The InvIT story gets weight instead of card 4.
- **Cards:** numbered eyebrows 01–03 (gold serif), hairline gold borders; hover shifts border + number to gold with a 2 px lift.
- **Mobile:** vertical stack; partnership band as a distinct dark block with generous padding.

### B1 · Investment Highlights [depth band]

- **UX verdict:** repositioned before Featured Projects.
- **Content:** capital-cycle diagram (line-art matching the deck's diagram language): **Develop → Stabilize → Offer to NDR InvIT (ROFO) → Recycle capital → Develop.** ROFO expanded on first use (*Right of First Offer — NDR InvIT evaluates each eligible asset before any third party*).
- **Institutional proof (text, not logos — logo use requires client approval):** Kotak Alternatives; Investcorp-led $55 mn; $100 mn US global PE ($90 bn+ AUM); $60 mn global financial institution ($15 bn across 400 companies); AAA-rated entity, long-term bonds, long WALE, low receivable risk; recent monetizations (MLG INR 143.9 cr; SPV transfers to InvIT).
- **Resilience strip (3 chips, sourced from the risk slide):** geographic/industry/client diversification · prudent management & governance · strong balance sheet.
- **Why better:** the analyst's native sequence places model before proof. Investor names in text avoid unapproved logo usage while preserving credibility.
- **Mobile:** cycle becomes a vertical stepper; chips stack.

### A7 · Featured Projects (client-confirmed) [imagery PENDING]

- **UX verdict:** rebalanced to 1 cinematic + 1 compact + 1 reserved.
  1. **Primary (cinematic): Amazon Fulfilment Centre, Coimbatore** — 6,00,000 sq ft Grade-A air-conditioned facility including a 2,00,000 sq ft mezzanine, delivered in 4 months to institutional ESG standards. Fact grid: size / timeline / client / milestone.
  2. **Compact secondary: Lenovo Industrial Facility, Puducherry** — Lenovo's first industrial facility in India (2002), built to international manufacturing & warehousing specifications — *"two decades ahead of the industry."*
  3. **Reserved slot** — activates when portfolio data lands.
- **Why better:** one story owns the screen (Amazon is the strongest datum on the page); Lenovo lends legacy without stealing hierarchy; the reserved slot signals pipeline without placeholder content.
- **Interaction:** image scale 1.03 on hover (800 ms); fact-grid counters count once in view.
- **Mobile:** single column; fact grid becomes a 2×2 stat block.

### B2 · Marquee Clients [depth band]

- **Content:** one line, *"Serving 100+ Fortune Global 500 companies"* + a ~16-client grayscale grid (Amazon, Samsung, Lenovo, Philips, Flipkart, LG, ITC, Dabur, Godrej, FedEx, Apollo Tyres, Goodyear, JSW, Pepsi, Mahindra Logistics, Kuehne+Nagel).
- **Why better:** the claim becomes felt proof. Static grayscale (no marquee) stays institutional; moving logo walls read as consumer retail.
- **Mobile:** 2-column grid at 70% opacity.

### B3 · ESG & Governance [depth band — client content PENDING]

- **UX verdict:** statement + 3 proof chips, not bullet triads.
- **Statement:** *"Sustainability is an operating discipline, governed and reported."*
- **Chips:** EDGE certification · GHG inventory (Scope 1 & 2) · Net-zero pathway with solar-powered assets. Governance line: *governance framework, cybersecurity policy, auditor-certified utilization certificates.*
- **Why better:** three verifiable commitments outperform ten bullets; the register lives on the ESG page.
- **Conditional:** omitted at launch until ESG content is delivered.

### B4 · Latest Updates [depth band — client content PENDING]

- **Layout:** three news cards (date · category · headline · Read more) + `All media →`. Rendered **only when ≥1 item exists.**
- **Why better:** a live-disclosure signal supports the transparency claim; an empty band would harm it.

### A8 · Contact / Business Enquiry (client-confirmed end CTA)

- **UX verdict:** 5 fields only.
- **Form:** Name · Work email · Company · Enquiry type (Grade A Warehousing / Asset Management / Land & Plotting / Business Partnership / Investor Relations) · Message. Server-side validation + honeypot; PHP Mailer/SMTP routes to `compliance@ndrsmart.com` and `project@ndrsmart.com` by type.
- **Aside (desktop):** Corporate office — No. 56/1, next to GT Reddy Cars, Bazulla Road, T. Nagar, Chennai, Tamil Nadu 600017 · Google Maps link · hours.
- **Why better:** the brief's own technical spec centres on forms & enquiries; five fields keep completion high while still routing by business type.

### A9 · Footer

- **Columns:** 1) logo + one-line descriptor + ecosystem links (NDR InvIT Trust · Ave Acres), 2) sitemap per approved IA, 3) Investor Centre shortcuts, 4) contact + socials.
- **Bottom bar:** © 2026 NDR Smart Spaces Pvt. Ltd. · Privacy Policy · Terms & Conditions · Disclaimer · Website Sitemap.
- **Mobile:** accordion columns; legal links wrap.

---

## 3. Creative Direction

### 3.1 Design philosophy

**Evidence over adjectives.** This is an institutional infrastructure company speaking to institutional audiences. Every claim on the surface must be a number, a certification, a name, or a date — never an unsupported adjective. The visual system is the *carrier of that evidence*: calm, ordered, and quiet enough that the numbers do the talking.

Three working principles:
1. **Restraint is the luxury signal.** Blackstone's homepage is austere; Brookfield's is editorial calm. What we never see in these rooms is decorative noise. Every element must earn its place.
2. **The site should read like an annual report you can scroll.** Front section of a financial daily, equity-research cover page, fund communication — not a brochure, not an app.
3. **Absence of decoration is itself the decoration.** Whitespace, hairline rules and a two-colour accent system signal an organization that is disciplined about everything, including its pixels.

### 3.2 Visual identity

The identity is **"institutional print."** The maroon and gold from the logo are not a palette — they are the seal of the house. The logo's two counter-rectangles become a reusable geometric motif (section numbering, timeline nodes, stat markers, card corners) so the entire site is visibly generated from the mark.

Identity rules:
- Maroon = the institution (structure, authority, weight).
- Gold = the signal (metrics, eyebrows, moments of emphasis). Gold is used like a highlighter: rare, deliberate, never a background.
- Ivory/charcoal = the field on which both operate.
- The wordmark is always the SVG lockup — never re-rendered as text.

### 3.3 Editorial direction

Long-form journalism structure applied to corporate content:
- **Eyebrow → Display headline → Lede → Body → Proof → Route.** Every section follows this spine.
- **Fact boxes and footnotes** carry the evidence: "Source: NDR Corporate Presentation, FY26" under every figure. An analyst should be able to verify anything.
- **Pull quotes** used once per page maximum, reserved for client testimony or the founder's line — treated as editorial artefacts, not banners.
- **Sentence-case headlines, small-caps eyebrows.** Uppercase shouting is consumer-grade.

### 3.4 Photography direction

- **Subject:** real assets — warehouse interiors with natural light, aerial park views, loading docks at golden hour, trucks at scale, people in hi-vis at distance (human scale, never posed corporate).
- **Grade:** warm natural light; shadows pulled toward maroon-black; consistent grading across the entire library so the portfolio reads as one institution.
- **Composition:** strong horizon lines, generous negative space for type overlay; the hero image must hold an ivory/maroon overlay without fighting it.
- **Forbidden:** stock handshakes, empty CGI renderings, office-shrug clichés, hero images unrelated to the asset class.
- **Direction of travel:** borrow the *register* of Prologis/Goodman photography (real, engineered, calm) and apply a warm, heritage grade that echoes the 1954 lineage — slightly warmer and deeper than the cool corporate standard.

### 3.5 Grid philosophy

- Bootstrap 5 12-column grid as the skeleton (client tech spec), but used with **asymmetric editorial compositions** inside it: 5/7 splits, 4/8 ledes, offset columns. Symmetry for official moments (stats, verticals), asymmetry for storytelling moments.
- **Baseline rhythm:** an 8 px vertical grid with consistent 96–120 px section padding on desktop and 56–64 px on mobile.
- **Hairlines as grid articulation:** 1 px rules in warm grey (light) or muted maroon (dark) divide content into bands — the grid is *drawn*, not implied by boxes.
- The grid is the governance of the page. Institutional sites are grid-true; every deviation is a deliberate design statement, and there are few.

### 3.6 Typography pairing

- **Display:** **Fraunces** (variable serif, optical sizing 9–144). Editorial, heritage, premium — the serif answer to the brand's serif-feel wordmark. Headlines in charcoal or ivory on dark, leading 1.05, weights 300–500 only.
- **Body:** **Inter** (neutral humanist sans), 16–18 px, line-height 1.6, measure ≤ 65 ch.
- **Labels:** Inter small-caps, letter-spaced 0.12 em — eyebrows, buttons, meta.
- **Numerals:** Fraunces for display metrics (large serif figures read "financial"); **tabular Inter** for tables and lists so figures align.
- **Scale:** hero ~3.5–6 rem clamp · section ~2.25–3.25 rem · sub ~1.5–1.75 rem · body 1 rem · meta 0.875 rem · label 0.75 rem.
- **Why this pairing:** a pure-sans system (Brookfield) is safe but cold for a 1954 brand; a pure serif system can look like a bank's static brochure. Serif display + sans body is the premium institutional hybrid — CapitaLand's warmth, Blackstone's precision.

### 3.7 White-space strategy

Whitespace is institutional confidence. The things Prologis and Blackstone share is how much of their pages are *empty*, and how expensive that emptiness feels.

- Sections breathe at 96–120 px; text blocks sit within 65 ch; stat bands are separated by generous voids rather than rules.
- **One focal moment per screen.** If a viewport contains two competing elements, something is wrong.
- White space is where the maroon and gold accents get their power — a gold hairline on a vast ivory field is a statement; in a crowded layout it is noise.

### 3.8 Color hierarchy (maroon and gold logo)

Tokens (foundation, expandable in implementation):

| Token | Value | Role | Budget |
|---|---|---|---|
| Brand maroon | `#A0353A` | brand, primary buttons, accents | ~15–20% of any screen |
| Deep maroon | `#7C282E` | hover, hero overlay | — |
| Dark maroon | `#5A1E22` | footer, deep bands | — |
| Gold | `#F0B65A` | metrics, eyebrows, hairlines, one CTA per surface | **≤ ~5–6% of any screen** |
| Gold light | `#F5C97F` | hover on dark | — |
| Ivory | `#FAF7F2` | primary background | majority |
| Ivory dim | `#F2EDE4` | alternate bands | — |
| Charcoal | `#1C1A19` | primary text | — |
| Stone | `#8A857D` | secondary text, meta | — |
| Hairline light | `#E4DED3` | rules on ivory | — |
| Hairline dark | `#3A3134` | rules on dark | — |

- **Order of hierarchy:** charcoal/ivory carry information; maroon provides emphasis; gold provides exclamation. If a screen feels gold-heavy it is wrong.
- **Contrast discipline:** maroon on ivory ~5.9:1 (AA body); gold on ivory ~1.9:1 — **gold is never body text on ivory**, only large metrics, labels and rules; gold earns its contrast on maroon/dark (~5.5:1).
- **One gold CTA per surface.** Never gold on both primary and secondary in the same viewport.

### 3.9 Card language

- **"Print cards," not app cards:** rectilinear, hairline border (warm grey on ivory), radius ≤ 2 px, padding 32 px, numbered eyebrow 01–03 in gold serif.
- Hover: gold top rule (3 px) + border/number shift to gold + 2 px lift over 300 ms. No floating shadows on light surfaces; soft warm shadows only on dark.
- Cards are content containers for proof — the number, the claim, the source — never decorative tiles.

### 3.10 Button philosophy

- Rectilinear (radius ≤ 2 px), minimum 44–48 px height, uppercase 14 px Inter 500 with 0.06 em tracking.
- **Primary (light surface):** maroon fill, ivory text, 1 px inner gold hairline; hover = deep maroon + gold border.
- **Primary (dark surface):** gold fill, deep-maroon text; hover = gold light.
- **Secondary:** 1 px outline (ivory on dark / charcoal on light); hover fills to maroon (light) or deep maroon (dark).
- **Rule:** one primary CTA per viewport; focus states = 2 px gold outline, 2 px offset.

### 3.11 Motion philosophy

- Motion **sequences information for readability**; it does not decorate. The calmest premium sites (Blackstone, ESR) move least.
- **One easing curve** — cubic-bezier(0.22, 1, 0.36, 1) — and three durations: 150 ms (micro), 400 ms (standard), 800 ms (reveals).
- Allowed: fade + 20 px rise reveal with ≤ 80–120 ms stagger; counters counting once (800–1200 ms); image scale ≤ 1.03 on hover; map dots pulsing (desktop, reduced-motion off).
- Forbidden: parallax beyond 8% drift, marquee logo walls, infinite loops, bouncy spring curves, 3D tilt.
- **`prefers-reduced-motion` is a first-class state:** everything visible instantly, counters show final values.

### 3.12 Icon philosophy

- **Prefer the geometry of the logo and the typographic marker (01, 02, 03) over icon libraries.** The strongest "icons" on this site are gold serif numerals and the logo's rectangle.
- Where icons are needed (arrow-right, arrow-up-right for external, phone, mail, map-pin, download, chevron): 1.5 px stroke, geometric, 24 px canvas, maroon or gold only, never filled, never multicolor.
- Data markers over icons: a location is a gold node, not a pin illustration.

### 3.13 Data visualization style

For the analyst audience this is the heart of the system:
- **Metrics:** Fraunces numerals, large, maroon on ivory or gold on maroon; unit labels in small-caps Inter. Every figure carries a source + period footnote.
- **Charts:** custom SVG only — hairline 1 px axes in stone, series in maroon/gold, labels in Inter 12 px, no 3D, no gradients. A chart on this site looks like a page from a fund report.
- **Diagrams (capital cycle, corporate structure):** line-art consistent with the deck's own diagram language — thin connectors, numbered nodes, maroon/gold, generous whitespace. The corporate-structure diagram shipped by the client is the template.
- **Tables:** Inter tabular numerals, zebra rows in ivory-dim, maroon uppercase headers, hairline rules. Analysts love a sortable table.
- **Format discipline:** ₹ in crores (Indian institutional convention); every date stamped "as on"; entity names in full legal form on first use.

### 3.14 Investor communication style

The register of an equity-research cover page:
- Precise, sourced, hedged where appropriate. Forward-looking/safe-harbour statements (the deck's Slide 2 language) must be preserved on investor pages.
- Every figure has a source and a period. Stats are reconciled to a **single source list** (this document's homepage stats are the seed); one stat, one source, everywhere.
- Entity separation is visual: NDR Smart Spaces, NDR Asset Management, Ave Acres, NDR InvIT Trust are named precisely and never conflated.
- Disclosure-forward design: "Download reports," "as on" dates, obvious archive patterns.
- Tone: *we report to you as fiduciaries.* No superlatives without a number.

### 3.15 Portfolio presentation style

- **Map-first, list-second.** A portfolio page opens with the pan-India map, then property cards, then an analyst table.
- **Property card:** 16:10 image · name · city · zone chip · asset class · size (sq ft) · status badge (Completed/Ongoing) · occupier where public · link to project detail.
- **Analyst view:** sortable table toggle (location, size, status, class).
- **Filters:** Zone / Asset class / Status.
- **Entity honesty:** on this site, "portfolio" = assets developed/owned by the NDR Smart Spaces group (including SPVs). The InvIT's own portfolio lives on ndrinvit.com; we link to it clearly rather than absorbing it. This respects the post-demerger separation.

---

## 4. Reference principles (study, not copy)

| Reference | Principle we extract | What we reject |
|---|---|---|
| **Brookfield** | Editorial whitespace, hairline rules, restrained type, confident calm | Generic global-hero obscurity |
| **Goodman** | Evidence-driven case studies, capital-partner transparency | Dense metric clutter |
| **Prologis** | Data-forward tables, client proof, investor-grade density | Wall-of-data homepage |
| **Blackstone** | Austerity, dual-audience routing, typographic hierarchy | Coldness — we keep warm ivory |
| **ESR** | Clean grid discipline, pan-Asian map storytelling | Stock real-estate imagery |
| **CapitaLand** | Editorial serif warmth, heritage storytelling, brand-colour discipline | Multi-colour vibrancy — we stay two-colour |
| **Embassy REIT** | Indian institutional register, portfolio maps, investor-centre clarity | Compliance-text overload on brand moments |

---

## 5. Initial design tokens (foundation for implementation)

Colour tokens per §3.8. Typography per §3.6. Motion per §3.11. Plus:
- Radius: 0–2 px (components), 4 px max (images).
- Borders: 1 px hairlines (colour per §3.8).
- Shadows: only on dark surfaces, soft warm 0 8 16 0.06.
- Section padding: 96–120 px desktop / 56–64 px mobile; container ≤ 1280 px.
- Focus: 2 px gold outline, 2 px offset, on all interactive elements.
- Imagery: WebP + lazy loading (per tech spec); single warm grading pass.

## 6. Do / Don't checklist

**Do:** lead with proof · reconcile every number · separate the entities · use gold ≤ ~6% per screen · keep one CTA per viewport · show captions on timelines · ship only sections with content · honour reduced-motion · use the SVG logo only.

**Don't:** use adjectives without numbers · animate logo walls or hero slideshows · show empty pending sections · put gold text on ivory · use stock "handshake" photography · repeat a metric in two places · imply the InvIT valuation belongs to NDR Smart Spaces · render the wordmark as text.

## 7. Build integration notes (no code — for planning)

- Bootstrap 5 grid + the tokens above as CSS custom properties so every component inherits the discipline.
- Conditional-render pattern for all Tier-B sections (content-gated).
- Enquiry form: PHP + PHP Mailer + SMTP, routing by enquiry type to the two confirmed mailboxes; honeypot + server-side validation.
- SEO per spec: single h1, title/meta/alt/canonical, sitemap.xml, robots.txt, Organization + FAQ schema.
- Accessibility baseline: WCAG 2.1 AA, focus-visible gold outlines, 48 px targets, semantic landmarks, reduced-motion state.

## 8. Open items

- Portfolio imagery & data (A4, A7) — client pending.
- ESG copy (B3) — client pending.
- Media items (B4) — client pending; band renders only with content.
- Leadership profiles — client pending.
- Investor Centre page retention — client on hold; B1 ships on approval.
- Investor-logo usage — requires client approval; names appear in text meanwhile.
- Final stat source list — to be confirmed by client before go-live; one stat, one source.

*This document is the working authority for all design and frontend decisions. Client documents override it wherever they conflict.*

