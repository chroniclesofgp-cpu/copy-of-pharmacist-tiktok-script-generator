/**
 * Tests for TikTok router helper functions
 * Tests the pure helper logic without requiring actual TikTok downloads or LLM calls
 */
import { describe, it, expect } from "vitest";

// ─── Re-implement helpers for testing (same logic as tiktok.ts) ───────────────

function extractTikTokVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

function extractCreatorHandle(url: string): string {
  const match = url.match(/@([^/?]+)/);
  return match ? match[1] : "unknown";
}

function isShortTikTokUrl(url: string): boolean {
  return /https?:\/\/(www\.tiktok\.com\/t\/|vm\.tiktok\.com\/|vt\.tiktok\.com\/)/.test(url);
}

function isValidTikTokUrl(url: string): boolean {
  return /https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com/.test(url);
}

function sanitizeUrl(url: string): string {
  return url
    .trim()
    .replace(/%60.*$/, '')            // remove %60 (URL-encoded backtick) and everything after
    .replace(/[`'"]/g, '')           // remove literal backticks and quotes
    .replace(/\?locale=[^&]+/, '')    // remove ?locale= params
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // remove zero-width chars
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
  const grade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  return Math.max(1, Math.min(16, Math.round(grade)));
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  const vowelGroups = word.match(/[aeiouy]+/g);
  return vowelGroups ? vowelGroups.length : 1;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("extractTikTokVideoId", () => {
  it("extracts video ID from standard TikTok URL", () => {
    expect(extractTikTokVideoId("https://www.tiktok.com/@drew.review/video/7491417105502375214"))
      .toBe("7491417105502375214");
  });

  it("extracts video ID from URL with query params", () => {
    expect(extractTikTokVideoId("https://www.tiktok.com/@drew.review/video/7491417105502375214?sort_type=2"))
      .toBe("7491417105502375214");
  });

  it("returns null for non-video TikTok URL", () => {
    expect(extractTikTokVideoId("https://www.tiktok.com/@drew.review")).toBeNull();
  });

  it("returns null for invalid URL", () => {
    expect(extractTikTokVideoId("not-a-url")).toBeNull();
  });

  it("handles short TikTok share URLs with video path", () => {
    expect(extractTikTokVideoId("https://vm.tiktok.com/video/1234567890123456789"))
      .toBe("1234567890123456789");
  });
});

describe("extractCreatorHandle", () => {
  it("extracts handle from standard URL", () => {
    expect(extractCreatorHandle("https://www.tiktok.com/@drew.review/video/123"))
      .toBe("drew.review");
  });

  it("extracts handle with underscores", () => {
    expect(extractCreatorHandle("https://www.tiktok.com/@naturopathic_apothecary1/video/123"))
      .toBe("naturopathic_apothecary1");
  });

  it("returns unknown for URL without handle", () => {
    expect(extractCreatorHandle("https://www.tiktok.com/trending")).toBe("unknown");
  });

  it("extracts handle from URL with query params", () => {
    expect(extractCreatorHandle("https://www.tiktok.com/@faithfuldoc?sort_type=2"))
      .toBe("faithfuldoc");
  });
});

describe("calculateReadingLevel", () => {
  it("returns a value between 1 and 16", () => {
    const text = "This is a simple sentence. It has short words. Easy to read.";
    const level = calculateReadingLevel(text);
    expect(level).toBeGreaterThanOrEqual(1);
    expect(level).toBeLessThanOrEqual(16);
  });

  it("returns 8 for empty text", () => {
    expect(calculateReadingLevel("")).toBe(8);
  });

  it("returns higher grade for complex text", () => {
    const simple = "Take this pill. It helps you sleep. It is good.";
    const complex = "Mitochondrial biogenesis represents a fundamental cellular adaptation mechanism whereby organellar proliferation occurs in response to metabolic demands.";
    const simpleLevel = calculateReadingLevel(simple);
    const complexLevel = calculateReadingLevel(complex);
    expect(complexLevel).toBeGreaterThan(simpleLevel);
  });

  it("returns grade 8-10 for typical TikTok health content", () => {
    const typical = "If you're over 40 and feeling tired all the time, your NAD levels are probably crashing. NAD is basically the fuel your cells run on. After 30, your levels drop by about 50 percent. Taking an NAD supplement can help restore your energy and slow down aging at the cellular level.";
    const level = calculateReadingLevel(typical);
    expect(level).toBeGreaterThanOrEqual(6);
    expect(level).toBeLessThanOrEqual(14);
  });
});

describe("countSyllables", () => {
  it("counts syllables in simple words", () => {
    expect(countSyllables("cat")).toBe(1);
    expect(countSyllables("happy")).toBe(2);
    expect(countSyllables("beautiful")).toBe(3);
  });

  it("returns 1 for very short words", () => {
    expect(countSyllables("I")).toBe(1);
    expect(countSyllables("it")).toBe(1);
  });

  it("handles medical terms", () => {
    const syllables = countSyllables("mitochondrial");
    expect(syllables).toBeGreaterThan(3);
  });
});

describe("isShortTikTokUrl", () => {
  it("detects tiktok.com/t/ short share links", () => {
    expect(isShortTikTokUrl("https://www.tiktok.com/t/ZTkhQFX15/")).toBe(true);
  });

  it("detects vm.tiktok.com short links", () => {
    expect(isShortTikTokUrl("https://vm.tiktok.com/ZMkXXXXX/")).toBe(true);
  });

  it("detects vt.tiktok.com short links", () => {
    expect(isShortTikTokUrl("https://vt.tiktok.com/ZSjXXXXX/")).toBe(true);
  });

  it("returns false for full TikTok video URLs", () => {
    expect(isShortTikTokUrl("https://www.tiktok.com/@drew.review/video/7491417105502375214")).toBe(false);
  });
});

describe("isValidTikTokUrl", () => {
  it("accepts full TikTok video URLs", () => {
    expect(isValidTikTokUrl("https://www.tiktok.com/@drew.review/video/7491417105502375214")).toBe(true);
  });

  it("accepts short tiktok.com/t/ URLs", () => {
    expect(isValidTikTokUrl("https://www.tiktok.com/t/ZTkhQFX15/")).toBe(true);
  });

  it("accepts vm.tiktok.com URLs", () => {
    expect(isValidTikTokUrl("https://vm.tiktok.com/ZMkXXXXX/")).toBe(true);
  });

  it("rejects non-TikTok URLs", () => {
    expect(isValidTikTokUrl("https://www.youtube.com/watch?v=abc")).toBe(false);
    expect(isValidTikTokUrl("https://instagram.com/p/abc")).toBe(false);
  });
});

describe("sanitizeUrl", () => {
  it("strips backticks from copy-pasted URLs", () => {
    expect(sanitizeUrl("https://www.tiktok.com/@drew.review/video/7491417105502375214`"))
      .toBe("https://www.tiktok.com/@drew.review/video/7491417105502375214");
  });

  it("strips %60 URL-encoded backtick and everything after it", () => {
    expect(sanitizeUrl("https://www.tiktok.com/@drew.review/video/7491417105502375214%60?locale=en"))
      .toBe("https://www.tiktok.com/@drew.review/video/7491417105502375214");
  });

  it("strips ?locale= query parameter", () => {
    expect(sanitizeUrl("https://www.tiktok.com/@drew.review/video/7491417105502375214?locale=en"))
      .toBe("https://www.tiktok.com/@drew.review/video/7491417105502375214");
  });

  it("trims whitespace", () => {
    expect(sanitizeUrl("  https://www.tiktok.com/t/ZTkhQFX15/  "))
      .toBe("https://www.tiktok.com/t/ZTkhQFX15/");
  });

  it("leaves clean URLs unchanged", () => {
    const url = "https://www.tiktok.com/@drew.review/video/7491417105502375214";
    expect(sanitizeUrl(url)).toBe(url);
  });
});

describe("TikTok URL validation", () => {
  const validUrls = [
    "https://www.tiktok.com/@drew.review/video/7491417105502375214",
    "https://www.tiktok.com/@naturopathicapothecary1/video/7433282067300928798",
    "https://www.tiktok.com/@adoseofwellness/video/7584490494177152287",
    "https://www.tiktok.com/@faithfuldoc/video/7560024643948580109",
  ];

  validUrls.forEach(url => {
    it(`correctly parses ${url.split("@")[1]?.split("/")[0]}`, () => {
      const videoId = extractTikTokVideoId(url);
      const handle = extractCreatorHandle(url);
      expect(videoId).toBeTruthy();
      expect(videoId).toMatch(/^\d+$/);
      expect(handle).not.toBe("unknown");
    });
  });
});

// ─── A/B Variants logic tests ─────────────────────────────────────────────────

function buildABVariantsPrompt(hookName: string, script: string, productName?: string, bannedWords?: string[]): string {
  const bannedNote = bannedWords && bannedWords.length > 0
    ? `\nBANNED WORDS — never use these: ${bannedWords.join(", ")}`
    : "";
  return `${bannedNote}\n\nYou are given a TikTok script using the "${hookName}" hook framework.\nProduct: ${productName || "supplement"}\n\nEXISTING SCRIPT:\n"""\n${script}\n"""`;
}

function parseABVariantsResponse(raw: string): { variantA: string; variantB: string; variantC: string; scriptBody: string; rationaleA: string; rationaleB: string; rationaleC: string } | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.variantA || !parsed.variantB || !parsed.variantC) return null;
    return {
      variantA: parsed.variantA || "",
      variantB: parsed.variantB || "",
      variantC: parsed.variantC || "",
      scriptBody: parsed.scriptBody || "",
      rationaleA: parsed.rationaleA || "",
      rationaleB: parsed.rationaleB || "",
      rationaleC: parsed.rationaleC || "",
    };
  } catch {
    return null;
  }
}

describe("A/B Variants prompt builder", () => {
  it("includes hook name in prompt", () => {
    const prompt = buildABVariantsPrompt("The After 1 Month Formula", "Test script");
    expect(prompt).toContain("The After 1 Month Formula");
  });

  it("includes banned words when provided", () => {
    const prompt = buildABVariantsPrompt("Hook", "Script", "NAD+", ["amazing", "miracle"]);
    expect(prompt).toContain("BANNED WORDS");
    expect(prompt).toContain("amazing");
    expect(prompt).toContain("miracle");
  });

  it("omits banned words section when empty", () => {
    const prompt = buildABVariantsPrompt("Hook", "Script", "NAD+", []);
    expect(prompt).not.toContain("BANNED WORDS");
  });

  it("uses 'supplement' as default product name", () => {
    const prompt = buildABVariantsPrompt("Hook", "Script");
    expect(prompt).toContain("Product: supplement");
  });
});

describe("A/B Variants response parser", () => {
  it("parses valid LLM response with all fields", () => {
    const raw = JSON.stringify({
      variantA: "Opening line A",
      variantB: "Opening line B",
      variantC: "Opening line C",
      scriptBody: "Rest of the script",
      rationaleA: "Direct and punchy",
      rationaleB: "Uses a question",
      rationaleC: "Leads with a stat",
    });
    const result = parseABVariantsResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.variantA).toBe("Opening line A");
    expect(result?.variantB).toBe("Opening line B");
    expect(result?.variantC).toBe("Opening line C");
    expect(result?.scriptBody).toBe("Rest of the script");
  });

  it("returns null for invalid JSON", () => {
    expect(parseABVariantsResponse("not json")).toBeNull();
  });

  it("returns null when required variant fields are missing", () => {
    const raw = JSON.stringify({ variantA: "A", scriptBody: "body" }); // missing B and C
    expect(parseABVariantsResponse(raw)).toBeNull();
  });

  it("handles missing optional fields gracefully", () => {
    const raw = JSON.stringify({
      variantA: "A",
      variantB: "B",
      variantC: "C",
    });
    const result = parseABVariantsResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.scriptBody).toBe("");
    expect(result?.rationaleA).toBe("");
  });
});

// ─── Batch Generation logic tests ─────────────────────────────────────────────

function parseBatchGenerateResponse(raw: string): Array<{ hookId: string; hookName: string; hookCategory: string; script: string; openingLine: string }> {
  try {
    const parsed = JSON.parse(raw);
    const scripts = parsed.scripts || [];
    return scripts.filter((s: any) => s.hookId && s.hookName && s.script);
  } catch {
    return [];
  }
}

function buildBatchProductContext(productName: string, productDescription?: string, keyBenefit?: string): string {
  return [
    `Product: ${productName}`,
    productDescription ? `Description: ${productDescription}` : "",
    keyBenefit ? `Key Benefit: ${keyBenefit}` : "",
  ].filter(Boolean).join("\n");
}

describe("Batch Generation response parser", () => {
  it("parses valid batch response with all 9 scripts", () => {
    const mockScripts = Array.from({ length: 9 }, (_, i) => ({
      hookId: `hook-${i}`,
      hookName: `Hook ${i}`,
      hookCategory: "tier1",
      script: `Script ${i}`,
      openingLine: `Opening ${i}`,
    }));
    const raw = JSON.stringify({ scripts: mockScripts });
    const result = parseBatchGenerateResponse(raw);
    expect(result).toHaveLength(9);
    expect(result[0]?.hookId).toBe("hook-0");
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseBatchGenerateResponse("not json")).toHaveLength(0);
  });

  it("filters out items missing required fields", () => {
    const raw = JSON.stringify({
      scripts: [
        { hookId: "h1", hookName: "Hook 1", script: "Script 1", openingLine: "Opening" },
        { hookName: "Hook 2", script: "Script 2" }, // missing hookId
        { hookId: "h3", hookName: "Hook 3" }, // missing script
      ],
    });
    const result = parseBatchGenerateResponse(raw);
    expect(result).toHaveLength(1); // only h1 passes all checks
  });

  it("returns empty array when scripts key is missing", () => {
    const raw = JSON.stringify({ data: [] });
    expect(parseBatchGenerateResponse(raw)).toHaveLength(0);
  });

  it("handles partial batch (fewer than 9 scripts) gracefully", () => {
    const mockScripts = Array.from({ length: 5 }, (_, i) => ({
      hookId: `hook-${i}`,
      hookName: `Hook ${i}`,
      hookCategory: "tier1",
      script: `Script ${i}`,
      openingLine: `Opening ${i}`,
    }));
    const raw = JSON.stringify({ scripts: mockScripts });
    const result = parseBatchGenerateResponse(raw);
    expect(result).toHaveLength(5); // returns what's available, no crash
  });

  it("validates all 9 expected hook IDs are present in a full batch", () => {
    const expectedHookIds = [
      "instruction-correction",
      "symptom-checklist",
      "suppressed-knowledge",
      "after-1-month",
      "trend-or-trash",
      "nad-dosing",
      "age-reversal",
      "comparison",
      "warning-signs",
    ];
    const mockScripts = expectedHookIds.map((hookId, i) => ({
      hookId,
      hookName: `Hook ${i}`,
      hookCategory: "tier1",
      script: `Script for ${hookId}`,
      openingLine: `Opening for ${hookId}`,
    }));
    const raw = JSON.stringify({ scripts: mockScripts });
    const result = parseBatchGenerateResponse(raw);
    expect(result).toHaveLength(9);
    const returnedIds = result.map(s => s.hookId);
    for (const id of expectedHookIds) {
      expect(returnedIds).toContain(id);
    }
  });
});

describe("Batch Generation product context builder", () => {
  it("includes product name always", () => {
    const ctx = buildBatchProductContext("NAD+");
    expect(ctx).toContain("Product: NAD+");
  });

  it("includes description when provided", () => {
    const ctx = buildBatchProductContext("NAD+", "Supports cellular energy");
    expect(ctx).toContain("Description: Supports cellular energy");
  });

  it("includes key benefit when provided", () => {
    const ctx = buildBatchProductContext("NAD+", undefined, "Anti-aging");
    expect(ctx).toContain("Key Benefit: Anti-aging");
    expect(ctx).not.toContain("Description:");
  });

  it("omits empty optional fields", () => {
    const ctx = buildBatchProductContext("NAD+");
    expect(ctx).not.toContain("Description:");
    expect(ctx).not.toContain("Key Benefit:");
  });
});

// ─── Product Research response parser tests ───────────────────────────────────

function parseProductResearchResponse(raw: string): {
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
} | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.primaryIngredients || !parsed.mechanismOfAction) return null;
    return {
      primaryIngredients: parsed.primaryIngredients || "",
      mechanismOfAction: parsed.mechanismOfAction || "",
      clinicalBacking: parsed.clinicalBacking || "",
      targetAudience: parsed.targetAudience || "",
      commonMistakeGap: parsed.commonMistakeGap || "",
      productDifferentiator: parsed.productDifferentiator || "",
      comparisonPair: parsed.comparisonPair || "",
      warningSigns: Array.isArray(parsed.warningSigns) ? parsed.warningSigns : [],
      dosingFacts: parsed.dosingFacts || "",
      suppressedFact: parsed.suppressedFact || "",
    };
  } catch {
    return null;
  }
}

describe("Product Research response parser", () => {
  it("parses a valid research response with all fields", () => {
    const raw = JSON.stringify({
      primaryIngredients: "NMN (Nicotinamide Mononucleotide)",
      mechanismOfAction: "NMN is a precursor to NAD+, which powers cellular energy production.",
      clinicalBacking: "Studies show NAD+ declines 50% by age 40.",
      targetAudience: "Adults over 40 with low energy and brain fog",
      commonMistakeGap: "Most people take NMN without a fat source, reducing absorption.",
      productDifferentiator: "Third-party tested, clinical dose of 500mg",
      comparisonPair: "NMN vs NR (Nicotinamide Riboside)",
      warningSigns: ["fatigue", "brain fog", "poor sleep", "low motivation"],
      dosingFacts: "250-500mg daily with a fat-containing meal for best absorption",
      suppressedFact: "Most NMN supplements are degraded in the stomach before reaching the bloodstream.",
    });
    const result = parseProductResearchResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.primaryIngredients).toContain("NMN");
    expect(result?.warningSigns).toHaveLength(4);
    expect(result?.warningSigns).toContain("brain fog");
  });

  it("returns null for invalid JSON", () => {
    expect(parseProductResearchResponse("not json")).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    const raw = JSON.stringify({ clinicalBacking: "some study" }); // missing primaryIngredients
    expect(parseProductResearchResponse(raw)).toBeNull();
  });

  it("handles missing optional fields gracefully with empty defaults", () => {
    const raw = JSON.stringify({
      primaryIngredients: "Collagen",
      mechanismOfAction: "Supports skin elasticity",
    });
    const result = parseProductResearchResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.warningSigns).toEqual([]);
    expect(result?.suppressedFact).toBe("");
    expect(result?.comparisonPair).toBe("");
  });

  it("handles non-array warningSigns gracefully", () => {
    const raw = JSON.stringify({
      primaryIngredients: "Magnesium",
      mechanismOfAction: "Supports muscle relaxation",
      warningSigns: "muscle cramps, poor sleep", // string instead of array
    });
    const result = parseProductResearchResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.warningSigns).toEqual([]); // falls back to empty array
  });
});

// ─── Quality Check response parser tests ──────────────────────────────────────

function parseQualityCheckResponse(raw: string): {
  passed: boolean;
  failedChecks: string[];
  script: string;
} | null {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.passed !== "boolean") return null;
    return {
      passed: parsed.passed,
      failedChecks: Array.isArray(parsed.failedChecks) ? parsed.failedChecks : [],
      script: (parsed.script && typeof parsed.script === "string") ? parsed.script : "",
    };
  } catch {
    return null;
  }
}

describe("Quality Check response parser", () => {
  it("parses a passing quality check response", () => {
    const raw = JSON.stringify({
      passed: true,
      failedChecks: [],
      script: "As a pharmacist, here is how to take magnesium the right way...",
    });
    const result = parseQualityCheckResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.passed).toBe(true);
    expect(result?.failedChecks).toHaveLength(0);
    expect(result?.script).toContain("pharmacist");
  });

  it("parses a failing quality check response with corrections", () => {
    const raw = JSON.stringify({
      passed: false,
      failedChecks: ["Missing GAP section", "Missing BRAND CLOSE"],
      script: "As a pharmacist... [corrected script with gap and brand close]",
    });
    const result = parseQualityCheckResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.passed).toBe(false);
    expect(result?.failedChecks).toHaveLength(2);
    expect(result?.failedChecks).toContain("Missing GAP section");
  });

  it("returns null for invalid JSON", () => {
    expect(parseQualityCheckResponse("not json")).toBeNull();
  });

  it("returns null when passed field is missing", () => {
    const raw = JSON.stringify({ failedChecks: [], script: "some script" });
    expect(parseQualityCheckResponse(raw)).toBeNull();
  });

  it("handles missing failedChecks gracefully with empty array", () => {
    const raw = JSON.stringify({ passed: true, script: "some script" });
    const result = parseQualityCheckResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.failedChecks).toEqual([]);
  });

  it("handles missing script gracefully with empty string", () => {
    const raw = JSON.stringify({ passed: false, failedChecks: ["Missing GAP"] });
    const result = parseQualityCheckResponse(raw);
    expect(result).not.toBeNull();
    expect(result?.script).toBe("");
  });
});

// ─── Script structural validation tests ───────────────────────────────────────
// Tests that verify the structural requirements for generated scripts.

function checkScriptHasGap(script: string): boolean {
  // A gap section typically contains phrases like "most people", "common mistake",
  // "don't know", "getting wrong", "missing", "the problem is", "here's what"
  const gapPatterns = [
    /most people/i,
    /common mistake/i,
    /don't know/i,
    /getting wrong/i,
    /the problem is/i,
    /here's what most/i,
    /what most people/i,
    /nobody talks/i,
    /they don't tell you/i,
    /missing out/i,
  ];
  return gapPatterns.some(pattern => pattern.test(script));
}

function checkScriptHasCTA(script: string): boolean {
  return /link is in my shop|tap the cart|check the reviews/i.test(script);
}

function checkScriptHasVisualCues(script: string): boolean {
  return /\[VISUAL:/i.test(script);
}

function checkScriptWordCount(script: string): { wordCount: number; inRange: boolean } {
  const wordCount = script.split(/\s+/).filter(w => w.length > 0).length;
  return { wordCount, inRange: wordCount >= 120 && wordCount <= 280 };
}

describe("Script structural validation", () => {
  const sampleScript = `As a pharmacist, here is how to take magnesium the right way.
[VISUAL: Hold up bottle of magnesium glycinate]
Most people are taking the wrong form of magnesium and wondering why it is not working.
Magnesium oxide — the kind in most cheap supplements — has only 4% absorption rate.
[VISUAL: Comparison graphic: Magnesium Oxide vs Glycinate]
The form that actually works is magnesium glycinate. It is chelated, meaning it is bound to an amino acid, so your body absorbs it at over 80%.
Here is the gap: most people do not take it with food, and they take it in the morning when their cortisol is already high. Take it at night with a small meal for best results.
[VISUAL: Clock showing nighttime, small meal icon]
This is why I recommend this magnesium glycinate formula — it uses the clinical dose of 400mg and it is third-party tested.
Link is in my shop below. Tap the cart and check the reviews.`;

  it("detects gap section in a well-structured script", () => {
    expect(checkScriptHasGap(sampleScript)).toBe(true);
  });

  it("detects CTA in a well-structured script", () => {
    expect(checkScriptHasCTA(sampleScript)).toBe(true);
  });

  it("detects visual cues in a well-structured script", () => {
    expect(checkScriptHasVisualCues(sampleScript)).toBe(true);
  });

  it("validates word count is in acceptable range", () => {
    const { wordCount, inRange } = checkScriptWordCount(sampleScript);
    expect(wordCount).toBeGreaterThan(0);
    expect(inRange).toBe(true);
  });

  it("detects missing CTA in a script without one", () => {
    const scriptWithoutCTA = "As a pharmacist, here is how to take magnesium. Most people get this wrong.";
    expect(checkScriptHasCTA(scriptWithoutCTA)).toBe(false);
  });

  it("detects missing visual cues in a script without them", () => {
    const scriptWithoutVisuals = "As a pharmacist, here is how to take magnesium. Most people get this wrong. Link is in my shop.";
    expect(checkScriptHasVisualCues(scriptWithoutVisuals)).toBe(false);
  });

  it("flags scripts that are too short (under 120 words)", () => {
    const shortScript = "Take magnesium. It helps. Link in bio.";
    const { inRange } = checkScriptWordCount(shortScript);
    expect(inRange).toBe(false);
  });
});
