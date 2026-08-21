import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authenticateRequest: vi.fn(),
  recordHourlyContinuationCallback: vi.fn(),
}));

vi.mock("./_core/sdk", () => ({
  sdk: { authenticateRequest: mocks.authenticateRequest },
}));

vi.mock("./db", () => ({
  recordHourlyContinuationCallback: mocks.recordHourlyContinuationCallback,
}));

import { recordHourlyContinuation } from "./scheduledHourlyContinuation";

function createResponse() {
  const state = { statusCode: 200, body: undefined as unknown };
  const response = { status: vi.fn(), json: vi.fn(), state };
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

describe("scheduled hourly continuation callback", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects a caller that is not a cron task", async () => {
    mocks.authenticateRequest.mockResolvedValue({ isCron: false });
    const res = createResponse();

    await recordHourlyContinuation({} as never, res as never);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mocks.recordHourlyContinuationCallback).not.toHaveBeenCalled();
  });

  it("treats an unknown task as a successful no-op", async () => {
    mocks.authenticateRequest.mockResolvedValue({ isCron: true, taskUid: "unknown-cron" });
    mocks.recordHourlyContinuationCallback.mockResolvedValue(null);
    const res = createResponse();

    await recordHourlyContinuation({} as never, res as never);

    expect(res.json).toHaveBeenCalledWith({ ok: true, skipped: "orphan" });
  });

  it("returns only durable read-only cycle evidence for the registered task", async () => {
    mocks.authenticateRequest.mockResolvedValue({ isCron: true, taskUid: "hourly-cron" });
    mocks.recordHourlyContinuationCallback.mockResolvedValue({
      cycleNumber: 1,
      signalsRecorded: 4,
      recoveryItems: 2,
      status: "recorded",
    });
    const res = createResponse();

    await recordHourlyContinuation({} as never, res as never);

    expect(mocks.recordHourlyContinuationCallback).toHaveBeenCalledWith("hourly-cron");
    expect(res.state.statusCode).toBe(200);
    expect(res.state.body).toMatchObject({ ok: true, cycleNumber: 1, signalsRecorded: 4, recoveryItems: 2 });
  });
});
