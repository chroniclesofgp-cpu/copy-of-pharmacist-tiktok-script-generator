import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createProduct,
  deleteProduct,
  deleteSavedScript,
  getProductsByUserId,
  getSavedScriptsByUserId,
  saveScript,
  updateProduct,
  updateScriptNotes,
} from "../db";

// ─── Product Library Router ───────────────────────────────────────────────────

export const productsRouter = router({
  // Get all products for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return getProductsByUserId(ctx.user.id);
  }),

  // Create a new product
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        keyBenefit: z.string().max(500).optional(),
        category: z.string().max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await createProduct({
        userId: ctx.user.id,
        name: input.name,
        description: input.description ?? null,
        keyBenefit: input.keyBenefit ?? null,
        category: input.category ?? null,
      });
      return { success: true };
    }),

  // Update an existing product
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        keyBenefit: z.string().max(500).optional(),
        category: z.string().max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updateProduct(id, ctx.user.id, data);
      return { success: true };
    }),

  // Delete a product
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteProduct(input.id, ctx.user.id);
      return { success: true };
    }),
});

// ─── Saved Scripts Router ─────────────────────────────────────────────────────

export const savedScriptsRouter = router({
  // Get all saved scripts for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return getSavedScriptsByUserId(ctx.user.id);
  }),

  // Save a script
  save: protectedProcedure
    .input(
      z.object({
        productId: z.number().optional(),
        productName: z.string().min(1).max(255),
        hookId: z.string().min(1).max(100),
        hookName: z.string().min(1).max(255),
        fullScript: z.string().min(1),
        textHook: z.string().optional(),
        verbalHook: z.string().optional(),
        dealReveal: z.string().optional(),
        howTo: z.string().optional(),
        urgencyClose: z.string().optional(),
        creatorVoice: z.string().max(50).optional(),
        format: z.string().max(50).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await saveScript({
        userId: ctx.user.id,
        productId: input.productId ?? null,
        productName: input.productName,
        hookId: input.hookId,
        hookName: input.hookName,
        fullScript: input.fullScript,
        textHook: input.textHook ?? null,
        verbalHook: input.verbalHook ?? null,
        dealReveal: input.dealReveal ?? null,
        howTo: input.howTo ?? null,
        urgencyClose: input.urgencyClose ?? null,
        creatorVoice: input.creatorVoice ?? "hybrid",
        format: input.format ?? null,
        notes: input.notes ?? null,
      });
      return { success: true };
    }),

  // Update notes on a saved script
  updateNotes: protectedProcedure
    .input(z.object({ id: z.number(), notes: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await updateScriptNotes(input.id, ctx.user.id, input.notes);
      return { success: true };
    }),

  // Delete a saved script
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteSavedScript(input.id, ctx.user.id);
      return { success: true };
    }),
});
