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
      "biotech-outreach",
    ]);
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "digest")?.detail).toContain("never pushes, merges");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "pharma-pr")?.href).toContain("/pull/6");
  });

  it("summarizes current healthy, attention, and blocked automation items", () => {
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "biotech-outreach")?.detail).toContain("No application, resume attachment, or email is sent");
    expect(summarizeAutomationStatus()).toEqual({ healthy: 2, attention: 1, blocked: 3 });
  });
});
