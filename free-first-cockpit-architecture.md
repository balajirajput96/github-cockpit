# Free-First Private GitHub Cockpit Architecture

## Product intent

The cockpit is a **private, login-protected repository command center** for the owner. It turns live, publicly available GitHub signals into a concise evidence register, then routes any consequential repository action back to GitHub for the owner to review. It does not impersonate an autonomous agent, execute arbitrary user code, store API keys in the browser, or promise unlimited no-cost model inference.

## Data boundary

| Capability | Initial implementation | Security boundary |
|---|---|---|
| Portfolio inventory | Server-side reads from GitHub’s public REST API for `balajirajput96` | No token is required or exposed; private repositories are intentionally out of scope until the owner adds a dedicated token through secure settings. |
| Repository signals | Public issue, pull-request, release, language, and recency metadata | The server normalizes responses into a strict view model; untrusted GitHub text is displayed as data only. |
| Workflow inspection | Click-through to the source repository and operations register | The app does not dispatch or retry workflows in the initial release. |
| Task planning | Local, editable action cards based on deterministic signal rules | Cards do not merge pull requests, mutate issues, or change settings. |
| AI, image, and video | Provider-readiness cards and safe prompt handoff | No provider credential is embedded or invoked until a server-side integration is separately approved. |

## Feature map

1. **Portfolio pulse** shows total public repositories, recent pushes, public issue totals, and review candidates.
2. **Repository ledger** provides search, sort, health indicators, and a live/fallback data-state badge.
3. **Action desk** provides deterministic next-step cards such as “review active pull request” or “inspect stale issue”; each opens the matching GitHub context rather than making a write.
4. **Provider studio** transparently distinguishes available free-first features from integrations that require a future provider connection.
5. **Activity record** retains the existing validated portfolio-repair history and labels it as collected evidence rather than current live state.

## Design decision

The existing **Signal Ledger** custom navigation and editorial visual system are retained because it already fits an internal evidence dashboard. The template `DashboardLayout` was evaluated but not adopted: its generic navigation would replace the project’s established ledger shell. The template `AIChatBox` was evaluated and reserved for a future, server-side model integration; it will not be presented as functional AI chat while the free-first mode intentionally has no model provider.
