# Video Performance Analysis Framework
## RxContent — @pharmdgp

**Last updated:** Jun 9, 2026
**Purpose:** Define every TikTok metric, set benchmarks for the @pharmdgp content type (educational/affiliate), explain what each metric pattern means diagnostically, and specify the exact action step each diagnosis calls for. This document governs how every posted video gets analyzed — both metrics and delivery — and how that analysis feeds back into script writing, filming decisions, and the pipeline.

**How this connects to other documents:**
- Raw performance numbers go into `VIDEO_PERFORMANCE_LOG.md`
- Delivery and on-camera feedback goes into `SCRIPT_FEEDBACK_LOG.md`
- Patterns that affect future scripts get promoted to `MASTER_CONTEXT.md` Section 9
- Script iteration decisions (remake, iterate, retire) update `CONTENT_PIPELINE.md`

---

## PART 1 — THE METRICS AND WHAT THEY MEASURE

### 1a. Watch Time Percentage (Completion Rate)

**What it is:** The average percentage of the video that viewers watched before scrolling away. TikTok calculates this as total watch time divided by (video length × number of plays).

**Why it matters:** This is the primary algorithmic signal. TikTok distributes videos in batches — it shows your video to a small test group, measures how long they watch, and decides whether to push it to a larger audience based on that signal. A video with strong watch time gets pushed further. A video with weak watch time gets suppressed after the first batch.

**Benchmarks for 60–120 second educational content (@pharmdgp format):**

| Rating | Watch Time % | What It Means |
|--------|-------------|---------------|
| Elite | 50%+ | Algorithm is actively pushing this video. Strong hook + strong retention throughout. |
| Great | 35–49% | Above average. Algorithm is distributing but not aggressively pushing. |
| Good | 25–34% | Acceptable. Hook is working but there is a drop-off point somewhere in the middle. |
| Weak | 15–24% | Hook is not holding. Viewers are leaving in the first 15–20 seconds. |
| Problem | Under 15% | Hook is failing. Most viewers are swiping away in the first 5–10 seconds. Immediate diagnosis needed. |

**Important context:** These benchmarks are for 60–120 second videos. See Part 5b for length-calibrated benchmarks for shorter and longer videos.

---

### 1b. Average Watch Time (Seconds)

**What it is:** The average number of seconds viewers watched before scrolling away. This is the absolute version of watch time percentage.

**Why it matters:** This tells you *where* in the video people are dropping off, which tells you *what* is causing the drop. A 30-second average watch time on a 90-second video means viewers are leaving at the one-third mark — which is typically the transition from hook to education, or the moment the product is first mentioned.

**How to use it:** Divide average watch time by video length to get the effective completion rate. Then map that timestamp to the script to identify the drop-off section.

**Drop-off diagnosis by timestamp:**

| Drop-off Point | Likely Cause | Action |
|----------------|-------------|--------|
| 0–5 seconds | Hook failed — viewer did not connect with the opening line or visual | Rewrite hook. Test a different hook type on the next version. |
| 5–15 seconds | Hook worked but authority/credential delivery lost them | Shorten the credential section. Get to the mechanism faster. |
| 15–30 seconds | Education section lost them — too technical, too slow, or no stakes | Add a "why this matters to you" line before the mechanism. Increase pacing. |
| 30–60 seconds | Product reveal lost them — felt like an ad | Delay the product reveal. Lead with the mechanism longer before naming the product. |
| 60–90 seconds | Protocol or CTA section lost them — too long, too salesy | Shorten the protocol section. Move the CTA closer to the mechanism payoff. |

---

### 1c. Saves

**What it is:** The number of times viewers bookmarked the video to their private collection.

**Why it matters:** Saves are the strongest single metric for educational/affiliate content. A save means the viewer found the content valuable enough to want to reference it again — which for TikTok Shop content almost always means they are planning to buy and want to find the link later. Saves also train the algorithm to show your content to similar users, because TikTok infers that saved content has reference value and belongs in recommendation clusters for that topic.

**Benchmarks:**

| Rating | Save Rate (Saves ÷ Views) | What It Means |
|--------|--------------------------|---------------|
| Elite | 3–5%+ | Exceptional. Content has strong reference value. Algorithm will push this to similar audiences. |
| Great | 2–3% | Strong. Above platform average. Content is being bookmarked for purchase intent. |
| Good | 1–2% | Platform average. Acceptable for entertainment content, below expectation for educational/affiliate. |
| Weak | Under 1% | Content is not generating purchase intent or reference value. Mechanism or product angle needs work. |

**For @pharmdgp specifically:** Educational pharmacist content should consistently hit 2%+ save rate. If a video is getting views but under 1% saves, the mechanism explanation is not landing as reference-worthy — the viewer found it interesting but not useful enough to save.

---

### 1d. Shares

**What it is:** The number of times viewers shared the video to another person or platform.

**Why it matters:** Shares drive exponential reach because they carry an implicit endorsement — the sharer is telling their network "you need to see this." For healthcare content, shares typically happen when the content is either alarming (warning/correction hook) or highly relatable (symptom checklist that describes the viewer's exact experience).

**Benchmarks:**

| Rating | Share Rate (Shares ÷ Views) | What It Means |
|--------|---------------------------|---------------|
| Elite | 1.5–3%+ | Content is spreading organically. Strong emotional resonance or urgency. |
| Great | 0.8–1.5% | Above average. Content is being sent to specific people ("this is for you"). |
| Good | 0.3–0.8% | Platform average. |
| Weak | Under 0.3% | Content is not generating the "I need to send this to someone" response. |

**For @pharmdgp specifically:** Instruction-correction hooks ("you've been using this wrong") and symptom-checklist hooks ("if you have these 3 symptoms") tend to generate the highest share rates because they are naturally shareable — viewers send them to friends or family who have the same problem.

---

### 1e. Comments

**What it is:** The number of viewer comments on the video.

**Why it matters:** Comments are an algorithmic signal, but for TikTok Shop affiliate content the *content* of comments matters more than the count. Purchase-intent comments ("link?", "just ordered", "where do I get this?") are the direct conversion signal. Question comments ("does this work for X?") are the content strategy signal — they tell you what the next video should address.

**What to track:**

| Comment Type | What It Means | Action |
|-------------|---------------|--------|
| "Link?" / "Where do I get this?" | Direct purchase intent. Viewer wants to buy right now. | Reply with a comment directing them to the link in bio. This comment reply is also a follow-up video opportunity. |
| "Just ordered!" / "Bought it!" | Conversion confirmed. | Note the product and hook type in the performance log. This combination is working. |
| "Does this work for [condition]?" | Unaddressed audience segment. | This question is the hook for the next video on this product. |
| "I've been doing this wrong!" | Hook resonated — viewer self-identified with the problem. | Strong signal that the instruction-correction angle is working. |
| Emoji-only / "🔥" / "❤️" | Generic engagement. Low signal value for conversion. | Note but do not weight heavily. |

**Comment sentiment ratio:** Track the ratio of purchase-intent comments to total comments. Elite TikTok Shop content generates 25%+ purchase-intent comments as a share of total comments.

---

### 1f. GMV (Gross Merchandise Value)

**What it is:** The total dollar value of sales generated through your affiliate link for a given video. Tracked in the TikTok Shop Creator Center affiliate dashboard.

**Why it matters:** This is the only metric that directly measures whether the video converted viewers into buyers. All other metrics are leading indicators — GMV is the outcome.

**Benchmarks for a new account (@pharmdgp is early stage):**

| Stage | Per-Video GMV | What It Means |
|-------|--------------|---------------|
| Getting started | $0–$50 | Normal for first 10–20 videos. Building audience trust before conversion kicks in. |
| Early traction | $50–$300 | Algorithm is distributing and some viewers are converting. |
| Consistent performer | $300–$1,000 | Strong video. Hook and mechanism are working together. |
| Breakout | $1,000–$5,000 | This video is a winner. Identify every element and replicate. |
| Viral converter | $5,000+ | Rare. Analyze everything about this video and build the next 5 scripts from it. |

**Important:** GMV lags views by 24–72 hours. A video posted today may not show its full GMV for 3 days. Always wait 72 hours before making a final GMV assessment.

---

### 1g. Views

**What it is:** Total number of times the video was played (including replays).

**Why it matters:** Views are the reach metric — they tell you how far the algorithm distributed the video. Views alone do not indicate conversion or quality. A video can have 100K views and $0 GMV (no conversion) or 5K views and $500 GMV (highly targeted conversion).

**For @pharmdgp:** Do not optimize for views. Optimize for the combination of watch time % + saves + GMV. A video with 10K views, 45% watch time, 3% save rate, and $400 GMV is a better video than one with 100K views, 18% watch time, 0.5% save rate, and $200 GMV.

---

### 1h. Follower Growth Per Video

**What it is:** Net new followers gained in the 48 hours after posting a video.

**Why it matters:** Follower growth indicates that viewers found the content credible enough to want more from this creator specifically. For @pharmdgp, follower growth is a lagging indicator of authority — it builds slowly but compounds over time as each new follower becomes a warm audience for future product recommendations.

**What to watch:** If a video generates unusually high follower growth relative to its views, the hook and credential delivery are working together exceptionally well. That video's opening structure should be studied and replicated.

---

## PART 2 — DIAGNOSTIC PATTERNS

These are the most common metric combinations you will see and what each one means.

### Pattern 1: High Views, Low Watch Time, Low Saves, Low GMV
**Diagnosis:** Hook is attracting clicks but the content is not holding viewers. The opening line or visual is working as a scroll-stopper, but the education section is losing people before they reach the product.
**Action:** Keep the hook. Rewrite the education section to be faster, more concrete, and more personally relevant. Add a "why this matters to you right now" line within the first 15 seconds.

---

### Pattern 2: Low Views, High Watch Time %, High Saves
**Diagnosis:** The algorithm did not distribute this video widely (possibly due to a weak hook or slow start), but the viewers who did watch it found it highly valuable. This is a hidden gem.
**Action:** Repost with a stronger hook. The content itself is working — the problem is the opening 3 seconds. Test 2–3 different hooks on the same core content.

---

### Pattern 3: High Views, Good Watch Time, Low GMV
**Diagnosis:** The video is educating but not converting. Viewers are watching and finding it interesting, but the product recommendation is not landing as a purchase trigger. Common causes: the product was introduced too early (before trust was built), the CTA was too soft, or the product-to-mechanism connection was not made explicit enough.
**Action:** Rewrite the product introduction section. Make the mechanism → product connection more explicit ("the reason this works is because it contains X, which does exactly what I just described"). Strengthen the CTA — give a specific reason to buy now rather than "check it out."

---

### Pattern 4: Low Views, Low Watch Time, High GMV
**Diagnosis:** A small, highly targeted audience is finding this video and converting at a very high rate. The algorithm has not distributed it widely yet, but the viewers who are seeing it are the exact right buyer.
**Action:** Promote this video or repost it with a stronger hook to get more distribution. The conversion mechanics are working — the problem is reach. This is also a strong candidate for a paid spark ad.

---

### Pattern 5: High Saves, High Comments, Low GMV
**Diagnosis:** The content is generating strong educational engagement but not converting to purchases. Viewers are saving it for reference and asking questions, but not clicking through to buy. Common cause: the product was not made compelling enough as a solution, or the affiliate link was not prominent.
**Action:** Add a stronger product close. Make the product the explicit answer to the mechanism you just explained. Ensure the affiliate link is in the bio and mentioned in the video ("link is in my bio").

---

### Pattern 6: High Share Rate, Moderate Everything Else
**Diagnosis:** The content has strong emotional resonance — viewers are sending it to specific people. This is a strong signal for the hook type and topic. The content is not yet optimized for conversion but the audience identification is working.
**Action:** Keep the hook type and topic. Optimize the product close and CTA on the next iteration. The audience is already self-selecting — they just need a stronger reason to buy.

---

## PART 3 — THE ANALYSIS PROCESS

### When to Analyze

**48-hour check:** Views, watch time %, saves, shares, comments. This gives you the algorithmic signal — whether TikTok is distributing the video and whether viewers are engaging.

**72-hour check:** Add GMV. By 72 hours, most of the conversion activity from the initial distribution batch has completed. This is the number that tells you whether the video converted.

**7-day check:** Final GMV + follower growth. Some videos have long tails — they continue generating views and GMV for days or weeks after posting. The 7-day check captures this.

**30-day check (optional):** For any video that showed strong early signals, check at 30 days to see if it is still generating views and GMV. Evergreen educational content can continue performing for months.

---

### How to Submit a Video for Analysis

Share the following in the conversation:
1. **TikTok video URL** (or confirm which script number it corresponds to)
2. **Screenshot of TikTok Analytics** showing: views, watch time %, average watch time (seconds), saves, shares, comments
3. **Screenshot of Creator Center affiliate dashboard** showing GMV for that video (if available)
4. **Any delivery notes** — what you changed from the written script, what felt off, what landed well (this goes in SCRIPT_FEEDBACK_LOG.md)
5. **CTA experiment metadata** — CTA ID, urgency trigger, and the filming-day verification used for the close

The agent will: map the metrics to the diagnostic patterns above, identify the specific drop-off point from average watch time, write the log entry into VIDEO_PERFORMANCE_LOG.md, and provide a specific action recommendation.

---

### What the Analysis Produces

For every video analyzed, the output is:

1. **Metric summary** — all numbers in one place
2. **Diagnostic pattern** — which of the 6 patterns above applies
3. **Drop-off point** — where in the script viewers are leaving (mapped to the actual script section)
4. **Action recommendation** — one of: Replicate (strong performer, build next script from this), Iterate (good bones, specific fix needed), Remake (hook failed, rewrite from scratch), Retire (product/angle not converting, move on)
5. **Pipeline update** — any changes to CONTENT_PIPELINE.md based on the findings
6. **CTA experiment read** — retain, change, or retest the selected CTA ID after comparing its click, save, follower, and GMV signals with like-for-like videos

---

## PART 4 — HOW PERFORMANCE DATA FEEDS BACK INTO SCRIPTS

### Iteration Triggers

A video should be **iterated** (new version written with specific changes) when:
- Watch time % is good but GMV is low → fix the product close
- Views are low but saves are high → fix the hook
- Comments show a specific question that was not addressed → write a follow-up video answering that question
- One version of an A/B test significantly outperforms the other → identify the variable and apply it to all future scripts in that category

A video should be **remade from scratch** when:
- Watch time % is under 15% → the hook failed completely
- GMV is $0 after 72 hours with 1,000+ views → the product-to-mechanism connection is broken
- Comments show the audience misunderstood the product → the framing is wrong

A video should be **retired** (no further iterations) when:
- Three versions of the same hook/product combination have all underperformed
- The product has been removed from TikTok Shop
- A competitor's video has already dominated this exact angle and there is no differentiated version available

### Promotion to Master Context

Any finding that applies to more than one script — or that reveals a structural pattern — gets promoted to Section 9 of MASTER_CONTEXT.md. Examples:
- "Instruction-correction hooks on this account consistently generate 2x the share rate of symptom-checklist hooks" → Section 9 rule
- "Videos where the product is introduced after the 45-second mark consistently outperform videos where it is introduced earlier" → Section 9 rule
- "The phrase 'as a pharmacist I see this every day' generates measurably higher watch time in the 15–30 second window" → Section 9 rule

Single-video observations stay in VIDEO_PERFORMANCE_LOG.md only.

---

## PART 5 — BENCHMARKS REFERENCE TABLE

### 5a. Standard Benchmarks (60–120 second educational/affiliate videos)

Quick reference for @pharmdgp core content format:

| Metric | Weak | Good | Great | Elite |
|--------|------|------|-------|-------|
| Watch Time % | Under 15% | 25–34% | 35–49% | 50%+ |
| Save Rate | Under 1% | 1–2% | 2–3% | 3–5%+ |
| Share Rate | Under 0.3% | 0.3–0.8% | 0.8–1.5% | 1.5–3%+ |
| Purchase-Intent Comment % | Under 5% | 5–15% | 15–25% | 25%+ |
| Per-Video GMV (early stage) | $0 | $50–$300 | $300–$1,000 | $1,000+ |

**Note:** These benchmarks are calibrated for a new account in the healthcare/affiliate niche. As the account grows and the audience warms up, the GMV benchmarks will shift upward. Revisit and update this table after every 20 posted videos.

---

### 5b. Length-Calibrated Watch Time % Benchmarks

Watch time percentage is length-sensitive. Shorter videos are easier to finish, so a high completion rate on a 20-second video is not the same signal as the same rate on a 90-second video. Use the table below based on the actual video length:

| Video Length | Weak | Good | Great | Elite |
|---|---|---|---|---|
| Under 30 seconds | Under 35% | 50–59% | 60–69% | 70%+ |
| 30–60 seconds | Under 25% | 35–44% | 45–59% | 60%+ |
| 60–120 seconds | Under 15% | 25–34% | 35–49% | 50%+ |
| Over 120 seconds | Under 12% | 18–27% | 28–39% | 40%+ |

**Why this matters:** A 45% watch time on a 30-second video is Good, not Elite. A 45% watch time on a 2-minute video is Elite. Always calibrate the diagnosis to the actual video length before assigning a rating.

**Average watch time in seconds** is not length-sensitive in the same way — it tells you the absolute drop-off point regardless of video length. Use seconds to locate *where* in the script viewers left. Use percentage to assess *how well* the video performed relative to its length.

---

## PART 6 — DELIVERY ANALYSIS

In addition to metrics analysis, every posted video can be submitted for a full delivery review. This uses the same `manus-analyze-video` tool used in the creator deep dives — the full video is watched (not transcribed, not screenshot) and evaluated against the delivery standards established from 84 top-performing healthcare creator videos.

### What Delivery Analysis Covers

| Dimension | What Is Evaluated |
|---|---|
| **Hook execution** | Did the opening line land with the right energy and pace? Was it delivered as a statement or as a question? Did it create immediate tension? |
| **Pacing** | Is the overall delivery speed appropriate? Are there dead spots (pauses that kill momentum) or rushed sections (too fast to follow)? |
| **Tonality** | Does the tone match the hook type? Instruction-correction hooks need confident/slightly urgent tone. Symptom-checklist hooks need empathetic/knowing tone. |
| **Authority delivery** | How is the pharmacist credential delivered? Is it natural or forced? Does it land before or after the viewer has decided to keep watching? |
| **Energy level** | Is the energy consistent throughout? Does it drop in the education section (common problem)? Does it pick back up for the CTA? |
| **Script adherence** | What changed from the written script? Were the changes improvements or did they weaken the structure? |
| **Product close** | How was the product introduced? Did it feel like a natural conclusion to the mechanism or did it feel like an ad pivot? |
| **CTA delivery** | Was the call to action delivered with conviction? Was it specific ("link is in my bio" + gesture) or vague? |

### How to Request Delivery Analysis

When submitting a video, include the phrase **"include delivery analysis"** and provide the TikTok video URL. The agent will:
1. Watch the full video using `manus-analyze-video`
2. Map the delivery against the 8 dimensions above
3. Identify the 2–3 highest-impact delivery improvements
4. Note any changes from the written script and assess whether they helped or hurt
5. Add delivery notes to `SCRIPT_FEEDBACK_LOG.md`

### Delivery vs. Script Distinction

Delivery analysis and metrics analysis answer different questions:
- **Metrics** tell you whether the video worked (did viewers watch, save, buy?)
- **Delivery** tells you *why* it worked or did not work at the execution level

A video with weak metrics but strong delivery means the script needs work. A video with strong metrics but weak delivery means the script is carrying the video — and a better delivery version could perform significantly higher. Both diagnoses lead to different action steps.

### Delivery Feedback Goes in SCRIPT_FEEDBACK_LOG.md

All delivery observations — pacing notes, tonality notes, script deviation notes — go in `SCRIPT_FEEDBACK_LOG.md`, not in `VIDEO_PERFORMANCE_LOG.md`. The performance log tracks numbers. The feedback log tracks execution quality. When a delivery pattern repeats across multiple videos (e.g., energy consistently drops in the education section), that pattern gets promoted to MASTER_CONTEXT.md Section 9 as a filming rule.

---

## PART 7 — CONNECTION TO THE OVERLAY PLAYBOOK

Watch time data directly informs overlay strategy. If a video has strong watch time, the current overlay strategy is working — do not change it. If watch time is weak at a specific timestamp, consider whether an overlay at that point could have provided a visual stimulus to keep the viewer engaged.

Specific overlay-to-metric connections:
- **Low watch time at 15–30 seconds** → add a mechanism diagram or study screenshot at that timestamp in the next version
- **Low watch time at 30–60 seconds** → add a product name label or benefit checkmark at the product introduction moment
- **High saves but low GMV** → add a CTA arrow overlay pointing to the bio link in the final 10 seconds

These overlay adjustments should be noted in the POST-PRODUCTION NOTES section of the iterated script.

---

*This document is the framework. Raw data goes in VIDEO_PERFORMANCE_LOG.md. Delivery notes go in SCRIPT_FEEDBACK_LOG.md. Promoted rules go in MASTER_CONTEXT.md Section 9. Overlay adjustments based on watch time data go in the POST-PRODUCTION NOTES section of the iterated script.*
