# Neuro Gum Instruction-Correction: Comparison Analysis
**Saved Filmed Script vs. New 3-Doc Context Generation**
**Date:** June 1, 2026

---

## Overview

This document compares two versions of a Neuro Gum instruction-correction script:

- **Version A (Saved / Filmed):** Manually written script, filmed and posted. Represents the human-crafted baseline.
- **Version B (Generated):** Produced by the tool with the new 3-doc context injection (HOOK_FRAMEWORKS.md + SCRIPT_ARCHITECTURE_GUIDE.md + BUYER_PSYCHOLOGY_LEVERS.md).

---

## Side-by-Side Comparison

| Dimension | Version A (Saved / Filmed) | Version B (Generated) |
|---|---|---|
| **Verbal Hook** | "Here is how to take caffeine the right way." | "Here's how to take your energy and focus supplements the right way." |
| **Hook Specificity** | High — "caffeine" is the specific subject | Lower — "energy and focus supplements" is generic |
| **Authority Pivot** | "I'm a pharmacist, and the way most people consume caffeine is honestly one of the least efficient delivery systems available." | "As a pharmacist, I see so many people getting this wrong." |
| **Authority Pivot Quality** | Strong — immediately names the specific failure mode ("least efficient delivery system") | Weak — generic "getting this wrong" without naming the failure |
| **Education Section** | Detailed mechanism: 30–45 min coffee absorption vs. buccal absorption, with specific timeline and study reference | Brief buccal absorption mention, no timeline comparison |
| **Gap / Mistake Named** | Specific: "expecting a slower, sustained release like coffee" — but framed as a gap in expectations, not a mechanistic error | Same gap but less clearly articulated |
| **Product Reveal Timing** | Late (after full education section) — follows instruction-correction structure correctly | Early (mid-script) — more right-way structure than instruction-correction |
| **L-theanine Explanation** | Excellent: "60 milligrams of L-theanine, an amino acid from green tea that promotes a calm, focused state without sedating you. Coffee does not have this." | Mentioned but not quantified |
| **Caffeine Dose Specificity** | Named: "40 milligrams of natural caffeine from green coffee beans" | Not named |
| **Brand Close** | Specific: "Over 15,000 sales on TikTok Shop, 4.4 stars. The variety pack is the best way to start." | Generic: "sugar-free, aspartame-free, and has zero calories" |
| **CTA** | "Link is in my shop below. Tap the cart." | "Link is in my shop below. Tap the cart and check the reviews." |
| **Caption Line 1** | "Coffee takes 30 to 45 minutes to kick in." | "Unlock faster, cleaner energy with this simple trick." |
| **Caption Line 2** | "There is a cleaner, faster way to take caffeine." | "Definitely worth adding to your routine for a focused boost." |
| **Caption Quality** | Excellent — specific, curiosity-driving, no filler | Acceptable — "simple trick" is generic, "focused boost" is vague |
| **Citations** | 2 citations, both correctly attributed (Giesbrecht 2010, Kamimori 2002) | 2 citations (Kamimori 2002, Owen 2008) — Giesbrecht missing, Owen added |
| **Visual Cues** | 3 specific, production-ready cues | 4 cues — functional but less specific |
| **Word Count** | ~220 words | ~195 words |
| **Section Structure** | 8 labeled sections (Hook, Authority, Education, How-to-Use, Product Reveal, Pain Point, Brand Close, CTA) | Unlabeled — flows as one block |

---

## Structural Compliance Assessment

The instruction-correction hook (Hook 1) has a specific 9-section structure defined in HOOK_FRAMEWORKS.md:

1. Audience Callout / Verbal Hook
2. Authority Pivot
3. Education (what most people are missing)
4. The Gap (specific mechanistic mistake)
5. How To Do It Right
6. Product Reveal (final third)
7. Pain Point / Who This Is For
8. Brand Close
9. CTA

**Version A compliance:** Strong — product reveal is in the final third, education comes before product, authority pivot names the specific failure mode.

**Version B compliance:** Partial — the product reveal appears mid-script rather than in the final third. The script reads more like a right-way (Hook 19) structure than a true instruction-correction (Hook 1) structure. This is the primary structural gap.

---

## What the 3-Doc Context Improved

1. **Psychology triggers tagged correctly:** Version B correctly identifies 6 psychology levers (Authority, Fear, Hope, Reciprocity, Convenience, Scarcity) — this metadata was not present in Version A.
2. **Triple hook suggestions generated:** Version B produces 3 text hook options automatically (Question, Provocative, Stakes) — matches the triple-hook strategy from SCRIPT_ARCHITECTURE_GUIDE.md.
3. **Citations included automatically:** Both versions cite Kamimori 2002. Version B adds Owen 2008 (L-theanine + caffeine cognitive performance) which is a valid additional citation.
4. **Script brief generated:** Version B produces a full `scriptBrief` object (mechanism, gap, differentiator, dosing facts, citations) for the vault — this is new infrastructure not present in Version A.

---

## What Still Needs Improvement

1. **Product reveal timing:** The generated script reveals the product mid-script. The HOOK_FRAMEWORKS.md instruction-correction definition requires product reveal in the final third. The prompt needs to reinforce this constraint more explicitly.
2. **Hook specificity:** "energy and focus supplements" is weaker than "caffeine" as a hook subject. The prompt should use the product's primary ingredient as the hook subject, not the category name.
3. **Authority pivot depth:** "I see so many people getting this wrong" is a placeholder. The authority pivot should name the specific failure mode immediately (e.g., "the way most people consume caffeine is one of the least efficient delivery systems available").
4. **Brand close specificity:** The generated brand close uses generic claims (sugar-free, zero calories). The saved script uses social proof (15,000 sales, 4.4 stars, variety pack recommendation). Social proof is stronger for instruction-correction hook because the audience has already tried the product and needs a reason to trust this specific brand.
5. **Caption specificity:** "Unlock faster, cleaner energy with this simple trick" is generic. The saved caption ("Coffee takes 30 to 45 minutes to kick in") is specific and curiosity-driving.

---

## Verdict

The 3-doc context injection is producing **structurally aware, citation-backed scripts** with correct psychology trigger tagging and triple-hook suggestions — all improvements over the pre-3-doc baseline. However, the instruction-correction hook's defining constraint (product reveal in final third, warm-audience trigger) is not being consistently enforced. The generated script is closer to a right-way (Hook 19) structure than a true instruction-correction (Hook 1).

**Recommended next prompt improvement:** Add an explicit constraint to the instruction-correction section of HOOK_FRAMEWORKS.md: "PRODUCT REVEAL TIMING: The product must not be named or shown until the final third of the script. The first two-thirds are pure education. This is what makes instruction-correction different from right-way."

---

## Notes

_Add manual notes here after filming or review._
