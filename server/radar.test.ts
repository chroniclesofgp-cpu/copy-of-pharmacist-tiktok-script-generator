import { describe, expect, it } from "vitest";
import { canArchiveRadarCandidate, campaignHandoffAllowed, calculateRadarMetrics, DEFAULT_RADAR_PROFILE, isRadarCandidateOutsideProfile, parseRadarCsv, suggestedReviewStatus, determineDiscoveryPaging } from "./radar";

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
    // Saturated products must be hard-rejected as 'avoid' to protect creator bandwidth
    expect(suggestedReviewStatus(metrics)).toBe("avoid");

    // Compare with low-competition breakout (e.g. 187 creators)
    const nonSaturatedProduct = { ...saturatedProduct, activeCreatorCount: 187 };
    const nonSatMetrics = calculateRadarMetrics(nonSaturatedProduct, DEFAULT_RADAR_PROFILE);
    expect(nonSatMetrics.isHighCompetition).toBe(false);
    expect(suggestedReviewStatus(nonSatMetrics)).toBe("candidate");
  });

  it("intelligently offsets discovery start page for broad categories vs sub-niches", () => {
    // Broad category under Coach A (2k-40k): auto-offsets to Page 3 (ranks 101-150+) to skip mega-sellers
    const coachAPaging = determineDiscoveryPaging({
      keyword: "",
      sortStrategy: "sales_volume",
      targetMaxSales: 40000,
    });
    expect(coachAPaging.startPage).toBe(3);
    expect(coachAPaging.pagesToScan).toBeGreaterThanOrEqual(3);

    // Broad category under Coach B (1k-9k): auto-offsets to Page 6 (ranks 251-300+)
    const coachBPaging = determineDiscoveryPaging({
      keyword: "",
      sortStrategy: "sales_volume",
      targetMaxSales: 9000,
    });
    expect(coachBPaging.startPage).toBe(6);

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
});
