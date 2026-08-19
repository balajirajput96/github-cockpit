import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authenticateRequest: vi.fn(),
  recordWorkflowMonitorCallback: vi.fn(),
  collectAndRecordWorkflowSignals: vi.fn(),
}));

vi.mock("./_core/sdk", () => ({
  sdk: { authenticateRequest: mocks.authenticateRequest },
}));

vi.mock("./db", () => ({
  recordWorkflowMonitorCallback: mocks.recordWorkflowMonitorCallback,
  collectAndRecordWorkflowSignals: mocks.collectAndRecordWorkflowSignals,
}));

import { recordWorkflowMonitor } from "./scheduledWorkflowMonitor";

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

describe("scheduled workflow monitor callback", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects non-cron callers before any monitor persistence or collection", async () => {
    mocks.authenticateRequest.mockResolvedValue({ isCron: false });
    const res = createResponse();

    await recordWorkflowMonitor({} as never, res as never);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mocks.recordWorkflowMonitorCallback).not.toHaveBeenCalled();
    expect(mocks.collectAndRecordWorkflowSignals).not.toHaveBeenCalled();
  });

  it("treats unknown task IDs as successful no-ops", async () => {
    mocks.authenticateRequest.mockResolvedValue({ isCron: true, taskUid: "unknown-cron" });
    mocks.recordWorkflowMonitorCallback.mockResolvedValue(null);
    const res = createResponse();

    await recordWorkflowMonitor({} as never, res as never);

    expect(mocks.collectAndRecordWorkflowSignals).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, skipped: "orphan" });
  });

  it("collects read-only signals only for the registered task", async () => {
    mocks.authenticateRequest.mockResolvedValue({ isCron: true, taskUid: "monitor-cron" });
    mocks.recordWorkflowMonitorCallback.mockResolvedValue({ id: 1 });
    mocks.collectAndRecordWorkflowSignals.mockResolvedValue({ recorded: 4, signals: [] });
    const res = createResponse();

    await recordWorkflowMonitor({} as never, res as never);

    expect(mocks.recordWorkflowMonitorCallback).toHaveBeenCalledWith("monitor-cron");
    expect(mocks.collectAndRecordWorkflowSignals).toHaveBeenCalledTimes(1);
    expect(res.state.statusCode).toBe(200);
    expect(res.state.body).toMatchObject({ ok: true, signalsRecorded: 4 });
  });
});
