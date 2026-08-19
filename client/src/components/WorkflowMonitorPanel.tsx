import { ArrowUpRight, Check, CircleAlert, CircleDashed, Clock3, RefreshCw, ShieldCheck } from "lucide-react";
import { formatObservedAt, summarizeWorkflowSignals, type WorkflowSignalView } from "@/lib/workflowSignalPresentation";
import "./WorkflowMonitorPanel.css";

type Props = {
  signals: WorkflowSignalView[];
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage?: string;
  lastRecordedAt?: Date | null;
  onRefresh: () => void;
};

function SignalIcon({ classification }: { classification: string }) {
  if (classification === "healthy") return <Check size={14} />;
  if (classification === "queued") return <Clock3 size={14} />;
  if (classification === "external") return <CircleDashed size={14} />;
  return <CircleAlert size={14} />;
}

function SignalLabel({ classification }: { classification: string }) {
  if (classification === "healthy") return "passed";
  if (classification === "queued") return "queued";
  if (classification === "external") return "external";
  if (classification === "cancelled") return "cancelled";
  return "review";
}

export function WorkflowMonitorPanel({ signals, isLoading, isRefreshing, errorMessage, lastRecordedAt, onRefresh }: Props) {
  const summary = summarizeWorkflowSignals(signals);
  const freshness = lastRecordedAt ? formatObservedAt(lastRecordedAt) : "not collected yet";

  return (
    <section className="workflow-monitor-section" id="workflows" aria-labelledby="workflow-monitor-title">
      <div className="section-heading workflow-monitor-heading">
        <div>
          <p className="panel-kicker">Deterministic monitor</p>
          <h2 id="workflow-monitor-title">Read the runs.<br /><i>Keep GitHub untouched.</i></h2>
        </div>
        <div className="workflow-monitor-actions">
          <span>Last snapshot: {freshness}</span>
          <button className="button button-ghost" type="button" disabled={isRefreshing} onClick={onRefresh}>
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> {isRefreshing ? "Collecting" : "Collect signals"}
          </button>
        </div>
      </div>

      <div className="workflow-monitor-summary" aria-label="Workflow signal summary">
        <span className="is-healthy"><Check size={12} /> {summary.healthy} passed</span>
        <span className="is-review"><CircleAlert size={12} /> {summary.review} review</span>
        <span className="is-external"><CircleDashed size={12} /> {summary.external} external</span>
        <span className="is-queued"><Clock3 size={12} /> {summary.queued} queued</span>
      </div>

      <p className="workflow-monitor-boundary"><ShieldCheck size={14} /> Public metadata only. This panel never triggers a GitHub run, changes settings, sends email, merges, rebases, or publishes.</p>
      {errorMessage ? <div className="workflow-monitor-error"><CircleAlert size={15} /><span>{errorMessage}</span></div> : null}
      {isLoading ? <div className="workflow-monitor-empty"><RefreshCw className="animate-spin" size={16} /> Reading stored workflow signals…</div> : null}
      {!isLoading && signals.length === 0 ? <div className="workflow-monitor-empty"><Clock3 size={16} /> No snapshot yet. Use “Collect signals” to record a read-only public GitHub view.</div> : null}
      {!isLoading && signals.length > 0 ? <div className="workflow-monitor-grid">
        {signals.slice(0, 12).map(signal => <article className={`workflow-monitor-card is-${signal.classification}`} key={signal.id}>
          <div className="workflow-monitor-card-top"><span className="workflow-monitor-icon"><SignalIcon classification={signal.classification} /></span><span>{SignalLabel({ classification: signal.classification })}</span></div>
          <strong>{signal.workflowName}</strong>
          <p><code>{signal.repository}</code> · {signal.event} · {signal.conclusion ?? signal.status}</p>
          <div><time>{formatObservedAt(signal.observedAt)}</time><a href={signal.runUrl} target="_blank" rel="noreferrer">Open run <ArrowUpRight size={12} /></a></div>
        </article>)}
      </div> : null}
    </section>
  );
}
