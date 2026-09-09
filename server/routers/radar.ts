import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { radarCandidates, radarDailySales, radarImports, radarProfiles } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";
import { calculateRadarMetrics, campaignHandoffAllowed, DEFAULT_RADAR_PROFILE, parseRadarCsv, suggestedReviewStatus, type RadarProfileConfig } from "../radar";

const profileSchema = z.object({
  minTotalSales: z.number().nonnegative(), maxTotalSales: z.number().positive(), matureAgeDays: z.number().positive(), veryNewAgeDays: z.number().positive(), matureWindowDays: z.number().positive(), newWindowDays: z.number().positive(), accelerationStartingPct: z.number().nonnegative(), accelerationClearPct: z.number().nonnegative(), accelerationStrongPct: z.number().nonnegative(), stableDaysRequired: z.number().int().positive(), stableVariancePct: z.number().nonnegative(), strongDayUnits: z.number().nonnegative(), strongDaysMinimum: z.number().int().nonnegative(), latestDayAccelerationMultiplier: z.number().positive(), videoSharePreferredPct: z.number().nonnegative(), videoShareMinimumPct: z.number().nonnegative(), topVideoSpreadMaxPct: z.number().nonnegative(), topVideoWatchMaxPct: z.number().nonnegative(), ratingMinimum: z.number().nonnegative(), commissionAfterAdsMinimumPct: z.number().nonnegative(),
});

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

const getEffectiveUserId = (ctx: any): number => ctx.user?.id ?? 1;

export const radarRouter = router({
  getProfile: publicProcedure.query(async ({ ctx }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) return { name: "Default profile", config: DEFAULT_RADAR_PROFILE };
    const row = await db.select().from(radarProfiles).where(eq(radarProfiles.userId, userId)).orderBy(desc(radarProfiles.updatedAt)).limit(1);
    return row[0] ? { name: row[0].name, config: parseJson<RadarProfileConfig>(row[0].configJson, DEFAULT_RADAR_PROFILE) } : { name: "Default profile", config: DEFAULT_RADAR_PROFILE };
  }),
  saveProfile: publicProcedure.input(z.object({ name: z.string().min(1).max(120), config: profileSchema })).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.insert(radarProfiles).values({ userId, name: input.name, configJson: JSON.stringify(input.config) });
    return { success: true };
  }),
  listCandidates: publicProcedure.query(async ({ ctx }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(radarCandidates).where(eq(radarCandidates.userId, userId)).orderBy(desc(radarCandidates.updatedAt));
    return rows.map((row) => ({ ...row, rawData: parseJson(row.rawDataJson, {}), metrics: parseJson(row.metricsJson, {}), creatorFit: parseJson(row.creatorFitJson, {}), aiBrief: parseJson(row.aiBriefJson, null) }));
  }),
  importCsv: publicProcedure.input(z.object({ provider: z.string().min(1).max(40), fileName: z.string().min(1).max(255), csv: z.string().min(1), profile: profileSchema.optional() })).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const parsed = parseRadarCsv(input.csv);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const [importRow] = await db.insert(radarImports).values({ userId, provider: input.provider, fileName: input.fileName, rowCount: parsed.rows.length + parsed.errors.length, validRowCount: parsed.rows.length, errorJson: parsed.errors.length ? JSON.stringify(parsed.errors) : null }).$returningId();
    const importId = importRow.id;
    const profile = input.profile ?? DEFAULT_RADAR_PROFILE;
    const created: number[] = [];
    for (const raw of parsed.rows) {
      const metrics = calculateRadarMetrics(raw, profile);
      const [candidate] = await db.insert(radarCandidates).values({ userId, importId, provider: raw.provider || input.provider, externalProductId: raw.externalProductId ?? null, productName: raw.productName, category: raw.category ?? null, productUrl: raw.productUrl ?? null, productAgeDays: raw.productAgeDays ?? null, rawDataJson: JSON.stringify(raw), metricsJson: JSON.stringify(metrics), confidenceNotes: metrics.confidenceNotes.join(" "), creatorFitJson: JSON.stringify({ mechanismCredibility: "", audienceRelevance: "", availableFootage: "", evidenceSupport: "", notes: "" }), reviewStatus: suggestedReviewStatus(metrics), handoffStatus: "not_ready", evidenceGateStatus: "not_reviewed" }).$returningId();
      created.push(candidate.id);
      if (raw.dailySales.length) await db.insert(radarDailySales).values(raw.dailySales.map((sale) => ({ candidateId: candidate.id, salesDate: sale.date, units: sale.units, rawDataJson: JSON.stringify(sale) })));
    }
    return { importId, createdCandidateIds: created, errors: parsed.errors, validRows: parsed.rows.length };
  }),
  updateReview: publicProcedure.input(z.object({ id: z.number(), reviewStatus: z.enum(["candidate", "watchlist", "human_review", "avoid", "approved_for_campaign_planning"]), evidenceGateStatus: z.enum(["not_reviewed", "needs_product_intel", "blocked", "approved"]), reviewNotes: z.string().optional(), creatorFit: z.record(z.string(), z.string()).optional() })).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const rows = await db.select().from(radarCandidates).where(and(eq(radarCandidates.id, input.id), eq(radarCandidates.userId, userId))).limit(1);
    if (!rows[0]) throw new Error("Candidate not found");
    const handoffStatus = input.reviewStatus === "approved_for_campaign_planning" && input.evidenceGateStatus === "approved" ? "ready_for_campaign_planning" : "not_ready";
    await db.update(radarCandidates).set({ reviewStatus: input.reviewStatus, evidenceGateStatus: input.evidenceGateStatus, handoffStatus, reviewNotes: input.reviewNotes ?? null, creatorFitJson: input.creatorFit ? JSON.stringify(input.creatorFit) : rows[0].creatorFitJson }).where(and(eq(radarCandidates.id, input.id), eq(radarCandidates.userId, userId)));
    return { success: true, handoffStatus };
  }),
  saveAiBrief: publicProcedure.input(z.object({ id: z.number(), brief: z.record(z.string(), z.unknown()) })).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.update(radarCandidates).set({ aiBriefJson: JSON.stringify({ source: "ai_assisted", ...input.brief }) }).where(and(eq(radarCandidates.id, input.id), eq(radarCandidates.userId, userId)));
    return { success: true };
  }),
  handoffToCampaign: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const rows = await db.select().from(radarCandidates).where(and(eq(radarCandidates.id, input.id), eq(radarCandidates.userId, userId))).limit(1);
    const candidate = rows[0];
    if (!candidate) throw new Error("Candidate not found");
    if (!campaignHandoffAllowed(candidate.reviewStatus as any, candidate.evidenceGateStatus)) throw new Error("Evidence/compliance gate is not approved. Campaign handoff is blocked.");
    await db.update(radarCandidates).set({ handoffStatus: "handed_off_to_campaign_planning" }).where(and(eq(radarCandidates.id, input.id), eq(radarCandidates.userId, userId)));
    return { success: true, handoffStatus: "handed_off_to_campaign_planning" };
  }),
});
