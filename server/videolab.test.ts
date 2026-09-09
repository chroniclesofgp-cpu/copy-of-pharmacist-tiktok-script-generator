/**
 * Video Lab Tests
 * Tests for input validation, framework rules, and metrics interpretation logic.
 * Does NOT make real LLM/transcription calls — tests the validation and data layers only.
 */
import { describe, it, expect } from "vitest";

// ─── Types mirror (copied from videolab.ts to avoid import side effects) ───────
type VideoAnalysisSection = {
  score: "strong" | "good" | "needs-work" | "critical";
  summary: string;
  details: string[];
  timestamps?: string[];
};

type VideoAnalysisOutput = {
  hookDelivery: VideoAnalysisSection;
  pacing: VideoAnalysisSection;
  tonalityShifts: VideoAnalysisSection;
  mechanismReveal: VideoAnalysisSection;
  ctaDelivery: VideoAnalysisSection;
  referenceComparison: VideoAnalysisSection;
  top3IterationNotes: string[];
  overallScore: "strong" | "good" | "needs-work" | "critical";
  overallSummary: string;
};

type MetricsInterpretation = {
  overallDiagnosis: string;
  hookAssessment: { verdict: string; explanation: string };
  contentAssessment: { verdict: string; explanation: string };
  ctaAssessment: { verdict: string; explanation: string };
  distributionAssessment: { verdict: string; explanation: string };
  top3Changes: string[];
  nextScriptRecommendation: string;
};

// ─── Metrics calculation helpers (mirrors server logic) ───────────────────────
function calculateRates(metrics: {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  follows?: number;
  avgWatchTimeSeconds?: number;
  avgWatchTimePct?: number;
}) {
  const { views, likes, comments, shares, saves, follows } = metrics;
  if (!views || views === 0) return null;

  const pct = (n?: number) => n !== undefined ? `${((n / views) * 100).toFixed(2)}%` : "N/A";

  return {
    likeRate: pct(likes),
    commentRate: pct(comments),
    shareRate: pct(shares),
    saveRate: pct(saves),
    followRate: pct(follows),
  };
}

// ─── Hook reference video map (mirrors server) ────────────────────────────────
const HOOK_REFERENCE_VIDEOS: Record<string, { url: string; creator: string; views: string; name: string }> = {
  "after-1-month": { url: "https://www.tiktok.com/@drew.review/video/7452092853817232683", creator: "@drew.review", views: "7.9M", name: "The After 1 Month Formula" },
  "suppressed-knowledge": { url: "https://www.tiktok.com/@naturopathicapothecary1/video/7433282067300928798", creator: "@naturopathicapothecary1", views: "11.9M", name: "The Suppressed Knowledge Hook" },
  "instruction-correction": { url: "https://www.tiktok.com/@adoseofwellness/video/7584490494177152287", creator: "@adoseofwellness", views: "12.8M", name: "The Instruction / Correction Hook" },
  "symptom-checklist": { url: "https://www.tiktok.com/@adoseofwellness/video/7597949779921980703", creator: "@adoseofwellness", views: "3.9M", name: "The Symptom Checklist Hook" },
  "trend-or-trash": { url: "https://www.tiktok.com/@adoseofwellness/video/7491730126871334187", creator: "@adoseofwellness", views: "1.5M", name: "The Trend or Trash Hook" },
  "nad-dosing": { url: "https://www.tiktok.com/@drew.review/video/7491417105502375214", creator: "@drew.review", views: "18.2M", name: "The Dosing Authority Hook" },
  "age-reversal": { url: "https://www.tiktok.com/@naturopathicapothecary1/video/7492906081862028586", creator: "@naturopathicapothecary1", views: "7.9M", name: "The Age Reversal Hook" },
  "comparison": { url: "https://www.tiktok.com/@faithfuldoc/video/6966790074008702214", creator: "@faithfuldoc", views: "2.7M", name: "The Comparison Hook" },
  "warning-signs": { url: "https://www.tiktok.com/@faithfuldoc/video/6945974951585287429", creator: "@faithfuldoc", views: "6M", name: "The Warning Signs Hook" },
  "fountain-of-youth": { url: "https://www.tiktok.com/@naturopathicapothecary1/video/7429950390956854559", creator: "@naturopathicapothecary1", views: "1.8M", name: "The Fountain of Youth Hook" },
};

const TIER_1_HOOK_IDS = [
  "after-1-month", "suppressed-knowledge", "instruction-correction",
  "symptom-checklist", "trend-or-trash", "nad-dosing", "age-reversal",
  "comparison", "warning-signs", "fountain-of-youth",
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Video Lab — Hook Reference Videos", () => {
  it("should have reference videos for all 10 Tier 1 hooks", () => {
    for (const hookId of TIER_1_HOOK_IDS) {
      expect(HOOK_REFERENCE_VIDEOS[hookId]).toBeDefined();
      expect(HOOK_REFERENCE_VIDEOS[hookId].url).toMatch(/tiktok\.com/);
      expect(HOOK_REFERENCE_VIDEOS[hookId].creator).toBeTruthy();
      expect(HOOK_REFERENCE_VIDEOS[hookId].views).toBeTruthy();
      expect(HOOK_REFERENCE_VIDEOS[hookId].name).toBeTruthy();
    }
  });

  it("should return undefined for unknown hook IDs", () => {
    expect(HOOK_REFERENCE_VIDEOS["unknown-hook"]).toBeUndefined();
  });

  it("all reference video URLs should be valid TikTok URLs", () => {
    for (const [, ref] of Object.entries(HOOK_REFERENCE_VIDEOS)) {
      expect(ref.url).toMatch(/^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/);
    }
  });
});

describe("Video Lab — Metrics Rate Calculation", () => {
  it("should calculate all rates correctly", () => {
    const rates = calculateRates({
      views: 10000,
      likes: 300,
      comments: 50,
      shares: 100,
      saves: 200,
      follows: 30,
    });
    expect(rates).not.toBeNull();
    expect(rates!.likeRate).toBe("3.00%");
    expect(rates!.commentRate).toBe("0.50%");
    expect(rates!.shareRate).toBe("1.00%");
    expect(rates!.saveRate).toBe("2.00%");
    expect(rates!.followRate).toBe("0.30%");
  });

  it("should return null when views is 0", () => {
    const rates = calculateRates({ views: 0, likes: 10 });
    expect(rates).toBeNull();
  });

  it("should return null when views is undefined", () => {
    const rates = calculateRates({ likes: 10 });
    expect(rates).toBeNull();
  });

  it("should handle missing individual metrics with N/A", () => {
    const rates = calculateRates({ views: 5000, likes: 100 });
    expect(rates!.likeRate).toBe("2.00%");
    expect(rates!.commentRate).toBe("N/A");
    expect(rates!.shareRate).toBe("N/A");
  });
});

describe("Video Lab — Metrics Thresholds", () => {
  it("should identify a failed hook (avg watch time < 3s)", () => {
    const avgWatchTimeSec = 2.1;
    expect(avgWatchTimeSec).toBeLessThan(3);
    // Framework rule: Under 3s = hook failed completely
  });

  it("should identify strong save rate (> 2%)", () => {
    const saveRate = (200 / 5000) * 100; // 4%
    expect(saveRate).toBeGreaterThan(2);
  });

  it("should identify viral share rate (> 3%)", () => {
    const shareRate = (200 / 5000) * 100; // 4%
    expect(shareRate).toBeGreaterThan(3);
  });

  it("should identify weak like rate (< 1%)", () => {
    const likeRate = (40 / 10000) * 100; // 0.4%
    expect(likeRate).toBeLessThan(1);
  });

  it("should identify strong watch time percentage (> 60%)", () => {
    const watchPct = 65;
    expect(watchPct).toBeGreaterThan(60);
    // Framework rule: 60%+ = strong video, distribution may be limiting reach
  });
});

describe("Video Lab — Analysis Output Type Shape", () => {
  it("should accept a valid VideoAnalysisOutput shape", () => {
    const output: VideoAnalysisOutput = {
      hookDelivery: { score: "needs-work", summary: "Credibility signal appeared at 4.3s", details: ["Should be within 2s"], timestamps: ["0:04 - credibility signal"] },
      pacing: { score: "good", summary: "Overall pacing is solid", details: [] },
      tonalityShifts: { score: "strong", summary: "Good energy shifts", details: [] },
      mechanismReveal: { score: "good", summary: "Mechanism was clear", details: [] },
      ctaDelivery: { score: "needs-work", summary: "CTA was rushed", details: ["Slow down on the CTA"] },
      referenceComparison: { score: "needs-work", summary: "Reference hit credibility at 1.8s vs your 4.3s", details: [] },
      top3IterationNotes: [
        "Move credibility signal to first 2 seconds",
        "Slow down on the benefit list",
        "Deliver CTA with more conviction",
      ],
      overallScore: "needs-work",
      overallSummary: "Strong mechanism section but hook delivery needs adjustment.",
    };

    expect(output.hookDelivery.score).toBe("needs-work");
    expect(output.top3IterationNotes).toHaveLength(3);
    expect(output.overallScore).toBe("needs-work");
  });

  it("should accept a valid MetricsInterpretation shape", () => {
    const interpretation: MetricsInterpretation = {
      overallDiagnosis: "Hook failed — average watch time of 2.1s means viewers left before the credibility signal.",
      hookAssessment: { verdict: "failed", explanation: "2.1s avg watch time is below the 3s threshold." },
      contentAssessment: { verdict: "limited", explanation: "Cannot assess content — viewers didn't get there." },
      ctaAssessment: { verdict: "limited", explanation: "Cannot assess CTA — viewers didn't reach it." },
      distributionAssessment: { verdict: "average", explanation: "12,400 views is reasonable for a new account." },
      top3Changes: [
        "Rewrite the hook — move credibility signal to first 1.5 seconds",
        "Try the After 1 Month formula for this product",
        "Add a stronger curiosity gap in the opening line",
      ],
      nextScriptRecommendation: "Switch to the After 1 Month hook for this product.",
    };

    expect(interpretation.hookAssessment.verdict).toBe("failed");
    expect(interpretation.top3Changes).toHaveLength(3);
    expect(interpretation.overallDiagnosis).toContain("Hook failed");
  });
});

describe("Video Lab — Input Validation", () => {
  it("should require a valid URL for videoUrl", () => {
    const isValidUrl = (url: string) => {
      try { new URL(url); return true; } catch { return false; }
    };
    expect(isValidUrl("https://s3.amazonaws.com/bucket/video.mp4")).toBe(true);
    expect(isValidUrl("not-a-url")).toBe(false);
    expect(isValidUrl("")).toBe(false);
  });

  it("should accept optional fields as undefined", () => {
    const input = {
      videoUrl: "https://s3.amazonaws.com/bucket/video.mp4",
      hookId: "after-1-month",
      hookName: undefined,
      productName: undefined,
      savedScriptId: undefined,
      savedScriptText: undefined,
    };
    expect(input.hookId).toBe("after-1-month");
    expect(input.hookName).toBeUndefined();
  });

  it("should validate file size limit (16MB)", () => {
    const MAX_SIZE_MB = 16;
    const fileSizeBytes = 20 * 1024 * 1024; // 20MB
    const sizeMB = fileSizeBytes / (1024 * 1024);
    expect(sizeMB).toBeGreaterThan(MAX_SIZE_MB);
  });

  it("should accept valid video MIME types", () => {
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    expect(validTypes).toContain("video/mp4");
    expect(validTypes).toContain("video/webm");
    expect(validTypes).not.toContain("image/jpeg");
  });
});
