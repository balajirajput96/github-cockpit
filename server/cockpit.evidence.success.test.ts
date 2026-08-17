import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getDailyEvidence: vi.fn(),
  createDailyEvidenceScheduleRecord: vi.fn(),
  createPr46Review: vi.fn(),
  getLatestPr46Review: vi.fn(),
  createHeartbeatJob: vi.fn(),
}));

vi.mock("./db", () => ({
  getDailyEvidence: mocks.getDailyEvidence,
  createDailyEvidenceScheduleRecord: mocks.createDailyEvidenceScheduleRecord,
  createPr46Review: mocks.createPr46Review,
  getLatestPr46Review: mocks.getLatestPr46Review,
}));

vi.mock("./_core/heartbeat", () => ({
  createHeartbeatJob: mocks.createHeartbeatJob,
}));

import { appRouter } from "./routers";

function adminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "owner-open-id",
      name: "Owner",
      email: "owner@example.com",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("cockpit evidence schedule registration success path", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates and persists the project-owned 09:30 IST heartbeat once", async () => {
    mocks.getDailyEvidence.mockResolvedValueOnce(null);
    mocks.createHeartbeatJob.mockResolvedValue({ taskUid: "heartbeat-task-1" });
    const stored = { id: 1, evidenceKey: "daily-github-jules-evidence", scheduleCronTaskUid: "heartbeat-task-1", status: "scheduled" };
    mocks.createDailyEvidenceScheduleRecord.mockResolvedValue(stored);

    const caller = appRouter.createCaller(adminContext());
    await expect(caller.cockpit.registerDailyEvidenceSchedule()).resolves.toEqual(stored);

    expect(mocks.createHeartbeatJob).toHaveBeenCalledWith(expect.objectContaining({
      name: "daily-cockpit-evidence",
      cron: "0 0 4 * * *",
      path: "/api/scheduled/daily-evidence",
    }), "");
    expect(mocks.createDailyEvidenceScheduleRecord).toHaveBeenCalledWith("heartbeat-task-1");
  });

  it("returns existing evidence instead of creating a duplicate heartbeat", async () => {
    const existing = { id: 1, evidenceKey: "daily-github-jules-evidence", scheduleCronTaskUid: "existing-task", status: "scheduled" };
    mocks.getDailyEvidence.mockResolvedValueOnce(existing);

    const caller = appRouter.createCaller(adminContext());
    await expect(caller.cockpit.registerDailyEvidenceSchedule()).resolves.toEqual(existing);

    expect(mocks.createHeartbeatJob).not.toHaveBeenCalled();
    expect(mocks.createDailyEvidenceScheduleRecord).not.toHaveBeenCalled();
  });
});
