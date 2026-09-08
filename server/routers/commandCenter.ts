import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { postedVideos, scriptFilmed } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { upsertPerformanceLogSync } from "../performanceLogSync";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function safeReadDir(dirPath: string): string[] {
  try {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath).filter(f => !f.startsWith("."));
  } catch {
    return [];
  }
}

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

// ─── Script inventory ─────────────────────────────────────────────────────────

const SCRIPTS_DIR = path.join(process.cwd(), "scripts");
const PERFORMANCE_LOG_PATH = path.join(process.cwd(), "VIDEO_PERFORMANCE_LOG.md");

const SCRIPT_META: Record<string, { product: string; hookType: string; priority: "HIGH" | "MEDIUM" | "LOW"; notes?: string }> = {
  "SCRIPT_01": { product: "Toplux Magnesium", hookType: "After 1 Month", priority: "HIGH" },
  "SCRIPT_02": { product: "Toplux Magnesium", hookType: "After 1 Month v2 (Coach Ruben)", priority: "HIGH" },
  "SCRIPT_03": { product: "Toplux Magnesium", hookType: "Stress Dysregulation", priority: "HIGH" },
  "SCRIPT_04": { product: "Neuro Gum", hookType: "Instruction/Correction (filmed)", priority: "MEDIUM" },
  "SCRIPT_05": { product: "Neuro Gum", hookType: "Comparison Hook", priority: "HIGH" },
  "SCRIPT_06": { product: "Neuro Gum", hookType: "Instruction/Correction v3", priority: "MEDIUM" },
  "SCRIPT_07": { product: "Medicube Deodorant", hookType: "Symptom Reframe", priority: "HIGH" },
  "SCRIPT_08": { product: "Medicube Kojic", hookType: "Instruction/Correction", priority: "MEDIUM" },
  "SCRIPT_09": { product: "Medicube + Truly Beauty", hookType: "Stack Protocol", priority: "HIGH" },
  "SCRIPT_10": { product: "Medicube vs Dr. Melaxin", hookType: "Comparison", priority: "HIGH" },
  "SCRIPT_11": { product: "Medicube vs Truly Beauty", hookType: "Comparison", priority: "HIGH" },
  "SCRIPT_12": { product: "Dr. Melaxin Gifted Set", hookType: "B12 + Spicule Angle", priority: "MEDIUM" },
  "SCRIPT_12B": { product: "Dr. Melaxin Gifted Set", hookType: "Rebornic-First Angle", priority: "MEDIUM" },
  "SCRIPT_13": { product: "Dr. Melaxin Peel Shot", hookType: "Body Hyperpigmentation", priority: "MEDIUM" },
  "SCRIPT_14": { product: "Loaded Tea", hookType: "Trend or Trash", priority: "HIGH" },
  "SCRIPT_15": { product: "Loaded Tea", hookType: "Ingredient Form", priority: "MEDIUM" },
  "SCRIPT_16": { product: "Loaded Tea vs Bloom", hookType: "Comparison", priority: "HIGH" },
  "SCRIPT_17": { product: "Celsius vs Loaded Tea", hookType: "Comparison", priority: "HIGH" },
  "SCRIPT_18": { product: "CeraVe Mineral Sunscreen", hookType: "Instruction/Correction", priority: "MEDIUM" },
  "SCRIPT_19": { product: "CeraVe vs SKIN1004", hookType: "Comparison", priority: "HIGH" },
  "SCRIPT_20": { product: "SKIN1004 Sun Serum", hookType: "Reactive Skin", priority: "MEDIUM" },
};

// Non-standard filename scripts
const SCRIPT_META_BY_FILENAME: Record<string, { product: string; hookType: string; priority: "HIGH" | "MEDIUM" | "LOW"; notes?: string }> = {
  "neuro-gum-instruction-correction-comparison": { product: "Neuro Gum", hookType: "Instruction/Correction + Comparison Hybrid", priority: "MEDIUM", notes: "Hybrid format — instruction hook with comparison close" },
};

// Campaign script registry — scripts that live inside campaign docs, not standalone files
// These are tracked for filmed status via their stable key in the DB
const CAMPAIGN_SCRIPTS: Array<{ key: string; product: string; hookType: string; priority: "HIGH" | "MEDIUM" | "LOW"; notes?: string; filename: string }> = [
  { key: "HISMILE_V6", product: "HiSmile iD Stain", hookType: "Symptom-Checklist (viral adaptation — gingivitis + thymol)", priority: "HIGH", notes: "Filmed & posted Jul 28, 2026. See HISMILE_campaign.md Video 6.", filename: "campaigns/HISMILE_campaign.md" },
  { key: "HISMILE_V7", product: "HiSmile iD Stain", hookType: "Symptom-Checklist + Suppressed-Knowledge hybrid (biofilm reveal)", priority: "HIGH", notes: "Filmed & posted Jul 28, 2026. See HISMILE_campaign.md Video 7.", filename: "campaigns/HISMILE_campaign.md" },
  { key: "HISMILE_V8", product: "HiSmile iD Stain", hookType: "Suppressed-Knowledge MOF ($500 professional equivalence)", priority: "HIGH", notes: "Filmed & posted Jul 28, 2026. See HISMILE_campaign.md Video 8.", filename: "campaigns/HISMILE_campaign.md" },
  { key: "HISMILE_BOF1", product: "HiSmile iD Stain", hookType: "Apology-Reveal BOF short-form (\"I hate to break the bad news\")", priority: "HIGH", notes: "Filmed & posted Jul 28, 2026. See HISMILE_campaign.md BOF Short-Form Script 1.", filename: "campaigns/HISMILE_campaign.md" },
  { key: "HISMILE_BOFLF", product: "HiSmile iD Stain", hookType: "Apology-Reveal MOF→BOF longer-form (\"It's Not Because\" + education)", priority: "HIGH", notes: "Filmed & posted Jul 28, 2026. See HISMILE_campaign.md Longer-Form Script 6.", filename: "campaigns/HISMILE_campaign.md" },
  { key: "HISMILE_V1", product: "HiSmile iD Stain", hookType: "Myth-Busting TOF (peroxide-free myth)", priority: "MEDIUM", notes: "Not yet filmed. See HISMILE_campaign.md Video 1.", filename: "campaigns/HISMILE_campaign.md" },
  { key: "HISMILE_V2", product: "HiSmile iD Stain", hookType: "Suppressed-Knowledge MOF (thymol = Listerine compound)", priority: "MEDIUM", notes: "Not yet filmed. See HISMILE_campaign.md Video 2.", filename: "campaigns/HISMILE_campaign.md" },
  { key: "HISMILE_V3", product: "HiSmile iD Stain", hookType: "Ingredient-Form MOF (whitening mouthwash vs strips/trays)", priority: "MEDIUM", notes: "Not yet filmed. See HISMILE_campaign.md Video 3.", filename: "campaigns/HISMILE_campaign.md" },
  { key: "HISMILE_V4", product: "HiSmile iD Stain", hookType: "Expert-Verdict BOF (full pharmacist recommendation)", priority: "MEDIUM", notes: "Not yet filmed. See HISMILE_campaign.md Video 4.", filename: "campaigns/HISMILE_campaign.md" },
  { key: "HISMILE_V5", product: "HiSmile iD Stain", hookType: "Suppressed-Knowledge TOF (xylitol is not just a sweetener)", priority: "MEDIUM", notes: "Not yet filmed. See HISMILE_campaign.md Video 5.", filename: "campaigns/HISMILE_campaign.md" },
];

// ─── Intelligence Library inventory ───────────────────────────────────────────

const INTEL_DOCS = [
  { name: "HOOK_FRAMEWORKS.md", category: "Core Framework", description: "Machine-readable doc injected into every script generation call. All 28 hooks with execution rules.", path: "HOOK_FRAMEWORKS.md" },
  { name: "SCRIPT_ARCHITECTURE_GUIDE.md", category: "Core Framework", description: "9 universal structural rules for every pharmacist script. Required reading before scripting.", path: "SCRIPT_ARCHITECTURE_GUIDE.md" },
  { name: "BUYER_PSYCHOLOGY_LEVERS.md", category: "Core Framework", description: "11 conversion psychology levers. Required reading before scripting.", path: "BUYER_PSYCHOLOGY_LEVERS.md" },
  { name: "PHRASE_BANK.md", category: "Core Framework", description: "Verbatim phrases extracted from 5-creator transcript analysis. Required reading before scripting.", path: "PHRASE_BANK.md" },
  { name: "VISUAL_OVERLAY_PLAYBOOK.md", category: "Core Framework", description: "Overlay timing, types, and placement rules. Required reading before scripting.", path: "VISUAL_OVERLAY_PLAYBOOK.md" },
  { name: "HEALTHCARE_HOOK_REFERENCE_GUIDE.md", category: "Core Framework", description: "Human-readable hook reference. 24 healthcare hooks with sample lines, funnel stage, and structural distinction notes.", path: "HEALTHCARE_HOOK_REFERENCE_GUIDE.md" },
  { name: "MASTER_CONTEXT.md", category: "Project Intelligence", description: "Single source of truth for the entire project. Rules, workflows, AI prompting protocol, and all carry-forward items.", path: "MASTER_CONTEXT.md" },
  { name: "VIDEO_PERFORMANCE_LOG.md", category: "Performance Tracking", description: "Full log of all 22 posted videos with analytics, diagnosis, and action items.", path: "VIDEO_PERFORMANCE_LOG.md" },
  { name: "VIDEO_PERFORMANCE_ANALYSIS_FRAMEWORK.md", category: "Performance Tracking", description: "Diagnostic benchmarks, timing protocol, and decision framework for analyzing posted videos.", path: "VIDEO_PERFORMANCE_ANALYSIS_FRAMEWORK.md" },
  { name: "CONTENT_PIPELINE.md", category: "Planning", description: "Current filming queue, write queue, and research gaps.", path: "CONTENT_PIPELINE.md" },
  { name: "CROSS_CREATOR_VALIDATION_GATE.md", category: "Research Methodology", description: "Validation methodology — how to confirm a hook or structure works across multiple creators before promoting it.", path: "CROSS_CREATOR_VALIDATION_GATE.md" },
];

// ─── Creator Research inventory ───────────────────────────────────────────────

const CREATOR_RESEARCH = [
  { handle: "rphreviews", videosAnalyzed: 22, estimatedGMV: "$1.2M+", keyPattern: "Symptom checklist + cortisol reframe. Highest GMV per video in batch.", path: "analysis/creator-deep-dives/rphreviews_deep_dive.md" },
  { handle: "Riva Pharmacy", videosAnalyzed: 18, estimatedGMV: "$900K+", keyPattern: "Rapid-fire symptom delivery (5-7 symptoms at 1/sec). Comparison + conditional close.", path: "analysis/creator-deep-dives/riva_deep_dive.md" },
  { handle: "Drew (pharmacist)", videosAnalyzed: 15, estimatedGMV: "$800K+", keyPattern: "Trend or Trash format. High-energy delivery. Caffeine/energy niche.", path: "analysis/creator-deep-dives/drew_deep_dive.md" },
  { handle: "Dr. Faith", videosAnalyzed: 17, estimatedGMV: "$1.1M+", keyPattern: "Bait and Switch Trust Architecture. Expert verdict + brand-agnostic education.", path: "analysis/creator-deep-dives/drfaith_deep_dive.md" },
  { handle: "naturo", videosAnalyzed: 12, estimatedGMV: "$300K+", keyPattern: "Visual pain point + verbal reinforcement. Skincare niche.", path: "analysis/creator-deep-dives/naturo_deep_dive.md" },
];

// ─── Product Intel inventory ───────────────────────────────────────────────────

const PRODUCT_INTEL_DIR = path.join(process.cwd(), "product-intel");

const PRODUCT_CATEGORIES: Record<string, string> = {
  "toplux": "Supplements",
  "magnesium": "Supplements",
  "neuro": "Energy/Nootropics",
  "loaded": "Energy/Nootropics",
  "celsius": "Energy/Nootropics",
  "bloom": "Energy/Nootropics",
  "medicube": "Skincare",
  "cerave": "Skincare",
  "skin1004": "Skincare",
  "melaxin": "Skincare",
  "truly": "Skincare",
  "neocell": "Supplements",
  "creatine": "Supplements",
  "collagen": "Supplements",
};

function getProductCategory(filename: string): string {
  const lower = filename.toLowerCase();
  for (const [key, cat] of Object.entries(PRODUCT_CATEGORIES)) {
    if (lower.includes(key)) return cat;
  }
  return "Other";
}

// ─── Workflow data ─────────────────────────────────────────────────────────────

const WORKFLOW_STEPS = [
  {
    phase: "Post",
    title: "Immediately After Posting",
    timing: "0–2 hours",
    actions: [
      "Add the video to the Content Pipeline as 'Posted — awaiting analytics'",
      "Note the TikTok URL and post date",
      "Do NOT check analytics yet — data is unreliable in the first 24 hours",
    ],
    color: "blue",
  },
  {
    phase: "48h Check",
    title: "48-Hour Initial Read",
    timing: "48 hours post",
    actions: [
      "Pull the TikTok analytics screenshot (Video Analysis → Overview tab)",
      "Check: Views, Avg Watch Time (seconds), Retention Rate %, Watched Full Video %",
      "If views < 200 at 48h: video may have been suppressed — note it but wait for 7-day read",
      "If watch time % > 15%: strong early signal — monitor for continued distribution",
    ],
    color: "yellow",
  },
  {
    phase: "7-Day Log",
    title: "7-Day Full Analytics Log",
    timing: "7 days post",
    actions: [
      "Pull the final analytics screenshot",
      "Log all metrics: Views, Avg Watch Sec, Watch Time %, Saves, Shares, Comments, GMV, New Followers",
      "Apply the diagnosis framework: BREAKOUT (5K+ views) / Good (1K-5K) / Weak (500-1K) / Problem (<500)",
      "Assign action: Replicate / Iterate / Remake / Retire",
      "Update VIDEO_PERFORMANCE_LOG.md with the full entry",
    ],
    color: "green",
  },
  {
    phase: "Decision",
    title: "Remake vs. Iterate Decision",
    timing: "After 7-day log",
    actions: [
      "BREAKOUT (5K+ views, 15%+ watch time): Replicate structure immediately for next video",
      "Good (1K-5K views): Iterate — keep the body, rewrite only the hook",
      "Weak (500-1K, watch time < 10%): Remake — rewrite hook, keep education body if strong",
      "Problem (<500 views OR watch time < 5%): Remake from scratch — hook and body both failing",
      "HIDDEN GEM (low views but GMV > $0): Iterate — conversion mechanics work, fix the hook only",
    ],
    color: "purple",
  },
  {
    phase: "Script",
    title: "Writing the Next Script",
    timing: "Before filming",
    actions: [
      "Read MASTER_CONTEXT.md Section 9 for the full pre-scripting checklist",
      "Required docs to read: HOOK_FRAMEWORKS.md, SCRIPT_ARCHITECTURE_GUIDE.md, BUYER_PSYCHOLOGY_LEVERS.md, PHRASE_BANK.md, VISUAL_OVERLAY_PLAYBOOK.md, HEALTHCARE_HOOK_REFERENCE_GUIDE.md, product intel doc",
      "Use the Script Generator tool (Generate mode) for new angles, Clone mode for competitor structures, Iterate mode for 70/20/10 variations",
      "Every script must include: hook, authority stack, education, product reveal, brand close, CTA",
      "No footage reuse — all remakes must be fully refilmed",
    ],
    color: "teal",
  },
  {
    phase: "Filming",
    title: "Filming Checklist",
    timing: "Before filming",
    actions: [
      "Lab coat on — always",
      "Pharmacy license graphic visible in frame",
      "PubMed screenshot ready for overlay at the mechanism/study moment",
      "Product in hand for the reveal moment",
      "Fast pacing — no dead air, no filler words",
      "Hook must be delivered in first 2 seconds — no setup, no credential-first",
    ],
    color: "orange",
  },
  {
    phase: "Tool Use",
    title: "When to Use Each Tool Mode",
    timing: "Reference",
    actions: [
      "Generate Mode: New product, new angle, or when you have no existing script to work from. Input: product name, hook type, target symptom.",
      "Clone Mode: You found a competitor video that converted well. Input: video URL or transcript. Output: same structure, your voice.",
      "Iterate Mode: You have a script that performed but needs improvement. Input: existing script + iteration level (70/20/10). 70 = minor hook tweak. 20 = new hook, same body. 10 = full rewrite.",
      "Video Lab: Analyze any TikTok URL to extract hook type, structure, and overlay data. Use before cloning a competitor video.",
    ],
    color: "indigo",
  },
];

// ─── Router ────────────────────────────────────────────────────────────────────

export const commandCenterRouter = router({
  // All posted videos with full analytics
  getVideos: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const videos = await db.select().from(postedVideos).orderBy(desc(postedVideos.videoNumber));
    return videos;
  }),

  // Aggregate stats across all videos
  getVideoStats: publicProcedure.query(async () => {
    type VideoRow = typeof postedVideos.$inferSelect;
    const db = await getDb();
    if (!db) return { totalVideos: 0, totalViews: 0, totalGMV: "0.00", avgWatchPct: 0, breakouts: 0, hiddenGems: 0, hookPerformance: [], productPerformance: [] };
    const videos: VideoRow[] = await db.select().from(postedVideos);
    const totalViews = videos.reduce((sum: number, v: VideoRow) => sum + (v.views ?? 0), 0);
    const totalGMV = videos.reduce((sum: number, v: VideoRow) => {
      const num = parseFloat((v.gmv ?? "$0").replace("$", "").replace(",", ""));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    const avgWatchPct = videos.length > 0
      ? Math.round(videos.reduce((sum: number, v: VideoRow) => sum + (v.watchTimePct ?? 0), 0) / videos.length)
      : 0;
    const breakouts = videos.filter((v: VideoRow) => (v.views ?? 0) >= 5000).length;
    const hiddenGems = videos.filter((v: VideoRow) => v.diagnosis?.includes("HIDDEN GEM")).length;

    // Hook type performance
    const hookMap: Record<string, { views: number; watchPct: number; count: number }> = {};
    for (const v of videos) {
      const hook = v.hookType ?? "Unknown";
      if (!hookMap[hook]) hookMap[hook] = { views: 0, watchPct: 0, count: 0 };
      hookMap[hook].views += v.views ?? 0;
      hookMap[hook].watchPct += v.watchTimePct ?? 0;
      hookMap[hook].count += 1;
    }
    const hookPerformance = Object.entries(hookMap).map(([hookType, data]) => ({
      hookType,
      avgViews: Math.round(data.views / data.count),
      avgWatchPct: Math.round(data.watchPct / data.count),
      count: data.count,
    })).sort((a, b) => b.avgViews - a.avgViews);

    // Product performance
    const productMap: Record<string, { views: number; gmv: number; count: number }> = {};
    for (const v of videos) {
      const product = v.product ?? "Unknown";
      if (!productMap[product]) productMap[product] = { views: 0, gmv: 0, count: 0 };
      productMap[product].views += v.views ?? 0;
      const gmvNum = parseFloat((v.gmv ?? "$0").replace("$", "").replace(",", ""));
      productMap[product].gmv += isNaN(gmvNum) ? 0 : gmvNum;
      productMap[product].count += 1;
    }
    const productPerformance = Object.entries(productMap).map(([product, data]) => ({
      product,
      totalViews: data.views,
      totalGMV: data.gmv.toFixed(2),
      videoCount: data.count,
    })).sort((a, b) => b.totalViews - a.totalViews);

    return {
      totalVideos: videos.length,
      totalViews,
      totalGMV: totalGMV.toFixed(2),
      avgWatchPct,
      breakouts,
      hiddenGems,
      hookPerformance,
      productPerformance,
    };
  }),

  // Scripts ready to film
  getScripts: publicProcedure.query(async () => {
    const scriptFiles = safeReadDir(SCRIPTS_DIR);
    const standaloneScripts = scriptFiles
      .filter(f => f.endsWith(".md"))
      .map(filename => {
        // Extract the script key: match SCRIPT_01, SCRIPT_12B, etc. at the start
        const keyMatch = filename.match(/^(SCRIPT_\d+[A-Z]?)/);
        const key = keyMatch ? keyMatch[1] : filename.replace(".md", "");
        const filenameKey = filename.replace(".md", "");
        const meta = SCRIPT_META[key] ?? SCRIPT_META_BY_FILENAME[filenameKey];
        return {
          filename,
          key,
          product: meta?.product ?? "Unknown",
          hookType: meta?.hookType ?? "Unknown",
          priority: meta?.priority ?? ("MEDIUM" as "HIGH" | "MEDIUM" | "LOW"),
          notes: meta?.notes,
          exists: fileExists(path.join(SCRIPTS_DIR, filename)),
        };
      });

    // Add campaign scripts (live inside campaign docs, not standalone files)
    const campaignScriptEntries = CAMPAIGN_SCRIPTS.map(cs => ({
      filename: cs.filename,
      key: cs.key,
      product: cs.product,
      hookType: cs.hookType,
      priority: cs.priority,
      notes: cs.notes,
      exists: fileExists(path.join(SCRIPTS_DIR, cs.filename)),
    }));

    return [...standaloneScripts, ...campaignScriptEntries]
      .sort((a, b) => {
        const order: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
      });
  }),

  // Intelligence library docs
  getIntelDocs: publicProcedure.query(async () => {
    return INTEL_DOCS.map(doc => ({
      ...doc,
      exists: fileExists(path.join(process.cwd(), doc.path)),
    }));
  }),

  // Product intel files
  getProductIntel: publicProcedure.query(async () => {
    const files = safeReadDir(PRODUCT_INTEL_DIR);
    return files
      .filter(f => f.endsWith(".md"))
      .map(filename => ({
        filename,
        product: filename.replace(".md", "").replace(/_/g, " "),
        category: getProductCategory(filename),
        path: `analysis/product-intel/${filename}`,
      }))
      .sort((a, b) => a.category.localeCompare(b.category) || a.product.localeCompare(b.product));
  }),

  // Creator research
  getCreatorResearch: publicProcedure.query(async () => {
    return CREATOR_RESEARCH.map(c => ({
      ...c,
      exists: fileExists(path.join(process.cwd(), c.path)),
    }));
  }),

  // Workflow steps
  getWorkflow: publicProcedure.query(async () => {
    return WORKFLOW_STEPS;
  }),

  // Get all filmed script keys
  getFilmedScripts: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(scriptFilmed);
    return rows.map(r => ({ scriptKey: r.scriptKey, filmedAt: r.filmedAt }));
  }),

  // Get full script content by filename
  getScriptContent: publicProcedure
    .input(z.object({ filename: z.string() }))
    .query(async ({ input }) => {
      try {
        const filePath = path.join(SCRIPTS_DIR, input.filename);
        if (!fs.existsSync(filePath)) return { content: null };
        const content = fs.readFileSync(filePath, 'utf-8');
        return { content };
      } catch {
        return { content: null };
      }
    }),

  // Save edited script content back to file
  saveScriptContent: publicProcedure
    .input(z.object({ filename: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const filePath = path.join(SCRIPTS_DIR, input.filename);
        if (!fs.existsSync(filePath)) return { success: false, error: 'File not found' };
        fs.writeFileSync(filePath, input.content, 'utf-8');
        return { success: true };
      } catch (e) {
        return { success: false, error: String(e) };
      }
    }),

  // Mark a script as filmed (or unmark)
  markAsFilmed: publicProcedure
    .input(z.object({ scriptKey: z.string(), filmed: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      if (input.filmed) {
        await db.insert(scriptFilmed)
          .values({ scriptKey: input.scriptKey })
          .onDuplicateKeyUpdate({ set: { scriptKey: input.scriptKey } });
      } else {
        await db.delete(scriptFilmed).where(eq(scriptFilmed.scriptKey, input.scriptKey));
      }
      return { success: true };
    }),

  // Save user-reviewed screenshot metrics into the canonical dashboard data and log.
  syncReviewedMetrics: protectedProcedure
    .input(z.object({
      videoNumber: z.number().int().positive(),
      postDate: z.string().max(20).optional(),
      tiktokUrl: z.string().url().optional(),
      scriptFile: z.string().max(255).optional(),
      hookType: z.string().min(1).max(100),
      product: z.string().min(1).max(255),
      ctaId: z.string().max(20).optional(),
      urgencyTrigger: z.string().max(255).optional(),
      filmingDayCheck: z.enum(["conditional_cart", "live_sale_or_bundle", "historical_sellout_or_restock", "not_applicable"]).optional(),
      screenshotUrl: z.string().url().optional(),
      metrics: z.object({
        views: z.number().int().nonnegative().optional(),
        avgWatchTimeSec: z.number().nonnegative().optional(),
        avgWatchTimePct: z.number().nonnegative().max(100).optional(),
        likes: z.number().int().nonnegative().optional(),
        comments: z.number().int().nonnegative().optional(),
        shares: z.number().int().nonnegative().optional(),
        saves: z.number().int().nonnegative().optional(),
        follows: z.number().int().nonnegative().optional(),
      }),
      diagnosis: z.string().max(1000).optional(),
      action: z.string().max(1000).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existing = await db.select().from(postedVideos)
        .where(eq(postedVideos.videoNumber, input.videoNumber))
        .limit(1);

      const values = {
        postDate: input.postDate,
        tiktokUrl: input.tiktokUrl,
        scriptFile: input.scriptFile,
        hookType: input.hookType,
        product: input.product,
        ctaId: input.ctaId,
        urgencyTrigger: input.urgencyTrigger,
        filmingDayCheck: input.filmingDayCheck,
        views: input.metrics.views,
        watchTimePct: input.metrics.avgWatchTimePct == null ? undefined : Math.round(input.metrics.avgWatchTimePct),
        avgWatchSec: input.metrics.avgWatchTimeSec == null ? undefined : String(input.metrics.avgWatchTimeSec),
        saves: input.metrics.saves,
        shares: input.metrics.shares,
        comments: input.metrics.comments,
        diagnosis: input.diagnosis,
        action: input.action,
      };

      if (existing[0]) {
        await db.update(postedVideos).set(values).where(eq(postedVideos.id, existing[0].id));
      } else {
        await db.insert(postedVideos).values({
          videoNumber: input.videoNumber,
          postDate: input.postDate,
          tiktokUrl: input.tiktokUrl,
          scriptFile: input.scriptFile,
          hookType: input.hookType,
          product: input.product,
          ctaId: input.ctaId,
          urgencyTrigger: input.urgencyTrigger,
          filmingDayCheck: input.filmingDayCheck,
          views: input.metrics.views ?? 0,
          watchTimePct: input.metrics.avgWatchTimePct == null ? 0 : Math.round(input.metrics.avgWatchTimePct),
          avgWatchSec: input.metrics.avgWatchTimeSec == null ? undefined : String(input.metrics.avgWatchTimeSec),
          saves: input.metrics.saves ?? 0,
          shares: input.metrics.shares ?? 0,
          comments: input.metrics.comments ?? 0,
          diagnosis: input.diagnosis,
          action: input.action,
        });
      }

      const currentLog = fs.existsSync(PERFORMANCE_LOG_PATH)
        ? fs.readFileSync(PERFORMANCE_LOG_PATH, "utf-8")
        : "# Video Performance Log\n";
      fs.writeFileSync(PERFORMANCE_LOG_PATH, upsertPerformanceLogSync(currentLog, input), "utf-8");

      return { success: true, mode: existing[0] ? "updated" as const : "created" as const };
    }),
});
