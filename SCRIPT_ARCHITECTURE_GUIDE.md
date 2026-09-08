# Script Architecture Guide
## Pharmacist TikTok Script Generator — Universal Structural Rules

**Last Updated:** June 1, 2026
**Source:** Cross-creator synthesis of 5 creators, 84 videos, ~$4.3M GMV
**Creators:** rphreviews (23 videos), Riva/@adoseofwellness (22 videos), Drew/@drew.review + @drew.review1 unified (20 videos), Dr. Faith/@faithfuldoc (10 videos), naturo/@naturopathicapothecary1 (9 videos)
**Validation Rule:** Creator counts are sample-scoped. Rules marked **[SAMPLE-SCOPED]** reflect direct transcript review in the analyzed top-performing samples (90-day window); they are not claims about every video a creator publishes. Rules marked **[EXECUTION NOTE]** are replicable techniques with narrower retained source coverage.

---

## Mandatory TikTok Shop Compliance Override — August 17, 2026

This guide documents **conversion architecture observed in creator videos**. It is not a permission source for health, supplement, or beauty claims. For every linked TikTok Shop health, supplement, or beauty script, **[TIKTOK_SHOP_HEALTH_BEAUTY_COMPLIANCE_PREFLIGHT.md](TIKTOK_SHOP_HEALTH_BEAUTY_COMPLIANCE_PREFLIGHT.md) controls** over every older line in this document.

Apply the preflight before using a hook, mechanism, study, visual, product reveal, benefit stack, credential, or CTA. In particular, do not use legacy examples that diagnose a viewer, connect an ingredient paper to a linked-SKU result, portray a medical/appearance transformation, use condition/result visuals, or treat a study screenshot as proof that the linked product will deliver an outcome.

**Claim-strength rule:** Do not weaken a verified product benefit into empty language simply because it is a product claim. Use the **strongest exact wording on the current PDP/package** in the reveal and benefit stack, preserve a screenshot of that wording, and keep the pre-reveal discussion general, non-diagnostic, and non-transformative. For example, if the listing says “helps improve the appearance of dullness and uneven tone,” that exact narrow cosmetic wording is preferable to a vague “tone care” paraphrase; “lightens dark spots,” “replaces the barrier,” or a diagnosis still require their own exact product-level support and remain outside scope when unsupported.

---

## PART 1: UNIVERSAL STRUCTURAL RULES

These rules apply to every script regardless of hook type, product, or creator persona. Deviation from these rules requires explicit justification.

---

### RULE 1: The 55–88% Product Reveal Window **[SAMPLE-SCOPED]**

The specific product (brand name + product name) must not be revealed until 55–88% of the video's runtime has elapsed.

| Creator | Typical Reveal Timing | Top GMV Example |
|---|---|---|
| rphreviews | 65–75% | $97K Nasamine — reveal at 68% |
| Riva | 60–75% | $218K Magnesium — reveal at 63% |
| Drew | 55–70% | $179K Astaxanthin — reveal at 60% |
| Dr. Faith | 55–80% | $279K NMN — reveal at 72% |
| naturo | 65–88% | $216K Astaxanthin — reveal at 79% |

**Why this works:** The education section builds desire and eliminates objections before the product is named. By the time the product appears, the viewer has already concluded they need what the product provides. The product reveal is the answer to a question the viewer is already asking — not a sales pitch they are being subjected to.

**The exception:** The Comparison Hook (`comparison`) names both products at 0:00 as the hook mechanism. This is the only hook type where products are named before the 55% mark. The comparison format uses early product naming as a curiosity device, not a sales device.

**The Symptom Checklist exception:** Transcript-verified Riva and Dr. Faith variants introduce the product after the symptom list and education, approximately 65–75% of runtime. Do not preserve the earlier ~30–40% timing as a universal rule; document the source for any different variant.

---

### RULE 2: Authority Before Product **[SAMPLE-SCOPED]**

The creator's credential must be established before the product is revealed. No exceptions.

**The credential stack (confirmed across all 5 creators):**
1. **Visual credential (0:00):** On-screen badge, overlay, or visual that signals expertise before any words are spoken. This can be a "Doctor Explains" badge, a lab coat, a pharmacy credential overlay, or a naturopath badge.
2. **Verbal credential (0:03–0:10):** "As a pharmacist..." / "As a certified naturopath..." / "As a cancer researcher..." — always in the first 10 seconds.
3. **Credential proof (optional, 0:08–0:20):** A visual document, throwback photo, or institutional signal that proves the credential is real and pre-existing. Examples: pharmacy license popup (Riva), throwback pharmacy photo (rphreviews), lab coat + ID badge (Drew).

**Why this works:** The credential is not decoration — it is the mechanism that converts education into purchase intent. Without the credential, the mechanism section is just information. With the credential, it is a prescription. The viewer's decision to buy is not based on the product's features; it is based on their trust in the person recommending it.

**Credential specificity principle:** Quantified credentials outperform generic ones. "17 years as a pharmacist" is more powerful than "I'm a pharmacist." "Board-certified naturopath" is more powerful than "I know about supplements." Whenever possible, include a specific number (years, certifications, patients seen) in the verbal credential.

---

### RULE 3: Education Occupies 55–75% of Runtime **[SAMPLE-SCOPED]**

The education section (mechanism explanation + problem framing + proof) must occupy the majority of the video's runtime. The product pitch (reveal + proof stack + CTA) should occupy no more than 30–35% of total runtime.

**Runtime distribution template:**

| Section | % of Runtime | Purpose |
|---|---|---|
| Hook (visual + text + verbal) | 5–10% | Stop the scroll, create engagement |
| Credential | 5–8% | Establish authority |
| Problem/Symptom framing | 10–15% | Create desire by naming the pain |
| Mechanism/Education | 30–45% | Build desire, eliminate objections |
| Product reveal | 5–8% | Name the solution |
| Proof stack | 8–12% | Validate the recommendation |
| Objection handling | 5–10% | Remove remaining barriers |
| CTA | 8–12% | Direct the purchase action |

**The exception:** The Minimum Viable Expert Verdict (30–45 second MOF video) compresses the mechanism section to near-zero. This format is only valid for well-known product categories targeting audiences already in buying mode.

---

### RULE 4: Never Mention a Specific Price **[SAMPLE-SCOPED]**

No script should ever name a specific dollar amount. Price creates hesitation. Supply duration creates value perception without triggering price resistance.

**The universal price-avoidance vocabulary:**

| Instead of... | Use... |
|---|---|
| "It's only $39.99" | "An 80-day supply" |
| "You save $15" | "Saving on a 3-month supply" |
| "It's on sale for $29" | "They're running a flash sale right now" |
| "Buy 2 get 1 free" | "When you add two to your cart, it activates a better deal" |

**Supply duration framing examples (verbatim from creators):**
- "This is a 3-month supply" (rphreviews, Drew)
- "80-day supply" (Drew, naturo)
- "4-month supply" (Drew)
- "A 90-day supply at this price" (Riva)

**Why this works:** The viewer's brain processes "80-day supply" as value (a long time, a lot of product) rather than cost. A specific price triggers the mental accounting process — the viewer starts comparing the price to other things they could buy. Supply duration bypasses this process entirely.

---

### RULE 5: The Physical Point-Down CTA Gesture **[SAMPLE-SCOPED]**

At the moment of the CTA, the creator physically points their index finger downward toward where the TikTok Shop link appears on the viewer's screen. This is a behavioral cue — it directs the viewer's physical attention and physical action simultaneously.

**Execution:** The point-down gesture should occur at the exact moment the creator says "I'll link it below" or "tap the orange cart." In 6/20 Drew videos and multiple rphreviews videos, a red graphic arrow appears on screen simultaneously pointing to the same location. The combination of verbal CTA + physical gesture + graphic arrow is the highest-converting CTA execution in the dataset.

**The "orange cart" reference:** Explicitly naming the TikTok Shop orange cart icon ("tap the orange cart below," "click the orange shopping cart") is confirmed via direct transcript review in 4 of 5 creators' analyzed top-performing samples (90-day window). It removes ambiguity about where to tap and serves as a behavioral anchor — the viewer knows exactly what action to take.

---

### RULE 6: Scarcity in Every CTA **[SAMPLE-SCOPED]**

Every CTA must include at least one scarcity or urgency signal. The scarcity must feel genuine — manufactured urgency ("limited time only!") without context is less effective than specific scarcity signals.

**The scarcity vocabulary (by type):**

| Scarcity Type | Example Phrases | Creators |
|---|---|---|
| Stock scarcity | "If you still see it in stock" / "Before it runs out" / "Snag it while they still have it" | All 5 creators |
| Deal scarcity | "They're running a flash sale right now" / "Great deals right now" | All 5 creators |
| Personal urgency | "I would not wait on this one" / "I wouldn't sleep on this" | Riva, Dr. Faith, naturo |
| Season/timing | "Flu season is here" / "Before summer" | rphreviews, Dr. Faith |

**The soft vs. hard close spectrum:**
- rphreviews and naturo use harder closes ("get it now," "don't sleep on this")
- Riva and Dr. Faith use softer closes ("I would grab it," "I wouldn't wait")
- Drew uses deal-focused closes ("flash sale right now," "amazing price")

Match the close style to the creator persona. A warm, patient-counseling persona (Riva, Dr. Faith) should use soft closes. A more authoritative or urgent persona (rphreviews, naturo) can use harder closes.

---

### RULE 7: Quality Proof Anchors **[SAMPLE-SCOPED]**

Every product reveal must be followed by at least 2–3 quality proof anchors. These are specific, verifiable quality claims that eliminate the "is this a real supplement or junk?" objection.

**The standard quality proof stack (confirmed via direct transcript review in 5 of 5 creators' analyzed top-performing samples (90-day window)):**
- "Made in the USA" — appears in 4 of 5 creators' analyzed top-performing samples (90-day window) in the standard scripts
- "Third-party tested" — appears in 4 of 5 creators' analyzed top-performing samples (90-day window) in the standard scripts
- "Non-GMO" — appears in 3 of 5 creators' analyzed top-performing samples (90-day window) in the standard scripts
- "GMP certified" — appears in 3 of 5 creators' analyzed top-performing samples (90-day window) in the standard scripts
- "No fillers / no artificial ingredients" — appears in 4 of 5 creators' analyzed top-performing samples (90-day window) in the standard scripts

**The ingredient label proof (Drew, Dr. Faith, naturo — confirmed via direct transcript review in 3 of 5 creators' analyzed top-performing samples (90-day window)):** Showing the actual supplement facts panel on screen during the quality proof section. This is more powerful than stating quality claims verbally because it provides visual evidence the viewer can pause and read.

**The "how many units sold" social proof (rphreviews, naturo — confirmed via direct transcript review in 2 of 5 creators' analyzed top-performing samples, 90-day window):** Showing the TikTok Shop product card with the units-sold counter. "Over 36,000 sold" is more powerful than "thousands of five-star reviews" because it is a specific, verifiable number.

---

### RULE 8: The PubMed Study Screenshot **[SAMPLE-SCOPED]**

At least 1–2 PubMed or clinical study screenshots must appear during the mechanism section of every educational script. The screenshot does not need to be readable — the visual impression of a scientific paper is sufficient to activate the "this is backed by science" trust signal.

**Volume by creator:**
- Drew: 8–15 study screenshots per video (the "PubMed Wall" — highest volume in dataset)
- rphreviews: 2–4 study screenshots per video
- Riva: 2–4 study screenshots per video
- Dr. Faith: 1–3 study screenshots per video
- naturo: 1–3 study screenshots per video

**The minimum viable implementation:** 1 PubMed screenshot displayed for 2–3 seconds during the mechanism section is sufficient to activate the science-backed trust signal. More is better, but 1 is the floor.

**Study selection:** The study does not need to be about the exact product — it needs to be about the key ingredient or mechanism. A study on "astaxanthin and antioxidant activity" is sufficient for an astaxanthin supplement video.

---

## PART 2: OBJECTION HANDLING ARCHITECTURE

Every script must pre-emptively handle 2–4 objections before the CTA. The objections should be addressed in the order they arise in the viewer's mind — not in the order they are convenient to answer.

---

### The Standard Objection Stack (confirmed via direct transcript review in 4 of 5 creators' analyzed top-performing samples (90-day window), or more where retained source coverage supports it)

**Objection 1: "Does this actually work?" (Mechanism objection)**
Handle in the education section. The mechanism explanation IS the objection handle — by explaining how the ingredient works at a biological level, the creator eliminates the "is this snake oil?" objection before the viewer consciously raises it.

**Objection 2: "Is this a quality product?" (Quality objection)**
Handle immediately after the product reveal with the quality proof stack (Made in USA, third-party tested, no fillers, GMP certified). This objection is most active in the 5–10 seconds after the product is named.

**Objection 3: "Is this safe for me?" (Safety objection)**
Handle with contraindications and interactions. "If you're on blood thinners, check with your doctor first." This objection handle is counterintuitive — it seems like it would reduce conversions, but it increases trust by demonstrating responsible practice. Confirmed in Drew (11/20 videos), Dr. Faith (7/10 videos), Riva (8/22 videos).

**Objection 4: "Why can't I just get this at a pharmacy/Amazon?" (Availability objection)**
Handle with the TikTok Shop exclusivity or deal angle. "You can get this on Amazon, but TikTok Shop has the better deal right now." Or: "I always recommend buying from TikTok Shop because you can see the reviews right there." Confirmed in rphreviews, naturo, Riva.

---

### Advanced Objection Handling Techniques

**The Competitive Moat Objection Handler [EXECUTION NOTE — Riva, rphreviews, Dr. Faith — 3/5]**

After the product reveal, warn the viewer about low-quality competitors: "Be careful — [ingredient] is getting really popular and there are a lot of companies selling inferior versions. This is the only brand I trust because [specific quality reason]."

This technique accomplishes three things simultaneously:
1. It pre-empts the "I'll just find a cheaper version" objection
2. It creates fear of the wrong product (which is stronger than desire for the right one)
3. It makes the TikTok Shop link the only safe purchase option

Timing: Immediately after the product reveal, before the proof stack. Duration: 8–12 seconds.

**The "Not Your Fault" Absolution Bridge [EXECUTION NOTE — Riva, Dr. Faith, naturo — 3/5]**

Before the product reveal, explicitly tell the viewer: "This is not your fault." Used in videos targeting conditions with lifestyle implications (weight gain, fatigue, hair loss, aging). Removes shame and guilt as barriers to supplement purchase.

Verbatim examples:
- "If you've been struggling with [condition], it's not your fault — your body is missing [ingredient]." (Riva pattern)
- "You didn't cause this — your body just needs more [ingredient] than food can provide." (Dr. Faith pattern)

Timing: End of the problem section, immediately before the product reveal. Duration: 5–8 seconds.

**The "Bait and Switch" Trust Architecture [EXECUTION NOTE — Dr. Faith — 1/5, highest-ceiling technique]**

After introducing the product early (0:07–0:15), immediately back off: "I'll help you regardless of which brand you bought." Deliver 60–90 seconds of brand-agnostic education. Return to the specific product for the close.

This is the most sophisticated trust-building technique in the dataset. By demonstrating that the creator is not exclusively motivated by commission, it dramatically lowers the viewer's sales resistance. When the creator returns to the specific product at the close, the recommendation feels like genuine advice rather than a pitch.

Timing: Product named early (first 15 seconds), withdrawal immediately after naming, brand-agnostic education for 60–90 seconds, return to specific product at 70–80% mark.

**The "Trojan Horse" Objection Handle [EXECUTION NOTE — naturo — 1/5]**

Addresses the "I already tried this and it didn't work" objection by framing past failure as a product quality problem, not an ingredient problem: "If you tried [ingredient] before and didn't see results, it's because most [ingredient] products on the market are underdosed or use the wrong form."

This technique is distinct from the Right-Way hook — it is used mid-video as an objection handle, not as the opening hook. It reactivates viewers who have already dismissed the product category.

---

## PART 3: MID-VIDEO RETENTION ARCHITECTURE

---

### Visual Interrupt Cadence **[SAMPLE-SCOPED]**

Every 3–5 seconds, a new visual element must appear on screen. The screen should never be static for more than 5 seconds during the education section.

**The visual interrupt toolkit (in order of frequency across all 5 creators):**
1. Text overlay (new claim or key term) — appears every 3–5 seconds in all 5 creators
2. PubMed study screenshot — appears 1–15 times per video
3. Product image or ingredient visual — appears 1–3 times per video
4. Review cluster (3–5 star reviews in rapid succession) — appears in 4 of 5 creators' analyzed top-performing samples (90-day window)
5. Infographic or diagram — appears in 3 of 5 creators' analyzed top-performing samples (90-day window)
6. Nutrient comparison chart — appears in 3 of 5 creators' analyzed top-performing samples (90-day window) (e.g., "23x more iron than spinach")
7. Pill/capsule close-up in palm — appears in 2 of 5 creators' analyzed top-performing samples (90-day window) (Drew, Dr. Faith)

**The "pill reveal" retention technique [EXECUTION NOTE — Drew, Dr. Faith — confirmed via direct transcript review in 2 of 5 creators' analyzed top-performing samples, 90-day window]:** Showing the actual pills/capsules in the palm of the hand mid-video. This is a pattern interrupt that breaks the talking-head format and makes the abstract supplement tangible. It also resolves the hidden objection "what am I actually getting?" without explicitly addressing it.

---

### Transition Phrase System **[SAMPLE-SCOPED]**

Every section transition must use a verbal bridge phrase. These phrases serve as micro-hooks — each one signals that the next section is coming and gives the viewer a reason to stay.

**The standard transition phrase library:**

| Transition | Phrase Examples |
|---|---|
| Hook → Credential | "And I know this because I've been a pharmacist for 17 years..." |
| Credential → Problem | "And in my practice, I see this all the time..." |
| Problem → Mechanism | "And here's why that happens..." / "The reason is..." |
| Mechanism → Product | "Here's my recommendation..." / "So what's the fix?" / "The most effective way to address this is..." |
| Product → Proof | "And the reason I love this one is..." / "What makes this different is..." |
| Proof → CTA | "I'll link it below..." / "I'll leave the link in the orange cart..." |

**The "please stay with me" explicit retention plea [EXECUTION NOTE — Riva — 1/5]:** In videos covering complex mechanisms, explicitly addressing the viewer's potential desire to scroll: "You've probably heard about cortisol before, but please stay with me because this is so important." This is unusual — most creators use pattern interrupts to retain attention implicitly. Use sparingly and only for genuinely complex mechanisms.

---

### The "How to Take It" Retention Section **[EXECUTION NOTE — Riva, Dr. Faith, Drew — 3/5]**

After the product reveal and before the proof stack, insert a brief "how to take it" section with specific dosing instructions. This serves three functions:
1. **Retention:** Viewers who are already interested in the product stay to learn the correct usage
2. **Pre-purchase education:** Reduces post-purchase regret and returns
3. **Trust signal:** Giving away pharmacist-level dosing knowledge for free activates reciprocity

**Minimum viable implementation:** 2–3 sentences. "Take [X mg] in the [morning/evening], [with/without food]. If you're over [age], [dosage adjustment]. Do not take with [interaction]."

**The granular age-bracket dosing variant [EXECUTION NOTE — Dr. Faith — 1/5, highest-ceiling]:** "Under 35: X mg / Over 35: Y mg / 60+: Z mg." This level of specificity makes the video feel like a genuine medical consultation. Confirmed in Dr. Faith's top 6 videos including the $279K NMN video.

---

## PART 4: PRODUCT REVEAL MECHANICS

---

### The Standard Product Reveal Sequence

Every product reveal follows this sequence (confirmed via direct transcript review in 5 of 5 creators' analyzed top-performing samples (90-day window)):

1. **Transition phrase:** "So the product I recommend is..." / "Here's what I recommend..." / "Meet [ingredient]."
2. **Physical hold-up:** Both hands hold the product at chest height, label facing camera. Duration: 2–3 seconds.
3. **Product name + brand:** State the product name and brand clearly. Duration: 2–3 seconds.
4. **Why this specific product:** One sentence explaining why this brand/formula specifically. "I like this one because it uses the [form/dose/certification] that I just told you about." Duration: 5–8 seconds.
5. **Quality proof stack:** Made in USA / Third-party tested / No fillers. Duration: 8–12 seconds.

---

### The "Expensive to Buy Separately" Objection Bridge **[EXECUTION NOTE — Drew — 1/5, highly replicable]**

For bundle or multi-ingredient products, name the cost objection at the exact moment of product reveal, then immediately resolve it with the bundle value:

> "Now, targeting all of these pathways separately can get expensive. But if you'd like a recommendation, there's a [X]-in-1 formula from [Brand] that has everything I just mentioned plus more."

This technique converts the product reveal into a value proposition by pre-empting the most common bundle objection ("why not just buy each ingredient separately?"). The objection is named and resolved in the same breath, before the viewer has consciously raised it.

---

### The "Retail Legitimacy" Tactic **[EXECUTION NOTE — naturo — 1/5, highly replicable]**

After the product reveal, mention that the product is available in major retail stores but is cheaper on TikTok Shop:

> "You can find this at [major retailer], but TikTok Shop has it for less right now."

This accomplishes two things:
1. **Legitimacy signal:** If a major retailer carries it, it is a real, legitimate product — not a TikTok-only supplement
2. **Deal urgency:** The viewer now knows they could pay more elsewhere, making the TikTok Shop price feel like a genuine deal

---

### The "Synergistic Dual-Action" Bundle Reveal **[EXECUTION NOTE — naturo, Dr. Faith — 2/5]**

For two-product bundles, use a custom graphic showing both products with arrows indicating how they work together. The graphic should appear at the moment of the bundle reveal and show:
- Product A → Mechanism A
- Product B → Mechanism B
- Combined arrow → Synergistic outcome

Verbatim example from naturo: A graphic showing NMN and Astaxanthin with arrows converging on "cellular anti-aging + skin health + energy." This visual makes the bundle feel like a designed system rather than two separate products bundled for profit.

---

## PART 5: AUTHORITY AND CREDENTIAL SYSTEM

---

### The Environmental Authority Signal **[EXECUTION NOTE — naturo — 1/5, replicable]**

Filming in a professional environment (naturopath's office, clinical setting, pharmacy, lab) adds an ambient authority signal that works before any words are spoken. The environment communicates "this person is a professional" through visual context alone.

**Implementation:** If filming in a home setting, use a clean, neutral background with professional lighting. Avoid bedroom or kitchen backgrounds. A bookshelf with medical or scientific texts in the background adds ambient authority.

---

### The Credential Document Proof **[EXECUTION NOTE — Riva — 1/5, highly replicable]**

Show the actual credential document (pharmacy license, naturopath certification, medical degree) on screen for 2–3 seconds during the credential section. This is more powerful than stating the credential verbally because it provides visual proof that is difficult to fake.

**Implementation:** Screenshot or photograph the credential document. Display it as a screen overlay for 2–3 seconds during the verbal credential delivery. The document does not need to be fully readable — the visual impression of an official document is sufficient.

---

### The "Years of Experience" Quantification **[EXECUTION NOTE — rphreviews — 1/5, highly replicable]**

Quantify the credential with a specific number of years: "I've been a pharmacist for over 17 years." The specific number is more credible than "I've been a pharmacist for many years" because it implies a precise, verifiable claim.

**The "I've seen it all" professional witness pattern:** Combine the years number with a professional witness statement: "In my 17 years, I have not seen it this bad. I'm dispensing [product] in record numbers." This converts the abstract credential into a concrete, current observation.

---

## PART 6: THE MEDICAL DISCLAIMER AS TRUST SIGNAL

**[EXECUTION NOTE — Drew, Dr. Faith, Riva — 3/5]**

Including a medical disclaimer near the CTA increases conversions by increasing trust. This is counterintuitive but consistent across three creators.

**The standard disclaimer formula:**
> "If you're on [specific medication/condition], check with your doctor before starting this."

**Why it works:** The disclaimer signals that the creator is a responsible practitioner who prioritizes the viewer's safety over their commission. This is the opposite of what an untrustworthy salesperson would do. The viewer's trust in the creator increases, which increases their willingness to buy.

**Placement:** Immediately before or after the product reveal, not at the very end of the video. Placing it at the end makes it feel like a legal afterthought. Placing it near the reveal makes it feel like genuine medical advice.

**Specificity principle:** "Check with your doctor if you're on blood thinners" is more trust-building than "consult your healthcare provider before use." Specific contraindications signal genuine medical knowledge; generic disclaimers signal legal compliance.

---

## PART 7: THE "PRESCRIPTION FEEL" TECHNIQUE

**[EXECUTION NOTE — Dr. Faith, Drew — 2/5, highest-ceiling technique in dataset]**

The highest-converting scripts in the dataset feel like genuine medical consultations rather than advertisements. The "prescription feel" is achieved by including all of the following elements:

1. **Contraindications:** "Do not take with zinc, calcium, or iron — they compete for absorption."
2. **Timing instructions:** "Take in the AM, not past 2 PM — it can affect sleep if taken too late."
3. **Dosage specificity:** "200mg for under 35, 400mg for over 35, 500mg for 60+."
4. **Side effect warnings:** "Can cause mild GI discomfort if taken on an empty stomach — take with food."
5. **Interaction warnings:** "If you're on metformin, NMN can enhance its effects — monitor your blood sugar."

**Why this works:** A genuine prescription includes all five elements. When a TikTok video includes all five, it triggers the same mental frame as receiving a prescription from a doctor. The viewer's purchase decision is no longer "should I buy this supplement?" — it is "how do I follow this prescription?"

**Implementation:** Include at least 2–3 of these five elements in every Expert Verdict or Right-Way script. The granular dosage by age bracket (element 3) is the single highest-impact element — it appears in Dr. Faith's top 6 videos and correlates with her highest GMV scores.

---

## PART 8: FUNNEL STAGE CALIBRATION

---

### TOF (Top of Funnel) Script Architecture

**Audience:** Does not know the product or ingredient exists. May know the symptom/condition.

**Required elements:**
- Hook must name the symptom/condition, not the product
- Education section must explain WHY the symptom exists before naming any solution
- Product reveal must be preceded by a "mechanism bridge" — a sentence that connects the mechanism to the product
- CTA must include a benefit statement, not just a link: "If you want to start [benefit], click the orange cart below"

**Best hook types for TOF:** `symptom-checklist`, `fear-external-threat`, `viral-metaphor`, `side-effect-surprise`, `suppressed-knowledge`

---

### MOF (Middle of Funnel) Script Architecture

**Audience:** Knows the ingredient/category exists. Is considering whether to buy. May have tried a similar product before.

**Required elements:**
- Hook can name the ingredient directly
- Education section focuses on WHY MOST PRODUCTS FAIL (quality filter) rather than why the ingredient works
- The "Trojan Horse" objection handle ("if you tried this before and didn't see results, here's why") is highly effective for MOF
- Product reveal can be earlier (55–65% mark)
- CTA can be shorter — viewer is closer to purchase

**Best hook types for MOF:** `right-way`, `expert-verdict`, `comparison`, `instruction-correction`, `after-1-month`

---

### BOF (Bottom of Funnel) Script Architecture

**Audience:** Has already decided to buy. Is looking for the best deal or final confirmation.

**Required elements:**
- Hook can be deal-focused or urgency-focused
- Education section is minimal or absent
- Product reveal is early (first 30%)
- CTA is the heaviest section — multiple scarcity signals, specific deal details
- The Minimum Viable Expert Verdict (30–45 seconds) is the standard BOF format

**Best hook types for BOF:** `fake-outrage`, `hope-you-didnt-buy`, `got-robbed`, `expert-verdict` (short form)

---

## PART 9: VIDEO LENGTH GUIDELINES

| Funnel Stage | Recommended Length | Rationale |
|---|---|---|
| TOF | 75–100 seconds | Needs full mechanism explanation for cold audience |
| MOF | 60–80 seconds | Quality filter + objection handling required |
| BOF | 30–50 seconds | Deal + CTA only — no education needed |
| BOF Suite Type 1 | 45–60 seconds | Apology-reveal short — benefit stack + stock scarcity CTA |
| BOF Suite Type 2 | 60–75 seconds | Apology-reveal long — one education sentence per benefit line |
| BOF Suite Type 3 | 60–80 seconds | Instruction-correction — 2–3 protocol rules + pharmacist flag |
| BOF Suite Type 4 | 45–70 seconds | Scam-warning — 3 label-readable differentiators + official shop CTA |
| Comment Reply | 45–75 seconds | Answers the question + adds new information |

**The 34-second MOF exception (Riva, $33K GMV):** For well-known product categories (hair gummies, basic vitamins) targeting audiences already in buying mode, a 30–45 second Expert Verdict with no mechanism section is sufficient. Use only when the product category requires no explanation.

---

## PART 10: CROSS-CREATOR EXECUTION SUMMARY

The following table summarizes which techniques are universal vs. creator-specific. Use this as a checklist when reviewing any generated script.

| Technique | Universal? | Creators | Priority |
|---|---|---|---|
| Product reveal at 55–88% | ✅ Yes | 5/5 | REQUIRED |
| Authority before product | ✅ Yes | 5/5 | REQUIRED |
| Education = 55–75% of runtime | ✅ Yes | 5/5 | REQUIRED |
| No specific price | ✅ Yes | 5/5 | REQUIRED |
| Supply duration framing | ✅ Yes | 5/5 | REQUIRED |
| Point-down gesture at CTA | ✅ Yes | 5/5 | REQUIRED |
| Scarcity in every CTA | ✅ Yes | 5/5 | REQUIRED |
| Quality proof anchors (2+) | ✅ Yes | 5/5 | REQUIRED |
| PubMed screenshot (1+) | ✅ Yes | 5/5 | REQUIRED |
| Visual interrupt every 3–5s | ✅ Yes | 5/5 | REQUIRED |
| Transition phrases between sections | ✅ Yes | 5/5 | REQUIRED |
| "How to take it" section | Recommended | 3/5 | STRONG |
| Medical disclaimer as trust signal | Recommended | 3/5 | STRONG |
| "Fake companies" moat | Recommended | 3/5 | STRONG |
| "Not your fault" absolution | Situational | 3/5 | SITUATIONAL |
| Granular age-bracket dosing | Situational | 1/5 | HIGH CEILING |
| "Bait and switch" trust architecture | Situational | 1/5 | HIGH CEILING |
| "Prescription feel" technique | Situational | 2/5 | HIGH CEILING |
| Pill reveal close-up | Situational | 2/5 | REPLICABLE |
| Retail legitimacy tactic | Situational | 1/5 | REPLICABLE |
| Synergistic dual-action graphic | Situational | 2/5 | REPLICABLE |
| Credential document popup | Situational | 1/5 | REPLICABLE |

---

---

## PART 11: SENTENCE-LEVEL WRITING STANDARDS

---

### Rule E: No Sentence Redundancy **[REQUIRED — established June 22, 2026]**

Every sentence in a script must either introduce new information or advance the argument. Restating a point already made — even in different words — is dead weight and must be cut at the writing stage, not left for the creator to figure out on set.

**The test to apply to every line before delivery:** *“Does this sentence add something the previous sentence did not already say?”* If no, cut it.

**This is not a rule about script length.** A script can and should be as long as the content requires. The rule is about sentence-level discipline — every sentence earns its place by contributing something new.

**Example of the violation (from Script 21):**
> “You must follow it with SPF. Not a moisturizer with SPF. An actual dedicated SPF — mineral or chemical, at least SPF 30.”

Three sentences saying the same thing. The correct version:
> “You must follow it with a dedicated SPF — not just a moisturizer that has SPF in it. Mineral or chemical, at least SPF 30.”

Same information. One sentence instead of three. Apply this compression to every section of every script.

**Common redundancy patterns to watch for:**
- Restating the mechanism after already explaining it (e.g., explaining UV → melanin twice)
- Saying the same instruction multiple ways (e.g., "use SPF" → "not moisturizer SPF" → "dedicated SPF" → "SPF 30")
- Repeating the product's ingredient list after already naming them earlier in the script
- Restating the hook premise mid-video after the education section has already made the point
- Repeating the same emotional beat in adjacent sentences using different words (e.g., "instant volume" → "overnight volume" → "disappointed" → "disappointed" across two consecutive sentences)

**Second example of the violation (from Dr. Melaxin Multibalm Script 1 — June 22, 2026):**
> "But here's the problem — I see people setting timers and claiming instant volume in 60 seconds. That's where the disappointment comes from. The ingredient is real. The timeline is not.
> Collagen stimulation takes four to eight weeks for visible results. If you're expecting overnight volume, you will be disappointed. Manage the timeline and the mechanism holds up."

"Instant volume," "overnight volume," "disappointed," and "disappointed" across two paragraphs — four expressions of the same idea. The correct version:
> "But here's the problem — I see people setting timers and claiming instant results. The ingredient is real. The timeline is not. Collagen stimulation takes four to eight weeks. Manage that expectation and this product holds up."

**MANDATORY PRE-DELIVERY ENFORCEMENT:**
Rule E compliance is a required final pass before any script is delivered to the user — not a drafting guideline. Before marking a script complete, read every GAP, EDUCATION, and BRAND CLOSE section line by line and apply the test: *"Does this sentence add something the previous sentence did not already say?"* If any sentence fails, cut or merge it before delivery. This check must happen even when the script feels complete. The violation is most common in the GAP section (where timeline/expectation management tends to be over-explained) and in the EDUCATION section (where mechanism explanations tend to repeat).

### Rule E.1: Product-Advancement Ledger **[REQUIRED — added September 2, 2026]**

Rule E must also be applied **across the full script and the campaign package**, not just to adjacent sentences. Before prose is drafted, give each spoken beat one primary job: **recognition/pain, category insight, product differentiator, source proof, objection resolution, retention, or CTA**. A line is removed if it cannot be assigned one of those jobs, or if it repeats a prior job without adding a different fact or payoff.

The non-negotiable test is: *“What does this beat make the viewer newly understand about why they should choose this product for the specific case we called in?”* A technically accurate caveat, safety note, or competitor qualification cannot stay merely because it is true. It stays only when it resolves a real objection at the point the viewer needs it.

Every campaign map must therefore include a **product-message hierarchy**: three to six source-backed product differentiators, ranked by buyer relevance, and a single primary buyer payoff for each asset. Do not use the same differentiator, repeated credential phrase, safety note, or category caveat as filler across multiple scripts. The named comparison asset may teach a competitor’s valid role; unrelated assets must sell the linked product’s own advantage.

**Required evidence before delivery:**

1. Quote every line cut or merged for redundancy, or record “none” with a brief script-specific reason.
2. Identify the unique differentiator and payoff in each major product section.
3. Run a package-level scan for repeated safety notes, credentials, product facts, and competitor/water caveats; keep only intentionally distinct uses.


---

### Rule F: Pain-First Mechanism Explanation **[REQUIRED — established June 30, 2026]**

When explaining a complex ingredient or scientific mechanism, always lead with the viewer's lived experience of the problem before introducing the science. The mechanism must arrive as the answer to a question the viewer is already asking — not as a lecture they have to sit through.

**The core principle:** Viewers do not scroll because the content is too scientific. They scroll because they do not yet care about the science being explained. Caring comes from recognizing their own problem first. Give them the problem, then give them the mechanism as the solution.

**The sequence that fails:**
> Ingredient name → mechanism name → what the mechanism does → who it helps

This sequence puts the science before the pain. The viewer receives a lecture before they feel the problem being solved.

**The sequence that works:**
> Curiosity gap ("has something most products don't") → viewer's lived experience of the problem → mechanism as the answer → familiar analogy to anchor the science → benefit framed as "also does X" (bonus, not replacement)

**The test to apply before every mechanism explanation:** *"Does the viewer have a reason to care about this science before I explain it?"* If no, add one sentence that names their lived experience of the problem first.

**Example of the violation (SCRIPT_19 original):**
> *"SKIN1004 is chemical sunscreen with Centella Asiatica. Centella contains natural COX inhibitors. COX is the same enzyme ibuprofen blocks. When the sun hits reactive skin, it triggers an inflammatory cascade. Centella interrupts that inflammation at the enzyme level."*

The ibuprofen bridge is correct and should be retained, but it arrives after the clinical term "COX inhibitors" — the rescue comes after the friction. The viewer who does not know what COX means has already started to disengage.

**Corrected version (SCRIPT_19 revised):**
> *"SKIN1004 is chemical, but it has something most sunscreens don't — Centella Asiatica at 9,800 ppm. If your skin gets red or inflamed after sun exposure, that reaction is being driven by an enzyme called COX. It's the same enzyme ibuprofen targets. Centella blocks it naturally — so instead of just blocking UV, this sunscreen is also stopping the inflammatory response that UV triggers in reactive skin."*

What changed and why:
- **"But it has something most sunscreens don't"** — creates a curiosity gap before the ingredient name. The viewer leans in before the explanation begins.
- **"If your skin gets red or inflamed after sun exposure"** — the viewer who has reactive skin hears themselves described and stays. The mechanism is now the answer to their problem.
- **"It's the same enzyme ibuprofen targets"** — same bridge, but now arrives as a relief after the problem statement rather than a definition after a clinical term.
- **"Also stopping the inflammatory response"** — the "also" framing positions the bonus benefit correctly: this sunscreen does what all sunscreens do, plus this. Never "is better because of X" — always "also does X."

**Secondary rule: "Also" framing for bonus benefits in comparison scripts**

When one product has a benefit the other does not, frame it as "also does X" rather than "is better because of X." This keeps the comparison credible, non-salesy, and fair to both products. The viewer trusts a pharmacist who presents both products honestly more than one who pushes one over the other.

**Where this rule applies most:**
- Any EDUCATION section explaining an active ingredient with a mechanism the average viewer has not heard of
- Any SKIN1004, Centella, Rebornic, adenosine, or COQ10-type mechanism explanation
- Any comparison script where one product has a secondary benefit that needs to be explained without making the other product look inferior
- Any script where the ingredient name is scientific and requires a familiar analogy (ibuprofen, vitamin D, collagen, etc.)

**MANDATORY PRE-DELIVERY ENFORCEMENT:**
Before delivering any script that includes a mechanism explanation, apply the pain-first test to every such section: *"Does the viewer have a reason to care about this science before I explain it?"* If the mechanism is introduced before the viewer's lived experience of the problem it solves, reorder the section before delivery.

---

### Rule G: PubMed Links Must Be Clickable Markdown Hyperlinks **[REQUIRED — established July 19, 2026]**

Every study reference in a script file must use Markdown hyperlink format. Plain text PMIDs are not acceptable.

**Required format:**
```
[PMID 12345678](https://pubmed.ncbi.nlm.nih.gov/12345678/)
[PMC1234567](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1234567/)
```

**Never use:**
- `PMID: 12345678`
- `PubMed ID 12345678`
- `(PMID 12345678)`
- Any plain text reference to a study without a hyperlink

**Why this matters:** The user screenshots study titles directly from the script file to use as video overlays. A plain text PMID requires a separate browser lookup step before the screenshot can be taken. A clickable Markdown link means one click to the PubMed page where the study title, journal name, and abstract are all visible and screenshottable.

**Enforcement:** Checklist item 17 (PubMed links clickable) must pass before any script is delivered. This applies to every script that cites a study, regardless of funnel stage or product category. If a study is referenced anywhere in the script — in the EDUCATION section, the Supporting Studies block, or the POST-PRODUCTION NOTES — it must be a clickable link.

---

*Guide complete. 5 creators, 84 videos, ~$4.3M GMV synthesized. Last updated July 19, 2026.*


---

## Audit-Verified Replicable Techniques (September 2026)

### Visual-Comparison Opener [TRANSCRIPT-VERIFIED]
Riva and rphreviews both open structurally similar videos with a physical comparison before naming the underlying cause. Show the visible or familiar problem first, then identify the cause and solution category.

### Memorable Summary Line [ANALYSIS-VERIFIED]
After a dense education beat, compress the mechanism into one short, quotable takeaway. Preserve the evidence boundary and translate the mechanism into viewer language.

### INCI-Position Percentage Check [ANALYSIS-VERIFIED]
Compare a brand’s headline ingredient percentage with its position in the complete current ingredient list when the exact label supports the comparison. Frame it as product literacy, not an accusation.
