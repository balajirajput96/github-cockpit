# Connector Scope Audit — 16 Aug 2026

## Purpose and decision

The user asked for comprehensive connector use. For this private GitHub cockpit, that instruction is implemented as **using every connector that is demonstrably necessary for the requested GitHub/Jules work**, rather than invoking unrelated personal services or broadening data access without a task-specific purpose. The active project uses server-side GitHub public reads, GitHub CLI validation, the existing Jules browser/CLI sign-in path, and the built-in application AI services already wired into the deployment. It does not require personal mail, calendar, commerce, CMS, finance, health, or unrelated automation data.

The global session connector configuration is left unchanged because it is shared user configuration and disabling unrelated integrations could interrupt other user workflows. Least privilege is enforced at the task and schedule level instead: non-required connectors are not invoked, no secrets are copied into the application, and the recurring GitHub/Jules evidence schedule is narrowed to the GitHub connector only. Jules is not represented as a Manus connector; its only permitted route is its own authenticated web or command-line session for the two outstanding read-only attribution checks.

| Connector | Enabled in current session | Decision for this workflow | Justification |
|---|---:|---|---|
| GitHub | Yes | **Required** | Repository inventory, PR #46 status, CI checks, and private source synchronization. |
| My Browser | Yes | **Required on demand** | User-completed Google/Jules sign-in and direct scheduler-history reading only. |
| OpenAI | Yes | Retained, application-managed | Existing server-side Agent Studio planning/image capabilities; no connector secret is exposed to the browser. |
| Google Gemini | Yes | Available, not invoked in this review | Alternative approved model provider; no GitHub/Jules evidence task requires it. |
| Anthropic | Yes | Available, not invoked in this review | Alternative approved model provider; no GitHub/Jules evidence task requires it. |
| Grok | Yes | Available, not invoked in this review | Alternative approved model provider; no GitHub/Jules evidence task requires it. |
| Hugging Face | Yes | Available, not invoked in this review | Research/model discovery may be useful for future feature work, not current scheduler attribution. |
| n8n and n8n API | Yes | Available, not invoked in this review | No approved external workflow change is needed; existing daily summary already satisfies current reporting cadence. |
| Cloudflare Worker Bindings | Yes | Out of scope | No Cloudflare resource is part of the deployed cockpit. |
| Gmail | Yes | Out of scope | Reports are delivered in the task; no email delivery was requested for this run. |
| Google Calendar | Yes | Out of scope | The established daily job already carries the schedule; no calendar mutation is needed. |
| Jam | Yes | Out of scope | There is no user-provided Jam recording or debugging report. |
| Jotform | Yes | Out of scope | The cockpit has no form-management requirement. |
| Linear | Yes | Out of scope | No user instruction to mirror issues into Linear. |
| Neon | Yes | Out of scope | The cockpit uses its provisioned project database; no external Neon database is in scope. |
| Playwright | Yes | Available, not invoked in this review | The web project’s existing browser validation is sufficient; no external browser automation service is needed. |
| PopHIVE | Yes | Out of scope | Public-health data has no relation to GitHub/Jules maintenance. |
| Vercel | Yes | Out of scope | The cockpit is hosted on its current platform; no external deployment is requested. |
| Webflow | Yes | Out of scope | No Webflow site is part of this project. |
| Wix | Yes | Out of scope | No Wix site is part of this project. |

## Safety boundary

The audit does not authorize account changes, connector creation, connector deletion, secret retrieval, or cross-service synchronization. It also does not turn any enabled connector into a background agent. Any future use of an out-of-scope connector requires a concrete user objective, review of that service’s capabilities and authorization model, and a recorded implementation decision.

## Next verification

After the daily task is narrowed to GitHub-only, verify the schedule remains active at 09:30 Asia/Kolkata and preserves the instruction to check the retained 09:00 Jules maintenance window. The two direct Jules attribution items remain open until the user completes Google/Jules authentication and a native scheduler-history record can be read.

## Post-review cockpit boundary verification

The recurring daily schedule was re-read after narrowing and is **active**, keeps its `09:30` Asia/Kolkata cadence, and exposes only the GitHub connector. The cockpit code and production build were revalidated after that configuration change: all **11 tests across 7 files** passed, including the protected-caller, authenticated portfolio, agent-authentication, and live-register presentation coverage. The production build completed successfully.

The managed preview continues to show the private GitHub cockpit and its current live-register indicator. This review did not add any browser-side credential path or connector write; GitHub portfolio reads and Agent Studio operations remain behind the existing authenticated, server-side procedures. The one browser log line reporting a missing session cookie is from an unauthenticated check and confirms that no anonymous credential fallback was introduced.
