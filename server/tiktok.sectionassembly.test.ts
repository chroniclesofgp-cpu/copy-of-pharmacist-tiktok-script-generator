/**
 * Rx Content Section Assembly Tests
 * Validates that the server-side section assembly logic enforces hook-first ordering,
 * preserves visual cues, and handles edge cases correctly.
 *
 * These tests exercise the assembleScriptFromSections helper which is extracted
 * from the generateSingle procedure for testability.
 */

import { describe, it, expect } from "vitest";
import { assembleScriptFromSections } from "./routers/tiktok";

// ─── Core section ordering ─────────────────────────────────────────────────────

describe("assembleScriptFromSections — section ordering", () => {
  it("always places verbalHook first in the assembled script", () => {
    const result = assembleScriptFromSections({
      verbalHook: "If you are taking Magnesium Glycinate and not sleeping better, you are probably taking it wrong.",
      problem: "Most people take it in the morning, but magnesium glycinate works best at night.",
      authorityPivot: "As a pharmacist, I see this mistake constantly.",
      mechanism: "Magnesium activates GABA receptors — the same pathway your brain uses to switch off.",
      cta: "Link is in my shop below. Tap the cart and check the reviews.",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    // verbalHook must be the very first content in the assembled script
    expect(result.startsWith("If you are taking Magnesium Glycinate")).toBe(true);
  });

  it("places cta last in the assembled script", () => {
    const result = assembleScriptFromSections({
      verbalHook: "Here is how to take Vitamin D the right way.",
      problem: "Most people take it at the wrong time of day.",
      authorityPivot: "As a pharmacist, here is what I tell my patients.",
      mechanism: "Vitamin D is fat-soluble — it absorbs best when taken with your largest meal.",
      cta: "Link is in my shop below. Tap the cart and check the reviews.",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    expect(result.endsWith("Tap the cart and check the reviews.")).toBe(true);
  });

  it("includes all five sections in the assembled script", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK_TEXT",
      problem: "PROBLEM_TEXT",
      authorityPivot: "AUTHORITY_TEXT",
      mechanism: "MECHANISM_TEXT",
      cta: "CTA_TEXT",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    expect(result).toContain("HOOK_TEXT");
    expect(result).toContain("PROBLEM_TEXT");
    expect(result).toContain("AUTHORITY_TEXT");
    expect(result).toContain("MECHANISM_TEXT");
    expect(result).toContain("CTA_TEXT");
  });

  it("places verbalHook before problem", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    expect(result.indexOf("HOOK")).toBeLessThan(result.indexOf("PROBLEM"));
  });

  it("places problem before mechanism", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    expect(result.indexOf("PROBLEM")).toBeLessThan(result.indexOf("MECHANISM"));
  });

  it("places mechanism before cta", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    expect(result.indexOf("MECHANISM")).toBeLessThan(result.indexOf("CTA"));
  });
});

// ─── Misdirection section ──────────────────────────────────────────────────────

describe("assembleScriptFromSections — misdirection", () => {
  it("includes misdirection when useMisdirection is true", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: "Everyone says you feel it in 3 days, but real results take 3-4 weeks.",
      llmFullScript: "",
      useMisdirection: true,
    });
    expect(result).toContain("real results take 3-4 weeks");
  });

  it("excludes misdirection when useMisdirection is false", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: "Everyone says you feel it in 3 days, but real results take 3-4 weeks.",
      llmFullScript: "",
      useMisdirection: false,
    });
    expect(result).not.toContain("real results take 3-4 weeks");
  });

  it("places misdirection before cta", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: "MISDIRECTION",
      llmFullScript: "",
      useMisdirection: true,
    });
    expect(result.indexOf("MISDIRECTION")).toBeLessThan(result.indexOf("CTA"));
  });
});

// ─── Visual cue preservation ───────────────────────────────────────────────────

describe("assembleScriptFromSections — visual cue preservation", () => {
  it("preserves visual cues that are already inside section text", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK [VISUAL: Product label closeup]",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM [VISUAL: Infographic showing mechanism]",
      cta: "CTA",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    expect(result).toContain("[VISUAL: Product label closeup]");
    expect(result).toContain("[VISUAL: Infographic showing mechanism]");
  });

  it("extracts and injects extra visual cues from llmFullScript that are not in sections", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: undefined,
      llmFullScript: "HOOK PROBLEM AUTHORITY [VISUAL: Study citation card] MECHANISM [VISUAL: Before and after comparison] CTA",
      useMisdirection: false,
    });
    // Extra visual cues from llmFullScript should be injected into the assembled script
    expect(result).toContain("[VISUAL: Study citation card]");
    expect(result).toContain("[VISUAL: Before and after comparison]");
  });

  it("does not duplicate visual cues already present in sections", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK [VISUAL: Product shot]",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: undefined,
      llmFullScript: "HOOK [VISUAL: Product shot] PROBLEM AUTHORITY MECHANISM CTA",
      useMisdirection: false,
    });
    // [VISUAL: Product shot] should appear only once
    const matches = result.match(/\[VISUAL: Product shot\]/g) || [];
    expect(matches).toHaveLength(1);
  });
});

// ─── Edge cases ────────────────────────────────────────────────────────────────

describe("assembleScriptFromSections — edge cases", () => {
  it("falls back to llmFullScript when all sections are empty", () => {
    const result = assembleScriptFromSections({
      verbalHook: "",
      problem: "",
      authorityPivot: "",
      mechanism: "",
      cta: "",
      misdirection: undefined,
      llmFullScript: "FALLBACK_FULL_SCRIPT",
      useMisdirection: false,
    });
    expect(result).toBe("FALLBACK_FULL_SCRIPT");
  });

  it("does not produce double spaces in the assembled output", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK",
      problem: "PROBLEM",
      authorityPivot: "AUTHORITY",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    expect(result).not.toMatch(/\s{2,}/);
  });

  it("trims leading and trailing whitespace", () => {
    const result = assembleScriptFromSections({
      verbalHook: "  HOOK  ",
      problem: "  PROBLEM  ",
      authorityPivot: "  AUTHORITY  ",
      mechanism: "  MECHANISM  ",
      cta: "  CTA  ",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    expect(result).toBe(result.trim());
  });

  it("handles missing optional sections gracefully", () => {
    const result = assembleScriptFromSections({
      verbalHook: "HOOK",
      problem: "",
      authorityPivot: "",
      mechanism: "MECHANISM",
      cta: "CTA",
      misdirection: undefined,
      llmFullScript: "",
      useMisdirection: false,
    });
    // Should still produce a valid script with the sections that exist
    expect(result).toContain("HOOK");
    expect(result).toContain("MECHANISM");
    expect(result).toContain("CTA");
    // Empty sections should not produce extra spaces
    expect(result).not.toMatch(/\s{2,}/);
  });
});
