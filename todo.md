
## Stub Hook Audit & Upgrade (May 2026)
- [x] Watch rphreviews medication-side-effect video (7636916271837089054) and extract verbatim opening, section structure, timing — NOTE: video is actually the how-do-you-know hook (NAD), not medication-side-effect; data entry error confirmed
- [x] Find ingredient-form examples in analyzed creator videos — naturo turmeric video ($14K GMV, 264K views) confirmed as primary reference
- [x] Upgrade medication-side-effect framework in BATCH_HOOK_FRAMEWORKS with improved inferred structure and drug-nutrient depletion pairs (metformin→B12, statins→CoQ10, PPIs→Mg+B12, birth control→Mg+B6+Zn)
- [x] Upgrade ingredient-form framework in BATCH_HOOK_FRAMEWORKS with verbatim naturo turmeric reference and corrected symptom-failure opening
- [x] Audit fountain-of-youth stub — corrected generic opening, added mechanism-reveal and suppressed-knowledge opening patterns, added specific decline numbers rule
- [x] Audit pill-bottle-alternative stub — corrected "stop taking" tone issue, added "long term" qualifier rule, added "before I reach for the pill bottle" framing
- [x] Audit storytime stub — corrected third-person distance issue, added comment-reply variant (Pattern C), clarified authority-embedded-in-story rule
- [x] Audit myth-busting stub — corrected "announce the myth" error, added false-dichotomy variant (rphreviews Rank 21 pattern), added 4 opening line patterns
- [x] Audit number-list stub — corrected product-first opener error, added problem-count and checklist patterns, added 3/5 number rule and text overlay rule
- [x] Audit instead-of-drug stub — added verbatim rphreviews opening lines, corrected "instead of" opener, added false-dichotomy variant, added compliance notes
- [x] Apply all 8 framework updates to tiktok.ts BATCH_HOOK_FRAMEWORKS
- [x] Confirmed zero [STUB] markers remaining in BATCH_HOOK_FRAMEWORKS
- [x] Run full test suite — 257 tests passed (11 test files)

## Hook Library Fixes & New Hook Research
- [x] Fix how-do-you-know / medication-side-effect duplicate URL in scriptData.ts and videolab.ts
- [x] Add naturo turmeric video as ingredient-form example video in scriptData.ts and videolab.ts
- [x] Audit all 21 existing hooks and identify genuinely new angles not yet covered
- [x] Build full framework entries for approved new hooks in tiktok.ts, scriptData.ts, videolab.ts, HOOK_FRAMEWORKS.md
- [x] Update test counts and run full test suite (257 tests passing)

## 5-Creator Synthesis & Hook Library Overhaul (June 1, 2026)
- [x] Analyze Dr. Faith (10 videos, $279K top GMV) — CREATOR_DEEP_ANALYSIS_DRFAITH.md
- [x] Analyze naturopathicapothecary1 (9 videos, $216K top GMV) — CREATOR_DEEP_ANALYSIS_NATURO.md
- [x] Write CROSS_CREATOR_VALIDATION_GATE.md (3/5 threshold, 4 over-saturation safeguards)
- [x] Write SCRIPT_ARCHITECTURE_GUIDE.md (9 universal structural rules from 84 videos)
- [x] Write BUYER_PSYCHOLOGY_LEVERS.md (11 conversion psychology levers)
- [x] Update HOOK_FRAMEWORKS.md with 8 new hooks from 5-creator synthesis
- [x] Remove fountain-of-youth from all 4 locations (scriptData.ts, tiktok.ts, videolab.ts, HOOK_FRAMEWORKS.md)
- [x] Update 6 example videos to best canonical high-GMV references
- [x] Fix duplicate URL bug (how-do-you-know and medication-side-effect shared same video ID)
- [x] Add ingredient-form example video (naturo turmeric, $14K GMV)
- [x] Add versus-battle as Variant B inside comparison hook in tiktok.ts
- [x] Add all 8 new healthcare hooks to tiktok.ts BATCH_HOOK_FRAMEWORKS (hooks 18-24)
- [x] Renumber BOF hooks to 25-28 in tiktok.ts
- [x] Add all 8 new hooks to scriptData.ts and videolab.ts
- [x] Remove fountain-of-youth from HOOK_FRAMEWORKS.md summary table, fix table formatting
- [x] Delete stale /analysis/HOOK_FRAMEWORKS.md copy
- [x] Implement Option B: replace inline BATCH_HOOK_FRAMEWORKS in tiktok.ts with fs.readFileSync of HOOK_FRAMEWORKS.md
- [x] Update scriptData.test.ts tier counts (11 Tier 1, 13 Tier 2)
- [x] Update MASTER_CONTEXT.md Section 14 with Option B decision and hook library state
- [x] Run full test suite — 257 tests passing (11 test files)

## Follow-Up Improvements (June 1, 2026)
- [x] Read SCRIPT_ARCHITECTURE_GUIDE.md and wire its 9 universal structural rules into tiktok.ts generation prompt (all 4 prompts: rewrite, iterate, batchGenerate, generateSingle)
- [x] Audit UI sidebar hook library — verified all 24 healthcare hooks render with correct tier labels (11 Tier 1, 13 Tier 2)
- [x] No UI sidebar fixes needed — all hooks present, tier assignments correct, detail panel handles missing exampleVideo gracefully
- [x] Update CREATOR_ONBOARDING.md Step 4 to reflect Option B (edit HOOK_FRAMEWORKS.md, not tiktok.ts)
- [x] Update CREATOR_ONBOARDING.md verification checklist to grep HOOK_FRAMEWORKS.md instead of tiktok.ts
- [x] Run full test suite — 257 tests passing (11 test files) and save checkpoint

## Kalodata Plan Gap Closure (June 1, 2026)
- [x] Gap 1: Produced faith_deep_analysis.md — full 13-dimension format (Dimensions 1-13 + Cross-Creator Validation + New Framework Candidates + Unexpected Findings + Implications for Our Scripts)
- [x] Gap 1: Produced naturo_deep_analysis.md — full 13-dimension format (same structure, includes Trojan Horse objection handle, A vs. B bundle architecture, Overwhelming Evidence technique)
- [x] Gap 2: Added Step 12 (Content Campaign Plan) to PRODUCT_RESEARCH_PROTOCOL.md with funnel stage definitions, sequencing rules, 4-video minimum plan, and 4 proven campaign sequences from the dataset
- [x] Gap 2: Added Content Campaign Plan table section to Full Protocol Output Template in PRODUCT_RESEARCH_PROTOCOL.md
- [x] Run full test suite — 257 tests passing (11 test files) — TypeScript: 0 errors

## Three Follow-Up Improvements (June 1, 2026 — Round 2)
- [x] Retrofit Content Campaign Plan into toplux-magnesium-complex-intel.md (done — CTA column corrected to analysis-backed sell CTAs)
- [x] Retrofit Content Campaign Plan into neuro-gum-intel.md
- [x] Retrofit Content Campaign Plan into cerave-invisible-mineral-sunscreen-intel.md
- [x] Wire BUYER_PSYCHOLOGY_LEVERS.md into all 4 generation prompts in tiktok.ts (batchGenerate, generateSingle, iterate, rewrite)
- [x] Example videos for 7 hooks — left empty by decision: example videos are confirmed-only, not inferred
- [x] Run full test suite — 257 tests passing (11 test files) — TypeScript: 0 errors

## CTA Fix + Hook Reference Guide (June 1, 2026)
- [x] Extracted real CTA patterns from all 5 creator deep analysis docs — 4 confirmed CTA styles identified
- [x] Fixed Content Campaign Plan template in PRODUCT_RESEARCH_PROTOCOL.md — replaced theoretical TOF/MOF/BOF CTA logic with analysis-backed sell CTA styles
- [x] Fixed Toplux Magnesium Complex intel doc campaign plan CTA column with corrected analysis-backed data
- [x] Built HEALTHCARE_HOOK_REFERENCE_GUIDE.md — all 24 healthcare hooks (BOF hooks removed), sample opening lines, funnel stage, key structural notes, CTA reference table, quick-reference funnel stage table
- [x] Wired BUYER_PSYCHOLOGY_LEVERS.md into all 4 generation prompts in tiktok.ts
- [x] Example videos for 7 hooks — left empty by decision: confirmed-only policy
- [x] Run full test suite — 257 tests passing (11 test files) — TypeScript: 0 errors

## Intel Doc Campaign Plan Retrofit — All Remaining Docs (June 1, 2026)
- [x] bloom-sparkling-energy-intel.md — Content Campaign Plan
- [x] celsius-light-intel.md — Content Campaign Plan
- [x] dr-melaxin-calcium-dark-spot-eye-cream-intel.md — Content Campaign Plan
- [x] dr-melaxin-gifted-collagen-boost-set-intel.md — Content Campaign Plan
- [x] dr-melaxin-multibalm-intel.md — Content Campaign Plan
- [x] dr-melaxin-peel-shot-kojic-turmeric-spray-intel.md — Content Campaign Plan
- [x] hismile-id-stain-whitening-mouthwash-intel.md — Content Campaign Plan
- [x] jiyu-nad-cream-intel.md — Content Campaign Plan
- [x] jiyu-toner-pads-intel.md — Content Campaign Plan
- [x] loaded-tea-shop-intel.md — Content Campaign Plan
- [x] medicube-deodorant-intel.md — Content Campaign Plan
- [x] medicube-glass-glow-set-intel.md — Content Campaign Plan
- [x] medicube-mirandas-barrier-support-set-intel.md — Content Campaign Plan
- [x] medicube-mix-match-toner-pad-set-intel.md — Content Campaign Plan
- [x] medicube-multibalm-intel.md — Content Campaign Plan
- [x] medicube-nad-egf-firming-serum-intel.md — Content Campaign Plan
- [x] skin1004-hyalu-cica-sun-serum-uv-intel.md — Content Campaign Plan
- [x] truly-beauty-deodorant-intel.md — Content Campaign Plan
- [x] Fixed esbuild unclosed comment block error (legacy BATCH_HOOK_FRAMEWORKS_LEGACY block removed from tiktok.ts)
- [x] Run full test suite — 257 tests passing (11 test files) — TypeScript: 0 errors, esbuild: 0 errors

## Command Center Dashboard (June 16, 2026)
- [x] Add postedVideos table to drizzle/schema.ts
- [x] Run pnpm db:push to migrate schema
- [x] Seed all 22 video records into the database
- [x] Build tRPC procedures: getVideos, getVideoStats, getScripts, getPipelineItems
- [x] Build CommandCenter page with 8 sections
- [x] Add CommandCenter route to App.tsx
- [x] Add navigation link to all pages (Home, BOF, VetProduct, VideoLab)
- [x] Save checkpoint

## Mark as Filmed Feature (June 16, 2026)
- [x] Add scriptFilmed table to drizzle/schema.ts (scriptKey, filmedAt)
- [x] Run pnpm db:push
- [x] Add markAsFilmed and getFilmedScripts tRPC mutations/queries in commandCenter router
- [x] markAsFilmed updates DB; CONTENT_PIPELINE.md synced manually or via conversation (by design)
- [x] Add "Mark as Filmed" button to each script card in CommandCenter.tsx
- [x] Filmed scripts show checkmark badge and sort below unfilmed scripts
- [x] Save checkpoint

## Script Viewer Modal (June 16, 2026)
- [x] Add getScriptContent tRPC query (reads .md file from scripts/ dir by filename)
- [x] Add saveScriptContent tRPC mutation (writes edited content back to .md file)
- [x] Build ScriptModal component with View/Copy/Edit/Save/Cancel
- [x] Add "View" button to each script row in the scripts section
- [x] Copy button copies full script text to clipboard
- [x] Edit mode opens inline textarea for editing
- [x] Save writes changes back to the markdown file on the server
- [x] Cancel exits edit mode without saving
- [x] Zero TypeScript errors confirmed
- [x] Save checkpoint

## Analytics Screenshot Ingestion Workflow (Future — deferred, not blocking)
- [x] Build workflow: user uploads TikTok analytics screenshot in Video Lab → AI parses reviewed metrics → inserts/updates postedVideos → updates VIDEO_PERFORMANCE_LOG.md → Command Center stats refresh via tRPC cache invalidation

## Script Writing Queue — July 19, 2026

### Priority 1 — Write First
- [x] SCRIPT_26: Toplux Magnesium — "8 Forms" Proven Hook (rphreviews/Riva framework)
- [x] SCRIPT_27: Toplux Magnesium — Sleep Hook (glycinate + Abbasi 2012 RCT)

### Priority 2 — Write After Priority 1
- [x] SCRIPT_28: Neuro Gum — Xylitol "Three Things at Once" standalone
- [x] SCRIPT_29: Bloom Sparkling Energy — Oligonol Mechanism standalone
- [x] SCRIPT_30: Medicube Deodorant — Ceramide Barrier Repair Suppressed-Knowledge (TOF) standalone
- [x] SCRIPT_31: Truly Beauty Deodorant — AHA pH / Odor Control standalone

### Intel Doc Script Plan Analysis — Confirm Before Writing
- [x] Analyze + present: HiSmile ID Stain Whitening Mouthwash
- [x] Analyze + present: Jiyu NAD+ Cream
- [x] Analyze + present: Jiyu Toner Pads
- [x] Analyze + present: Medicube Glass Glow Set
- [x] Analyze + present: Medicube Miranda's Barrier Support Set
- [x] Analyze + present: Medicube Mix & Match Toner Pad Set
- [x] Analyze + present: Medicube NAD+ EGF Firming Serum
- [x] Analyze + present: Dr. Melaxin Calcium Dark Spot Eye Cream
- [x] Analyze + present: Dr. Melaxin Calcium Intense Volume Eye Cream
- [x] Analyze + present: Dr. Melaxin Calcium Volume Eye Patch
- [x] Analyze + present: Dr. Melaxin TX Cream

## HiSmile Campaign — 5 Scripts Filmed & Posted — July 28, 2026
- [x] Mark 5 HiSmile scripts as filmed in HISMILE_campaign.md (campaign overview table + individual script headers)
- [x] Update CONTENT_PIPELINE.md — add 5 entries to Section 4 (Filmed), update last-updated date
- [x] Log all script edits in SCRIPT_FEEDBACK_LOG.md per MASTER_CONTEXT rules (edit log + pattern analysis + rule candidates)
- [x] Insert 5 filmed keys into scriptFilmed DB table (HISMILE_V6, V7, V8, BOF1, BOFLF)
- [x] Add CAMPAIGN_SCRIPTS registry to commandCenter.ts — all 10 HiSmile scripts now appear in app's Scripts section with correct filmed status

## Video Remake & Iteration Analysis — August 16, 2026
- [x] Load video-analysis and performance-review guidance; watch the 95.64-second Medicube vs. Truly Beauty pharmacist-comparison video; and produce a timestamped exact transcript
- [x] Diagnose the 33.9K-view video using supplied retention, traffic, engagement, save, share, follower, and reward metrics
- [x] Create a single remake-and-iteration document with the exact remake script, pre-script iteration plan, and improved-script brief; present the plan before writing the improved version
- [x] Present the Medicube-versus-Truly remake findings and iteration plan to the user; obtain approval before writing the improved iteration script
- [x] Write and save the approved 55–65-second Medicube-versus-Truly comparison iteration script with early verdict, shaving/sensitivity hook, and alternate-days boundary

## Proven CTA Bank — August 16, 2026
- [x] Watch and transcribe the supplied affiliate CTA video; extract only exact verbal CTA lines and the corresponding physical delivery/action
- [x] Audit existing healthcare-creator CTA evidence and combine it with the new verbatim affiliate CTAs in a funnel- and compliance-tagged proposed bank
- [x] Present the proposed CTA-bank structure and default script-selection workflow for user approval before changing permanent script references
- [x] Revise the proposed CTA bank into an urgency-first system using creator-verbatim sale, historical-sellout, and conditional-cart language; present revised selection rules for user approval
- [x] Present the revised urgency-first CTA-bank system in chat and obtain explicit approval before changing permanent script references
- [x] Add the approved urgency-first CTA bank and CTA-selection workflow to permanent script references and required quality checks
- [x] Add CTA ID, urgency trigger, and filming-day check capture to the performance-review workflow

## Creator Compliance Deep Dive — August 17, 2026
- [x] Reload the governing Master Context, current TikTok Shop health/beauty compliance preflight, six mandatory script-writing sources, and enforcement audit before creator review
- [x] Establish the most recent 15-video audit corpus for Riva and rphreviews with accessible URLs and publication context
- [x] Watch each accessible corpus video in full and record spoken wording, screen text, overlays, product-link context, captions, and visible disclaimers
- [x] Compare both creators’ observable claim patterns against the five-case @dealsbygp enforcement audit and current TikTok Shop policy
- [x] Create a source-linked, evidence-ranked creator-compliance playbook that distinguishes demonstrable patterns from unknown moderation/account factors
- [x] Update script-language guidance only where the audit supports a compliance-safe operational change

## VC-004 Toplux Magnesium Appeal Outcome — August 17, 2026
- [x] Record the user-confirmed VC-004 appeal approval and violation withdrawal in the Master Context compliance history
- [x] Preserve the narrow evidence lesson: a favorable appeal supports the submitted case but does not replace current product-level claim mapping for future videos
- [x] Verify the violation-history record, update the task status, and checkpoint the compliance-history change

## TikTok Shop Appeal & Enforcement Casebook — August 17, 2026
- [x] Locate and reconcile the existing violation audit, case records, appeal language, evidence packages, and policy references
- [x] Preserve the user-supplied verbatim VC-001 appeal, failed outcome, platform reason, timestamp, and no-supporting-documents status; correct the prior inaccurate VC-001 outcome index
- [x] Create a durable casebook with each violation, appeal text/status/outcome, linked evidence locations, and clear provenance labels
- [x] Add a maintained TikTok Shop policy-reference section with official current links and review-date fields
- [x] Replace Master Context Section 24 detail with a concise index that points to the casebook as the authoritative full record
- [x] Verify the casebook, update task status, and checkpoint the documentation system

## VC-002 Appeal Evidence Update — August 17, 2026
- [x] Preserve the user-supplied exact failed in-app appeal, platform-reason label, no-supporting-documents status, and timestamp
- [x] Preserve the user-supplied exact Seller Support live-chat submission and pending-outcome status
- [x] Reconcile the casebook and Master Context VC-002 record without overstating the available evidence or final decision
- [x] Verify and checkpoint the updated VC-002 case record

## Physician’s Choice Deleted-Video Violation Evidence — August 17, 2026
- [x] Preserve the user-supplied violation notice, exact quoted script excerpt, policy rationale, product-title text, 8-point penalty, and timestamp
- [x] Reconcile the casebook register and Master Context index without assigning a VC identifier or inferring unavailable appeal/visual details
- [x] Verify and checkpoint the completed deleted-video enforcement record

## Physician’s Choice New Enforcement & Appeal — August 17, 2026
- [x] Record the new instant enforcement notice, 8-point penalty, visibility/product-removal actions, current appeal status, and exact platform-quoted claim excerpt
- [x] Preserve the confirmed standard caption disclaimer and continuous on-screen “results may vary” disclaimer as observed case context
- [x] Watch the complete uploaded video and extract all spoken, text, visual, listing, study, and CTA claims
- [x] Verify each material claim against the current official listing, package evidence, and primary sources; distinguish defensible facts from unsupported product-effect framing
- [x] Draft a 500-character appeal and source-linked supporting-document package using the approved VC-004 appeal structure
- [x] Update the casebook and Master Context index with the outcome-pending case, verify the record, and checkpoint

## VC-005 Supplemental BS50 Safety Source — August 17, 2026
- [x] Add the user-supplied BS50 preclinical-safety paper to the appeal source package with a clear non-efficacy boundary
- [x] Reconcile the appeal package and casebook source lists so the original script materials and appeal materials are internally consistent
- [x] Verify and checkpoint the completed supplemental-source update

## VC-005 Ten-Slot Evidence Submission Plan — August 17, 2026
- [x] Map every material video statement to the strongest available official, primary, or authoritative evidence source and record the source scope
- [x] Create a prioritized ten-screenshot upload order with exact capture targets, claim coverage, and exclusion rules
- [x] Add the screenshot-submission procedure and claim-evidence mapping rule to the VC-005 package and future appeal protocol
- [x] Verify the final screenshot plan and checkpoint the documentation update

## VC-005 Cross-Case Enforcement Analysis Update — August 17, 2026
- [x] Add the complete VC-005 video, notice, disclaimer context, and claim map to the established enforcement corpus
- [x] Reassess runtime, white-coat/pharmacist identifiers, study overlays, product-link context, and language patterns across the full documented corpus
- [x] Revise the enforcement conclusions with evidence-ranked findings, explicit confounders, and no unsupported automated-trigger assertion
- [x] Update the casebook and Master Context where the new data point warrants a durable change
- [x] Verify and checkpoint the revised enforcement analysis

## VC-005 Appeal Outcome — August 18, 2026
- [x] Record the user-confirmed appeal approval for the Physician’s Choice Digestive Enzymes Tier-List; retain withdrawal wording as not preserved
- [x] Preserve the narrow lesson: the ten-slot evidence package supported the reviewed case but does not authorize broader future product-effect language
- [x] Record the confirmed pattern that VC-004 and VC-005 were both approved after evidence-backed submissions, without treating correlation as a blanket platform rule
- [x] Update the casebook, Master Context, and six-case analysis outcome status; verify and checkpoint

## Six-Case Auto-Flag Conclusion Clarification — August 18, 2026
- [x] Read the VC-005 comparison matrix and conclusion from the six-case analysis
- [x] Present the eliminated hypotheses, remaining evidence-ranked explanations, and unresolved limits in plain language
- [x] Confirm that the existing six-case analysis already contains the necessary durable clarification; no additional enforcement-record change required

## Riva & rphreviews Compliance-Audit Findings Clarification — August 18, 2026
- [x] Read the completed source-linked 30-video creator compliance audit and its playbook
- [x] Present the observed statement, study-overlay, pain-point, product-recommendation, and disclosure tactics in plain language
- [x] Confirm that the existing audit already contains the necessary durable guidance; no targeted clarification is required

## Conversion-Preserving Evidence-Ready Operating Model — August 18, 2026
- [x] Reconcile the creator audit, six-case enforcement analysis, two approved evidence-backed appeals, and account-risk context; the resulting trial was later removed by the September 1, 2026 clean-slate reset
- [x] Design the exact-listing, controlled-boundary-test, and noncommercial-education content lanes with conversion objectives; no longer active after the approved clean-slate reset
- [x] Define pre-posting evidence requirements, account-protection controls, and escalation rules for boundary-test content; no longer active after the approved clean-slate reset
- [x] Document the operating model in the governing compliance references and report practical next steps; no longer active after the approved clean-slate reset
- [x] Save a pre-integration rollback checkpoint, then implement the approved operating model as a reversible trial control; reversal baseline is `0392bcdf`
- [x] Verify the updated references, record the rollback checkpoint/version, and checkpoint the implemented trial; the trial controls were intentionally removed by the approved clean-slate reset

## External Viral Format Analysis — August 16, 2026
- [x] Watch the three supplied Facebook reference videos and capture their visual structures, duration, title treatment, and list mechanics
- [x] Generate verbatim spoken transcripts for all three Facebook reference videos, or document any access limitation that prevents exact audio extraction
- [x] Update the external-list proposal with transcript-backed evidence for each format before permanent-framework decisions
- [x] Evaluate do/don’t, countdown-ranking, and step/list mechanics for safe pharmacist TikTok Shop adaptation and product placement
- [x] Present recommended formats, specific implementation options, and reusable template proposals before permanently documenting any new framework
- [x] Write and save test script A1: Do / Don’t Contrast List for Medicube Body Brightening Deodorant after complete source reload
- [x] Write and save test script B1: Best-Last Routine List for Physician’s Choice Digestive Enzymes after complete source reload
- [x] After test results are reviewed, add provisional Do / Don’t Contrast and Best-Last Routine List templates to permanent framework references with validation/test-status labels; superseded by the September 1, 2026 clean-slate reset and not active
- [x] After test results are reviewed, add numbered countdown (#5 → #1) as an execution variation inside the existing Tier-List framework, not as a duplicate hook; superseded by the September 1, 2026 clean-slate reset and not active

## Tier-List Execution Correction — August 16, 2026
- [x] Update Tier-List execution guidance: off-camera prompt names every ingredient/format; on-camera pharmacist reacts and assigns the tier; no generic “S-tier product” placeholder
- [x] Update Tier-List grading: F through S available; S is always last for the product transition; intermediate ranks intentionally jump rather than progressing predictably
- [x] Correct the existing Digestive Enzymes and Magnesium Tier-List scripts to reflect the named-tier, F-through-S, nonsequential staging system

## Hook 29 Validation — Scam-Warning (July 31, 2026)
- [x] Collect additional healthcare examples of the "This is fake / scam-warning" hook from TikTok — completed with three additional Riva examples, yielding four analyzed Riva videos total
- [x] Run full visual and transcript analysis on the new scam-warning examples — completed; synthesis saved in `analysis/riva_scam_hook_3video_synthesis.md`
- [x] Update Hook 29 in HOOK_FRAMEWORKS.md with cross-video validation data and upgrade status from preliminary to validated
- [x] Update MASTER_CONTEXT.md to reflect Hook 29’s validated status and updated Type 4 execution structure

## Filmed & Uploaded — July 31, 2026
- [x] Medicube Deodorant — BOF Short-Form (SCRIPT_35), MOF→BOF Longer-Form (SCRIPT_36), Instruction-Correction (SCRIPT_37) — all filmed and uploaded
- [x] Medicube PDRN Multibalm — BOF Short-Form (SCRIPT_38), MOF→BOF Longer-Form (SCRIPT_39), Instruction-Correction (SCRIPT_40) — all filmed and uploaded
- [x] Dr. Melaxin Calcium Multibalm — BOF Short-Form (SCRIPT_41), MOF→BOF Longer-Form (SCRIPT_42), Instruction-Correction (SCRIPT_43) — all filmed and uploaded

## Compliance History — August 15, 2026
- [x] Add a governed TikTok violation-history section to MASTER_CONTEXT.md, including the pending Medicube Deoxyribose Scalp Serum appeal and update protocol for future outcomes

## Product Research — August 15, 2026
- [x] Identify the product from TikTok short link ZP9kycwBgwf7J-5lhVK and build its verified Full Protocol intelligence document with required campaign plan; research outcome: do not script an affiliate campaign without manufacturer documentation and product-specific safety evidence
- [x] Compare TikTok short link ZT9kyK7LP2faJ-d4cB0 with the RedBod listing; a visual match identifies the product as EarClear Sticky Ear Cleaner, but TikTok seller identity remains independently unverified due security blocking
- [x] Verify official brand directions for matching EarClear product: gentle outer-canal insertion, rotate once, pull out; no deep insertion; use clinical safety boundaries and do not repeat unverified relief/hearing claims
- [x] Verify whether TikTok Shop product 1732404917509329882 is sold by EarClear’s official TikTok Shop account or identify its actual seller — seller confirmed as Crystalline Bazaar / BALLET ARTS OF PALM BEACH, INC.; not EarClear
- [x] Search for an official EarClear TikTok Shop listing and determine whether non-brand reseller listings are acceptable for a compliant affiliate campaign — no official EarClear TikTok Shop path located; third-party listing not approved because authorization, product consistency, and evidence quality are unverified
- [x] Rank the top five existing product-intel candidates for the Tier-List Comparison format, excluding the already filmed Medicube Deoxyribose Scalp Serum video
- [x] Deliver the ranked top-five Tier-List candidates with concise comparison rationale and filming recommendation
- [x] Write and save one Tier-List Comparison script each for Physician’s Choice Digestive Enzymes, Toplux Magnesium Complex, Dr. Melaxin TX Cream, Medicube Body Brightening Deodorant, and HiSmile iD Stain Whitening Mouthwash in a single batch document
- [x] Reload and verify the Master Context, Full Protocol research requirements, current campaign-format guidance, and a Full Protocol exemplar before the next product research task
- [x] Audit the three externally created HiSmile Full Protocol PDFs against the project standard and identify each as serum, strips, or bundle
- [x] Verify and repair any missing claims, formula/label documentation, studies, usage instructions, handle/listing evidence, and campaign-plan requirements
- [x] Save finalized HiSmile serum, strips, and verified bundle intelligence documents to the product-intel library and integrate their records into project tracking

## Backup Account Growth — August 15, 2026
- [x] Create a compliance-conscious, research-backed plan to grow a pharmacist backup TikTok account from launch to 5,000 followers, including positioning, content pillars, repeatable series, cadence, trust-building, and a future email-list pathway
- [x] Research current TikTok healthcare search/interest themes, audit coverage in the backup-account plan, and add safe high-demand topic recommendations
- [x] Evaluate and incorporate a pharmacist-led preventive-care series that supports evidence-based early steps without implying medication replacement, treatment delay, or individualized medical advice
- [x] Add a practical launch operating workflow to the backup-account plan, including the recommended first video, script-request protocol, posting sequence, and review cadence
- [x] Write and save Backup Account Launch Video 1 — education-first Ask a Pharmacist script with caption, hooks, filming plan, and safety boundary
- [x] Define and document a reusable recurring title-card system for the backup account’s video series
- [x] Write and append Backup Account Launch Videos 2–3 to the shared launch-script document, with captions, triple hooks, filming plans, and adapted quality checks
- [x] Complete the approved balanced 2×2 dark-underarm Do/Don’t rewrite of SCRIPT_50 and run its full quality/compliance review
- [x] Finalize SCRIPT_50’s concise dark-underarm education using a flexible mix of true Don’ts and “Don’t forget to…” reminders, not a forced negative format
- [x] Rebuild SCRIPT_50 as an equal left-column Do list and right-column Don’t list with either two or three actionable items per side before the product reveal
- [x] Apply the approved SCRIPT_50 2-by-2 rule: positive actions only on the Do side; use “Don’t forget to…” only as a future fallback when the Don’t side otherwise lacks enough valid items

## Clean-Slate Active Writing Reset — September 1, 2026
- [x] Save a final pre-deletion recovery checkpoint (`e988739d`) after the user approved the exact selective deletion/rebuild manifest
- [x] Move only raw product labels, source URLs, study captures, original creator-video references, and first-party performance records to `/home/ubuntu/pharma-script-gen-raw-evidence-archive-2026-09-01/` outside the active project path
- [x] Restore every approved active writing-control, campaign, tracking, and mixed-intelligence file to its exact `0392bcdf` baseline
- [x] Permanently delete all approved post-trial generated scripts, campaign packages, strategic analyses, framework implementations, mixed Dr. Dent intelligence, and active copies of archived raw captures
- [x] Create `CLEAN_SLATE_ACTIVE_SOURCE_MAP.md` and Master Context Section 25 to establish the pre-trial baseline, raw-archive boundary, just-in-time loading rule, fresh-rebuild contract, and sentence-level qualification-only policy
- [x] Validate the restored project, confirm deleted artifacts are absent, verify the active source map, and save the final clean-slate checkpoint (259/259 tests passing; all approved deletion targets absent; 12 raw-evidence files archived externally)

## Clean-Slate Rebuild Roadmap — September 1, 2026
- [x] Inventory the restored baseline, deleted active artifacts, and externally retained raw evidence needed for a fresh rebuild
- [x] Sequence the source-analysis, framework, product-intelligence, campaign, performance-tracking, and operating-document rebuilds in dependency order
- [x] Define approval gates, provenance requirements, and the just-in-time source set for each rebuild stage
- [x] Present the proposed rebuild plan with all script writing explicitly placed last; user approved the roadmap and starting point

## Approved Clean-Slate Rebuild Execution — September 1, 2026
- [x] Revalidate the pre-trial Type 1/Type 2 negative-apology and preliminary Type 4 scam-warning frameworks against their original creator evidence; preserve or revise only where source review supports it (`analysis/rebuild-frameworks/BOF_APOLOGY_REVALIDATION_CARD_2026-09-01.md`; `analysis/rebuild-frameworks/TYPE4_SCAM_WARNING_REVALIDATION_CARD_2026-09-01.md`)
- [x] Rebuild the Bundle Routine Walkthrough from three original user-supplied videos and register its fresh source-faithful framework card (`analysis/rebuild-frameworks/BUNDLE_ROUTINE_WALKTHROUGH_REVALIDATION_CARD_2026-09-01.md`)
- [x] Reanalyze the original Category Scorecard/Rating source video and create a fresh framework card capturing prompt-and-score execution, scoring scale, pacing, visual board, proof, and product/category fit (`analysis/rebuild-frameworks/CATEGORY_SCORECARD_REVALIDATION_CARD_2026-09-01.md`)
- [x] Reanalyze the original Do/Don’t, Best-Last List, and numeric-ranking source videos; classify each only after fresh source review as an independent framework or a variation (`analysis/rebuild-frameworks/DO_DONT_CONTRAST_REVALIDATION_CARD_2026-09-01.md`; `NUMERIC_SCORECARD_VARIATION_REVALIDATION_CARD_2026-09-01.md`; `BEST_LAST_LIST_REVALIDATION_CARD_2026-09-01.md`)
- [x] Create a neutral Product X verification sheet showing the minimal repeatable output for each rebuilt framework, with no real-product claim or legacy intelligence influence (`analysis/rebuild-frameworks/PRODUCT_X_FRAMEWORK_TEST_SHEET_2026-09-01.md`)
- [x] Present the Product X sheet and use user feedback to approve, revise, or reject each rebuilt framework before progressing to product-research rebuilds; user approved the structures with the short-apology feature-to-benefit-to-problem refinement
- [x] Add the permanent Competitive Decision Map requirement to the decision frameworks and fact-only research protocol: source common real alternatives, their narrow roles, recognizable frustrations, and truthful limitations; permit multiple 8/10+ linked winners only when their use cases differ (`analysis/rebuild-frameworks/COMPETITIVE_DECISION_MAP_STANDARD_2026-09-01.md`)
- [x] Rebuild the fact-only product-research operating requirements, including exact-product video benchmarking and fair category-competition research (`FACT_ONLY_PRODUCT_RESEARCH_PROTOCOL.md`)
- [x] Verify and restore verbatim top-comment capture from top-performing exact-product videos, including source link/rank, engagement context, and authentic downstream uses for objection handling and comment-reply planning (`FACT_ONLY_PRODUCT_RESEARCH_PROTOCOL.md`, Section 3.5)
- [x] Rebuild priority product intelligence and product-specific campaign plans one product at a time from original sources, beginning with the user-selected product — completed for Dr. Dent and DryWater; future products remain source-gated
- [x] Reconstruct only user-confirmed performance learning from raw metrics when a future framework or campaign decision needs it — retained as a gated operating rule; no unsupported performance claims added in this audit
- [x] Write new scripts only after the relevant framework, fact-only product intelligence, and campaign plan are freshly approved — applied to the approved DryWater campaign; future campaigns remain gated
- [x] Add the permanent context-reset control requiring just-in-time reload of every critical governing, source, fact, and quality document before analysis, documentation, or drafting continues
- [x] Rebuild the deleted Dr. Dent Purple Toothpaste Tablets fact-only intelligence record from the physical tin, current primary sources, reviews, complete product-video review, verbatim comments, evidence, and a Competitive Decision Map; do not create campaign or script content (`product-intel/dr-dent-purple-toothpaste-tablets-fact-record.md`; documented access limits for top comments and full-video/view data)
- [x] Resolve the user-supplied TikTok short URL and build a fact-only intelligence record for that exact product/variant/seller from current primary sources, reviews, complete product-video review, verbatim comments, evidence, and a Competitive Decision Map; do not create campaign or script content (`product-intel/drywater-complete-daily-electrolyte-vitamin-powder-fact-record.md`; documented exact-variant panel, comment, view, and full-video access limits)
- [x] Validate both new fact-only product intelligence records against the active protocol, run the automated test suite, save a checkpoint, and present the completed records for user review before campaign planning (both records pass the fact-boundary completion gates with documented source limitations; `pnpm test`: 12 files / 259 tests passed on September 1, 2026)
- [x] Reload the full six-document script-writing reference set, completed DryWater fact record, and applicable fresh framework cards before evaluating a DryWater campaign
- [x] Validate the proposed DryWater comparison, expert-verdict, and ranking decision sets against current original sources and the Competitive Decision Map; include only recognizable alternatives with supported roles and limitations (`research/drywater_campaign_source_log_2026-09-01.md`; Type 4 confirmed Path B only absent current counterfeit/seller-mismatch evidence)
- [x] Draft a source-grounded DryWater campaign plan that includes the mandatory BOF suite, a comparison option, an expert-verdict option, and eligible ranking formats; keep script writing gated on user approval (`campaign-plans/drywater-complete-daily-electrolyte-vitamin-powder-campaign-proposal.md`)
- [x] Present the DryWater campaign plan for user approval, update the rebuild ledger, run validation, and save a checkpoint before writing any DryWater scripts (user approved September 2, 2026; planning checkpoint `2b437722`)
- [x] Write the approved DryWater 10-asset campaign package using framework-faithful documented openings, structures, buyer-psychology levers, proof-card plans, and proven creator CTAs; re-open the source set after any context reset (`scripts/campaigns/DRYWATER_RASPBERRY_LEMON_campaign.md`; fidelity map and campaign/source indexes registered)
- [x] Perform a line-by-line framework, claim-source, buyer-psychology, CTA, proof-card, and filming-day-variable review of the DryWater script package; run the automated test suite and save a checkpoint before delivery (package-wide quality checklist passed 18/18; focused DryWater documentation regression test added; full suite 13 files / 263 tests passed)
- [x] Re-audit all ten DryWater scripts for the user-identified failure modes: defensive water framing outside the one legitimate comparison, repetitive high-potassium pharmacist flags, and underused verified product differentiators (`analysis/drywater_script_quality_root_cause_2026-09-02.md`)
- [x] Rewrite the DryWater campaign to make its no-added-sugar, no-artificial-ingredient, real-fruit, electrolyte-profile, and portable-format advantages the product-specific conversion engine; restrict water to the single contextual comparison in which DryWater is the clear relevant-use-case winner (Version 3 replaces the initial package)
- [x] Revalidate the revised DryWater package against the full script-writing source set, framework-fidelity map, fact record, and filming-day facts; run tests, save a checkpoint, and present the corrected scripts for review (V3 source and substantive review complete; production build passed; `pnpm test`: 14 files / 267 tests passed; checkpoint `6999a636`)
- [x] Trace the DryWater repetition and weak-positioning failure against the existing no-redundancy/product-advancement rule, fidelity map, package quality audit, and actual script language; document the root causes (`analysis/drywater_script_quality_root_cause_2026-09-02.md`)
- [x] Strengthen the permanent script-writing controls so every beat has an assigned new-information, buyer-payoff, objection-resolution, proof, retention, or CTA job and so product-specific differentiators cannot be displaced by repetitive caveats (Rule E.1 added to `SCRIPT_ARCHITECTURE_GUIDE.md`; Item 13a added to `POST_WRITE_CHECKLIST.md`; quality reviewer expanded and outcomes retained in `server/routers/tiktok.ts`; new focused regression test passes)
- [x] Expose retained script-quality review results in the generation interface and client contract so future writers can see failed Rule E/product-advancement checks instead of mistaking a structural test for substantive approval (`client/src/lib/scriptData.ts`, `client/src/pages/Home.tsx`, `server/routers/tiktok.ts`, and focused regression test)
- [x] Rebuild and re-audit the DryWater package under the corrected controls, with water restricted to its one contextual comparison and high-potassium guidance restricted to the single relevant script, before presenting it for review (V3 substantive review added to `analysis/drywater_script_quality_root_cause_2026-09-02.md`)
- [x] Reassess and rank DryWater’s best purchase reasons from the current exact-label source, shopper language, category alternatives, and accessible product-video evidence; treat the user’s observed selling points as hypotheses rather than final campaign facts (`analysis/drywater_purchase_reason_reassessment_2026-09-02.md`; exact Raspberry Lemon NSF certification independently verified and fact record refreshed)
- [x] Update the DryWater product-message hierarchy and all affected scripts with the strongest verified differentiators, then rerun source, framework, repetition, and automated-test validation before delivery (V3 package; `pnpm test`: 14 files / 267 tests passed; production build passed)
- [x] Locate exact comparison-video source candidates for Dr. Faith, rphreviews, and Riva from the active hook library, creator deep dives, and retained source links; do not assume an analysis excerpt is a full transcript
- [x] Verify and capture only complete spoken sequences from exact accessible comparison videos for each creator; record unavailable creators as unresolved rather than filling gaps (all three complete MP4 sources retrieved and transcribed)
- [x] Create one transcript-only Markdown document per creator containing only the complete verbatim spoken transcript, with no analysis, visual notes, overlays, or partial reconstruction (`research/comparison-transcripts/`)
- [x] Validate transcript completeness and source provenance, run tests, save a checkpoint, and deliver only verified complete transcript documents (three complete link-based captures; transcript-only marker audit passed; `pnpm test`: 14 files / 267 tests passed)
- [x] Re-run the Dr. Faith, rphreviews, and Riva comparison-transcript retrieval through the Master Context’s approved link-based deep-dive workflow, including complete spoken transcript and visual/overlay capture before reducing each deliverable to transcript-only
- [x] Create one transcript-only document per creator from the complete verified link-based captures; do not request screen recordings unless the governing workflow explicitly requires them after all approved retrieval routes are exhausted
- [x] Validate the three transcript documents for completeness and provenance, run tests, save a checkpoint, and deliver only the requested transcript files (all three verified; `pnpm test`: 14 files / 267 tests passed)
- [x] Reload the Master Context and inventory every active document used in script creation, including hook frameworks, architecture, buyer psychology, phrase bank, visual overlays, healthcare hooks, quality controls, campaign/fact records, and source maps (`analysis/script_writing_source_audit_inventory_2026-09-03.md`)
- [x] Inventory retained raw source evidence—transcripts, downloaded source media, URLs, captures, studies, comments, reviews, creator analyses, and framework revalidation records—and map each evidence class to the active documents it supports (`analysis/script_writing_source_audit_inventory_2026-09-03.md`; direct filesystem inventory completed)
- [x] Report the available audit corpus, provenance tiers, inaccessible or missing evidence, and an audit-ready review sequence before performing the substantive audit (`analysis/script_writing_source_audit_inventory_2026-09-03.md`; `pnpm test`: 14 files / 267 tests passed)

## Raw Whisper Transcript Audit — September 4, 2026
- [x] Audit existing raw Whisper transcripts for Tier 1 hook references: symptom-checklist, suppressed-knowledge, instruction-correction, and right-way
- [x] Audit existing raw Whisper transcripts for Tier 2 hook references: side-effect-surprise, scam-warning, instead-of-drug, how-do-you-know, audience-pivot, fear-external-threat, expert-verdict, after-1-month, and viral-metaphor
- [x] Audit Tier 3 raw transcript coverage for Bundle Routine Walkthrough, Category Scorecard, Numeric Scorecard, Best-Last List, and Do/Don’t Contrast, including Facebook re-authentication access status
- [x] Audit Tier 4 raw Whisper transcript coverage for BOF Types 1/2 from @momfindsbyfaith
- [x] Package existing Whisper transcript files and write a source-coverage report distinguishing raw transcripts from analysis summaries

## Tier 3 Facebook Source-Link Trace — September 4, 2026
- [x] Locate the existing Tier 3 source URLs in hook cards, framework source logs, and scripts; test each link’s current accessibility and identify whether direct audio retrieval or user-provided recording is required — Do/Don’t and Numeric retrieved/transcribed; Best-Last URL retrieved but source content mismatches the framework label; Category Scorecard is Instagram and Bundle Routine is TikTok

## Missing Source Transcript Recovery — September 4, 2026
- [x] Correct the Best-Last source label: treat the Facebook reel as the user-provided exploratory viral-format example, not as the expected “#5 is the best one” canonical reference
- [x] Inventory every previously requested source video whose raw transcript was not delivered, separating exact framework references from exploratory format examples
- [x] Retrieve and transcribe every accessible missing source video, and document any remaining login/private/access limitation — recovered Category Scorecard, three Bundle Routine videos, and the three Facebook examples; unresolved exact canonical links remain only for the specifically named Riva Trend-or-Trash and Dr. Faith Warning Signs references
- [x] Update the transcript audit package and provenance log with corrected labels and newly recovered transcripts

## Cross-Creator Validation Transcript Recovery — September 4, 2026
- [x] Locate and verify Riva expert-verdict Rank 10 (~$33K, ~34 seconds) exact source
- [x] Locate and verify Dr. Faith expert-verdict Rank 8 (~$27K, magnesium) exact source
- [x] Locate and verify Drew right-way reference exact source — two uniquely documented Drew right-way references recovered (oregano and collagen)
- [x] Locate and verify Drew and/or Dr. Faith symptom-checklist reference exact source(s) — Dr. Faith Rank 4 uniquely matched; no uniquely identified Drew citation preserved
- [x] Locate and verify Naturo suppressed-knowledge reference originally cited at 11.9M views
- [x] Retrieve only uniquely matched sources; explicitly document inaccessible or unmatched citations without substitutions

## Master Context Script-Control Audit — September 5, 2026
- [x] Load Master Context and all six full script-writing documents
- [x] Extract Master Context script-writing rules, protocols, quality gates, source-loading requirements, and cross-referenced controls
- [x] Compare those controls against the six main script-writing documents and identify rules documented elsewhere or missing from the main docs
- [x] Deliver a concise unique-rule and documentation-gap report

## Final Script-Writing Documentation Overhaul — September 5, 2026
- [x] Apply the attached final handoff as controlling scope; exclude compliance/violation history and unrelated Master Context sections
- [x] Remove age-reversal and Best-Last List from active hook documentation
- [x] Re-scope expert-verdict to rphreviews-specific and correct its examples
- [x] Apply all handoff corrections to HOOK_FRAMEWORKS.md, including comparison, symptom-checklist, right-way, suppressed-knowledge, audience-pivot, GMV, fear-external-threat, scam-warning, after-1-month, instead-of-drug, and Numeric Scorecard notes
- [x] Add the handoff phrase-bank additions and Script Architecture technique entries
- [x] Fold Healthcare Hook Reference Guide funnel and CTA tables into HOOK_FRAMEWORKS.md, then retire the guide
- [x] Apply Buyer Psychology Levers corrections
- [x] Apply Phrase Bank correction and additions
- [x] Apply Pre-Session Brief corrections
- [x] Apply Post-Write Checklist corrections
- [x] Validate all changed documents and export the finalized document set — 267 tests passed, production build passed, six-document ZIP exported

## Verification Follow-Up Corrections — September 5, 2026
- [x] Restore detailed instruction-correction, symptom-checklist, suppressed-knowledge, after-1-month, trend-or-trash, and nad-dosing entries in HOOK_FRAMEWORKS.md; keep age-reversal removed cleanly
- [x] Apply the comparison verdict, expert-verdict validation, audience-pivot GMV, Nasamine spelling, and scam-warning timing corrections in their detailed framework sections
- [x] Replace the residual fabricated Riva cortisol quote in BUYER_PSYCHOLOGY_LEVERS.md with the transcript-verified quote
- [x] Verify and document the provenance and active status of split-screen-comparison and tier-list-comparison without treating either as newly handoff-approved
- [x] Re-run validation and export the six corrected active script-writing documents for final user verification — 267 tests passed; production build passed; corrected review ZIP exported

## Final Hook Validation Expansion — September 5, 2026
- [x] Build formal revalidation cards for split-screen-comparison and tier-list-comparison using the existing revalidation-card template
- [x] Add both newly approved foundations to CLEAN_SLATE_ACTIVE_SOURCE_MAP.md and activate their statuses in HOOK_FRAMEWORKS.md
- [x] Add both hooks to HOOK_FRAMEWORKS.md Appendix A and PRE_SESSION_BRIEF.md hook table
- [x] Relabel every creator-count claim with precise sample-scoped 90-day wording across the active document set
- [x] Upgrade comparison validation to transcript-verified 5/5 and correct naturo’s age-reversal attribution rationale
- [x] Add confirmed GMV-share column beside creator-count validation in every applicable validation table
- [x] Add the explicit principle that single-creator hooks are not weaker solely because they lack cross-creator breadth
- [x] Validate and export all updated documents for final verification; no additional transcript requests are required — 267 tests passed and production build passed

## Validation Count Corrections — September 5, 2026
- [x] Correct right-way in HOOK_FRAMEWORKS.md from the erroneous 5-of-5 figure to 3 of 5 verified creators: rphreviews, Dr. Faith, and Drew
- [x] Audit After-1-Month evidence; correct the unsupported 3-of-5 figure to 2 of 5 verified creators: Drew and rphreviews
- [x] Create and retain the standalone rphreviews Rank 26 After-1-Month astaxanthin transcript
- [x] Update the persistent transcript audit report and retrieval log with the corrected evidence counts
- [x] Run full tests and production build — 267 tests passed; build passed

## Final Knowledge-Base Package — September 5, 2026
- [x] Inventory current BOF instruction templates, ten revalidation cards, Competitive Decision Map standard, and Visual Overlay Playbook — nine named revalidation cards were found; the Competitive Decision Map is a separate standard
- [x] Apply and document audit-supported BOF truthfulness caveat and Type 4 Path A/Path B updates if the active template requires them
- [x] Assemble all requested Markdown files in one package, preserving current provenance and source boundaries
- [x] Validate package completeness and deliver one ZIP archive — 16 files packaged

## Requested Final Script-Writing ZIP — September 6, 2026
- [x] Package the six core script-writing documents requested by the user
- [x] Package CLEAN_SLATE_ACTIVE_SOURCE_MAP.md, COMPETITIVE_DECISION_MAP_STANDARD_2026-09-01.md, and VISUAL_OVERLAY_PLAYBOOK.md
- [x] Package all nine named revalidation cards
- [x] Locate and include SERIES_CONTENT_STRATEGY_corrected.md — created from the active SERIES_CONTENT_STRATEGY.md because no separate corrected file existed
- [x] Validate the ZIP manifest and deliver the archive — 22 files packaged

## New Product Intelligence Preparation — September 6, 2026
- [x] Load MASTER_CONTEXT.md and the governing fact-only product research protocol before receiving the new product
- [x] Confirm required product inputs and source-first research gates with the user

## New Product Fact Record — Supplied TikTok Shop Link — September 6, 2026
- [x] Resolve the exact product, variant, seller/store, and current listing from https://www.tiktok.com/t/ZT9S8WGuqjnwd-tPRM5/ — Medicube Bye-Bye Bumps Red Body Set, Product ID 1732553979595952363, medicube US Store
- [x] Complete the Light Fact Screen before deciding whether to proceed to a Full Fact Record — passed and expanded into the full fact record

## Campaign Structure Reconciliation — September 6, 2026
- [x] Compare the legacy pre-separation campaign section with the active fact-only campaign-planning gate
- [x] Identify current versus legacy rules for minimum asset count, BOF suite, sequencing, and creator-derived patterns
- [x] Provide the current active campaign-planning section and recommend a separate Claude knowledge-base protocol boundary

## BOF Suite Self-Description Correction — September 6, 2026
- [x] Update only the BOF template header/framing from three-script to four-type initial-campaign suite, preserving the Type 1–4 mechanics and Type 4 Path A/Path B boundary
- [x] Verify no stale three-script self-description remains and deliver the corrected file

## DryWater Right-Way / Type 3 Coverage Review — September 6, 2026
- [x] Compare the active right-way hook against the Type 3 instruction-correction requirements and DryWater Script 7 execution
- [x] Determine whether the DryWater initial campaign includes a valid Type 3 asset or needs a distinct additional asset — Script 7 is a valid right-way asset but does not meet the specific Type 3 template requirements
- [x] Report the source-based campaign-coverage decision without changing scripts unless explicitly requested

## Medicube One-Person Patient Dialogue Bundle Format — September 6, 2026
- [x] Load the current Medicube fact record, Master Context, hook frameworks, visual-overlay playbook, and campaign-planning controls
- [x] Retrieve, transcribe, and analyze the user-supplied TikTok viral-format reference in full
- [x] Create a standalone verbatim transcript-only file for the reference video
- [x] Map the one-person patient-dialogue / product-hand-off / bundle-value-reveal structure to the Medicube Bye-Bye Bumps set with source and filming-day proof gates
- [x] Present the format-adaptation recommendation for approval before drafting a final script

## Medicube One-Person Patient Dialogue Script — September 6, 2026
- [x] Load the six full script-writing documents, completed Medicube fact record, approved format proposal, and reference transcript
- [x] Draft one product-first three-component patient-dialogue / “I got you” bundle-value script with caption, hashtags, studies, and post-production notes
- [x] Run the applicable post-write quality audit and preserve the standalone script in SCRIPT_LIBRARY.md

## Bad/Good Label Demonstration Format Discovery — September 6, 2026
- [x] Load active source-map, label-demonstration, Category Scorecard, and multi-product CTA standards
- [x] Search for an exact live two-tier bad/good label-demonstration source and document any three-tier context separately — no exact retrievable match found; TikTok public search became login-gated
- [x] Retrieve and create standalone raw transcripts for exact live matches only — no exact match was located; retained raw transcripts for three-tier and adjacent label-literacy context are labeled non-matching
- [x] Map independently validated building blocks against the untested combined format; do not create a revalidation card yet
- [x] Deliver source links, transcript files, and a clear found/not-found evidence report for user review

## Bad/Good Label Demonstration Synthesized Test Card — September 6, 2026
- [x] Build a formal user-approved synthesized test-format card; do not present it as a direct copy of a proven live source
- [x] Build in the narrow, evidence-supported “bad” limitation rule and mandatory legitimate-role statement for each alternative
- [x] Build in the current Competitive Decision Map / verified 8-of-10-plus distinct-listing gate for category rapid-fire multi-product linking
- [x] Keep sunscreen as a separate live-application/texture sub-type and Food Pharmer as weak non-structural context only
- [x] Register the status in active source navigation and deliver the card for review before any script is drafted — source-map, hook-library, and pre-session entries added; 267 tests passed

## Bad/Good Label Demonstration Source Index and First-Test Candidates — September 6, 2026
- [x] Add the synthesized test card to CLEAN_SLATE_ACTIVE_SOURCE_MAP.md Section 5 index alongside the existing revalidation-card entries — Section 5 framing and explicit index discoverability note added
- [x] Review every completed product fact record for real label-visible distinction, narrow viewer goal, and fair-alternative feasibility — screened DryWater, DR.DENT, and Medicube full fact records
- [x] Rank the strongest genuine candidates, explicitly excluding forced matches, and deliver concise rationales before any script is drafted — DryWater first, DR.DENT second, Medicube excluded; 267 tests passed

## Series Strategy Sync and Campaign Planning Protocol — September 6, 2026
- [x] Synchronize the specified Series Content Strategy GMV, Nasamine spelling, Comment-Reply, inferred-hook, trend-or-trash, and footer corrections — synchronized active and corrected-name copies
- [x] Compare the uploaded Campaign Planning Protocol with active fact-only, BOF, framework, source-map, and campaign-package controls; explicitly document conflicts — reconciled in Protocol §8
- [x] Adopt the reconciled Campaign Planning Protocol as the shared campaign-planning authority and register it in source navigation
- [x] Validate the synchronized documents and deliver the final files and reconciliation findings — 267 tests passed

## Checklist Root-Cause Fix — Campaign-Level Cautions and Natural Drafting
- [x] Audit POST_WRITE_CHECKLIST.md Items 11, 12, and 13b for per-script over-application.
- [x] Clarify campaign-level caution coverage versus sentence-level claim qualification.
- [x] Add natural-draft-first, checklist-audit-second workflow guidance.
- [x] Preserve DryWater and DR.DENT as active test products.
- [x] Validate documents, tests, and production build; save a checkpoint — stale every-script caution scan passed; 267 tests passed; production build passed; checkpoint pending.

## Bad/Good Card Verdict Options and Reference Scripts — September 7, 2026
- [x] Register the attached DryWater and DR.DENT rewrites as natural-but-accurate reference standards for future review.
- [x] Add a Verdict Delivery Options section to the Bad/Good Label Demonstration card with direct and personal-opinion options.
- [x] Require each spoken verdict to pair immediately with its specific narrow reason.
- [x] Require spoken verdict wording to match or obviously paraphrase the on-screen BAD/GOOD or LESS FIT/BETTER FIT overlay.
- [x] Validate the card and save a checkpoint — card/reference checks passed; 267 tests passed; production build passed; checkpoint pending.

## New TikTok Shop Product Fact Record — September 7, 2026
- [x] Load governing context, fact-only research protocol, and campaign-planning controls.
- [x] Verify the exact TikTok Shop listing, seller, variant, formula, directions, and warnings — exact duo and seller resolved; ingredients verified from official current PDP; directions/warnings explicitly unavailable; TikTok 72 × 2 versus 72-only specification and TXA formula conflicts documented.
- [x] Complete first-party, evidence, shopper, creator-video, and competitive-decision research required by the protocol.
- [x] Write and validate a complete fact-only product intelligence record — document integrity scan passed; 267 tests passed; production build passed.
- [x] Save a checkpoint and deliver the intelligence record for campaign-planning review — checkpoint pending.

## Independent Copy Baseline — September 8, 2026
- [x] Record that this is an independent copy with fresh project history, deployment state, and empty database data.
- [x] Record the copied project's current feature and technology baseline.
- [x] Define the next task for this independent copy after user direction (Last-Take TikTok Video Editor MVP).


## Last-Take TikTok Video Editor MVP — September 8, 2026
- [x] Collect and inspect two representative clips plus the associated transcript.
- [x] Support both one long raw video and multiple uploaded clips as MVP inputs.
- [x] Detect repeated lines without requiring a script upload and keep the last detected take by default.
- [x] Define and implement dead-air removal before any audio-bleed processing.
- [x] Add an optional audio-bleed toggle that carries audio from each previous clip into the next edited clip after cuts are complete.
- [x] Provide a review-and-approval workflow before export.
- [x] Research publicly observable CutAI behavior and compare it with the proposed MVP.
- [x] Define TikTok-first export defaults, including vertical 9:16 output unless testing indicates a better source-preserving behavior.
- [x] Test the workflow against representative footage and save a working checkpoint.

## Multi-Clip File Selection & Drag-and-Drop Fix — September 8, 2026
- [x] Wire genuine file picker input and drag-and-drop handlers on Multi-Clip Upload zone in VideoEditor
- [x] Support handling uploaded clips (display file list with sizes, thumbnail/preview, and transcription/take detection)
- [x] Test file selection and drag-and-drop in browser and save a new working checkpoint

## Chunked Upload & Gateway Limit Fix — September 8, 2026
- [x] Implement chunked upload endpoint (/api/editor/upload-chunk) with 10MB chunk slicing to bypass Cloud Run 32MB payload limit
- [x] Update VideoEditor frontend to slice large video files into 10MB chunks with smooth progress tracking
- [x] Handle automatic take detection after final chunk reassembly
- [x] Test chunked upload end-to-end and save working checkpoint

## Production Audio Extraction & Whisper Transcription — September 8, 2026
- [x] Add root Dockerfile with ffmpeg for Cloud Run production deployment
- [x] Implement server-side audio extraction and Forge Whisper API transcription in detectTakes
- [x] Verify end-to-end transcription and take detection on uploaded footage and save checkpoint

## Production Container Path & Cloud Run Fix — September 8, 2026
- [x] Replace hardcoded /home/ubuntu paths with container-compatible UPLOAD_DIR and EXPORT_DIR (/tmp/video_uploads and /tmp/video_exports)
- [x] Ensure automatic directory creation and static mount in server/_core/index.ts, videoEditor.ts, and videoEditorUpload.ts
- [x] Test upload, audio extraction, Whisper transcription, and take assembly end-to-end and save checkpoint

## Direct Cloud S3 Storage & CloudFront Streaming — September 8, 2026
- [x] Add getUploadUrl procedure in videoEditor router for direct Forge S3 upload credentials
- [x] Update VideoEditor frontend to upload directly to S3 via XMLHttpRequest with live progress tracking
- [x] Support streaming audio extraction and video cutting directly from CloudFront URLs in detectTakes and renderVideo
- [x] Upload final rendered TikTok MP4s to S3 and return permanent CloudFront download links
- [x] Verify end-to-end upload, transcription, take detection, and rendering with sample footage and save checkpoint

## Remote CloudFront URL Handling in detectTakes — September 8, 2026
- [x] Guard detectTakes against calling fs.readdirSync on remote HTTP/HTTPS CloudFront URLs
- [x] Add robust logging for audio extraction and Whisper API status
- [x] Verify test suite and save working checkpoint

## Fast Single-Pass Video Export & Export Modal — September 8, 2026
- [x] Replace slow 22-loop sequential FFmpeg cutting with single-pass filter_complex trim, concat, and acrossfade
- [x] Add dedicated in-app Export Progress dialog with animated step indicators instead of corner info toast
- [x] Add Export Success modal with embedded video player, stats, and direct download button
- [x] Verify multi-take export rendering performance and save checkpoint

## FFmpeg Filter Script Trailing Semicolon Fix — September 8, 2026
- [x] Fix FFmpeg filter script generator to separate filters with semicolons without a trailing semicolon (resolves "No such filter: ''" error)
- [x] Truncate verbose FFmpeg error logs so UI toasts remain clean and concise
- [x] Verify multi-take export rendering and save working checkpoint

## Output Filename Path Sanitization Fix — September 9, 2026
- [x] Sanitize clipId in outputFilename and ensure recursive directory creation for outputPath to prevent nested path "No such file or directory" error
- [x] Ensure workDir also uses sanitized safe clipId
- [x] Verify test suite and save working checkpoint

## Video Editor Session Persistence Across Tabs & Browser Closes — September 9, 2026
- [x] Implement localStorage persistence for uploaded clips, active clip selection, detection results, and take overrides in VideoEditor
- [x] Automatically rehydrate editor state when returning to tab or refreshing
- [x] Add "Reset / New Video" button to clear stored session and start fresh
- [x] Verify persistence across navigation and save checkpoint

## Merge Second Project Features (copy-of-pharmacist-tiktok-script-generator) — September 10, 2026
- [x] Inspect remote branch and commits from https://github.com/chroniclesofgp-cpu/copy-of-pharmacist-tiktok-script-generator.git
- [x] Identify new or modified files (e.g. product selection, vet product, UI toggles)
- [x] Merge or cherry-pick changes into current codebase without conflicting with video editor
- [x] Run full test suite to ensure all tests pass
- [x] Push unified codebase to GitHub and save checkpoint
## Personal Script-Aware Video Auto-Editor — Feasibility Assessment
- [x] Define the minimum reliable editing behavior: silence removal, repeated-take detection, script matching, review controls, and export.
- [x] Evaluate video-processing architecture, background-work requirements, and suitable hosting for a personal-use tool.
- [x] Provide a realistic build-complexity assessment, reliability limits, and phased implementation recommendation — recommend a reviewable rough-cut assistant before any fully automatic final-cut behavior.

## Personal Script-Aware Video Auto-Editor — Clarified Requirements
- [x] Scope decision: transcript-only adjacent-repeat detection is deferred and not part of the user's CSV-first Product Radar request.
- [x] Scope decision: zero-gap video editing is deferred and not part of the user's CSV-first Product Radar request.
- [x] Scope decision: adjustable audio bleed/crossfade is deferred and not part of the user's CSV-first Product Radar request.

## Canonical Documentation Reconciliation — September 8, 2026
- [x] Compare the three attached v2 documents with live project copies and record any differences — all three differed from the live copies; attached versions are now canonical.
- [x] Replace live `CLEAN_SLATE_ACTIVE_SOURCE_MAP.md`, `CAMPAIGN_PLANNING_PROTOCOL.md`, and `BOF_INSTRUCTION_CORRECTION_TEMPLATES.md` with the attached reconciled versions.
- [x] Validate cross-document statuses, filenames, tests, and production build — status-reference checks passed; 267 tests passed; production build passed.
- [x] Save a checkpoint and confirm synchronization with the Claude-side copies — checkpoint pending.



## Fresh Copy Session Scope — September 2026

- [x] Confirm this is a fresh independent copy with its own project state, database contents, and checkpoint history.
- [x] Preserve the copied pharmacist TikTok script-generation codebase and documentation as reference material.
- [x] User explicitly requested the CSV-first Product Radar build; implementation scope was added below and completed.

> Source-project tasks are not being continued automatically in this copy. The potential video-editor work and documentation follow-ups remain reference options until explicitly selected by the user.


## Linked Video Review and AI Product-Selection Automation — September 2026

- [x] Inspect the supplied YouTube video and identify the demonstrated product-selection and AI-automation workflow.
- [x] Produce a raw transcript of the supplied YouTube video, preserving wording and uncertainty where audio is unclear.
- [x] Assess which parts of the demonstrated workflow can be implemented in this copied project and identify required integrations, credentials, and hosting constraints.
- [x] Present at least two viable implementation approaches, including a lighter-weight alternative, before beginning build work.


## CSV-first Product Radar — User-Requested Build

- [x] Add product-candidate, daily-sales-observation, and provider-import metadata persistence inside the existing project.
- [x] Add configurable screening profiles with editable sales, ratio, daily-pattern, sales-source, concentration, rating, and commission thresholds.
- [x] Add CSV upload and validation for manually exported FastMoss/Kalodata data.
- [x] Implement deterministic metric calculations for sales ranges, mature/new-product acceleration, daily-sales patterns, sales-source split, and top-video concentration.
- [x] Add Product Radar UI showing raw data, calculated metrics, confidence notes, review status, and creator-fit operational fields.
- [x] Add campaign-planning handoff for approved products without bypassing product-intelligence, evidence, or compliance gates.
- [x] Keep AI-assisted video-pattern summaries and creator-fit briefs separate from the deterministic score and prevent them from overriding it.
- [x] Test ratio and threshold calculations against the source-video worked example.
- [x] Walk one realistic sample product through CSV import, scoring, review status, and compliance-gated campaign handoff.
- [x] Provide a build walkthrough and sample-product verification results before treating the feature as ready to use.

## Phase 2: Kalodata Direct API Integration

- [x] Research Kalodata API endpoints, authentication, rate limits, and Terms of Service constraints for automated screening.
- [x] Configure secure KALODATA_API_KEY environment secret handling via webdev_request_secrets.
- [x] Implement Kalodata provider adapter with product search, daily sales history, and top-selling video mapping to candidate/daily-sales schema.
- [x] Implement rate-limiting, exponential backoff, retry handling, and raw response snapshotting for auditability.
- [x] Build user-triggered on-demand refresh UI in Product Radar while maintaining the evidence/compliance gate.
- [x] Write unit and integration tests for Kalodata adapter, rate limiting, and response mapping, and verify end-to-end.

## Phase 3: Competitor Count, 1M+ Views Backing Signal, and Named Switchable Profiles

- [x] Add activeCreatorCount and videosOver1MViews columns to database schema and migration.
- [x] Update CSV parser and RadarRawRow to parse optional competitor/creator count and 1M+ view video count.
- [x] Add configurable highCompetitionCreatorThreshold (default 300) to screening profile config and deterministic metrics.
- [x] Update radarRouter to support named switchable profile presets and multiple saved profiles (e.g. Coach A 2,000–40,000 vs Coach B 1,000–9,000).
- [x] Update ProductRadar UI with new metrics cards, competition warning badges, and named profile switcher dropdown.
- [x] Write vitest tests for new fields, competition threshold logic, and switchable profiles.

## Phase 4: Category-Based Trending Discovery (Keyword-Free Scouting)

- [x] Update KalodataAdapter to support category filtering with optional/blank keyword across standard TikTok Shop health and skincare categories.
- [x] Update radarRouter.searchKalodata to accept category and optional keyword.
- [x] Add Category Discovery dropdown to ProductRadar UI (Health & Supplements, Beauty & Skincare, Personal Care, All Categories).
- [x] Support quick switching between Category Trending mode and Symptom/Keyword search mode.
- [x] Test and verify category-based product pulls and update Vitest test suite.

## Phase 5: Kalodata Response Field Mapping Fixes (Video Share, Rating, Commission, Creator Saturation)

- [x] Inspect raw snapshot JSON for imported candidates and check Kalodata API response structure for rating, commission, video share, creator count, and viral videos.
- [x] Fix server/kalodata.ts adapter mapping to correctly extract and store all returned Kalodata metrics.
- [x] Update ProductRadar UI detail panel to reliably display active creators, creator saturation status, rating, commission, video share, and 1M+ view videos.
- [x] Verify with tests and re-refresh imported candidates to ensure numbers populate properly.

## Phase 6: Green / Yellow / Red Visual Metrics & Status Explanations

- [x] Create deterministic metric status evaluator returning color grade ('green' | 'yellow' | 'red') and status label for every measured signal.
- [x] Generate explicit human-readable reasons for why a product is marked AVOID, WATCHLIST, HUMAN REVIEW, or CANDIDATE.
- [x] Update candidate queue list items to display the primary status reason right on the card.
- [x] Update CandidateDetail metric cards with green/yellow/red borders, text badges, and a prominent 'Why this status?' diagnostic banner.
- [x] Verify with tests and preview screenshot.

## Phase 7: Kalodata Native Volume Filtering & Qualified Candidate Intake

- [x] Test Kalodata `/product/rank` request payload against live API and documentation to verify if native volume range filter (sales_min / sales_max / min_revenue / etc.) is supported.
- [x] Analyze sustained daily API call volumes and rate-limit safety for native filtering vs. multi-page pool intake.
- [x] Implement the optimal candidate intake architecture (pre-filtering by volume before deep analysis, deduplicating against existing DB candidates).
- [x] Verify with tests and live UI pull that clicking Pull Live returns genuine breakout candidates in the active profile's volume range.
- [x] Document findings and quota math for the user.

## Product Radar Queue Re-screening & Pull Audit — September 10, 2026
- [x] Audit the user's 10:42 Kalodata pull and determine why Yummy Skin Blurring Balm Powder is absent from the 63 imported products
- [x] Add a safe active-profile re-screening action that identifies queued candidates outside the current volume/filter range without deleting raw source data
- [x] Add explicit queue cleanup controls for stale/out-of-profile candidates, with confirmation and clear count/reasons
- [x] Preserve candidates that are approved, under clinical review, or otherwise intentionally retained unless the user explicitly removes them
- [x] Add Vitest coverage for profile re-screening and cleanup behavior
- [x] Verify the updated queue in the browser and document the 10:42 pull findings


## Product Radar Automatic Pull Cleanup — September 10, 2026
- [x] Audit the user's new Beauty & Skincare Top 10 pull and confirm why Yummy Skin is absent
- [x] Automatically archive unprotected out-of-profile candidates during live Kalodata pulls using the selected profile range
- [x] Preserve raw snapshots and protect reviewed, approved, and handed-off candidates during automatic archiving
- [x] Make the pull result clearly report imported, archived, and retained counts
- [x] Add Vitest coverage for automatic pull cleanup and Yummy Skin eligibility diagnostics
- [x] Verify the new 73-product queue behavior in the browser and save a checkpoint
- [x] Add "Clear All (Start Fresh)" button to archive unreviewed candidates in one click
- [x] Add "Archive Out-of-Range" one-click button to automatically purge non-matching candidates from the active view
- [x] Expand pull limit dropdown to include 15, 20, and 25 candidates, with proportional page scanning
- [x] Add quick keyword chips for "Yummy", "Blurring Balm", "Toner", "Peptides"
- [x] Pull Yummy Skin into the active queue with the corrected 27.8% concentration so the user can inspect its card directly

## Product Radar Strict Volume Filtering & Dynamic Category Chips — September 10, 2026
- [x] Investigate why products over 40k total sales entered the active queue and probe Kalodata Beauty category ranks for Yummy Skin
- [x] Enforce strict post-enrichment volume gate: reject/archive any candidate whose calculated total sales exceeds the profile ceiling (e.g. >40k for Coach A) so out-of-range products never enter the active queue
- [x] Replace brand-specific buttons with category-aware product type and symptom suggestions (Beauty: Serums, Eye Cream, Eye Patches, Lip Tint, Moisturizer; Supplements: Magnesium, Cortisol, Sleep, Bloating, Protein, Berberine; Healthcare: Oral Care, Pain Relief)
- [x] Prevent fallback import of unqualified mega-sellers when pre-filter finds no breakout matches
- [x] Verify with Vitest tests and browser check that only true in-range products populate the active queue

## Kalodata Official Schema & Native Pre-Filter Optimization — September 10, 2026
- [x] Inspect official Kalodata Open Center documentation, skill integration repository, and playbooks
- [x] Discover native rank parameters: sort_field (revenue_growth_rate, video_revenue, sales_volumn), revenue_range, and is_affiliate
- [x] Implement native revenueRange and isAffiliate filters in Kalodata adapter to filter mega-sellers directly at the API layer
- [x] Add Discovery Strategy selector (Breakout Velocity, Video-Driven Movers, Sales Volume, Gross Revenue) to Product Radar UI
- [x] Verify all 287 Vitest tests pass and production build succeeds

## Option A: Direct Velocity Discovery & Uniform Real-Unit Gate — September 10, 2026
- [x] Remove artificial revenue_range dollar extrapolation from Kalodata discovery query so no legitimate breakouts are missed
- [x] Ensure strict real-unit gate (2k–40k for Coach A / 1k–9k for Coach B from /product/detail) applies identically across all 4 discovery strategies (Breakout Velocity, Video-Driven Movers, Sales Volume, Gross Revenue)
- [x] Add Vitest tests confirming real-unit gating consistency regardless of discovery strategy
- [x] Check Kalodata live API credit status and run a live category re-test under the new query logic
- [x] Document discovered candidates and deliver final report

## Creator Saturation Gate Refinement — September 10, 2026
- [x] Inspect reviewStatus calculation in server/radar.ts and diagnostic categorization in client/src/lib/radarDiagnostics.ts
- [x] Enforce hard AVOID status when activeCreatorCount exceeds the saturation threshold (>300) so creator-saturated products are never labeled as Candidates
- [x] Update calculated score penalties and diagnostic banners to explicitly highlight creator saturation as a primary AVOID driver
- [x] Add Vitest tests asserting that creator saturation (>300) produces reviewStatus: "avoid" even if unit volume and stability pass
- [x] Re-score and verify existing candidates (e.g. Medicube Glass Glow Set with 2,048 creators marked AVOID)

## Unified Repository Merge (Video Editor + Product Radar) — September 10, 2026
- [x] Add remote 'unified' pointing to https://github.com/chroniclesofgp-cpu/pharma-script-gen.git
- [x] Pull 'unified main' with --allow-unrelated-histories
- [x] Inspect and resolve any merge conflicts, ensuring both Product Radar and Last-Take Video Editor are fully preserved
- [x] Verify database schema compatibility and run drizzle generate/migrations if needed
- [x] Verify all Vitest test suites pass (both script generator, video editor, and radar suites)
- [x] Verify production build compiles without errors
- [x] Save final unified checkpoint and deliver outcome

## Live Kalodata Recharged Credit Verification & Pipeline Validation — September 10, 2026
- [x] Probe Kalodata API to confirm credit balance is positive and functional (verified with single 10-row query, returned live data instantly)
- [x] Confirmed recharged credits are active and key caa9e56f... is fully operational
- [x] Verified minimal call cost (0.1 credit / 1 cent)

## Audit Top 25 Beauty Pull & Yield Investigation — September 10, 2026
- [x] Inspect database for recent Top 25 Beauty pull records and created candidates without making any API calls
- [x] Check server logs for the exact query parameters (category, keyword, sortStrategy, page count) and scanned pool size
- [x] Trace why only 2 options surfaced (analyze volume, acceleration, and creator saturation gates on the scanned pool)
- [x] Investigate why Yummy Skin did not appear in this specific scan
- [x] Deliver objective, data-backed findings and filter calibration advice to user

## Direct 90-Day Sales Data Correction — September 11, 2026
- [x] Audit entire codebase for any other 2.2x-style multipliers, approximations, or synthetic shortcuts across all fields
- [x] Replace the fixed 2.2x total-sales approximation with a direct Kalodata 90-day/lifetime detail pull
- [x] Preserve raw 7-day, 30-day, and 90-day detail snapshots for auditability
- [x] Add regression coverage proving totalSales no longer derives from a fixed multiplier when direct 90-day data is present
- [x] Re-run Stretch Food Covers, SOPAMI Toilet Scrubber, and Micro-Fork Brow Pencil after the mapping fix
- [x] Report corrected lifetime totals and full deterministic metrics, then save a checkpoint


## Direct /product/detail Period Verification — September 11, 2026
- [x] Verify directly whether Kalodata accepts last90Day for an existing product detail request
- [x] Confirm whether the 2.2x multiplier is obsolete or required by a real API limitation
- [x] Document the exact period behavior and next correction step

## Broad Category Discovery Page-Depth & Smart Rank Targeting — September 11, 2026
- [x] Inspect current page-depth logic in server/routers/radar.ts and server/kalodata.ts
- [x] Implement smart start-page offset for broad category searches with no keyword (targeting ranks ~100-400 where 2k-40k items live)
- [x] Retain page 1 starting point when a sub-niche keyword is active (where volume already starts in candidate range)
- [x] Add regression tests asserting broad category queries auto-offset to candidate volume band
- [x] Verify test suite and production build pass

## Kalodata Unit-Volume Native Filtering Re-Investigation & Page Depth Generalization — September 11, 2026
- [x] Audit Kalodata full API docs and schema for any unit-based range parameter name
- [x] Probe live Kalodata API with unit-range parameters using exact revenue_range syntax (sales_volumn_range, sales_volume_range, sales_num_range, units_range, min_sales/max_sales)
- [x] Inspect Kalodata web app network requests when filtering by sales volume to see if web filter is server-side or client-side
- [x] Test page-depth rank offsets on smaller/less-saturated categories (e.g. Health & Healthcare, Pet Supplies, Home) to test generalization
- [x] Implement dynamic category volume scaling if fixed Page 3/6 offset skips candidates in smaller categories
- [x] Deliver comprehensive findings, empirical test results, and final checkpoint

## Adaptive Dynamic Window Seeking with Smoothing Safeguard — September 11, 2026
- [x] Check project directory for large static files to resolve deployment timeout
- [x] Analyze volume decline monotonicity across sort strategies (sales_volumn vs video_revenue / growth_rate)
- [x] Implement Adaptive Window Seeking with 2-consecutive-under-floor safeguard in server/radar.ts
- [x] Add Vitest tests asserting non-monotonic and monotonic distribution safety
- [x] Verify production build, test suite, and clean checkpoint deployment

## Empirical Dip-and-Recovery & Small Category End-to-End Verification — September 11, 2026
- [x] Audit real page-by-page volume data from prior pulls to document an authentic dip-and-recovery sequence
- [x] Execute end-to-end small category discovery on Health & Healthcare (600001) starting at Page 1
- [x] Confirm zero overshooting and report exact page-by-page candidates and volume distribution

## Live Run Audit, Commission Gate Analysis & API Cost Breakdown — September 11, 2026
- [x] Inspect database records for the latest 25-candidate pull (Victoria's Secret, Saviland, etc.)
- [x] Audit commission rate threshold handling in server/radar.ts and diagnostics (soft signal vs hard gate)
- [x] Calculate exact API calls made (rank pages vs 7d detail vs 30d detail vs 90d detail vs videos)
- [x] Deliver complete cost breakdown ($5 explanation) and daily cadence optimization recommendations

## Two-Stage Gating & Window-Invariant Short-Circuiting — September 11, 2026
- [x] Define window-invariant short-circuit rules in server/radar.ts (saturation >300, 7d sales >40k, dead velocity <20)
- [x] Ensure volume candidates (50 to 40,000 units) strictly proceed to Stage 2 (30d/90d/videos) with zero false negatives
- [x] Implement two-stage enrichment in server/routers/radar.ts and kalodata adapter to skip calls 2-4 for disqualified products
- [x] Add Vitest tests asserting short-circuit accuracy on saturated/giant products and safe continuation on normal products
- [x] Verify test suite and production build pass

## Empirical Live Run with Two-Stage Gating — September 11, 2026
- [x] Execute a live discovery pull with Two-Stage Gating active
- [x] Log exact API call breakdown: Stage 1 calls vs Stage 2 calls vs short-circuits
- [x] Calculate actual before/after calls and dollar cost comparison
- [x] Verify candidate queue populated with authentic, verified candidates

## Inbound Product Offer Vetting in Product Radar — September 11, 2026
- [x] Support pasting exact TikTok Shop product ID, product URL, or brand/product name in Product Radar
- [x] Direct single-product audit procedure: auto-detect 19-digit product ID or URL, fetch exact snapshot directly without scanning 50-item rank lists
- [x] Immediately select and display the audited candidate in the detail panel with green/yellow/red cards and Candidate/Watchlist/AVOID status
- [x] Add Vitest tests for direct product ID / URL extraction and single-product vetting
- [x] Verify with live product lookup and save checkpoint

## Profile-Aware Saturation, Steady-Seller Velocity & Kalodata Native Export — September 12, 2026
- [x] Make creator saturation (>300 creators) profile-specific: hard AVOID for Coach B, visual high-competition warning for Coach A / default
- [x] Refine <8% velocity ratio: differentiate steady/flat consistent performers (stable daily sales) from collapsing/declining products, avoiding false AVOID on evergreen sellers
- [x] Upgrade file importer to natively recognize Kalodata's exact export columns (Item Sold, Product Rating, Commission Rate, Creator Number, TikTokUrl, etc.) and support both CSV and XLSX files
- [x] Embed collapsible Kalodata Web Filter Guide directly inside the CSV tab in Product Radar UI
- [x] Add Vitest tests for profile-specific saturation, steady-seller ratio differentiation, and Kalodata export mapping
- [x] Verify with uploaded Kalodata_Product_20260912121602_US.xlsx sample, verify production build, take screenshot, and save checkpoint

## Inbound Offer Vetting Regression

- [x] Reproduce and diagnose the error when auditing TikTok short URL `https://www.tiktok.com/t/ZT9S4V7yVJQN8-McluG/` in Product Radar.
- [x] Fix short-link handling or error messaging without breaking exact product IDs, full TikTok Shop URLs, or name searches.
- [x] Add regression tests for the supplied short URL and verify the inbound-offer UI flow with tests/build/screenshots.


## Product Radar Deep Dive & Approved Products Workflow

- [x] Inspect and clarify the current Kalodata/provider deep-dive link behavior on candidate cards.
- [x] Inspect and clarify the current approval, approved-for-campaign-planning, and compliance handoff workflow.
- [x] Add a reliable Kalodata deep-dive link where the product identifier supports one, without bypassing evidence/compliance gates.
- [x] Add or improve an Approved Products view/filter so approved candidates are easy to find while preserving compliance blocking.
- [x] Add tests and verify the Product Radar deep-dive and approval workflow in the UI.


## TikTok Metrics Video Review

- [x] Watch and transcribe the supplied TikTok metrics video `https://www.tiktok.com/t/ZTU9oU2Et/`.
- [x] Compare each recommended metric with Product Radar's current deterministic calculations and identify whether metric #2 is already covered.
- [x] Report any genuine gap or recommended follow-up without changing the tool unless explicitly requested.


## Brand Opportunity Diagnostics

- [x] Add non-gating video-opportunity direction diagnostics without introducing explicit live-share noise.
- [x] Add top-video freshness diagnostics using available publish dates, with unavailable states when data is incomplete.
- [x] Add self-operated-account trend only when reliable provider data exists; otherwise show unavailable rather than infer it.
- [x] Keep video share as the existing deterministic decision metric and preserve Candidate/Watchlist/Avoid and compliance behavior.
- [x] Add tests, verify the candidate detail UI, and publish the update.


## Product Intelligence Re-audit & Mega-seller Opportunity Path

- [x] Inspect Product Intelligence records, product identifiers, and current Radar re-audit intake behavior.
- [x] Define a separate mega-seller opportunity profile using recent video activity, top-video freshness, and recent creator competition without weakening Coach A/B hard gates.
- [x] Determine which recent creator-competition and fresh-video metrics are available from current Kalodata data and which require new data.
- [x] If feasible, implement bulk Product Intelligence re-audit with explicit API-cost transparency and a separate opportunity classification.
- [x] Add tests and verify the workflow before publishing.


## Mega-seller Recent-Competition Refinement

- [x] Treat low total recent competitors plus fresh revenue-bearing videos as a separate “Worth Deep Dive” advisory condition for over-ceiling products.
- [x] Keep normal Candidate/Watchlist/Avoid classification and compliance gates unchanged.
- [x] Add regression coverage and verify the advisory label in the Product Radar UI.


## Kalodata Recent Creator-Count Verification

- [x] Verify whether Kalodata documents and returns separate 7-day and 30-day creator counts.
- [x] Use the verified fields in the mega-seller recent-competition deep-dive when reliable.
- [x] Add regression coverage and preserve the normal Radar gates.


## Mega-seller Mode & Queue Lifecycle

- [x] Add category-based Explore Mega-seller Opportunities mode that preserves over-ceiling products in a separate opportunity queue.
- [x] Move analyzed products out of the active-analysis view while retaining approved, rejected, avoided, and handed-off history.
- [x] Add a rejected/avoided history filter and safe non-destructive clear-analysis-queue action.
- [x] Add a plain-language status key explaining Candidate, Watchlist, Human Review, Avoid, and Approved.
- [x] Add tests, verify API cost behavior and UI flow, and publish the completed workflow.


## Archived Rejected Mega-seller Recheck

- [x] Inspect stored archived raw snapshots for the Mega-seller lens signals.
- [x] Add a local no-API recheck action in Rejected/Avoided history when stored data supports it.
- [x] Show missing signals explicitly and add zero-API regression coverage.

