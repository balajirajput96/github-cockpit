export type AutomationStatusTone = "healthy" | "attention" | "blocked";

export type AutomationStatusItem = {
  id: string;
  eyebrow: string;
  title: string;
  detail: string;
  tone: AutomationStatusTone;
  href?: string;
  hrefLabel?: string;
};

export const AUTOMATION_STATUS_ITEMS: AutomationStatusItem[] = [
  {
    id: "digest",
    eyebrow: "Daily evidence loop",
    title: "Active · 18:00 IST",
    detail: "GitHub inspection and authorized Gmail delivery only. The schedule never pushes, merges, edits settings, rotates secrets, or closes issues.",
    tone: "healthy",
  },
  {
    id: "portfolio",
    eyebrow: "Owner portfolio",
    title: "198 owned · 16 active non-forks",
    detail: "Current review scope excludes 182 upstream forks, avoiding automated changes outside directly owned active projects.",
    tone: "healthy",
  },
  {
    id: "pharma-pr",
    eyebrow: "Workflow repair",
    title: "Merged PR #6 · concurrency guard live",
    detail: "The reviewed seven-line workflow fix now serializes scan runs and rebases generated results before a push. Its quality check passed before merge.",
    tone: "healthy",
    href: "https://github.com/balajirajput96/vscode-copilot-cha/pull/6",
    hrefLabel: "Open merged PR",
  },
  {
    id: "workflow-sweep",
    eyebrow: "18 Aug validation sweep",
    title: "4 current-main paths re-verified",
    detail: "ai-agent-hub dispatch plus current main checks for SellBuilding, Signal Ledger, and GitHub MCP Server passed after their historic failures. No workflow was rebased or force-pushed.",
    tone: "healthy",
    href: "https://github.com/balajirajput96/sellbuilding-ai-agent/actions/runs/32020850345",
    hrefLabel: "Open passing run",
  },
  {
    id: "repair-pr-review",
    eyebrow: "Reviewable CI repairs",
    title: "3 focused PRs merged · main CI passed",
    detail: "ai-automation-platform, career-monitoring-hub, and gmail-resume-mailer each merged the smallest-scope PR #1 through GitHub’s normal process. Their post-merge main checks passed; no agent-triggered rebase or force-push occurred.",
    tone: "healthy",
    href: "https://github.com/balajirajput96/ai-automation-platform/pull/1",
    hrefLabel: "Open merged repair",
  },
  {
    id: "normal-event-validation",
    eyebrow: "Remaining CI evidence",
    title: "Normal-event validation re-verified",
    detail: "job-automation-orchestrator and automation-control-center-app now have successful current-main workflow evidence after their historic pnpm/setup failures. No workflow change or manual retry was required.",
    tone: "healthy",
  },
  {
    id: "research-media",
    eyebrow: "Media automation",
    title: "Latest manual runs passed · no agent publish",
    detail: "Later user-initiated Daily Research Reel workflow runs completed successfully. Source-media configuration remains non-readable, and this cockpit has not retried or published content to social platforms.",
    tone: "attention",
    href: "https://github.com/balajirajput96/daily-research-reels-automation/actions/runs/32032806301",
    hrefLabel: "Open latest passing run",
  },
  {
    id: "live-provider-credential",
    eyebrow: "Live provider contracts",
    title: "GitHub credential health verified",
    detail: "The dedicated Actions secret was securely supplied by the owner and the opt-in live-provider job passed alongside typecheck, tests, and build. Its value was not read, logged, or stored by the cockpit.",
    tone: "healthy",
    href: "https://github.com/balajirajput96/ai-automation-platform/actions/runs/32095983163",
    hrefLabel: "Open passing validation",
  },
  {
    id: "jules-readiness",
    eyebrow: "Jules readiness",
    title: "Owner account connected · no Sentinel session",
    detail: "The requested Google account and owner repository are connected in Jules. The selected repository has no scheduled or active sessions, so no autonomous code task is assumed or created.",
    tone: "attention",
  },
  {
    id: "antigravity-readiness",
    eyebrow: "Antigravity readiness",
    title: "No connector or CLI configured",
    detail: "Current task configuration has no Google Antigravity connector and the local CLI is unavailable. No login attempt or credential transfer was performed.",
    tone: "blocked",
  },
  {
    id: "dependabot",
    eyebrow: "Security evidence",
    title: "Alert API access is limited",
    detail: "Dependabot alert reads returned a permission boundary, so the cockpit records no inferred alert count and keeps security triage reviewable.",
    tone: "blocked",
  },
  {
    id: "dependency-security-pr",
    eyebrow: "Dependency security",
    title: "Merged PR #1 · audit reduced 56 → 3",
    detail: "Compatible Vite, Vitest, pnpm, PostCSS, and Tailwind tooling updates remove all local critical and high findings. GitHub CI passed and the reviewed change is now on main.",
    tone: "healthy",
    href: "https://github.com/balajirajput96/github-cockpit/pull/1",
    hrefLabel: "Open merged PR",
  },
  {
    id: "toolchain-zero-audit",
    eyebrow: "Toolchain hardening",
    title: "Merged PR #2 · audit cleared",
    detail: "The Vite 8, React plugin 6, Vitest 4, and scoped Drizzle resolution update passed GitHub Actions run 32026343651. Isolated validation completed TypeScript, tests, production build, Drizzle CLI, and pnpm audit with zero advisories.",
    tone: "healthy",
    href: "https://github.com/balajirajput96/github-cockpit/pull/2",
    hrefLabel: "Open merged PR",
  },
  {
    id: "mcp-lockfile-remediation",
    eyebrow: "Dependency lockfile",
    title: "Merged PR #46 · vulnerability refresh",
    detail: "The merged remediation changes package-lock.json and its CI validation passed. It does not claim an Actions runtime upgrade; any Node 20 warning remains a separate review signal.",
    tone: "healthy",
    href: "https://github.com/balajirajput96/github-mcp-server-/pull/46",
    hrefLabel: "Open merged PR",
  },
  {
    id: "node-runtime-pr",
    eyebrow: "Workflow runtime",
    title: "Merged PR #50 · Node 24 migration",
    detail: "This PR is merged, not review-only. Its Node 20 and 24 CI matrix passed; the shallow-history Secret Scanning failure isolated after merge is now integrated through merged PR #51.",
    tone: "healthy",
    href: "https://github.com/balajirajput96/github-mcp-server-/pull/50",
    hrefLabel: "Open merged PR",
  },
  {
    id: "secret-scan-history-fix",
    eyebrow: "Secret scanning",
    title: "Merged PR #51 · complete-history scan",
    detail: "The one-line Gitleaks checkout-depth fix passed all 8 applicable checks and merged on 17 Aug 2026. It supersedes post-merge commit b52cc59 without any secret, permission, or repository-setting change.",
    tone: "healthy",
    href: "https://github.com/balajirajput96/github-mcp-server-/pull/51",
    hrefLabel: "Open merged PR",
  },
  {
    id: "biotech-outreach",
    eyebrow: "Biotech outreach",
    title: "Dry-run only · candidate inputs pending",
    detail: "The owner repository has no scheduled Action, and its coordination helper is fail-closed. No application, resume attachment, or email is sent without a current CV, playbook, and explicit per-send confirmation.",
    tone: "blocked",
    href: "https://github.com/balajirajput96/pharma-outreach-automation",
    hrefLabel: "Inspect coordination helper",
  },
];

export function summarizeAutomationStatus(items = AUTOMATION_STATUS_ITEMS) {
  return items.reduce(
    (summary, item) => ({ ...summary, [item.tone]: summary[item.tone] + 1 }),
    { healthy: 0, attention: 0, blocked: 0 } as Record<AutomationStatusTone, number>,
  );
}
