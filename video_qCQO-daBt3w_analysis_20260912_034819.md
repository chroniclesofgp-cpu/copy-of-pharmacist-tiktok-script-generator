Based on the video, the creator explicitly states that he **does not** use the standard web interfaces of Kalodata or FastMoss, nor does he manually scroll through pages, select filters, or manually export CSVs from a dashboard. 

Instead, he uses an automated programmatic approach, feeding specific API endpoints from these tools into AI coding tools (like Claude Code or Codex) to extract and filter the data automatically.

Here is the comprehensive breakdown of the exact logic, metrics, parameters, and workflow he uses in his automated system to filter and eliminate products:

### **The API Endpoints Used:**
1. **Search Product:** `POST /product/v1/search`
2. **Daily Sales:** `POST /product/v1/salesTrend`
3. **Top Selling Video:** `POST /product/v1/videoList`

### **Step 1: Initial Search & Filtering**
*   **Market:** US Market
*   **Niche/Category:** Specifies a niche (e.g., Health, Skincare, Home)
*   **Total Units Sold:** Filters for **2,000 to 40,000 units**. 
    *   *Elimination logic:* Under 2,000 is too early (no trend yet); over 40,000 is too saturated and competitive.
*   **Sorting:** Sorts by `day7_units_sold` descending.
*   **Quantity:** Pulls 100 unique products.
*   **Data Captured:** Product ID, title, total sales, 7-day sales, 28-day sales, 90-day sales, yesterday's sales, price, commission, rating, and category.

### **Step 2: The Core Metric (Acceleration Ratio)**
He calculates the ratio of recent sales to historical sales: **7-day sales divided by 90-day sales**.
*   **< 8%:** Flat/Declining (Eliminated or low priority)
*   **8 - 15%:** Early rise / normal
*   **15 - 20%:** Accelerating (Good)
*   **> 20%:** Strong acceleration (Great, but verify it’s not a one-day anomaly)

**For New Products (Under 30-90 days old):**
Since they lack 90 days of history, he checks:
*   Ratio of **7-day sales / 30-day sales**
*   **Daily Velocity:** Is it doing at least 100 units a day?
*   Is yesterday's sales greater than the average?
*   Is yesterday's sales **130%+** (1.3x) of the average? (Indicates strong acceleration).

### **Step 3: 7-Day Sales Pattern Analysis**
He analyzes the daily sales chart for the last 7 days to evaluate:
*   **Continuity:** At least 5 of the 7 days must be selling at a similar level (eliminates sudden spike-and-drop products).
*   **Strength:** Ideally, every day is over 100 units (minimum 2 days over 100 units).
*   **Acceleration:** The latest day's sales should be at least **1.3 times** higher than the day before.
*   *Elimination logic:* Products trending down, or products that spike for 1-3 days and immediately fall back (often driven by a single viral video or temporary coupon) are eliminated or moved to a watchlist.

### **Step 4: Sales Source & Concentration (The Final Check)**
He investigates where the sales are actually coming from.
*   **Sales Source:** Ideally, **70%+** of sales should come from Videos (rather than livestreams or product cards). Minimum threshold is 50%.
*   **Video Concentration Calculation:** He takes the sales of the #1 top video and divides it by the total sales of the top 10 videos.
    *   **< 40% (Good):** Sales are spread across many creators and videos. The product has real market demand.
    *   **40% - 70% (OK):** Somewhat concentrated. Needs manual review to see what types of videos are winning.
    *   **> 70% (Bad/Eliminate):** The entire product is being carried by one viral video or one specific creator. Highly risky to replicate.

### **Additional Secondary Filters:**
*   **Rating:** Minimum **4.0** stars (he prefers 4.2+).
*   **Commission:** Must be at least **10%** (he notes skincare and supplements often pay higher).

### **Final Output Categorization:**
His system outputs the surviving products into two specific buckets:
1.  **Core Pick:** Total sales 2K-40K; 7-day/90-day ratio >= 15%; last 7 days stable at 100+ daily; top video concentration under 70%.
2.  **Breakout Pick:** Total sales 1K-10K; listed under 90 days; daily average 100+; yesterday is >= 130% of that average (accelerating).