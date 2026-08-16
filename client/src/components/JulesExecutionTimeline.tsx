import { ArrowUpRight, Check, Clock3, GitPullRequest, ShieldCheck, TimerReset } from "lucide-react";
import { JULES_EXECUTION_EVENTS, JULES_EXECUTION_RUN, type JulesTimelineEvent } from "@/lib/julesTimeline";
import "./JulesExecutionTimeline.css";

function EventIcon({ event }: { event: JulesTimelineEvent }) {
  if (event.id === "scheduled") return <Clock3 size={15} />;
  if (event.id === "task") return <Check size={15} />;
  if (event.id === "pull-request") return <GitPullRequest size={15} />;
  return <ShieldCheck size={15} />;
}

export function JulesExecutionTimeline() {
  return (
    <section className="jules-timeline-section" id="jules-run" aria-labelledby="jules-run-title">
      <div className="section-heading jules-timeline-heading">
        <div>
          <p className="panel-kicker">Native Jules evidence</p>
          <h2 id="jules-run-title">A scheduled run, <i>kept reviewable.</i></h2>
        </div>
        <span className="jules-verified-badge"><span /> verified in Jules</span>
      </div>

      <article className="jules-timeline-card">
        <div className="jules-run-summary">
          <span className="signal-label"><span className="signal-dot lime" /> SCHEDULE ACTIVE</span>
          <strong>Daily maintenance<br />left a clear trail.</strong>
          <p>Authenticated first-party history confirms the recurring run, its completed task, and the resulting draft pull request.</p>
          <div className="jules-summary-meta">
            <span><TimerReset size={14} /> {JULES_EXECUTION_RUN.schedule.cadence}</span>
            <span><Check size={14} /> {JULES_EXECUTION_RUN.task.status}</span>
          </div>
        </div>

        <ol className="jules-event-list" aria-label="Verified Jules execution timeline">
          {JULES_EXECUTION_EVENTS.map((event) => (
            <li className={`jules-event is-${event.id}`} key={event.id}>
              <span className="jules-event-icon"><EventIcon event={event} /></span>
              <div className="jules-event-copy">
                <div><strong>{event.label}</strong><time>{event.timestamp}</time></div>
                <p>{event.detail}</p>
                {event.href ? <a href={event.href} target="_blank" rel="noreferrer">{event.hrefLabel} <ArrowUpRight size={12} /></a> : null}
              </div>
            </li>
          ))}
        </ol>

        <aside className="jules-review-rail" aria-label="Pull request review state">
          <span className="panel-kicker">Review gate</span>
          <div className="jules-pr-number">#{JULES_EXECUTION_RUN.pullRequest.number}</div>
          <strong>{JULES_EXECUTION_RUN.pullRequest.status}</strong>
          <p>One lockfile-only proposal. It remains human-reviewed before any repository write is accepted.</p>
          <a className="button button-dark" href={JULES_EXECUTION_RUN.pullRequest.href} target="_blank" rel="noreferrer">Open PR #{JULES_EXECUTION_RUN.pullRequest.number} <ArrowUpRight size={14} /></a>
        </aside>
      </article>
    </section>
  );
}
