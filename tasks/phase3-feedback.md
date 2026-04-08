# Phase 3 Feedback — Task List (April 8, 2026 Call + Notes + Catalog)

---

## 1. Global / Navigation

- [ ] **1.1** Add "Telemedicine" to main navigation
- [ ] **1.2** Rename "Resources" → "Knowledge Base" across ALL instances (nav, tiles, proof of platform, breadcrumbs, page headings, etc.)
- [ ] **1.3** Page scroll direction: currently bottom→top on navigation clicks, update to top→bottom
- [ ] **1.4** Breadcrumb on Contact page is hardcoded "Back to Shop" — make dynamic (return to previous page, same behavior as Insurance form breadcrumb)

---

## 2. Homepage

### Hero
- [ ] **2.1** Update headline: "Life WITH limb loss" (not "Life AFTER") — inclusive of individuals born with limb difference

### Pre-Tile Section
- [ ] **2.2** Alex to provide copy for a mission/intro section between hero and platform tiles — add it back once copy received

### Platform Tiles
- [ ] **2.3** Tile height: may be too tall on smaller screens (13.3"). Evaluate reducing height on smaller viewports.
- [ ] **2.4** Telehealth tile: remove the reflection/glare artifact from the image
- [ ] **2.5** Telehealth tile: fix framing/cropping on mobile — image is cut off
- [ ] **2.6** Shop tile image: center the image (currently off-center compared to other tiles)
- [ ] **2.7** Prosthetist feedback on category tile images:
  - Sock image: sock should reach above the knee
  - Sleeve image: sleeve should reach to the thigh

### Proof of Platform
- [ ] **2.8** "Prosthetic Essentials" → "Shop Prosthetic Essentials"
- [ ] **2.9** "Expert Guidance" → "Knowledge Base" (consistent renaming)
- [ ] **2.10** Resource preview cards: link to the specific article/resource (deep link, not just /resources)
- [ ] **2.11** Resource preview cards: add publish date
- [ ] **2.12** Resource preview: Alex to provide which 3 articles/resources to feature
- [ ] **2.13** AI Support "Ask Anything" section: Alex to provide preset questions (current ones may change)
- [ ] **2.14** Pre-footer section: Alex on the fence about adding newsletter or something back between AI section and footer — awaiting decision

---

## 3. Contact Page

- [ ] **3.1** Header: keep as-is
- [ ] **3.2** Subtext: update from e-commerce focus to broader: "Have a question about products, clinical care, or using AmpuMe? Send us a message and our team will get back to you shortly."
- [ ] **3.3** Breadcrumb: make dynamic (see 1.4)
- [ ] **3.4** Form backend: currently MailerLite — switch to Zapier → Google Sheets + email notification to Alex
  - Alex to set up Zapier account connection + Google Sheets
  - Fields → Google Sheet row + email with form data to Alex

---

## 4. AI Support Page

- [ ] **4.1** Rename section — "AI Support" evokes customer support. Find a better name. Discussed options: "Start a Conversation", or something else. TBD.
- [ ] **4.2** Response formatting: codes showing (e.g. `**bold**` instead of rendered bold). Fix markdown rendering.
- [ ] **4.3** Response anchoring: currently auto-scrolls to bottom of response. Instead, anchor at the TOP of the response so user reads top-down without scrolling up.
- [ ] **4.4** Chat stalling: occasionally the chat hangs with typing indicator and never responds. Add timeout detection → show error message with "try again" option.
- [ ] **4.5** "New Conversation" button: make it more prominent/visible (Alex missed it initially)
- [ ] **4.6** Future: add Shopify knowledge base to CustomGPT so bot can help with product selection (post-launch)

---

## 5. Telemedicine Page (NEW — Pre-Launch)

### Gate / Modal
- [ ] **5.1** When user clicks Telemedicine tile or nav link → show page blurred in background with centered modal overlay
- [ ] **5.2** Modal header: "Telemedicine is launching soon"
- [ ] **5.3** Modal subtext: "Get early access with a password, or sign up below to be notified when we go live."
- [ ] **5.4** Modal has two options:
  - Password input + "Enter" button → if correct, remove blur, grant access
  - Email input + "Notify Me" button → show confirmation "You're on the list"

### Page Design (Behind Gate)
- [ ] **5.5** Use existing Liner/Category page template as base layout
- [ ] **5.6** Replace product filters with: State (dropdown) + Appointment Type (dropdown or chip selector)
- [ ] **5.7** Results grid shows clinician/physician partner cards (faces, names) instead of products
- [ ] **5.8** Hero section:
  - Header: "Schedule an appointment with a limb loss specialist today"
  - Subtext: "AmpuMe clinical partners provide functional assessments, liner replacement visits, osseointegration consultations, mental health counseling, and other specialized care."
- [ ] **5.9** Count display: "X clinicians available"
- [ ] **5.10** Empty state when no clinicians match filters
- [ ] **5.11** Appointment types (for filter): functional assessments, liner replacement visits, osseointegration consultations, mental health counseling, other specialized care

---

## 6. Insurance & Coverage Page

- [ ] **6.1** Headline: "Understand Your Insurance and Coverage"
- [ ] **6.2** Subtext: "Get clarity on your benefits, coverage, and what to expect. Our team will review your information and help you understand your options."
- [ ] **6.3** Form headline: "Start Your Coverage Review"
- [ ] **6.4** Form subtext: "Share a few details about your insurance and what you're looking for. Our team will review your benefits and follow up with clear next steps."
- [ ] **6.5** Submit button: "Check My Coverage"
- [ ] **6.6** Add bridge section between FAQs and articles:
  - Header: "From Our Knowledge Base"
  - Subtext: "Explore guides and resources to better understand insurance, coverage, and the claims process."

---

## 7. Shop Page

- [ ] **7.1** Remove product count from category tiles
- [ ] **7.2** Socks tile image: update so sock reaches above the knee
- [ ] **7.3** Sleeves tile image: update so sleeve reaches to the thigh
- [ ] **7.4** Care & Accessories tile: love the image but framing needs fixing (ambiguous content — could be confused for something else)

---

## 8. Product Pages (All)

- [ ] **8.1** Default variant selection: select the variant furthest to the LEFT (not middle or random)
- [ ] **8.2** Sizing guide background colors: make consistent across all products
- [ ] **8.3** Alpha Classic pages: PDF download still not prominent enough — make it pop more

### Alpha Classic AK Cushion
- [ ] **8.4** Add to bottom of Overview: "Standard Configuration: This liner is sold with Spirit fabric and Buff color. Alternate fabric or color options may be available by special order—please contact us for assistance."

### Alpha Classic AK Locking
- [ ] **8.5** Add to bottom of Overview: "Standard Configuration: This liner is sold with MAX fabric, Buff color, and a Standard lock size. Alternative fabric, color, or lock options may be available by special order—please contact us for assistance."

### Alpha Classic BK Cushion
- [ ] **8.6** Add to bottom of Overview: "Standard Configuration: This liner is sold with Buff color and a Uniform profile. Alternative color or profile options may be available by special order—please contact us for assistance."

### Alpha Classic BK Locking
- [ ] **8.7** Add to bottom of Overview: "Standard Configuration: This liner is sold with Buff color, Uniform profile, and a Standard lock size. Alternative color, profile, or lock options may be available by special order—please contact us for assistance."

### EasyLiner
- [ ] **8.8** Add to bottom of Overview: "Standard Configuration: This liner is sold with a Uniform profile. Tapered profile options may be available by special order—please contact us for assistance."

### General Purpose Liner
- [ ] **8.9** Remove "Technology" section (gel technology / fabric technology)
- [ ] **8.10** Remove "Suspension Options" section (cushion/locking — already shown in variant pills)

---

## 9. New Products — Care & Accessories

### SL108 — Prosthetic Skin Lotion (32oz)
- [ ] **9.1** Add to Shopify — Price: $16.80
- [ ] **9.2** Create product page with 3 anchor sections: Overview, Features, Care & Maintenance
- [ ] **9.3** Source content from:
  - Amputee Store: https://amputeestore.com/collections/amputee-skin-care/products/alps-silicone-skin-lotion?variant=4114714497
  - SPS: https://www.spsco.com/by-product-type/patient-aids/skin-care/lotion/prosthetic-skin-lotion-for-sensitive-skin-32oz-bottle.html

### PO840 — Prosthetic Ointment with Vitamins A & D (4oz)
- [ ] **9.4** Add to Shopify — Price: $27.73
- [ ] **9.5** Create product page with 3 anchor sections: Overview, Features, Care & Maintenance
- [ ] **9.6** Source content from:
  - Amputee Store: https://amputeestore.com/products/alps-prosthetic-ointment
  - SPS: https://www.spsco.com/alps-prosthetic-ointment-with-vitamins-a-and-d-4oz-tube.html

---

## 10. Resources / Knowledge Base

### Global
- [ ] **10.1** Rename to "Knowledge Base" everywhere (see 1.2)
- [ ] **10.2** Remove bracket text before category names (if present)
- [ ] **10.3** Tags: activate tag clicking — click a tag → navigate to filtered list of articles with that tag
- [ ] **10.4** Add search functionality to Knowledge Base
- [ ] **10.5** "View All" button: wire up to show chronological feed of all resources (or update per search feature)

### Latest Section
- [ ] **10.6** Darken publish date text (too light to notice initially)

### Category Pages
- [ ] **10.7** Remove resource count from category cards
- [ ] **10.8** Rename "Performance & Recovery" → "Health & Performance"
- [ ] **10.9** Add new category: "Amputation & Recovery" — move recovery-focused content here (e.g. "First 30 Days" type articles)
- [ ] **10.10** Category pages should surface articles with recency/value structure (replicate landing page Latest section UX)

### Article/Resource Pages
- [ ] **10.11** Add "Related Articles" section below article content (based on same category/tags)
- [ ] **10.12** External links should be posted as articles with context (e.g. the ICRC PDF should have an article wrapper, not just link out). Standardize approach.
- [ ] **10.13** Can category label on cards be clickable? (links to that category page)

---

## 11. Shopify / Catalog Updates

### From Updated Catalog (April 8, 2026)
- [ ] **11.1** Sleeves: sizes in Shopify are 1/2/3 (NOT S/M/L) — Alex kept the numeric sizing. Revert chart if we changed it.
- [ ] **11.2** Accessories: Add SL108 (Lotion, $16.80) and PO840 (Ointment, $27.73)
- [ ] **11.3** All pricing confirmed in catalog — verify Shopify matches
- [ ] **11.4** Shopify payments: Alex to set up Shopify Payments (payment processor)

---

## 12. Blocked / Waiting on Alex

- [ ] Alex to provide mission/intro copy for pre-tile section (2.2)
- [ ] Alex to choose which 3 articles to feature in proof of platform (2.12)
- [ ] Alex to provide preset AI questions for homepage (2.13)
- [ ] Alex to decide on pre-footer section (2.14)
- [ ] Alex to decide on AI section rename (4.1)
- [ ] Alex to set up Zapier + Google Sheets for contact form (3.4)
- [ ] Alex to set up Shopify Payments (11.4)
- [ ] Alex to procure physician partners for telemedicine (5.x)
- [ ] Alex to provide telemedicine clinician data for page build
