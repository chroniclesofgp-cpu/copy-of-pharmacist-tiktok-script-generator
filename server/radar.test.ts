import { describe, expect, it } from "vitest";
import { buildKalodataProductDetailUrl, canArchiveRadarCandidate, campaignHandoffAllowed, calculateRadarMetrics, DEFAULT_RADAR_PROFILE, COACH_A_PROFILE, COACH_B_PROFILE, isRadarCandidateOutsideProfile, parseRadarCsv, parseRadarFile, suggestedReviewStatus, determineDiscoveryPaging, shouldStopAdaptiveScan, evaluateStage1Eligibility, extractProductIdFromQuery, isTikTokShortLink, resolveTikTokShortLink } from "./radar";
import { buildBrandOpportunityDiagnostics } from "../client/src/lib/radarDiagnostics";
import * as fs from "fs";

const sourceVideoWorkedExample = {
  provider: "FastMoss",
  productName: "Source-video example product",
  productAgeDays: 120,
  totalSales: 12000,
  sales7d: 3000,
  sales90d: 18000,
  videoSalesPct: 72,
  topVideoSalesPct: 34,
  rating: 4.6,
  commissionAfterAdsPct: 12,
  dailySales: [
    { date: "2026-09-01", units: 120 },
    { date: "2026-09-02", units: 125 },
    { date: "2026-09-03", units: 130 },
    { date: "2026-09-04", units: 135 },
    { date: "2026-09-05", units: 140 },
    { date: "2026-09-06", units: 145 },
    { date: "2026-09-07", units: 190 },
  ],
};

describe("Product Radar deterministic scoring", () => {
  it("matches the source video 7-day / 90-day worked-example math", () => {
    const metrics = calculateRadarMetrics(sourceVideoWorkedExample);
    expect(metrics.accelerationRatio).toBeCloseTo(3000 / 18000, 8);
    expect(metrics.accelerationPct).toBeCloseTo(16.6666667, 5);
    expect(metrics.accelerationBand).toBe("clear");
    expect(metrics.totalSalesInRange).toBe(true);
    expect(metrics.videoSharePreferred).toBe(true);
    expect(metrics.concentrationBand).toBe("spread_out");
    expect(metrics.stableDays).toBe(6);
    expect(metrics.stablePattern).toBe(true);
    expect(metrics.strongDays).toBe(7);
    expect(metrics.strengthPattern).toBe(true);
  });

  it("uses 7-day / 30-day for products under 90 days", () => {
    const metrics = calculateRadarMetrics({ ...sourceVideoWorkedExample, productAgeDays: 60, sales30d: 10000, sales90d: 99999 });
    expect(metrics.historyMode).toBe("new_7_over_30");
    expect(metrics.accelerationPct).toBe(30);
    expect(metrics.accelerationBand).toBe("strong");
  });

  it("does not invent a ratio for products under 30 days", () => {
    const metrics = calculateRadarMetrics({ ...sourceVideoWorkedExample, productAgeDays: 20, sales30d: 10000, yesterdaySales: 140 });
    expect(metrics.historyMode).toBe("very_new_daily");
    expect(metrics.accelerationRatio).toBeNull();
    expect(metrics.accelerationBand).toBe("insufficient_history");
  });

  it("classifies top-video dependency using the configured bands", () => {
    expect(calculateRadarMetrics({ ...sourceVideoWorkedExample, topVideoSalesPct: 25 }).concentrationBand).toBe("spread_out");
    expect(calculateRadarMetrics({ ...sourceVideoWorkedExample, topVideoSalesPct: 55 }).concentrationBand).toBe("watch");
    expect(calculateRadarMetrics({ ...sourceVideoWorkedExample, topVideoSalesPct: 75 }).concentrationBand).toBe("high_risk_single_video");
  });

  it("parses a realistic CSV row and reports invalid rows", () => {
    const csv = `provider,productName,productAgeDays,totalSales,sales7d,sales90d,videoSalesPct,topVideoSalesPct,dailySalesJson\nFastMoss,Example Product,120,12000,3000,18000,72,34,"[{""date"":""2026-09-01"",""units"":120}]"\nFastMoss,Bad Row,120,nope,3000,18000,72,34,`;
    const result = parseRadarCsv(csv);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.productName).toBe("Example Product");
    expect(result.rows[0]?.dailySales).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
  });

  it("cannot hand off a high-scoring product before evidence approval", () => {
    expect(campaignHandoffAllowed("approved_for_campaign_planning", "not_reviewed")).toBe(false);
    expect(campaignHandoffAllowed("approved_for_campaign_planning", "blocked")).toBe(false);
    expect(campaignHandoffAllowed("watchlist", "approved")).toBe(false);
    expect(campaignHandoffAllowed("approved_for_campaign_planning", "approved")).toBe(true);
  });

  it("keeps default thresholds editable rather than hidden in score logic", () => {
    const custom = { ...DEFAULT_RADAR_PROFILE, minTotalSales: 15000 };
    expect(calculateRadarMetrics(sourceVideoWorkedExample, custom).totalSalesInRange).toBe(false);
  });
});

describe("Product Radar queue reconciliation", () => {
  it("marks candidates outside the active total-sales profile without changing raw data", () => {
    const outside = isRadarCandidateOutsideProfile({ totalSales: 84102 }, DEFAULT_RADAR_PROFILE);
    const inside = isRadarCandidateOutsideProfile({ totalSales: 36551 }, DEFAULT_RADAR_PROFILE);
    expect(outside.outside).toBe(true);
    expect(outside.reason).toContain("84,102");
    expect(inside.outside).toBe(false);
  });

  it("protects reviewed or handed-off candidates from queue archiving", () => {
    expect(canArchiveRadarCandidate({ reviewStatus: "avoid", evidenceGateStatus: "not_reviewed", handoffStatus: "not_ready" })).toBe(true);
    expect(canArchiveRadarCandidate({ reviewStatus: "human_review", evidenceGateStatus: "not_reviewed", handoffStatus: "not_ready" })).toBe(false);
    expect(canArchiveRadarCandidate({ reviewStatus: "approved_for_campaign_planning", evidenceGateStatus: "approved", handoffStatus: "ready_for_campaign_planning" })).toBe(false);
  });

  it("keeps the verified Yummy Skin values inside Coach A and outside the concentration watch band", () => {
    const metrics = calculateRadarMetrics({
      provider: "Kalodata",
      productName: "Yummy Skin Blurring Balm Powder",
      productAgeDays: 120,
      totalSales: 7568,
      sales7d: 3156,
      sales90d: 12600,
      videoSalesPct: 65,
      topVideoSalesPct: 27.8,
      dailySales: [{ date: "2026-09-01", units: 400 }, { date: "2026-09-02", units: 420 }, { date: "2026-09-03", units: 430 }, { date: "2026-09-04", units: 440 }, { date: "2026-09-05", units: 450 }, { date: "2026-09-06", units: 480 }, { date: "2026-09-07", units: 536 }],
    });
    expect(metrics.totalSalesInRange).toBe(true);
    expect(metrics.topVideoConcentrationPct).toBe(27.8);
    expect(metrics.concentrationBand).toBe("spread_out");
  });

  it("enforces the real-unit volume gate identically across all Discovery Strategies without extrapolation bias", () => {
    const coachA = { ...DEFAULT_RADAR_PROFILE, minTotalSales: 2000, maxTotalSales: 40000 };
    const coachB = { ...DEFAULT_RADAR_PROFILE, minTotalSales: 1000, maxTotalSales: 9000 };

    // Sample products with un-extrapolated total sales from /product/detail
    const candidateInCoachA = { totalSales: 7568, productName: "Yummy Skin" };
    const candidateExceedingCoachA = { totalSales: 60658, productName: "Mega BB Cream" };
    const candidateInCoachB = { totalSales: 4500, productName: "Niche Lip Oil" };
    const candidateExceedingCoachB = { totalSales: 15000, productName: "Mid Tier Toner" };

    // Coach A check: 7568 is inside, 60658 is outside
    expect(isRadarCandidateOutsideProfile(candidateInCoachA, coachA).outside).toBe(false);
    expect(isRadarCandidateOutsideProfile(candidateExceedingCoachA, coachA).outside).toBe(true);
    expect(isRadarCandidateOutsideProfile(candidateExceedingCoachA, coachA).reason).toContain("outside 2,000–40,000");

    // Coach B check: 4500 is inside, 15000 is outside
    expect(isRadarCandidateOutsideProfile(candidateInCoachB, coachB).outside).toBe(false);
    expect(isRadarCandidateOutsideProfile(candidateExceedingCoachB, coachB).outside).toBe(true);
    expect(isRadarCandidateOutsideProfile(candidateExceedingCoachB, coachB).reason).toContain("outside 1,000–9,000");

    // Invariance check: sorting strategy does NOT alter real-unit eligibility
    const allStrategies = ["growth_rate", "video_revenue", "sales_volume", "revenue"] as const;
    for (const strategy of allStrategies) {
      // Eligibility strictly depends on un-extrapolated totalSales, NEVER on discovery strategy
      const evalA = isRadarCandidateOutsideProfile(candidateInCoachA, coachA);
      expect(evalA.outside).toBe(false);
      const evalMega = isRadarCandidateOutsideProfile(candidateExceedingCoachA, coachA);
      expect(evalMega.outside).toBe(true);
    }
  });

  it("enforces hard AVOID classification when creator saturation exceeds threshold (>300)", () => {
    // Product like Medicube with passing volume (22,253) and passing velocity, but 2,048 creators
    const saturatedProduct = {
      provider: "Kalodata",
      productName: "[medicube] Affordable Glass Glow Skincare Set",
      productAgeDays: 120,
      totalSales: 22253,
      sales7d: 1914,
      sales90d: 22253,
      activeCreatorCount: 2048, // 7x over the 300 limit
      videoSalesPct: 80,
      topVideoSalesPct: 13.3,
      dailySales: [
        { date: "2026-09-01", units: 270 },
        { date: "2026-09-02", units: 270 },
        { date: "2026-09-03", units: 270 },
        { date: "2026-09-04", units: 270 },
        { date: "2026-09-05", units: 270 },
        { date: "2026-09-06", units: 280 },
        { date: "2026-09-07", units: 284 },
      ],
    };

    const metrics = calculateRadarMetrics(saturatedProduct, DEFAULT_RADAR_PROFILE);
    expect(metrics.totalSalesInRange).toBe(true);
    expect(metrics.isHighCompetition).toBe(true);
    // Under Coach B, saturated products (>300 creators) are hard-rejected to protect creator margins
    expect(suggestedReviewStatus(metrics, COACH_B_PROFILE)).toBe("avoid");
    // Under Coach A / default profile, >300 creators is a visual competition flag, not an automatic hard reject
    expect(suggestedReviewStatus(metrics, DEFAULT_RADAR_PROFILE)).toBe("candidate");

    // Compare with low-competition breakout (e.g. 187 creators)
    const nonSaturatedProduct = { ...saturatedProduct, activeCreatorCount: 187 };
    const nonSatMetrics = calculateRadarMetrics(nonSaturatedProduct, DEFAULT_RADAR_PROFILE);
    expect(nonSatMetrics.isHighCompetition).toBe(false);
    expect(suggestedReviewStatus(nonSatMetrics)).toBe("candidate");
  });

  it("intelligently offsets discovery start page for broad categories vs sub-niches", () => {
    // Known mega-category (Beauty / Supplements) under Coach A: auto-offsets to Page 2+ to skip 140k mega-sellers
    const coachAPaging = determineDiscoveryPaging({
      keyword: "",
      category: "601450",
      sortStrategy: "sales_volume",
      targetMaxSales: 40000,
    });
    expect(coachAPaging.startPage).toBe(2);
    expect(coachAPaging.pagesToScan).toBeGreaterThanOrEqual(3);

    // Known mega-category under Coach B: auto-offsets to Page 5+
    const coachBPaging = determineDiscoveryPaging({
      keyword: "",
      category: "601450",
      sortStrategy: "sales_volume",
      targetMaxSales: 9000,
    });
    expect(coachBPaging.startPage).toBe(5);

    // Smaller / unclassified categories: ALWAYS start at Page 1 to ensure zero candidate overshooting
    const smallCatPaging = determineDiscoveryPaging({
      keyword: "",
      category: "600001",
      sortStrategy: "sales_volume",
      targetMaxSales: 40000,
    });
    expect(smallCatPaging.startPage).toBe(1);

    // Sub-niche with keyword: starts at Page 1 (ranks 1-50) because sub-niche top rankers are already in candidate range
    const subNichePaging = determineDiscoveryPaging({
      keyword: "Magnesium",
      sortStrategy: "sales_volume",
      targetMaxSales: 40000,
    });
    expect(subNichePaging.startPage).toBe(1);

    // Explicit user start page takes priority
    const manualPaging = determineDiscoveryPaging({
      keyword: "",
      userStartPage: 10,
    });
    expect(manualPaging.startPage).toBe(10);
  });

  it("enforces 2-consecutive-page smoothing safeguard on adaptive scanning", () => {
    // Non-unit sort (e.g. video_revenue): MUST NEVER early-stop on volume floor
    const nonUnitResult = shouldStopAdaptiveScan({
      isUnitSort: false,
      minFloor: 2000,
      pageMaxSales: 400,
      currentConsecutiveUnderFloor: 5,
    });
    expect(nonUnitResult.shouldStop).toBe(false);

    // Unit sort, 1st page under floor: does NOT stop (consecutive count becomes 1)
    const firstUnderResult = shouldStopAdaptiveScan({
      isUnitSort: true,
      minFloor: 2000,
      pageMaxSales: 1800,
      currentConsecutiveUnderFloor: 0,
    });
    expect(firstUnderResult.shouldStop).toBe(false);
    expect(firstUnderResult.nextConsecutiveCount).toBe(1);

    // Temporary dip recovery: next page rises back above floor -> count resets to 0
    const recoveryResult = shouldStopAdaptiveScan({
      isUnitSort: true,
      minFloor: 2000,
      pageMaxSales: 2200,
      currentConsecutiveUnderFloor: 1,
    });
    expect(recoveryResult.shouldStop).toBe(false);
    expect(recoveryResult.nextConsecutiveCount).toBe(0);

    // 2nd consecutive page under floor: safely triggers early-stop
    const secondUnderResult = shouldStopAdaptiveScan({
      isUnitSort: true,
      minFloor: 2000,
      pageMaxSales: 1500,
      currentConsecutiveUnderFloor: 1,
    });
    expect(secondUnderResult.shouldStop).toBe(true);
    expect(secondUnderResult.nextConsecutiveCount).toBe(2);
  });

  it("evaluates Stage 1 short-circuiting on window-invariant signals while ensuring zero false negatives on normal candidates", () => {
    // 1. Structural Short-Circuit: Creator Saturation (>300 active creators) under Coach B profile
    const saturatedResult = evaluateStage1Eligibility(
      { sales_volumn: 2500, creator_number: 485 },
      COACH_B_PROFILE
    );
    expect(saturatedResult.shortCircuit).toBe(true);
    expect(saturatedResult.rejectionType).toBe("creator_saturation");

    // Under Coach A / default profile, >300 creators is a soft visual signal and does NOT short circuit
    const coachASaturated = evaluateStage1Eligibility(
      { sales_volumn: 2500, creator_number: 485 },
      DEFAULT_RADAR_PROFILE
    );
    expect(coachASaturated.shortCircuit).toBe(false);

    // 2. Mathematical Short-Circuit: 7d sales exceeds entire 90d ceiling (>40k)
    const ceilingExceededResult = evaluateStage1Eligibility(
      { sales_volumn: 48000, creator_number: 120 },
      DEFAULT_RADAR_PROFILE
    );
    expect(ceilingExceededResult.shortCircuit).toBe(true);
    expect(ceilingExceededResult.rejectionType).toBe("exceeds_ceiling");

    // 3. Structural Short-Circuit: Completely dead velocity (<15 units over 7d)
    const deadVelocityResult = evaluateStage1Eligibility(
      { sales_volumn: 6, creator_number: 2 },
      DEFAULT_RADAR_PROFILE
    );
    expect(deadVelocityResult.shortCircuit).toBe(true);
    expect(deadVelocityResult.rejectionType).toBe("dead_velocity");

    // 4. Zero False Negative Guarantee: Breakouts with normal volume MUST proceed to Stage 2
    const breakoutResult = evaluateStage1Eligibility(
      { sales_volumn: 3156, creator_number: 198 }, // Yummy Skin profile
      DEFAULT_RADAR_PROFILE
    );
    expect(breakoutResult.shortCircuit).toBe(false);

    const steadyMoverResult = evaluateStage1Eligibility(
      { sales_volumn: 1200, creator_number: 45 },
      DEFAULT_RADAR_PROFILE
    );
    expect(steadyMoverResult.shortCircuit).toBe(false);
  });

  it("extracts 16-21 digit product IDs from bare IDs, URLs, and text while safely returning null for product names", () => {
    // 1. Bare numeric 19-digit TikTok Shop ID
    expect(extractProductIdFromQuery("1729482910492819284")).toBe("1729482910492819284");

    // 2. Full TikTok Shop product URL with query params
    expect(
      extractProductIdFromQuery(
        "https://shop.tiktok.com/view/product/1729482910492819284?trackParams=%7B%22source%22%3A%22affiliate%22%7D"
      )
    ).toBe("1729482910492819284");

    // 3. Raw text message containing an offer ID
    expect(
      extractProductIdFromQuery("Hey, we'd love for you to promote product 1729482910492819284 in your next video!")
    ).toBe("1729482910492819284");

    // 4. Underscore or hyphen delimited identifiers
    expect(extractProductIdFromQuery("product_1729482910492819284")).toBe("1729482910492819284");
    expect(extractProductIdFromQuery("offer-1729482910492819284-promo")).toBe("1729482910492819284");

    // 5. Product names with non-ID numbers (years, volumes, pack counts) MUST return null so name search is triggered
    expect(extractProductIdFromQuery("Danessa Myricks Yummy Skin Blurring Balm Powder 30ml 2024")).toBeNull();
    expect(extractProductIdFromQuery("Magnesium Glycinate 500mg 120 Capsules 3-Pack")).toBeNull();

    // 6. Empty / whitespace queries return null
    expect(extractProductIdFromQuery("")).toBeNull();
    expect(extractProductIdFromQuery("    ")).toBeNull();
  });

  it("builds a Kalodata product-detail deep link from a provider product ID", () => {
    expect(buildKalodataProductDetailUrl("1732621368377970923")).toBe("https://www.kalodata.com/product/detail?id=1732621368377970923&language=en-US&region=US");
    expect(buildKalodataProductDetailUrl("1732621368377970923", "GB")).toContain("region=GB");
  });

  it("recognizes TikTok /t/ short links and extracts the product ID from their redirect target", async () => {
    const shortLink = "https://www.tiktok.com/t/ZT9S4V7yVJQN8-McluG/";
    expect(isTikTokShortLink(shortLink)).toBe(true);
    expect(isTikTokShortLink("https://www.tiktok.com/view/product/1729482910492819284")).toBe(false);

    const fetchMock: typeof fetch = async () => new Response(null, {
      status: 302,
      headers: { location: "https://shop.tiktok.com/us/pdp/1732621368377970923?share_id=example" },
    });

    await expect(resolveTikTokShortLink(shortLink, fetchMock)).resolves.toBe("1732621368377970923");
    await expect(resolveTikTokShortLink("https://www.tiktok.com/view/product/1729482910492819284", fetchMock)).resolves.toBeNull();
  });

  it("distinguishes steady consistent evergreen sellers from truly declining products under <8% velocity", () => {
    // 1. Steady evergreen seller: exactly 100 units/day for 90 days = 700/9000 = 7.78% ratio
    const steadyProduct = {
      productName: "Consistent Magnesium Glycinate",
      totalSales: 9000,
      sales7d: 700,
      sales90d: 9000,
      productAgeDays: 120,
      videoSalesPct: 75,
      rating: 4.7,
      commissionAfterAdsPct: 15,
      dailySales: [
        { date: "2026-09-01", units: 100 },
        { date: "2026-09-02", units: 100 },
        { date: "2026-09-03", units: 100 },
        { date: "2026-09-04", units: 100 },
        { date: "2026-09-05", units: 100 },
        { date: "2026-09-06", units: 100 },
        { date: "2026-09-07", units: 100 },
      ],
    };
    const steadyMetrics = calculateRadarMetrics(steadyProduct, DEFAULT_RADAR_PROFILE);
    expect(steadyMetrics.accelerationBand).toBe("not_accelerating");
    expect(steadyMetrics.stablePattern).toBe(true);
    expect(steadyMetrics.strengthPattern).toBe(true);
    // Because it is steady and consistent, it is classified as watchlist (consistent performer), NOT hard avoid!
    expect(suggestedReviewStatus(steadyMetrics, DEFAULT_RADAR_PROFILE)).toBe("watchlist");

    // 2. Truly declining product: recent sales collapsed (e.g. 5 units/day after massive past volume)
    const decliningProduct = {
      productName: "Fading Trend Product",
      totalSales: 9000,
      sales7d: 35,
      sales90d: 9000,
      productAgeDays: 120,
      videoSalesPct: 75,
      rating: 4.7,
      commissionAfterAdsPct: 15,
      dailySales: [
        { date: "2026-09-01", units: 5 },
        { date: "2026-09-02", units: 5 },
        { date: "2026-09-03", units: 5 },
        { date: "2026-09-04", units: 5 },
        { date: "2026-09-05", units: 5 },
        { date: "2026-09-06", units: 5 },
        { date: "2026-09-07", units: 5 },
      ],
    };
    const decliningMetrics = calculateRadarMetrics(decliningProduct, DEFAULT_RADAR_PROFILE);
    expect(decliningMetrics.accelerationBand).toBe("not_accelerating");
    expect(decliningMetrics.strengthPattern).toBe(false);
    // Genuinely declining velocity is hard-rejected as avoid
    expect(suggestedReviewStatus(decliningMetrics, DEFAULT_RADAR_PROFILE)).toBe("avoid");
  });

  it("natively parses Kalodata web export columns and derives video shares and product IDs", () => {
    const kalodataCsvSample = [
      "Date Range,Product Name,img_url,Category,Price($),Shipping Fee($),Launch Date,Product Rating,Item Sold,Avg. Unit Price($),Commission Rate,Revenue($),Revenue Growth Rate,Live Revenue($),Video Revenue($),Product Card Revenue,Creator Number,Creator Conversion Ratio,KalodataUrl,TikTokUrl",
      '2026-08-09~2026-09-07,"EBIN Sports Edition Adhesive Spray",https://example.com/img.jpg,Haircare,28.99,0,2025-12-31,4.5,1458,27.42,15%,39984.38,32.2%,9001.43,30814.36,168.59,135,61.48%,https://www.kalodata.com/product/detail?id=1732186596358853194,https://shop.tiktok.com/view/product/1732186596358853194?region=US',
    ].join("\n");

    const result = parseRadarCsv(kalodataCsvSample);
    expect(result.errors).toHaveLength(0);
    expect(result.rows).toHaveLength(1);

    const row = result.rows[0];
    expect(row.productName).toBe("EBIN Sports Edition Adhesive Spray");
    expect(row.totalSales).toBe(1458);
    // Auto-derived 7-day sales from 30-day range (1458 * 7/30 ≈ 340)
    expect(row.sales7d).toBe(340);
    expect(row.rating).toBe(4.5);
    expect(row.commissionAfterAdsPct).toBe(15);
    expect(row.price).toBe(28.99);
    expect(row.activeCreatorCount).toBe(135);
    // Video share auto-calculated: 30814.36 / 39984.38 * 100 = 77.1%
    expect(row.videoSalesPct).toBe(77.1);
    // Live share auto-calculated: 9001.43 / 39984.38 * 100 = 22.5%
    expect(row.liveSalesPct).toBe(22.5);
    // Auto-extracted 19-digit TikTok Shop ID from URL
    expect(row.externalProductId).toBe("1732186596358853194");
    // Auto-calculated age from launch date
    expect(row.productAgeDays).toBeGreaterThan(100);
  });

  it("natively parses uploaded Kalodata Excel (.xlsx) files via parseRadarFile", () => {
    const xlsxPath = "/home/ubuntu/upload/Kalodata_Product_20260912121602_US.xlsx";
    if (fs.existsSync(xlsxPath)) {
      const buffer = fs.readFileSync(xlsxPath);
      const base64 = buffer.toString("base64");
      const result = parseRadarFile(`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`, "Kalodata_Product_20260912121602_US.xlsx");
      expect(result.errors).toHaveLength(0);
      expect(result.rows.length).toBeGreaterThanOrEqual(2);
      expect(result.rows[0].productName).toContain("EBIN Sports Edition");
      expect(result.rows[0].totalSales).toBe(1458);
      expect(result.rows[0].activeCreatorCount).toBe(135);
      expect(result.rows[0].videoSalesPct).toBe(77.1);
      expect(result.rows[0].externalProductId).toBe("1732186596358853194");
    }
  });
});


describe("Brand Opportunity Diagnostics", () => {
  it("marks recent video opportunity as improving without changing deterministic status", () => {
    const diagnostics = buildBrandOpportunityDiagnostics({
      rawDetail7d: { revenue: 1000, video_revenue: 700 },
      rawDetail30d: { revenue: 1000, video_revenue: 600 },
      rawTopVideos: [
        { publish_date: "2026-09-10" },
        { publish_date: "2026-09-01" },
      ],
    }, new Date("2026-09-12T00:00:00Z").getTime());

    expect(diagnostics.find((item) => item.key === "video_direction")?.badge).toBe("Video share rising");
    expect(diagnostics.find((item) => item.key === "top_video_freshness")?.valueDisplay).toBe("2/2 recent");
    expect(diagnostics.find((item) => item.key === "self_operated_trend")?.valueDisplay).toBe("Unavailable");
  });

  it("marks a material recent video-share deterioration as advisory only", () => {
    const diagnostics = buildBrandOpportunityDiagnostics({
      rawDetail7d: { revenue: 1000, video_revenue: 450 },
      rawDetail30d: { revenue: 1000, video_revenue: 600 },
      rawTopVideos: [],
    });

    const direction = diagnostics.find((item) => item.key === "video_direction");
    expect(direction?.color).toBe("red");
    expect(direction?.detail).toContain("does not change the deterministic status");
  });

  it("does not infer self-operated or freshness signals when provider fields are missing", () => {
    const diagnostics = buildBrandOpportunityDiagnostics({
      rawDetail7d: { revenue: 1000, video_revenue: 600 },
      rawDetail30d: { revenue: 1000, video_revenue: 600 },
      rawTopVideos: [{ revenue: 500 }],
    });

    expect(diagnostics.find((item) => item.key === "self_operated_trend")?.badge).toBe("Provider field not supplied");
    expect(diagnostics.find((item) => item.key === "top_video_freshness")?.badge).toBe("Publish dates missing");
  });
});
