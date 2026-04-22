# Phase 4 — Final Feedback (April 22, 2026 Call)

## Global / UX
- [ ] **1.1** Scroll-to-top on route change (currently scrolls from bottom → top on navigation)
- [ ] **1.2** Trackpad back/forward gestures broken — likely `overscroll-behavior-x: none` conflict. Remove or scope it.
- [ ] **1.3** Dummy $0.01 product for end-to-end transaction test (Alex to set up in Shopify)

## Homepage
- [ ] **2.1** "Everything you need…" copy feels too small, bump size
- [ ] **2.2** Rename "Ask Anything" label → "Ask AmpuMe" everywhere it appears
- [ ] **2.3** Alternating section backgrounds: Platform (white), AmpuMe Store (gray), Knowledge Base (white), Ask AmpuMe (gray)
- [ ] **2.4** Proof-of-platform Shop subtext: match the current AmpuMe Store page copy (replace legacy copy)

## Shop — Product Pages
- [ ] **3.1** General Purpose Liner: default to smallest size (currently defaults to XL)
- [ ] **3.2** General Purpose Liner: why is it showing "X-Large" text instead of cm like the other liners? Investigate.
- [ ] **3.3** General Purpose Liner: XL only in Locking / 3mm. Grey out XL when Cushion or 6mm is selected (both — either triggers). Add a product-description note: "XL available in Locking 3mm only."
- [ ] **3.4** Size chart circle icons break on numeric sizes (duplicate digits). Standardize on the length-sizing design (pill rows, no circle) across ALL products so words + numbers both work.
- [ ] **3.5** Easy Liner: no 10cm variant in Locking — grey it out on Locking select.
- [ ] **3.6** Easy Liner + General Purpose Liner: replace vague "Size 10" column with "Measured Circumference". Add a third column that distinguishes Locking vs Cushion availability (or inline note for N/A combos). (Awaiting Alex's chart data.)
- [ ] **3.7** Audit all sizing guides for similar issues after 3.4/3.6 land.
- [ ] **3.8** Sock length-arrow overlay: move arrow closer to the leg. Either shift the "Length" callout card left, or let the arrow sit behind it.
- [ ] **3.9** Measuring steps are already dynamic — when BK is selected show BK-only steps (no "For BK… / For AK…" redundancy). Same for AK. Only applies to products with a BK/AK toggle (socks).
- [ ] **3.10** Step headings use sentence case (first letter capitalized only).

## Insurance & Coverage Page
- [ ] **4.1** Remove the inquiry form (HIPAA vetting pending)
- [ ] **4.2** Remove the FAQ section
- [ ] **4.3** Make the page render like other knowledge-base pillars (hero + resources grid only)
- [ ] **4.4** Preserve a copy of the form + FAQs in a branch/feature-flag so we can restore later

## Ask AmpuMe (Chat)
- [ ] **5.1** New curated preset questions (awaiting Alex's copy)
- [ ] **5.2** Headline + subtext update (awaiting Alex's copy)
- [ ] **5.3** Disclaimer: higher contrast + new language (awaiting Alex's copy)
- [ ] **5.4** Mobile: first prompt pill is misaligned/wrong width — match the others
- [ ] **5.5** (Backend, Brennan) Hardcode a better answer for the known-bad prompt — CustomGPT side
- [ ] **5.6** Chat landing image on mobile — center subject (currently cut off)

## Blocked / Awaiting
- [ ] **6.1** Alex to send copy for 2.1, 5.1, 5.2, 5.3
- [ ] **6.2** Alex to send Easy Liner + General Purpose Liner measurement charts (3.6)
- [ ] **6.3** Alex to finalize Zapier + Google Sheets for contact form
