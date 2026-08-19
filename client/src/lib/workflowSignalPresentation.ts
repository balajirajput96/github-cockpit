export type WorkflowSignalView = {
  id: number;
  repository: string;
  workflowName: string;
  event: string;
  status: string;
  conclusion: string | null;
  classification: string;
  runUrl: string;
  observedAt: Date;
};

export type WorkflowSignalSummary = {
  healthy: number;
  review: number;
  external: number;
  queued: number;
};

export function summarizeWorkflowSignals(signals: WorkflowSignalView[]): WorkflowSignalSummary {
  return signals.reduce<WorkflowSignalSummary>((summary, signal) => {
    if (signal.classification === "healthy") summary.healthy += 1;
    else if (signal.classification === "external") summary.external += 1;
    else if (signal.classification === "queued") summary.queued += 1;
    else summary.review += 1;
    return summary;
  }, { healthy: 0, review: 0, external: 0, queued: 0 });
}

export function formatObservedAt(observedAt: Date) {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" }).format(observedAt);
}
