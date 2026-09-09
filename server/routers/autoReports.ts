/**
 * Auto Reports Router
 *
 * Handles fetching and updating scheduled TikTok video analysis reports.
 * Reports are created by the AGENT cron every 3 days and stored in scheduledVideoReports.
 * Users can add metrics per video and trigger AI diagnosis.
 */
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import { invokeLLM } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";
import { scheduledVideoReports } from "../../drizzle/schema";
import type { VideoAnalysisReport, VideoAnalysisEntry } from "../scheduledVideoAnalysis";

// ─── Diagnosis Thresholds ─────────────────────────────────────────────────────
// Based on the RxContent performance framework
const DIAGNOSIS_THRESHOLDS = {
  BREAKOUT_VIEWS: 10000,
  GOOD_WATCH_TIME: 50,       // % watch time considered good
  LOW_WATCH_TIME: 25,        // % watch time indicating hook/early drop problem
  GOOD_SAVES_RATIO: 0.02,    // saves/views ratio indicating consideration
  GMV_THRESHOLD: 50,         // minimum $ GMV to consider converting
};

export const autoReportsRouter = router({
  // ─── Get all reports (list view) ─────────────────────────────────────────
  getReports: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const reports = await db
      .select()
      .from(scheduledVideoReports)
      .orderBy(desc(scheduledVideoReports.createdAt))
      .limit(20);

    return reports.map(r => ({
      id: r.id,
      runDate: r.runDate,
      videosFound: r.videosFound ?? 0,
      videosAnalyzed: r.videosAnalyzed ?? 0,
      status: r.status ?? "complete",
      createdAt: r.createdAt,
      // Parse report to get summary info
      videoSummaries: (() => {
        try {
          const parsed = JSON.parse(r.reportJson) as VideoAnalysisReport;
          return parsed.videos.map(v => ({
            videoUrl: v.videoUrl,
            postDate: v.postDate,
            hookType: v.hookType,
            spokenHook: v.spokenHook,
            qualityFlags: v.qualityFlags ?? [],
            hasMetrics: !!(v.views !== undefined && v.views !== null),
            diagnosis: v.diagnosis ?? null,
          }));
        } catch {
          return [];
        }
      })(),
    }));
  }),

  // ─── Get single report with full detail ──────────────────────────────────
  getReport: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [report] = await db
        .select()
        .from(scheduledVideoReports)
        .where(eq(scheduledVideoReports.id, input.id))
        .limit(1);

      if (!report) throw new TRPCError({ code: "NOT_FOUND", message: "Report not found" });

      try {
        const parsed = JSON.parse(report.reportJson) as VideoAnalysisReport;
        return { ...report, parsedReport: parsed };
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to parse report" });
      }
    }),

  // ─── Update metrics for a video in a report ──────────────────────────────
  updateVideoMetrics: protectedProcedure
    .input(z.object({
      reportId: z.number(),
      videoUrl: z.string(),
      metrics: z.object({
        views: z.number().optional(),
        watchTimePct: z.number().optional(),
        avgWatchSec: z.string().optional(),
        saves: z.number().optional(),
        shares: z.number().optional(),
        comments: z.number().optional(),
        gmv: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [report] = await db
        .select()
        .from(scheduledVideoReports)
        .where(eq(scheduledVideoReports.id, input.reportId))
        .limit(1);

      if (!report) throw new TRPCError({ code: "NOT_FOUND", message: "Report not found" });

      const parsed = JSON.parse(report.reportJson) as VideoAnalysisReport;
      const videoIndex = parsed.videos.findIndex(v => v.videoUrl === input.videoUrl);
      if (videoIndex === -1) throw new TRPCError({ code: "NOT_FOUND", message: "Video not found in report" });

      // Merge metrics into the video entry
      parsed.videos[videoIndex] = {
        ...parsed.videos[videoIndex],
        ...input.metrics,
      };

      await db
        .update(scheduledVideoReports)
        .set({ reportJson: JSON.stringify(parsed) })
        .where(eq(scheduledVideoReports.id, input.reportId));

      return { ok: true };
    }),

  // ─── Run AI diagnosis for a video ────────────────────────────────────────
  diagnoseVideo: protectedProcedure
    .input(z.object({
      reportId: z.number(),
      videoUrl: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [report] = await db
        .select()
        .from(scheduledVideoReports)
        .where(eq(scheduledVideoReports.id, input.reportId))
        .limit(1);

      if (!report) throw new TRPCError({ code: "NOT_FOUND", message: "Report not found" });

      const parsed = JSON.parse(report.reportJson) as VideoAnalysisReport;
      const video = parsed.videos.find(v => v.videoUrl === input.videoUrl);
      if (!video) throw new TRPCError({ code: "NOT_FOUND", message: "Video not found in report" });

      if (!video.views && video.views !== 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Add metrics before running diagnosis" });
      }

      // Build the diagnosis prompt
      const prompt = buildDiagnosisPrompt(video);

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a TikTok content performance analyst for a pharmacist creator (@dealsbygp). 
You diagnose why videos performed the way they did and give specific, actionable next steps.
Your diagnoses are precise, not generic. You always name the specific section that failed and why.
You output structured JSON only.`,
          },
          { role: "user" as const, content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "video_diagnosis",
            strict: true,
            schema: {
              type: "object",
              properties: {
                verdict: {
                  type: "string",
                  enum: ["BREAKOUT", "HIDDEN GEM", "Iterate", "Remake", "Retire"],
                  description: "Overall performance verdict",
                },
                failedSection: {
                  type: "string",
                  description: "The specific section that underperformed: hook, gap, education, product-reveal, cta, or none",
                },
                rootCause: {
                  type: "string",
                  description: "One sentence explaining exactly why this video performed the way it did",
                },
                evidence: {
                  type: "string",
                  description: "Which metrics support this diagnosis (e.g. 'watch time of 18% confirms viewers left before the gap was established')",
                },
                nextAction: {
                  type: "string",
                  description: "Specific, actionable next step — not generic advice. E.g. 'Remake with instruction-correction hook, keep the education section verbatim, refilm only the first 8 seconds'",
                },
                whatWorked: {
                  type: "string",
                  description: "What part of the video did work and should be kept in any iteration",
                },
                priorityScore: {
                  type: "number",
                  description: "1-10 score for how urgently this needs to be acted on (10 = act immediately)",
                },
              },
              required: ["verdict", "failedSection", "rootCause", "evidence", "nextAction", "whatWorked", "priorityScore"],
              additionalProperties: false,
            },
          },
        },
      });

      const diagnosisText = (response.choices[0]?.message?.content as string) ?? "{}";
      const diagnosis = JSON.parse(diagnosisText);

      // Save diagnosis back to the report
      const videoIndex = parsed.videos.findIndex(v => v.videoUrl === input.videoUrl);
      parsed.videos[videoIndex] = {
        ...parsed.videos[videoIndex],
        diagnosis: diagnosis.verdict,
        iterationNotes: `${diagnosis.rootCause} | Next: ${diagnosis.nextAction}`,
      };

      await db
        .update(scheduledVideoReports)
        .set({ reportJson: JSON.stringify(parsed) })
        .where(eq(scheduledVideoReports.id, input.reportId));

      return { diagnosis, video: parsed.videos[videoIndex] };
    }),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDiagnosisPrompt(video: VideoAnalysisEntry): string {
  const metricsSection = `
PERFORMANCE METRICS:
- Views: ${video.views ?? "not entered"}
- Watch time: ${video.watchTimePct ?? "not entered"}%
- Avg watch: ${video.avgWatchSec ?? "not entered"}
- Saves: ${video.saves ?? "not entered"}
- Shares: ${video.shares ?? "not entered"}
- Comments: ${video.comments ?? "not entered"}
- GMV: ${video.gmv ?? "not entered"}
`;

  const contentSection = `
CONTENT STRUCTURE ANALYSIS:
- Hook type: ${video.hookType}
- Hook framework: ${video.hookFramework}
- Spoken hook: "${video.spokenHook}"
- Text overlay hook: ${video.textOverlayHook ?? "none"}
- Section sequence: ${(video.sectionSequence ?? []).join(" → ")}
- Overlay strategy: ${video.overlayStrategy}
- Product reveal timing: ${video.productRevealTiming}
- CTA delivery: ${video.ctaDelivery}
- Credential placement: ${video.credentialPlacement}
- Estimated runtime: ${video.estimatedRuntime}
- Quality flags: ${(video.qualityFlags ?? []).join(", ") || "none"}
`;

  const thresholds = `
PERFORMANCE THRESHOLDS FOR THIS CREATOR:
- BREAKOUT = 10,000+ views
- Good watch time = 50%+ 
- Low watch time = under 25% (hook or early-drop problem)
- Good saves ratio = 2%+ of views (consideration stage)
- Converting GMV = $50+
- HIDDEN GEM = under 5,000 views but 60%+ watch time and/or $50+ GMV
`;

  return `Diagnose this TikTok video performance for pharmacist creator @dealsbygp.
${metricsSection}
${contentSection}
${thresholds}

Based on the metrics and content structure, diagnose:
1. What is the overall verdict (BREAKOUT / HIDDEN GEM / Iterate / Remake / Retire)?
2. Which specific section failed (hook, gap, education, product-reveal, cta, or none)?
3. What is the root cause in one sentence?
4. What evidence from the metrics supports this?
5. What is the specific next action (not generic — name the exact hook type, section, or line to change)?
6. What worked and should be kept?
7. Priority score 1-10 for urgency.`;
}
