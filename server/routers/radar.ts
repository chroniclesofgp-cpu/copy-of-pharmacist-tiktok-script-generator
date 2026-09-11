import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { radarCandidates, radarDailySales, radarImports, radarProfiles } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";
import { calculateRadarMetrics, canArchiveRadarCandidate, campaignHandoffAllowed, DEFAULT_RADAR_PROFILE, isRadarCandidateOutsideProfile, parseRadarCsv, suggestedReviewStatus, determineDiscoveryPaging, type RadarProfileConfig } from "../radar";
import { PRESET_PROFILES } from "../radar";
import { defaultKalodataAdapter } from "../kalodata";

const profileSchema = z.object({
  minTotalSales: z.number().nonnegative(), maxTotalSales: z.number().positive(), matureAgeDays: z.number().positive(), veryNewAgeDays: z.number().positive(), matureWindowDays: z.number().positive(), newWindowDays: z.number().positive(), accelerationStartingPct: z.number().nonnegative(), accelerationClearPct: z.number().nonnegative(), accelerationStrongPct: z.number().nonnegative(), stableDaysRequired: z.number().int().positive(), stableVariancePct: z.number().nonnegative(), strongDayUnits: z.number().nonnegative(), strongDaysMinimum: z.number().int().nonnegative(), latestDayAccelerationMultiplier: z.number().positive(), videoSharePreferredPct: z.number().nonnegative(), videoShareMinimumPct: z.number().nonnegative(), topVideoSpreadMaxPct: z.number().nonnegative(), topVideoWatchMaxPct: z.number().nonnegative(), ratingMinimum: z.number().nonnegative(), commissionAfterAdsMinimumPct: z.number().nonnegative(), highCompetitionCreatorThreshold: z.number().int().nonnegative().default(300), videosOver1MViewsThreshold: z.number().int().nonnegative().default(1),
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
  getPresets: publicProcedure.query(async () => {
    return PRESET_PROFILES;
  }),
  listProfiles: publicProcedure.query(async ({ ctx }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(radarProfiles).where(eq(radarProfiles.userId, userId)).orderBy(desc(radarProfiles.updatedAt));
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      config: parseJson<RadarProfileConfig>(r.configJson, DEFAULT_RADAR_PROFILE),
      updatedAt: r.updatedAt,
    }));
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
    const rows = await db.select().from(radarCandidates).where(and(eq(radarCandidates.userId, userId), eq(radarCandidates.queueState, "active"))).orderBy(desc(radarCandidates.updatedAt));
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
      const [candidate] = await db.insert(radarCandidates).values({ userId, importId, provider: raw.provider || input.provider, externalProductId: raw.externalProductId ?? null, productName: raw.productName, category: raw.category ?? null, productUrl: raw.productUrl ?? null, productAgeDays: raw.productAgeDays ?? null, activeCreatorCount: raw.activeCreatorCount ?? null, videosOver1MViews: raw.videosOver1MViews ?? null, rawDataJson: JSON.stringify(raw), metricsJson: JSON.stringify(metrics), confidenceNotes: metrics.confidenceNotes.join(" "), creatorFitJson: JSON.stringify({ mechanismCredibility: "", audienceRelevance: "", availableFootage: "", evidenceSupport: "", notes: "" }), reviewStatus: suggestedReviewStatus(metrics), handoffStatus: "not_ready", evidenceGateStatus: "not_reviewed" }).$returningId();
      created.push(candidate.id);
      if (raw.dailySales.length) await db.insert(radarDailySales).values(raw.dailySales.map((sale) => ({ candidateId: candidate.id, salesDate: sale.date, units: sale.units, rawDataJson: JSON.stringify(sale) })));
    }
    return { importId, createdCandidateIds: created, errors: parsed.errors, validRows: parsed.rows.length };
  }),
  recalculateCandidatesWithProfile: publicProcedure.input(z.object({ profile: profileSchema })).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const rows = await db.select().from(radarCandidates).where(and(eq(radarCandidates.userId, userId), eq(radarCandidates.queueState, "active")));
    for (const c of rows) {
      const raw = parseJson<any>(c.rawDataJson, null);
      if (!raw) continue;
      const newMetrics = calculateRadarMetrics(raw, input.profile as RadarProfileConfig);
      const newStatus = suggestedReviewStatus(newMetrics);
      const canUpdateStatus = c.reviewStatus !== "approved_for_campaign_planning" && c.evidenceGateStatus !== "approved";
      await db.update(radarCandidates).set({
        metricsJson: JSON.stringify(newMetrics),
        confidenceNotes: newMetrics.confidenceNotes.join(" "),
        reviewStatus: canUpdateStatus ? newStatus : c.reviewStatus,
      }).where(eq(radarCandidates.id, c.id));
    }
    return { success: true, count: rows.length };
  }),
  reconcileQueue: publicProcedure.input(z.object({
    profile: profileSchema,
    action: z.enum(["preview", "archive"]).default("preview"),
  })).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const rows = await db.select().from(radarCandidates).where(and(eq(radarCandidates.userId, userId), eq(radarCandidates.queueState, "active")));
    const outOfProfile: Array<{ id: number; productName: string; totalSales: number; reason: string; protected: boolean }> = [];
    for (const candidate of rows) {
      const raw = parseJson<any>(candidate.rawDataJson, null);
      const evaluation = isRadarCandidateOutsideProfile(raw, input.profile as RadarProfileConfig);
      if (evaluation.outside) {
        const protectedCandidate = !canArchiveRadarCandidate(candidate);
        outOfProfile.push({ id: candidate.id, productName: candidate.productName, totalSales: evaluation.totalSales, reason: evaluation.reason, protected: protectedCandidate });
        if (input.action === "archive" && !protectedCandidate) {
          await db.update(radarCandidates).set({ queueState: "archived", queueReason: evaluation.reason, archivedAt: new Date() }).where(and(eq(radarCandidates.id, candidate.id), eq(radarCandidates.userId, userId)));
        }
      }
    }
    const archivedCount = input.action === "archive" ? outOfProfile.filter((candidate) => !candidate.protected).length : 0;
    return { success: true, action: input.action, outOfProfile, archivedCount, protectedCount: outOfProfile.filter((candidate) => candidate.protected).length };
  }),
  clearQueue: publicProcedure.input(z.object({
    onlyUnreviewed: z.boolean().default(true),
  }).optional()).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const rows = await db.select().from(radarCandidates).where(and(eq(radarCandidates.userId, userId), eq(radarCandidates.queueState, "active")));
    let archivedCount = 0;
    for (const c of rows) {
      const canArchive = input?.onlyUnreviewed !== false ? canArchiveRadarCandidate(c) : true;
      if (canArchive) {
        await db.update(radarCandidates).set({
          queueState: "archived",
          queueReason: "User cleared queue",
          archivedAt: new Date(),
        }).where(and(eq(radarCandidates.id, c.id), eq(radarCandidates.userId, userId)));
        archivedCount++;
      }
    }
    return { success: true, archivedCount };
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
  getKalodataStatus: publicProcedure.query(async () => {
    return {
      hasKey: defaultKalodataAdapter.hasKey(),
      maskedKey: defaultKalodataAdapter.getMaskedKey(),
    };
  }),
  searchKalodata: publicProcedure
    .input(
      z.object({
        keyword: z.string().optional().default(""),
        categoryId: z.string().optional().default("700646"),
        region: z.string().default("US"),
        maxCandidates: z.number().int().min(1).max(30).default(5),
        profile: profileSchema.optional(),
        minTotalSales: z.number().optional(),
        maxTotalSales: z.number().optional(),
        startPage: z.number().int().min(1).max(50).optional(),
        pagesToScan: z.number().int().min(1).max(6).default(2),
        sortStrategy: z.enum(["growth_rate", "video_revenue", "sales_volume", "revenue"]).default("sales_volume"),
        priceRange: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!defaultKalodataAdapter.hasKey()) {
        throw new Error("Kalodata API Key is not configured. Please ensure KALODATA_API_KEY is set.");
      }
      const userId = getEffectiveUserId(ctx);
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const targetMinSales = input.minTotalSales ?? input.profile?.minTotalSales ?? 2000;
      const targetMaxSales = input.maxTotalSales ?? input.profile?.maxTotalSales ?? 40000;
      const targetProfile: RadarProfileConfig = {
        ...(input.profile ?? DEFAULT_RADAR_PROFILE),
        minTotalSales: targetMinSales,
        maxTotalSales: targetMaxSales,
      };

      const { startPage, pagesToScan: scanPages } = determineDiscoveryPaging({
        keyword: input.keyword,
        sortStrategy: input.sortStrategy,
        category: input.categoryId,
        targetMaxSales,
        userStartPage: input.startPage,
        userPagesToScan: input.pagesToScan,
        maxCandidates: input.maxCandidates,
      });

      const sortField =
        input.sortStrategy === "growth_rate"
          ? "revenue_growth_rate"
          : input.sortStrategy === "video_revenue"
          ? "video_revenue"
          : input.sortStrategy === "sales_volume"
          ? "sales_volumn"
          : "revenue";

      // 1. Fetch pool of ranked products across the category using native sort strategy.
      // In Option A, we do NOT pass a speculative revenueRange dollar conversion to avoid missing
      // explosive non-linear breakouts (e.g. Yummy Skin).
      const rankItems = await defaultKalodataAdapter.searchCandidatePool({
        keyword: input.keyword,
        categoryId: input.categoryId,
        region: input.region,
        dateRange: "last7Day",
        startPage,
        pagesToScan: scanPages,
        sortField,
        isAffiliate: true,
        unitPriceRange: input.priceRange,
        targetMinSales,
        targetMaxSales,
      });

      if (!rankItems.length) {
        return { success: true, count: 0, candidateIds: [], message: `No products found on Kalodata for the selected criteria.` };
      }

      // 2. Automatically archive existing unprotected candidates that no longer fit the selected profile.
      const activeRows = await db
        .select()
        .from(radarCandidates)
        .where(and(eq(radarCandidates.userId, userId), eq(radarCandidates.queueState, "active")));
      let autoArchivedExistingCount = 0;
      for (const candidate of activeRows) {
        const raw = parseJson<any>(candidate.rawDataJson, null);
        const evaluation = isRadarCandidateOutsideProfile(raw, targetProfile);
        if (evaluation.outside && canArchiveRadarCandidate(candidate)) {
          await db.update(radarCandidates).set({ queueState: "archived", queueReason: evaluation.reason, archivedAt: new Date() }).where(and(eq(radarCandidates.id, candidate.id), eq(radarCandidates.userId, userId)));
          autoArchivedExistingCount += 1;
        }
      }

      // 3. Fetch existing product IDs in DB to prevent re-importing duplicates.
      const existingRows = await db
        .select({ extId: radarCandidates.externalProductId })
        .from(radarCandidates)
        .where(eq(radarCandidates.userId, userId));
      const existingExtIds = new Set(existingRows.map((r) => r.extId).filter(Boolean));

      // 4. Separate into unqueued products.
      const unqueued = rankItems.filter((item) => item.product_id && !existingExtIds.has(item.product_id));
      const poolToFilter = unqueued.length > 0 ? unqueued : rankItems;

      // 5. Filter out only products whose single-week sales ALREADY exceeds the target ceiling.
      // (Since lifetime sales >= 7-day sales, if 7-day sales > targetMaxSales, lifetime is mathematically > targetMaxSales).
      const candidatesToScan = poolToFilter
        .filter((item) => {
          const sales7d = Number(item.sales_volumn || 0);
          return sales7d <= targetMaxSales;
        })
        .slice(0, Math.max(input.maxCandidates * 3, 8));

      const createdIds: number[] = [];
      const archivedIds: number[] = [];

      for (const rankItem of candidatesToScan) {
        if (createdIds.length >= input.maxCandidates) break;
        try {
          const snapshot = await defaultKalodataAdapter.fetchCompleteProductSnapshot(
            rankItem.product_id,
            rankItem,
            input.region
          );
          const rawRow = defaultKalodataAdapter.mapSnapshotToRadarRawRow(snapshot);
          const metrics = calculateRadarMetrics(rawRow, targetProfile);

          // Strict Real-Unit Hard Gate (Option A):
          // Evaluated against actual un-extrapolated lifetime / 90-day unit sales from /product/detail.
          // Applies identically across all 4 discovery strategies (Breakout Velocity, Video-Driven Movers, Sales Volume, Gross Revenue).
          const profileEvaluation = isRadarCandidateOutsideProfile(rawRow, targetProfile);
          const queueState = profileEvaluation.outside ? "archived" : "active";

          const [candidate] = await db
            .insert(radarCandidates)
            .values({
              userId,
              provider: "Kalodata",
              externalProductId: rankItem.product_id,
              productName: rawRow.productName,
              category: rawRow.category ?? null,
              productUrl: rawRow.productUrl ?? null,
              productAgeDays: rawRow.productAgeDays ?? null,
              activeCreatorCount: rawRow.activeCreatorCount ?? null,
              videosOver1MViews: rawRow.videosOver1MViews ?? null,
              rawDataJson: JSON.stringify({ ...rawRow, productId: snapshot.productId, fetchedAt: snapshot.fetchedAt, rawSnapshot: snapshot, rawDetail7d: snapshot.rawDetail7d, rawDetail30d: snapshot.rawDetail30d, rawDetail90d: snapshot.rawDetail90d, rawRank: snapshot.rawRank, rawTopVideos: snapshot.rawTopVideos }),
              metricsJson: JSON.stringify(metrics),
              confidenceNotes: metrics.confidenceNotes.join(" "),
              creatorFitJson: JSON.stringify({
                mechanismCredibility: "",
                audienceRelevance: "",
                availableFootage: "",
                evidenceSupport: "",
                notes: "",
              }),
              reviewStatus: suggestedReviewStatus(metrics),
              handoffStatus: "not_ready",
              evidenceGateStatus: "not_reviewed",
              queueState,
              queueReason: profileEvaluation.outside ? profileEvaluation.reason : null,
              archivedAt: profileEvaluation.outside ? new Date() : null,
            })
            .$returningId();

          if (profileEvaluation.outside) {
            archivedIds.push(candidate.id);
          } else {
            createdIds.push(candidate.id);
          }

          if (rawRow.dailySales.length) {
            await db.insert(radarDailySales).values(
              rawRow.dailySales.map((sale) => ({
                candidateId: candidate.id,
                salesDate: sale.date,
                units: sale.units,
                rawDataJson: JSON.stringify(sale),
              }))
            );
          }
        } catch (itemErr) {
          console.error(`[Kalodata] Error importing product ${rankItem.product_id}:`, itemErr);
        }
      }

      const matchNotice = createdIds.length > 0
        ? `Scanned ${rankItems.length} products. Found ${createdIds.length} candidate(s) strictly matching your ${targetMinSales.toLocaleString()}–${targetMaxSales.toLocaleString()} volume profile (archived ${archivedIds.length} out-of-range products).`
        : `Scanned ${rankItems.length} products. Found 0 products meeting your ${targetMinSales.toLocaleString()}–${targetMaxSales.toLocaleString()} volume profile (they are either too early or over 40k). Try using the category suggestion chips (like Serums, Eye Patches, or Protein) to narrow down the pool.`;

      return {
        success: true,
        count: createdIds.length,
        candidateIds: createdIds,
        archivedCount: archivedIds.length,
        message: matchNotice,
      };
    }),
  refreshCandidateFromKalodata: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getEffectiveUserId(ctx);
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const rows = await db
        .select()
        .from(radarCandidates)
        .where(and(eq(radarCandidates.id, input.id), eq(radarCandidates.userId, userId)))
        .limit(1);

      const candidate = rows[0];
      if (!candidate) throw new Error("Candidate not found");
      if (!candidate.externalProductId) {
        throw new Error("Candidate does not have a Kalodata Product ID to refresh.");
      }

      const snapshot = await defaultKalodataAdapter.fetchCompleteProductSnapshot(candidate.externalProductId);
      const rawRow = defaultKalodataAdapter.mapSnapshotToRadarRawRow(snapshot);
      const newMetrics = calculateRadarMetrics(rawRow, DEFAULT_RADAR_PROFILE);

      await db
        .update(radarCandidates)
        .set({
          rawDataJson: JSON.stringify({ ...rawRow, productId: snapshot.productId, fetchedAt: snapshot.fetchedAt, rawSnapshot: snapshot, rawDetail7d: snapshot.rawDetail7d, rawRank: snapshot.rawRank, rawTopVideos: snapshot.rawTopVideos }),
          activeCreatorCount: rawRow.activeCreatorCount ?? null,
          videosOver1MViews: rawRow.videosOver1MViews ?? null,
          metricsJson: JSON.stringify(newMetrics),
          confidenceNotes: newMetrics.confidenceNotes.join(" "),
          reviewStatus: candidate.reviewStatus !== "approved_for_campaign_planning" ? suggestedReviewStatus(newMetrics) : candidate.reviewStatus,
        })
        .where(and(eq(radarCandidates.id, input.id), eq(radarCandidates.userId, userId)));

      return {
        success: true,
        fetchedAt: snapshot.fetchedAt,
        metrics: newMetrics,
      };
    }),
});
