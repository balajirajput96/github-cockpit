import { describe, expect, it } from "vitest";
import { classifyWorkflowRun, selectMonitoredRepositories } from "./workflowMonitor";

describe("workflow monitor classification", () => {
  it("keeps queued, external bot, cancelled, failed, and healthy runs distinct", () => {
    expect(classifyWorkflowRun({ status: "queued", conclusion: null, event: "push" })).toBe("queued");
    expect(classifyWorkflowRun({ status: "completed", conclusion: "failure", event: "dynamic" })).toBe("external");
    expect(classifyWorkflowRun({ status: "completed", conclusion: "cancelled", event: "push" })).toBe("cancelled");
    expect(classifyWorkflowRun({ status: "completed", conclusion: "failure", event: "push" })).toBe("failure");
    expect(classifyWorkflowRun({ status: "completed", conclusion: "success", event: "push" })).toBe("healthy");
  });

  it("limits collection to active non-fork repositories ordered by freshness", () => {
    const selected = selectMonitoredRepositories([
      { full_name: "owner/older", archived: false, fork: false, updated_at: "2026-08-01T00:00:00Z" },
      { full_name: "owner/fork", archived: false, fork: true, updated_at: "2026-08-19T00:00:00Z" },
      { full_name: "owner/archive", archived: true, fork: false, updated_at: "2026-08-19T00:00:00Z" },
      { full_name: "owner/newer", archived: false, fork: false, updated_at: "2026-08-18T00:00:00Z" },
    ] as never[], 1);
    expect(selected.map(repository => repository.full_name)).toEqual(["owner/newer"]);
  });
});
