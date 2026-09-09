from pathlib import Path
import re
import shutil

ROOT = Path('/home/ubuntu/pharma-script-gen')

def load(name):
    return (ROOT / name).read_text()

def save(name, text):
    (ROOT / name).write_text(text)

def remove_section(text, token, next_token):
    pattern = re.compile(r'^### .*' + re.escape(token) + r'.*?(?=^### .*' + re.escape(next_token) + r')', re.M | re.S)
    text, n = pattern.subn('', text, count=1)
    if n != 1:
        raise RuntimeError('Could not remove section: ' + token)
    return text

def must_replace(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise RuntimeError(f'{label}: expected one match, found {n}')
    return text.replace(old, new, 1)

# HOOK_FRAMEWORKS
p = load('HOOK_FRAMEWORKS.md')
p = remove_section(p, '`age-reversal`', '`comparison`')
p = p.replace('For education-heavy hooks (instruction-correction, suppressed-knowledge, age-reversal), the product should not appear until the final third of the script.', 'For education-heavy hooks (instruction-correction and suppressed-knowledge), the product should not appear until the final third of the script. Age-reversal is retired because its verified source is structurally redundant with comparison.')
p = p.replace('**Reference Videos:** @adoseofwellness (Riva) — 3.9M views | @faithfuldoc — $99K GMV | @rphreviews — multiple videos', '**Reference Videos:** @adoseofwellness (Riva) — Rank 03, $115,021.67 GMV | @faithfuldoc — Rank 4 visual-symptom-map variant\n**Evidence status:** [TRANSCRIPT-VERIFIED] corrected variants checked against Riva and Dr. Faith.')
p = p.replace('**Authority Placement:** Visual badge overlay — NOT verbal opening. Go straight into the hook.', '**Authority Placement:** Variant-specific. The primary product-in-hand format uses a verbal credential immediately after the symptom hook [TRANSCRIPT-VERIFIED, Riva]. The laptop/visual-map variant can use visual authority only [TRANSCRIPT-VERIFIED, Dr. Faith].')
p = p.replace('**Cross-Creator Validation:** 4/5 creators (rphreviews, Riva, Drew, Dr. Faith) — confirmed universal format.', '**Cross-Creator Validation:** 2 creators [TRANSCRIPT-VERIFIED] for the corrected variants; do not call this universal until additional exact transcripts are verified.')
p = p.replace('Hook/Symptom List (heavy) → Problem/Cause (heavy) → Solution + Product Introduction (heavy) → Education/Why It Works (medium) → Brand Close (light) → CTA (light)', 'Hook/Symptom List (heavy) → Variant-Specific Authority (light) → Problem/Cause + Education (heavy) → Solution + Product Introduction (medium) → Brand Close (light) → CTA (light)')
p = p.replace('- **Solution + Product Introduction:** The product is introduced immediately after the cause is named. "This is why I recommend [product]." Product introduction is early (first third) for this hook type.', '- **Solution + Product Introduction:** In the transcript-verified Riva and Dr. Faith references, the full symptom list and education precede the product/brand reveal. Target approximately 65–75% of runtime unless a separately verified variant proves otherwise.')
p = p.replace('**Opening Line Pattern:** "Nobody talks about this." / "Listen carefully." / "They don\'t want you to know..." / "I don\'t gatekeep."', '**Opening Line Pattern:** Use a source-verified opening. Naturo’s cited 11.9M-view stitch/reaction opens: “You cannot tell me that these two doctors are not connected... Listen to these next two clips very carefully.” [TRANSCRIPT-VERIFIED]. Do not present “Nobody talks about this” or “they don\'t want you to know” as Naturo’s verbatim lines.')
p = p.replace('**Creator Sources:** @rphreviews — Rank 17 ($21K+ GMV) | @adoseofwellness (Riva) — Ranks 14, 23 ($31K, $20K) | @drew.review — multiple videos | @faithfuldoc — Ranks 3, 5 ($155K, $31K)', '**Creator Sources:** @rphreviews — Rank 17 | @faithfuldoc — verified examples | @drew.review — Collagen and Oregano Oil examples [TRANSCRIPT-VERIFIED, 3 creators / 4 examples]. Riva’s previously cited collagen quote is not retained as verified.')
p = p.replace('**Cross-Creator Validation:** 5/5 creators — confirmed universal format.', '**Cross-Creator Validation:** 3 creators / 4 examples [TRANSCRIPT-VERIFIED] — strongest confirmed cross-creator pattern in this audit.', 1)
p = p.replace('**Verified Verbal Hook (@adoseofwellness/Riva, Rank 14, $31K GMV):**\n> *"If you\'re taking collagen and not seeing results — you might be taking it wrong."*', '**Retired evidence note:** The previously cited Riva collagen line does not appear in the retained transcript corpus and is not used as a verified example.')
p = p.replace('Nasomin iodine nasal spray', 'Nasamine iodine nasal spray').replace('Nasomin:', 'Nasamine:')
p = p.replace('**Creator Sources:** @rphreviews — multiple videos, $20K–$83K GMV range | @adoseofwellness (Riva) — Rank 10 ($33K, 34 seconds) | @drew.review — multiple videos | @faithfuldoc — Rank 8 ($27K) | @naturopathicapothecary1 — Ranks 6, 7 ($34K, $33K)', '**Creator Source:** @rphreviews — multiple transcript-verified examples. [TRANSCRIPT-VERIFIED] Dr. Faith Rank 8 is right-way, not expert-verdict; Riva Rank 10 is a product announcement without a declarative verdict or credential. Both are removed from expert-verdict validation.')
p = p.replace('**Cross-Creator Validation:** 5/5 creators — confirmed universal format.', '**Cross-Creator Validation:** rphreviews-specific pattern [TRANSCRIPT-VERIFIED]; do not present as universal 5/5.', 1)
p = p.replace('> *"This is the best kids multivitamin."* — Rank 19 ($20K+)', '> *"This is the best kids multivitamin."* — Rank 19 ($10,371.25) [TRANSCRIPT-VERIFIED]')
p = p.replace('> *"This is the best thing for your eyes."* — Rank 23 ($20K+)', '> *"This is the best thing for your eyes."* — Rank 23 ($7,899.86) [TRANSCRIPT-VERIFIED]')
p = p.replace('> *"This is the best thing for your prostate."* — Rank 22 ($20K+)', '> *"This is the best thing for your prostate."* — Rank 22 ($8,957.84) [TRANSCRIPT-VERIFIED]')
p = p.replace('Verification tutorial (0:35–0:55)', 'Verification tutorial (0:27–0:39)').replace('Product-benefit statement (early)', 'Product-benefit statement (0:46.8–0:51.6, near the end)')
p = p.replace('retrospective personal-results story', 'forward-looking predictive timeline: 24 hours, 1 week, 2–3 weeks, and 1 month')
p = re.sub(r'(?im)^.*best[- ]last.*\n', '', p)
p = re.sub(r'(?im)^.*unresolved final slot.*\n', '', p)
if '## Appendix A — Funnel Stage Quick Reference' not in p:
    p += '''\n\n---\n\n## Appendix A — Funnel Stage Quick Reference\n\n| Hook | Funnel Stage | Key Trigger |\n|---|---|---|\n| `symptom-checklist` | TOF | Rapid symptom recognition followed by cause education |\n| `suppressed-knowledge` | TOF/MOF | Verified insider-information gap |\n| `instruction-correction` | MOF | Correct-use education |\n| `right-way` | TOF→MOF | Correct-use education; strongest confirmed cross-creator pattern |\n| `comparison` | MOF | Affiliate-structure-appropriate verdict |\n| `expert-verdict` | MOF→BOF | rphreviews-specific declarative best-for verdict |\n| `after-1-month` | MOF | Forward-looking timeline |\n| `instead-of-drug` | MOF/BOF | Inferred pattern; exact cited source unresolved |\n| `audience-pivot` | MOF | Secondary buyer capture |\n| `fear-external-threat` | TOF | Timely external threat and personal witness |\n| `scam-warning` | BOF→MOF | Criteria-led authenticity education |\n| `bundle-routine-walkthrough` | MOF→BOF | Product-in-motion bundle sequence |\n| `category-scorecard` | MOF→BOF | Familiar category choices scored with reasons |\n| `numeric-scorecard` | MOF→BOF | Numeric category ranking |\n| `do-dont-contrast` | TOF/MOF | Equal-row mistake/replacement grid |\n\n## Appendix B — CTA Reference\n\n| CTA Style | Use |\n|---|---|\n| Direct cart tap | Default when a live TikTok Shop cart exists |\n| Conditional stock urgency | Only when current stock/restock evidence is verified |\n| Deal or bundle CTA | When the live offer or bundle is visible and verified |\n| Comparison decision CTA | After the final decision or use-case split |\n'''
save('HOOK_FRAMEWORKS.md', p)

# Script Architecture additions
p = load('SCRIPT_ARCHITECTURE_GUIDE.md')
if '## Audit-Verified Replicable Techniques' not in p:
    p += '''\n\n---\n\n## Audit-Verified Replicable Techniques (September 2026)\n\n### Visual-Comparison Opener [TRANSCRIPT-VERIFIED]\nRiva and rphreviews both open structurally similar videos with a physical comparison before naming the underlying cause. Show the visible or familiar problem first, then identify the cause and solution category.\n\n### Memorable Summary Line [ANALYSIS-VERIFIED]\nAfter a dense education beat, compress the mechanism into one short, quotable takeaway. Preserve the evidence boundary and translate the mechanism into viewer language.\n\n### INCI-Position Percentage Check [ANALYSIS-VERIFIED]\nCompare a brand’s headline ingredient percentage with its position in the complete current ingredient list when the exact label supports the comparison. Frame it as product literacy, not an accusation.\n'''
save('SCRIPT_ARCHITECTURE_GUIDE.md', p)

# Phrase bank
p = load('PHRASE_BANK.md').replace('click the orange card below', 'click the orange cart below')
if '## Audit-Verified Phrase Additions' not in p:
    p += '''\n\n---\n\n## Audit-Verified Phrase Additions (September 2026)\n\n| Phrase | Function | Status / boundary |\n|---|---|---|\n| “I’m gonna put it in the little orange shopping cart.” | Link placement | Dr. Faith, [TRANSCRIPT-VERIFIED], two instances |\n| “It does sell out so incredibly fast” / “stock is limited” / “snag it while you can” | Stock scarcity | [TRANSCRIPT-VERIFIED]; use only with current stock evidence |\n| “I don’t gatekeep.” | Trust marker | [TRANSCRIPT-VERIFIED] recurring Dr. Faith pattern |\n| “But what most people don’t realize is…” / “But here’s what most people don’t know.” | Lesser-known insight transition | [TRANSCRIPT-VERIFIED] |\n| “Let’s break down the different types of [X] and what they help with.” | Plain-English education transition | [TRANSCRIPT-VERIFIED] |\n| “I actually get this question a lot.” | Casual credibility builder | [TRANSCRIPT-VERIFIED] |\n| “You just get so much more, such a great value.” | Decisive-winner close | [TRANSCRIPT-VERIFIED] |\n| “In the comments, I want you to leave which one you guys would choose.” | Comment engagement | [TRANSCRIPT-VERIFIED] |\n\n### Bundle-routine objection technique [TRANSCRIPT-VERIFIED]\n“I see in a lot of the comments that people are using [product] every day. Since these are very exfoliating, I would not use these every day.” Use this inside a genuine walkthrough to correct a source-supported routine misconception.\n'''
save('PHRASE_BANK.md', p)

# Buyer Psychology
p = load('BUYER_PSYCHOLOGY_LEVERS.md')
p = p.replace("If you're taking collagen and not seeing results — you might be taking it wrong", "If you’re taking an ingredient and not seeing the expected benefit, verify the source before using a right-way example; the previously cited Riva collagen line is not transcript-verified")
p = re.sub(r'^\| `fake-outrage` \|.*\n', '', p, flags=re.M)
p = p.replace('fake-outrage, ', '').replace(', fake-outrage', '')
save('BUYER_PSYCHOLOGY_LEVERS.md', p)

# Pre-session brief
p = load('PRE_SESSION_BRIEF.md')
p = p.replace('HEALTHCARE_HOOK_REFERENCE_GUIDE.md', 'HOOK_FRAMEWORKS.md').replace('July 19, 2026', 'September 5, 2026')
p = re.sub(r'(?im)^.*age-reversal.*\n', '', p)
p = re.sub(r'(?im)^.*best[- ]last.*\n', '', p)
p = p.replace('fake-outrage, hope-you-didnt-buy, got-robbed, counting-hook', 'hope-you-didnt-buy, got-robbed, counting-hook')
p = p.replace('**Source documents: HOOK_FRAMEWORKS.md, SCRIPT_ARCHITECTURE_GUIDE.md, BUYER_PSYCHOLOGY_LEVERS.md, PHRASE_BANK.md, VISUAL_OVERLAY_PLAYBOOK.md, HOOK_FRAMEWORKS.md**', '**Source documents: HOOK_FRAMEWORKS.md, SCRIPT_ARCHITECTURE_GUIDE.md, BUYER_PSYCHOLOGY_LEVERS.md, PHRASE_BANK.md, VISUAL_OVERLAY_PLAYBOOK.md. HOOK_FRAMEWORKS.md is the sole active hook reference.**')
if '## Active Writing Safeguard' not in p:
    p += '\n\n## Active Writing Safeguard\n\nUse natural sentence-level qualification where appropriate: “may help,” “can help,” “helps support,” “is used to help,” or “has been studied for.” This safeguard must not replace the viewer payoff, mechanism education, buyer problem, proof, or proven framework mechanics.\n'
save('PRE_SESSION_BRIEF.md', p)

# Post-write checklist
p = load('POST_WRITE_CHECKLIST.md')
p = p.replace('| Suppressed-Knowledge | 5/5 |', '| Suppressed-Knowledge | 3/5 structural pattern; verify source opening |')
p = p.replace('| Right-Way / Instruction-Correction | 5/5 |', '| Right-Way | 3 creators / 4 examples; transcript-verified |')
p = p.replace('| Symptom-Checklist | 5/5 |', '| Symptom-Checklist | 2 creators transcript-verified for corrected variants |')
p = p.replace('| Expert-Verdict | 5/5 |', '| Expert-Verdict | rphreviews-specific; not universal |')
p = p.replace('Symptom Checklist hook (product introduced at ~30–40%)', 'transcript-verified symptom-checklist variant (product introduced approximately 65–75%)')
p = p.replace('### Item 6 — Product-Specific Quality and Differentiator Proof [REQUIRED]', '### Item 6 — Product-Specific Quality and Differentiator Proof [REQUIRED]\n\n**Normalized threshold:** Include at least **2 distinct** quality or differentiator proof anchors. The title, rule, and answer format use this same threshold.')
if '### Item 13b — Sentence-Level Qualification' not in p:
    marker = '### Item 14 — Rule F: Pain-First Mechanism Explanation [REQUIRED]'
    addition = '''### Item 13b — Sentence-Level Qualification [REQUIRED]\n\n**The rule:** Specific product or ingredient claims must use natural qualification when the evidence supports an ingredient mechanism or category effect but does not establish an unconditional outcome for the exact product. Prefer “may help,” “can help,” “helps support,” “is used to help,” or “has been studied for.” Do not use qualification as defensive narration that removes the viewer payoff, mechanism education, buyer problem, proof, or framework mechanics.\n\n**The check:** Identify product-level and ingredient-level claims. Flag absolute outcomes, guarantees, or exact-product clinical implications that exceed the fact record. Confirm that qualified wording remains clear and conversion-oriented.\n\n**Answer required:** *“Claims requiring qualification: [list]. Appropriate qualified wording present: [yes/no]. Viewer payoff preserved: [yes/no].”*\n\n'''
    p = p.replace(marker, addition + marker)
save('POST_WRITE_CHECKLIST.md', p)

# Retire drifting derivative outside active project.
old = ROOT / 'HEALTHCARE_HOOK_REFERENCE_GUIDE.md'
archive = Path('/home/ubuntu/pharma-script-gen-retired-docs-2026-09-05')
archive.mkdir(parents=True, exist_ok=True)
if old.exists():
    shutil.move(str(old), str(archive / old.name))
print('ok')
