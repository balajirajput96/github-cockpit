# Node Runtime Remediation Audit — 17 Aug 2026

## Verified GitHub state

| Item | Verified state | Evidence boundary |
|---|---|---|
| PR #50 | Merged by the repository owner; it is no longer a draft or review-only item. | The Node 20 and Node 24 CI matrix checks passed before merge. |
| Historic PR #50 scan issue | The tracked-content Secret Scanning job failed because a shallow checkout could not resolve the pull-request parent revision. | This failure is not attributed to a secret finding. |
| Commit `b52cc59` | Retained on the former post-merge branch only; it is explicitly superseded as a review path. | It is not represented as part of merged PR #50. |
| PR #51 | Open draft with the same isolated one-line checkout-depth fix, cherry-picked as `a33e92d`. | All 8 applicable GitHub checks passed; two main-only CI jobs were skipped. |

## Disposition

The durable disposition for `b52cc59` is **superseded by draft PR #51**. The branch remains available for traceability but is not the review or merge path. No branch cleanup, merge, release, secret, permission, or repository-setting operation was performed by this reconciliation.
