export type AccelerationBand = "not_accelerating" | "starting" | "clear" | "strong" | "insufficient_history";
import * as XLSX from "xlsx";
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
  enforceCreatorSaturationAsHardAvoid?: boolean;
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
  enforceCreatorSaturationAsHardAvoid: false,
};

export const COACH_A_PROFILE: RadarProfileConfig = {
  ...DEFAULT_RADAR_PROFILE,
  minTotalSales: 2000,
  maxTotalSales: 40000,
  enforceCreatorSaturationAsHardAvoid: false,
};

export const COACH_B_PROFILE: RadarProfileConfig = {
  ...DEFAULT_RADAR_PROFILE,
  minTotalSales: 1000,
  maxTotalSales: 9000,
  enforceCreatorSaturationAsHardAvoid: true,
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
  if (value === undefined || value === null) return undefined;
  const str = String(value).replace(/[,$%]/g, "").trim();
  if (str === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(str);
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

export interface Stage1CheckResult {
  shortCircuit: boolean;
  reason?: string;
  rejectionType?: "creator_saturation" | "exceeds_ceiling" | "dead_velocity";
}

/**
 * Two-Stage Gating Stage 1: Short-circuit only on mathematically and structurally window-invariant signals.
 * - Creator Saturation (>300 creators in 7d): Already saturated today; 30d/90d count can only be equal or higher.
 * - Sales 7d > maxTotalSales (>40k units): Mathematically impossible for 90d sales to be <= 40k.
 * - Dead Velocity (<15 units over 7d): Averaging <2 units/day, cannot mathematically achieve >=8% acceleration ratio.
 * - ALL OTHER PRODUCTS (50 to 40,000 units) MUST PROCEED to Stage 2 (last30Day, last90Day, topVideos) for zero false negatives.
 */
export function evaluateStage1Eligibility(
  detail7d: { sales_volumn?: number; creator_number?: number } | null | undefined,
  profile: RadarProfileConfig
): Stage1CheckResult {
  if (!detail7d) return { shortCircuit: false };

  const sales7d = Number(detail7d.sales_volumn || 0);
  const creatorNumber = Number(detail7d.creator_number || 0);

  // 1. Creator Saturation: Only short-circuit if profile explicitly enforces it as hard avoid (e.g. Coach B)
  if (profile.enforceCreatorSaturationAsHardAvoid && creatorNumber > profile.highCompetitionCreatorThreshold) {
    return {
      shortCircuit: true,
      reason: `Creator saturation breached in 7d snapshot (${creatorNumber} creators > ${profile.highCompetitionCreatorThreshold} ceiling)`,
      rejectionType: "creator_saturation",
    };
  }

  // 2. 7-Day sales already exceeds the entire 90-day ceiling (mathematically impossible to be <= ceiling at 90d)
  if (sales7d > profile.maxTotalSales) {
    return {
      shortCircuit: true,
      reason: `7-day sales (${sales7d.toLocaleString()}) already exceeds the ${profile.maxTotalSales.toLocaleString()} ceiling`,
      rejectionType: "exceeds_ceiling",
    };
  }

  // 3. Completely dead velocity (<15 units over 7 days = mathematically cannot reach >=8% velocity ratio)
  if (sales7d < 15) {
    return {
      shortCircuit: true,
      reason: `Velocity collapsed (${sales7d} units over 7 days, cannot meet 8% acceleration ratio)`,
      rejectionType: "dead_velocity",
    };
  }

  // All other products MUST proceed to Stage 2 (30d, 90d, and videos)
  return { shortCircuit: false };
}

export function canArchiveRadarCandidate(candidate: { reviewStatus: string; evidenceGateStatus: string; handoffStatus: string }): boolean {
  return candidate.reviewStatus !== "human_review" && candidate.reviewStatus !== "approved_for_campaign_planning" && candidate.evidenceGateStatus !== "approved" && candidate.handoffStatus === "not_ready";
}

/**
 * Extracts a 16-21 digit TikTok Shop / Kalodata product ID from raw text or product URLs.
 */
export function extractProductIdFromQuery(query: string): string | null {
  if (!query) return null;
  const clean = query.trim();
  const match = clean.match(/(?:^|[^\d])(\d{16,21})(?:[^\d]|$)/);
  return match ? match[1] : null;
}

const TIKTOK_SHORT_LINK_HOSTS = new Set(["www.tiktok.com", "t.tiktok.com", "vm.tiktok.com"]);

export function buildKalodataProductDetailUrl(productId: string | number, region = "US"): string {
  return `https://www.kalodata.com/product/detail?id=${encodeURIComponent(String(productId))}&language=en-US&region=${encodeURIComponent(region)}`;
}

export function isTikTokShortLink(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return (url.protocol === "https:" || url.protocol === "http:")
      && TIKTOK_SHORT_LINK_HOSTS.has(url.hostname.toLowerCase())
      && /^\/t\//i.test(url.pathname);
  } catch {
    return false;
  }
}

/**
 * Resolve a TikTok /t/ share link to the numeric Shop product ID embedded in
 * its redirect target. Only TikTok short-link hosts are allowed, and the
 * redirect chain is deliberately capped to avoid turning this into a general
 * URL fetcher.
 */
export async function resolveTikTokShortLink(
  value: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  if (!isTikTokShortLink(value)) return null;

  let currentUrl = value.trim();
  for (let hop = 0; hop < 5; hop += 1) {
    const response = await fetchImpl(currentUrl, { method: "HEAD", redirect: "manual" });
    const location = response.headers.get("location");
    if (location) {
      const nextUrl = new URL(location, currentUrl).toString();
      const productId = extractProductIdFromQuery(nextUrl);
      if (productId) return productId;
      currentUrl = nextUrl;
      continue;
    }

    const responseUrlProductId = extractProductIdFromQuery(response.url);
    if (responseUrlProductId) return responseUrlProductId;
    if (response.status < 300 || response.status >= 400) break;
  }

  return null;
}

export function suggestedReviewStatus(metrics: RadarMetrics, profile?: RadarProfileConfig): ReviewStatus {
  // Hard Rejections:
  // 1. Outside target total sales volume window
  if (!metrics.totalSalesInRange) {
    return "avoid";
  }

  // 2. Velocity evaluation:
  // Differentiate steady/flat consistent performers from declining products:
  // A uniform flat product has 7d/90d = 7.78%. If it has a steady, consistent pattern
  // (5+ stable days, 2+ days >=100 units), it is consistent money, NOT an automatic hard avoid.
  // Only truly collapsing / dead products (no stable pattern, dead velocity) remain hard AVOID.
  if (metrics.accelerationBand === "not_accelerating") {
    if (metrics.stablePattern && metrics.strengthPattern) {
      return "watchlist"; // Consistent evergreen seller
    }
    return "avoid"; // Genuinely declining / dead velocity
  }

  // 3. Creator saturation (>300 active creators):
  // Hard avoid ONLY if profile explicitly enforces it (e.g. Coach B).
  // Under Coach A / default, it is a visual competition flag, not an automatic rejection.
  if (metrics.isHighCompetition && profile?.enforceCreatorSaturationAsHardAvoid) {
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
  provider: ["provider", "source"],
  externalProductId: ["externalProductId", "product_id", "product id", "id", "kalodataurl", "tiktokurl"],
  productName: ["productName", "product_name", "product", "name", "product name"],
  category: ["category", "niche"],
  productUrl: ["productUrl", "product_url", "url", "tiktokurl", "kalodataurl", "tiktok url", "kalodata url"],
  productAgeDays: ["productAgeDays", "product_age_days", "age_days"],
  launchDate: ["launch date", "launch_date", "launchdate"],
  dateRange: ["date range", "date_range", "dates"],
  totalSales: ["totalSales", "total_sales", "total units sold", "total units", "item sold", "items sold", "item_sold", "items_sold"],
  sales7d: ["sales7d", "7d sales", "7 day sales", "7_days", "day7_sales_volumn", "7-day sales"],
  sales30d: ["sales30d", "30d sales", "30 day sales", "day30_sales_volumn"],
  sales90d: ["sales90d", "90d sales", "90 day sales", "day90_sales_volumn"],
  sales28d: ["sales28d", "28d sales", "28 day sales"],
  yesterdaySales: ["yesterdaySales", "yesterday sales"],
  price: ["price", "price($)", "price $", "avg. unit price($)", "avg. unit price"],
  commissionAfterAdsPct: ["commissionAfterAdsPct", "commission after ads", "commission %", "commission", "commission rate", "commission_rate"],
  rating: ["rating", "stars", "product rating", "product_rating"],
  revenue: ["revenue", "revenue($)", "revenue $", "gmv", "total revenue"],
  videoRevenue: ["video revenue", "video revenue($)", "video_revenue"],
  liveRevenue: ["live revenue", "live revenue($)", "live_revenue"],
  productCardRevenue: ["product card revenue", "product card revenue($)", "product_card_revenue"],
  videoSalesPct: ["videoSalesPct", "video sales %", "video share"],
  liveSalesPct: ["liveSalesPct", "live sales %"],
  productCardSalesPct: ["productCardSalesPct", "product card sales %"],
  topVideoSalesPct: ["topVideoSalesPct", "top video concentration", "top video %"],
  activeCreatorCount: ["activeCreatorCount", "active_creator_count", "active_creators", "creator_count", "creators", "competitor_count", "competitor_creators", "active creators", "creator number", "creator_number"],
  videosOver1MViews: ["videosOver1MViews", "videos_over_1m_views", "videos_over_1m", "videos_1m_views", "high_view_videos", "1m_videos", "viral_videos", "1m+ videos", "videos > 1m"],
  dailySales: ["dailySalesJson", "daily sales json", "daily_sales_json"],
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
    if (!productName) { errors.push({ row: index + 2, message: "Product name is required." }); return; }

    const totalSales = finite(findValue(record, "totalSales"));
    if (totalSales === undefined) {
      errors.push({ row: index + 2, message: "Missing or invalid numeric field: totalSales (or Item Sold)." });
      return;
    }

    let sales7d = finite(findValue(record, "sales7d"));
    let sales30d = finite(findValue(record, "sales30d"));
    const sales90d = finite(findValue(record, "sales90d"));

    // Gracefully handle exports where only a single date range (like 30-day Item Sold) was exported:
    if (sales7d === undefined) {
      const dateRangeStr = String(findValue(record, "dateRange") || "").toLowerCase();
      if (dateRangeStr.includes("7day") || dateRangeStr.includes("7 day") || dateRangeStr.includes("7d")) {
        sales7d = totalSales;
      } else {
        sales30d = sales30d ?? totalSales;
        sales7d = Math.round(totalSales * (7 / 30));
      }
    }

    // Auto-calculate video and revenue share percentages if revenue breakdown was exported:
    let videoSalesPct = finite(findValue(record, "videoSalesPct"));
    let liveSalesPct = finite(findValue(record, "liveSalesPct"));
    let productCardSalesPct = finite(findValue(record, "productCardSalesPct"));
    const totalRev = finite(findValue(record, "revenue"));
    const videoRev = finite(findValue(record, "videoRevenue"));
    const liveRev = finite(findValue(record, "liveRevenue"));
    const cardRev = finite(findValue(record, "productCardRevenue"));

    if (totalRev && totalRev > 0) {
      if (videoSalesPct === undefined && videoRev !== undefined) {
        videoSalesPct = Number(((videoRev / totalRev) * 100).toFixed(1));
      }
      if (liveSalesPct === undefined && liveRev !== undefined) {
        liveSalesPct = Number(((liveRev / totalRev) * 100).toFixed(1));
      }
      if (productCardSalesPct === undefined && cardRev !== undefined) {
        productCardSalesPct = Number(((cardRev / totalRev) * 100).toFixed(1));
      }
    }

    // Auto-extract product ID and URL:
    const productUrl = findValue(record, "productUrl") || undefined;
    const rawExternalId = findValue(record, "externalProductId") || undefined;
    let externalProductId: string | undefined = undefined;
    if (rawExternalId) {
      externalProductId = extractProductIdFromQuery(rawExternalId) || rawExternalId;
    } else if (productUrl) {
      externalProductId = extractProductIdFromQuery(productUrl) || undefined;
    }

    // Auto-calculate product age from Launch Date if present:
    let productAgeDays = finite(findValue(record, "productAgeDays"));
    if (productAgeDays === undefined) {
      const launchDateStr = findValue(record, "launchDate");
      if (launchDateStr) {
        const launchTime = new Date(launchDateStr).getTime();
        if (!isNaN(launchTime)) {
          productAgeDays = Math.max(1, Math.round((Date.now() - launchTime) / (1000 * 60 * 60 * 24)));
        }
      }
    }

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
      externalProductId,
      productName,
      category: findValue(record, "category") || undefined,
      productUrl,
      productAgeDays,
      activeCreatorCount: finite(findValue(record, "activeCreatorCount")),
      videosOver1MViews: finite(findValue(record, "videosOver1MViews")),
      totalSales,
      sales7d,
      sales28d: finite(findValue(record, "sales28d")),
      sales30d,
      sales90d,
      yesterdaySales: finite(findValue(record, "yesterdaySales")),
      price: finite(findValue(record, "price")),
      commissionAfterAdsPct: finite(findValue(record, "commissionAfterAdsPct")),
      rating: finite(findValue(record, "rating")),
      videoSalesPct,
      liveSalesPct,
      productCardSalesPct,
      topVideoSalesPct: finite(findValue(record, "topVideoSalesPct")),
      dailySales,
    });
  });
  return { rows, errors };
}

/**
 * Parses either a CSV text or a base64-encoded XLSX/XLS file buffer into RadarRawRow entries.
 */
export function parseRadarFile(content: string, fileName?: string): CsvValidationResult {
  const isExcel = Boolean(fileName?.match(/\.xlsx?$/i) || content.startsWith("data:"));
  if (isExcel) {
    try {
      const base64Data = content.includes(";base64,") ? content.split(";base64,")[1] : content;
      const buffer = Buffer.from(base64Data, "base64");
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const csv = XLSX.utils.sheet_to_csv(firstSheet);
      return parseRadarCsv(csv);
    } catch (err: any) {
      return { rows: [], errors: [{ row: 1, message: `Failed to parse Excel file: ${err.message}` }] };
    }
  }
  return parseRadarCsv(content);
}

export function csvTemplate(): string {
  return "provider,externalProductId,productName,category,productUrl,productAgeDays,totalSales,sales7d,sales30d,sales90d,yesterdaySales,price,commissionAfterAdsPct,rating,videoSalesPct,liveSalesPct,productCardSalesPct,topVideoSalesPct,dailySalesJson\nFastMoss,example-001,Example Magnesium Complex,supplements,https://example.com/product,120,12000,2200,5200,18000,360,24.99,12,4.6,72,18,10,34,\"[{\\\"date\\\":\\\"2026-09-01\\\",\\\"units\\\":\\\"120\\\"},{\\\"date\\\":\\\"2026-09-02\\\",\\\"units\\\":\\\"125\\\"}]\"\n";
}
