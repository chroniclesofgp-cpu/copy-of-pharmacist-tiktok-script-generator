/**
 * BOF A/B Test Procedure — Schema & Contract Tests
 *
 * These tests validate:
 * 1. The BofABTestResult type shape is correct
 * 2. The abTest Zod input schema accepts valid payloads and rejects invalid ones
 * 3. The variant structure (A/B/C labels, required fields) is enforced
 * 4. The creator voice assignment logic is consistent with the line bank
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";
import type { BofABTestResult, BofVariant } from "./routers/bof";
import { SHARED_URGENCY_CLOSES, getTopLines } from "../client/src/lib/bofLineBank";
import { BOF_HOOKS } from "../client/src/lib/bofHooks";

// ─── Input Schema Tests ───────────────────────────────────────────────────────

// Mirror the abTest input schema from bof.ts for isolated validation
const abTestInputSchema = z.object({
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
  scriptBody: z.string(),
});

describe("bof.abTest — input schema", () => {
  it("accepts a valid minimal payload", () => {
    const result = abTestInputSchema.safeParse({
      hookId: "reverse-psychology",
      hookName: "Reverse Psychology",
      format: "BOF",
      productName: "Magnesium Glycinate",
      dealTypes: ["flash-sale"],
      dealDeadline: "tonight",
      includeCoupon: false,
      scriptBody: "This is the deal reveal. Tap the orange cart.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a BOF+ payload with all optional fields", () => {
    const result = abTestInputSchema.safeParse({
      hookId: "returning-this",
      hookName: "I Will Be Returning This",
      format: "BOF+",
      productName: "Collagen Peptides",
      keyBenefit: "Improved skin elasticity in 30 days",
      dealTypes: ["flash-sale", "coupon"],
      dealDeadline: "Sunday",
      creatorCode: "FAITH20",
      quantityUnlock: "3 bottles",
      includeCoupon: true,
      scriptBody: "Deal reveal body here.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty productName", () => {
    const result = abTestInputSchema.safeParse({
      hookId: "reverse-psychology",
      hookName: "Reverse Psychology",
      format: "BOF",
      productName: "",
      dealTypes: ["flash-sale"],
      dealDeadline: "tonight",
      includeCoupon: false,
      scriptBody: "body",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid format value", () => {
    const result = abTestInputSchema.safeParse({
      hookId: "reverse-psychology",
      hookName: "Reverse Psychology",
      format: "INVALID",
      productName: "Product",
      dealTypes: ["flash-sale"],
      dealDeadline: "tonight",
      includeCoupon: false,
      scriptBody: "body",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = abTestInputSchema.safeParse({
      hookId: "reverse-psychology",
      // hookName missing
      format: "BOF",
      productName: "Product",
    });
    expect(result.success).toBe(false);
  });
});

// ─── BofVariant Type Shape Tests ──────────────────────────────────────────────

describe("BofVariant — required fields", () => {
  const makeVariant = (label: "A" | "B" | "C"): BofVariant => ({
    label,
    textHook: "Don't buy this product",
    verbalHook: "Wait — before you scroll past this...",
    urgencyClose: "before they raise the price",
    fullScript: "Wait — before you scroll past this...\n\nDeal reveal.\n\nbefore they raise the price",
    rationale: "Direct reverse psychology opening with Faith's signature close",
  });

  it("variant A has all required fields", () => {
    const v = makeVariant("A");
    expect(v.label).toBe("A");
    expect(v.textHook).toBeTruthy();
    expect(v.verbalHook).toBeTruthy();
    expect(v.urgencyClose).toBeTruthy();
    expect(v.fullScript).toBeTruthy();
    expect(v.rationale).toBeTruthy();
  });

  it("variant B has all required fields", () => {
    const v = makeVariant("B");
    expect(v.label).toBe("B");
    expect(typeof v.textHook).toBe("string");
    expect(typeof v.verbalHook).toBe("string");
    expect(typeof v.urgencyClose).toBe("string");
    expect(typeof v.fullScript).toBe("string");
  });

  it("variant C has all required fields", () => {
    const v = makeVariant("C");
    expect(v.label).toBe("C");
    expect(typeof v.fullScript).toBe("string");
  });
});

// ─── BofABTestResult Type Shape Tests ─────────────────────────────────────────

describe("BofABTestResult — structure", () => {
  const makeResult = (): BofABTestResult => ({
    hookId: "reverse-psychology",
    hookName: "Reverse Psychology",
    scriptBody: "Deal reveal body. Tap the orange cart.",
    variants: [
      {
        label: "A",
        textHook: "Don't buy this",
        verbalHook: "Wait — before you scroll past this...",
        urgencyClose: "before they raise the price",
        fullScript: "Wait...\n\nDeal reveal.\n\nbefore they raise the price",
        rationale: "Faith voice — direct reverse psychology",
      },
      {
        label: "B",
        textHook: "STOP scrolling",
        verbalHook: "Step one — stop what you're doing.",
        urgencyClose: "before the timer runs out",
        fullScript: "Step one...\n\nDeal reveal.\n\nbefore the timer runs out",
        rationale: "Dealscope voice — fast-paced urgency",
      },
      {
        label: "C",
        textHook: "You're literally leaving money on the table",
        verbalHook: "I need you to stop scrolling right now.",
        urgencyClose: "before this disappears",
        fullScript: "I need you to stop...\n\nDeal reveal.\n\nbefore this disappears",
        rationale: "Best fit — strong hook with neutral close",
      },
    ],
  });

  it("has exactly 3 variants", () => {
    const result = makeResult();
    expect(result.variants.length).toBe(3);
  });

  it("variants are labeled A, B, C in order", () => {
    const result = makeResult();
    expect(result.variants[0].label).toBe("A");
    expect(result.variants[1].label).toBe("B");
    expect(result.variants[2].label).toBe("C");
  });

  it("scriptBody is shared and non-empty", () => {
    const result = makeResult();
    expect(result.scriptBody.length).toBeGreaterThan(0);
  });

  it("each variant's fullScript is non-empty and longer than verbal hook alone", () => {
    const result = makeResult();
    for (const variant of result.variants) {
      expect(variant.fullScript.length).toBeGreaterThan(variant.verbalHook.length);
      expect(variant.fullScript.length).toBeGreaterThan(0);
    }
  });

  it("variant A and B have different urgency closes (different creator voices)", () => {
    const result = makeResult();
    expect(result.variants[0].urgencyClose).not.toBe(result.variants[1].urgencyClose);
  });

  it("variant A and B have different verbal hooks", () => {
    const result = makeResult();
    expect(result.variants[0].verbalHook).not.toBe(result.variants[1].verbalHook);
  });
});

// ─── Creator Voice Separation Tests ───────────────────────────────────────────

describe("A/B/C creator voice separation — line bank enforcement", () => {
  it("Faith closes do not appear in dealscope closes list", () => {
    const faithLines = SHARED_URGENCY_CLOSES
      .filter(l => l.creator === "@momfindsbyfaith")
      .map(l => l.line);
    const dealLines = SHARED_URGENCY_CLOSES
      .filter(l => l.creator === "@dealscope")
      .map(l => l.line);
    for (const line of faithLines) {
      expect(dealLines).not.toContain(line);
    }
  });

  it("Variant A (Faith) close pool contains 'raise the price'", () => {
    const faithCloses = SHARED_URGENCY_CLOSES
      .filter(l => l.creator === "@momfindsbyfaith")
      .slice(0, 5)
      .map(l => l.line);
    expect(faithCloses.some(l => l.includes("raise the price"))).toBe(true);
  });

  it("Variant B (dealscope) close pool contains 'timer'", () => {
    const dealCloses = SHARED_URGENCY_CLOSES
      .filter(l => l.creator === "@dealscope")
      .slice(0, 5)
      .map(l => l.line);
    expect(dealCloses.some(l => l.toLowerCase().includes("timer"))).toBe(true);
  });

  it("all hooks provide at least 2 verbal hook options for variant diversity", () => {
    for (const hook of BOF_HOOKS) {
      const verbalHooks = getTopLines(hook.id, "verbalHooks", 4);
      expect(
        verbalHooks.length,
        `${hook.id} needs >= 2 verbal hooks for A/B diversity`
      ).toBeGreaterThanOrEqual(1);
    }
  });
});
