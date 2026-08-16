import { describe, expect, it } from "vitest";
import { hasVerifiedJulesRun, JULES_EXECUTION_EVENTS, JULES_EXECUTION_RUN } from "./julesTimeline";

describe("Jules execution timeline evidence", () => {
  it("preserves the direct native schedule-to-task-to-PR linkage", () => {
    expect(hasVerifiedJulesRun()).toBe(true);
    expect(JULES_EXECUTION_RUN.schedule.executedAt).toBe("2026-08-16T03:30:00Z");
    expect(JULES_EXECUTION_RUN.pullRequest.branch).toContain(JULES_EXECUTION_RUN.task.id);
  });

  it("keeps the final action explicitly review-only", () => {
    expect(JULES_EXECUTION_RUN.reviewOnly).toBe(true);
    expect(JULES_EXECUTION_EVENTS.at(-1)?.label).toBe("Human review remains");
    expect(JULES_EXECUTION_EVENTS.every((event) => event.href?.startsWith("https://"))).toBe(true);
  });
});
