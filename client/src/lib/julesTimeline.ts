export type JulesTimelineEvent = {
  id: "scheduled" | "task" | "pull-request" | "review";
  label: string;
  timestamp: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
};

export const JULES_EXECUTION_RUN = {
  dailyReport: {
    status: "Active",
    recordedAt: "2026-08-16T04:00:00Z",
    displayTime: "16 Aug · 09:30 IST",
    label: "Owner-repo & Jules evidence review",
  },
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

export const PR46_REVIEW_CHECKLIST = [
  {
    id: "diff",
    label: "Read the lockfile diff",
    detail: "Confirm the package-lock-only remediation matches the intended dependency update.",
    href: "https://github.com/balajirajput96/github-mcp-server-/pull/46/files",
    hrefLabel: "Open changed files",
    state: "Review required",
  },
  {
    id: "ci",
    label: "Confirm CI evidence",
    detail: "The CI/CD Pipeline completed successfully; inspect the retained run before deciding.",
    href: "https://github.com/balajirajput96/github-mcp-server-/actions/runs/31924696688",
    hrefLabel: "Open CI run",
    state: "Passed",
  },
  {
    id: "deploy",
    label: "Confirm free-tier validation",
    detail: "Health and deployment validation completed successfully for the draft change.",
    href: "https://github.com/balajirajput96/github-mcp-server-/actions/runs/31924696701",
    hrefLabel: "Open validation",
    state: "Passed",
  },
  {
    id: "decision",
    label: "Make an explicit PR decision",
    detail: "Keep draft, mark ready, or merge only after an owner reviews the dependency compatibility.",
    href: JULES_EXECUTION_RUN.pullRequest.href,
    hrefLabel: "Return to PR #46",
    state: "Owner decision",
  },
] as const;

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

export function hasReviewOnlyBoundary() {
  return JULES_EXECUTION_RUN.reviewOnly
    && JULES_EXECUTION_RUN.pullRequest.status === "Open draft"
    && PR46_REVIEW_CHECKLIST.at(-1)?.state === "Owner decision";
}
