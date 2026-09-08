import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import {
  parseTimestampToSeconds,
  formatSecondsToTimestamp,
  parseTranscriptText,
  calculateSimilarity,
  isFalseStartOrStub,
  detectTakesAndGroups,
} from "./lib/takeDetector";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test Creator",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("takeDetector unit tests", () => {
  it("parses timestamps correctly", () => {
    expect(parseTimestampToSeconds("00:32.2")).toBeCloseTo(32.2);
    expect(parseTimestampToSeconds("01:13.2")).toBeCloseTo(73.2);
    expect(parseTimestampToSeconds("05:58.4")).toBeCloseTo(358.4);
    expect(formatSecondsToTimestamp(73.2)).toBe("01:13.2");
    expect(formatSecondsToTimestamp(358.4)).toBe("05:58.4");
  });

  it("identifies stubs and false starts", () => {
    expect(isFalseStartOrStub("And")).toBe(true);
    expect(isFalseStartOrStub("To")).toBe(true);
    expect(isFalseStartOrStub("I would")).toBe(true);
    expect(isFalseStartOrStub("To celebrate the new...")).toBe(true);
    expect(isFalseStartOrStub("if your skin is ten...")).toBe(true);
    expect(isFalseStartOrStub("I'm gonna drop the link below if you wanna check it out, I would hurry before they're gone.")).toBe(false);
  });

  it("calculates similarity accurately on retakes", () => {
    const take1 = "I say maybe if you bought them all separately.";
    const take2 = "I say maybe if you bought them all separately.";
    expect(calculateSimilarity(take1, take2)).toBeGreaterThan(0.9);

    const partial = "To celebrate the launch, they're also giving...";
    const complete = "To celebrate the new launch, they're also giving away some bonuses.";
    expect(calculateSimilarity(partial, complete)).toBeGreaterThan(0.35);

    const unrelated = "So the actual daily routine is wash every day.";
    const cta = "I'm gonna drop the link below if you wanna check it out.";
    expect(calculateSimilarity(unrelated, cta)).toBeLessThan(0.2);
  });

  it("processes IMG_7546 transcript and groups retakes with Last-Take rule", () => {
    const filePath = "/home/ubuntu/upload/IMG_7546_converted_20260908_171807_transcription_20260908_171817.txt";
    const text = fs.readFileSync(filePath, "utf-8");
    const segments = parseTranscriptText(text, "IMG_7546", 0);

    expect(segments.length).toBeGreaterThan(15);

    const result = detectTakesAndGroups(segments, { totalDuration: 360.25 });

    // Groups should be created
    expect(result.takeGroups.length).toBeGreaterThan(3);

    // Should save vast amounts of dead air
    expect(result.totalRawDuration).toBeCloseTo(360.25);
    expect(result.totalEditedDuration).toBeLessThan(75); // edited down to < 75s
    expect(result.savingsPercent).toBeGreaterThan(70);  // over 70% dead air cut

    // Find group for "I say maybe if you bought them all separately"
    const maybeGroup = result.takeGroups.find(g =>
      g.takes.some(t => t.text.toLowerCase().includes("bought them all separately"))
    );
    expect(maybeGroup).toBeDefined();
    expect(maybeGroup?.hasMultipleTakes).toBe(true);

    // Verify that the chosen take is the last complete take in that group
    const selectedTake = maybeGroup?.takes.find(t => t.isSelected);
    expect(selectedTake).toBeDefined();
    expect(selectedTake?.isComplete).toBe(true);
    expect(selectedTake?.isLastTake).toBe(true);

    // Verify CTA group ("I'm gonna drop the link below")
    const ctaGroup = result.takeGroups.find(g =>
      g.takes.some(t => t.text.toLowerCase().includes("drop the link below"))
    );
    expect(ctaGroup).toBeDefined();
    const selectedCta = ctaGroup?.takes.find(t => t.isSelected);
    expect(selectedCta).toBeDefined();
    expect(selectedCta?.text.toLowerCase()).toContain("hurry before they're gone");
  });

  it("processes IMG_7502 transcript and handles warning take options", () => {
    const filePath = "/home/ubuntu/upload/IMG_7502_converted_20260908_170157_transcription_20260908_170205.txt";
    const text = fs.readFileSync(filePath, "utf-8");
    const segments = parseTranscriptText(text, "IMG_7502", 0);

    expect(segments.length).toBeGreaterThan(10);

    const result = detectTakesAndGroups(segments, { totalDuration: 210.45 });
    expect(result.takeGroups.length).toBeGreaterThan(3);
    expect(result.totalEditedDuration).toBeLessThan(60);
    expect(result.savingsPercent).toBeGreaterThan(65);

    // Verify the sensitivity warning group
    const warningGroup = result.takeGroups.find(g =>
      g.takes.some(t => t.text.toLowerCase().includes("sensitive"))
    );
    expect(warningGroup).toBeDefined();
    expect(warningGroup?.hasMultipleTakes).toBe(true);

    // The selected take in the warning group should be the spray version (the last take)
    const selectedWarning = warningGroup?.takes.find(t => t.isSelected);
    expect(selectedWarning).toBeDefined();
    expect(selectedWarning?.text.toLowerCase()).toContain("exfoliating steps at once");
  });
});

describe("videoEditor tRPC router tests", () => {
  it("returns available sample clips", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const clips = await caller.videoEditor.getSampleClips();
    expect(clips.length).toBeGreaterThanOrEqual(2);
    expect(clips.some(c => c.id === "IMG_7546")).toBe(true);
    expect(clips.some(c => c.id === "IMG_7502")).toBe(true);
  });

  it("detects takes from sample clip IMG_7546 via router", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.videoEditor.detectTakes({
      clipId: "IMG_7546",
      audioBleedEnabled: true,
      audioBleedDurationMs: 150,
    });

    expect(result.takeGroups.length).toBeGreaterThan(3);
    expect(result.savingsPercent).toBeGreaterThan(70);
    expect(result.allTakes.filter(t => t.isSelected).length).toBe(result.takeGroups.length);
  });

  it("detects takes from custom transcript text via router", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const customText = `
[00:00.0 - 00:04.0] Stop taking magnesium until you know this.
[00:06.0 - 00:10.0] Stop taking magnesium until you check the form on the back of the bottle.
[00:12.0 - 00:16.0] Because most brands use magnesium oxide which only has a four percent absorption rate.
[00:20.0 - 00:24.0] The link is below if you want the right form.
[00:26.0 - 00:30.0] The link is below if you want the right form before it sells out.
`;
    const result = await caller.videoEditor.detectTakes({
      transcriptText: customText,
      audioBleedEnabled: true,
    });

    expect(result.takeGroups.length).toBe(3);
    // Group 1: Stop taking magnesium... (2 takes, second selected)
    expect(result.takeGroups[0].hasMultipleTakes).toBe(true);
    expect(result.takeGroups[0].takes[1].isSelected).toBe(true);
    // Group 3: CTA (2 takes, second selected)
    expect(result.takeGroups[2].hasMultipleTakes).toBe(true);
    expect(result.takeGroups[2].takes[1].text).toContain("before it sells out");
  });

  it("renders an edited TikTok video with audio bleed via renderVideo mutation", async () => {
    const caller = appRouter.createCaller(createTestContext());
    // Render two short takes from IMG_7546
    const renderRes = await caller.videoEditor.renderVideo({
      clipId: "IMG_7546",
      selectedTakes: [
        {
          id: "take_1",
          startTime: 53.0,
          endTime: 57.5,
          paddedStart: 52.92,
          paddedEnd: 57.62,
          duration: 4.7,
          text: "how am I supposed to afford a peel shot, body wash, and lotion?",
        },
        {
          id: "take_2",
          startTime: 61.0,
          endTime: 64.2,
          paddedStart: 60.92,
          paddedEnd: 64.32,
          duration: 3.4,
          text: "Isn't all of that gonna be super expensive?",
        },
      ],
      settings: {
        audioBleedEnabled: true,
        audioBleedDurationMs: 150,
        leadInPaddingMs: 80,
        leadOutPaddingMs: 120,
        aspectRatio: "9:16",
        resolution: "720p",
        fps: 30,
      },
    });

    expect(renderRes.success).toBe(true);
    expect(renderRes.outputUrl).toContain("/api/exports/tiktok_cut_IMG_7546_");
    expect(renderRes.durationSeconds).toBeGreaterThan(6);
    expect(renderRes.fileSizeBytes).toBeGreaterThan(100000);
    expect(renderRes.audioBleedApplied).toBe(true);
  }, 45000); // 45s timeout for video encoding

  it("renders an edited TikTok video with audio bleed for IMG_7502 via renderVideo mutation", async () => {
    const caller = appRouter.createCaller(createTestContext());
    // Render two takes from IMG_7502 (intro + warning)
    const renderRes = await caller.videoEditor.renderVideo({
      clipId: "IMG_7502",
      selectedTakes: [
        {
          id: "take_intro",
          startTime: 21.0,
          endTime: 25.5,
          paddedStart: 20.92,
          paddedEnd: 25.62,
          duration: 4.7,
          text: "the actual daily routine is wash every day.",
        },
        {
          id: "take_warning",
          startTime: 104.0, // 01:44
          endTime: 110.0,   // 01:50
          paddedStart: 103.92,
          paddedEnd: 110.12,
          duration: 6.2,
          text: "I would not stack the spray with the lotion if your skin tends to be sensitive because that's two exfoliating steps at once.",
        },
      ],
      settings: {
        audioBleedEnabled: true,
        audioBleedDurationMs: 150,
        leadInPaddingMs: 80,
        leadOutPaddingMs: 120,
        aspectRatio: "9:16",
        resolution: "720p",
        fps: 30,
      },
    });

    expect(renderRes.success).toBe(true);
    expect(renderRes.outputUrl).toContain("/api/exports/tiktok_cut_IMG_7502_");
    expect(renderRes.durationSeconds).toBeGreaterThan(8);
    expect(renderRes.fileSizeBytes).toBeGreaterThan(100000);
  }, 45000);
});
