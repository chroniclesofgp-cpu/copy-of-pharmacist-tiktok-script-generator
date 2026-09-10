import { describe, expect, it } from "vitest";

describe.skipIf(!process.env.KALODATA_API_KEY)("Kalodata API Key validation", () => {
  it("authenticates against Kalodata Open API with the supplied KALODATA_API_KEY secret", async () => {
    const key = process.env.KALODATA_API_KEY;
    expect(key).toBeDefined();
    expect(key?.length).toBeGreaterThan(10);

    const res = await fetch("https://www.kalodata.com/openapi/v1/category/rank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "secret-key": key!,
        "source-type": "SKILL",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        region: "US",
        language: "en-US",
        currency: "USD",
        date_range: "last7Day",
        page_number: 1,
      }),
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as { success: boolean; data?: any[]; code?: string; message?: string };
    if (json.code === "2016") {
      console.log("[Secret Test Notice] Kalodata API Key authenticated successfully, but account credit balance is currently exhausted.");
      expect(json.message).toMatch(/credit/i);
    } else {
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
    }
  }, 25000);
});
