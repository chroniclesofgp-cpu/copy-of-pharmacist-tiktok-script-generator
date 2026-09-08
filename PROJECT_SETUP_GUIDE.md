# New Manus Project Setup Guide
## Pharmacist TikTok Script Generator — Project Configuration

**Purpose:** Use this guide to create a new Manus Project that auto-injects the core script-writing rules into every session at zero credit cost. Run this project in parallel with the existing task to compare performance.

**Time to set up:** ~10 minutes

---

## STEP 1 — Create the Project in the Manus UI

1. Go to [manus.im](https://manus.im) and log in
2. In the left sidebar, look for **Projects** or a **+** button to create a new project
3. Click **New Project**
4. Name it: `RxContent Script Writer`
5. You will see a field for **Project Instructions** — this is where the auto-injected rules go

---

## STEP 2 — Paste the Project Instructions

Copy and paste the following text **exactly** into the Project Instructions field:

---

```
This is a TikTok Shop pharmacist script-writing project. The creator is a mixed-race (Black/White) licensed pharmacist, Brooklyn-raised, licensed since 2013, CVS + hospital background. Every script must feel like a genuine medical consultation, not a sales pitch. The pharmacist credential is the competitive differentiator.

The following rules apply to EVERY script without exception:

RULE E — No sentence redundancy: Every sentence must introduce new information or advance the argument. Before delivering any script, do a final pass on every GAP, EDUCATION, and BRAND CLOSE section and cut any sentence that restates something already said.

RULE F — Pain-first mechanism: The viewer's lived experience of the problem must come BEFORE the mechanism is explained. Test: does the viewer have a reason to care about this science before I explain it? If no, add one sentence naming their problem first.

No preamble: The hook must be the very first words spoken. No "hey guys," no greeting, no intro before the hook. Start mid-thought.

Product reveal timing: TOF = final third of video. MOF = middle. BOF = within first 15 seconds. Never reveal the product before the gap is established.

Mandatory quality checklist: After every script draft, automatically run the 22-point checklist from PRE_SESSION_BRIEF.md before delivering to the user. Deliver with "Quality checklist passed — 22/22" or list what was flagged and how it was resolved. The user never needs to request this.

Triple hook: Every script requires a visual hook + spoken hook + text hook. Generate 3 text hook variants (question / provocative statement / stakes framing).

Stock-based scarcity only: CTA scarcity must be stock-based ("before it runs out," "if you still see it in stock"). Never price-based.

Physical downward point at CTA: Must be noted in the script directions. Non-negotiable.

PubMed links must be clickable: All study references must use Markdown hyperlink format — [PMID XXXXXXXX](https://pubmed.ncbi.nlm.nih.gov/XXXXXXXX/) — never plain text PMIDs. This is required for the user to screenshot study titles for video overlays.

Banned phrase: Never use "zero skin stimuli index confirmed." Replace with "dermatologist-tested, confirmed safe for sensitive skin."

At the start of any script-writing session, read PRE_SESSION_BRIEF.md from the shared project files before writing. For high-volume sessions (4+ scripts) or new product categories, also read the full source docs: HOOK_FRAMEWORKS.md, SCRIPT_ARCHITECTURE_GUIDE.md, BUYER_PSYCHOLOGY_LEVERS.md, PHRASE_BANK.md, VISUAL_OVERLAY_PLAYBOOK.md, HEALTHCARE_HOOK_REFERENCE_GUIDE.md. A product intel doc must exist before any script is written.
```

---

## STEP 3 — Upload Shared Project Files

After creating the project, look for a **Shared Files** or **Project Files** section. Upload the following files from the existing task. These will be available in every session inside the project without re-uploading.

**Priority order — upload these first:**

| File | Why It's Needed |
|---|---|
| `PRE_SESSION_BRIEF.md` | The compressed pre-session reference — replaces reading 6 full docs |
| `MASTER_CONTEXT.md` | Full project history, rules, and context |
| `HOOK_FRAMEWORKS.md` | All 28 hook structures with rules |
| `SCRIPT_ARCHITECTURE_GUIDE.md` | All script rules including E and F |
| `BUYER_PSYCHOLOGY_LEVERS.md` | 11 conversion psychology levers |
| `PHRASE_BANK.md` | Verbatim lines and caption formulas |
| `VISUAL_OVERLAY_PLAYBOOK.md` | Overlay strategy and POST-PRODUCTION NOTES format |
| `HEALTHCARE_HOOK_REFERENCE_GUIDE.md` | Hook quick reference for all 24 hooks |

**Secondary files (upload if space allows):**

| File | Why It's Needed |
|---|---|
| `SCRIPT_LIBRARY.md` | Index of all scripts written and their status |
| `SCRIPT_PIPELINE.md` | Prioritized script queue |
| `CONTENT_PIPELINE.md` | Full content pipeline and filming status |
| `VIDEO_PERFORMANCE_LOG.md` | Performance data from first 22 videos |
| `SCRIPT_FEEDBACK_LOG.md` | All script changes and reasoning |
| `PRODUCT_RESEARCH_PROTOCOL.md` | How to conduct product deep dives |

**Product intel docs (upload all):**
- `product-intel/dr-melaxin-multibalm-intel.md`
- Any other product intel docs in the `product-intel/` folder

**Script files (upload as needed per session — not all at once):**
- Upload individual script files from `scripts/` folder when working on that product

---

## STEP 4 — How to Access the Files in a New Session

When you start a new task inside the project:
1. The 10 rules will already be active — no reading required
2. To read the brief, just say: **"Read PRE_SESSION_BRIEF.md"** — it will be in the shared files
3. To read any other doc, just name it — all shared files are accessible by filename

---

## STEP 5 — How to Test It

Start a new task inside the project and say:

> *"I want to write a script for [product]. Read PRE_SESSION_BRIEF.md first then let me know when you are ready."*

Compare the output to scripts written in the existing task. Key things to check:
- Did the rules fire automatically without being reminded?
- Did the quality checklist run without being asked?
- Were PubMed links clickable?
- Did the script start mid-thought with no preamble?
- Was the product reveal timing correct for the funnel stage?

---

## NOTES

- The existing task (this one) stays active and unchanged — all history, all files, all scripts remain here
- The new project is a parallel test — you are not migrating, just comparing
- If the project performs better, you can gradually shift script writing there
- If this task performs better, nothing changes and you have your answer

**Files location in existing task:** `/home/ubuntu/pharma-script-gen/`

---

*Guide created: July 19, 2026*
