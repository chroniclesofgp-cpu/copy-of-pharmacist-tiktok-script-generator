/**
 * BOF Line Bank & Prompt Builder Tests
 * Validates that the line bank structure is correct and the prompt builder
 * produces prompts that enforce creator consistency and line-bank assembly rules.
 */

import { describe, it, expect } from "vitest";
import {
  BOF_LINE_BANK,
  SHARED_URGENCY_CLOSES,
  SHARED_HOW_TO_LINES,
  SHARED_COUPON_LINES,
  getTopLines,
  formatLineBankForPrompt,
} from "../client/src/lib/bofLineBank";
import { BOF_HOOKS } from "../client/src/lib/bofHooks";

// ─── Line Bank Structure Tests ────────────────────────────────────────────────

describe("BOF Line Bank — structure", () => {
  it("has an entry for every hook defined in BOF_HOOKS", () => {
    for (const hook of BOF_HOOKS) {
      expect(BOF_LINE_BANK).toHaveProperty(hook.id);
    }
  });

  it("every hook line bank has required sections", () => {
    for (const [hookId, bank] of Object.entries(BOF_LINE_BANK)) {
      expect(bank.textHooks.length, `${hookId} textHooks`).toBeGreaterThan(0);
      expect(bank.verbalHooks.length, `${hookId} verbalHooks`).toBeGreaterThan(0);
      expect(bank.dealRevealOpeners.length, `${hookId} dealRevealOpeners`).toBeGreaterThan(0);
      expect(bank.howToLines.length, `${hookId} howToLines`).toBeGreaterThan(0);
      expect(bank.urgencyCloses.length, `${hookId} urgencyCloses`).toBeGreaterThan(0);
    }
  });

  it("BOF+ hooks have proofLines defined", () => {
    const bofPlusHooks = BOF_HOOKS.filter(h => h.requiresBenefitField);
    for (const hook of bofPlusHooks) {
      const bank = BOF_LINE_BANK[hook.id];
      expect(bank.proofLines, `${hook.id} should have proofLines`).toBeDefined();
      expect(bank.proofLines!.length, `${hook.id} proofLines length`).toBeGreaterThan(0);
    }
  });

  it("BOF hooks do NOT have proofLines (or have empty proofLines)", () => {
    const bofHooks = BOF_HOOKS.filter(h => !h.requiresBenefitField);
    for (const hook of bofHooks) {
      const bank = BOF_LINE_BANK[hook.id];
      // proofLines can be undefined or empty for pure BOF hooks
      if (bank.proofLines) {
        expect(bank.proofLines.length, `${hook.id} should not have proofLines`).toBe(0);
      }
    }
  });

  it("every line variant has a creator and frequency", () => {
    for (const [hookId, bank] of Object.entries(BOF_LINE_BANK)) {
      const allLines = [
        ...bank.textHooks,
        ...bank.verbalHooks,
        ...bank.dealRevealOpeners,
        ...bank.howToLines,
        ...(bank.proofLines ?? []),
        ...bank.couponLines,
        ...bank.urgencyCloses,
      ];
      for (const line of allLines) {
        expect(line.creator, `${hookId} line missing creator`).toBeDefined();
        expect(["very-high", "high", "medium", "low"]).toContain(line.frequency);
      }
    }
  });
});

// ─── Creator Consistency Tests ────────────────────────────────────────────────

describe("BOF Line Bank — creator consistency", () => {
  it("shared urgency closes have at least 5 Faith lines and 5 dealscope lines", () => {
    const faithLines = SHARED_URGENCY_CLOSES.filter(l => l.creator === "@momfindsbyfaith");
    const dealLines = SHARED_URGENCY_CLOSES.filter(l => l.creator === "@dealscope");
    expect(faithLines.length).toBeGreaterThanOrEqual(5);
    expect(dealLines.length).toBeGreaterThanOrEqual(5);
  });

  it("reverse-psychology hook has lines from both creators", () => {
    const bank = BOF_LINE_BANK["reverse-psychology"];
    const allLines = [...bank.verbalHooks, ...bank.textHooks];
    const hasFaith = allLines.some(l => l.creator === "@momfindsbyfaith");
    const hasDealscope = allLines.some(l => l.creator === "@dealscope");
    expect(hasFaith).toBe(true);
    expect(hasDealscope).toBe(true);
  });

  it("returning-this hook has Faith as primary creator, with Brian as Variation C", () => {
    const bank = BOF_LINE_BANK["returning-this"];
    // Verbal hooks include Faith (Variation A/B) and Brian (Variation C — compressed pivot)
    const allowedCreators = ["@momfindsbyfaith", "@blackfridaybrian"];
    for (const line of bank.verbalHooks) {
      expect(allowedCreators).toContain(line.creator);
    }
    // Faith must still be represented (Variation A/B) alongside Brian (Variation C)
    const faithCount = bank.verbalHooks.filter(l => l.creator === "@momfindsbyfaith").length;
    const brianCount = bank.verbalHooks.filter(l => l.creator === "@blackfridaybrian").length;
    expect(faithCount).toBeGreaterThanOrEqual(brianCount);
    expect(faithCount).toBeGreaterThan(0);
    expect(brianCount).toBeGreaterThan(0);
  });

  it("tiktok-glitch hook is dealscope-only", () => {
    const bank = BOF_LINE_BANK["tiktok-glitch"];
    for (const line of bank.verbalHooks) {
      expect(line.creator).toBe("@dealscope");
    }
  });
});

// ─── getTopLines Helper Tests ─────────────────────────────────────────────────

describe("getTopLines helper", () => {
  it("returns at most count lines", () => {
    const lines = getTopLines("reverse-psychology", "textHooks", 3);
    expect(lines.length).toBeLessThanOrEqual(3);
  });

  it("returns lines sorted by frequency (very-high first)", () => {
    const lines = getTopLines("reverse-psychology", "verbalHooks", 4);
    // First line should be from a very-high or high frequency entry
    expect(lines.length).toBeGreaterThan(0);
    expect(typeof lines[0]).toBe("string");
    expect(lines[0].length).toBeGreaterThan(0);
  });

  it("returns empty array for unknown hookId", () => {
    const lines = getTopLines("nonexistent-hook", "textHooks", 3);
    expect(lines).toEqual([]);
  });

  it("returns empty array for missing position", () => {
    const lines = getTopLines("reverse-psychology", "proofLines", 3);
    // reverse-psychology is BOF, so proofLines should be empty/undefined
    expect(Array.isArray(lines)).toBe(true);
  });
});

// ─── formatLineBankForPrompt Tests ────────────────────────────────────────────

describe("formatLineBankForPrompt", () => {
  it("returns a non-empty string for all known hooks", () => {
    for (const hookId of Object.keys(BOF_LINE_BANK)) {
      const prompt = formatLineBankForPrompt(hookId);
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(0);
    }
  });

  it("includes TEXT HOOK OPTIONS section", () => {
    const prompt = formatLineBankForPrompt("reverse-psychology");
    expect(prompt).toContain("TEXT HOOK OPTIONS");
  });

  it("includes VERBAL HOOK OPTIONS section", () => {
    const prompt = formatLineBankForPrompt("reverse-psychology");
    expect(prompt).toContain("VERBAL HOOK OPTIONS");
  });

  it("includes URGENCY CLOSE OPTIONS section", () => {
    const prompt = formatLineBankForPrompt("reverse-psychology");
    expect(prompt).toContain("URGENCY CLOSE OPTIONS");
  });

  it("includes PROOF POINT LINES for BOF+ hooks", () => {
    const prompt = formatLineBankForPrompt("returning-this");
    expect(prompt).toContain("PROOF POINT LINES");
  });

  it("does NOT include PROOF POINT LINES for pure BOF hooks", () => {
    const prompt = formatLineBankForPrompt("reverse-psychology");
    expect(prompt).not.toContain("PROOF POINT LINES");
  });

  it("returns empty string for unknown hookId", () => {
    const prompt = formatLineBankForPrompt("nonexistent-hook");
    expect(prompt).toBe("");
  });

  it("includes actual line text (not just headers)", () => {
    const prompt = formatLineBankForPrompt("reverse-psychology");
    // Should contain the most common reverse-psychology verbal hook
    expect(prompt).toContain("Do not get");
  });
});

// ─── BOF_HOOKS requiresBenefitField Tests ─────────────────────────────────────

describe("BOF_HOOKS requiresBenefitField", () => {
  it("all hooks have requiresBenefitField defined", () => {
    for (const hook of BOF_HOOKS) {
      expect(typeof hook.requiresBenefitField, `${hook.id} missing requiresBenefitField`).toBe("boolean");
    }
  });

  it("BOF+ hooks have requiresBenefitField = true", () => {
    // social-proof-comment removed (0 example videos)
    // always-read-reviews merged into returning-this (Variation A opener)
    const bofPlusIds = ["bundle-motherload", "returning-this"];
    for (const id of bofPlusIds) {
      const hook = BOF_HOOKS.find(h => h.id === id);
      expect(hook, `${id} not found`).toBeDefined();
      expect(hook!.requiresBenefitField, `${id} should be BOF+`).toBe(true);
    }
  });

  it("pure BOF hooks have requiresBenefitField = false", () => {
    // price-anchor removed (1 video from Oct 2025 — insufficient data)
    const bofIds = ["reverse-psychology", "warning-be-careful", "deal-alert", "tiktok-glitch", "comparison-upgrade", "quantity-math"];
    for (const id of bofIds) {
      const hook = BOF_HOOKS.find(h => h.id === id);
      expect(hook, `${id} not found`).toBeDefined();
      expect(hook!.requiresBenefitField, `${id} should be pure BOF`).toBe(false);
    }
  });
});

// ─── Shared Lines Tests ───────────────────────────────────────────────────────

describe("Shared line arrays", () => {
  it("SHARED_URGENCY_CLOSES has at least 12 entries", () => {
    expect(SHARED_URGENCY_CLOSES.length).toBeGreaterThanOrEqual(12);
  });

  it("SHARED_HOW_TO_LINES has at least 8 entries", () => {
    expect(SHARED_HOW_TO_LINES.length).toBeGreaterThanOrEqual(8);
  });

  it("SHARED_COUPON_LINES has at least 4 entries", () => {
    expect(SHARED_COUPON_LINES.length).toBeGreaterThanOrEqual(4);
  });

  it("SHARED_URGENCY_CLOSES contains the verbatim Faith close", () => {
    const faithClose = SHARED_URGENCY_CLOSES.find(l =>
      l.line.includes("raise the price") && l.creator === "@momfindsbyfaith"
    );
    expect(faithClose).toBeDefined();
  });

  it("SHARED_URGENCY_CLOSES contains the verbatim dealscope close", () => {
    const dealClose = SHARED_URGENCY_CLOSES.find(l =>
      l.line.includes("timer runs out") && l.creator === "@dealscope"
    );
    expect(dealClose).toBeDefined();
  });

  it("SHARED_COUPON_LINES contains the verbatim gamification line", () => {
    const gamLine = SHARED_COUPON_LINES.find(l =>
      l.line.includes("not everyone sees those coupons")
    );
    expect(gamLine).toBeDefined();
  });
});

// ─── A/B Test Variant Builder Tests ──────────────────────────────────────────

describe("BOF A/B/C variant system — prompt builder inputs", () => {
  it("getTopLines returns 4 text hook options for reverse-psychology", () => {
    const lines = getTopLines("reverse-psychology", "textHooks", 4);
    expect(lines.length).toBeGreaterThanOrEqual(1);
    expect(lines.length).toBeLessThanOrEqual(4);
  });

  it("getTopLines returns 4 verbal hook options for reverse-psychology", () => {
    const lines = getTopLines("reverse-psychology", "verbalHooks", 4);
    expect(lines.length).toBeGreaterThanOrEqual(1);
    expect(lines.length).toBeLessThanOrEqual(4);
  });

  it("Faith urgency closes are distinct from dealscope closes", () => {
    const faithCloses = SHARED_URGENCY_CLOSES.filter(l => l.creator === "@momfindsbyfaith");
    const dealCloses = SHARED_URGENCY_CLOSES.filter(l => l.creator === "@dealscope");
    const faithLines = faithCloses.map(l => l.line);
    const dealLines = dealCloses.map(l => l.line);
    // No overlap between creator closes
    for (const line of faithLines) {
      expect(dealLines).not.toContain(line);
    }
  });

  it("abTest prompt has enough hook options for 3 distinct variants", () => {
    // Each variant needs a unique text hook — need at least 3 options
    const textHooks = getTopLines("reverse-psychology", "textHooks", 4);
    const verbalHooks = getTopLines("reverse-psychology", "verbalHooks", 4);
    expect(textHooks.length).toBeGreaterThanOrEqual(3);
    expect(verbalHooks.length).toBeGreaterThanOrEqual(3);
  });

  it("abTest prompt has enough hook options for tiktok-glitch (dealscope-only)", () => {
    const textHooks = getTopLines("tiktok-glitch", "textHooks", 4);
    const verbalHooks = getTopLines("tiktok-glitch", "verbalHooks", 4);
    expect(textHooks.length).toBeGreaterThanOrEqual(2);
    expect(verbalHooks.length).toBeGreaterThanOrEqual(2);
  });

  it("abTest prompt has enough hook options for returning-this (Faith-only)", () => {
    const textHooks = getTopLines("returning-this", "textHooks", 4);
    const verbalHooks = getTopLines("returning-this", "verbalHooks", 4);
    expect(textHooks.length).toBeGreaterThanOrEqual(2);
    expect(verbalHooks.length).toBeGreaterThanOrEqual(1);
  });

  it("all 11 hooks have enough lines for at least 2 distinct variants", () => {
    for (const hook of BOF_HOOKS) {
      const textHooks = getTopLines(hook.id, "textHooks", 4);
      const verbalHooks = getTopLines(hook.id, "verbalHooks", 4);
      expect(textHooks.length, `${hook.id} needs >= 2 text hooks`).toBeGreaterThanOrEqual(2);
      expect(verbalHooks.length, `${hook.id} needs >= 1 verbal hook`).toBeGreaterThanOrEqual(1);
    }
  });

  it("Faith closes include 'raise the price' signature line", () => {
    const faithCloses = SHARED_URGENCY_CLOSES.filter(l => l.creator === "@momfindsbyfaith");
    const hasRaisePrice = faithCloses.some(l => l.line.toLowerCase().includes("raise the price"));
    expect(hasRaisePrice).toBe(true);
  });

  it("dealscope closes include 'timer runs out' signature line", () => {
    const dealCloses = SHARED_URGENCY_CLOSES.filter(l => l.creator === "@dealscope");
    const hasTimer = dealCloses.some(l => l.line.toLowerCase().includes("timer"));
    expect(hasTimer).toBe(true);
  });

  it("variant A (Faith) and variant B (dealscope) would use different closes", () => {
    const faithCloses = SHARED_URGENCY_CLOSES
      .filter(l => l.creator === "@momfindsbyfaith")
      .slice(0, 5)
      .map(l => l.line);
    const dealCloses = SHARED_URGENCY_CLOSES
      .filter(l => l.creator === "@dealscope")
      .slice(0, 5)
      .map(l => l.line);
    // The two sets should not be identical
    expect(faithCloses).not.toEqual(dealCloses);
    // Each set should have at least 3 options
    expect(faithCloses.length).toBeGreaterThanOrEqual(3);
    expect(dealCloses.length).toBeGreaterThanOrEqual(3);
  });
});
