/**
 * Scheduled Video Analysis Handler
 * 
 * This endpoint is called by the AGENT cron every 3 days.
 * The agent scrapes @dealsbygp TikTok profile, analyzes new videos,
 * and POSTs the structured report here for storage.
 * 
 * Route: POST /api/scheduled/video-analysis
 */

import type { Request, Response } from "express";
import { getDb } from "./db";
import { scheduledVideoReports } from "../drizzle/schema";
import { sdk } from "./_core/sdk";
import type { AuthenticatedUser } from "./_core/sdk";

export interface VideoAnalysisEntry {
  videoUrl: string;
  videoTitle?: string;
  postDate: string;           // ISO date string e.g. "2026-08-04"
  daysOld: number;
  // Content structure analysis
  hookType: string;           // e.g. "instruction-correction", "after-1-month"
  hookFramework: string;      // mapped framework name
  sectionSequence: string[];  // e.g. ["hook", "gap", "education", "product", "cta"]
  spokenHook: string;         // first words spoken
  textOverlayHook?: string;   // on-screen text hook if present
  overlayStrategy: string;    // A/B/C/D/E from playbook
  productRevealed?: string;   // product name if identifiable
  productRevealTiming: string; // "TOF-final-third" | "MOF-middle" | "BOF-early" | "unknown"
  ctaDelivery: string;        // description of CTA
  credentialPlacement: string; // how/when credential shown
  estimatedRuntime: string;   // e.g. "45 sec"
  // Structural quality flags
  qualityFlags: string[];     // any issues detected e.g. ["no-downward-point", "product-revealed-early"]
  // What to retest / iterate
  iterationNotes: string;     // AI observations on what to test next
  // Metrics placeholder (filled in manually by user)
  views?: number;
  watchTimePct?: number;
  avgWatchSec?: string;
  saves?: number;
  shares?: number;
  comments?: number;
  gmv?: string;
  diagnosis?: string;         // BREAKOUT | Iterate | Remake | Retire | HIDDEN GEM
}

export interface VideoAnalysisReport {
  runDate: string;
  tiktokHandle: string;
  lookbackDays: number;
  videosFound: number;
  videosAnalyzed: number;
  videos: VideoAnalysisEntry[];
  agentNotes?: string;        // any notes from the agent about the run
}

export async function scheduledVideoAnalysisHandler(
  req: Request,
  res: Response
) {
  try {
    // Authenticate — must be a cron caller
    let user: AuthenticatedUser;
    try {
      user = await sdk.authenticateRequest(req) as AuthenticatedUser;
    } catch {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!user.isCron) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    const report = req.body as VideoAnalysisReport;

    if (!report || !report.runDate || !Array.isArray(report.videos)) {
      return res.status(400).json({ error: "Invalid report payload" });
    }

    // Store the report
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    await db.insert(scheduledVideoReports).values({
      runDate: report.runDate,
      videosFound: report.videosFound ?? report.videos.length,
      videosAnalyzed: report.videosAnalyzed ?? report.videos.length,
      reportJson: JSON.stringify(report),
      status: "complete",
      scheduleCronTaskUid: user.taskUid ?? null,
    });

    console.log(
      `[ScheduledVideoAnalysis] Report stored for ${report.runDate}: ${report.videosAnalyzed} videos analyzed`
    );

    return res.json({
      ok: true,
      runDate: report.runDate,
      videosAnalyzed: report.videosAnalyzed,
    });
  } catch (error) {
    console.error("[ScheduledVideoAnalysis] Handler error:", error);
    return res.status(500).json({
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { url: req.url, taskUid: req.headers["x-task-uid"] },
      timestamp: new Date().toISOString(),
    });
  }
}
