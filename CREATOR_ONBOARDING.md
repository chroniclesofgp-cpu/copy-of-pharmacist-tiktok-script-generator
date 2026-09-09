# Creator Onboarding Guide

**Purpose:** This document describes the repeatable process for adding a new TikTok creator's voice and script patterns to the tool. It covers two pipelines:

1. **Rx Content Script Generation** — the hook frameworks and section-by-section structures in `HOOK_FRAMEWORKS.md` (project root). This is the most important pipeline. Every creator deep dive must produce verified updates here.
2. **BOF Line Bank** — the verbatim deal-script lines in `client/src/lib/bofLineBank.ts`. Applies only to creators who produce BOF-style deal/coupon content.

> **Single source of truth (Option B — June 1, 2026):** Hook frameworks live in `HOOK_FRAMEWORKS.md` at the project root. The server reads this file at runtime via `fs.readFileSync`. **Do not edit `BATCH_HOOK_FRAMEWORKS` in `server/routers/tiktok.ts` directly** — that constant is now loaded from the file, not defined inline. Edit `HOOK_FRAMEWORKS.md` only.

> **Critical rule:** A creator onboarding is not complete until the Generation Pipeline Verification checklist (Step 5) is fully checked off. Documentation files and UI updates alone do not count — the LLM must receive the new information.

Follow this guide whenever a new creator is identified as a strong performer worth incorporating into the tool.

---

## When to Add a New Creator

A creator is worth onboarding when they meet all three criteria:

1. They have a consistent, recognizable script structure that repeats across multiple videos (not just one viral hit)
2. Their hook and CTA language is distinct enough from existing creators that blending would be noticeable
3. They have at least 20–30 BOF-style TikTok Shop videos to analyze for pattern extraction

---

## Step 1 — Profile Submission

The user provides the creator's TikTok profile or a batch of video URLs. The ideal submission includes:

- The creator's TikTok handle
- A description of their niche (general products, supplements, beauty, etc.)
- Any notes on their style (fast-paced, conversational, authoritative, etc.)
- A list of video URLs or a saved batch of videos for analysis

The more videos provided, the more accurate the line extraction. Aim for a minimum of 20 videos covering different hook types.

---

## Step 2 — Video Analysis

### ⚠️ Critical Safeguard 1: Captions Are Not Hooks

A creator's TikTok caption (the text below the video) is **SEO/discovery copy** — it is written to appear in search results and hashtag feeds. It is **not** the verbal hook the creator says in the first 1–2 seconds of the video.

**The verbal hook is the only thing that stops the scroll.** It is what the creator says out loud, on camera, in the opening moment of the video. Captions routinely describe the video's topic in a way that does not match the actual opening line.

**Rule:** For every video, you MUST watch or transcribe the first 5–10 seconds to extract the real verbal hook. Do not use the caption as a proxy for the verbal hook. If you cannot watch or transcribe the video, note it as unverified and do not add the line to the bank.

**Example of the difference:**
- Caption: *"You need protein, to help you build that healthy lean muscle but until now you haven't been taking it the right way."*
- Actual verbal hook: *"Is this the best way to take protein? No, because I've been a pharmacist for over 17 years."*

These are completely different hooks. The caption describes the topic; the verbal hook is the scroll-stopper.

---

### ⚠️ Critical Safeguard 2: Only Analyze Videos From the Creator's Own Profile Grid

TikTok's sidebar, "You May Like" panel, and recommendation feed show videos from **other creators** — not the creator being analyzed. These are algorithmically recommended and will contaminate the analysis if mistaken for the creator's own content.

**Rule:** Before analyzing any video, verify that the URL contains the creator's exact handle. For example, if analyzing `@rphreviews`, every video URL must contain `/rphreviews/`. Any video URL that does not match the creator's handle must be ignored, regardless of where it appears on the page.

**How to collect videos safely:**
1. Navigate to the creator's profile page directly (e.g., `https://www.tiktok.com/@rphreviews`)
2. Extract all video URLs from the profile grid using the HTML — do not click into videos from the sidebar
3. Confirm each URL contains the creator's handle before analyzing it
4. If a video appears in a sidebar or recommendation panel during analysis, note it and discard it

**Why this matters:** In past sweeps, sidebar videos from other creators were mistakenly attributed to the creator being analyzed. This produces incorrect hook data and contaminates the line bank with another creator's voice.

---

### ⚠️ Critical Safeguard 3: Always Download and Transcribe — Never Rely on Page Metadata Alone

The only way to accurately extract a spoken hook, pacing, section order, tonality, CTA structure, and on-screen text sequence is to **watch and transcribe the actual video audio**. TikTok page metadata (captions, titles, hashtags, view counts) is discovery copy — it does not reflect what the creator says on camera or how the video is structured.

**Why this matters:** Pacing, the exact moment a product is revealed, the order of education vs. pain points, the specific words in the CTA, and the tonality of the delivery are all invisible from the page. These are the elements that make a video convert. Analyzing from captions alone produces a surface-level summary that cannot be used to replicate the structure.

**Required workflow for any TikTok video analysis:**

1. Get the full TikTok video URL (e.g., `https://www.tiktok.com/@handle/video/1234567890`)
2. Download the video using yt-dlp:
   ```bash
   yt-dlp "https://www.tiktok.com/@handle/video/1234567890" -o "/home/ubuntu/upload/video_name.mp4" --no-playlist
   ```
3. Transcribe and analyze the downloaded file:
   ```bash
   manus-analyze-video "/home/ubuntu/upload/video_name.mp4" "Transcribe this TikTok video word for word exactly as the creator speaks. Also note every on-screen text overlay, graphic, diagram, product shot, and study popup that appears. Note the order of everything."
   ```
4. Extract all data points from the transcription (see table below)

**This process works for any public TikTok video.** It does not require the creator to provide the file. yt-dlp downloads directly from the public URL.

**What full transcription captures that captions cannot:**
- The exact spoken hook (word for word, first 1–3 seconds)
- The section order (hook → authority → education → gap → product reveal → CTA)
- The exact moment the product is named or shown
- The pacing and rhythm of the delivery
- Every on-screen text overlay and when it appears
- Every graphic, diagram, or study popup and what it says
- The tonality — conversational vs. authoritative vs. urgent
- The exact CTA language and its length
- Whether the product is revealed early (comparison hook) or late (TOF curiosity loop)

**For creator coaching video analysis (e.g., Coach Ruben breakdowns):**
The same process applies. Download the coaching video as a file and run `manus-analyze-video` with a prompt that asks for both the coach's feedback AND the original creator video content being reviewed. This captures the exact changes recommended and the specific lines being critiqued.

---

Each video is analyzed to extract the following data points for every script position:

| Position | What to Extract |
|---|---|
| **Text Hook** | The on-screen text shown in the first 3 seconds |
| **Verbal Hook** | The exact spoken opening line(s) — **must be transcribed from the video, not taken from the caption** |
| **Deal Reveal** | How they introduce the deal or product |
| **How-To** | The exact steps they give for claiming the deal |
| **Coupon Language** | Any gamification or coupon-specific phrasing |
| **Urgency Close** | The exact closing line(s) used to drive action |

For each extracted line, record:
- The verbatim text (no paraphrasing)
- The hook framework it belongs to (reverse psychology, warning, bundle, etc.)
- How frequently it appears across videos (`very-high` = 5+ videos, `high` = 3–4, `medium` = 2, `low` = 1)
- Any notes on context (e.g., "only used with coupon deals", "only for supplements")

---

### ⚠️ Critical Safeguard 4: Deep Analysis Requires Full Video — Transcript Alone Is Insufficient

**Established May 31, 2026. Applies to all deep-analysis videos (above the $20K GMV threshold) and any future creator onboarding deep dive.**

Audio transcripts capture spoken audio only. For a 13-dimension deep analysis, the following elements are doing real conversion work and MUST be captured from the full video — they are invisible in a transcript:

- **Visual hook** — what is physically on screen in the first 0–3 seconds (product in hand, setting, visual framing)
- **Text hook** — the on-screen text that appears in the opening seconds, which is often the first thing a viewer reads and is frequently different from the spoken hook
- **On-screen text overlays** — every piece of text that appears throughout the video: ingredient callouts, credential reinforcement text, product stat callouts, study citations
- **Study and data popups** — specific study citations, percentages, and claims that flash on screen during the mechanism section (these build credibility and are part of the persuasion architecture)
- **Product reveal visuals** — what the product looks like on screen at the moment of reveal, and whether the visual reveal precedes or follows the verbal reveal
- **Rehook visuals** — mid-video pattern interrupts that use on-screen text or visual changes
- **CTA overlays** — on-screen CTA text, link card appearance, urgency/scarcity text at the close
- **Pacing and delivery cues** — energy shifts between sections, pauses, urgency escalation

**Required workflow for all deep-analysis videos:**

1. Download the video using `yt-dlp` to a local mp4 file (see Safeguard 3 above for the exact command)
2. Run `manus-analyze-video [local_file_path] [analysis_prompt]` — the TikTok URL directly is **not supported** by `manus-analyze-video`; the local file path is required
3. The analysis prompt must explicitly request all visual elements: visual hook, on-screen text overlays at every timestamp, text hook, study popups, product reveal visual vs. verbal timing, CTA overlays, pacing cues
4. Full video analysis output is the **primary input** for the deep analysis report — audio transcript is supplementary reference only

**For classification-only videos (below $20K GMV threshold):** Audio transcript is sufficient. These only receive basic classification (hook type, section sequence, opening line, CTA structure, product reveal timing) — all extractable from spoken audio.

**Why this rule exists:** On-screen text overlays, visual hooks, and study popups are not decoration — they are doing active conversion work. The text hook is often the first thing a viewer reads. Study popups build credibility during the mechanism section. CTA overlays reinforce urgency at the close. A deep analysis that misses these elements is analyzing an incomplete version of the video and will produce incomplete frameworks.

---

## Step 3 — Line Bank Integration

### 3a. Caption safeguard for BOF line extraction

The same caption-vs-verbal-hook problem that applies to Rx Content also applies here. A creator's TikTok caption is SEO copy — it is not the verbal hook they say in the first 1–2 seconds of the video.

**Rule:** For every BOF video, transcribe the first 5–10 seconds of audio before extracting the verbal hook line. Do not use the caption text as the `verbalHooks` line. The verbal hook must be the exact words the creator says out loud at the opening of the video.

### 3b. Add lines to existing hooks

For each hook framework that the new creator uses, open `client/src/lib/bofLineBank.ts` and add their lines to the relevant section of the existing hook entry. Each line follows this TypeScript shape:

```ts
{
  line: 'The exact verbatim text with [product] as a placeholder',
  creator: '@newcreatorhandle',
  frequency: 'very-high' | 'high' | 'medium' | 'low',
  notes?: 'Optional context note'
}
```

**Important:** Do not paraphrase. The line must be verbatim or as close as possible, with product names replaced by `[product]`, prices by `[price]`, and deal-specific values by `[deal]`.

### 3c. Initial frequency for new creators

When adding a brand-new creator's lines for the first time, **do not default all lines to `medium` or `low`**. The `getTopLines()` helper is creator-balanced — it guarantees at least 1 line per creator per position — but frequency still determines which line from that creator gets selected when multiple lines exist.

**Guidance for initial frequency assignment:**
- Lines the creator uses in 3+ videos → `high`
- Lines the creator uses in 1–2 videos → `medium`
- Lines that are experimental or unvalidated → `low`

Do not assign `very-high` to a new creator's lines until they have been tested in real-world script generation and confirmed to perform. Promote to `very-high` during the Frequency Calibration step (Step 8) after testing.

### 3d. Add new hooks (if the creator uses a framework not yet in the bank)

If the creator uses a hook pattern that does not match any of the 11 existing frameworks, follow the `HOOK_ADDITION.md` guide to add a new hook entry before adding lines.

### 3e. Add creator-specific urgency closes

If the creator has signature closing lines that are distinct from the shared urgency closes pool, add them to `SHARED_URGENCY_CLOSES` in `bofLineBank.ts` with the correct `creator` field. They will automatically be picked up by the A/B/C variant system.

---

## Step 4 — Rx Content Generation Pipeline Update

This is the step that was missing before the @rphreviews sweep. **Every creator deep dive must produce at least one update here.** If a creator uses a hook framework, their structural insights must be wired into `HOOK_FRAMEWORKS.md` before the onboarding is complete.

> **Where to edit:** Open `HOOK_FRAMEWORKS.md` at the project root. This is the only file you need to touch for hook framework updates. The server loads it at runtime — changes take effect immediately on the next generation request without restarting the server.

### 4a. For each hook the creator uses, determine the update type:

| Finding type | What to update | Where |
|---|---|---|
| **New hook** (framework not yet in the tool) | Add a new `### N. hookId` section | `HOOK_FRAMEWORKS.md` (project root) |
| **New variant** (different opening style for existing hook) | Add variant (e), (f), etc. to the hook's opening style list | `HOOK_FRAMEWORKS.md` — the section for that hook |
| **Structural insight** (section sequence or section rule that differs from current) | Update the section sequence and/or section rules | `HOOK_FRAMEWORKS.md` — the section for that hook |
| **Stub hook** (hook exists but is marked `[STUB]`) | Replace the stub with real section rules from the creator's video | `HOOK_FRAMEWORKS.md` — the section for that hook |

### 4b. For each update, use verbatim references:

Every `HOOK_FRAMEWORKS.md` section must include:
- `Opening line pattern (verbatim):` — the exact words the creator says, transcribed from the video
- `Reference:` — the creator handle and view count
- `Key insight:` — the non-obvious structural mechanic that makes this hook work

Do not write opening line patterns from memory or paraphrase. Transcribe the first 5–10 seconds of the video and use the exact words.

### 4c. Also update these files for each new or updated hook:

| File | What to update |
|---|---|
| `client/src/lib/scriptData.ts` | Add the hook to the `HOOKS` array with `verbalHookVariants` populated from the verbatim transcript |
| `server/routers/videolab.ts` | Add the hook ID to `HOOK_REFERENCE_VIDEOS` with the creator's video URL |
| `server/scriptData.test.ts` | Update hook count assertions if the total number of hooks changed |

---

## Step 5 — Generation Pipeline Verification Checklist

**Run this checklist before saving the checkpoint. Do not skip it.**

For each hook found in the creator's videos, verify all of the following:

```
[ ] HOOK_FRAMEWORKS.md: grep for `### N. [hookId]` in HOOK_FRAMEWORKS.md confirms the section exists
[ ] HOOK_FRAMEWORKS.md: the section has a verbatim opening line pattern (not a template)
[ ] HOOK_FRAMEWORKS.md: the section has a section sequence with all named sections
[ ] HOOK_FRAMEWORKS.md: the section has section rules for every section in the sequence
[ ] HOOK_FRAMEWORKS.md: the section has a key insight line
[ ] scriptData.ts: the hook ID exists in the HOOKS array
[ ] scriptData.ts: the hook has at least 1 verbalHookVariant populated
[ ] videolab.ts: the hook ID has a reference video URL in HOOK_REFERENCE_VIDEOS
[ ] pnpm test: all tests pass
```

If any box is unchecked, the onboarding is not complete. Fix the gap before proceeding to the checkpoint.

### Structural Insight Checklist (run after every 3+ creator deep dives)

The following two documents are runtime-loaded references that the LLM receives on every generation call alongside `HOOK_FRAMEWORKS.md`. They must be updated when a new creator reveals a structural pattern or psychological insight not yet captured.

```
[ ] SCRIPT_ARCHITECTURE_GUIDE.md: does the new creator confirm, refine, or contradict any of the 9 universal structural rules?
    → If yes: update the relevant rule with the new creator's data and creator count
[ ] SCRIPT_ARCHITECTURE_GUIDE.md: does the new creator use a structural technique not yet in the guide?
    → If yes: add it as a new rule or execution note with creator attribution
[ ] BUYER_PSYCHOLOGY_LEVERS.md: does the new creator use a psychological lever not yet in the 11-lever list?
    → If yes: add it with creator attribution and confirmation count
[ ] BUYER_PSYCHOLOGY_LEVERS.md: does the new creator's data change the confirmation count on any existing lever?
    → If yes: update the count (e.g., "4/5 creators" → "5/6 creators")
```

**Where these files live:** `SCRIPT_ARCHITECTURE_GUIDE.md` and `BUYER_PSYCHOLOGY_LEVERS.md` are both in the project root. They are loaded by `tiktok.ts` at runtime via `fs.readFileSync` — the same mechanism as `HOOK_FRAMEWORKS.md`. Changes take effect immediately on the next generation request without restarting the server.

**How to check HOOK_FRAMEWORKS.md coverage quickly:**
```bash
grep -n '^### ' HOOK_FRAMEWORKS.md
```
This lists every defined hook section. Compare against the hook IDs in `client/src/lib/scriptData.ts` to find any that are missing or still marked `[STUB]`.

---

## Step 6 — A/B/C Variant System Update (BOF only — skip for Rx Content creators)

The A/B/C variant system assigns voices as follows:

| Variant | Voice |
|---|---|
| A | `@momfindsbyfaith` |
| B | `@dealscope` |
| C | Best fit (whichever creator's lines are strongest for the hook) |

When a third creator is added, update `buildAbTestPrompt()` in `server/routers/bof.ts` to add a Variant D, or replace Variant C with the new creator if they are a stronger performer than the current "best fit" logic. The prompt section to update is clearly labeled `CREATOR VOICE RULE`.

---

## Step 7 — Testing

After adding lines, run the full test suite to confirm nothing is broken:

```bash
pnpm test
```

The following tests will automatically validate the new creator's lines:

- `BOF Line Bank — structure`: confirms every hook has required sections
- `BOF Line Bank — creator consistency`: confirms creator fields are set correctly
- `getTopLines helper`: confirms frequency sorting works with new lines
- `A/B/C creator voice separation`: confirms Faith and dealscope closes remain distinct

If a new creator's closes overlap with an existing creator's closes, the test `"Faith closes do not appear in dealscope closes list"` will fail. Resolve by ensuring each close is attributed to exactly one creator.

---

## Step 8 — Frequency Calibration

After the first round of real-world testing with the new creator's lines, revisit the frequency ratings:

- Lines that generate strong engagement → promote to `very-high`
- Lines that underperform → demote to `low` (they will stop appearing in the top-3 filter)
- Lines that never get used → can be left at `low` indefinitely (they do not affect the model)

The `getTopLines()` helper sorts by frequency order: `very-high` → `high` → `medium` → `low`. Only the top 3 are passed to the LLM, so frequency ratings directly control what the model sees.

---

## Step 9 — Save Checkpoint

After all lines are added, tests pass, and the Generation Pipeline Verification Checklist (Step 5) is fully checked off, save a checkpoint with a descriptive message:

```
Creator Onboarding: @newcreatorhandle — X lines added across Y hooks
```

---

## Reference: Existing Creators

| Creator | Handle | Niche | Primary Hooks | Signature Close |
|---|---|---|---|---|
| Faith | `@momfindsbyfaith` | General products, supplements | Reverse Psychology, Warning, Bundle, Returning This, Always Read Reviews | "before they raise the price" |
| Dealscope | `@dealscope` | General products, tech, household | TikTok Glitch, Quantity Math, Comparison, Deal Alert | "before the timer runs out" |
| Brian | `@blackfridaybrian` | Health/wellness supplements | Fake Outrage (Throwing This Away) | "the sale's gonna be ending very soon" |
| Welearn2earn | `@welearn2earn` | General consumer products | Hope You Didn't Buy, You Got Robbed | "the sale's gonna be ending very soon" |

---

## Common Mistakes to Avoid

**Do not blend creators.** If a line sounds like it could belong to either creator, assign it to the one who says it more often, or mark it as `creator: 'both'` if it genuinely appears in both creators' videos.

**Do not paraphrase.** The entire value of the line bank is verbatim authenticity. Even small word changes ("tap the cart" vs. "tap the orange cart") matter for voice consistency.

**Do not add too many lines at once.** Add the top 5–7 lines per hook position for a new creator. More lines can always be added later as patterns are confirmed. Flooding the bank with unvalidated lines dilutes the frequency signal.

**Do not skip the test suite.** The tests are the quality gate. A failing test after onboarding means something was misconfigured — fix it before saving the checkpoint.

**Do not use captions as verbal hooks.** The caption is SEO copy. The verbal hook is what the creator says in the first 1–2 seconds of the video. Always transcribe the opening of the video before extracting the verbal hook. See Step 2, Safeguard 1.

**Do not analyze sidebar or recommended videos.** TikTok shows other creators' videos in the sidebar and recommendation panels. Always verify the video URL contains the creator's exact handle before analyzing it. See Step 2, Safeguard 2.
