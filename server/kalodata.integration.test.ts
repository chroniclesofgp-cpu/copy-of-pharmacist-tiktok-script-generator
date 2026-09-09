import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { radarCandidates } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Kalodata tRPC integration and compliance gate", () => {
  it("returns Kalodata status with masked key", async () => {
    const caller = appRouter.createCaller({ user: { id: 1 } } as any);
    const status = await caller.radar.getKalodataStatus();
    expect(status.hasKey).toBe(true);
    expect(status.maskedKey).toContain("••••••••");
  });

  it("searches Kalodata, stores raw snapshots, calculates metrics, and preserves compliance gate", async () => {
    const caller = appRouter.createCaller({ user: { id: 1 } } as any);
    const searchResult = await caller.radar.searchKalodata({
      keyword: "Magnesium",
      region: "US",
      maxCandidates: 1,
    });

    expect(searchResult.success).toBe(true);
    expect(searchResult.count).toBeGreaterThanOrEqual(1);
    const candidateId = searchResult.candidateIds[0];
    expect(candidateId).toBeDefined();

    const db = await getDb();
    expect(db).toBeDefined();
    const rows = await db!.select().from(radarCandidates).where(eq(radarCandidates.id, candidateId)).limit(1);
    const candidate = rows[0];
    expect(candidate).toBeDefined();
    expect(candidate.provider).toBe("Kalodata");
    expect(candidate.externalProductId).toBeDefined();

    // Verify raw snapshot is stored
    const rawSnapshot = JSON.parse(candidate.rawDataJson);
    expect(rawSnapshot.productId).toBe(candidate.externalProductId);
    expect(rawSnapshot.fetchedAt).toBeDefined();

    // Verify metrics are calculated
    const metrics = JSON.parse(candidate.metricsJson);
    expect(metrics.historyMode).toBeDefined();
    expect(metrics.accelerationBand).toBeDefined();

    // Verify compliance gate is locked
    expect(candidate.evidenceGateStatus).toBe("not_reviewed");
    expect(candidate.handoffStatus).toBe("not_ready");

    // Verify handoff to campaign planning fails because evidence gate is not approved
    await expect(caller.radar.handoffToCampaign({ id: candidateId })).rejects.toThrow(
      /Evidence\/compliance gate is not approved/i
    );

    // Test on-demand refresh
    const refreshResult = await caller.radar.refreshCandidateFromKalodata({ id: candidateId });
    expect(refreshResult.success).toBe(true);
    expect(refreshResult.fetchedAt).toBeDefined();
    expect(refreshResult.metrics).toBeDefined();

    // Verify compliance gate still locked after refresh
    const refreshedRows = await db!.select().from(radarCandidates).where(eq(radarCandidates.id, candidateId)).limit(1);
    expect(refreshedRows[0].evidenceGateStatus).toBe("not_reviewed");
    expect(refreshedRows[0].handoffStatus).toBe("not_ready");
  }, 35000);
});
