# Phase 3 Scope — AmpuMe (Complete Detail)

---

## A. Homepage Overhaul

### General UX
- [x] A1. Banner/hero responsiveness (half-screen widths)
- [x] A2. Remove copy section between hero banner and tiles
- [x] A3. Remove copy section between tiles and footer

### Hero
- [x] A4. Remove "Subscribe" and "Stay Updated" CTAs
- [x] A5. Headline: "The all-in-one platform for life with limb loss."
- [x] A6. Supporting copy: "Explore practical resources, expert guidance, prosthetic essentials, and a growing community — all in one place."
- [x] A7. CTA: "Explore AmpuMe" (anchor scrolls to tiles)

### Tiles
- [x] A8. Tile 1 — Tag: Ask, Label: Ask Anything, Copy: "Trusted answers about prosthetics, care, and daily life — powered by AI trained on expert resources.", CTA: Ask
- [x] A9. Tile 2 — Tag: Shop, Label: Shop Prosthetic Essentials, Copy: "Liners, sleeves, socks, and everyday prosthetic essentials — delivered directly to you.", CTA: Shop
- [x] A10. Tile 3 — Tag: Learn and Connect, Label: Knowledge Hub, Copy: "Articles, expert guidance, and community resources for life with limb loss.", CTA: Explore
- [x] A11. Tile 4 — Tag: Care, Label: Telehealth, Copy: "Connect with doctors, prosthetists, and therapists who specialize in limb loss.", CTA: Join Waitlist, Image: Update to telehealth scenario

### Proof of Platform Sections
- [ ] A12. Shop Preview: display 3 product cards — Alpha Classic Cushion Liner, Suspension Sleeve, Performance Prosthetic Socks (NOTE: March 26 call — Alex said don't use sock image, use a personal aid product instead. Alex owes replacement product details. Also said liner and sleeve images look good.)
      CTA: "Browse Shop"
- [ ] A13. Resource Library Preview: replace placeholder with actual resource content previews. CTA: "Explore Resources"
- [ ] A14. AI Support Preview: Copy "Ask questions about prosthetics, care, and daily life — and get clear answers instantly." Include chat UI screenshot + example prompts: "How often should I replace my liner?", "Why is my residual limb irritated?", "What does Medicare cover for prosthetics?". CTA: "Try AI Support"
      Reference examples: Notion, Slack, Webflow, Headspace proof-of-platform sections

### Footer & Nav
- [x] A15. Remove social links from footer (for now)
- [x] A16. Remove "Home" from sub-page navigation (logo = home) — per call: "I'm pretty used to going to the logo to get back or hitting the back button"

---

## B. Shop Landing Page

### Hero/UX
- [x] B1. Change "Less info" → "Close"
- [x] B2. Navigation: back button on insurance/resources pages should return user to previous page, not always /resources. Same issue on Prosthetic Liners page.

### Category Tiles
- [x] B3. Prosthetic Liners — Supporting copy: "Prosthetic liners designed for comfort, protection, and secure fit."
- [x] B4. Sleeves — Update image (currently AK, should reflect BK use). Supporting copy: "Prosthetic sleeves designed to maintain suspension and keep your prosthesis secure and comfortable."
- [x] B5. Socks — Supporting copy: "Prosthetic socks designed to help manage limb volume and maintain a comfortable fit."
- [x] B6. Rename "Accessories" → "Care and Accessories". Update image (Alex referenced stump spray/antiperspirant inspo). Supporting copy: "Care products and maintenance essentials to support skin health and prosthetic hygiene."

---

## C. Product Pages — Global

### All Liner Product Pages
- [ ] C1. Add sizing charts and measurement images into product image galleries
- [x] C2. Size order: smallest → largest (all products)
- [x] C3. Naming consistency between variant pills and size guide labels (Alex said: spell it out in size guide, abbreviate in pills is OK)
- [x] C4. Center "between sizes" copy
- [x] C5. Alternate section backgrounds (grey/white) — changed Care & Maintenance from grey to white
- [x] C6. Insurance coverage note under "Add to Cart" linking to insurance inquiry section
- [ ] C7. Brand filter: remove or convert to dropdown (to avoid long list in future). Per call, agreed to remove for now.

### Alpha Classic AK & BK (Both)
- [x] C8. Move PDF instructions into Care & Maintenance section (not floating at bottom) — was already inside C&M

### Alpha Classic AK Specific
- [x] C9. Short description: "Designed for above-knee prosthetic users, the Alpha Classic liner provides enhanced distal protection and adaptive pressure management for a comfortable, secure fit. A thicker gel profile at the distal end helps cushion sensitive anatomy, while the gel tapers proximally to maintain flexibility and ease of movement."

### Alpha Classic BK Specific
- [x] C10. Short description: "Designed for below-knee prosthetic users, the Alpha Classic liner uses a skin-friendly gel with mineral oil and Vitamin E to deliver comfort and protection. The gel adapts to changing socket pressures while maintaining shape, supporting a consistent fit and dependable performance."
- [ ] C11. Fabric variant section: add tooltip explaining fabric options AND/OR link to dedicated fabric explanation section
- [ ] C12. Consider moving fabric section higher on page (before sizing, per call — "Probably before sizing and fit... because it's purchase dependent")
- [ ] C13. Add "Fabric" anchor link to the anchor bar (for products where fabric is an option)
- [x] C14. Remove "Choose Your Fabric" label → "Fabric Options"
- [ ] C15. Product gallery: remove third product image — THIS IS FOR ALPHA CLASSIC BK products specifically. Alex said "This image is not applicable. This one you can remove." while looking at Willowwood BK product page. The third image is for a different product/profile.

### EasyLiner
- [ ] C16. Rename to: "EasyLiner Above and Below Knee Prosthetic Liner"
- [x] C17. Short description: "Designed for both above-knee and below-knee prosthetic users, the EasyLiner provides comfort, skin protection, and dependable suspension. Engineered with a soft gel interface and durable outer fabric, it helps distribute pressure evenly while enhancing socket fit and everyday wear."
- [x] C18. Default dropdown → "Select a size"
- [ ] C19. Sizing: only one measurement (6 cm above distal end) — remove the second measuring tape from sizing visuals
- [ ] C20. Consider separate AK/BK sizing visuals (Alex: "I'm wondering if there should be two images here, one for AK and one for BK. It's actually the same measurement... but I sort of like this.")

### ALPS General Purpose Liner
- [ ] C21. Rename to: "ALPS General Purpose Above and Below Knee Prosthetic Liner"
- [x] C22. Short description: "Designed for both above-knee and below-knee prosthetic users, the ALPS General Purpose Prosthetic Liner provides comfortable socket fit, reliable suspension, and adaptable cushioning. Made with ALPS Grip Gel, the liner ensures optimum adhesion while comfortably conforming to the shape of the residual limb."
- [ ] C23. Sizing: same updates as EasyLiner (one measurement, remove second tape, consider AK/BK visuals)
- [ ] C24. Alex noted: "Can we tell people up here what these things mean?" about the fabric variant selector. Wants either inline explanation or link to fabric section.

---

## D. Prosthetic Socks — New Product Pages

### Landing Page
- [ ] D1. Headline: "Prosthetic Socks"
- [ ] D2. Supporting copy: "Manage socket fit and daily limb volume changes with prosthetic socks designed for comfort and control."

### Products to Add in Shopify
- [ ] D3. Split current socks into two products: "Knit-Rite Socks for Pin Lock Systems" (includes distal hole) and "Knit-Rite Socks for Suction Systems" (airtight seal)

### Product Organization
- [ ] D4. Order variants by: Ply (lightweight/1-ply → 3-ply → 5-ply), then Size (small → large)
- [ ] D5. Lightweight = 1-ply, put first

### Product Page Structure (applies to both sock products)
- [ ] D6. Sizing & Fit section: align with liner sizing UX and imagery
      - Length guidance BK: 2-3 inches above kneecap
      - Length guidance AK: preference-based (over socket vs within socket)
      - Width/style: structured width sizing instructions + charts for both AK and BK
      - BK measurements: (1) distal end to 2-3" above kneecap for length, (2) 5cm from distal end circumference, (3) circumference around kneecap
      - AK measurements: (1) 5cm from distal end circumference, (2) top of groin circumference
- [ ] D7. Overview copy (provided in doc): "Knit-Rite prosthetic socks help manage daily limb volume changes..." (3 paragraphs)
- [ ] D8. Features (provided in doc): 6 bullet points (3-packs, ply options, lengths/widths, distal hole option, knit construction)
- [ ] D9. Care & Maintenance (provided in doc): application tips (don't overstretch), daily washing instructions, specific detergent/drying guidance. Format for readability with paragraph spacing + bullets.

---

## E. Prosthetic Sleeves — New Product Page

### Landing Page
- [ ] E1. Headline: "Prosthetic Sleeves"
- [ ] E2. Supporting copy: "Suspension sleeves for below-knee prostheses, designed to maintain a secure and comfortable seal."

### Product Page (Ottobock ProFlex)
- [ ] E3. Short description: "The Ottobock ProFlex Suspension Sleeve provides secure suspension and a comfortable fit for prosthetic users. Made with flexible, durable material, it helps maintain socket connection during daily activities."
- [ ] E4. Sizing & Fit: chart + guide (BK only — "it's only for BKs, that's why we're changing the tile image")
- [ ] E5. Overview (provided in doc): 4 paragraphs about ProFlex Plus design, flexible fabric, compatibility with valve/DVS/Harmony, availability in beige
- [ ] E6. Features (provided in doc): 6 bullets (sealing sleeve, flexible fabric, smooth seam, valve/DVS/Harmony compatible, durable, available in black/beige/grey)
- [ ] E7. Care & Maintenance (provided in doc): hand wash with pH-neutral soap at 30°C, don't wring, air dry on rack, remove for several hours daily for skin hygiene, store with packaging foam inserted

---

## F. Resources & Content

### Hub Page
- [x] F1. Hero: spring/fall scene with dress (responsive positioning)
- [x] F2. "Latest Resources" section: featured hero card + 2 secondary cards with thumbnails, dates, shadow
- [x] F3. "Browse by Category" section header
- [x] F4. Blog reference analysis (Stripe, Notion, HelpScout, etc.) — patterns applied
- [x] F5. Pillar mapping verified (all 17 external links correct)

### Content
- [x] F6. Content backfill: 20 articles with cover images across all 5 pillars
- [ ] F7. 3 new resource links — BLOCKED: need URLs from Alex
      - Exercises for Lower Limb Amputees: Basic Gait & Functional Movements
      - The Ultimate Guide for Residual Limb Skin Care
      - Adaptive Fitness with Amy Bream: Strength, Training, and Life as an Adaptive Athlete

### Direction Changes
- [x] F8. Current format felt "static" → added dynamic Latest section
- [ ] F9. AI blog content agent — DEFERRED to post-Phase 3 (backfill quality review first)

---

## G. AI Support Page

### Minor Updates (from FSR2-2 doc and call)
- [ ] G1. Remove the chat widget/watermark at bottom of page (Alex: "let's remove this little widget down here")
- [ ] G2. Design an avatar image for the chat interface
- [ ] G3. Explore CustomGPT API for custom frontend (remove embed entirely, build our own UI)
      - Alex to provide API key or team member access
      - Brennan to investigate what the API allows
      - If API supports send/receive messages, build custom chat UI
      - Goal: remove CustomGPT branding/watermark, full design control
- [ ] G4. Longer list of suggested prompts/questions (Alex: "it'd be nice to have a little bit of a longer list" of default questions)
- [ ] G5. Consider removing page heading, make it more seamless (Brennan: "if anything we get rid of the heading and just make it like seamless, like enter your message")

---

## H. Other UX Items

- [x] H1. "Home" link removed from sub-page nav (logo = home)
- [x] H2. Mobile hamburger logo size matches main nav
- [ ] H3. Contact page copy update — Alex: "Seems very shop centric, so maybe I'll modify the supporting copy here to be a little broader" (Alex to provide updated copy)

---

## Blockers (Waiting on Alex)
- Replacement product for discontinued personal aid device (for Care & Accessories + shop preview)
- 3 resource URLs for new links
- Content quality references for backfill review
- CustomGPT API key or team member access
- Contact page updated copy
- Sock product split in Shopify (Pin Lock vs Suction) — may need Alex to create in Shopify admin

## Deferred (Post-Phase 3)
- Content agent (autonomous article writer) — see backfill quality first
- Agent features: research, draft, review workflow, approval UI, topic selection ("B2C article about sports bracing", "B2B article for LinkedIn on osseointegration")
