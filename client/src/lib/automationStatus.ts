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
    id: "research-media",
    eyebrow: "Media automation",
    title: "Source media is required",
    detail: "The Daily Research Reel run stopped safely because SOURCE_MEDIA_URL is not configured. No source was guessed or published.",
    tone: "blocked",
    href: "https://github.com/balajirajput96/daily-research-reels-automation/actions/runs/31925895763",
    hrefLabel: "Inspect blocked run",
  },
  {
    id: "dependabot",
    eyebrow: "Security evidence",
    title: "Alert API access is limited",
    detail: "Dependabot alert reads returned a permission boundary, so the cockpit records no inferred alert count and keeps security triage reviewable.",
    tone: "blocked",
  },
  {
    id: "node-20",
    eyebrow: "Workflow runtime",
    title: "Node 20 deprecation needs review",
    detail: "PR #46 validation passed with warnings. Upgrade workflow declarations in a separately reviewed change; this cockpit does not modify Actions files automatically.",
    tone: "attention",
    href: "https://github.com/balajirajput96/github-mcp-server-/actions/runs/31924696688",
    hrefLabel: "Inspect CI warning",
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
