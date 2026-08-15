# Validation notes

## 13 Aug 2026

The live preview rendered `/repos/mcp/workflows` successfully. The repository header, overview/workflows/pull requests/security tabs, four workflow rows, running/passed/failed states, retry buttons, pipeline anatomy, workflow posture summary, branch context, and external Actions link were present.

The pull-request tab navigated to `/repos/mcp/pulls` successfully. The review queue showed PR #6 and PR #5, with PR #6 selected by default. The detail panel displayed review status, passing checks, changed files, net change, review timeline, review note action, and external GitHub link.

Both routes stayed within the Signal Ledger shell and retained the same repository context.

The security tab navigated to `/repos/mcp/security` successfully. It displayed four detailed alert rows, severity filters, a 63-alert posture card, severity split, remediation copy, and an external Dependabot link. Clicking High filtered the register to the two high-severity alerts without a route change.

The repository overview route `/repos/mcp` rendered correctly with the repository facts, directional score, register note, and three quick links. The workflow quick link returned to `/repos/mcp/workflows`. Clicking a retry button showed the success toast and inline notice: the action is intentionally non-destructive and records the intended retry in static snapshot mode.

## 15 Aug 2026 — Portfolio remediation refresh

The home route rendered the verified portfolio snapshot correctly after the owner-repository remediation pass. The hero, metric strip, audit note, activity ledger, and next-move panel showed 194 audited repositories, 11 directly owned projects, 183 observed forks, three merged repairs (PRs #42, #41, and #2), and the three explicit setup/review blockers. The production build and TypeScript check completed successfully before this browser verification.

## 15 Aug 2026 — Daily workflow recovery

The configured browser session confirmed that the repository Actions secret was added without exposing its value. Daily Pharma Job Scan run `31874690138` then completed successfully on `main`: dependency installation, scan execution, result commit, and cleanup all passed in 32 seconds. The dashboard recovery update subsequently passed its production build and TypeScript validation.
