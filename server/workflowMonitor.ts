import type { GitHubRepositorySource } from "./githubPublic";

export type WorkflowSignalClassification = "healthy" | "failure" | "external" | "queued" | "cancelled";

type GitHubWorkflowRunSource = {
  id: number;
  name: string | null;
  status: string;
  conclusion: string | null;
  event: string;
  html_url: string;
};

export type WorkflowSignal = {
  signalKey: string;
  repository: string;
  workflowName: string;
  runId: string;
  event: string;
  status: string;
  conclusion: string | null;
  classification: WorkflowSignalClassification;
  runUrl: string;
  observedAt: Date;
};

const GITHUB_API_VERSION = "2022-11-28";
const MAX_MONITORED_REPOSITORIES = 20;
const RUNS_PER_REPOSITORY = 4;

export function classifyWorkflowRun(run: Pick<GitHubWorkflowRunSource, "status" | "conclusion" | "event">): WorkflowSignalClassification {
  if (run.status !== "completed") return "queued";
  if (run.conclusion === "success") return "healthy";
  if (run.conclusion === "cancelled" || run.conclusion === "skipped") return "cancelled";
  if (run.event === "dynamic") return "external";
  return "failure";
}

export function selectMonitoredRepositories(repositories: GitHubRepositorySource[], limit = MAX_MONITORED_REPOSITORIES) {
  return repositories
    .filter(repo => !repo.archived && !repo.fork)
    .sort((left, right) => Date.parse(right.updated_at) - Date.parse(left.updated_at))
    .slice(0, limit);
}

async function fetchWorkflowRuns(repository: GitHubRepositorySource): Promise<GitHubWorkflowRunSource[]> {
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(repository.full_name)}/actions/runs?branch=main&per_page=${RUNS_PER_REPOSITORY}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        "User-Agent": "ledger-gh-cockpit-monitor",
      },
    },
  );
  if (!response.ok) throw new Error(`${repository.full_name}: GitHub Actions API returned ${response.status}`);
  const payload = await response.json() as { workflow_runs?: GitHubWorkflowRunSource[] };
  return payload.workflow_runs ?? [];
}

export async function collectWorkflowSignals(repositories: GitHubRepositorySource[], observedAt = new Date()): Promise<WorkflowSignal[]> {
  const selected = selectMonitoredRepositories(repositories);
  const results = await Promise.allSettled(selected.map(async repository => {
    const runs = await fetchWorkflowRuns(repository);
    return runs.map(run => ({
      signalKey: `${repository.full_name}:${run.id}`,
      repository: repository.full_name,
      workflowName: run.name ?? "Unnamed workflow",
      runId: String(run.id),
      event: run.event,
      status: run.status,
      conclusion: run.conclusion,
      classification: classifyWorkflowRun(run),
      runUrl: run.html_url,
      observedAt,
    }));
  }));

  return results.flatMap(result => result.status === "fulfilled" ? result.value : []);
}
