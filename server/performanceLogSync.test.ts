import { describe, expect, it } from "vitest";
import { upsertPerformanceLogSync } from "./performanceLogSync";

const input = {
  videoNumber: 23,
  postDate: "2026-08-15",
  tiktokUrl: "https://www.tiktok.com/@dealsbygp/video/123",
  scriptFile: "BACKUP_LAUNCH_01",
  hookType: "Ask a Pharmacist",
  product: "Education-first / no product",
  ctaId: "U-02",
  urgencyTrigger: "conditional-cart FOMO",
  filmingDayCheck: "conditional_cart" as const,
  screenshotUrl: "https://storage.example.com/analytics.png",
  metrics: {
    views: 1200,
    avgWatchTimeSec: 9.4,
    avgWatchTimePct: 31,
    likes: 75,
    saves: 18,
    shares: 12,
    comments: 9,
    follows: 14,
  },
  diagnosis: "Strong follower conversion.",
  action: "Replicate the question-led hook.",
};

describe("performance log screenshot sync", () => {
  it("creates a reviewed analytics block with the extracted metrics", () => {
    const result = upsertPerformanceLogSync("# Performance Log\n", input);

    expect(result).toContain("## App-Synced Analytics");
    expect(result).toContain("App-Synced Analytics — Video 23");
    expect(result).toContain("| 1,200 | 9.4s | 31% | 75 | 18 | 12 | 9 | 14 |");
    expect(result).toContain("**CTA experiment:** U-02 — conditional-cart FOMO");
    expect(result).toContain("**Filming-day check:** conditional_cart");
  });

  it("replaces an earlier sync for the same video instead of duplicating it", () => {
    const first = upsertPerformanceLogSync("# Performance Log\n", input);
    const second = upsertPerformanceLogSync(first, {
      ...input,
      metrics: { ...input.metrics, views: 1500 },
    });

    expect(second.match(/App-Synced Analytics — Video 23/g)).toHaveLength(1);
    expect(second).toContain("| 1,500 | 9.4s | 31% | 75 | 18 | 12 | 9 | 14 |");
  });
});
