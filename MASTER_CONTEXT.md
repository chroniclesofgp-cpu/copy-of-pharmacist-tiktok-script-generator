# Master Context Document
## RxContent — Pharmacist TikTok Script Generator
**Purpose:** This document is the single source of truth for the RxContent project. It should be read at the start of every new session to restore full context. It captures who the user is, what has been built, why key decisions were made, and what is planned next.

**Last Updated: August 17, 2026

---

## How to Use This Document

**Starting a new session (any AI):** Share this document. It restores full context on the creator, the tool, all decisions made, all rules, and what is planned next.

**Scripting tasks — SHORT SESSION (1–3 scripts, familiar product):** Read `PRE_SESSION_BRIEF.md` instead of all six source docs. It is a compressed, high-density summary of all six source docs (HOOK_FRAMEWORKS.md, SCRIPT_ARCHITECTURE_GUIDE.md, BUYER_PSYCHOLOGY_LEVERS.md, PHRASE_BANK.md, VISUAL_OVERLAY_PLAYBOOK.md, HEALTHCARE_HOOK_REFERENCE_GUIDE.md) plus the full 18-point script quality checklist. Estimated 70–80% credit savings vs. reading all six docs. Location: `/home/ubuntu/pharma-script-gen/PRE_SESSION_BRIEF.md`.

**Scripting tasks — HIGH-VOLUME SESSION (4+ scripts) or NEW PRODUCT CATEGORY:** Read all six source docs in the priority order below for maximum nuance and performance. Also read the product intel doc for the specific product being scripted.

**Script delivery rule:** Every script written in conversation must be (1) delivered as a standalone `.md` attachment AND (2) appended to `SCRIPT_LIBRARY.md` at the project root with the table of contents updated. `SCRIPT_LIBRARY.md` is the single place to find all scripts ever written. Never deliver a script without appending it to the library.

**Script quality audit rule (established July 19, 2026):** Every script must be audited against the 18-point quality checklist in `PRE_SESSION_BRIEF.md` Section 9 before delivery. This audit is automatic — the user does not need to request it. Workflow: (1) write draft, (2) run 18-point checklist, (3) apply fixes for any failures, (4) deliver final draft with the note “Quality checklist passed — 18/18” or a list of items flagged and resolved. The user will never receive a script that has not been audited.

**Scripting reference priority order (full read — high-volume or new product sessions):**
1. `HOOK_FRAMEWORKS.md` — hook selection, structural rules, product reveal timing
2. `SCRIPT_ARCHITECTURE_GUIDE.md` — 9 universal structural rules (authority placement, timing, CTA structure)
3. `BUYER_PSYCHOLOGY_LEVERS.md` — which psychology levers to activate and in what sequence
4. `PHRASE_BANK.md` — exact sentence-level language for gap, transition, objection, and rehook sections
5. `VISUAL_OVERLAY_PLAYBOOK.md` — post-production overlay guide; reference this while writing to determine which overlay strategy (A/B/C/D/E) to assign and what specific overlays to recommend at each section (opening hook text, study popups, condition images, benefit list builds, diagrams, social proof timing, CTA arrow). Embed all overlay recommendations directly in the script as a POST-PRODUCTION NOTES section at the end. The opening hook text appears for 3–8 seconds at 0:00 then disappears — it is NOT a persistent element. Write the exact opening hook text and all overlay assignments in the POST-PRODUCTION NOTES section of every script.
6. `HEALTHCARE_HOOK_REFERENCE_GUIDE.md` — human-readable hook reference; contains structural distinction notes not present in HOOK_FRAMEWORKS.md: Bait and Switch Trust Architecture (right-way hook, Dr. Faith $279K GMV execution), Prescription Feel Technique (expert-verdict hook), rapid-fire delivery variant (symptom-checklist, Riva), bundle variant (comparison hook), family protection CTA (fear-external-threat), and the exact structural difference between instruction-correction and right-way in plain language. Read this after HOOK_FRAMEWORKS.md to confirm the execution approach before writing.
7. Product intel doc — verified facts, studies, and claims for the specific product being scripted
8. `BOF_INSTRUCTION_CORRECTION_TEMPLATES.md` — **required for any BOF suite session (Type 1, 2, or 3 scripts).** Contains the complete fill-in-the-blank structure, rules, triple hook templates, overlay templates, caption templates, tone notes, and decision guide for all three BOF suite types. Read after HOOK_FRAMEWORKS.md when writing BOF or instruction-correction scripts.

**PRE_SESSION_BRIEF.md** — Created July 19, 2026. A single compressed document that replaces reading all six source docs for short sessions. Contains: 10 universal hook rules, Rules A–H from the architecture guide, 11 buyer psychology levers (condensed), most-used verbatim phrases, overlay strategy decision tree, caption/hashtag rules, and the full 18-point script quality checklist. Update this brief whenever a new rule is added to any source document. **This is the recommended starting point for any session involving 1–3 scripts on a familiar product.**

**Iterating on a specific existing script:** Also share the relevant script file from `/scripts/`.

**Reviewing performance data or script feedback:** Also share `VIDEO_PERFORMANCE_LOG.md` and/or `SCRIPT_FEEDBACK_LOG.md`.

**Creator analysis or Video Lab work:** Also share the relevant analysis file from `/analysis/`.

**This document does NOT need to be regenerated** — it is updated in place at the end of each session. Always use the most recent version.

---

## 1. About the Creator

**Background:** Mixed-race (Black/White) pharmacist, born and raised in Brooklyn, NY by a single mother in a lower-class household. Licensed pharmacist since 2013, currently working at CVS. Prior experience includes one year at a hospital pharmacy and four years as a pharmacy intern in a hospital during pharmacy school. This clinical background — particularly the hospital internship — gives a depth of pharmacological knowledge that retail-only pharmacists do not have.

**Why this matters for content:** The combination of street-level relatability (Brooklyn upbringing, working-class background) and clinical authority (PharmD, hospital experience, 13+ years dispensing) is a rare and powerful positioning. Most healthcare creators are either relatable but not credentialed, or credentialed but not relatable. This creator is both.

**Goals — short term:** Build TikTok Shop affiliate income as a side hustle that grows into a primary or co-primary income source. The goal is for TikTok to eventually replace the CVS job or reduce it to part-time/per diem.

**Goals — long term:** Become a trusted healthcare resource for people who do not have easy access to healthcare providers. Educate people about supplements and health products that can genuinely improve quality of life. Be living proof of what is possible for people from Brooklyn and similar backgrounds — not just as a pharmacist, but as a creator and entrepreneur. Many people from the creator's community already look up to them but may assume success required innate advantages. The TikTok journey is meant to show that a repeatable, learnable system can produce real results for anyone willing to put in the work.

**Content philosophy:** The healthcare content (Rx Content / TOF) is the primary lane — it is where the credential creates the most differentiation and the highest trust. The BOF deal content (Shop Script) is a secondary lane, studied and built because it is accessible to anyone and because understanding it makes the creator a more complete TikTok Shop operator. The long-term vision includes teaching others what has been learned.

**On-screen positioning:** Male pharmacist. The male credential is a genuine competitive advantage in categories like hair loss, testosterone, men's skincare, ear care, and men's sexual health — categories where female creators cannot occupy the same authority position. The introductory phrases tested are:
- *"I'm a pharmacist. I talk to doctors and patients every day, and I'm going to tell you exactly what actually works."* (Clinical Insider)
- *"I'm a pharmacist. I counsel patients on this stuff every single day. Here's what I actually tell them."* (Authority + Relatability)

---

## 2. The Tool — What Was Built and Why

**Tool name:** RxContent (Pharmacist TikTok Script Generator)  
**URL:** pharmascript-tonqparb.manus.space  
**Stack:** React 19 + Tailwind 4 + Express 4 + tRPC 11 + MySQL (Drizzle ORM) + Manus Auth  
**Design language:** Clinical Command Center — deep navy (#0A1628) background, electric teal (#00D4AA) accents, IBM Plex Mono for script output, Space Grotesk for headings. Chosen because it feels like a professional internal tool, not a consumer app.

The tool was built because manual script writing is slow and inconsistent. The goal was to encode the patterns from top-performing healthcare creators into a system that generates scripts at the quality level of those creators, but adapted to this creator's specific voice and credential. Every design decision in the tool was made to serve that goal.

### Four Modules

| Module | Purpose |
|---|---|
| **Rx Content** | Generate original pharmacist scripts using 14 hook frameworks derived from real viral healthcare videos |
| **Shop Script** | Generate BOF (Bottom-of-Funnel) deal scripts using verbatim line banks from top-performing deal creators |
| **Vet Product** | Analyze a TikTok Shop product listing for clinical credibility, red flags, and affiliate viability |
| **Video Lab** | Transcribe and analyze any TikTok video; Clone Mode rewrites it in the creator's voice; Iterate Mode generates 70/20/10 variations |

---

## 3. Rx Content — Healthcare Script Generator

### The Core Architecture

Every script generation runs two steps in sequence:

1. **`researchProduct()`** — calls the LLM to extract mechanism of action, clinical backing, dosing facts, citations, and the key "gap" (the common mistake most people make). The prompt demands specific numbers, named studies, and PMID/DOI references. It explicitly rejects vague answers.

2. **`generateSingle()`** — uses the research output as grounding context. The LLM writes the full script from the research facts, not from scratch. The hook-first constraint is enforced in the prompt: the verbal hook must be the first spoken words, no preamble.

**Fact-checking stance:** The LLM draws on training data, not live PubMed queries. For well-studied ingredients (creatine, magnesium glycinate, vitamin D, omega-3, NAD+), the claims are reliable and consistent with published science. For newer compounds (urolithin A, spermidine, NMN), the creator applies their own pharmacist judgment. The creator always opens PubMed links before citing them — a fabricated PMID is self-correcting because the link will not resolve. No automated fact-checking layer is needed; the creator's clinical training is the final filter.

### The 14 Hook Frameworks

The frameworks are organized in two tiers. Tier 1 hooks are high-volume and proven. Tier 2 hooks are secondary or situational.

**Tier 1 — Heavy Hitters:**

| Hook | Reference Creator | Key Pattern |
|---|---|---|
| Instruction / Correction | @adoseofwellness (Riva) — 12.8M views | "Here's how to take X the right way" / "Most people are taking X wrong" |
| Symptom Checklist | @adoseofwellness (Riva) — 3.9M views | Visual symptom list → cause → product |
| Suppressed Knowledge | @adoseofwellness (Riva) | "What your doctor doesn't tell you about X" |
| After 1 Month Formula | @drew.review — 7.9M views | "[Product] after 1 month — from a pharmacist" |
| Trend or Trash | @drew.review | "Is X worth it? A pharmacist looks at the evidence" |
| Comparison Hook | @rphreviews | "X vs. Y — a pharmacist breaks it down" |
| Warning Signs Hook | @rphreviews | "Stop doing X if you have Y" |
| How Do You Know | @rphreviews | "How do you know if you have [condition]?" |

**Tier 2 — Secondary / Situational:**

| Hook | Status | Notes |
|---|---|---|
| Age Reversal | No confirmed reference video | Framework inferred — needs Kalodata validation |
| Dosing Authority | No confirmed reference video | Framework inferred |
| Forbidden Knowledge | No confirmed reference video | Framework inferred |
| The Mechanism Reveal | Partial reference | |
| Before / After Protocol | Partial reference | |
| The Comparison Showdown | @rphreviews | Confirmed — Ordinary vs. Medicube Volufiline |
| Scam-Warning (Hook 29) | @adoseofwellness (Riva) — preliminary | "This is fake, this is a scam, this is fake" — pointing at fake/counterfeit listings → real product reveal. Fake products appear in first 3 seconds as the hook itself. Preliminary — needs 2+ more healthcare creator examples to validate. |

### Key Structural Rules (Universal)

Every script must contain a **Gap** — a statement of what most people are missing, doing wrong, or not aware of. The product fills this gap. Without the gap, the recommendation feels like an ad rather than expert advice.

**Product introduction timing is late by default.** For education-heavy hooks, the product should not appear until the final third of the script. For symptom/pain-point hooks, the product can appear earlier once the cause is identified.

**Hook-first constraint:** The verbal hook must be the first spoken words. No preamble before the hook. This is enforced in the generation prompt.

**Problem section rule:** The problem section must name a specific mechanism failure — not a behavioral observation. BAD: "Most people expect instant results." GOOD: "Most people take it without fat so they absorb less than 20%." This was a specific prompt improvement made after observing generic filler lines in early outputs.

**TOF curiosity loop rule:** In top-of-funnel scripts, the product name, brand, and visual are NEVER revealed until the final section. Structure: hook the viewer → open curiosity loop (what is causing this?) → close with education (here is why) → open second loop (what actually helps?) → close with solution mechanism → THEN introduce the product as the delivery vehicle. Revealing the product early kills watch time. Exception: comparison hook — product is shown upfront, but the verdict is withheld until the end.

**Triple Hook Strategy:** Every script deploys three simultaneous attention triggers in the first 2 seconds: (1) **Visual hook** — what is physically on screen; (2) **Spoken/verbal hook** — the first words out of your mouth; (3) **Text overlay hook** — on-screen text that approaches the same topic from a different angle, never repeating the spoken words verbatim. The tool generates 3 text overlay options per script: question format, provocative statement, and stakes framing. Always generate all three before filming and pick the one that matches your delivery energy.

**Every script deliverable includes a caption and 5 hashtags.** Caption: max 2 lines, subtle CTA acceptable ("definitely worth a try") but never transactional ("tap the orange cart"). Hashtags: exactly 5 — brand name, ingredient/product name, 2 pain point tags, 1 general health/pharmacy tag.

**New product scripts include 3–4 verified PubMed studies.** Always pull the actual PubMed or PMC page before citing — never cite from memory or training data alone. Distinguish between mechanism studies (in vitro/animal) and human RCTs when describing evidence strength. Studies map to specific claims in the script and are used for on-screen study pop-ups.

**TOF product intro framing:** Do not say "if you're looking for a great recommendation." TOF viewers have not done prior research and do not know they need the product yet. Instead use: "This is the one I use daily. This is the one I recommend to my patients." The credential does the selling — not the pitch.

**Pain points before the reveal:** In symptom-reframe hooks, list ALL symptoms first, then name the cause. Do not name the cause mid-hook. Let the viewer accumulate recognition before the reveal lands.

**Let visuals carry the load:** If a diagram or on-screen graphic shows something, do not also explain it verbally. Name one or two examples verbally, then let the visual do the rest. Verbal and visual should complement each other, not duplicate.

**CTA rule:** Once the CTA starts, never go back to product features. Features must come before the CTA. CTA structure: social proof + urgency + link. Keep it short.

### The Misdirection Technique

An optional toggle in the UI. When enabled, adds a line that corrects an overclaim to build credibility. The rule is strict:

- **BAD (hedging):** "Everyone says this works but honestly it works for many people."
- **GOOD (credibility-building correction):** "Everyone says you need to do a loading phase with creatine — but honestly a consistent 3-5g daily dose reaches the same saturation in 28 days with none of the GI side effects."

The misdirection must correct a real overclaim in the category. It should make the creator sound more trustworthy, not less confident.

### Why No Verbatim Line Bank for Rx Content

The BOF generator uses verbatim lines from real creator videos because the deal script structure is formulaic and the exact language matters. The Rx Content generator does NOT use verbatim lines because:

1. Healthcare scripts need to sound like this specific creator — not like a line pulled from another pharmacist's video.
2. The LLM writing the hook from scratch using the research context and voice guidelines produces better results than assembling from examples.
3. Verbatim lines from other creators would undermine the authenticity that is the core value proposition.

### Study Verification Standard

All studies must be verified by navigating to the actual PubMed or PMC URL before citing. Never recommend a study from memory or training data alone — a fabricated PMID will not resolve and will undermine credibility. Verified studies for each product are stored in the individual product intel docs at `/home/ubuntu/pharma-script-gen/product-intel/`. Do not maintain a study table here — go to the intel doc for the relevant product.

---

## 4. Shop Script — BOF Deal Generator

The BOF generator uses a verbatim line bank built from deep analysis of top-performing deal creators. The line bank is in `client/src/lib/bofLineBank.ts`. Each line is tagged with creator, frequency rating, and slot position.

**Tracked BOF creators and their primary patterns:**

| Creator | Primary Hook | Signature Element |
|---|---|---|
| @momfindsbyfaith (Faith) | Reverse Psychology ("Do Not Get This") | Coupon gamification — "some of you even have coupons today" |
| @dealscope | Comparison / Upgrade ("Do Not Buy Small One") | TikTok Glitch hook |
| @blackfridaybrian (Brian) | Fake Outrage | Returning This variant with outrage framing |
| @welearn2earn | Deal Alert / Triple Discount | Quantity math |
| @dealssforeveryone | Bundle / Motherload | Flash sale urgency |

**Faith's coupon gamification (92% of her videos):**
> "Some of you even have coupons today. Not everyone sees those coupons and it's for a limited time so you'll have to go to checkout to see if you have one."

Key insight: Faith never confirms a coupon exists — she uses conditional language ("some of you", "not everyone sees") to drive checkout clicks without making a false promise.

**The "Before I Reach for the Pill Bottle" Framework:** One of the most powerful content frames for a pharmacist creator. A pharmacist recommending something *other* than a drug is a pattern interrupt. The credential becomes the reason to trust the non-drug recommendation. Template: *"As a pharmacist, the first thing patients ask me for [condition] is medication — but before I reach for the pill bottle, here's what I actually tell them to try first."*

---

## 5. Clone Mode — Key Decisions

Clone Mode transcribes a viral TikTok video and rewrites it in the creator's pharmacist voice. Critical decisions made:

**Hook switching was removed.** The original implementation generated 5 rewrites using different hook frameworks. This was wrong — Clone Mode's purpose is to preserve what made the original work, not to explore alternatives. Hook cycling was removed. Clone Mode now generates exactly one rewrite that preserves the original video's hook framework and section structure.

**Why:** When you find a viral video, the proven structure is the asset. Switching hooks defeats the purpose. If you want to explore alternative hooks, that is what Iterate Mode is for.

**The correct Clone Mode workflow:** Clone first (preserve structure, adapt voice) → Iterate second (explore variations) → Generate when you want to own the angle completely from scratch.

---

## 6. Video Lab — Creator Analysis

The Video Lab transcribes and classifies TikTok videos. It is used for:
- Analyzing viral videos before cloning or iterating
- Studying competitor/reference creator scripts
- Understanding what hook framework a video uses

**Methodology rules (non-negotiable):**
1. Captions are not hooks. The verbal hook is what the creator says in the first 1-2 seconds on camera. Captions are SEO copy and routinely do not match the actual opening line.
2. Only analyze videos from the creator's own profile grid. TikTok's sidebar shows other creators' videos — these contaminate the analysis.
3. A creator onboarding is not complete until the generation pipeline is updated. Documentation alone does not count.

### Required Workflow for Any TikTok Video Analysis

The only way to accurately extract a spoken hook, pacing, section order, tonality, CTA structure, and on-screen text sequence is to download and transcribe the actual video audio. TikTok page metadata (captions, titles, hashtags) is discovery copy — it does not reflect what the creator says on camera or how the video is structured.

**Step 1 — Download the video using yt-dlp:**
```bash
yt-dlp "https://www.tiktok.com/@handle/video/1234567890" -o "/home/ubuntu/upload/video_name.mp4" --no-playlist
```

**Step 2 — Transcribe and analyze:**
```bash
manus-analyze-video "/home/ubuntu/upload/video_name.mp4" "Transcribe this TikTok video word for word exactly as the creator speaks. Also note every on-screen text overlay, graphic, diagram, product shot, and study popup that appears. Note the order of everything."
```

This process works for any public TikTok video — no login required. yt-dlp downloads directly from the public URL.

**What full transcription captures that captions cannot:**
- The exact spoken hook (word for word, first 1–3 seconds)
- The section order (hook → authority → education → gap → product reveal → CTA)
- The exact moment the product is named or shown on screen
- Every on-screen text overlay and when it appears
- Every graphic, diagram, or study popup and what it says
- The tonality — conversational vs. authoritative vs. urgent
- The exact CTA language and its length
- Whether the product is revealed early (comparison hook) or late (TOF curiosity loop)

**For coaching video analysis (e.g., Coach Ruben breakdowns):** Same process. Download the coaching video and run `manus-analyze-video` with a prompt asking for both the coach's feedback AND the original creator video content being reviewed. This captures the exact changes recommended and the specific lines being critiqued.

**Never analyze from captions alone.** If a video cannot be downloaded, note it as unverified and do not extract hook lines from it.

**⚠️ AI Video Analyzer Reliability Rule (established June 3, 2026):**
`manus-analyze-video` is reliable for detecting **visual elements** (overlay types, timing windows, graphic formats, on-screen text, frequency counts, product reveal timing). It is **NOT reliable for verbal content** — it will misreport, paraphrase, or fabricate spoken lines, credential wording, and exact hook phrases. Confirmed failure: it incorrectly reported that rphreviews dropped his credential in his bottom-performing videos; verified transcript data confirmed the credential was present in all three.

**Rule:** Never use `manus-analyze-video` output as the source of truth for what a creator *said*. For any verbal claim (hook wording, credential line, CTA language), always cross-reference against the Whisper transcript data in the `*_transcripts_gmv_full.txt` files or the `rphreviews_analysis_gmv.md` doc (which used actual audio transcription). Use `manus-analyze-video` only for visual pattern analysis.

**Data reliability tiers:**
- **High:** GMV figures (Kalodata), verbatim hooks (Whisper transcripts in `rphreviews_analysis_gmv.md`), visual overlay patterns (video analyzer)
- **Moderate:** Verbal content paraphrased from deep analysis docs (built via video analyzer — treat as approximate, not exact)
- **Low:** Exact verbal wording from deep analysis docs — verify against transcript files before quoting

---

## 7. Tracked Healthcare Creators and Analyzed Videos

**Note on reference video analysis:** When a script is built from reference videos, the source video links are included in the script doc under a "Reference Videos Analyzed" table. The following videos have been downloaded and fully transcribed (not just captioned) for analysis:

| Creator | Product/Topic | Used For |
|---|---|---|
| @rphreviews | Magnesium/Cortisol (AshwaMag) | Magnesium v3 stress dysregulation section |
| @adoseofwellness (Riva) | Magnesium/Cortisol | Magnesium v3 stress dysregulation section |
| @rphreviews | Medicube vs. Dr. Melaxin | Comparison script Version C (exact remake) |
| @momfindsbyfaith (Faith) | Medicube vs. Dr. Melaxin | Comparison script Version B (exact remake) |
| @momfindsbyfaith (Faith) | Loaded Tea vs. Bloom | Analyzed and assessed — missed the mark (see loaded-tea-vs-bloom-comparison.md) |

---

## 7b. Tracked Healthcare Creators

These creators were analyzed to build the Rx Content hook frameworks:

**@adoseofwellness (Riva)** — Female pharmacist. Primary source for Instruction/Correction, Symptom Checklist, and Suppressed Knowledge hooks. Reference video: 12.8M views on creatine instruction/correction. Key pattern: first 70% of video is pure education; product appears only after trust is established. Has done energy drink content (Loaded Tea vs. Bloom comparison — assessed as missing the mark: only linked one product, spent too long on sucralose/prebiotic contradiction, no mechanism education, no on-screen study popups).

**@drew.review (Drew)** — Male pharmacist/healthcare creator. Primary source for After 1 Month Formula and Trend or Trash hooks. Reference video: 7.9M views. Key pattern: personal testing narrative combined with clinical authority.

**@rphreviews** — Male pharmacist (17+ years). Primary source for Comparison Hook, Warning Signs, How Do You Know, and Comparison Showdown. Every video contains affiliate disclosure. Key pattern: comment-reply format builds parasocial trust; ingredient-first framing. The "how-do-you-know" hook was identified and added to the framework after analyzing this creator. Has NOT done energy drink content — energy drink space is an open lane for a credentialed pharmacist.

**@faithfuldoc (Faith's Rx content)** — Healthcare creator. Analyzed for Rx-style content patterns.

---

## 8. Key Product Categories and Analyzed Products

### Products Fully Analyzed (Verified Ingredient Profiles on File)

Full ingredient profiles, mechanisms, and verified studies for each product live in `/home/ubuntu/pharma-script-gen/product-intel/`. The table below is a summary index only — one line per product with the core content angle and intel doc pointer.

| Product | Core Story | Intel Doc |
|---|---|---|
| **Neuro Gum** | Buccal caffeine absorption + L-theanine synergy — faster onset than swallowed caffeine | `neuro-gum-intel.md` ✓ |
| **Medicube PDRN Kojic Acid Serum** | Tyrosinase inhibition — blocks melanin at enzyme level, 28-day cell turnover timing | Light protocol only — not yet in hand |
| **Medicube PDRN Pink Collagen Multibalm Stick** | Volufiline™ stimulates fat cell growth for natural volume — Rebornic micro-channels enhance ingredient penetration | `medicube-multibalm-intel.md` ✓ |
| **Dr. Melaxin Cemenrete Volume Multi-Balm** | Rebornic activates Vitamin D Receptor → drives skin cell differentiation and renewal → supports fibroblast collagen production. No spicules. Multi-use stick format. | `dr-melaxin-multibalm-intel.md` ✓ (re-verified June 23, 2026) |
| **The Loaded Tea Shop** | Natural green tea caffeine + full B-vitamin stack at therapeutic doses + D3/MK-7 K2 + dose control | `loaded-tea-shop-intel.md` ✓ |
| **Bloom Sparkling Energy** | L-theanine + Sunfiber (patented, no-bloat prebiotic) + Oligonol (patented lychee, 30 trials, nitric oxide) | `bloom-sparkling-energy-intel.md` ✓ |
| **Medicube Body Brightening Deodorant Stick** | Kojic acid blocks tyrosinase + ceramide barrier repair, no AHA — safe for sensitive/post-shave skin | `medicube-deodorant-intel.md` ✓ |
| **Truly Beauty Soft Serve Serum Deodorant** | 5% AHA exfoliates surface darkening + AHA lowers pH for odor control — faster results, not for sensitive skin | `truly-beauty-deodorant-intel.md` ✓ |
| **Toplux Magnesium Complex** | 8-form magnesium complex — each form absorbed and utilized differently, proven viral hook (rphreviews/Riva) | `toplux-magnesium-complex-intel.md` ✓ |
| **Celsius** | MetaPlus thermogenic blend — effect is real but caffeine-driven, proprietary blend hides doses | `celsius-light-intel.md` ✓ (Light Protocol) |
| **HiSmile V34 Colour Corrector Serum** | Temporary violet colour correction at the tooth surface; product-specific 60-person, single-use RCT shows temporary visual shade change, not permanent bleaching | `hismile-v34-colour-corrector-serum-intel.md` ✓ (re-audited Aug. 16, 2026) |
| **HiSmile V34 Whitening Strips** | Current 14-application V34 + PAP strip format; colour correction and PAP roles must be separated; product-specific strip efficacy and universal safety claims are not verified | `hismile-v34-whitening-strips-intel.md` ✓ (re-audited Aug. 16, 2026) |
| **HiSmile Viral V34 Duo** | Exact TikTok SKU `10060-VS_10018-CC`: serum + newer V34 strips, not the separate website serum + PAP+ strip duo; no unsupported synergy or sequence claim | `hismile-v34-duo-serum-strips-intel.md` ✓ (re-audited Aug. 16, 2026) |

**Key product insight — Herbalife association:** The loaded tea category originated from Herbalife nutrition clubs. The Loaded Tea Shop is not affiliated with Herbalife. This fact is NOT mentioned in any scripts — it wastes video time and introduces doubt for viewers who know about it. If it comes up in comments, handle it with a comment reply video.

**Key product insight — Cell renewal vs. volumizing:** Rebornic (Melaxin) activates the Vitamin D Receptor to drive skin cell differentiation, renewal, and fibroblast collagen production — it improves texture, firmness, and tone over time but does not replace lost volume. Volufiline (Medicube) physically stimulates subcutaneous fat cell growth for immediate plumping and volume. These are fundamentally different mechanisms targeting different problems. This distinction is the pharmacist-level insight that makes the Medicube vs. Melaxin comparison feel like expert advice rather than a sales pitch. **Note: Rebornic does NOT contain spicules and does NOT create micro-channels** — those claims were in the original intel doc in error and were corrected June 23, 2026 after INCIDecoder verification.

**Key product insight — Caffeine anhydrous vs. green tea caffeine:** Caffeine anhydrous is synthetic isolated caffeine with no natural modulation — it spikes fast and drops hard. Green tea caffeine naturally contains L-theanine alongside it, which smooths the stimulant effect. This is the core clinical story for all Loaded Tea scripts.

**Pronunciation note:** Volufiline = "vol-yoo-FY-leen" (4 syllables, emphasis on third). Say it matter-of-factly — the confidence is part of the authority signal.

---

## 8b. Original Product Categories

The creator's highest-priority product categories, ranked by competitive advantage (original ranking — see Section 8 for fully analyzed products):

1. **Hair loss** — Highest priority. Men 25-45 are highest-intent buyers. Almost no credentialed male creators. Minoxidil, DHT-blocking supplements, derma roller, ketoconazole shampoo.
2. **Men's skincare** — Underserved. Male authority drives higher purchase intent from male viewers.
3. **Supplements (energy/longevity)** — NAD+, creatine, magnesium glycinate, collagen, omega-3. Well-studied, strong clinical backing, high repeat purchase.
4. **Ear care** — Viral category on TikTok. Clinical authority is extremely high. Otoscope camera is currently viral with no credentialed male creator.
5. **Oral health** — One of the most viral pharmacy categories. Almost no pharmacists in it.
6. **Men's sexual health / testosterone** — High CPM, low competition from credentialed creators. Male authority is a requirement.
7. **Sleep & recovery** — Mouth tape is currently extremely viral with almost no credentialed creators.
8. **Pain relief** — Topical diclofenac (Voltaren), compression gear, foam roller.

---

## 9. Decisions Made and Why

**Herbalife context excluded from all Loaded Tea scripts** — decided May 19, 2026. The association wastes video time and introduces doubt. Every sentence must have a purpose. Comment reply video is the right format if it comes up in comments.

**Comparison hook with dual CTA (both products linked)** — when two legitimate products serve different use cases, both should be linked in the video. "Which one is right for you" framing is more credible than picking a single winner and captures two buyer types in one video. Established from the Loaded Tea vs. Bloom comparison.

**Ingredient-form hook added as inferred framework** — no confirmed high-performing reference video exists for this hook. Scripts using it include a delivery note explaining how it should sound. Inferred frameworks are lower confidence than hooks with verified reference videos.

**Faith's Loaded Tea vs. Bloom video assessed as missing the mark** — analyzed May 19, 2026. Key failures: only linked one product, spent 40+ seconds on the sucralose/prebiotic contradiction, no mechanism education, no on-screen study popups, rambling in the Loaded Tea section. What was kept: sucralose/prebiotic contradiction (compressed to 2 sentences), showing the drink being made on camera, caffeine context line, customizable dose angle.

**Celsius MetaPlus clinical data — honest assessment** — 6 university studies show real thermogenic effect, but it is almost certainly caffeine-driven. The proprietary blend hides exact doses. The studies were funded by Celsius. Loaded Tea wins on transparency and B-vitamin dosing. This is the pharmacist conclusion, not a dismissal of Celsius.

**Bloom ingredient corrections and clarifications — established May 21, 2026:**
- The prebiotic fiber in Bloom is **Sunfiber** (patented guar bean galactomannan), not generic galactomannan. Clinical differentiator: Sunfiber is specifically studied for digestive tolerance and is one of the only prebiotic fibers clinically shown NOT to cause bloating — a real differentiator worth naming on camera.
- The patented lychee extract in Bloom is **Oligonol** (confirmed by Stack3D launch coverage). It is a lychee + green tea polyphenol blend backed by 30 human clinical trials. Mechanism: increases nitric oxide → improves circulation → reduces fatigue. Key human RCT: Kang SW et al. (2012), *Journal of Clinical Biochemistry and Nutrition*, 50(2):106–113, DOI: 10.3164/jcbn.11-46 — 70 participants, 800mg OLFE for 30 days, significantly elevated submaximal running time (p=0.01), increased anaerobic threshold by 7.4%. Do NOT name Oligonol on camera — say 'patented lychee extract backed by 30 clinical trials.' The dose in Bloom is not disclosed — cite the mechanism and the research, not a specific outcome claim.
- **L-theanine correction for Loaded Tea scripts:** The Loaded Tea ingredient-form and trend-or-trash scripts use L-theanine as a benefit of green tea extract. This is a mechanistic argument about the source ingredient (green tea the plant naturally contains L-theanine), not a confirmed label claim. Green tea extract in supplements is processed — L-theanine retention varies by extraction method. Loaded Tea does not list L-theanine as a separate ingredient. The safer on-camera line is: 'Green tea extract — not synthetic caffeine. The natural form is inherently smoother because of the other compounds present in the plant.' Do not claim L-theanine is present in Loaded Tea unless the brand confirms it on the label.

**Medicube + Truly Beauty deodorant stack protocol — established May 23, 2026:** These two deodorants can and should be used together on alternating days. Truly Beauty (5% AHA) exfoliates the dead skin cells on the surface — removes existing darkening. Medicube (kojic acid) blocks melanin production at the enzyme level — prevents new pigmentation from forming. Together they attack both problems simultaneously. Protocol: Truly 2–3x per week (exfoliation days), Medicube every other day (prevention days). Critical rule: do NOT use both on the same day — AHA makes skin more permeable, layering actives same day increases irritation risk. Three scripts written for this angle: V1 cold audience ("There Is a Better Way"), V2 comment reply ("Can you use both?"), V3 mechanism hook ("Two Separate Problems" — strongest standalone). Both product links in all three scripts.

**Medicube vs. Truly Beauty deodorant — situational verdict established May 21, 2026:** These products target the same problem (dark underarms, bumps, uneven tone) through different mechanisms. Medicube uses kojic acid (tyrosinase inhibitor — blocks melanin production at the enzyme level) + ceramide NP + shea butter + Centella Asiatica (barrier repair). Truly Beauty uses 5% AHA (exfoliates surface darkening) + Vitamin C + Niacinamide. Key pharmacist insight: AHA on freshly shaved skin can cause stinging — Medicube has no AHA and is specifically designed for sensitive underarm skin. Verdict: Medicube for sensitive/post-shave skin; Truly for non-reactive skin wanting exfoliation. Both links provided in the video.

**No verbatim line bank for Rx Content** — decided because healthcare scripts need to sound like this creator specifically. The LLM writing from research context produces better, more authentic output than assembling from another pharmacist's lines.

**Hook-first constraint in generation prompt** — added after observing that the LLM would sometimes write preamble before the hook, burying the scroll-stopper. The constraint is enforced in the prompt, not post-generation.

**Problem section must name a mechanism failure** — added after observing generic filler lines like "most people expect instant results." The prompt now includes BAD/GOOD examples and a hard rule.

**Misdirection must correct an overclaim, not hedge** — the original Clone Mode rewrite was softening claims ("works for many people") instead of correcting overclaims to build credibility. Fixed with an explicit BAD/GOOD example in the prompt and a CONFIDENCE RULE that the rewrite must match the energy of the original.

**Clone Mode generates one rewrite, not five** — hook cycling was removed because it defeats the purpose of cloning a proven video. One rewrite, original framework preserved.

**`assembleScriptFromSections` is a utility, not the generation path** — the LLM's `fullScript` is used directly. The section fields (verbalHook, problem, etc.) are excerpt copies for the breakdown panel and inline editing only. This preserves the full 9-section structure while preventing hook burial.

**Post-generation structure check deferred** — requires validated real examples for all 14 hooks first. Sequentially dependent on Kalodata deep dive.

**TikTok Shop content strategy — proven angles first, open angles second — established May 23, 2026:** The correct content sequencing for any product is: (1) find what proven credentialed creators have already done successfully and replicate it with your own pharmacist voice and additions first, (2) iterate on those proven formats with your own spin, style, and insights, (3) test open angles that no credentialed creator has taken yet. Avoiding a hook because someone else already used it is the wrong instinct — TikTok Shop creators replicate proven videos constantly and each gets its own audience. The @rphreviews and @adoseofwellness (Riva) magnesium complex videos are the reference example: nearly identical scripts, both with millions of views, both remade 30+ times. Proven hooks on proven products are always the starting point. Open angles are the bonus. The competitor content audit in the Full Protocol exists to find BOTH — what to replicate first and what to test after.

**Ingredient disclosure rule — established May 26, 2026:** Only disclose an ingredient or caveat in a script if it helps the viewer make a better decision OR if withholding it would be misleading. The test is: does this information improve the viewer's outcome? If the answer is no, it does not belong in the script. Disclosing a non-safety, non-decision-relevant caveat creates doubt around a product you are recommending without giving the viewer anything useful in return — that is the opposite of what a mechanism video does. Example applied: CeraVe Invisible Mineral Sunscreen contains Ethylhexyl Methoxycrylene (a chemical photostabilizer, not a UV filter). It is not a safety concern. It does not change whether the product is right for the viewer. It was removed from the script angle recommendations. The only context where it becomes relevant is a direct viewer question from someone with a known chemical sunscreen allergy — handled in a comment reply, not in the original script.

**Retroactive intel doc verification audit completed — June 23, 2026:** All intel docs created before May 27, 2026 (before Rule 7 — full INCI verification from two sources — was added to PRODUCT_RESEARCH_PROTOCOL.md) were identified as potentially unverified. A full retroactive INCIDecoder/CosDNA verification pass was run on all 22 pre-Rule 7 docs. Result: 9 docs verified clean, 5 non-skincare docs confirmed as not applicable to INCI databases (supplements, beverages, oral care), 6 docs had errors corrected (JiYu NAD+ Cream, Medicube NAD+ EGF Firming Serum, Medicube Glass Glow Set, Medicube Mix & Match Toner Pad Set, Medicube Deodorant, SKIN1004 Hyalu-Cica Sun Serum). The Dr. Melaxin Multibalm was separately corrected after the spicule mechanism error was caught during script writing. As of June 23, 2026, the full intel doc library is verified. Any new intel doc must go through the current Full Protocol (Rule 7) before scripts are written from it.

**Non-skincare product verification — Rule 8 added to PRODUCT_RESEARCH_PROTOCOL.md — June 23, 2026:** INCIDecoder and CosDNA do not index supplements, beverages, oral care products, or gum. A category-specific verification table was added as Rule 8 in the protocol. Supplements and vitamins: verify from the FDA Supplement Facts panel on the brand website or Amazon. Energy drinks and beverages: verify from the Nutrition Facts + Supplement Facts panel. Oral care: verify from the Drug Facts panel (OTC) or brand website. Chewing gum with actives: verify from the Supplement Facts panel on the brand website. Deodorant/antiperspirant: verify from the Drug Facts panel or brand website. The rule is absolute: if the primary source panel cannot be found, no ingredient-specific claims go into the script until it is located. This applies to every product category without exception.

**Stack/Protocol as a content format — established May 23, 2026:** A new content format beyond comparison and single-product education. When two products target the same problem through different mechanisms, a protocol video (how to use both together) is often stronger than a second comparison video. The protocol format: explain the two separate problems the product category addresses → show which product solves each → give the alternating-day protocol → the reveal is that using both is more effective than either alone. This format drives dual purchases in one video and positions the creator as someone who knows how to use products, not just which ones to buy. Reference: Medicube + Truly Beauty deodorant stack scripts (May 2026).

**Embedded credential framing — confirmed pattern, promoted from SCRIPT_FEEDBACK_LOG.md — July 28, 2026:** The creator consistently embeds the pharmacist credential into a pivot line rather than stating it as a standalone authority section. *"I've been a pharmacist for over a decade and [specific claim/pivot]"* is the natural on-camera delivery. Standalone *"I'm a pharmacist."* followed by a separate claim feels less natural for this creator. The credential lands harder when it is the reason for the specific claim, not a separate statement. Confirmed in 3+ filmed scripts: Multibalm Scripts 1 and 2, HiSmile Video 6, HiSmile Video 7. **Rule for all future scripts:** Write the credential as an embedded pivot line, not a standalone authority statement. The credential should be the sentence that bridges the problem to the solution — *"I've been a pharmacist for over a decade and all of those problems are caused by the same thing."* This pattern is now the default. Standalone authority lines (*"I'm a pharmacist."*) are permitted only when the hook structure specifically requires a cold-open credential before the problem is named.

**"Could be" framing required for symptom-to-condition attribution — established July 2026 after TikTok violation:** Any script that attributes a symptom to a condition must use possibility framing, not diagnostic framing. *"You don't sleep at night? Could be high cortisol."* — not *"You don't sleep at night because you have high cortisol."* The word "could" is not optional. The same rule applies to magnesium deficiency attribution: *"Could be low magnesium"* — not *"You are low in magnesium."* Definitive symptom-to-diagnosis attribution is a TikTok policy violation. The creator received a violation for a cortisol script that used definitive framing. All cortisol, hormone, and nutrient deficiency scripts must use qualified language throughout.

**No anatomical keyword text overlays for cortisol/hormone content — established July 2026 after TikTok violation:** On-screen text overlays containing anatomical or clinical keyword terms (HPA Axis, Pituitary, Glucocorticoids, Adrenal Cortex, etc.) in cortisol and hormone-related content are a likely TikTok algorithm trigger for medical claim violations. Spoken explanation of the mechanism is permitted — the algorithm scans on-screen text, not audio. Rule: for any cortisol, hormone, or HPA axis content, do NOT use anatomical keyword text overlays. Use visual diagrams or generic arrows/labels instead of clinical keyword overlays. This rule applies to POST-PRODUCTION NOTES in all cortisol/hormone scripts.

---

## 9b. Finalized Scripts (Ready to Film)

All finalized scripts live in `/home/ubuntu/pharma-script-gen/scripts/`. Each includes spoken hook, 3 text hook options, visual hook note, caption, hashtags, and verified study citations where applicable.

| File | Status | Hook Type |
|---|---|---|
| `neuro-gum-instruction-correction.md` | Filmed ✓ | Instruction/Correction |
| `neuro-gum-comparison-hook.md` | Ready to film | Comparison Hook |
| `medicube-deodorant-symptom-reframe.md` | Ready to film | Symptom Checklist |
| `medicube-kojic-instruction-hook.md` | Ready to film | Instruction/Correction |
| `magnesium-cortisol-v2.md` | Ready to film | Symptom Checklist (Coach Ruben feedback applied) |
| `magnesium-cortisol-v3-stress-dysregulation.md` | Ready to film | Symptom Checklist + Stress Dysregulation bridge (iteration of v2) |
| `medicube-vs-melaxin-comparison.md` | Ready to film | Comparison Hook — 3 versions: Best-Of Hybrid (A), Faith exact remake (B), Creator 2 exact remake (C) |
| `loaded-tea-vs-bloom-comparison.md` | Ready to film | Comparison Hook — Dual-CTA, both products linked, Faith's video analyzed and assessed |
| `loaded-tea-trend-or-trash.md` | Ready to film | Trend or Trash — Loaded Tea Shop, green tea caffeine + L-theanine mechanism, full B-vitamin stack |
| `celsius-vs-loaded-tea-comparison.md` | Ready to film | Comparison Hook — Celsius vs. Loaded Tea, fair pharmacist breakdown, Loaded Tea wins on transparency and B-vitamin dosing |
| `loaded-tea-ingredient-form.md` | Ready to film | Ingredient Form Hook — green tea caffeine vs. synthetic caffeine anhydrous, L-theanine mechanism, full B-vitamin stack. Inferred framework (no reference video — delivery notes included in script) |
| `medicube-vs-truly-deodorant-comparison.md` | Ready to film | Comparison Hook — Medicube vs. Truly Beauty Soft Serve Serum Deodorant. Situational verdict: Medicube wins for sensitive/post-shave skin; Truly wins for non-reactive skin wanting exfoliation. Both links provided. |
| `medicube-truly-stack-protocol.md` | Ready to film | Stack/Protocol — 3 versions: V1 "There Is a Better Way" (cold audience), V2 "Comment Reply" (follow-up to comparison), V3 "Two Separate Problems" (mechanism hook, strongest standalone). Both products linked. |
| `dr-melaxin-multibalm-campaign.md` | Script 1 Filmed ✓ (June 23, 2026) — Scripts 2–4 Ready to film | 4-script campaign: (1) Myth-Busting TOF — negative hook "Don't believe everything you hear about Korean skincare," fat-finger viral callout, VDR mechanism; (2) Suppressed-Knowledge MOF — "They lied to you about collagen," molecule size problem, Rebornic own-collagen-production angle; (3) Comparison MOF — Dr. Melaxin (cell renewal) vs. Medicube (fat cell volume), two different mechanisms; (4) Right-Way BOF — transformation-driven, pain point open, collagen molecule problem reveal, Rebornic solution, 4–8 week timeline framing. |

Original magnesium transcript (pre-coaching) saved as `magnesium-cortisol-original.md` for reference.

**Script doc standard:** When a script is built from reference videos, the source video links must be included in the script doc under a "Reference Videos Analyzed" table. This was established May 14, 2026.

---

## 9b-2. Product Research Protocol

Every new product introduced to this project — whether via a TikTok Shop link, brand website, or conversation — must go through one of two research tiers before any script is written. The full protocol is documented at `/home/ubuntu/pharma-script-gen/PRODUCT_RESEARCH_PROTOCOL.md`. Individual product intelligence docs live at `/home/ubuntu/pharma-script-gen/product-intel/[product-name]-intel.md`.

**When to use each tier:**

| Situation | Protocol |
|---|---|
| Evaluating a product before deciding to promote it | **Light** |
| Product is a secondary mention in a comparison (not the hero) | **Light** |
| Product committed to for promotion — affiliate link secured or product in hand | **Full** |
| Second or third script for a product already researched | Reference existing intel doc — no new research |
| Product sent as a link with no context | **Light** first — upgrade to Full if you commit |

**Light Protocol (10–15 min):** Verify full ingredient list, flag any patented/branded ingredients (™/® symbols), read brand's primary claims, scan TikTok Shop and Amazon reviews for top pain points and objections, note star rating and sales volume. Output: short notes block at top of script file.

**Full Protocol (30–60 min):** Full INCI verification from two sources, deep dive on every patented ingredient (identify the supplier, find clinical trials on PubMed, record best study for on-screen popup, note dose caveat), mechanism research on all actives with supporting studies, brand marketing analysis, review mining across TikTok Shop + Amazon + brand site (top reasons to buy, top complaints, top pre-purchase objections, who is buying), competitive context, and a content angle inventory. Output: standalone product intelligence doc saved permanently.

**Script-writing reference:** `PRODUCT_RESEARCH_PROTOCOL.md` is not just a research guide — it also contains script-writing guidance. Before writing any script, the tiered ingredient naming rule (Tier 1 = brand-promoted verbally, Tier 2 = patented/clinical verbally, Tier 3 = overlays only) and the proven-first content strategy (replicate proven hooks first, iterate second, test open angles third) should be applied. Both are documented in the Script-Writing Guidance section of that file.

**The Oligonol rule:** Any ingredient with a ™ or ® symbol must be researched in the Full Protocol. Patented ingredients almost always have clinical data behind them — this is where the highest-value pharmacist insights come from. The Oligonol discovery (Bloom, May 2026) is the reference example: a generic "patented lychee extract" label claim became "backed by 30 clinical trials, increases nitric oxide, improves circulation and reduces fatigue" with a specific RCT for on-screen popup. That level of specificity is only possible with the Full Protocol.

---

## 9c. Script Quality Standards — Non-Negotiable Rules

Established May 16, 2026 after fabricated ingredients were written into a script that was filmed before the error was caught. These rules apply to every script without exception.

**1. Ingredient Verification — No Exceptions**
Before writing any script that mentions specific product ingredients, the full ingredient list must be verified against a primary source: INCIDecoder, the brand's official product page, or a major retailer listing (Amazon, Ulta, etc.). Never rely on memory, transcription summaries, or what "similar products typically contain." Every ingredient named in a script must be traceable to a confirmed source. The script doc must include a "Verified Ingredients" section with the source URL.

**2. Verbatim Remakes Must Be Verbatim**
When a script is labeled as an exact remake of a creator's video, it must be a true word-for-word adaptation. No condensing, no dropping ingredients, no paraphrasing mechanisms. The only permitted changes are: swapping the creator's credential for the pharmacist credential, and adjusting "I" statements to match the creator's voice. If a creator names a specific ingredient, mechanism, plant source, or patented complex — it stays in. If it was in their video, it was there for a reason.

**3. No Generic Filling**
Every script must be built from: (a) the specific product's verified ingredients, (b) content we have actually studied and analyzed together, and (c) proven frameworks and hooks from this project. Generic skincare claims, placeholder mechanisms, or "typical product" language that is not specific to the actual product being scripted are not acceptable.

**4. Full Effort on Every Script**
Every video matters, especially early on when the channel is building. Each script should reflect the full body of knowledge accumulated in this project — the creator analysis, the hook frameworks, the coaching feedback, the study verification standard, the TOF rules, the CTA rules. No shortcuts. If a script takes longer to write correctly, that is the right tradeoff.

**5. When in Doubt, Verify Before Writing**
If there is any uncertainty about an ingredient, a mechanism, a study claim, or a creator's exact words — stop and verify before writing it into the script. Guessing and correcting after filming is not an acceptable workflow.

**6. Every Specific Number Must Have a Source in the Intel Doc**
Any specific number used in a script — a duration ("8–10 minutes"), a dose ("40mg"), a percentage ("50% drop by age 40"), a citation count ("515 citations"), a unit sold figure ("15,000 sold") — must be traceable to a source already documented in the product's intel doc or one of the three runtime docs (HOOK_FRAMEWORKS.md, SCRIPT_ARCHITECTURE_GUIDE.md, BUYER_PSYCHOLOGY_LEVERS.md). If the number is not in any of those sources, it does not go in the script. Plausible-sounding numbers extrapolated from general principles are fabrication, not estimation. This rule was added June 1, 2026 after a specific chewing duration ("8–10 minutes") was written into a Neuro Gum instruction-correction script and presented as fact — the number had no source and was not in the intel doc.

**8. Apply the Bait and Switch Trust Architecture to New Scripts**
Established June 1, 2026. The Bait and Switch Trust Architecture (confirmed in Dr. Faith's $279K top video) is the highest-trust-building technique in the 5-creator dataset and is not yet present in any existing script. For any new script written from this point forward, consider applying this structure: introduce the product early in the video, then immediately back off to brand-agnostic education ("I'll help you regardless of which brand you bought"), deliver the mechanism explanation as if the viewer already has any product in the category, then return to your specific product for the close. This technique is documented in full in `SCRIPT_ARCHITECTURE_GUIDE.md` under "The Bait and Switch Trust Architecture." It is classified as a high-ceiling execution note (1/5 creators — Dr. Faith) — not a universal rule — but the GMV evidence ($279K single video) makes it the first optional technique to adopt.

**9. Pain Points and Audience Callout — Fit to Framework, Not Mandatory — Established June 23, 2026**
Not every script requires a dedicated pain point section or a full transformation arc. Analysis of hundreds of top-performing healthcare creator videos confirms that many high-converting scripts lead with mechanism education, comparison, or authority — not pain. The rule is not that pain points are always required; the rule is that they should be fit in where the proven framework supports them. Calling out a specific audience or problem — even in a single sentence — helps the viewer self-identify and increases relevance. In symptom-checklist and right-way hooks, pain points belong up front. In comparison and suppressed-knowledge hooks, a brief audience callout or pain reference can be woven into the education section without a dedicated block. The test: does naming this pain point help the right viewer recognize themselves? If yes, include it. If the framework does not support it naturally, do not force it. Transformation arcs follow the same logic — they are a powerful tool when the script structure supports them (particularly in BOF scripts), but they are not a required section in every script.

**10. Negative Hook Pattern — Validated Option, Not a Mandate — Established June 23, 2026**
Negative hooks are a validated and high-performing pattern for this creator's content — but not every script needs to be a negative hook. The correct approach: test at least one negative hook per product, but do not default to it for every video in a campaign. The structure when used: (1) broad negative claim that triggers pattern interrupt — "Don't believe everything you hear about Korean skincare" / "They lied to you about collagen"; (2) specific example of the myth or problem — names the exact viral content, the exact wrong behavior, the exact pain the viewer has; (3) credential pivot — the pharmacist authority establishes why the truth is coming from a credible source. The negative hook works because the viewer's brain is primed for bad news — they stay to hear it — and the "bad" turns out to be either not bad at all or reframed as something good. The emotional whiplash between expectation and reality drives watch time, comments, and saves. The callback rule: when a negative hook is used, the script must call back to it explicitly in the body — "this is exactly what I meant" or "but here's the problem" — to close the loop the hook opened. A negative hook without a callback feels unstructured. Negative hooks are one strong option in the toolkit alongside the proven Tier 1 and Tier 2 frameworks — not a replacement for them.

**11. Viewer-Intelligible Language Standard — Established June 23, 2026**
Every spoken line in a script must be immediately understood by a general TikTok viewer with no clinical background. Clinical testing terminology, cosmetic industry jargon, and regulatory language must be translated into plain benefit language before they appear in any spoken line. The reference example that established this rule: "zero skin stimuli index confirmed" is a cosmetic safety testing term that means zero irritation was recorded across all test subjects — but no viewer knows what a stimuli index is. The correct spoken version is: "dermatologist-tested, confirmed safe for sensitive skin." The principle applies broadly: whenever a phrase sounds like a product label disclaimer, a clinical trial methodology note, or an industry compliance term, stop and ask whether a viewer watching a 90-second TikTok video would understand it. If the answer is no, translate it to the benefit it represents. The authority signal comes from knowing the science — not from using the science's vocabulary. Jargon that the viewer cannot decode does not build credibility; it creates distance.

**7. Study Citations in Manually Written Scripts Must Include a Clickable PubMed Link**
Whenever a script written in conversation (outside the tool) calls for a study screenshot or on-screen citation pop-up, the citation must include a full clickable Markdown hyperlink to the PubMed or PMC page — not just the author name, journal, and year. Format:
> `VISUAL: PubMed screenshot — [Author et al. YEAR, Journal Name](https://pubmed.ncbi.nlm.nih.gov/PMID/)`
If the PMID is not known with certainty, navigate to PubMed and verify it before writing the link. A fabricated PMID will not resolve and will waste filming time. This rule was added June 1, 2026 after the creator noted that copy-pasting citation text and manually searching PubMed was an unnecessary friction step when a direct link could be included in the script doc itself.

---

## 9d. AI Working Rules — Non-Negotiable Process Rules

Established June 3, 2026 after repeated instances of the AI writing permanent documents from memory and interpretation rather than from verified source documents, resulting in errors that required rework. These rules govern AI behavior on this project — they are not script quality rules, they are process discipline rules.

**Rule A. Source Check Before Writing Any Permanent Document**
Every factual claim written into a permanent document — `VISUAL_OVERLAY_PLAYBOOK.md`, `MASTER_CONTEXT.md`, any analysis doc, any intel doc, any reference doc — must be traceable to a specific line in a specific source document before it is written. The required internal check before writing any claim is: *"What specific line in what specific document is this sourced from?"* If that question cannot be answered, the claim does not go in the document. This applies to overlay techniques, creator behavior patterns, study findings, timing data, and any other factual assertion. Interpretation, inference, and memory are not sources. This rule is the document-level equivalent of Rule 6 (specific numbers in scripts must have a source in the intel doc).

**Rule B. What Do We Already Have? — Before Any New Analysis or Document Creation**
Before starting any new analysis, building any new document, or re-analyzing any existing data, the required first step is to check what already exists. The internal question is: *"What existing documents already contain this information?"* If the information already exists in a deep analysis doc, an intel doc, a reference doc, or a compiled summary, no new analysis is needed. New analysis is only justified when the existing documents genuinely do not contain the required information. The overlay playbook rebuild error (June 3, 2026) was caused by skipping this check — the five deep analysis documents already contained all overlay data needed; no further video analysis was required.

**Rule C. Pre-Task Document Checklist**
Before starting any multi-step task that involves reading documents and then producing output, list every document that will be read and state specifically what constraint or information is expected from each one. Do not begin the task until this checklist is stated. This forces active engagement with each document as a constraint rather than passive reading. Example format:
- `MASTER_CONTEXT.md` — reading for: update rules in Section 12, existing state in Section 9c, what belongs vs. does not belong
- `analysis/rphreviews_deep_analysis.md` — reading for: verified overlay timing data, specific line numbers for any claims written into the playbook

**Rule D. Document Update Rules Must Be Read and Quoted Before Updating Any Document**
Before adding any content to `MASTER_CONTEXT.md`, read Section 12 (document structure decisions) and quote the relevant rule back before writing. Before adding any content to any other permanent document that has documented rules about what belongs in it, read and quote those rules first. The master context update error (June 3, 2026) occurred because Section 12 was in context when the violation was written — the rule was read but not applied as a constraint. Quoting the rule before writing is the enforcement mechanism.

**Rule E. No Sentence Redundancy in Scripts**
Established June 22, 2026 after Script 21 (Dr. Melaxin Toner Pad — Glycolic Acid Warning) filmed at 1:45 — longer than intended because multiple sentences restated points already made. Every sentence in a script must either introduce new information or advance the argument. Restating a point already made — even in different words — is dead weight and must be cut at the writing stage, not left for the creator to figure out on set. The test to apply to every line before delivery: *"Does this sentence add something the previous sentence did not already say?"* If no, cut it. This is not a rule about script length — it is a rule about sentence-level discipline. A script can be long if every sentence earns its place. Example of the violation: saying "you must follow it with SPF / not a moisturizer with SPF / an actual dedicated SPF / at least SPF 30" is four sentences saying the same thing. The correct version: "You must follow it with a dedicated SPF — not just a moisturizer that has SPF in it. Mineral or chemical, at least SPF 30." Same information, no redundancy.

**Second example (Dr. Melaxin Multibalm Script 1 — June 22, 2026):** "Instant volume," "overnight volume," "disappointed," and "disappointed" repeated across two consecutive sentences in the GAP section. The correct version collapses both paragraphs into one: "But here's the problem — I see people setting timers and claiming instant results. The ingredient is real. The timeline is not. Collagen stimulation takes four to eight weeks. Manage that expectation and this product holds up."

**MANDATORY PRE-DELIVERY ENFORCEMENT — added June 22, 2026:** Rule E is a required final pass before any script is delivered — not a drafting guideline. Before marking any script complete, read every GAP, EDUCATION, and BRAND CLOSE section line by line and apply the test sentence by sentence. The violation is most common in the GAP section (timeline/expectation management over-explained) and the EDUCATION section (mechanism explanations that repeat). This check must happen even when the script feels complete and polished. Verbal commitments to apply Rule E made during a conversation do not survive context compression — the enforcement instruction must live in this document and in SCRIPT_ARCHITECTURE_GUIDE.md to be active in future sessions.

**Rule F. Pain-First Mechanism Explanation — Established June 30, 2026**
When explaining a complex ingredient or scientific mechanism, always lead with the viewer’s lived experience of the problem before introducing the science. The mechanism must arrive as the answer to a question the viewer is already asking — not as a lecture they have to sit through. Viewers do not scroll because the content is too scientific. They scroll because they do not yet care about the science being explained. Caring comes from recognizing their own problem first.

**The sequence that fails:** Ingredient name → mechanism name → what the mechanism does → who it helps. This puts the science before the pain.

**The sequence that works:** Curiosity gap ("has something most products don’t") → viewer’s lived experience of the problem → mechanism as the answer → familiar analogy to anchor the science → benefit framed as "also does X" (bonus, not replacement).

**The test:** Before every mechanism explanation, ask: *"Does the viewer have a reason to care about this science before I explain it?"* If no, add one sentence naming their lived experience of the problem first.

**Example — the violation (SCRIPT_19 original COX section):**
> *"SKIN1004 is chemical sunscreen with Centella Asiatica. Centella contains natural COX inhibitors. COX is the same enzyme ibuprofen blocks. When the sun hits reactive skin, it triggers an inflammatory cascade. Centella interrupts that inflammation at the enzyme level."*

The ibuprofen bridge is correct but arrives after the clinical term — the rescue comes after the friction.

**Corrected version (SCRIPT_19 revised):**
> *"SKIN1004 is chemical, but it has something most sunscreens don’t — Centella Asiatica at 9,800 ppm. If your skin gets red or inflamed after sun exposure, that reaction is being driven by an enzyme called COX. It’s the same enzyme ibuprofen targets. Centella blocks it naturally — so instead of just blocking UV, this sunscreen is also stopping the inflammatory response that UV triggers in reactive skin."*

**Secondary rule — “Also” framing for bonus benefits in comparison scripts:** When one product has a benefit the other does not, frame it as “also does X” rather than “is better because of X.” This keeps the comparison credible and non-salesy. The viewer trusts a pharmacist who presents both products honestly.

**Where this rule applies most:** Any EDUCATION section explaining an active ingredient the average viewer has not heard of. Any Centella, Rebornic, adenosine, COQ10, or similar mechanism explanation. Any comparison script where one product has a secondary benefit to explain. Any script where the ingredient name is scientific and requires a familiar analogy.

**MANDATORY PRE-DELIVERY ENFORCEMENT:** Before delivering any script that includes a mechanism explanation, apply the pain-first test to every such section. If the mechanism is introduced before the viewer’s lived experience of the problem it solves, reorder the section before delivery. Full rule definition with examples lives in `SCRIPT_ARCHITECTURE_GUIDE.md` Rule F.

---

## 9e. Recommended Prompts — For Use When Invoking the Above Rules

These prompts are stored here so they can be recalled and used when needed. They are designed to invoke specific AI working rules from Section 9d.

**Prompt 1 — Pre-Task Checklist (invoke Rule C)**
> *"Before you begin, list every document you are about to read and what specific constraint or information you expect to get from each one. Confirm you will not proceed until you have read them and can state what each one told you."*

**Prompt 2 — What Do We Already Have? (invoke Rule B)**
> *"Before building this, what existing documents already contain this information? List them and quote the relevant sections. Only proceed with new analysis if those documents genuinely do not contain what is needed."*

**Prompt 3 — Source Check for Permanent Documents (invoke Rule A)**
> *"Before writing anything into this document, state the specific line and specific source document for each factual claim you are about to add. If you cannot source a claim, do not write it."*

**Prompt 4 — Document Rule Confirmation (invoke Rule D)**
> *"[Document name] has documented rules about what belongs in it. Read those rules, quote them back to me, and confirm you will follow them before you write anything."*

**Prompt 5 — Full Constraint Confirmation (invoke all four rules at once)**
> *"Before starting: (1) list every document you will read and what you expect from each, (2) confirm what already exists that covers this topic, (3) quote the update rules for any permanent document you will be writing to, (4) confirm that every claim you write will be sourced to a specific line in a specific document."*

---

## 10. Kalodata Roadmap — Planned Upgrades

Everything planned once Kalodata access is obtained. See `/home/ubuntu/kalodata-roadmap.pdf` for the original roadmap document.

**IMPORTANT — Revised plan documented May 31, 2026:** The sequencing and methodology were significantly revised after Kalodata access was confirmed. The revised plan supersedes the original roadmap. See `/home/ubuntu/pharma-script-gen/KALODATA_ANALYSIS_PLAN.md` for the current authoritative plan. Key revision: Phase 1 (framework rebuild) is manual work done with the AI first — the batch analyzer tool (Phase 2) is for ongoing expansion after the foundation is built, not for building the foundation itself. The original frameworks doc is treated as a first draft with known methodological flaws, not a validated baseline.

**Step 1 — Healthcare Creator Deep Dive (Re-Analysis)**  
Re-run full script analysis on Drew, Riva, Faith's Rx content, and rphreviews — filtered by top GMV videos from Kalodata, not by views/saves. Extract: verified section sequences for all 14 hooks, verbatim opening lines (not for line bank — for framework validation), new hook patterns, and confirmed real examples for currently unanchored hooks (Age-Trigger, Forbidden-Knowledge, Dosing-Protocol).

**Step 2 — Video Lab Batch Analyzer**  
Build batch URL input in Video Lab. Paste 50-100 URLs from Kalodata export. Tool transcribes and classifies each against the 14 frameworks. Surfaces: which frameworks appear most in high-converting videos, unclassified patterns (candidates for new hooks). Technical spec: 1-2 second delay between requests (rate limiting), graceful handling of private/deleted videos, skip videos over file size limit.

**Step 3 — Hook Framework Performance Scoring**  
Once enough data points exist: score each framework by average GMV per video in the niche. Surface as a recommendation when selecting a hook for a product.

**Step 4 — Product Category Gap Analysis**  
Cross-reference products tracked creators are converting on against products currently being promoted. Identify untapped opportunities before they saturate.

**Step 5 — JSON Schema + Post-Generation Structure Check**  
Replace generic section structure with exact, hook-specific JSON schemas for each of the 14 frameworks. Post-generation validator flags structural violations (buried hook, generic problem section, CTA appearing before mechanism). Dependent on Step 1 being complete.

**Step 6 — Personal Performance Feedback Loop**  
Log posted videos against hook framework, product, and GMV outcome. Build personal performance dataset over time. Creator's own conversion data may differ from tracked creators due to specific audience and credential positioning.

**Sequencing:** Steps 1 and 2 run in parallel. Steps 3 and 4 follow from that data. Step 5 is dependent on Step 1. Step 6 starts immediately once posting begins.

---

## 11. What Is NOT Built Yet (Future Roadmap)

- **Script Advisor (floating chat panel)** — discussed but not built. Would be a chat interface with full system context injected. Best for bounded questions: compliance checks, section critique, hook selection. Not a replacement for strategic analysis in a full session.
- **Kalodata integration** — all of Section 10 above.
- **Video Lab batch analyzer** — see Step 2 above.
- **Per-video performance logging** — see Step 6 above.

---

## 12. How to Use This Document

At the start of any new session working on this project, paste or reference this document to restore full context. The agent reading this document should treat it as the authoritative record of decisions made and should not re-debate closed questions without new information.

When something important changes — a new decision is made, a new creator is analyzed, a new framework is added, a roadmap item is completed — this document should be updated to reflect it.

The document lives at `/home/ubuntu/master-context-document.md` and `/home/ubuntu/master-context-document.pdf`.

**Update protocol:** This document is updated at the end of every session. The filter for what belongs here: decisions made and the reasoning behind them, universal rules that apply to all future scripts, new creators analyzed and key learnings, new product categories, finalized scripts list, roadmap changes, and coaching feedback that produced framework-level rules. Individual script drafts, raw transcripts, video analysis notes, and tool code changes do NOT belong here — they live in their dedicated files.

**What does NOT belong here:** Full script text (lives in `/scripts/`), raw video transcripts, coaching session notes for a single video, tool bug fixes, code changes, video-specific edit decisions (e.g., "cut this section because this particular video ran long"). If it is specific to one video or one session, it belongs in a dedicated file — not here. Video-specific notes belong in the `## PRODUCTION NOTES` section at the bottom of the relevant script file.

**Transient vs. permanent rule (established June 1, 2026):** If a note will become obsolete once a specific action is completed, it does NOT belong in this document. It belongs in the source document for that action. Examples: "film these scripts as-is" belongs in `CONTENT_PIPELINE.md` or the script file itself; "start with Series 2" belongs in `SERIES_CONTENT_STRATEGY.md`; "apply for Micro Ingredients affiliate first" belongs in `PRODUCT_ACQUISITION_RECOMMENDATIONS.md`. This document is for permanent rules and decisions that apply indefinitely — not to-do lists or one-time reminders. To-do lists live in `CONTENT_PIPELINE.md`. Operational notes live in the doc they govern.

**Script feedback and video metrics:** Individual filming notes and on-camera feedback go in `SCRIPT_FEEDBACK_LOG.md`. Posted video metrics (views, saves, GMV, watch time) go in `VIDEO_PERFORMANCE_LOG.md`. When feedback reveals a pattern that applies to all future scripts, it gets promoted from those files into Section 9 of this document as a named decision with reasoning. The log files are the intake; this document is the distillation.

**Document structure decisions — established May 23, 2026:**

- **Studies table removed.** A full study citation table does not belong in the master context. Verified studies live in individual product intel docs at `/product-intel/`. The master context only carries the rule: verify every study on PubMed before citing. Reason: studies are only relevant at script-writing time, at which point the intel doc is the right reference. Maintaining a study table here would cause the document to grow without adding orienting value.

- **Products table kept** (trimmed to one-sentence summaries with intel doc pointers). Knowing which products have been researched and what their core story is helps orient a new session immediately. The table stays lean — one row per product, core angle in plain language, intel doc filename. Full ingredient profiles, mechanisms, and studies live in the intel docs.

- **Scripts table kept.** Knowing which scripts exist, their hook type, and their status is essential session-orienting information. The table stays lean — one row per script, file name, status, one-line hook description.

- **Decisions section is the most important section.** It captures the reasoning behind how this project works. It should never be offloaded or archived prematurely. If the document grows too long in the future, trim products and studies first — never the decisions. Only offload decisions that have been stable for 6+ months AND are no longer actively needed to prevent a future session from going in the wrong direction.

---

## 13. May 31, 2026 — Kalodata Deep Analysis Session Decisions

This section records all decisions made during the May 31 deep analysis planning session. These decisions are not yet reflected in the tool or the reference docs — they are the output of the analysis work currently in progress.

### 13a. New Reference Document Architecture (3 Docs)

The Kalodata deep analysis will produce three new permanent reference documents in addition to rebuilding HOOK_FRAMEWORKS.md. These documents are consulted at specific points in the script-writing workflow — they are not for the creator to read, they are for AI to reference when helping write scripts or build other docs.

| Document | Job | When Consulted |
|---|---|---|
| **HOOK_FRAMEWORKS.md** (rebuilt) | Hook selection + psychological execution notes per framework | When choosing and opening the hook |
| **SCRIPT_ARCHITECTURE_GUIDE.md** (new) | Mid-video structure, loop mechanics, rehook placement, transition mechanics, CTA patterns, TOF/MOF/BOF execution notes | While writing and during post-generation structure check |
| **BUYER_PSYCHOLOGY_LEVERS.md** (new) | Cialdini persuasion levers + Whitman desire channels + product positioning framework | Before writing (desire channel selection) AND after writing (lever verification) |

**Intel doc template update (not a new doc):** Every product intel doc will gain a new "Content Campaign Plan" section covering the recommended TOF/MOF/BOF video sequence for that product, including how many videos of each type to make and in what order. This is a planning tool, not a script-writing reference.

**SCRIPT_ARCHITECTURE_GUIDE.md feeds the web app:** Once written, this guide will be encoded into the script generator — either as updated JSON schemas or as system prompt instructions. It is also the rubric for the post-generation structure check (Kalodata roadmap Step 5), which was previously deferred pending this analysis.

### 13b. Deep Analysis Scope — $20K GMV Threshold

The deep analysis applies a $20,000 GMV threshold across all creators. Videos above $20K receive full 13-dimension analysis. Videos below $20K receive classification-only treatment (hook type, section sequence, brief notes).

| Creator | Deep Analysis Videos | GMV Coverage | Classification Only |
|---|---|---|---|
| @rphreviews | 23 | 90.3% of total | 7 videos |
| @adoseofwellness (Riva) | 23 | 92.2% of total | 7 videos |
| @drew.review (Account 1) | 12 | 93.4% of total | 3 videos |
| @drew.review1 (Account 2) | 10 | 89.3% of total | 5 videos |
| @faithfuldoc (Dr. Faith) | 10 | 84.7% of total | 15 videos |
| @naturopathicapothecary1 | 9 | 83.9% of total | 11 videos |
| **Total** | **87 videos** | | |

**Two product concentration flags noted before analysis begins:**
- Dr. Faith's top 10 videos are heavily concentrated in Brooke's NMN Bundle (4 videos) and Medicube PDRN (2 videos). Her top 3 are all the same product at $279K, $155K, and $99K. Analysis will check whether these are the same hook/structure or meaningfully different.
- naturopathicapothecary1's top video is $216K on astaxanthin. Astaxanthin appears in 4 of her 9 deep-analysis videos. Same concentration flag applies.

### 13c. 13-Dimension Analysis Framework

Each deep-analysis video is evaluated across 13 dimensions:

1. **Hook classification** — which of the 14 frameworks (or unclassified)
2. **Verbatim opening line** — exact first 1–3 seconds of spoken audio
3. **Curiosity loop mechanics** — where loops open, what question they pose, when they close
4. **Rehook placement** — where mid-video retention hooks appear and what type they are
5. **Section sequence and word budget** — exact order of sections with approximate word counts
6. **Product reveal timing** — exact moment the product name/visual first appears
7. **Transition mechanics** — how the creator bridges education → product reveal → CTA
8. **Objection handling** — whether it appears, when, how it is framed
9. **CTA mechanics** — type (urgency/benefit/social proof), timing, exact framing
10. **Buyer psychology levers** — which Cialdini levers are pulled and where
11. **Desire channel** — which primary desire the video activates (Whitman/Schwartz framework)
12. **TOF/MOF/BOF classification** — funnel stage of the video
13. **Unexpected patterns** — anything not in the above dimensions that appears consistently across high-converting videos

### 13d. Buyer Psychology Reference Books

The following books form the theoretical foundation for the buyer psychology lens applied in the analysis. These are the canonical texts in direct response and conversion psychology:

| Book | Author | Primary Contribution to This Analysis |
|---|---|---|
| *Influence: The Psychology of Persuasion* | Robert Cialdini | 6 core persuasion levers: reciprocity, commitment/consistency, social proof, authority, liking, scarcity |
| *Pre-Suasion* | Robert Cialdini | Priming attention before the ask — directly relevant to hook mechanics |
| *Breakthrough Advertising* | Eugene Schwartz | Awareness levels (origin of TOF/MOF/BOF), mass desire, message-to-market match |
| *Cashvertising* | Drew Eric Whitman | 8 Life-Force desires + 9 secondary desires that drive all buying decisions |
| *Building a StoryBrand* | Donald Miller | Customer as hero, product as tool — relevant to how top creators frame themselves as guides |
| *The Adweek Copywriting Handbook* | Joseph Sugarman | Slippery slide — every sentence earns the next; directly maps to watch-time retention mechanics |
| *Ogilvy on Advertising* | David Ogilvy | Long-copy discipline, specificity over cleverness, headlines as the primary conversion lever |

### 13e. Discovery Mandate

The analysis is open-ended, not just confirmatory. Any pattern that appears consistently across high-converting videos that was not anticipated — unexpected structural choices, recurring phrases, timing patterns, audience framing techniques — gets flagged, documented, and added to the relevant reference doc. The 13 dimensions are the planned search space; the discovery mandate covers everything outside it.

### 13f. Post-Analysis Implementation Path

The analysis produces findings. The findings feed the 3 reference docs. The reference docs feed the tool. The specific implementation path:

1. Analysis complete → findings synthesized across all 87 videos
2. HOOK_FRAMEWORKS.md rebuilt (psychological execution notes added to each framework)
3. SCRIPT_ARCHITECTURE_GUIDE.md written from cross-creator findings
4. BUYER_PSYCHOLOGY_LEVERS.md written from cross-creator findings
5. Intel doc template updated with Content Campaign Plan section
6. SCRIPT_ARCHITECTURE_GUIDE.md encoded into script generator (JSON schemas or system prompt update)
7. Post-generation structure check built using SCRIPT_ARCHITECTURE_GUIDE.md as rubric
8. Steps 6 and 7 = Kalodata roadmap Step 5 (previously deferred)

### 13g. Kalodata Analysis Plan Document

The full methodology, safeguards, and execution plan for the Kalodata deep analysis are documented in `/home/ubuntu/pharma-script-gen/KALODATA_ANALYSIS_PLAN.md`. That document is the authoritative reference for the analysis work. This section is a summary of the key decisions for master context purposes only.

### 13h. Non-Negotiable Rule — Deep Analysis Requires Full Video, Not Transcript Only

**Established May 31, 2026. Applies to all deep-analysis videos and all future creator onboarding.**

Audio transcripts alone are insufficient for a 13-dimension deep analysis. The transcript captures spoken audio but misses elements that are doing real conversion work: the visual hook (what is on screen in the first 0–3 seconds), on-screen text overlays throughout the video, the text hook (often the first thing a viewer reads — frequently different from the spoken hook), study and data popups during the mechanism section, product reveal visuals vs. verbal reveal timing, rehook visuals, CTA overlays, and pacing/delivery cues.

**Required workflow for all deep-analysis videos:**
1. Download the video using `yt-dlp` to a local mp4 file
2. Run `manus-analyze-video [local_file_path] [analysis_prompt]` — the TikTok URL directly is not supported by this tool
3. The analysis prompt must explicitly request all visual elements: visual hook, on-screen text overlays at every timestamp, text hook, study popups, product reveal visual vs. verbal timing, CTA overlays, pacing cues
4. Full video analysis output is the primary input for the 13-dimension report — audio transcript is supplementary reference only

**For classification-only videos (below $20K GMV threshold):** Audio transcript is sufficient. These only receive dimensions 1, 2, 5, 6, and 9 — all extractable from spoken audio.

**This rule applies to all future creator onboarding as well.** Any creator deep dive — whether part of the initial 6-creator analysis or a future creator added to the system — must use full video analysis for all videos above the GMV threshold.

---

## 14. June 1, 2026 — Hook Library Overhaul & Option B Implementation

### 14a. Hook Library State After Overhaul

The hook library was significantly expanded and restructured during the May 31–June 1 session. The final state:

| Category | Count | Location |
|---|---|---|
| Healthcare hooks — Tier 1 | 11 | `HOOK_FRAMEWORKS.md` (hooks 1–11), `scriptData.ts` |
| Healthcare hooks — Tier 2 | 13 | `HOOK_FRAMEWORKS.md` (hooks 12–24), `scriptData.ts` |
| BOF hooks | 4 | `HOOK_FRAMEWORKS.md` (hooks 25–28), `bof.ts` |
| **Total** | **28** | |

**Fountain-of-youth hook removed** from all locations (scriptData.ts, tiktok.ts, videolab.ts, HOOK_FRAMEWORKS.md). Reason: unverified, overlapped with age-reversal, no confirmed reference video.

**8 new healthcare hooks added** (wired into tiktok.ts, scriptData.ts, videolab.ts, HOOK_FRAMEWORKS.md):
- `expert-verdict` — Tier 1 (strong cross-creator signal)
- `audience-pivot` — Tier 1 (strong cross-creator signal)
- `right-way` — Tier 2
- `fear-external-threat` — Tier 2
- `viral-metaphor` — Tier 2
- `side-effect-surprise` — Tier 2
- `comment-reply-qanda` — Tier 2

**Note on versus-battle:** This is a Variant B inside the `comparison` hook, NOT a standalone hook. It is wired as a variant, not a separate entry.

**Note on counting-hook:** This is a BOF hook. It lives in the BOF section (hooks 25–28). It is NOT a healthcare hook and must never be moved to the healthcare section.

### 14b. Option B — HOOK_FRAMEWORKS.md as Single Source of Truth

**Decision (June 1, 2026):** `HOOK_FRAMEWORKS.md` at the project root is the single source of truth for all hook frameworks. `tiktok.ts` reads it at runtime via `fs.readFileSync`. The inline `BATCH_HOOK_FRAMEWORKS` template literal that previously lived in `tiktok.ts` has been replaced.

**Implementation:**
- `tiktok.ts` now imports `fs`, `path`, and `fileURLToPath` from Node.js built-ins
- `const BATCH_HOOK_FRAMEWORKS = fs.readFileSync(path.join(__dirname, '../../HOOK_FRAMEWORKS.md'), 'utf-8');`
- The legacy inline string was initially preserved in a `/* ... */` block comment but was subsequently removed entirely because a `*/` sequence inside the template literal content caused esbuild to terminate the comment early, producing an unterminated multi-line comment error at the end of the file. The legacy content is preserved in git history only.
- `videolab.ts` uses structured TypeScript maps (`HOOK_REFERENCE_VIDEOS`, `HOOK_DELIVERY_RULES`) — these are NOT the same as the narrative frameworks blob and are kept inline

**Rule going forward:** To add, edit, or remove a hook framework, edit `HOOK_FRAMEWORKS.md` only. Never add hook framework text inline to `tiktok.ts`. The `/analysis/` subfolder no longer contains a copy of `HOOK_FRAMEWORKS.md` — the stale copy was deleted.

**Why this matters:** Before Option B, hook frameworks existed in two places: `HOOK_FRAMEWORKS.md` (the reference doc) and the inline string in `tiktok.ts` (the runtime prompt). Every change required updating both files. Option B eliminates the duplication — one edit to `HOOK_FRAMEWORKS.md` is all that is needed.

### 14c. Creator Pool — Final State (5 Creators)

The creator pool used for the hook framework validation is exactly 5 creators. Drew's two accounts (@drew.review and @drew.review1) count as ONE creator.

| Creator | Handle(s) | Status |
|---|---|---|
| rphreviews | @rphreviews | Fully analyzed |
| Riva | @adoseofwellness | Fully analyzed |
| Drew (unified) | @drew.review + @drew.review1 | Fully analyzed (22 videos) |
| Dr. Faith | @faithfuldoc | Fully analyzed (10 videos, $279K top GMV) |
| naturopathicapothecary1 | @naturopathicapothecary1 | Fully analyzed (9 videos, $216K top GMV) |

**Cross-creator validation threshold:** 3 of 5 creators for a universal rule. This threshold is documented in `CROSS_CREATOR_VALIDATION_GATE.md`.

### 14d. New Reference Documents Created

Three new permanent reference documents were created during this session:

| Document | Purpose |
|---|---|
| `SCRIPT_ARCHITECTURE_GUIDE.md` | Universal structural rules confirmed by 3+ of 5 creators — 9 universal rules, objection handling, mid-video retention, product reveal mechanics, authority system |
| `BUYER_PSYCHOLOGY_LEVERS.md` | 11 conversion psychology levers with creator confirmation counts, lever sequencing by funnel stage, lever combinations by hook type, Trust Stack, Desire Amplification Loop |
| `CROSS_CREATOR_VALIDATION_GATE.md` | Documents every candidate pattern, creator count (of 5), and classification (universal rule / strong pattern / execution note / product-specific). 4 over-saturation safeguards documented. |

Creator deep analysis reports:
- `analysis/CREATOR_DEEP_ANALYSIS_DRFAITH.md` — Dr. Faith, 10 videos, key patterns: bait-and-switch trust architecture, age-bracket dosing, parasocial language
- `analysis/CREATOR_DEEP_ANALYSIS_NATURO.md` — naturopathicapothecary1, 9 videos, key patterns: side-effect-surprise hook, retail legitimacy tactic, synergistic dual-action bundle

### 14e. Section 3 Hook Table — Now Stale

The hook tables in Section 3 of this document (Tier 1 and Tier 2 hook lists) reflect the pre-overhaul state. They are intentionally left as-is to preserve the historical record. The authoritative current hook library is `HOOK_FRAMEWORKS.md`. Do not use the Section 3 tables as a reference for hook selection — use `HOOK_FRAMEWORKS.md` instead.

---

## 15. June 1, 2026 — Post-Overhaul Improvements & Intel Library Completion

This section documents all work completed after the hook library overhaul captured in Section 14. These are the follow-on improvements that brought the project to its current state.

### 15a. Three Runtime-Loaded Reference Documents

The script generator now loads three documents at runtime on every generation call. All three are injected into the LLM prompt before any script is written.

| Document | Path | Injected Into |
|---|---|---|
| `HOOK_FRAMEWORKS.md` | `/HOOK_FRAMEWORKS.md` | All 4 generation prompts |
| `SCRIPT_ARCHITECTURE_GUIDE.md` | `/SCRIPT_ARCHITECTURE_GUIDE.md` | All 4 generation prompts |
| `BUYER_PSYCHOLOGY_LEVERS.md` | `/BUYER_PSYCHOLOGY_LEVERS.md` | All 4 generation prompts |

**The 4 generation prompts** are: `batchGenerate` (9-script batch), `generateSingle` (single hook), `iterate` (70/20/10 iteration), and `rewrite` (clone/misdirection rewrite).

**Why this matters:** Before this session, only `HOOK_FRAMEWORKS.md` was injected. `SCRIPT_ARCHITECTURE_GUIDE.md` and `BUYER_PSYCHOLOGY_LEVERS.md` were written during the Kalodata analysis but not yet wired into the generation pipeline. Adding them means the LLM now has the 9 universal structural rules and the 11 conversion psychology levers in context on every call — not just the hook opening frameworks.

**Live generation test confirmed:** A Neuro Gum + suppressed-knowledge hook test was run after the injection. The output correctly placed the buccal absorption mechanism as the centerpiece, tagged 6 of 11 psychology levers, and applied the architecture rules (authority pivot, product reveal timing, sell CTA). The three-document context is working as intended.

### 15b. Kalodata Plan — 100% Complete

The 12-step Kalodata analysis plan (`KALODATA_ANALYSIS_PLAN.md`) is fully complete as of this session. The two remaining gaps were closed:

**Gap 1 — Normalized deep analysis docs for Dr. Faith and naturo:**
- `analysis/faith_deep_analysis.md` — full 13-dimension format (Dimensions 1–13, Cross-Creator Validation, New Framework Candidates, Unexpected Findings, Implications for Our Scripts), matching the rphreviews/Riva/Drew convention
- `analysis/naturo_deep_analysis.md` — same format; key patterns: Trojan Horse objection handle, A vs. B bundle architecture, Overwhelming Evidence technique, Retail Legitimacy Tactic

The earlier `CREATOR_DEEP_ANALYSIS_DRFAITH.md` and `CREATOR_DEEP_ANALYSIS_NATURO.md` files remain in `/analysis/` as the original analysis output. The new normalized files are the canonical 13-dimension reference.

**Gap 2 — Content Campaign Plan section in PRODUCT_RESEARCH_PROTOCOL.md:**
Step 12 (Content Campaign Plan) was added to `PRODUCT_RESEARCH_PROTOCOL.md`. It defines TOF/MOF/BOF funnel stage sequencing, a 4-video minimum campaign structure, and four proven campaign sequences from the dataset (rphreviews, Dr. Faith, naturo, Drew patterns). The Full Protocol Output Template also received the corresponding Content Campaign Plan table.

### 15c. CTA Rule — Analysis-Backed (Corrects Earlier Theoretical Model)

**Established June 1, 2026.** The Content Campaign Plan template was initially written with theoretical TOF/MOF/BOF CTA logic (Follow/Save for TOF, Save/Comment for MOF, Buy for BOF). This was incorrect.

**What the analysis actually shows:** Every video in the 84-video dataset — regardless of funnel stage — ended with a sell CTA. The orange cart / link in bio / "link below" is non-negotiable across all 5 creators and all funnel stages. The only variation is in the secondary ask (some MOF videos add "comment your question below" or "save this" alongside the sell CTA), but the sell CTA is always present.

**Four confirmed CTA styles from the dataset:**

| Style | Pattern | When Used |
|---|---|---|
| Orange Cart Direct | "Link is in my shop" / "tap the orange cart" | Most common — all funnel stages |
| Link in Bio | "Link is in my bio" | Used when orange cart not available |
| Orange Cart + Comment | "Link is in my shop — comment your questions below" | MOF videos with high education density |
| Orange Cart + Scarcity | "Link is in my shop — this sells out fast" | BOF videos, high-converting products |

**This rule is now encoded in `PRODUCT_RESEARCH_PROTOCOL.md` Step 12 and in `HEALTHCARE_HOOK_REFERENCE_GUIDE.md`.** The CTA column in all Content Campaign Plans uses these four styles, not the theoretical funnel-stage model.

### 15d. HEALTHCARE_HOOK_REFERENCE_GUIDE.md

A new reference document was created at `/home/ubuntu/pharma-script-gen/HEALTHCARE_HOOK_REFERENCE_GUIDE.md`. This is an **editable operator reference** — not an AI prompt injection document.

**Contents:**
- All 24 healthcare hooks (Tier 1 and Tier 2 only — BOF hooks are excluded entirely)
- For each hook: sample opening line for a relevant product, funnel stage, key structural notes, what distinguishes it from similar hooks
- CTA reference table (4 confirmed styles from the dataset)
- Quick-reference funnel stage table

**Key distinction documented in this guide:**
- `instruction-correction` (Hook 1) vs. `right-way` (Hook 19) — these share a similar surface but are structurally different. `instruction-correction` requires a warm audience already taking the product, names their specific failed result, and reveals the product in the final third. `right-way` works on cold audiences, states the correct approach exists without naming a failure, and reveals the product mid-video.

**Maintenance rule:** When hooks are added, edited, or removed, update `HOOK_FRAMEWORKS.md`, `scriptData.ts`, `videolab.ts`, `PRODUCT_RESEARCH_PROTOCOL.md`, and `HEALTHCARE_HOOK_REFERENCE_GUIDE.md`. All five locations must stay in sync.

### 15e. CREATOR_ONBOARDING.md — Updated for Option B and Three-Document Architecture

`CREATOR_ONBOARDING.md` was updated in two ways:

1. **Option B callout** — a prominent note at the top of the doc states that `HOOK_FRAMEWORKS.md` is the single source of truth. Step 4 (previously "add hook frameworks to tiktok.ts") now says "edit `HOOK_FRAMEWORKS.md` only." The verification checklist was updated to grep `HOOK_FRAMEWORKS.md` instead of `tiktok.ts`.

2. **Structural Insight Checklist** — Step 5 now includes a checklist for `SCRIPT_ARCHITECTURE_GUIDE.md` and `BUYER_PSYCHOLOGY_LEVERS.md`. Future onboarding sessions must update both documents when new creators reveal structural or psychological insights — not just `HOOK_FRAMEWORKS.md`.

### 15f. Intel Doc Library — Content Campaign Plans Complete

Every product intel doc in `/product-intel/` now has a `## CONTENT CAMPAIGN PLAN` section. The full list of 21 docs with campaign plans:

| Doc | Product Category |
|---|---|
| `toplux-magnesium-complex-intel.md` | Supplement |
| `neuro-gum-intel.md` | Energy/Nootropic |
| `cerave-invisible-mineral-sunscreen-intel.md` | Skincare/SPF |
| `bloom-sparkling-energy-intel.md` | Energy/Supplement |
| `celsius-light-intel.md` | Energy Drink |
| `dr-melaxin-calcium-dark-spot-eye-cream-intel.md` | Skincare |
| `dr-melaxin-gifted-collagen-boost-set-intel.md` | Skincare |
| `dr-melaxin-multibalm-intel.md` | Skincare |
| `dr-melaxin-peel-shot-kojic-turmeric-spray-intel.md` | Skincare |
| `hismile-id-stain-whitening-mouthwash-intel.md` | Dental |
| `jiyu-nad-cream-intel.md` | Skincare/Anti-Aging |
| `jiyu-toner-pads-intel.md` | Skincare |
| `loaded-tea-shop-intel.md` | Energy/Supplement |
| `medicube-deodorant-intel.md` | Skincare |
| `medicube-glass-glow-set-intel.md` | Skincare |
| `medicube-mirandas-barrier-support-set-intel.md` | Skincare |
| `medicube-mix-match-toner-pad-set-intel.md` | Skincare |
| `medicube-multibalm-intel.md` | Skincare |
| `medicube-nad-egf-firming-serum-intel.md` | Skincare/Anti-Aging |
| `skin1004-hyalu-cica-sun-serum-uv-intel.md` | Skincare/SPF |
| `truly-beauty-deodorant-intel.md` | Skincare |

**Campaign plan format:** 4-video minimum campaign table with hook framework, content angle, primary psychology lever, and CTA style (from the 4 confirmed styles in Section 15c). Hook selections are drawn from the product's competitor content audit and the healthcare hook framework — not from theoretical funnel logic.

**Note on skincare products:** The healthcare hook framework applies equally to skincare and supplement products. rphreviews and Riva use the same pharmacist-authority structure (suppressed-knowledge, right-way, symptom-checklist, ingredient-form, expert-verdict) for skincare products. Skincare products have active ingredients and mechanism-of-action stories that are as strong as any supplement angle.

### 15g. Example Video Policy — Confirmed-Only

**Established June 1, 2026.** Example videos in `scriptData.ts` and `videolab.ts` are populated only when a confirmed real video ID from the analysis dataset is available. Inferred or hypothetical video IDs are never added.

Seven hooks currently have no example video (`pill-bottle-alternative`, `storytime`, `myth-busting`, `number-list`, `instead-of-drug`, `medication-side-effect`, `audience-pivot`). These were added to the hook library based on creator pattern analysis but were not tied to a specific analyzed video. The detail panel handles missing example videos gracefully — it simply does not render the link card.

### 15h. Current Project State — June 1, 2026

**Test suite:** 257 tests passing across 11 test files. TypeScript: 0 errors. esbuild: 0 errors.

**Hook library:** 28 total hooks (11 Tier 1 healthcare, 13 Tier 2 healthcare, 4 BOF). All wired into `tiktok.ts`, `scriptData.ts`, `videolab.ts`, and `HOOK_FRAMEWORKS.md`.

**Generation pipeline:** 3 runtime-loaded reference docs injected into all 4 generation prompts.

**Intel doc library:** 21 docs, all with Content Campaign Plans.

**Analysis library:** 5 creators fully analyzed, all in normalized 13-dimension format.

**Reference documents at project root:**
- `HOOK_FRAMEWORKS.md` — single source of truth for all 28 hook frameworks
- `SCRIPT_ARCHITECTURE_GUIDE.md` — 9 universal structural rules from 84-video / ~$4.3M GMV synthesis
- `BUYER_PSYCHOLOGY_LEVERS.md` — 11 conversion psychology levers with creator confirmation counts
- `CROSS_CREATOR_VALIDATION_GATE.md` — validation methodology and 4 over-saturation safeguards
- `HEALTHCARE_HOOK_REFERENCE_GUIDE.md` — editable operator reference for all 24 healthcare hooks
- `CREATOR_ONBOARDING.md` — updated for Option B and three-document architecture
- `KALODATA_ANALYSIS_PLAN.md` — 12-step plan, now 100% complete
- `PRODUCT_RESEARCH_PROTOCOL.md` — full research protocol including Step 12 (Content Campaign Plan)

---

## 16. Session Notes — June 1, 2026 (Post-Analysis Synthesis)

### 16a. PHRASE_BANK.md Created

A new permanent reference document `PHRASE_BANK.md` was created at the project root. It contains verbatim phrases extracted from 12,500+ lines of timestamped transcripts across all 5 creators (84 videos, ~$4.3M GMV). The bank is organized into 4 categories:

1. **Gap Section Language** — "most people don't know" openers, "here's the thing" pivots, "doing it wrong / right way" openers, "this is what will happen" future-pacing
2. **Transition Phrases** — personal recommendation pivots, mechanism → product pivots, "so if you want" CTA pivots
3. **Objection Handle Language** — quality/safety proof lines, medical disclaimer lines, "why not the cheaper alternative" handles
4. **Rehook Phrases** — "but here's where it gets" pivots, explanation loop openers, narrative callbacks, credential rehooks

Each phrase is tagged with creator, validation level (UNIVERSAL / CONFIRMED / SINGLE), and usage notes. Cross-creator validation summary table included.

**PHRASE_BANK.md is a reference document for manual script writing — it is NOT currently injected into the LLM prompt pipeline.** It is designed for use when writing scripts manually (outside the tool) or when auditing tool output for structural quality.

### 16b. HOOK_FRAMEWORKS.md Rule 8 — Caption Rules Expanded

Universal Rule 8 in `HOOK_FRAMEWORKS.md` was expanded from a single-paragraph caption rule to a structured multi-rule caption block. New rules added:

- **Lead with symptom/problem, not product name** — "Dark underarms are not a hygiene issue" is correct. "Medicube kojic acid deodorant review" is wrong.
- **Brand @mention in caption text** — tags the brand account for collaboration/discovery signal. Confirmed pattern: rphreviews uses in ~80% of 34 analyzed captions.
- **Pharmacist disclaimer required in every caption** — "Just a quick disclaimer: While I'm a licensed pharmacist, this is not medical advice." Confirmed pattern: rphreviews uses in 100% of 34 analyzed captions without exception.
- **Hashtag volume note** — rphreviews uses hashtags in only ~9% of captions; Riva ~27%. Both rely on natural-language SEO in caption body. The 5-hashtag rule is a safe default; 0–3 is also valid for captions with strong symptom-specific language.

### 16c. MASTER_CONTEXT.md Rule 6 — Specific Numbers Verification

Rule 6 was added to Section 9c (Script Quality Standards):

> **Every Specific Number Must Have a Source in the Intel Doc.** Any specific number — duration, dose, percentage, citation count, units sold — must be traceable to a source already documented in the product's intel doc or one of the three runtime docs. If the number is not in any of those sources, it does not go in the script. Plausible-sounding numbers extrapolated from general principles are fabrication, not estimation.

Triggered by: a "8–10 minutes of active chewing" figure written into a Neuro Gum instruction-correction script that had no source in the intel doc.

### 16d. Instruction-Correction Product Reveal Constraint Added

An explicit `PRODUCT REVEAL TIMING — CRITICAL CONSTRAINT` block was added to the instruction-correction hook section of `HOOK_FRAMEWORKS.md`. The constraint defines the final-third rule and explains the exact structural difference from the right-way hook (Hook 19). This was the primary finding from the Neuro Gum instruction-correction comparison analysis.

### 16e. Production Deployment Fix

The production container was crashing at startup because `HOOK_FRAMEWORKS.md`, `SCRIPT_ARCHITECTURE_GUIDE.md`, and `BUYER_PSYCHOLOGY_LEVERS.md` were not being packaged into the build. The `package.json` build script was updated to copy all three `.md` files into `dist/` after the esbuild step. The `readFileSync` paths in `tiktok.ts` were updated to use `path.join(__dirname)` which resolves correctly in both dev and production.

### 16f. Caption Data Gap — Drew / Dr. Faith / naturo

Caption/description metadata was not captured for Drew, Dr. Faith, or naturo during the original 5-creator analysis. Their analysis files contain only video content analysis (what was said/shown on screen). To complete the cross-creator caption picture, a separate data collection pass is needed from their TikTok profiles.

### 16g. Updated Project State — June 1, 2026 (End of Day)

**Test suite:** 257 tests passing. TypeScript: 0 errors. Production deployment: fixed.
**New reference documents:** `PHRASE_BANK.md` added to project root.
**Updated reference documents:** `HOOK_FRAMEWORKS.md` (Rule 8 caption expansion, instruction-correction constraint), `MASTER_CONTEXT.md` (Rule 6 specific numbers).
**Outstanding data gap:** Drew / Dr. Faith / naturo caption metadata not yet collected.
**Reference documents at project root (updated list):**
- `HOOK_FRAMEWORKS.md` — single source of truth for all 28 hook frameworks
- `SCRIPT_ARCHITECTURE_GUIDE.md` — 9 universal structural rules from 84-video / ~$4.3M GMV synthesis
- `BUYER_PSYCHOLOGY_LEVERS.md` — 11 conversion psychology levers with creator confirmation counts
- `PHRASE_BANK.md` — verbatim phrase bank (gap, transition, objection, rehook) from 5-creator transcript analysis
- `CROSS_CREATOR_VALIDATION_GATE.md` — validation methodology and 4 over-saturation safeguards
- `HEALTHCARE_HOOK_REFERENCE_GUIDE.md` — editable operator reference for all 24 healthcare hooks
- `CREATOR_ONBOARDING.md` — updated for Option B and three-document architecture
- `KALODATA_ANALYSIS_PLAN.md` — 12-step plan, now 100% complete
- `PRODUCT_RESEARCH_PROTOCOL.md` — full research protocol including Step 12 (Content Campaign Plan)

### 16h. New Strategy Documents Added — June 1, 2026
Two new reference documents added to the project root:

- **`SERIES_CONTENT_STRATEGY.md`** — 8 recurring content series mapped to the hook library. Each series has a title card format, verbal hook, text hook, episode-by-episode product pairings, and an engagement mechanic ("let me know what you want next"). Series: (1) Before You Reach for That Pill Bottle, (2) Pharmacist Counseling (comment-reply), (3) Best Gift for [Person with Problem], (4) What Your Medication Is Secretly Depleting, (5) How Do You Know If You Have Low [X], (6) Trend or Trash [Category] Edition, (7) [Number] Things Your Doctor Never Told You, (8) Kids Health — Pharmacist Approved. Priority ranking included. Built June 1, 2026.

- **`PRODUCT_ACQUISITION_RECOMMENDATIONS.md`** — Priority-ranked list of products to acquire based on cross-referencing the 5-creator / ~$4.3M GMV analysis against the existing 21 intel docs. Tier 1 (acquire immediately): Micro Ingredients Astaxanthin, Micro Ingredients NMN Complex, Micro Ingredients Multi Collagen, Nasamine Nasal Spray, Nello Supercalm. Tier 2 (acquire next): D3+K2, Turmeric Curcumin, Pumpkin Seed Oil, MaryRuth's Hair Gummies, Berberine, Perimeno Health, Gut Guardian Bundle, Saffron+, Liposomal Glutathione, Oregano Oil + Black Seed. Key strategic note: 7 of the top 15 acquisition targets are Micro Ingredients brand — one affiliate relationship covers the majority of Tier 1 and 2. Built June 1, 2026.

- **`VISUAL_OVERLAY_PLAYBOOK.md`** — Post-production overlay guide. **Fully rebuilt June 3, 2026** from verified manus-analyze-video data on 84 videos across 5 creators. Previous version contained a critical error (the rphreviews opening hook text was misidentified as a "persistent banner" lasting the full video — it is not; it disappears after 3–8 seconds). The rebuilt version is sourced exclusively from the 5 creator deep analysis documents and the verified data summary at `analysis/VERIFIED_OVERLAY_DATA.md`. Covers: 9 universal overlay rules (5/5 creator confirmed); verified timing reference table for all overlay types; creator-by-creator overlay systems (rphreviews, Drew, Riva, Naturo, Dr. Faith); 5 named overlay strategies (A through E) with a decision tree for script-level assignment; POST-PRODUCTION NOTES format to embed in every script; testing framework; and visual reference guide with actual screenshots. **No persistent banner exists in any of the 84 analyzed videos.** The only always-on visual credential is physical environment and costume (lab coat, diplomas, bookshelves). Use this doc for every video before export.

---

## 17. June 3, 2026 — Visual Overlay Playbook Rebuild & Corrections

### 17a. Persistent Banner Error — Identified and Corrected

A critical error was discovered in the Visual Overlay Playbook (original version): the rphreviews opening hook text was misidentified as a "persistent banner" that stays on screen for the entire video. This error propagated into `MASTER_CONTEXT.md` (Section 16h), `faith_deep_analysis.md` (lines 61 and 205), and the overlay assignment logic in Part 8 of the original playbook.

**Root cause:** The original playbook was not built directly from the manus-analyze-video deep analysis documents. It was written from a mix of those documents and assumptions, and the "3–8 seconds" finding from the rphreviews deep analysis (line 119: "stays on screen for 3–8 seconds") was incorrectly inflated to "entire video."

**What was corrected:**
- `VISUAL_OVERLAY_PLAYBOOK.md` — fully rebuilt from scratch (see 17b)
- `MASTER_CONTEXT.md` Section 16h — `VISUAL_OVERLAY_PLAYBOOK.md` entry updated with accurate description
- `faith_deep_analysis.md` — two incorrect "persistent banner throughout the video" references corrected to "3–8 seconds"
- `MASTER_CONTEXT.md` Section 5 scripting reference — updated to clarify the opening hook text disappears after 3–8 seconds and is NOT a persistent element

**Rule going forward:** Any overlay claim in the playbook or a script's POST-PRODUCTION NOTES must be traceable to the creator deep analysis documents or `analysis/VERIFIED_OVERLAY_DATA.md`. Do not write overlay rules from memory or frame-spot-checks alone.

### 17b. Visual Overlay Playbook — Fully Rebuilt

`VISUAL_OVERLAY_PLAYBOOK.md` was completely rewritten from scratch. The new version is sourced exclusively from:
- `analysis/rphreviews_deep_analysis.md` (23 videos)
- `analysis/drew_deep_analysis.md` (20 videos)
- `analysis/riva_deep_analysis.md` (22 videos)
- `analysis/naturo_deep_analysis.md` (9 videos)
- `analysis/faith_deep_analysis.md` (10 videos)
- `analysis/VERIFIED_OVERLAY_DATA.md` (compiled summary)

**Key verified findings now in the playbook:**
- No creator uses a text overlay that stays on screen for the entire video
- Opening hook text (rphreviews/Riva/Dr. Faith): 3–8 seconds, then disappears. Appears in 17/23 rphreviews videos, 18/22 Riva videos, 10/10 Dr. Faith videos
- The only always-on visual credential is physical environment and costume — lab coat, diplomas, bookshelves, ID badge clipped to coat
- Drew's highest-GMV video ($179K astaxanthin) used zero text overlays — physical setup alone drove conversion
- rphreviews sequential checkmark benefit stack: 18/23 videos, 4–8 benefits, 8–15 seconds total, 1–2 seconds per item
- PubMed/study screenshots: all 5 creators, 2–3 seconds each, mechanism section only
- CTA arrow: 20/23 rphreviews videos, combined with physical downward finger point

**New playbook structure (10 parts):**
1. Most Important Finding (no persistent banner)
2. Universal Overlay Rules (9 rules, 5/5 creators confirmed)
3. Overlay Timing Reference (verified timing table for all overlay types)
4. Creator-by-Creator Overlay Systems (rphreviews, Drew, Riva, Naturo, Dr. Faith)
5. Script-Level Overlay Assignment (5 named strategies: A through E)
6. Overlay Assignment Decision Tree
7. POST-PRODUCTION NOTES Format (embedded in every script)
8. Overlay Testing Framework
9. Visual Reference Guide (screenshots with descriptions)
10. Asset Sourcing Guide

### 17c. VERIFIED_OVERLAY_DATA.md — New Analysis Document

A new document `analysis/VERIFIED_OVERLAY_DATA.md` was created as the compiled source of verified overlay data from all 5 creator deep analyses. This is the reference document that the playbook was rebuilt from. Any future overlay questions should be checked against this document first before re-reading the full deep analysis files.

### 17d. Overlay Duration Rule — Corrected

**Established June 3, 2026.** Overlay duration in TikTok healthcare videos is 2–4 seconds per element, not 7–11 seconds. Longer durations make the video feel like a lecture slide. The only exceptions are the checkmark benefit stack (which stacks and stays within its section, 8–15 seconds total) and mechanism diagrams (3–8 seconds). All other overlays — study screenshots, product labels, social proof numbers, condition images — disappear after 2–4 seconds. This rule is now reflected in the POST-PRODUCTION NOTES format and the timing reference table in the playbook.

### 17g. Updated Project State — June 3, 2026

**Reference documents updated this session:**
- `VISUAL_OVERLAY_PLAYBOOK.md` — fully rebuilt (10 parts, verified data only)
- `analysis/VERIFIED_OVERLAY_DATA.md` — new document created
- `MASTER_CONTEXT.md` — Section 16h corrected, Section 17 added, last-updated date updated
- `analysis/faith_deep_analysis.md` — two persistent banner errors corrected

**Outstanding items carried forward:**
- ~~SCRIPT_12A and SCRIPT_12B (Dr. Melaxin) — POST-PRODUCTION NOTES need to be retrofitted using the new playbook format~~ ✅ RESOLVED June 30, 2026 — both scripts filmed and posted; status updated across all docs
- ~~SERIES_CONTENT_STRATEGY.md — contains one stale "persistent banner" reference in Series 1 (line 18)~~ ✅ RESOLVED — already corrected in the doc; no change needed
- ~~Drew / Dr. Faith / naturo caption metadata — still not collected~~ ✅ RESOLVED — fully documented in PHRASE_BANK.md Section 5 (60/30/30 caption datasets, cross-creator synthesis table)
- SCRIPT_13 (Toplux Magnesium) — P1 in write queue, not yet written

---

## 18. Session Notes — June 9, 2026 (Video Performance Analysis Framework)

**Last Updated:** June 9, 2026

### 18a. VIDEO_PERFORMANCE_ANALYSIS_FRAMEWORK.md — New Document Created

A new document `VIDEO_PERFORMANCE_ANALYSIS_FRAMEWORK.md` was created at the project root. This is the governing document for how every posted video gets analyzed. It covers:

- All 8 TikTok metrics defined with benchmarks calibrated for 60–120 second educational/affiliate content
- 6 diagnostic patterns (metric combinations and what each means)
- The analysis process: when to check (48h, 72h, 7d, 30d), what to submit, what the analysis produces
- How performance data feeds back into script iteration decisions (Replicate / Iterate / Remake / Retire)
- How findings get promoted to MASTER_CONTEXT.md Section 9 vs. staying in the log
- Connection to the overlay playbook (watch time drop-off → overlay adjustment)

**When to reference this document:** Any time a posted video is being analyzed, any time a script iteration decision is being made, and any time the pipeline is being prioritized based on performance data.

### 18b. VIDEO_PERFORMANCE_LOG.md — Updated Structure

`VIDEO_PERFORMANCE_LOG.md` was updated to align with the new framework. It now includes:
- Benchmarks quick reference table at the top
- Active videos table with all 8 metrics plus Diagnosis and Action columns
- Individual video entry section for detailed notes
- Hook performance summary table (updated after every 10 videos)
- Product performance summary table
- Patterns and insights section

**All tables are currently empty** — no videos have been submitted for analysis yet. The log is ready to receive the first batch of posted videos.

### 18c. How to Submit a Video for Analysis

When submitting a posted video for analysis, provide:
1. TikTok video URL (or script number)
2. Screenshot of TikTok Analytics: views, watch time %, average watch time (seconds), saves, shares, comments
3. Screenshot of Creator Center affiliate dashboard showing GMV (wait 72 hours after posting)
4. Any delivery notes (what changed from the written script, what felt off, what landed well)

The agent will map the metrics to the diagnostic framework, identify the drop-off point, write the log entry, and provide a specific action recommendation.

### 18d. Updated Project State — June 9, 2026

**Reference documents updated this session:**
- `VIDEO_PERFORMANCE_ANALYSIS_FRAMEWORK.md` — new document created
- `VIDEO_PERFORMANCE_LOG.md` — structure updated to match framework
- `MASTER_CONTEXT.md` — Section 18 added, last-updated date updated

**Outstanding items carried forward:**
- ~~SCRIPT_12A and SCRIPT_12B (Dr. Melaxin) — POST-PRODUCTION NOTES still need to be retrofitted~~ ✅ RESOLVED June 30, 2026 — both filmed and posted; status updated across all docs
- SCRIPT_13 (Toplux Magnesium) — P1 in write queue, not yet written
- ~~All posted videos — not yet submitted for analysis~~ ✅ RESOLVED — all 22 posted videos analyzed (analytics from screenshots June 10, 2026; delivery analysis via manus-analyze-video). Full data in VIDEO_PERFORMANCE_LOG.md.
- ~~Drew / Dr. Faith / naturo caption metadata — still not collected~~ ✅ RESOLVED — fully documented in PHRASE_BANK.md Section 5 (60/30/30 caption datasets, cross-creator synthesis table)

---

## 19. Session Notes — July 27, 2026 (Handle Verification System + Hook Audit)

**Last Updated:** July 27, 2026

### 19a. TikTok Handle Verification — System Change

A critical gap was identified: brand TikTok handles in campaign docs were being written from brand name knowledge, not verified against actual TikTok profiles. This resulted in incorrect or unverified @mentions in captions across all campaign docs.

**What was done:**
- All 11 brand handles verified via direct TikTok profile lookup
- All 17 campaign docs and standalone script docs updated with correct handles
- All 21 intel docs updated with a `**TikTok Handle:**` field as a permanent record

**Verified handles (as of July 27, 2026):**

| Brand | Verified Handle |
|---|---|
| HiSmile | @hismile |
| Medicube | @medicube_official_shop |
| Dr. Melaxin | @dr.melaxin.official |
| JiYu | @jiyuskin |
| Toplux | @topluxnutrition |
| Neuro Gum | @neurogum |
| Bloom Nutrition | @bloom |
| Truly Beauty | @trulybeauty |

**Note on Medicube:** Two accounts exist — `@medicube_official_shop` (748.8K, TikTok Shop affiliate account) and `@medicube` (smaller, content-only). All scripts use `@medicube_official_shop` for affiliate attribution.

**System fix — going forward:**
- `PRE_SESSION_BRIEF.md` Section 9B updated: TikTok handle verification is now mandatory precondition #2 before any script is written
- Rule: *"Do not guess handles from brand names. If the intel doc does not have a verified handle, verify it now via direct TikTok profile lookup and add it before proceeding."*
- Handle lives in the intel doc and flows automatically into every caption @mention

### 19b. Hook Audit — All Campaign Scripts

A full hook audit was run across all 17 campaign docs and standalone scripts. 17 hooks were flagged (9 FAIL, 8 WEAK). The primary failure pattern was **label hooks** — announcing the product name instead of leading with a bold claim.

**Example of the error pattern:**
- ❌ FAIL: *"Here is my pharmacist verdict on HiSmile iD Stain — what it actually does, who it is for, and the honest caveats before you buy."*
- ✅ FIXED: *"This is the best mouthwash for stains and bad breath I have ever recommended — and it is because of one ingredient most people have never heard of."*

All 17 flagged hooks were rewritten. The expert-verdict hook must lead with a specific bold claim, not a label or announcement of a verdict to come.

**System fix — going forward:**
- `POST_WRITE_CHECKLIST.md` updated: Item 0 (Hook Framework Validation) added as the first gate before all structural checks. Requires: (1) name the specific hook framework used, (2) quote the spoken hook line, (3) confirm it matches the documented opening pattern for that framework — not just the category name, (4) for expert-verdict: confirm it leads with a bold specific claim, not a label.

### 19c. BOF "It's Not Because" Hook Suite — New Format Established

A new BOF short-form script format was developed and tested across Toplux Magnesium and HiSmile. The format:

**Structure:** Hook (5 options tested) → 3 benefit lines (identity + pain, not features) → reveal (TikTok Shop price) → CTA

**Hook options tested:**
1. "I hate to break the bad news to everyone I've recommended [product] to over the years."
2. "I need to come clean to all of my patients who I recommended this to."
3. "I owe an apology to everyone I've ever recommended this [product] to."
4. "Bad news for everyone I recommended this to. Good news for everyone who hasn't bought it yet."
5. "I've been recommending this to my patients for years. I just realized I've been leaving out the most important part."

**Key rule for benefit lines:** Lead with identity + pain, not features. Not "it has 8 forms of magnesium" but "it's not because people who can't fall asleep without it swear by the glycinate form." The viewer's lived experience comes before the feature.

**Longer-form MOF→BOF variant:** Same structure with one education line per benefit (mechanism or audience-targeting expansion). Education line is optional per benefit — include when it adds a pharmacist-exclusive insight or pulls a lever harder, skip when it does not add anything. Runtime: 55–75 seconds.

### 19d. Viral Script Adaptation — HiSmile Videos 6 and 7

Two viral HiSmile scripts (both confirmed high-performing) were adapted for pharmacist delivery. The adaptation methodology:
- Preserve what made them viral (symptom-checklist opening, "what comes out is already in your mouth" beat)
- Replace weak points (unverified mechanism claims, brand-equivalence framing, compliance risks)
- Add pharmacist mechanism layer (thymol cell wall disruption, biofilm matrix breakdown)
- Pull existing mechanism explanations from campaign doc where they fit

**Thymol PubMed reference updated:** The original study used had "Listerine" in the title — unsuitable for a HiSmile video screenshot. Replaced with PMID 8602337 — *"The action of thymol on oral bacteria"* (Shapiro 1995, 230+ citations). Clean title, directly supports the claim.

### 19e. POST_WRITE_CHECKLIST.md — New Document

A detailed standalone post-write checklist was created to replace the condensed 18-point list in PRE_SESSION_BRIEF.md. Key differences:
- 21 items (including new Item 0 — Hook Framework Validation)
- Every item requires a **specific quoted answer**, not a checkbox tick
- SCRIPT_19 COX/Centella rewrite included inline as the Rule F benchmark
- Used in every session regardless of whether the brief or full docs are loaded
- PRE_SESSION_BRIEF.md Section 9 updated to point to this doc as the authoritative source

### 19f. Updated Project State — July 27, 2026

**Scripts written this session (July 19–27, 2026):**
- SCRIPT_26 (Toplux Magnesium — 8-Forms hook)
- SCRIPT_27 (Toplux Magnesium — Sleep/Glycinate hook)
- SCRIPT_28 (Neuro Gum — Xylitol dental)
- SCRIPT_29 (Bloom Sparkling Energy — Oligonol)
- SCRIPT_30 (Medicube Deodorant — Ceramide)
- SCRIPT_31 (Truly Beauty Deodorant — AHA pH)
- 11 campaign docs (50 scripts total): HiSmile (7), JiYu NAD+ Cream (4), JiYu Toner Pads (4), Medicube Glass Glow (4), Medicube Miranda Barrier (4), Medicube Mix & Match (5), Medicube NAD+ EGF Serum (4), Dr. Melaxin Dark Spot Eye Cream (5), Dr. Melaxin Intense Volume Eye Cream (5), Dr. Melaxin Volume Eye Patch (5), Dr. Melaxin TX Cream (5)
- BOF "It's Not Because" suite: 5 short-form + 1 longer-form for Toplux Magnesium and HiSmile

**Reference documents updated this session:**
- `POST_WRITE_CHECKLIST.md` — new document created (21-item detailed checklist)
- `PRE_SESSION_BRIEF.md` — Section 9 updated (pointer to checklist), Section 9B updated (handle verification precondition added, numbering fixed)
- `SCRIPT_LIBRARY.md` — SCRIPT_26–31 added, Campaign Docs table added
- `CONTENT_PIPELINE.md` — all 13 newly written products moved to Film Queue
- `HANDLE_VERIFICATION.md` — new working document with all verified handles
- All 21 intel docs — `**TikTok Handle:**` field added
- All 17 campaign/standalone script docs — handles corrected, hooks audited and fixed
- `MASTER_CONTEXT.md` — Section 19 added

**Outstanding items:**
- Analytics Screenshot Ingestion Workflow — deferred (not blocking)

---

## 20. Session Notes — July 29–30, 2026 (BOF Suite Template + Filming Rules)

**Last Updated:** July 30, 2026

### 20a. Three-Script BOF Campaign Suite — New Named Format

A complete three-script BOF/instruction-correction campaign suite was developed, tested across Medicube Deodorant, Medicube PDRN Multibalm, and Dr. Melaxin Calcium Multibalm, and fully documented as a reusable template.

**The format is called:** The Three-Script BOF Campaign Suite.

**The three types:**

| Type | Name | Format | Runtime | Primary Job |
|---|---|---|---|---|
| Type 1 | BOF Short-Form: "I Need to Add Something" | `apology-reveal` | 30–45 sec | Trust signal + price reveal — fast conversion |
| Type 2 | MOF→BOF Longer-Form: "It's Not Because" | `apology-reveal` + one education line per benefit | 55–75 sec | Benefit stack with mechanism education + price reveal |
| Type 3 | Instruction-Correction: "They Shoved This Down Your Throat" | `instruction-correction` | 60–90 sec | Fills the how-to-use gap — builds authority + comment engagement |

**Template reference doc:** `BOF_INSTRUCTION_CORRECTION_TEMPLATES.md` — contains complete fill-in-the-blank structure, rules, triple hook templates, overlay templates, caption templates, tone notes, and a decision guide for choosing between the three types. This is the authoritative reference for all future BOF suite scripts.

**Product examples written:**

| Product | Type 1 | Type 2 | Type 3 |
|---|---|---|---|
| Medicube Deodorant | SCRIPT_35 | SCRIPT_36 | SCRIPT_37 |
| Medicube PDRN Multibalm | SCRIPT_38 | SCRIPT_39 | SCRIPT_40 |
| Dr. Melaxin Calcium Multibalm | SCRIPT_41 | SCRIPT_42 | SCRIPT_43 |

**Prior examples (same formats, before the template was formalized):**

| Product | Type 1 | Type 2 | Type 3 |
|---|---|---|---|
| HiSmile Mouthwash | HISMILE_campaign.md (BOF short-form) | HISMILE_campaign.md (longer-form) | — |
| Toplux Magnesium | SCRIPT_26 (BOF short-form) | SCRIPT_26 (longer-form Script 6) | SCRIPT_33 |

**Key rule for Type 1 and Type 2:** Always run as an A/B test. Whichever drives more purchases per view becomes the primary BOF asset.

**Key rule for Type 3:** Can run at any point after the first TOF video. Does not require the full campaign to have run first.

---

### 20b. Filming Rules Promoted from Medicube Deodorant Filming Session (July 29, 2026)

Three rules were identified during the Medicube Deodorant filming session and promoted to permanent script quality rules. These apply to all future scripts.

**Rule 12 — Embedded Credential Framing (Default)**
The default credential delivery is embedded: *"I've been a pharmacist for over a decade and [pivot to content]."* Standalone *"I'm a pharmacist."* is only used for cold-open hooks that structurally require it (e.g., the "It's Not Because" format where the credential line is a setup beat, not a hook opener). Embedded credential framing is more natural on camera and avoids the "announcement" feel of a standalone credential line.

**Rule 13 — "Could Be" Framing for Symptom-to-Condition Attribution (Mandatory)**
All symptom-to-condition attribution in scripts must use "could be" framing — never definitive diagnostic language. Example: *"If you have [symptom], it could be [condition]"* — not *"If you have [symptom], you have [condition]."* Definitive diagnostic framing is a TikTok policy violation (confirmed by actual violation received July 2026). This is not a stylistic preference — it is a compliance requirement.

**Rule 14 — No Anatomical Keyword Text Overlays for Cortisol/Hormone Content**
For any script covering cortisol, hormones, or the HPA axis: spoken explanation of the mechanism is permitted and encouraged. On-screen text overlays using anatomical keywords are not. The following terms are confirmed algorithm triggers for cortisol/hormone content and must not appear as text overlays: HPA Axis, Pituitary, Glucocorticoids, Adrenal Cortex, Cortisol (as a standalone text overlay). The mechanism can be spoken in full — the restriction is on keyword text overlays only.

---

### 20c. Updated Project State — July 30, 2026

**Scripts written this session:**
- SCRIPT_35 (Medicube Deodorant — BOF Short-Form "I Need to Add Something")
- SCRIPT_36 (Medicube Deodorant — MOF→BOF Longer-Form "It's Not Because")
- SCRIPT_37 (Medicube Deodorant — Instruction-Correction "They Shoved This Down Your Throat")
- SCRIPT_38 (Medicube PDRN Multibalm — BOF Short-Form)
- SCRIPT_39 (Medicube PDRN Multibalm — MOF→BOF Longer-Form)
- SCRIPT_40 (Medicube PDRN Multibalm — Instruction-Correction)
- SCRIPT_41 (Dr. Melaxin Calcium Multibalm — BOF Short-Form)
- SCRIPT_42 (Dr. Melaxin Calcium Multibalm — MOF→BOF Longer-Form)
- SCRIPT_43 (Dr. Melaxin Calcium Multibalm — Instruction-Correction)

**Reference documents created/updated this session:**
- `BOF_INSTRUCTION_CORRECTION_TEMPLATES.md` — new document, full template reference for all three BOF suite types
- `SCRIPT_29` — revised (5 cuts applied, RCT line updated)
- `SCRIPT_33` — iron/magnesium separation citations added (PMID 8024640, PMID 31384293)
- `SCRIPT_LIBRARY.md` — SCRIPT_35–43 to be added
- `CONTENT_PIPELINE.md` — SCRIPT_30 marked filmed (July 29, 2026)
- `MASTER_CONTEXT.md` — Section 20 added

**Outstanding items:**
- Analytics Screenshot Ingestion Workflow — deferred (not blocking)
- SCRIPT_LIBRARY.md — SCRIPT_35–43 rows to be added next session

---

## 21. Session Notes — July 30, 2026 (Verified Usage Instructions Standard)

### 21a — Decision: Verified Usage Instructions Required in All Intel Docs

**What was decided:** Every product intel doc must include a **Verified Usage Instructions** section. This is now a required section in the Full Protocol Output Template in `PRODUCT_RESEARCH_PROTOCOL.md`.

**Why this was added:**

During the filming of SCRIPT_43 (Dr. Melaxin Calcium Multibalm how-to-use script), the script contained "twice daily" as the dosing instruction. The user questioned this because the package only says "apply as the last step of your skincare routine" with no frequency specified. A live search of the brand's retail listings confirmed that twice daily is the correct brand instruction — sourced from Ulta's brand-supplied listing, which also noted the clinical trial was conducted twice daily. The package instruction and the frequency instruction are two separate pieces of information that both belong in the script.

The root cause was that the intel doc had no verified usage instructions section — dosing was inferred from the clinical study protocol of a different product (the Volufiline 56-day protocol from the Medicube PDRN Multibalm was incorrectly carried over).

**The strategic angle this unlocks:**

The "how to use it properly" video format (Type 3 of the BOF Suite — "They Shoved This Down Your Throat") is one of the highest-converting BOF/instruction-correction angles for viral products. The premise: viral creators pushed the product but couldn't and didn't educate the audience on how to use it correctly. A pharmacist fills that gap with authority. This format only works if the usage instructions are verified from the brand's own sources — not inferred, not borrowed from a different product, not made up.

The pharmacist-exclusive insight lives inside the instructions. The "last step" instruction on the Dr. Melaxin package is not explained anywhere in the viral content. The pharmacist explanation — that Rebornic, adenosine, and Tremella all need surface contact time and that layering a moisturizer on top dilutes the actives — is the insight that no lifestyle creator can deliver. That explanation only exists because the usage instruction was verified and then interrogated through a pharmacist lens.

**Rule going forward:** Before writing any Type 3 instruction-correction script, the intel doc must have a completed Verified Usage Instructions section. If it does not, research the brand's retail listings first. Priority source order: (1) brand's own website, (2) Ulta brand-supplied listing, (3) Amazon brand-supplied listing, (4) TikTok Shop listing, (5) package insert as photographed by user.

**What was updated:**
- `PRODUCT_RESEARCH_PROTOCOL.md` — Verified Usage Instructions added as a required section in the Full Protocol Output Template
- `product-intel/dr-melaxin-multibalm-intel.md` — Section 8 added with verified instructions sourced from Ulta
- `SCRIPT_43` — How-to-apply section updated with verified instructions and pharmacist explanation of why the last step sequence matters


## 22. Session Notes — July 31, 2026 (Hook 29 + Physician's Choice Campaign)

**Last Updated:** July 31, 2026

### 22a. Hook 29 — Scam-Warning Added to Framework Library

A new hook framework (Hook 29, `scam-warning`) was identified from a full visual analysis of @adoseofwellness (Riva) and added to `HOOK_FRAMEWORKS.md`.

**Why this is a hook, not just a moat technique:** An earlier Riva deep analysis had classified the "fake companies" warning as a post-reveal objection-handling technique. This video inverts the structure — fake products appear in the first 3 seconds before the real product is shown. The sequence is: fake first → real product as the reveal. That inversion is what makes it a hook.

**Key structural finding:** Verbal pattern is "This is fake, this is a scam, this is fake" — each line lands on a different fake product with a physical point. Dual text box: "Watch out for SCAMS ⚠️‼️" (black on white) + "From a Pharmacist" (white on red) — both disappear at exactly 3 seconds when the real product appears. Full section sequence documented in `HOOK_FRAMEWORKS.md`.

**Status:** Tier 2 Situational — preliminary. Needs 2+ more healthcare creator examples using this hook before it can be upgraded to validated. Outstanding item: collect additional examples.

**Analysis method used:** Full manus-analyze-video 13-dimension visual analysis + Whisper transcript cross-reference. This is the required method for all creator deep analysis work — not transcript-only.

### 22b. Physician's Choice Digestive Enzymes — Campaign Written

An 8-video campaign was written for Physician's Choice Digestive Enzymes and saved to `scripts/campaigns/PHYSICIANS_CHOICE_DIGESTIVE_ENZYMES_campaign.md`. Campaign includes TOF primary, BOF short-form, instruction-correction, symptom-checklist standalone, BOF longer-form, GLP-1 companion, blood thinner warning standalone, and scam-warning. All 8 scripts passed the full POST_WRITE_CHECKLIST audit. Campaign is in the Film Queue.

### 22c. Updated Project State — July 31, 2026

**Scripts written this session:**
- Physician's Choice Digestive Enzymes — 8-video campaign (campaign doc)

**Reference documents updated this session:**
- `HOOK_FRAMEWORKS.md` — Hook 29 (`scam-warning`) added
- `MASTER_CONTEXT.md` — Section 3 hook table updated (Hook 29 added), Section 22 added
- `CONTENT_PIPELINE.md` — Physician's Choice campaign added to Film Queue; Medicube Deodorant, Medicube PDRN Multibalm, Dr. Melaxin Calcium Multibalm marked as filmed and uploaded
- `SCRIPT_LIBRARY.md` — Physician's Choice campaign doc added to campaign docs table
- `todo.md` — Hook 29 validation task added (collect 2+ more healthcare creator scam-warning examples)

**Outstanding items:**
- Hook 29 (`scam-warning`) — collect 2+ more healthcare creator examples to upgrade from preliminary to validated
- ~~Physician's Choice TikTok handle — not yet verified~~ ✅ RESOLVED July 31, 2026 — verified as @physicianschoice (blue badge, 445.5K followers). All 8 campaign captions updated. Intel doc updated.
- Analytics Screenshot Ingestion Workflow — deferred (not blocking)



---

## 23. Session Notes — August 1–14, 2026 (New Hooks, Scalp Serum Campaign, Automated Video Analytics)

**Last Updated:** August 14, 2026

### 23a. New Hook Frameworks Documented (Hooks 29, 30, and 31)

Three major new hook frameworks were analyzed, validated, and added to `HOOK_FRAMEWORKS.md`:
1. **Hook 29 (`scam-warning`) — Upgraded to Validated:** Analyzed across 4 Riva videos. Universal elements confirmed (4 fakes in corners, dual text box disappearing at 3s, "gone crazy viral" framing, blue checkmark instruction, sales volume contrast). BOF Type 4 template updated with two paths: Path A (consumer protection) and Path B (label-reading criteria). Non-negotiable trust anchor added: *"I'll always link the correct one in my videos."*
2. **Hook 30 (`split-screen-comparison`) — Added:** Multi-ingredient all-in-one comparison format analyzed across 4 viral non-healthcare videos (@treyfindss, @deals.by.dyl, @shopapproved). Two execution formats (Format A solo clone, Format B two-person partner dynamic). Added as a required campaign video type for eligible multi-ingredient products in `PRODUCT_RESEARCH_PROTOCOL.md`.
3. **Hook 31 (`tier-list-comparison`) — Added:** S-tier ranking framework analyzed from @flashfindstiktok0 and adapted with clinical authority. Ranks alternatives (C, D, B tiers) with clinical flaws before revealing the hero product as S-tier. Added as Video 12 in the Medicube Deoxyribose campaign.

### 23b. Medicube Deoxyribose Scalp Serum Campaign Written (12 Videos)
A comprehensive 12-video campaign was written for Medicube Deoxyribose Scalp Serum and saved to `scripts/campaigns/MEDICUBE_DEOXYRIBOSE_SCALP_SERUM_campaign.md`. 
- Includes TOF primary, MOF expert-verdict, MOF comparison, BOF results placeholder, BOF Suite Types 1–4 (with updated scam-warning structure), Video 5 (multi-ingredient split-screen stack), Video 10 (alternative call-out targeting minoxidil/finasteride users), Video 11 (framed-negative myth-busting "follicles aren't dead, they're starving"), and Video 12 (Tier-List ranking).
- All studies verified (PMID 38887556 for 2dDR animal study, PMID 17703734 for GHK-Cu, PMID 37452558 for EGF caveat, PMID 25842469 for rosemary).

### 23c. Split-Screen Comparison Suite Written (SCRIPT_44–48)
A standalone split-screen comparison suite was written and saved to `scripts/SCRIPT_44-48_split-screen-comparison-suite.md` for 5 top-fit products:
- SCRIPT_44 (Physician's Choice Digestive Enzymes)
- SCRIPT_45 (Medicube PDRN Multibalm)
- SCRIPT_46 (Toplux Magnesium 8-Forms)
- SCRIPT_47 (Dr. Melaxin Calcium Multibalm)
- SCRIPT_48 (HiSmile V34 Serum)

### 23d. Automated Video Analytics & Auto Reports UI Built
An automated performance tracking system was built and deployed:
- **Scheduled Agent Cron (`tc8FAYh8nm8NutAEUJpACv`):** Runs every 3 days targeting `@dealsbygp`, scraping new TikTok videos, analyzing content structure, and saving structured reports to the database.
- **Auto Reports Page:** Built into the web app (accessible via nav bar) to display automated reports, collect metrics input from TikTok Analytics, and run automated AI diagnosis (Verdict, Priority score, Root cause, Next action).

### 23e. Updated Project State — August 14, 2026
**Reference documents updated:**
- `HOOK_FRAMEWORKS.md` — Hook 29 validated, Hooks 30 and 31 added
- `PRODUCT_RESEARCH_PROTOCOL.md` — Updated to require split-screen comparison (Video 5) and all 4 BOF suite types in campaign plans
- `BOF_INSTRUCTION_CORRECTION_TEMPLATES.md` — Type 4 Path B updated with viral reason/education first structure and non-negotiable trust anchor lines
- `PRE_SESSION_BRIEF.md` & `SCRIPT_ARCHITECTURE_GUIDE.md` — Runtime targets tightened (TOF 75–100s, MOF 60–80s, BOF 30–50s) and BOF suite runtime rows added
- `MASTER_CONTEXT.md` — Section 23 added

---

## 24. TikTok Compliance & Violation History

### 24a. Purpose and Update Boundary

This section is the durable index of **material TikTok policy-enforcement events**. It exists so future sessions can identify a prior violation, understand its policy issue, retrieve its outcome, and avoid re-litigating known facts after context compression.

This is **not** a running support-ticket transcript or a repository for full appeal text, screenshots, raw platform notices, or line-by-line script revisions. The authoritative detailed record is [`TIKTOK_SHOP_APPEAL_AND_ENFORCEMENT_CASEBOOK.md`](TIKTOK_SHOP_APPEAL_AND_ENFORCEMENT_CASEBOOK.md). It contains each case’s evidence provenance, exact appeal wording when preserved, supporting-material locations, open-record requests, outcomes, and current official policy links. Add a case here only when it resulted in a violation, an appeal, a Seller Support escalation, or a framework-level compliance lesson. For open cases, record the status accurately and update the outcome only after the user receives a platform response.

No new permanent rule may be created from a single case merely because it is recorded here. A compliance lesson is promoted to Section 9 only after explicit user review and approval, unless the project already has a separately documented, established rule governing the issue.

| Case ID | Video / Product | Platform concern | Appeal / Support outcome | Current relevance |
|---|---|---|---|---|
| VC-001 | Toplux Magnesium — original high-cortisol video | Misleading Functionality and Effects | **Appeal not approved** (July 21, 2026); no supporting documents attached to the preserved appeal. | Consult the casebook before any cortisol/magnesium enforcement analysis. |
| VC-002 | Medicube Deoxyribose Scalp Serum | Misleading Functionality and Effect — 65.6% visible-hair-fallout statistic | In-app appeal denied (August 15, 2026; no supporting documents attached); Seller Support live-chat request submitted; **pending human review** | Do not treat the 65.6% claim as platform-cleared until the ticket is resolved. |
| VC-003 | E-commerce privilege suspension / termination | Account-level e-commerce enforcement | Final outcome **not preserved—awaiting source**. | Consult the casebook before characterizing the account-level decision. |
| VC-004 | Toplux Magnesium Tier-List | Misleading Functionality and Effect — linked magnesium-benefit and supporting-visual claim context | Appeal approved; violation withdrawn | The approved appeal confirms the submitted case outcome; future content still requires a current exact PDP/package claim map and claim-specific evidence review. |
| VC-005 | Physician’s Choice Digestive Enzymes Tier-List | Misleading Functionality and Effect — linked product, comparator, and BS50 ingredient-study context | **Appeal approved** (user-confirmed August 18, 2026); exact outcome-screen wording not yet preserved. Continuous `Results may vary` text and caption disclaimer were used. | Consult the casebook, VC-005 claim-verification/appeal package, and the six-case enforcement update before any revised version. |

**Related audit-only record:** The deleted Physician’s Choice Digestive Enzymes video is not assigned a separate VC identifier. Its primary TikTok notice, 8-point penalty, exact quoted content, August 2, 2026 timestamp, and user-confirmed denied appeal are preserved in the casebook’s **Section 7a**. Use that record without inferring unavailable visual, caption, or appeal-text details.

**Current cross-case conclusion:** `analysis/violations/tiktok_shop_misleading_functionality_six_case_update_2026-08-17.md` now supersedes the earlier five-case audit for cross-case analysis. The sixth case shows that a short linked-product video with a white coat, pharmacist text, a persistent `Results may vary` overlay, and a caption disclaimer can still be enforced when product-linked concrete outcomes, broad competitor statements, and ingredient-study-to-product proof are combined. It does **not** establish any isolated automatic trigger such as a white coat, study overlay, or phrase. VC-004 and VC-005 were both approved after evidence-backed submissions, while two preserved no-document in-app appeals were denied; treat this as an operational correlation, not a blanket platform rule or claim authorization.

---

## 25. Clean-Slate Active Writing Reset — September 1, 2026

**User-approved decision:** The project performed a selective clean-slate reset to remove the post-`0392bcdf` compliance/evidence-lane writing layer and every later generated script, campaign package, strategic analysis, framework implementation, and mixed product-intelligence record that the user did not trust as future writing precedent.

**Active baseline:** `0392bcdf`. Existing active control documents were restored to that baseline. Deleted post-trial artifacts are not active references and must not be recreated from memory or prior generated text.

**Only standing writing protection:** Sentence-level qualification. Natural qualified phrasing—such as “may help,” “helps support,” “can help,” “is used to help,” or “has been studied for”—may protect a specific claim without removing the selected proven framework’s hook, structure, pharmacist explanation, viewer-facing benefit, pain point, proof behavior, or conversion mechanics. The user retains final filming, visual, caption, and posting control.

**Source discipline:** Use [`CLEAN_SLATE_ACTIVE_SOURCE_MAP.md`](CLEAN_SLATE_ACTIVE_SOURCE_MAP.md) as the operative navigation document. Use [`FACT_ONLY_PRODUCT_RESEARCH_PROTOCOL.md`](FACT_ONLY_PRODUCT_RESEARCH_PROTOCOL.md) for every new product screen and full fact record; it requires exact-product video benchmarking, a source-proven Competitive Decision Map for every comparison-led format, claim-scope mapping, and source-only product facts before a campaign plan is proposed. Raw product labels, links, studies, creator-video references, and first-party performance data were retained only outside the active project source path. They must be re-opened and freshly assessed before any future framework, intelligence record, campaign, or script is rebuilt.

**Recovery:** The immediately pre-reset project state is preserved at checkpoint `e988739d`; related pre-reset recovery points are `bab54881` and `460aabb5`. A full project restoration to `0392bcdf` remains available if the user later elects it.

## 26. Checklist Recalibration — September 7, 2026

The active writing system distinguishes **campaign-level caution coverage** from **sentence-level claim qualification**. A genuine contraindication, interaction, timing restriction, or population-level caution supported by the fact record must be assigned to at least one appropriate asset in the approved campaign when the campaign calls for that educational angle; it does not need to appear in every script. A real caution is a differentiator and should receive a confident dedicated asset when appropriate, not a defensive hedge bolted onto unrelated videos.

Sentence-level qualification remains required wherever a script makes the relevant product or ingredient claim. Qualify the claim naturally when the evidence supports a mechanism or category effect but not an unconditional exact-product outcome. A caution unrelated to the script’s specific claim should not be force-fit into that script. Include a caution or practical alternative in the current script when the script introduces a safety barrier, gives an instruction that requires it, or makes a claim that depends on it.

The required workflow is **natural draft first, checklist audit second**. Draft the spoken script in a confident pharmacist voice using the approved framework, mechanism education, buyer problem, product advancement, proof, and CTA. Then run `POST_WRITE_CHECKLIST.md` as an audit instrument and repair only concrete gaps. Do not write around checklist labels or insert every caution merely to make an item read “yes.” This preserves authority, buyer psychology, Rule E, and Product Advancement while preventing walking-disclaimer delivery.

`POST_WRITE_CHECKLIST.md` Items 11, 12, and 13b; `PRE_SESSION_BRIEF.md` Rule G; and `CAMPAIGN_PLANNING_PROTOCOL.md` §5–6 are the synchronized references. DryWater and DR.DENT remain active test products; a real caution is not a reason to remove either product. This documentation update does not alter product fact records or rewrite existing scripts.
