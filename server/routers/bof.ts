import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { z } from "zod";
import {
  formatLineBankForPrompt,
  formatVerbatimTemplateForPrompt,
  formatVerbatimTemplateByIndex,
  getHybridBookend,
  getClosesForDealTypes,
  SHARED_URGENCY_CLOSES,
  getTopLines,
  BOF_TEMPLATE_TYPE_MAP,
} from "../../client/src/lib/bofLineBank";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BofScript = {
  hookId: string;
  hookName: string;
  textHook: string;
  verbalHook: string;
  dealReveal: string;
  howTo: string;
  urgencyClose: string;
  fullScript: string;
  format: "BOF" | "BOF+";
  includedCouponLanguage: boolean;
};

export type BofBatchResult = {
  position: number;
  hookId: string;
  hookName: string;
  format: "BOF" | "BOF+";
  includedCouponLanguage: boolean;
  script: BofScript;
};

export type BofVariant = {
  label: "A" | "B" | "C";
  textHook: string;
  verbalHook: string;
  urgencyClose: string;
  fullScript: string;
  rationale: string;
};

export type BofABTestResult = {
  hookId: string;
  hookName: string;
  scriptBody: string;  // deal reveal + how-to (shared across all variants)
  variants: [BofVariant, BofVariant, BofVariant];
};

// ─── BOF System Prompt ────────────────────────────────────────────────────────
// Completely separate from healthcare/pharmacist prompt — no medical authority, no clinical language

function buildBofSystemPrompt(): string {
  return `You are a TikTok Shop affiliate content writer specializing in bottom-of-funnel (BOF) scripts.

Your job is to write short, punchy video scripts that sell the deal — not the product. The viewer is already in buying mode. Your only job is to give them a reason to buy RIGHT NOW and tell them exactly how to claim the deal.

═══════════════════════════════════════════
CREATOR VOICE CONSISTENCY — CRITICAL RULE
═══════════════════════════════════════════
You will be given a line bank with lines from up to four creators:
  - @momfindsbyfaith — warmer, more personal, "tap the orange cart", "tonight", "before they raise the price"
  - @dealscope — faster, more direct, "step one", "click the shopping cart", "hurry up", "timer runs out"
  - @blackfridaybrian — fake-outrage style, "throwing this in the trash", "I'm so mad at this company", "deep dive with AI", "add two to activate flash sale"
  - @welearn2earn — protective style, "hope you didn't buy", "your ass got robbed", "for next to nothing", "because you know the sale's gonna be ending very soon"
  - @cakedfinds — counting/bundle style, "not one, not two, not three", "have you seen all these products", "check your price and read those reviews", "I have a feeling this sale is going to sell them out again"

You MUST pick ONE creator's voice at the start of the script and stay in that voice for the ENTIRE script.
DO NOT mix lines from different creators in the same script.
DO NOT blend their styles — pick one and commit.

How to choose:
- If the line bank has lines from only one creator for this hook → use that creator's voice
- If the line bank has more @momfindsbyfaith lines for this hook → use Faith's voice
- If the line bank has more @dealscope lines → use dealscope's voice
- If mixed → default to @momfindsbyfaith (she is the primary reference creator)

═══════════════════════════════════════════
ASSEMBLY RULES
═══════════════════════════════════════════
You will receive a LINE BANK for the selected hook. Each section gives you 3–4 proven lines.

Your job is to:
1. SELECT one line from each section (do not combine or blend lines from the same section)
2. SUBSTITUTE the [variables] with the actual product name, brand, deal mechanics, and deadline
3. SEQUENCE the selected lines into a complete, natural-sounding script

You may lightly adapt sentence connectors between sections (e.g., "So here's the deal." / "This is how.") but the core phrasing of each selected line must remain intact.

DO NOT invent new hook phrases, new closing lines, or new how-to instructions. Work only from the provided line bank.

═══════════════════════════════════════════
DEDUPLICATION RULES — CRITICAL
═══════════════════════════════════════════
Each script position must add NEW information. Never repeat what was already said.

1. CART TAP RULE: The instruction to tap/click the cart appears EXACTLY ONCE — in the HOW-TO section only.
   - The deal reveal explains WHAT the deal is — it does NOT tell them to tap the cart
   - The urgency close creates FOMO — it does NOT repeat the cart tap instruction
   - Wrong: "Tap the orange cart to unlock the flash sale. Just tap the orange cart and... tap the orange cart before it disappears."
   - Right: Deal reveal explains the deal → How-to says tap the cart ONCE → Close says "before tonight" or "before they raise the price"

2. URGENCY CLOSE RULE: The closing line must reference a CONSEQUENCE (price going up, sale ending, timer running out) — NOT a mechanic (tapping the cart, adding to cart). The close is about WHAT HAPPENS IF THEY WAIT, not HOW TO BUY.
   - Wrong close: "Tap the orange cart before it disappears"
   - Right close: "This sale ends tonight" / "before they raise the price" / "before the timer runs out"

3. POSITION UNIQUENESS: Each of the four positions (hook → deal reveal → how-to → close) must introduce something new:
   - Hook: grabs attention, sets up the deal
   - Deal reveal: explains the specific deal mechanics and savings
   - How-to: tells them the exact steps to claim it (cart tap goes HERE)
   - Close: creates urgency with a deadline or consequence — nothing else

4. DEAL REVEAL CONTINUATION RULE: The deal reveal must CONTINUE from where the verbal hook ended — it must NOT restate the same fact the hook just said.
   - If the verbal hook ends with "they just dropped their price" → the deal reveal must NOT start with "They just dropped their price"
   - If the verbal hook ends with "major double discount" → the deal reveal must NOT repeat "major double discount"
   - The deal reveal picks up from the hook and adds NEW detail: HOW MUCH is the deal, WHAT is included, HOW to stack it
   - Wrong: Hook says "they dropped their price" → Deal reveal says "They just dropped their price. When you tap..."
   - Right: Hook says "they dropped their price" → Deal reveal says "When you tap the orange cart, you'll unlock a major flash sale and fast and free shipping."

5. PRICE ANCHOR RULE: The retail price and deal price are each stated EXACTLY ONCE in the entire script.
   - State the price anchor in the deal reveal section only
   - Do NOT repeat the deal price in the how-to or urgency close
   - Wrong: "Usually $499, today $399. Right now with the flash sale stacked, you're getting it for $399."
   - Right: "Usually $499, today $399 with the flash sale and coupon stacked." (stated once, move on)

═══════════════════════════════════════════
FORMAT RULES
═══════════════════════════════════════════
- BOF scripts: 12–25 seconds when read aloud — pure deal close, no product features
- BOF+ scripts: 25–45 seconds — include the proof point section between deal reveal and how-to
- Every script must include specific deal mechanics — no vague language like "great deal"
- Every closing line must reference a specific consequence (price goes up, timer runs out, sale ends tonight)
- Do NOT use "link in bio" — always reference the orange cart or shopping cart button
- Do NOT use medical claims, health claims, or pharmacist authority
- Do NOT use percentage claims (e.g., "50% off") in the text hook — use deal mechanics instead
- Write in a fast, direct, conversational tone — no filler words, no warm-up, no greeting
- The product must be identifiable from the first 3 seconds

═══════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════
Return a JSON object with these exact fields:
{
  "textHook": "The text that appears on screen in the first 3 seconds",
  "verbalHook": "What the creator says in the first 3 seconds — the opening hook only, no deal mechanics",
  "dealReveal": "How the deal is explained — specific mechanics, what is included, how to stack. NO cart-tap instruction here.",
  "howTo": "Exact steps to claim the deal — cart-tap instruction goes HERE and ONLY HERE",
  "urgencyClose": "Hard deadline closing line — consequence only (price going up, sale ending, timer running out). NO cart-tap, NO coupon mention."
}

IMPORTANT: Do NOT return a fullScript field. The fullScript will be assembled server-side from the four fields above in sequence.`;
}

// ─── BOF User Prompt ──────────────────────────────────────────────────────────
// Routes to verbatim template, hybrid bookend, or assembly based on hook's templateType

type BofPromptParams = {
  hookId: string;
  hookName: string;
  format: "BOF" | "BOF+";
  productName: string;
  keyBenefit?: string;
  dealTypes: string[];
  dealDeadline: string;
  creatorCode?: string;
  quantityUnlock?: string;
  includeCoupon: boolean;
  retailPrice?: string;
  dealPrice?: string;
  templateIndex?: number; // for verbatim template swap
};

function buildBofUserPrompt(params: BofPromptParams): string {
  const templateType = BOF_TEMPLATE_TYPE_MAP[params.hookId] || 'assembly';

  if (templateType === 'verbatim') {
    return buildVerbatimPrompt(params);
  } else if (templateType === 'hybrid') {
    return buildHybridPrompt(params);
  } else {
    return buildAssemblyPrompt(params);
  }
}

// ── Verbatim Template Prompt ──────────────────────────────────────────────────
// LLM fills in [SLOTS] only — no line selection, no assembly decisions

function buildVerbatimPrompt(params: BofPromptParams): string {
  const templates = params.templateIndex !== undefined
    ? formatVerbatimTemplateByIndex(params.hookId, params.templateIndex)
    : formatVerbatimTemplateForPrompt(params.hookId);

  // CRITICAL: For verbatim templates, the coupon and cart-tap language is already
  // baked into the template itself. We must NOT instruct the LLM to add more.
  // The only exception is when the user explicitly has a creator code — that slot
  // may need to be filled if the template supports it.
  const couponInstruction = params.includeCoupon
    ? "The selected template already contains the coupon and cart-tap language. Do NOT add any additional coupon mentions or cart-tap instructions outside of what is in the template. Fill in the [SLOTS] only."
    : "DO NOT mention coupons in this script — if the template contains a coupon line, remove it from the output.";

  const priceAnchorInstruction = params.retailPrice && params.dealPrice
    ? `PRICE ANCHOR: retail price is $${params.retailPrice}, deal price is $${params.dealPrice}. Use these exact numbers.`
    : "";

  const dealTypeList = params.dealTypes.join(", ");
  const quantityInfo = params.quantityUnlock ? `Quantity threshold: ${params.quantityUnlock}` : "";
  const codeInfo = params.creatorCode ? `Creator code: ${params.creatorCode}` : "";

  return `Fill in the verbatim template below for the "${params.hookName}" hook. Replace every [SLOT] with the actual product-specific information. Do NOT change any other wording.

PRODUCT: ${params.productName}
DEAL TYPES: ${dealTypeList}
DEAL DEADLINE: ${params.dealDeadline}
${priceAnchorInstruction}
${quantityInfo}
${codeInfo}
KEY BENEFIT / FEATURE: ${params.keyBenefit || "(not provided — infer from product name)"}

COUPON INSTRUCTION: ${couponInstruction}

═══════════════════════════════════════════
VERBATIM TEMPLATES — FILL IN [SLOTS] ONLY
═══════════════════════════════════════════
${templates}

INSTRUCTIONS:
1. Choose the template that best fits the deal type and product
2. Replace ALL [SLOTS] with actual product-specific values
3. Do NOT change any other words, phrases, or sentence structure
4. The output must sound like the creator said it verbatim — just with this product
5. For the returning-this hook: the BENEFIT LIST must list 3-5 real product benefits as the "negative list" (it's not because X, Y, Z)
6. DEDUPLICATION: The fullScript field must contain each instruction EXACTLY ONCE. If you see the same cart-tap or coupon sentence appearing twice, remove the duplicate — keep only the first occurrence.

Return a JSON object with these exact fields:
{
  "textHook": "The on-screen text from the template (the TEXT: line)",
  "verbalHook": "The opening spoken line(s) from the template — the hook section only",
  "dealReveal": "The deal explanation section from the template",
  "howTo": "The how-to / steps section from the template",
  "urgencyClose": "The final closing line from the template",
  "fullScript": "The COMPLETE filled-in template as a single spoken script (all sections combined, exactly as the creator would say it)"
}

Return only the JSON object — no explanation, no markdown, no extra text.`;
}

// ── Hybrid Bookend Prompt ─────────────────────────────────────────────────────
// Verbatim opening hook + verbatim close. Middle assembled from line bank.

function buildHybridPrompt(params: BofPromptParams): string {
  const bookend = getHybridBookend(params.hookId);
  const lineBank = formatLineBankForPrompt(params.hookId, params.dealTypes);

  const relevantCloses = getClosesForDealTypes(params.dealTypes);
  const closeOptions = relevantCloses.length > 0
    ? relevantCloses.slice(0, 8).map((l, i) => `  ${i + 1}. "${l.line}" [${l.creator}]`).join("\n")
    : SHARED_URGENCY_CLOSES.slice(0, 8).map((l, i) => `  ${i + 1}. "${l.line}"`).join("\n");

  const couponInstruction = params.includeCoupon
    ? params.dealTypes.includes("coupon")
      ? "INCLUDE coupon language in the deal reveal — use ONE of the coupon lines from the line bank. Do NOT add coupon language in the urgency close as well — coupon appears ONCE only."
      : "INCLUDE soft coupon gamification in the deal reveal — use ONE of the coupon lines from the line bank (e.g. 'some of you even have coupons today'). Do NOT repeat it in the urgency close."
    : "DO NOT mention coupons in this script — omit all coupon lines.";

  const proofInstruction = params.format === "BOF+"
    ? `BOF+ PROOF POINT: After the deal reveal, include a proof point section (5–15 seconds):
${params.keyBenefit
  ? `- Use this creator-provided benefit/feature info: "${params.keyBenefit}"
- Hold up each item one by one, name it, give one benefit (5 sec max per item)
- Keep it tight — one proof point, then move straight to how-to`
  : "- Include one brief product benefit or proof point. Keep it to 1–2 sentences."}`
    : "Pure BOF: DO NOT include product features or benefits.";

  const bookendSection = bookend
    ? `VERBATIM OPENING HOOK (use this exactly — fill in [SLOTS] only):
Text Hook: "${bookend.textHook}"
Verbal Hook: "${bookend.verbalHook}"

VERBATIM URGENCY CLOSE (use one of these exactly — fill in [SLOTS] only):
"${bookend.urgencyClose}"

OR choose from these deal-type-matched closes:
${closeOptions}`
    : `URGENCY CLOSE OPTIONS (pick exactly ONE, matched to deal type):
${closeOptions}`;

  return `Write a ${params.format} TikTok Shop script using the "${params.hookName}" hook framework.

PRODUCT: ${params.productName}
DEAL TYPES: ${params.dealTypes.join(", ")}
DEAL DEADLINE: ${params.dealDeadline}
${params.retailPrice && params.dealPrice ? `PRICE ANCHOR: $${params.retailPrice} → $${params.dealPrice}` : ""}
${params.quantityUnlock ? `QUANTITY THRESHOLD: ${params.quantityUnlock}` : ""}
${params.creatorCode ? `CREATOR CODE: ${params.creatorCode}` : ""}
KEY BENEFIT / FEATURE: ${params.keyBenefit || "(not provided — infer from product name)"}

${bookendSection}

═══════════════════════════════════════════
SLOT FILLING GUIDE
═══════════════════════════════════════════
The verbatim hook and close above contain [SLOTS] that MUST be replaced with real values:
- [PRODUCT] → replace with the actual product name above
- [DEAL_REASON] → derive from the deal types (e.g. "for the same price you can get [better deal]" or "they just dropped the price on this")
- [BETTER_DEAL] → describe what makes this deal better (more product, free gift, bundle, lower price)
- [FREE_GIFT] → if deal type includes free-gift, name the specific free gift; otherwise remove this slot entirely
- [DEADLINE] → replace with the deal deadline above (e.g. "tonight", "today only")
- [PRODUCT_A] / [PRODUCT_B] → if the hook is a bundle comparison, name the two individual items
- [PRODUCT_BIGGER] → name the larger/better version of the product
NEVER leave any [SLOT] unfilled in the output — if you cannot determine the value, derive it from the product name and deal context.

═══════════════════════════════════════════
MIDDLE SECTION LINE BANK
(Select from these proven lines for deal reveal + how-to)
═══════════════════════════════════════════
${lineBank}

COUPON INSTRUCTION: ${couponInstruction}
${proofInstruction}

RULES:
- Use the verbatim opening hook above EXACTLY — only fill in [SLOTS] using the Slot Filling Guide
- Use the verbatim urgency close above EXACTLY — only fill in [SLOTS] using the Slot Filling Guide
- The middle section (deal reveal + how-to) is assembled from the line bank above
- Pick ONE creator voice and stay in it for the ENTIRE script
- Cart tap instruction appears EXACTLY ONCE in the how-to section only
- Coupon language appears EXACTLY ONCE — in the deal reveal or how-to, never in the urgency close
- The urgency close references a CONSEQUENCE only — not a cart tap instruction, not a coupon mention
- DEDUPLICATION CHECK: Before finalizing fullScript, scan for any sentence that appears twice. If found, remove the duplicate — keep only the first occurrence.

Return only the JSON object — no explanation, no markdown, no extra text.`;
}

// ── Assembly Prompt ───────────────────────────────────────────────────────────
// Full line bank assembly — top-3 per position

function buildAssemblyPrompt(params: BofPromptParams): string {
  const dealTypeDescriptions: Record<string, string> = {
    "flash-sale": "Active TikTok Shop flash sale — tap the orange cart to activate",
    "coupon": "Coupon available in the deals tab — must be manually claimed",
    "creator-code": `Creator code: ${params.creatorCode || "[CODE]"} — applied at checkout`,
    "quantity-unlock": `Quantity unlock: add ${params.quantityUnlock || "[X]"} to cart to unlock bundle coupon`,
    "free-shipping": "Free shipping included",
    "free-gift": "Free gift with purchase when added to cart",
  };

  const activeDealTypes = params.dealTypes
    .map(id => dealTypeDescriptions[id] || id)
    .join("\n- ");

  const couponInstruction = params.includeCoupon
    ? params.dealTypes.includes("coupon")
      ? "INCLUDE coupon language: use one of the coupon lines from the line bank — tell them to go to the deals tab and claim the coupon before checking out."
      : "INCLUDE soft coupon gamification: use one of the coupon lines from the line bank — mention that some viewers may see a coupon at checkout."
    : "DO NOT mention coupons in this script — omit all coupon lines.";

  const proofInstruction = params.format === "BOF+"
    ? `This is a BOF+ script. After the deal reveal, include a PROOF POINT section (5–15 seconds):
${params.keyBenefit
  ? `- Use this creator-provided benefit/feature info: "${params.keyBenefit}"
- Keep it tight — one proof point, then move straight to how-to`
  : "- Include one brief product benefit or proof point based on the hook type. Keep it to 1–2 sentences."}`
    : "This is a pure BOF script. DO NOT include product features or benefits — only the deal, how to get it, and urgency.";

  const priceAnchorInstruction = params.retailPrice && params.dealPrice
    ? `PRICE ANCHOR: retail price is $${params.retailPrice}, deal price is $${params.dealPrice}. Use these exact numbers.`
    : "";

  const lineBank = formatLineBankForPrompt(params.hookId, params.dealTypes);

  const relevantCloses = getClosesForDealTypes(params.dealTypes);
  const closeOptions = relevantCloses.length > 0
    ? relevantCloses.map((l, i) => `  ${i + 1}. "${l.line}" [${l.creator}]`).join("\n")
    : SHARED_URGENCY_CLOSES.map((l, i) => `  ${i + 1}. "${l.line}"`).join("\n");

  return `Write a ${params.format} TikTok Shop script using the "${params.hookName}" hook framework.

PRODUCT: ${params.productName}

ACTIVE DEAL MECHANICS:
- ${activeDealTypes}

DEAL DEADLINE: ${params.dealDeadline}

${priceAnchorInstruction}

COUPON INSTRUCTION: ${couponInstruction}

FORMAT INSTRUCTION: ${proofInstruction}

═══════════════════════════════════════════
LINE BANK FOR THIS HOOK
(Select from these proven lines — do NOT invent new phrasing)
═══════════════════════════════════════════
${lineBank}

URGENCY CLOSE OPTIONS — MATCHED TO DEAL TYPE (pick exactly ONE, do not combine or paraphrase):
${closeOptions}

REMINDER: Pick ONE creator voice (@momfindsbyfaith OR @dealscope) and stay in it for the entire script.
REMINDER: Cart tap instruction appears EXACTLY ONCE — in the how-to section only. Coupon language appears EXACTLY ONCE — in the deal reveal or how-to, never in the urgency close.
REMINDER: DEDUPLICATION — scan fullScript before finalizing. If any sentence appears twice, remove the duplicate.

Write the script now. Return only the JSON object — no explanation, no markdown, no extra text.`;
}


// ─── BOF A/B Variant Prompt ──────────────────────────────────────────────────

function buildAbTestPrompt(params: {
  hookId: string;
  hookName: string;
  format: "BOF" | "BOF+";
  productName: string;
  keyBenefit?: string;
  dealTypes: string[];
  dealDeadline: string;
  creatorCode?: string;
  quantityUnlock?: string;
  includeCoupon: boolean;
  scriptBody: string; // the shared middle section already generated
}): string {
  // Get top hook options (text + verbal) for variety
  const textHookOptions = getTopLines(params.hookId, "textHooks", 4);
  const verbalHookOptions = getTopLines(params.hookId, "verbalHooks", 4);

  // Get all urgency closes split by creator for variety
  const faithCloses = SHARED_URGENCY_CLOSES
    .filter(l => l.creator === "@momfindsbyfaith")
    .slice(0, 5)
    .map((l, i) => `  Faith-${i + 1}. "${l.line}"`);
  const dealCloses = SHARED_URGENCY_CLOSES
    .filter(l => l.creator === "@dealscope")
    .slice(0, 5)
    .map((l, i) => `  Dealscope-${i + 1}. "${l.line}"`);

  const dealTypeDescriptions: Record<string, string> = {
    "flash-sale": "flash sale (tap orange cart)",
    "coupon": "coupon in deals tab",
    "creator-code": `creator code: ${params.creatorCode || "[CODE]"}`,
    "quantity-unlock": `quantity unlock: add ${params.quantityUnlock || "[X]"}`,
    "free-shipping": "free shipping",
    "free-gift": "free gift with purchase",
  };
  const dealSummary = params.dealTypes.map(id => dealTypeDescriptions[id] || id).join(" + ");

  return `You are a TikTok Shop BOF script writer. Generate 3 A/B/C variants for the same script.

PRODUCT: ${params.productName}
HOOK: ${params.hookName}
DEAL: ${dealSummary}
DEADLINE: ${params.dealDeadline}
${params.keyBenefit ? `KEY BENEFIT: ${params.keyBenefit}` : ""}

SHARED SCRIPT BODY (deal reveal + how-to — DO NOT change this):
"""${params.scriptBody}"""

Your task: generate 3 variants that each pair a DIFFERENT opening hook with a DIFFERENT urgency close.
The shared script body above stays identical in all 3 variants.

CREATOR VOICE RULE:
- Variant A: Use @momfindsbyfaith voice throughout (warmer, "tap the orange cart", "before they raise the price")
- Variant B: Use @dealscope voice throughout (faster, "step one", "hurry up", "timer runs out")
- Variant C: Use whichever voice fits best for this hook — pick the strongest combo from either creator

AVAILABLE TEXT HOOK OPTIONS (on-screen text for first 3 seconds):
${textHookOptions.map((l, i) => `  ${i + 1}. "${l}"`).join("\n")}

AVAILABLE VERBAL HOOK OPTIONS (what the creator says in first 3 seconds):
${verbalHookOptions.map((l, i) => `  ${i + 1}. "${l}"`).join("\n")}

AVAILABLE URGENCY CLOSES — @momfindsbyfaith:
${faithCloses.join("\n")}

AVAILABLE URGENCY CLOSES — @dealscope:
${dealCloses.join("\n")}

RULES:
- Each variant must use a DIFFERENT text hook, verbal hook, and urgency close
- Substitute all [variables] with the actual product name, deal mechanics, and deadline
- Do NOT invent new phrasing — select only from the options above
- Keep the rationale to one sentence explaining why this hook+close combo works

FULLSCRIPT ASSEMBLY RULE (CRITICAL):
- The fullScript field must be assembled MECHANICALLY: verbalHook + " " + sharedBody + " " + urgencyClose
- Do NOT rewrite, expand, or add any new sentences to fullScript
- Do NOT add cart-tap instructions, coupon mentions, or how-to steps to fullScript — the shared body already contains all of that
- The shared body is a complete, self-contained middle section — treat it as a fixed block

DEDUPLICATION RULES (apply to all 3 variants):
- URGENCY CLOSE must reference a CONSEQUENCE only (price going up, timer running out, sale ending) — NOT a cart tap instruction
- Do NOT include "tap the orange cart", "click the cart", or coupon language in the urgencyClose field — the shared body already handles that
- The urgencyClose field is about WHAT HAPPENS IF THEY WAIT, not HOW TO BUY
- FINAL CHECK: Before outputting, scan each fullScript for any sentence that appears twice. If found, remove the duplicate — keep only the first occurrence.

Return JSON:
{
  "variantA": {
    "textHook": "on-screen text",
    "verbalHook": "spoken opening line (from the options above, with [variables] filled in)",
    "urgencyClose": "closing line (consequence only — no cart-tap, no coupon)",
    "rationale": "one sentence"
  },
  "variantB": {
    "textHook": "on-screen text",
    "verbalHook": "spoken opening line (from the options above, with [variables] filled in)",
    "urgencyClose": "closing line (consequence only — no cart-tap, no coupon)",
    "rationale": "one sentence"
  },
  "variantC": {
    "textHook": "on-screen text",
    "verbalHook": "spoken opening line (from the options above, with [variables] filled in)",
    "urgencyClose": "closing line (consequence only — no cart-tap, no coupon)",
    "rationale": "one sentence"
  }
}

Return only the JSON object — no explanation, no markdown.`;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const bofRouter = router({
  generate: publicProcedure
    .input(
      z.object({
        hookId: z.string(),
        hookName: z.string(),
        hookTextFormula: z.string(),
        hookVerbalFormula: z.string(),
        format: z.enum(["BOF", "BOF+"]),
        productName: z.string().min(1),
        keyBenefit: z.string().optional(),
        dealTypes: z.array(z.string()),
        dealDeadline: z.string(),
        creatorCode: z.string().optional(),
        quantityUnlock: z.string().optional(),
        includeCoupon: z.boolean(),
        retailPrice: z.string().optional(),
        dealPrice: z.string().optional(),
        creatorVoice: z.enum(['faith', 'dealscope']).optional(),
        templateIndex: z.number().optional(), // for verbatim template swap
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = buildBofSystemPrompt();
      const userPrompt = buildBofUserPrompt({
        hookId: input.hookId,
        hookName: input.hookName,
        format: input.format,
        productName: input.productName,
        keyBenefit: input.keyBenefit,
        dealTypes: input.dealTypes,
        dealDeadline: input.dealDeadline,
        creatorCode: input.creatorCode,
        quantityUnlock: input.quantityUnlock,
        includeCoupon: input.includeCoupon,
        retailPrice: input.retailPrice,
        dealPrice: input.dealPrice,
        templateIndex: input.templateIndex,
      });

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "bof_script",
            strict: true,
            schema: {
              type: "object",
              properties: {
                textHook: { type: "string" },
                verbalHook: { type: "string" },
                dealReveal: { type: "string" },
                howTo: { type: "string" },
                urgencyClose: { type: "string" },
                fullScript: { type: "string" },
              },
              required: ["textHook", "verbalHook", "dealReveal", "howTo", "urgencyClose"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0].message.content as string;
      const parsed = JSON.parse(content);

      // For verbatim hooks: the LLM fills in the complete template as fullScript.
      // For hybrid/assembly hooks: assemble server-side from parts to prevent LLM from duplicating sentences.
      const templateType = BOF_TEMPLATE_TYPE_MAP[input.hookId] || 'assembly';
      const rawFullScript = templateType === 'verbatim'
        ? (parsed.fullScript || [parsed.verbalHook, parsed.dealReveal, parsed.howTo, parsed.urgencyClose].filter(Boolean).join(" ").replace(/\s{2,}/g, " ").trim())
        : [parsed.verbalHook, parsed.dealReveal, parsed.howTo, parsed.urgencyClose].filter(Boolean).join(" ").replace(/\s{2,}/g, " ").trim();
      const fullScript = deduplicateScript(rawFullScript);

      return {
        hookId: input.hookId,
        hookName: input.hookName,
        textHook: parsed.textHook,
        verbalHook: parsed.verbalHook,
        dealReveal: parsed.dealReveal,
        howTo: parsed.howTo,
        urgencyClose: parsed.urgencyClose,
        fullScript,
        format: input.format,
        includedCouponLanguage: input.includeCoupon,
      } as BofScript;
    }),

  batchGenerate: publicProcedure
    .input(
      z.object({
        productName: z.string().min(1),
        keyBenefit: z.string().optional(),
        dealTypes: z.array(z.string()),
        dealDeadline: z.string(),
        creatorCode: z.string().optional(),
        quantityUnlock: z.string().optional(),
        retailPrice: z.string().optional(),
        dealPrice: z.string().optional(),
        creatorVoice: z.enum(['faith', 'dealscope']).optional(),
        mixVoices: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Import testing sequence and hooks at runtime to avoid circular deps
      const { BOF_TESTING_SEQUENCE, BOF_HOOKS } = await import(
        "../../client/src/lib/bofHooks.js"
      ).catch(() => require("../../client/src/lib/bofHooks"));

      const systemPrompt = buildBofSystemPrompt();
      const results: BofBatchResult[] = [];

      for (const seqItem of BOF_TESTING_SEQUENCE) {
        const hook = BOF_HOOKS.find((h: { id: string }) => h.id === seqItem.hookId);
        if (!hook) continue;

        const userPrompt = buildBofUserPrompt({
          hookId: hook.id,
          hookName: hook.name,
          format: seqItem.format,
          productName: input.productName,
          keyBenefit: input.keyBenefit,
          dealTypes: input.dealTypes,
          dealDeadline: input.dealDeadline,
          creatorCode: input.creatorCode,
          quantityUnlock: input.quantityUnlock,
          includeCoupon: seqItem.includeCoupon,
          retailPrice: input.retailPrice,
          dealPrice: input.dealPrice,
        });

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "bof_script",
              strict: true,
              schema: {
                type: "object",
              properties: {
                textHook: { type: "string" },
                verbalHook: { type: "string" },
                dealReveal: { type: "string" },
                howTo: { type: "string" },
                urgencyClose: { type: "string" },
                fullScript: { type: "string" },
              },
              required: ["textHook", "verbalHook", "dealReveal", "howTo", "urgencyClose"],
              additionalProperties: false,
            },
          },
        },
      });

        const content = response.choices[0].message.content as string;
        const parsed = JSON.parse(content);

        // For verbatim hooks: use fullScript from LLM (it fills in the complete template).
        // For hybrid/assembly hooks: assemble server-side to prevent LLM from duplicating sentences.
        const batchTemplateType = BOF_TEMPLATE_TYPE_MAP[hook.id] || 'assembly';
        const rawBatchFullScript = batchTemplateType === 'verbatim'
          ? (parsed.fullScript || [parsed.verbalHook, parsed.dealReveal, parsed.howTo, parsed.urgencyClose].filter(Boolean).join(" ").replace(/\s{2,}/g, " ").trim())
          : [parsed.verbalHook, parsed.dealReveal, parsed.howTo, parsed.urgencyClose].filter(Boolean).join(" ").replace(/\s{2,}/g, " ").trim();
        const batchFullScript = deduplicateScript(rawBatchFullScript);

        results.push({
          position: seqItem.position,
          hookId: hook.id,
          hookName: hook.name,
          format: seqItem.format,
          includedCouponLanguage: seqItem.includeCoupon,
          script: {
            hookId: hook.id,
            hookName: hook.name,
            textHook: parsed.textHook,
            verbalHook: parsed.verbalHook,
            dealReveal: parsed.dealReveal,
            howTo: parsed.howTo,
            urgencyClose: parsed.urgencyClose,
            fullScript: batchFullScript,
            format: seqItem.format,
            includedCouponLanguage: seqItem.includeCoupon,
          },
        });
      }

      return results;
    }),

  abTest: publicProcedure
    .input(
      z.object({
        hookId: z.string(),
        hookName: z.string(),
        format: z.enum(["BOF", "BOF+"]),
        productName: z.string().min(1),
        keyBenefit: z.string().optional(),
        dealTypes: z.array(z.string()),
        dealDeadline: z.string(),
        creatorCode: z.string().optional(),
        quantityUnlock: z.string().optional(),
        includeCoupon: z.boolean(),
        scriptBody: z.string(), // deal reveal + how-to from the already-generated script
        creatorVoice: z.enum(['faith', 'dealscope']).optional(),
      })
    )
    .mutation(async ({ input }): Promise<BofABTestResult> => {
      const prompt = buildAbTestPrompt({
        hookId: input.hookId,
        hookName: input.hookName,
        format: input.format,
        productName: input.productName,
        keyBenefit: input.keyBenefit,
        dealTypes: input.dealTypes,
        dealDeadline: input.dealDeadline,
        creatorCode: input.creatorCode,
        quantityUnlock: input.quantityUnlock,
        includeCoupon: input.includeCoupon,
        scriptBody: input.scriptBody,
      });

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a TikTok Shop BOF script writer. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "bof_ab_test",
            strict: true,
            schema: {
              type: "object",
              properties: {
                variantA: {
                  type: "object",
                  properties: {
                    textHook: { type: "string" },
                    verbalHook: { type: "string" },
                    urgencyClose: { type: "string" },
                    rationale: { type: "string" },
                  },
                  required: ["textHook", "verbalHook", "urgencyClose", "rationale"],
                  additionalProperties: false,
                },
                variantB: {
                  type: "object",
                  properties: {
                    textHook: { type: "string" },
                    verbalHook: { type: "string" },
                    urgencyClose: { type: "string" },
                    rationale: { type: "string" },
                  },
                  required: ["textHook", "verbalHook", "urgencyClose", "rationale"],
                  additionalProperties: false,
                },
                variantC: {
                  type: "object",
                  properties: {
                    textHook: { type: "string" },
                    verbalHook: { type: "string" },
                    urgencyClose: { type: "string" },
                    rationale: { type: "string" },
                  },
                  required: ["textHook", "verbalHook", "urgencyClose", "rationale"],
                  additionalProperties: false,
                },
              },
              required: ["variantA", "variantB", "variantC"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0].message.content as string;
      const parsed = JSON.parse(content);

      // Assemble fullScript server-side to prevent LLM from adding duplicate cart-tap/coupon sentences.
      // The LLM only picks the hook and close; the shared body is injected mechanically.
      const makeVariant = (raw: typeof parsed.variantA, label: "A" | "B" | "C"): BofVariant => {
        const verbalHook = raw.verbalHook || "";
        const urgencyClose = raw.urgencyClose || "";
        // Build fullScript mechanically: hook + shared middle + close, then deduplicate
        const rawVariantScript = [verbalHook, input.scriptBody, urgencyClose]
          .filter(Boolean)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        const fullScript = deduplicateScript(rawVariantScript);
        return {
          label,
          textHook: raw.textHook || "",
          verbalHook,
          urgencyClose,
          fullScript,
          rationale: raw.rationale || "",
        };
      };

      return {
        hookId: input.hookId,
        hookName: input.hookName,
        scriptBody: input.scriptBody,
        variants: [
          makeVariant(parsed.variantA, "A"),
          makeVariant(parsed.variantB, "B"),
          makeVariant(parsed.variantC, "C"),
        ],
      };
    }),

  // ─── Generate Benefit Lines ──────────────────────────────────────────────────────────────────────────
  // Generates per-item benefit lines from product description and inserts them
  // at the correct position in the full script based on hookId.
  // Supported hooks: returning-this, fake-outrage, bundle-motherload, counting-hook

  generateBenefitLines: publicProcedure
    .input(
      z.object({
        hookId: z.enum(['returning-this', 'fake-outrage', 'bundle-motherload', 'counting-hook']),
        productName: z.string(),
        productDescription: z.string(),
        fullScript: z.string(),
        isBundle: z.boolean(),
        // Optional: user-provided item list if description is sparse
        itemList: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }: { input: { hookId: 'returning-this' | 'fake-outrage' | 'bundle-motherload' | 'counting-hook'; productName: string; productDescription: string; fullScript: string; isBundle: boolean; itemList?: string[] } }) => {
      const { hookId, productName, productDescription, fullScript, isBundle, itemList } = input;

      // Hook-specific format instructions
      const formatInstructions: Record<string, string> = {
        'returning-this': isBundle
          ? `Generate one "not because" benefit line per item in the bundle.
Format for each line: "not because [ITEM NAME] is loaded with [KEY INGREDIENT/FEATURE] to [SPECIFIC BENEFIT]"
Return 1 line per item. Keep each line under 15 words. Focus on the most credible ingredient or feature.
The lines will slot into the "not because" list in the Returning This hook script.`
          : `Generate 3 "not because" benefit lines for this single product.
Format: "not because it's loaded with [KEY INGREDIENT] to [SPECIFIC VISUAL BENEFIT]"
Each line = 1 ingredient + 1 specific benefit. Keep each line under 15 words.
Focus on the 3 most credible, specific ingredients or features in the product description.
The lines will slot into the "not because" list in the Returning This hook script.`,

        'fake-outrage': isBundle
          ? `Generate one benefit line per item in the bundle for the credibility section.
Format: "[ITEM NAME] — [1-line benefit using key ingredient or feature]"
Keep each line under 12 words. Use ingredient names where available.
The lines will slot into the "I did a deep dive" credibility section of the Fake Outrage script.`
          : `Generate 3 ingredient-benefit pairs for the credibility section of the Fake Outrage script.
Format: "[INGREDIENT] — [what it does in plain English]"
Keep each line under 12 words. Use the most credible, specific ingredients from the product description.
The lines will slot into the "I did a deep dive with AI" section.`,

        'bundle-motherload': `Generate one benefit block per item in the bundle.
Format: "You're getting [ITEM NAME]. [1-2 sentence benefit — key ingredient + what it does OR sensory/emotional benefit]."
Keep each block to 1-2 short sentences. Mix ingredient-based claims with sensory claims where appropriate.
The blocks will slot into the main body of the Bundle/Motherload script after the deal reveal.`,

        'counting-hook': isBundle
          ? `Generate a short benefit tag (3-5 words) for each item in the bundle.
Format: "[ITEM NAME] — [3-5 word benefit tag]"
Example: "Calcium Balm Stick — firms and plumps instantly"
The tags will be added to the rapid-fire item list in the Counting Hook script.`
          : `Generate 3 short benefit tags (3-5 words each) for this product's key features.
Format: "[FEATURE] — [3-5 word benefit tag]"
Focus on the 3 most compelling features from the product description.`,
      };

      // Build item context
      const itemContext = itemList && itemList.length > 0
        ? `ITEMS IN BUNDLE:\n${itemList.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n')}`
        : `PRODUCT DESCRIPTION (extract items/features from this):\n${productDescription}`;

      const prompt = `You are a TikTok Shop BOF script writer generating benefit lines for a ${hookId} hook script.

PRODUCT: ${productName}
IS BUNDLE: ${isBundle ? 'Yes' : 'No'}
${itemContext}

FORMAT INSTRUCTIONS:
${formatInstructions[hookId]}

RULES:
- Be specific — use actual ingredient names, not generic claims like "moisturizing" or "anti-aging"
- Keep language punchy and conversational — this is TikTok, not a product label
- Do NOT use medical claims or FDA language
- Do NOT invent ingredients not mentioned in the product description
- If an ingredient is not mentioned, use the most specific feature or benefit that IS mentioned

Return JSON:
{
  "lines": ["line 1", "line 2", ...],
  "formattedBlock": "the lines formatted as a single ready-to-insert text block",
  "insertNote": "one sentence describing where in the script these lines should be inserted"
}`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'You are a TikTok Shop BOF script writer. Return only valid JSON.' },
          { role: 'user', content: prompt },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'benefit_lines_result',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                lines: { type: 'array', items: { type: 'string' } },
                formattedBlock: { type: 'string' },
                insertNote: { type: 'string' },
              },
              required: ['lines', 'formattedBlock', 'insertNote'],
              additionalProperties: false,
            },
          },
        },
      });

      const rawContent = response.choices[0]?.message?.content;
      const content = typeof rawContent === 'string' ? rawContent : '{}';
      const parsed = JSON.parse(content) as {
        lines: string[];
        formattedBlock: string;
        insertNote: string;
      };

      // Determine insert position marker based on hookId
      const insertPositionMap: Record<string, string> = {
        'returning-this': 'NOT_BECAUSE_LIST',
        'fake-outrage': 'CREDIBILITY_SECTION',
        'bundle-motherload': 'ITEM_LIST_SECTION',
        'counting-hook': 'ITEM_LIST_SECTION',
      };

      // Build updated script by injecting benefit lines at the correct position
      const updatedScript = injectBenefitLines(fullScript, hookId, parsed.formattedBlock);

      return {
        lines: parsed.lines,
        formattedBlock: parsed.formattedBlock,
        insertNote: parsed.insertNote,
        insertPosition: insertPositionMap[hookId],
        updatedScript,
      };
    }),
});

// ─── Post-Generation Deduplication Scanner ──────────────────────────────────────────────────────────────────
// Scans the assembled fullScript for near-duplicate sentences and removes the second occurrence.
// "Near-duplicate" = two sentences share >60% of their meaningful words (stop words excluded).
// This is a deterministic string-processing pass — no LLM call required.

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'it', 'its', 'this', 'that', 'you',
  'your', 'i', 'my', 'me', 'we', 'our', 'they', 'their', 'be', 'are',
  'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'can', 'could', 'should', 'may', 'might', 'just', 'so', 'if', 'as',
  'not', 'no', 'up', 'out', 'about', 'into', 'than', 'then', 'when',
  'there', 'here', 'now', 'all', 'also', 'only', 'even', 'get', 'got',
  'going', 'go', 'come', 'know', 'see', 'make', 'take', 'use', 'want',
]);

function getMeaningfulWords(sentence: string): Set<string> {
  return new Set(
    sentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOP_WORDS.has(w))
  );
}

function jaccardOverlap(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  a.forEach(word => {
    if (b.has(word)) intersection++;
  });
  const union = new Set(Array.from(a).concat(Array.from(b))).size;
  return intersection / union;
}

export function deduplicateScript(script: string): string {
  // Split on sentence-ending punctuation followed by whitespace, preserving delimiters
  const rawSentences = script.split(/(?<=[.!?])\s+/);
  const kept: string[] = [];
  const keptWords: Set<string>[] = [];

  for (const sentence of rawSentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    const words = getMeaningfulWords(trimmed);

    // Skip very short sentences (fewer than 3 meaningful words) — they are connective tissue, not duplicates
    if (words.size < 3) {
      kept.push(trimmed);
      keptWords.push(words);
      continue;
    }

    // Check against all previously kept sentences
    let isDuplicate = false;
    for (const prevWords of keptWords) {
      if (jaccardOverlap(words, prevWords) > 0.6) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      kept.push(trimmed);
      keptWords.push(words);
    }
  }

  return kept.join(' ');
}

// ─── Benefit Line Injection Helper ──────────────────────────────────────────────────────────────────────────
// Finds the correct insertion point in the full script and splices in the benefit lines.

export function injectBenefitLines(fullScript: string, hookId: string, benefitBlock: string): string {
  switch (hookId) {
    case 'returning-this': {
      // Insert before the deal reveal — find "I'm just disappointed" or "I'm just upset" or "The deal is"
      // The "not because" list goes BEFORE the deal pivot sentence
      const dealPivotPatterns = [
        /I'm just disappointed/i,
        /I'm just upset/i,
        /the deal is/i,
        /it's currently the cheapest/i,
        /they're having a/i,
        /they put it on sale/i,
      ];
      for (const pattern of dealPivotPatterns) {
        const match = fullScript.match(pattern);
        if (match && match.index !== undefined) {
          return fullScript.slice(0, match.index).trimEnd() + '\n' + benefitBlock + '\n' + fullScript.slice(match.index);
        }
      }
      // Fallback: append before last sentence
      return fullScript + '\n\n' + benefitBlock;
    }

    case 'fake-outrage': {
      // Insert in the credibility section — find "I did a deep dive" or "every one of these ingredients"
      const credibilityPatterns = [
        /I did a deep dive/i,
        /every one of these ingredients/i,
        /multiple things that work well/i,
      ];
      for (const pattern of credibilityPatterns) {
        const match = fullScript.match(pattern);
        if (match && match.index !== undefined) {
          // Find the end of this sentence and insert after it
          const afterPattern = fullScript.slice(match.index);
          const sentenceEnd = afterPattern.search(/[.!?]\s/);
          if (sentenceEnd !== -1) {
            const insertAt = match.index + sentenceEnd + 1;
            return fullScript.slice(0, insertAt).trimEnd() + '\n' + benefitBlock + '\n' + fullScript.slice(insertAt).trimStart();
          }
        }
      }
      return fullScript + '\n\n' + benefitBlock;
    }

    case 'bundle-motherload': {
      // Insert after "So let's see what you get" or "let me show you what you get"
      const listStartPatterns = [
        /so let's see what you get/i,
        /let me show you what you get/i,
        /here's what you get/i,
        /look at everything you get/i,
      ];
      for (const pattern of listStartPatterns) {
        const match = fullScript.match(pattern);
        if (match && match.index !== undefined) {
          const afterPattern = fullScript.slice(match.index);
          const sentenceEnd = afterPattern.search(/[.!?]\s/);
          if (sentenceEnd !== -1) {
            const insertAt = match.index + sentenceEnd + 1;
            return fullScript.slice(0, insertAt).trimEnd() + '\n\n' + benefitBlock + '\n\n' + fullScript.slice(insertAt).trimStart();
          }
        }
      }
      return fullScript + '\n\n' + benefitBlock;
    }

    case 'counting-hook': {
      // Replace the rapid item list section — find the section between value anchor and CTA
      // Look for "Check your price" or "an entire" as the end of the list
      const listEndPatterns = [
        /an entire [a-z ]+\./i,
        /check your price/i,
      ];
      const listStartPatterns = [
        /worth of products\./i,
        /worth of products!/i,
      ];
      let listStart = -1;
      for (const pattern of listStartPatterns) {
        const match = fullScript.match(pattern);
        if (match && match.index !== undefined) {
          listStart = match.index + match[0].length;
          break;
        }
      }
      let listEnd = -1;
      for (const pattern of listEndPatterns) {
        const match = fullScript.match(pattern);
        if (match && match.index !== undefined) {
          listEnd = match.index + match[0].length;
          break;
        }
      }
      if (listStart !== -1 && listEnd !== -1 && listEnd > listStart) {
        return fullScript.slice(0, listStart).trimEnd() + '\n\n' + benefitBlock + '\n\n' + fullScript.slice(listEnd).trimStart();
      }
      return fullScript + '\n\n' + benefitBlock;
    }

    default:
      return fullScript + '\n\n' + benefitBlock;
  }
}
