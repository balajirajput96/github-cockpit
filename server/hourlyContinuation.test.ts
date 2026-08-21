import { describe, expect, it } from "vitest";
import { buildHourlyCycleKey, buildRecoveryQueue, continuationStatus } from "./hourlyContinuation";

describe("hourly continuation helpers", () => {
  it("uses one idempotency key per scheduled UTC hour", () => {
    expect(buildHourlyCycleKey("task-1", new Date("2026-08-21T07:42:13.000Z"))).toBe("task-1:2026-08-21T07");
  });

  it("keeps only non-healthy signals in a bounded recovery queue", () => {
    const queue = buildRecoveryQueue([
      { signalKey: "healthy", repository: "org/a", workflowName: "CI", runId: "1", event: "push", status: "completed", conclusion: "success", classification: "healthy", runUrl: "https://example.com/a", observedAt: new Date() },
      { signalKey: "queued", repository: "org/b", workflowName: "CI", runId: "2", event: "push", status: "queued", conclusion: null, classification: "queued", runUrl: "https://example.com/b", observedAt: new Date() },
      { signalKey: "failed", repository: "org/c", workflowName: "Build", runId: "3", event: "push", status: "completed", conclusion: "failure", classification: "failure", runUrl: "https://example.com/c", observedAt: new Date() },
    ]);

    expect(queue).toEqual([
      { repository: "org/b", workflowName: "CI", classification: "queued", runUrl: "https://example.com/b" },
      { repository: "org/c", workflowName: "Build", classification: "failure", runUrl: "https://example.com/c" },
    ]);
  });

  it("marks the bounded mission complete at its ceiling", () => {
    expect(continuationStatus(2399)).toBe("recorded");
    expect(continuationStatus(2400)).toBe("completed");
  });
});
