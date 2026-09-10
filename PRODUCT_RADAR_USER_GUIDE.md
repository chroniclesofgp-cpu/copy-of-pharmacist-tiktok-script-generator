# Product Radar: Standard Operating Procedure & Best Practices Guide
*A Systematic Framework for TikTok Shop Product Research, Deterministic Velocity Screening, and Pharmacist-Led Compliance Handoff*

---

## 1. Executive Summary & Design Philosophy

Product Radar is an analytical screening engine engineered specifically for health, supplement, and skincare creators on TikTok Shop. Unlike generic product research tools that rely on opaque AI rankings or raw sales totals, Product Radar enforces a disciplined two-tiered screening architecture: **deterministic velocity math** followed by **operational creator-fit review and clinical compliance gating**.

A fundamental tenet of the system is that **sales velocity alone is never sufficient to justify creating a TikTok video**. On TikTok Shop, a supplement can experience a multi-day sales spike driven by aggressive, non-compliant affiliate claims, single-influencer viral flukes, or steep loss-leader discounting. For a licensed healthcare professional, scripting a video for a product with contaminated sourcing, unverified active ingredients, or prohibited disease claims creates severe regulatory and professional risk.

To safeguard your brand and maximize revenue, Product Radar separates research into three clear boundaries:
1. **Deterministic Metrics Engine**: Raw data from live Kalodata API calls or CSV exports is calculated using rigid mathematical rules. No AI prompt can alter or override these metrics.
2. **Operational Creator-Fit Review**: An objective assessment of whether a product’s physical mechanism can be credibly demonstrated on camera and whether compliant b-roll footage exists.
3. **Mandatory Evidence & Compliance Gate**: Even if a product achieves a perfect mathematical score, it remains strictly blocked from script generation until its formulation, warnings, and label claims pass clinical vetting.

---

## 2. Core Metrics: How the Engine Evaluates Products

Product Radar calculates nine independent signals to evaluate market momentum, audience interest, competitive saturation, and revenue durability.

### Summary of Scoring Thresholds & Benchmarks

| Metric Category | Code Signal | Recommended Benchmark | Interpretation & Rationale |
| :--- | :--- | :--- | :--- |
| **Total Sales Volume** | `minTotalSales`<br>`maxTotalSales` | **Coach A**: 2,000–40,000 units<br>**Coach B**: 1,000–9,000 units | Establishes proof of market demand without entering late-stage product saturation where audience fatigue is high. |
| **Velocity Acceleration** | `sales7d / sales90d` (Mature)<br>`sales7d / sales30d` (New) | **< 8%**: Not Accelerating<br>**8%–15%**: Starting<br>**15%–20%**: Clear<br>**> 20%**: Strong | Compares recent 7-day velocity against broader historical baselines to detect accelerating inflection points before market peaking. |
| **Pattern Stability** | `stableDays`<br>(20% band around mean) | **$\ge$ 5 of 7 days** | Ensures volume represents consistent daily buying behavior rather than a single erratic flash-sale spike. |
| **Volume Floor (Strength)** | `strongDays`<br>($\ge$ 100 units/day) | **$\ge$ 2 days $\ge$ 100 units**<br>(New: Yesterday $\ge$ 100) | Validates that daily throughput has cleared baseline viability and is not idling at hobbyist volumes. |
| **Breakout Multiplier** | `latestDayMultiplier` | **$\ge$ 1.30x (30% increase)** | Identifies immediate day-over-day acceleration signaling algorithm traction or fresh ad-spend deployment. |
| **Traffic Source Split** | `videoSalesPct` | **$\ge$ 70%** (Preferred)<br>**$\ge$ 50%** (Minimum Floor) | Confirms purchases are driven by short-form video content rather than intensive 4-hour live streams or showcase search. |
| **Video Concentration** | `topVideoSalesPct` | **< 40%**: Spread Out (Healthy)<br>**40%–70%**: Watch Closely<br>**> 70%**: High-Risk Single Video | Guards against single-creator dependency where a single viral video accounts for the entire brand GMV. |
| **Creator Competition** | `activeCreatorCount` | **$\le$ 300 Creators** (Manageable)<br>**> 300 Creators** (Saturated) | Flags high affiliate saturation where bidding competition is elevated and viewer fatigue has begun. |
| **Ad-Spend Validation** | `videosOver1MViews` | **$\ge$ 1 Video > 1M Views** | Serves as proxy proof that the brand or top affiliates have deployed paid spark ad backing with verified conversion. |
| **Margin Protection** | `commissionAfterAdsPct` | **$\ge$ 10% – 15%** Net | Ensures creator affiliate payout remains commercially viable after potential sample and operational costs. |

---

## 3. Screening Profiles: Coach A vs. Coach B Strategy

Product Radar does not enforce a single dogmatic sales range. Instead, it features named, switchable screening profiles that allow you to toggle between different market theses with a single click.

### 1. Coach A Range (2,000 – 40,000 Units) — *The Mature Scaler*
* **Thesis**: Targets established supplements with proven product-market fit, hundreds of real customer reviews, and consistent supply chains.
* **When to Use**: Ideal for evergreen educational angles (e.g., Magnesium Glycinate, Omega-3s, Vitamin D3/K2, Berberine).
* **Key Advantage**: Low risk of supplier stock-outs; high viewer familiarity reduces trust friction.
* **Primary Risk**: Higher competitor density; requires unique pharmacist hooks (e.g., chelation quality, absorption bioavailability, or dosing schedule mistakes).

### 2. Coach B Range (1,000 – 9,000 Units) — *The Early Breakout*
* **Thesis**: Targets emerging formulations right as they achieve commercial proof of concept, well before the broader affiliate market catches on.
* **When to Use**: Ideal for trending skincare actives, novel delivery formats (e.g., mouth sprays, drink sticks), or newly launched boutique wellness brands.
* **Key Advantage**: Minimal creator competition (<100 active creators); higher likelihood of your video becoming the dominant organic converting asset.
* **Primary Risk**: Fragile brand inventory; shorter historical track record to verify return rates or formula consistency.

> **Switching Strategy**: Use the **Profile Presets & Saved** dropdown in the left sidebar to switch between profiles. Clicking **Apply & Rescore All Candidates** instantly updates the evaluation across your entire candidate queue without re-importing data.

---

## 4. Daily Step-by-Step Research Workflow (SOP)

To maximize efficiency, incorporate this structured 15-minute daily routine into your morning content workflow.

```
┌────────────────────────────────────────────────────────┐
│  Step 1: Daily Intake (Kalodata Live Search or CSV)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  Step 2: Profile Selection & Deterministic Triage      │
│  (Review Acceleration Band, Stability, & Concentration)│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  Step 3: Operational Creator-Fit Evaluation            │
│  (Mechanism Credibility, Visual Proof, Audience Match) │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  Step 4: Clinical Evidence & Compliance Gate           │
│  (Formulation Vetting, Label Warnings, Contraindic.)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  Step 5: Campaign Handoff to Script Generation        │
└────────────────────────────────────────────────────────┘
```

### Step 1: Intake Trending Products
1. Navigate to `/radar` in your browser.
2. **Direct API Method**: Ensure the Kalodata API badge indicates `Connected`. Select your target search keyword from the quick chips (*Magnesium*, *Retinol*, *Berberine*, *Creatine*, *Shilajit*) or type a custom term. Set Region to `US (United States)` and Candidates to `Top 5` or `Top 10`. Click **Pull Live from Kalodata**.
3. **CSV Export Method**: If you run complex multi-filter screens inside FastMoss or Kalodata web dashboards, download your filtered CSV and drop it into the **CSV Import** tab.

### Step 2: Triage by Mathematical Signals
Review the populated **Candidate Queue** on the left. Candidates display automatic status tags:
* **Watchlist**: Meets all criteria: strong acceleration, $\ge$5 stable days, healthy video share ($\ge$50%), and day-over-day growth ($\ge$1.3x). Priority for immediate review.
* **Candidate**: Moderate momentum; meets volume and ratio baseline but may lack latest-day acceleration or video-split data.
* **Human Review**: Triggers an alert such as **High-Risk Single-Video Concentration (>70%)** or **High Competitor Saturation (>300 creators)**. Requires manual inspection of the top video before proceeding.
* **Avoid**: Volume outside your target range or acceleration $<8\%$ (stagnant/declining sales).

### Step 3: Conduct Operational Creator-Fit Review
Click on a candidate to open the **Candidate Detail** view. Scroll down to the **Operational Creator-Fit Review** section. Do not base this on personal preference; evaluate four operational criteria:
1. **Credibility to Demonstrate Specific Mechanism**: Can you explain how this compound operates physiologically (e.g., GABA binding, cortisol modulation, transdermal penetration) in under 15 seconds?
2. **Audience Relevance**: Does your core viewer demographic experience the specific condition targeted (e.g., poor sleep quality, post-acne erythema, brain fog)?
3. **Available Footage & Visual Demonstration**: Does the product have a visual component (e.g., dissolution speed, capsule texture, topical skin finish, third-party lab assay sheet) that can be shown as b-roll within the first 3 seconds?
4. **Claims Support in Product Intelligence**: Are the seller’s claims compliant with FTC and FDA structure/function rules, or does their store page make unlawful disease claims (e.g., "cures anxiety")?

### Step 4: Pass or Block the Evidence/Compliance Gate
Select the appropriate **Evidence/compliance gate** status:
* `Not reviewed`: Initial default state. Handoff is locked.
* `Needs product intel`: The active ingredients appear promising, but you require packaging images or third-party certificate of analysis (COA) to confirm exact dosages.
* `Blocked`: The product contains undisclosed proprietary blends, suspect sourcing, excessive contraindications, or severe red flags. Handoff is permanently prohibited.
* `Approved`: The formulation has been verified against clinical literature, contraindications are established, and acceptable educational claims have been documented.

### Step 5: Execute Handoff to Campaign Planning
Once you change the **Review status** to `Approved for campaign planning` **AND** the **Evidence/compliance gate** is marked `Approved`, the **Handoff to campaign planning** button becomes enabled. 

Clicking this button formalizes the transition, unlocking the candidate for immediate script development in **Rx Content** or **Shop Script** without compromising clinical safety.

---

## 5. Critical Traps & Red Flags to Avoid

### 1. The Single-Video Dependency Trap (`topVideoSalesPct > 70%`)
When a single affiliate video accounts for 70% to 90% of a brand’s total monthly sales, the product is not experiencing organic category demand. It is experiencing a single creator anomaly. If that video burns out or is suppressed by TikTok's algorithm, total product sales will collapse immediately. Look for products where sales are distributed across multiple creators (`topVideoSalesPct < 40%`).

### 2. The Live-Stream Illusion (`videoSalesPct < 50%`)
Certain beauty devices and weight-loss teas generate $50,000/week on TikTok Shop, but 85% of that revenue is generated by aggressive sellers running 6-hour daily live streams offering flash giveaways. When scripted as a standard 45-second educational video, these products almost always fail to convert because their sales model relies on real-time urgency and high-pressure live chat interaction.

### 3. The 500+ Creator Saturation Trap (`activeCreatorCount > 300`)
When more than 300 to 500 creators are actively promoting a single bottle, viewer feeds become flooded with repetitive messaging. Unless you possess a radically contrarian pharmacist angle (e.g., exposing an incorrect dosing habit or an inactive chemical form that competitors fail to mention), audience fatigue will result in low watch time and rapid swipe-aways.

### 4. The Disclaimer Overload Failure
If a product requires 25 seconds of continuous clinical disclaimers regarding prescription interactions, it cannot succeed as a high-retention TikTok Shop video. As established in the project’s `POST_WRITE_CHECKLIST.md`, major health cautions must live at the campaign planning level, while scripts remain punchy, educational, and natural. If a compound is too hazardous for clean, conversational delivery, mark it `Blocked` in Product Radar.

---

## 6. Daily Research Checklist

- [ ] Check Kalodata API connection status in Product Radar.
- [ ] Select active profile (`Coach A` for evergreen volume or `Coach B` for early breakouts).
- [ ] Execute keyword search or import daily CSV export.
- [ ] Flag products with $\ge$5 stable days and $\ge$15% acceleration.
- [ ] Verify video share is $\ge$50% and top-video concentration is $<70\%$.
- [ ] Check creator count ($\le$300) and 1M+ view video count ($\ge$1).
- [ ] Complete the 4-part Operational Creator-Fit Review.
- [ ] Verify active ingredient dosages against clinical evidence standards.
- [ ] Approve Evidence Gate and hand off product to Campaign Planning.

