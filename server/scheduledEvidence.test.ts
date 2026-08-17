import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authenticateRequest: vi.fn(),
  recordDailyEvidenceCallback: vi.fn(),
}));

vi.mock("./_core/sdk", () => ({
  sdk: { authenticateRequest: mocks.authenticateRequest },
}));

vi.mock("./db", () => ({
  recordDailyEvidenceCallback: mocks.recordDailyEvidenceCallback,
}));

import { recordDailyEvidence } from "./scheduledEvidence";

function createResponse() {
  const state = { statusCode: 200, body: undefined as unknown };
  const response = {
    status: vi.fn(),
    json: vi.fn(),
    state,
  };
  response.status.mockImplementation((code: number) => {
      state.statusCode = code;
      return response;
    });
  response.json.mockImplementation((body: unknown) => {
      state.body = body;
      return response;
    });
  return response;
}

describe("scheduled evidence callback", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects a non-cron caller without writing dashboard evidence", async () => {
    mocks.authenticateRequest.mockResolvedValue({ isCron: false });
    const res = createResponse();

    await recordDailyEvidence({} as never, res as never);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mocks.recordDailyEvidenceCallback).not.toHaveBeenCalled();
  });

  it("records only the scheduled task UID and treats an orphan as a successful no-op", async () => {
    mocks.authenticateRequest.mockResolvedValue({ isCron: true, taskUid: "cron-task-1" });
    mocks.recordDailyEvidenceCallback.mockResolvedValue(null);
    const res = createResponse();

    await recordDailyEvidence({} as never, res as never);

    expect(mocks.recordDailyEvidenceCallback).toHaveBeenCalledWith("cron-task-1");
    expect(res.json).toHaveBeenCalledWith({ ok: true, skipped: "orphan" });
  });
});
