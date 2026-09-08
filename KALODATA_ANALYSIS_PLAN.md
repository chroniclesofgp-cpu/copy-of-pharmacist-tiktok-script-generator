# Kalodata Analysis Plan
## RxContent — Healthcare Creator Framework Rebuild
**Created:** May 31, 2026
**Status:** Ready to execute — Kalodata access confirmed. URLs to be uploaded.
**Purpose:** This document is the failsafe reference for the Kalodata-driven framework rebuild. If context is lost between sessions, share this document to restore the full plan and methodology before starting the analysis.

---

## The Core Decision Made (May 31, 2026)

The original `HOOK_FRAMEWORKS.md` is being treated as a **first draft built with inferior methodology**, not as a validated baseline to confirm. The re-analysis is a full rebuild using better data and better methodology. Where the new data contradicts the current doc, the new data wins.

**Why the original is a draft, not a foundation:**

1. **Filtered by views, not revenue.** A video with 2M views that drove $4K in sales ranked above a 200K-view video that drove $60K. The entire ranking of what is "working" was based on the wrong signal.
2. **Captions were likely used as a proxy for spoken hooks in some cases.** The rule — captions are SEO copy, not hooks; the verbal hook is what the creator says in the first 1–2 seconds on camera — was established after the original analysis. Any opening line extracted from a caption rather than a transcribed video is unreliable.
3. **One hook was already deleted** because it came from a non-Shop video. That is a confirmed false positive from the original methodology.
4. **The analysis methodology has improved significantly since then.** We now download and transcribe every video, capture spoken words verbatim, capture all on-screen text overlays, note pacing and tonality, and track product reveal timing precisely. The original analysis did not do all of this.

---

## The Revised Sequencing (Corrected from Original Roadmap)

The original roadmap had Steps 1 and 2 running in parallel, implying the batch analyzer tool was needed to do the foundational research. That framing was wrong. The correct sequencing is:

### Phase 1 — Foundation Rebuild (Manual, With AI)
**This is the immediate next step. Do this first.**

Pull 20–30 top GMV videos per creator from Kalodata. Analyze each one manually using the correct methodology. Rebuild `HOOK_FRAMEWORKS.md` from that data. This is done in a session with the AI, not with a tool.

### Phase 2 — Ongoing Expansion (Batch Analyzer Tool)
Once the foundation is solid and validated, the batch analyzer handles periodic refreshes at scale — new creators, new product categories, or a refresh pass when the market shifts. The batch analyzer is a maintenance and expansion tool, not a foundation-building tool.

---

## Phase 1 — Detailed Execution Plan

### What to Pull from Kalodata

For each of the following creators, export their **top 20–30 videos ranked by estimated GMV** (not views, not saves — GMV only):

| Creator | Handle | Why |
|---|---|---|
| Drew | @drew.review | Primary source for After-1-Month and Trend-or-Trash hooks |
| Riva | @adoseofwellness | Primary source for Instruction-Correction, Symptom-Checklist, Suppressed-Knowledge |
| rphreviews | @rphreviews | Primary source for Comparison, Warning-Signs, How-Do-You-Know, Authority-Breakdown |
| Faith (Rx content only) | @faithfuldoc | Healthcare Rx-style content — BOF content excluded |

**Critical filter:** Only include TikTok Shop affiliate videos (videos where the creator is promoting a product with a Shop link). Non-Shop videos — opinion pieces, comment replies with no product, general education with no affiliate link — are excluded. A framework built from a non-Shop video is a content framework, not a conversion framework.

### What to Bring to the Session

A list of URLs — one per line is fine. You do not need to organize them by creator first. Paste them directly and the analysis session will handle the rest.

---

## Phase 1 — Analysis Methodology (Non-Negotiable Rules)

These rules were established from hard lessons during the original analysis. They are not optional.

**Rule 1 — Download and transcribe every video.**
The only way to accurately extract a spoken hook, section order, tonality, CTA structure, and on-screen text sequence is to download and transcribe the actual video audio. TikTok page metadata (captions, titles, hashtags) is discovery copy — it does not reflect what the creator says on camera.

**Rule 2 — Captions are not hooks.**
The verbal hook is what the creator says in the first 1–2 seconds on camera. Captions are SEO copy and routinely do not match the actual opening line. Never extract a hook from a caption.

**Rule 3 — Only analyze videos from the creator's own profile grid.**
TikTok's sidebar shows other creators' videos. These contaminate the analysis. Every URL must be confirmed as the target creator's own video before analysis.

**Rule 4 — Only include confirmed Shop videos.**
If a video has no affiliate product link, it is excluded from the framework analysis. A non-Shop video cannot validate a conversion framework.

**Rule 5 — Unclassified is a valid output.**
If a video does not map to any of the 14 existing frameworks, it is flagged as unclassified — not forced into the nearest bucket. Unclassified videos that share a structural pattern across 3+ examples are new hook candidates.

---

## What Each Video Analysis Captures

For every transcribed video, the following is extracted and saved:

| Element | What It Captures |
|---|---|
| Verbatim opening line | Exact first 1–3 seconds of spoken audio |
| Hook framework classification | Which of the 14 frameworks (or unclassified) |
| Section sequence | The exact order of sections as they appear |
| Section word budget | Approximate word count per section |
| Product reveal timing | Exact moment the product name/visual first appears |
| On-screen text overlays | Every text overlay, in order, verbatim |
| Graphics and study popups | Every visual element and what it shows |
| CTA structure | Exact CTA language, length, and placement |
| Pacing and tonality | Delivery energy — authoritative, conversational, urgent |
| Authority placement | Where the credential appears — opening, mid-video, or implied |

---

## What Gets Saved Permanently

### Raw Layer (never needs to be redone)
- `analysis/[creator]_video_urls_gmv.txt` — URLs pulled from Kalodata, ranked by GMV
- `analysis/[creator]_transcripts_gmv_full.txt` — verbatim transcripts with on-screen text noted

**The raw transcripts are the permanent asset.** Any future question — what CTAs did they use, how long was the authority section, when did they show the product — can be answered from the saved transcripts without re-downloading or re-transcribing a single video.

### Synthesis Layer (updated as analysis deepens)
- `analysis/[creator]_analysis_gmv.md` — hook classification, section sequences, opening line bank, CTA patterns, structural notes per video

### Framework Layer (rebuilt from synthesis)
- `analysis/HOOK_FRAMEWORKS.md` — updated with confirmed section sequences, validated opening line banks, primary sequences and validated variations, fixed vs. flexible elements, product category notes

---

## What the Rebuilt Frameworks Doc Looks Like

The current structure for each hook is:
- One reference video
- One opening line pattern
- One section sequence
- Section weights inferred from that one video

The rebuilt structure for each hook will be:
- 8–10+ reference videos, GMV-ranked
- 3–5 validated opening line patterns (verbatim, from real videos)
- Primary section sequence (appears in majority of high-converting examples)
- 2–3 validated variations with notes on when each is used
- Fixed elements (appear in 80%+ of examples — structural requirements)
- Flexible elements (appear in 40–60% of examples — stylistic choices)
- Product category notes (does this hook perform differently for supplements vs. skincare vs. devices?)

---

## New Hook Identification Protocol

During the synthesis pass, every video gets classified. If a video does not map to any existing framework, it is flagged as unclassified. When 3+ unclassified videos share the same structural pattern across different creators or products, that pattern becomes a new hook candidate.

A new hook candidate requires:
1. Minimum 3 confirmed high-converting examples (GMV-validated)
2. Verbatim opening line examples from real videos
3. Confirmed section sequence
4. Section weights and content rules
5. Notes on which product categories it performs best in

New hook candidates are added to `HOOK_FRAMEWORKS.md` as new entries and flagged for addition to the tool's hook library in the same session.

---

## Three Unanchored Hooks (Priority Targets)

These three hooks in the current frameworks doc have no confirmed reference video — they were inferred with no real example. Finding real high-converting examples for these is a primary goal of the re-analysis:

| Hook | Status | Why It Matters |
|---|---|---|
| Forbidden-Knowledge | Inferred — no reference video | High-potential hook for pharmacist authority content |
| Age-Trigger | Inferred — no reference video | High-intent audience for supplements and skincare |
| Dosing-Protocol | Inferred — no reference video | Natural fit for pharmacist credential |

---

## How This Improves the Work Done Together (Outside the Tool)

Every script written in a session with the AI is only as good as the framework it is built from. After the rebuild:

- Hook selection is based on which framework has the highest revenue-validated precedent for that product category — not intuition
- Section sequences are built from multi-video consensus, not single-video hypothesis
- Opening lines are drawn from a validated range of proven phrasings, not extrapolated from one example
- New hooks identified in the re-analysis are immediately available for script generation
- Product category calibration (does this hook perform differently for supplements vs. skincare) is built into the framework, not guessed

All of this is permanent — it lives in documents that are read at the start of every scripting session and updated in place when new data improves them.

---

## Execution Safeguards — Two-Phase Process With Audit Gates

The same failure modes that caused incomplete intel docs during the bulk product research apply here. The same safeguard structure is required.

---

### Where This Analysis Can Fail

**Failure 1 — Video unavailable or private.** Videos in the top 30 may have been deleted, made private, or geo-restricted since Kalodata recorded them. A bulk run that hits a dead video and does not handle it gracefully will either skip it silently (lost data) or produce an empty transcript that looks like a completed analysis (false data). Both corrupt the output.

**Failure 2 — Transcription is incomplete or truncated.** Audio transcription on 1–2 minute videos can truncate due to audio quality drops, background music, or timeouts. A partial transcript that is not flagged as partial will produce a wrong section sequence — the hook may be classified correctly but the back half of the video (product reveal, CTA) will be missing from the analysis.

**Failure 3 — Forced classification.** In a bulk run, there is pressure to classify every video into an existing framework. A video that does not fit gets forced into the nearest bucket rather than flagged as unclassified. This is the most dangerous failure — it corrupts the frameworks doc with false confirmations. A video forced into Instruction-Correction when it is actually a new unidentified pattern means the new pattern is never discovered and the Instruction-Correction framework gets a false example.

**Failure 4 — Caption contamination.** In a bulk run without explicit rules enforced per video, the transcription step may pull caption text instead of spoken audio for some videos, especially if the download fails and the tool falls back to available metadata. This is exactly the failure mode from the original analysis that invalidated several hook frameworks.

---

### The Two-Phase Safeguard Structure

#### Phase A — Bulk Data Collection (Safe to Parallelize)

**What it does:** Download all videos and save raw audio transcripts. No interpretation — purely mechanical.

**Rules:**
- Every video that fails to download or produces an empty/truncated transcript is flagged immediately with the URL and failure reason
- Do NOT proceed to analysis on any flagged video
- Transcription must capture spoken audio only — never fall back to caption text
- At the end of Phase A, produce a **Completion Report** before any analysis begins:
  - X videos successfully transcribed
  - Y videos failed (URL + failure reason listed)
  - Z videos flagged as potentially truncated (audio quality issues)
- Phase B does not start until the Completion Report is reviewed

#### Phase B — Analysis and Classification (Sequential, With Audit Gate)

**What it does:** Analyze each transcribed video and classify it. Done in batches by creator — not all 120 at once.

**Rules:**
- Analyze one creator's batch at a time: Riva → Drew → rphreviews → Faith
- For each video, the output is: hook classification, section sequence, verbatim opening line, CTA structure, product reveal timing, on-screen text overlays
- Any video that cannot be confidently classified is flagged as **UNCLASSIFIED** — never forced into the nearest existing framework
- At the end of each creator's batch, produce a **Classification Report** for that creator before moving to the next
- The Classification Report lists every video with its classification, confidence level, and any flags

#### Audit Gate — Between Phase B and Frameworks Doc Update

**This is the non-negotiable checkpoint.**

- The frameworks doc (`HOOK_FRAMEWORKS.md`) is NOT updated until all four creator batches are complete and all four Classification Reports have been reviewed
- Before writing anything to the frameworks doc, the full classification picture across all 120 videos is visible — some patterns only become clear when seen across multiple creators
- Any classification that looks wrong is corrected before the frameworks doc is touched
- Unclassified video clusters (3+ videos sharing a structural pattern not in the existing 14 frameworks) are identified and documented as new hook candidates before the frameworks doc is updated
- The frameworks doc is updated in one deliberate pass after review — not incrementally during analysis

---

### Batch Sequencing

| Step | Action | Parallelizable? | Gate Before Next Step |
|---|---|---|---|
| 1 | Download + transcribe all 120 videos | Yes — bulk | Completion Report reviewed |
| 2 | Analyze Riva's 30 videos | No — sequential | Classification Report reviewed |
| 3 | Analyze Drew's 30 videos | No — sequential | Classification Report reviewed |
| 4 | Analyze rphreviews' 30 videos | No — sequential | Classification Report reviewed |
| 5 | Analyze Faith's 30 videos | No — sequential | Classification Report reviewed |
| 6 | Review all 4 Classification Reports together | — | Full cross-creator picture confirmed |
| 7 | Update HOOK_FRAMEWORKS.md | — | Only after Step 6 |
| 8 | Save raw transcripts to permanent files | — | Immediately after Step 1 |

---

## Phase 2 — Batch Analyzer (After Foundation Is Complete)

Once the frameworks doc is rebuilt and validated, the batch analyzer handles ongoing expansion:

- Paste 50–100 URLs from Kalodata at once
- Tool transcribes and classifies each video automatically
- Outputs a classification report: which frameworks appear most, frequency counts, unclassified candidates
- Used for periodic refreshes, new creator onboarding, and product category gap analysis
- Rate limiting built in (1–2 second delay between requests) to avoid tikwm.com throttling
- Private/deleted videos handled gracefully — skipped and flagged, not blocking

**The batch analyzer is not needed for Phase 1.** Phase 1 is manual, deliberate, and methodology-driven. The batch analyzer adds value at scale once the foundation is trustworthy.

---

## How to Resume This Work After Context Loss

1. Share this document (`KALODATA_ANALYSIS_PLAN.md`) at the start of the new session
2. Also share `analysis/HOOK_FRAMEWORKS.md` — the current frameworks doc being rebuilt
3. Also share `MASTER_CONTEXT.md` — the full project context
4. Paste the Kalodata URLs
5. The session begins with Phase 1 execution — download, transcribe, analyze, save raw transcripts, synthesize, update frameworks doc

---

## May 31, 2026 — Plan Revision: Deep Analysis Upgrade

The original plan (above) covered Phase A (transcription) and Phase B (basic classification). During the May 31 session, the scope and methodology were significantly upgraded based on a decision to extract maximum value from the 87-video dataset. This section records all changes made to the plan.

---

### What Changed

**Original Phase B:** Basic classification — hook type, section sequence, verbatim opening line, CTA structure, product reveal timing, on-screen text overlays.

**Revised Phase B:** Full 13-dimension psychological analysis per video. The additional dimensions were added because the analysis docs are not for the creator to read — they are source material that feeds three permanent reference documents used by AI every time a script is written. The deeper the analysis, the better those reference docs become, and the better every script produced from them.

---

### Revised 13-Dimension Analysis Framework

Each video above the $20K GMV threshold receives analysis across all 13 dimensions:

1. **Hook classification** — which of the 14 frameworks (or unclassified)
2. **Verbatim opening line** — exact first 1–3 seconds of spoken audio
3. **Curiosity loop mechanics** — where loops open, what question they pose, when they close
4. **Rehook placement** — where mid-video retention hooks appear and what type they are
5. **Section sequence and word budget** — exact order of sections with approximate word counts
6. **Product reveal timing** — exact moment the product name/visual first appears
7. **Transition mechanics** — how the creator bridges education → product reveal → CTA (this was identified as a gap in scripts written so far — transitions feel bolted on)
8. **Objection handling** — whether it appears, when, how it is framed
9. **CTA mechanics** — type (urgency/benefit/social proof), timing, exact framing
10. **Buyer psychology levers** — which Cialdini levers are pulled and where (authority, scarcity, social proof, reciprocity, liking, commitment/consistency)
11. **Desire channel** — which primary desire the video activates (Whitman/Schwartz: health, safety, appearance, social approval, freedom, pleasure, financial gain, self-actualization)
12. **TOF/MOF/BOF classification** — funnel stage of the video and structural markers that identify it
13. **Unexpected patterns** — anything not in the above dimensions that appears consistently across high-converting videos

Videos below the $20K GMV threshold receive classification-only treatment (dimensions 1, 2, 5, 6, 9 only).

---

### $20K GMV Threshold — Final Video Counts

| Creator | Deep Analysis (13 dimensions) | GMV Coverage | Classification Only |
|---|---|---|---|
| @rphreviews | 23 | 90.3% of total | 7 videos |
| @adoseofwellness (Riva) | 23 | 92.2% of total | 7 videos |
| @drew.review (Account 1) | 12 | 93.4% of total | 3 videos |
| @drew.review1 (Account 2) | 10 | 89.3% of total | 5 videos |
| @faithfuldoc (Dr. Faith) | 10 | 84.7% of total | 15 videos |
| @naturopathicapothecary1 | 9 | 83.9% of total | 11 videos |
| **Total deep analysis** | **87 videos** | | |

**Cutoff rationale:** $20K GMV per video is the threshold. Videos below this level have not demonstrated enough conversion performance to be worth studying at the 13-dimension level. The classification-only pass on lower-ranked videos still captures hook types and section sequences — it just does not go deep on psychology and mechanics.

---

### Three Output Documents (Revised from Original Plan)

The original plan produced one output: a rebuilt HOOK_FRAMEWORKS.md. The revised plan produces three permanent reference documents:

| Document | Job | When Consulted by AI |
|---|---|---|
| **HOOK_FRAMEWORKS.md** (rebuilt) | Hook selection + psychological execution notes per framework | When choosing and opening the hook |
| **SCRIPT_ARCHITECTURE_GUIDE.md** (new) | Mid-video structure, loop mechanics, rehook placement, transition mechanics, CTA patterns, TOF/MOF/BOF execution notes | While writing and during post-generation structure check |
| **BUYER_PSYCHOLOGY_LEVERS.md** (new) | Cialdini persuasion levers + Whitman desire channels + product positioning framework | Before writing (desire channel selection) AND after writing (lever verification) |

**Plus:** Intel doc template update — every product intel doc gains a "Content Campaign Plan" section for TOF/MOF/BOF launch sequencing. This is a planning tool, not a script-writing reference.

**SCRIPT_ARCHITECTURE_GUIDE.md feeds the web app:** Once written, this guide will be encoded into the script generator (JSON schemas or system prompt update). It is also the rubric for the post-generation structure check (Kalodata roadmap Step 5, previously deferred).

---

### Buyer Psychology Theoretical Foundation

The 13-dimension analysis applies a buyer psychology lens grounded in the following canonical texts:

| Book | Author | Primary Contribution |
|---|---|---|
| *Influence: The Psychology of Persuasion* | Robert Cialdini | 6 core persuasion levers |
| *Pre-Suasion* | Robert Cialdini | Priming attention before the ask |
| *Breakthrough Advertising* | Eugene Schwartz | Awareness levels, mass desire, TOF/MOF/BOF origins |
| *Cashvertising* | Drew Eric Whitman | 8 Life-Force desires + 9 secondary desires |
| *Building a StoryBrand* | Donald Miller | Customer as hero, product as tool |
| *The Adweek Copywriting Handbook* | Joseph Sugarman | Slippery slide — every sentence earns the next |
| *Ogilvy on Advertising* | David Ogilvy | Specificity, long-copy discipline, headline primacy |

---

### Discovery Mandate

The analysis is open-ended. Any pattern that appears consistently across high-converting videos that was not anticipated — unexpected structural choices, recurring phrases, timing patterns, audience framing techniques — gets flagged, documented, and added to the relevant reference doc. The 13 dimensions are the planned search space; the discovery mandate covers everything outside it.

---

### Revised Batch Sequencing

| Step | Action | Gate Before Next Step |
|---|---|---|
| 1 | Copy uploaded files to project; restore rphreviews transcripts | Confirm all files in place |
| 2 | Batch transcribe all 5 remaining creators (30 videos each) | Completion Report reviewed |
| 3 | Deep analysis — rphreviews (23 videos, 13 dimensions) | Classification Report reviewed |
| 4 | Deep analysis — Riva (23 videos, 13 dimensions) | Classification Report reviewed |
| 5 | Deep analysis — Drew Acct 1 + Acct 2 (12 + 10 videos) | Classification Report reviewed |
| 6 | Deep analysis — Dr. Faith + naturo (10 + 9 videos) | Classification Report reviewed |
| 7 | Cross-creator synthesis — identify universal patterns, new hook candidates | Full picture confirmed |
| 8 | Rebuild HOOK_FRAMEWORKS.md | After Step 7 |
| 9 | Write SCRIPT_ARCHITECTURE_GUIDE.md | After Step 7 |
| 10 | Write BUYER_PSYCHOLOGY_LEVERS.md | After Step 7 |
| 11 | Update intel doc template with Content Campaign Plan section | After Step 7 |
| 12 | Save checkpoint | After Steps 8–11 complete |

---

### Sandbox Restore Note (May 31, 2026)

The sandbox was restored to checkpoint fea1f18b during this session. All transcript files and analysis files generated after that checkpoint were lost. The following files were recovered via user upload:

- `rphreviews_transcripts_gmv_full.txt` ✓ (recovered)
- `rphreviews_analysis_gmv.md` ✓ (recovered)
- `rphreviews_analysis.md` ✓ (recovered)
- `HOOK_FRAMEWORKS.md` ✓ (recovered)
- `KALODATA_ANALYSIS_PLAN.md` ✓ (recovered)
- `MasterContextDocument.md` ✓ (recovered)
- All 5 remaining creator xlsx files ✓ (uploaded fresh)

Transcript files for Riva, Drew Acct 1, Drew Acct 2, Dr. Faith, and naturo were never generated before the restore — they need to be created fresh via batch transcription.

**Lesson applied:** All analysis output files are now saved inside `/home/ubuntu/pharma-script-gen/analysis/` (git-tracked directory) so they survive future sandbox restores via checkpoint.

---

### Rule 6 — Deep Analysis Requires Full Video, Not Transcript Only (Added May 31, 2026)

**This is a non-negotiable rule for all deep-analysis videos (those above the $20K GMV threshold).**

Audio transcripts alone are insufficient for a 13-dimension deep analysis. The transcript captures spoken audio but misses the following elements that are doing real conversion work and must be analyzed:

- **Visual hook** — what is physically on screen in the first 0–3 seconds before or as speaking begins (product in hand, setting, visual framing)
- **On-screen text overlays** — the hook text that appears while the creator speaks, ingredient callouts, study citation popups, credential reinforcement text, product stat callouts
- **Text hook** — the on-screen text hook is often different from the spoken hook and is the first thing the viewer reads before they hear anything
- **Study and data popups** — specific study citations, percentages, and claims that flash on screen during the mechanism section
- **Product reveal visuals** — what the product looks like on screen at the moment of reveal, and whether the visual reveal precedes or follows the verbal reveal
- **Rehook visuals** — mid-video pattern interrupts that use on-screen text or visual changes, not just spoken words
- **CTA overlays** — the on-screen CTA text, link card appearance, and any urgency/scarcity text that appears at the end
- **Pacing and delivery cues** — energy shifts between sections, pauses, urgency escalation

**Required workflow for all deep-analysis videos:**

1. Download the video using `yt-dlp` to a local mp4 file
2. Run `manus-analyze-video [local_file_path] [analysis_prompt]` — NOT the TikTok URL directly (unsupported)
3. The analysis prompt must explicitly request: visual hook, on-screen text overlays at every timestamp, text hook, study popups, product reveal visual vs. verbal timing, CTA overlays, and pacing cues
4. The full video analysis output is the primary input for the 13-dimension report — the audio transcript is supplementary reference only

**For classification-only videos (below $20K GMV threshold):** Audio transcript is sufficient. These videos only receive dimensions 1, 2, 5, 6, and 9 — all of which can be extracted from spoken audio alone.

**Why this rule exists:** On-screen text overlays, visual hooks, and study popups are not decoration — they are doing active conversion work. The text hook is often the first thing a viewer reads. Study popups build credibility during the mechanism section. CTA overlays reinforce urgency at the close. A deep analysis that misses these elements is analyzing an incomplete version of the video and will produce incomplete frameworks. This was confirmed during the rphreviews analysis setup on May 31, 2026.

**This rule applies to all future creator onboarding as well.** Any creator deep dive — whether part of the initial 6-creator analysis or a future creator added to the system — must use full video analysis for all videos above the GMV threshold. This rule supersedes any earlier methodology that relied on transcript-only analysis for deep dives.
