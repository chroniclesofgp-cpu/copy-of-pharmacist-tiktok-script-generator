# Creator Framework Expansion Workflow

This document describes the process for adding new hook frameworks from successful TikTok creators to the RxContent script generator.

---

## Overview

The tool currently includes **13 hook frameworks** derived from analyzing top-performing pharmacist and supplement creators (primarily Drew and similar healthcare TikTokers). When you discover a new creator with a distinct, repeatable hook pattern, follow this workflow to add it.

---

## Step 1: Identify a New Creator Framework

A framework is worth adding when:

- The creator has **multiple videos using the same opening structure** (not a one-off)
- The hook has generated **500K+ views** on at least one video
- The pattern is **distinct** from the 13 existing hooks (see `server/hooks.ts` for the current list)
- It works specifically for **supplement / health / pharmacist content**

**What to collect:**
- Creator's TikTok handle (e.g., `@drewpharmacist`)
- 2–3 video URLs that use the same hook pattern
- The hook's "formula" — the repeatable opening structure in plain English
- What psychological trigger it activates (curiosity, authority, fear, social proof, etc.)

---

## Step 2: Submit the Creator Profile

Provide the following information to the developer:

```
Creator Handle: @handle
Creator Niche: (e.g., pharmacist, supplement reviewer, health coach)
Hook Name: (your proposed name, e.g., "The Lab Results Hook")
Hook Formula: (the repeatable opening structure)
  Example: "I ran [X test] on myself for [Y weeks] and here's what happened..."
Psychological Trigger: (e.g., curiosity + personal authority)
Example Videos:
  1. https://www.tiktok.com/@handle/video/...  (~1.2M views)
  2. https://www.tiktok.com/@handle/video/...  (~800K views)
Best For: (e.g., supplements with measurable outcomes, before/after products)
Tier: (Tier 1 = use for almost any product | Tier 2 = situational)
Misdirection Compatibility: (high / medium / low)
```

---

## Step 3: Developer Adds the Hook to hooks.ts

The developer will add the new hook to `server/hooks.ts` following this structure:

```typescript
{
  id: 'lab-results',                          // kebab-case unique ID
  name: 'The Lab Results Hook',               // Display name
  tier: 'tier1',                              // 'tier1' | 'tier2'
  textHook: 'I tested this on myself...',     // On-screen text hook
  verbalHook: 'I ran my own labs before and after taking this for 90 days...',
  bestFor: 'Supplements with measurable biomarker outcomes (NAD+, CoQ10, Omega-3)',
  conditions: null,                           // null or string if situational
  psychTriggers: ['Authority', 'Curiosity', 'Social Proof'],
  misdirectionCompatibility: 'high',          // 'high' | 'medium' | 'low'
  misdirectionNote: 'Works well — the lab results frame already sets realistic expectations',
  exampleVideo: {
    url: 'https://www.tiktok.com/@handle/video/...',
    creator: '@handle',
    views: '1.2M',
  },
}
```

---

## Step 4: Update the LLM Prompt

The developer will also update `HOOK_FRAMEWORK` in `server/routers/tiktok.ts` to include the new hook's description so the LLM knows how to generate scripts for it.

---

## Step 5: Test the New Hook

1. Select the new hook in Generate Mode
2. Enter a test product (e.g., NAD+ or Magnesium Glycinate)
3. Generate a script and verify it follows the hook formula
4. Use Clone Mode to transcribe one of the example videos and compare

---

## Current Hook Library (13 Hooks)

| ID | Name | Tier |
|---|---|---|
| `after-1-month` | The After 1 Month Formula | Tier 1 |
| `suppressed-knowledge` | The Suppressed Knowledge Hook | Tier 1 |
| `instruction-correction` | The Instruction / Correction Hook | Tier 1 |
| `symptom-checklist` | The Symptom Checklist Hook | Tier 1 |
| `trend-or-trash` | The Trend or Trash Hook | Tier 1 |
| `dosing-authority` | The Dosing Authority Hook | Tier 1 |
| `age-reversal` | The Age Reversal Hook | Tier 1 |
| `comparison` | The Comparison Hook | Tier 1 |
| `warning-signs` | The Warning Signs Hook | Tier 1 |
| `storytime` | The Storytime Hook | Tier 1 |
| `myth-busting` | The Myth-Busting Hook | Tier 2 |
| `behind-counter` | The Behind the Counter Hook | Tier 2 |
| `patient-transformation` | The Patient Transformation Hook | Tier 2 |

---

## Notes

- **Manual curation is intentional.** Automated trend-following would add noise. Only add hooks that have proven track records.
- **Quality over quantity.** 13 well-crafted hooks outperform 50 mediocre ones.
- **Tier 1 = use for almost any product.** Tier 2 = use when the product or situation specifically calls for it.
- **Misdirection compatibility** affects how well the trust-building "correction" line integrates with the hook's tone.
