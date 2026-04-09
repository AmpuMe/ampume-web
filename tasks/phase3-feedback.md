# Phase 3 Feedback — Task List (April 8, 2026 Call + Notes + Catalog)

---

## 1. Global / Navigation

- [X] **1.1** Add "Telemedicine" to main navigation
- [X] **1.2** Rename "Resources" → "Knowledge Base" across ALL instances (nav, tiles, proof of platform, breadcrumbs, page headings, etc.)
- [X] **1.3** Page scroll direction: currently bottom→top on navigation clicks, update to top→bottom
- [X] **1.4** Breadcrumb on Contact page is hardcoded "Back to Shop" — make dynamic (return to previous page, same behavior as Insurance form breadcrumb)

---

## 2. Homepage

### Hero
- [X] **2.1** Update headline: "Life WITH limb loss" (not "Life AFTER") — inclusive of individuals born with limb difference

### Pre-Tile Section
- [ ] **2.2** Alex to provide copy for a mission/intro section between hero and platform tiles — add it back once copy received

### Platform Tiles
- [X] **2.3** Tile height: may be too tall on smaller screens (13.3"). Evaluate reducing height on smaller viewports.
- [X] **2.4** Telehealth tile: remove the reflection/glare artifact from the image
- [X] **2.5** Telehealth tile: fix framing/cropping on mobile — image is cut off
- [X] **2.6** Shop tile image: center the image (currently off-center compared to other tiles)
- [X] **2.7** Prosthetist feedback on category tile images:
  - Sock image: sock should reach above the knee
  - Sleeve image: sleeve should reach to the thigh

### Proof of Platform
- [X] **2.8** "Prosthetic Essentials" → "Shop Prosthetic Essentials"
- [X] **2.9** "Expert Guidance" → "Knowledge Base" (consistent renaming)
- [X] **2.10** Resource preview cards: link to the specific article/resource (deep link, not just /resources)
- [X] **2.11** Resource preview cards: add publish date
- [ ] **2.12** Resource preview: Alex to provide which 3 articles/resources to feature
- [ ] **2.13** AI Support "Ask Anything" section: Alex to provide preset questions (current ones may change)
- [ ] **2.14** Pre-footer section: Alex on the fence about adding newsletter or something back between AI section and footer — awaiting decision

---

## 3. Contact Page

- [X] **3.1** Header: keep as-is
- [X] **3.2** Subtext: update from e-commerce focus to broader: "Have a question about products, clinical care, or using AmpuMe? Send us a message and our team will get back to you shortly."
- [X] **3.3** Breadcrumb: make dynamic (see 1.4)
- [ ] **3.4** Form backend: currently MailerLite — switch to Zapier → Google Sheets + email notification to Alex
  - Alex to set up Zapier account connection + Google Sheets
  - Fields → Google Sheet row + email with form data to Alex

---

## 4. AI Support Page

- [ ] **4.1** Rename section — "AI Support" evokes customer support. Find a better name. Discussed options: "Start a Conversation", or something else. TBD.
- [X] **4.2** Response formatting: codes showing (e.g. `**bold**` instead of rendered bold). Fix markdown rendering.
- [X] **4.3** Response anchoring: currently auto-scrolls to bottom of response. Instead, anchor at the TOP of the response so user reads top-down without scrolling up.
- [X] **4.4** Chat stalling: occasionally the chat hangs with typing indicator and never responds. Add timeout detection → show error message with "try again" option.
- [X] **4.5** "New Conversation" button: make it more prominent/visible (Alex missed it initially)
- [ ] **4.6** Future: add Shopify knowledge base to CustomGPT so bot can help with product selection (post-launch)

---

## 5. Telemedicine Page (NEW — Pre-Launch)

### Gate / Modal
- [X] **5.1** When user clicks Telemedicine tile or nav link → show page blurred in background with centered modal overlay
- [X] **5.2** Modal header: "Telemedicine is launching soon"
- [X] **5.3** Modal subtext: "Get early access with a password, or sign up below to be notified when we go live."
- [X] **5.4** Modal has two options:
  - Password input + "Enter" button → if correct, remove blur, grant access
  - Email input + "Notify Me" button → show confirmation "You're on the list"

### Page Design (Behind Gate)
- [X] **5.5** Use existing Liner/Category page template as base layout
- [X] **5.6** Replace product filters with: State (dropdown) + Appointment Type (dropdown or chip selector)
- [X] **5.7** Results grid shows clinician/physician partner cards (faces, names) instead of products
- [X] **5.8** Hero section:
  - Header: "Schedule an appointment with a limb loss specialist today"
  - Subtext: "AmpuMe clinical partners provide functional assessments, liner replacement visits, osseointegration consultations, mental health counseling, and other specialized care."
- [X] **5.9** Count display: "X clinicians available"
- [X] **5.10** Empty state when no clinicians match filters
- [X] **5.11** Appointment types (for filter): functional assessments, liner replacement visits, osseointegration consultations, mental health counseling, other specialized care

---

## 6. Insurance & Coverage Page

- [X] **6.1** Headline: "Understand Your Insurance and Coverage"
- [X] **6.2** Subtext: "Get clarity on your benefits, coverage, and what to expect. Our team will review your information and help you understand your options."
- [X] **6.3** Form headline: "Start Your Coverage Review"
- [X] **6.4** Form subtext: "Share a few details about your insurance and what you're looking for. Our team will review your benefits and follow up with clear next steps."
- [X] **6.5** Submit button: "Check My Coverage"
- [X] **6.6** Add bridge section between FAQs and articles:
  - Header: "From Our Knowledge Base"
  - Subtext: "Explore guides and resources to better understand insurance, coverage, and the claims process."

---

## 7. Shop Page

- [X] **7.1** Remove product count from category tiles
- [X] **7.2** Socks tile image: update so sock reaches above the knee
- [X] **7.3** Sleeves tile image: update so sleeve reaches to the thigh
- [X] **7.4** Care & Accessories tile: love the image but framing needs fixing (ambiguous content — could be confused for something else)

---

## 8. Product Pages (All)

- [X] **8.1** Default variant selection: select the variant furthest to the LEFT (not middle or random)
- [X] **8.2** Sizing guide background colors: make consistent across all products — added bg-brand-offwhite to image container
- [X] **8.3** Alpha Classic pages: PDF download now black pill button in Care & Maintenance header

### Alpha Classic AK Cushion
- [X] **8.4** Standard Configuration disclaimer added to overview

### Alpha Classic AK Locking
- [X] **8.5** Standard Configuration disclaimer added to overview

### Alpha Classic BK Cushion
- [X] **8.6** Standard Configuration disclaimer added to overview

### Alpha Classic BK Locking
- [X] **8.7** Standard Configuration disclaimer added to overview

### EasyLiner
- [X] **8.8** Standard Configuration disclaimer added to overview

### General Purpose Liner
- [X] **8.9** Technology section removed
- [X] **8.10** Suspension Options section removed

---

## 9. New Products — Care & Accessories

### SL108 — Prosthetic Skin Lotion (32oz)
- [X] **9.1** Add to Shopify — Price: $16.80
- [X] **9.2** Create product page with 3 anchor sections: Overview, Features, Care & Maintenance
- [X] **9.3** Source content from:
  - Amputee Store: https://amputeestore.com/collections/amputee-skin-care/products/alps-silicone-skin-lotion?variant=4114714497
  - SPS: https://www.spsco.com/by-product-type/patient-aids/skin-care/lotion/prosthetic-skin-lotion-for-sensitive-skin-32oz-bottle.html

### PO840 — Prosthetic Ointment with Vitamins A & D (4oz)
- [X] **9.4** Add to Shopify — Price: $27.73
- [X] **9.5** Create product page with 3 anchor sections: Overview, Features, Care & Maintenance
- [X] **9.6** Source content from:
  - Amputee Store: https://amputeestore.com/products/alps-prosthetic-ointment
  - SPS: https://www.spsco.com/alps-prosthetic-ointment-with-vitamins-a-and-d-4oz-tube.html

---

## 10. Resources / Knowledge Base

### Global
- [X] **10.1** Rename to "Knowledge Base" everywhere (see 1.2)
- [X] **10.2** Remove bracket text before category names (if present)
- [X] **10.3** Tags: activate tag clicking — click a tag → navigate to filtered list of articles with that tag
- [X] **10.4** Add search functionality to Knowledge Base
- [X] **10.5** "View All" button: wire up to show chronological feed of all resources (or update per search feature)

### Latest Section
- [X] **10.6** Darken publish date text (too light to notice initially)

### Category Pages
- [X] **10.7** Remove resource count from category cards
- [X] **10.8** Rename "Performance & Recovery" → "Health & Performance"
- [X] **10.9** Add new category: "Amputation & Recovery" — move recovery-focused content here (e.g. "First 30 Days" type articles)
- [X] **10.10** Category pages should surface articles with recency/value structure (replicate landing page Latest section UX)

### Article/Resource Pages
- [X] **10.11** Add "Related Articles" section below article content (based on same category/tags)
- [ ] **10.12** External links should be posted as articles with context (e.g. the ICRC PDF should have an article wrapper, not just link out). Standardize approach.
- [X] **10.13** Can category label on cards be clickable? (links to that category page)

---

## 11. Shopify / Catalog Updates

### From Updated Catalog (April 8, 2026)
- [X] **11.1** Sleeves: sizes in Shopify are 1/2/3 (NOT S/M/L) — Alex kept the numeric sizing. Revert chart if we changed it.
- [X] **11.2** Accessories: Add SL108 (Lotion, $16.80) and PO840 (Ointment, $27.73)
- [X] **11.3** All pricing confirmed in catalog — verify Shopify matches
- [X] **11.4** Shopify payments: Alex to set up Shopify Payments (payment processor)

---

## 12. April 9 Additional Notes (from Alex)

### General UX
- [ ] **12.1** "Shop" label reconsideration — Alex considering "Marketplace" or "AmpuMe Store" (leaning toward "AmpuMe Store"). Awaiting final decision. Would need renaming across nav, tiles, proof section, breadcrumbs, etc.

### Homepage
- [ ] **12.2** Hero banner: remove white line/glare on the bottom of the woman's socket
- [ ] **12.3** Pre-tile copy: Alex still owes copy (same as 2.2)
- [ ] **12.4** Telehealth tile: knee image doesn't look representative of actual devices. Alex can provide reference images if needed.
- [ ] **12.5** Knowledge Base tile: include at least one image featuring an upper extremity amputee. Alex thinks this tile is the right place.

### Proof of Platform
- [ ] **12.6** Sleeves card: center the sleeve image. Hand positioning looks slightly artificial.
- [ ] **12.7** Socks card: similar issue — doesn't show a natural way of pulling up a sock.
- [ ] **12.8** Knowledge Base section: two "After Amputation" articles currently. Replace one with a Health & Performance piece — use the Adaptive Fitness article. Needs updated cover image.
- [ ] **12.9** Ask Anything preset questions (REPLACES 2.13 — no longer blocked):
  - "What should I do if my residual limb volume is fluctuating?"
  - "How often will my insurance cover a new socket?"
  - "How do I cope with the emotional side of limb loss?"
  - "How often should I replace my liner?"

### Knowledge Base Page
- [ ] **12.10** Banner image: shift so we can see the full bench and the bottom of her foot

---

## 13. Blocked / Waiting on Alex

- [ ] Alex to provide mission/intro copy for pre-tile section (2.2 / 12.3)
- [ ] Alex to decide on "Shop" vs "AmpuMe Store" vs "Marketplace" renaming (12.1)
- [ ] Alex to decide on pre-footer section (2.14)
- [ ] Alex to approve "Ask AmpuMe" rename (currently deployed, was "AI Support") (4.1)
- [ ] Alex to set up Zapier + Google Sheets for contact form (3.4)
- [ ] Alex to set up Shopify Payments (11.4)
- [ ] Alex to procure physician partners for telemedicine (5.x)
- [ ] Alex to provide telemedicine clinician data for page build
- [ ] Alex to provide reference images for telehealth tile if needed (12.4)
- [ ] Alex to provide upper extremity amputee image reference for KB tile (12.5)
