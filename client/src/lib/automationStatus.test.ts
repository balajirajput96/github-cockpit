import { describe, expect, it } from "vitest";
import { AUTOMATION_STATUS_ITEMS, summarizeAutomationStatus } from "./automationStatus";

describe("automation status presentation", () => {
  it("keeps current connector operations explicitly bounded and reviewable", () => {
    expect(AUTOMATION_STATUS_ITEMS.map((item) => item.id)).toEqual([
      "digest",
      "portfolio",
      "pharma-pr",
      "workflow-sweep",
      "repair-pr-review",
      "normal-event-validation",
      "research-media",
      "live-provider-credential",
      "jules-readiness",
      "antigravity-readiness",
      "dependabot",
      "dependency-security-pr",
      "toolchain-zero-audit",
      "mcp-lockfile-remediation",
      "node-runtime-pr",
      "secret-scan-history-fix",
      "biotech-outreach",
    ]);
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "digest")?.detail).toContain("never pushes, merges");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "pharma-pr")?.href).toContain("/pull/6");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "pharma-pr")?.title).toContain("Merged PR #6");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "dependency-security-pr")?.title).toContain("Merged PR #1");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "toolchain-zero-audit")?.detail).toContain("zero advisories");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "node-runtime-pr")?.title).toContain("Merged PR #50");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "node-runtime-pr")?.detail).toContain("merged, not review-only");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "secret-scan-history-fix")?.href).toContain("/pull/51");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "secret-scan-history-fix")?.detail).toContain("supersedes post-merge commit b52cc59");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "workflow-sweep")?.detail).toContain("No workflow was rebased or force-pushed");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "repair-pr-review")?.title).toContain("merged");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "normal-event-validation")?.detail).toContain("successful current-main workflow evidence");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "live-provider-credential")?.detail).toContain("No secret was read, changed, or replaced");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "jules-readiness")?.title).toContain("no Sentinel session");
  });

  it("summarizes current healthy, attention, and blocked automation items", () => {
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "biotech-outreach")?.detail).toContain("No application, resume attachment, or email is sent");
    expect(AUTOMATION_STATUS_ITEMS.find((item) => item.id === "mcp-lockfile-remediation")?.detail).toContain("does not claim an Actions runtime upgrade");
    expect(summarizeAutomationStatus()).toEqual({ healthy: 10, attention: 3, blocked: 4 });
  });
});
