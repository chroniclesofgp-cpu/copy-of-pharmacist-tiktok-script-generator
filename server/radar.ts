export type AccelerationBand = "not_accelerating" | "starting" | "clear" | "strong" | "insufficient_history";
export type ReviewStatus = "candidate" | "watchlist" | "human_review" | "avoid" | "approved_for_campaign_planning";

export type RadarProfileConfig = {
  minTotalSales: number;
  maxTotalSales: number;
  matureAgeDays: number;
  veryNewAgeDays: number;
  matureWindowDays: number;
  newWindowDays: number;
  accelerationStartingPct: number;
  accelerationClearPct: number;
  accelerationStrongPct: number;
  stableDaysRequired: number;
  stableVariancePct: number;
  strongDayUnits: number;
  strongDaysMinimum: number;
  latestDayAccelerationMultiplier: number;
  videoSharePreferredPct: number;
  videoShareMinimumPct: number;
  topVideoSpreadMaxPct: number;
  topVideoWatchMaxPct: number;
  ratingMinimum: number;
  commissionAfterAdsMinimumPct: number;
  highCompetitionCreatorThreshold: number;
  videosOver1MViewsThreshold: number;
};

export const DEFAULT_RADAR_PROFILE: RadarProfileConfig = {
  minTotalSales: 2000,
  maxTotalSales: 40000,
  matureAgeDays: 90,
  veryNewAgeDays: 30,
  matureWindowDays: 90,
  newWindowDays: 30,
  accelerationStartingPct: 8,
  accelerationClearPct: 15,
  accelerationStrongPct: 20,
  stableDaysRequired: 5,
  stableVariancePct: 20,
  strongDayUnits: 100,
  strongDaysMinimum: 2,
  latestDayAccelerationMultiplier: 1.3,
  videoSharePreferredPct: 70,
  videoShareMinimumPct: 50,
  topVideoSpreadMaxPct: 40,
  topVideoWatchMaxPct: 70,
  ratingMinimum: 4,
  commissionAfterAdsMinimumPct: 10,
  highCompetitionCreatorThreshold: 300,
  videosOver1MViewsThreshold: 1,
};

export const COACH_A_PROFILE: RadarProfileConfig = {
  ...DEFAULT_RADAR_PROFILE,
  minTotalSales: 2000,
  maxTotalSales: 40000,
};

export const COACH_B_PROFILE: RadarProfileConfig = {
  ...DEFAULT_RADAR_PROFILE,
  minTotalSales: 1000,
  maxTotalSales: 9000,
};

export const PRESET_PROFILES: Record<string, { id: string; name: string; description: string; config: RadarProfileConfig }> = {
  coach_a: {
    id: "coach_a",
    name: "Coach A Range (2,000–40,000)",
    description: "Standard mature velocity band: 2k–40k total sales, 8–20% acceleration, <=300 competitors",
    config: COACH_A_PROFILE,
  },
  coach_b: {
    id: "coach_b",
    name: "Coach B Range (1,000–9,000)",
    description: "Early breakout velocity band: 1k–9k total sales, tighter saturation ceiling, <=300 competitors",
    config: COACH_B_PROFILE,
  },
};

export type RadarRawRow = {
  provider: string;
  externalProductId?: string;
  productName: string;
  category?: string;
  productUrl?: string;
  productAgeDays?: number;
  activeCreatorCount?: number;
  videosOver1MViews?: number;
  totalSales: number;
  sales7d: number;
  sales28d?: number;
  sales30d?: number;
  sales90d?: number;
  yesterdaySales?: number;
  price?: number;
  commissionAfterAdsPct?: number;
  rating?: number;
  videoSalesPct?: number;
  liveSalesPct?: number;
  productCardSalesPct?: number;
  topVideoSalesPct?: number;
  dailySales: Array<{ date: string; units: number }>;
};

export type RadarMetrics = {
  totalSalesInRange: boolean;
  accelerationRatio: number | null;
  accelerationPct: number | null;
  accelerationBand: AccelerationBand;
  historyMode: "mature_7_over_90" | "new_7_over_30" | "very_new_daily";
  stableDays: number;
  stablePattern: boolean;
  strongDays: number;
  strengthPattern: boolean;
  latestDayMultiplier: number | null;
  latestDayAcceleration: boolean;
  videoSharePreferred: boolean;
  videoShareMinimumMet: boolean;
  topVideoConcentrationPct: number | null;
  concentrationBand: "spread_out" | "watch" | "high_risk_single_video" | "unknown";
  ratingMinimumMet: boolean | null;
  commissionMinimumMet: boolean | null;
  activeCreatorCount: number | null;
  isHighCompetition: boolean | null;
  videosOver1MViews: number | null;
  hasHighViewVideoBacking: boolean | null;
  confidenceNotes: string[];
  deterministicSignalsMet: number;
  deterministicSignalsConsidered: number;
};

const finite = (value: unknown): number | undefined => {
  const parsed = typeof value === "number" ? value : Number(String(value ?? "").replace(/[,$%]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function classifyAcceleration(pct: number | null, profile = DEFAULT_RADAR_PROFILE): AccelerationBand {
  if (pct === null || !Number.isFinite(pct)) return "insufficient_history";
  if (pct < profile.accelerationStartingPct) return "not_accelerating";
  if (pct < profile.accelerationClearPct) return "starting";
  if (pct < profile.accelerationStrongPct) return "clear";
  return "strong";
}

export function calculateRadarMetrics(raw: RadarRawRow, profile: RadarProfileConfig = DEFAULT_RADAR_PROFILE): RadarMetrics {
  const age = raw.productAgeDays ?? profile.matureAgeDays;
  const historyMode = age < profile.veryNewAgeDays ? "very_new_daily" : age < profile.matureAgeDays ? "new_7_over_30" : "mature_7_over_90";
  const denominator = historyMode === "mature_7_over_90" ? raw.sales90d : historyMode === "new_7_over_30" ? raw.sales30d : undefined;
  const accelerationRatio = denominator && denominator > 0 ? raw.sales7d / denominator : null;
  const accelerationPct = accelerationRatio === null ? null : accelerationRatio * 100;
  const lastSeven = raw.dailySales.slice(-7);
  const dailyValues = lastSeven.map((entry) => entry.units);
  const average = dailyValues.length ? dailyValues.reduce((sum, units) => sum + units, 0) / dailyValues.length : 0;
  const stableDays = average > 0 ? dailyValues.filter((units) => Math.abs(units - average) / average <= profile.stableVariancePct / 100).length : 0;
  const strongDays = dailyValues.filter((units) => units >= profile.strongDayUnits).length;
  const prior = dailyValues.length >= 2 ? dailyValues[dailyValues.length - 2] : undefined;
  const latest = dailyValues.length ? dailyValues[dailyValues.length - 1] : undefined;
  const latestDayMultiplier = prior && prior > 0 && latest !== undefined ? latest / prior : null;
  const confidenceNotes: string[] = [];
  if (historyMode === "very_new_daily") confidenceNotes.push("Very new product: ratio omitted because history is too thin; daily volume and chart direction are used instead.");
  if (lastSeven.length < 7) confidenceNotes.push(`Only ${lastSeven.length} daily observations supplied; 7-day pattern confidence is limited.`);
  if (raw.videoSalesPct === undefined) confidenceNotes.push("Video/live/product-card sales split is missing.");
  if (raw.topVideoSalesPct === undefined) confidenceNotes.push("Top-video concentration is missing.");
  if (raw.rating === undefined) confidenceNotes.push("Rating is missing; rating gate is not counted.");
  if (raw.commissionAfterAdsPct === undefined) confidenceNotes.push("Commission after ads is missing; commission gate is not counted.");

  const isHighCompetition = raw.activeCreatorCount !== undefined ? raw.activeCreatorCount > profile.highCompetitionCreatorThreshold : null;
  if (raw.activeCreatorCount !== undefined) {
    if (isHighCompetition) {
      confidenceNotes.push(`High creator competition: ${raw.activeCreatorCount} active creators (> ${profile.highCompetitionCreatorThreshold} threshold).`);
    } else {
      confidenceNotes.push(`Competitive density manageable: ${raw.activeCreatorCount} active creators (<= ${profile.highCompetitionCreatorThreshold}).`);
    }
  }

  const hasHighViewVideoBacking = raw.videosOver1MViews !== undefined ? raw.videosOver1MViews >= profile.videosOver1MViewsThreshold : null;
  if (raw.videosOver1MViews !== undefined) {
    if (hasHighViewVideoBacking) {
      confidenceNotes.push(`Strong ad-spend backing verified: ${raw.videosOver1MViews} video(s) over 1M views.`);
    } else {
      confidenceNotes.push(`Zero 1M+ view videos recorded (limited verified viral ad backing).`);
    }
  }

  let considered = 6 + (raw.rating === undefined ? 0 : 1) + (raw.commissionAfterAdsPct === undefined ? 0 : 1);
  if (raw.activeCreatorCount !== undefined) considered += 1;
  if (raw.videosOver1MViews !== undefined) considered += 1;

  const met = [
    raw.totalSales >= profile.minTotalSales && raw.totalSales <= profile.maxTotalSales,
    classifyAcceleration(accelerationPct, profile) === "clear" || classifyAcceleration(accelerationPct, profile) === "strong",
    stableDays >= profile.stableDaysRequired,
    historyMode === "very_new_daily" ? (raw.yesterdaySales ?? 0) >= profile.strongDayUnits : strongDays >= profile.strongDaysMinimum,
    latestDayMultiplier !== null && latestDayMultiplier >= profile.latestDayAccelerationMultiplier,
    raw.videoSalesPct !== undefined && raw.videoSalesPct >= profile.videoShareMinimumPct,
    raw.rating === undefined ? false : raw.rating >= profile.ratingMinimum,
    raw.commissionAfterAdsPct === undefined ? false : raw.commissionAfterAdsPct >= profile.commissionAfterAdsMinimumPct,
  ];
  if (raw.activeCreatorCount !== undefined) {
    met.push(raw.activeCreatorCount <= profile.highCompetitionCreatorThreshold);
  }
  if (raw.videosOver1MViews !== undefined) {
    met.push(raw.videosOver1MViews >= profile.videosOver1MViewsThreshold);
  }
  const topVideoConcentrationPct = raw.topVideoSalesPct ?? null;
  const concentrationBand = topVideoConcentrationPct === null ? "unknown" : topVideoConcentrationPct < profile.topVideoSpreadMaxPct ? "spread_out" : topVideoConcentrationPct <= profile.topVideoWatchMaxPct ? "watch" : "high_risk_single_video";
  return {
    totalSalesInRange: met[0],
    accelerationRatio,
    accelerationPct,
    accelerationBand: classifyAcceleration(accelerationPct, profile),
    historyMode,
    stableDays,
    stablePattern: met[2],
    strongDays,
    strengthPattern: met[3],
    latestDayMultiplier,
    latestDayAcceleration: met[4],
    videoSharePreferred: raw.videoSalesPct !== undefined && raw.videoSalesPct >= profile.videoSharePreferredPct,
    videoShareMinimumMet: met[5],
    topVideoConcentrationPct,
    concentrationBand,
    ratingMinimumMet: raw.rating === undefined ? null : raw.rating >= profile.ratingMinimum,
    commissionMinimumMet: raw.commissionAfterAdsPct === undefined ? null : raw.commissionAfterAdsPct >= profile.commissionAfterAdsMinimumPct,
    activeCreatorCount: raw.activeCreatorCount ?? null,
    isHighCompetition,
    videosOver1MViews: raw.videosOver1MViews ?? null,
    hasHighViewVideoBacking,
    confidenceNotes,
    deterministicSignalsMet: met.filter(Boolean).length,
    deterministicSignalsConsidered: considered,
  };
}

export function campaignHandoffAllowed(reviewStatus: ReviewStatus, evidenceGateStatus: string): boolean {
  return reviewStatus === "approved_for_campaign_planning" && evidenceGateStatus === "approved";
}

export function isRadarCandidateOutsideProfile(raw: Pick<RadarRawRow, "totalSales"> | null | undefined, profile: RadarProfileConfig): { outside: boolean; reason: string; totalSales: number } {
  const totalSales = Number(raw?.totalSales ?? 0);
  if (!raw || !Number.isFinite(totalSales)) return { outside: true, reason: "Missing usable total-sales data", totalSales };
  if (totalSales < profile.minTotalSales || totalSales > profile.maxTotalSales) {
    return { outside: true, reason: `${totalSales.toLocaleString()} total sales is outside ${profile.minTotalSales.toLocaleString()}–${profile.maxTotalSales.toLocaleString()}`, totalSales };
  }
  return { outside: false, reason: "Within active total-sales range", totalSales };
}

export function canArchiveRadarCandidate(candidate: { reviewStatus: string; evidenceGateStatus: string; handoffStatus: string }): boolean {
  return candidate.reviewStatus !== "human_review" && candidate.reviewStatus !== "approved_for_campaign_planning" && candidate.evidenceGateStatus !== "approved" && candidate.handoffStatus === "not_ready";
}

export function suggestedReviewStatus(metrics: RadarMetrics): ReviewStatus {
  // Hard Rejections:
  // 1. Outside target total sales volume window
  // 2. Not accelerating (<8% velocity ratio)
  // 3. Creator saturation breached (>300 active creators) - violates "Find movement before saturation"
  if (!metrics.totalSalesInRange || metrics.accelerationBand === "not_accelerating" || metrics.isHighCompetition) {
    return "avoid";
  }
  if (metrics.concentrationBand === "high_risk_single_video") return "human_review";
  if (metrics.accelerationBand === "strong" && metrics.stablePattern && metrics.videoShareMinimumMet && metrics.latestDayAcceleration) return "watchlist";
  return "candidate";
}

export function determineDiscoveryPaging(params: {
  keyword?: string;
  sortStrategy?: string;
  targetMaxSales?: number;
  category?: string;
  userStartPage?: number;
  userPagesToScan?: number;
  maxCandidates?: number;
}): { startPage: number; pagesToScan: number; adaptiveSeeking: boolean } {
  const isBroadCategory = !params.keyword || params.keyword.trim() === "";
  const isVolumeOrRevenueSort =
    params.sortStrategy === "sales_volume" ||
    params.sortStrategy === "revenue" ||
    params.sortStrategy === "video_revenue" ||
    !params.sortStrategy;

  let defaultStartPage = 1;
  const maxSales = params.targetMaxSales ?? 40000;
  const isKnownMegaCategory =
    params.category === "601450" ||
    params.category === "700646" ||
    params.category === "Beauty & Skincare" ||
    params.category === "Dietary Supplements";

  // Only apply aggressive rank-offset to known mega-categories where rank 1 exceeds 100k units.
  // For smaller or less-saturated categories, default to page 1 to prevent overshooting candidates.
  if (isBroadCategory && isVolumeOrRevenueSort && isKnownMegaCategory) {
    if (maxSales <= 10000) {
      defaultStartPage = 5; // Coach B in mega category lives at ranks ~200-500
    } else if (maxSales <= 45000) {
      defaultStartPage = 2; // Coach A in mega category starts at ranks ~50-250
    }
  }

  const startPage = params.userStartPage || defaultStartPage;
  const pagesToScan = Math.min(6, Math.max(params.userPagesToScan || 3, Math.ceil((params.maxCandidates || 5) / 5)));
  return { startPage, pagesToScan, adaptiveSeeking: true };
}

export function shouldStopAdaptiveScan(params: {
  isUnitSort: boolean;
  minFloor?: number;
  pageMaxSales: number;
  currentConsecutiveUnderFloor: number;
}): { shouldStop: boolean; nextConsecutiveCount: number } {
  // Non-unit sorts (video_revenue, revenue_growth_rate, etc.) do NOT decline monotonically.
  // Never early-stop on volume floor for non-unit sorts.
  if (!params.isUnitSort || !params.minFloor || params.minFloor <= 0) {
    return { shouldStop: false, nextConsecutiveCount: 0 };
  }

  if (params.pageMaxSales > 0 && params.pageMaxSales < params.minFloor) {
    const nextCount = params.currentConsecutiveUnderFloor + 1;
    // Require at least 2 consecutive under-floor pages before stopping to protect against dips
    return { shouldStop: nextCount >= 2, nextConsecutiveCount: nextCount };
  }

  return { shouldStop: false, nextConsecutiveCount: 0 };
}

export type CsvValidationResult = { rows: RadarRawRow[]; errors: Array<{ row: number; message: string }> };

const aliases: Record<string, string[]> = {
  provider: ["provider", "source"], externalProductId: ["externalProductId", "product_id", "product id", "id"], productName: ["productName", "product_name", "product", "name"], category: ["category", "niche"], productUrl: ["productUrl", "product_url", "url"], productAgeDays: ["productAgeDays", "product_age_days", "age_days"], totalSales: ["totalSales", "total_sales", "total units sold", "total units"], sales7d: ["sales7d", "7d sales", "7 day sales", "7_days"], sales30d: ["sales30d", "30d sales", "30 day sales"], sales90d: ["sales90d", "90d sales", "90 day sales"], sales28d: ["sales28d", "28d sales", "28 day sales"], yesterdaySales: ["yesterdaySales", "yesterday sales"], price: ["price"], commissionAfterAdsPct: ["commissionAfterAdsPct", "commission after ads", "commission %", "commission"], rating: ["rating", "stars"], videoSalesPct: ["videoSalesPct", "video sales %", "video share"], liveSalesPct: ["liveSalesPct", "live sales %"], productCardSalesPct: ["productCardSalesPct", "product card sales %"], topVideoSalesPct: ["topVideoSalesPct", "top video concentration", "top video %"], activeCreatorCount: ["activeCreatorCount", "active_creator_count", "active_creators", "creator_count", "creators", "competitor_count", "competitor_creators", "active creators"], videosOver1MViews: ["videosOver1MViews", "videos_over_1m_views", "videos_over_1m", "videos_1m_views", "high_view_videos", "1m_videos", "viral_videos", "1m+ videos", "videos > 1m"], dailySales: ["dailySalesJson", "daily sales json", "daily_sales_json"],
};

function findValue(record: Record<string, string>, field: string): string | undefined {
  const key = Object.keys(record).find((candidate) => aliases[field]?.some((alias) => candidate.trim().toLowerCase() === alias.toLowerCase()));
  return key ? record[key] : undefined;
}

export function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"' && quoted) { current += '"'; i += 1; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (char === "," && !quoted) { values.push(current.trim()); current = ""; continue; }
    current += char;
  }
  values.push(current.trim());
  return values;
}

export function parseRadarCsv(csv: string): CsvValidationResult {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!lines.length) return { rows: [], errors: [{ row: 1, message: "CSV is empty." }] };
  const headers = parseCsvLine(lines[0]);
  const rows: RadarRawRow[] = [];
  const errors: Array<{ row: number; message: string }> = [];
  lines.slice(1).forEach((line, index) => {
    const values = parseCsvLine(line);
    const record = Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""]));
    const productName = findValue(record, "productName")?.trim();
    const requiredNumbers = ["totalSales", "sales7d"].map((field) => [field, finite(findValue(record, field))] as const);
    if (!productName) { errors.push({ row: index + 2, message: "Product name is required." }); return; }
    const missing = requiredNumbers.filter(([, value]) => value === undefined).map(([field]) => field);
    if (missing.length) { errors.push({ row: index + 2, message: `Missing or invalid numeric fields: ${missing.join(", ")}.` }); return; }
    let dailySales: Array<{ date: string; units: number }> = [];
    const dailyRaw = findValue(record, "dailySales");
    if (dailyRaw) {
      try {
        const parsed = JSON.parse(dailyRaw) as Array<{ date: string; units: number }>;
        if (Array.isArray(parsed)) dailySales = parsed.map((entry) => ({ date: String(entry.date), units: Number(entry.units) })).filter((entry) => entry.date && Number.isFinite(entry.units));
      } catch { errors.push({ row: index + 2, message: "dailySalesJson must be valid JSON array data." }); return; }
    }
    rows.push({
      provider: findValue(record, "provider") || "manual_csv",
      externalProductId: findValue(record, "externalProductId") || undefined,
      productName,
      category: findValue(record, "category") || undefined,
      productUrl: findValue(record, "productUrl") || undefined,
      productAgeDays: finite(findValue(record, "productAgeDays")),
      activeCreatorCount: finite(findValue(record, "activeCreatorCount")),
      videosOver1MViews: finite(findValue(record, "videosOver1MViews")),
      totalSales: requiredNumbers[0][1]!,
      sales7d: requiredNumbers[1][1]!,
      sales28d: finite(findValue(record, "sales28d")),
      sales30d: finite(findValue(record, "sales30d")),
      sales90d: finite(findValue(record, "sales90d")),
      yesterdaySales: finite(findValue(record, "yesterdaySales")),
      price: finite(findValue(record, "price")),
      commissionAfterAdsPct: finite(findValue(record, "commissionAfterAdsPct")),
      rating: finite(findValue(record, "rating")),
      videoSalesPct: finite(findValue(record, "videoSalesPct")),
      liveSalesPct: finite(findValue(record, "liveSalesPct")),
      productCardSalesPct: finite(findValue(record, "productCardSalesPct")),
      topVideoSalesPct: finite(findValue(record, "topVideoSalesPct")),
      dailySales,
    });
  });
  return { rows, errors };
}

export function csvTemplate(): string {
  return "provider,externalProductId,productName,category,productUrl,productAgeDays,totalSales,sales7d,sales30d,sales90d,yesterdaySales,price,commissionAfterAdsPct,rating,videoSalesPct,liveSalesPct,productCardSalesPct,topVideoSalesPct,dailySalesJson\nFastMoss,example-001,Example Magnesium Complex,supplements,https://example.com/product,120,12000,2200,5200,18000,360,24.99,12,4.6,72,18,10,34,\"[{\\\"date\\\":\\\"2026-09-01\\\",\\\"units\\\":\\\"120\\\"},{\\\"date\\\":\\\"2026-09-02\\\",\\\"units\\\":\\\"125\\\"}]\"\n";
}
