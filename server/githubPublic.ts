export type GitHubRepositorySource = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  archived: boolean;
  fork: boolean;
  language: string | null;
  open_issues_count: number;
  pushed_at: string | null;
  updated_at: string;
  stargazers_count: number;
};

export type PortfolioRepository = {
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  visibility: "Public" | "Private";
  archived: boolean;
  fork: boolean;
  language: string;
  openSignals: number;
  pushedAt: string | null;
  updatedAt: string;
  stars: number;
  health: "attention" | "observed" | "dormant";
};

export type ActionCard = {
  id: string;
  title: string;
  detail: string;
  href: string;
  tone: "attention" | "observed" | "dormant";
};

export type PublicPortfolio = {
  owner: string;
  source: "github-public-api";
  fetchedAt: string;
  summary: {
    repositories: number;
    activeLast30Days: number;
    openSignals: number;
    archived: number;
  };
  repositories: PortfolioRepository[];
  actionCards: ActionCard[];
};

type CacheEntry = {
  expiresAt: number;
  portfolio: PublicPortfolio;
};

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;
const GITHUB_API_VERSION = "2022-11-28";

function daysSince(date: string | null, now: Date): number | null {
  if (!date) return null;
  const timestamp = Date.parse(date);
  if (Number.isNaN(timestamp)) return null;
  return Math.floor((now.getTime() - timestamp) / 86_400_000);
}

export function deriveHealth(repo: Pick<GitHubRepositorySource, "archived" | "open_issues_count" | "pushed_at">, now = new Date()): PortfolioRepository["health"] {
  if (repo.archived) return "dormant";
  if (repo.open_issues_count >= 10) return "attention";
  const pushedDaysAgo = daysSince(repo.pushed_at, now);
  if (pushedDaysAgo !== null && pushedDaysAgo > 180) return "dormant";
  return "observed";
}

function normalizeRepository(repo: GitHubRepositorySource, now: Date): PortfolioRepository {
  return {
    name: repo.name,
    fullName: repo.full_name,
    htmlUrl: repo.html_url,
    description: repo.description,
    visibility: repo.private ? "Private" : "Public",
    archived: repo.archived,
    fork: repo.fork,
    language: repo.language ?? "Unspecified",
    openSignals: repo.open_issues_count,
    pushedAt: repo.pushed_at,
    updatedAt: repo.updated_at,
    stars: repo.stargazers_count,
    health: deriveHealth(repo, now),
  };
}

function buildActionCards(repositories: PortfolioRepository[]): ActionCard[] {
  const cards: ActionCard[] = [];

  for (const repository of repositories) {
    if (repository.openSignals > 0) {
      cards.push({
        id: `${repository.fullName}-signals`,
        title: `Review ${repository.openSignals} open signals`,
        detail: `${repository.fullName} has open GitHub issue/PR signals in the public register.`,
        href: `${repository.htmlUrl}/issues`,
        tone: repository.health === "attention" ? "attention" : "observed",
      });
    }

    if (repository.archived) {
      cards.push({
        id: `${repository.fullName}-archive`,
        title: "Confirm archived repository posture",
        detail: `${repository.fullName} is marked archived and should remain read-only unless revived deliberately.`,
        href: repository.htmlUrl,
        tone: "dormant",
      });
    }

    if (cards.length >= 6) break;
  }

  return cards.slice(0, 6);
}

export function buildPortfolio(owner: string, sourceRepositories: GitHubRepositorySource[], now = new Date()): PublicPortfolio {
  const repositories = sourceRepositories
    .map(repo => normalizeRepository(repo, now))
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  const thirtyDaysAgo = now.getTime() - 30 * 86_400_000;

  return {
    owner,
    source: "github-public-api",
    fetchedAt: now.toISOString(),
    summary: {
      repositories: repositories.length,
      activeLast30Days: repositories.filter(repo => repo.pushedAt && Date.parse(repo.pushedAt) >= thirtyDaysAgo).length,
      openSignals: repositories.reduce((total, repo) => total + repo.openSignals, 0),
      archived: repositories.filter(repo => repo.archived).length,
    },
    repositories,
    actionCards: buildActionCards(repositories),
  };
}

async function fetchRepositoryPage(owner: string, page: number): Promise<GitHubRepositorySource[]> {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(owner)}/repos?per_page=100&page=${page}&sort=updated`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
      "User-Agent": "ledger-gh-cockpit",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub public API returned ${response.status}. Please try again later.`);
  }

  return response.json() as Promise<GitHubRepositorySource[]>;
}

export async function getPublicPortfolio(owner: string, forceRefresh = false): Promise<PublicPortfolio> {
  const cached = cache.get(owner);
  if (!forceRefresh && cached && cached.expiresAt > Date.now()) return cached.portfolio;

  const firstPage = await fetchRepositoryPage(owner, 1);
  const secondPage = firstPage.length === 100 ? await fetchRepositoryPage(owner, 2) : [];
  const portfolio = buildPortfolio(owner, [...firstPage, ...secondPage]);
  cache.set(owner, { portfolio, expiresAt: Date.now() + CACHE_TTL_MS });
  return portfolio;
}
