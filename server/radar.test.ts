import { describe, expect, it } from "vitest";
import { canArchiveRadarCandidate, campaignHandoffAllowed, calculateRadarMetrics, DEFAULT_RADAR_PROFILE, isRadarCandidateOutsideProfile, parseRadarCsv } from "./radar";

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
});
