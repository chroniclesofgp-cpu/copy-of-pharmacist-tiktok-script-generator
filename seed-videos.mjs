// seed-videos.mjs — seeds all 22 posted videos into the postedVideos table
import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL not set");

const videos = [
  { videoNumber: 1, postDate: "2026-06-03", tiktokUrl: "https://www.tiktok.com/t/ZP8sUGcc6/", scriptFile: null, hookType: "Visual Intrigue", product: "Dr. Melaxin Gifted Set", views: 624, watchTimePct: 3, avgWatchSec: "2.7", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Rewrite hook — visual intrigue not stopping scroll; open with direct symptom or pain point before visual reveal. Refilm full video." },
  { videoNumber: 2, postDate: "2026-06-02", tiktokUrl: "https://www.tiktok.com/t/ZP8sUnBqG/", scriptFile: null, hookType: "Symptom Checklist", product: "Toplux Magnesium", views: 673, watchTimePct: 10, avgWatchSec: "10.2", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Hook is working (best watch time in V1-V11 outside V7). Tighten education section — get to product faster. Refilm full video." },
  { videoNumber: 3, postDate: "2026-06-01", tiktokUrl: "https://www.tiktok.com/t/ZP8syYcbP/", scriptFile: null, hookType: "Instruction/Correction", product: "CeraVe Mineral Sunscreen", views: 570, watchTimePct: 5, avgWatchSec: "3.5", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Rewrite hook with more specificity — name the exact problem (white cast, pilling) not just the category. Refilm full video." },
  { videoNumber: 4, postDate: "2026-05-29", tiktokUrl: "https://www.tiktok.com/t/ZP8sUwsdh/", scriptFile: null, hookType: "Instruction/Correction", product: "SKIN1004 Sun Serum", views: 822, watchTimePct: 5, avgWatchSec: "5.0", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Rewrite hook — name the specific skin type problem (reactive, redness, sensitivity) in first 2 seconds. Refilm full video." },
  { videoNumber: 5, postDate: "2026-05-25", tiktokUrl: "https://www.tiktok.com/t/ZP8syJqTf/", scriptFile: null, hookType: "Comparison Hook", product: "Truly + Medicube Deodorant Stack", views: 194, watchTimePct: 5, avgWatchSec: "3.7", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Fix Neuro Gum review screenshot at 1:10 (wrong product shown). Rewrite hook. Refilm full video." },
  { videoNumber: 6, postDate: "2026-05-25", tiktokUrl: "https://www.tiktok.com/t/ZP8sUpqB9/", scriptFile: null, hookType: "Visual Qualifier", product: "Truly + Medicube Deodorant Stack", views: 229, watchTimePct: 3, avgWatchSec: "2.8", saves: 0, shares: 0, comments: 0, gmv: "$6.00", diagnosis: "HIDDEN GEM — Iterate", action: "Conversion mechanics work ($6 GMV on 229 views = highest conversion rate in batch). Hook is the only problem. Rewrite: 'If your underarms are dark and nothing has worked, it's because you're only treating one of two problems.' Refilm full video — no footage reuse." },
  { videoNumber: 7, postDate: "2026-05-23", tiktokUrl: "https://www.tiktok.com/t/ZP8sUtSNS/", scriptFile: null, hookType: "Comparison Hook", product: "Truly + Medicube Deodorant", views: 8675, watchTimePct: 19, avgWatchSec: "18.0", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "BREAKOUT — Replicate", action: "Best watch time in batch (19% / 18s). Comparison + conditional close structure confirmed. Replicate this structure for V8 remake and V11 iterate. Add affiliate link." },
  { videoNumber: 8, postDate: "2026-05-22", tiktokUrl: "https://www.tiktok.com/t/ZP8sUGFht/", scriptFile: null, hookType: "Comparison Hook", product: "Bloom + Loaded Tea Shop", views: 184, watchTimePct: 6, avgWatchSec: "6.0", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Add conditional close section ('here's who should buy which one'). V7 vs V8 is clearest A/B in batch — conditional close is the only variable. Refilm full video." },
  { videoNumber: 9, postDate: "2026-05-20", tiktokUrl: "https://www.tiktok.com/t/ZP8syJtpf/", scriptFile: null, hookType: "Instruction/Correction", product: "Loaded Tea Shop", views: 734, watchTimePct: 4, avgWatchSec: "3.3", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Rewrite hook — name the specific mistake (timing, dosing, combination) not just 'taking it wrong'. Refilm full video." },
  { videoNumber: 10, postDate: "2026-05-19", tiktokUrl: "https://www.tiktok.com/t/ZP8sUs1cw/", scriptFile: null, hookType: "Trend or Trash", product: "Loaded Tea Shop", views: 1317, watchTimePct: 8, avgWatchSec: "7.7", saves: 0, shares: 0, comments: 0, gmv: "$2.40", diagnosis: "Iterate", action: "Conversion mechanics work ($2.40 GMV). Tighten hook — verdict should be teased in first 3 seconds. Refilm full video." },
  { videoNumber: 11, postDate: "2026-05-19", tiktokUrl: "https://www.tiktok.com/t/ZP8syYHuB/", scriptFile: null, hookType: "Comparison Hook", product: "Dr. Melaxin vs Medicube Multibalm", views: 710, watchTimePct: 7, avgWatchSec: "7.3", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Iterate", action: "Add conditional close section. V7 structure is the model. Refilm full video." },
  { videoNumber: 12, postDate: "2026-05-15", tiktokUrl: "https://www.tiktok.com/t/ZP8sUoydW/", scriptFile: null, hookType: "Symptom Checklist", product: "Toplux Magnesium", views: 1573, watchTimePct: 13, avgWatchSec: "10.9", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Rewrite hook — add the cortisol reframe ('you're not just eating too much') from V18. Tighten education section. Refilm full video." },
  { videoNumber: 13, postDate: "2026-05-14", tiktokUrl: "https://www.tiktok.com/t/ZP8syRf7u/", scriptFile: null, hookType: "Instruction/Correction", product: "Medicube Deodorant", views: 737, watchTimePct: 4, avgWatchSec: "3.8", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Rewrite hook — name the specific symptom (dark underarms, odor despite deodorant) in first 2 seconds. Refilm full video." },
  { videoNumber: 14, postDate: "2026-05-14", tiktokUrl: "https://www.tiktok.com/t/ZP8syY4d2/", scriptFile: null, hookType: "Comparison Hook", product: "Neuro Gum vs Coffee", views: 900, watchTimePct: 7, avgWatchSec: "6.8", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Add conditional close. Rewrite hook with crash/jitter specificity. Refilm full video." },
  { videoNumber: 15, postDate: "2026-05-13", tiktokUrl: "https://www.tiktok.com/t/ZP8syLNME/", scriptFile: null, hookType: "Instruction/Correction", product: "Neuro Gum", views: 659, watchTimePct: 9, avgWatchSec: "7.5", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Best watch time in V12-V22 group (9%). Rewrite hook with crash/timing specificity. Strong education body — keep it. Refilm full video." },
  { videoNumber: 16, postDate: "2026-05-12", tiktokUrl: "https://www.tiktok.com/t/ZP8sUsdHU/", scriptFile: null, hookType: "Unknown", product: "Unknown", views: 490, watchTimePct: 3, avgWatchSec: "3.1", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Re-analyze video to identify product and hook type. Then rewrite from scratch." },
  { videoNumber: 17, postDate: "2026-05-11", tiktokUrl: "https://www.tiktok.com/t/ZP8sUoctm/", scriptFile: null, hookType: "Visual Pain Point", product: "Medicube Multibalm", views: 523, watchTimePct: 0, avgWatchSec: "6.5", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "0% watched full video. Rewrite hook — visual pain point needs verbal reinforcement in first 2 seconds. Refilm full video." },
  { videoNumber: 18, postDate: "2026-05-11", tiktokUrl: "https://www.tiktok.com/t/ZP8sU3oPW/", scriptFile: null, hookType: "Symptom Checklist", product: "Toplux Magnesium", views: 12159, watchTimePct: 8, avgWatchSec: "8.1", saves: 0, shares: 0, comments: 0, gmv: "$10.18", diagnosis: "BREAKOUT — Iterate", action: "Highest GMV in batch ($10.18). Hook confirmed: 'Double chin, belly fat, love handles — you're not just eating too much.' Fix watch time by tightening education and getting to cortisol mechanism faster. Refilm full video." },
  { videoNumber: 19, postDate: "2026-05-10", tiktokUrl: "https://www.tiktok.com/t/ZP8sy1HXL/", scriptFile: null, hookType: "Instruction/Correction", product: "Medicube Multibalm", views: 689, watchTimePct: 10, avgWatchSec: "5.8", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "10% watch time — good for this hook type. Rewrite hook with more specific symptom (dry patches, flaking, tight skin). Refilm full video." },
  { videoNumber: 20, postDate: "2026-05-07", tiktokUrl: "https://www.tiktok.com/t/ZP8syFFyN/", scriptFile: null, hookType: "Instruction/Correction", product: "NeoCell Creatine + Collagen", views: 887, watchTimePct: 8, avgWatchSec: "7.3", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Strong education body (creatine fills muscle not joints analogy is excellent). Rewrite hook with joint/skin specificity. Refilm full video." },
  { videoNumber: 21, postDate: "2026-05-05", tiktokUrl: "https://www.tiktok.com/t/ZP8sU7LWh/", scriptFile: null, hookType: "Instruction/Correction", product: "Toplux Magnesium", views: 1566, watchTimePct: 6, avgWatchSec: "5.8", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Rewrite hook — too much scientific terminology too early. Lead with the symptom, not the mechanism. Refilm full video." },
  { videoNumber: 22, postDate: "2026-05-03", tiktokUrl: "https://www.tiktok.com/t/ZP8sUWh1F/", scriptFile: null, hookType: "Visual Pain Point", product: "Medicube Volufiline Stick", views: 899, watchTimePct: 6, avgWatchSec: "5.9", saves: 0, shares: 0, comments: 0, gmv: "$0.00", diagnosis: "Remake", action: "Rewrite hook — visual pain point needs verbal reinforcement. Add symptom statement in first 2 seconds. Refilm full video." },
];

async function seed() {
  const conn = await createConnection(DB_URL);
  console.log("Connected to database");

  // Clear existing records
  await conn.execute("DELETE FROM postedVideos");
  console.log("Cleared existing postedVideos records");

  for (const v of videos) {
    await conn.execute(
      `INSERT INTO postedVideos (videoNumber, postDate, tiktokUrl, scriptFile, hookType, product, views, watchTimePct, avgWatchSec, saves, shares, comments, gmv, diagnosis, action)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [v.videoNumber, v.postDate, v.tiktokUrl, v.scriptFile, v.hookType, v.product, v.views, v.watchTimePct, v.avgWatchSec, v.saves, v.shares, v.comments, v.gmv, v.diagnosis, v.action]
    );
    console.log(`Inserted Video ${v.videoNumber} — ${v.product}`);
  }

  await conn.end();
  console.log("Done. All 22 videos seeded.");
}

seed().catch(console.error);
