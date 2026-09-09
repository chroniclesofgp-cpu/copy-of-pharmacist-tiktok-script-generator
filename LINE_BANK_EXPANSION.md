# Line Bank Expansion Guide

**Purpose:** This document describes how to add new winning lines, update frequency ratings, and maintain the BOF line bank over time. It is the companion to `CREATOR_ONBOARDING.md` — use this guide for ongoing maintenance after a creator has already been onboarded.

---

## How the Line Bank Works

The line bank (`client/src/lib/bofLineBank.ts`) is a structured data file containing verbatim phrases organized by hook framework and script position. Each line has three required fields:

```ts
{
  line: 'The exact verbatim text',
  creator: '@handle' | 'both',
  frequency: 'very-high' | 'high' | 'medium' | 'low'
}
```

The `getTopLines()` helper filters the bank and returns only the top N lines sorted by frequency. The LLM prompt builder calls this helper and only ever shows the model the top 3 lines per position. This means:

- **The LLM never sees the full bank** — only the top 3 per position
- **Frequency ratings are the control dial** — promoting a line to `very-high` makes it appear in every generated script
- **The bank can grow indefinitely** without degrading output quality, as long as the top-3 filter stays in place

---

## Adding a New Winning Line

When a line from a real video performs well (high views, saves, or conversions), add it to the bank immediately while the context is fresh.

**Step 1:** Identify which hook framework and script position the line belongs to.

| Position | Description |
|---|---|
| `textHooks` | On-screen text shown in the first 3 seconds |
| `verbalHooks` | Spoken opening line(s) |
| `dealRevealOpeners` | How the deal is introduced |
| `howToLines` | Steps for claiming the deal |
| `proofLines` | Benefit/proof statements (BOF+ hooks only) |
| `couponLines` | Coupon gamification language |
| `urgencyCloses` | Closing line(s) driving action |

**Step 2:** Open `client/src/lib/bofLineBank.ts` and find the relevant hook constant (e.g., `REVERSE_PSYCHOLOGY_LINES`).

**Step 3:** Add the line to the correct array. Use `very-high` frequency if it has already proven itself in multiple videos, or `high` if it is new but promising.

```ts
// Example: adding a new verbal hook to reverse psychology
verbalHooks: [
  { line: 'Wait — before you buy this anywhere else.', creator: '@momfindsbyfaith', frequency: 'very-high' },
  // ... new line below:
  { line: 'I almost didn\'t post this because I didn\'t want everyone to know.', creator: '@momfindsbyfaith', frequency: 'high' },
],
```

**Step 4:** Run `pnpm test` to confirm nothing broke.

**Step 5:** Save a checkpoint with a brief description of what was added.

---

## Updating Frequency Ratings

Frequency ratings should be reviewed after every 10–15 videos posted using the tool. The review process is simple:

1. Look at which lines appeared in your best-performing videos
2. Promote those lines to `very-high` if they are not already
3. Demote lines from `very-high` to `high` if they have been overused and are starting to feel repetitive
4. Leave `low` lines in place — they act as a reserve pool and do not affect output

**Frequency scale reference:**

| Rating | Meaning | When to use |
|---|---|---|
| `very-high` | Appears in 5+ real videos, proven performer | Signature lines, highest-converting phrases |
| `high` | Appears in 3–4 videos, strong candidate | Reliable lines, good alternatives to very-high |
| `medium` | Appears in 2 videos, situational | Context-specific lines, niche deal types |
| `low` | Appears in 1 video, unvalidated | New lines, experimental phrasing |

---

## Retiring Underperforming Lines

Lines should never be deleted — they serve as a historical record and may become relevant again. Instead, demote them:

- If a line consistently produces weak output, change its frequency to `low`
- It will stop appearing in the top-3 filter and effectively become inactive
- If it later proves useful in a specific context, promote it back

---

## Adding a New Hook Framework

If a new hook pattern emerges that does not fit any of the 11 existing frameworks, follow these steps:

**Step 1:** Define the hook in `client/src/lib/bofHooks.ts`. Every hook needs:

```ts
{
  id: 'unique-kebab-case-id',
  name: 'Human-Readable Hook Name',
  tier: 'primary' | 'secondary' | 'viral-trend',
  format: 'BOF' | 'BOF+',
  requiresBenefitField: boolean,
  textHookFormula: 'Template for on-screen text',
  verbalHookFormula: 'Template for spoken opening',
  description: 'One sentence explaining when to use this hook',
  exampleVideos: [],
}
```

**Step 2:** Add a corresponding line bank entry in `client/src/lib/bofLineBank.ts`. The entry must follow the `HookLineBank` type and include all required sections (`textHooks`, `verbalHooks`, `dealRevealOpeners`, `howToLines`, `urgencyCloses`, `couponLines`). Add `proofLines` only if `format === 'BOF+'`.

**Step 3:** Register the hook in the `BOF_LINE_BANK` map at the bottom of `bofLineBank.ts`:

```ts
export const BOF_LINE_BANK: Record<string, HookLineBank> = {
  // ... existing entries ...
  'new-hook-id': NEW_HOOK_LINES,
};
```

**Step 4:** Run `pnpm test`. The test `"has an entry for every hook defined in BOF_HOOKS"` will fail if the line bank entry is missing, which serves as a safety check.

**Step 5:** Optionally add the new hook to `BOF_TESTING_SEQUENCE` in `bofHooks.ts` if it should be included in the 6-video batch generation sequence.

---

## Shared Lines vs. Hook-Specific Lines

Some lines are shared across all hooks and live in separate constants:

| Constant | Location | Purpose |
|---|---|---|
| `SHARED_URGENCY_CLOSES` | Top of `bofLineBank.ts` | All closing lines from both creators |
| `SHARED_HOW_TO_LINES` | Top of `bofLineBank.ts` | Generic how-to steps (tap cart, add quantity, use code) |
| `SHARED_COUPON_LINES` | Top of `bofLineBank.ts` | Coupon gamification language |

When a new urgency close is found that works across multiple hooks, add it to `SHARED_URGENCY_CLOSES` rather than duplicating it in every hook entry. The A/B/C variant system reads directly from `SHARED_URGENCY_CLOSES` to build the creator-specific close pools.

---

## File Reference

| File | Purpose |
|---|---|
| `client/src/lib/bofLineBank.ts` | All verbatim lines, organized by hook and position |
| `client/src/lib/bofHooks.ts` | Hook metadata, deal types, testing sequence |
| `server/routers/bof.ts` | tRPC procedures, LLM prompts, A/B variant builder |
| `server/bof.linebank.test.ts` | Line bank structure and creator consistency tests |
| `server/bof.abtest.test.ts` | A/B/C variant procedure schema tests |
| `CREATOR_ONBOARDING.md` | Guide for adding a new creator from scratch |
| `LINE_BANK_EXPANSION.md` | This file — ongoing maintenance guide |
