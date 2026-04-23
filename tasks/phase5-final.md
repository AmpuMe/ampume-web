# Phase 5 — Client Review Notes (2026-04-26)

Source: `260423 Notes.docx` (Alex's review after most of the phase-4 edits shipped).

---

## 1. General UX

- [X] **1.1** Enable a $0.01 test transaction
  - Alex to set up a dummy product in Shopify so we can verify the full cart → checkout → capture flow end-to-end.

---

## 2. AmpuMe Store — Product Pages

### 2.1 Easy Liner & General Purpose Liner — "How to Measure" (AK/BK)

- [ ] **2.1.1** Add a helper line directly below the "How to Measure" header:
  - Copy: **"Select Below Knee or Above Knee on the image, then follow the steps below."**
  - Applies only to products that have the AK/BK toggle (currently socks; confirm whether Easy Liner + GP should also expose the toggle here — Alex's framing implies yes).

### 2.2 General Purpose Liner — XL Size Clarification

- [ ] **2.2.1** Add the following line to the product description / overview:
  - Copy: **"XL is available in 3mm thickness only and in a locking configuration. It features a larger umbrella and U-shaped matrix, making it ideal for bariatric patients."**
  - Replaces the placeholder note we were using. Pair with the existing greyed-out XL availability in the chart.

### 2.3 Socks — Size Charts

- [ ] **2.3.1** Label the two sock charts clearly:
  - **"Width Size Chart"** (current Width table)
  - **"Length Size Chart"** (current Length table)
- [ ] **2.3.2** Align styling between the two charts
  - The Length chart currently has bold text in places that the Width chart doesn't; normalise so both charts match visually (same header weight, same row text weight).

---

## 3. Ask AmpuMe — Landing / Chat Page

### 3.1 Headline & Subtext

- [ ] **3.1.1** Replace existing headline with:
  - **"Ask AmpuMe. Get real answers."**
- [ ] **3.1.2** Replace existing subtext with:
  - **"Clear, reliable answers for real life with limb loss — informed by expert guidance and designed for everyday life."**

### 3.2 Sample Questions (replaces current set)

- [ ] **3.2.1** Replace the preset suggestion list with exactly these six, in this order:
  1. What exercises help improve prosthetic walking?
  2. What should I expect after an amputation?
  3. How do I choose the right prosthetic liner?
  4. How do I manage limb volume changes during the day?
  5. How often should I replace my prosthetic liner?
  6. What does Medicare cover for prosthetics?

### 3.3 Product Framing (positioning copy)

- [ ] **3.3.1** Add framing that positions Ask AmpuMe as:
  - A differentiated, domain-specific product (**not** generic AI)
  - Built on: **expert-trained knowledge**, **O&P-specific intelligence**, **real patient needs**
- [ ] **3.3.2** Add the supporting line somewhere prominent on the page:
  - Copy: **"Trained on expert prosthetic knowledge and real-world patient needs."**

### 3.4 UX Enhancement (High Impact) — Category Chips

- [ ] **3.4.1** Add rotating suggestion pills / category chips directly beneath the input:
  - **Care**
  - **Insurance**
  - **Comfort**
  - **Getting Started**
  - Clicking a chip should either pre-filter/pre-seed the prompt with a related question or rotate the 6 sample questions to that category.

### 3.5 Disclaimer (replaces current short version)

- [ ] **3.5.1** Swap current disclaimer for this longer HIPAA-safe version:
  - **"AmpuMe provides informational guidance only and is not a medical provider, medical device, or diagnostic tool. Responses are not medical advice and should not be relied upon for healthcare decisions. Always consult your prosthetist or a qualified healthcare provider."**

### 3.6 Input Field Placeholder

- [ ] **3.6.1** Replace placeholder text with:
  - **"Ask a question or share what's on your mind about your prosthesis, care, or daily life…"**

### 3.7 Visual / Layout Direction

- [ ] **3.7.1** Add a subtle gradient or background color behind the input module so the composer feels anchored (currently just floats on the page).

---

## 4. Open Questions / Nice-to-haves

- [ ] **4.1** Clarify with Alex whether the "Select Below Knee or Above Knee…" helper (2.1.1) should apply to *every* product with a BK/AK measurement image (Alpha Classics etc.) or only EL + GP.
- [ ] **4.2** For the category-chip rotation (3.4.1): confirm whether each chip should map to a pre-written prompt or surface 3–4 questions each on hover/click.
- [ ] **4.3** Confirm where the "Trained on expert prosthetic knowledge…" supporting line should live (directly under headline, in a small badge above the composer, or in the disclaimer region?).
