import type { WorkflowSignal } from "./workflowMonitor";

export const HOURLY_CONTINUATION_MAX_CYCLES = 2400;

export type RecoveryQueueItem = {
  repository: string;
  workflowName: string;
  classification: WorkflowSignal["classification"];
  runUrl: string;
};

export function buildHourlyCycleKey(taskUid: string, now = new Date()) {
  return `${taskUid}:${now.toISOString().slice(0, 13)}`;
}

export function buildRecoveryQueue(signals: WorkflowSignal[], limit = 8): RecoveryQueueItem[] {
  return signals
    .filter((signal) => signal.classification !== "healthy")
    .slice(0, limit)
    .map((signal) => ({
      repository: signal.repository,
      workflowName: signal.workflowName,
      classification: signal.classification,
      runUrl: signal.runUrl,
    }));
}

export function continuationStatus(cycleNumber: number, maxCycles = HOURLY_CONTINUATION_MAX_CYCLES) {
  return cycleNumber >= maxCycles ? "completed" : "recorded";
}
