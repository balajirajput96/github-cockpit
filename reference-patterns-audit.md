# Free-First Cockpit: Reference Pattern Audit

**Reviewed:** 15 August 2026

This record separates code that was reused from public sources from concepts that were only studied. No third-party repository code was copied into the cockpit.

| Reference | License or terms verified | Pattern studied | Implementation decision |
|---|---|---|---|
| [Octokit REST.js](https://github.com/octokit/rest.js/) | MIT license is shown by the repository. | GitHub REST API request conventions and endpoint organization. | **Studied only.** The cockpit uses native server-side `fetch`, an explicit GitHub media type, a pinned API-version header, and two-page pagination. No Octokit code or dependency was copied. |
| [GitHub REST scripting guide](https://docs.github.com/en/rest/guides/scripting-with-the-rest-api-and-javascript) | Official GitHub documentation. | Keep credentials server-side, use unauthenticated reads only where sufficient, paginate result sets, and treat rate-limit/error states explicitly. | **Applied as a design pattern.** `server/githubPublic.ts` is protected by tRPC, never sends a token to the browser, uses only public reads, caches responses, and gives a user-visible error state. |
| [Hugging Face JavaScript](https://github.com/huggingface/huggingface.js/blob/main/LICENSE) | MIT license. | Future typed JavaScript provider client shape. | **Studied only.** No Hugging Face client or token is included in this free-first build; the provider studio states its future server-side-only boundary. |
| [n8n Sustainable Use License](https://docs.n8n.io/privacy-and-security/sustainable-use-license/) | Source-available fair-code license with use restrictions. | Workflow visibility and approval-oriented task semantics. | **Studied only; no source reused.** n8n code, visual nodes, or connector implementations are not embedded, because the license is not a general permissive open-source license. |
| Existing Signal Ledger dashboard | User-owned `balajirajput96/github-dashboard` source. | Editorial evidence layout, custom navigation, ledger data hierarchy, and action framing. | **Reused and extended.** The app’s own original visual system remains the foundation for the private cockpit. |

## Implementation provenance

The live register, action cards, protected tRPC endpoint, UI styles, and unit tests were authored in this project. The action cards use deterministic public metadata rather than copied automation behavior. Links open GitHub’s own repository, issues, pull requests, and Actions pages; no write operation is executed from this cockpit.
