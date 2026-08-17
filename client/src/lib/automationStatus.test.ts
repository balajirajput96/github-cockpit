import { describe, expect, it } from "vitest";
import { AUTOMATION_STATUS_ITEMS, summarizeAutomationStatus } from "./automationStatus";

describe("automation status presentation", () => {
  it("keeps current connector operations explicitly bounded and reviewable", () => {
    expect(AUTOMATION_STATUS_ITEMS.map((item) => item.id)).toEqual([
      "digest",
      "portfolio",
      "pharma-pr",
      "research-media",
      "dependabot",
      "node-20",
      "biotech-outreach",
    ]);
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "digest")?.detail).toContain("never pushes, merges");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "pharma-pr")?.href).toContain("/pull/6");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "pharma-pr")?.title).toContain("Merged PR #6");
  });

  it("summarizes current healthy, attention, and blocked automation items", () => {
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "biotech-outreach")?.detail).toContain("No application, resume attachment, or email is sent");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "node-20")?.detail).toContain("does not modify Actions files automatically");
    expect(summarizeAutomationStatus()).toEqual({ healthy: 3, attention: 1, blocked: 3 });
  });
});
