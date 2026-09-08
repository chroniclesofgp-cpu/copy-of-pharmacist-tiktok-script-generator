import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packagePath = resolve(
  process.cwd(),
  "scripts/campaigns/DRYWATER_RASPBERRY_LEMON_campaign.md"
);
const packageText = readFileSync(packagePath, "utf8");

function spokenScript(number: number) {
  const afterHeading = packageText.split(`## Script ${number} —`)[1] ?? "";
  return (afterHeading.split("### Spoken script")[1] ?? "").split("### Post-production notes")[0];
}

describe("DryWater campaign script package", () => {
  it("contains the approved ten-script campaign with a filming-ready package for every asset", () => {
    expect((packageText.match(/^## Script \d+ /gm) ?? []).length).toBe(10);
    expect((packageText.match(/^### Triple hook$/gm) ?? []).length).toBe(10);
    expect((packageText.match(/^### Spoken script$/gm) ?? []).length).toBe(10);
    expect((packageText.match(/^### Post-production notes$/gm) ?? []).length).toBe(10);
    expect((packageText.match(/- \*\*Caption:\*\*/g) ?? []).length).toBe(10);
  });

  it("keeps the core current-label proof and linked-source cards accessible", () => {
    expect(packageText).toContain("1,000 milligrams of potassium");
    expect(packageText).toContain("380 milligrams of sodium");
    expect(packageText).toContain("zero grams of added sugar");
    expect(packageText).toContain("12 to 16 ounces of water");
    expect(packageText).toContain("https://drywater.com/products/raspberry-lemon");
    expect(packageText).toContain("https://pmc.ncbi.nlm.nih.gov/articles/PMC10781183/");
    expect(packageText).toContain(
      "https://ods.od.nih.gov/factsheets/Potassium-HealthProfessional/"
    );
  });

  it("keeps all five required BOF benefit-stack alternatives and gates deal-led scripts on a live offer", () => {
    expect((packageText.match(/### Five stack options for filming refresh/g) ?? []).length).toBe(2);
    expect((packageText.match(/\| \*\*[1-5]\./g) ?? []).length).toBeGreaterThanOrEqual(10);
    expect((packageText.match(/live offer/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(packageText).toContain("exact TikTok Shop cart");
    expect(packageText).toContain("real, current sale or offer");
    expect(packageText).toContain("hold this script");
  });

  it("uses a criteria-led Type 4 plan rather than an unsupported literal scam accusation", () => {
    const type4Section = packageText.split("## Script 10")[1] ?? "";
    expect(type4Section).toContain("criteria-led consumer-protection adaptation");
    expect(type4Section).toContain("three things I check");
    expect(type4Section).toContain("Do not accuse any legitimate item of fraud");
    expect(type4Section).toContain("Never call a legitimate named alternative fake");
    expect(type4Section).toContain("Never call a legitimate named alternative");
    expect(type4Section).not.toContain("This is fake, this is fake");
  });

  it("keeps plain-water framing and high-potassium medication context in their assigned scripts", () => {
    for (const number of [2, 3, 4, 5, 6, 8, 9, 10]) {
      expect(spokenScript(number)).not.toMatch(/\bplain water\b/i);
    }

    for (const number of [1, 2, 3, 4, 5, 6, 8, 9, 10]) {
      expect(spokenScript(number)).not.toMatch(/kidney disease|ace inhibitor|\barb\b|spironolactone|medication that affects potassium/i);
    }

    expect(spokenScript(1)).toMatch(/\bwater\b/i);
    expect(spokenScript(7)).toMatch(/\bwater\b/i);
    expect(spokenScript(7)).toMatch(/clinician has told you to limit potassium/i);
  });
});
