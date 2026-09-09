# Product Radar Walkthrough — Example Magnesium Complex

## Fixture

The walkthrough uses `server/fixtures/radar-example-magnesium.csv`, a realistic FastMoss-style export row. It is a test fixture only and is not seeded into the database automatically.

| Input | Value |
|---|---:|
| Provider | FastMoss |
| Product age | 120 days |
| Total sales | 12,000 units |
| 7-day sales | 3,000 units |
| 90-day sales | 18,000 units |
| Daily units, last 7 days | 120, 125, 130, 135, 140, 145, 190 |
| Video sales share | 72% |
| Live sales share | 18% |
| Product-card share | 10% |
| Top-video concentration | 34% |
| Rating | 4.6 |
| Commission after ads | 12% |

## Step 1 — CSV import and validation

The file is uploaded from the Product Radar page at `/radar`. The parser requires `productName`, `totalSales`, and `sales7d`. The daily series is read from `dailySalesJson`; malformed JSON or invalid required numbers are returned as row-level errors rather than silently imported.

The fixture produces **one valid candidate row and zero validation errors**. The import record stores the provider label, filename, total row count, valid row count, and any error list. The candidate stores the raw row unchanged, while each daily observation is stored separately in `radarDailySales`.

## Step 2 — Deterministic calculations

Because the product is 120 days old, the mature-product formula applies:

> 7-day sales ÷ 90-day sales = 3,000 ÷ 18,000 = 0.1666667 = **16.67%**

The source video describes 15–20% as **clearly accelerating**, so the Product Radar classifies this candidate as `clear`. This is not an AI judgment.

The last seven daily observations contain five days within 20% of their seven-day average, so the stability requirement of 5+ similar days is met. Six of seven days are at least 100 units, so the minimum strength requirement of two days over 100 is met. The latest-day multiplier is:

> 190 ÷ 145 = **1.31×**

The default requirement is 1.30×, so the latest-day acceleration signal is met. Video sales are 72%, meeting both the 50% minimum and the 70% preferred threshold. Top-video concentration is 34%, which is below 40%, so the sales are classified as `spread_out`, not dependent on one winner video. Rating and commission also meet their default secondary thresholds.

The candidate therefore enters the queue as a **watchlist** item under the current deterministic status rule because it has clear acceleration, stable recent sales, enough video share, and latest-day acceleration. The UI still shows every underlying value and does not collapse the result into a single opaque score.

## Step 3 — Review status and creator-fit fields

The reviewer can change the status to `human review`, `avoid`, `candidate`, `watchlist`, or `approved for campaign planning`. The creator-fit section records only operational information:

| Review field | Example walkthrough state |
|---|---|
| Credibility to demonstrate the mechanism | To be completed from the pharmacist's product-intelligence record and actual product facts |
| Audience relevance | To be completed against the intended audience and problem context |
| Available footage | To be completed from existing footage or planned demonstration shots |
| Claims support in product intelligence | Must link to or summarize the existing evidence-ready product record |

These fields do not make a judgment about personal suitability. They document whether the creator can credibly demonstrate the specific mechanism and whether the intended claims are supportable.

## Step 4 — Compliance-gated campaign handoff

A high radar result cannot hand off to campaign planning immediately. The candidate starts with `evidenceGateStatus = not_reviewed` and `handoffStatus = not_ready`.

The first attempted handoff is blocked because the evidence gate is not approved. The shared predicate requires both conditions:

```text
reviewStatus = approved_for_campaign_planning
AND evidenceGateStatus = approved
```

The test suite verifies the following negative cases: approved review status with `not_reviewed` is blocked; approved review status with `blocked` is blocked; and `watchlist` with an approved evidence gate is also blocked. Only after the reviewer completes the existing product-intelligence/evidence/compliance review and explicitly sets both values does the handoff become `handed_off_to_campaign_planning`.

This preserves the existing safety architecture: sales velocity can prioritize a product for attention, but it cannot by itself authorize script generation or unsupported claims.

## AI separation

AI-assisted notes, such as summaries of recurring top-video hooks or a creator-fit review brief, are stored in the separate `aiBriefJson` field with `source: ai_assisted`. The deterministic metric calculation never reads that field. Saving or changing an AI brief cannot alter the calculated ratio, threshold signals, review status, or evidence gate. The UI labels those notes as advisory and keeps them visually separate from the deterministic metrics.

## Verification status

The source-video math and pipeline rules are covered in `server/radar.test.ts`. The full project test suite passes with **274 tests across 15 test files**, and TypeScript checking passes with zero errors. The Product Radar page has been visually verified at `/radar` with the empty-state, screening-profile, CSV-import, and gate-design UI visible.
