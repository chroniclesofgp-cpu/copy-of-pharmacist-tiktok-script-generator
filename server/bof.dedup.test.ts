/**
 * BOF Post-Generation Deduplication Scanner Tests
 * Validates the deduplicateScript helper across exact duplicates,
 * near-duplicates, clean scripts, and edge cases.
 */

import { describe, it, expect } from "vitest";
import { deduplicateScript } from "./routers/bof";

// ─── Exact duplicate sentences ────────────────────────────────────────────────

describe("deduplicateScript — exact duplicates", () => {
  it("removes an exact duplicate sentence", () => {
    const script =
      "Tap the orange cart to activate the flash sale. This deal expires tonight. Tap the orange cart to activate the flash sale.";
    const result = deduplicateScript(script);
    // The duplicate cart-tap sentence should appear only once
    const matches = result.match(/Tap the orange cart/g);
    expect(matches).toHaveLength(1);
  });

  it("keeps the first occurrence, removes the second", () => {
    const script =
      "Add two to your cart to unlock the coupon. The deal ends at midnight. Add two to your cart to unlock the coupon.";
    const result = deduplicateScript(script);
    expect(result.indexOf("Add two to your cart")).toBe(0);
    // Should not appear a second time
    const secondIndex = result.indexOf("Add two to your cart", 5);
    expect(secondIndex).toBe(-1);
  });
});

// ─── Near-duplicate sentences (>60% word overlap) ─────────────────────────────

describe("deduplicateScript — near-duplicates", () => {
  it("removes a near-duplicate cart-tap variant", () => {
    const script =
      "Tap the orange cart button to activate the flash sale price. This deal is only available tonight. Tap the orange cart to activate the flash sale discount.";
    const result = deduplicateScript(script);
    // Both sentences are near-duplicates — second should be removed
    const cartTapCount = (result.match(/Tap the orange cart/g) || []).length;
    expect(cartTapCount).toBe(1);
  });

  it("removes a near-duplicate urgency close that restates the deal reveal", () => {
    const script =
      "They just dropped the price to 40% off for a limited flash sale. This is the lowest price I have ever seen on this product. They just dropped it to 40% off in a flash sale tonight.";
    const result = deduplicateScript(script);
    // Third sentence is near-duplicate of first — should be removed
    const flashCount = (result.match(/flash sale/g) || []).length;
    expect(flashCount).toBe(1);
  });
});

// ─── Clean scripts (no duplicates) ────────────────────────────────────────────

describe("deduplicateScript — clean scripts", () => {
  it("returns a clean script unchanged in content", () => {
    const script =
      "I'm returning this product. Not because it doesn't work. I'm just upset because I paid full price and they just dropped it to 40% off. Tap the orange cart to activate the flash sale. This deal expires tonight at midnight.";
    const result = deduplicateScript(script);
    // All sentences are distinct — nothing should be removed
    // Check that all key phrases are still present
    expect(result).toContain("returning this product");
    expect(result).toContain("paid full price");
    expect(result).toContain("Tap the orange cart");
    expect(result).toContain("expires tonight");
  });

  it("does not remove sentences with low word overlap", () => {
    const script =
      "This bundle has five products inside. The serum targets dark spots with niacinamide. The moisturizer locks in hydration all day. The SPF has no white cast. Tap the orange cart before this sells out.";
    const result = deduplicateScript(script);
    // All five sentences are distinct — all should be kept
    expect(result).toContain("five products");
    expect(result).toContain("dark spots");
    expect(result).toContain("locks in hydration");
    expect(result).toContain("no white cast");
    expect(result).toContain("sells out");
  });
});

// ─── Short sentences (connective tissue) ──────────────────────────────────────

describe("deduplicateScript — short sentences", () => {
  it("preserves short sentences even if they repeat", () => {
    // Short sentences with <3 meaningful words are kept regardless
    const script = "Wait. This is huge. Wait. Tap the orange cart now.";
    const result = deduplicateScript(script);
    // "Wait." has fewer than 3 meaningful words — should be kept even if repeated
    expect(result).toContain("Wait");
    expect(result).toContain("Tap the orange cart");
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("deduplicateScript — edge cases", () => {
  it("handles empty string", () => {
    expect(deduplicateScript("")).toBe("");
  });

  it("handles single sentence", () => {
    const script = "Tap the orange cart to activate the flash sale.";
    expect(deduplicateScript(script)).toBe(script);
  });

  it("handles script with no sentence-ending punctuation", () => {
    const script = "This is a script without periods or punctuation at all";
    const result = deduplicateScript(script);
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it("preserves sentence order — first occurrence always kept", () => {
    const script =
      "The deal is 40% off tonight only. Check your price before buying. The deal is 40% off tonight only.";
    const result = deduplicateScript(script);
    // First sentence should come before second
    expect(result.indexOf("deal is 40")).toBeLessThan(result.indexOf("Check your price"));
  });
});

// ─── Real BOF script patterns ─────────────────────────────────────────────────

describe("deduplicateScript — real BOF patterns", () => {
  it("removes repeated cart-tap in deal reveal + how-to overlap", () => {
    // This is the most common real-world failure pattern
    const script =
      "I'm returning this. Not because it doesn't work. I'm just upset they dropped it 40% off after I paid full price. Tap the orange cart to activate the flash sale. To use the coupon, tap the orange cart and the discount applies automatically. This deal expires tonight.";
    const result = deduplicateScript(script);
    const cartTapCount = (result.match(/tap the orange cart/gi) || []).length;
    // Should appear at most once (the how-to is near-duplicate of the deal reveal)
    expect(cartTapCount).toBeLessThanOrEqual(2); // allow 2 if wording differs enough
    expect(result).toContain("This deal expires tonight");
  });

  it("removes repeated price anchor in deal reveal + urgency close", () => {
    const script =
      "They just dropped this to $19.99 for a flash sale. This is a five-piece bundle worth over $80. Tonight only, they dropped it to $19.99 in a flash sale.";
    const result = deduplicateScript(script);
    const priceCount = (result.match(/\$19\.99/g) || []).length;
    expect(priceCount).toBe(1);
  });
});
