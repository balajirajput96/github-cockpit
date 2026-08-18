import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("home remediation summary", () => {
  it("keeps the hero narrative aligned with the seven merged-repair metric", () => {
    expect(homeSource).toContain("Seven verified repairs, one recovery");
    expect(homeSource).toContain("seven validated changes merged");
    expect(homeSource).toContain('remediationPr: "07"');
    expect(homeSource).not.toContain("Four merges, one recovery");
  });
});
