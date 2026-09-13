import { describe, expect, it } from "vitest";
import { hasUsableKalodataDetail, KalodataAdapter } from "./kalodata";
import { calculateRadarMetrics, DEFAULT_RADAR_PROFILE } from "./radar";

describe("KalodataAdapter", () => {
  it("does not treat a snapshot with no detail response as usable sales data", () => {
    expect(hasUsableKalodataDetail({ productId: "1732293553906094315", fetchedAt: "2026-09-13T00:00:00.000Z", rawTopVideos: [] })).toBe(false);
    expect(hasUsableKalodataDetail({ productId: "1732293553906094315", fetchedAt: "2026-09-13T00:00:00.000Z", rawDetail7d: { product_id: "1732293553906094315", product_name: "Example", revenue: 100, video_revenue: 80, live_revenue: 20, sales_volumn: 10, commission_rate: 15 }, rawTopVideos: [] })).toBe(true);
  });

  it("reports masked key correctly when configured", () => {
    const adapter = new KalodataAdapter({ apiKey: "12345678-abcd-ef01-2345-6789abcdef01" });
    expect(adapter.hasKey()).toBe(true);
    expect(adapter.getMaskedKey()).toBe("1234••••••••ef01");
  });

  it("reports unconfigured when key is empty", () => {
    const adapter = new KalodataAdapter({ apiKey: "" });
    expect(adapter.hasKey()).toBe(false);
    expect(adapter.getMaskedKey()).toBe("Not configured");
  });

  it("maps Kalodata snapshot to RadarRawRow with correct metrics", () => {
    const adapter = new KalodataAdapter({ apiKey: "test-key" });
    const snapshot = {
      productId: "1729448464509734958",
      fetchedAt: "2026-09-09T12:00:00.000Z",
      rawRank: {
        product_id: "1729448464509734958",
        product_name: "Toplux Magnesium Complex 8 Essential Magnesium Supplement",
        revenue: 394324.64,
        commission_rate: 25,
        sales_volumn: 25966,
        video_revenue: 302513.04,
        live_revenue: 91198.76,
        launch_date: "2024-11-11",
      },
      rawDetail7d: {
        product_id: "1729448464509734958",
        product_name: "Toplux Magnesium Complex 8 Essential Magnesium Supplement",
        revenue: 394324.64,
        video_revenue: 302513.04,
        live_revenue: 91198.76,
        sales_volumn: 25966,
        commission_rate: 25,
        product_review_count: 520,
        launch_date: "2024-11-11",
      },
      rawDetail30d: {
        product_id: "1729448464509734958",
        product_name: "Toplux Magnesium Complex 8 Essential Magnesium Supplement",
        revenue: 2120347.23,
        video_revenue: 1650000,
        live_revenue: 470000,
        sales_volumn: 139413,
        commission_rate: 25,
      },
      rawDetail90d: {
        product_id: "1729448464509734958",
        product_name: "Toplux Magnesium Complex 8 Essential Magnesium Supplement",
        revenue: 5310000.00,
        video_revenue: 4100000,
        live_revenue: 1210000,
        sales_volumn: 348912,
        commission_rate: 25,
      },
      rawTopVideos: [
        {
          video_id: "7681727984826404110",
          video_title: "Top magnesium video review",
          revenue: 13883.34,
          belonged_creator_handle: "trendtoksetter31",
        },
      ],
    };

    const rawRow = adapter.mapSnapshotToRadarRawRow(snapshot);
    expect(rawRow.provider).toBe("Kalodata");
    expect(rawRow.externalProductId).toBe("1729448464509734958");
    expect(rawRow.sales7d).toBe(25966);
    expect(rawRow.sales30d).toBe(139413);
    expect(rawRow.totalSales).toBe(348912); // Exact rawDetail90d, zero multipliers
    expect(rawRow.videoSalesPct).toBeCloseTo((302513.04 / 394324.64) * 100, 1);
    expect(rawRow.topVideoSalesPct).toBeCloseTo((13883.34 / 302513.04) * 100, 1);
    expect(rawRow.dailySales).toHaveLength(7);

    const metrics = calculateRadarMetrics(rawRow, DEFAULT_RADAR_PROFILE);
    expect(metrics.historyMode).toBe("mature_7_over_90");
    expect(metrics.videoSharePreferred).toBe(true);
    expect(metrics.concentrationBand).toBe("spread_out"); // 4.6% < 40%
  });
});
