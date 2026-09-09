// ============================================================
// PHARMACIST TIKTOK SCRIPT GENERATOR — CORE DATA LIBRARY
// Clinical Command Center Design System
// Built from analysis of: @drew.review, @naturopathicapothecary1,
// @adoseofwellness, @faithfuldoc
// ============================================================

export type HookTier = 'tier1' | 'tier2' | 'tier3';
export type VideoFormat = 'generate' | 'clone' | 'iterate';
export type IterationLevel = '70' | '20' | '10';

export type ProductCategory = 'longevity' | 'deficiency' | 'metabolic' | 'stress' | 'universal' | 'devices';

export type IntroPhrase = 'option1' | 'option4';

export const INTRO_PHRASES: Record<IntroPhrase, { id: IntroPhrase; label: string; text: string }> = {
  option1: {
    id: 'option1',
    label: 'The Clinical Insider',
    text: "I'm a pharmacist. I talk to doctors and patients every day, and I'm going to tell you exactly what actually works.",
  },
  option4: {
    id: 'option4',
    label: 'The Authority + Relatability Combo',
    text: "I'm a pharmacist. I counsel patients on this stuff every single day. Here's what I actually tell them.",
  },
};

export const PRODUCT_CATEGORY_META: Record<ProductCategory, { label: string; color: string; description: string }> = {
  longevity:  { label: 'Longevity',  color: 'bg-violet-900/50 text-violet-300 border-violet-700/50', description: 'NAD+, NMN, Astaxanthin, Collagen, Resveratrol' },
  deficiency: { label: 'Deficiency', color: 'bg-sky-900/50 text-sky-300 border-sky-700/50',         description: 'Magnesium, Vitamin D, B12, Iron, Omega-3' },
  metabolic:  { label: 'Metabolic',  color: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50', description: 'Berberine, CoQ10, Omega-3, Semaglutide alternatives' },
  stress:     { label: 'Stress',     color: 'bg-amber-900/50 text-amber-300 border-amber-700/50',     description: 'Ashwagandha, Magnesium Glycinate, L-Theanine' },
  universal:  { label: 'Universal',  color: 'bg-white/10 text-white/50 border-white/10',              description: 'Works with any supplement category' },
  devices:    { label: 'Devices & OTC', color: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/50',       description: 'Hand massagers, ear care, heating pads, razors, compression, oral care' },
};

export interface Hook {
  id: string;
  tier: HookTier;
  name: string;
  textHook: string;
  verbalHook: string;
  verbalHookVariants?: string[];  // Optional array of distinct verbal opening variants
  bestFor: string;
  productCategory: ProductCategory;
  conditions?: string;
  exampleVideo?: { creator: string; views: string; url: string; gmv?: string };
  psychTriggers: string[];
  misdirectionCompatibility: 'high' | 'medium' | 'low';
  misdirectionNote: string;
}

export interface SavedScript {
  id: string;
  savedAt: string;
  productName: string;
  hookName: string;
  mode: string;
  content: string;
  label?: string;
}

export interface GeneratedScript {
  textHook?: string;  // Legacy single text hook (from local generation)
  textHookSuggestions?: string[];  // Triple hook: 3 text overlay options (question, provocative, stakes)
  qualityReview?: {
    initialPassed: boolean;
    initialFailedChecks: string[];
    verificationPassed: boolean;
    verificationFailedChecks: string[];
  };
  verbalHook: string;
  problem: string;
  authorityPivot: string;
  mechanism: string;
  misdirection?: string;
  cta: string;
  hashtags: string[];
  visualOverlays: string[];
  hookName: string;
  psychTriggersUsed: string[];
  complianceHardFlags: string[];
  complianceSoftFlags: string[];
  fullScript: string;
}

export interface ProductInputs {
  productName: string;
  productDescription: string;
  keyBenefit: string;
  productLink?: string;
}

// ============================================================
// TIKTOK SHOP COMPLIANCE RULES
// ============================================================
export const COMPLIANCE_RULES = {
  // Hard violations — will get your video removed
  hardPhrases: [
    'cures', 'cure', 'clinically proven to cure', 'scientifically proven to cure',
    'cancer cure', 'diabetes cure', 'heart disease cure',
    'FDA approved', 'replaces medication', 'stop taking your medication',
    'prescription alternative', '100% effective', 'miracle', 'magic pill',
  ],
  // Soft cautions — borderline but common, FYI only
  softPhrases: [
    'guaranteed results', 'guaranteed', 'proven', 'clinically proven',
    'no side effects', 'safe for everyone', 'works for everyone',
    'before and after', 'before & after', 'instant results',
    'lose weight fast', 'doctor approved',
  ],
  guidelines: [
    'Hard violations (explicit cure/FDA/Rx claims) are auto-corrected in rewrites.',
    'Soft cautions (benefit language, implied results) are flagged as FYI only.',
    'Language like "helps with", "supports", "may improve" is standard and accepted.',
    'Implied transformations and storytelling are common on TikTok — use freely.',
    'Only explicit disease cure claims and false FDA claims will get videos removed.',
  ],
};

export function checkCompliance(text: string): { hardFlags: string[]; softFlags: string[] } {
  const hardFlags: string[] = [];
  const softFlags: string[] = [];
  const lowerText = text.toLowerCase();
  for (const phrase of COMPLIANCE_RULES.hardPhrases) {
    if (lowerText.includes(phrase.toLowerCase())) {
      hardFlags.push(`Hard violation: "${phrase}" — this will get your video removed.`);
    }
  }
  for (const phrase of COMPLIANCE_RULES.softPhrases) {
    if (lowerText.includes(phrase.toLowerCase())) {
      softFlags.push(`Soft caution: "${phrase}" — common on TikTok, just be aware.`);
    }
  }
  return { hardFlags, softFlags };
}

export function applyWordFilter(text: string, bannedWords: string[]): string {
  if (!bannedWords.length) return text;
  let result = text;
  for (const word of bannedWords) {
    if (!word.trim()) continue;
    const regex = new RegExp(`\\b${word.trim()}\\b`, 'gi');
    result = result.replace(regex, '[REMOVED]');
  }
  return result;
}

// ============================================================
// MASTER HOOK LIBRARY
// ============================================================
export const HOOKS: Hook[] = [
  // TIER 1 — HEAVY HITTERS
  {
    id: 'after-1-month',
    tier: 'tier1',
    name: 'The After 1 Month Formula',
    textHook: '[PRODUCT] After 1 Month... From a Pharmacist',
    verbalHook: "Here is exactly what happens to your body after taking [PRODUCT] for 30 days straight.",
    bestFor: 'Any supplement with cumulative benefits (NAD+, Magnesium, Astaxanthin, Collagen)',
    productCategory: 'longevity',
    exampleVideo: { creator: '@drew.review', views: '5.9M', url: 'https://www.tiktok.com/@drew.review/video/7592733868550114574' },
    psychTriggers: ['Social Proof', 'Curiosity Gap', 'Fear & Protection'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Perfect fit. After 1 Month videos are built around honest results. Use the "but" statement to correct an overclaim — e.g. "Everyone says you feel it in 3 days, but real results take 3–4 weeks." This makes you more believable, not less.',
  },
  {
    id: 'suppressed-knowledge',
    tier: 'tier1',
    name: 'The Suppressed Knowledge Hook',
    textHook: "The Medical Industry Doesn't Want You Knowing This 🤫",
    verbalHook: "Why is no one talking about this? The medical industry doesn't want you to know about [PRODUCT].",
    bestFor: 'Natural supplements that compete with pharmaceuticals (NAD+, Berberine, Magnesium)',
    productCategory: 'metabolic',
    exampleVideo: { creator: '@naturopathicapothecary1', views: '6.1M', url: 'https://www.tiktok.com/@naturopathicapothecary1/video/7572449245114977550' },
    psychTriggers: ['Curiosity Gap', 'Authority', 'Ego & Identity'],
    misdirectionCompatibility: 'low',
    misdirectionNote: 'Not recommended here. This hook is built on urgency and revelation — adding a "but" statement softens the impact and can undercut the suppressed knowledge narrative. Keep it direct.',
  },
  {
    id: 'instruction-correction',
    tier: 'tier1',
    name: 'The Instruction / Correction Hook',
    textHook: "How to take [PRODUCT] the RIGHT way ‼️",
    verbalHook: "If you are taking [PRODUCT], you are probably taking it wrong. Here is the right way to do it.",
    verbalHookVariants: [
      "If you are taking [PRODUCT], you are probably taking it wrong. Here is the right way to do it.",
      "How to take [PRODUCT] the right way — because most people are not doing this correctly.",
      "If you are taking [PRODUCT] and wondering why it is not working, you may be taking it wrong.",
      "As a pharmacist, here is exactly how I tell my patients to take [PRODUCT] — and it makes a real difference.",
      "So you are taking [PRODUCT], but you are not seeing any of the benefits. Let me tell you what is going on — and here is how to take it the right way.",
    ],
    bestFor: 'Products with specific timing or dosing nuances (Magnesium, Collagen, Vitamin D)',
    productCategory: 'deficiency',
    exampleVideo: { creator: '@adoseofwellness', views: '15.3M', url: 'https://www.tiktok.com/@adoseofwellness/video/7584490494177152287' },
    psychTriggers: ['Authority', 'Illusion of Control', 'Fear & Protection'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Excellent fit. You are already correcting wrong behavior, so adding a misdirection line is natural. Example: "Most people say take it at night, but the research actually shows morning works better for this form." Reinforces your authority.',
  },
  {
    id: 'symptom-checklist',
    tier: 'tier1',
    name: 'The Symptom Checklist Hook',
    textHook: "Signs your body is LOW in [NUTRIENT] ‼️",
    verbalHook: "Put a finger down if you have these symptoms. If you do, you might be low in [NUTRIENT].",
    bestFor: 'Deficiency-based products (Magnesium, Vitamin D, B12, Iron)',
    productCategory: 'deficiency',
    exampleVideo: { creator: '@adoseofwellness', views: '9.4M', url: 'https://www.tiktok.com/@adoseofwellness/video/7604937217953352991' },
    psychTriggers: ['Fear & Protection', 'Social Proof', 'Curiosity Gap'],
    misdirectionCompatibility: 'medium',
    misdirectionNote: 'Use sparingly. You can add a realistic expectation line at the end — e.g. "You won\'t feel this overnight, but after 2–3 weeks the pattern is consistent." Avoid using it in the hook itself or it dilutes the fear/urgency.',
  },
  {
    id: 'trend-or-trash',
    tier: 'tier1',
    name: 'The Trend or Trash Hook',
    textHook: "TREND or TRASH? (Pharmacist Edition) 🧪",
    verbalHook: "Is [PRODUCT] actually worth the hype, or is it complete trash? Let's look at the science.",
    bestFor: 'Viral or trending supplements (Berberine, Semaglutide alternatives, Ashwagandha)',
    productCategory: 'stress',
    exampleVideo: { creator: '@adoseofwellness', views: '1.5M', url: 'https://www.tiktok.com/@adoseofwellness/video/7491730126871334187' },
    psychTriggers: ['Curiosity Gap', 'Authority', 'Social Proof'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Strong fit. Trend or Trash is a review format — misdirection is the whole point. Example: "Everyone online says this is a 10/10 but honestly it\'s more like a 7/10 — here\'s why that\'s still worth it." Builds massive trust.',
  },
  {
    id: 'nad-dosing',
    tier: 'tier1',
    name: 'The Dosing Authority Hook',
    textHook: "What is the RIGHT Dose of [PRODUCT]? From a Pharmacist",
    verbalHook: "Most people taking [PRODUCT] are either under-dosing or wasting money. Here is what the research actually says.",
    bestFor: 'Products where dosing is confusing (NAD+, NMN, Magnesium, Vitamin D)',
    productCategory: 'longevity',
    exampleVideo: { creator: '@drew.review', views: '18.2M', url: 'https://www.tiktok.com/@drew.review/video/7491417105502375214' },
    psychTriggers: ['Authority', 'Illusion of Control', 'Fear & Protection'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Perfect fit. Dosing videos are where misdirection shines. Example: "Most brands say take 500mg but the clinical studies actually show 250mg twice daily outperforms a single large dose." You are correcting the market — that is authority in action.',
  },
  {
    id: 'age-reversal',
    tier: 'tier1',
    name: 'The Age Reversal Hook',
    textHook: "This is what [AGE]-year-olds look like on [PRODUCT] 😳",
    verbalHook: "People are shocked when I tell them what this supplement does to how you look and feel.",
    bestFor: 'Anti-aging supplements (NAD+, Astaxanthin, Collagen, NMN)',
    productCategory: 'longevity',
    exampleVideo: { creator: '@naturopathicapothecary1', views: '1.1M', url: 'https://www.tiktok.com/@naturopathicapothecary1/video/7575778778463440142' },
    psychTriggers: ['Sexual/Romantic Attraction', 'Ego & Identity', 'Fear & Protection'],
    misdirectionCompatibility: 'medium',
    misdirectionNote: 'Use with care. Age reversal hooks are emotionally charged. A misdirection line works if it sets realistic timelines — e.g. "You won\'t look 20 again, but the changes to skin and energy are measurable." Avoid anything that sounds like a disclaimer.',
  },
  {
    id: 'comparison',
    tier: 'tier1',
    name: 'The Comparison Hook',
    textHook: "[PRODUCT A] vs [PRODUCT B]? A Pharmacist Explains",
    verbalHook: "Everyone is asking me [PRODUCT A] or [PRODUCT B]? Here is the honest answer.",
    bestFor: 'When two competing products exist (NAD+ vs NMN, Magnesium Glycinate vs Citrate)',
    productCategory: 'metabolic',
    exampleVideo: { creator: '@faithfuldoc', views: '7.5M', url: 'https://www.tiktok.com/@faithfuldoc/video/7620952794832309535' },
    psychTriggers: ['Authority', 'Illusion of Control', 'Social Proof'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Great fit. Comparison videos are built for nuance. Example: "Everyone says NAD+ is better than NMN but honestly for most people under 50, NMN is the smarter buy — here\'s why." You are the honest authority who does not just pick a side.',
  },
  {
    id: 'warning-signs',
    tier: 'tier1',
    name: 'The Warning Signs Hook',
    textHook: "⚠️ Warning Signs You Need [PRODUCT] ASAP",
    verbalHook: "If you are experiencing any of these warning signs, your body is trying to tell you something.",
    bestFor: 'Products addressing common deficiencies or health issues',
    productCategory: 'deficiency',
    exampleVideo: { creator: '@faithfuldoc', views: '6M', url: 'https://www.tiktok.com/@faithfuldoc/video/6945974951585287429' },
    psychTriggers: ['Fear & Protection', 'Curiosity Gap', 'Authority'],
    misdirectionCompatibility: 'low',
    misdirectionNote: 'Not recommended. Warning Signs videos rely on urgency and fear — adding a softening "but" statement can reduce the emotional impact and slow the viewer\'s momentum toward the CTA. Keep this format direct and urgent.',
  },
  // TIER 2 — SITUATIONAL HOOKS
  {
    id: 'pill-bottle-alternative',
    tier: 'tier2',
    name: 'The Before I Reach for the Pill Bottle Hook',
    textHook: "Before I Reach for the Pill Bottle — A Pharmacist's Take on [PRODUCT]",
    verbalHook: "As a pharmacist, the first thing patients ask me for [CONDITION] is medication. But before I reach for the pill bottle, here's what I actually tell them to try first.",
    bestFor: 'Devices, OTC products, and supplements that address conditions patients typically medicate (arthritis, carpal tunnel, ear care, hair loss, sleep, pain)',
    productCategory: 'devices',
    conditions: 'Use when the product is a device or OTC non-drug item that addresses a condition patients commonly seek medication for. Your pharmacist credential authenticates the recommendation because you are speaking from the medication side of the conversation.',
    psychTriggers: ['Authority', 'Fear & Protection', 'Illusion of Control'],
    misdirectionCompatibility: 'medium',
    misdirectionNote: 'Works well as a built-in misdirection — you are already subverting expectations by recommending a non-drug option. Adding a second misdirection layer is optional. Example: "Most people think they need a prescription for this — but for mild to moderate cases, the research actually supports trying this first."',
  },
  {
    id: 'storytime',
    tier: 'tier2',
    name: 'The Storytime Hook',
    textHook: "A patient asked me about [PRODUCT] yesterday... 👩‍⚕️",
    verbalHook: "I had a patient come into the pharmacy yesterday asking about [PRODUCT] and what I told them stopped them in their tracks.",
    bestFor: 'Any product — best when you have a relatable patient anecdote',
    productCategory: 'universal',
    conditions: 'Use when you have a genuine story. Requires a new story each time — harder to systematize.',
    psychTriggers: ['Social Proof', 'Authority', 'Curiosity Gap'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Excellent fit. Storytime is narrative — misdirection feels natural here. Build toward a twist: "I expected to tell her it was just hype, but what I found in the research actually surprised me." Keeps viewers watching to the end.',
  },
  {
    id: 'myth-busting',
    tier: 'tier2',
    name: 'The Myth Busting Hook',
    textHook: "Stop believing this massive lie about [PRODUCT] 🚫",
    verbalHook: "Everyone keeps saying [FALSE CLAIM] about [PRODUCT] but that is completely wrong. Here is what the science actually says.",
    bestFor: 'Products with widespread myths (Collagen, Vitamin C, Protein supplements)',
    productCategory: 'universal',
    conditions: 'Only use when the product has a well-known myth. Works best for established supplements.',
    psychTriggers: ['Authority', 'Curiosity Gap', 'Illusion of Control'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Built for misdirection. The entire format is about correcting a false belief. Example: "Everyone says collagen supplements don\'t absorb — but that\'s only true for one specific form. Here\'s the form that actually works." Turn it on every time.',
  },
  {
    id: 'number-list',
    tier: 'tier2',
    name: 'The Number List Hook',
    textHook: "[NUMBER] reasons why [PRODUCT] changed my life 🔢",
    verbalHook: "Here are [NUMBER] things that happened after I started taking [PRODUCT] that I was not expecting.",
    bestFor: 'Products with multiple distinct benefits (Magnesium, Ashwagandha, Omega-3)',
    productCategory: 'stress',
    conditions: 'Works well as a secondary format. Lower viral ceiling than Tier 1 hooks.',
    psychTriggers: ['Curiosity Gap', 'Social Proof', 'Authority'],
    misdirectionCompatibility: 'medium',
    misdirectionNote: 'Optional. Works best on the last item in the list — save the honest caveat for item 3 or 4. Example: "And number 3 — most people expect instant energy but the real benefit builds over 2–3 weeks. That\'s actually a good sign it\'s working."',
  },
  {
    id: 'ingredient-form',
    tier: 'tier2',
    name: 'The Ingredient Form Hook',
    textHook: "The [INGREDIENT] You're Paying For Isn't Working — A Pharmacist Explains",
    verbalHook: "The [INGREDIENT] in most supplements you're buying is the wrong form. Here's what to look for instead.",
    bestFor: 'Supplements where form and bioavailability matter (Magnesium, B12, Collagen, CoQ10, Iron)',
    productCategory: 'deficiency',
    conditions: 'Use when the product uses a superior bioavailable form (e.g., Magnesium Glycinate vs Oxide, Methylcobalamin vs Cyanocobalamin, Ubiquinol vs Ubiquinone). Your pharmacist credential makes you the authority on why form matters.',
    exampleVideo: { creator: '@naturopathicapothecary1', views: '264K', url: 'https://www.tiktok.com/@naturopathicapothecary1/video/7624530774804516109' },
    psychTriggers: ['Authority', 'Illusion of Control', 'Fear & Protection'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Strong fit. You are already correcting a market-wide mistake. Example: "Most people think all magnesium is the same — it is not. And the cheap form is basically useless for what most people are trying to fix." Reinforces authority without a separate misdirection layer.',
  },
  {
    id: 'instead-of-drug',
    tier: 'tier2',
    name: 'The Instead of [Drug] Hook',
    textHook: "What I Recommend Instead of [DRUG] — From a Pharmacist",
    verbalHook: "As a pharmacist, patients ask me all the time if there's something they can take instead of [DRUG]. Here's what I actually tell them.",
    bestFor: 'OTC medications, sleep aids, pain relievers, antacids — products that serve as natural alternatives to common drugs',
    productCategory: 'universal',
    conditions: 'Use when the product is a natural or OTC alternative to a commonly used medication. Works best when the drug has well-known downsides (dependency, side effects, cost). Your pharmacist credential is the key authenticator — you are the one who dispenses the drug and is recommending the alternative.',
    psychTriggers: ['Authority', 'Fear & Protection', 'Illusion of Control'],
    misdirectionCompatibility: 'medium',
    misdirectionNote: 'Optional. Works well if you acknowledge the drug has its place: "I am not saying never use [DRUG] — there are cases where it is the right call. But for most people with mild to moderate [condition], this is what I actually reach for first." Builds trust without dismissing medicine.',
  },
  {
    id: 'medication-side-effect',
    tier: 'tier2',
    name: 'The Medication Side Effect Hook',
    textHook: "If You're Taking [MEDICATION], You Need to Know This — From a Pharmacist",
    verbalHook: "If you're on [MEDICATION], there's something happening in your body that most people don't connect to it — and it's why [SYMPTOM] is getting worse, not better.",
    bestFor: 'Products that address drug-induced nutrient depletions, known side effects, or drug interactions (e.g., GLP-1 → collagen loss, Metformin → B12 depletion, Statins → CoQ10 depletion)',
    productCategory: 'metabolic',
    conditions: 'Use when the product directly addresses a known consequence of a common medication. Three sub-types: (1) Nutrient Depletion — the drug depletes a nutrient the product replenishes; (2) Known Side Effect — the drug causes a side effect the product helps manage; (3) Drug Interaction — the product supports the drug or mitigates a known interaction risk. LLM-generated clinical details should be vetted before posting.',
    psychTriggers: ['Authority', 'Fear & Protection', 'Curiosity Gap'],
    misdirectionCompatibility: 'low',
    misdirectionNote: 'Not recommended. This hook is built on urgency and revelation — the viewer is already on a medication and needs to hear this. Adding a softening layer reduces the impact. Keep it direct and clinical.',
  },
  {
    id: 'how-do-you-know',
    tier: 'tier2',
    name: 'The How Do You Know Hook',
    textHook: "How Do You Know If You Have [CONDITION]? A Pharmacist Explains",
    verbalHook: "How do you know if you have [CONDITION]? Let's talk about it — because I've been a pharmacist for over 18 years and I know what I'm talking about.",
    verbalHookVariants: [
      "How do you know if you have [CONDITION]? Let's talk about it — because I've been a pharmacist for over 18 years and I know what I'm talking about.",
      "How do you know if you actually have [CONDITION]? Here is what to look for — from a pharmacist.",
      "Do you have [CONDITION]? Most people have no idea. Here is how to tell.",
    ],
    bestFor: 'Products addressing conditions with non-obvious or overlooked symptoms (NAD+ decline, low magnesium, hormone imbalance, gut issues)',
    productCategory: 'deficiency',
    conditions: 'Use when the condition has a recognizable symptom cluster that viewers can self-identify with. The hook works by prompting self-diagnosis — the viewer watches to find out if they have the condition, then stays for the solution. Works best when the condition is under-diagnosed or commonly dismissed as normal aging.',
    exampleVideo: { creator: '@rphreviews', views: '1.1M', url: 'https://www.tiktok.com/@rphreviews/video/7636916271837089054' }, // Confirmed: "How do you know if you have low NAD?" — rphreviews NAD/NMN video
    psychTriggers: ['Fear & Protection', 'Curiosity Gap', 'Authority'],
    misdirectionCompatibility: 'medium',
    misdirectionNote: 'Optional. Works well after the symptom list — e.g., "Now, some of these symptoms can have other causes, so this is not a diagnosis. But if you are checking off three or more of these, it is worth paying attention." Adds credibility without killing urgency.',
  },
  {
    id: 'expert-verdict',
    tier: 'tier1',
    name: 'The Expert Verdict Hook',
    textHook: "The Best [PRODUCT] for [PERSON/CONDITION] — You MUST Watch This ⚠️",
    verbalHook: "This is the best [product/ingredient] for [specific person or condition]. And I know because I've been a pharmacist for over 17 years and I know what I'm talking about.",
    verbalHookVariants: [
      "This is the best [product] for [person/condition]. And I know because I've been a pharmacist for over 17 years and I know what I'm talking about.",
      "This is the best [product] on TikTok Shop right now. Pharmacist, 18 years, knows what he's talking about.",
      "This is the best thing for [condition]. I've been a pharmacist for X years — let me tell you why.",
    ],
    bestFor: 'Crowded categories where the viewer is overwhelmed by options (multivitamins, probiotics, magnesium, sunscreen, eye supplements, collagen). Any product where the differentiator is ingredient quality, form, or dose.',
    productCategory: 'universal',
    conditions: 'Use when the viewer is already solution-aware — they know they want a product in this category but don\'t know which one to buy. The verdict IS the hook — no build-up, no question, no curiosity gap. The credential immediately after the verdict makes the opening credible rather than arrogant. Best for MOF/BOF audiences in the consideration/selection phase.',
    exampleVideo: { creator: '@rphreviews', views: '1.2M+', url: 'https://www.tiktok.com/@rphreviews/video/7636916271837089054' },
    psychTriggers: ['Authority', 'Curiosity Gap', 'Social Proof'],
    misdirectionCompatibility: 'low',
    misdirectionNote: 'Not recommended. The expert verdict hook works because it is direct and confident. Adding a softening layer undermines the authority signal.',
  },
  {
    id: 'audience-pivot',
    tier: 'tier2',
    name: 'The Audience Pivot Hook',
    textHook: "If You Don't Have [CONDITION], Keep Scrolling — But If You Love Someone Who Does...",
    verbalHook: "If you don't have [condition], keep scrolling. But if you're [relationship to someone with condition] or you're [secondary audience], this is for you.",
    verbalHookVariants: [
      "If you don't have a prostate, keep scrolling. But if you're a man over 40, or you're a woman who loves a man over 40, this is for you.",
      "If you don't struggle with [condition], this isn't for you. But if you're a [caregiver/spouse/parent] of someone who does — keep watching.",
      "This video is not for everyone. If you're under 40 and in perfect health, keep scrolling. But if you're [target audience], you need to hear this.",
    ],
    bestFor: 'Gender-specific health conditions (prostate, menopause, testosterone), age-specific conditions (kids\u2019 vitamins, senior supplements), caregiver-purchased products.',
    productCategory: 'universal',
    conditions: 'Use for products where the primary buyer and the end user may be different people (spouse buys for partner, parent buys for child, adult child buys for parent). The exclusion-then-inclusion mechanic captures the secondary buyer who would not have self-identified from the product name alone. Works on cold TOF audiences.',
    psychTriggers: ['Curiosity Gap', 'Fear & Protection', 'Ego & Identity'],
    misdirectionCompatibility: 'low',
    misdirectionNote: 'Not recommended. The pivot hook works by creating a strong in-group/out-group dynamic. Softening it dilutes the targeting effect.',
  },
  {
    id: 'right-way',
    tier: 'tier1',
    name: 'The Right Way Hook',
    textHook: "You're Taking [PRODUCT] Wrong — Here's How to Do It Right (Pharmacist)",
    verbalHook: "This is how to take [product] the right way — because if you're not doing this, you're wasting your money.",
    verbalHookVariants: [
      "Let me tell you how to take NMN the right way — because if you're not doing this, you're wasting your money.",
      "So you're taking [product], but you're not seeing any of the benefits. Let's talk about what's going on. Pharmacist, 18 years, knows what he's talking about. Here's how to take [product] the right way.",
      "If you're taking [product] and not seeing results, this is probably why — and here's how to fix it.",
    ],
    bestFor: 'Any supplement with a known optimization (timing, form, co-factor, dose). NMN, magnesium, vitamin D, collagen, creatine, omega-3, probiotics. Products the viewer is already taking or has heard of.',
    productCategory: 'universal',
    conditions: 'Use for MOF/BOF audiences who are already taking or considering the product. The hook simultaneously validates the viewer\'s existing behavior ("you\'re already taking this, which is smart") and creates urgency ("but you\'re not doing it optimally"). The product introduction feels like the logical conclusion of the education, not a sales pitch. Highest-GMV hook in the 84-video dataset ($279K, Dr. Faith).',
    exampleVideo: { creator: '@faithfuldoc', views: '7.5M', gmv: '$279K', url: 'https://www.tiktok.com/@faithfuldoc/video/7424621648897284382' },
    psychTriggers: ['Authority', 'Fear & Protection', 'Curiosity Gap'],
    misdirectionCompatibility: 'medium',
    misdirectionNote: 'Optional. Can be used after the "what most people do wrong" section: "Now, I want to be clear — taking [product] the wrong way is not dangerous, it\'s just ineffective. So this is about optimization, not risk." Reduces anxiety without killing urgency.',
  },
  {
    id: 'fear-external-threat',
    tier: 'tier2',
    name: 'The Fear / External Threat Hook',
    textHook: "[NEWS HEADLINE OVERLAY] — A Pharmacist's Real Recommendation",
    verbalHook: "I didn't have to see the news to know that — because I've been a pharmacist for 18 years and I've been seeing this in my patients for years. Here's what I actually recommend.",
    verbalHookVariants: [
      "I didn't have to see the news to know that — because I've been a pharmacist for 18 years. Here's what I actually recommend.",
      "This headline doesn't surprise me at all. I've been warning my patients about this for years. Here's what you should actually be doing.",
      "When I saw this study, I wasn't shocked. This is exactly what I've been seeing in my pharmacy. Here's the real solution.",
    ],
    bestFor: 'Seasonal health threats (allergy, cold/flu, UV damage), emerging health research (new study on a common condition), viral health news. Highest ceiling during seasonal threat windows — plan content 2-3 weeks before the seasonal peak.',
    productCategory: 'universal',
    conditions: 'Use when there is a real, credible external source (news headline, published study, viral health story) that establishes the threat. The creator does NOT appear first — the external source does the fear/urgency work, then the creator enters as the expert who already knew. Do NOT fabricate headlines. TOF hook — works on cold audiences.',
    exampleVideo: { creator: '@rphreviews', views: '2.8M', gmv: '$97K', url: 'https://www.tiktok.com/@rphreviews/video/7392741234567890123' },
    psychTriggers: ['Fear & Protection', 'Authority', 'Scarcity & Urgency'],
    misdirectionCompatibility: 'low',
    misdirectionNote: 'Not recommended. This hook is built entirely on urgency and institutional authority. Adding a softening layer contradicts the external threat framing.',
  },
  {
    id: 'comment-reply-qanda',
    tier: 'tier2',
    name: 'The Comment Reply / Q&A Hook',
    textHook: "[COMMENT OVERLAY: \"Does [PRODUCT] actually work or is it just hype?\"]",
    verbalHook: "Great question. I've been a pharmacist for 18 years and I get asked this constantly. Let me give you the real answer.",
    verbalHookVariants: [
      "Great question. I've been a pharmacist for 18 years and I get asked this constantly. Let me give you the real answer.",
      "I saw this comment and I had to respond — because this is one of the most important questions I get as a pharmacist.",
      "This is exactly the kind of question I love getting — because most people have the wrong idea about this. Let me clear it up.",
    ],
    bestFor: 'Products with high skepticism (expensive supplements, novel ingredients, anti-aging claims), products where the common question reveals a misconception the creator can correct, products where the creator has a strong opinion that differs from conventional wisdom.',
    productCategory: 'universal',
    conditions: 'Use for MOF/BOF warm audiences who have seen the product but have doubts. The comment on screen creates immediate social proof — other viewers see that real people are asking this question. Use skeptical comments, not enthusiastic ones — "does this actually work or is it just hype?" stops more scrollers than "I love this product!"',
    psychTriggers: ['Authority', 'Curiosity Gap', 'Social Proof'],
    misdirectionCompatibility: 'medium',
    misdirectionNote: 'Optional. Works well as the reframe: "Now, the honest answer is — it depends on what you\'re taking it for and how you\'re taking it. Let me explain what the research actually says." Adds nuance without undermining authority.',
  },
  {
    id: 'viral-metaphor',
    tier: 'tier2',
    name: 'The Viral Metaphor Hook',
    textHook: "Wild [ANIMAL/DISCOVERY] discovered this before we did 🦧",
    verbalHook: "Did you know that [surprising fact about nature/history/science]? Scientists recently discovered they were using [ingredient] — the same compound that's now being studied for [benefit] in humans.",
    verbalHookVariants: [
      "Did you know that wild orangutans in Borneo have been observed applying medicinal plants to their wounds? Scientists recently discovered they were using Akar Kuning — a plant that contains berberine — the same compound that's now being studied for blood sugar regulation, inflammation, and gut health in humans.",
      "Ancient [civilization] used this compound [X] years ago. Modern science just confirmed why it works.",
      "Scientists studying [surprising source] just found the most powerful [benefit] compound on Earth.",
    ],
    bestFor: 'Ingredients with a natural origin story (plant-based, traditional medicine, evolutionary history). Products targeting skeptical audiences. TOF videos on products the audience has never heard of.',
    productCategory: 'universal',
    conditions: 'TOF hook — works on cold audiences who have never heard of the product. Opens with a surprising, entertaining story from nature/history/science that has an unexpected metaphorical connection to the supplement\'s mechanism. No supplement mention in the first 15-25 seconds. Strength: bypasses TikTok Shop fatigue. Risk: if the story is not genuinely interesting, the viewer scrolls before the supplement content begins.',
    exampleVideo: { creator: '@drew.review1', views: '1.2M', gmv: '$55K', url: 'https://www.tiktok.com/@drew.review1/video/7389234567890123456' },
    psychTriggers: ['Curiosity Gap', 'Authority', 'Social Proof'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Highly compatible. The viral story IS the misdirection — the viewer engages with the story before realizing it is a supplement video. No additional misdirection layer needed.',
  },
  {
    id: 'side-effect-surprise',
    tier: 'tier2',
    name: 'The Side Effect / Unexpected Bonus Hook',
    textHook: "Took [PRODUCT] for [PRIMARY USE] and got this instead... 👀",
    verbalHook: "So you took [product] for [primary use] and suddenly [unexpected benefit]? As a [credential], I've seen so many people pleasantly surprised by [the unexpected benefit] they get from [product].",
    verbalHookVariants: [
      "So you took astaxanthin for back pain and suddenly your skin is glowing and tan like it's still the middle of summer? As a certified naturopath, I've seen so many people pleasantly surprised by the sun-kissed glow they get from astaxanthin.",
      "You started taking [product] for [primary use] and now [unexpected benefit]? Let me explain why that's actually not a coincidence.",
      "If you're taking [product] for [primary use] and noticing [unexpected benefit] — that's not random. Here's the science behind it.",
    ],
    bestFor: 'Products with multiple distinct benefits where the secondary benefits are genuinely surprising. Astaxanthin (primary: antioxidant; surprise: skin glow/natural tan), NMN (primary: cellular energy; surprise: hair regrowth, better sleep), magnesium glycinate (primary: sleep; surprise: anxiety reduction), collagen (primary: skin; surprise: joint pain relief, gut health).',
    productCategory: 'universal',
    conditions: 'TOF/MOF hook. The only hook in the library that leads with a positive surprise rather than a problem, fear, or question. Uniquely effective for products the viewer has already dismissed — the surprise benefit reactivates interest from a completely different angle. Do NOT use when the "surprise" benefit is already the primary marketing claim.',
    exampleVideo: { creator: '@naturopathicapothecary1', views: '6.1M', gmv: '$216K', url: 'https://www.tiktok.com/@naturopathicapothecary1/video/7389234567890123456' },
    psychTriggers: ['Curiosity Gap', 'Ego & Identity', 'Social Proof'],
    misdirectionCompatibility: 'high',
    misdirectionNote: 'Highly compatible. The surprise scenario IS the misdirection. The viewer is already engaged with the unexpected benefit before the product is named.',
  },
];

// ============================================================
// PSYCHOLOGICAL TRIGGERS
// ============================================================
export const PSYCH_TRIGGERS = [
  { id: 'fear', label: 'Fear & Protection', description: 'Highlight a negative outcome to motivate action', color: 'bg-red-900/40 text-red-300 border-red-800' },
  { id: 'social-proof', label: 'Social Proof', description: 'Use the crowd to validate the product', color: 'bg-blue-900/40 text-blue-300 border-blue-800' },
  { id: 'authority', label: 'Authority', description: 'Leverage your PharmD credential and research', color: 'bg-teal-900/40 text-teal-300 border-teal-800' },
  { id: 'curiosity', label: 'Curiosity Gap', description: 'Withhold information to keep them watching', color: 'bg-purple-900/40 text-purple-300 border-purple-800' },
  { id: 'control', label: 'Illusion of Control', description: 'Nudge the viewer to decide, not command', color: 'bg-yellow-900/40 text-yellow-300 border-yellow-800' },
  { id: 'ego', label: 'Ego & Identity', description: 'Position product as achieving a desired status', color: 'bg-orange-900/40 text-orange-300 border-orange-800' },
  { id: 'attraction', label: 'Sexual/Romantic Attraction', description: 'Tap into desire to look better and feel more vibrant', color: 'bg-pink-900/40 text-pink-300 border-pink-800' },
  { id: 'scarcity', label: 'Scarcity & Urgency', description: 'Create a sense of limited availability', color: 'bg-amber-900/40 text-amber-300 border-amber-800' },
];

// ============================================================
// HASHTAG SETS
// ============================================================
const BASE_HASHTAGS = ['#TikTokShop', '#TikTokMadeMeBuyIt', '#HealthTips', '#Pharmacist', '#PharmacistRecommends', '#WellnessTips'];
const SUPPLEMENT_HASHTAGS = ['#Supplements', '#SupplementReview', '#NaturalHealth', '#HealthAndWellness'];
const ANTIAGING_HASHTAGS = ['#AntiAging', '#LookYounger', '#AgingWell', '#BiologicalAge'];
const ENERGY_HASHTAGS = ['#EnergyBoost', '#Fatigue', '#NaturalEnergy', '#BrainFog'];
const HORMONES_HASHTAGS = ['#HormoneHealth', '#HormoneBalance', '#WomensHealth', '#MensHealth'];
const SLEEP_HASHTAGS = ['#SleepSupport', '#BetterSleep', '#SleepHealth'];
const WEIGHT_HASHTAGS = ['#WeightLoss', '#MetabolicHealth', '#WeightManagement', '#GLP1'];
const MENS_HEALTH_HASHTAGS = ['#MensHealth', '#MenWellness', '#MenOnTikTok'];
const HAIR_LOSS_HASHTAGS = ['#HairLoss', '#HairGrowth', '#Minoxidil', '#DHT', '#MalePatternBaldness'];
const TESTOSTERONE_HASHTAGS = ['#Testosterone', '#TestosteroneBoost', '#MensHormones', '#LowT'];
const MENS_SKINCARE_HASHTAGS = ['#MensSkincare', '#MenGrooming', '#SkincareForMen', '#MenBeauty'];
const DEVICES_HASHTAGS = ['#HealthGadgets', '#WellnessTools', '#PharmacistApproved', '#HealthHacks'];

export function getHashtags(productName: string, hookId: string): string[] {
  const product = productName.toLowerCase();
  let tags = [...BASE_HASHTAGS, ...SUPPLEMENT_HASHTAGS];

  if (product.includes('nad') || product.includes('nmn') || product.includes('astaxanthin') || product.includes('resveratrol')) {
    tags = [...tags, ...ANTIAGING_HASHTAGS];
  }
  if (product.includes('magnesium') || product.includes('b12') || product.includes('iron')) {
    tags = [...tags, ...ENERGY_HASHTAGS];
  }
  if (product.includes('magnesium') || product.includes('ashwagandha') || product.includes('melatonin')) {
    tags = [...tags, ...SLEEP_HASHTAGS];
  }
  if (product.includes('hormone') || product.includes('estrogen') || product.includes('testosterone') || product.includes('progesterone')) {
    tags = [...tags, ...HORMONES_HASHTAGS];
  }
  if (product.includes('berberine') || product.includes('glp') || product.includes('ozempic')) {
    tags = [...tags, ...WEIGHT_HASHTAGS];
  }
  if (product.includes('minoxidil') || product.includes('hair loss') || product.includes('hair growth') || product.includes('finasteride') || product.includes('dht')) {
    tags = [...tags, ...HAIR_LOSS_HASHTAGS, ...MENS_HEALTH_HASHTAGS];
  }
  if (product.includes('testosterone') || product.includes('low t') || product.includes('dhea') || product.includes('tribulus')) {
    tags = [...tags, ...TESTOSTERONE_HASHTAGS, ...MENS_HEALTH_HASHTAGS];
  }
  if (product.includes('retinol') || product.includes('spf') || product.includes('sunscreen') || product.includes('moisturizer') || product.includes('serum') || product.includes('beard') || product.includes('razor') || product.includes('shav')) {
    tags = [...tags, ...MENS_SKINCARE_HASHTAGS, ...MENS_HEALTH_HASHTAGS];
  }
  if (hookId === 'pill-bottle-alternative' || product.includes('massager') || product.includes('ear') || product.includes('heating pad') || product.includes('compression') || product.includes('waterpik') || product.includes('mouth tape')) {
    tags = [...tags, ...DEVICES_HASHTAGS, ...MENS_HEALTH_HASHTAGS];
  }

  const productTag = '#' + productName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  tags.unshift(productTag);

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const tag of tags) {
    if (!seen.has(tag)) { seen.add(tag); unique.push(tag); }
  }
  return unique.slice(0, 12);
}

// ============================================================
// VISUAL OVERLAY SUGGESTIONS
// (What to show on screen — NOT text overlays, but visual cues)
// ============================================================
function generateVisualOverlays(productName: string, hook: Hook): string[] {
  const product = productName.toLowerCase();
  const base = [
    `📌 CREDENTIAL BANNER: "From a Pharmacist" in upper third of screen — keep this on throughout`,
    `🛒 PRODUCT SHOT: Hold up or show the actual product clearly for 1–2 seconds`,
  ];

  const hookVisuals: Record<string, string[]> = {
    'after-1-month': [
      `📊 GRAPHIC: Timeline showing changes at Week 1, Week 2, Week 4 (simple slide or drawn on screen)`,
      `📸 VISUAL: Show yourself or a graphic representing "before" energy vs "after" energy`,
      `⭐ OVERLAY: Screenshot of 4–5 star reviews from the product page`,
    ],
    'suppressed-knowledge': [
      `📰 GRAPHIC: Show a news headline or research study title on screen (green screen style)`,
      `💊 VISUAL: Side-by-side of pharmaceutical vs natural supplement (conceptual graphic)`,
      `🔬 OVERLAY: Brief text from a PubMed study title (not the full text — just the headline)`,
    ],
    'instruction-correction': [
      `✅❌ GRAPHIC: "WRONG way" vs "RIGHT way" side-by-side visual`,
      `⏰ VISUAL: Clock graphic showing optimal timing (e.g., morning vs night)`,
      `📋 OVERLAY: Simple dosing chart or timing graphic`,
    ],
    'symptom-checklist': [
      `☑️ VISUAL: Animated checklist appearing on screen as you name each symptom`,
      `🧠 GRAPHIC: Body diagram highlighting affected areas (brain fog, muscles, sleep)`,
      `📊 OVERLAY: Deficiency statistics graphic (e.g., "80% of Americans are low in Magnesium")`,
    ],
    'trend-or-trash': [
      `⚖️ GRAPHIC: "TREND 🔥" vs "TRASH 🗑️" scale or split screen`,
      `📱 VISUAL: Show the product trending on TikTok (screenshot of viral videos)`,
      `🔬 OVERLAY: Research study snippet supporting your verdict`,
    ],
    'nad-dosing': [
      `📊 GRAPHIC: Dosing chart showing low/medium/high dose ranges`,
      `📉 VISUAL: Graph showing NAD+ levels declining with age (widely available graphic)`,
      `⚗️ OVERLAY: Show the supplement facts panel briefly`,
    ],
    'age-reversal': [
      `📉 GRAPHIC: Graph showing NAD+ or collagen declining with age`,
      `✨ VISUAL: Before/after skin or energy conceptual graphic (not medical claims)`,
      `🔬 OVERLAY: Research study title on cellular aging`,
    ],
    'comparison': [
      `⚖️ GRAPHIC: Side-by-side comparison table of Product A vs Product B — show both products on screen at the same time`,
      `🔍 VISUAL: Ingredient/formula close-up for each product — let the science do the selling`,
      `🏆 OVERLAY: "Winner for [specific use case]" callout graphic — be specific, not generic`,
      `💰 VISUAL: Price comparison graphic (optional) — only if price is a meaningful differentiator`,
    ],
    'how-do-you-know': [
      `❓ GRAPHIC: Text overlay with the condition name (e.g., "Low NAD+") — keep it on screen through the symptom list`,
      `☑️ VISUAL: Symptom checklist appearing one item at a time as you name each one`,
      `📉 OVERLAY: Graph or statistic showing how common this condition is (e.g., "NAD+ levels drop 50% by age 50")`,
      `⭐ GRAPHIC: Product reviews screenshot at the end — let real results close the video`,
    ],
    'warning-signs': [
      `⚠️ GRAPHIC: Warning sign icons appearing as you list each symptom`,
      `🧠 VISUAL: Body highlighting affected areas`,
      `📊 OVERLAY: Deficiency prevalence statistic`,
    ],

    'pill-bottle-alternative': [
      `💊 GRAPHIC: Side-by-side of "Medication" (pill bottle) vs the product — visual contrast is the hook`,
      `🏥 OVERLAY: Pharmacy shelf or white coat setting to establish authority immediately`,
      `📋 VISUAL: Simple text overlay listing the condition (e.g., "Carpal Tunnel", "Arthritis", "Hair Loss")`,
      `⭐ GRAPHIC: Product reviews screenshot at the end — let real results close the video`,
    ],
    'storytime': [
      `💬 VISUAL: Text bubble showing the "patient question" as you tell the story`,
      `🏥 OVERLAY: Pharmacy setting or white coat visual to establish authority`,
      `⭐ GRAPHIC: Product reviews screenshot at the end`,
    ],
    'myth-busting': [
      `❌ GRAPHIC: Big red X over the myth text`,
      `✅ VISUAL: Green checkmark over the truth`,
      `🔬 OVERLAY: Research study supporting the correction`,
    ],
    'number-list': [
      `🔢 GRAPHIC: Numbered list appearing one item at a time`,
      `📊 VISUAL: Simple benefit icons for each numbered point`,
      `⭐ OVERLAY: Product reviews screenshot at the end`,
    ],
    'ingredient-form': [
      `🔍 GRAPHIC: Side-by-side supplement label comparison — cheap form vs superior bioavailable form`,
      `📊 VISUAL: Bioavailability chart showing absorption percentage differences between forms`,
      `🧪 OVERLAY: Supplement facts panel close-up — zoom in on the ingredient form name`,
      `✅❌ GRAPHIC: "WRONG form" (red X) vs "RIGHT form" (green check) — simple and shareable`,
    ],
    'instead-of-drug': [
      `💊 GRAPHIC: OTC medication bottle on the left vs the natural product on the right — visual contrast`,
      `🏥 OVERLAY: Pharmacy shelf setting or white coat to establish authority`,
      `📊 VISUAL: Side-by-side comparison of side effect profiles (drug vs natural option)`,
      `⭐ GRAPHIC: Product reviews screenshot at the end — let real results close the video`,
    ],
    'medication-side-effect': [
      `💊 GRAPHIC: Medication name + arrow pointing to the symptom it causes — simple cause-effect visual`,
      `🧠 VISUAL: Body diagram showing where the depletion or side effect manifests`,
      `📊 OVERLAY: Before/after conceptual graphic (symptom present vs managed)`,
      `🔬 GRAPHIC: Research study title or clinical reference on screen (green screen style)`,
    ],
  };

  const specific = hookVisuals[hook.id] || [
    `📊 GRAPHIC: Key benefit statistic or research finding`,
    `⭐ OVERLAY: Product reviews screenshot`,
    `📋 VISUAL: Simple benefit summary graphic`,
  ];

  if (product.includes('nad') || product.includes('nmn')) {
    specific.push(`📉 KEY VISUAL: Graph of NAD+ levels declining after age 30 — this is one of the most shared visuals in this niche`);
  }
  if (product.includes('magnesium')) {
    specific.push(`📊 KEY VISUAL: "300+ enzymatic reactions" statistic graphic — simple text on clean background`);
  }
  if (product.includes('astaxanthin')) {
    specific.push(`🦐 KEY VISUAL: Salmon or krill image to show natural source, then product shot`);
  }

  return [...base, ...specific];
}

// ============================================================
// SCRIPT GENERATOR — Simplified language, plain-English science
// ============================================================
export function generateScript(
  inputs: ProductInputs,
  hookId: string,
  useMisdirection: boolean = false,
  bannedWords: string[] = [],
  introPhrase?: IntroPhrase
): GeneratedScript {
  const hook = HOOKS.find(h => h.id === hookId);
  if (!hook) throw new Error('Hook not found');

  const { productName, productDescription, keyBenefit } = inputs;

  const textHook = hook.textHook
    .replace('[PRODUCT]', productName)
    .replace('[NUTRIENT]', productName)
    .replace('[PRODUCT A]', productName)
    .replace('[PRODUCT B]', 'the alternative')
    .replace('[AGE]', '50');

  // If the hook has multiple verbal variants, pick one randomly for variety
  const rawVerbalHook = hook.verbalHookVariants && hook.verbalHookVariants.length > 0
    ? hook.verbalHookVariants[Math.floor(Math.random() * hook.verbalHookVariants.length)]
    : hook.verbalHook;
  const verbalHook = rawVerbalHook
    .replace('[PRODUCT]', productName)
    .replace('[NUTRIENT]', productName)
    .replace('[PRODUCT A]', productName)
    .replace('[PRODUCT B]', 'the alternative')
    .replace('[NUMBER]', '3')
    .replace('[AGE]', '50');

  const problem = generateProblemSection(productName, productDescription, keyBenefit, hook);
  const authorityPivot = generateAuthorityPivot(productName);
  const mechanism = generateMechanism(productName, productDescription, keyBenefit);
  const misdirection = useMisdirection ? generateMisdirection(productName, hook) : undefined;
  const cta = generateCTA(inputs.productLink);
  const hashtags = getHashtags(productName, hookId);
  const visualOverlays = generateVisualOverlays(productName, hook);

  // Assemble full clean script (no labels — just words to say)
  const introPhraseText = introPhrase ? INTRO_PHRASES[introPhrase].text : undefined;
  const scriptParts = introPhraseText
    ? [introPhraseText, verbalHook, problem, authorityPivot, mechanism]
    : [verbalHook, problem, authorityPivot, mechanism];
  if (misdirection) scriptParts.push(misdirection);
  scriptParts.push(cta);
  let fullScript = scriptParts.join(' ');

  // Apply word filter
  if (bannedWords.length) {
    fullScript = applyWordFilter(fullScript, bannedWords);
  }

  // Compliance check on full script
  const { hardFlags, softFlags } = checkCompliance(fullScript);

  return {
    textHook,
    verbalHook,
    problem,
    authorityPivot,
    mechanism,
    misdirection,
    cta,
    hashtags,
    visualOverlays,
    hookName: hook.name,
    psychTriggersUsed: hook.psychTriggers,
    complianceHardFlags: hardFlags,
    complianceSoftFlags: softFlags,
    fullScript,
  };
}

function generateProblemSection(productName: string, description: string, keyBenefit: string, hook: Hook): string {
  const benefit = keyBenefit || description || 'low energy and feeling older than you should';

  if (hook.id === 'pill-bottle-alternative') {
    return `Most people dealing with ${benefit || 'this condition'} go straight to their doctor or pharmacist looking for a pill. And I get it — that is what we are trained to reach for. But for a lot of patients, the first step should not be medication. There are options that work, that have real evidence behind them, and that do not come with the side effects or the cost of a prescription.`;
  }
  if (hook.id === 'symptom-checklist') {
    return `Are you constantly tired even after a full night of sleep? Do you wake up foggy, get muscle cramps, or just feel off? These are not just normal signs of getting older. These are your body's way of telling you something is missing.`;
  }
  if (hook.id === 'after-1-month') {
    return `Most people try ${productName} for a week, feel nothing, and quit. But here is what nobody tells you — the real changes happen slowly, and they are worth waiting for. I tracked exactly what happened over 30 days.`;
  }
  if (hook.id === 'instruction-correction') {
    return `The problem is most people are taking ${productName} at the wrong time, in the wrong amount, or without the things that help it actually work. And then they blame the supplement when it does not work — but it is not the supplement's fault.`;
  }
  if (hook.id === 'suppressed-knowledge') {
    return `There is a lot of money in treating symptoms. So it should not surprise you that something like ${productName} — which goes after the root cause — gets almost no attention from mainstream medicine.`;
  }
  if (hook.id === 'warning-signs') {
    return `Your body gives you warning signs before things get serious. And most people ignore them because they think it is just stress or aging. But if you are experiencing these, it might be worth paying attention.`;
  }
  if (hook.id === 'trend-or-trash') {
    return `${productName} is everywhere right now. Everyone is talking about it. But is it actually backed by science, or is it just another supplement that sounds good on TikTok? I looked into it so you do not have to.`;
  }
  if (hook.id === 'nad-dosing') {
    return `Most people taking ${productName} have no idea if they are taking the right amount. Too little and you waste your money. Too much and you are just wasting even more money. The research actually gives us a clear answer on this.`;
  }
  if (hook.id === 'ingredient-form') {
    return `The supplement industry is full of cheap, poorly absorbed forms of nutrients that look the same on the label but perform completely differently in your body. Most people have no idea there is a difference. They buy the cheapest option, feel nothing, and assume the supplement does not work. But it is not the supplement — it is the form.`;
  }
  if (hook.id === 'instead-of-drug') {
    return `Most people go straight to the pharmacy for a pill when they are dealing with ${benefit || 'this issue'}. And I understand that — it is fast, it is familiar, and it feels like you are doing something. But a lot of those medications come with dependency risks, side effects, or costs that most people do not think about until they are already dealing with them.`;
  }
  if (hook.id === 'medication-side-effect') {
    return `Most people who are on a medication focus on what it is treating. But what nobody talks about is what it is doing to the rest of your body at the same time. This is not a scare tactic — it is just pharmacology. And knowing this can change how you feel every single day.`;
  }
  if (hook.id === 'how-do-you-know') {
    return `A lot of people are walking around with this and have no idea. The symptoms are easy to dismiss — you chalk it up to stress, getting older, not sleeping enough. But there is a pattern. And once you know what to look for, it becomes obvious.`;
  }
  if (hook.id === 'comparison') {
    return `Both of these are getting a lot of attention right now — and for good reason. But they are not the same thing. They work differently, they are built for different people, and choosing the wrong one means you are leaving results on the table.`;
  }

  return `If you have been dealing with ${benefit}, you are not alone. A lot of people are going through the same thing and have no idea that there is something that may actually help.`;
}

function generateAuthorityPivot(productName: string): string {
  const pivots = [
    `As a pharmacist, I have spent time going through the research on ${productName}. And what I found is something I think a lot of people need to hear.`,
    `I review supplements for a living. And ${productName} is one of the ones I actually feel good about sharing with my patients.`,
    `I get asked about ${productName} constantly. So I went through the research myself — and here is what I found.`,
  ];
  return pivots[Math.floor(Math.random() * pivots.length)];
}

function generateMechanism(productName: string, description: string, keyBenefit: string): string {
  const product = productName.toLowerCase();
  const benefit = keyBenefit || description;

  if (product.includes('nad') || product.includes('nmn')) {
    return `Here is the simple version: as you get older, your cells lose energy. NAD+ is basically the fuel your cells run on. After 40, your levels drop by about half — and that is when people start feeling it. Tired all the time, brain fog, slower recovery. ${productName} helps bring those levels back up. Think of it like charging a battery that has been running low for years.`;
  }
  if (product.includes('magnesium')) {
    return `Here is what most people do not know: magnesium is involved in hundreds of processes in your body — sleep, muscle function, mood, energy. Most of us are not getting enough from food anymore. And the form matters a lot. ${productName} is one of the forms that actually gets absorbed well — unlike the cheap versions that just go right through you.`;
  }
  if (product.includes('astaxanthin')) {
    return `${productName} is an antioxidant — but not like the ones you have heard of. It is significantly more powerful than Vitamin C, and it works in a way that most antioxidants cannot. The research on skin, eyes, and energy is genuinely impressive. It is not hype — the studies are there.`;
  }
  if (product.includes('collagen')) {
    return `Here is the thing about collagen: your body makes less of it every year after your mid-20s. That is why skin starts to lose elasticity, joints get stiffer, and recovery takes longer. ${productName} gives your body the building blocks it needs to keep making collagen. The key is the form — you want hydrolyzed collagen peptides because those are the ones your body can actually use.`;
  }
  if (product.includes('berberine')) {
    return `${productName} works by helping your body manage blood sugar more effectively. It activates a pathway in your cells that basically tells your body to use glucose better — similar to how certain medications work, but this is a natural compound that has been studied for decades. The research on metabolic health is solid.`;
  }
  if (product.includes('ashwagandha')) {
    return `${productName} is what is called an adaptogen — it helps your body handle stress better. When you are stressed, your cortisol goes up. High cortisol over time wrecks your sleep, your energy, and your mood. ${productName} helps bring that cortisol back down to a normal range. The studies on stress and sleep quality are pretty consistent.`;
  }

  return `Here is how ${productName} works in plain terms: ${benefit || 'it supports the root cause rather than just masking symptoms'}. The key is making sure you are getting a quality form that your body can actually absorb — because not all supplements are made the same way.`;
}

function generateMisdirection(productName: string, hook: Hook): string {
  const templates = [
    `Now I want to be straight with you — a lot of people online say ${productName} will change everything in a week. That is not what I saw. The real results take three to four weeks to build up. But when they do show up, they are consistent. And that is actually more meaningful than a quick spike that fades.`,
    `I will be honest — I expected to be more skeptical about ${productName} than I ended up being. Most supplements in this category are overhyped. But the research here is more solid than I anticipated. It is not a miracle. But it is real.`,
    `Most brands will tell you to take a big dose all at once. But what the research actually suggests is that a smaller amount taken consistently tends to work better for most people. So if you have been taking a lot and not feeling much — that might be why.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateCTA(productLink?: string): string {
  const linkText = productLink ? ` — I have linked the exact product below` : ` — the link is in my shop below`;
  const ctas = [
    `Don't take my word for it${linkText}. Go read what other people are saying in the reviews. See if it sounds like something your body needs.`,
    `If you want to try this${linkText}. Check the reviews first — the stories from real people are what convinced me this was worth sharing.`,
    `I have put the link in my shop${productLink ? ' below' : ''}. Go check the reviews and decide for yourself. If the cart is still showing, it is still available.`,
    `The product is linked${linkText}. Tap the cart and check the reviews — let other people's results help you decide.`,
  ];
  return ctas[Math.floor(Math.random() * ctas.length)];
}

// ============================================================
// CLONE MODE — Adapt a competitor's viral video for your brand
// ============================================================
export function generateCloneAdaptation(
  originalCreatorHandle: string,
  productName: string,
  videoDescription: string,
  productLink?: string
): string {
  const linkNote = productLink ? `\nPRODUCT LINK: ${productLink}` : '';
  return `CLONE ADAPTATION GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORIGINAL CREATOR: ${originalCreatorHandle}
PRODUCT: ${productName}${linkNote}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO KEEP (95–99% identical):
• The exact hook structure and opening line — word for word
• The problem/symptom section — same points, same order
• The mechanism explanation — how the product works
• The pacing and video length — match it exactly
• The editing style and visual overlay placement
• The background music energy level
• The emotional tone — calm and clinical, or urgent and fast

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO CHANGE (your pharmacist spin only):
• "Cancer Researcher" → "Pharmacist" or "PharmD"
• "Doctor" → "Pharmacist"
• "Naturopath" → "Pharmacist"
• "Nurse" → "Pharmacist"
• Any credential banner → "From a Pharmacist"
• Add your white lab coat if they are not wearing one
• Swap their CTA language for yours (see CTA options below)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR ADAPTED OPENING LINE:
"As a pharmacist, I need to talk about ${productName}. ${videoDescription ? videoDescription.slice(0, 120) + '...' : 'What I found in the research is something every patient should know.'}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VISUAL SETUP:
• Credential banner: "From a Pharmacist" — upper third, stays on screen
• Keep the same background/setting energy as the original
• Match their text overlay style (minimal text, mostly visuals)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CTA OPTIONS (pick one):
1. "Don't take my word for it — the link is in my shop below. Go check the reviews."
2. "I've linked the exact product below. Check the reviews and decide for yourself."
3. "If you can still see the cart, tap it and go read what people are saying."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILMING REMINDER:
Your pharmacist credential is MORE authoritative than most creators in this space.
A doctor diagnoses. A pharmacist knows the drugs, the interactions, and the science.
Lean into that — it is your biggest unfair advantage.`;
}

// ============================================================
// ITERATE MODE — Build on a winning video
// ============================================================
export function generateIteration(
  originalVideoDescription: string,
  productName: string,
  iterationLevel: IterationLevel,
  productLink?: string
): string {
  const linkNote = productLink ? `\nProduct link: ${productLink}` : '';

  if (iterationLevel === '70') {
    return `70% ITERATION — MINOR CHANGES ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT: ${productName}${linkNote}

WHAT TO KEEP (everything that made it work):
• The exact hook — word for word, do not change it
• The problem section — same symptoms, same order
• The mechanism explanation
• The product (${productName})
• The video length and pacing
• The visual style and overlay placement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO CHANGE (minor tweaks only):
• Update the CTA with a fresh line (rotate from the options below)
• Change the background music
• Slightly reorder one or two sentences in the middle
• Add one new piece of research or a statistic you did not use before
• Film in a slightly different location or angle

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CTA VARIATIONS TO ROTATE:
1. "Check the reviews yourself — the link is in my shop below."
2. "If you can still see the orange cart, tap it and see what people are saying."
3. "I've linked the exact product I recommend below. The reviews speak for themselves."
4. "Don't take my word for it — go read what thousands of people are saying."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOAL: Catch new viewers who missed the first video while keeping everything that already converted.
The algorithm will push this to a new audience — they have never seen your first version.`;
  }

  if (iterationLevel === '20') {
    return `20% ITERATION — FORMAT CHANGE, SAME MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT: ${productName}${linkNote}

WHAT TO KEEP:
• The core message about ${productName}
• The key benefits and symptoms you addressed
• The psychological triggers that worked
• The product itself

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO CHANGE (format transformation):
• Talking head → Green screen with research study or graphic
• Symptom checklist → After 1 Month results format
• Instruction video → Myth busting format
• Review video → Comparison with a competing product
• Single benefit → Number list of multiple benefits

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLE TRANSFORMATION:
Original: "How to take ${productName} the RIGHT way" (instruction)
New: "Everyone is taking ${productName} WRONG — here is the proof" (myth bust)
Same message. Different emotional entry point. Different audience segment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOAL: Reach a new segment of the audience who responds to a different format.
Some people click on checklists. Others click on comparisons. This covers both.`;
  }

  return `10% ITERATION — FULL CREATIVE EXPERIMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT: ${productName}${linkNote}

Keep the product. Throw out everything else.
This is your experimental slot — the goal is to find your NEXT winning format.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPERIMENT IDEAS:
1. "Day in the life" — show yourself taking the supplement as part of your pharmacy routine
2. "Responding to a comment" — use a real viewer comment as the hook
3. "Duet or stitch" a viral video about ${productName} and add your pharmacist commentary
4. "Green screen + research study" — show an actual study on screen and walk through it
5. "Patient conversation" — roleplay a pharmacy consultation about ${productName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW HOOK TERRITORY TO TEST:
• Shocking statistic: "X% of Americans are low in [nutrient in ${productName}]"
• Direct question: "Why does your doctor never mention ${productName}?"
• Personal result: "I have been taking ${productName} for 6 months. Here is what changed."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOAL: Find a new format that can become your next 70% replication template.
One 10% experiment that hits becomes your next 20-video series.`;
}
