import { describe, expect, it } from "vitest";
import {
  calculateRadarMetrics,
  COACH_A_PROFILE,
  COACH_B_PROFILE,
  DEFAULT_RADAR_PROFILE,
  parseRadarCsv,
  type RadarRawRow,
} from "./radar";

describe("Competitor Count, 1M+ Video Backing, and Switchable Profiles", () => {
  it("parses active_creators and videos_over_1m from CSV columns", () => {
    const csv = `product_name,total_sales,sales_7d,active_creators,videos_over_1m\n"Test Berberine",4500,800,240,3`;
    const result = parseRadarCsv(csv);
    expect(result.errors).toHaveLength(0);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].productName).toBe("Test Berberine");
    expect(result.rows[0].activeCreatorCount).toBe(240);
    expect(result.rows[0].videosOver1MViews).toBe(3);
  });

  it("evaluates creator competition threshold correctly (flag > 300)", () => {
    const manageableRow: RadarRawRow = {
      provider: "manual_csv",
      productName: "Manageable Competition Product",
      totalSales: 5000,
      sales7d: 800,
      sales90d: 5000,
      activeCreatorCount: 150,
      videosOver1MViews: 2,
      dailySales: [],
    };

    const metricsManageable = calculateRadarMetrics(manageableRow, DEFAULT_RADAR_PROFILE);
    expect(metricsManageable.activeCreatorCount).toBe(150);
    expect(metricsManageable.isHighCompetition).toBe(false);
    expect(metricsManageable.hasHighViewVideoBacking).toBe(true);

    const saturatedRow: RadarRawRow = {
      ...manageableRow,
      productName: "Saturated Competition Product",
      activeCreatorCount: 420, // > 300 threshold
      videosOver1MViews: 0,
    };

    const metricsSaturated = calculateRadarMetrics(saturatedRow, DEFAULT_RADAR_PROFILE);
    expect(metricsSaturated.activeCreatorCount).toBe(420);
    expect(metricsSaturated.isHighCompetition).toBe(true);
    expect(metricsSaturated.hasHighViewVideoBacking).toBe(false);
    expect(metricsSaturated.confidenceNotes.some((n) => n.includes("High creator competition"))).toBe(true);
  });

  it("evaluates candidate differently under Coach A (2k-40k) vs Coach B (1k-9k) without hardcoding", () => {
    // Candidate with 15,000 total sales (fits Coach A, exceeds Coach B)
    const midVolumeRow: RadarRawRow = {
      provider: "manual_csv",
      productName: "Mid Volume Product",
      totalSales: 15000,
      sales7d: 2500,
      sales90d: 15000,
      dailySales: [],
    };

    const coachAMetrics = calculateRadarMetrics(midVolumeRow, COACH_A_PROFILE);
    expect(coachAMetrics.totalSalesInRange).toBe(true); // 15,000 is within 2,000–40,000

    const coachBMetrics = calculateRadarMetrics(midVolumeRow, COACH_B_PROFILE);
    expect(coachBMetrics.totalSalesInRange).toBe(false); // 15,000 exceeds 1,000–9,000

    // Candidate with 1,500 total sales (below Coach A, fits Coach B)
    const earlyBreakoutRow: RadarRawRow = {
      provider: "manual_csv",
      productName: "Early Breakout Product",
      totalSales: 1500,
      sales7d: 300,
      sales30d: 1500,
      productAgeDays: 45,
      dailySales: [],
    };

    const earlyCoachA = calculateRadarMetrics(earlyBreakoutRow, COACH_A_PROFILE);
    expect(earlyCoachA.totalSalesInRange).toBe(false); // 1,500 < 2,000 min

    const earlyCoachB = calculateRadarMetrics(earlyBreakoutRow, COACH_B_PROFILE);
    expect(earlyCoachB.totalSalesInRange).toBe(true); // 1,500 is within 1,000–9,000
  });
});
