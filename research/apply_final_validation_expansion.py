from pathlib import Path
import re

ROOT = Path('/home/ubuntu/pharma-script-gen')


def replace_once(path: str, old: str, new: str) -> None:
    p = ROOT / path
    text = p.read_text()
    if old not in text:
        raise RuntimeError(f'Missing expected text in {path}: {old[:120]!r}')
    p.write_text(text.replace(old, new, 1))


def replace_all(path: str, old: str, new: str) -> None:
    p = ROOT / path
    text = p.read_text()
    if old not in text:
        raise RuntimeError(f'Missing expected text in {path}: {old[:120]!r}')
    p.write_text(text.replace(old, new))


# 1. Clean-slate source map: activate the two formal cards.
replace_once(
    'CLEAN_SLATE_ACTIVE_SOURCE_MAP.md',
    '| `analysis/rebuild-frameworks/BEST_LAST_LIST_REVALIDATION_CARD_2026-09-01.md` | Numbered routine/list variation with the final answer intentionally unresolved | Original @therealbrianmark #5-best source and fresh observation log | Use a real 3–5-item viewer pathway with a credible final-gap answer, a late physical product reveal, direct benefit/proof, and a current cart close. |\n',
    '| `analysis/rebuild-frameworks/BEST_LAST_LIST_REVALIDATION_CARD_2026-09-01.md` | Numbered routine/list variation with the final answer intentionally unresolved | Original @therealbrianmark #5-best source and fresh observation log | Use a real 3–5-item viewer pathway with a credible final-gap answer, a late physical product reveal, direct benefit/proof, and a current cart close. |\n| `analysis/rebuild-frameworks/SPLIT_SCREEN_COMPARISON_REVALIDATION_CARD_2026-09-05.md` | Two-person or clone split-screen all-in-one-versus-complicated-routine comparison | Four retained reference videos from three non-healthcare creators plus approved pharmacist adaptation notes | Situational use only; require a genuine ingredient/role match, partner or clone-edit capability, fact-only product evidence, and a proof-card plan. |\n| `analysis/rebuild-frameworks/TIER_LIST_COMPARISON_REVALIDATION_CARD_2026-09-05.md` | Fixed letter-tier ranking of recognizable alternatives with a final S-tier reveal | Preserved @flashfindstiktok0 source plus approved pharmacist adaptation notes | Situational use only; direct source basis is one creator, so do not describe it as broadly cross-creator validated. Require a current Competitive Decision Map and fair clinical-neutrality treatment. |\n',
)

# 2. HOOK_FRAMEWORKS introduction and comparison entry.
replace_once(
    'HOOK_FRAMEWORKS.md',
    '**Validation Rule:** Patterns confirmed in 3/5 creators qualify as universal structural rules. Patterns in 1–2 creators are documented as execution notes.\n',
    "**Validation Rule:** Creator counts are sample-scoped. Use the wording: **'Confirmed via direct transcript review in [N] of 5 creators\' analyzed top-performing samples (90-day window).'** This describes the reviewed sample, not the universe of content a creator may publish. A single-creator pattern is not weaker solely because it lacks cross-creator breadth; expert-verdict is the documented case study: rphreviews has a strong, high-earning declarative pattern that remains strategically useful as a creator-specific framework.\n",
)
replace_once(
    'HOOK_FRAMEWORKS.md',
    'Age-reversal is retired because its verified source is structurally redundant with comparison.',
    'Age-reversal is retired as a separate framework because the retained naturo example is comparison content and is now properly credited to the comparison framework.',
)
replace_once(
    'HOOK_FRAMEWORKS.md',
    '**Reference Videos:** @rphreviews — 1.2M views ($89K GMV) | @faithfuldoc — $172K GMV | @naturopathicapothecary1 — $102K GMV (bundle variant) | @adoseofwellness (Riva) — bundle variant\n',
    '**Reference Videos:** @rphreviews — 1.2M views ($89K GMV) | @faithfuldoc — $172K GMV | @naturopathicapothecary1 — $102K GMV bundle variant plus Rank 05 ($39,820.60 GMV) | @adoseofwellness (Riva) — original transcript-verified bundle variant | @drew.review1 — Rank 21 ($11,009.03 GMV), collagen capsules versus powder\n',
)
replace_once(
    'HOOK_FRAMEWORKS.md',
    '**Cross-Creator Validation:** 3 creators / 4 examples [TRANSCRIPT-VERIFIED] — strongest confirmed cross-creator pattern in this audit.\n',
    "**Cross-Creator Validation:** Confirmed via direct transcript review in 5 of 5 creators' analyzed top-performing samples (90-day window) [TRANSCRIPT-VERIFIED]. The reviewed examples cover decisive, split-by-use-case, and complementary bundle verdicts.\n",
)
replace_once(
    'HOOK_FRAMEWORKS.md',
    '**Verified Verbal Hook (verbatim from @naturopathicapothecary1, Rank 2, $102K GMV — bundle variant):**\n> *\"NMN vs Astaxanthin as anti-aging supplements — [which one should you take?]\"* [Resolved at 79% runtime: \"actually, you need both — they are synergistic.\"]\n',
    '''**Verified Verbal Hook (verbatim from @naturopathicapothecary1, Rank 2, $102K GMV — bundle variant):**\n> *"NMN vs Astaxanthin as anti-aging supplements — [which one should you take?]"* [Resolved at 79% runtime: "actually, you need both — they are synergistic."]\n\n**Verified Verbal Hook (verbatim from @naturopathicapothecary1, Rank 05, $39,820.60 GMV — direct comparison):**\n> *"Astaxanthin or NMN? Which one should you be taking?"*\n\n**Verified Verbal Hook (verbatim from @drew.review1, Rank 21, $11,009.03 GMV — same-brand format comparison):**\n> *"Is better? Collagen capsules or powder? I'm a pancreatic cancer researcher, so let me explain in detail which one might be suited for you."*\n''',
)
replace_once(
    'HOOK_FRAMEWORKS.md',
    '**The bundle variant — "A vs. B → You Need Both" (naturo, confirmed 3/9 videos, avg $71K GMV):**',
    "**The bundle variant — \"A vs. B → You Need Both\" (naturo, confirmed via direct transcript review in 1 of 5 creators' analyzed top-performing samples for this specific bundle resolution; two naturo source videos are retained):**",
)
replace_once(
    'HOOK_FRAMEWORKS.md',
    '**GMV evidence:** 4 reference videos from 3 non-healthcare creators. All top-performing by view count. Healthcare creator adaptation not yet confirmed. Add to campaigns for products that fit the multi-ingredient all-in-one profile and track performance.\n',
    "**GMV evidence:** Four retained reference videos from three non-healthcare creators. Confirmed via direct transcript/visual-source review in 3 of 5 creators' analyzed top-performing samples (90-day window) for this execution. The pharmacist adaptation is now approved as situational through `analysis/rebuild-frameworks/SPLIT_SCREEN_COMPARISON_REVALIDATION_CARD_2026-09-05.md`; track account-level performance separately.\n",
)
replace_once(
    'HOOK_FRAMEWORKS.md',
    '### 30. `split-screen-comparison` — Legacy Candidate, Not an Active Clean-Slate Framework\n**Hook ID:** `split-screen-comparison`\n**Active status:** **Do not select for new scripts or campaigns.** This was added in August 2026 from four non-healthcare creator videos and a retained visual-analysis synthesis, but it was not among the clean-slate rebuilt foundations in `CLEAN_SLATE_ACTIVE_SOURCE_MAP.md`. It remains documented here only as a provenance record pending fresh source re-opening, a dedicated revalidation card, and explicit user approval.\n**Tier:** Tier 2 Situational — **Validated (4 videos, 3 non-healthcare creators, consistent structure)**. Needs healthcare creator examples to confirm pharmacist adaptation works.\n',
    '### 30. `split-screen-comparison` — Split-Screen Comparison\n**Hook ID:** `split-screen-comparison`\n**Active status:** **Active/situational.** Revalidated in `analysis/rebuild-frameworks/SPLIT_SCREEN_COMPARISON_REVALIDATION_CARD_2026-09-05.md`. Use only for a genuine all-in-one-versus-complicated-routine comparison with accurate ingredient/role matching and a partner or clone-edit execution.\n**Tier:** Tier 2 Situational — four retained reference videos from three non-healthcare creators; pharmacist adaptation approved by project decision.\n',
)
replace_once(
    'HOOK_FRAMEWORKS.md',
    '### 31. `tier-list-comparison` — Legacy Candidate, Not an Active Clean-Slate Framework\n**Creator Source:** @flashfindstiktok0 (viral TikTok Shop video, 2026) — adapted for pharmacist authority  \n**Active status:** **Do not select for new scripts or campaigns.** This was added in August 2026 from a single non-healthcare creator source and a pharmacist adaptation in campaign work. It was not among the clean-slate rebuilt foundations in `CLEAN_SLATE_ACTIVE_SOURCE_MAP.md`; fresh source re-opening, a dedicated revalidation card, and explicit user approval are required before activation.\n**Tier:** Tier 1 High-Volume (New)  \n**Format:** TOF / MOF (60–90 sec)  \n**Source/Validation:** Single-creator reference video analyzed July–August 2026. Pharmacist adaptation tested and confirmed for clinical authority.  \n',
    '### 31. `tier-list-comparison` — Tier-List Comparison\n**Creator Source:** @flashfindstiktok0 (viral TikTok Shop video, 2026) — adapted for pharmacist authority  \n**Active status:** **Active/situational.** Revalidated in `analysis/rebuild-frameworks/TIER_LIST_COMPARISON_REVALIDATION_CARD_2026-09-05.md`. The direct source basis is one creator; use sample-scoped wording and do not imply broad cross-creator validation.\n**Tier:** Tier 1 Situational  \n**Format:** TOF / MOF (60–90 sec)  \n**Source/Validation:** One preserved creator reference plus approved pharmacist adaptation rules for clinical neutrality and staged reactions.  \n',
)
# Remove any old appendix rows if present, then add both before the closing separator.
appendix_anchor = '| `scam-warning` | BOF→MOF | Criteria-led authenticity education |\n'
appendix_add = '| `split-screen-comparison` | TOF→MOF | Active/situational all-in-one versus complicated-routine comparison; revalidation card required before use |\n| `tier-list-comparison` | TOF/MOF | Active/situational fixed-tier ranking with final S-tier reveal; fair Competitive Decision Map required |\n'
replace_once('HOOK_FRAMEWORKS.md', appendix_anchor, appendix_anchor + appendix_add)

# 3. PRE_SESSION_BRIEF: sample-scoped note, rows, and single-creator principle.
replace_once(
    'PRE_SESSION_BRIEF.md',
    '## SECTION 4 — HOOK QUICK REFERENCE\n',
    "## SECTION 4 — HOOK QUICK REFERENCE\n\n**Validation-language rule:** Any creator-count statement is sample-scoped: **'Confirmed via direct transcript review in [N] of 5 creators' analyzed top-performing samples (90-day window).'** A single-creator hook is not weaker solely because it lacks cross-creator breadth; expert-verdict remains a valid rphreviews-specific pattern.\n",
)
replace_once(
    'PRE_SESSION_BRIEF.md',
    '| `comparison` | MOF | A vs. B — bundle variant (\"you need both\") is highest-converting |\n',
    '| `comparison` | MOF | A vs. B — confirmed via direct transcript review in 5 of 5 creators\' analyzed top-performing samples (90-day window); decisive, split, and bundle verdict variants |\n| `split-screen-comparison` | TOF→MOF | Active/situational all-in-one versus complicated-routine split-screen; use only with verified matches |\n| `tier-list-comparison` | TOF/MOF | Active/situational named alternatives ranked to a late S-tier reveal; use a fair Competitive Decision Map |\n',
)

# 4. POST_WRITE_CHECKLIST Item 0 table and principle.
replace_once(
    'POST_WRITE_CHECKLIST.md',
    '**The rule:** Every spoken hook must match one of the proven frameworks in HOOK_FRAMEWORKS.md. The hook must be anchored to a verbatim or near-verbatim opening pattern confirmed in 3/5+ creators. Generic labels, announcements, or self-introductions do not qualify as hooks.\n',
    "**The rule:** Every spoken hook must match one of the proven frameworks in HOOK_FRAMEWORKS.md. Cross-creator counts are sample-scoped: use **'Confirmed via direct transcript review in [N] of 5 creators' analyzed top-performing samples (90-day window).'** A single-creator hook is not weaker solely because it lacks breadth; evaluate its source quality, GMV, and structural fit. Generic labels, announcements, or self-introductions do not qualify as hooks.\n",
)
old_table = '''| Framework | Confirmed Creators | Proven Opening Pattern |\n|---|---|---|\n| Suppressed-Knowledge | 3/5 structural pattern; verify source opening | "Nobody talks about this — but [hidden truth about ingredient/mechanism]" |\n| Right-Way | 3 creators / 4 examples; transcript-verified | "If you're [doing X] and not seeing results — this is probably why" |\n| Symptom-Checklist | 2 creators transcript-verified for corrected variants | "[N] signs [you have condition] — and if you have [all/most], [escalation]" |\n| Expert-Verdict | rphreviews-specific; not universal | "This is the best [product] for [specific condition or person]" |\n| Comparison | 4/5 | "[Product A] vs [Product B] — here is the pharmacist breakdown" |\n| Side-Effect-Surprise | 4/5 | "The [ingredient] in this [product] is doing something most people have no idea about" |\n| Fear-External-Threat | 3/5 | "[External threat — news/study/event] — here is what that means for your [health area]" |\n| After-1-Month | 3/5 | "I've been using [product] for [timeframe] — here is my honest pharmacist update" |\n| BOF Price-Reveal | 3/5 | "I hate to break the bad news to everyone I've recommended [product] to" / "I need to come clean to every patient I've recommended this to" |\n'''
new_table = '''| Framework | Direct-transcript creator sample | Confirmed GMV share of full analyzed corpus | Proven Opening Pattern |\n|---|---|---:|---|\n| Suppressed-Knowledge | Confirmed via direct transcript review in 3 of 5 creators' analyzed top-performing samples (90-day window); source opening still required per framework | Not separately quantified in retained hook record | "Nobody talks about this — but [hidden truth about ingredient/mechanism]" |\n| Right-Way | Confirmed via direct transcript review in 3 of 5 creators' analyzed top-performing samples (90-day window); multiple examples retained | ≥10.1% documented lower bound from retained GMV examples | "If you're [doing X] and not seeing results — this is probably why" |\n| Symptom-Checklist | Confirmed via direct transcript review in 2 of 5 creators' analyzed top-performing samples (90-day window) | Not separately quantified in retained hook record | "[N] signs [you have condition] — and if you have [all/most], [escalation]" |\n| Expert-Verdict | Confirmed via direct transcript review in 1 of 5 creators' analyzed top-performing samples (90-day window); rphreviews-specific pattern | ≥1.4% documented lower bound from retained examples | "This is the best [product] for [specific condition or person]" |\n| Comparison | Confirmed via direct transcript review in 5 of 5 creators' analyzed top-performing samples (90-day window) | ≥10.3% documented lower bound; Riva GMV not separately retained | "[Product A] vs [Product B] — here is the pharmacist breakdown" |\n| Side-Effect-Surprise | Confirmed via direct transcript review in 1 of 5 creators' analyzed top-performing samples (90-day window) | 5.0% documented from naturo Rank 1 | "The [ingredient] in this [product] is doing something most people have no idea about" |\n| Fear-External-Threat | Confirmed via direct transcript review in 1 of 5 creators' analyzed top-performing samples (90-day window); Riva/rphreviews coverage is source-specific | ≥4.0% documented lower bound from retained Nasamine examples | "[External threat — news/study/event] — here is what that means for your [health area]" |\n| After-1-Month | Confirmed via direct transcript review in 3 of 5 creators' analyzed top-performing samples (90-day window) | Not separately quantified in retained hook record | "I've been using [product] for [timeframe] — here is my honest pharmacist update" |\n| BOF Price-Reveal | Confirmed via direct transcript review in 3 of 5 creators' analyzed top-performing samples (90-day window) | Not separately quantified in retained hook record | "I hate to break the bad news to everyone I've recommended [product] to" / "I need to come clean to every patient I've recommended this to" |\n'''
replace_once('POST_WRITE_CHECKLIST.md', old_table, new_table)
replace_once(
    'POST_WRITE_CHECKLIST.md',
    '**The two most common failure patterns (from the July 20, 2026 audit of 56 scripts):**\n',
    '**Interpretation principle:** Creator breadth and earning power answer different questions. A single-creator hook is not weaker solely because it is single-creator; expert-verdict is the documented rphreviews case study. Use the GMV-share column as context, not as a substitute for structural evidence.\n\n**The two most common failure patterns (from the July 20, 2026 audit of 56 scripts):**\n',
)

# 5. Normalize explicit creator-count phrases in active docs without touching unrelated ratios.
files = [
    'HOOK_FRAMEWORKS.md',
    'POST_WRITE_CHECKLIST.md',
    'PRE_SESSION_BRIEF.md',
    'BUYER_PSYCHOLOGY_LEVERS.md',
    'SCRIPT_ARCHITECTURE_GUIDE.md',
    'PHRASE_BANK.md',
]
for rel in files:
    p = ROOT / rel
    text = p.read_text()
    # Most explicit hook/creator claims use one of these forms.
    text = re.sub(
        r'confirmed in all 5 creators',
        "confirmed via direct transcript review in 5 of 5 creators' analyzed top-performing samples (90-day window)",
        text,
        flags=re.I,
    )
    text = re.sub(
        r'confirmed (?:in )?(\d)\/5 creators',
        lambda m: f"confirmed via direct transcript review in {m.group(1)} of 5 creators' analyzed top-performing samples (90-day window)",
        text,
        flags=re.I,
    )
    text = re.sub(
        r'(\d)\/5 creators confirmed',
        lambda m: f"confirmed via direct transcript review in {m.group(1)} of 5 creators' analyzed top-performing samples (90-day window)",
        text,
        flags=re.I,
    )
    p.write_text(text)

# 6. Ensure comparison is not still framed as 3/5 or 4/5 anywhere in target docs.
for rel in ['HOOK_FRAMEWORKS.md', 'POST_WRITE_CHECKLIST.md', 'PRE_SESSION_BRIEF.md', 'BUYER_PSYCHOLOGY_LEVERS.md']:
    p = ROOT / rel
    text = p.read_text()
    text = text.replace('3 creators / 4 examples', "confirmed via direct transcript review in 5 of 5 creators' analyzed top-performing samples (90-day window)")
    text = text.replace('Comparison | 4/5', "Comparison | confirmed via direct transcript review in 5 of 5 creators' analyzed top-performing samples (90-day window)")
    text = text.replace('comparison’s cross-creator count', "comparison's 5/5 direct-transcript validation")
    p.write_text(text)

print('Applied final hook-validation expansion.')
