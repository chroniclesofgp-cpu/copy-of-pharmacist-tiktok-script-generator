# Kalodata Import, Screening Profiles, and Method Notes

## 1. Coach A vs. Coach B Differences
* **Coach A (Primary YouTube Video - https://youtu.be/qCQO-daBt3w):**
  * Target volume: 2,000 to 40,000 total sales (items sold).
  * Acceleration ratio: 7d sales / 90d sales (or 7d/30d for <90 days). >=15% accelerating, 8-15% starting, <8% flat/declining.
  * Flat sellers (~7.8% ratio = 7/90 uniform line) with steady 100+ daily units are consistent money-makers, NOT automatic hard rejects. Only truly collapsing/dead velocity products are hard avoids.
  * Sales source: >=50% minimum from videos (preferred >=70%).
  * Top video concentration: Top 1 video / Top 10 videos revenue. Under 40% = spread out / low risk; 40-70% = watch; >70% = high risk single-creator dependency.
  * Rating: >= 4.0 stars (prefers 4.2+).
  * Commission: >= 10%.
  * Creator saturation: Did NOT set a 300 creator ceiling. Broad creator participation with low concentration is seen as healthy demand.

* **Coach B (Secondary Profile):**
  * Target volume: 1,000 to 9,000 total sales (early breakout sweet spot).
  * Creator saturation ceiling: Max 300 active creators. Hard avoid if >300 because small sales volume split among 300+ creators means low per-creator revenue.

## 2. FastMoss vs. Kalodata API Endpoints & 90-Day vs. Lifetime
* In the YouTube video, the creator uses endpoints like:
  * `POST /product/v1/search`
  * `POST /product/v1/salesTrend`
  * `POST /product/v1/videoList`
  These match FastMoss API schemas, which return lifetime units and allow searching across lifetime unit volumes.
* Kalodata Open API (`POST /openapi/v1/product/rank` and `/product/detail`) natively supports `last7Day`, `last30Day`, and `last90Day`.
* Because Kalodata detail caps at 90 days, Product Radar uses direct `last90Day.sales_volumn` as the mature sales total. For products under 90 days, 90-day equals lifetime. For older products, 90-day captures active quarterly volume.

## 3. Kalodata Native Web Export Schema (from Kalodata_Product_20260912121602_US.xlsx)
Columns exported:
1. `Date Range` (e.g. `2026-08-09~2026-09-07`)
2. `Product Name`
3. `img_url`
4. `Category`
5. `Price($)`
6. `Shipping Fee($)`
7. `Launch Date`
8. `Product Rating`
9. `Item Sold` (Units sold in selected period)
10. `Avg. Unit Price($)`
11. `Commission Rate` (e.g. `15%`)
12. `Revenue($)`
13. `Revenue Growth Rate`
14. `Live Revenue($)`
15. `Video Revenue($)`
16. `Product Card Revenue`
17. `Creator Number` (Active creator count)
18. `Creator Conversion Ratio`
19. `KalodataUrl` (contains product ID)
20. `TikTokUrl` (contains product ID)
