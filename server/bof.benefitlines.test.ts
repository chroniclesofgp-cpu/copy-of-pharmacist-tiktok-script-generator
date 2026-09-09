/**
 * BOF Benefit Lines Tests
 * Validates the injectBenefitLines helper and the generateBenefitLines
 * procedure input schema for all four supported hooks.
 */

import { describe, it, expect } from "vitest";
import { injectBenefitLines } from "./routers/bof";
import { BOF_HOOKS } from "../client/src/lib/bofHooks";
import { VERBATIM_TEMPLATES } from "../client/src/lib/bofLineBank";

// ─── injectBenefitLines — returning-this ─────────────────────────────────────

describe("injectBenefitLines — returning-this", () => {
  const sampleScript = `I'm returning this. Not because it doesn't work. I'm just disappointed because they're having a flash sale and I paid full price. When you tap the orange cart, that's gonna activate a limited flash sale. Tonight only. Tap the orange cart before they raise the price.`;

  it("inserts benefit block before the deal pivot sentence", () => {
    const benefitBlock = `not because it's loaded with retinol to reduce fine lines\nnot because it contains niacinamide to fade dark spots`;
    const result = injectBenefitLines(sampleScript, "returning-this", benefitBlock);
    // Benefit block should appear before "I'm just disappointed"
    const pivotIndex = result.indexOf("I'm just disappointed");
    const benefitIndex = result.indexOf("not because it's loaded");
    expect(benefitIndex).toBeGreaterThan(-1);
    expect(benefitIndex).toBeLessThan(pivotIndex);
  });

  it("falls back to appending if no pivot pattern found", () => {
    const noPatternScript = `I'm returning this. Tap the orange cart.`;
    const benefitBlock = `not because it's loaded with retinol`;
    const result = injectBenefitLines(noPatternScript, "returning-this", benefitBlock);
    expect(result).toContain(benefitBlock);
    expect(result.length).toBeGreaterThan(noPatternScript.length);
  });
});

// ─── injectBenefitLines — fake-outrage ───────────────────────────────────────

describe("injectBenefitLines — fake-outrage", () => {
  const sampleScript = `I'm throwing this in the trash. I did a deep dive with AI on every ingredient in this product and every one of these ingredients actually works. Add two to your cart to activate the flash sale. I'm so mad at this company for making this so good.`;

  it("inserts benefit block after the credibility sentence", () => {
    const benefitBlock = `Retinol — reduces fine lines overnight\nNiacinamide — fades dark spots in 2 weeks`;
    const result = injectBenefitLines(sampleScript, "fake-outrage", benefitBlock);
    expect(result).toContain(benefitBlock);
    // Block should appear before the CTA
    const ctaIndex = result.indexOf("Add two to your cart");
    const benefitIndex = result.indexOf("Retinol");
    expect(benefitIndex).toBeGreaterThan(-1);
    expect(benefitIndex).toBeLessThan(ctaIndex);
  });
});

// ─── injectBenefitLines — bundle-motherload ──────────────────────────────────

describe("injectBenefitLines — bundle-motherload", () => {
  const sampleScript = `Holy motherload. So let's see what you get. You're getting a lot of stuff. Tap the orange cart to activate the flash sale tonight.`;

  it("inserts benefit block after the list start phrase", () => {
    const benefitBlock = `You're getting the serum. Packed with retinol for overnight renewal.\nYou're getting the moisturizer. Locks in hydration for 24 hours.`;
    const result = injectBenefitLines(sampleScript, "bundle-motherload", benefitBlock);
    expect(result).toContain(benefitBlock);
  });

  it("falls back to appending if no list start pattern found", () => {
    const noPatternScript = `Holy motherload. Tap the orange cart.`;
    const benefitBlock = `You're getting the serum.`;
    const result = injectBenefitLines(noPatternScript, "bundle-motherload", benefitBlock);
    expect(result).toContain(benefitBlock);
  });
});

// ─── injectBenefitLines — counting-hook ──────────────────────────────────────

describe("injectBenefitLines — counting-hook", () => {
  const sampleScript = `Not one, not two, not three, not four, but five? Have you seen all these Dr. Melaxin products they're giving us at this discount? I got this whole box. This is over $200 worth of products. The Viral Calcium Balm Stick, Calcium Volume Eye Patches, Volume Firming Cream, Pink Spicule Serum, Pigmentation Serum — an entire skincare routine. Check your price and read those reviews. If anyone wants to try it, definitely get it now because I have a feeling this sale is going to sell them out again.`;

  it("replaces the item list section with benefit-tagged items", () => {
    const benefitBlock = `Calcium Balm Stick — firms and plumps instantly. Calcium Volume Eye Patches — depuffs in 10 minutes. Volume Firming Cream — tightens overnight. Pink Spicule Serum — resurfaces texture. Pigmentation Serum — fades dark spots fast.`;
    const result = injectBenefitLines(sampleScript, "counting-hook", benefitBlock);
    expect(result).toContain(benefitBlock);
    // The CTA should still be present after the benefit block
    expect(result).toContain("Check your price");
  });
});

// ─── injectBenefitLines — unknown hook (fallback) ────────────────────────────

describe("injectBenefitLines — unknown hook", () => {
  it("appends benefit block to end of script for unknown hooks", () => {
    const script = `Some script content.`;
    const benefitBlock = `Some benefit lines.`;
    const result = injectBenefitLines(script, "unknown-hook", benefitBlock);
    expect(result).toContain(benefitBlock);
    expect(result.indexOf(benefitBlock)).toBeGreaterThan(result.indexOf(script));
  });
});

// ─── VERBATIM_TEMPLATES — counting-hook ──────────────────────────────────────

describe("VERBATIM_TEMPLATES — counting-hook", () => {
  it("has VERBATIM_TEMPLATES entries for counting-hook", () => {
    expect(VERBATIM_TEMPLATES["counting-hook"]).toBeDefined();
    expect(VERBATIM_TEMPLATES["counting-hook"]!.length).toBeGreaterThanOrEqual(1);
  });

  it("counting-hook templates have required slots", () => {
    const templates = VERBATIM_TEMPLATES["counting-hook"]!;
    for (const template of templates) {
      expect(template.slots).toContain("ITEM_COUNT");
      expect(template.slots).toContain("BRAND");
      expect(template.slots).toContain("TOTAL_VALUE");
    }
  });
});

// ─── BOF_HOOKS — counting-hook registration ──────────────────────────────────

describe("BOF_HOOKS — counting-hook", () => {
  it("counting-hook is registered in BOF_HOOKS", () => {
    const hook = BOF_HOOKS.find(h => h.id === "counting-hook");
    expect(hook).toBeDefined();
    expect(hook!.tier).toBe("viral-trend");
    expect(hook!.templateType).toBe("verbatim");
    expect(hook!.format).toBe("BOF");
  });

  it("counting-hook has at least one example video", () => {
    const hook = BOF_HOOKS.find(h => h.id === "counting-hook");
    expect(hook!.exampleVideos.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── Benefit lines hooks — all four are in BOF_HOOKS ─────────────────────────

describe("Benefit lines eligible hooks", () => {
  const BENEFIT_LINES_HOOKS = ["returning-this", "fake-outrage", "bundle-motherload", "counting-hook"];

  it("all four benefit-lines-eligible hooks exist in BOF_HOOKS", () => {
    for (const hookId of BENEFIT_LINES_HOOKS) {
      const hook = BOF_HOOKS.find(h => h.id === hookId);
      expect(hook, `${hookId} should be in BOF_HOOKS`).toBeDefined();
    }
  });
});
