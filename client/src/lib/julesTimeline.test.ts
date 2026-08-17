import { describe, expect, it } from "vitest";
import { hasReviewOnlyBoundary, hasVerifiedJulesRun, JULES_EXECUTION_EVENTS, JULES_EXECUTION_RUN, PR46_REVIEW_CHECKLIST } from "./julesTimeline";

describe("Jules execution timeline evidence", () => {
  it("preserves the direct native schedule-to-task-to-PR linkage", () => {
    expect(hasVerifiedJulesRun()).toBe(true);
    expect(JULES_EXECUTION_RUN.schedule.executedAt).toBe("2026-08-16T03:30:00Z");
    expect(JULES_EXECUTION_RUN.pullRequest.branch).toContain(JULES_EXECUTION_RUN.task.id);
  });

  it("keeps the final action explicitly review-only", () => {
    expect(hasReviewOnlyBoundary()).toBe(true);
    expect(JULES_EXECUTION_EVENTS.at(-1)?.label).toBe("Human review remains");
    expect(JULES_EXECUTION_EVENTS.every((event) => event.href?.startsWith("https://"))).toBe(true);
  });

  it("exposes the verified daily report and actionable PR review references", () => {
    expect(JULES_EXECUTION_RUN.dailyReport.displayTime).toBe("16 Aug · 09:30 IST");
    expect(PR46_REVIEW_CHECKLIST).toHaveLength(4);
    expect(PR46_REVIEW_CHECKLIST.every((item) => item.href.startsWith("https://github.com/"))).toBe(true);
  });
});
