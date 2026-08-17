import { ArrowUpRight, Check, CircleCheck, ClipboardCheck, Clock3, GitPullRequest, Loader2, ShieldCheck, TimerReset } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { JULES_EXECUTION_EVENTS, JULES_EXECUTION_RUN, PR46_REVIEW_CHECKLIST, type JulesTimelineEvent } from "@/lib/julesTimeline";
import "./JulesExecutionTimeline.css";
import { useState } from "react";
import { toast } from "sonner";

function EventIcon({ event }: { event: JulesTimelineEvent }) {
  if (event.id === "scheduled") return <Clock3 size={15} />;
  if (event.id === "task" || event.id === "merged") return <Check size={15} />;
  if (event.id === "pull-request") return <GitPullRequest size={15} />;
  return <ShieldCheck size={15} />;
}

export function JulesExecutionTimeline() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [reviewNote, setReviewNote] = useState("Reviewed the available PR #46 evidence. Keeping the pull request in draft pending dependency compatibility confirmation.");
  const evidenceQuery = trpc.cockpit.evidence.useQuery();
  const latestReviewQuery = trpc.cockpit.latestReview.useQuery();
  const recordReview = trpc.cockpit.recordPr46Review.useMutation({
    onSuccess: async () => {
      await utils.cockpit.latestReview.invalidate();
      toast.success("Owner review recorded", { description: "PR #46 remains a draft; no GitHub action was taken." });
    },
    onError: (error) => toast.error("Review record could not be saved", { description: error.message }),
  });
  const recordedAt = evidenceQuery.data?.lastRecordedAt
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(evidenceQuery.data.lastRecordedAt))
    : "First independent run pending";
  const canRecordReview = user?.role === "admin";

  return (
    <section className="jules-timeline-section" id="jules-run" aria-labelledby="jules-run-title">
      <div className="section-heading jules-timeline-heading">
        <div>
          <p className="panel-kicker">Native Jules evidence</p>
          <h2 id="jules-run-title">A scheduled run, <i>kept reviewable.</i></h2>
        </div>
        <div className="jules-heading-badges">
          <span className="jules-verified-badge"><span /> verified in Jules</span>
          <span className={`jules-report-badge ${evidenceQuery.data?.status === "recorded" ? "is-recorded" : ""}`}><ClipboardCheck size={13} /><b>Daily evidence</b> {recordedAt}</span>
        </div>
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
          <p>One lockfile-only remediation, merged by the owner after the available validation evidence.</p>
          <ol className="jules-review-checklist" aria-label="PR 46 human review checklist">
            {PR46_REVIEW_CHECKLIST.map((item) => (
              <li key={item.id} className={item.state === "Passed" ? "is-passed" : ""}>
                <CircleCheck size={14} /><div><strong>{item.label}</strong><span>{item.detail}</span><a href={item.href} target="_blank" rel="noreferrer">{item.hrefLabel} <ArrowUpRight size={11} /></a></div><em>{item.state}</em>
              </li>
            ))}
          </ol>
          <div className="jules-owner-record">
            <span className="panel-kicker">Owner audit record</span>
            {latestReviewQuery.data ? <p className="jules-recorded-note"><Check size={12} /> Last record: {new Date(latestReviewQuery.data.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p> : <p>No owner decision has been recorded yet.</p>}
            {JULES_EXECUTION_RUN.pullRequest.status !== "Merged" && canRecordReview ? <>
              <label className="sr-only" htmlFor="pr46-review-note">PR #46 review note</label>
              <textarea id="pr46-review-note" value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} maxLength={700} />
              <button className="jules-record-button" disabled={recordReview.isPending || reviewNote.trim().length < 8} onClick={() => recordReview.mutate({ decision: "reviewed-hold-draft", note: reviewNote })}>{recordReview.isPending ? <Loader2 className="animate-spin" size={13} /> : <ClipboardCheck size={13} />}{recordReview.isPending ? "Recording" : "Record review · keep draft"}</button>
            </> : JULES_EXECUTION_RUN.pullRequest.status !== "Merged" ? <p className="jules-owner-only">Only the authenticated cockpit owner can write this internal record.</p> : <p className="jules-merged-note"><Check size={12} /> GitHub merge confirmation is reflected here; no further PR action is offered.</p>}
          </div>
          <a className="button button-dark" href={JULES_EXECUTION_RUN.pullRequest.href} target="_blank" rel="noreferrer">Open merged PR #{JULES_EXECUTION_RUN.pullRequest.number} <ArrowUpRight size={14} /></a>
        </aside>
      </article>
    </section>
  );
}
