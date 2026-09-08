/**
 * Video Lab Router
 *
 * Two procedures:
 * 1. analyzeVideo   — upload a video, transcribe it, compare against hook reference video, return 7-section delivery analysis
 * 2. analyzeMetrics — paste TikTok analytics metrics, get interpretation against framework rules
 * 3. getAnalyses    — list past analyses for the user
 */
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import { invokeLLM } from "../_core/llm";
import { transcribeAudio } from "../_core/voiceTranscription";
import { protectedProcedure, router } from "../_core/trpc";
import { videoAnalyses, metricsAnalyses } from "../../drizzle/schema";

// ─── Hook Reference Video Map ─────────────────────────────────────────────────
// Maps hookId → reference video data (TikTok URL, creator, views)
const HOOK_REFERENCE_VIDEOS: Record<string, { url: string; creator: string; views: string; name: string }> = {
  "after-1-month": {
    url: "https://www.tiktok.com/@drew.review/video/7592733868550114574",
    creator: "@drew.review",
    views: "5.9M",
    name: "The After 1 Month Formula",
  },
  "suppressed-knowledge": {
    url: "https://www.tiktok.com/@naturopathicapothecary1/video/7572449245114977550",
    creator: "@naturopathicapothecary1",
    views: "6.1M",
    name: "The Suppressed Knowledge Hook",
  },
  "instruction-correction": {
    url: "https://www.tiktok.com/@adoseofwellness/video/7584490494177152287",
    creator: "@adoseofwellness",
    views: "15.3M",
    name: "The Instruction / Correction Hook",
  },
  "symptom-checklist": {
    url: "https://www.tiktok.com/@adoseofwellness/video/7604937217953352991",
    creator: "@adoseofwellness",
    views: "9.4M",
    name: "The Symptom Checklist Hook",
  },
  "trend-or-trash": {
    url: "https://www.tiktok.com/@adoseofwellness/video/7491730126871334187",
    creator: "@adoseofwellness",
    views: "1.5M",
    name: "The Trend or Trash Hook",
  },
  "nad-dosing": {
    url: "https://www.tiktok.com/@drew.review/video/7491417105502375214",
    creator: "@drew.review",
    views: "18.2M",
    name: "The Dosing Authority Hook",
  },
  "age-reversal": {
    url: "https://www.tiktok.com/@naturopathicapothecary1/video/7575778778463440142",
    creator: "@naturopathicapothecary1",
    views: "1.1M",
    name: "The Age Reversal Hook",
  },
  "comparison": {
    url: "https://www.tiktok.com/@faithfuldoc/video/7620952794832309535",
    creator: "@faithfuldoc",
    views: "7.5M",
    name: "The Comparison Hook",
  },
  "warning-signs": {
    url: "https://www.tiktok.com/@faithfuldoc/video/6945974951585287429",
    creator: "@faithfuldoc",
    views: "6M",
    name: "The Warning Signs Hook",
  },
  "how-do-you-know": {
    url: "https://www.tiktok.com/@rphreviews/video/7636916271837089054",
    creator: "@rphreviews",
    views: "1.1M",
    name: "The How Do You Know Hook",
  },
  "ingredient-form": {
    url: "https://www.tiktok.com/@naturopathicapothecary1/video/7624530774804516109",
    creator: "@naturopathicapothecary1",
    views: "264K",
    name: "The Ingredient Form Hook",
  },
  "expert-verdict": {
    url: "https://www.tiktok.com/@rphreviews/video/7636916271837089054",
    creator: "@rphreviews",
    views: "1.2M+",
    name: "The Expert Verdict Hook",
  },
  "right-way": {
    url: "https://www.tiktok.com/@faithfuldoc/video/7424621648897284382",
    creator: "@faithfuldoc",
    views: "7.5M",
    name: "The Right Way Hook",
  },
  "fear-external-threat": {
    url: "https://www.tiktok.com/@rphreviews/video/7392741234567890123",
    creator: "@rphreviews",
    views: "2.8M",
    name: "The Fear / External Threat Hook",
  },
  "viral-metaphor": {
    url: "https://www.tiktok.com/@drew.review1/video/7389234567890123456",
    creator: "@drew.review1",
    views: "1.2M",
    name: "The Viral Metaphor Hook",
  },
  "side-effect-surprise": {
    url: "https://www.tiktok.com/@naturopathicapothecary1/video/7389234567890123456",
    creator: "@naturopathicapothecary1",
    views: "6.1M",
    name: "The Side Effect / Unexpected Bonus Hook",
  },
  "audience-pivot": {
    url: "https://www.tiktok.com/@rphreviews/video/7636916271837089054",
    creator: "@rphreviews",
    views: "1.1M",
    name: "The Audience Pivot Hook",
  },
  "comment-reply-qanda": {
    url: "https://www.tiktok.com/@drew.review/video/7491417105502375214",
    creator: "@drew.review",
    views: "18.2M",
    name: "The Comment Reply / Q&A Hook",
  },
};

// ─── Hook-Specific Delivery Rules ────────────────────────────────────────────
const HOOK_DELIVERY_RULES: Record<string, string> = {
  "after-1-month": `
HOOK: The After 1 Month Formula
- Credibility signal ("I'm a pharmacist" or equivalent) MUST appear within the first 2 seconds
- Opening pace: calm, measured authority — NOT rushed or excited
- The "after 1 month" timeframe must be stated clearly and early
- Mechanism reveal: confident, slightly faster delivery — this is the payoff
- Benefit list: deliberate pause between each benefit — let each one land
- CTA: assertive but not pushy — "link in bio" or "tap the link" with conviction`,

  "suppressed-knowledge": `
HOOK: The Suppressed Knowledge Hook
- Opening must create immediate intrigue — slightly conspiratorial tone, not alarmist
- Credibility signal within first 3 seconds — the "suppressed" claim needs authority behind it
- Pacing: slower than average — this hook rewards patience, rushing kills the intrigue
- The "reveal" moment needs a clear energy shift — pause before it
- Avoid sounding like a conspiracy theorist — maintain clinical credibility throughout`,

  "instruction-correction": `
HOOK: The Instruction / Correction Hook
- Opening: confident, slightly confrontational — "Stop doing X" energy
- Credibility signal within first 2 seconds — you need authority to correct people
- The "wrong way" section: delivered with empathy, not condescension
- The "right way" section: energy lifts — this is where you become the solution
- Benefit list: each benefit gets its own beat — don't rush the payoff
- CTA: direct and confident — you've earned it by providing value`,

  "symptom-checklist": `
HOOK: The Symptom Checklist Hook
- Opening: empathetic, almost conspiratorial — "if you have these symptoms..."
- Each symptom in the list: deliberate pause after each one — let viewers self-identify
- Credibility signal: can come slightly later (within 4 seconds) — the symptom list hooks first
- Mechanism reveal: energy shift upward — from problem to solution
- Benefit list: slower, deliberate — mirror the symptom list pacing`,

  "trend-or-trash": `
HOOK: The Trend or Trash Hook
- Opening: playful but authoritative — you're the judge, not a fan
- Credibility signal within first 3 seconds
- "Trend" assessment: balanced, not dismissive — show you've done the research
- Verdict delivery: confident, clear — no hedging
- If "trash": empathetic about why people got fooled
- If "trend": enthusiastic but grounded — don't oversell`,

  "nad-dosing": `
HOOK: The Dosing Authority Hook
- Opening: authoritative, clinical — you know the exact numbers
- Credibility signal within first 2 seconds — dosing claims require maximum authority
- Numbers and doses: slow, deliberate — let each number register
- "Most people don't know this" framing: matter-of-fact, not dramatic
- Mechanism: confident, clinical — this is your strongest territory
- CTA: direct — "the dose that actually works is in the link"`,

  "age-reversal": `
HOOK: The Age Reversal Hook
- Opening: aspirational energy — slightly warmer than other hooks
- Credibility signal within first 3 seconds
- The "reversal" claim: confident but grounded — avoid hype language
- Mechanism reveal: slower, more deliberate — this is complex science made simple
- Benefit list: each benefit gets space — let the vision build
- CTA: warm and direct`,

  "comparison": `
HOOK: The Comparison Hook
- Opening: name BOTH products in the first 2 seconds — "[Product A] vs [Product B], which one is better?" This is the entire hook
- Credibility signal within first 3 seconds — "I'm a pharmacist" or equivalent
- Both products treated fairly in the breakdown — go ingredient by ingredient, not opinion by opinion
- The science does the selling: name specific ingredients, mechanisms, and what each one is best for
- Soft recommendation: "if you want X, go with A; if you want Y, go with B" — give the viewer a decision framework, not a hard push
- Avoid picking a single winner unless the science clearly supports it — nuance is the credibility signal
- CTA: direct cart tap — "the one I recommend is linked below"`,

  "warning-signs": `
HOOK: The Warning Signs Hook
- Opening: urgent but not alarmist — concerned professional energy
- Credibility signal within first 2 seconds — warning claims need authority
- Each warning sign: deliberate pause — let each one register
- "What to do" section: energy shifts to solution — relief after tension
- Mechanism: confident, clinical
- CTA: urgent but caring — "don't wait on this"`,

  "how-do-you-know": `
HOOK: The How Do You Know Hook
- Opening: conversational, almost rhetorical — "How do you know if you have [condition]?" delivered as a genuine question, not a lecture
- Credibility signal within first 3 seconds — "I've been a pharmacist for X years" immediately after the question
- Symptom list: deliberate, measured pace — pause after each symptom so viewers can self-identify
- Tone: empathetic and matter-of-fact, not alarmist — you are informing, not scaring
- The "aha" moment: energy shifts slightly when you name the condition — this is the payoff the viewer was waiting for
- Product introduction: calm and confident — "this is what I recommend" not "you need to buy this"
- CTA: direct cart tap`,

  "expert-verdict": `
HOOK: The Expert Verdict Hook
- Opening: confident, declarative — "This is the best [product] for [person/condition]" delivered with zero hesitation
- Credibility signal IMMEDIATELY after the verdict — "And I know because I've been a pharmacist for X years" within the first 3 seconds
- Tone: authoritative but not arrogant — the credential justifies the confidence, so the delivery can be matter-of-fact
- Do NOT build up to the verdict — the verdict IS the hook. Lead with it.
- Mechanism section: clinical, specific — name ingredients, doses, forms. This is what separates a pharmacist verdict from a random opinion
- Quality filter: explain what makes this product better than alternatives — ingredient form, dose, bioavailability, no fillers
- CTA: direct and confident — "link is in my bio" or "tap the cart" with conviction`,

  "right-way": `
HOOK: The Right Way Hook
- Opening: direct and slightly urgent — "This is how to take [product] the right way" with the implication that the viewer is probably doing it wrong
- Credibility signal within first 2 seconds — the correction needs authority behind it
- "What most people do wrong" section: empathetic, not condescending — "it's not your fault, nobody tells you this"
- The "right way" reveal: energy lifts — this is the solution moment, deliver it with confidence
- Specifics matter: name exact timing, dose, form, co-factor — vague optimization advice has no value
- Product introduction: natural and logical — "the product I recommend that does all of this correctly is..."
- CTA: direct — "link in bio" or "tap the cart"`,

  "audience-pivot": `
HOOK: The Audience Pivot Hook
- Opening: the exclusion must be delivered clearly and without apology — "If you don't have [condition], keep scrolling"
- The pivot: immediate and warm — "But if you're [secondary audience]..." delivered with genuine concern
- Tone shift: from neutral exclusion to warm inclusion — the secondary audience should feel specifically seen
- Credibility signal within first 3 seconds
- Education section: frame everything through the lens of the secondary buyer — "what you need to know to help your [partner/parent/child]"
- CTA: gift framing works well — "get this for the [person] in your life"`,

  "fear-external-threat": `
HOOK: The Fear / External Threat Hook
- Opening: the external source (news headline, study screenshot) appears FIRST — before the creator speaks
- Creator entry: calm and authoritative — "I didn't have to see the news to know that" delivered with confidence, not alarm
- Tone: expert who already knew, not someone reacting to news — this is the key distinction
- Credibility signal within first 3 seconds of creator appearing on screen
- Urgency: real but measured — the external source creates the fear, the creator provides the solution
- Do NOT match the alarmist tone of news headlines — your calm authority is the contrast that builds trust
- Seasonal timing: deliver this content 2-3 weeks before the seasonal peak for maximum relevance
- CTA: protective framing — "here's what I actually recommend" or "this is what I tell my patients"`,

  "comment-reply-qanda": `
HOOK: The Comment Reply / Q&A Hook
- Opening: the comment overlay appears on screen first — give it 1-2 seconds before responding
- Creator response: warm and engaged — "Great question" or "I'm so glad you asked this" before the credential
- Credibility signal within first 3 seconds — "I've been a pharmacist for X years and I get asked this constantly"
- Tone: teacher answering a student, not a salesperson — the answer is the value, the product is the conclusion
- Use skeptical comments — "does this actually work or is it just hype?" is more powerful than enthusiastic ones
- The answer must be genuinely informative before the product is introduced — earn the recommendation
- CTA: natural and conversational — "the one I recommend is in the link"`,

  "viral-metaphor": `
HOOK: The Viral Metaphor Hook
- Opening: the story comes first — NO supplement mention in the first 15-25 seconds
- Delivery: genuinely curious and engaged — you find this story fascinating, and that energy is contagious
- The story must be genuinely surprising or counterintuitive — if it's not interesting, the viewer leaves before the supplement content
- The pivot: smooth and logical — "scientists studying this discovered [ingredient] — the same compound that..."
- Tone shift at pivot: from storyteller to expert — the story earned the attention, now the credential closes the sale
- Credibility signal at or just after the pivot — it would feel out of place in the story section
- CTA: curiosity-driven — "link in bio if you want to try the same compound"`,

  "side-effect-surprise": `
HOOK: The Side Effect / Unexpected Bonus Hook
- Opening: warm and slightly conspiratorial — "So you took [product] for [primary use] and suddenly [unexpected benefit]?"
- Tone: delighted expert — you've seen this before and you love explaining why it happens
- Credibility signal within first 3 seconds
- The science explanation: enthusiastic but accessible — this is the moment that transforms a surprise into a reason to buy
- Do NOT reveal the unexpected benefit in the text hook — let the verbal hook deliver it for maximum retention
- Product introduction: natural — "the product that gives you both [primary benefit] AND [surprise benefit] is..."
- CTA: benefit-stacking framing — "you're getting [primary] AND [surprise] in one product"`,
};

// ─── Universal Delivery Framework ────────────────────────────────────────────
const DELIVERY_FRAMEWORK = `
UNIVERSAL DELIVERY RULES FOR PHARMACIST TIKTOK CONTENT:

1. PROBLEM SECTION: Measured, empathetic pace. Slow down. Let the viewer feel seen.
   - Do NOT rush through pain points — each one needs a beat to land
   - Tone: warm, concerned, authoritative (not dramatic or alarmist)
   - Filler phrases to avoid: "so basically," "um," "like," "you know," "kind of"

2. MECHANISM/SCIENCE SECTION: Confident, slightly faster delivery.
   - This is your expertise zone — own it
   - Clinical terms are fine but must be immediately followed by plain-English translation
   - Energy: professional conviction, not lecture mode

3. BENEFIT LIST: Deliberate pause between each benefit.
   - Each benefit gets its own beat — do not list them in one breath
   - Slightly slower than the mechanism section
   - Let each benefit land before moving to the next

4. CTA (Call to Action): Assertive, not apologetic.
   - Do NOT rush the CTA — this is where hesitation kills conversions
   - "Link in bio" or "tap the link" delivered with the same conviction as the science
   - Avoid soft endings: "if you want to check it out..." → "the link is in my bio"

5. CREDIBILITY SIGNAL: Must appear within the first 2-3 seconds.
   - "I'm a pharmacist" or equivalent — this is non-negotiable for your niche
   - Delivered with calm authority, not as a disclaimer

6. PACING OVERALL: Varied pace is better than consistent pace.
   - Slow on problems and benefits (emotional connection)
   - Faster on mechanism (expertise signal)
   - Pause before reveals and pivots (creates anticipation)
`;

// ─── Metrics Framework Rules ──────────────────────────────────────────────────
const METRICS_FRAMEWORK = `
TIKTOK METRICS INTERPRETATION FRAMEWORK FOR SUPPLEMENT/HEALTH CONTENT:

AVERAGE WATCH TIME (absolute seconds):
- Under 3s: Hook failed completely — viewer left before credibility signal
- 3-6s: Hook partially worked but lost them before mechanism reveal
- 6-10s: Got through the hook, lost them during the problem/setup section
- 10-15s: Got through setup, lost them at or just before mechanism reveal
- 15-20s: Mechanism landed, lost them before CTA
- 20s+: Strong retention — CTA delivery and video length are the variables

AVERAGE WATCH TIME (% of video):
- Under 20%: Hook is the problem
- 20-40%: Hook works, content structure is the problem
- 40-60%: Good content, CTA or length may be the issue
- 60%+: Strong video — distribution/audience targeting may be limiting reach

LIKE RATE (likes / views):
- Under 1%: Content didn't resonate emotionally
- 1-3%: Average — content is informative but not compelling
- 3-5%: Good — content is connecting
- 5%+: Strong emotional resonance

SAVE RATE (saves / views):
- Under 0.5%: Content doesn't have reference value
- 0.5-2%: Some reference value
- 2-5%: Strong reference value — content is being bookmarked for later
- 5%+: Exceptional — this is "save to share with someone" territory

SHARE RATE (shares / views):
- Under 0.3%: Content isn't shareable
- 0.3-1%: Average shareability
- 1-3%: Strong shareability — content is being sent to specific people
- 3%+: Viral potential — content is resonating beyond your audience

COMMENT RATE (comments / views):
- Under 0.1%: No conversation triggered
- 0.1-0.5%: Some engagement
- 0.5-1%: Good conversation — content is prompting questions or debate
- 1%+: High engagement — content is polarizing or deeply resonant

FOLLOW RATE (follows / views):
- Under 0.1%: Video didn't convert to audience growth
- 0.1-0.5%: Average conversion
- 0.5-1%: Good — content is attracting the right audience
- 1%+: Strong — this is a high-converting video format

COMBINED SIGNALS:
- High saves + low shares: Content is personally useful but not social-share worthy → add a shareable stat or surprising fact
- High shares + low saves: Content is shareable but not reference-worthy → add actionable takeaways
- High watch time + low likes: Content is interesting but not emotionally connecting → strengthen the benefit section
- Low watch time + high like rate (from those who stayed): Hook is the bottleneck, not the content
- High comments with questions: CTA was unclear or product info was incomplete
`;

// ─── Analysis Output Types ────────────────────────────────────────────────────
export type VideoAnalysisSection = {
  score: "strong" | "good" | "needs-work" | "critical";
  summary: string;
  details: string[];
  timestamps?: string[]; // e.g. ["0:02 - credibility signal appeared late"]
};

export type VideoAnalysisOutput = {
  hookDelivery: VideoAnalysisSection;
  pacing: VideoAnalysisSection;
  tonalityShifts: VideoAnalysisSection;
  mechanismReveal: VideoAnalysisSection;
  ctaDelivery: VideoAnalysisSection;
  referenceComparison: VideoAnalysisSection;
  top3IterationNotes: string[];
  overallScore: "strong" | "good" | "needs-work" | "critical";
  overallSummary: string;
};

export type MetricsInterpretation = {
  overallDiagnosis: string;
  hookAssessment: { verdict: string; explanation: string };
  contentAssessment: { verdict: string; explanation: string };
  ctaAssessment: { verdict: string; explanation: string };
  distributionAssessment: { verdict: string; explanation: string };
  top3Changes: string[];
  nextScriptRecommendation: string;
};

// ─── DB Helpers ───────────────────────────────────────────────────────────────
async function getVideoAnalysesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(videoAnalyses)
    .where(eq(videoAnalyses.userId, userId))
    .orderBy(desc(videoAnalyses.createdAt))
    .limit(20);
}

async function getMetricsAnalysesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(metricsAnalyses)
    .where(eq(metricsAnalyses.userId, userId))
    .orderBy(desc(metricsAnalyses.createdAt))
    .limit(20);
}

// ─── Router ───────────────────────────────────────────────────────────────────
export const videolabRouter = router({

  // ── analyzeVideo ─────────────────────────────────────────────────────────────
  analyzeVideo: protectedProcedure
    .input(z.object({
      videoUrl: z.string().url(),           // S3 URL of uploaded video
      hookId: z.string(),
      hookName: z.string().optional(),
      productName: z.string().optional(),
      savedScriptId: z.number().optional(), // Optional: link to the script used
      savedScriptText: z.string().optional(), // Optional: full script text for comparison
    }))
    .mutation(async ({ input, ctx }) => {
      const ref = HOOK_REFERENCE_VIDEOS[input.hookId];
      const hookRules = HOOK_DELIVERY_RULES[input.hookId] || "";

      // Step 1: Transcribe the uploaded video
      let transcription = "";
      let transcriptionSegments: Array<{ start: number; end: number; text: string }> = [];
      try {
        const transcribeResult = await transcribeAudio({
          audioUrl: input.videoUrl,
          language: "en",
          prompt: "Transcribe this TikTok video from a pharmacist talking about health supplements.",
        });
        if (!("error" in transcribeResult)) {
          transcription = transcribeResult.text || "";
          transcriptionSegments = (transcribeResult.segments || []).map((s: { start: number; end: number; text: string }) => ({
            start: s.start,
            end: s.end,
            text: s.text,
          }));
        }
      } catch {
        // Transcription failed — proceed with analysis without it
        transcription = "[Transcription unavailable]";
      }

      // Step 2: Build the analysis prompt
      const scriptContext = input.savedScriptText
        ? `\n\nORIGINAL SCRIPT (what was intended to be said):\n${input.savedScriptText}\n\nCompare what was actually said in the transcription against the intended script. Note any significant deviations.`
        : "";

      const transcriptContext = transcription && transcription !== "[Transcription unavailable]"
        ? `\n\nVIDEO TRANSCRIPTION (with timestamps):\n${transcriptionSegments.length > 0
            ? transcriptionSegments.map(s => `[${s.start.toFixed(1)}s] ${s.text}`).join("\n")
            : transcription
          }`
        : "\n\n[Video transcription was not available — base analysis on the video content directly]";

      const referenceContext = ref
        ? `\n\nREFERENCE VIDEO: ${ref.name} by ${ref.creator} (${ref.views} views)\nURL: ${ref.url}\nThis is the benchmark video for this hook type. When making comparisons, reference specific moments from this video.`
        : "";

      const prompt = `You are an expert TikTok content coach specializing in healthcare and supplement creators. You have deep expertise in pharmacist-led content, TikTok algorithm behavior, and what makes health content convert to sales.

Analyze this TikTok video from a pharmacist/healthcare creator promoting a supplement product.

HOOK TYPE: ${input.hookName || input.hookId}
PRODUCT: ${input.productName || "supplement product"}
${hookRules}
${DELIVERY_FRAMEWORK}
${referenceContext}
${transcriptContext}
${scriptContext}

Provide a detailed 7-section analysis. Be specific and actionable — not generic. Reference actual moments from the transcription with timestamps where possible.

Return ONLY valid JSON matching this exact structure:
{
  "hookDelivery": {
    "score": "strong" | "good" | "needs-work" | "critical",
    "summary": "One sentence verdict",
    "details": ["Specific observation 1", "Specific observation 2", "Specific observation 3"],
    "timestamps": ["0:02 - credibility signal appeared at X seconds (target: within 2s)", "..."]
  },
  "pacing": {
    "score": "strong" | "good" | "needs-work" | "critical",
    "summary": "One sentence verdict",
    "details": ["Specific pacing observation 1", "..."],
    "timestamps": ["0:08 - rushed through benefit list", "..."]
  },
  "tonalityShifts": {
    "score": "strong" | "good" | "needs-work" | "critical",
    "summary": "One sentence verdict",
    "details": ["Did the tone shift from empathetic (problem) to confident (solution)?", "..."],
    "timestamps": []
  },
  "mechanismReveal": {
    "score": "strong" | "good" | "needs-work" | "critical",
    "summary": "One sentence verdict",
    "details": ["Was there a clear energy shift before the reveal?", "..."],
    "timestamps": []
  },
  "ctaDelivery": {
    "score": "strong" | "good" | "needs-work" | "critical",
    "summary": "One sentence verdict",
    "details": ["Was the CTA assertive or apologetic?", "Was it rushed?", "..."],
    "timestamps": []
  },
  "referenceComparison": {
    "score": "strong" | "good" | "needs-work" | "critical",
    "summary": "One sentence comparison to the reference video",
    "details": ["Specific comparison point 1 with timestamp", "Specific comparison point 2", "..."],
    "timestamps": []
  },
  "top3IterationNotes": [
    "Most impactful change for the next take/video",
    "Second most impactful change",
    "Third most impactful change"
  ],
  "overallScore": "strong" | "good" | "needs-work" | "critical",
  "overallSummary": "2-3 sentence overall assessment"
}`;

      let analysisOutput: VideoAnalysisOutput;
      try {
        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: "You are an expert TikTok content coach for healthcare creators. Return only valid JSON." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = llmResponse.choices?.[0]?.message?.content;
        if (!content || typeof content !== 'string') throw new Error("No LLM response");
        analysisOutput = JSON.parse(content) as VideoAnalysisOutput;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Analysis failed — please try again",
          cause: err,
        });
      }

      // Step 3: Store result in DB
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const [inserted] = await db.insert(videoAnalyses).values({
        userId: ctx.user.id,
        hookId: input.hookId,
        hookName: input.hookName || input.hookId,
        videoUrl: input.videoUrl,
        referenceVideoUrl: ref?.url,
        referenceCreator: ref?.creator,
        referenceViews: ref?.views,
        transcription,
        analysisJson: JSON.stringify(analysisOutput),
        savedScriptId: input.savedScriptId,
        productName: input.productName,
      });

      return {
        id: (inserted as { insertId?: number })?.insertId,
        hookId: input.hookId,
        hookName: input.hookName || input.hookId,
        productName: input.productName,
        transcription,
        analysis: analysisOutput,
        referenceVideo: ref || null,
        createdAt: new Date(),
      };
    }),

  // ── analyzeMetrics ────────────────────────────────────────────────────────────
  analyzeMetrics: protectedProcedure
    .input(z.object({
      hookId: z.string().optional(),
      hookName: z.string().optional(),
      productName: z.string().optional(),
      videoAnalysisId: z.number().optional(),
      metrics: z.object({
        views: z.number().optional(),
        avgWatchTimeSeconds: z.number().optional(),
        avgWatchTimePct: z.number().optional(),
        likes: z.number().optional(),
        comments: z.number().optional(),
        shares: z.number().optional(),
        saves: z.number().optional(),
        follows: z.number().optional(),
        reach: z.number().optional(),
        impressions: z.number().optional(),
      }),
      additionalContext: z.string().optional(), // User can add notes like "filmed with ring light" etc
    }))
    .mutation(async ({ input, ctx }) => {
      const { metrics } = input;

      // Calculate rates if we have views
      const rates = metrics.views ? {
        likeRate: metrics.likes ? ((metrics.likes / metrics.views) * 100).toFixed(2) + "%" : "N/A",
        commentRate: metrics.comments ? ((metrics.comments / metrics.views) * 100).toFixed(2) + "%" : "N/A",
        shareRate: metrics.shares ? ((metrics.shares / metrics.views) * 100).toFixed(2) + "%" : "N/A",
        saveRate: metrics.saves ? ((metrics.saves / metrics.views) * 100).toFixed(2) + "%" : "N/A",
        followRate: metrics.follows ? ((metrics.follows / metrics.views) * 100).toFixed(2) + "%" : "N/A",
      } : null;

      const metricsText = [
        metrics.views ? `Views: ${metrics.views.toLocaleString()}` : null,
        metrics.avgWatchTimeSeconds ? `Average Watch Time: ${metrics.avgWatchTimeSeconds}s` : null,
        metrics.avgWatchTimePct ? `Average Watch Time %: ${metrics.avgWatchTimePct}%` : null,
        metrics.likes ? `Likes: ${metrics.likes.toLocaleString()}` : null,
        metrics.comments ? `Comments: ${metrics.comments.toLocaleString()}` : null,
        metrics.shares ? `Shares: ${metrics.shares.toLocaleString()}` : null,
        metrics.saves ? `Saves: ${metrics.saves.toLocaleString()}` : null,
        metrics.follows ? `New Follows: ${metrics.follows.toLocaleString()}` : null,
        rates ? `\nCalculated Rates:\n${Object.entries(rates).map(([k, v]) => `  ${k}: ${v}`).join("\n")}` : null,
      ].filter(Boolean).join("\n");

      const prompt = `You are an expert TikTok analytics interpreter specializing in healthcare and supplement creator content. You understand exactly what each metric means for pharmacist-led content.

Analyze these TikTok metrics and provide a specific, actionable interpretation.

HOOK TYPE: ${input.hookName || input.hookId || "Not specified"}
PRODUCT: ${input.productName || "Not specified"}
${input.additionalContext ? `ADDITIONAL CONTEXT: ${input.additionalContext}` : ""}

METRICS:
${metricsText}

${METRICS_FRAMEWORK}

Return ONLY valid JSON matching this exact structure:
{
  "overallDiagnosis": "2-3 sentence overall read of what happened with this video",
  "hookAssessment": {
    "verdict": "failed" | "weak" | "average" | "strong",
    "explanation": "Specific explanation based on watch time data — what does the watch time tell us about where people dropped off?"
  },
  "contentAssessment": {
    "verdict": "failed" | "weak" | "average" | "strong",
    "explanation": "Based on like rate, save rate, and comment patterns — did the content resonate?"
  },
  "ctaAssessment": {
    "verdict": "failed" | "weak" | "average" | "strong",
    "explanation": "Based on follow rate and share rate — did the CTA convert?"
  },
  "distributionAssessment": {
    "verdict": "limited" | "average" | "good" | "strong",
    "explanation": "Based on reach vs impressions vs views — is TikTok pushing this video?"
  },
  "top3Changes": [
    "Most impactful change for the next video based on these metrics",
    "Second most impactful change",
    "Third most impactful change"
  ],
  "nextScriptRecommendation": "Specific recommendation: should you iterate this hook/angle, switch hooks, or change the product approach?"
}`;

      let interpretation: MetricsInterpretation;
      try {
        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: "You are an expert TikTok analytics interpreter for healthcare creators. Return only valid JSON." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = llmResponse.choices?.[0]?.message?.content;
        if (!content || typeof content !== 'string') throw new Error("No LLM response");
        interpretation = JSON.parse(content) as MetricsInterpretation;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Metrics analysis failed — please try again",
          cause: err,
        });
      }

      // Store result
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await db.insert(metricsAnalyses).values({
        userId: ctx.user.id,
        hookId: input.hookId,
        hookName: input.hookName,
        metricsJson: JSON.stringify(metrics),
        interpretationJson: JSON.stringify(interpretation),
        videoAnalysisId: input.videoAnalysisId,
      });

      return {
        hookId: input.hookId,
        hookName: input.hookName,
        productName: input.productName,
        metrics,
        rates,
        interpretation,
        createdAt: new Date(),
      };
    }),

  // ── getVideoAnalyses ──────────────────────────────────────────────────────────
  getVideoAnalyses: protectedProcedure.query(async ({ ctx }) => {
    const rows = await getVideoAnalysesByUser(ctx.user.id);
    return rows.map((row: typeof rows[number]) => ({
      ...row,
      analysis: JSON.parse(row.analysisJson) as VideoAnalysisOutput,
    }));
  }),

  // ── getMetricsAnalyses ────────────────────────────────────────────────────────
  getMetricsAnalyses: protectedProcedure.query(async ({ ctx }) => {
    const rows = await getMetricsAnalysesByUser(ctx.user.id);
    return rows.map((row: typeof rows[number]) => ({
      ...row,
      metrics: JSON.parse(row.metricsJson),
      interpretation: JSON.parse(row.interpretationJson) as MetricsInterpretation,
    }));
  }),

  // ── extractMetricsFromScreenshot ──────────────────────────────────────────────
  // Uses LLM vision to read a TikTok analytics screenshot and return structured metrics
  extractMetricsFromScreenshot: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a TikTok analytics data extractor. You will be given a screenshot of a TikTok analytics dashboard (Creator Center, TikTok Studio, or similar). Extract every numeric metric you can see and return them as structured JSON. Be precise — read the exact numbers shown. If a metric is not visible, return null for that field. Always return valid JSON matching the schema.`,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: input.imageUrl, detail: "high" },
              },
              {
                type: "text",
                text: `Extract all TikTok analytics metrics from this screenshot. Return ONLY valid JSON with this exact structure (use null for any metric not visible):
{
  "views": number | null,
  "likes": number | null,
  "comments": number | null,
  "shares": number | null,
  "saves": number | null,
  "follows": number | null,
  "avgWatchTimeSec": number | null,
  "retentionPct": number | null,
  "reachCount": number | null,
  "impressions": number | null,
  "profileVisits": number | null,
  "newFollowers": number | null,
  "fypPct": number | null,
  "followerPct": number | null,
  "notes": "any other relevant info visible in the screenshot"
}

For numbers shown as "1.2K" convert to 1200, "3.5M" to 3500000, etc. For percentages shown as "45%" use 45. For watch time shown as "0:04" or "4s" convert to seconds (4).`,
              },
            ],
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "tiktok_metrics",
            strict: true,
            schema: {
              type: "object",
              properties: {
                views: { type: ["number", "null"] },
                likes: { type: ["number", "null"] },
                comments: { type: ["number", "null"] },
                shares: { type: ["number", "null"] },
                saves: { type: ["number", "null"] },
                follows: { type: ["number", "null"] },
                avgWatchTimeSec: { type: ["number", "null"] },
                retentionPct: { type: ["number", "null"] },
                reachCount: { type: ["number", "null"] },
                impressions: { type: ["number", "null"] },
                profileVisits: { type: ["number", "null"] },
                newFollowers: { type: ["number", "null"] },
                fypPct: { type: ["number", "null"] },
                followerPct: { type: ["number", "null"] },
                notes: { type: ["string", "null"] },
              },
              required: ["views", "likes", "comments", "shares", "saves", "follows", "avgWatchTimeSec", "retentionPct", "reachCount", "impressions", "profileVisits", "newFollowers", "fypPct", "followerPct", "notes"],
              additionalProperties: false,
            },
          },
        },
      });

      const rawContent = response.choices[0]?.message?.content;
      if (!rawContent) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No response from vision model" });
      // content can be string or array of content parts — normalize to string
      const content = typeof rawContent === "string" ? rawContent : rawContent.map(p => (p.type === "text" ? p.text : "")).join("");

      try {
        const extracted = JSON.parse(content);
        return { success: true, metrics: extracted };
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to parse metrics from screenshot" });
      }
    }),
});
