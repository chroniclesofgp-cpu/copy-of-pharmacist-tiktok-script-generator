# BOF Script Generator — Master Creator Analysis
**Date:** April 12, 2026  
**Scope:** 100 TikTok Shop videos — shop content only (personal/lifestyle excluded)  
**Sources:** @momfindsbyfaith (25 popular + 25 latest) · @dealscope (25 popular + 25 latest)

---

## 1. Methodology

All 100 videos were transcribed using `manus-analyze-video`. Only TikTok Shop BOF (Bottom-of-Funnel) content was retained for analysis. Personal lifestyle videos, hauls without deals, and non-shop content were excluded. Transcripts were tagged by:

- **Hook type** (text hook + verbal hook pattern)
- **Deal type** (flash sale, coupon, quantity-unlock, free gift, creator code, liquidation)
- **CTA structure** (how-to sequence)
- **Urgency close formula**
- **Coupon gamification presence**

### Standard Video Analysis Process (All Future Analyses)

This is the required methodology for any TikTok video analysis — creator onboarding, competitor research, coaching video review, or script improvement. **Never rely on TikTok page captions, titles, or metadata as a substitute for watching the actual video.** Captions are SEO/discovery copy and do not reflect what the creator says on camera.

**Step 1 — Download the video:**
```bash
yt-dlp "https://www.tiktok.com/@handle/video/VIDEO_ID" -o "/home/ubuntu/upload/video_name.mp4" --no-playlist
```
This works for any public TikTok video. No login or API key required.

**Step 2 — Transcribe and analyze:**
```bash
manus-analyze-video "/home/ubuntu/upload/video_name.mp4" "Transcribe this TikTok video word for word exactly as the creator speaks. Also note every on-screen text overlay, graphic, diagram, product shot, and study popup that appears. Note the order of everything."
```

**Step 3 — Extract the following from the transcription:**

| Element | What to capture |
|---|---|
| **Spoken hook** | Exact words, first 1–3 seconds |
| **Text hook** | On-screen overlay text in first 3 seconds |
| **Section order** | Hook → authority → education → gap → product reveal → CTA (or variant) |
| **Product reveal timing** | Early (comparison hook) vs. late (TOF curiosity loop) |
| **Pacing** | Approximate seconds per section |
| **On-screen visuals** | Every graphic, diagram, study popup — what it shows and when |
| **Tonality** | Conversational / authoritative / urgent / educational |
| **CTA language** | Exact words, length in seconds |
| **Misdirection or gap lines** | Any lines that correct expectations or open curiosity loops |

**For coaching video analysis (e.g., Coach Ruben breakdowns):**
Download the coaching video file and run the same `manus-analyze-video` command. Ask it to extract both the coach's specific feedback AND the original creator video content being reviewed, including exact line rewrites suggested.

---

## 2. @momfindsbyfaith — Key Findings

### 2.1 Most-Used Hook Types (by frequency in 50 videos)

| Hook | Count | % of Videos |
|---|---|---|
| Reverse Psychology ("Do Not Get This") | 14 | 28% |
| Returning This / Sending Back | 10 | 20% |
| Bundle / Motherload | 9 | 18% |
| Warning / Be Careful | 7 | 14% |
| Deal Alert / Double Discount | 6 | 12% |
| Quantity Math | 4 | 8% |

### 2.2 New Patterns Confirmed (April 2026 latest videos)

**Targeted audience opener (Reverse Psychology variant):**
> "[AUDIENCE] do not get [product] by itself because they just released a [BUNDLE_SIZE]-pack and it's on sale and there's free shipping and some of you even have coupons today."

Examples seen: "Acne girlies", "Dry skin girlies", "Sensitive skin girlies"

**"Please do not overpay" Warning variant:**
> "Please do not overpay for [product A] and [product B]. Because they just put this in a bundle on a flash sale with free shipping."

Seen in Laka lip tint + liner bundle video. Close: "Please don't overpay by getting these separately because that sale price will end soon."

**Quantity Math — "5 or 6 for the same price" framing:**
> "You can get five or six [product] today for the same price. Here's how. Go into TikTok Shop in the shopping cart, add two of the [BUNDLE_SIZE]-packs to your order..."

Confirmed verbatim from Medicube pads video.

**"Not one, not two, not three..." Bundle emphasis:**
> "Not one, not two, not three, not four, not five. You're getting all [quantity] of these today on a major discount and there's fast and free shipping and some of you even have coupons."

**Signature close (very-high frequency, confirmed across 8+ latest videos):**
> "That sale price makes it the best deal today. I'll drop the link right here. Grab it before it's gone."

### 2.3 Coupon Gamification — Universal Pattern

Coupon gamification appears in **92% of Faith's shop videos**. The core formula:

> "Some of you even have coupons today. Not everyone sees those coupons and it's for a limited time so you'll have to go to checkout to see if you have one."

Shorter variant (very-high frequency):
> "And some of you even have coupons today, so tap that cart to see if you have one."

**Key insight:** Faith never confirms a coupon exists — she uses conditional language ("some of you", "not everyone sees") to drive checkout clicks without making a false promise.

### 2.4 CTA Structure — Faith Standard

1. "Tap the orange cart" / "When you tap that cart"
2. "activate a major flash sale and fast and free shipping"
3. Coupon gamification line
4. Urgency close

Faith almost never mentions a creator code. She relies entirely on the TikTok Shop flash sale + coupon stack.

### 2.5 Returning This — Confirmed Structure

**Variation A (6 of 10 videos):** Reviews opener → negative list ("It's not because...") → pivot to bundle → coupon gamification → "Don't be like me" close

**Variation B (4 of 10 videos):** Direct return opener → negative list → price drop reveal → coupon gamification → "Don't be like me" close

The "Don't be like me" close is present in **100% of Returning This videos**:
> "So don't be like me and overpay by getting these separately because that sale price makes it the best deal today. If you still see that cart, I would run before it disappears."

---

## 3. @dealscope — Key Findings

### 3.1 Most-Used Hook Types (by frequency in 50 videos)

| Hook | Count | % of Videos |
|---|---|---|
| Comparison / Upgrade ("Do Not Buy Small One") | 16 | 32% |
| Reverse Psychology ("Do Not Buy X Pack") | 12 | 24% |
| TikTok Glitch | 8 | 16% |
| Deal Alert / Triple Discount | 7 | 14% |
| Bundle / Quantity Math | 7 | 14% |

### 3.2 New Patterns Confirmed (April 2026 latest videos)

**"Do not buy the small one" — Comparison Upgrade (very-high frequency):**
> "Do not buy the small [product]. Get this big one instead. It's the same price right now."

Confirmed across Cosrx, Mungboon, Beauty of Joseon, and 10+ other products.

**"Do not buy this X-pack" — Reverse Psychology quantity upgrade:**
> "Do not buy this [X]-pack of [product] cause right now you can actually get double for almost the same price. This is how."

Confirmed verbatim from Goli 3-pack video and multiple others.

**Liquidation sale framing (Deal Alert variant):**
> "How is this less than [price]? Because [brand] is having their liquidation sale today and it ends at midnight."

Seen in multiple Dealscope latest videos. Always paired with: "To take advantage, just click right here and add [quantity] to your order."

**CREATORPICK code — confirmed as Dealscope's primary creator code:**
> "Type in code CREATORPICK in all capital letters."

Present in **~60% of Dealscope's latest videos** as a fallback when no TikTok coupon is available.

**Coupon stack description (confirmed verbatim):**
> "One is $10 off and one is 20% off and it stacks up on top of the sale."

### 3.3 CTA Structure — Dealscope Standard

1. "Step one, tap the orange cart and add [X] to your order" / "Just click right here, add [X] to your order"
2. "Use all the TikTok coupons located on the deals tab"
3. "If you have no coupons, type in code CREATORPICK in all capital letters"
4. Urgency close

### 3.4 Urgency Close — Dealscope Signature

Primary close (very-high frequency, confirmed across 15+ latest videos):
> "Hurry up and get it. Do not miss out."

Secondary close:
> "Hurry up and get it before it's too late."

Timer-specific close (only when countdown visible):
> "Hurry up and get it because the timer's about to end."

Liquidation close:
> "Do not miss out. Hurry up and get it. The sale is about to end tonight."

---

## 4. Cross-Creator Patterns

### 4.1 Universal CTA Elements

Both creators always include:
- A cart-tap instruction as the primary CTA
- A coupon mention (Faith: gamification; Dealscope: explicit stack)
- An urgency close with time pressure

### 4.2 Creator Voice Differences

| Element | @momfindsbyfaith | @dealscope |
|---|---|---|
| Tone | Warm, conversational, "mom friend" | Direct, deal-focused, fast-paced |
| Hook style | Emotional/relational ("don't be like me") | Tactical/logical ("same price right now") |
| Coupon framing | Gamification ("some of you have coupons") | Explicit stack ("$10 off + 20% off") |
| Creator code | Never used | CREATORPICK (very-high frequency) |
| Close formula | "Before they raise the price" / "I would run" | "Hurry up and get it. Do not miss out." |
| BOF+ hooks | Returning This, Bundle/Motherload | Bundle/Motherload only |

### 4.3 Deal Type Frequency

| Deal Type | Faith | Dealscope |
|---|---|---|
| Flash sale | 96% | 88% |
| Coupon | 92% | 84% |
| Free shipping | 90% | 76% |
| Quantity unlock | 40% | 72% |
| Free gift | 28% | 12% |
| Creator code | 0% | 60% |
| Liquidation | 0% | 16% |

---

## 5. Template Bank Updates (April 2026)

### Added to VERBATIM_TEMPLATES

- `reverse-psychology`: Faith targeted audience variant ("Acne girlies do not get...")
- `reverse-psychology`: Dealscope quantity upgrade variant ("Do not buy this X-pack")
- `deal-alert`: Dealscope liquidation sale template ("How is this less than $X?")
- `deal-alert`: Dealscope triple discount with CREATORPICK code

### Added to HYBRID_BOOKENDS

- `warning-be-careful`: Faith "Please do not overpay" variant
- `warning-be-careful`: Dealscope "Do not buy the small one" variant
- `bundle-motherload`: Faith "Not one, not two..." quantity emphasis variant
- `bundle-motherload`: Faith "So do not wait until they raise the price" close
- `comparison-upgrade`: Dealscope "same price right now" variant
- `quantity-math`: Faith "5 or 6 for the same price" variant

### Added to SHARED_URGENCY_CLOSES

- "The sale ends soon and you don't want to miss it. So tap that cart and add two while you still can." (Faith, very-high)
- "That sale price makes it the best deal today. I'll drop the link right here. Grab it before it's gone." (Faith, very-high)
- "Please don't overpay by getting these separately because that sale price will end soon." (Faith, high)
- "Hurry up and get it. Do not miss out." (Dealscope, very-high — signature close)
- "Hurry up and get it because the timer's about to end." (Dealscope, high)
- "Do not miss out. Hurry up and get it. The sale is about to end tonight." (Dealscope, high)

### Added to SHARED_HOW_TO_LINES

- "Type in code CREATORPICK in all capital letters." (Dealscope, very-high)
- "Use all the TikTok coupons located on the deals tab." (Dealscope, very-high)
- "When you tap that cart, add two of the [BUNDLE_SIZE]-packs to your order, you'll activate a major flash sale and fast and free shipping." (Faith, high)

### Added to SHARED_COUPON_LINES

- "Some of you even have coupons today. Not everyone sees those coupons and it's for a limited time so you'll have to go to checkout to see if you have one." (Faith, very-high)
- "And some of you even have coupons today, so tap that cart to see if you have one." (Faith, very-high)
- "Use all the TikTok coupons located on the deals tab." (Dealscope, very-high)
- "One is $10 off and one is 20% off and it stacks up on top of the sale." (Dealscope, medium)

---

## 6. Test Results

All 165 automated tests pass after the April 2026 update:

```
✓ server/loading.test.ts (18 tests)
✓ server/tiktok.test.ts (50 tests)
✓ server/scriptData.test.ts (38 tests)
✓ server/bof.abtest.test.ts (18 tests)
✓ server/bof.linebank.test.ts (40 tests)
✓ server/auth.logout.test.ts (1 test)
Tests: 165 passed (165)
```

---

## 7. Files Updated

- `client/src/lib/bofLineBank.ts` — Full rebuild with all new verbatim lines
- `analysis/MASTER_ANALYSIS_APR2026.md` — This document

---

*Analysis conducted April 12, 2026. Next recommended re-analysis: July 2026 or when either creator's posting pattern changes significantly.*
