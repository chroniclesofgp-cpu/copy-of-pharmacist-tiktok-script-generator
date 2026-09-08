# Script-Writing Source Audit Inventory

**Prepared:** September 3, 2026  
**Purpose:** Identify what currently exists to audit how RxContent’s script-writing documents and hook frameworks were built. This inventory separates active guidance, derived analysis, raw source captures, and historical/archive material. It is an inventory, not yet a substantive re-evaluation of every claim.

## Executive conclusion

The project retains a substantial audit corpus. It is not limited to the active `HOOK_FRAMEWORKS.md` document. The corpus includes the six primary writing references, additional architecture and quality controls, rebuilt framework cards, dozens of creator-analysis documents, exact recent transcript artifacts, source logs, product-intelligence records, earlier scripts, and an external raw-evidence archive.

The most important distinction is provenance. Some files are **raw or near-raw source captures**; some are **derived analyses** built from those captures; and some are **active guidance** that converted the analysis into reusable writing rules. The active guidance must not be mistaken for the raw evidence that justified it.

The current filename inventory contains **127 Markdown files** under the project’s non-archived workspace. The active project also contains non-Markdown transcript JSON/TXT artifacts and source media-related artifacts. The external archive currently enumerates 12 retained files, primarily Dr. Dent raw evidence and first-party records. The three recently recovered comparison-video MP4/MP3 files were moved outside the active project before checkpointing; the active project retains their clean transcription outputs, JSON segment data, transcript-only Markdown documents, and retrieval log.

## 1. Active documents used directly or indirectly for script writing

| Source class | Active files | What they control | Provenance status |
|---|---|---|---|
| Governing context | `MASTER_CONTEXT.md` | Session rules, source priority, creator-analysis workflow, hook catalog, study standards, clean-slate boundaries, and script-delivery rules | Active governance; derived from project decisions and source analyses, not itself raw evidence |
| Core hook reference | `HOOK_FRAMEWORKS.md` | Hook names, creator associations, opening patterns, funnel roles, reveal timing, comparison/rating structures, and source indexes | Active framework guidance; should be audited against its cited creator sources |
| Architecture | `SCRIPT_ARCHITECTURE_GUIDE.md` | Hook-first opening, gap, authority placement, curiosity/reveal timing, education, proof, transition, CTA, and no-redundancy/product-advancement rules | Active writing control; derived guidance |
| Buyer psychology | `BUYER_PSYCHOLOGY_LEVERS.md` | Pain recognition, curiosity, authority, social proof, objection relief, urgency, identity, and action sequencing | Active writing control; derived guidance |
| Language | `PHRASE_BANK.md` | Reusable transitions, gap language, objection pivots, rehooks, and CTA language | Active phrase reference; provenance varies by phrase and should be traced to source examples |
| Visual execution | `VISUAL_OVERLAY_PLAYBOOK.md` | Three-hook system, overlay timing, proof cards, study popups, product reveals, diagrams, and visual load-sharing | Active production guidance; derived from visual source analysis |
| Healthcare hook guide | `HEALTHCARE_HOOK_REFERENCE_GUIDE.md` | Human-readable distinctions among instruction, right-way, verdict, comparison, symptom, bundle, and authority formats | Active framework interpretation; derived guidance |
| BOF framework | `BOF_INSTRUCTION_CORRECTION_TEMPLATES.md` | Type 1/2/3 BOF structures, triple hooks, offer mechanics, captions, and filming controls | Active BOF framework guidance |
| Compressed reference | `PRE_SESSION_BRIEF.md` | Short-session condensation of the six references plus quality checks | Derived convenience document; must not supersede the full sources for high-volume or new-category work |
| Quality controls | `POST_WRITE_CHECKLIST.md` | Post-write audit, Rule E/product-advancement checks, claim/proof review, authority placement, CTA, visual, and filming checks | Active quality gate; recently strengthened after the DryWater failure audit |
| Source boundary/protocol | `CLEAN_SLATE_ACTIVE_SOURCE_MAP.md`, `FACT_ONLY_PRODUCT_RESEARCH_PROTOCOL.md`, `COMPETITIVE_DECISION_MAP_STANDARD_2026-09-01.md` | Which post-reset sources are active, how product facts are sourced, and how comparisons must use real alternatives | Active operating controls; not creator raw data |
| Tracking/indexes | `SCRIPT_LIBRARY.md`, `CONTENT_PIPELINE.md` | Script catalog, filming queue, and production traceability | Active operational indexes; derived outputs |

The project also contains implementation-level controls that affect generation: `server/routers/tiktok.ts`, `server/script-quality-control.test.ts`, `server/drywater.campaign.test.ts`, `client/src/lib/scriptData.ts`, `client/src/pages/Home.tsx`, and `client/src/lib/bofLineBank.ts`. These are not source evidence, but they determine whether documented controls are actually passed to the model, retained in the result, shown to the writer, and protected by tests.

## 2. Rebuilt framework cards and source-backed framework work

The fresh post-reset framework set is stored under `analysis/rebuild-frameworks/` and includes the BOF apology, Type 4 scam-warning, Bundle Routine Walkthrough, Category Scorecard, Numeric Scorecard variation, Do/Don’t Contrast, Best-Last List, Competitive Decision Map, and Product X verification sheet. These cards are **derived framework documents**, not raw transcripts. They should be audited by tracing each one to its listed original source or source log.

The post-reset source log `research/rebuild_framework_source_inventory_2026-09-01.txt` and the framework cards preserve the source-selection and structure-reconstruction trail. The cards intentionally separate a repeatable structure from product claims. They should not be treated as proof that the underlying hook converted unless the linked original video or performance record is also available.

## 3. Creator deep-dive and derived-analysis corpus

The principal creator-analysis files currently present include `analysis/riva_deep_analysis.md`, `analysis/rphreviews_deep_analysis.md`, `analysis/faith_deep_analysis.md`, `analysis/CREATOR_DEEP_ANALYSIS_DRFAITH.md`, `analysis/CREATOR_DEEP_ANALYSIS_NATURO.md`, `analysis/drew_deep_analysis.md`, `analysis/naturo_deep_analysis.md`, `analysis/rphreviews_analysis.md`, `analysis/rphreviews_analysis_gmv.md`, and `analysis/riva_scam_hook_3video_synthesis.md`.

Supporting analyses include `analysis/splitscreen_comparison_hook_synthesis.md`, `analysis/affiliate_cta_video_2026_analysis.md`, `analysis/BENEFIT_LINES_VIDEO_ANALYSIS.md`, `analysis/VERIFIED_OVERLAY_DATA.md`, `analysis/CROSS_CREATOR_VALIDATION_GATE.md`, `analysis/proven_cta_bank_proposal.md`, `analysis/creator_compliance_audit_working_2026-08-17.md`, and `analysis/MASTER_ANALYSIS_APR2026.md`.

These files are **derived analysis**, not automatically verbatim. The Master Context explicitly warns that the video analyzer is reliable for visual elements but not exact spoken wording. Exact hook, credential, and CTA quotations must be cross-checked against Whisper/transcription artifacts or an actual full audio capture. This distinction is central to the audit.

## 4. Raw transcript and source-video artifacts currently available

The active project contains a recent, clearly attributable exact-source corpus under `research/comparison-videos/` and `research/comparison-transcripts/`:

| Creator | Raw/near-raw artifacts retained in project | Transcript-only deliverable | Coverage |
|---|---|---|---|
| Dr. Faith | Exact-source `.txt`, clean transcription `.txt`, timestamped transcription `.json` | `research/comparison-transcripts/dr-faith-comparison-verbatim-transcript.md` | Complete spoken capture for the selected comparison video |
| rphreviews | Exact-source `.txt`, clean transcription `.txt`, timestamped transcription `.json` | `research/comparison-transcripts/rphreviews-comparison-verbatim-transcript.md` | Complete spoken capture for the selected comparison video |
| Riva | Exact-source `.txt`, clean transcription `.txt`, timestamped transcription `.json` | `research/comparison-transcripts/riva-comparison-verbatim-transcript.md` | Complete spoken capture for the selected comparison video |

The corresponding exact TikTok URLs, extraction route, and artifact paths are in `research/comparison_transcript_retrieval_log_2026-09-03.md`. The source media were downloaded and transcribed through the link-based workflow, then moved out of the active project because large media files prevented checkpointing. The active project therefore retains the clean transcript outputs and segment JSON, while the current external-archive filename inventory must be checked separately if the MP4/MP3 files themselves are required for audit.

Other transcript-like source artifacts include `research/affiliate_cta_reference_transcript.txt`, `research/fb_reference_1_transcript.txt`, `research/fb_reference_2_transcript.txt`, `research/fb_reference_3_transcript.txt`, and `research/medicube_truly_2026_source_transcript.txt`. These are source captures or near-raw transcripts for specific reference videos, but they do not constitute a transcript for every hook in `HOOK_FRAMEWORKS.md`.

The project also contains `research/video-analysis/drdent_lindseeeerae_7680011170807401741_2026-09-01.txt` and its direct-media-url companion. These are product-video analysis artifacts and should be treated as derived/observational records unless paired with the original media and a clean transcript.

## 5. Product, listing, study, review, and shopper evidence

Product-intelligence records are stored under `product-intel/`. They contain product identity, label/PDP facts, directions, ingredients, studies, reviews, product-video benchmarks, comments, competitor alternatives, and pharmacist-use facts at varying levels of completion. The active fact-only protocol requires these elements to be separated from later campaign decisions.

The retained external archive contains the following important raw-evidence classes:

| Archive location | Retained evidence |
|---|---|
| `research/drdent_purple_toothpaste_tablets_physical_label_transcription_2026-08-31.md` | Controlling physical-tin transcription for Dr. Dent directions, warnings, and label facts |
| `research/drdent_marketplace_image_label_check_2026-08-30.md` | Marketplace/image-label cross-check |
| `research/drdent_purple_whitening_strips_listing_capture_2026-08-30.md` | Listing and shopper-evidence capture with source limitations |
| `research/drdent_toothpaste_tablets_evidence_capture_2026-08-30.md` | Original evidence/study source pack |
| `research/drdent_toothpaste_tablets_creator_audit_capture_2026-08-30.md` | Original Dr. Dent product-video source list and creator-audit capture |
| `research/drdent_type4_verified_listing_audit_2026-08-31.md` | Type 4 listing-verification evidence |
| `user_supplied_label_images/IMG_7457.jpeg`, `IMG_7458.jpeg` | Original user-supplied label images |
| `first_party_records/VIDEO_PERFORMANCE_LOG.md`, `SCRIPT_FEEDBACK_LOG.md`, `CONTENT_PIPELINE.md` | First-party performance, feedback, and production records retained outside the active project |

The active project also contains current product research and source logs for DryWater, Dr. Dent, HiSmile, Medicube, Bloom, SKIN1004, and other product candidates. The reset did not delete trusted pre-trial product-intelligence baselines; it deleted post-trial mixed interpretations and the entire post-trial Dr. Dent mixed record. Those baseline product records are useful historical inputs but should be distinguished from fresh source captures.

## 6. What is raw, what is derived, and what is active

| Provenance tier | Examples | How to use in an audit |
|---|---|---|
| Raw/near-raw | Downloaded source MP4/MP3, Whisper/clean transcript TXT/JSON, original label images, study pages/captures, listing captures, verbatim comments, first-party metrics | Reopen or verify directly; strongest basis for checking exact wording, timing, and claims |
| Derived analysis | `analysis/*deep_analysis*.md`, hook synthesis files, overlay/CTA syntheses, product-intel interpretations, campaign source logs | Trace every important conclusion back to a raw source; do not quote as verbatim without cross-checking |
| Active guidance | Hook frameworks, architecture, psychology, phrase bank, overlays, healthcare hook guide, BOF templates, post-write checklist | Audit whether the guidance accurately represents the derived analysis and whether it is actually implemented |
| Generated outputs | Scripts, campaign packages, campaign fidelity maps, script library entries | Use as test subjects; they are not evidence for why the framework works |

## 7. Known gaps and limits

The corpus is substantial but not complete in the sense of one full raw transcript for every hook. The Master Context itself says several Tier 2 hooks have no confirmed reference video, and some have only partial references. Many creator analyses preserve paraphrased wording, visual observations, or source links rather than a clean verbatim transcript. The active hook library therefore requires a hook-by-hook provenance audit, not a blanket assumption that every opening is transcript-backed.

The three exact comparison transcripts recovered on September 3, 2026 are the strongest currently packaged transcript deliverables. Older creator-source files should be audited individually to determine whether the underlying video, transcript, or only an analysis summary remains. The external archive’s current visible file index also does not by itself prove that every previously downloaded raw creator video remains available; raw-media retention should be verified before relying on it for a future full visual audit.

The current inventory also identifies a documentation-version risk: `MASTER_CONTEXT.md` still contains historical language describing the pre-reset system and is dated August 17, 2026, while the clean-slate additions and newer files are dated September 1–3. The clean-slate source map and current protocol should govern post-reset work, but the audit should flag any contradictory legacy section rather than silently merge it.

## 8. Recommended audit order

Begin with `HOOK_FRAMEWORKS.md` and create a table for every hook containing its claimed creator/source, exact source URL, performance evidence, transcript status, visual-analysis status, and confidence tier. Then trace each hook to the creator-analysis file and raw transcript/media artifact. Next audit the six writing references for whether they accurately preserve the verified mechanics. Finally audit implementation and generated scripts: confirm the model receives the intended controls, confirm the quality-review result is visible, and test whether every script beat advances with a new product payoff, objection answer, proof function, retention function, or CTA job.

That order keeps the audit from starting with the scripts and reverse-engineering a justification after the fact. It begins with the raw source, moves through analysis, then tests the active guidance and implementation.

## References within the project

- `MASTER_CONTEXT.md`
- `CLEAN_SLATE_ACTIVE_SOURCE_MAP.md`
- `FACT_ONLY_PRODUCT_RESEARCH_PROTOCOL.md`
- `HOOK_FRAMEWORKS.md`
- `SCRIPT_ARCHITECTURE_GUIDE.md`
- `BUYER_PSYCHOLOGY_LEVERS.md`
- `PHRASE_BANK.md`
- `VISUAL_OVERLAY_PLAYBOOK.md`
- `HEALTHCARE_HOOK_REFERENCE_GUIDE.md`
- `BOF_INSTRUCTION_CORRECTION_TEMPLATES.md`
- `POST_WRITE_CHECKLIST.md`
- `analysis/rebuild-frameworks/`
- `research/comparison-videos/`
- `research/comparison-transcripts/`
- `/home/ubuntu/pharma-script-gen-raw-evidence-archive-2026-09-01/`
