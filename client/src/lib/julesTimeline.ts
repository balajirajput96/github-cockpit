export type JulesTimelineEvent = {
  id: "scheduled" | "task" | "pull-request" | "review";
  label: string;
  timestamp: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
};

export const JULES_EXECUTION_RUN = {
  schedule: {
    status: "Active",
    cadence: "Daily at 03:30 UTC · 09:00 IST",
    executedAt: "2026-08-16T03:30:00Z",
  },
  task: {
    id: "12857103147949613432",
    status: "Complete · ready for review",
    duration: "7 min",
    href: "https://jules.google.com/task/12857103147949613432",
  },
  pullRequest: {
    number: 46,
    status: "Open draft",
    branch: "fix-vulnerabilities-12857103147949613432",
    href: "https://github.com/balajirajput96/github-mcp-server-/pull/46",
  },
  reviewOnly: true,
} as const;

export const JULES_EXECUTION_EVENTS: JulesTimelineEvent[] = [
  {
    id: "scheduled",
    label: "Native schedule recorded",
    timestamp: "16 Aug · 03:30 UTC",
    detail: "Authenticated Jules history shows the retained daily task as Active and records this execution.",
    href: JULES_EXECUTION_RUN.task.href,
    hrefLabel: "Open Jules task",
  },
  {
    id: "task",
    label: "Task completed",
    timestamp: "Jules task · 7 min",
    detail: "Task 12857103147949613432 completed its approved dependency-remediation plan with package-lock.json as the changed file.",
    href: JULES_EXECUTION_RUN.task.href,
    hrefLabel: "Inspect task evidence",
  },
  {
    id: "pull-request",
    label: "Draft PR created",
    timestamp: "16 Aug · 03:37 UTC",
    detail: "Jules opened PR #46 from the task-specific branch after the verified scheduled run.",
    href: JULES_EXECUTION_RUN.pullRequest.href,
    hrefLabel: "Open PR #46",
  },
  {
    id: "review",
    label: "Human review remains",
    timestamp: "Review gate",
    detail: "The PR stays open and draft. This cockpit does not merge, publish, or change repository settings.",
    href: JULES_EXECUTION_RUN.pullRequest.href,
    hrefLabel: "Review lockfile diff",
  },
];

export function hasVerifiedJulesRun() {
  return JULES_EXECUTION_RUN.schedule.status === "Active"
    && JULES_EXECUTION_RUN.task.status.includes("Complete")
    && JULES_EXECUTION_RUN.pullRequest.branch.includes(JULES_EXECUTION_RUN.task.id);
}
