# AI-Agent Program: Access and Safety Inventory

**Snapshot:** 15 August 2026

| Area | Verified state | Implementation implication |
|---|---|---|
| Antigravity CLI | Official CLI version 1.1.13 is installed and authenticated as `br0318889@gmail.com` on Google AI Pro. The project folder `/home/ubuntu/github-dashboard` was explicitly trusted. | It can assist with local, reviewable development work; it is not a deployable backend credential and must not be used to expose account tokens in the application. |
| GitHub | GitHub CLI is authenticated as `balajirajput96`. The built-in GitHub connector is enabled. | GitHub source inspection and reviewable branch/PR work are available. The application still needs a server-side OAuth/API design for any end-user GitHub actions. |
| Jules | Browser access is active under `sellbuildingbazar.in@gmail.com`; the existing GitHub-only scheduled maintenance task remains the current controlled scope. | Do not assume this is the same Google identity as Antigravity. Keep Jules maintenance scoped to its selected repository and avoid automatic external integrations. |
| Hugging Face | The built-in Hugging Face connector is enabled. No user-created custom connectors exist. | Use it for model and dataset research only unless a user-approved server-side integration is added. |
| Uploaded artifacts | Eight `libggml` files are macOS Mach-O libraries, the `.crdownload` file is empty, the Copilot ZIP is source/archive material, and the 170 MB Antigravity archive appears to be a packaged desktop application. | None of these artifacts will be executed. The macOS libraries are incompatible with this Linux runtime; the official installed Antigravity CLI is the supported tool. |

## Product and data boundaries

The requested application should use only code owned by the user or public material whose license permits reuse. Third-party services can be analyzed as references but will not be copied wholesale. Connector credentials, OAuth tokens, and API keys must remain server-side; the web client will never receive them. A continuously autonomous system cannot be guaranteed to run indefinitely at zero cost when it invokes paid AI models or third-party APIs; the implementation will therefore expose provider limits and keep scheduled work conservative.
