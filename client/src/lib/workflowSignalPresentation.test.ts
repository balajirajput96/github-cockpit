import { describe, expect, it } from "vitest";
import { summarizeWorkflowSignals, type WorkflowSignalView } from "./workflowSignalPresentation";

const signal = (classification: string): WorkflowSignalView => ({
  id: 1,
  repository: "owner/repository",
  workflowName: "CI",
  event: "push",
  status: "completed",
  conclusion: "success",
  classification,
  runUrl: "https://github.com/owner/repository/actions/runs/1",
  observedAt: new Date("2026-08-19T00:00:00.000Z"),
});

describe("workflow signal presentation", () => {
  it("keeps code-review failures separate from external and queued states", () => {
    expect(summarizeWorkflowSignals([
      signal("healthy"),
      signal("failure"),
      signal("external"),
      signal("queued"),
      signal("cancelled"),
    ])).toEqual({ healthy: 1, review: 2, external: 1, queued: 1 });
  });
});
