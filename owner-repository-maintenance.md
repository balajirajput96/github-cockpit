# Owner Repository Maintenance Backlog

**Audit snapshot:** 15 August 2026

This program covers the eleven active, directly owned repositories under `balajirajput96`. The daily remediation scope is deliberately limited to test-backed, non-breaking code, CI, dependency, and documentation fixes. It excludes secret handling, billing, destructive infrastructure changes, deployment target changes, branch-protection changes, and automatic release publication.

| Priority | Repository | Verified signal | Status and next action |
|---|---|---|---|
| Resolved | `github-mcp-server-` | The Docker build ran `npm ci` before application source and `tsconfig.json` were copied. Its `prepare` hook invoked `tsc`, causing a failure. | PR [#44](https://github.com/balajirajput96/github-mcp-server-/pull/44) changed the install layer to `npm ci --ignore-scripts`, retained the explicit post-copy build, passed PR and `main` CI, and was squash-merged. |
| High | `B` | The Azure deployment workflow uses the literal placeholder `your-app-name`, Node 14, and a publish-profile secret dependency. Historical Copilot and Azure workflow failures are present. | **Blocked by missing deployment target information.** Do not modify the environment or secrets without the actual Azure App Service name and a decision on whether this deployment should remain active. |
| Medium | `github-mcp-server-` | Twelve open issues and eight open PRs remain; current default-branch CI passed after the Docker repair. | Daily program should triage the PR queue before starting overlapping work; prioritize the CI-permission draft PR and security-validator work only after reviewing their branch freshness. |
| Medium | `github-mcp-serve` | A historical Docker Build failed on an older Copilot branch; draft PR #1 is still open. Historical run logs were unavailable from GitHub. | Rebase or update draft PR #1, then rerun its Docker workflow to obtain a current failure signal before changing code. |
| Monitor | `vscode-copilot-cha` | One open dependency-update PR is present; historical daily job-scan failures exist, but the latest verified recovery run completed successfully. | Monitor the dependency PR and next scheduled scan; do not duplicate the existing workflow repair. |
| Monitor | `github-dashboard` | Latest two validation workflows passed; one older validation failure exists. | Continue normal CI monitoring; no immediate code repair is justified. |
| Low | `gmail-resume-mailer`, `infra-tools`, `manus-advanced-demo`, `chatbot`, `professional-resume-balaji-rajput`, `skills-communicate-using-markdown` | No open issues, open PRs, or current failed workflow signals were found in the portfolio sweep. | Include in daily health scan; act only when a fresh actionable signal appears. |

## Scheduled controls

The daily Manus progress report is scheduled for **09:00 Asia/Kolkata**. Jules has a GitHub-only maintenance task scheduled for **03:30 UTC / 09:00 Asia/Kolkata** on `github-mcp-server-`. All third-party MCP servers are disconnected and Render MCP is disabled. The first scheduled Jules run must be verified before its task status is treated as operational proof.
