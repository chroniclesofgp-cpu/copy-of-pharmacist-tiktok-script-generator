/**
 * Product Vetting Router
 * - vetting.analyze: LLM-powered ingredient/product analysis
 * - vault.save / list / update / delete: Product Vault CRUD
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getVaultByUserId, saveToVault, updateVaultItem, deleteVaultItem } from "../db";

// ─── Vetting Analysis ─────────────────────────────────────────────────────────

const VettingResultSchema = z.object({
  verdict: z.enum(["promote", "caution", "avoid"]),
  verdictSummary: z.string(),
  ingredientsAnalysis: z.array(z.object({
    ingredient: z.string(),
    status: z.enum(["evidence-based", "fairy-dusted", "unsupported", "beneficial"]),
    note: z.string(),
  })),
  doseFlags: z.array(z.string()),
  redFlags: z.array(z.string()),
  betterAlternatives: z.array(z.string()),
  talkingPoints: z.array(z.string()),
  hookRecommendations: z.array(z.object({
    hookId: z.string(),
    rationale: z.string(),
  })).min(1).max(3),
});

export type VettingResult = z.infer<typeof VettingResultSchema>;

export const vettingRouter = router({
  analyze: protectedProcedure
    .input(z.object({
      productName: z.string().min(1),
      productUrl: z.string().optional(),
      ingredientList: z.string().optional(),
      category: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { productName, productUrl, ingredientList, category } = input;

      const contextLines: string[] = [
        `Product Name: ${productName}`,
      ];
      if (category) contextLines.push(`Category: ${category}`);
      if (productUrl) contextLines.push(`TikTok Shop URL: ${productUrl}`);
      if (ingredientList) contextLines.push(`Ingredient List / Supplement Facts:\n${ingredientList}`);

      const systemPrompt = `You are a clinical pharmacist with 15+ years of experience evaluating supplements, OTC products, and health devices for patient recommendations. You are also a TikTok creator who promotes health products and cares deeply about your professional credibility.

Your job is to evaluate a product and return a structured JSON verdict that helps the creator decide whether to promote it, promote it with caveats, or avoid it entirely.

Be honest, evidence-based, and practical. Your reputation depends on only promoting products you can genuinely stand behind.

VERDICT DEFINITIONS:
- "promote": You would confidently recommend this to a patient. Ingredients are evidence-based, doses are therapeutic, no major red flags.
- "caution": The product has merit but has issues (underdosed ingredients, aggressive marketing claims, inferior forms, or better alternatives exist). You can promote it but must be transparent about the caveats.
- "avoid": The product is misleading, uses unsupported ingredients, is dangerously underdosed, or makes false claims. Do not promote.

INGREDIENT STATUS DEFINITIONS:
- "evidence-based": Peer-reviewed research supports this ingredient at this dose for the claimed benefit.
- "beneficial": Ingredient is generally beneficial but evidence for the specific claim is limited or mixed.
- "fairy-dusted": Ingredient is real but the dose is too low to have any clinical effect (common cost-cutting tactic).
- "unsupported": No credible evidence supports this ingredient for the claimed benefit.

HOOK RECOMMENDATIONS — choose 2 to 3 hooks that best fit this product, ranked from best to third-best fit. Choose from this list:
after-1-month, suppressed-knowledge, instruction-correction, symptom-checklist, trend-or-trash, dosing-authority, age-reversal, comparison-upgrade, warning-signs, pill-bottle-alternative, storytime, myth-busting, number-list, before-after

Return ONLY valid JSON matching the schema. No markdown, no explanation outside the JSON.`;

      const userPrompt = `Evaluate this product for a pharmacist TikTok creator:\n\n${contextLines.join('\n')}\n\nReturn a JSON object with these exact fields:
{
  "verdict": "promote" | "caution" | "avoid",
  "verdictSummary": "2-3 sentence plain-English summary of your verdict",
  "ingredientsAnalysis": [{ "ingredient": string, "status": "evidence-based"|"fairy-dusted"|"unsupported"|"beneficial", "note": string }],
  "doseFlags": ["string describing any dose issues"],
  "redFlags": ["string describing any red flags"],
  "betterAlternatives": ["string naming better alternatives if any"],
  "talkingPoints": ["2-4 honest things the pharmacist can say about this product on camera"],
  "hookRecommendations": [
    { "hookId": "best-hook-id", "rationale": "1 sentence why this is the best fit" },
    { "hookId": "second-hook-id", "rationale": "1 sentence why this is the second best fit" },
    { "hookId": "third-hook-id", "rationale": "1 sentence why this is the third best fit" }
  ]
}`;

      let raw: string;
      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "vetting_result",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  verdict: { type: "string", enum: ["promote", "caution", "avoid"] },
                  verdictSummary: { type: "string" },
                  ingredientsAnalysis: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        ingredient: { type: "string" },
                        status: { type: "string", enum: ["evidence-based", "fairy-dusted", "unsupported", "beneficial"] },
                        note: { type: "string" },
                      },
                      required: ["ingredient", "status", "note"],
                      additionalProperties: false,
                    },
                  },
                  doseFlags: { type: "array", items: { type: "string" } },
                  redFlags: { type: "array", items: { type: "string" } },
                  betterAlternatives: { type: "array", items: { type: "string" } },
                  talkingPoints: { type: "array", items: { type: "string" } },
                  hookRecommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        hookId: { type: "string" },
                        rationale: { type: "string" },
                      },
                      required: ["hookId", "rationale"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["verdict", "verdictSummary", "ingredientsAnalysis", "doseFlags", "redFlags", "betterAlternatives", "talkingPoints", "hookRecommendations"],
                additionalProperties: false,
              },
            },
          },
        });

        raw = response.choices[0].message.content as string;
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "LLM analysis failed. Please try again." });
      }

      let parsed: VettingResult;
      try {
        parsed = VettingResultSchema.parse(JSON.parse(raw));
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to parse analysis result. Please try again." });
      }

      return parsed;
    }),

  // ─── Vault CRUD ─────────────────────────────────────────────────────────────

  saveToVault: protectedProcedure
    .input(z.object({
      productName: z.string().min(1),
      productUrl: z.string().optional(),
      category: z.string().optional(),
      verdict: z.enum(["promote", "caution", "avoid"]),
      ingredientsAnalysis: z.string().optional(),
      doseFlags: z.string().optional(),
      redFlags: z.string().optional(),
      betterAlternatives: z.string().optional(),
      talkingPoints: z.string().optional(),
      hookRecommendation: z.string().optional(), // JSON array of {hookId, rationale} objects
      affiliateLink: z.string().optional(),
      userNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      await saveToVault({ ...input, userId });
      return { success: true };
    }),

  listVault: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user!.id;
      return getVaultByUserId(userId);
    }),

  updateVaultItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      affiliateLink: z.string().optional(),
      userNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      const { id, ...data } = input;
      await updateVaultItem(id, userId, data);
      return { success: true };
    }),

  deleteVaultItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      await deleteVaultItem(input.id, userId);
      return { success: true };
    }),

  // Save generated script research facts back to the vault item as a ScriptBrief
  saveScriptBrief: protectedProcedure
    .input(z.object({
      vaultItemId: z.number(),
      scriptBrief: z.object({
        mechanism: z.string(),
        gap: z.string(),
        differentiator: z.string(),
        dosingFacts: z.string(),
        citations: z.array(z.object({
          claim: z.string(),
          source: z.string(),
          year: z.number(),
          pmid: z.string().optional(),
          doi: z.string().optional(),
          url: z.string().optional(),
          confidence: z.enum(['high', 'medium', 'low']),
        })),
        generatedAt: z.number(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      await updateVaultItem(input.vaultItemId, userId, {
        scriptBrief: JSON.stringify(input.scriptBrief),
      });
      return { success: true };
    }),
});
