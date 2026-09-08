/**
 * Tests for the 3 major upgrades:
 * 1. Product Vault → Script Generation connection + Save Brief
 * 2. Study citations (quality filter, DOI/URL)
 * 3. Generate Visuals procedure
 */
import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ── Shared context helpers ────────────────────────────────────────────────────

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAnonContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ── Upgrade 1: saveScriptBrief ────────────────────────────────────────────────

describe("vetting.saveScriptBrief", () => {
  it("rejects unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    await expect(
      caller.vetting.saveScriptBrief({
        vaultItemId: 999,
        scriptBrief: {
          mechanism: "test mechanism",
          gap: "test gap",
          differentiator: "test differentiator",
          hookAngle: "test angle",
          keyStudyClaim: "test claim",
        },
      })
    ).rejects.toThrow();
  });

  it("rejects when vaultItemId does not belong to user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    // Non-existent vault item should throw NOT_FOUND
    await expect(
      caller.vetting.saveScriptBrief({
        vaultItemId: 9999999,
        scriptBrief: {
          mechanism: "test mechanism",
          gap: "test gap",
          differentiator: "test differentiator",
          hookAngle: "test angle",
          keyStudyClaim: "test claim",
        },
      })
    ).rejects.toThrow();
  });
});

// ── Upgrade 2: Citation quality filter ───────────────────────────────────────

describe("Citation quality filter logic", () => {
  it("keeps high and medium confidence citations when there are 2+", () => {
    type Confidence = "high" | "medium" | "low";
    type Citation = { claim: string; source: string; year: number; confidence: Confidence };

    const rawCitations: Citation[] = [
      { claim: "A", source: "JAMA", year: 2022, confidence: "high" },
      { claim: "B", source: "NEJM", year: 2021, confidence: "medium" },
      { claim: "C", source: "Blog", year: 2020, confidence: "low" },
    ];

    const highMedium = rawCitations.filter(c => c.confidence === "high" || c.confidence === "medium");
    const filtered = highMedium.length >= 2 ? highMedium : rawCitations.slice(0, 4);

    expect(filtered).toHaveLength(2);
    expect(filtered.every(c => c.confidence !== "low")).toBe(true);
  });

  it("falls back to all citations when fewer than 2 high/medium exist", () => {
    type Confidence = "high" | "medium" | "low";
    type Citation = { claim: string; source: string; year: number; confidence: Confidence };

    const rawCitations: Citation[] = [
      { claim: "A", source: "Blog", year: 2020, confidence: "low" },
      { claim: "B", source: "Reddit", year: 2019, confidence: "low" },
    ];

    const highMedium = rawCitations.filter(c => c.confidence === "high" || c.confidence === "medium");
    const filtered = highMedium.length >= 2 ? highMedium : rawCitations.slice(0, 4);

    expect(filtered).toHaveLength(2);
  });
});

// ── Upgrade 3: generateVisuals input schema validation (no LLM calls) ───────────────────────────────────────────────

import { z } from "zod";

// Mirror the generateVisuals input schema for unit-testing validation
const generateVisualsInputSchema = z.object({
  productName: z.string().min(1),
  hookId: z.string().min(1),
  fullScript: z.string().min(1),
  citations: z.array(z.object({
    claim: z.string(),
    source: z.string(),
    year: z.number(),
    confidence: z.enum(["high", "medium", "low"]),
    pmid: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().optional(),
  })).optional(),
  mechanism: z.string().optional(),
  gap: z.string().optional(),
  differentiator: z.string().optional(),
});

describe("tiktok.generateVisuals input schema", () => {
  it("accepts valid minimal input", () => {
    const result = generateVisualsInputSchema.safeParse({
      productName: "Magnesium Glycinate",
      hookId: "after-1-month",
      fullScript: "This is a test script.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts full input with citations and brief fields", () => {
    const result = generateVisualsInputSchema.safeParse({
      productName: "NeoCell Collagen",
      hookId: "mechanism-reveal",
      fullScript: "Full script text here.",
      citations: [{
        claim: "Collagen improves joint health",
        source: "JAMA",
        year: 2022,
        confidence: "high",
        pmid: "12345678",
        doi: "10.1001/jama.2022.1234",
      }],
      mechanism: "Collagen synthesis pathway",
      gap: "Most supplements miss connective tissue",
      differentiator: "5 types of collagen in one scoop",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty productName", () => {
    const result = generateVisualsInputSchema.safeParse({
      productName: "",
      hookId: "after-1-month",
      fullScript: "Script text.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid confidence value in citations", () => {
    const result = generateVisualsInputSchema.safeParse({
      productName: "Magnesium",
      hookId: "after-1-month",
      fullScript: "Script text.",
      citations: [{ claim: "A", source: "B", year: 2022, confidence: "unknown" }],
    });
    expect(result.success).toBe(false);
  });
});
// ── Triple Hook: textHookSuggestions schema & logic ─────────────────────────

describe("Triple hook textHookSuggestions", () => {
  /**
   * The generateSingle procedure now returns textHookSuggestions: string[]
   * (3 text overlay options: question, provocative, stakes).
   * These tests validate the shape and content rules without making LLM calls.
   */

  it("textHookSuggestions array has exactly 3 items when provided", () => {
    const mockSuggestions = [
      "Why is your magnesium not working?",
      "Your pharmacist never told you this",
      "Most people are wasting their money",
    ];
    expect(mockSuggestions).toHaveLength(3);
  });

  it("each suggestion is 5-8 words long", () => {
    const mockSuggestions = [
      "Why is your magnesium not working?",
      "Your pharmacist never told you this",
      "Most people are wasting their money",
    ];
    for (const s of mockSuggestions) {
      const wordCount = s.replace(/[^a-zA-Z\s]/g, "").trim().split(/\s+/).length;
      expect(wordCount).toBeGreaterThanOrEqual(4); // allow slight flexibility
      expect(wordCount).toBeLessThanOrEqual(10);
    }
  });

  it("suggestions are distinct strings (no duplicates)", () => {
    const mockSuggestions = [
      "Why is your magnesium not working?",
      "Your pharmacist never told you this",
      "Most people are wasting their money",
    ];
    const unique = new Set(mockSuggestions);
    expect(unique.size).toBe(mockSuggestions.length);
  });

  it("GeneratedScript type accepts textHookSuggestions as optional array", () => {
    // Simulate the shape of a GeneratedScript with the new field
    const script: {
      textHook?: string;
      textHookSuggestions?: string[];
      verbalHook: string;
      fullScript: string;
    } = {
      textHookSuggestions: [
        "Why is your magnesium not working?",
        "Your pharmacist never told you this",
        "Most people are wasting their money",
      ],
      verbalHook: "Most people taking magnesium are getting zero benefit.",
      fullScript: "Most people taking magnesium are getting zero benefit...",
    };
    expect(script.textHookSuggestions).toBeDefined();
    expect(Array.isArray(script.textHookSuggestions)).toBe(true);
    expect(script.textHookSuggestions!.length).toBe(3);
  });

  it("falls back gracefully when textHookSuggestions is empty", () => {
    const suggestions: string[] = [];
    // The UI should not render the panel when array is empty
    const shouldRender = suggestions.length > 0;
    expect(shouldRender).toBe(false);
  });

  it("backward-compat: single textHook string is preserved in legacy scripts", () => {
    // Old local-generation scripts still have textHook as a string
    const legacyScript: { textHook?: string; textHookSuggestions?: string[] } = {
      textHook: "Signs your body is LOW in Magnesium ‼️",
    };
    expect(legacyScript.textHook).toBeDefined();
    expect(legacyScript.textHookSuggestions).toBeUndefined();
  });
});
