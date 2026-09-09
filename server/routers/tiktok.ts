import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getVaultItemById } from "../db";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

export type HookVariant = {
  hookId: string;
  hookName: string;
  hookCategory: string;
  openingLine: string;
  fullScript: string;
};

export type TranscribeResult = {
  videoId: string;
  creatorHandle: string;
  fullTranscript: string;
  segments: TranscriptSegment[];
  durationSeconds: number;
  readingLevel: number;
  wordCount: number;
};

export type RewriteResult = {
  originalTranscript: string;
  pharmacistRewrites: HookVariant[];
  hardViolations: string[];    // Red — will get your video removed (corrected in rewrite)
  softCautions: string[];      // Yellow — borderline but common, FYI only (not corrected)
  complianceIssues: string[];  // Deprecated — kept for backward compat, empty array
  improvementSuggestions: string[];
  psychTriggers: string[];
};

export type IterateResult = {
  originalTranscript: string;
  level70: string;
  level20: string;
  level10: string;
  rationale70: string;
  rationale20: string;
  rationale10: string;
};

export type ABVariantsResult = {
  hookId: string;
  hookName: string;
  scriptBody: string;  // the body of the script (without the opening line)
  variantA: string;   // opening line variant A
  variantB: string;   // opening line variant B
  variantC: string;   // opening line variant C
  rationaleA: string;
  rationaleB: string;
  rationaleC: string;
};

export type BatchGenerateResult = {
  hookId: string;
  hookName: string;
  hookCategory: string;
  script: string;
  openingLine: string;
  qualityReview?: {
    initialPassed: boolean;
    initialFailedChecks: string[];
    verificationPassed: boolean;
    verificationFailedChecks: string[];
  };
};

export type ProductResearch = {
  primaryIngredients: string;
  mechanismOfAction: string;
  clinicalBacking: string;
  targetAudience: string;
  commonMistakeGap: string;
  productDifferentiator: string;
  comparisonPair: string;
  warningSigns: string[];
  dosingFacts: string;
  suppressedFact: string;
  patentedIngredientFlag: boolean;
  patentedIngredient: string | null;
};

// Citation returned from researchProduct() — quality-filtered, includes DOI/URL when available
export type Citation = {
  claim: string;          // The specific fact or finding being cited
  source: string;         // Journal name, institution, or publication
  year: number;           // Publication year
  pmid?: string;          // PubMed ID (e.g. "23919405")
  doi?: string;           // DOI string (e.g. "10.1186/1550-2783-10-36")
  url?: string;           // Direct link to abstract or full text
  confidence: 'high' | 'medium' | 'low'; // high = peer-reviewed with PMID/DOI, medium = credible source, low = general claim
};

// ScriptBrief: research facts saved back to vault after generation
export type ScriptBrief = {
  mechanism: string;
  gap: string;
  differentiator: string;
  dosingFacts: string;
  citations: Citation[];
  generatedAt: number; // Unix timestamp ms
};

// Generated visual from generateVisuals procedure
export type GeneratedVisual = {
  imageUrl: string;
  visualType: 'infographic' | 'citation-card' | 'pathway-diagram';
  caption: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractTikTokVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

// Detect TikTok short share URLs (mobile share links that redirect)
function isShortTikTokUrl(url: string): boolean {
  return /https?:\/\/(www\.tiktok\.com\/t\/|vm\.tiktok\.com\/|vt\.tiktok\.com\/)/.test(url);
}

// Check if URL is any valid TikTok URL (full or short)
function isValidTikTokUrl(url: string): boolean {
  return /https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com/.test(url);
}

function extractCreatorHandle(url: string): string {
  const match = url.match(/@([^/?]+)/);
  return match ? match[1] : "unknown";
}

function calculateReadingLevel(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 8;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch-Kincaid Grade Level
  const grade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  return Math.max(1, Math.min(16, Math.round(grade)));
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  const vowelGroups = word.match(/[aeiouy]+/g);
  return vowelGroups ? vowelGroups.length : 1;
}

// ─── TikTok Video Info via tikwm.com API (works in production, no yt-dlp needed) ──

interface TikwmResponse {
  code: number;
  msg: string;
  data?: {
    id: string;
    play: string;       // direct video URL (no watermark)
    music: string;      // background music URL
    duration: number;
    author?: {
      unique_id: string;
      nickname: string;
    };
  };
}

async function getTikTokVideoInfo(url: string): Promise<TikwmResponse> {
  const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TikTokDownloader/1.0)",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`tikwm API returned HTTP ${res.status}`);
  return res.json() as Promise<TikwmResponse>;
}

/**
 * Transcribe a TikTok video using the LLM file_url approach.
 * No local download or ffmpeg needed — the LLM receives the video URL directly.
 * Returns transcript text, video ID, creator handle, and duration.
 */
async function transcribeTikTokVideo(url: string): Promise<{
  fullTranscript: string;
  resolvedVideoId?: string;
  resolvedHandle?: string;
  durationSeconds: number;
}> {
  // Step 1: Get video info from tikwm.com to get direct video URL + metadata
  const info = await getTikTokVideoInfo(url);

  if (info.code !== 0 || !info.data) {
    const msg = info.msg || "Unknown error";
    if (msg.toLowerCase().includes("private")) {
      throw new Error("This video is private. Please use a public TikTok video.");
    }
    throw new Error(`Could not retrieve video info. Make sure the video is public and try again. (${msg})`);
  }

  const { id: resolvedVideoId, play: videoUrl, author, duration } = info.data;
  const resolvedHandle = author?.unique_id;

  // Step 2: Transcribe directly via LLM file_url (no download, no ffmpeg, works in production)
  const response = await invokeLLM({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Transcribe this TikTok video word for word. Output ONLY the spoken words — no timestamps, no labels, no commentary. Include every word exactly as spoken."
          },
          {
            type: "file_url" as const,
            file_url: {
              url: videoUrl,
              mime_type: "video/mp4" as const,
            }
          }
        ]
      }
    ],
  });

  const fullTranscript = response?.choices?.[0]?.message?.content;
  if (!fullTranscript || typeof fullTranscript !== "string") {
    throw new Error("Failed to transcribe video. Please try again.");
  }

  return {
    fullTranscript: fullTranscript.trim(),
    resolvedVideoId,
    resolvedHandle,
    durationSeconds: duration || 0,
  };
}

// ─── Hook Framework for LLM ───────────────────────────────────────────────────
// Used by: rewrite, iterate, generateABVariants procedures.
// batchGenerate uses BATCH_HOOK_FRAMEWORKS (the full section-by-section reference).

const HOOK_FRAMEWORK = `
You are an expert TikTok Shop script writer for a licensed pharmacist (PharmD). 
The pharmacist's brand positioning is: "From a Pharmacist" — a trusted, credentialed health authority who simplifies complex science into actionable advice and helps people make better supplement choices.

PHARMACIST CREDENTIAL SWAPS (always use these instead of original creator credentials):
- "As a doctor" → "As a pharmacist"
- "As a physician" → "As a pharmacist" 
- "As a nurse" → "As a pharmacist"
- "I'm a cell biologist" → "As a pharmacist"
- "From a doctor" → "From a Pharmacist"
- Any other credential → "As a pharmacist" or "From a Pharmacist"

LANGUAGE RULES:
- Simplify science: always follow a clinical term with a plain-English translation (e.g., "NAD — basically the fuel your cells run on")
- Use conversational, run-on sentence style: "and", "but", "so" to connect ideas naturally
- Reading level should be Grade 8-10 (accessible but not dumbed down)
- Misdirection technique where appropriate: correct an overclaim to build credibility (e.g., "Everyone says this works for 6 months but honestly it works for about 3 — and here's why that's still incredible")

TIKTOK SHOP COMPLIANCE — NEVER include:
- Disease cure claims ("cures", "treats", "heals" specific diseases)
- Guaranteed results ("will definitely", "guaranteed to")  
- Prescription drug comparisons
- Before/after medical claims
- FDA approval claims unless verified

THE 13 HOOK FRAMEWORKS (use these to generate hook variants):
1. After-1-Month: "I took [product] for 30 days straight and here's what actually happened..."
2. Instruction-Correction: Choose one of 5 distinct verbal opening styles based on what fits the content best:
   a) Aggressive: "If you are taking [product], you are probably taking it wrong. Here is the right way to do it."
   b) Instructional: "How to take [product] the right way — because most people are not doing this correctly."
   c) Empathy: "If you are taking [product] and wondering why it is not working, you may be taking it wrong."
   d) Authority: "As a pharmacist, here is exactly how I tell my patients to take [product] — and it makes a real difference."
   e) Audience-Callout (dual-audience): "So you are taking [product], but you are not seeing [SPECIFIC BENEFIT 1] or [SPECIFIC BENEFIT 2]. Let me tell you what is going on — and here is how to take it the right way." (Stops both current users AND non-users who want those benefits)
3. Symptom-Checklist: "If you have [symptom 1], [symptom 2], or [symptom 3] — this is why..."
4. Warning-Signs: "Stop taking [product] if you notice any of these signs..."
5. Comparison-Showdown: "[Product A] versus [Product B]. Which one is better? Let's get into what each of these does so you can decide which one is better for you." (Name both products first, credential after, ingredient-by-ingredient breakdown, recommend by use case not overall winner)
6. Authority-Breakdown: "As a pharmacist, here's the one supplement I actually recommend for [benefit]..."
7. Forbidden-Knowledge: "The medical industry doesn't want you to know this about [product]..."
8. Age-Trigger: "If you're over [age], your body is doing this right now and [product] can help..."
9. Dosing-Protocol: "The exact dose of [product] you should take based on your age and goals..."
10. Science-Simplified: "Here's what [product] actually does inside your body — in plain English..."
11. Storytime: "I had a patient come in last week asking about [symptom] — here's what I told them..."
12. Myth-Busting: "Stop believing this myth about [product] — as a pharmacist here's the truth..."
13. Number-List: "3 reasons why [product] changed everything for my patients over 40..."
14. How-Do-You-Know: "How do you know if you have [low/declining CONDITION]? Let's talk about it because I've been a pharmacist for over 18 years and I know what I'm talking about." (Diagnostic question + 4-6 symptom list + root cause + gap + product as solution)

INSTANT GRATIFICATION PRINCIPLE (apply to every script regardless of hook):
Every script must deliver at least one moment of genuine value to the viewer BEFORE the product is introduced. The viewer should feel smarter, more informed, or validated just from watching — independent of whether they buy. This is what earns the right to sell. Examples:
- Drop a specific fact or statistic upfront: "NAD+ drops 50% by age 40 — most people have no idea"
- Correct a common misconception: "Everyone thinks you need 1000mg but the research actually shows 250mg is the sweet spot"
- Give a practical insight: "The reason most magnesium supplements don't work is because of the wrong form — here's what to look for"
This moment should feel like the viewer got something valuable even if they scroll past the CTA.

VISUAL CUE INSTRUCTIONS:
For every script, include bracketed [VISUAL: ...] stage directions at key moments. These are brief production notes for what to show on camera. Place them inline with the script text where the visual should appear.
Examples:
- [VISUAL: Hold up bottle, point to ingredient label]
- [VISUAL: Graph showing NAD+ decline with age]
- [VISUAL: Screenshot of 5-star reviews]
- [VISUAL: Point to yourself, then hold up 2 fingers]
- [VISUAL: Before/after energy level graphic]
- [VISUAL: Close-up of supplement facts panel]
Visual cues should appear 3-5 times per script at natural transition points. Keep them short (under 8 words each).

VISUAL OVERLAY SUGGESTIONS (suggest these instead of text overlays):
- Graph showing the relevant metric declining/improving with age
- Product image or bottle shot
- Screenshot of reviews
- Graphic showing benefits list
- Before/after symptom comparison graphic
- Scientific study headline screenshot
`;

// ─── Batch Generation: Full Section-by-Section Framework Reference ────────────
// Hook frameworks are defined in HOOK_FRAMEWORKS.md — edit that file, not this one.
// This constant is loaded at runtime from the project root HOOK_FRAMEWORKS.md.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BATCH_HOOK_FRAMEWORKS_START_MARKER = null; // kept for git blame reference
const BATCH_HOOK_FRAMEWORKS = fs.readFileSync(
  // In dev: __dirname = server/routers/, so ../../ = project root
  // In prod: __dirname = dist/, so the .md files are copied there by the build script
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "HOOK_FRAMEWORKS.md")
    : path.join(__dirname, "../../HOOK_FRAMEWORKS.md"),
  "utf-8"
);

// ─── Script Architecture Guide for LLM ───────────────────────────────────────
// Universal structural rules from 5-creator synthesis (84 videos, ~$4.3M GMV).
// Loaded at runtime from SCRIPT_ARCHITECTURE_GUIDE.md — edit that file, not here.
const SCRIPT_ARCHITECTURE_GUIDE = fs.readFileSync(
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "SCRIPT_ARCHITECTURE_GUIDE.md")
    : path.join(__dirname, "../../SCRIPT_ARCHITECTURE_GUIDE.md"),
  "utf-8"
);

// ─── Buyer Psychology Levers for LLM ─────────────────────────────────────────
// 11 conversion psychology levers from 5-creator synthesis (84 videos, ~$4.3M GMV).
// Loaded at runtime from BUYER_PSYCHOLOGY_LEVERS.md — edit that file, not here.
const BUYER_PSYCHOLOGY_LEVERS = fs.readFileSync(
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "BUYER_PSYCHOLOGY_LEVERS.md")
    : path.join(__dirname, "../../BUYER_PSYCHOLOGY_LEVERS.md"),
  "utf-8"
);

/* ---- LEGACY INLINE CONTENT REMOVED — now loaded from HOOK_FRAMEWORKS.md at runtime
   See: const BATCH_HOOK_FRAMEWORKS = fs.readFileSync(...) above.
*/

// ─── Phrase Bank — Verbatim lines from 5-creator transcript analysis ──────────
// Loaded at runtime from PHRASE_BANK.md — edit that file, not here.
// Contains gap openers, transition phrases, objection handles, and rehook phrases
// extracted from 84 videos / ~$4.3M GMV across 5 creators.
// NOT injected in full — use buildPhraseBankNote() to extract relevant sections.
const PHRASE_BANK_RAW = fs.readFileSync(
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "PHRASE_BANK.md")
    : path.join(__dirname, "../../PHRASE_BANK.md"),
  "utf-8"
);

/**
 * Extracts a compact, prompt-ready phrase bank note from PHRASE_BANK.md.
 * Injects only UNIVERSAL-validated patterns plus hook-specific sections.
 * Keeps token weight low while giving the LLM the highest-confidence lines.
 *
 * @param hookId - the hook being generated (used to select relevant sections)
 * @param scriptLengthWords - estimated word count (rehook injected if > 120 words)
 */
function buildPhraseBankNote(hookId?: string, scriptLengthWords = 180): string {
  // Always inject: UNIVERSAL gap openers, transitions, objection handles
  const universalGapOpeners = [
    '"But here\'s what most people don\'t know." — use to open the gap section',
    '"But what most people don\'t realize" — variation',
    '"The problem is most people are depleted" — for nutrient deficiency hooks',
    '"stress hormone cortisol goes way up, and most people are already depleted" — mechanism + gap combined',
  ];

  const universalTransitions = [
    '"The one I always recommend is [brand] because this is third party tested" — personal recommendation pivot',
    '"I personally take this one." — strongest trust signal',
    '"So if you want to grab this, I\'m going to leave the link below." — standard CTA pivot',
    '"And that\'s why I always recommend a multi-complex [ingredient] supplement" — mechanism → product category',
  ];

  const universalObjectionHandles = [
    '"It\'s made here in the USA, third-party tested" — quality proof (use in every script)',
    '"Very clean formula" — purity claim',
    '"It\'s lab tested, made in the US, so you can get all of the benefits." — benefit-connected quality proof',
  ];

  // Hook-specific additions
  const hookSpecificLines: string[] = [];

  const isInstructionHook = hookId?.includes('instruction') || hookId?.includes('correction');
  const isSymptomHook = hookId?.includes('symptom') || hookId?.includes('checklist') || hookId?.includes('warning');
  const isSuppressedHook = hookId?.includes('suppressed') || hookId?.includes('forbidden') || hookId?.includes('doctor');
  const isComparisonHook = hookId?.includes('comparison') || hookId?.includes('trend') || hookId?.includes('verdict');

  if (isInstructionHook) {
    hookSpecificLines.push(
      '"Here\'s the thing" — confrontational opener implying the viewer has been misled (use for instruction-correction hooks)',
      '"Most people are taking [product] wrong" — wasted-effort gap opener',
      '"you chewed it for a few seconds and swallowed — when you do that, you bypass the buccal absorption" — example of naming the specific mistake',
    );
  }

  if (isSymptomHook) {
    hookSpecificLines.push(
      '"If you have [symptom 1], [symptom 2], or [symptom 3], this video is for you" — symptom list opener',
      '"The reason you have [symptom] is because [mechanism]" — cause reveal after symptom list',
    );
  }

  if (isSuppressedHook) {
    hookSpecificLines.push(
      '"What your doctor doesn\'t tell you about [ingredient]" — suppressed knowledge opener',
      '"The part most people don\'t expect is that [ingredient] helps protect [body part] from [damage]" — unexpected benefit as gap',
    );
  }

  if (isComparisonHook) {
    hookSpecificLines.push(
      '"But here\'s the thing, [ingredient A] is more bioavailable than [ingredient B]" — direct comparison correction',
      '"Why not the cheaper alternative? Because [mechanism difference]" — objection handle for comparison hooks',
    );
  }

  // Rehook: inject only for longer scripts
  const rehookLines = scriptLengthWords > 120 ? [
    '"But here\'s where it gets interesting" — mid-video retention pivot (use at ~30-second mark)',
    '"But here\'s what most people don\'t know" — rehook variant',
    '"And this is where it gets really important" — credential rehook',
  ] : [];

  const sections: string[] = [
    `\n---\n## PHRASE BANK — Proven Sentence Structures (5-creator, ~$4.3M GMV)`,
    `Use these as structural templates — adapt to your product but preserve the sentence architecture.`,
    `\n### Gap Section Openers (UNIVERSAL — confirmed in all 5 creators)`,
    ...universalGapOpeners.map(l => `- ${l}`),
    ...(hookSpecificLines.length > 0 ? [`\n### Hook-Specific Lines (${hookId || 'general'})`] : []),
    ...hookSpecificLines.map(l => `- ${l}`),
    `\n### Transition Phrases (UNIVERSAL)`,
    ...universalTransitions.map(l => `- ${l}`),
    `\n### Objection Handle Lines (UNIVERSAL — use at least one per script)`,
    ...universalObjectionHandles.map(l => `- ${l}`),
    ...(rehookLines.length > 0 ? [`\n### Rehook Phrases (inject at ~30-second mark for scripts > 45 seconds)`] : []),
    ...rehookLines.map(l => `- ${l}`),
    `\n### Caption Formula (confirmed: rphreviews 34 captions, 100% consistent)`,
    `- Structure: [Problem/symptom statement] + [@Brand mention] + [Benefit claim]. Just a quick disclaimer: While I'm a licensed pharmacist, this is not medical advice.`,
    `- Lead with symptom, never with product name. Include brand @mention. Disclaimer in every caption.`,
    `---`,
  ];

  return sections.join('\n');
}

// ─── Product Research Helper ──────────────────────────────────────────────────
// Runs before batchGenerate to extract product intelligence the LLM can use
// to write specific, credible scripts instead of generic supplement copy.

export async function researchProduct(
  productName: string,
  productDescription?: string,
  keyBenefit?: string,
  productLink?: string,
  vaultContext?: string  // Optional: pre-loaded vault analysis text to inject
): Promise<ProductResearch & { citations: Citation[] }> {
  const productContext = [
    `Product Name: ${productName}`,
    productDescription ? `Description: ${productDescription}` : "",
    keyBenefit ? `Key Benefit: ${keyBenefit}` : "",
    productLink ? `Product Link/URL: ${productLink}` : "",
    vaultContext ? `\nPRE-LOADED VAULT ANALYSIS (use these verified facts as primary source):\n${vaultContext}` : "",
  ].filter(Boolean).join("\n");

  const prompt = `You are a pharmacist and supplement researcher. Your job is to extract the specific, verifiable facts a pharmacist would need to write a credible TikTok education script — not generic praise, not vague claims, but the exact clinical details that make a pharmacist's recommendation trustworthy.

PRODUCT INFORMATION:
${productContext}

For each field below, you MUST provide a specific, concrete answer. Vague answers like "it supports health" or "it works well" are NOT acceptable. If you do not have a specific fact, infer the most accurate answer based on established science for this ingredient class. Do not hedge with "may" or "might" unless the science genuinely requires it.

---

1. PRIMARY INGREDIENT(S)
The main active ingredient(s) with their specific form/type.
BAD: "magnesium" | GOOD: "magnesium glycinate — the chelated form bound to glycine for superior absorption"
BAD: "creatine" | GOOD: "creatine monohydrate — the most studied form, used in 95% of clinical trials"

2. MECHANISM OF ACTION
How does this ingredient work at the cellular or biochemical level? What specific process does it support?
BAD: "supports energy" | GOOD: "replenishes phosphocreatine stores in muscle cells, restoring ATP during high-intensity exercise — this is why strength and power output improve"
BAD: "helps with sleep" | GOOD: "binds to GABA receptors and reduces cortisol, which is why it shortens the time to fall asleep and reduces nighttime waking"
Must be 2-3 sentences. Plain English but mechanistically specific.

3. CLINICAL BACKING
What does the research actually show? Include specific numbers, percentages, or a named study if known.
BAD: "studies show it works" | GOOD: "a 2013 Journal of the ISSN study (PMID 23919405) found post-workout creatine produced significantly greater muscle and strength gains than pre-workout"
BAD: "clinically proven" | GOOD: "NAD+ levels decline approximately 50% between age 20 and 60 — this is documented in peer-reviewed literature"

4. TARGET AUDIENCE
Who benefits most? Name them by their symptom, age, or situation — not by demographic.
BAD: "adults who want to be healthy" | GOOD: "people who work out consistently but still feel beat up the next day, especially those over 35 where connective tissue recovery slows"

5. COMMON MISTAKE / GAP (CRITICAL FIELD)
This is the most important field. What is the single most common mistake that undermines this product's effectiveness? It must be:
- Specific (not "people don't take it right")
- Clinically accurate
- Something the viewer would not already know
- Something that makes the pharmacist's advice feel essential
BAD: "most people take the wrong amount" | GOOD: "creatine monohydrate only handles the muscle side of recovery — it does nothing for the connective tissue (tendons, ligaments, cartilage) that takes the same beating every workout. Most people on creatine still feel beat up because they are only fixing half the problem."
BAD: "people take magnesium at the wrong time" | GOOD: "most people take magnesium oxide — the form in almost every cheap supplement — which has only a 4% absorption rate. The form that actually works is magnesium glycinate, which absorbs at over 80%."
This field drives the entire education section of the script. It must be a specific, surprising, clinically accurate gap.

6. PRODUCT DIFFERENTIATOR (CRITICAL FIELD)
What makes THIS specific product or brand stand out vs. a generic alternative? Must be a specific, verifiable claim — not marketing language.
BAD: "high quality" | GOOD: "NeoCell has been the #1 collagen brand in the US for years — collagen is what they built their reputation on, not an add-on"
BAD: "clinically dosed" | GOOD: "provides the clinical dose of 500mg NMN — most competitors use 100-250mg, which is below the threshold used in human studies"
BAD: "third-party tested" | GOOD: "third-party tested by NSF — the same certification required for professional athletes"
If the brand differentiator is not known from the product information, infer the most likely differentiator based on the brand's known reputation or the product's ingredient profile.

7. COMPARISON PAIR
What is the most natural comparison ingredient or product type for this?
Example: "Creatine Monohydrate vs Creatine HCL", "Magnesium Glycinate vs Magnesium Oxide", "NMN vs NR"

8. WARNING SIGN SYMPTOMS
3-4 specific, relatable symptoms that indicate someone would benefit from this product. These must be symptoms the viewer can recognize in themselves.
BAD: ["fatigue"] | GOOD: ["still sore 2-3 days after a workout", "joints ache after training", "strength plateaued despite consistent training", "slow recovery"]

9. DOSING FACTS
Specific, actionable dosing information. Timing, amount, what to take it with, what to avoid.
BAD: "take as directed" | GOOD: "take 5g post-workout (not pre-workout) — a 2013 study showed post-workout timing produces significantly greater strength gains. Take with a carbohydrate source to spike insulin and drive creatine into muscle cells."

10. SUPPRESSED / OVERLOOKED FACT
One thing most people genuinely do not know about this ingredient — something counterintuitive or surprising that a pharmacist would know but a casual user would not.
BAD: "it is important" | GOOD: "most people think you need to do a loading phase with creatine — 20g per day for a week — but research shows a consistent 3-5g daily dose reaches the same saturation level in 28 days with none of the GI side effects"

---

11. PATENTED INGREDIENT FLAG (CRITICAL)
Scan the product information for any ingredient with a ™ or ® trademark symbol (e.g., Oligonol®, Sunfiber®, Volufiline™, Ashwagandha KSM-66®, TeaCrine®). If ANY trademarked ingredient is found:
- Name it explicitly in the suppressedFact field
- Explain what the trademark means: patented ingredients have clinical trial data behind them — that is why the patent exists
- Include the mechanism that the patent is built around (e.g., Oligonol® = nitric oxide production via lychee polyphenol oligomerization)
- Set patentedIngredient to the ingredient name and patentedIngredientFlag to true in the JSON output
- Note: the creator should NOT say the brand name of the patented ingredient on camera — say "patented [ingredient type] extract" instead
If NO trademarked ingredient is found, set patentedIngredientFlag to false.

---

12. CITATIONS (quality-filtered)
Provide 2-4 specific study citations that support the key claims above. Each citation must be a real, verifiable source.
QUALITY RULES:
- confidence 'high': peer-reviewed study with known PMID or DOI — include both if available
- confidence 'medium': credible institution, government body, or well-known journal without a specific PMID
- confidence 'low': general claim or industry report — include these ONLY if no better source exists
DO NOT invent PMIDs or DOIs. If you do not know the exact PMID/DOI, leave those fields out and set confidence to 'medium'.
DO NOT include low-confidence citations if you have 2+ high/medium citations available.

---

Return a JSON object with these exact keys:
{
  "primaryIngredients": "specific form and type",
  "mechanismOfAction": "2-3 sentences, cellular/biochemical level, plain English",
  "clinicalBacking": "specific study, number, or finding — not generic claims",
  "targetAudience": "named by symptom or situation, not demographic",
  "commonMistakeGap": "the single most specific, surprising gap — this is the most important field",
  "productDifferentiator": "specific, verifiable brand or product claim",
  "comparisonPair": "ingredient A vs ingredient B",
  "warningSigns": ["specific symptom 1", "specific symptom 2", "specific symptom 3", "specific symptom 4"],
  "dosingFacts": "specific timing, amount, and co-factors",
  "suppressedFact": "one counterintuitive or surprising clinical fact — if a patented ingredient is present, this field MUST name it and explain the mechanism behind the patent",
  "patentedIngredientFlag": false,
  "patentedIngredient": "name of the trademarked ingredient, or null if none found",
  "citations": [
    {
      "claim": "the specific fact this citation supports",
      "source": "journal or institution name",
      "year": 2013,
      "pmid": "23919405",
      "doi": "10.1186/1550-2783-10-36",
      "url": "https://pubmed.ncbi.nlm.nih.gov/23919405/",
      "confidence": "high"
    }
  ]
}`;

  const result = await invokeLLM({
    messages: [
      { role: "system", content: "You are a pharmacist and supplement researcher. Always respond with valid JSON only." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    max_tokens: 2000,
  });

  const content = result.choices[0]?.message?.content;
  if (!content || typeof content !== "string") throw new Error("Product research LLM returned empty response");

  const parsed = JSON.parse(content) as ProductResearch & { citations?: Citation[] };
  // Quality-filter citations: keep only high/medium confidence, drop low if we have enough
  const rawCitations: Citation[] = Array.isArray(parsed.citations) ? parsed.citations : [];
  const highMedium = rawCitations.filter(c => c.confidence === 'high' || c.confidence === 'medium');
  const citations: Citation[] = highMedium.length >= 2 ? highMedium : rawCitations.slice(0, 4);
   return { ...parsed, citations };
}

// ── Section Assembly Helper ──────────────────────────────────────────────────────────────────────────
// Assembles the fullScript from labeled sections in the correct order:
// Section order is determined per-hookId via HOOK_SECTION_ORDERS map.
// Preserves [VISUAL: ...] cues from the LLM's fullScript that aren't already in sections.
// Falls back to llmFullScript if all sections are empty.

export type AssembleSectionsInput = {
  verbalHook: string;
  problem: string;
  authorityPivot: string;
  mechanism: string;
  cta: string;
  misdirection: string | undefined;
  llmFullScript: string;
  useMisdirection: boolean;
  hookId?: string;
};

// Hook-aware section order map.
// Each entry lists the section keys in the correct display order for that hook.
// Sections not present in the LLM output will be skipped gracefully.
const HOOK_SECTION_ORDERS: Record<string, Array<'verbalHook' | 'problem' | 'authorityPivot' | 'mechanism' | 'misdirection' | 'cta'>> = {
  // Hook → Authority (1 sentence, right after hook) → Gap/Problem → Education/Mechanism → CTA
  // Authority must come immediately after hook — it is the credibility that makes the correction land
  'instruction-correction':  ['verbalHook', 'authorityPivot', 'problem', 'mechanism', 'cta'],

  // Hook/Symptom List → Problem/Cause → Product+Solution → Education/Why It Works → CTA
  // Authority is visual badge only — no verbal authority pivot needed
  // Product introduced EARLY (first third), education comes after
  'symptom-checklist':       ['verbalHook', 'problem', 'mechanism', 'cta'],

  // Hook → Problem/What's Hidden → Education/The Truth → CTA
  // No verbal authority — the information itself is the authority signal
  'suppressed-knowledge':    ['verbalHook', 'problem', 'mechanism', 'cta'],

  // Hook → Authority (stated immediately) → Pain Point/Why I Started → Education/Mechanism → CTA
  'after-1-month':           ['verbalHook', 'authorityPivot', 'problem', 'mechanism', 'cta'],

  // Hook → Authority → Tear-Down of Common Option → Better Alternative/Mechanism → CTA
  'trend-or-trash':          ['verbalHook', 'authorityPivot', 'problem', 'mechanism', 'cta'],

  // Hook → Authority → Education/What It Is (heavy) → Gap/Who This Helps → CTA
  // Tutorial style: authority early, education is the bulk, gap/problem near end
  'nad-dosing':              ['verbalHook', 'authorityPivot', 'mechanism', 'problem', 'cta'],

  // Hook (bold claim) → Education/Science → Gap/What Most Miss → CTA
  // No separate authority — the bold hook IS the authority signal for this style
  'age-reversal':            ['verbalHook', 'mechanism', 'problem', 'cta'],

  // Hook/Both Products Named → Authority (after product names, never before) → Mechanism/Breakdown → Problem/Differentiation → CTA
  'comparison':              ['verbalHook', 'authorityPivot', 'mechanism', 'problem', 'cta'],

  // Diagnostic Question Hook (authority embedded in hook) → Problem/Symptom List → Mechanism/Root Cause → CTA
  // Authority is woven into the hook line — no separate authorityPivot section
  'how-do-you-know':         ['verbalHook', 'problem', 'mechanism', 'cta'],

  // Hook → Problem/Baseline+Consequence → Mechanism/Cause → CTA
  // Authority is visual badge only — no verbal authority pivot
  'warning-signs':           ['verbalHook', 'problem', 'mechanism', 'cta'],

  // Hook → Authority → Problem/Why OTC Falls Short → Mechanism/Better Alternative → CTA
  'pill-bottle-alternative': ['verbalHook', 'authorityPivot', 'problem', 'mechanism', 'cta'],

  // Patient Story Hook → Problem/What Patient Experienced → Authority/What I Investigated → Mechanism/What I Found → CTA
  // Story first, credential woven in as "what I investigated" — authority mid-script
  'storytime':               ['verbalHook', 'problem', 'authorityPivot', 'mechanism', 'cta'],

  // Myth Statement → Authority → Problem/Why Myth Exists → Mechanism/Real Science → CTA
  'myth-busting':            ['verbalHook', 'authorityPivot', 'problem', 'mechanism', 'cta'],

  // Number Hook → Authority → Mechanism/Reasons List → CTA
  'number-list':             ['verbalHook', 'authorityPivot', 'mechanism', 'cta'],

  // Form Differentiation Hook → Authority → Problem/Bad Form → Mechanism/Right Form → CTA
  'ingredient-form':         ['verbalHook', 'authorityPivot', 'problem', 'mechanism', 'cta'],

  // Drug Callout → Authority → Problem/Why Drug Is Problematic → Mechanism/Natural Alternative → CTA
  'instead-of-drug':         ['verbalHook', 'authorityPivot', 'problem', 'mechanism', 'cta'],

  // Side Effect Hook → Authority → Problem/What SE Is + Why Happens → Mechanism/Supplement Solution → CTA
  'medication-side-effect':  ['verbalHook', 'authorityPivot', 'problem', 'mechanism', 'cta'],
};

// Default order used when hookId is not recognized or not provided
const DEFAULT_SECTION_ORDER: Array<'verbalHook' | 'problem' | 'authorityPivot' | 'mechanism' | 'misdirection' | 'cta'> =
  ['verbalHook', 'problem', 'authorityPivot', 'mechanism', 'cta'];

export function assembleScriptFromSections(input: AssembleSectionsInput): string {
  const {
    verbalHook, problem, authorityPivot, mechanism, cta,
    misdirection, llmFullScript, useMisdirection, hookId,
  } = input;

  const visualCueRegex = /\[VISUAL:[^\]]*\]/g;

  // Extract visual cues from the LLM's fullScript that aren't already in the sections
  const sectionText = [verbalHook, problem, authorityPivot, mechanism, cta].join(" ");
  const llmVisualCues: string[] = llmFullScript.match(visualCueRegex) || [];
  const sectionVisualCues: string[] = sectionText.match(visualCueRegex) || [];
  const extraVisualCues: string[] = llmVisualCues.filter(cue => !sectionVisualCues.includes(cue));

  // Resolve the correct section order for this hook
  let sectionOrder = (hookId && HOOK_SECTION_ORDERS[hookId]) ? HOOK_SECTION_ORDERS[hookId] : DEFAULT_SECTION_ORDER;

  // If misdirection is active and not already in the section order, inject it before cta
  if (useMisdirection && misdirection && !sectionOrder.includes('misdirection')) {
    const ctaIdx = sectionOrder.indexOf('cta');
    const insertAt = ctaIdx >= 0 ? ctaIdx : sectionOrder.length;
    sectionOrder = [
      ...sectionOrder.slice(0, insertAt),
      'misdirection',
      ...sectionOrder.slice(insertAt),
    ];
  }

  // Build the section map
  const sectionMap: Record<string, string> = {
    verbalHook,
    problem,
    authorityPivot,
    mechanism,
    misdirection: (useMisdirection && misdirection) ? misdirection : "",
    cta,
  };

  // Build ordered section list using the hook-specific order
  const assembledSections: string[] = sectionOrder
    .map(key => sectionMap[key] || "")
    .filter(Boolean);

  // Inject extra visual cues at natural section boundaries
  if (extraVisualCues.length > 0) {
    const insertPoints = [1, Math.max(0, assembledSections.length - 2), assembledSections.length - 1];
    extraVisualCues.forEach((cue, i) => {
      const insertAt = Math.min(insertPoints[i] ?? insertPoints[insertPoints.length - 1], assembledSections.length - 1);
      assembledSections.splice(insertAt, 0, cue);
    });
  }

  const assembled = assembledSections.join(" ").replace(/\s{2,}/g, " ").trim();
  // Fall back to LLM fullScript only if assembly produces empty output
  return assembled || llmFullScript;
}

// ── Quality Check Helper ──────────────────────────────────────────────────────────────────────────
// Runs after generation to verify each script meets structural requirements.
// Returns the script unchanged if it passes, or a corrected version if it fails.

export async function qualityCheckScript(
  script: string,
  hookId: string,
  hookName: string,
  productName: string
): Promise<{ script: string; passed: boolean; failedChecks: string[] }> {
  const prompt = `You are a TikTok script quality reviewer for a pharmacist creator. Your job is to catch scripts that are vague, generic, or missing required structural elements — and fix them.

Product: ${productName}
Hook: ${hookName} (${hookId})

SCRIPT TO REVIEW:
"""
${script}
"""

Check the script against ALL of the following requirements. Be strict — a vague answer that technically exists but provides no real information counts as a FAIL.

---

CHECK 1 — SPECIFIC GAP (Required)
Does the script contain a specific, clinically accurate gap statement — something most people are doing wrong or missing that undermines results?
PASS: "creatine only handles the muscle side — it does nothing for the connective tissue (tendons, ligaments, cartilage)"
FAIL: "most people are taking it wrong" or "they are not doing this correctly" (too vague — no specific fact)
FAIL: "the problem is most people are taking it at the wrong time, in the wrong amount, or without the things that help it work" (lists possibilities without committing to a specific gap)

CHECK 2 — SPECIFIC BRAND CLOSE (Required when product is named)
Does the script contain a specific, verifiable reason why THIS product/brand vs. a generic alternative?
PASS: "NeoCell has been the #1 collagen brand in the US for years — collagen is what they built their reputation on"
PASS: "this provides the clinical dose of 500mg NMN — most competitors use 100-250mg"
FAIL: "I feel good about sharing this with my patients" (endorsement without a specific differentiator)
FAIL: "it is one of the ones I actually recommend" (no specific claim)

CHECK 3 — SPECIFIC MECHANISM OF ACTION (Required)
Does the education section explain HOW the ingredient works at a cellular or biochemical level — not just WHAT it does?
PASS: "creatine replenishes the phosphocreatine your muscles burn during intense exercise, which is why it improves strength and power output"
FAIL: "creatine is one of the most studied supplements for strength and performance" (describes reputation, not mechanism)
FAIL: "it provides an excellent dose" (product description, not mechanism)

CHECK 4 — ON-SCREEN VISUAL CUES (Required)
Does the script include at least 2 bracketed [VISUAL: ...] stage directions for on-screen graphics, infographics, or product shots?
PASS: "[VISUAL: Infographic showing what creatine does in muscle cells]" and "[VISUAL: Product label showing 5g creatine + 3g collagen]"
FAIL: No [VISUAL: ...] tags present

CHECK 5 — SPECIFIC DOSING OR USAGE TIP (Required)
Does the script give at least one specific, actionable usage instruction — not a vague suggestion?
PASS: "take it after your workout, not before — a 2013 study showed post-workout timing produces significantly greater strength gains"
FAIL: "a smaller amount taken consistently tends to work better" (vague — no specific amount, no specific timing, no study reference)
FAIL: "take it the right way" (no instruction given)

CHECK 6 — DIRECT CTA (Required)
Does the script end with a direct cart-tap CTA?
PASS: "Link is in my shop below. Tap the cart and check the reviews."
FAIL: "Go check the reviews and decide for yourself. If the cart is still showing, it is still available." (hedging language — implies scarcity that is not real)

CHECK 7 — WORD COUNT (Required)
Is the script 150-220 words?

CHECK 8 — RULE E: NO SENTENCE REDUNDANCY (Required)
Read every spoken sentence against the immediately preceding sentence AND the script's prior core points. Every sentence must introduce a new fact, new buyer payoff, new objection answer, new proof point, new retention question, or move directly to the CTA.
FAIL: repeating an ingredient/dose, a safety disclaimer, the hook premise, a credential, or a competitor caveat in different words.
FAIL: spending a second beat restating a generic category qualification when it does not add a decision rule or improve the brand close.
PASS: using a deliberate short callback only when it opens a new loop and pays off with new information.

CHECK 9 — PRODUCT-ADVANCEMENT / BRAND-HIERARCHY (Required)
Does the script give the viewer at least two distinct, specific, verifiable reasons to choose THIS product that are tied to different buyer payoffs? Does each major section move toward the product's actual purchase case instead of filling time with generic category education?
FAIL: a product close that only says it is "quality," "a good fit," or "one I recommend."
FAIL: repeating one dose, one caution, or one generic category fact while omitting the product's other differentiators, quality signals, sensory/format advantages, or buyer objections.
PASS: separate differentiators, each with a distinct payoff, supported by a label, source, or research fact supplied in the product context.

CHECK 10 — AUTHORITY AND OBJECTION DISCIPLINE (Required)
Does authority follow the selected framework rather than recur as filler? A visible credential may do the job; use one verbal credential where the framework calls for it, and do not repeat the same credential unless it introduces a stronger claim. Include a safety/interaction point only when it is directly relevant, specific, and advances a real buyer objection; it must never replace the product's key selling reason or become the CTA.

---

If the script passes ALL checks, return it UNCHANGED with passed: true.

If the script fails ANY check, you MUST rewrite ONLY the failing sections to fix them. Do not change sections that passed. The corrected script must:
- Add the specific gap if missing (use the product name and ingredient to infer the most accurate gap)
- Add the specific brand close if missing (use the product name to infer the most likely differentiator)
- Add mechanism of action if missing (use the ingredient to infer the cellular mechanism)
- Add [VISUAL: ...] stage directions if missing
- Replace vague dosing with a specific instruction
- Fix the CTA if it contains hedging language
- Cut or merge every Rule E duplicate; do not replace it with another generic caveat
- Restore distinct, source-backed product differentiators and their buyer payoffs where the brand close is generic or one-note
- Remove repeated credential or safety language unless it has a distinct framework-required job

Return JSON:
{
  "passed": true/false,
  "failedChecks": ["Check 1: ...", "Check 2: ..."],
  "script": "the original script if passed, or the corrected script if failed"
}`;

  const result = await invokeLLM({
    messages: [
      { role: "system", content: "You are a TikTok script quality reviewer. Always respond with valid JSON only." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    max_tokens: 3000,
  });

  const content = result.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    return { script, passed: false, failedChecks: ["Quality reviewer returned no usable output; manual review is required."] };
  }

  try {
    const parsed = JSON.parse(content);
    return {
      script: (parsed.script && typeof parsed.script === "string") ? parsed.script : script,
      passed: Boolean(parsed.passed),
      failedChecks: Array.isArray(parsed.failedChecks) ? parsed.failedChecks : [],
    };
  } catch {
    return { script, passed: false, failedChecks: ["Quality reviewer returned invalid JSON; manual review is required."] };
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const tiktokRouter = router({
  // Step 1: Transcribe a TikTok video from URL
  transcribe: publicProcedure
    .input(z.object({
      url: z.string().url(),
    }))
    .mutation(async ({ input }): Promise<TranscribeResult> => {
      // Sanitize URL — strip backticks, extra whitespace, and common copy-paste artifacts
      const cleanUrl = input.url
        .trim()
        .replace(/%60.*$/, '')            // remove %60 (URL-encoded backtick) and everything after
        .replace(/[`'"]/g, '')           // remove literal backticks and quotes
        .replace(/\?locale=[^&]+/, '')    // remove ?locale= params that get appended
        .replace(/[\u200B-\u200D\uFEFF]/g, ''); // remove zero-width chars

      // Validate it's a TikTok URL at all
      if (!isValidTikTokUrl(cleanUrl)) {
        throw new Error("Please paste a TikTok video URL (e.g. https://www.tiktok.com/@username/video/...)");
      }

      const isShort = isShortTikTokUrl(cleanUrl);
      let videoId = extractTikTokVideoId(cleanUrl);
      let creatorHandle = extractCreatorHandle(cleanUrl);

      // For full URLs, require a video ID upfront
      if (!isShort && !videoId) {
        throw new Error("This TikTok URL doesn't point to a video. Please paste a direct video link (e.g. https://www.tiktok.com/@username/video/...) or use the Share button in TikTok to copy the video link.");
      }

      // Transcribe via LLM file_url — no local download, no ffmpeg, works in production
      const result = await transcribeTikTokVideo(cleanUrl);

      // Use resolved metadata from tikwm (most reliable for short URLs)
      if (result.resolvedVideoId) videoId = result.resolvedVideoId;
      if (result.resolvedHandle && creatorHandle === "unknown") creatorHandle = result.resolvedHandle;
      // Final fallback for video ID
      if (!videoId) videoId = `video-${Date.now()}`;

      const { fullTranscript, durationSeconds } = result;
      const wordCount = fullTranscript.split(/\s+/).filter((w: string) => w.length > 0).length;
      const readingLevel = calculateReadingLevel(fullTranscript);

      return {
        videoId,
        creatorHandle,
        fullTranscript,
        segments: [],  // LLM transcription doesn't produce timestamped segments
        durationSeconds,
        readingLevel,
        wordCount,
      };
    }),

  // Step 2: Generate pharmacist rewrite with hook cycling variants
  rewrite: publicProcedure
    .input(z.object({
      transcript: z.string(),
      productName: z.string().optional(),
      productDescription: z.string().optional(),
      keyBenefit: z.string().optional(),
      bannedWords: z.array(z.string()).optional(),
      introPhrase: z.string().optional(),
    }))
    .mutation(async ({ input }): Promise<RewriteResult> => {
      const bannedWordsNote = input.bannedWords && input.bannedWords.length > 0
        ? `\nBANNED WORDS — never use these: ${input.bannedWords.join(", ")}`
        : "";

      const productContext = [
        input.productName ? `Product: ${input.productName}` : "",
        input.productDescription ? `Description: ${input.productDescription}` : "",
        input.keyBenefit ? `Key Benefit: ${input.keyBenefit}` : "",
      ].filter(Boolean).join("\n");

      const introPhraseNote = input.introPhrase
        ? `\nOPENING PHRASE (prepend this exact phrase to the start of EVERY rewritten script, before the hook): "${input.introPhrase}"`
        : "";

      const prompt = `${HOOK_FRAMEWORK}

---

${SCRIPT_ARCHITECTURE_GUIDE}

${BUYER_PSYCHOLOGY_LEVERS}${bannedWordsNote}${introPhraseNote}${buildPhraseBankNote(undefined, 180)}
ORIGINAL TRANSCRIPT TO ANALYZE AND REWRITE:
"""
${input.transcript}
"""

${productContext ? `PRODUCT CONTEXT:\n${productContext}\n` : ""}

Your task:
1. Analyze the original transcript and identify which of the 13 hook frameworks it most closely matches
2. Generate EXACTLY ONE pharmacist-adapted rewrite that PRESERVES the original video's hook framework and section structure — do NOT switch to a different hook. The goal is to adapt the proven script to a pharmacist's voice, not to reinvent it.
3. For the rewrite: keep 95-99% of the core information, swap credentials to "pharmacist", simplify any overly complex science. ONLY correct hard violations — leave borderline language intact.
4. CONFIDENCE RULE: Match the confidence level of the original. Do NOT soften claims that are not hard violations. If the original says "super effective" or "people are calling it topical filler", keep that energy — do not replace it with "may work for some people" or "works for many people".
5. MISDIRECTION RULE: If misdirection is used, it must correct an overclaim to BUILD credibility — not hedge. BAD: "Everyone says this works but honestly it works for many people." GOOD: "Everyone says you need to do a loading phase with creatine — but honestly a consistent 3-5g daily dose reaches the same saturation in 28 days with none of the GI side effects."
6. VISUAL CUE PLACEMENT RULE: Place [VISUAL: ...] cues at the product introduction moment and at social proof moments — NOT during the education/mechanism section. Mid-explanation visual cues interrupt the spoken flow.
7. Identify compliance issues using the 2-TIER system below
8. Suggest 3 specific improvements to make the script convert better
9. Identify which psychological triggers are present (authority, social proof, fear/urgency, curiosity, scarcity, reciprocity, identity, romantic/sexual attraction)
10. TRIPLE HOOK — TEXT HOOK SUGGESTIONS: Generate 3 text overlay options that complement the spoken hook from different angles. The text overlay appears on screen simultaneously with the spoken hook — it should NOT repeat the spoken words but approach the same topic from a different angle to engage a second attention system. Each option should be 5-8 words, punchy. Use these three formats:
    - Option 1: Question format (e.g. "Why is your magnesium not working?")
    - Option 2: Provocative statement (e.g. "Your pharmacist never told you this")
    - Option 3: Stakes framing (e.g. "Most people are wasting their money")

COMPLIANCE 2-TIER SYSTEM:

HARD VIOLATIONS (these WILL get your video removed — correct these in the rewrite):
- Explicit disease cure claims: "cures cancer", "treats diabetes", "heals arthritis"
- Explicit FDA approval claims that are false
- Explicit prescription drug comparisons: "better than Adderall", "replaces your medication"
- Explicit guaranteed results: "will definitely", "guaranteed to", "100% works"
- Explicit before/after MEDICAL claims: "I was diagnosed with X and now I'm cured"

SOFT CAUTIONS (borderline but COMMON and generally accepted — DO NOT correct these, just note them):
- Implied transformations: "feeling 10 years younger", "changed my life"
- Benefit language: "helps with", "supports", "may improve", "can benefit"
- Age-related decline framing: "after 30 your body starts...", "aging starts showing up"
- Implied before/after through storytelling: "I used to feel tired, now I have energy"
- Strong emotional language: "game changer", "life changing", "incredible results"
- Supplement-as-solution framing: "this is what your body needs"
These are standard TikTok Shop language that successful creators use daily. Flag them as awareness items only.

Return a JSON object with this exact structure:
{
  "pharmacistRewrites": [
    {
      "hookId": "after-1-month",
      "hookName": "The After 1 Month Formula",
      "hookCategory": "Results-Based",
      "openingLine": "the exact first 1-2 sentences only",
      "fullScript": "the complete rewritten script from start to finish",
      "textHookSuggestions": ["question format (5-8 words)", "provocative statement (5-8 words)", "stakes framing (5-8 words)"]
    }
  ],
  "hardViolations": ["Explicit disease cure claim: 'cures insomnia'"],
  "softCautions": ["Implied transformation language: 'feeling 10 years younger' — common on TikTok, generally safe but be aware"],
  "improvementSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "psychTriggers": ["Authority", "Curiosity"]
}

IMPORTANT: Most TikTok supplement videos will have ZERO hard violations and a few soft cautions. Do NOT over-flag. If the language is standard for successful TikTok creators, it belongs in softCautions at most.`;

      const result = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert TikTok Shop script writer. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 8000,
      });

      const content = result.choices[0]?.message?.content;
      if (!content || typeof content !== "string") {
        throw new Error("LLM returned empty response");
      }

      const parsed = JSON.parse(content);

      return {
        originalTranscript: input.transcript,
        pharmacistRewrites: parsed.pharmacistRewrites || [],
        hardViolations: parsed.hardViolations || [],
        softCautions: parsed.softCautions || [],
        complianceIssues: [],  // Deprecated — kept for backward compat
        improvementSuggestions: parsed.improvementSuggestions || [],
        psychTriggers: parsed.psychTriggers || [],
      };
    }),

  // Step 3: Generate 70/20/10 iterations from a transcript
  iterate: publicProcedure
    .input(z.object({
      transcript: z.string(),
      productName: z.string().optional(),
      productDescription: z.string().optional(),
      keyBenefit: z.string().optional(),
      bannedWords: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }): Promise<IterateResult> => {
      const bannedWordsNote = input.bannedWords && input.bannedWords.length > 0
        ? `\nBANNED WORDS — never use these: ${input.bannedWords.join(", ")}`
        : "";

      // ── Product Research: extract product intelligence from the transcript ─────────
      // The transcript already contains the product name/description, so we pass
      // it as the description input so researchProduct can extract specific facts.
      let productResearch: ProductResearch | null = null;
      try {
        productResearch = await researchProduct(
          input.productName || "the product in this script",
          input.productDescription || input.transcript.slice(0, 600),
          input.keyBenefit
        );
      } catch {
        // Non-fatal — fall back to basic product context
      }

      const researchContext = productResearch
        ? `
PRODUCT RESEARCH (use these specific facts in all 3 iterations — do NOT write generic supplement copy):
- Primary Ingredients: ${productResearch.primaryIngredients}
- How It Works: ${productResearch.mechanismOfAction}
- The Gap (what most people get wrong): ${productResearch.commonMistakeGap}
- Product Differentiator: ${productResearch.productDifferentiator}
- Dosing Facts: ${productResearch.dosingFacts}
- Suppressed Fact: ${productResearch.suppressedFact}
`
        : [
            input.productName ? `Product: ${input.productName}` : "",
            input.productDescription ? `Description: ${input.productDescription}` : "",
            input.keyBenefit ? `Key Benefit: ${input.keyBenefit}` : "",
          ].filter(Boolean).join("\n");

      const prompt = `${BATCH_HOOK_FRAMEWORKS}

---

${SCRIPT_ARCHITECTURE_GUIDE}

${BUYER_PSYCHOLOGY_LEVERS}${bannedWordsNote}${buildPhraseBankNote(undefined, 180)}
ORIGINAL WINNING SCRIPT TO ITERATE ON:
"""
${input.transcript}
"""

${researchContext ? `${researchContext}\n` : ""}

Generate 3 iteration levels based on the 70/20/10 framework:

70% ITERATION: Keep everything the same — same hook type, same structure, same core message. Only change: the opening hook wording, the CTA phrasing, and 1-2 minor word swaps. This is for maximizing a proven winner.

20% ITERATION: Keep the same product and core message. Change the hook framework to a different one from the 13 frameworks. Keep the body information mostly the same but restructure it to fit the new hook format. This tests a new entry point for the same content.

10% ITERATION: Complete creative reset. Same product, completely different angle, different hook, different structure, different psychological trigger emphasis. This is a creative experiment.

Return a JSON object with this exact structure:
{
  "level70": "complete script for 70% iteration",
  "level20": "complete script for 20% iteration", 
  "level10": "complete script for 10% iteration",
  "rationale70": "1-2 sentence explanation of what changed and why",
  "rationale20": "1-2 sentence explanation of what changed and why",
  "rationale10": "1-2 sentence explanation of what changed and why"
}`;

      const result = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert TikTok Shop script writer. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 8000,
      });

      const content = result.choices[0]?.message?.content;
      if (!content || typeof content !== "string") {
        throw new Error("LLM returned empty response");
      }

      const parsed = JSON.parse(content);

      return {
        originalTranscript: input.transcript,
        level70: parsed.level70 || "",
        level20: parsed.level20 || "",
        level10: parsed.level10 || "",
        rationale70: parsed.rationale70 || "",
        rationale20: parsed.rationale20 || "",
        rationale10: parsed.rationale10 || "",
      };
    }),

  // Step 4: Generate A/B/C opening line variants for a given script
  generateABVariants: publicProcedure
    .input(z.object({
      hookId: z.string(),
      hookName: z.string(),
      script: z.string(),
      productName: z.string().optional(),
      keyBenefit: z.string().optional(),
      bannedWords: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }): Promise<ABVariantsResult> => {
      const bannedWordsNote = input.bannedWords && input.bannedWords.length > 0
        ? `\nBANNED WORDS — never use these: ${input.bannedWords.join(", ")}`
        : "";

      const prompt = `${HOOK_FRAMEWORK}${bannedWordsNote}

You are given a TikTok script using the "${input.hookName}" hook framework.
Product: ${input.productName || "supplement"}
Key Benefit: ${input.keyBenefit || ""}

EXISTING SCRIPT:
"""
${input.script}
"""

Generate 3 alternative OPENING LINES (first 1-2 sentences only) for this script.
The rest of the script body stays the same — only the opening hook line changes.
Each variant should use a different psychological angle or phrasing approach while staying true to the ${input.hookName} framework.

Variant A: The most direct, punchy version — gets straight to the hook
Variant B: Uses a question or challenge to the viewer
Variant C: Leads with a surprising statistic or counterintuitive fact

Return JSON:
{
  "variantA": "opening line only",
  "variantB": "opening line only",
  "variantC": "opening line only",
  "rationaleA": "one sentence on why this angle works",
  "rationaleB": "one sentence on why this angle works",
  "rationaleC": "one sentence on why this angle works",
  "scriptBody": "the rest of the script after the opening line"
}`;

      const result = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert TikTok Shop script writer. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000,
      });

      const content = result.choices[0]?.message?.content;
      if (!content || typeof content !== "string") throw new Error("LLM returned empty response");
      const parsed = JSON.parse(content);

      return {
        hookId: input.hookId,
        hookName: input.hookName,
        scriptBody: parsed.scriptBody || "",
        variantA: parsed.variantA || "",
        variantB: parsed.variantB || "",
        variantC: parsed.variantC || "",
        rationaleA: parsed.rationaleA || "",
        rationaleB: parsed.rationaleB || "",
        rationaleC: parsed.rationaleC || "",
      };
    }),

  // Step 5: Batch generate scripts for all 9 proven hooks at once
  // Pipeline: (1) Product Research → (2) Script Generation → (3) Quality Check
  batchGenerate: publicProcedure
    .input(z.object({
      productName: z.string(),
      productDescription: z.string().optional(),
      keyBenefit: z.string().optional(),
      productLink: z.string().optional(),
      useMisdirection: z.boolean().optional(),
      bannedWords: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }): Promise<BatchGenerateResult[]> => {
      const bannedWordsNote = input.bannedWords && input.bannedWords.length > 0
        ? `\nBANNED WORDS — never use these: ${input.bannedWords.join(", ")}`
        : "";

      const misdirectionNote = input.useMisdirection
        ? "\nMISDIRECTION TECHNIQUE: Include a misdirection line in each script that sets realistic expectations and builds trust (e.g., \"Everyone says you feel it in 3 days, but real results take 3-4 weeks.\"). This makes you more believable, not less."
        : "";

      // ── Step 1: Product Research ─────────────────────────────────────────────
      // Run an LLM call to extract product intelligence before generation.
      // This ensures scripts use specific facts, not generic supplement copy.
      let productResearch: ProductResearch;
      try {
        productResearch = await researchProduct(
          input.productName,
          input.productDescription,
          input.keyBenefit,
          input.productLink
        );
      } catch {
        // If research fails, fall back to basic product context
        productResearch = {
          primaryIngredients: input.productName,
          mechanismOfAction: input.productDescription || "",
          clinicalBacking: "",
          targetAudience: "adults looking to improve their health",
          commonMistakeGap: "Most people don't know the right way to take this",
          productDifferentiator: input.keyBenefit || "high quality formula",
          comparisonPair: "",
          warningSigns: ["fatigue", "brain fog", "poor sleep", "low energy"],
          dosingFacts: "Take as directed on the label",
          suppressedFact: "",
          patentedIngredientFlag: false,
          patentedIngredient: null,
        };
      }

      const researchContext = `
PRODUCT RESEARCH (use these specific facts to write credible, non-generic scripts):
- Product: ${input.productName}
- Primary Ingredients: ${productResearch.primaryIngredients}
- How It Works: ${productResearch.mechanismOfAction}
- Clinical Backing: ${productResearch.clinicalBacking}
- Target Audience: ${productResearch.targetAudience}
- The Gap (what most people get wrong): ${productResearch.commonMistakeGap}
- Product Differentiator: ${productResearch.productDifferentiator}
- Best Comparison Pair: ${productResearch.comparisonPair}
- Warning Sign Symptoms: ${productResearch.warningSigns.join(", ")}
- Dosing Facts: ${productResearch.dosingFacts}
- Suppressed/Overlooked Fact: ${productResearch.suppressedFact}
${input.productDescription ? `- Additional Description: ${input.productDescription}` : ""}
${input.keyBenefit ? `- Key Benefit: ${input.keyBenefit}` : ""}
${input.productLink ? `- Product Link: ${input.productLink}` : ""}
`;

      // ── Step 2: Script Generation ────────────────────────────────────────────
      // Generate all 9 scripts in a single LLM call using the full framework reference.
      const generationPrompt = `${BATCH_HOOK_FRAMEWORKS}

---

${SCRIPT_ARCHITECTURE_GUIDE}

${BUYER_PSYCHOLOGY_LEVERS}${bannedWordsNote}${misdirectionNote}${buildPhraseBankNote(undefined, 180)}
${researchContext}
Generate one complete TikTok Shop script for EACH of the following 9 proven hook frameworks.

REQUIREMENTS FOR EVERY SCRIPT:
- 150-220 words (60-90 seconds when spoken)
- Follow the exact section sequence for that hook (defined above)
- Include the mandatory GAP section (what most people are missing)
- Include the BRAND CLOSE (why this specific product vs. a generic)
- Include 3-5 [VISUAL: ...] stage directions at natural transition points
- End with the CTA: "Link is in my shop below. Tap the cart and check the reviews."
- Use the product research facts above — do NOT write generic supplement copy
- Deliver at least one moment of genuine educational value BEFORE the product is introduced

HOOKS TO GENERATE (9 total):
1. The Instruction / Correction Hook (hookId: instruction-correction)
2. The Symptom Checklist Hook (hookId: symptom-checklist)
3. The Suppressed Knowledge Hook (hookId: suppressed-knowledge)
4. The After 1 Month Formula (hookId: after-1-month)
5. The Trend or Trash Hook (hookId: trend-or-trash)
6. The Dosing / How-To Tutorial Hook (hookId: nad-dosing)
7. The Age Reversal / Longevity Hook (hookId: age-reversal)
8. The Comparison Hook (hookId: comparison)
9. The Warning Signs Hook (hookId: warning-signs)

Return a JSON object with a "scripts" array (9 items):
{
  "scripts": [
    {
      "hookId": "instruction-correction",
      "hookName": "The Instruction / Correction Hook",
      "hookCategory": "tier1",
      "script": "full script text with [VISUAL: ...] cues inline",
      "openingLine": "just the first 1-2 sentences"
    },
    ...
  ]
}`;

      const generationResult = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert TikTok Shop script writer for a licensed pharmacist. Always respond with valid JSON only." },
          { role: "user", content: generationPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 16000,
      });

      const generationContent = generationResult.choices[0]?.message?.content;
      if (!generationContent || typeof generationContent !== "string") {
        throw new Error("LLM returned empty response during script generation");
      }

      const generationParsed = JSON.parse(generationContent);
      const rawScripts: BatchGenerateResult[] = (generationParsed.scripts || []) as BatchGenerateResult[];

      if (rawScripts.length === 0) {
        throw new Error("LLM returned no scripts. Please try again.");
      }

      // ── Step 3: Quality Check ────────────────────────────────────────────────
      // Run each script through a quality check pass.
      // Scripts that fail are corrected in-place; scripts that pass are returned unchanged.
      // Quality checks run sequentially to avoid overwhelming the LLM.
      const checkedScripts: BatchGenerateResult[] = [];
      for (const scriptItem of rawScripts) {
        try {
          const initialReview = await qualityCheckScript(
            scriptItem.script,
            scriptItem.hookId,
            scriptItem.hookName,
            input.productName
          );
          const verificationReview = initialReview.passed
            ? initialReview
            : await qualityCheckScript(
              initialReview.script,
              scriptItem.hookId,
              scriptItem.hookName,
              input.productName
            );
          checkedScripts.push({
            ...scriptItem,
            script: verificationReview.script,
            qualityReview: {
              initialPassed: initialReview.passed,
              initialFailedChecks: initialReview.failedChecks,
              verificationPassed: verificationReview.passed,
              verificationFailedChecks: verificationReview.failedChecks,
            },
          });
        } catch (error) {
          checkedScripts.push({
            ...scriptItem,
            qualityReview: {
              initialPassed: false,
              initialFailedChecks: ["Quality review did not complete; manual review is required."],
              verificationPassed: false,
              verificationFailedChecks: [error instanceof Error ? error.message : "Unknown quality-review error."],
            },
          });
        }
      }

      return checkedScripts;
    }),

  // ─── Generate Single Script (LLM pipeline) ─────────────────────────────────
  // Replaces the old client-side generateScript() template function.
  // Runs: researchProduct → hook-specific LLM generation → qualityCheckScript.
  generateSingle: publicProcedure
    .input(z.object({
      hookId: z.string(),
      hookName: z.string(),
      productName: z.string(),
      productDescription: z.string().optional(),
      keyBenefit: z.string().optional(),
      productLink: z.string().optional(),
      useMisdirection: z.boolean().optional(),
      bannedWords: z.array(z.string()).optional(),
      introPhrase: z.string().optional(),
      vaultProductId: z.number().optional(), // When set, load vault item and inject analysis
      userId: z.number().optional(),         // Required when vaultProductId is set
    }))
    .mutation(async ({ input }) => {
      const bannedWordsNote = input.bannedWords && input.bannedWords.length > 0
        ? `\nBANNED WORDS — never use these: ${input.bannedWords.join(", ")}`
        : "";
      const misdirectionNote = input.useMisdirection
        ? "\nMISDIRECTION TECHNIQUE: Include a misdirection line that sets realistic expectations and builds trust (e.g., \"Everyone says you feel it in 3 days, but real results take 3-4 weeks.\"). This makes you more believable, not less."
        : "";
      const introPhraseNote = input.introPhrase
        ? `\nOPENING PHRASE: Prepend this exact phrase to the very start of the script, before the hook: "${input.introPhrase}"`
        : "";

      // ── Step 0: Load Vault Context (if vaultProductId provided) ──────────────
      let vaultContext: string | undefined;
      let vaultItemId: number | undefined;
      if (input.vaultProductId && input.userId) {
        try {
          const vaultItem = await getVaultItemById(input.vaultProductId, input.userId);
          if (vaultItem) {
            vaultItemId = vaultItem.id;
            const parts: string[] = [];
            if (vaultItem.talkingPoints) parts.push(`Pharmacist Talking Points: ${vaultItem.talkingPoints}`);
            if (vaultItem.ingredientsAnalysis) parts.push(`Ingredients Analysis: ${vaultItem.ingredientsAnalysis}`);
            if (vaultItem.doseFlags) parts.push(`Dose Flags: ${vaultItem.doseFlags}`);
            if (vaultItem.redFlags) parts.push(`Red Flags to Acknowledge: ${vaultItem.redFlags}`);
            if (vaultItem.betterAlternatives) parts.push(`Better Alternatives Context: ${vaultItem.betterAlternatives}`);
            if (parts.length > 0) vaultContext = parts.join("\n");
          }
        } catch {
          // Non-fatal: proceed without vault context
        }
      }

      // ── Step 1: Product Research ─────────────────────────────────────────────
      let productResearch: ProductResearch & { citations: Citation[] };
      try {
        productResearch = await researchProduct(
          input.productName,
          input.productDescription,
          input.keyBenefit,
          input.productLink,
          vaultContext
        );
      } catch {
        productResearch = {
          primaryIngredients: input.keyBenefit || input.productName,
          mechanismOfAction: input.keyBenefit || "Supports overall health and wellness",
          clinicalBacking: "Evidence-based supplement",
          targetAudience: "Adults seeking health optimization",
          commonMistakeGap: "Most people don't take this consistently enough to see results",
          productDifferentiator: `${input.productName} is a quality supplement from a trusted brand`,
          comparisonPair: "",
          warningSigns: ["fatigue", "low energy", "poor recovery"],
          dosingFacts: "Take as directed on the label",
          suppressedFact: "",
          patentedIngredientFlag: false,
          patentedIngredient: null,
          citations: [],
        };
      }

      const researchContext = `
PRODUCT RESEARCH (use these specific facts — do NOT write generic supplement copy):
- Product: ${input.productName}
- Primary Ingredients: ${productResearch.primaryIngredients}
- How It Works (mechanism): ${productResearch.mechanismOfAction}
- Clinical Backing: ${productResearch.clinicalBacking}
- Target Audience: ${productResearch.targetAudience}
- The Gap (what most people get wrong): ${productResearch.commonMistakeGap}
- Product Differentiator (why this brand): ${productResearch.productDifferentiator}
- Best Comparison Pair: ${productResearch.comparisonPair}
- Warning Sign Symptoms: ${productResearch.warningSigns.join(", ")}
- Dosing Facts: ${productResearch.dosingFacts}
- Suppressed/Overlooked Fact: ${productResearch.suppressedFact}
${input.productDescription ? `- Additional Description: ${input.productDescription}` : ""}
${input.keyBenefit ? `- Key Benefit: ${input.keyBenefit}` : ""}
`;

      // ── Step 2: Hook-Specific LLM Generation ─────────────────────────────────
      const generationPrompt = `${BATCH_HOOK_FRAMEWORKS}

---

${SCRIPT_ARCHITECTURE_GUIDE}

${BUYER_PSYCHOLOGY_LEVERS}${bannedWordsNote}${misdirectionNote}${introPhraseNote}${buildPhraseBankNote(input.hookId, 180)}
${researchContext}
Generate ONE complete TikTok Shop script for the following hook:
Hook ID: ${input.hookId}
Hook Name: ${input.hookName}

REQUIREMENTS:
- 150-220 words (60-90 seconds when spoken)
- HOOK FIRST: The very first spoken word of fullScript MUST be the verbal hook — no preamble, no setup, no context-setting sentence before the hook line. The hook is what stops the scroll; anything before it kills the video.
- Follow the exact section sequence defined above for this hook
- Include the mandatory GAP section (what most people are missing)
- Include the BRAND CLOSE (why this specific product vs. a generic)
- Include 3-5 [VISUAL: ...] stage directions at natural transition points
- End with the CTA: "Link is in my shop below. Tap the cart and check the reviews."
- Use the product research facts above — do NOT write generic supplement copy
- Deliver at least one moment of genuine educational value BEFORE the product is introduced
- NO SENTENCE REDUNDANCY (Rule E): Every sentence must introduce new information or advance the argument. Before writing each sentence, apply this test: "Does this sentence add something the previous sentence did not already say?" If no, cut it. Common violations to avoid: restating the same instruction multiple ways (e.g. "use SPF / not moisturizer SPF / dedicated SPF / SPF 30" — pick ONE clear statement); repeating the mechanism after already explaining it; listing ingredients again after already naming them. A script can be long if every sentence earns its place — but no sentence may restate what was already said.

PROBLEM SECTION RULES (applies to the "problem" JSON field):
- MUST name a specific, mechanistic reason why people are not getting results — not a behavioral observation
- BAD: "Most people expect instant results" | GOOD: "Most people take magnesium oxide — the form in almost every cheap supplement — which has only a 4% absorption rate"
- BAD: "People take it inconsistently" | GOOD: "Astaxanthin is fat-soluble — if you take it without a meal containing healthy fats, you absorb almost none of it"
- BAD: "Many people don't know about this" | GOOD: "The problem is your body can't produce [ingredient] on its own, and after age 40 your [biological process] drops by 50%"
- The problem must be something the viewer can immediately fix — a specific mistake, a missing piece, or a biological fact they didn't know
- Use the 'commonMistakeGap' from the product research above as the primary source for this section

TRIPLE HOOK STRATEGY — TEXT HOOK SUGGESTIONS:
Top-performing TikTok creators use THREE simultaneous hooks in the first 2 seconds: (1) a visual hook (what's on screen), (2) a spoken verbal hook (first words out of mouth), and (3) a text overlay hook (on-screen text). The text overlay should NOT repeat the spoken hook — it must approach the same topic from a different angle to engage a second attention system.

Generate 3 text hook options for the textHookSuggestions field. Each should be 5-8 words, punchy, and use a DIFFERENT angle from the spoken hook:
- Option 1: Question format (e.g. "Why is your magnesium not working?")
- Option 2: Provocative statement (e.g. "Your pharmacist never told you this")
- Option 3: Stakes framing (e.g. "Most people are wasting their money")

CAPTION & HASHTAGS:
Also generate a TikTok caption and exactly 5 hashtags for this script.
Caption rules: max 2 lines. Line 1: short curiosity-driving statement that teases the video (do NOT start with "I" or restate the hook verbatim). Line 2: soft encouraging CTA such as "definitely worth a try", "this one is worth looking into", "worth adding to your routine" — NOT a hard sell. Do not include hashtags in the caption lines.
Hashtag rules (exactly 5, in this order): (1) brand name hashtag, (2) product/ingredient hashtag, (3) pain point hashtag 1, (4) pain point hashtag 2 or niche health tag, (5) broad reach tag — one of #pharmacist #pharmacisttok #healthtips #supplements #tiktokshop.

Return a JSON object:
{
  "fullScript": "complete script with [VISUAL: ...] cues inline",
  "textHookSuggestions": ["question format option (5-8 words)", "provocative statement option (5-8 words)", "stakes framing option (5-8 words)"],
  "verbalHook": "the first 1-2 spoken sentences",
  "problem": "the problem/agitation section (1-3 sentences)",
  "authorityPivot": "the authority statement (1 sentence)",
  "mechanism": "the mechanism/how-it-works section (1-3 sentences)",
  "cta": "the call to action (1-2 sentences)",
  "visualOverlays": ["overlay suggestion 1", "overlay suggestion 2", "overlay suggestion 3"],
  "psychTriggersUsed": ["trigger1", "trigger2"],
  "hardViolations": [],
  "softCautions": [],
  "captionLine1": "curiosity-driving statement (no hashtags)",
  "captionLine2": "soft encouraging CTA (no hashtags)",
  "hashtags": ["#brand", "#ingredient", "#painpoint1", "#painpoint2", "#broad"]
}`;

      const generationResult = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert TikTok Shop script writer for a licensed pharmacist. Always respond with valid JSON only." },
          { role: "user", content: generationPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 4000,
      });

      const generationContent = generationResult.choices[0]?.message?.content;
      if (!generationContent || typeof generationContent !== "string") {
        throw new Error("LLM returned empty response during script generation");
      }
      // Sanitize special characters that break JSON.parse when LLM emits them in string values
      // (em dash, en dash, curly quotes, ellipsis) — these are safe to replace with ASCII equivalents
      const sanitizedContent = generationContent
        .replace(/\u2018|\u2019/g, "'")
        .replace(/\u201C|\u201D/g, '\\"')
        .replace(/\u2014/g, "-")
        .replace(/\u2013/g, "-")
        .replace(/\u2026/g, "...");
      const parsed = JSON.parse(sanitizedContent);

      // ── Step 2.5: Server-Side Section Assembly ──────────────────────────────────────────────────────────────────────────
      const sectionVerbalHook = (parsed.verbalHook as string) || "";
      const sectionProblem = (parsed.problem as string) || "";
      const sectionAuthorityPivot = (parsed.authorityPivot as string) || "";
      const sectionMechanism = (parsed.mechanism as string) || "";
      const sectionCta = (parsed.cta as string) || "Link is in my shop below. Tap the cart and check the reviews.";
      const sectionMisdirection = input.useMisdirection ? (parsed.misdirection as string) || "" : "";
      const llmFullScript = (parsed.fullScript as string) || "";

      // Use the LLM's fullScript directly — it contains the complete hook-specific section structure
      // (e.g. 9 sections for instruction-correction). The labeled fields above are reference copies
      // used for the breakdown panel and inline editing only.
      // Hook-first ordering is enforced via the prompt constraint below.

      // ── Step 3: Quality Check ──────────────────────────────────────────────────────────────────────────
      let finalScript = llmFullScript;
      let qualityReview = {
        initialPassed: false,
        initialFailedChecks: ["Quality review did not run."],
        verificationPassed: false,
        verificationFailedChecks: ["Quality review did not run."],
      };
      try {
        const initialReview = await qualityCheckScript(
          finalScript,
          input.hookId,
          input.hookName,
          input.productName
        );
        const verificationReview = initialReview.passed
          ? initialReview
          : await qualityCheckScript(
            initialReview.script,
            input.hookId,
            input.hookName,
            input.productName
          );
        finalScript = verificationReview.script;
        qualityReview = {
          initialPassed: initialReview.passed,
          initialFailedChecks: initialReview.failedChecks,
          verificationPassed: verificationReview.passed,
          verificationFailedChecks: verificationReview.failedChecks,
        };
      } catch (error) {
        qualityReview = {
          initialPassed: false,
          initialFailedChecks: ["Quality review did not complete; manual review is required."],
          verificationPassed: false,
          verificationFailedChecks: [error instanceof Error ? error.message : "Unknown quality-review error."],
        };
      }

      // ── Step 4: Compliance Check ──────────────────────────────────────────────
      const hardPhrases = ['cures', 'cure', 'clinically proven to cure', 'scientifically proven to cure', 'FDA approved', 'replaces medication', 'stop taking your medication', 'prescription alternative', '100% effective', 'miracle', 'magic pill'];
      const softPhrases = ['guaranteed results', 'guaranteed', 'proven', 'clinically proven', 'no side effects', 'safe for everyone', 'works for everyone', 'before and after', 'instant results', 'lose weight fast', 'doctor approved'];
      const lowerScript = finalScript.toLowerCase();
      const complianceHardFlags = hardPhrases
        .filter(p => lowerScript.includes(p.toLowerCase()))
        .map(p => `Hard violation: "${p}" — this will get your video removed.`);
      const complianceSoftFlags = softPhrases
        .filter(p => lowerScript.includes(p.toLowerCase()))
        .map(p => `Soft caution: "${p}" — common on TikTok, just be aware.`);

      return {
        fullScript: finalScript,
        textHookSuggestions: Array.isArray(parsed.textHookSuggestions) ? (parsed.textHookSuggestions as string[]) : (parsed.textHook ? [parsed.textHook as string] : []),
        verbalHook: sectionVerbalHook,
        problem: sectionProblem,
        authorityPivot: sectionAuthorityPivot,
        mechanism: sectionMechanism,
        cta: sectionCta,
        misdirection: input.useMisdirection ? sectionMisdirection || undefined : undefined,
        visualOverlays: (parsed.visualOverlays as string[]) || [],
        psychTriggersUsed: (parsed.psychTriggersUsed as string[]) || [],
        captionLine1: (parsed.captionLine1 as string) || '',
        captionLine2: (parsed.captionLine2 as string) || '',
        hashtags: Array.isArray(parsed.hashtags) ? (parsed.hashtags as string[]) : [],
        hookName: input.hookName,
        complianceHardFlags,
        complianceSoftFlags,
        qualityReview,
        // Upgrade 1 & 2: citations + vault connection
        citations: productResearch.citations,
        vaultItemId,  // undefined if no vault product was used
        // ScriptBrief data for "Save Brief to Vault" button
        scriptBrief: {
          mechanism: productResearch.mechanismOfAction,
          gap: productResearch.commonMistakeGap,
          differentiator: productResearch.productDifferentiator,
          dosingFacts: productResearch.dosingFacts,
          citations: productResearch.citations,
          generatedAt: Date.now(),
        } as ScriptBrief,
      };
    }),

  // ─── Generate Caption & Hashtags ──────────────────────────────────────────
  generateCaption: publicProcedure
    .input(z.object({
      productName: z.string(),
      brandName: z.string(),
      keyBenefit: z.string(),
      hookType: z.string(),
      script: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { productName, brandName, keyBenefit, hookType, script } = input;

      const prompt = `You are a TikTok content strategist for a pharmacist creator.

Generate a TikTok caption and exactly 5 hashtags for this video.

Product: ${productName}
Brand: ${brandName}
Key Benefit: ${keyBenefit}
Hook Type: ${hookType}
Script:
${script}

RULES FOR CAPTION:
- Maximum 2 lines
- Line 1: A short curiosity-driving statement that teases the video without giving everything away (do NOT start with "I" or restate the hook verbatim)
- Line 2: A soft, encouraging CTA such as "definitely worth a try", "this one is worth looking into", "worth adding to your routine" — NOT a hard sell
- Keep both lines concise
- Do not include hashtags in the caption lines

RULES FOR HASHTAGS (exactly 5, in this order):
1. Brand hashtag: the brand name of the product (e.g. #medicube, #momentous, #thorne)
2. Product/ingredient hashtag: the specific product or hero ingredient (e.g. #volufiline, #magnesiumglycinate, #nmn)
3. Pain point hashtag 1: a symptom or concern this product addresses (e.g. #undereyes, #poorsleep, #brainfog, #hairloss)
4. Pain point hashtag 2: a second related pain point or condition (e.g. #aging, #inflammation, #lowenergy) — if only one clear pain point, use a niche health hashtag
5. Broad reach hashtag: one of #pharmacist, #pharmacisttok, #healthtips, #supplements, #tiktokshop, #tiktokmademebuyit — choose most relevant

Return a JSON object:
{
  "captionLine1": "...",
  "captionLine2": "...",
  "hashtags": ["#brand", "#ingredient", "#painpoint1", "#painpoint2", "#broad"]
}`;

      const result = await invokeLLM({
        messages: [
          { role: "system", content: "You are a TikTok content strategist. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 400,
      });

      const content = result.choices[0]?.message?.content;
      if (!content || typeof content !== "string") throw new Error("LLM returned empty response");
      const parsed = JSON.parse(content);

      return {
        captionLine1: parsed.captionLine1 as string,
        captionLine2: parsed.captionLine2 as string,
        hashtags: parsed.hashtags as string[],
      };
    }),

  // ─── Review Script (on-demand) ───────────────────────────────────────────
  reviewScript: publicProcedure
    .input(
      z.object({
        fullScript: z.string().min(10),
        hookId: z.string(),
        hookName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { fullScript, hookId, hookName } = input;

      // Section word budgets per hook type (spoken words, ~130wpm)
      // These are the target ranges per section for a 60-90s TikTok
      const SECTION_BUDGETS: Record<string, { min: number; max: number }> = {
        authority: { min: 10, max: 20 },
        mechanism: { min: 30, max: 45 },
        gap: { min: 15, max: 30 },
        correction: { min: 20, max: 30 },
        brandClose: { min: 25, max: 40 },
        cta: { min: 8, max: 18 },
      };

      const prompt = `You are a TikTok script editor for a licensed pharmacist creator. Review the following script for the "${hookName}" hook and flag specific problems that should be fixed before filming.

SCRIPT TO REVIEW:
---
${fullScript}
---

HOOK TYPE: ${hookName} (id: ${hookId})

SECTION WORD BUDGETS (spoken words at ~130wpm for a 60-90s TikTok):
- Authority/Hook opening: ${SECTION_BUDGETS.authority.min}–${SECTION_BUDGETS.authority.max} words
- Mechanism/Education: ${SECTION_BUDGETS.mechanism.min}–${SECTION_BUDGETS.mechanism.max} words  
- Gap/Problem: ${SECTION_BUDGETS.gap.min}–${SECTION_BUDGETS.gap.max} words
- Correction/Instruction: ${SECTION_BUDGETS.correction.min}–${SECTION_BUDGETS.correction.max} words
- Brand Close/Product Reveal: ${SECTION_BUDGETS.brandClose.min}–${SECTION_BUDGETS.brandClose.max} words
- CTA: ${SECTION_BUDGETS.cta.min}–${SECTION_BUDGETS.cta.max} words

CHECK FOR THESE SPECIFIC PROBLEMS (only flag real issues, not nitpicks):

1. SECTION TOO LONG: Identify which section each sentence belongs to. Count words per section. Flag any section exceeding its max budget by more than 10 words. State the actual word count and which sentences to cut.

2. DUPLICATE INFORMATION: Flag any fact, claim, or instruction stated more than once (even if worded differently). State both sentences and which one to remove.

3. TECHNICAL LANGUAGE WITHOUT TRANSLATION: Flag any clinical/biochemical term used WITHOUT a plain-English explanation immediately following it.
   BAD: "replenishes phosphocreatine stores" (no translation)
   GOOD: "replenishes phosphocreatine stores — the energy your muscles burn during exercise" (has translation)

4. TEXTBOOK TONE: Flag sentences that sound written for a medical journal rather than spoken to a patient. Look for: passive voice, multi-clause sentences over 30 words, or academic phrasing that would sound unnatural on camera.

5. MISSING REQUIRED ELEMENTS: Flag if absent:
   a) Specific gap — what the product does NOT address that people assume it does
   b) Named brand differentiator — a specific claim about THIS product vs. generic alternatives (not just "quality" or "effective")
   c) Specific dosing or timing instruction

For each issue found, provide:
- section: which section (e.g. "Mechanism", "Brand Close", "CTA")
- severity: "warning" (fix before filming) or "info" (optional improvement)
- issue: one sentence describing the specific problem
- suggestion: one specific, actionable sentence showing exactly what to cut or how to rewrite

If the script is clean, return an empty flags array with overallScore "pass".

Return ONLY valid JSON:
{
  "overallScore": "pass" | "needs_work" | "major_issues",
  "totalWordCount": number,
  "estimatedSeconds": number,
  "flags": [
    {
      "section": string,
      "severity": "warning" | "info",
      "issue": string,
      "suggestion": string
    }
  ],
  "summary": string
}`;

      const result = await invokeLLM({
        messages: [
          { role: "system", content: "You are a TikTok script editor. Always respond with valid JSON only. Be specific and direct — flag real problems, not nitpicks. If the script is clean, say so." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1200,
      });

      const content = result.choices[0]?.message?.content;
      if (!content || typeof content !== "string") throw new Error("LLM returned empty response");

      const parsed = JSON.parse(content);
      return {
        overallScore: parsed.overallScore as "pass" | "needs_work" | "major_issues",
        totalWordCount: parsed.totalWordCount as number,
        estimatedSeconds: parsed.estimatedSeconds as number,
        flags: (parsed.flags ?? []) as Array<{
          section: string;
          severity: "warning" | "info";
          issue: string;
          suggestion: string;
        }>,
        summary: parsed.summary as string,
      };
    }),

  // ─── Generate Visuals ─────────────────────────────────────────────────────────────────────────────
  // Generates 2-3 infographic images for a script:
  //   Visual 1: Does/Doesn't split or Types card (based on hook type)
  //   Visual 2: Citation card (top 1-2 citations)
  //   Visual 3: Pathway diagram (mechanism of action, for science-heavy hooks)
  generateVisuals: publicProcedure
    .input(z.object({
      productName: z.string(),
      hookId: z.string(),
      fullScript: z.string(),
      citations: z.array(z.object({
        claim: z.string(),
        source: z.string(),
        year: z.number(),
        pmid: z.string().optional(),
        doi: z.string().optional(),
        url: z.string().optional(),
        confidence: z.enum(['high', 'medium', 'low']),
      })).optional(),
      // Research context for richer prompts
      mechanism: z.string().optional(),
      gap: z.string().optional(),
      differentiator: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { generateImage } = await import('../_core/imageGeneration');
      const { productName, hookId, citations = [], mechanism, gap } = input;

      // Determine visual strategy based on hook type
      const isInstructionHook = hookId.includes('instruction') || hookId.includes('correction') || hookId.includes('ingredient');
      const isScienceHook = hookId.includes('mechanism') || hookId.includes('ingredient') || hookId.includes('medication') || hookId.includes('instead-of');

      // Build the LLM prompt to extract visual content from the script
      const contentPrompt = `You are a visual content strategist for a pharmacist TikTok creator.

Script:
${input.fullScript}

Product: ${productName}
Hook Type: ${hookId}
${mechanism ? `Mechanism: ${mechanism}` : ''}
${gap ? `Gap/What most people miss: ${gap}` : ''}

Extract the key facts for 2-3 infographic visuals:

1. INFOGRAPHIC CARD: For instruction-correction or ingredient hooks, extract the "Does vs Doesn't" split (what the ingredient handles vs what it doesn't). For other hooks, extract a "Types" or "Forms" list (e.g. types of collagen, forms of magnesium). Provide: title, left_label, left_items (3-4 items), right_label, right_items (3-4 items) OR a list_title and items array.

2. CITATION CARD: Extract the single most compelling study fact from the script. Provide: stat (the key number or finding), source_name, year.

3. PATHWAY CARD (only for science/mechanism hooks): Extract the mechanism of action as 3-4 steps. Provide: steps array with {label, description} each.

Return JSON:
{
  "infographic": {
    "type": "does-doesnt" | "types-list",
    "title": "string",
    "left_label": "string (for does-doesnt)",
    "left_items": ["string"],
    "right_label": "string (for does-doesnt)",
    "right_items": ["string"],
    "list_title": "string (for types-list)",
    "items": ["string"]
  },
  "citation": {
    "stat": "string",
    "source_name": "string",
    "year": number
  },
  "pathway": {
    "applicable": boolean,
    "steps": [{"label": "string", "description": "string"}]
  }
}`;

      const contentResult = await invokeLLM({
        messages: [
          { role: "system", content: "You are a visual content strategist. Always respond with valid JSON only." },
          { role: "user", content: contentPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1200,
      });

      const contentJson = contentResult.choices[0]?.message?.content;
      if (!contentJson || typeof contentJson !== 'string') throw new Error("Failed to extract visual content from script");
      const vc = JSON.parse(contentJson) as {
        infographic: {
          type: 'does-doesnt' | 'types-list';
          title: string;
          left_label?: string;
          left_items?: string[];
          right_label?: string;
          right_items?: string[];
          list_title?: string;
          items?: string[];
        };
        citation: { stat: string; source_name: string; year: number };
        pathway: { applicable: boolean; steps: Array<{ label: string; description: string }> };
      };

      const visuals: GeneratedVisual[] = [];

      // ── Visual 1: Infographic card ──────────────────────────────────────────
      try {
        let infographicPrompt: string;
        if (vc.infographic.type === 'does-doesnt') {
          const leftItems = (vc.infographic.left_items || []).map(i => `✓ ${i}`).join('\n');
          const rightItems = (vc.infographic.right_items || []).map(i => `✗ ${i}`).join('\n');
          infographicPrompt = `Create a clean, professional medical infographic card with a dark navy blue background (#0a1628). The card is split into two columns with a thin dividing line.

Left column header: "${vc.infographic.left_label || 'WHAT IT HANDLES'}" in electric teal (#00d4c8), bold caps.
Left column items (each with a teal checkmark ✓):
${leftItems}

Right column header: "${vc.infographic.right_label || 'WHAT IT MISSES'}" in amber (#f59e0b), bold caps.
Right column items (each with an amber X ✗):
${rightItems}

Card title at top: "${vc.infographic.title}" in white, large bold font.
Footer text at bottom in small gray text: "${gap || 'Most people only fix half the problem.'}"

Design: clean sans-serif font, generous padding, subtle card shadow, no decorative elements. The card should look like a premium educational slide, not a social media graphic.`;
        } else {
          const items = (vc.infographic.items || []).map((item, i) => `Type ${i + 1}: ${item}`).join('\n');
          infographicPrompt = `Create a clean, professional medical infographic card with a dark navy blue background (#0a1628).

Title at top: "${vc.infographic.list_title || vc.infographic.title}" in white, large bold font.

Stacked cards (one per item), each with a teal left border (#00d4c8):
${items}

Footer text in small gray: "${gap || 'Not all forms are equal.'}"

Design: clean sans-serif font, generous padding, each card has subtle dark background (#111d35), no decorative elements. Professional educational slide aesthetic.`;
        }

        const img1 = await generateImage({ prompt: infographicPrompt });
        if (img1.url) {
          visuals.push({
            imageUrl: img1.url,
            visualType: 'infographic',
            caption: vc.infographic.title,
          });
        }
      } catch (e) {
        console.error('[generateVisuals] Visual 1 failed:', e);
      }

      // ── Visual 2: Citation card ─────────────────────────────────────────────
      try {
        // Use top citation from research if available, otherwise use extracted content
        const topCitation = citations.find(c => c.confidence === 'high') || citations[0];
        const citStat = topCitation?.claim || vc.citation.stat;
        const citSource = topCitation?.source || vc.citation.source_name;
        const citYear = topCitation?.year || vc.citation.year;
        const citDoi = topCitation?.doi || topCitation?.url || '';

        const citationPrompt = `Create a clean, professional study citation card with a dark navy blue background (#0a1628).

Layout (top to bottom):
1. Small label at top: "STUDY REFERENCE" in electric teal (#00d4c8), small caps, letter-spaced
2. Large quote block in the center: "${citStat}" in white, large bold font (24-28px equivalent), centered
3. Dividing line in teal
4. Source line: "${citSource} (${citYear})" in light gray, medium font
${citDoi ? `5. Small URL/DOI text at bottom: "${citDoi}" in dim gray, very small font` : ''}

Design: generous padding, clean sans-serif font, subtle card glow effect, no stock photo background. Professional academic citation aesthetic.`;

        const img2 = await generateImage({ prompt: citationPrompt });
        if (img2.url) {
          visuals.push({
            imageUrl: img2.url,
            visualType: 'citation-card',
            caption: `${citSource} (${citYear})`,
          });
        }
      } catch (e) {
        console.error('[generateVisuals] Visual 2 failed:', e);
      }

      // ── Visual 3: Pathway diagram (only for science/mechanism hooks) ────────
      if (isScienceHook && vc.pathway.applicable && vc.pathway.steps?.length >= 2) {
        try {
          const stepsText = vc.pathway.steps.map((s, i) =>
            `Step ${i + 1}: ${s.label} — ${s.description}`
          ).join('\n');

          const pathwayPrompt = `Create a clean, professional mechanism-of-action pathway diagram with a dark navy blue background (#0a1628).

Title at top: "How ${productName} Works" in white, large bold font.

Vertical flow diagram with ${vc.pathway.steps.length} steps connected by downward arrows (teal #00d4c8):
${stepsText}

Each step is a rounded rectangle with:
- Step number in teal circle on the left
- Bold label in white
- Description in light gray below the label

Design: clean sans-serif font, generous spacing between steps, arrows are thin teal lines, no decorative elements. Professional medical education aesthetic.`;

          const img3 = await generateImage({ prompt: pathwayPrompt });
          if (img3.url) {
            visuals.push({
              imageUrl: img3.url,
              visualType: 'pathway-diagram',
              caption: `How ${productName} Works`,
            });
          }
        } catch (e) {
          console.error('[generateVisuals] Visual 3 failed:', e);
        }
      }

      if (visuals.length === 0) {
        throw new Error("All visual generation attempts failed. Please try again.");
      }

      return { visuals };
    }),
});
