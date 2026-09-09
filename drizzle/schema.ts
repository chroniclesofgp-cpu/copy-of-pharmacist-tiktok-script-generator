import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Product Library ──────────────────────────────────────────────────────────

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  keyBenefit: varchar("keyBenefit", { length: 500 }),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ─── Saved Scripts ────────────────────────────────────────────────────────────

export const savedScripts = mysqlTable("savedScripts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId"),
  productName: varchar("productName", { length: 255 }).notNull(),
  hookId: varchar("hookId", { length: 100 }).notNull(),
  hookName: varchar("hookName", { length: 255 }).notNull(),
  fullScript: text("fullScript").notNull(),
  textHook: text("textHook"),
  verbalHook: text("verbalHook"),
  dealReveal: text("dealReveal"),
  howTo: text("howTo"),
  urgencyClose: text("urgencyClose"),
  creatorVoice: varchar("creatorVoice", { length: 50 }).default("hybrid"),
  format: varchar("format", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedScript = typeof savedScripts.$inferSelect;
export type InsertSavedScript = typeof savedScripts.$inferInsert;

// ─── Product Vault (Vetting Results) ────────────────────────────────────────────────

export const productVault = mysqlTable("productVault", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productUrl: text("productUrl"),
  category: varchar("category", { length: 100 }),
  // Verdict: 'promote' | 'caution' | 'avoid'
  verdict: varchar("verdict", { length: 20 }).notNull(),
  // Full AI analysis stored as JSON string
  ingredientsAnalysis: text("ingredientsAnalysis"),
  doseFlags: text("doseFlags"),
  redFlags: text("redFlags"),
  betterAlternatives: text("betterAlternatives"),
  talkingPoints: text("talkingPoints"),
  hookRecommendation: text("hookRecommendation"), // JSON array of {hookId, rationale} objects
  // Script brief: saved research facts from a generation run (JSON)
  // Shape: { mechanism, gap, differentiator, dosingFacts, citations: Citation[] }
  scriptBrief: text("scriptBrief"),
  // User-editable fields
  affiliateLink: text("affiliateLink"),
  userNotes: text("userNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductVault = typeof productVault.$inferSelect;
export type InsertProductVault = typeof productVault.$inferInsert;

// ─── Video Lab: Content Analysis ─────────────────────────────────────────────
export const videoAnalyses = mysqlTable("videoAnalyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  hookId: varchar("hookId", { length: 100 }).notNull(),
  hookName: varchar("hookName", { length: 255 }),
  videoUrl: text("videoUrl").notNull(),        // S3 URL of uploaded video
  referenceVideoUrl: text("referenceVideoUrl"), // TikTok URL of reference video
  referenceCreator: varchar("referenceCreator", { length: 100 }),
  referenceViews: varchar("referenceViews", { length: 50 }),
  transcription: text("transcription"),         // Whisper transcript of uploaded video
  analysisJson: text("analysisJson").notNull(), // Full 7-section analysis as JSON string
  savedScriptId: int("savedScriptId"),          // Optional link to the script used
  productName: varchar("productName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type VideoAnalysis = typeof videoAnalyses.$inferSelect;
export type InsertVideoAnalysis = typeof videoAnalyses.$inferInsert;

// ─── Video Lab: Metrics Analysis ─────────────────────────────────────────────
export const metricsAnalyses = mysqlTable("metricsAnalyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  hookId: varchar("hookId", { length: 100 }),
  hookName: varchar("hookName", { length: 255 }),
  metricsJson: text("metricsJson").notNull(),       // Raw metrics input as JSON
  interpretationJson: text("interpretationJson").notNull(), // LLM interpretation as JSON
  videoAnalysisId: int("videoAnalysisId"),           // Optional link to content analysis
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type MetricsAnalysis = typeof metricsAnalyses.$inferSelect;
export type InsertMetricsAnalysis = typeof metricsAnalyses.$inferInsert;

// ─── Posted Videos (Performance Log) ────────────────────────────────────────
export const postedVideos = mysqlTable("postedVideos", {
  id: int("id").autoincrement().primaryKey(),
  videoNumber: int("videoNumber").notNull(),          // 1–22+
  postDate: varchar("postDate", { length: 20 }),       // e.g. "2026-05-23"
  tiktokUrl: varchar("tiktokUrl", { length: 500 }),
  scriptFile: varchar("scriptFile", { length: 255 }),  // e.g. "SCRIPT_07"
  hookType: varchar("hookType", { length: 100 }).notNull(),
  product: varchar("product", { length: 255 }).notNull(),
  ctaId: varchar("ctaId", { length: 20 }),
  urgencyTrigger: varchar("urgencyTrigger", { length: 255 }),
  filmingDayCheck: varchar("filmingDayCheck", { length: 100 }),
  views: int("views").default(0),
  watchTimePct: int("watchTimePct").default(0),         // stored as integer percent e.g. 19
  avgWatchSec: varchar("avgWatchSec", { length: 10 }), // e.g. "18.0"
  saves: int("saves").default(0),
  shares: int("shares").default(0),
  comments: int("comments").default(0),
  gmv: varchar("gmv", { length: 20 }).default("$0.00"),
  diagnosis: varchar("diagnosis", { length: 50 }),     // BREAKOUT | Iterate | Remake | Retire | HIDDEN GEM
  action: text("action"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PostedVideo = typeof postedVideos.$inferSelect;
export type InsertPostedVideo = typeof postedVideos.$inferInsert;

// ─── Script Filmed Tracking ──────────────────────────────────────────────────
export const scriptFilmed = mysqlTable("scriptFilmed", {
  id: int("id").autoincrement().primaryKey(),
  scriptKey: varchar("scriptKey", { length: 100 }).notNull().unique(), // e.g. "SCRIPT_07"
  filmedAt: timestamp("filmedAt").defaultNow().notNull(),
});
export type ScriptFilmed = typeof scriptFilmed.$inferSelect;
export type InsertScriptFilmed = typeof scriptFilmed.$inferInsert;

// ─── Scheduled Video Analysis Reports ───────────────────────────────────────
export const scheduledVideoReports = mysqlTable("scheduledVideoReports", {
  id: int("id").autoincrement().primaryKey(),
  runDate: varchar("runDate", { length: 20 }).notNull(),          // e.g. "2026-08-04"
  videosFound: int("videosFound").default(0),                     // how many new videos found
  videosAnalyzed: int("videosAnalyzed").default(0),               // how many successfully analyzed
  reportJson: text("reportJson").notNull(),                       // full analysis JSON array
  status: varchar("status", { length: 20 }).default("complete"),  // complete | partial | error
  errorMessage: text("errorMessage"),                             // if status = error
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ScheduledVideoReport = typeof scheduledVideoReports.$inferSelect;
export type InsertScheduledVideoReport = typeof scheduledVideoReports.$inferInsert;
