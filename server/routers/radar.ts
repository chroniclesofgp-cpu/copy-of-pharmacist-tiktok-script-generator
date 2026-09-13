import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { radarCandidates, radarDailySales, radarImports, radarProfiles } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";
import { calculateRadarMetrics, canArchiveRadarCandidate, campaignHandoffAllowed, DEFAULT_RADAR_PROFILE, isRadarCandidateOutsideProfile, parseRadarCsv, parseRadarFile, suggestedReviewStatus, determineDiscoveryPaging, extractProductIdFromQuery, isTikTokShortLink, resolveTikTokShortLink, getDiscoveryQueueDisposition, type RadarProfileConfig } from "../radar";
import { PRESET_PROFILES } from "../radar";
import { defaultKalodataAdapter, hasUsableKalodataDetail } from "../kalodata";

const profileSchema = z.object({
  minTotalSales: z.number().nonnegative(), maxTotalSales: z.number().positive(), matureAgeDays: z.number().positive(), veryNewAgeDays: z.number().positive(), matureWindowDays: z.number().positive(), newWindowDays: z.number().positive(), accelerationStartingPct: z.number().nonnegative(), accelerationClearPct: z.number().nonnegative(), accelerationStrongPct: z.number().nonnegative(), stableDaysRequired: z.number().int().positive(), stableVariancePct: z.number().nonnegative(), strongDayUnits: z.number().nonnegative(), strongDaysMinimum: z.number().int().nonnegative(), latestDayAccelerationMultiplier: z.number().positive(), videoSharePreferredPct: z.number().nonnegative(), videoShareMinimumPct: z.number().nonnegative(), topVideoSpreadMaxPct: z.number().nonnegative(), topVideoWatchMaxPct: z.number().nonnegative(), ratingMinimum: z.number().nonnegative(), commissionAfterAdsMinimumPct: z.number().nonnegative(), highCompetitionCreatorThreshold: z.number().int().nonnegative().default(300), videosOver1MViewsThreshold: z.number().int().nonnegative().default(1), enforceCreatorSaturationAsHardAvoid: z.boolean().optional(),
});

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

const PRODUCT_INTEL_DIR = path.join(process.cwd(), "product-intel");

function listProductIntelRadarEntries() {
  let files: string[] = [];
  try { files = readdirSync(PRODUCT_INTEL_DIR).filter((file) => file.endsWith(".md")); } catch { return []; }
  const entries = files.map((filename) => {
    const text = readFileSync(path.join(PRODUCT_INTEL_DIR, filename), "utf8");
    const links = Array.from(text.matchAll(/https?:\/\/(?:shop\.)?tiktok\.com\/[^\s)]+/gi)).map((match) => match[0].replace(/[.,;]+$/, ""));
    const productUrl = links.find((link) => /product|pdp/i.test(link));
    const productId = productUrl ? extractProductIdFromQuery(productUrl) : null;
    return {
      filename,
      product: filename.replace(/\.md$/i, "").replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      productId,
      productUrl: productUrl ?? null,
      path: `analysis/product-intel/${filename}`,
    };
  });
  const seenIds = new Set<string>();
  return entries.filter((entry) => {
    if (!entry.productId) return true;
    if (seenIds.has(entry.productId)) return false;
    seenIds.add(entry.productId);
    return true;
  }).sort((a, b) => a.product.localeCompare(b.product));
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
  listProductIntelForRadar: publicProcedure.query(async () => listProductIntelRadarEntries()),
  reAuditProductIntel: publicProcedure.input(z.object({ region: z.string().length(2).default("US"), profile: profileSchema.optional(), maxProducts: z.number().int().positive().max(100).default(100), selectedFiles: z.array(z.string().min(1)).max(100).optional() })).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const profile = input.profile ?? DEFAULT_RADAR_PROFILE;
    const allEntries = listProductIntelRadarEntries();
    const eligibleEntries = allEntries.filter((entry) => entry.productId);
    const entries = (input.selectedFiles !== undefined ? eligibleEntries.filter((entry) => input.selectedFiles!.includes(entry.filename)) : eligibleEntries).slice(0, input.maxProducts);
    const skipped = allEntries.filter((entry) => !entry.productId).map((entry) => entry.filename);
    const [importRow] = await db.insert(radarImports).values({ userId, provider: "Product Intel → Kalodata", fileName: "Product Intelligence bulk re-audit", rowCount: entries.length + skipped.length, validRowCount: entries.length, errorJson: skipped.length ? JSON.stringify({ skipped }) : null }).$returningId();
    const processed: Array<{ candidateId: number; productId: string; productName: string; status: string; sourceFile: string }> = [];
    const failed: Array<{ sourceFile: string; productId: string; error: string }> = [];
    for (const entry of entries) {
      try {
        const snapshot = await defaultKalodataAdapter.fetchCompleteProductSnapshot(entry.productId!, undefined, input.region, { stage1Profile: profile });
        if (!hasUsableKalodataDetail(snapshot)) {
          failed.push({ sourceFile: entry.filename, productId: entry.productId!, error: "Kalodata returned no usable 7/30/90-day detail; no Radar classification was written." });
          continue;
        }
        const rawRow = defaultKalodataAdapter.mapSnapshotToRadarRawRow(snapshot);
        const metrics = calculateRadarMetrics(rawRow, profile);
        const suggestedStatus = suggestedReviewStatus(metrics, profile);
        const rawData = { ...rawRow, productId: snapshot.productId, fetchedAt: snapshot.fetchedAt, sourceIntelFile: entry.filename, sourceIntelPath: entry.path, rawSnapshot: snapshot, rawDetail7d: snapshot.rawDetail7d, rawDetail30d: snapshot.rawDetail30d, rawDetail90d: snapshot.rawDetail90d, rawRank: snapshot.rawRank, rawTopVideos: snapshot.rawTopVideos };
        const existing = await db.select().from(radarCandidates).where(and(eq(radarCandidates.userId, userId), eq(radarCandidates.externalProductId, snapshot.productId))).limit(1);
        let candidateId: number;
        let protectedReview = false;
        if (existing[0]) {
          const current = existing[0];
          protectedReview = current.reviewStatus === "approved_for_campaign_planning" || current.evidenceGateStatus !== "not_reviewed" || current.handoffStatus !== "not_ready";
          const preservedQueueState = protectedReview ? current.queueState : "active";
          await db.update(radarCandidates).set({ importId: importRow.id, provider: "Kalodata (Product Intel)", productName: rawRow.productName || entry.product, productUrl: rawRow.productUrl || entry.productUrl || current.productUrl, category: rawRow.category || current.category || "Product Intel", productAgeDays: rawRow.productAgeDays ?? current.productAgeDays, activeCreatorCount: rawRow.activeCreatorCount ?? null, videosOver1MViews: rawRow.videosOver1MViews ?? null, rawDataJson: JSON.stringify(rawData), metricsJson: JSON.stringify(metrics), confidenceNotes: metrics.confidenceNotes.join(" "), reviewStatus: protectedReview ? current.reviewStatus : suggestedStatus, queueState: preservedQueueState, queueReason: protectedReview ? current.queueReason : `Product Intel re-audit: ${entry.filename}`, archivedAt: preservedQueueState === "archived" ? current.archivedAt ?? new Date() : null }).where(eq(radarCandidates.id, current.id));
          candidateId = current.id;
        } else {
          const [candidate] = await db.insert(radarCandidates).values({ userId, importId: importRow.id, provider: "Kalodata (Product Intel)", externalProductId: snapshot.productId, productName: rawRow.productName || entry.product, category: rawRow.category || "Product Intel", productUrl: rawRow.productUrl || entry.productUrl || `https://shop.tiktok.com/view/product/${snapshot.productId}`, productAgeDays: rawRow.productAgeDays ?? null, activeCreatorCount: rawRow.activeCreatorCount ?? null, videosOver1MViews: rawRow.videosOver1MViews ?? null, rawDataJson: JSON.stringify(rawData), metricsJson: JSON.stringify(metrics), confidenceNotes: metrics.confidenceNotes.join(" "), creatorFitJson: JSON.stringify({ mechanismCredibility: "", audienceRelevance: "", availableFootage: "", evidenceSupport: "", notes: `Source Product Intel document: ${entry.filename}` }), reviewStatus: suggestedStatus, handoffStatus: "not_ready", evidenceGateStatus: "not_reviewed", queueState: "active", queueReason: `Product Intel re-audit: ${entry.filename}` }).$returningId();
          candidateId = candidate.id;
          if (rawRow.dailySales.length) await db.insert(radarDailySales).values(rawRow.dailySales.map((sale) => ({ candidateId, salesDate: sale.date, units: sale.units, rawDataJson: JSON.stringify(sale) })));
        }
        processed.push({ candidateId, productId: snapshot.productId, productName: rawRow.productName || entry.product, status: protectedReview && existing[0] ? existing[0].reviewStatus : suggestedStatus, sourceFile: entry.filename });
      } catch (error) {
        failed.push({ sourceFile: entry.filename, productId: entry.productId!, error: error instanceof Error ? error.message : String(error) });
      }
    }
    return { importId: importRow.id, requested: entries.length, processed, skipped, failed, estimatedApiCalls: { minimum: processed.length, maximum: processed.length * 4 } };
  }),
  listCandidates: publicProcedure.query(async ({ ctx }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(radarCandidates).where(and(eq(radarCandidates.userId, userId), eq(radarCandidates.queueState, "active"))).orderBy(desc(radarCandidates.updatedAt));
    return rows.filter((row) => row.reviewStatus !== "approved_for_campaign_planning" && row.reviewStatus !== "avoid").map((row) => ({ ...row, rawData: parseJson(row.rawDataJson, {}), metrics: parseJson(row.metricsJson, {}), creatorFit: parseJson(row.creatorFitJson, {}), aiBrief: parseJson(row.aiBriefJson, null) }));
  }),
  listArchivedCandidates: publicProcedure.query(async ({ ctx }) => {
    const userId = getEffectiveUserId(ctx);
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(radarCandidates).where(eq(radarCandidates.userId, userId)).orderBy(desc(radarCandidates.updatedAt));
    return rows.filter((row) => row.queueState === "archived" || row.reviewStatus === "approved_for_campaign_planning" || row.reviewStatus === "avoid").map((row) => ({ ...row, rawData: parseJson(row.rawDataJson, {}), metrics: parseJson(row.metricsJson, {}), creatorFit: parseJson(row.creatorFitJson, {}), aiBrief: parseJson(row.aiBriefJson, null) }));
  }),
  importCsv: publicProcedure.input(z.object({ provider: z.string().min(1).max(40), fileName: z.string().min(1).max(255), csv: z.string().min(1), profile: profileSchema.optional() })).mutation(async ({ ctx, input }) => {
    const userId = getEffectiveUserId(ctx);
    const parsed = parseRadarFile(input.csv, input.fileName);
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const [importRow] = await db.insert(radarImports).values({ userId, provider: input.provider, fileName: input.fileName, rowCount: parsed.rows.length + parsed.errors.length, validRowCount: parsed.rows.length, errorJson: parsed.errors.length ? JSON.stringify(parsed.errors) : null }).$returningId();
    const importId = importRow.id;
    const profile = input.profile ?? DEFAULT_RADAR_PROFILE;
    const created: number[] = [];
    for (const raw of parsed.rows) {
      const metrics = calculateRadarMetrics(raw, profile);
      const [candidate] = await db.insert(radarCandidates).values({ userId, importId, provider: raw.provider || input.provider, externalProductId: raw.externalProductId ?? null, productName: raw.productName, category: raw.category ?? null, productUrl: raw.productUrl ?? null, productAgeDays: raw.productAgeDays ?? null, activeCreatorCount: raw.activeCreatorCount ?? null, videosOver1MViews: raw.videosOver1MViews ?? null, rawDataJson: JSON.stringify(raw), metricsJson: JSON.stringify(metrics), confidenceNotes: metrics.confidenceNotes.join(" "), creatorFitJson: JSON.stringify({ mechanismCredibility: "", audienceRelevance: "", availableFootage: "", evidenceSupport: "", notes: "" }), reviewStatus: suggestedReviewStatus(metrics, profile), handoffStatus: "not_ready", evidenceGateStatus: "not_reviewed" }).$returningId();
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
      const newStatus = suggestedReviewStatus(newMetrics, input.profile as RadarProfileConfig);
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
    await db.update(radarCandidates).set({ reviewStatus: input.reviewStatus, evidenceGateStatus: input.evidenceGateStatus, handoffStatus, reviewNotes: input.reviewNotes ?? null, creatorFitJson: input.creatorFit ? JSON.stringify(input.creatorFit) : rows[0].creatorFitJson, queueState: "archived", queueReason: `Reviewed: ${input.reviewStatus}`, archivedAt: new Date() }).where(and(eq(radarCandidates.id, input.id), eq(radarCandidates.userId, userId)));
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
        searchMode: z.enum(["standard", "mega_seller"]).default("standard"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!defaultKalodataAdapter.hasKey()) {
        throw new Error("Kalodata API Key is not configured. Please ensure KALODATA_API_KEY is set.");
      }
      const userId = getEffectiveUserId(ctx);
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const isMegaSellerMode = input.searchMode === "mega_seller";
      const targetMinSales = input.minTotalSales ?? input.profile?.minTotalSales ?? 2000;
      const targetMaxSales = input.maxTotalSales ?? input.profile?.maxTotalSales ?? 40000;
      const discoveryMinSales = isMegaSellerMode ? 0 : targetMinSales;
      const discoveryMaxSales = isMegaSellerMode ? Number.MAX_SAFE_INTEGER : targetMaxSales;
      const targetProfile: RadarProfileConfig = {
        ...(input.profile ?? DEFAULT_RADAR_PROFILE),
        minTotalSales: targetMinSales,
        maxTotalSales: targetMaxSales,
      };

      const { startPage, pagesToScan: scanPages } = determineDiscoveryPaging({
        keyword: input.keyword,
        sortStrategy: input.sortStrategy,
        category: input.categoryId,
        targetMaxSales: discoveryMaxSales,
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
        targetMinSales: discoveryMinSales,
        targetMaxSales: discoveryMaxSales,
      });

      if (!rankItems.length) {
        return { success: true, count: 0, candidateIds: [], message: `No products found on Kalodata for the selected criteria.` };
      }

      // 2. Standard pulls reconcile the active queue against the selected profile. Mega-seller
      // pulls deliberately leave the normal queue untouched and write to a separate provider lane.
      let autoArchivedExistingCount = 0;
      if (!isMegaSellerMode) {
        const activeRows = await db
          .select()
          .from(radarCandidates)
          .where(and(eq(radarCandidates.userId, userId), eq(radarCandidates.queueState, "active")));
        for (const candidate of activeRows) {
          const raw = parseJson<any>(candidate.rawDataJson, null);
          const evaluation = isRadarCandidateOutsideProfile(raw, targetProfile);
          if (evaluation.outside && canArchiveRadarCandidate(candidate)) {
            await db.update(radarCandidates).set({ queueState: "archived", queueReason: evaluation.reason, archivedAt: new Date() }).where(and(eq(radarCandidates.id, candidate.id), eq(radarCandidates.userId, userId)));
            autoArchivedExistingCount += 1;
          }
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
          if (isMegaSellerMode) return true;
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
            input.region,
            { stage1Profile: targetProfile }
          );
          if (!hasUsableKalodataDetail(snapshot)) {
            console.warn(`[Kalodata] Skipping ${rankItem.product_id}: no usable 7/30/90-day detail returned.`);
            continue;
          }
          const rawRow = defaultKalodataAdapter.mapSnapshotToRadarRawRow(snapshot);
          const metrics = calculateRadarMetrics(rawRow, targetProfile);

          // Strict Real-Unit Hard Gate (Option A):
          // Evaluated against actual un-extrapolated lifetime / 90-day unit sales from /product/detail.
          // Applies identically across all 4 discovery strategies (Breakout Velocity, Video-Driven Movers, Sales Volume, Gross Revenue).
          const profileEvaluation = isRadarCandidateOutsideProfile(rawRow, targetProfile);
          const queueDisposition = getDiscoveryQueueDisposition(isMegaSellerMode ? "mega_seller" : "standard", profileEvaluation.outside, profileEvaluation.reason);

          const [candidate] = await db
            .insert(radarCandidates)
            .values({
              userId,
              provider: queueDisposition.provider,
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
            reviewStatus: suggestedReviewStatus(metrics, targetProfile),
            handoffStatus: "not_ready",
              evidenceGateStatus: "not_reviewed",
              queueState: queueDisposition.queueState,
              queueReason: queueDisposition.queueReason,
              archivedAt: queueDisposition.archived ? new Date() : null,
            })
            .$returningId();

          if (!isMegaSellerMode && profileEvaluation.outside) {
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

      const matchNotice = isMegaSellerMode
        ? `Scanned ${rankItems.length} products in Mega-seller Opportunity mode. Preserved ${createdIds.length} product(s) for separate recent-competition and fresh-video review.`
        : createdIds.length > 0
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

      const snapshot = await defaultKalodataAdapter.fetchCompleteProductSnapshot(
        candidate.externalProductId,
        undefined,
        "US",
        { stage1Profile: DEFAULT_RADAR_PROFILE }
      );
      const rawRow = defaultKalodataAdapter.mapSnapshotToRadarRawRow(snapshot);
      const newMetrics = calculateRadarMetrics(rawRow, DEFAULT_RADAR_PROFILE);

      await db
        .update(radarCandidates)
        .set({
          rawDataJson: JSON.stringify({ ...rawRow, productId: snapshot.productId, fetchedAt: snapshot.fetchedAt, rawSnapshot: snapshot, rawDetail7d: snapshot.rawDetail7d, rawDetail30d: snapshot.rawDetail30d, rawDetail90d: snapshot.rawDetail90d, rawRank: snapshot.rawRank, rawTopVideos: snapshot.rawTopVideos }),
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

    vetSingleProduct: publicProcedure
      .input(
        z.object({
          query: z.string().min(1),
          region: z.string().default("US"),
          profile: z.custom<RadarProfileConfig>().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!defaultKalodataAdapter.hasKey()) {
          throw new Error("Kalodata API Key is not configured. Please ensure KALODATA_API_KEY is set.");
        }
        const userId = getEffectiveUserId(ctx);
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const targetProfile = input.profile ?? DEFAULT_RADAR_PROFILE;
        const cleanQuery = input.query.trim();
        let extractedId = extractProductIdFromQuery(cleanQuery);
        let matchedBy: "exact_id" | "short_link" | "search_top_match" = extractedId ? "exact_id" : "search_top_match";

        if (!extractedId && isTikTokShortLink(cleanQuery)) {
          try {
            extractedId = await resolveTikTokShortLink(cleanQuery);
          } catch {
            extractedId = null;
          }
          if (!extractedId) {
            throw new Error("This TikTok short link could not be resolved to a Shop product ID. Paste the full TikTok Shop product URL or the numeric product ID instead.");
          }
          matchedBy = "short_link";
        }

        let snapshot = null;

        if (extractedId) {
          snapshot = await defaultKalodataAdapter.fetchCompleteProductSnapshot(
            extractedId,
            undefined,
            input.region,
            { stage1Profile: targetProfile }
          );
        } else {
          const rankItems = await defaultKalodataAdapter.searchProducts({
            keyword: cleanQuery,
            pageSize: 5,
            region: input.region,
            dateRange: "last7Day",
          });

          if (!rankItems.length) {
            throw new Error(`No products found on Kalodata matching "${cleanQuery}". Try checking the spelling or pasting the exact TikTok Shop product ID.`);
          }

          const topMatch = rankItems[0];
          snapshot = await defaultKalodataAdapter.fetchCompleteProductSnapshot(
            topMatch.product_id,
            topMatch,
            input.region,
            { stage1Profile: targetProfile }
          );
        }

        if (!snapshot || !snapshot.rawDetail7d) {
          throw new Error(`Unable to retrieve product details from Kalodata for "${cleanQuery}".`);
        }

        const rawRow = defaultKalodataAdapter.mapSnapshotToRadarRawRow(snapshot);
        const metrics = calculateRadarMetrics(rawRow, targetProfile);
        const suggestedStatus = suggestedReviewStatus(metrics);

        const existing = await db
          .select()
          .from(radarCandidates)
          .where(
            and(
              eq(radarCandidates.userId, userId),
              eq(radarCandidates.externalProductId, snapshot.productId)
            )
          )
          .limit(1);

        let candidateId: number;

        if (existing.length > 0) {
          candidateId = existing[0].id;
          await db
            .update(radarCandidates)
            .set({
              productName: rawRow.productName,
              category: rawRow.category || existing[0].category,
              productUrl: rawRow.productUrl || (snapshot.productId ? `https://shop.tiktok.com/view/product/${snapshot.productId}` : existing[0].productUrl),
              productAgeDays: rawRow.productAgeDays,
              activeCreatorCount: rawRow.activeCreatorCount ?? null,
              videosOver1MViews: rawRow.videosOver1MViews ?? null,
              rawDataJson: JSON.stringify({
                ...rawRow,
                productId: snapshot.productId,
                fetchedAt: snapshot.fetchedAt,
                rawSnapshot: snapshot,
                rawDetail7d: snapshot.rawDetail7d,
                rawDetail30d: snapshot.rawDetail30d,
                rawDetail90d: snapshot.rawDetail90d,
                rawTopVideos: snapshot.rawTopVideos,
              }),
              metricsJson: JSON.stringify(metrics),
              confidenceNotes: metrics.confidenceNotes.join(" "),
              reviewStatus: existing[0].reviewStatus !== "approved_for_campaign_planning" ? suggestedStatus : existing[0].reviewStatus,
              queueState: "active",
              queueReason: null,
              archivedAt: null,
            })
            .where(eq(radarCandidates.id, candidateId));
        } else {
          const insertRes = await db.insert(radarCandidates).values({
            userId,
            provider: "Kalodata",
            externalProductId: snapshot.productId,
            productName: rawRow.productName,
            category: rawRow.category || "Inbound Offer",
            productUrl: rawRow.productUrl || (snapshot.productId ? `https://shop.tiktok.com/view/product/${snapshot.productId}` : null),
            productAgeDays: rawRow.productAgeDays,
            activeCreatorCount: rawRow.activeCreatorCount ?? null,
            videosOver1MViews: rawRow.videosOver1MViews ?? null,
            rawDataJson: JSON.stringify({
              ...rawRow,
              productId: snapshot.productId,
              fetchedAt: snapshot.fetchedAt,
              rawSnapshot: snapshot,
              rawDetail7d: snapshot.rawDetail7d,
              rawDetail30d: snapshot.rawDetail30d,
              rawDetail90d: snapshot.rawDetail90d,
              rawTopVideos: snapshot.rawTopVideos,
            }),
            metricsJson: JSON.stringify(metrics),
            confidenceNotes: metrics.confidenceNotes.join(" "),
            reviewStatus: suggestedStatus,
            evidenceGateStatus: "not_reviewed",
            handoffStatus: "not_ready",
            queueState: "active",
            queueReason: null,
          });
          candidateId = Number(insertRes[0].insertId);
        }

        return {
          success: true,
          candidateId,
          productId: snapshot.productId,
          productName: rawRow.productName,
          status: suggestedStatus,
          matchedBy,

          metrics,
        };
      }),
});
