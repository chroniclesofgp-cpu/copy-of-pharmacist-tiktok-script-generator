import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

describe("script quality control regression safeguards", () => {
  it("keeps the product-advancement ledger and package repetition scan as required controls", () => {
    const architecture = readProjectFile("SCRIPT_ARCHITECTURE_GUIDE.md");
    const checklist = readProjectFile("POST_WRITE_CHECKLIST.md");

    expect(architecture).toContain("Rule E.1: Product-Advancement Ledger");
    expect(architecture).toContain("across the full script and the campaign package");
    expect(checklist).toContain("Item 13a — Product-Advancement and Package Repetition Pass");
    expect(checklist).toContain("Beat ledger:");
  });

  it("requires the LLM quality reviewer to inspect redundancy, product advancement, and authority/safety repetition", () => {
    const router = readProjectFile("server/routers/tiktok.ts");

    expect(router).toContain("CHECK 8 — RULE E: NO SENTENCE REDUNDANCY");
    expect(router).toContain("CHECK 9 — PRODUCT-ADVANCEMENT / BRAND-HIERARCHY");
    expect(router).toContain("CHECK 10 — AUTHORITY AND OBJECTION DISCIPLINE");
    expect(router).toContain("Quality reviewer returned no usable output; manual review is required.");
    expect(router).toContain("qualityReview");
  });

  it("keeps retained automatic quality findings visible to the script writer", () => {
    const clientContract = readProjectFile("client/src/lib/scriptData.ts");
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(clientContract).toContain("qualityReview?:");
    expect(home).toContain("Automatic Script Quality Review");
    expect(home).toContain("First-draft findings");
    expect(home).toContain("Manual-review findings");
    expect(home).toContain("no-redundancy, product advancement, and authority/objection discipline");
  });
});
