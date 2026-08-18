import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("home remediation summary", () => {
  it("keeps the hero narrative aligned with the eight merged-repair metric", () => {
    expect(homeSource).toContain("Eight verified repairs, one recovery");
    expect(homeSource).toContain("eight validated changes merged");
    expect(homeSource).toContain('remediationPr: "08"');
    expect(homeSource).not.toContain("Seven verified repairs, one recovery");
  });
});
