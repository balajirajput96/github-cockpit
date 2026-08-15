import { describe, expect, it } from "vitest";
import { buildPortfolio, deriveHealth, type GitHubRepositorySource } from "./githubPublic";

const now = new Date("2026-08-15T00:00:00.000Z");

function repository(overrides: Partial<GitHubRepositorySource> = {}): GitHubRepositorySource {
  return {
    name: "signal-ledger",
    full_name: "balajirajput96/signal-ledger",
    html_url: "https://github.com/balajirajput96/signal-ledger",
    description: "Repository health dashboard",
    private: false,
    archived: false,
    fork: false,
    language: "TypeScript",
    open_issues_count: 0,
    pushed_at: "2026-08-10T00:00:00.000Z",
    updated_at: "2026-08-10T00:00:00.000Z",
    stargazers_count: 2,
    ...overrides,
  };
}

describe("GitHub public portfolio", () => {
  it("classifies archived, attention, and stale repositories deterministically", () => {
    expect(deriveHealth(repository({ archived: true }), now)).toBe("dormant");
    expect(deriveHealth(repository({ open_issues_count: 12 }), now)).toBe("attention");
    expect(deriveHealth(repository({ pushed_at: "2025-12-01T00:00:00.000Z" }), now)).toBe("dormant");
    expect(deriveHealth(repository(), now)).toBe("observed");
  });

  it("creates a public portfolio summary and reviewable action cards", () => {
    const portfolio = buildPortfolio("balajirajput96", [
      repository({ name: "needs-review", open_issues_count: 3 }),
      repository({ name: "archive", archived: true }),
    ], now);

    expect(portfolio.summary).toEqual({ repositories: 2, activeLast30Days: 2, openSignals: 3, archived: 1 });
    expect(portfolio.actionCards.map(card => card.title)).toContain("Review 3 open signals");
    expect(portfolio.actionCards.map(card => card.title)).toContain("Confirm archived repository posture");
  });
});
