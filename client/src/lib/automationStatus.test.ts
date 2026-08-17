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
      "dependency-security-pr",
      "mcp-lockfile-remediation",
      "node-runtime-pr",
      "secret-scan-history-fix",
      "biotech-outreach",
    ]);
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "digest")?.detail).toContain("never pushes, merges");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "pharma-pr")?.href).toContain("/pull/6");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "pharma-pr")?.title).toContain("Merged PR #6");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "dependency-security-pr")?.title).toContain("Merged PR #1");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "node-runtime-pr")?.title).toContain("Merged PR #50");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "node-runtime-pr")?.detail).toContain("merged, not review-only");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "secret-scan-history-fix")?.href).toContain("/pull/51");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "secret-scan-history-fix")?.detail).toContain("supersedes post-merge commit b52cc59");
  });

  it("summarizes current healthy, attention, and blocked automation items", () => {
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "biotech-outreach")?.detail).toContain("No application, resume attachment, or email is sent");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "mcp-lockfile-remediation")?.detail).toContain("does not claim an Actions runtime upgrade");
    expect(summarizeAutomationStatus()).toEqual({ healthy: 6, attention: 1, blocked: 3 });
  });
});
