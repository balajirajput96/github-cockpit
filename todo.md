# Repository Detail Pages — Implementation Checklist
- [ ] Review current routing and dashboard components for reusable patterns.
- [ ] Define repository detail information architecture for overview, workflows, pull requests, and security.
- [ ] Add repository detail route and selected-repository navigation.
- [ ] Build workflow drill-down with run states, branch context, and retry interaction.
- [ ] Build pull request drill-down with review status, changed files, and external GitHub link.
- [ ] Build security drill-down with severity summary, alert list, and remediation actions.
- [ ] Add responsive styles and preserve Signal Ledger visual language.
- [ ] Validate TypeScript, build, and representative detail flows.
- [ ] Save an updated checkpoint and deliver the project version.

## Owner Repository Remediation Continuation
- [x] Reconfirm active GitHub account scope, directly owned repositories, open PRs, and check status.
- [x] Review validated PR #42 and safely progress implementation-ready owner-repository changes without auto-merging or bypassing protections.
- [x] Record unresolved secret, deployment, malformed-path, and ambiguous-feature blockers with exact next actions.
- [x] Refresh Signal Ledger only from newly verified audit evidence and validate the production build.
- [ ] Create and verify the 18:00 Asia/Kolkata daily GitHub digest schedule; blocked after three attempts by the scheduler precondition `project not deployed` despite a live published checkpoint.
- [x] Send or verify the latest digest through connected Gmail delivery and provide the remediation handover.

## OpenRouter Workflow Remediation
- [x] Verify whether the active GitHub CLI token or the signed-in browser account has repository Actions-secret administration permission.
- [x] Confirm the `vscode-copilot-cha` workflow uses only the expected `OPENROUTER_API_KEY` secret and identify the failed run to rerun.
- [x] Store the user-provided credential only as the repository Actions secret, without adding it to source control, logs, or dashboard data.
- [x] Rerun and verify the blocked Daily Pharma Job Scan workflow; record only non-sensitive outcome evidence.
- [ ] Refresh the Signal Ledger and digest after a confirmed workflow result.
